"use client";

import React, { useState } from "react";
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
    <div className="relative min-h-screen bg-[#f8faf9] text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden">
      {/* ── High-Performance Background (No heavy real-time blur-3xl computation) ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15), transparent 45%), radial-gradient(circle at 10% 40%, rgba(245, 158, 11, 0.08), transparent 35%), radial-gradient(circle at 90% 70%, rgba(16, 185, 129, 0.08), transparent 35%), radial-gradient(circle, #059669 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 100% 100%, 24px 24px",
        }}
      />

      {/* ── Main Layout Container ── */}
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

      {/* ── Floating Capybara Mascot ── */}
      <PremiumMascot />

      {/* ── Modals ── */}
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
