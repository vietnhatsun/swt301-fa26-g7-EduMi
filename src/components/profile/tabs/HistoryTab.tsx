"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  RotateCcw,
  Award,
  Sparkles,
  ChevronRight,
  Calendar,
} from "lucide-react";

interface TestHistoryItem {
  id: string;
  title: string;
  subject: string;
  subjectCode: "math" | "literature" | "english" | "physics";
  date: string;
  duration: string;
  score: string;
  rawScore: number;
  correctCount: string;
  status: "Đã hoàn thành" | "Đạt" | "Cần cố gắng";
  badgeColor: string;
}

export default function HistoryTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const historyData: TestHistoryItem[] = [
    {
      id: "1",
      title: "Đề thi thử THPT Quốc Gia môn Tiếng Anh - Đề số 04",
      subject: "Tiếng Anh",
      subjectCode: "english",
      date: "20/09/2026",
      duration: "52 phút",
      score: "8.5 / 10",
      rawScore: 8.5,
      correctCount: "42/50 câu đúng",
      status: "Đã hoàn thành",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "2",
      title: "Quiz từ vựng Unit 3: Environmental Protection",
      subject: "Tiếng Anh",
      subjectCode: "english",
      date: "19/09/2026",
      duration: "18 phút",
      score: "18 / 20",
      rawScore: 9.0,
      correctCount: "18/20 câu đúng",
      status: "Đạt",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "3",
      title: "Đề kiểm tra 1 tiết Toán 12: Chuyên đề Khảo sát hàm số",
      subject: "Toán học",
      subjectCode: "math",
      date: "18/09/2026",
      duration: "45 phút",
      score: "8.8 / 10",
      rawScore: 8.8,
      correctCount: "44/50 câu đúng",
      status: "Đạt",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "4",
      title: "Mini-test Đọc hiểu: Reading Passage 2 (Academic)",
      subject: "Tiếng Anh",
      subjectCode: "english",
      date: "17/09/2026",
      duration: "25 phút",
      score: "11 / 13",
      rawScore: 8.4,
      correctCount: "11/13 câu đúng",
      status: "Đạt",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "5",
      title: "Bài tập rèn luyện Vật lý: Dao động điều hòa & Con lắc lò xo",
      subject: "Vật lý",
      subjectCode: "physics",
      date: "15/09/2026",
      duration: "40 phút",
      score: "7.6 / 10",
      rawScore: 7.6,
      correctCount: "30/40 câu đúng",
      status: "Đạt",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "6",
      title: "Đề luyện thi thử Ngữ văn: Phân tích đoạn trích Đất Nước",
      subject: "Ngữ văn",
      subjectCode: "literature",
      date: "12/09/2026",
      duration: "90 phút",
      score: "8.0 / 10",
      rawScore: 8.0,
      correctCount: "Đạt chuẩn yêu cầu",
      status: "Đã hoàn thành",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "7",
      title: "Đề thi thử THPT Quốc Gia môn Toán - Đề số 02 (Đại học Sư phạm)",
      subject: "Toán học",
      subjectCode: "math",
      date: "10/09/2026",
      duration: "88 phút",
      score: "8.2 / 10",
      rawScore: 8.2,
      correctCount: "41/50 câu đúng",
      status: "Đạt",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  const subjects = [
    { id: "all", label: "Tất cả môn" },
    { id: "math", label: "Toán học" },
    { id: "literature", label: "Ngữ văn" },
    { id: "english", label: "Tiếng Anh" },
    { id: "physics", label: "Vật lý" },
  ];

  const filteredData = historyData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || item.subjectCode === selectedSubject;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          HỌC TẬP · LỊCH SỬ & BẢNG ĐIỂM
        </p>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Lịch sử làm bài thi 📝
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Xem lại kết quả, thời gian hoàn thành và lời giải chi tiết của các bài thi đã làm.
        </p>
      </div>

      {/* ── Stats Summary Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.03)]">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold">Đề đã làm</span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {historyData.length} <span className="text-xs font-medium text-slate-400">bài thi</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.03)]">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold">Điểm trung bình</span>
          </div>
          <div className="text-xl font-black text-slate-900">
            8.4 <span className="text-xs font-medium text-slate-400">/ 10</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.03)]">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold">Điểm cao nhất</span>
          </div>
          <div className="text-xl font-black text-emerald-700">
            9.0 <span className="text-xs font-medium text-slate-400">/ 10</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.03)]">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold">Tỉ lệ đạt</span>
          </div>
          <div className="text-xl font-black text-emerald-700">
            100%
          </div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.03)] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên đề thi, chuyên đề..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedSubject === sub.id
                    ? "bg-[#064e3b] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── History List ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">
            Danh sách bài thi ({filteredData.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Sắp xếp theo: Gần đây nhất
          </span>
        </div>

        {filteredData.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">Không tìm thấy bài thi nào phù hợp</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/70 hover:border-emerald-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 text-[10px] font-bold">
                        {test.subject}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {test.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {test.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {test.duration}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">
                        {test.correctCount}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-black text-slate-900">
                      {test.score}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${test.badgeColor}`}
                    >
                      {test.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 hover:border-emerald-600 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem lại</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
