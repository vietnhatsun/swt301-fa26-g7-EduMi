"use client";

import React, { useState, useEffect, useRef } from "react";

export default function InteractivePeekingCapy() {
  const capyRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [leftEyeOffset, setLeftEyeOffset] = useState({ x: 0, y: 0 });
  const [rightEyeOffset, setRightEyeOffset] = useState({ x: 0, y: 0 });
  const [speechText, setSpeechText] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!capyRef.current) return;
      const rect = capyRef.current.getBoundingClientRect();

      // Estimated left and right eye positions in screen coords
      const leftEyeScreenX = rect.left + rect.width * 0.33;
      const leftEyeScreenY = rect.top + rect.height * 0.52;

      const rightEyeScreenX = rect.left + rect.width * 0.67;
      const rightEyeScreenY = rect.top + rect.height * 0.52;

      const maxPupilMove = 8;

      // Left Eye
      const dxL = e.clientX - leftEyeScreenX;
      const dyL = e.clientY - leftEyeScreenY;
      const distL = Math.sqrt(dxL * dxL + dyL * dyL);
      const angleL = Math.atan2(dyL, dxL);
      const radiusL = Math.min(distL / 25, maxPupilMove);

      // Right Eye
      const dxR = e.clientX - rightEyeScreenX;
      const dyR = e.clientY - rightEyeScreenY;
      const distR = Math.sqrt(dxR * dxR + dyR * dyR);
      const angleR = Math.atan2(dyR, dxR);
      const radiusR = Math.min(distR / 25, maxPupilMove);

      setLeftEyeOffset({
        x: Math.cos(angleL) * radiusL,
        y: Math.sin(angleL) * radiusL,
      });

      setRightEyeOffset({
        x: Math.cos(angleR) * radiusR,
        y: Math.sin(angleR) * radiusR,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const cheers = [
      "Học cùng Capy nhé! ✨",
      "Chào bạn nha! Nháy mắt nè 😉",
      "Cố lên, bạn làm được mà! 🎓",
      "EduMi luôn đồng hành cùng bạn! 💖",
    ];
    setSpeechText(cheers[Math.floor(Math.random() * cheers.length)]);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSpeechText(null);
  };

  return (
    <div
      ref={capyRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center select-none cursor-pointer group"
    >
      {/* ── Playful Speech Bubble on Hover ── */}
      <div
        className={`absolute -top-14 transition-all duration-300 transform pointer-events-none z-20 ${
          isHovered
            ? "opacity-100 scale-100 -translate-y-1"
            : "opacity-0 scale-90 translate-y-2"
        }`}
      >
        <div className="relative px-4 py-2 bg-white text-slate-900 font-black text-xs sm:text-sm rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
          <span>{speechText || "Chào bạn nha! 😉"}</span>
          {/* Bubble beak */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-slate-900 transform rotate-45" />
        </div>
      </div>

      {/* ── Peeking Capybara SVG ── */}
      <div className="w-48 sm:w-56 md:w-64 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 320 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible drop-shadow-xl"
        >
          <defs>
            {/* Fur Gradient */}
            <linearGradient id="capyFur" x1="160" y1="20" x2="160" y2="230" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d99965" />
              <stop offset="60%" stopColor="#c58450" />
              <stop offset="100%" stopColor="#b06f3c" />
            </linearGradient>

            {/* Snout Gradient */}
            <linearGradient id="capySnout" x1="160" y1="110" x2="160" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9a623c" />
              <stop offset="100%" stopColor="#804e2c" />
            </linearGradient>

            {/* Eye Iris Gradient */}
            <radialGradient id="eyeIris" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7a3f1d" />
              <stop offset="70%" stopColor="#431e0a" />
              <stop offset="100%" stopColor="#200d04" />
            </radialGradient>

            {/* Glasses Lens Glass Glare */}
            <linearGradient id="glassGlare" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* ── Ears ── */}
          {/* Left Ear */}
          <path
            d="M 50 75 C 35 45, 65 20, 92 40 C 95 65, 75 85, 50 75 Z"
            fill="#8e532b"
            stroke="#26170d"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M 58 65 C 48 48, 68 32, 82 45 C 83 58, 70 70, 58 65 Z"
            fill="#5a3116"
          />

          {/* Right Ear */}
          <path
            d="M 270 75 C 285 45, 255 20, 228 40 C 225 65, 245 85, 270 75 Z"
            fill="#8e532b"
            stroke="#26170d"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M 262 65 C 272 48, 252 32, 238 45 C 237 58, 250 70, 262 65 Z"
            fill="#5a3116"
          />

          {/* ── Head Shape ── */}
          <path
            d="M 75 220 
               C 45 190, 35 120, 60 75 
               C 80 40, 115 35, 135 30 
               C 145 20, 155 18, 160 25 
               C 165 18, 175 20, 185 30 
               C 205 35, 240 40, 260 75 
               C 285 120, 275 190, 245 220 
               Z"
            fill="url(#capyFur)"
            stroke="#26170d"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Head Top Tufts */}
          <path
            d="M 142 30 C 148 16, 158 16, 160 26 C 164 14, 176 18, 178 30"
            stroke="#26170d"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Eyebrows */}
          <path
            d="M 85 82 Q 100 74 115 82"
            stroke="#3a2012"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 205 82 Q 220 74 235 82"
            stroke="#3a2012"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* ── Eyes Sockets (Background) ── */}
          {/* Left Eye Socket */}
          <ellipse
            cx="105"
            cy="118"
            rx="24"
            ry="24"
            fill="#ffffff"
            stroke="#26170d"
            strokeWidth="3.5"
          />
          {/* Right Eye Socket */}
          <ellipse
            cx="215"
            cy="118"
            rx="24"
            ry="24"
            fill="#ffffff"
            stroke="#26170d"
            strokeWidth="3.5"
          />

          {/* ── Left Eye (Dynamic or Winking on Hover) ── */}
          {isHovered ? (
            /* Winking Left Eye: Cute Arc with Eyelashes */
            <g>
              {/* White cover to hide inner pupil */}
              <ellipse cx="105" cy="118" rx="23" ry="23" fill="url(#capyFur)" />
              {/* Joyful Wink Arc */}
              <path
                d="M 86 118 Q 105 136 124 118"
                stroke="#26170d"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {/* Cute eyelash flicks */}
              <path
                d="M 86 118 L 80 114"
                stroke="#26170d"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M 124 118 L 130 114"
                stroke="#26170d"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            /* Normal Left Eye Tracking Mouse */
            <g transform={`translate(${leftEyeOffset.x}, ${leftEyeOffset.y})`}>
              {/* Iris */}
              <circle cx="105" cy="118" r="16" fill="url(#eyeIris)" />
              {/* Pupil */}
              <circle cx="105" cy="118" r="10" fill="#120703" />
              {/* Big Glossy Sparkle Highlight */}
              <circle cx="99" cy="112" r="5" fill="#ffffff" />
              {/* Small Secondary Sparkle */}
              <circle cx="111" cy="123" r="2.5" fill="#ffffff" />
            </g>
          )}

          {/* ── Right Eye (Always Open, Tracking Mouse) ── */}
          <g transform={`translate(${rightEyeOffset.x}, ${rightEyeOffset.y})`}>
            {/* Iris */}
            <circle cx="215" cy="118" r="16" fill="url(#eyeIris)" />
            {/* Pupil */}
            <circle cx="215" cy="118" r="10" fill="#120703" />
            {/* Big Glossy Sparkle Highlight */}
            <circle cx="209" cy="112" r="5" fill="#ffffff" />
            {/* Small Secondary Sparkle */}
            <circle cx="221" cy="123" r="2.5" fill="#ffffff" />
          </g>

          {/* ── Snout & Muzzle ── */}
          <path
            d="M 112 145 
               C 110 118, 210 118, 208 145 
               C 208 185, 200 215, 160 215 
               C 120 215, 112 185, 112 145 Z"
            fill="url(#capySnout)"
            stroke="#26170d"
            strokeWidth="4"
          />

          {/* Nostrils */}
          <ellipse cx="140" cy="155" rx="3" ry="5" transform="rotate(-15 140 155)" fill="#331c0e" />
          <ellipse cx="180" cy="155" rx="3" ry="5" transform="rotate(15 180 155)" fill="#331c0e" />

          {/* Smiling Mouth */}
          <path
            d="M 144 185 Q 160 196 160 183 Q 160 196 176 185"
            stroke="#26170d"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* ── Pink Blush Cheeks ── */}
          <ellipse cx="68" cy="155" rx="16" ry="10" fill="#f87171" fillOpacity="0.6" />
          <line x1="62" y1="151" x2="65" y2="159" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="71" y1="151" x2="74" y2="159" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />

          <ellipse cx="252" cy="155" rx="16" ry="10" fill="#f87171" fillOpacity="0.6" />
          <line x1="246" y1="151" x2="249" y2="159" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="255" y1="151" x2="258" y2="159" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />

          {/* ── Glasses (Specs) ── */}
          {/* Left Lens Frame */}
          <circle
            cx="105"
            cy="118"
            r="28"
            fill="url(#glassGlare)"
            stroke="#1c1917"
            strokeWidth="5"
          />
          {/* Right Lens Frame */}
          <circle
            cx="215"
            cy="118"
            r="28"
            fill="url(#glassGlare)"
            stroke="#1c1917"
            strokeWidth="5"
          />
          {/* Glasses Bridge */}
          <path
            d="M 133 114 Q 160 102 187 114"
            stroke="#1c1917"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Temple Arm */}
          <path
            d="M 77 118 L 48 116"
            stroke="#1c1917"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Right Temple Arm */}
          <path
            d="M 243 118 L 272 116"
            stroke="#1c1917"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* ── Paws (Peeking Over Edge) ── */}
          {/* Left Paw */}
          <g>
            <path
              d="M 35 228 
                 C 32 188, 88 188, 92 228 Z"
              fill="#9a623c"
              stroke="#26170d"
              strokeWidth="4.5"
            />
            {/* Claws/Pads lines */}
            <path d="M 52 206 L 52 228" stroke="#26170d" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 72 206 L 72 228" stroke="#26170d" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Right Paw */}
          <g>
            <path
              d="M 228 228 
                 C 232 188, 288 188, 285 228 Z"
              fill="#9a623c"
              stroke="#26170d"
              strokeWidth="4.5"
            />
            {/* Claws/Pads lines */}
            <path d="M 248 206 L 248 228" stroke="#26170d" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 268 206 L 268 228" stroke="#26170d" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}
