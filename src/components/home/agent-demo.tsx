"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { agentFallback, agentReplies, type AgentReply } from "@/data/profile";
import type { LocalizedText } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const copy = {
  title: { zh: "Yibei Agent", en: "Yibei Agent" },
  badge: { zh: "演示", en: "Demo" },
  greeting: {
    zh: "你好，我是这个作品集的助手。想了解 Yibei 的什么？",
    en: "Hi, I'm this portfolio's assistant. What would you like to know about Yibei?"
  },
  placeholder: { zh: "问点什么，比如：在腾讯做了什么？", en: "Ask something, like: what did you do at Tencent?" },
  calling: { zh: "调用", en: "Calling" },
  called: { zh: "已调用", en: "Called" },
  send: { zh: "发送", en: "Send" }
};

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "skill"; skill: string; done: boolean }
  | { id: number; role: "agent"; text: LocalizedText; link?: AgentReply["link"]; streamed: boolean };

function findReply(question: string) {
  const lower = question.toLowerCase();
  return agentReplies.find((reply) => reply.keywords.some((keyword) => lower.includes(keyword.toLowerCase())));
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Scripted chat that mimics an agent calling a skill before answering.
// Nothing is sent anywhere: answers come from src/data/profile.ts.
export function AgentDemo() {
  const { t, locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [streamLength, setStreamLength] = useState<Record<number, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const askedRef = useRef(new Set<string>());

  useEffect(() => {
    const box = scrollRef.current;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, streamLength, reduceMotion]);

  const nextId = () => ++idRef.current;

  async function ask(question: string, preset?: AgentReply) {
    const text = question.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput("");

    const reply = preset ?? findReply(text);
    if (reply) askedRef.current.add(reply.key);
    setMessages((current) => [...current, { id: nextId(), role: "user", text }]);

    if (reply) {
      const skillId = nextId();
      await wait(reduceMotion ? 0 : 280);
      setMessages((current) => [...current, { id: skillId, role: "skill", skill: reply.skill, done: false }]);
      await wait(reduceMotion ? 0 : 900);
      setMessages((current) => current.map((m) => (m.id === skillId && m.role === "skill" ? { ...m, done: true } : m)));
    }

    await wait(reduceMotion ? 0 : 240);
    const answer = reply?.answer ?? agentFallback;
    const answerId = nextId();
    setMessages((current) => [...current, { id: answerId, role: "agent", text: answer, link: reply?.link, streamed: false }]);

    const full = t(answer);
    if (!reduceMotion) {
      // Reveal a few characters per frame, like a streamed model response.
      for (let i = 0; i <= full.length; i += 2) {
        setStreamLength((current) => ({ ...current, [answerId]: i }));
        await wait(16);
      }
    }
    setStreamLength((current) => ({ ...current, [answerId]: Number.POSITIVE_INFINITY }));
    setMessages((current) => current.map((m) => (m.id === answerId && m.role === "agent" ? { ...m, streamed: true } : m)));
    setBusy(false);
  }

  const suggestions = agentReplies.filter((reply) => !askedRef.current.has(reply.key));

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
                  <p className="max-w-[85%] rounded-[14px] rounded-br-[4px] bg-white px-4 py-2.5 text-sm leading-6 text-black">
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
                  {t(message.text).slice(0, streamLength[message.id] ?? 0)}
                  {!message.streamed && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-white/70" />}
                  {message.streamed && message.link && (
                    <Link
                      href={message.link.href}
                      className="focus-ring mt-3 flex w-fit items-center gap-1.5 rounded-full border border-white/14 px-3 py-1 text-xs text-white/80 transition-colors hover:border-white/30 hover:text-white"
                    >
                      {t(message.link.label)}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </AgentBubble>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
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

function AgentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="max-w-[92%] rounded-[14px] rounded-bl-[4px] border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm leading-6 text-white/82">
        {children}
      </div>
    </div>
  );
}
