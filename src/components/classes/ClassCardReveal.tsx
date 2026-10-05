"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const COLUMN_DELAY_MS = 190;

type ClassCardRevealProps = {
  index: number;
  columns?: number;
  children: ReactNode;
};

export default function ClassCardReveal({ index, columns = 3, children }: ClassCardRevealProps) {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>(0.16, "0px 0px -70px 0px");
  const columnIndex = index % columns;

  return (
    <div
      ref={ref}
      className={isRevealed ? "class-card-reveal class-card-reveal-visible" : "class-card-reveal"}
      style={{ transitionDelay: isRevealed ? `${columnIndex * COLUMN_DELAY_MS}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}