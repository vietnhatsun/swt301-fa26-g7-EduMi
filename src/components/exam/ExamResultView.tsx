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
  PenTool,
  FileText,
  BookOpen,
  Check,
  X,
  Hourglass,
  CheckSquare,
} from "lucide-react";
import {
  ExamItem,
  ExamQuestion,
  calculateTrueFalseScore,
  isShortAnswerCorrect,
  TrueFalseItem,
} from "./exam-data";
import MathRenderer from "@/components/common/MathRenderer";

function parseUserTf(raw?: string): Record<string, boolean> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
  } catch {}
  return {};
}

interface ExamResultViewProps {
  exam: ExamItem;
  questions: ExamQuestion[];
  userAnswers: Record<string, string>;
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
  const [activeTab, setActiveTab] = useState<
    "all" | "single_choice" | "true_false" | "short_answer" | "essay" | "correct" | "wrong" | "skipped"
  >("all");
  const [expandedExplanation, setExpandedExplanation] = useState<
    Record<string, boolean>
  >({});

  // Categorize questions
  const singleChoiceQuestions = questions.filter(
    (q) => q.type === "single_choice" || (!q.type && q.options && q.options.length > 0)
  );
  const trueFalseQuestions = questions.filter((q) => q.type === "true_false");
  const shortAnswerQuestions = questions.filter((q) => q.type === "short_answer");
  const essayQuestions = questions.filter((q) => q.type === "essay");

  const mcQuestions = [...singleChoiceQuestions, ...trueFalseQuestions];
  const hasEssay = essayQuestions.length > 0;
  const hasTrueFalse = trueFalseQuestions.length > 0;
  const hasShortAnswer = shortAnswerQuestions.length > 0;
  const totalAutoGraded = singleChoiceQuestions.length + trueFalseQuestions.length + shortAnswerQuestions.length;
  const isPureEssay = hasEssay && totalAutoGraded === 0;

  // Auto-graded questions evaluation
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  let earnedAutoPoints = 0;
  let maxAutoPoints = 0;

  // 1. Single Choice (Phần I)
  singleChoiceQuestions.forEach((q) => {
    const qPts = q.points || 0.25;
    maxAutoPoints += qPts;
    const selected = userAnswers[q.id];
    if (!selected) {
      skippedCount++;
    } else if (selected === q.correctAnswer) {
      correctCount++;
      earnedAutoPoints += qPts;
    } else {
      wrongCount++;
    }
  });

