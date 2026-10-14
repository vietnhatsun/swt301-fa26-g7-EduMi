"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, ShieldCheck, BrainCircuit, Trophy, Flame } from "lucide-react";

export default function AboutHeroBrand() {
  const scrollToStory = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("our-story");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full pt-24 sm:pt-28 pb-8 text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Main Unified Hero Framed Container (Neo-Brutalism Card) ── */}
        <div className="bg-[#fffdf7] rounded-[32px] sm:rounded-[40px] border-[3px] border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10 lg:p-14 overflow-hidden relative">
          
          {/* Top Panel Window Header Bar */}
          <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b-2 border-slate-900/15 gap-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-700" />
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                Khám phá EduMi 2026
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Học tập không áp lực • Cá nhân hóa 100%</span>
            </div>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
                EduMi – Nền tảng học tập{" "}
                <span className="relative inline-block text-emerald-800 underline decoration-emerald-400 decoration-wavy decoration-2">
                  cá nhân hóa
                </span>{" "}
                &amp; thông minh cho thế hệ mới
              </h1>

              {/* Sub-headline Box */}
              <div className="bg-[#f8faf8] p-4 sm:p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-slate-800 text-sm sm:text-base md:text-lg font-semibold leading-relaxed">
                Sự kết hợp hoàn hảo giữa <strong className="text-emerald-900 font-black">Tài liệu chuẩn hóa ma trận</strong>,{" "}
                <strong className="text-emerald-900 font-black">Lớp học ảo tương tác</strong> và{" "}
                <strong className="text-emerald-900 font-black">Trợ lý gia sư Capy AI 24/7</strong> — giúp học sinh học tập chủ động, bứt phá điểm 9+ mà không bị áp lực.
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
                <Link
                  href="/classes"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-base border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Bắt đầu học ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#our-story"
                  onClick={scrollToStory}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-950 font-black text-base border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <span>Câu chuyện thương hiệu</span>
                </a>
              </div>

              {/* 3 Quick Benefit Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border-2 border-slate-900 text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>100% Đề chuẩn Bộ GD&amp;ĐT</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border-2 border-slate-900 text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <BrainCircuit className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Gia sư Capy AI 24/7</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border-2 border-slate-900 text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Trophy className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Tự tin mục tiêu 9+</span>
                </div>
              </div>

            </div>

            {/* Right Column: Fluffy Capybara Mascot Framed */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              <div className="relative w-full bg-[#f4f7f2] rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                
                {/* Floating Badge 1 (Top Left) */}
                <div className="absolute -top-3.5 -left-3.5 sm:-left-4 bg-white rounded-xl p-2.5 sm:p-3 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 z-20">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Flame className="w-4 h-4 fill-orange-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-slate-900">Streak 15 ngày</div>
                    <div className="text-[9px] text-slate-500 font-bold">+150 XP thưởng</div>
                  </div>
                </div>

                {/* Capybara Image */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 drop-shadow-xl hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/method-capybara-transparent.png"
                    alt="Linh vật Capybara EduMi học đúng cách đi xa hơn"
                    fill
                    priority
                    sizes="(max-width: 768px) 260px, 300px"
                    className="object-contain"
                  />
                </div>

                {/* Floating Badge 2 (Bottom Right) */}
                <div className="absolute -bottom-3.5 -right-3.5 sm:-right-4 bg-white rounded-xl p-2.5 sm:p-3 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 z-20">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Sparkles className="w-4 h-4 fill-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-slate-900">AI Exam Scanner</div>
                    <div className="text-[9px] text-emerald-700 font-bold">Chính xác 99.8%</div>
                  </div>
                </div>

                {/* Mascot Status Text */}
                <div className="mt-3 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
                    <span>Capy Mentorship ✨</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    Người bạn đồng hành số 1
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Luôn sẵn sàng hỗ trợ giải đáp bài khó, tạo động lực mỗi ngày!
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
