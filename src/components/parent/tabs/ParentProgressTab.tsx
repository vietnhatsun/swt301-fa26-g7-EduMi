"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  ChevronDown,
  Check,
  Target,
  BookOpen,
  Award,
} from "lucide-react";
import ParentEmptyChildState from "@/components/parent/ParentEmptyChildState";

/* ── Mock data ── */

const SUBJECTS = [
  {
    subject: "Toán học",
    icon: "📐",
    subjectCode: "math",
    courseName: "Luyện Thi THPT QG Toán 2026",
    totalLessons: 48,
    completedLessons: 44,
    progressPercent: 92,
    averageScore: 8.6,
    totalTestsTaken: 12,
    accuracy: 88,
    trend: "improving" as const,
    weakTopics: ["Hình học không gian", "Tổ hợp Xác suất"],
    recentScores: [7.5, 8.0, 8.2, 8.5, 9.0, 8.6],
  },
  {
    subject: "Vật lý",
    icon: "⚡",
    subjectCode: "physics",
    courseName: "Chuyên đề Vật lý THPT QG",
    totalLessons: 36,
    completedLessons: 25,
    progressPercent: 70,
    averageScore: 7.8,
    totalTestsTaken: 8,
    accuracy: 76,
    trend: "improving" as const,
    weakTopics: ["Điện xoay chiều", "Sóng cơ"],
    recentScores: [6.5, 7.0, 7.5, 7.8, 8.0, 7.8],
  },
  {
    subject: "Tiếng Anh",
    icon: "🌍",
    subjectCode: "english",
    courseName: "IELTS Preparation Band 7.0+",
    totalLessons: 60,
    completedLessons: 36,
    progressPercent: 60,
    averageScore: 8.2,
    totalTestsTaken: 5,
    accuracy: 82,
    trend: "stable" as const,
    weakTopics: ["Writing Task 2", "Speaking Part 3"],
    recentScores: [8.0, 8.5, 8.0, 8.2, 8.2],
  },
  {
    subject: "Ngữ văn",
    icon: "📝",
    subjectCode: "literature",
    courseName: "Ôn thi Ngữ văn THPT QG",
    totalLessons: 30,
    completedLessons: 14,
    progressPercent: 45,
    averageScore: 7.0,
    totalTestsTaken: 3,
    accuracy: 70,
    trend: "declining" as const,
    weakTopics: ["Nghị luận xã hội", "Phân tích thơ"],
    recentScores: [7.5, 7.0, 6.5],
  },
];

const TEST_HISTORY = [
  {
    id: "1",
    title: "Đề thi thử THPT QG Toán - Đề 04",
    subject: "Toán học",
    subjectIcon: "📐",
    score: 8.5,
    maxScore: 10,
    correctAnswers: 42,
    totalQuestions: 50,
    durationMinutes: 52,
    completedAt: "06/10/2026",
    weakTopics: ["Hình học không gian"],
    status: "passed" as const,
  },
  {
    id: "2",
    title: "Đề thi Dao động điều hòa - Kiểm tra chương",
    subject: "Vật lý",
    subjectIcon: "⚡",
    score: 9.0,
    maxScore: 10,
    correctAnswers: 27,
    totalQuestions: 30,
    durationMinutes: 28,
    completedAt: "06/10/2026",
    weakTopics: [],
    status: "passed" as const,
  },
  {
    id: "3",
    title: "IELTS Mock Test - Reading Section",
    subject: "Tiếng Anh",
    subjectIcon: "🌍",
    score: 7.5,
    maxScore: 10,
    correctAnswers: 30,
    totalQuestions: 40,
    durationMinutes: 60,
    completedAt: "05/10/2026",
    weakTopics: ["Matching Headings", "True/False/Not Given"],
    status: "needs_improvement" as const,
  },
  {
    id: "4",
    title: "Đề thi thử THPT QG Toán - Đề 03",
    subject: "Toán học",
    subjectIcon: "📐",
    score: 9.0,
    maxScore: 10,
    correctAnswers: 45,
    totalQuestions: 50,
    durationMinutes: 48,
    completedAt: "04/10/2026",
    weakTopics: [],
    status: "passed" as const,
  },
  {
    id: "5",
    title: "Kiểm tra Sóng cơ - Chuyên đề",
    subject: "Vật lý",
    subjectIcon: "⚡",
    score: 6.5,
    maxScore: 10,
    correctAnswers: 13,
    totalQuestions: 20,
    durationMinutes: 25,
    completedAt: "03/10/2026",
    weakTopics: ["Giao thoa sóng", "Sóng dừng"],
    status: "needs_improvement" as const,
  },
];

interface ParentProgressTabProps {
  childName?: string;
  onNavigateTab?: (tab: string) => void;
  onQuickLink?: (code: string) => void;
}

