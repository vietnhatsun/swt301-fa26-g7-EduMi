"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Monitor,
  GraduationCap,
  ClipboardList,
  Bot,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AboutSteps() {
  const { ref, isRevealed } = useScrollReveal(0.12);

  const steps = [
    {
      num: 1,
      title: "1. Truy cập",
      desc: "Đăng nhập vào EduMi và khám phá các tính năng.",
      icon: Monitor,
      color: "bg-emerald-100 text-emerald-700 border-emerald-300",
      delay: "delay-100",
    },
    {
      num: 2,
      title: "2. Chọn nội dung",
      desc: "Tham gia lớp học, tìm tài liệu hoặc luyện thi theo nhu cầu.",
      icon: GraduationCap,
      color: "bg-amber-100 text-amber-700 border-amber-300",
      delay: "delay-200",
    },
    {
      num: 3,
      title: "3. Học & Luyện tập",
      desc: "Học theo lộ trình, làm bài tập, tham gia phòng thi.",
      icon: ClipboardList,
      color: "bg-sky-100 text-sky-700 border-sky-300",
      delay: "delay-300",
    },
    {
      num: 4,
      title: "4. Nhận hỗ trợ",
      desc: "Sử dụng trợ lí ảo để giải đáp thắc mắc và tối ưu kết quả.",
      icon: Bot,
      color: "bg-purple-100 text-purple-700 border-purple-300",
      delay: "delay-400",
    },
  ];

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Big Rounded Container with Glassmorphism */}
        <div
          className={`relative rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-10 lg:p-12 border border-white shadow-2xl transition-all duration-700 ease-out transform ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Section Tag */}
          <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black border border-emerald-300 shadow-2xs">
            <span>🧭</span>
            <span>Hướng dẫn học tập cùng EduMi</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Box: Call to action */}
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Chỉ 4 bước đơn giản
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                Bắt đầu hành trình học tập hiệu quả của bạn ngay hôm nay!
              </p>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all group cursor-pointer"
                >
                  <span>Bắt đầu ngay</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Middle: 4 Steps Flow with Staggered Delays & Equal Proportions */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative items-stretch">
              {steps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={step.num}
                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all duration-500 ease-out transform group h-full justify-between ${
                      step.delay
                    } ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  >
                    <div>
                      {/* Step Icon */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto border shadow-2xs group-hover:scale-110 transition-transform ${step.color}`}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>

                      {/* Step Title */}
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1.5">
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>

                    {/* Step Connecting Arrow */}
                    {idx < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-6 z-10 text-emerald-500">
                        <ChevronRight className="w-5 h-5 animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Mascot: Capybara with speech bubble */}
            <div
              className={`lg:col-span-2 flex flex-col items-center justify-center relative transition-all duration-700 delay-500 ease-out transform ${
                isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              {/* Cute speech bubble */}
              <div className="relative mb-2 px-3 py-1.5 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-black shadow-xs flex items-center gap-1 animate-bounce">
                <span>Bạn làm được!</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>

              {/* Capybara Sticker */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/stickers/mastery-capybara.png"
                  alt="EduMi Mascot cheering you on"
                  fill
                  className="object-contain filter drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
