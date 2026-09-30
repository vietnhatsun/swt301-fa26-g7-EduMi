"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">
      {/* ── Background Hero Image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-capybara-study.png"
          alt="Capy studying by the window - EduMi Platform"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] lg:object-center select-none"
        />
      </div>

      {/* ── Hero Foreground Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-0">
        <div className="max-w-xl lg:max-w-2xl flex flex-col items-start text-left select-none -translate-y-3 sm:-translate-y-5 lg:-translate-y-7">
          {/* Top Tagline with Rainbow Arc Curve */}
          <div className="mb-2 sm:mb-3 select-none">
            <svg
              viewBox="0 0 280 46"
              className="w-[220px] sm:w-[260px] lg:w-[290px] h-auto overflow-visible"
              aria-label="Học thông minh hơn"
            >
              <defs>
                <path
                  id="rainbow-text-arc"
                  d="M 6 34 Q 118 10 230 28"
                  fill="none"
                />
              </defs>
              <text
                className="font-black italic text-[#1e2e4a] tracking-wide"
                style={{
                  fontSize: "20.5px",
                  fontWeight: 800,
                  fontStyle: "italic",
                  fill: "#1e2e4a",
                }}
              >
                <textPath
                  href="#rainbow-text-arc"
                  xlinkHref="#rainbow-text-arc"
                  startOffset="0%"
                >
                  Học thông minh hơn
                </textPath>
              </text>
              {/* 3 yellow accent sparks at the end of the arc */}
              <g
                stroke="#fbbf24"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              >
                <line x1="237" y1="21" x2="230" y2="15" />
                <line x1="243" y1="18" x2="243" y2="9" />
                <line x1="249" y1="21" x2="256" y2="16" />
              </g>
            </svg>
          </div>

          {/* Main Headline */}
          <h1 className="mb-4 sm:mb-5 tracking-tight select-none">
            {/* Line 1: Nền tảng + Brand Capsule Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1 sm:mb-1.5">
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-[#1c2d4a] leading-none">
                Nền tảng
              </span>
              <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase bg-white/90 text-emerald-700 border border-emerald-300/80 shadow-xs backdrop-blur-xs">
                EDUMI PLATFORM
              </span>
            </div>

            {/* Line 2: Học toàn diện (3 từ cô đọng, màu đồng bộ) */}
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-black leading-[1.08] text-[#1c2d4a]">
              Học toàn diện
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-[17px] text-slate-600 font-medium tracking-normal mb-8 sm:mb-9 flex flex-wrap items-center gap-x-2">
            <span>Học tập dễ dàng</span>
            <span className="text-slate-400 font-bold">·</span>
            <span>Kiến thức rộng mở</span>
            <span className="text-slate-400 font-bold">·</span>
            <span>Phát triển bản thân</span>
          </p>

          {/* CTA Button */}
          <Link
            href="/about"
            className="group inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg shadow-lg shadow-emerald-600/35 hover:shadow-xl hover:shadow-emerald-600/45 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Khám phá EduMi</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