export default function ParentProgressTab({
  childName,
  onNavigateTab,
  onQuickLink,
}: ParentProgressTabProps) {
  if (!childName) {
    return (
      <ParentEmptyChildState
        title="Chưa có dữ liệu tiến độ môn học"
        description="Vui lòng liên kết tài khoản học sinh để theo dõi chi tiết điểm số, độ chính xác bài kiểm tra và các chuyên đề cần cải thiện của con."
        onNavigateTab={onNavigateTab || (() => {})}
        onQuickLink={onQuickLink}
      />
    );
  }

  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  const filteredTests =
    selectedSubject === "all"
      ? TEST_HISTORY
      : TEST_HISTORY.filter((t) => t.subject === selectedSubject);

  const subjectOptions = [
    { id: "all", label: "Tất cả môn học", icon: "📚" },
    ...SUBJECTS.map((s) => ({ id: s.subject, label: s.subject, icon: s.icon })),
  ];

  const activeOption = subjectOptions.find((s) => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          CỔNG PHỤ HUYNH · BÁO CÁO TIẾN ĐỘ
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Tiến độ & Bảng điểm chi tiết
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi mức độ tiến bộ qua từng buổi luyện đề và bài tập của con.
        </p>
      </div>

      {/* ── Subject Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUBJECTS.map((sub, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{sub.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{sub.subject}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{sub.courseName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {sub.trend === "improving" && <TrendingUp className="w-4 h-4 text-emerald-600" />}
                {sub.trend === "declining" && <TrendingUp className="w-4 h-4 text-rose-500 rotate-180" />}
                {sub.trend === "stable" && <span className="text-xs text-slate-400 font-bold">—</span>}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500">
                  Tiến độ khóa học
                </span>
                <span className="text-[10px] font-bold text-emerald-700">
                  {sub.completedLessons}/{sub.totalLessons} bài · {sub.progressPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                  style={{ width: `${sub.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Mini stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-lg bg-slate-50">
                <p className="text-lg font-black text-slate-900">{sub.averageScore}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Điểm TB</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-50">
                <p className="text-lg font-black text-slate-900">{sub.accuracy}%</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Chính xác</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-50">
                <p className="text-lg font-black text-slate-900">{sub.totalTestsTaken}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Bài thi</p>
              </div>
            </div>

            {/* Weak topics */}
            {sub.weakTopics.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  <Target className="w-3 h-3 text-amber-500" />
                  Chủ đề cần cải thiện
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sub.weakTopics.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mini score chart (simple bar visualization) */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 mb-2">
                Điểm các bài gần đây
              </p>
              <div className="flex items-end gap-1 h-10">
                {sub.recentScores.map((score, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{ height: `${(score / 10) * 100}%` }}
                    title={`${score}/10`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Test History Table ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Lịch Sử Bài Kiểm Tra
            </h3>
          </div>

          {/* Subject filter dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <span>{activeOption?.icon}</span>
              <span className="hidden sm:inline">{activeOption?.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSubjectDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isSubjectDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSubjectDropdownOpen(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50">
                  {subjectOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(opt.id);
                        setIsSubjectDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                        selectedSubject === opt.id
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span className="flex-1">{opt.label}</span>
                      {selectedSubject === opt.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="pb-3">Bài kiểm tra</th>
                <th className="pb-3 text-center hidden sm:table-cell">Môn</th>
                <th className="pb-3 text-center">Điểm</th>
                <th className="pb-3 text-center hidden md:table-cell">Câu đúng</th>
                <th className="pb-3 text-center hidden md:table-cell">Thời gian</th>
                <th className="pb-3 text-right">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate max-w-[200px] sm:max-w-none">
                      {test.title}
                    </p>
                    {test.weakTopics.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {test.weakTopics.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[9px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 text-center hidden sm:table-cell">
                    <span className="text-sm">{test.subjectIcon}</span>
                  </td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`text-sm font-black ${
                        test.score >= 8
                          ? "text-emerald-700"
                          : test.score >= 6.5
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {test.score}
                    </span>
                    <span className="text-slate-400 text-[10px] font-medium">/{test.maxScore}</span>
                  </td>
                  <td className="py-3.5 text-center text-slate-600 font-semibold hidden md:table-cell">
                    {test.correctAnswers}/{test.totalQuestions}
                  </td>
                  <td className="py-3.5 text-center text-slate-600 font-semibold hidden md:table-cell">
                    {test.durationMinutes} phút
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="text-xs text-slate-500 font-medium">{test.completedAt}</span>
                    <div className="mt-0.5">
                      {test.status === "passed" ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                          <Award className="w-2.5 h-2.5" /> Đạt
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                          Cần cải thiện
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
