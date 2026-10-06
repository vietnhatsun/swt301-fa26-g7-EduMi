"use client";

import React from "react";
import { Check, CheckCircle2, MessageCircle, ArrowUpRight, Sparkles, Crown, Zap } from "lucide-react";

export interface PricingPlan {
  id: string;
  category: "subject" | "combo";
  icon?: string;
  name: string;
  badge?: string;
  badgeType?: "popular" | "best_value";
  basePrice: number;
  priceFormatted: string;
  rateMonthlyFormatted?: string;
  priceBadgeLabel?: string;
  savingsNote?: string;
  features: string[];
  gifts?: {
    id: string;
    title: string;
    description: string;
  }[];
  dashedNotice?: string;
  ctaText?: string;
  hasPreview?: boolean;
}

interface PremiumPlansProps {
  appliedDiscount: number;
  onSelectPlan: (plan: PricingPlan) => void;
  onPreviewDocs: () => void;
}

const SUBJECT_PLANS: PricingPlan[] = [
  {
    id: "thpt-stem-1m",
    category: "subject",
    icon: "📐",
    name: "TOÁN - LÝ - HÓA (KHỐI A)",
    basePrice: 149000,
    priceFormatted: "149.000đ",
    priceBadgeLabel: "Gói 1 tháng (~4.9k/ngày)",
    features: [
      "Kho 300+ đề thi Toán, Lý, Hóa chuẩn ma trận mới 2026.",
      "Gia sư Capy AI giải chi tiết từng bước, mẹo Casio siêu tốc.",
      "Sổ tay tự động gom câu hỏi hay làm sai để tạo đề ôn lại.",
      "Bảng xếp hạng điểm số và so sánh năng lực toàn quốc.",
    ],
    dashedNotice: "Tập trung chuyên sâu cho khối Tự nhiên (A00, A01, B00).",
    ctaText: "CHỌN GÓI NÀY",
  },
  {
    id: "thpt-dgnl-pack",
    category: "subject",
    icon: "🎯",
    name: "BỘ ĐỀ ĐGNL ĐHQG HN & HCM",
    basePrice: 499000,
    priceFormatted: "499.000đ",
    priceBadgeLabel: "Bản quyền 2026",
    features: [
      "Trọn bộ 50 đề thi thử ĐGNL chuẩn cấu trúc HSA & ĐHQG TP.HCM.",
      "Phân tích chuyên sâu 3 phần: Định lượng, Định tính & Khoa học.",
      "Biểu đồ phân tích điểm mạnh - yếu và gợi ý trường Đại học.",
      "Phòng thi trực tuyến mô phỏng 100% áp lực phòng thi thật.",
    ],
    dashedNotice: "Tặng kèm miễn phí khi đăng ký Gói Thủ Khoa Trọn Năm.",
    ctaText: "CHỌN GÓI NÀY",
    hasPreview: true,
  },
  {
    id: "thpt-social-1m",
    category: "subject",
    icon: "📖",
    name: "VĂN - SỬ - ĐỊA (KHỐI C/D)",
    basePrice: 149000,
    priceFormatted: "149.000đ",
    priceBadgeLabel: "Gói 1 tháng (~4.9k/ngày)",
    features: [
      "Chấm chữa bài Nghị luận văn học & Xã hội theo barem Bộ GD.",
      "Mở khóa 100+ đề thi trắc nghiệm Sử, Địa và sơ đồ tư duy.",
      "Bộ thẻ Flashcard 3.000 câu hỏi trọng tâm lớp 11 & 12.",
      "Tự tạo bài luyện tập trắc nghiệm theo chuyên đề còn yếu.",
    ],
    dashedNotice: "Tập trung chuyên sâu cho khối Xã hội (C00, D01, D14).",
    ctaText: "CHỌN GÓI NÀY",
  },
];

