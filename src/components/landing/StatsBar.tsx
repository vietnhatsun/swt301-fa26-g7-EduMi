"use client";

import React from "react";
import { BookOpen, Trophy, CheckCircle, Users, Sparkles, TrendingUp } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      icon: BookOpen,
      value: "500+",
      label: "Bộ đề thi chuẩn ma trận",
      desc: "Bám sát cấu trúc mới nhất của Bộ GD&ĐT",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      icon: Trophy,
      value: "15,000+",
      label: "Học sinh đạt điểm 8.5+",
      desc: "Tiến bộ vượt bậc sau 4 tuần ôn luyện",
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      icon: CheckCircle,
      value: "1.2 Tr+",
      label: "Câu hỏi trắc nghiệm đã giải",
      desc: "Kèm lời giải thích và phương pháp tư duy",
      color: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      icon: TrendingUp,
      value: "96.4%",
      label: "Tỉ lệ cải thiện điểm số",
      desc: "Được kiểm chứng qua các kỳ thi thử định kỳ",
      color: "text-teal-700 bg-teal-50 border-teal-200",
    },
  ];

  return (
    <section className="relative z-10 -mt-6 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-[0_12px_40px_rgba(6,78,59,0.06)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center ${
                  idx % 2 === 1 && idx !== 0 ? "pt-4 sm:pt-0" : ""
                } ${idx > 1 ? "pt-4 lg:pt-0" : ""}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-3 shadow-xs ${item.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {item.label}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 max-w-[200px]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
