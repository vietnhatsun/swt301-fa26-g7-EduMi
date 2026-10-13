"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Award,
} from "lucide-react";
import { ExamItem, ExamQuestion } from "./exam-data";

interface ExamResultViewProps {
  exam: ExamItem;
  questions: ExamQuestion[];
  userAnswers: Record<string, "A" | "B" | "C" | "D">;
  violations: number;
  timeSpentSeconds: number;
  onRetake: () => void;
  onBack?: () => void;
  backLabel?: string;
  mode: "exam" | "practice";
}

export default function ExamResultView({
  exam,
  questions,
  userAnswers,
  violations,
  timeSpentSeconds,
  onRetake,
  onBack,
  backLabel,
  mode,
}: ExamResultViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "correct" | "wrong" | "skipped">("all");
  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});

  // Calculation
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  questions.forEach((q) => {
    const selected = userAnswers[q.id];
    if (!selected) {
      skippedCount++;
    } else if (selected === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalQuestions = questions.length;
  const isDgnl = exam.category === "ĐGNL ĐHQG";
  const rawScore = totalQuestions > 0 ? (correctCount / totalQuestions) * (isDgnl ? 1200 : 10) : 0;
  const finalScore = isDgnl ? Math.round(rawScore) : Number(rawScore.toFixed(2));
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Format time spent
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;
  const formattedTimeSpent = `${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`;

  const toggleExplanation = (qId: string) => {
    setExpandedExplanation((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const filteredQuestions = questions.filter((q) => {
    const selected = userAnswers[q.id];
    if (activeTab === "correct") return selected === q.correctAnswer;
    if (activeTab === "wrong") return selected && selected !== q.correctAnswer;
    if (activeTab === "skipped") return !selected;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Top Congratulation Card */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/60 p-8 shadow-xl border border-emerald-100">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-white border-2 border-emerald-200 shadow-md">
              <Image
                src="/Capybara_ôm_huy_hiệu_ngôi_sao-removebg-preview.png"
                alt="Capybara chúc mừng"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white uppercase tracking-wider">
                  {mode === "exam" ? "Hoàn thành bài thi" : "Hoàn thành luyện tập"}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-slate-900">
                  <Award className="h-3.5 w-3.5" /> +50 XP
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {exam.cardCode}: {exam.title}
              </h1>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Mã phòng thi: <strong className="text-slate-800">{exam.examCode}</strong> · Biên soạn: <strong className="text-slate-800">{exam.author}</strong>
              </p>
            </div>
          </div>

          {/* Big Score Box */}
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-md border border-emerald-100 min-w-[200px] text-center">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">
              Điểm số của bạn
            </div>
            <div className="mt-1 text-4xl sm:text-5xl font-black text-[#0d7d6b]">
              {finalScore}
              <span className="text-lg sm:text-xl font-bold text-slate-400">
                /{isDgnl ? "1200" : "10"}
              </span>
            </div>
            <div className="mt-1.5 text-xs font-bold text-emerald-700">
              Chính xác {accuracyPercent}%
            </div>
          </div>
        </div>

        {/* 4 Overview Mini Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white/90 p-4 border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-xs font-bold text-slate-600">Số câu đúng</span>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {correctCount} <span className="text-xs font-medium text-slate-400">/{totalQuestions}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 p-4 border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2 text-rose-500">
              <XCircle className="h-5 w-5" />
              <span className="text-xs font-bold text-slate-600">Số câu sai</span>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {wrongCount} <span className="text-xs font-medium text-slate-400">câu</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 p-4 border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-500">
              <Clock className="h-5 w-5" />
              <span className="text-xs font-bold text-slate-600">Thời gian làm</span>
            </div>
            <div className="mt-2 text-base sm:text-lg font-black text-slate-900 truncate">
              {formattedTimeSpent}
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 p-4 border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-600">Tính trung thực</span>
            </div>
            <div className="mt-2 text-sm font-black text-slate-900">
              {violations === 0 ? (
                <span className="text-emerald-600">100% Tuyệt đối</span>
              ) : (
                <span className="text-rose-600">{violations} lần rời tab</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLabel || "Quay lại danh sách lịch sử"}</span>
            </button>
          ) : (
            <Link
              href="/exam"
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLabel || "Trở về Sảnh phòng thi"}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={onRetake}
            className="flex items-center gap-2 rounded-2xl bg-[#0d7d6b] hover:bg-[#0a6657] px-6 py-2.5 text-xs font-black text-white shadow-md transition cursor-pointer active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Làm lại đề này</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs for Questions Review */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Chi tiết lời giải & Đáp án từng câu
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Xem lại phương pháp giải chi tiết biên soạn bởi các thầy cô EduMi
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả ({totalQuestions})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("correct")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "correct" ? "bg-emerald-600 text-white" : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            Đúng ({correctCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wrong")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "wrong" ? "bg-rose-600 text-white" : "text-rose-600 hover:bg-rose-50"
            }`}
          >
            Sai ({wrongCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("skipped")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "skipped" ? "bg-amber-600 text-white" : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            Bỏ qua ({skippedCount})
          </button>
        </div>
      </div>

      {/* List of Reviewed Questions */}
      <div className="mt-6 space-y-4">
        {filteredQuestions.map((q) => {
          const userAns = userAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          const isSkipped = !userAns;
          const isExpanded = expandedExplanation[q.id] ?? true; // default expanded

          return (
            <div
              key={q.id}
              className={`overflow-hidden rounded-3xl bg-white p-6 shadow-sm border transition-all ${
                isSkipped
                  ? "border-amber-200"
                  : isCorrect
                  ? "border-emerald-200"
                  : "border-rose-200"
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-black text-slate-800">
                    Câu {q.questionNumber}:
                  </span>
                  {isSkipped ? (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-black text-amber-700 border border-amber-200">
                      Chưa trả lời
                    </span>
                  ) : isCorrect ? (
                    <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-black text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Đúng (+{q.points}đ)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-black text-rose-700 border border-rose-200">
                      <XCircle className="h-3.5 w-3.5" /> Sai (0đ)
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-semibold">
                  Đáp án đúng: <strong className="text-emerald-700 font-black">{q.correctAnswer}</strong>
                </div>
              </div>

              {/* Question Content */}
              <div className="mt-3 text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                {q.content}
              </div>

              {/* Options */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt) => {
                  const isSelected = userAns === opt.id;
                  const isActualCorrect = q.correctAnswer === opt.id;

                  let optClass = "border-slate-200 bg-white text-slate-700";
                  let badgeClass = "bg-slate-100 text-slate-700";

                  if (isActualCorrect) {
                    optClass = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-400";
                    badgeClass = "bg-emerald-600 text-white font-black";
                  } else if (isSelected && !isActualCorrect) {
                    optClass = "border-rose-400 bg-rose-50 text-rose-950 line-through";
                    badgeClass = "bg-rose-500 text-white font-black";
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-xs sm:text-sm ${optClass}`}
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs ${badgeClass}`}>
                        {opt.id}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                      {isActualCorrect && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      )}
                      {isSelected && !isActualCorrect && (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation section toggle */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => toggleExplanation(q.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isExpanded ? "Ẩn phương pháp giải" : "Xem phương pháp giải chi tiết"}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="mt-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong className="text-emerald-900 font-black block mb-1">
                      💡 Hướng dẫn giải chi tiết:
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
