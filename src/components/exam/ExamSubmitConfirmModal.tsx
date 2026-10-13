"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, AlertCircle, FileCheck, ArrowLeft, Send } from "lucide-react";

interface ExamSubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  answeredCount: number;
  totalQuestions: number;
  violations: number;
  timeRemaining: string;
}

export default function ExamSubmitConfirmModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  answeredCount,
  totalQuestions,
  violations,
  timeRemaining,
}: ExamSubmitConfirmModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;
  const isAllAnswered = unansweredCount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[32px] bg-white p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-[#0d7d6b]">
            <FileCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Xác nhận nộp bài thi
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Hệ thống sẽ chấm điểm tự động và lưu kết quả vào hồ sơ học sinh
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-center">
            <div className="text-[11px] font-bold text-slate-500">Đã trả lời</div>
            <div className="mt-0.5 text-lg font-black text-emerald-600">
              {answeredCount}/{totalQuestions}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-center">
            <div className="text-[11px] font-bold text-slate-500">Chưa trả lời</div>
            <div className={`mt-0.5 text-lg font-black ${unansweredCount > 0 ? "text-amber-600" : "text-slate-400"}`}>
              {unansweredCount} câu
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-center">
            <div className="text-[11px] font-bold text-slate-500">Vi phạm tab</div>
            <div className={`mt-0.5 text-lg font-black ${violations > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {violations} lần
            </div>
          </div>
        </div>

        {/* Warning if unanswered */}
        {!isAllAnswered && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <p>
              Bạn vẫn còn <strong>{unansweredCount} câu chưa chọn đáp án</strong>. Các câu chưa làm sẽ không được tính điểm. Bạn có muốn quay lại kiểm tra không?
            </p>
          </div>
        )}

        {/* Capybara cheering */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-emerald-900">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white border border-emerald-200">
            <Image
              src="/Capybara_ôm_huy_hiệu_ngôi_sao-removebg-preview.png"
              alt="Capybara cổ vũ"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <div className="font-bold text-emerald-950">Gia sư Capy:</div>
            <p className="text-[11px] text-emerald-800">
              {timeRemaining !== "00:00" && `Thời gian còn lại: ${timeRemaining}. `}
              Tự tin nộp bài để xem ngay bảng điểm và lời giải chi tiết nha!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Xem lại bài thi</span>
          </button>

          <button
            type="button"
            onClick={onConfirmSubmit}
            className="flex items-center gap-2 rounded-xl bg-[#0d7d6b] hover:bg-[#0a6657] px-6 py-2.5 text-xs font-black text-white shadow-md transition cursor-pointer active:scale-95"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Nộp bài ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
