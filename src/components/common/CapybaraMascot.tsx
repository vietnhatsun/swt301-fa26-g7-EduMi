"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface CapybaraMascotProps {
  isPasswordFocused?: boolean;
}

export default function CapybaraMascot({ isPasswordFocused = false }: CapybaraMascotProps) {
  const leftEyeRef = useRef<SVGEllipseElement>(null);
  const rightEyeRef = useRef<SVGEllipseElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);

  // Eye-tracking mouse move listener (Only the 2 pupils move inside the eyes)
  useEffect(() => {
    if (isPasswordFocused) return;

    const handleMouseMove = (e: MouseEvent) => {
      const updateEye = (
        eyeEl: SVGEllipseElement | null,
        pupilEl: SVGGElement | null
      ) => {
        if (!eyeEl || !pupilEl) return;

        const rect = eyeEl.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;

        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.hypot(deltaX, deltaY);

        // Maximum displacement limit for pupil inside eye socket (7.5px in SVG 411x280 coordinate space)
        const maxDist = 7.5;
        const clampedDist = Math.min(distance / 25, maxDist);

        const pupilX = Math.cos(angle) * clampedDist;
        const pupilY = Math.sin(angle) * clampedDist;

        pupilEl.style.transform = `translate3d(${pupilX.toFixed(2)}px, ${pupilY.toFixed(2)}px, 0)`;
      };

      requestAnimationFrame(() => {
        updateEye(leftEyeRef.current, leftPupilRef.current);
        updateEye(rightEyeRef.current, rightPupilRef.current);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPasswordFocused]);

  return (
    <div
      className={`relative select-none pointer-events-none transition-all duration-300 ease-out ${
        isPasswordFocused
          ? "translate-y-[72px] sm:translate-y-[82px] opacity-85 scale-95" // Ducks down behind the card to hide its eyes
          : "translate-y-0 opacity-100 scale-100"
      }`}
    >
      <div className="relative w-36 sm:w-44 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
        
        {/* Layer 1: Eye Sockets & Interactive Pupils (Behind the hollowed-out glasses) */}
        <svg
          viewBox="0 0 411 280"
          className="absolute inset-0 w-full h-full z-0 overflow-visible"
        >
          {/* Eye whites */}
          <ellipse
            ref={leftEyeRef}
            cx="126"
            cy="131"
            rx="35"
            ry="34"
            fill="#ffffff"
          />
          <ellipse
            ref={rightEyeRef}
            cx="284"
            cy="131"
            rx="35"
            ry="34"
            fill="#ffffff"
          />

          {/* Interactive Pupils (Move following mouse) */}
          <g>
            {/* Left Pupil */}
            <g ref={leftPupilRef} className="transition-transform duration-75 ease-out">
              <ellipse cx="126" cy="131" rx="20" ry="21" fill="#2d1a10" />
              {/* Glossy sparkle highlights */}
              <circle cx="121" cy="124" r="6.5" fill="#ffffff" />
              <circle cx="132" cy="137" r="3.2" fill="#ffffff" opacity="0.85" />
            </g>

            {/* Right Pupil */}
            <g ref={rightPupilRef} className="transition-transform duration-75 ease-out">
              <ellipse cx="284" cy="131" rx="20" ry="21" fill="#2d1a10" />
              {/* Glossy sparkle highlights */}
              <circle cx="279" cy="124" r="6.5" fill="#ffffff" />
              <circle cx="290" cy="137" r="3.2" fill="#ffffff" opacity="0.85" />
            </g>
          </g>
        </svg>

        {/* Layer 2: Capybara Body (Hollowed-out Eyes) - COMPLETELY STILL ON TOP */}
        <Image
          src="/capybara-hollow.png"
          alt="EduMi Capybara Mascot"
          width={411}
          height={280}
          priority
          className="relative z-10 w-full h-auto object-contain pointer-events-none"
        />

      </div>
    </div>
  );
}
