"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { agentFallback, agentReplies, type AgentReply } from "@/data/profile";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const copy = {
  title: { zh: "Yibei Agent", en: "Yibei Agent" },
  badge: { zh: "AI", en: "AI" },
  greeting: {
    zh: "你好，我是 Yibei 的 AI 分身，会根据她的经历和作品来回答。想了解什么？",
    en: "Hi, I'm Yibei's AI twin. I answer from her experience and work. What would you like to know?"
  },
  placeholder: { zh: "问点什么，比如：在腾讯做了什么？", en: "Ask something, like: what did you do at Tencent?" },
  calling: { zh: "调用", en: "Calling" },
  called: { zh: "已调用", en: "Called" },
  send: { zh: "发送", en: "Send" }
};

type AgentLink = { href: string; label: string };

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "skill"; skill: string; done: boolean }
  | { id: number; role: "agent"; text: string; links: AgentLink[]; streamed: boolean };

type HistoryItem = { role: "user" | "assistant"; content: string };

const MAX_HISTORY = 12;

function findReply(question: string) {
  const lower = question.toLowerCase();
  return agentReplies.find((reply) => reply.keywords.some((keyword) => lower.includes(keyword.toLowerCase())));
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Chat with the portfolio agent. Answers come from /api/agent (DeepSeek,
// grounded in the site's data). If that call fails, the scripted answers in
// src/data/profile.ts take over so the widget never goes dead.
export function AgentDemo() {
  const { t, locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const historyRef = useRef<HistoryItem[]>([]);
  const askedRef = useRef(new Set<string>());
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const box = scrollRef.current;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, reduceMotion]);

  const nextId = () => ++idRef.current;

  const update = (id: number, change: (message: Message) => Message) =>
    setMessages((current) => current.map((message) => (message.id === id ? change(message) : message)));

  const appendText = (id: number, piece: string) =>
    update(id, (message) => (message.role === "agent" ? { ...message, text: message.text + piece } : message));

  // Returns the answer text, or null if the live agent could not be reached.
  async function askLive(question: string): Promise<string | null> {
    const controller = new AbortController();
    abortRef.current = controller;
    const history = [...historyRef.current, { role: "user" as const, content: question }].slice(-MAX_HISTORY);

    let response: Response;
    try {
      response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, locale }),
        signal: controller.signal
      });
    } catch {
      return null;
    }
    if (!response.ok || !response.body) return null;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answerId: number | null = null;
    let answer = "";
    const skillIds = new Map<string, number>();

    const ensureAnswer = () => {
      if (answerId === null) {
        const id = nextId();
        answerId = id;
        setMessages((current) => [...current, { id, role: "agent", text: "", links: [], streamed: false }]);
      }
      return answerId;
    };

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: { t: string; v?: string; name?: string; items?: AgentLink[] };
          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }

          if (event.t === "skill" && event.name) {
            const id = nextId();
            skillIds.set(event.name, id);
            setMessages((current) => [...current, { id, role: "skill", skill: event.name!, done: false }]);
          } else if (event.t === "skill_done" && event.name) {
            const id = skillIds.get(event.name);
            // Keep the running state on screen briefly so the call is readable.
            if (id !== undefined) {
              await wait(reduceMotion ? 0 : 450);
              update(id, (message) => (message.role === "skill" ? { ...message, done: true } : message));
            }
          } else if (event.t === "text" && event.v) {
            answer += event.v;
            appendText(ensureAnswer(), event.v);
          } else if (event.t === "links" && event.items) {
            const links = event.items;
            update(ensureAnswer(), (message) => (message.role === "agent" ? { ...message, links } : message));
          } else if (event.t === "error") {
            if (!answer) return null;
          }
        }
      }
    } catch {
      if (!answer) return null;
    }

    if (!answer) return null;
    if (answerId !== null) {
      const id = answerId;
      update(id, (message) => (message.role === "agent" ? { ...message, streamed: true } : message));
    }
    return answer;
  }

  // Offline fallback: pretend skill call plus a scripted answer.
  async function askScripted(question: string, preset?: AgentReply) {
    const reply = preset ?? findReply(question);
    if (reply) {
      const skillId = nextId();
      setMessages((current) => [...current, { id: skillId, role: "skill", skill: reply.skill, done: false }]);
      await wait(reduceMotion ? 0 : 800);
      update(skillId, (message) => (message.role === "skill" ? { ...message, done: true } : message));
    }

    const full = t(reply?.answer ?? agentFallback);
    const links = reply?.link ? [{ href: reply.link.href, label: t(reply.link.label) }] : [];
    const id = nextId();
    setMessages((current) => [...current, { id, role: "agent", text: "", links: [], streamed: false }]);
    if (reduceMotion) {
      update(id, (message) => (message.role === "agent" ? { ...message, text: full } : message));
    } else {
      for (let i = 0; i < full.length; i += 2) {
        appendText(id, full.slice(i, i + 2));
        await wait(16);
      }
    }
    update(id, (message) => (message.role === "agent" ? { ...message, links, streamed: true } : message));
    return full;
  }

  async function ask(question: string, preset?: AgentReply) {
    const text = question.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput("");
    if (preset) askedRef.current.add(preset.key);
    setMessages((current) => [...current, { id: nextId(), role: "user", text }]);

    const answer = (await askLive(text)) ?? (await askScripted(text, preset));
    historyRef.current = [
      ...historyRef.current,
      { role: "user" as const, content: text },
      { role: "assistant" as const, content: answer }
    ].slice(-MAX_HISTORY);
    setBusy(false);
  }

  const suggestions = agentReplies.filter((reply) => !askedRef.current.has(reply.key));
  const waiting = busy && messages[messages.length - 1]?.role === "user";

  return (
    <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035] shadow-card backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-glow/10 blur-3xl" />

      <div className="relative flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora" />
          </span>
          <span className="text-sm font-medium text-white">{t(copy.title)}</span>
        </div>
        <span className="rounded-full border border-white/12 px-2.5 py-0.5 text-[11px] tracking-[0.12em] text-white/50">
          {t(copy.badge)}
        </span>
      </div>

      <div ref={scrollRef} className="relative h-[22rem] space-y-4 overflow-y-auto px-5 py-5 [scrollbar-width:thin]">
        <AgentBubble>{t(copy.greeting)}</AgentBubble>

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout="position"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {message.role === "user" && (
                <div className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-[14px] rounded-br-[4px] bg-white px-4 py-2.5 text-sm leading-6 text-black">
                    {message.text}
                  </p>
                </div>
              )}

              {message.role === "skill" && (
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono",
                      message.done ? "border-white/10 text-white/50" : "border-glow/30 text-glow"
                    )}
                  >
                    {message.done ? (
                      <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                        <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                    )}
                    <span className={cn(!message.done && "skill-shimmer")}>
                      {t(message.done ? copy.called : copy.calling)} {message.skill}
                    </span>
                  </span>
                </div>
              )}

              {message.role === "agent" && (
                <AgentBubble>
                  <span className="whitespace-pre-wrap">{message.text}</span>
                  {!message.streamed && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-white/70" />}
                  {message.streamed && message.links.length > 0 && (
                    <span className="mt-3 flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <AgentLinkChip key={link.href} link={link} />
                      ))}
                    </span>
                  )}
                </AgentBubble>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {waiting && (
          <div className="flex gap-1 px-1" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-white/40"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative border-t border-white/[0.08] px-4 pb-4 pt-3">
        <div className="mb-3 flex min-h-[2rem] flex-wrap gap-2">
          {suggestions.map((reply) => (
            <button
              key={reply.key}
              type="button"
              disabled={busy}
              onClick={() => ask(t(reply.question), reply)}
              className="focus-ring rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/28 hover:text-white disabled:opacity-40"
            >
              {t(reply.question)}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 rounded-full border border-white/12 bg-black/30 py-1 pl-4 pr-1 focus-within:border-white/28"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t(copy.placeholder)}
            disabled={busy}
            maxLength={500}
            lang={locale === "zh" ? "zh-CN" : "en"}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-white outline-none placeholder:text-white/32"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label={t(copy.send)}
            className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-black transition-opacity disabled:opacity-30"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

function AgentLinkChip({ link }: { link: AgentLink }) {
  const className =
    "focus-ring flex w-fit items-center gap-1.5 rounded-full border border-white/14 px-3 py-1 text-xs text-white/80 transition-colors hover:border-white/30 hover:text-white";
  const content = (
    <>
      {link.label}
      <span aria-hidden="true">→</span>
    </>
  );

  return link.href.startsWith("/") ? (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  ) : (
    <a href={link.href} className={className}>
      {content}
    </a>
  );
}

function AgentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="max-w-[92%] rounded-[14px] rounded-bl-[4px] border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm leading-6 text-white/82">
        {children}
      </div>
    </div>
  );
}
