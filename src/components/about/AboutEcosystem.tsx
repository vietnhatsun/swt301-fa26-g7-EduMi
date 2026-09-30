"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, BarChart3, Layers, Sparkles, Cpu } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AboutEcosystem() {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal(0.1);
  const { ref: item1Ref, isRevealed: item1Revealed } = useScrollReveal(0.12);
  const { ref: item2Ref, isRevealed: item2Revealed } = useScrollReveal(0.12);
  const { ref: item3Ref, isRevealed: item3Revealed } = useScrollReveal(0.12);
  const { ref: item4Ref, isRevealed: item4Revealed } = useScrollReveal(0.12);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto space-y-3 transition-all duration-700 ease-out transform ${
            headerRevealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black border border-emerald-300 shadow-2xs">
            <span>✨</span>
            <span>CHỈ CÓ TẠI EDUMI</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Mỗi bài học đi kèm cả một <br className="hidden sm:inline" />
            <span className="text-emerald-700">hệ sinh thái học tập</span>
          </h2>
        </div>

        {/* ── Showcase Item 1: Sổ kiến thức tích hợp AI (Mockup Left - Text Right) ── */}
        <div
          ref={item1Ref}
          className={`relative rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-8 lg:p-10 border border-white shadow-2xl transition-all duration-700 ease-out transform ${
            item1Revealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Mockup */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 relative aspect-[16/9] group">
              <Image
                src="/about-mockup-ainote.jpg"
                alt="EduMi Sổ kiến thức tích hợp AI"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sổ kiến thức tích hợp AI
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                Sau mỗi buổi học, chỉ cần chụp ảnh vở ghi bài hoặc đề bài – sổ thông minh EduMi tự động tổng hợp kiến thức trọng tâm, vẽ sơ đồ tư duy và đề xuất các bài tập luyện tập liên quan.
              </p>
            </div>
          </div>
        </div>

        {/* ── Showcase Item 2: Dashboard học tập (Text Left - Mockup Right) ── */}
        <div
          ref={item2Ref}
          className={`relative rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-8 lg:p-10 border border-white shadow-2xl transition-all duration-700 ease-out transform ${
            item2Revealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Text Content */}
            <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black shadow-xs">
                <BarChart3 className="w-6 h-6" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Dashboard học tập thông minh
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                Theo dõi tiến độ học một cách trực quan và hiệu quả, thống kê chuỗi ngày học liên tục (Streak), đếm ngược ngày thi và biết chính xác điểm mạnh, điểm yếu trên lộ trình.
              </p>
            </div>

            {/* Right Mockup */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 relative aspect-[16/9] group order-1 lg:order-2">
              <Image
                src="/about-mockup-dashboard.jpg"
                alt="EduMi Dashboard học tập thông minh"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* ── Showcase Item 3: Flashcard tối ưu hoá (Mockup Left - Text Right) ── */}
        <div
          ref={item3Ref}
          className={`relative rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-8 lg:p-10 border border-white shadow-2xl transition-all duration-700 ease-out transform ${
            item3Revealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Mockup */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 relative aspect-[16/9] group">
              <Image
                src="/about-mockup-flashcard.jpg"
                alt="EduMi Flashcard tối ưu hoá Spaced Repetition"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 border border-teal-300 flex items-center justify-center font-black shadow-xs">
                <Layers className="w-6 h-6" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Flashcard tối ưu hoá
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                Tích hợp nhiều chế độ ôn tập và thuật toán lặp lại ngắt quãng (Spaced Repetition), ghi nhớ công thức và từ vựng nhanh hơn gấp 3 lần, chống quên hiệu quả.
              </p>
            </div>
          </div>
        </div>

        {/* ── Showcase Item 4: Hệ sinh thái toàn diện (Text Left - Mockup Right) ── */}
        <div
          ref={item4Ref}
          className={`relative rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-8 lg:p-10 border border-white shadow-2xl transition-all duration-700 ease-out transform ${
            item4Revealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Text Content */}
            <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 border border-sky-300 flex items-center justify-center font-black shadow-xs">
                <Cpu className="w-6 h-6" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Hệ sinh thái toàn diện
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                Truy cập 100% các tính năng hiện đại nhất của EduMi: phòng thi bấm giờ, thẻ ghi nhớ AI, sổ tay lỗi sai và gia sư Capy AI đồng hành cùng bạn suốt cả lộ trình.
              </p>
            </div>

            {/* Right Mockup */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 relative aspect-[16/9] group order-1 lg:order-2">
              <Image
                src="/about-mockup-ecosystem.jpg"
                alt="EduMi Hệ sinh thái toàn diện"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
