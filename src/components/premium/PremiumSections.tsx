"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Sparkles,
  Bot,
  FileCheck,
  Check,
  X,
  Gift,
  CheckCircle2,
  AlertCircle,
  Tag,
  Crown,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Flame,
  ShieldCheck,
  HelpCircle,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES & DATA MODELS
───────────────────────────────────────────────────────────────────────────── */

export type GroupSize = 1 | 2 | 3;

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

interface FeatureRow {
  name: string;
  category: string;
  free: string | boolean;
  skill: string | boolean;
  vip: string | boolean;
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────────────────────── */

export const SUBJECT_PLANS: PricingPlan[] = [
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

export const COMBO_PLANS: PricingPlan[] = [
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

const COMPARISON_FEATURES: FeatureRow[] = [
  {
    name: "Lượt luyện thi trắc nghiệm & đề thi",
    category: "Luyện đề",
    free: "50 lượt cơ bản",
    skill: "Theo khối thi đăng ký",
    vip: "Không giới hạn 8 môn",
  },
  {
    name: "Chấm chữa bài tự luận Văn & giải chi tiết AI",
    category: "AI & Chấm điểm",
    free: false,
    skill: "Theo môn đăng ký",
    vip: "Không giới hạn theo barem Bộ GD",
  },
  {
    name: "Gia sư Capy AI giải đề 24/7 & Mẹo Casio",
    category: "AI & Chấm điểm",
    free: "10 câu / ngày",
    skill: "Ưu tiên khối thi",
    vip: "Không giới hạn 24/7",
  },
  {
    name: "Sổ tay câu hỏi sai & Phân tích ma trận",
    category: "Cá nhân hoá",
    free: "Lưu tối đa 30 câu",
    skill: "Không giới hạn",
    vip: "Tự động tạo đề ôn lại",
  },
  {
    name: "Flashcard Spaced Repetition công thức & lý thuyết",
    category: "Ghi nhớ",
    free: "Bộ thẻ cơ bản",
    skill: "Bộ thẻ theo khối thi",
    vip: "Trọn bộ 3.000+ thẻ công thức",
  },
  {
    name: "Tải đề thi PDF bản in chuẩn A4 kèm đáp án",
    category: "Học liệu",
    free: false,
    skill: "Theo khối thi",
    vip: "Toàn bộ kho 500+ đề",
  },
  {
    name: "Quà tặng Bộ đề ĐGNL & Ebook 100 trường chuyên",
    category: "Quà tặng",
    free: false,
    skill: false,
    vip: "Tặng kèm trọn bộ bản quyền",
  },
  {
    name: "Đồng hành 1-1 & Thưởng ngày học Streak",
    category: "Hỗ trợ",
    free: false,
    skill: "Hỗ trợ 1-1",
    vip: "Tối ưu hóa lộ trình 9+",
  },
];

const FAQ_LIST = [
  {
    question: "Sau khi chuyển khoản bao lâu tài khoản của mình được kích hoạt?",
    answer:
      "Hệ thống EduMi tích hợp cổng thanh toán tự động VietQR. Ngay sau khi bạn hoàn tất giao dịch quét mã, tài khoản sẽ được nâng cấp VIP tự động trong vòng 5 - 30 giây mà không cần chờ duyệt thủ công.",
  },
  {
    question: "Mình có thể học trên nhiều thiết bị (Điện thoại, Laptop, iPad) cùng lúc không?",
    answer:
      "Có! Bạn có thể đăng nhập tài khoản EduMi trên mọi thiết bị có kết nối Internet. Tiến độ học tập, lịch sử làm đề và sổ tay câu hỏi sai sẽ được tự động đồng bộ thời gian thực.",
  },
  {
    question: "Nếu đăng ký gói Nhóm 2 bạn hoặc Nhóm 3-5 bạn thì kích hoạt thế nào?",
    answer:
      "Sau khi thanh toán thành công, hệ thống sẽ cung cấp danh sách mã kích hoạt (Activation Key) tương ứng với số lượng thành viên trong nhóm. Mỗi bạn chỉ cần nhập mã vào tài khoản EduMi của riêng mình để nhận trọn vẹn quyền lợi độc lập.",
  },
  {
    question: "Mình có thể nâng cấp từ gói 1 tháng lên gói 3 tháng hoặc 6 tháng được không?",
    answer:
      "Hoàn toàn được! Bạn có thể nâng cấp bất cứ lúc nào. EduMi sẽ hỗ trợ bảo lưu thời gian còn lại của gói cũ và cộng dồn thêm thời gian của gói mới, kèm chiết khấu bù trừ hợp lý.",
  },
  {
    question: "Gia sư Capy AI có hỗ trợ giải đáp bài tập vận dụng cao 9+ không?",
    answer:
      "Có! Capy AI có khả năng giải thích chi tiết các bài toán phân loại điểm 9+, chỉ ra mẹo bấm máy Casio nhanh, chấm bài tự luận Văn và phân tích các dạng câu hỏi mới trong đề thi 2026.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   1. HEADER SECTION
───────────────────────────────────────────────────────────────────────────── */

/* ── Sparkle Star SVG Helper ── */
function SparkleStar({
  className = "",
  style,
  size = 20,
}: {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`text-amber-300 pointer-events-none select-none ${className}`}
      style={style}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

export function PremiumHeader() {
  return (
    <div className="w-full space-y-5">
      {/* Top Bar: Back Button & Tag */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-emerald-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 transform-gpu hover:scale-105 active:scale-95 cursor-pointer group border border-white"
          title="Quay lại trang chủ EduMi"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Về trang chủ</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-emerald-950 border border-white text-xs font-black shadow-sm transition-transform duration-200 transform-gpu hover:scale-105">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Luyện thi THPT &amp; ĐGNL 2026 • Bứt phá điểm số 9+</span>
        </div>
      </div>

      {/* Hero Title Card with Cute Capy Mascot & Sparkling Stars */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 lg:p-9 shadow-xl border border-emerald-700/60 transform-gpu transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:border-emerald-400/80">
        {/* Soft Background Glowing Halos */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

        {/* ── Sparkling Stars ── */}
        <div className="absolute top-4 left-6 sm:top-6 sm:left-10 animate-[starTwinkle_2.5s_infinite_ease-in-out]">
          <SparkleStar size={24} className="text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.85)]" />
        </div>
        <div className="absolute top-10 left-1/4 sm:left-1/3 animate-[starSparkleSpin_4s_infinite_ease-in-out] opacity-85">
          <SparkleStar size={16} className="text-yellow-200 drop-shadow-[0_0_6px_rgba(254,240,138,0.7)]" style={{ animationDelay: "0.6s" }} />
        </div>
        <div className="absolute bottom-5 left-8 sm:left-14 animate-[starFloat_3s_infinite_ease-in-out]">
          <SparkleStar size={18} className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.75)]" style={{ animationDelay: "1.2s" }} />
        </div>
        <div className="absolute top-4 right-1/3 animate-[starPulseGlow_2.2s_infinite_ease-in-out]">
          <SparkleStar size={14} className="text-emerald-200 drop-shadow-[0_0_6px_rgba(167,243,208,0.8)]" style={{ animationDelay: "0.3s" }} />
        </div>
        <div className="absolute top-5 right-6 sm:right-10 animate-[starTwinkle_2.8s_infinite_ease-in-out]">
          <SparkleStar size={26} className="text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="absolute bottom-4 right-1/4 animate-[starSparkleSpin_3.2s_infinite_ease-in-out] opacity-90">
          <SparkleStar size={18} className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" style={{ animationDelay: "0.9s" }} />
        </div>

        {/* ── Content Container: Title & Capy Mascot ── */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left Column: Title & Information */}
          <div className="text-center md:text-left flex-1 space-y-3.5 max-w-2xl">
            {/* VIP Badge with sparkles */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 text-xs font-black tracking-wider uppercase shadow-xs transition-transform duration-200 transform-gpu hover:scale-105">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
              <span>✨ ĐẶC QUYỀN HỘI VIÊN VIP 2026 ✨</span>
            </div>

            {/* Title with decorative star badge */}
            <div className="relative inline-block">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase drop-shadow-sm">
                BẢNG GIÁ GÓI HỌC
              </h1>
              <div className="absolute -top-3 -right-6 animate-bounce select-none">
                <span className="text-lg">⭐</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-emerald-100/95 font-medium leading-relaxed">
              Mở khóa toàn bộ kho đề thi bản quyền, gia sư Capy AI 24/7 và hệ thống chấm chữa bài thông minh để về đích xuất sắc.
            </p>

            {/* Cute mini feature tags */}
            <div className="pt-1 flex items-center justify-center md:justify-start gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-700/60 border border-emerald-500/40 text-emerald-100 font-bold backdrop-blur-xs shadow-2xs">
                <span>🐾</span> Gia sư Capy AI 24/7
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold backdrop-blur-xs shadow-2xs">
                <span>👑</span> Bứt phá điểm 9+
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-700/60 border border-teal-500/40 text-teal-100 font-bold backdrop-blur-xs shadow-2xs">
                <span>🎯</span> Chuẩn ma trận 2026
              </span>
            </div>
          </div>

          {/* Right Column: Cute Animated Capybara Mascot */}
          <div className="relative flex-shrink-0 flex flex-col items-center select-none group">
            {/* Glowing Halo around Capy */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 to-emerald-400/30 blur-2xl scale-110 pointer-events-none" />

            {/* Speech bubble for Capy */}
            <div className="mb-2 relative px-3.5 py-1.5 rounded-2xl bg-white text-emerald-950 font-black text-xs shadow-lg border border-amber-200 flex items-center gap-1.5 animate-[starFloat_3s_infinite_ease-in-out]">
              <span className="text-amber-500">✨</span>
              <span>Cùng Capy bứt phá 9+ nha!</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-amber-200 rotate-45" />
            </div>

            {/* Mascot Image with Crown & Floating Wave Animation */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 animate-[cappyFloatWave_4s_infinite_ease-in-out] cursor-pointer hover:scale-105 transition-transform duration-300">
              {/* Golden Crown on top of Capy */}
              <div className="absolute -top-3 right-6 z-20 animate-bounce">
                <div className="p-1.5 rounded-full bg-amber-400 border-2 border-amber-200 shadow-md">
                  <Crown className="w-5 h-5 text-amber-950 fill-amber-300" />
                </div>
              </div>

              {/* Little floating stars next to Capy */}
              <div className="absolute -top-1 -left-2 z-10 animate-[starTwinkle_2s_infinite]">
                <SparkleStar size={18} className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.9)]" />
              </div>
              <div className="absolute bottom-4 -right-2 z-10 animate-[starSparkleSpin_3s_infinite]">
                <SparkleStar size={16} className="text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              </div>

              <Image
                src="/Capybara_EduMi_và_bảng_học_tập-removebg-preview.png"
                alt="Capybara VIP Tutor Mascot"
                fill
                className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. DISCOUNTS & PROMO CODE SECTION
───────────────────────────────────────────────────────────────────────────── */

interface PremiumDiscountsProps {
  groupSize: GroupSize;
  onGroupSizeChange: (size: GroupSize) => void;
  appliedDiscount: number;
  appliedCode: string;
  onApplyCode: (code: string, discountPercent: number) => void;
  onRemoveCode: () => void;
}

export function PremiumDiscounts({
  groupSize,
  onGroupSizeChange,
  appliedDiscount,
  appliedCode,
  onApplyCode,
  onRemoveCode,
}: PremiumDiscountsProps) {
  const [inputCode, setInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleApply = (codeToApply?: string) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setErrorMessage("Vui lòng nhập mã ưu đãi.");
      setSuccessMessage("");
      return;
    }

    if (code === "EDUMI5" || code === "GIAM5" || code === "CAPY5") {
      onApplyCode(code, 5);
      setSuccessMessage("Áp dụng mã thành công! Giảm 5% học phí.");
      setErrorMessage("");
    } else if (code === "EDUMI10" || code === "VIP10" || code === "CAPYBARA") {
      onApplyCode(code, 10);
      setSuccessMessage("Tuyệt vời! Áp dụng mã đặc biệt giảm ngay 10%.");
      setErrorMessage("");
    } else if (code.startsWith("EDUMI10-") || code.startsWith("THPT-")) {
      onApplyCode(code, 10);
      setSuccessMessage(`Áp dụng mã giới thiệu [${code}] thành công! Giảm ngay 10%.`);
      setErrorMessage("");
    } else {
      onApplyCode(code, 5);
      setSuccessMessage(`Áp dụng mã [${code}] thành công! Giảm 5% học phí.`);
      setErrorMessage("");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Study Squad Selector */}
      <div className="w-full bg-white rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-5 sm:p-7 space-y-4 transform-gpu transition-[box-shadow,border-color] duration-200 hover:shadow-md hover:border-emerald-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg flex-shrink-0">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
                  ƯU ĐÃI ĐĂNG KÝ HỌC THEO NHÓM (STUDY SQUAD)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider">
                  TIẾT KIỆM ĐẾN 20%
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Rủ bạn cùng bàn đăng ký để chia nhỏ học phí và nhận thêm ngày học VIP!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* 1 Student */}
          <button
            type="button"
            onClick={() => onGroupSizeChange(1)}
            className={`p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between space-y-2.5 transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
              groupSize === 1
                ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                : "bg-slate-50/60 border-slate-200 hover:border-emerald-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-900">1 Học sinh</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Cá nhân
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Học độc lập, toàn quyền sử dụng tài khoản theo thời gian đăng ký.
            </p>
            <div className="pt-1 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Giá tiêu chuẩn niêm yết</span>
            </div>
          </button>

          {/* 2 Students */}
          <button
            type="button"
            onClick={() => onGroupSizeChange(2)}
            className={`p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between space-y-2.5 transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
              groupSize === 2
                ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                : "bg-slate-50/60 border-slate-200 hover:border-amber-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-900">Nhóm 2 bạn</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                GIẢM THÊM 15%
              </span>
            </div>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              Cặp đôi cùng tiến — nhận 2 mã kích hoạt riêng biệt cho 2 tài khoản độc lập.
            </p>
            <div className="pt-1 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tặng thêm +15 ngày học mỗi bạn</span>
            </div>
          </button>

          {/* 3-5 Students */}
          <button
            type="button"
            onClick={() => onGroupSizeChange(3)}
            className={`p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between space-y-2.5 transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
              groupSize === 3
                ? "bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20 shadow-sm"
                : "bg-slate-50/60 border-slate-200 hover:border-rose-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-900">
                Nhóm 3 - 5 bạn
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white">
                GIẢM KHỦNG 20%
              </span>
            </div>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              Biệt đội thủ khoa — trọn bộ tài liệu ôn thi độc quyền + hỗ trợ nhóm 24/7.
            </p>
            <div className="pt-1 text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Tặng +30 ngày học &amp; bộ đề đặc biệt</span>
            </div>
          </button>
        </div>

        {groupSize > 1 && (
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 font-semibold flex items-center justify-between flex-wrap gap-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>
                Đã kích hoạt ưu đãi <strong className="text-amber-900 font-black">{groupSize === 2 ? "Nhóm 2 bạn (-15%)" : "Nhóm 3-5 bạn (-20%)"}</strong>! Học phí sẽ được tự động chia nhỏ khi bạn bấm chọn gói.
              </span>
            </div>
            <span className="text-[11px] bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full font-mono font-bold">
              MÃ: SQUAD{groupSize === 2 ? "15" : "20"}
            </span>
          </div>
        )}
      </div>

      {/* Promo Code Card */}
      <div className="w-full bg-white rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-4 sm:p-5 space-y-3 transform-gpu transition-[box-shadow,border-color] duration-200 hover:shadow-md hover:border-emerald-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApply();
            }}
            className="flex items-center gap-2 flex-1"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="MÃ GIẢM GIÁ (VD: EDUMI10, CAPYBARA)"
                className="w-full h-11 sm:h-12 px-4 rounded-2xl border border-slate-300 font-mono text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 uppercase tracking-wider bg-slate-50/60 focus:bg-white transition-colors duration-150"
              />
              {appliedCode && (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1 animate-in zoom-in-95 duration-150">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  -{appliedDiscount}%
                </span>
              )}
            </div>

            <button
              type="submit"
              className="h-11 sm:h-12 px-5 sm:px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wide uppercase shadow-xs transition-all duration-150 transform-gpu cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0 hover:scale-105 active:scale-95"
            >
              <span>Áp dụng</span>
            </button>

            {appliedCode && (
              <button
                type="button"
                onClick={() => {
                  onRemoveCode();
                  setInputCode("");
                  setSuccessMessage("");
                }}
                className="h-11 sm:h-12 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all duration-150 transform-gpu cursor-pointer flex-shrink-0 hover:scale-105 active:scale-95"
              >
                Hủy
              </button>
            )}
          </form>

          {/* Quick Apply Code Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap sm:justify-end text-xs">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <Tag className="w-3 h-3 text-amber-600" />
              Mã gợi ý:
            </span>
            <button
              type="button"
              onClick={() => {
                setInputCode("EDUMI10");
                handleApply("EDUMI10");
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-mono font-bold text-[11px] transition-all duration-150 transform-gpu cursor-pointer hover:scale-105 active:scale-95"
            >
              EDUMI10 (-10%)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputCode("CAPYBARA");
                handleApply("CAPYBARA");
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono font-bold text-[11px] transition-all duration-150 transform-gpu cursor-pointer hover:scale-105 active:scale-95"
            >
              CAPYBARA (-10%)
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in duration-150">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PRICING PLANS SECTION
───────────────────────────────────────────────────────────────────────────── */

interface PremiumPlansProps {
  appliedDiscount?: number;
  onSelectPlan: (plan: PricingPlan) => void;
  onPreviewDocs: () => void;
}

export function PremiumPlans({
  appliedDiscount = 0,
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
      {/* 1. Gói Theo Tổ Hợp Môn */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-[11px] font-black uppercase mb-1 backdrop-blur-xs shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>GÓI THEO TỔ HỢP MÔN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#092235] tracking-tight">
              Lựa chọn đúng khối thi bạn cần
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/95 font-semibold drop-shadow-xs">
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

      {/* 2. Gói Toàn Diện THPT & ĐGNL */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black uppercase mb-1 border border-amber-300 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-300" />
              <span>GÓI TOÀN DIỆN THPT &amp; ĐGNL 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#092235] tracking-tight">
              Mở khóa toàn bộ tính năng &amp; 500+ đề thi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/95 font-semibold drop-shadow-xs">
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

/* ─────────────────────────────────────────────────────────────────────────────
   4. TRUST, COMPARISON & FAQ SECTION
───────────────────────────────────────────────────────────────────────────── */

export function PremiumTrustAndFaq() {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  return (
    <div className="w-full space-y-8">
      {/* 1. Comparison Table */}
      <div className="w-full bg-white rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-6 sm:p-8 space-y-6 transform-gpu transition-[box-shadow,border-color] duration-200 hover:shadow-md hover:border-emerald-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              <span>SO SÁNH MINH BẠCH</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              BẢNG SO SÁNH QUYỀN LỢI CÁC GÓI TÀI KHOẢN
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Xem rõ chi tiết từng tính năng để chọn gói học phù hợp nhất với mục tiêu của bạn.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTableExpanded(!isTableExpanded)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all duration-150 transform-gpu cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <span>{isTableExpanded ? "Thu gọn" : "Xem chi tiết"}</span>
            {isTableExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isTableExpanded && (
          <div className="overflow-x-auto animate-in fade-in duration-200">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider font-bold text-slate-700">
                  <th className="py-3 px-4 w-2/5">Tính năng &amp; Quyền lợi</th>
                  <th className="py-3 px-3 text-center w-1/5 bg-slate-50 rounded-t-xl">
                    Tài khoản Miễn Phí
                  </th>
                  <th className="py-3 px-3 text-center w-1/5 bg-amber-50/60 rounded-t-xl text-amber-900">
                    Gói Khối Môn
                  </th>
                  <th className="py-3 px-3 text-center w-1/5 bg-emerald-50 rounded-t-xl text-emerald-900 font-black">
                    VIP Toàn Diện 👑
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px] text-slate-800">
                {COMPARISON_FEATURES.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-emerald-50/50 transform-gpu transition-colors duration-150"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">
                        {row.category}
                      </span>
                      {row.name}
                    </td>

                    <td className="py-3.5 px-3 text-center bg-slate-50/40">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-500 font-medium">{row.free}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center bg-amber-50/30">
                      {typeof row.skill === "boolean" ? (
                        row.skill ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                        )
                      ) : (
                        <span className="text-amber-950 font-bold">{row.skill}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center bg-emerald-50/40">
                      {typeof row.vip === "boolean" ? (
                        row.vip ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                        )
                      ) : (
                        <span className="text-emerald-900 font-black">{row.vip}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Streak Challenge & Quality Support */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-3xl border border-amber-200/80 shadow-[0_4px_20px_rgba(245,158,11,0.06)] p-6 sm:p-7 flex flex-col justify-between space-y-4 transform-gpu transition-[transform,box-shadow,border-color] duration-250 ease-out hover:scale-[1.018] hover:-translate-y-1 hover:shadow-lg hover:border-amber-400 group cursor-default">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-105 transform-gpu transition-transform duration-200">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest block">
                  THỬ THÁCH HỌC TẬP EDUMI
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-amber-900 transition-colors duration-200">
                  STREAK 30 NGÀY — TẶNG 15 NGÀY VIP
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed">
              Học tập là sự bền bỉ mỗi ngày! Khi nâng cấp bất kỳ gói nào, chỉ cần duy trì chuỗi Streak 30 ngày học liên tục (làm tối thiểu 1 bài trắc nghiệm/ngày), Capy AI sẽ tự động <strong className="text-slate-900">cộng thêm 15 ngày VIP miễn phí</strong> vào tài khoản của bạn.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2 group-hover:bg-white transition-colors duration-150">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Hơn 1.200+ học viên đã chinh phục thành công thử thách tháng vừa qua!</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-3xl border border-emerald-200/80 shadow-[0_4px_20px_rgba(6,78,59,0.06)] p-6 sm:p-7 flex flex-col justify-between space-y-4 transform-gpu transition-[transform,box-shadow,border-color] duration-250 ease-out hover:scale-[1.018] hover:-translate-y-1 hover:shadow-lg hover:border-emerald-400 group cursor-default">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-105 transform-gpu transition-transform duration-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-widest block">
                  ĐỒNG HÀNH TẬN TÂM
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-900 transition-colors duration-200">
                  HỖ TRỢ GIẢI ĐỀ 1-1 &amp; TỐI ƯU ĐIỂM SỐ
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed">
              EduMi luôn đồng hành sát cánh cùng bạn đến ngày thi tốt nghiệp &amp; ĐGNL cuối cùng. Đội ngũ trợ giảng và giáo viên giỏi luôn sẵn sàng <strong className="text-slate-900">hỗ trợ giải đáp bài tập khó 24/7</strong>, phân tích điểm yếu và hướng dẫn chiến thuật trong phòng thi.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2 group-hover:bg-white transition-colors duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Hỗ trợ giải đáp bài tập 24/7 từ đội ngũ Trợ giảng &amp; Thầy cô giỏi.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
