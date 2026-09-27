"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  School,
  Calendar,
  Video,
  User,
  CheckCircle2,
  Plus,
  PlayCircle,
  FileText,
  Pin,
  Search,
  ChevronDown,
  X,
  BookOpen,
  Filter,
  Check,
  RotateCcw,
} from "lucide-react";
import { QuickNotesPiPContent, openPiPWindowHelper } from "../QuickNotesPiP";
import { StudySession, NoteCard } from "./NotesTab";

interface OnlineClass {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  coverImage: string;
  teacher: string;
  teacherAvatar?: string;
  schedule: string;
  roomName: string;
  status: "upcoming" | "completed" | "in_progress" | "future";
  learningStatus: "in_progress" | "completed";
  statusLabel: string;
  statusColor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextSessionTime?: string;
  meetUrl?: string;
  hasRecord?: boolean;
}

export default function ClassesTab() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [joinSuccessMsg, setJoinSuccessMsg] = useState("");
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [pipSessions, setPipSessions] = useState<StudySession[]>([]);
  const [activePipSessionId, setActivePipSessionId] = useState<string>("");

  // ── Bộ lọc lớp học (Tìm kiếm + Dropdown Môn học + Dropdown Trạng thái) ──
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "in_progress" | "completed">("all");

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

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

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSelectedStatus("all");
    setIsSubjectDropdownOpen(false);
    setIsStatusDropdownOpen(false);
  };

  const subjectOptions = [
    { id: "all", label: "Tất cả môn học", icon: "📚" },
    { id: "Toán học", label: "Toán học", icon: "📐" },
    { id: "Ngữ văn", label: "Ngữ văn", icon: "📖" },
    { id: "Tiếng Anh", label: "Tiếng Anh", icon: "🇬🇧" },
    { id: "Vật lý", label: "Vật lý", icon: "⚡" },
    { id: "Hóa học", label: "Hóa học", icon: "🧪" },
  ];

  const statusOptions = [
    { id: "all", label: "Tất cả trạng thái", desc: "Tất cả các lớp học" },
    { id: "in_progress", label: "Đang học", desc: "Lớp học đang diễn ra" },
    { id: "completed", label: "Đã học xong", desc: "Lớp học đã hoàn thành" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("edumi_study_sessions");
        if (saved) {
          const parsed = JSON.parse(saved);
          setPipSessions(parsed);
          if (parsed.length > 0) setActivePipSessionId(parsed[0].id);
        }
      } catch (e) {
        console.warn("Failed to load sessions in ClassesTab", e);
      }
    }
  }, []);

  const handleJoinClassWithPiP = async (cls: OnlineClass) => {
    // 1. Open Google Meet in new tab
    window.open(cls.meetUrl || "https://meet.google.com", "_blank");

    // 2. Open PiP window
    const win = await openPiPWindowHelper(390, 620);
    if (win) {
      win.addEventListener("pagehide", () => {
        setPipWindow(null);
      });
      setPipWindow(win);
    }
  };

  const myClasses: OnlineClass[] = [
    {
      id: "cls-01",
      title: "Toán 12: Chuyên đề Hàm số, Tích phân & Logarit VIP",
      subject: "Toán học",
      subjectColor: "bg-blue-50 text-blue-700 border-blue-200",
      coverImage: "/classes/class-math.jpg",
      teacher: "Thầy Đức · Thạc sĩ Sư phạm Toán",
      schedule: "Thứ 2, Thứ 5 (19:30 - 21:00)",
      roomName: "Lớp học ảo EduMi #01 (Google Meet)",
      status: "upcoming",
      learningStatus: "in_progress",
      statusLabel: "Sắp diễn ra hôm nay",
      statusColor: "bg-amber-50 text-amber-800 border-amber-200/80 animate-pulse",
      progress: 35,
      completedLessons: 12,
      totalLessons: 36,
      nextSessionTime: "Hôm nay, 19:30 - 21:00",
      meetUrl: "https://meet.google.com",
    },
    {
      id: "cls-02",
      title: "Ngữ pháp Tiếng Anh: 12 Thì & Câu bị động nâng cao",
      subject: "Tiếng Anh",
      subjectColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      coverImage: "/classes/class-english.jpg",
      teacher: "Cô Thu Hà · 8.5 IELTS",
      schedule: "Thứ 2, Thứ 4 (08:00 - 09:30)",
      roomName: "Lớp học ảo EduMi #02",
      status: "completed",
      learningStatus: "in_progress",
      statusLabel: "Đã hoàn thành hôm nay",
      statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      progress: 75,
      completedLessons: 18,
      totalLessons: 24,
      nextSessionTime: "Thứ 4 tới, 08:00 - 09:30",
      hasRecord: true,
    },
    {
      id: "cls-03",
      title: "Vật lý 12: Dao động cơ học & Dòng điện xoay chiều",
      subject: "Vật lý",
      subjectColor: "bg-purple-50 text-purple-700 border-purple-200",
      coverImage: "/classes/class-physics.jpg",
      teacher: "Thầy Quang · Chuyên gia Luyện thi ĐH",
      schedule: "Thứ 4, Thứ 7 (19:30 - 21:00)",
      roomName: "Lớp học ảo EduMi #03",
      status: "future",
      learningStatus: "in_progress",
      statusLabel: "Buổi tới: Thứ 4",
      statusColor: "bg-slate-100 text-slate-700 border-slate-200",
      progress: 26,
      completedLessons: 8,
      totalLessons: 30,
      nextSessionTime: "Thứ 4 (23/09), 19:30",
    },
    {
      id: "cls-04",
      title: "Ngữ văn 12: Kỹ năng Viết Nghị luận văn học đạt điểm 8+",
      subject: "Ngữ văn",
      subjectColor: "bg-rose-50 text-rose-700 border-rose-200",
      coverImage: "/classes/class-literature.jpg",
      teacher: "Cô Phương Linh · Giảng viên Văn học",
      schedule: "Chủ nhật (14:00 - 16:30)",
      roomName: "Lớp học ảo EduMi #05",
      status: "future",
      learningStatus: "in_progress",
      statusLabel: "Buổi tới: Chủ nhật",
      statusColor: "bg-slate-100 text-slate-700 border-slate-200",
      progress: 30,
      completedLessons: 6,
      totalLessons: 20,
      nextSessionTime: "Chủ nhật (27/09), 14:00",
    },
    {
      id: "cls-05",
      title: "Hóa học 12: Bứt phá điểm 9+ Chuyên đề Este & Hợp chất chứa Nitơ",
      subject: "Hóa học",
      subjectColor: "bg-amber-50 text-amber-700 border-amber-200",
      coverImage: "/classes/class-physics.jpg",
      teacher: "Thầy Hùng · Thủ khoa ĐH Dược",
      schedule: "Đã hoàn thành khóa học",
      roomName: "Khóa học lưu trữ EduMi #07",
      status: "completed",
      learningStatus: "completed",
      statusLabel: "Đã hoàn thành khóa học",
      statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      progress: 100,
      completedLessons: 24,
      totalLessons: 24,
      hasRecord: true,
    },
    {
      id: "cls-06",
      title: "Toán 11: Nền tảng Hình học không gian & Lượng giác cơ bản",
      subject: "Toán học",
      subjectColor: "bg-blue-50 text-blue-700 border-blue-200",
      coverImage: "/classes/class-math.jpg",
      teacher: "Thầy Đức · Thạc sĩ Sư phạm Toán",
      schedule: "Đã hoàn thành khóa học",
      roomName: "Khóa học lưu trữ EduMi #08",
      status: "completed",
      learningStatus: "completed",
      statusLabel: "Đã hoàn thành khóa học",
      statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      progress: 100,
      completedLessons: 30,
      totalLessons: 30,
      hasRecord: true,
    },
  ];

  // Tính toán danh sách lớp học sau khi lọc
  const isFiltered = searchQuery.trim() !== "" || selectedSubject !== "all" || selectedStatus !== "all";

  const filteredClasses = myClasses.filter((cls) => {
    // 1. Tìm kiếm theo từ khóa (tên lớp, giáo viên, môn học)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = cls.title.toLowerCase().includes(q);
      const matchTeacher = cls.teacher.toLowerCase().includes(q);
      const matchSubject = cls.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchTeacher && !matchSubject) return false;
    }

    // 2. Lọc theo môn học
    if (selectedSubject !== "all" && cls.subject !== selectedSubject) {
      return false;
    }

    // 3. Lọc theo trạng thái (đang học / đã học xong)
    if (selectedStatus !== "all" && cls.learningStatus !== selectedStatus) {
      return false;
    }

    return true;
  });


  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCodeInput.trim()) return;
    setJoinSuccessMsg(`Đã gửi yêu cầu tham gia lớp với mã "${classCodeInput.toUpperCase()}"!`);
    setTimeout(() => {
      setShowJoinModal(false);
      setClassCodeInput("");
      setJoinSuccessMsg("");
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* ── KHUNG BANNER LỚP HỌC (Thiết kế chiều cao cân đối, hình ảnh chìm sâu liền mạch) ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#059669] to-[#047857] shadow-sm flex items-center justify-between min-h-[110px] sm:min-h-[125px] md:min-h-[135px] px-6 sm:px-8 py-5 sm:py-6">
        {/* Decorative subtle background glow */}
        <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

        {/* ── HIỆU ỨNG BONG BÓNG NỔI (Floating Translucent Glass Bubbles) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {/* Bubble 1: góc trái dưới */}
          <div
            className="banner-bubble animate-bubble-1 w-9 h-9"
            style={{ left: "7%", bottom: "14%", animationDuration: "5.5s" }}
          />
          {/* Bubble 2: gần tag bên trái */}
          <div
            className="banner-bubble animate-bubble-2 w-5 h-5"
            style={{ left: "21%", top: "14%", animationDuration: "4.2s", animationDelay: "0.8s" }}
          />
          {/* Bubble 3: nhỏ xinh phía trên */}
          <div
            className="banner-bubble animate-bubble-3 w-4 h-4"
            style={{ left: "37%", top: "26%", animationDuration: "3.8s", animationDelay: "1.4s" }}
          />
          {/* Bubble 4: trung tâm lớn */}
          <div
            className="banner-bubble animate-bubble-1 w-10 h-10"
            style={{ left: "48%", bottom: "16%", animationDuration: "6.2s", animationDelay: "0.3s" }}
          />
          {/* Bubble 5: giữa bên phải */}
          <div
            className="banner-bubble animate-bubble-2 w-6 h-6"
            style={{ left: "62%", top: "18%", animationDuration: "4.8s", animationDelay: "1.9s" }}
          />
          {/* Bubble 6: gần khu vực mascot */}
          <div
            className="banner-bubble animate-bubble-3 w-7 h-7"
            style={{ left: "75%", bottom: "20%", animationDuration: "5.2s", animationDelay: "0.6s" }}
          />
          {/* Bubble 7: góc phải */}
          <div
            className="banner-bubble animate-bubble-1 w-5 h-5"
            style={{ left: "89%", top: "18%", animationDuration: "4.5s", animationDelay: "2.2s" }}
          />
        </div>

        {/* ── HIỆU ỨNG NGÔI SAO LẤP LÁNH ĐỘNG (Twinkling & Sparkling Stars) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
          {/* Star 1: Vàng kim lấp lánh cạnh tag "LỚP HỌC" */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-300 w-4 h-4 animate-star-1"
            style={{ left: "4%", top: "18%", animationDelay: "0.2s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 2: Trắng tinh khôi lấp lánh giữa banner */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-white w-3.5 h-3.5 animate-star-2"
            style={{ left: "33%", bottom: "26%", animationDelay: "0.9s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 3: Vàng ấm tỏa sáng đỉnh giữa */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-200 w-5 h-5 animate-star-3"
            style={{ left: "54%", top: "14%", animationDelay: "1.5s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 4: Nhỏ nhẹ nhàng cạnh mascot */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-emerald-100 w-3 h-3 animate-star-1"
            style={{ left: "68%", bottom: "32%", animationDelay: "2.1s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 5: Vàng kim tỏa sáng góc phải */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-300 w-4 h-4 animate-star-2"
            style={{ left: "83%", top: "22%", animationDelay: "0.5s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 6: Trắng lấp lánh nhẹ gần tiêu đề */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-yellow-100 w-2.5 h-2.5 animate-star-3"
            style={{ left: "19%", bottom: "16%", animationDelay: "1.8s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
        </div>


        {/* Bên trái: Nội dung thanh thoát, khoảng cách thoáng đãng */}
        <div className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg space-y-1 sm:space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-200/90">
            LỚP HỌC · THỜI GIAN THỰC
          </p>
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight leading-tight">
            Khám phá lớp học của bạn
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
            Tham gia các buổi học tương tác và xem lại bài giảng dễ dàng.
          </p>
        </div>

        {/* Bên phải: Hình ảnh chìm sâu tự nhiên vào góc phải banner (không dùng khung ảnh) */}
        <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-64 md:w-80 lg:w-96 h-full overflow-hidden pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src="/classes/banner-classes.jpg"
              alt="Mascot lớp học EduMi"
              fill
              priority
              sizes="(max-width: 640px) 190px, 360px"
              className="object-cover object-right [mask-image:linear-gradient(to_left,black_65%,transparent)]"
            />
          </div>
        </div>
      </div>

      {/* ── BỘ LỌC LỚP HỌC (NẰM GIỮA BANNER VÀ DANH SÁCH LỚP HỌC) ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 border border-slate-200/80 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-3">
        {/* Hàng điều khiển: Tìm kiếm + 2 Dropdown */}
        <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between">
          {/* Thanh tìm kiếm (Chiếm phần lớn không gian bên trái) */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên lớp, môn học, giáo viên..."
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

            {/* Dropdown 2: Lọc theo trạng thái (Đang học / Đã học xong) */}
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
                    Trạng thái khóa học
                  </div>
                  <div className="space-y-0.5">
                    {statusOptions.map((opt) => {
                      const isSelected = selectedStatus === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(opt.id as any);
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

        {/* Hàng các chip lọc đang kích hoạt (chỉ hiển thị khi có bộ lọc được áp dụng) */}
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
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold">
                  Môn: {selectedSubject}
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
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 text-[11px] font-semibold">
                  {selectedStatus === "in_progress" ? "Đang học" : "Đã học xong"}
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

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer shrink-0"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* ── Class Cards Grid hoặc Empty State ── */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] hover:shadow-[0_12px_32px_rgba(6,78,59,0.08)] transition-all flex flex-col sm:flex-row gap-4 sm:gap-5 group"
            >
              {/* ── Bên trái: Ảnh bìa lớp học ── */}
              <div className="w-full sm:w-44 md:w-52 lg:w-56 h-44 sm:h-auto min-h-[160px] sm:min-h-[190px] rounded-xl sm:rounded-2xl overflow-hidden relative flex-shrink-0 border border-slate-100 bg-slate-100 shadow-2xs">
                <Image
                  src={cls.coverImage}
                  alt={cls.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {/* Huy hiệu môn học phủ góc ảnh bìa */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs border ${cls.subjectColor} bg-white/95`}
                  >
                    {cls.subject}
                  </span>
                </div>
              </div>

              {/* ── Bên phải: Thông tin lớp học & tiến độ ── */}
              <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                <div>
                  {/* Header: Status tag & Room name */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cls.statusColor}`}
                    >
                      {cls.statusLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium truncate">
                      {cls.roomName.split(" ")[0]} {cls.roomName.split(" ")[1]}
                    </span>
                  </div>

                  {/* Class Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
                    {cls.title}
                  </h3>

                  {/* Teacher & Schedule info */}
                  <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{cls.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{cls.schedule}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium text-[11px]">Tiến độ khóa học</span>
                      <span className="font-bold text-slate-800 text-[11px]">
                        {cls.completedLessons}/{cls.totalLessons} buổi ({cls.progress}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${cls.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium truncate">
                      {cls.nextSessionTime ? `Lịch: ${cls.nextSessionTime}` : "Đang cập nhật"}
                    </span>

                    {cls.status === "upcoming" && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleJoinClassWithPiP(cls)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                          title="Vào Google Meet đồng thời mở cửa sổ sổ ghi chú ghim nổi trên màn hình"
                        >
                          <Pin className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">Vào + Ghim Note</span>
                          <span className="sm:hidden">+ Note</span>
                        </button>

                        <a
                          href={cls.meetUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Vào lớp</span>
                        </a>
                      </div>
                    )}

                    {cls.status === "completed" && (
                      <button
                        type="button"
                        onClick={() => alert("Đang mở video ghi hình buổi học đã hoàn thành.")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex-shrink-0"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xem Record</span>
                      </button>
                    )}

                    {cls.status === "future" && (
                      <button
                        type="button"
                        onClick={() => alert("Tài liệu bài học sẽ được mở trước giờ học 30 phút.")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer flex-shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tài liệu</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-slate-200/80 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Không tìm thấy lớp học phù hợp
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Không có lớp học nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại của bạn.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      )}

      {/* ── Join Class Modal ── */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Tham gia lớp học</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Nhập mã lớp học gồm 6 ký tự do thầy cô hoặc ban đào tạo EduMi cung cấp để vào lớp.
            </p>

            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã lớp học (Ví dụ: EDM-12A)
                </label>
                <input
                  type="text"
                  required
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  placeholder="Nhập mã lớp..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 uppercase tracking-wider"
                />
              </div>

              {joinSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{joinSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                >
                  Xác nhận vào lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ALWAYS-ON-TOP PIP FLOATING WINDOW PORTAL ── */}
      {pipWindow &&
        pipWindow.document &&
        createPortal(
          <QuickNotesPiPContent
            sessions={pipSessions}
            activeSessionId={activePipSessionId}
            onSelectSession={setActivePipSessionId}
            onAddCard={(colKey, content, sticker, stickerColor) => {
              const newCard: NoteCard = {
                id: "card-" + Date.now(),
                content,
                sticker,
                stickerColor,
                createdAt: new Date().toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };
              setPipSessions((prev) => {
                const updated = prev.map((sess) => {
                  if (sess.id !== activePipSessionId) return sess;
                  return {
                    ...sess,
                    columns: {
                      ...sess.columns,
                      [colKey]: [...sess.columns[colKey], newCard],
                    },
                  };
                });
                if (typeof window !== "undefined") {
                  try {
                    localStorage.setItem("edumi_study_sessions", JSON.stringify(updated));
                  } catch (e) {
                    console.warn(e);
                  }
                }
                return updated;
              });
            }}
            onDeleteCard={(colKey, cardId) => {
              setPipSessions((prev) => {
                const updated = prev.map((sess) => {
                  if (sess.id !== activePipSessionId) return sess;
                  return {
                    ...sess,
                    columns: {
                      ...sess.columns,
                      [colKey]: sess.columns[colKey].filter((c) => c.id !== cardId),
                    },
                  };
                });
                if (typeof window !== "undefined") {
                  try {
                    localStorage.setItem("edumi_study_sessions", JSON.stringify(updated));
                  } catch (e) {
                    console.warn(e);
                  }
                }
                return updated;
              });
            }}
            onAddSession={(title, subject) => {
              const now = new Date();
              const day = String(now.getDate());
              const month = `TH${now.getMonth() + 1}`;
              const fullDate = `${day} THÁNG ${now.getMonth() + 1}, ${now.getFullYear()}`;
              const newSession: StudySession = {
                id: "sess-" + Date.now(),
                title,
                subject,
                dateDay: day,
                dateMonth: month,
                fullDate,
                columns: { lecture: [], supplementary: [], questions: [] },
              };
              setPipSessions((prev) => {
                const updated = [newSession, ...prev];
                if (typeof window !== "undefined") {
                  try {
                    localStorage.setItem("edumi_study_sessions", JSON.stringify(updated));
                  } catch (e) {
                    console.warn(e);
                  }
                }
                return updated;
              });
              setActivePipSessionId(newSession.id);
            }}
            onClose={() => {
              pipWindow.close();
              setPipWindow(null);
            }}
          />,
          pipWindow.document.body
        )}
    </div>
  );
}
