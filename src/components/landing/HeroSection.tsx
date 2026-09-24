"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Star,
  Users,
  Award,
  BookOpen,
  Clock,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
      {/* ── Background Hero Image (The requested Capy study room image) ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-capybara.png"
          alt="Capy studying by the window - EduMi Platform"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] lg:object-center select-none"
        />

        {/* ── Multi-layer Soft Gradient Overlays for Maximum Contrast & Atmosphere ── */}
        {/* Left-to-right gradient: allows text to be crystal clear on white without losing Capy on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 sm:via-white/75 md:via-white/60 to-white/10 lg:to-transparent" />

        {/* Top subtle tint for fixed navbar blending */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/70 to-transparent" />

        {/* Bottom soft transition into stats section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8faf8] via-[#f8faf8]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* ── Left Content (Hero Copy & CTAs) ── */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 max-w-2xl">
            {/* Top Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200/80 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="text-xs font-bold text-emerald-900 tracking-tight">
                Hệ sinh thái ôn thi THPT & ĐGNL 2026
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                AI Powered
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Học cùng <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">Capy</span>, <br />
              Bứt phá điểm số <br />
              <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Dễ Dàng & Tự Tin
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-700/90 leading-relaxed font-medium">
              Đồng hành cùng chú chuột túi Capy thông thái: Luyện hơn <strong>500+ bộ đề thi chuẩn ma trận</strong>, phòng thi thử tính giờ tự động, thẻ Flashcard AI ghi nhớ sâu và gia sư giải đáp phương pháp làm bài 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/register"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-sm sm:text-base shadow-[0_10px_25px_rgba(5,150,105,0.3)] hover:shadow-[0_15px_30px_rgba(5,150,105,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Bắt đầu học thử miễn phí</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#features"
                className="px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-emerald-700 font-bold text-sm sm:text-base border border-emerald-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Khám phá tính năng</span>
              </Link>
            </div>

            {/* Trust Proof Badges */}
            <div className="pt-4 border-t border-emerald-900/10 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Chuẩn ma trận Bộ GD&ĐT</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Không cần cài đặt phức tạp</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Miễn phí 100% khi bắt đầu</span>
              </div>
            </div>

            {/* Student Rating & Social Proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-xs">
                  A
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shadow-xs">
                  T
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shadow-xs">
                  N
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shadow-xs">
                  L
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-black text-slate-900 ml-1">4.9/5</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Được tin dùng bởi hơn <strong>12,500+ học sinh THPT</strong> trên cả nước
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Content: Interactive Overlay Floating Badges highlighting Capy ── */}
          <div className="lg:col-span-5 xl:col-span-5 relative hidden sm:flex flex-col items-end space-y-4 pt-12 lg:pt-0">
            {/* Floating Card 1: Mascot Chat Bubble */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl sm:rounded-3xl border border-emerald-100 shadow-[0_12px_32px_rgba(6,78,59,0.12)] max-w-xs animate-float">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 overflow-hidden flex-shrink-0 relative">
                  <Image
                    src="/capybara-mascot.png"
                    alt="Capy Mascot"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Capy Tutor AI</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    &ldquo;Chào bạn! Hôm nay chúng mình cùng giải chuyên đề Hàm số hay luyện đề Anh nhé?&rdquo; 🌱
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card 2: Study Progress Badge (matching chalkboard in image) */}
            <div
              className="bg-white/90 backdrop-blur-md p-4 rounded-2xl sm:rounded-3xl border border-emerald-100 shadow-[0_12px_32px_rgba(6,78,59,0.12)] max-w-xs mr-6 transition-transform hover:scale-105 duration-200"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  MỤC TIÊU THI 2026
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Top 5% Toàn quốc
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">27.8 / 30</span>
                <span className="text-xs font-bold text-emerald-600">+1.8 điểm</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-[92%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-1.5">
                <span>Khối A01 & D01</span>
                <span>Hoàn thành 92%</span>
              </div>
            </div>

            {/* Floating Badge 3: Streak Badge */}
            <div className="bg-emerald-900/90 text-white backdrop-blur-md py-2.5 px-4 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold mr-12">
              <span className="text-base">🔥</span>
              <span>Chuỗi 21 ngày học cùng Capy!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
