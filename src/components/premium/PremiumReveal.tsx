"use client";

import React, { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface PremiumRevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

export default function PremiumReveal({
  children,
  delayMs = 0,
  className = "",
}: PremiumRevealProps) {
  // Triggers when 12% is scrolled into view, with bottom margin -60px for graceful entrance
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>(0.12, "0px 0px -60px 0px");

  return (
    <div
      ref={ref}
      className={`transform-gpu transition-[opacity,transform] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] ${
        isRevealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      } ${className}`}
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
