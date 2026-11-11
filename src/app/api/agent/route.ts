import { runTool, systemPrompt, tools, type AgentLink } from "@/lib/agent/knowledge";

// Streams the portfolio agent's answer as newline-delimited JSON events:
//   {"t":"skill","name":...}      a tool call started
//   {"t":"skill_done","name":...} it finished
//   {"t":"text","v":...}          a piece of the answer
//   {"t":"links","items":[...]}   links to show under the answer
//   {"t":"done"} / {"t":"error"}
// The DeepSeek key stays on the server (DEEPSEEK_API_KEY).

export const runtime = "nodejs";
export const maxDuration = 60;

const API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-flash";
const MAX_ROUNDS = 3;
const MAX_HISTORY = 12;
const MAX_USER_CHARS = 500;
const MAX_ASSISTANT_CHARS = 2000;

// Best-effort limit per server instance. Serverless instances do not share
// memory, so this slows down abuse rather than enforcing an exact quota; the
// prepaid DeepSeek balance is the hard cap on spend.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };

type ApiMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string; reasoning_content?: string; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

// Accept only plain user/assistant text from the browser, trimmed to size.
function cleanHistory(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const messages = input
    .slice(-MAX_HISTORY)
    .filter(
      (item): item is ChatMessage =>
        typeof item === "object" &&
        item !== null &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0
    )
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, item.role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS)
    }));
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") return null;
  while (messages.length > 0 && messages[0].role !== "user") messages.shift();
  return messages;
}

type RoundResult = {
  content: string;
  reasoning: string;
  toolCalls: ToolCall[];
  finishReason: string | null;
};

// One streamed completion. Text deltas are forwarded as they arrive;
// reasoning and tool-call fragments are collected for the next round.
async function streamRound(
  messages: ApiMessage[],
  send: (event: object) => void,
  signal: AbortSignal
): Promise<RoundResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools,
      stream: true,
      reasoning_effort: "low",
      max_tokens: 1200
    }),
    signal
  });

  if (!response.ok || !response.body) {
    throw new Error(`DeepSeek ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const result: RoundResult = { content: "", reasoning: "", toolCalls: [], finishReason: null };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") continue;

      let chunk: {
        choices?: Array<{
          delta?: {
            content?: string | null;
            reasoning_content?: string | null;
            tool_calls?: Array<{ index: number; id?: string; function?: { name?: string; arguments?: string } }>;
          };
          finish_reason?: string | null;
        }>;
      };
      try {
        chunk = JSON.parse(data);
      } catch {
        continue;
      }

      const choice = chunk.choices?.[0];
      if (!choice) continue;
      const delta = choice.delta ?? {};

      if (delta.reasoning_content) result.reasoning += delta.reasoning_content;
      if (delta.content) {
        result.content += delta.content;
        send({ t: "text", v: delta.content });
      }
      for (const part of delta.tool_calls ?? []) {
        const call = (result.toolCalls[part.index] ??= {
          id: "",
          type: "function",
          function: { name: "", arguments: "" }
        });
        if (part.id) call.id = part.id;
        if (part.function?.name) call.function.name += part.function.name;
        if (part.function?.arguments) call.function.arguments += part.function.arguments;
      }
      if (choice.finish_reason) result.finishReason = choice.finish_reason;
    }
  }

  result.toolCalls = result.toolCalls.filter(Boolean);
  return result;
}

export async function POST(request: Request) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { messages?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const history = cleanHistory(body.messages);
  if (!history) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const locale = body.locale === "en" ? "en" : "zh";

  const encoder = new TextEncoder();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50_000);

  const stream = new ReadableStream({
    async start(streamController) {
      const send = (event: object) => streamController.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      const messages: ApiMessage[] = [{ role: "system", content: systemPrompt }, ...history];
      const links: AgentLink[] = [];

      try {
        for (let round = 0; round < MAX_ROUNDS; round++) {
          const result = await streamRound(messages, send, controller.signal);
          if (result.finishReason !== "tool_calls" || result.toolCalls.length === 0) break;

          // DeepSeek requires the reasoning to be sent back during a tool loop.
          messages.push({
            role: "assistant",
            content: result.content,
            reasoning_content: result.reasoning,
            tool_calls: result.toolCalls
          });

          for (const call of result.toolCalls) {
            send({ t: "skill", name: call.function.name });
            const outcome = runTool(call.function.name, call.function.arguments, locale);
            messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(outcome.result) });
            for (const link of outcome.links) {
              if (!links.some((existing) => existing.href === link.href)) links.push(link);
            }
            send({ t: "skill_done", name: call.function.name });
          }
        }

        if (links.length > 0) send({ t: "links", items: links.slice(0, 3) });
        send({ t: "done" });
      } catch (error) {
        console.error("[agent]", error instanceof Error ? error.message : error);
        send({ t: "error" });
      } finally {
        clearTimeout(timeout);
        streamController.close();
      }
    },
    cancel() {
      controller.abort();
      clearTimeout(timeout);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no"
    }
  });
}