  // 2. True / False (Phần II - Bộ GD&ĐT)
  trueFalseQuestions.forEach((q) => {
    const qPts = q.points || 1.0;
    maxAutoPoints += qPts;
    const userTf = parseUserTf(userAnswers[q.id]);
    const tfCount = Object.keys(userTf).length;

    if (tfCount === 0) {
      skippedCount++;
    } else {
      const tfResult = calculateTrueFalseScore(userTf, q.trueFalseItems);
      earnedAutoPoints += tfResult.points;
      if (tfResult.correctCount === tfResult.totalItems) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
  });

  // 3. Short Answer (Phần III)
  shortAnswerQuestions.forEach((q) => {
    const qPts = q.points || 0.5;
    maxAutoPoints += qPts;
    const entered = userAnswers[q.id]?.trim();
    if (!entered) {
      skippedCount++;
    } else if (isShortAnswerCorrect(entered, q.correctAnswer)) {
      correctCount++;
      earnedAutoPoints += qPts;
    } else {
      wrongCount++;
    }
  });

  // 4. Essay evaluation (Phần IV)
  let essaySubmittedCount = 0;
  let essaySkippedCount = 0;

  essayQuestions.forEach((q) => {
    const text = userAnswers[q.id]?.trim();
    if (text) {
      essaySubmittedCount++;
    } else {
      essaySkippedCount++;
      skippedCount++;
    }
  });

  const isDgnl = exam.category === "ĐGNL ĐHQG";
  let finalScore = 0;
  let accuracyPercent = 0;

  if (totalAutoGraded > 0 && maxAutoPoints > 0) {
    accuracyPercent = Math.min(100, Math.round((earnedAutoPoints / maxAutoPoints) * 100));
    if (isDgnl) {
      finalScore = Math.round((earnedAutoPoints / maxAutoPoints) * 1200);
    } else if (hasEssay) {
      finalScore = Number(earnedAutoPoints.toFixed(2));
    } else {
      if (Math.abs(maxAutoPoints - 10) < 0.1) {
        finalScore = Number(earnedAutoPoints.toFixed(2));
      } else {
        finalScore = Number(((earnedAutoPoints / maxAutoPoints) * 10).toFixed(1));
      }
    }
  } else if (isPureEssay) {
    accuracyPercent = essaySubmittedCount > 0 ? 100 : 0;
  }

  // Format time spent
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;
  const formattedTimeSpent = `${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`;

  const toggleExplanation = (qId: string) => {
    setExpandedExplanation((prev) => ({
      ...prev,
      [qId]: !(prev[qId] ?? true),
    }));
  };

  // Filter questions for display
  const filteredQuestions = questions.filter((q) => {
    const isEssayType = q.type === "essay";
    const isShortAnswer = q.type === "short_answer";
    const isTrueFalse = q.type === "true_false";
    const isSingleChoice = q.type === "single_choice" || (!q.type && q.options && q.options.length > 0);

    const userAns = userAnswers[q.id];
    const userText = userAns?.trim();
    const userTf = isTrueFalse ? parseUserTf(userAns) : {};
    const tfCount = Object.keys(userTf).length;

    if (activeTab === "single_choice") return isSingleChoice;
    if (activeTab === "true_false") return isTrueFalse;
    if (activeTab === "short_answer") return isShortAnswer;
    if (activeTab === "essay") return isEssayType;

    if (activeTab === "correct") {
      if (isSingleChoice) return Boolean(userAns) && userAns === q.correctAnswer;
      if (isTrueFalse) {
        const res = calculateTrueFalseScore(userTf, q.trueFalseItems);
        return res.correctCount === res.totalItems;
      }
      if (isShortAnswer) return isShortAnswerCorrect(userText, q.correctAnswer);
      return false;
    }

    if (activeTab === "wrong") {
      if (isSingleChoice) return Boolean(userAns) && userAns !== q.correctAnswer;
      if (isTrueFalse) {
        if (tfCount === 0) return false;
        const res = calculateTrueFalseScore(userTf, q.trueFalseItems);
        return res.correctCount < res.totalItems;
      }
      if (isShortAnswer) return Boolean(userText) && !isShortAnswerCorrect(userText, q.correctAnswer);
      return false;
    }

    if (activeTab === "skipped") {
      if (isSingleChoice) return !userAns;
      if (isTrueFalse) return tfCount === 0;
      if (isShortAnswer) return !userText;
      if (isEssayType) return !userText;
      return !userAns;
    }

    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* ── Top Congratulation Card ── */}
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
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-md border border-emerald-100 min-w-[220px] text-center">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">
              {isPureEssay ? "Trạng thái bài thi" : "Điểm trắc nghiệm"}
            </div>
            {isPureEssay ? (
              <div className="mt-1 flex flex-col items-center">
                <div className="text-2xl sm:text-3xl font-black text-indigo-700">
                  Chờ chấm
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Thang điểm 10
                </span>
              </div>
            ) : (
              <div className="mt-1 text-4xl sm:text-5xl font-black text-[#0d7d6b]">
                {finalScore}
                <span className="text-lg sm:text-xl font-bold text-slate-400">
                  /{isDgnl ? "1200" : "10"}
                </span>
              </div>
            )}

            <div className="mt-1.5 text-xs font-bold text-emerald-700">
              {hasEssay
                ? `Đã nộp ${essaySubmittedCount}/${essayQuestions.length} câu tự luận`
                : `Chính xác ${accuracyPercent}%`}
            </div>
          </div>
        </div>

        {/* 4 Overview Mini Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white/90 p-4 border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-xs font-bold text-slate-600">
                {hasEssay ? "TN Đúng" : "Số câu đúng"}
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {correctCount}{" "}
              <span className="text-xs font-medium text-slate-400">
                /{totalAutoGraded || questions.length}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 p-4 border border-slate-100 shadow-2xs">
            {hasEssay ? (
              <>
                <div className="flex items-center gap-2 text-indigo-600">
                  <PenTool className="h-5 w-5" />
                  <span className="text-xs font-bold text-slate-600">Tự luận đã nộp</span>
                </div>
                <div className="mt-2 text-2xl font-black text-indigo-900">
                  {essaySubmittedCount}{" "}
                  <span className="text-xs font-medium text-slate-400">
                    /{essayQuestions.length} câu
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-rose-500">
                  <XCircle className="h-5 w-5" />
                  <span className="text-xs font-bold text-slate-600">Số câu sai</span>
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  {wrongCount} <span className="text-xs font-medium text-slate-400">câu</span>
                </div>
              </>
            )}
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

        {/* Notice for pending essay grading */}
        {hasEssay && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 text-xs text-indigo-950">
            <Hourglass className="h-5 w-5 shrink-0 text-indigo-600 animate-spin" />
            <div>
              <strong className="font-black text-indigo-950">
                Thông báo bài thi tự luận:
              </strong>{" "}
              Nội dung bài làm tự luận của bạn đã được ghi nhận vào hệ thống và chuyển đến giáo viên bộ môn {exam.subject}. Kết quả chấm chi tiết và nhận xét sẽ được gửi lại trong mục Lịch sử làm bài.
            </div>
          </div>
        )}

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

      {/* ── Filter Tabs for Questions Review ── */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Chi tiết lời giải, bài làm & Đáp án từng câu
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Xem lại bài làm tự luận của bạn và đối chiếu với đáp án mẫu biên soạn bởi giáo viên EduMi
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả ({questions.length})
          </button>

          {singleChoiceQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("single_choice")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "single_choice"
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              ABCD ({singleChoiceQuestions.length})
            </button>
          )}

          {trueFalseQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("true_false")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "true_false"
                  ? "bg-purple-600 text-white"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
            >
              Đúng / Sai ({trueFalseQuestions.length})
            </button>
          )}

