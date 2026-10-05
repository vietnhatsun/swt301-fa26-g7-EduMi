"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED_MS = 10;
const START_DELAY_MS = 260;

type TypewriterDescriptionProps = {
  text: string;
};

export default function TypewriterDescription({ text }: TypewriterDescriptionProps) {
  const [visibleLength, setVisibleLength] = useState(0);
  const visibleText = text.slice(0, visibleLength);
  const isDone = visibleLength >= text.length;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let typingTimer: number | undefined;

    const startTimer = window.setTimeout(
      () => {
        if (prefersReducedMotion) {
          setVisibleLength(text.length);
          return;
        }

        typingTimer = window.setInterval(() => {
          setVisibleLength((current) => {
            if (current >= text.length) {
              window.clearInterval(typingTimer);
              return current;
            }

            return current + 1;
          });
        }, TYPE_SPEED_MS);
      },
      prefersReducedMotion ? 0 : START_DELAY_MS,
    );

    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer) window.clearInterval(typingTimer);
    };
  }, [text]);

  return (
    <p
      aria-label={text}
      className="mt-4 min-h-[74px] max-w-[540px] text-[17px] font-semibold leading-[1.45] text-[#18304b]"
    >
      <span aria-hidden="true">
        {visibleText}
        <span className={isDone ? "class-typewriter-caret class-typewriter-caret-done" : "class-typewriter-caret"} />
      </span>
    </p>
  );
}