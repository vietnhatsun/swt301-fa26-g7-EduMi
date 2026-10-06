"use client";

import React, { useState } from "react";
import Image from "next/image";
import PremiumHeader from "@/components/premium/PremiumHeader";
import PremiumDiscounts, { GroupSize } from "@/components/premium/PremiumDiscounts";
import PremiumPlans, { PricingPlan } from "@/components/premium/PremiumPlans";
import PremiumTrustAndFaq from "@/components/premium/PremiumTrustAndFaq";
import { PremiumCheckoutModal, PremiumDocsPreviewModal } from "@/components/premium/PremiumModals";
import PremiumMascot from "@/components/premium/PremiumMascot";
import PremiumReveal from "@/components/premium/PremiumReveal";

export default function PremiumClientView() {
  // Group size discount: 1 | 2 | 3
  const [groupSize, setGroupSize] = useState<GroupSize>(1);

  // Promo code state
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCode, setAppliedCode] = useState<string>("");

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  // Docs preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    title: "",
    description: "",
  });

  const handleApplyCode = (code: string, discountPercent: number) => {
    setAppliedCode(code);
    setAppliedDiscount(discountPercent);
  };

  const handleRemoveCode = () => {
    setAppliedCode("");
    setAppliedDiscount(0);
  };

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

  const groupDiscountPercent = groupSize === 2 ? 15 : groupSize === 3 ? 20 : 0;
  const effectiveDiscount = Math.max(appliedDiscount, groupDiscountPercent);

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

        {/* 2. Study Squad & Promo Code Discounts */}
        <PremiumReveal delayMs={50}>
          <PremiumDiscounts
            groupSize={groupSize}
            onGroupSizeChange={setGroupSize}
            appliedDiscount={effectiveDiscount}
            appliedCode={appliedCode}
            onApplyCode={handleApplyCode}
            onRemoveCode={handleRemoveCode}
          />
        </PremiumReveal>

        {/* 3. Subject Group Packs & Full Combo Plans */}
        <PremiumReveal delayMs={50}>
          <PremiumPlans
            appliedDiscount={effectiveDiscount}
            onSelectPlan={handleSelectPlan}
            onPreviewDocs={handlePreviewDocs}
          />
        </PremiumReveal>

        {/* 4. Comparison Table, Streak Challenge, FAQ & Bottom Banner */}
        <PremiumReveal delayMs={50}>
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
        appliedDiscount={effectiveDiscount}
        appliedCode={appliedCode}
        groupSize={groupSize}
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