const COMBO_PLANS: PricingPlan[] = [
  {
    id: "thpt-combo-1m",
    category: "combo",
    name: "GÓI BỨT TỐC (1 THÁNG)",
    basePrice: 249000,
    priceFormatted: "249.000đ",
    rateMonthlyFormatted: "~8.300đ / ngày",
    features: [
      "Mở khóa toàn bộ 8 môn thi THPT (Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa).",
      "Không giới hạn số lượt thi thử và xem video giải chi tiết.",
      "Capy AI giải đáp thắc mắc bài tập 24/7 không giới hạn lượt hỏi.",
      "Sổ tay lưu câu sai và phân tích ma trận điểm yếu theo từng chương.",
      "Tải file đề thi PDF bản in chuẩn A4 kèm đáp án.",
    ],
    ctaText: "CHỌN GÓI NÀY",
  },
  {
    id: "thpt-combo-3m",
    category: "combo",
    name: "GÓI VỀ ĐÍCH (3 THÁNG)",
    badge: "🔥 HỌC SINH 12 CHỌN NHIỀU",
    badgeType: "popular",
    basePrice: 599000,
    priceFormatted: "599.000đ",
    rateMonthlyFormatted: "~199.000đ / tháng (~6.6k/ngày)",
    savingsNote: "Tiết kiệm 148.000đ so với mua lẻ",
    features: [
      "Toàn quyền ôn luyện tất cả các môn thi THPT & ĐGNL 2026.",
      "Bộ 500+ đề thi thử cập nhật liên tục từ các trường chuyên toàn quốc.",
      "Phòng thi bấm giờ mô phỏng áp lực phòng thi thật 100%.",
      "Hệ thống xếp hạng năng lực và gợi ý trường Đại học phù hợp điểm số.",
      "Tạo không giới hạn đề thi cá nhân hóa từ các câu hỏi hay làm sai.",
    ],
    gifts: [
      {
        id: "thpt-gift-dgnl",
        title: "Tặng trọn bộ 50 đề thi thử ĐGNL HSA & V-SAT bản quyền.",
        description: "Chuẩn cấu trúc ĐHQG Hà Nội & TP.HCM kèm giải mã tư duy chi tiết.",
      },
    ],
    ctaText: "CHỌN GÓI NÀY",
  },
  {
    id: "thpt-combo-year",
    category: "combo",
    name: "GÓI THỦ KHOA (6 THÁNG)",
    badge: "👑 TIẾT KIỆM 50% HỌC PHÍ",
    badgeType: "best_value",
    basePrice: 999000,
    priceFormatted: "999.000đ",
    rateMonthlyFormatted: "~166.000đ / tháng (~5.5k/ngày)",
    features: [
      "Mở khóa 100% tính năng website đến ngày thi chính thức THPT 2026.",
      "Bộ 1.000+ đề thi từ hơn 100 trường chuyên danh tiếng cả nước.",
      "Tham gia phòng thi đấu online hàng tuần cùng cộng đồng học sinh toàn quốc.",
      "Gia sư Capy AI ưu tiên tốc độ cao, hỗ trợ giảng bài vận dụng cao 9+.",
      "Lộ trình tối ưu giúp bứt phá từ 1.5 - 2.5+ điểm tổng tổ hợp xét tuyển.",
    ],
    gifts: [
      {
        id: "thpt-gift-dgnl-full",
        title: "Tặng trọn bộ đề ĐGNL ĐHQG HN & TP.HCM (Trị giá 499.000đ).",
        description: "Bộ đề ĐGNL đầy đủ 3 phần kèm đáp án chi tiết.",
      },
      {
        id: "thpt-gift-ebook-100",
        title: "Tặng tuyển tập 100 đề thi thử trường chuyên & sổ tay công thức.",
        description: "Kho tài liệu đồ sộ ôn thi đại học dùng trọn vẹn cả năm.",
      },
    ],
    ctaText: "CHỌN GÓI NÀY",
  },
];

