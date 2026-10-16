"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Clock,
  FileCheck2,
  Trophy,
  Award,
  AlertCircle,
  Play,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ExamItem } from "./exam-data";

interface ExamStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamItem | null;
  mode: "exam" | "practice";
}

export default function ExamStartModal({
  isOpen,
  onClose,
  exam,
  mode,
}: ExamStartModalProps) {
  const router = useRouter();

  // ESC key listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !exam) return null;

  const isExamMode = mode === "exam";

  const handleStart = () => {
    onClose();
    router.push(`/exam/${exam.id}?mode=${mode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header with Vibrant Gradient */}
        <div
          className={`relative p-6 text-white ${
            isExamMode
              ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800"
              : "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
              {isExamMode ? "🎯 Chế độ Thi Thử Bấm Giờ" : "📖 Chế độ Luyện Đề Tự Do"}
            </span>
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-black text-slate-900">
              {exam.difficulty}
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
              Mã đề: {exam.examCode}
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-black leading-tight text-white">
            {exam.cardCode}: {exam.title}
          </h2>
          <p className="mt-1 text-xs font-medium text-white/80">
            Biên soạn bởi: <strong className="text-white">{exam.author}</strong>
          </p>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
              <Clock className="mx-auto h-5 w-5 text-emerald-600" />
              <div className="mt-1 text-[11px] font-bold text-slate-500">Thời gian</div>
              <div className="text-sm font-black text-slate-900">
                {isExamMode ? `${exam.durationMinutes} phút` : "Tự do"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
              <FileCheck2 className="mx-auto h-5 w-5 text-indigo-600" />
              <div className="mt-1 text-[11px] font-bold text-slate-500">Số lượng câu</div>
              <div className="text-sm font-black text-slate-900">{exam.questionCount} câu</div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
              <Trophy className="mx-auto h-5 w-5 text-amber-500" />
              <div className="mt-1 text-[11px] font-bold text-slate-500">Thang điểm</div>
              <div className="text-sm font-black text-slate-900">
                {exam.category === "ĐGNL ĐHQG" ? "1200 điểm" : "10 điểm"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
              <Award className="mx-auto h-5 w-5 text-rose-500" />
              <div className="mt-1 text-[11px] font-bold text-slate-500">Điểm thưởng</div>
              <div className="text-sm font-black text-slate-900">+50 XP</div>
            </div>
          </div>

          {/* Capybara Motivation Speech Bubble */}
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white border border-emerald-200">
              <Image
                src="/Capybara_ôm_huy_hiệu_ngôi_sao-removebg-preview.png"
                alt="Capybara EduMi"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="text-xs text-slate-700 leading-relaxed">
              <div className="font-black text-emerald-900">🐾 Lời nhắn từ Gia sư Capy:</div>
              {isExamMode ? (
                <p className="mt-0.5">
                  &ldquo;Hãy chuẩn bị sẵn giấy nháp, máy tính Casio và chọn một góc học tập thật yên tĩnh.
                  Đồng hồ sẽ đếm ngược ngay khi bạn bấm bắt đầu. Cố gắng đạt điểm 10 nha!&rdquo;
                </p>
              ) : (
                <p className="mt-0.5">
                  &ldquo;Ở chế độ luyện tập, bạn không bị áp lực thời gian. Hãy suy nghĩ kỹ từng câu, sau khi
                  chọn xong có thể xem ngay phương pháp giải chi tiết nhé!&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Rules & Guidelines */}
          <div className="space-y-2 rounded-2xl border border-slate-200 p-4 text-xs text-slate-600">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Quy chế phòng thi EduMi:
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-[11px]">
              <li>Hệ thống <strong>tự động lưu tạm đáp án</strong> mỗi khi bạn chọn câu trả lời.</li>
              {isExamMode && (
                <li>Khi hết thời gian quy định, bài thi sẽ <strong>tự động thu và chấm điểm</strong>.</li>
              )}
              <li>Kết quả thi và xếp hạng sẽ được đồng bộ trực tiếp vào hồ sơ học sinh và Cổng phụ huynh.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-4 px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
          >
            Quay lại
          </button>

          <button
            type="button"
            onClick={handleStart}
            className={`flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-black text-white shadow-md transition hover:shadow-lg cursor-pointer active:scale-95 ${
              isExamMode
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isExamMode ? <Play className="h-4 w-4 fill-white" /> : <BookOpen className="h-4 w-4" />}
            <span>Bắt đầu làm bài ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
