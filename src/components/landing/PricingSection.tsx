"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Zap,
} from "lucide-react";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      id: "free",
      name: "Gói Khởi Động",
      badge: "Trải nghiệm",
      badgeColor: "bg-slate-100 text-slate-700",
      desc: "Phù hợp để làm quen với nền tảng và kiểm tra trình độ ban đầu.",
      price: "0",
      priceLabel: "Miễn phí vĩnh viễn",
      isPopular: false,
      features: [
        "50 lượt thi thử đề cơ bản",
        "Bộ Flashcard từ vựng cộng đồng",
        "Phòng thi thử trực tuyến có bấm giờ",
        "Gia sư Capy AI hỗ trợ 10 câu/ngày",
        "Xem đáp án và bảng điểm",
      ],
      ctaText: "Đăng ký miễn phí",
      ctaLink: "/register",
    },
    {
      id: "pro",
      name: "Gói Bứt Phá THPT 2026",
      badge: "Được yêu thích nhất 🔥",
      badgeColor: "bg-amber-100 text-amber-900 border border-amber-300",
      desc: "Gói học toàn diện nhất để đạt mục tiêu điểm 8.0 - 9.5+ trong kỳ thi THPT & ĐGNL.",
      price: billingCycle === "yearly" ? "990.000" : "199.000",
      priceLabel: billingCycle === "yearly" ? "đ / trọn năm học (Chỉ 82k/tháng)" : "đ / tháng",
      isPopular: true,
      features: [
        "Trọn bộ 500+ đề thi chuẩn ma trận mới 2026",
        "Không giới hạn số lần thi thử & xem lời giải chi tiết",
        "Flashcard Spaced Repetition thông minh",
        "Sổ tay câu hỏi sai tự động lưu & tạo đề ôn lại",
        "Trợ lý Capy AI giải đề không giới hạn 24/7",
        "Tải đề thi PDF bản in chuẩn A4",
        "Bảng xếp hạng năng lực học sinh toàn quốc",
      ],
      ctaText: "Chọn gói Bứt Phá",
      ctaLink: "/register",
    },
    {
      id: "vip",
      name: "Gói VIP Toàn Diện",
      badge: "Kèm lớp học trực tuyến",
      badgeColor: "bg-teal-100 text-teal-900 border border-teal-300",
      desc: "Dành cho học sinh đặt mục tiêu trường Đại học top 1 (FTU, Bách Khoa, Y Dược...).",
      price: billingCycle === "yearly" ? "1.490.000" : "299.000",
      priceLabel: billingCycle === "yearly" ? "đ / trọn năm học" : "đ / tháng",
      isPopular: false,
      features: [
        "Bao gồm toàn bộ quyền lợi của Gói Bứt Phá",
        "Tham gia các lớp học trực tuyến cùng thầy cô giỏi",
        "Lưu trữ và xem lại video record bài giảng 24/7",
        "Chấm chữa chi tiết bài tự luận Văn & Tiếng Anh",
        "Tài liệu độc quyền vận dụng cao điểm 9+",
        "Hỗ trợ tư vấn chọn ngành & trường xét tuyển",
      ],
      ctaText: "Đăng ký gói VIP",
      ctaLink: "/register",
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHI PHÍ HỢP LÝ · MINH BẠCH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Đầu tư cho tương lai với <br className="hidden sm:inline" />
            <span className="text-emerald-700">mức học phí tiết kiệm nhất</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Chỉ từ vài nghìn đồng mỗi ngày để sở hữu trọn bộ công cụ luyện thi thông minh và đồng hành cùng Capy.
          </p>

          {/* Billing Toggle (Monthly / Yearly) */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-[#f1f5f9] p-1 rounded-full flex items-center border border-slate-200">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Gói theo tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Gói cả năm</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950">
                  -58%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                p.isPopular
                  ? "bg-gradient-to-b from-white to-emerald-50/40 border-2 border-emerald-500 shadow-[0_16px_48px_rgba(6,78,59,0.12)] lg:-translate-y-2"
                  : "bg-[#f8faf8] border border-emerald-100/80 shadow-[0_4px_24px_rgba(6,78,59,0.04)] hover:shadow-lg"
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] shadow-sm uppercase tracking-wider">
                  Khuyên dùng cho kỳ thi 2026
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${p.badgeColor}`}
                  >
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">
                  {p.desc}
                </p>

                {/* Price Display */}
                <div className="my-6 pb-6 border-b border-slate-200/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {p.price}
                    </span>
                    {p.price !== "0" && (
                      <span className="text-sm font-bold text-slate-500">đ</span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-800 font-bold mt-1">
                    {p.priceLabel}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <Link
                  href={p.ctaLink}
                  className={`w-full py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                    p.isPopular
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
                      : "bg-white hover:bg-emerald-50 text-slate-800 border border-slate-300 hover:border-emerald-300"
                  }`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Payment guarantee note */}
        <div className="mt-12 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Thanh toán an toàn SePay / VietQR
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-600">
            <QrCode className="w-4 h-4 text-emerald-600" />
            Kích hoạt tài khoản tự động sau 5 giây
          </span>
          <span>•</span>
          <span className="font-semibold text-slate-600">
            Hỗ trợ giải đáp 24/7 hotline 1900 8888
          </span>
        </div>
      </div>
    </section>
  );
}
