"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface FeatureCardProps {
  id: string;
  themeColor: "emerald" | "sky" | "amber" | "purple";
  badgeNumber: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  buttonText: string;
  linkHref: string;
  delayClass: string;
}

const featuresData: FeatureCardProps[] = [
  {
    id: "class",
    themeColor: "emerald",
    badgeNumber: "01",
    title: "Lớp học",
    description: "Tham gia các lớp học chất lượng với giáo viên giỏi, học cùng cộng đồng và trao đổi trực tiếp.",
    imageSrc: "/about-classroom.jpg",
    imageAlt: "EduMi Lớp học trực tuyến chất lượng",
    buttonText: "Khám phá lớp học",
    linkHref: "/#classes",
    delayClass: "delay-100",
  },
  {
    id: "docs",
    themeColor: "sky",
    badgeNumber: "02",
    title: "Tài liệu",
    description: "Kho tài liệu phong phú, đa dạng được biên soạn và chọn lọc kỹ lưỡng theo từng môn học.",
    imageSrc: "/about-documents.jpg",
    imageAlt: "EduMi Kho tài liệu số phong phú",
    buttonText: "Khám phá tài liệu",
    linkHref: "/profile?tab=materials",
    delayClass: "delay-200",
  },
  {
    id: "exam",
    themeColor: "amber",
    badgeNumber: "03",
    title: "Phòng Thi",
    description: "Luyện thi với hệ thống đề thi đa dạng, mô phỏng sát thực tế, đánh giá chính xác.",
    imageSrc: "/about-exam.jpg",
    imageAlt: "EduMi Phòng thi thử bấm giờ",
    buttonText: "Khám phá phòng thi",
    linkHref: "/#exams",
    delayClass: "delay-300",
  },
  {
    id: "ai",
    themeColor: "purple",
    badgeNumber: "04",
    title: "Trợ Lí Ảo",
    description: "AI hỗ trợ học tập 24/7, giải đáp thắc mắc, gợi ý lộ trình và cá nhân hóa theo nhu cầu của bạn.",
    imageSrc: "/stickers/laptop-capybara.png",
    imageAlt: "EduMi Trợ lí ảo Capy AI",
    buttonText: "Khám phá trợ lí ảo",
    linkHref: "/#ai-tutor",
    delayClass: "delay-400",
  },
];

const colorStyles = {
  emerald: {
    badge: "bg-emerald-600 text-white",
    button: "border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white",
    cardHover: "hover:border-emerald-400",
  },
  sky: {
    badge: "bg-sky-500 text-white",
    button: "border-sky-500 text-sky-700 hover:bg-sky-500 hover:text-white",
    cardHover: "hover:border-sky-400",
  },
  amber: {
    badge: "bg-amber-500 text-white",
    button: "border-amber-500 text-amber-800 hover:bg-amber-500 hover:text-white",
    cardHover: "hover:border-amber-400",
  },
  purple: {
    badge: "bg-purple-600 text-white",
    button: "border-purple-500 text-purple-700 hover:bg-purple-600 hover:text-white",
    cardHover: "hover:border-purple-400",
  },
};

export default function AboutFeatures() {
  const { ref, isRevealed } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Reveal */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14 transition-all duration-700 ease-out transform ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-2xl space-y-3 bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-white shadow-lg">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black border border-emerald-300 shadow-2xs">
              <span>🌱</span>
              <span>EduMi có gì?</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              4 tính năng cốt lõi <br className="hidden sm:inline" />
              hỗ trợ bạn học tập toàn diện
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
              Từ lớp học, tài liệu đến luyện thi và AI hỗ trợ, EduMi luôn đồng hành cùng bạn trên mọi chặng đường học tập.
            </p>
          </div>

          {/* Straight cute badge on right */}
          <div className="flex-shrink-0 self-start lg:self-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-black shadow-lg cursor-default">
              <span>Học đơn giản hơn với EduMi!</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Grid with Staggered Animations & Equal Proportions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {featuresData.map((item) => {
            const styles = colorStyles[item.themeColor];
            return (
              <div
                key={item.id}
                className={`group relative bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl hover:shadow-2xl transition-all duration-700 ease-out transform flex flex-col justify-between h-full hover:-translate-y-2 ${styles.cardHover} ${
                  item.delayClass
                } ${isRevealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
              >
                {/* Top Section */}
                <div>
                  {/* Number Badge */}
                  <div className="flex items-center justify-start mb-4">
                    <span
                      className={`w-9 h-7 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shadow-xs ${styles.badge}`}
                    >
                      {item.badgeNumber}
                    </span>
                  </div>

                  {/* Card Illustration */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-5 border border-slate-100 flex items-center justify-center p-2">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                        item.id === "ai" ? "object-contain p-2" : ""
                      }`}
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2">
                  <Link
                    href={item.linkHref}
                    className={`w-full py-2.5 px-4 rounded-full border font-black text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-all duration-200 shadow-2xs ${styles.button}`}
                  >
                    <span>{item.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