export default function PremiumPlans({
  appliedDiscount,
  onSelectPlan,
  onPreviewDocs,
}: PremiumPlansProps) {
  const formatPriceWithDiscount = (basePrice: number) => {
    if (appliedDiscount > 0) {
      const finalPrice = Math.round((basePrice * (100 - appliedDiscount)) / 100);
      return new Intl.NumberFormat("vi-VN").format(finalPrice) + "đ";
    }
    return new Intl.NumberFormat("vi-VN").format(basePrice) + "đ";
  };

  return (
    <div className="w-full space-y-10">
      {/* ── 1. Gói Theo Tổ Hợp Môn ── */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              <span>GÓI THEO TỔ HỢP MÔN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Lựa chọn đúng khối thi bạn cần
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Chỉ cần ôn 1 tổ hợp? Trả đúng phần bạn học.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {SUBJECT_PLANS.map((plan) => {
            const hasDiscount = appliedDiscount > 0;
            const discountedPrice = formatPriceWithDiscount(plan.basePrice);

            return (
              <div
                key={plan.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-6 sm:p-7 flex flex-col justify-between transform-gpu transition-[transform,box-shadow,border-color] duration-250 ease-out hover:shadow-xl hover:border-emerald-400 hover:scale-[1.018] hover:-translate-y-1.5 group cursor-default"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 group-hover:bg-emerald-100 transform-gpu transition-all duration-200">
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 tracking-wide uppercase group-hover:text-emerald-800 transition-colors duration-200">
                        {plan.name}
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-700">
                        {plan.priceBadgeLabel}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {discountedPrice}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through font-bold">
                          {plan.priceFormatted}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1 text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  {plan.dashedNotice && (
                    <p className="text-[11px] text-slate-500 italic">
                      💡 {plan.dashedNotice}
                    </p>
                  )}

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan)}
                      className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wide uppercase shadow-sm transition-all duration-150 transform-gpu cursor-pointer flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
                    >
                      <span>{plan.ctaText}</span>
                    </button>

                    {plan.hasPreview && (
                      <button
                        type="button"
                        onClick={onPreviewDocs}
                        className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-slate-200 hover:border-emerald-300 transition-all duration-150 transform-gpu cursor-pointer flex items-center justify-center gap-1 hover:scale-[1.01] active:scale-95"
                      >
                        <span>Xem trước đề thi mẫu</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. Gói Toàn Diện THPT & ĐGNL ── */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase mb-1">
              <Crown className="w-3 h-3 text-amber-700" />
              <span>GÓI TOÀN DIỆN THPT &amp; ĐGNL 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mở khóa toàn bộ tính năng &amp; 500+ đề thi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Đầy đủ 8 môn thi tốt nghiệp và kho đề ĐGNL chuẩn HSA &amp; V-SAT.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-stretch pt-2">
          {COMBO_PLANS.map((plan) => {
            const hasDiscount = appliedDiscount > 0;
            const discountedPrice = formatPriceWithDiscount(plan.basePrice);
            const isPopular = plan.badgeType === "popular";
            const isBestValue = plan.badgeType === "best_value";

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transform-gpu transition-[transform,box-shadow,border-color] duration-250 ease-out group hover:scale-[1.02] hover:-translate-y-2 cursor-default ${
                  isPopular
                    ? "bg-white border-2 border-emerald-500 shadow-[0_12px_40px_rgba(16,185,129,0.12)] hover:shadow-2xl lg:-translate-y-1.5"
                    : isBestValue
                    ? "bg-gradient-to-b from-amber-50/50 to-white border-2 border-amber-400 shadow-md hover:shadow-2xl hover:border-amber-500"
                    : "bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 select-none">
                    <span
                      className={`px-4 py-1 rounded-full font-black text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1 group-hover:scale-105 transition-transform duration-200 transform-gpu ${
                        isPopular
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-400 text-amber-950"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide uppercase group-hover:text-emerald-800 transition-colors duration-200">
                      {plan.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-700 mt-1">
                      {plan.rateMonthlyFormatted}
                    </p>
                  </div>

                  <div className="pt-2 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        {discountedPrice}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through font-bold">
                          {plan.priceFormatted}
                        </span>
                      )}
                    </div>

                    {plan.savingsNote && (
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                        {plan.savingsNote}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {plan.gifts && plan.gifts.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {plan.gifts.map((gift) => (
                        <div
                          key={gift.id}
                          className="bg-emerald-50/80 rounded-2xl border border-emerald-200 p-3 space-y-1.5 transform-gpu transition-colors duration-200 hover:bg-emerald-100/70"
                        >
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-emerald-950 leading-snug">
                              {gift.title}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={onPreviewDocs}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer pl-5"
                          >
                            <span>Xem quà tặng</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm tracking-wide uppercase transition-all duration-150 transform-gpu cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:scale-105 active:scale-95 ${
                      isPopular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                        : isBestValue
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black shadow-md"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
