"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { Crown, X, Heart } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  PremiumHeader,
  PremiumPlans,
  PremiumTrustAndFaq,
  PricingPlan,
} from "@/components/premium/PremiumSections";
import {
  PremiumCheckoutModal,
  PremiumDocsPreviewModal,
} from "@/components/premium/PremiumModals";

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL REVEAL ANIMATION WRAPPER
───────────────────────────────────────────────────────────────────────────── */

function PremiumReveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>(0.12, "0px 0px -60px 0px");

  return (
    <div
      ref={ref}
      className={`transform-gpu transition-[opacity,transform] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] ${
        isRevealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      } ${className}`}
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FLOATING CAPYBARA MASCOT
───────────────────────────────────────────────────────────────────────────── */

function PremiumMascot() {
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

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN CLIENT VIEW
───────────────────────────────────────────────────────────────────────────── */

export default function PremiumClientView() {
  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  // Docs preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    title: "",
    description: "",
  });

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handlePreviewDocs = () => {
    setPreviewData({
      title: "TRỌN BỘ 50 ĐỀ ĐÁNH GIÁ NĂNG LỰC & KHO TÀI LIỆU 2026",
      description:
        "Tổng hợp 50 đề thi ĐGNL chuẩn cấu trúc HSA & V-SAT, ngân hàng câu hỏi phân loại 9+ và phương pháp bấm máy Casio nhanh bám sát ma trận mới của Bộ GD&ĐT.",
    });
    setIsPreviewOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#7f9b5d] text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden">
      {/* Signature EduMi Green Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Decorative Corner Stickers & Subtle Leaf Elements */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Image
          src="/stickers/classes-corner-3d.png"
          alt=""
          aria-hidden="true"
          width={210}
          height={222}
          className="absolute -bottom-6 -left-6 z-0 h-auto w-[160px] -rotate-6 opacity-85 drop-shadow-[0_18px_24px_rgba(29,55,30,0.22)] hidden sm:block"
        />
        <Image
          src="/stickers/classes-corner-3d.png"
          alt=""
          aria-hidden="true"
          width={210}
          height={222}
          className="absolute -bottom-6 -right-6 z-0 h-auto w-[168px] rotate-6 scale-x-[-1] opacity-85 drop-shadow-[0_18px_24px_rgba(29,55,30,0.22)] hidden sm:block"
        />
      </div>

      {/* Main Layout Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 sm:pb-24 space-y-10 sm:space-y-12">
        {/* 1. Header with Top Left Back Button & AI Tutor Overview */}
        <PremiumReveal delayMs={0}>
          <PremiumHeader />
        </PremiumReveal>

        {/* 2. Subject Group Packs & Full Combo Plans (Directly shown below Header) */}
        <PremiumReveal delayMs={40}>
          <PremiumPlans
            onSelectPlan={handleSelectPlan}
            onPreviewDocs={handlePreviewDocs}
          />
        </PremiumReveal>

        {/* 3. Comparison Table, Streak Challenge, FAQ & Bottom Banner */}
        <PremiumReveal delayMs={40}>
          <PremiumTrustAndFaq />
        </PremiumReveal>
      </main>

      {/* Floating Capybara Mascot */}
      <PremiumMascot />

      {/* Modals */}
      <PremiumCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlan}
      />

      <PremiumDocsPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={previewData.title}
        description={previewData.description}
      />
    </div>
  );
}
