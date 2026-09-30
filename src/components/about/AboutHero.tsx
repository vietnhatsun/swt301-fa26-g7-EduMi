"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Heart, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AboutHero() {
  const { ref, isRevealed } = useScrollReveal(0.05);

  return (
    <section
      ref={ref}
      className="relative w-full pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ── Left Column: Text & Benefits in Ultra-Clear Frosted Card ── */}
          <div
            className={`lg:col-span-6 flex flex-col items-start text-left space-y-5 select-none bg-white/95 backdrop-blur-md p-6 sm:p-8 md:p-9 rounded-3xl border border-white shadow-2xl transition-all duration-700 ease-out transform ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black border border-emerald-300 shadow-2xs">
              <span className="text-base">🌱</span>
              <span>Về EduMi</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight">
              EduMi – Học tập thông minh,{" "}
              <span className="relative inline-block text-emerald-700">
                kiến tạo tương lai
                <Sparkles className="w-6 h-6 text-amber-500 inline-block ml-1.5 -translate-y-2 animate-pulse" />
              </span>
            </h1>

            {/* Description Subtext (Crisp dark color for maximum legibility) */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
              EduMi là nền tảng học tập trực tuyến được thiết kế dành riêng cho học sinh, giúp bạn học hiệu quả hơn, dễ dàng tiếp cận tri thức và phát triển bản thân thông qua công nghệ hiện đại và sự đồng hành của AI.
            </p>

            {/* 3 Highlight Pills */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-emerald-50 text-emerald-950 text-xs sm:text-[13px] font-bold border border-emerald-300 shadow-2xs hover:bg-emerald-100 transition-colors">
                <span className="text-emerald-700">🌱</span>
                <span>Học mọi lúc, mọi nơi</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-emerald-50 text-emerald-950 text-xs sm:text-[13px] font-bold border border-emerald-300 shadow-2xs hover:bg-emerald-100 transition-colors">
                <Heart className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                <span>Cá nhân hóa lộ trình</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-emerald-50 text-emerald-950 text-xs sm:text-[13px] font-bold border border-emerald-300 shadow-2xs hover:bg-emerald-100 transition-colors">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>Cộng đồng học tập tích cực</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Capybara Reading Book Artwork ── */}
          <div
            className={`lg:col-span-6 flex justify-center lg:justify-end transition-all duration-700 delay-150 ease-out transform ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative w-full max-w-lg sm:max-w-xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <Image
                src="/about-hero.jpg"
                alt="EduMi Capybara studying"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
