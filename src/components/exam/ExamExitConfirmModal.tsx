"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { AlertTriangle, LogOut, ArrowLeft } from "lucide-react";

interface ExamExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  answeredCount: number;
  totalQuestions: number;
}

export default function ExamExitConfirmModal({
  isOpen,
  onClose,
  onConfirmExit,
  answeredCount,
  totalQuestions,
}: ExamExitConfirmModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-xl font-black text-slate-900">
            Rời khỏi phòng thi?
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Bạn đã hoàn thành <strong className="text-emerald-700">{answeredCount}/{totalQuestions}</strong> câu hỏi. Nếu bạn rời đi bây giờ, phiên làm bài sẽ tạm dừng và kết quả chưa được nộp.
          </p>
        </div>

        {/* Capybara Note */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white border border-amber-200">
            <Image
              src="/Capybara_ôm_huy_hiệu_ngôi_sao-removebg-preview.png"
              alt="Capybara nhắc nhở"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <p className="font-medium">
            Gia sư Capy: &ldquo;Cố gắng làm nốt để nộp bài nhận điểm thưởng XP nha bạn!&rdquo;
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tiếp tục làm bài</span>
          </button>

          <button
            type="button"
            onClick={onConfirmExit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-black text-white hover:bg-rose-700 shadow-md transition cursor-pointer active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span>Xác nhận rời</span>
          </button>
        </div>
      </div>
    </div>
  );
}
