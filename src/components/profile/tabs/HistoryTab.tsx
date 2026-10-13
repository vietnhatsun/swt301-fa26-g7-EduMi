"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  RotateCcw,
  Calendar,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import {
  getExamSubmissions,
  ExamSubmissionRecord,
  getExamAndQuestionsForSubmission,
} from "@/components/exam/exam-storage";
import ExamResultView from "@/components/exam/ExamResultView";
import { ExamItem, ExamQuestion, MOCK_EXAMS, getExamQuestions } from "@/components/exam/exam-data";

interface TestHistoryItem {
  id: string;
  title: string;
  subject: string;
  subjectCode:
    | "math"
    | "literature"
    | "english"
    | "physics"
    | "chemistry"
    | "biology"
    | "history"
    | "geography";
  date: string;
  duration: string;
  score: string;
  rawScore: number;
  correctCount: string;
  status: "Đã hoàn thành" | "Đạt" | "Cần cố gắng";
  badgeColor: string;
  submissionRecord?: ExamSubmissionRecord;
}

export default function HistoryTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [realSubmissions, setRealSubmissions] = useState<ExamSubmissionRecord[]>([]);
  const [reviewModalData, setReviewModalData] = useState<{
    exam: ExamItem;
    questions: ExamQuestion[];
    userAnswers: Record<string, "A" | "B" | "C" | "D">;
    violations: number;
    timeSpentSeconds: number;
    mode: "exam" | "practice";
  } | null>(null);

  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Load real exam submissions from localStorage & listen for updates
  useEffect(() => {
    const loadSubmissions = () => {
      setRealSubmissions(getExamSubmissions());
    };
    loadSubmissions();

    const handleSubmitted = () => {
      loadSubmissions();
    };

    window.addEventListener("edumi_exam_submitted", handleSubmitted);
    window.addEventListener("storage", handleSubmitted);
    return () => {
      window.removeEventListener("edumi_exam_submitted", handleSubmitted);
      window.removeEventListener("storage", handleSubmitted);
    };
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubjectDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const subjectOptions = [
    { id: "all", label: "Tất cả môn học", icon: "📚" },
    { id: "math", label: "Toán học", icon: "📐" },
    { id: "literature", label: "Ngữ văn", icon: "📖" },
    { id: "english", label: "Tiếng Anh", icon: "🇬🇧" },
    { id: "physics", label: "Vật lý", icon: "⚡" },
    { id: "chemistry", label: "Hóa học", icon: "🧪" },
    { id: "biology", label: "Sinh học", icon: "🧬" },
    { id: "history", label: "Lịch sử", icon: "🏛️" },
    { id: "geography", label: "Địa lý", icon: "🌍" },
  ];

  const statusOptions = [
    { id: "all", label: "Tất cả trạng thái", desc: "Tất cả các bài thi đã làm" },
    { id: "Đạt", label: "Đạt chuẩn", desc: "Điểm từ trung bình khá trở lên" },
    { id: "Đã hoàn thành", label: "Đã hoàn thành", desc: "Bài thi đã nộp và chấm điểm" },
    { id: "Cần cố gắng", label: "Cần cố gắng", desc: "Cần ôn tập và rèn luyện thêm" },
  ];

  // Convert real submissions from localStorage into test history items
  const formattedRealHistory: TestHistoryItem[] = realSubmissions.map((sub) => ({
    id: sub.id,
    title: sub.examTitle,
    subject: sub.subject,
    subjectCode: sub.subjectCode,
    date: sub.date,
    duration: sub.duration,
    score: sub.score,
    rawScore: sub.rawScore,
    correctCount: `${sub.correctCount}/${sub.totalQuestions} câu đúng`,
    status: sub.status,
    badgeColor: sub.badgeColor,
    submissionRecord: sub,
  }));

  // Combine real submissions first, followed by default history items
  const combinedHistory = [...formattedRealHistory, ...historyData];

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedSubject !== "all" ||
    selectedStatus !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSelectedStatus("all");
    setIsSubjectDropdownOpen(false);
    setIsStatusDropdownOpen(false);
  };

  const filteredData = combinedHistory.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q);
    const matchesSubject =
      selectedSubject === "all" || item.subjectCode === selectedSubject;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Handle open review modal
  const handleOpenReview = (test: TestHistoryItem) => {
    if (test.submissionRecord) {
      const { exam, questions } = getExamAndQuestionsForSubmission(test.submissionRecord);
      setReviewModalData({
        exam,
        questions,
        userAnswers: test.submissionRecord.userAnswers,
        violations: test.submissionRecord.violations,
        timeSpentSeconds: test.submissionRecord.durationSeconds,
        mode: test.submissionRecord.mode,
      });
      return;
    }

    // Fallback for mock items without stored submissions
    let foundExam = MOCK_EXAMS.find(
      (e) =>
        e.title.toLowerCase().includes(test.title.toLowerCase().slice(0, 15)) ||
        e.subject.toLowerCase() === test.subject.toLowerCase()
    );
    if (!foundExam) {
      foundExam = MOCK_EXAMS[0];
    }

    const examToUse: ExamItem = {
      ...foundExam,
      title: test.title,
      subject: (test.subject as any) || foundExam.subject,
    };

    const questions = getExamQuestions(foundExam.id);
    const mockAnswers: Record<string, "A" | "B" | "C" | "D"> = {};
    const totalQ = questions.length;
    const targetCorrect = Math.min(
      totalQ,
      Math.max(1, Math.round((test.rawScore / 10) * totalQ))
    );

    questions.forEach((q, idx) => {
      if (idx < targetCorrect) {
        mockAnswers[q.id] = q.correctAnswer;
      } else {
        mockAnswers[q.id] = q.correctAnswer === "A" ? "B" : "A";
      }
    });

    setReviewModalData({
      exam: examToUse,
      questions,
      userAnswers: mockAnswers,
      violations: 0,
      timeSpentSeconds: parseInt(test.duration) * 60 || 1800,
      mode: "exam",
    });
  };

  return (
    <div className="space-y-6">
      {/* ── KHUNG BANNER LỊCH SỬ LÀM BÀI (Phong cách Tab Lớp học) ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#059669] to-[#047857] shadow-sm flex items-center justify-between min-h-[115px] sm:min-h-[130px] md:min-h-[140px] px-6 sm:px-8 py-5 sm:py-6">
        {/* Decorative subtle background glow */}
        <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

        {/* ── HIỆU ỨNG BONG BÓNG NỔI (Floating Translucent Glass Bubbles) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div
            className="banner-bubble animate-bubble-1 w-9 h-9"
            style={{ left: "7%", bottom: "14%", animationDuration: "5.5s" }}
          />
          <div
            className="banner-bubble animate-bubble-2 w-5 h-5"
            style={{ left: "21%", top: "14%", animationDuration: "4.2s", animationDelay: "0.8s" }}
          />
          <div
            className="banner-bubble animate-bubble-3 w-4 h-4"
            style={{ left: "37%", top: "26%", animationDuration: "3.8s", animationDelay: "1.4s" }}
          />
          <div
            className="banner-bubble animate-bubble-1 w-10 h-10"
            style={{ left: "48%", bottom: "16%", animationDuration: "6.2s", animationDelay: "0.3s" }}
          />
          <div
            className="banner-bubble animate-bubble-2 w-6 h-6"
            style={{ left: "62%", top: "18%", animationDuration: "4.8s", animationDelay: "1.9s" }}
          />
          <div
            className="banner-bubble animate-bubble-3 w-7 h-7"
            style={{ left: "75%", bottom: "20%", animationDuration: "5.2s", animationDelay: "0.6s" }}
          />
          <div
            className="banner-bubble animate-bubble-1 w-5 h-5"
            style={{ left: "89%", top: "18%", animationDuration: "4.5s", animationDelay: "2.2s" }}
          />
        </div>

        {/* ── HIỆU ỨNG NGÔI SAO LẤP LÁNH ĐỘNG (Twinkling & Sparkling Stars) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-300 w-4 h-4 animate-star-1"
            style={{ left: "4%", top: "18%", animationDelay: "0.2s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-white w-3.5 h-3.5 animate-star-2"
            style={{ left: "33%", bottom: "26%", animationDelay: "0.9s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-200 w-5 h-5 animate-star-3"
            style={{ left: "54%", top: "14%", animationDelay: "1.5s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-emerald-100 w-3 h-3 animate-star-1"
            style={{ left: "68%", bottom: "32%", animationDelay: "2.1s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
        </div>

        {/* Bên trái: Tiêu đề & các chỉ số thống kê tích hợp */}
        <div className="relative z-10 max-w-sm sm:max-w-md md:max-w-xl space-y-1 sm:space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-200/90">
            HỌC TẬP · LỊCH SỬ & BẢNG ĐIỂM
          </p>
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight leading-tight">
            Lịch sử làm bài thi của bạn
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
            Xem lại kết quả, thời gian hoàn thành và lời giải chi tiết của các bài thi đã làm.
          </p>
        </div>

        {/* Bên phải: Mascot chìm sâu tự nhiên vào góc phải banner */}
        <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-64 md:w-80 lg:w-96 h-full overflow-hidden pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src="/classes/banner-classes.jpg"
              alt="Mascot lịch sử làm bài thi EduMi"
              fill
              priority
              sizes="(max-width: 640px) 190px, 360px"
              className="object-cover object-right [mask-image:linear-gradient(to_left,black_65%,transparent)]"
            />
          </div>
        </div>
      </div>

      {/* ── BỘ LỌC BÀI THI (GIỮA BANNER VÀ DANH SÁCH BÀI THI) ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 border border-slate-200/80 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-3">
        {/* Hàng điều khiển: Tìm kiếm + 2 Dropdown */}
        <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between">
          {/* Thanh tìm kiếm */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên đề thi, môn học, chuyên đề..."
              className="w-full pl-9.5 pr-8 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cụm 2 Dropdown (Môn học + Trạng thái) & Nút Đặt lại */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Dropdown 1: Lọc theo môn học */}
            <div className="relative flex-1 sm:flex-initial" ref={subjectDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
                  setIsStatusDropdownOpen(false);
                }}
                className={`inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer w-full sm:w-auto min-w-[145px] ${
                  selectedSubject !== "all"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs font-bold"
                    : "bg-slate-50/70 hover:bg-white border-slate-200/90 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {subjectOptions.find((s) => s.id === selectedSubject)?.label || "Tất cả môn học"}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isSubjectDropdownOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {/* Menu môn học */}
              {isSubjectDropdownOpen && (
                <div className="absolute right-0 sm:left-0 sm:right-auto mt-1.5 w-48 sm:w-52 rounded-2xl bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    Lọc theo môn học
                  </div>
                  <div className="space-y-0.5">
                    {subjectOptions.map((opt) => {
                      const isSelected = selectedSubject === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedSubject(opt.id);
                            setIsSubjectDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-emerald-50 text-emerald-900 font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 2: Lọc theo trạng thái kết quả */}
            <div className="relative flex-1 sm:flex-initial" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  setIsSubjectDropdownOpen(false);
                }}
                className={`inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer w-full sm:w-auto min-w-[155px] ${
                  selectedStatus !== "all"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs font-bold"
                    : "bg-slate-50/70 hover:bg-white border-slate-200/90 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {statusOptions.find((s) => s.id === selectedStatus)?.label || "Tất cả trạng thái"}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isStatusDropdownOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {/* Menu trạng thái */}
              {isStatusDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-52 sm:w-56 rounded-2xl bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    Trạng thái kết quả
                  </div>
                  <div className="space-y-0.5">
                    {statusOptions.map((opt) => {
                      const isSelected = selectedStatus === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(opt.id);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-emerald-50 text-emerald-900 font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-bold">{opt.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Nút Đặt lại bộ lọc */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer shrink-0"
                title="Đặt lại toàn bộ bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* Hàng các chip lọc đang kích hoạt */}
        {isFiltered && (
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2 flex-wrap">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                  Tìm: &ldquo;{searchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-rose-600 cursor-pointer ml-0.5"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSubject !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                  {subjectOptions.find((s) => s.id === selectedSubject)?.icon}{" "}
                  {subjectOptions.find((s) => s.id === selectedSubject)?.label}
                  <button
                    type="button"
                    onClick={() => setSelectedSubject("all")}
                    className="hover:text-rose-600 cursor-pointer ml-0.5"
                    title="Bỏ lọc môn"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedStatus !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                  {statusOptions.find((s) => s.id === selectedStatus)?.label}
                  <button
                    type="button"
                    onClick={() => setSelectedStatus("all")}
                    className="hover:text-rose-600 cursor-pointer ml-0.5"
                    title="Bỏ lọc trạng thái"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Tìm thấy <span className="font-bold text-emerald-700">{filteredData.length}</span> bài thi
            </span>
          </div>
        )}
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
                  <div className="text-sm sm:text-base font-black text-slate-900 text-right">
                    {test.score}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReview(test)}
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

      {/* ── MODAL XEM LẠI BÀI THI & LỜI GIẢI CHI TIẾT ── */}
      {reviewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto bg-slate-50/95 rounded-3xl sm:rounded-[36px] shadow-2xl border border-white/60 p-3 sm:p-6 my-auto">
            {/* Thanh điều hướng cố định trên cùng modal */}
            <div className="sticky top-0 z-20 flex justify-between items-center pb-3 pt-1 px-2 bg-slate-50/95 backdrop-blur border-b border-slate-200/60 mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Lịch sử bài thi & Lời giải chi tiết
              </span>
              <button
                type="button"
                onClick={() => setReviewModalData(null)}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Đóng</span>
              </button>
            </div>

            <ExamResultView
              exam={reviewModalData.exam}
              questions={reviewModalData.questions}
              userAnswers={reviewModalData.userAnswers}
              violations={reviewModalData.violations}
              timeSpentSeconds={reviewModalData.timeSpentSeconds}
              mode={reviewModalData.mode}
              onBack={() => setReviewModalData(null)}
              backLabel="Đóng và quay lại danh sách lịch sử"
              onRetake={() => {
                setReviewModalData(null);
                router.push(`/exam/${reviewModalData.exam.id}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
