"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Crown, X, Heart } from "lucide-react";

export default function PremiumMascot() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [isWaving, setIsWaving] = useState(false);

  const capyTips = [
    "👑 Capy mách nhỏ: Gói 3 Tháng đang được tặng kèm Trọn bộ 50 đề thi ĐGNL đó!",
    "🔥 Rủ bạn cùng bàn đăng ký Nhóm 2 bạn để được giảm ngay 15% học phí nè!",
    "🌱 Duy trì chuỗi Streak 30 ngày luyện đề để nhận thêm 15 ngày VIP miễn phí nha!",
    "💡 Nhập mã 'EDUMI10' ở trên để được giảm thêm 10% ngay lập tức bạn ơi!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % capyTips.length);
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 6000);
    return () => clearInterval(timer);
  }, [capyTips.length]);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 select-none">
      <div className="relative flex flex-col items-end">
        {/* Speech Bubble */}
        {isOpen && (
          <div className="mb-2 max-w-[260px] sm:max-w-[290px] bg-white rounded-2xl border border-emerald-200 shadow-[0_8px_30px_rgba(6,78,59,0.12)] p-3 text-xs text-slate-800 font-bold space-y-1 relative animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
              title="Đóng lời khuyên"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>

            <div className="flex items-start gap-1.5">
              <span className="text-sm">🐾</span>
              <p className="leading-snug text-[11px] sm:text-xs text-slate-700">
                {capyTips[currentTipIndex]}
              </p>
            </div>

            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-emerald-200 rotate-45" />
          </div>
        )}

        {/* Mascot Avatar Button with Crown */}
        <div className="relative group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <div className="p-1 rounded-full bg-amber-400 border border-amber-500 shadow-xs">
              <Crown className="w-4 h-4 text-amber-950 fill-amber-300" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              setIsWaving(true);
              setTimeout(() => setIsWaving(false), 800);
            }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-200 shadow-[0_8px_24px_rgba(6,78,59,0.15)] p-1 overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
              isWaving ? "rotate-6 scale-110" : ""
            }`}
            title="Gia sư Capy AI"
          >
            <div className="w-full h-full relative">
              <Image
                src="/Capybara_EduMi_và_bảng_học_tập-removebg-preview.png"
                alt="Capybara VIP Mascot"
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>

          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-rose-500 border border-white flex items-center justify-center text-white text-[10px] shadow-xs">
            <Heart className="w-3 h-3 fill-white" />
          </span>
        </div>
      </div>
    </div>
  );
}
