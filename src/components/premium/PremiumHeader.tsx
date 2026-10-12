"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function PremiumHeader() {
  return (
    <div className="w-full space-y-5">
      {/* ── Top Bar: Back to Home Button on the top-left ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#064e3b] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer group"
          title="Quay lại trang chủ EduMi"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Về trang chủ</span>
        </Link>

        {/* Right Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition-transform duration-200 transform-gpu hover:scale-105">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Luyện thi THPT &amp; ĐGNL 2026 • Bứt phá điểm số 9+</span>
        </div>
      </div>

      {/* ── Main Hero Title Card ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 text-white p-7 sm:p-9 shadow-lg border border-emerald-700/50 transform-gpu transition-[box-shadow,border-color] duration-300 hover:shadow-xl hover:border-emerald-500/70">
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black tracking-wider uppercase transition-transform duration-200 transform-gpu hover:scale-105">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>ĐẶC QUYỀN HỘI VIÊN VIP 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            BẢNG GIÁ GÓI HỌC
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 font-medium leading-relaxed max-w-2xl mx-auto">
            Mở khóa toàn bộ kho đề thi bản quyền, gia sư Capy AI 24/7 và hệ thống chấm chữa bài thông minh để về đích xuất sắc.
          </p>
        </div>
      </div>
    </div>
  );
}
