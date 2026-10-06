"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Bot, FileCheck } from "lucide-react";

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

      {/* ── AI Feature Overview 2-Column Card with GPU-accelerated smooth hover ── */}
      <div className="w-full bg-white rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-6 sm:p-8 transform-gpu transition-[transform,box-shadow,border-color] duration-250 ease-out hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Left Column: Capy AI Tutor */}
          <div className="space-y-2.5 group/card p-2 rounded-2xl transform-gpu transition-colors duration-200 hover:bg-emerald-50/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 group-hover/card:scale-105 group-hover/card:bg-emerald-600 group-hover/card:text-white transform-gpu transition-all duration-200">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-wide uppercase group-hover/card:text-emerald-800 transition-colors duration-200">
                GIA SƯ CAPY AI GIẢI ĐỀ 24/7
              </h3>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
              Mô hình AI chuyên sâu phân tích chi tiết từng bước giải Toán, Lý, Hóa, Sinh, Sử, Địa, chỉ ra mẹo bấm máy Casio siêu tốc và phương pháp tư duy nhanh cho dạng bài Trắc nghiệm Đúng/Sai &amp; Trả lời ngắn theo ma trận 2026.
            </p>
          </div>

          {/* Right Column: AI Essay Grading */}
          <div className="pt-6 md:pt-0 md:pl-8 space-y-2.5 group/card p-2 rounded-2xl transform-gpu transition-colors duration-200 hover:bg-amber-50/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 group-hover/card:scale-105 group-hover/card:bg-amber-500 group-hover/card:text-slate-950 transform-gpu transition-all duration-200">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-wide uppercase group-hover/card:text-amber-900 transition-colors duration-200">
                CHẤM CHỮA VĂN &amp; TỰ LUẬN CHUẨN BỘ GD
              </h3>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
              Hệ thống huấn luyện dựa trên hàng nghìn bài văn đạt điểm 9+ và barem chấm của Bộ GD&amp;ĐT, giúp nhận xét chi tiết cấu trúc luận điểm, sửa lỗi diễn đạt, chính tả và đề xuất cách phát triển ý để bứt phá điểm cao.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
