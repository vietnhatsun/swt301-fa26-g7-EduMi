"use client";

import React from "react";

export default function AboutBottomMarquee() {
  const marqueeItems = [
    "EDUMI",
    "HỌC TẬP THÔNG MINH",
    "KIẾN TẠO TƯƠNG LAI",
    "BỨT PHÁ ĐIỂM SỐ",
    "GIA SƯ CAPY AI 24/7",
    "KHO ĐỀ THI CHUẨN MA TRẬN",
    "CHINH PHỤC ƯỚC MƠ",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-transparent pt-10 pb-16">
      {/* ── Full-Width Edge-to-Edge Moss Green Marquee Bar (Matching User Reference) ── */}
      <div className="relative w-full py-5 sm:py-6 bg-[#59743b] border-y-2 border-[#47602d] shadow-lg flex items-center overflow-hidden">
        {/* Soft edge gradient fades for seamless entry and exit */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#59743b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#59743b] to-transparent z-10 pointer-events-none" />

        {/* ── Continuous Running Marquee Track (Right to Left) ── */}
        <div className="relative w-full overflow-hidden flex select-none pointer-events-none">
          {/* Track 1 */}
          <div className="flex shrink-0 items-center gap-6 sm:gap-10 animate-ticker pr-6 sm:pr-10 will-change-transform">
            {marqueeItems.map((item, idx) => (
              <div key={`m1-${idx}`} className="flex items-center gap-6 sm:gap-10">
                <span className="text-white font-black text-lg sm:text-xl md:text-2xl tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-mono">
                  {item}
                </span>
                <span className="text-white/80 text-xl sm:text-2xl font-black">
                  •
                </span>
              </div>
            ))}
          </div>

          {/* Track 2 (Seamless loop duplicate) */}
          <div
            className="flex shrink-0 items-center gap-6 sm:gap-10 animate-ticker pr-6 sm:pr-10 will-change-transform"
            aria-hidden="true"
          >
            {marqueeItems.map((item, idx) => (
              <div key={`m2-${idx}`} className="flex items-center gap-6 sm:gap-10">
                <span className="text-white font-black text-lg sm:text-xl md:text-2xl tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-mono">
                  {item}
                </span>
                <span className="text-white/80 text-xl sm:text-2xl font-black">
                  •
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GPU Hardware-Accelerated 60FPS CSS Animation */}
      <style jsx>{`
        @keyframes tickerScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        .animate-ticker {
          animation: tickerScroll 22s linear infinite;
        }
      `}</style>
    </section>
  );
}
