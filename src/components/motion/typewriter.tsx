"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Types each word, pauses, deletes it, then moves to the next.
export function Typewriter({ words, className }: { words: string[]; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const word = words[wordIndex % words.length] ?? "";

  useEffect(() => {
    setWordIndex(0);
    setLength(0);
    setDeleting(false);
  }, [words]);

  useEffect(() => {
    if (reduceMotion) return;
    const done = !deleting && length === word.length;
    const empty = deleting && length === 0;
    const delay = done ? 1600 : empty ? 260 : deleting ? 45 : 110;

    const timer = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
      } else setLength((current) => current + (deleting ? -1 : 1));
    }, delay);

    return () => clearTimeout(timer);
  }, [length, deleting, word, words.length, reduceMotion]);

  return <span className={`caret ${className ?? ""}`}>{reduceMotion ? words[0] : word.slice(0, length)}</span>;
}
