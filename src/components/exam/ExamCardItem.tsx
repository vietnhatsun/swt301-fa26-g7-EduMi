"use client";

import React, { useState } from "react";
import {
  Star,
  Clock,
  ChevronRight,
  Play,
  Copy,
  Check,
} from "lucide-react";
import { ExamItem, ExamPatternType } from "./exam-data";

function ExamPattern({ pattern }: { pattern: ExamPatternType }) {
  if (pattern === "waves") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-50,80 Q50,20 150,100 T350,60" fill="none" stroke="white" strokeWidth="34" strokeLinecap="round" />
        <path d="M-30,220 Q70,150 170,230 T370,190" fill="none" stroke="white" strokeWidth="38" strokeLinecap="round" />
        <path d="M-40,360 Q60,300 160,370 T360,330" fill="none" stroke="white" strokeWidth="32" strokeLinecap="round" />
      </svg>
    );
  }

  if (pattern === "clouds") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-20,120 C40,65 95,150 145,90 C190,42 245,108 320,82 L320,400 L-20,400 Z" fill="white" />
        <path d="M-35,340 C60,280 95,365 170,315 C230,275 260,350 340,312 L340,420 L-35,420 Z" fill="white" opacity="0.7" />
      </svg>
    );
  }

  if (pattern === "confetti") {
    return (
      <div className="absolute inset-0 opacity-24">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-3 w-12 rotate-45 rounded-full bg-white/45"
            style={{ left: `${22 + (index % 4) * 62}px`, top: `${26 + Math.floor(index / 4) * 82}px` }}
          />
        ))}
      </div>
    );
  }

  if (pattern === "stripes") {
    return <div className="absolute inset-0 opacity-18 [background-image:repeating-linear-gradient(45deg,transparent_0,transparent_24px,white_24px,white_47px)]" />;
  }

  if (pattern === "ripples") {
    return (
      <div className="absolute inset-0 opacity-20">
        <span className="absolute -right-12 top-12 h-40 w-40 rounded-full border-[24px] border-white" />
        <span className="absolute -left-16 bottom-8 h-48 w-48 rounded-full border-[30px] border-white" />
        <span className="absolute bottom-28 right-12 h-24 w-24 rounded-full border-[18px] border-white" />
      </div>
    );
  }

  return <div className="absolute inset-0 opacity-18 [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_22px,white_22px,white_38px)]" />;
}

interface ExamCardItemProps {
  card: ExamItem;
  onOpenModal: (exam: ExamItem, mode?: "exam" | "practice") => void;
}

export default function ExamCardItem({ card, onOpenModal }: ExamCardItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const formattedAttempts = card.attempts.toLocaleString("vi-VN");

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(card.examCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <article
      className={`group relative flex min-h-[365px] select-none flex-col justify-between overflow-hidden rounded-[30px] p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${card.bgClass}`}
    >
      <ExamPattern pattern={card.pattern} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      {/* Header Tag, Mã Phòng Thi (Pill Badge) & Bookmark Star */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 truncate">
          <span className="truncate text-[11px] font-black uppercase tracking-wide text-white/90">
            EDUMI | {card.subject}
          </span>
          {/* Mã phòng thi đặt ngay vị trí pill badge như thẻ tài liệu, click để chép nhanh */}
          <button
            suppressHydrationWarning
            type="button"
            onClick={handleCopyCode}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold transition cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${
              isCopied
                ? "bg-emerald-400 text-slate-950 shadow-xs font-black"
                : "bg-white/20 text-white hover:bg-white/35 backdrop-blur-sm"
            }`}
            title="Nhấp để sao chép Mã phòng thi"
          >
            {isCopied ? (
              <>
                <Check className="h-2.5 w-2.5 stroke-[3]" />
                <span>Đã chép!</span>
              </>
            ) : (
              <>
                <span>MÃ: {card.examCode}</span>
                <Copy className="h-2.5 w-2.5 opacity-80" />
              </>
            )}
          </button>
        </div>

        <button
          suppressHydrationWarning
          type="button"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition cursor-pointer ${
            isBookmarked
              ? "bg-amber-400 text-slate-900 shadow-xs"
              : "bg-black/15 text-white/80 hover:bg-amber-400/90 hover:text-white"
          }`}
          aria-label={isBookmarked ? "Đã lưu đề thi" : "Lưu đề thi"}
          title={isBookmarked ? "Bỏ lưu" : "Lưu vào đề yêu thích"}
        >
          <Star className={`h-3.5 w-3.5 ${isBookmarked ? "fill-slate-900" : ""}`} />
        </button>
      </div>

      {/* Middle Content: Code, Title, Clean Stats (Rút gọn giống tài liệu) */}
      <div className="relative z-10">
        <h2 className="mb-3 text-[33px] font-black uppercase leading-none tracking-[-0.055em] text-white drop-shadow-md transition-transform duration-300 group-hover:scale-[1.03]">
          {card.cardCode}
        </h2>
        <h3 className="line-clamp-2 text-[17px] font-black leading-[1.18] text-white/95 drop-shadow-sm">
          {card.title}
        </h3>

        <div className="mt-5 flex items-center gap-2 text-[12px] font-black text-white/95">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-white text-white" />
            {formattedAttempts} lượt thi
          </span>
          <span className="opacity-70">|</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-white/90" />
            {card.durationMinutes} phút
          </span>
        </div>
      </div>

      {/* Bottom Action Button: Duy nhất nút Vào thi sang trọng, full width */}
      <div className="relative z-10 pt-3">
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => onOpenModal(card, "exam")}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-white px-4 py-3 text-[14px] font-black text-slate-800 shadow-sm transition hover:bg-slate-50 hover:shadow-md cursor-pointer active:scale-95 group/btn"
          title="Vào thi bấm giờ mô phỏng áp lực phòng thi thật"
        >
          <Play className={`h-3.5 w-3.5 ${card.accentClass} fill-current`} />
          <span>Vào thi</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </article>
  );
}
