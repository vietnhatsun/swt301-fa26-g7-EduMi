"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Sparkles,
  Star,
  Gift,
  CheckCircle2,
  Percent,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AboutBenefits() {
  const { ref, isRevealed } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Button */}
        <div
          className={`mb-6 transition-all duration-500 ease-out transform ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Về trang chủ</span>
          </Link>
        </div>

        {/* Main Card Container (Evenly Balanced Grid) */}
        <div
          className={`relative rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-10 lg:p-12 border border-white shadow-2xl transition-all duration-700 ease-out transform ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* ── Left Column: Value Proposition Text (6 cols) ── */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase border border-emerald-300">
                  <span>GIÁ TRỊ THẬT SỰ</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-sans font-black text-slate-900 tracking-tight leading-tight">
                  Quyền lợi học viên.
                </h2>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Tại EduMi, bạn không chỉ tham gia những buổi học trực tuyến thông thường. Bạn bước vào một môi trường được thiết kế để giúp việc học tập và bứt phá điểm số trở nên rõ ràng, có lộ trình và hiệu quả hơn.
                </p>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Trong suốt quá trình học, bạn luôn có{" "}
                  <strong className="text-slate-950 font-bold bg-amber-100/90 px-1.5 py-0.5 rounded-md">
                    giáo viên và trợ lí ảo AI đồng hành
                  </strong>
                  , giải đáp thắc mắc, theo sát tiến độ và hỗ trợ khi gặp khó khăn. Bên cạnh đó là hệ sinh thái công nghệ học tập và kho tài liệu ma trận mới giúp bạn duy trì việc học mỗi ngày.
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium italic pt-2 border-t border-slate-200">
                  Với EduMi, học tập không chỉ là ôn luyện cho các kỳ thi, mà là khoản đầu tư cho cả một hệ sinh thái và một đội ngũ đồng hành cùng bạn đến ngày bước vào cánh cổng trường mơ ước.
                </p>
              </div>

              {/* Mascot Brand Badge */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image
                    src="/stickers/mastery-capybara.png"
                    alt="EduMi Mascot"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-xs font-bold text-emerald-800">
                  EduMi — Đồng hành cùng ước mơ của bạn ✨
                </div>
              </div>
            </div>

            {/* ── Right Column: 4 Benefit Cards (7 cols, 2x2 Equal Height Grid) ── */}
            <div className="lg:col-span-7 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              {/* Card 1: Premium AI (Amber) */}
              <div
                className={`p-5 sm:p-6 rounded-3xl bg-[#fdfaf3] border border-amber-200/90 shadow-xs hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1 flex flex-col justify-between ${
                  isRevealed
                    ? "opacity-100 translate-y-0 delay-100"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
                      <Star className="w-4 h-4 fill-white" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Trợ lí AI & Kho Pro
                    </h3>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                    Học viên được tặng tài khoản Pro: giải đáp bài tập 24/7 với AI, Flashcard Spaced Repetition, phòng thi thử có bấm giờ — kèm bộ tài liệu độc quyền bám sát ma trận THPT 2026.
                  </p>
                </div>
              </div>

              {/* Card 2: Học bổng chăm chỉ (Green) */}
              <div
                className={`p-5 sm:p-6 rounded-3xl bg-[#f3f9f4] border border-emerald-200/90 shadow-xs hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1 flex flex-col justify-between ${
                  isRevealed
                    ? "opacity-100 translate-y-0 delay-200"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs text-sm flex-shrink-0">
                      ₫
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Học bổng chăm chỉ
                    </h3>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                    Nhận thưởng{" "}
                    <strong className="text-emerald-900 font-black bg-emerald-200/60 px-1 py-0.5 rounded">
                      500.000đ học bổng
                    </strong>{" "}
                    khi duy trì chuỗi Streak học tập và hoàn thành 100% bài tập trong suốt khóa học để ghi nhận nỗ lực nghiêm túc của bạn.
                  </p>
                </div>
              </div>

              {/* Card 3: Ưu đãi & Quà tặng (Sky Blue) */}
              <div
                className={`p-5 sm:p-6 rounded-3xl bg-[#f2f8fc] border border-sky-200/90 shadow-xs hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1 flex flex-col justify-between ${
                  isRevealed
                    ? "opacity-100 translate-y-0 delay-300"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
                      <Percent className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Ưu đãi & Quà tặng
                    </h3>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                    Tặng ngay sổ tay 100 công thức giải nhanh, ưu đãi khi đăng ký theo nhóm hoặc combo khóa học, cùng voucher giảm trực tiếp khi tham gia thi thử ĐGNL.
                  </p>
                </div>
              </div>

              {/* Card 4: Cam kết đầu ra (Purple) */}
              <div
                className={`p-5 sm:p-6 rounded-3xl bg-[#f7f3fb] border border-purple-200/90 shadow-xs hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1 flex flex-col justify-between ${
                  isRevealed
                    ? "opacity-100 translate-y-0 delay-400"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Cam kết bứt phá điểm
                    </h3>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                    EduMi cam kết đồng hành đến khi bạn đạt mục tiêu. Nếu học đúng lộ trình mà chưa đạt điểm cam kết, bạn được{" "}
                    <strong className="text-purple-900 font-black bg-purple-200/60 px-1 py-0.5 rounded">
                      học lại miễn phí
                    </strong>{" "}
                    theo chính sách của EduMi.
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
