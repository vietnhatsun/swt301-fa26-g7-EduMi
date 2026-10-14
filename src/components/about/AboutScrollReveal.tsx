"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface AboutScrollRevealProps {
  children: ReactNode;
  delay?: number; // Delay in ms (default: 0)
  duration?: number; // Duration in ms (default: 850)
  yOffset?: number; // Distance in px (default: 44)
  className?: string;
  threshold?: number; // Intersection threshold (default: 0.08)
  rootMargin?: string; // Intersection root margin (default: "0px 0px -60px 0px")
}

/**
 * AboutScrollReveal: Bulletproof, GPU-accelerated Fade-in on Scroll.
 * Guaranteed to run across all browsers and OS environments with smooth
 * 850ms Quintic ease-out cubic-bezier(0.16, 1, 0.3, 1).
 */
export default function AboutScrollReveal({
  children,
  delay = 0,
  duration = 850,
  yOffset = 44,
  className = "",
  threshold = 0.08,
  rootMargin = "0px 0px -60px 0px",
}: AboutScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fast check: If element is already in the upper viewport upon initial mount (e.g. Hero section)
    const rect = el.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    if (rect.top < windowHeight * 0.75 && rect.bottom > 0) {
      // Smooth entrance reveal on initial mount
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, 50 + delay);
      return () => clearTimeout(timer);
    }

    // For all sections below viewport: trigger smooth reveal as user scrolls down
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay]);

  return (
    <div
      ref={ref}
      className={`transform-gpu transition-[opacity,transform] ${className}`}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? "translate3d(0, 0, 0)"
          : `translate3d(0, ${yOffset}px, 0)`,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Butter-smooth Quintic ease-out
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