          {shortAnswerQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("short_answer")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "short_answer"
                  ? "bg-sky-600 text-white"
                  : "text-sky-700 hover:bg-sky-50"
              }`}
            >
              Điền số ({shortAnswerQuestions.length})
            </button>
          )}

          {hasEssay && (
            <button
              type="button"
              onClick={() => setActiveTab("essay")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "essay"
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-700 hover:bg-indigo-50"
              }`}
            >
              Tự luận ({essayQuestions.length})
            </button>
          )}

          {totalAutoGraded > 0 && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("correct")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "correct"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                Đúng ({correctCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("wrong")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "wrong"
                    ? "bg-rose-600 text-white"
                    : "text-rose-600 hover:bg-rose-50"
                }`}
              >
                Sai ({wrongCount})
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("skipped")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "skipped"
                ? "bg-amber-600 text-white"
                : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            Bỏ qua ({skippedCount})
          </button>
        </div>
      </div>

      {/* ── List of Reviewed Questions ── */}
      <div className="mt-6 space-y-5">
        {filteredQuestions.map((q) => {
          const userAns = userAnswers[q.id];
          const userText = userAns?.trim();
          const isEssayType = q.type === "essay";
          const isShortAnswer = q.type === "short_answer";
          const isTrueFalse = q.type === "true_false";
          const isExpanded = expandedExplanation[q.id] ?? true;

          // Status determination
          let statusBadge: React.ReactNode = null;
          let borderClass = "border-slate-200";

          if (isEssayType) {
            if (!userText) {
              borderClass = "border-amber-200";
              statusBadge = (
                <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-700 border border-amber-200">
                  Chưa làm bài tự luận
                </span>
              );
            } else {
              borderClass = "border-indigo-200";
              statusBadge = (
                <span className="flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-0.5 text-[11px] font-black text-indigo-700 border border-indigo-200">
                  <Hourglass className="h-3 w-3" /> Chờ giáo viên chấm (Tối đa {q.points}đ)
                </span>
              );
            }
          } else if (isTrueFalse) {
            const userTf = parseUserTf(userAns);
            const tfCount = Object.keys(userTf).length;
            const tfRes = calculateTrueFalseScore(userTf, q.trueFalseItems);

            if (tfCount === 0) {
              borderClass = "border-amber-200";
              statusBadge = (
                <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-700 border border-amber-200">
                  Chưa chọn Đúng / Sai
                </span>
              );
            } else if (tfRes.correctCount === tfRes.totalItems) {
              borderClass = "border-emerald-200";
              statusBadge = (
                <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Đúng 4/4 ý (+{tfRes.points}đ)
                </span>
              );
            } else if (tfRes.correctCount > 0) {
              borderClass = "border-purple-200";
              statusBadge = (
                <span className="flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-0.5 text-[11px] font-black text-purple-700 border border-purple-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Đúng {tfRes.correctCount}/{tfRes.totalItems} ý (+{tfRes.points}đ)
                </span>
              );
            } else {
              borderClass = "border-rose-200";
              statusBadge = (
                <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-0.5 text-[11px] font-black text-rose-700 border border-rose-200">
                  <XCircle className="h-3.5 w-3.5" /> Sai 0/{tfRes.totalItems} ý (0đ)
                </span>
              );
            }
          } else if (isShortAnswer) {
            const isCorrect = isShortAnswerCorrect(userText, q.correctAnswer);
            if (!userText) {
              borderClass = "border-amber-200";
              statusBadge = (
                <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-700 border border-amber-200">
                  Chưa điền kết quả
                </span>
              );
            } else if (isCorrect) {
              borderClass = "border-emerald-200";
              statusBadge = (
                <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Đúng (+{q.points}đ)
                </span>
              );
            } else {
              borderClass = "border-rose-200";
              statusBadge = (
                <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-0.5 text-[11px] font-black text-rose-700 border border-rose-200">
                  <XCircle className="h-3.5 w-3.5" /> Sai (0đ)
                </span>
              );
            }
          } else {
            // Multiple choice (single_choice)
            const isCorrect = userAns === q.correctAnswer;
            if (!userAns) {
              borderClass = "border-amber-200";
              statusBadge = (
                <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-700 border border-amber-200">
                  Chưa trả lời
                </span>
              );
            } else if (isCorrect) {
              borderClass = "border-emerald-200";
              statusBadge = (
                <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Đúng (+{q.points}đ)
                </span>
              );
            } else {
              borderClass = "border-rose-200";
              statusBadge = (
                <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-0.5 text-[11px] font-black text-rose-700 border border-rose-200">
                  <XCircle className="h-3.5 w-3.5" /> Sai (0đ)
                </span>
              );
            }
          }

          return (
            <div
              key={q.id}
              className={`overflow-hidden rounded-3xl bg-white p-6 shadow-sm border transition-all ${borderClass}`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-black text-slate-800">
                    Câu {q.questionNumber}:
                  </span>
                  {statusBadge}
                  {isEssayType && (
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-700">
                      Phần IV: Tự luận
                    </span>
                  )}
                  {isTrueFalse && (
                    <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-black text-purple-700">
                      Phần II: Đúng / Sai
                    </span>
                  )}
                  {isShortAnswer && (
                    <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-black text-sky-700">
                      Phần III: Trả lời ngắn
                    </span>
                  )}
                  {!isEssayType && !isTrueFalse && !isShortAnswer && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                      Phần I: TN 4 Lựa chọn
                    </span>
                  )}
                </div>

                {!isEssayType && !isTrueFalse && q.correctAnswer && (
                  <div className="text-xs text-slate-500 font-semibold">
                    Đáp án chuẩn:{" "}
                    <strong className="text-emerald-700 font-black">
                      {q.correctAnswer}
                    </strong>
                  </div>
                )}
              </div>

              {/* Question Content */}
              <div className="mt-3 text-sm sm:text-base font-bold text-slate-800 leading-relaxed whitespace-pre-line">
                <MathRenderer text={q.content} />
              </div>

              {/* ── CASE 1: Multiple Choice Options Display (A, B, C, D) ── */}
              {q.options && q.options.length > 0 && !isTrueFalse && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = userAns === opt.id;
                    const isActualCorrect = q.correctAnswer === opt.id;

                    let optClass = "border-slate-200 bg-white text-slate-700";
                    let badgeClass = "bg-slate-100 text-slate-700";

                    if (isActualCorrect) {
                      optClass =
                        "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-400";
                      badgeClass = "bg-emerald-600 text-white font-black";
                    } else if (isSelected && !isActualCorrect) {
                      optClass =
                        "border-rose-400 bg-rose-50 text-rose-950 line-through";
                      badgeClass = "bg-rose-500 text-white font-black";
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-xs sm:text-sm ${optClass}`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs ${badgeClass}`}
                        >
                          {opt.id}
                        </span>
                        <span className="flex-1">
                          <MathRenderer text={opt.text} />
                        </span>
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
              )}

              {/* ── CASE 2: True / False Sub-items Review ── */}
              {isTrueFalse && q.trueFalseItems && (
                <div className="mt-4 space-y-2.5">
                  {q.trueFalseItems.map((item) => {
                    const userTf = parseUserTf(userAns);
                    const userVal = userTf[item.id];
                    const isSubCorrect = userVal === item.isCorrect;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-3.5 transition text-xs sm:text-sm ${
                          userVal === undefined
                            ? "border-amber-200 bg-amber-50/40"
                            : isSubCorrect
                            ? "border-emerald-200 bg-emerald-50/40"
                            : "border-rose-200 bg-rose-50/40"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-800 mt-0.5">
                              {item.id})
                            </span>
                            <div className="flex-1 font-semibold text-slate-800 leading-relaxed">
                              <MathRenderer text={item.content} />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <div className="text-[11px] font-bold text-slate-600">
                              Bạn chọn:{" "}
                              <span
                                className={`font-black px-2 py-0.5 rounded-md ${
                                  userVal === true
                                    ? "bg-emerald-100 text-emerald-800"
                                    : userVal === false
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-500 italic"
                                }`}
                              >
                                {userVal === true ? "ĐÚNG" : userVal === false ? "SAI" : "Chưa chọn"}
                              </span>
                            </div>

                            <div className="text-[11px] font-bold text-slate-600">
                              Đáp án:{" "}
                              <span
                                className={`font-black px-2 py-0.5 rounded-md ${
                                  item.isCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                                }`}
                              >
                                {item.isCorrect ? "ĐÚNG" : "SAI"}
                              </span>
                            </div>

                            {userVal !== undefined && (
                              isSubCorrect ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                              )
                            )}
                          </div>
                        </div>

                        {/* Sub-item explanation */}
                        {item.explanation && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] font-medium text-slate-600 flex items-start gap-1.5">
                            <Sparkles className="h-3 w-3 text-purple-600 shrink-0 mt-0.5" />
                            <span>{item.explanation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── CASE 3: Short Answer Question Review ── */}
              {isShortAnswer && (
                <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div
                      className={`rounded-xl p-3 border ${
                        !userText
                          ? "bg-amber-50/50 border-amber-200"
                          : isShortAnswerCorrect(userText, q.correctAnswer)
                          ? "bg-emerald-50/70 border-emerald-300"
                          : "bg-rose-50/70 border-rose-300"
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Đáp án của bạn:
                      </span>
                      <p className="mt-1 font-mono font-black text-slate-900 text-base">
                        {userText ? (
                          <span>{userText}</span>
                        ) : (
                          <span className="italic text-slate-400 font-sans">Chưa điền đáp án</span>
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50/80 p-3 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase">
                        Đáp án chuẩn hệ thống:
                      </span>
                      <p className="mt-1 font-mono font-black text-emerald-950 text-base">
                        {q.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Essay Question Review (Student typed text + teacher's model answer) ── */}
              {isEssayType && (
                <div className="mt-4 space-y-3">
                  {/* Student's Written Work */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                      <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                        <PenTool className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Bài làm tự luận của thí sinh:</span>
                      </span>
                      {userText && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {userText.split(/\s+/).length} từ · {userText.length} ký tự
                        </span>
                      )}
                    </div>

                    {userText ? (
                      <div className="rounded-xl bg-white p-4 text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-line border border-slate-100 font-serif">
                        {userText}
                      </div>
                    ) : (
                      <p className="text-xs italic text-slate-400">
                        (Thí sinh chưa nhập bài làm tự luận cho câu này)
                      </p>
                    )}
                  </div>

                  {/* Teacher's Sample Essay / Model Answer */}
                  {q.sampleEssayAnswer && (
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
                      <div className="text-xs font-black uppercase text-indigo-950 mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Dàn ý & Bài viết mẫu tham khảo từ Giáo viên EduMi:</span>
                      </div>
                      <div className="rounded-xl bg-white/90 p-4 text-xs sm:text-sm leading-relaxed text-indigo-950 whitespace-pre-line border border-indigo-100">
                        <MathRenderer text={q.sampleEssayAnswer} />
                      </div>
                    </div>
                  )}

                  {/* Teacher's Rubric / Scoring Criteria */}
                  {q.rubricCriteria && q.rubricCriteria.length > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                      <div className="text-xs font-black uppercase text-amber-950 mb-2 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-amber-700" />
                        <span>Thang điểm & Tiêu chí đánh giá của giáo viên:</span>
                      </div>
                      <div className="space-y-1.5">
                        {q.rubricCriteria.map((criterion, crIdx) => (
                          <div
                            key={crIdx}
                            className="flex items-start gap-2 text-xs font-semibold text-amber-900"
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-[10px] font-black mt-0.5">
                              {crIdx + 1}
                            </span>
                            <span>
                              <MathRenderer text={criterion} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Explanation section toggle */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => toggleExplanation(q.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {isExpanded
                      ? "Ẩn phương pháp giải & Lời giải chi tiết"
                      : "Xem phương pháp giải & Lời giải chi tiết"}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    <strong className="text-emerald-900 font-black block mb-1">
                      💡 Hướng dẫn giải chi tiết từ tổ chuyên môn:
                    </strong>
                    <MathRenderer text={q.explanation} />
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
