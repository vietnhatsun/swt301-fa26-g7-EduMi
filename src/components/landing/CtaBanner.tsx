"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Gift } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-16 lg:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] text-white p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(6,78,59,0.25)]">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-400/10 pointer-events-none blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
                <Gift className="w-4 h-4 text-amber-300" />
                <span>Quà tặng mở đầu: Tặng Sổ tay 100 công thức giải nhanh</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Sẵn sàng bứt phá điểm số <br />
                cùng <span className="text-amber-300 underline decoration-wavy decoration-emerald-400">Capy</span> ngay hôm nay?
              </h2>

              <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl leading-relaxed font-medium">
                Tạo tài khoản học tập miễn phí chỉ trong 30 giây để trải nghiệm ngay hệ thống luyện đề chuẩn ma trận và hỏi bài cùng gia sư Capy AI 24/7.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/register"
                  className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Bắt đầu học thử miễn phí</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span>Đăng nhập</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-emerald-200/90 pt-3">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Không cần thẻ tín dụng
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Kích hoạt tài khoản ngay tức thì
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  12,500+ học sinh đang ôn luyện
                </span>
              </div>
            </div>

            {/* Right Mascot Visual */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white/10 p-4 border border-white/20 shadow-2xl backdrop-blur-sm flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/capybara-mascot.png"
                    alt="Capy Mascot EduMi"
                    width={220}
                    height={220}
                    className="w-full h-full object-contain filter drop-shadow-lg"
                  />
                </div>
                {/* Floating quote pill */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-4 py-1.5 rounded-full shadow-lg text-xs font-black whitespace-nowrap border border-emerald-200 flex items-center gap-1.5">
                  <span>🌱 Cùng học chăm nhé!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
