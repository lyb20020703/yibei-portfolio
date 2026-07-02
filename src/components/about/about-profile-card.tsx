"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type AboutProfileCardProps = {
  src: string;
  alt: string;
  viewLabel: string;
};

export function AboutProfileCard({ src, alt, viewLabel }: AboutProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.99 }}
        className="focus-ring group relative mt-8 block w-full max-w-3xl cursor-pointer overflow-hidden rounded-[8px] border border-white/12 bg-white/[0.04] text-left shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
        aria-label={viewLabel}
      >
        <Image
          src={src}
          alt={alt}
          width={1800}
          height={900}
          sizes="(min-width: 1024px) 55vw, calc(100vw - 32px)"
          className="h-auto w-full object-contain transition duration-500 ease-out group-hover:scale-[1.015] group-hover:brightness-[0.82]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 justify-center bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-12 text-xs tracking-[0.12em] text-white/80 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {viewLabel}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4 backdrop-blur-md sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative flex max-h-full w-full max-w-[112rem] items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                width={1800}
                height={900}
                sizes="96vw"
                className="h-auto max-h-[90vh] w-full max-w-[96vw] rounded-[8px] object-contain shadow-[0_36px_140px_rgba(0,0,0,0.72)]"
                priority
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="focus-ring absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/18 bg-black/55 text-2xl font-light leading-none text-white/84 backdrop-blur-md transition hover:border-white/36 hover:bg-black/75 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
