"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ProfileTabId } from "../ProfileSidebar";
import {
  Flame,
  BookOpen,
  Clock,
  Video,
  CheckCircle2,
  CalendarDays,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Trophy,
  X,
  Calendar,
} from "lucide-react";

interface OverviewTabProps {
  fullName?: string;
  streakCount?: number;
  studentCode?: string;
  onNavigateTab?: (tab: ProfileTabId) => void;
}

interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  dayLabel: string;
  dayKey: string;
  slotKey: "sang" | "chieu" | "toi";
  dateNum: string;
  time: string;
  teacher: string;
  room: string;
  isToday: boolean;
  isCompleted?: boolean;
  meetUrl?: string;
}

interface HomeworkItem {
  id: string;
  title: string;
  courseName: string;
  sessionInfo: string;
  timeRemaining: string;
  timeSubtext: string;
  isOverdue?: boolean;
  status: "overdue" | "due_today" | "due_soon" | "upcoming";
}

interface HonoredStudent {
  id: string;
  rank: number;
  name: string;
  avatarText: string;
  avatarBg: string;
  course: string;
  points: string;
  highlightTag: string;
}

export default function OverviewTab({
  fullName = "Nguyễn Ngọc Thạch 2k3",
  streakCount = 0,
  onNavigateTab,
}: OverviewTabProps) {
  const [scheduleView, setScheduleView] = useState<"today" | "week">("today");

  // Lịch học Monthly Calendar state (Mặc định Tháng 9/2026 theo ảnh mẫu)
  const [calMonth, setCalMonth] = useState<number>(8); // September (0-indexed: 8)
  const [calYear, setCalYear] = useState<number>(2026);
  const [selectedCalDay, setSelectedCalDay] = useState<number>(26); // Ngày 26 được chọn mặc định
  const [activePopoverDay, setActivePopoverDay] = useState<number | null>(null); // Ngày mở card chi tiết dạng nổi
  const popoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDayMouseEnter = (day: number, hasClasses: boolean) => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
      popoverTimeoutRef.current = null;
    }
    if (hasClasses) {
      setActivePopoverDay(day);
    } else {
      setActivePopoverDay(null);
    }
  };

  const handleDayMouseLeave = () => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
    }
    popoverTimeoutRef.current = setTimeout(() => {
      setActivePopoverDay(null);
    }, 250);
  };

  const handlePopoverMouseEnter = () => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
      popoverTimeoutRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
    }
    popoverTimeoutRef.current = setTimeout(() => {
      setActivePopoverDay(null);
    }, 200);
  };

  const handlePrevCalMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextCalMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  // Môn học được chọn trong card Tổng quan năng lực
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const subjectList = [
    { id: "all", label: "Tất cả", icon: "🌟" },
    { id: "math", label: "Toán học", icon: "📐" },
    { id: "literature", label: "Ngữ văn", icon: "📖" },
    { id: "english", label: "Tiếng Anh", icon: "🇬🇧" },
    { id: "physics", label: "Vật lý", icon: "⚡" },
  ];

  const subjectOverviewData: Record<
    string,
    {
      name: string;
      badge: string;
      score: number;
      scoreGrowth: string;
      testsCount: number;
      questionsCountLabel: string;
      accuracy: number;
      accuracyStatus: string;
      targetGoal: string;
      currentStatus: string;
      keySkills: { name: string; percent: number; status: string }[];
    }
  > = {
    all: {
      name: "Tổ hợp các môn",
      badge: "Học lực: Giỏi · Top 10%",
      score: 8.4,
      scoreGrowth: "+0.6 tháng này",
      testsCount: 28,
      questionsCountLabel: "1,420 câu đã giải",
      accuracy: 86.5,
      accuracyStatus: "Đạt chuẩn mục tiêu",
      targetGoal: "Mục tiêu: 26.5 điểm",
      currentStatus: "Hiện tại: 24.6 điểm",
      keySkills: [
        { name: "Toán học 12", percent: 88, status: "Xuất sắc" },
        { name: "Tiếng Anh", percent: 82, status: "Tốt" },
        { name: "Vật lý 12", percent: 76, status: "Khá" },
      ],
    },
    math: {
      name: "Môn Toán học 12",
      badge: "Thế mạnh · Top 8%",
      score: 8.8,
      scoreGrowth: "+0.8 tháng này",
      testsCount: 12,
      questionsCountLabel: "600 câu đã giải",
      accuracy: 88.0,
      accuracyStatus: "Rất xuất sắc",
      targetGoal: "Mục tiêu môn Toán: 9.0+ điểm",
      currentStatus: "Đạt 97% mục tiêu",
      keySkills: [
        { name: "Hàm số & Khảo sát đồ thị", percent: 92, status: "Vững chắc" },
        { name: "Mũ & Hàm số Logarit", percent: 88, status: "Tốt" },
        { name: "Hình không gian & Oxyz", percent: 78, status: "Cần luyện thêm" },
      ],
    },
    literature: {
      name: "Môn Ngữ văn 12",
      badge: "Tiến bộ nhanh · Top 18%",
      score: 7.8,
      scoreGrowth: "+0.4 tháng này",
      testsCount: 8,
      questionsCountLabel: "16 bài luận hoàn thành",
      accuracy: 82.5,
      accuracyStatus: "Phong độ ổn định",
      targetGoal: "Mục tiêu môn Văn: 8.0+ điểm",
      currentStatus: "Đạt 94% mục tiêu",
      keySkills: [
        { name: "Đọc hiểu văn bản & Tiếng Việt", percent: 88, status: "Tốt" },
        { name: "Nghị luận xã hội", percent: 80, status: "Khá" },
        { name: "Nghị luận văn học chuyên sâu", percent: 74, status: "Cần trau dồi" },
      ],
    },
    english: {
      name: "Môn Tiếng Anh THPT",
      badge: "Chắc chắn · Top 12%",
      score: 8.2,
      scoreGrowth: "+0.5 tháng này",
      testsCount: 10,
      questionsCountLabel: "500 câu trắc nghiệm",
      accuracy: 84.0,
      accuracyStatus: "Đạt chuẩn kỳ thi",
      targetGoal: "Mục tiêu Tiếng Anh: 8.5+ điểm",
      currentStatus: "Đạt 96% mục tiêu",
      keySkills: [
        { name: "Ngữ pháp & Trắc nghiệm câu", percent: 90, status: "Vững chắc" },
        { name: "Kỹ năng đọc hiểu (Reading)", percent: 80, status: "Khá" },
        { name: "Từ vựng chuyên đề & Điền từ", percent: 85, status: "Tốt" },
      ],
    },
    physics: {
      name: "Môn Vật lý 12",
      badge: "Đang tăng tốc · Top 15%",
      score: 7.6,
      scoreGrowth: "+0.3 tháng này",
      testsCount: 8,
      questionsCountLabel: "320 câu đã giải",
      accuracy: 78.0,
      accuracyStatus: "Cần đẩy mạnh",
      targetGoal: "Mục tiêu Vật lý: 8.5+ điểm",
      currentStatus: "Đạt 89% mục tiêu",
      keySkills: [
        { name: "Dao động cơ học", percent: 84, status: "Tốt" },
        { name: "Sóng cơ & Sóng âm", percent: 78, status: "Khá" },
        { name: "Dòng điện xoay chiều", percent: 70, status: "Cần cải thiện" },
      ],
    },
  };

  const currentSubjectData = subjectOverviewData[selectedSubject] || subjectOverviewData.all;

  // Danh sách bài tập cần làm (bài tập về nhà từ các lớp học học viên tham gia)
  const homeworkItems: HomeworkItem[] = [
    {
      id: "hw-1",
      title: "Writing Task 1 – Line graph: Energy use",
      courseName: "F01",
      sessionInfo: "Tối 2-4-6 · Buổi 3",
      timeRemaining: "-01:05:04",
      timeSubtext: "Quá hạn 65 phút",
      isOverdue: true,
      status: "overdue",
    },
    {
      id: "hw-2",
      title: "Reading – Cambridge 13 Test 4 Passage 2",
      courseName: "F01",
      sessionInfo: "Tối 2-4-6 · Buổi 3",
      timeRemaining: "03:11:56",
      timeSubtext: "Hạn hôm nay",
      isOverdue: false,
      status: "due_today",
    },
    {
      id: "hw-3",
      title: "Speaking Part 2 – Describe a person you admire",
      courseName: "F01",
      sessionInfo: "Tối 2-4-6 · Buổi 3",
      timeRemaining: "2n 03:19:56",
      timeSubtext: "Còn 2 ngày",
      isOverdue: false,
      status: "due_soon",
    },
    {
      id: "hw-4",
      title: "Listening – Cambridge 10 Test 1",
      courseName: "F01",
      sessionInfo: "Tối 2-4-6 · Buổi 3",
      timeRemaining: "4n 23:59:56",
      timeSubtext: "Còn 4 ngày",
      isOverdue: false,
      status: "upcoming",
    },
  ];

  // Danh sách học viên vinh danh (Top gương mặt xuất sắc tháng 9 theo ảnh mẫu 5)
  const honoredStudents: HonoredStudent[] = [
    {
      id: "h1",
      rank: 1,
      name: "Nguyễn Hà My",
      avatarText: "HM",
      avatarBg: "from-amber-400 to-amber-600",
      course: "Lớp 12A1 · Chuyên Toán",
      points: "2,950 XP",
      highlightTag: "🥇 Thủ khoa",
    },
    {
      id: "h2",
      rank: 2,
      name: "Trần Minh Đức",
      avatarText: "MĐ",
      avatarBg: "from-sky-400 to-blue-600",
      course: "Lớp 12A2 · Đại số nâng cao",
      points: "2,820 XP",
      highlightTag: "🥈 Á quân",
    },
    {
      id: "h3",
      rank: 3,
      name: "Lê Hoàng Nam",
      avatarText: "HN",
      avatarBg: "from-emerald-400 to-teal-600",
      course: "IELTS Master 7.5+",
      points: "2,740 XP",
      highlightTag: "🥉 Quý quân",
    },
    {
      id: "h4",
      rank: 4,
      name: "Phạm Khánh Vy",
      avatarText: "KV",
      avatarBg: "from-purple-400 to-indigo-600",
      course: "Vật lý 12 · Luyện đề VIP",
      points: "2,690 XP",
      highlightTag: "⭐ Top 4",
    },
  ];

  // Mock schedule data
  const scheduleItems: ScheduleItem[] = [
    {
      id: "s0",
      title: "Ngữ pháp Tiếng Anh: 12 Thì & Câu bị động nâng cao",
      subject: "Tiếng Anh",
      dayLabel: "T2",
      dayKey: "T2",
      slotKey: "sang",
      dateNum: "21",
      time: "08:00 - 09:30",
      teacher: "Cô Thu Hà",
      room: "Lớp học ảo EduMi #02",
      isToday: true,
      isCompleted: true,
    },
    {
      id: "s1",
      title: "Toán 12: Chuyên đề Hàm số & Logarit",
      subject: "Toán học",
      dayLabel: "T2",
      dayKey: "T2",
      slotKey: "toi",
      dateNum: "21",
      time: "19:30 - 21:00",
      teacher: "Thầy Đức",
      room: "Lớp học ảo EduMi #01",
      isToday: true,
      isCompleted: false,
      meetUrl: "https://meet.google.com",
    },
    {
      id: "s2",
      title: "Luyện đề IELTS Reading: Kỹ năng Skimming & Scanning",
      subject: "Tiếng Anh",
      dayLabel: "T3",
      dayKey: "T3",
      slotKey: "chieu",
      dateNum: "22",
      time: "14:00 - 15:30",
      teacher: "Cô Mai Anh",
      room: "Phòng học 302",
      isToday: false,
      isCompleted: false,
    },
    {
      id: "s3",
      title: "Vật lý 12: Dao động điều hòa & Con lắc lò xo",
      subject: "Vật lý",
      dayLabel: "T4",
      dayKey: "T4",
      slotKey: "toi",
      dateNum: "23",
      time: "19:30 - 21:00",
      teacher: "Thầy Quang",
      room: "Lớp học ảo EduMi #03",
      isToday: false,
      isCompleted: false,
    },
    {
      id: "s4",
      title: "Hóa học 12: Este - Lipit & Bài tập vận dụng cao",
      subject: "Hóa học",
      dayLabel: "T6",
      dayKey: "T6",
      slotKey: "toi",
      dateNum: "25",
      time: "18:00 - 19:30",
      teacher: "Cô Lan Hương",
      room: "Phòng học 201",
      isToday: false,
      isCompleted: false,
    },
  ];

  // Map lịch học chi tiết theo ngày trong tháng (tinh gọn 5 buổi học tiêu biểu để lịch thoáng, tinh tế)
  const classesByDate: Record<number, ScheduleItem[]> = {
    9: [
      {
        id: "c9",
        title: "Vật lý 12: Đại cương dao động điều hòa",
        subject: "Vật lý",
        dayLabel: "T4",
        dayKey: "T4",
        slotKey: "toi",
        dateNum: "09",
        time: "19:30 - 21:00",
        teacher: "Thầy Quang",
        room: "Phòng học 301",
        isToday: false,
        isCompleted: true,
      },
    ],
    16: [
      {
        id: "c16",
        title: "Toán 12: Cực trị của hàm số bậc ba & Tiệm cận",
        subject: "Toán học",
        dayLabel: "T4",
        dayKey: "T4",
        slotKey: "toi",
        dateNum: "16",
        time: "19:30 - 21:00",
        teacher: "Thầy Đức",
        room: "Lớp học ảo EduMi #01",
        isToday: false,
        isCompleted: true,
      },
    ],
    21: [
      {
        id: "c21",
        title: "Ngữ pháp Tiếng Anh: 12 Thì & Câu bị động nâng cao",
        subject: "Tiếng Anh",
        dayLabel: "T2",
        dayKey: "T2",
        slotKey: "sang",
        dateNum: "21",
        time: "08:00 - 09:30",
        teacher: "Cô Thu Hà",
        room: "Lớp học ảo EduMi #02",
        isToday: true,
        isCompleted: false,
        meetUrl: "https://meet.google.com",
      },
    ],
    23: [
      {
        id: "c23",
        title: "Vật lý 12: Dao động điều hòa & Con lắc lò xo",
        subject: "Vật lý",
        dayLabel: "T4",
        dayKey: "T4",
        slotKey: "toi",
        dateNum: "23",
        time: "19:30 - 21:00",
        teacher: "Thầy Quang",
        room: "Lớp học ảo EduMi #03",
        isToday: false,
        isCompleted: false,
        meetUrl: "https://meet.google.com",
      },
    ],
    28: [
      {
        id: "c28",
        title: "Toán 12: Ôn tập Hàm số lũy thừa & Mũ",
        subject: "Toán học",
        dayLabel: "T2",
        dayKey: "T2",
        slotKey: "sang",
        dateNum: "28",
        time: "08:00 - 09:30",
        teacher: "Thầy Đức",
        room: "Lớp học ảo EduMi #01",
        isToday: false,
        isCompleted: false,
        meetUrl: "https://meet.google.com",
      },
    ],
  };

  const getSelectedDayTitle = (day: number, month: number, year: number) => {
    const d = new Date(year, month, day);
    const dayNames = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dayName = dayNames[d.getDay()];
    return `${dayName}, ${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}`;
  };

  // Tạo các ô ngày cho lịch tháng hiện tại (có ngày tháng trước & sau để lấp đầy bảng)
  const generateCalDays = () => {
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonthTotalDays = new Date(calYear, calMonth, 0).getDate();

    const cells: {
      day: number;
      isCurrentMonth: boolean;
      hasClasses: boolean;
      isCompleted?: boolean;
      isUpcoming?: boolean;
      isExam?: boolean;
    }[] = [];

    // Ngày của tháng trước
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthTotalDays - i,
        isCurrentMonth: false,
        hasClasses: false,
      });
    }

    // Ngày trong tháng hiện tại
    for (let d = 1; d <= totalDays; d++) {
      const isSept2026 = calMonth === 8 && calYear === 2026;
      const dayClasses = isSept2026 ? classesByDate[d] || [] : [];
      const hasCls = dayClasses.length > 0;
      const isCompleted = hasCls && dayClasses.every((c) => c.isCompleted);
      const isUpcoming = hasCls && !isCompleted;
      const isExam = isSept2026 && (d === 12 || d === 19);
      cells.push({
        day: d,
        isCurrentMonth: true,
        hasClasses: hasCls,
        isCompleted,
        isUpcoming,
        isExam,
      });
    }

    // Ngày của tháng sau để đủ 6 hàng (42 ô, giúp lấp đầy khung lịch khi hẹp lại)
    const totalCellsNeeded = 42;
    const remaining = totalCellsNeeded - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        hasClasses: false,
      });
    }

    return cells;
  };

  const selectedDayClasses =
    calMonth === 8 && calYear === 2026 ? classesByDate[selectedCalDay] || [] : [];


  const displayedSchedule =
    scheduleView === "today"
      ? scheduleItems.filter((item) => item.isToday)
      : scheduleItems;

  // Caro table configuration
  const weekTableDays = [
    { key: "T2", label: "T2", date: "21", isToday: true },
    { key: "T3", label: "T3", date: "22", isToday: false },
    { key: "T4", label: "T4", date: "23", isToday: false },
    { key: "T5", label: "T5", date: "24", isToday: false },
    { key: "T6", label: "T6", date: "25", isToday: false },
    { key: "T7", label: "T7", date: "26", isToday: false },
    { key: "CN", label: "CN", date: "27", isToday: false },
  ];

  const timeSlots = [
    { key: "sang", label: "Sáng", timeRange: "08:00 - 11:30" },
    { key: "chieu", label: "Chiều", timeRange: "14:00 - 17:30" },
    { key: "toi", label: "Tối", timeRange: "18:00 - 21:30" },
  ];

  const getScheduleForSlot = (dayKey: string, slotKey: string) => {
    return scheduleItems.find(
      (item) => item.dayKey === dayKey && item.slotKey === slotKey
    );
  };

  const getTooltipPosition = (dayKey: string) => {
    if (dayKey === "T2" || dayKey === "T3") return "left-0";
    if (dayKey === "T6" || dayKey === "T7" || dayKey === "CN") return "right-0";
    return "left-1/2 -translate-x-1/2";
  };

  // 7 days of the week streak status
  const weekDays = [
    { label: "T2", active: false, current: false },
    { label: "T3", active: false, current: false },
    { label: "T4", active: false, current: false },
    { label: "T5", active: false, current: false },
    { label: "T6", active: false, current: false },
    { label: "T7", active: false, current: false },
    { label: "CN", active: false, current: true },
  ];

  return (
    <div className="space-y-6">
      {/* ── BANNER CHÀO MỪNG TỔNG QUAN (Thiết kế chiều cao cân đối, hình ảnh chìm sâu liền mạch) ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#059669] to-[#047857] shadow-sm flex items-center justify-between min-h-[110px] sm:min-h-[125px] md:min-h-[135px] px-6 sm:px-8 py-5 sm:py-6">
        {/* Decorative subtle background glow */}
        <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

        {/* ── HIỆU ỨNG BONG BÓNG NỔI (Floating Translucent Glass Bubbles) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {/* Bubble 1: góc trái dưới */}
          <div
            className="banner-bubble animate-bubble-1 w-9 h-9"
            style={{ left: "6%", bottom: "14%", animationDuration: "5.5s" }}
          />
          {/* Bubble 2: gần tag bên trái */}
          <div
            className="banner-bubble animate-bubble-2 w-5 h-5"
            style={{ left: "20%", top: "14%", animationDuration: "4.2s", animationDelay: "0.8s" }}
          />
          {/* Bubble 3: nhỏ xinh phía trên */}
          <div
            className="banner-bubble animate-bubble-3 w-4 h-4"
            style={{ left: "36%", top: "26%", animationDuration: "3.8s", animationDelay: "1.4s" }}
          />
          {/* Bubble 4: trung tâm lớn */}
          <div
            className="banner-bubble animate-bubble-1 w-10 h-10"
            style={{ left: "47%", bottom: "16%", animationDuration: "6.2s", animationDelay: "0.3s" }}
          />
          {/* Bubble 5: giữa bên phải */}
          <div
            className="banner-bubble animate-bubble-2 w-6 h-6"
            style={{ left: "61%", top: "18%", animationDuration: "4.8s", animationDelay: "1.9s" }}
          />
          {/* Bubble 6: gần khu vực mascot */}
          <div
            className="banner-bubble animate-bubble-3 w-7 h-7"
            style={{ left: "74%", bottom: "20%", animationDuration: "5.2s", animationDelay: "0.6s" }}
          />
          {/* Bubble 7: góc phải */}
          <div
            className="banner-bubble animate-bubble-1 w-5 h-5"
            style={{ left: "89%", top: "18%", animationDuration: "4.5s", animationDelay: "2.2s" }}
          />
        </div>

        {/* ── HIỆU ỨNG NGÔI SAO LẤP LÁNH ĐỘNG (Twinkling & Sparkling Stars) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
          {/* Star 1: Vàng kim lấp lánh cạnh tag */}
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
            style={{ left: "32%", bottom: "26%", animationDelay: "0.9s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 3: Vàng ấm tỏa sáng đỉnh giữa */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-200 w-5 h-5 animate-star-3"
            style={{ left: "53%", top: "14%", animationDelay: "1.5s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 4: Nhỏ nhẹ nhàng cạnh mascot */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-emerald-100 w-3 h-3 animate-star-1"
            style={{ left: "67%", bottom: "32%", animationDelay: "2.1s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 5: Vàng kim tỏa sáng góc phải */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-300 w-4 h-4 animate-star-2"
            style={{ left: "82%", top: "22%", animationDelay: "0.5s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 6: Trắng lấp lánh nhẹ gần tiêu đề */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-yellow-100 w-2.5 h-2.5 animate-star-3"
            style={{ left: "18%", bottom: "16%", animationDelay: "1.8s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
        </div>

        {/* Bên trái: Nội dung chào mừng & khích lệ học tập */}
        <div className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg space-y-1 sm:space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-200/90">
            TỔNG QUAN HỌC TẬP · BẢNG ĐIỀU KHIỂN
          </p>
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight leading-tight">
            Chào {fullName.split(" ").pop() || "bạn"}, mừng bạn trở lại! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
            Theo dõi tiến độ, hoàn thành mục tiêu và duy trì phong độ học tập mỗi ngày.
          </p>
        </div>

        {/* Bên phải: Hình ảnh 3D chào mừng chìm sâu tự nhiên vào góc phải banner */}
        <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-64 md:w-80 lg:w-96 h-full overflow-hidden pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src="/banner-overview.jpg"
              alt="Mascot chào mừng EduMi"
              fill
              priority
              sizes="(max-width: 640px) 190px, 360px"
              className="object-cover object-right [mask-image:linear-gradient(to_left,black_65%,transparent)]"
            />
          </div>
        </div>
      </div>

      {/* ── Row 1: Khoảng trống chờ thêm các card mới ── */}
      {/* ── Row 1: Tổng quan năng lực & Chuỗi ngày học ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Khoảng trống chờ thêm card mới (Col span 7) */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-300/80 bg-white/40 shadow-xs min-h-[240px] flex flex-col items-center justify-center p-6 text-center group hover:border-emerald-400 hover:bg-emerald-50/20 transition-all select-none">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-600 group-hover:text-emerald-800 transition-colors">
            Khu vực trống chờ thêm card mới
          </span>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5">
            (Tổng quan năng lực đã được chuyển xuống Row 3 cạnh Bảng xếp hạng)
          </span>
        </div>

        {/* Card: CHUỖI NGÀY HỌC (Col span 5 - Nền ấm áp & Linh vật ngọn lửa nhiệt huyết) */}
        <div className="relative overflow-hidden lg:col-span-5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-amber-200/90 bg-gradient-to-br from-[#fffdf5] via-[#fef3c7]/60 to-[#fed7aa]/50 shadow-[0_8px_30px_rgba(245,158,11,0.08)] flex flex-col justify-between group">
          {/* Decorative background glow & shapes */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-orange-400/15 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-36 h-36 rounded-bl-[80px] bg-gradient-to-bl from-amber-200/40 via-orange-200/20 to-transparent pointer-events-none" />

          {/* Speech Bubble: Ô tin nhắn mở lên trên góc phải, nằm hơi sát ngay phía trên sticker ngọn lửa */}
          <div className="absolute bottom-[105px] sm:bottom-[126px] right-3 sm:right-5 z-20 pointer-events-none">
            <div className="relative bg-white text-slate-900 text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_rgba(15,23,42,0.12)] flex items-center gap-1.5 select-none whitespace-nowrap">
              <span>Thắp streak học tập nhé!</span>
              <span className="text-sm leading-none">🔥</span>
              {/* Comic pointer tail pointing down */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-900 transform rotate-45" />
            </div>
          </div>

          {/* 3D Sticker: Sát góc dưới phải của card, nằm sau nghiêng nhẹ theo sơ đồ (không có hover effect) */}
          <div className="absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-4 w-32 h-32 sm:w-40 sm:h-40 pointer-events-none -rotate-12 drop-shadow-md z-0 opacity-95">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/stickers/streak-capybara.png"
              alt="Streak flame"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80">
              CHUỖI NGÀY HỌC
            </span>
            <div className="flex items-center gap-2 mt-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border border-amber-300 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                <Flame className="w-6 h-6 fill-white animate-pulse" />
              </div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {streakCount}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-amber-900/80">
                ngày liên tiếp
              </span>
            </div>
          </div>

          {/* 7-day circular checklist (Trải rộng đầy đủ toàn bộ chiều ngang thẻ, ở lớp trên z-10) */}
          <div className="relative z-10 grid grid-cols-7 gap-1.5 sm:gap-2 pt-3 border-t border-amber-200/70 w-full">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    day.active
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xs"
                      : day.current
                        ? "border-2 border-dashed border-amber-500 text-amber-700 bg-white/80 shadow-xs"
                        : "bg-white/70 text-slate-400 border border-amber-100"
                  }`}
                >
                  {day.active ? "✓" : ""}
                </div>
                <span className="text-[11px] font-bold text-amber-900/70">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Lịch học & Bài tập cần làm (Bố cục 2 card cân đối: 5fr - 7fr) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5 items-stretch">

        {/* Card 1: LỊCH HỌC HÀNG THÁNG (7fr - Giảm nhẹ độ rộng, nền vàng pastel & Popover chi tiết dạng nổi sát bên ô ngày) */}
        <div className="relative z-30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-amber-300/70 bg-[#fef8c4] shadow-[0_8px_30px_rgba(234,179,8,0.08)] flex flex-col justify-between group">
          {/* Subtle warm glow background clipped */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-400/15 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-yellow-300/20 blur-2xl" />
          </div>

          <div className="relative z-20">
            {/* Header: Title "Lịch học" + Navigation < Tháng 9/2026 > */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                Lịch học
              </h3>

              {/* Navigation buttons and Month text */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    handlePrevCalMonth();
                    setActivePopoverDay(null);
                  }}
                  aria-label="Tháng trước"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-900/15 bg-white/80 hover:bg-white flex items-center justify-center text-slate-900 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>

                <div className="text-center min-w-[62px] sm:min-w-[72px] leading-tight select-none">
                  <span className="text-[9px] font-bold text-slate-700 block uppercase tracking-wider">
                    Tháng
                  </span>
                  <span className="text-xs sm:text-sm font-black text-slate-950">
                    {calMonth + 1}/{calYear}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleNextCalMonth();
                    setActivePopoverDay(null);
                  }}
                  aria-label="Tháng sau"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-900/15 bg-white/80 hover:bg-white flex items-center justify-center text-slate-900 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Weekdays header (T2 - CN) */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5 select-none">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayName) => (
                <div
                  key={dayName}
                  className="text-[10px] sm:text-xs font-bold text-slate-700/80 py-0.5"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Monthly Calendar Grid (7 columns x 6 rows = 42 cells, lấp đầy chiều cao cố định) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1 text-center mb-2">
              {generateCalDays().map((cell, index) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div
                      key={`trailing-${index}`}
                      className="h-8 sm:h-8.5 flex items-center justify-center text-[11px] sm:text-xs font-semibold text-slate-400/40 select-none"
                    >
                      {cell.day}
                    </div>
                  );
                }

                const isCellActive = activePopoverDay === cell.day && cell.hasClasses;
                const colIndex = index % 7;
                const rowIndex = Math.floor(index / 7);
                const isLeftCol = colIndex <= 3;
                const isTopAligned = rowIndex <= 3;
                const isHovered = activePopoverDay === cell.day;
                const dayClasses =
                  calMonth === 8 && calYear === 2026 ? classesByDate[cell.day] || [] : [];

                return (
                  <div
                    key={`curr-${cell.day}`}
                    className={`relative ${isCellActive ? "z-50" : "z-0"}`}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => handleDayMouseEnter(cell.day, cell.hasClasses)}
                      onMouseLeave={handleDayMouseLeave}
                      onClick={() => {
                        if (cell.hasClasses) {
                          setActivePopoverDay((prev) => (prev === cell.day ? null : cell.day));
                        }
                      }}
                      className={`w-full h-8 sm:h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer relative select-none ${
                        cell.hasClasses
                          ? cell.isUpcoming
                            ? isHovered
                              ? "bg-emerald-600 text-white font-black shadow-md scale-105 ring-2 ring-emerald-300"
                              : "bg-emerald-500 text-white font-extrabold shadow-2xs hover:bg-emerald-600 hover:scale-105"
                            : isHovered
                              ? "bg-rose-600 text-white font-black shadow-md scale-105 ring-2 ring-rose-300"
                              : "bg-rose-500 text-white font-extrabold shadow-2xs hover:bg-rose-600 hover:scale-105"
                          : "text-slate-900 font-bold hover:bg-black/5"
                      }`}
                    >
                      <span className="text-xs sm:text-[13px] leading-none">
                        {cell.day}
                      </span>
                    </button>

                    {/* Popover chi tiết nổi sát bên ô ngày */}
                    {isCellActive && dayClasses.length > 0 && (
                      <>
                        {/* Invisible backdrop to dismiss on click outside on mobile */}
                        <div
                          className="fixed inset-0 z-40 sm:hidden bg-slate-900/20 backdrop-blur-[1px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePopoverDay(null);
                          }}
                        />

                        {/* Floating Card: Sát bên ô ngày được hover */}
                        <div
                          onMouseEnter={handlePopoverMouseEnter}
                          onMouseLeave={handlePopoverMouseLeave}
                          onClick={(e) => e.stopPropagation()}
                          className={`fixed sm:absolute z-50 inset-x-3 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:translate-y-0 w-auto sm:w-80 bg-white rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-[0_16px_40px_rgba(15,23,42,0.22)] p-4 sm:p-5 text-left animate-in fade-in zoom-in-95 duration-150 cursor-default select-text ${
                            isLeftCol
                              ? "sm:left-[calc(100%+12px)] sm:right-auto"
                              : "sm:right-[calc(100%+12px)] sm:left-auto"
                          } ${
                            isTopAligned
                              ? "sm:top-[-10px] sm:bottom-auto"
                              : "sm:bottom-[-10px] sm:top-auto"
                          }`}
                        >
                          {/* Invisible hover bridge covering the 12px gap between cell and popover */}
                          <div
                            className={`hidden sm:block absolute top-0 bottom-0 w-4 pointer-events-auto ${
                              isLeftCol ? "-left-4" : "-right-4"
                            }`}
                          />

                          {/* Pointer speech bubble arrow pointing directly into the date cell */}
                          <div
                            className={`hidden sm:block absolute w-4 h-4 bg-white transform rotate-45 ${
                              isLeftCol
                                ? "-left-2 border-l-2 border-b-2 border-amber-300"
                                : "-right-2 border-r-2 border-t-2 border-amber-300"
                            } ${
                              isTopAligned ? "top-[19px]" : "bottom-[19px]"
                            }`}
                          />

                          {/* Header */}
                          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-amber-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-black text-slate-950 leading-tight">
                                  {getSelectedDayTitle(cell.day, calMonth, calYear)}
                                </h4>
                                <span className="text-[10px] font-bold text-amber-800">
                                  {dayClasses.length} buổi học trong ngày
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePopoverDay(null);
                              }}
                              aria-label="Đóng"
                              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Classes list */}
                          <div className="mt-3 space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                            {dayClasses.map((item) => (
                              <div
                                key={item.id}
                                className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col gap-2"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-900 leading-snug">
                                    {item.title}
                                  </span>
                                  {item.isCompleted ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                                      Đã học
                                    </span>
                                  ) : item.isToday ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-300 text-slate-950 shrink-0">
                                      Sắp tới
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                      Chưa học
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-amber-200/50">
                                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                                    <Clock className="w-3 h-3" />
                                    {item.time}
                                  </span>
                                  <span className="font-medium text-slate-500 truncate max-w-[120px]">
                                    {item.teacher}
                                  </span>
                                </div>

                                {item.isToday && !item.isCompleted && (
                                  <a
                                    href={item.meetUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-1 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Vào lớp học ngay</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3D Sticker: Capybara cưỡi bút chì 3D dễ thương lấp đầy khoảng trống góc dưới bên phải */}
          <div className="absolute -bottom-3 right-2 sm:-bottom-2.5 sm:right-4 w-36 h-36 sm:w-44 sm:h-44 pointer-events-none drop-shadow-md z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/stickers/pencil-capybara.png"
              alt="Capybara cưỡi bút chì"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Footer Legend: Ô xanh (sắp tới/chưa học) và ô đỏ (đã học xong) */}
          <div className="relative z-10 pt-2.5 border-t border-amber-300/60 flex items-center justify-between text-[11px] text-slate-700 select-none">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex items-center gap-1.5 font-bold text-[10px] sm:text-[11px] text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-md bg-emerald-500 shadow-2xs" />
                Sắp tới (Chưa học)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-[10px] sm:text-[11px] text-rose-800">
                <span className="w-2.5 h-2.5 rounded-md bg-rose-500 shadow-2xs" />
                Đã học xong
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: BÀI TẬP CẦN LÀM (11fr - Mở rộng to hơn, nền cam sôi động chuẩn retro pop) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border border-orange-400/80 bg-[#f97316] shadow-[0_8px_30px_rgba(234,88,12,0.14)] flex flex-col justify-between group">
          {/* Decorative shapes exactly from reference image */}
          <div className="absolute -top-12 -right-8 w-44 h-44 rounded-full bg-[#c084fc] opacity-80 pointer-events-none" />
          <div className="absolute -bottom-14 left-44 w-32 h-32 rounded-full border-[14px] border-[#34d399] opacity-90 pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-[#facc15] opacity-90 pointer-events-none" />

          {/* Left-edge black pointer */}
          <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[12px] border-l-slate-950 pointer-events-none z-10" />

          <div className="relative z-10">
            {/* Header: Analog Clock Icon + Title + Counter Badges */}
            <div className="flex items-center gap-3 sm:gap-3.5 mb-3.5 sm:mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-slate-900 shadow-[0_2px_0_rgba(15,23,42,0.15)] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 40 40" className="w-7 h-7 sm:w-8 sm:h-8">
                  <circle cx="20" cy="20" r="18" fill="white" />
                  <line x1="20" y1="4" x2="20" y2="7" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="33" x2="20" y2="36" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="4" y1="20" x2="7" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="33" y1="20" x2="36" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="31.3" cy="8.7" r="0.8" fill="#94a3b8" />
                  <circle cx="8.7" cy="8.7" r="0.8" fill="#94a3b8" />
                  <circle cx="31.3" cy="31.3" r="0.8" fill="#94a3b8" />
                  <circle cx="8.7" cy="31.3" r="0.8" fill="#94a3b8" />
                  <line x1="20" y1="20" x2="13" y2="13" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="20" x2="20" y2="7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="20" cy="20" r="2" fill="#0f172a" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                  Bài tập cần làm
                </h3>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs sm:text-[13px] font-bold text-slate-950">
                    {homeworkItems.length} bài cần phải nộp
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-950 text-white shadow-2xs">
                    {homeworkItems.filter((h) => h.isOverdue).length} bài quá hạn
                  </span>
                </div>
              </div>
            </div>

            {/* List of Homework Cards */}
            <div className="space-y-2.5">
              {homeworkItems.map((hw) => (
                <div
                  key={hw.id}
                  onClick={() => onNavigateTab ? onNavigateTab("classes") : undefined}
                  className="group/item relative rounded-xl sm:rounded-2xl bg-white border-2 border-slate-950/15 p-2.5 sm:p-3 shadow-[0_3px_0_rgba(15,23,42,0.12)] hover:shadow-[0_5px_0_rgba(15,23,42,0.18)] hover:-translate-y-0.5 transition-all flex items-center justify-between gap-2.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="shrink-0">
                      {hw.isOverdue ? (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-rose-200" />
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-emerald-200" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-extrabold text-slate-900 group-hover/item:text-orange-600 transition-colors truncate leading-tight">
                        {hw.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                        {hw.courseName} · {hw.sessionInfo}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1 text-center min-w-[85px] sm:min-w-[95px] border transition-transform group-hover/item:scale-105 ${
                      hw.isOverdue
                        ? "bg-[#ef4444] text-white border-rose-600 shadow-xs"
                        : "bg-[#4ade80] text-emerald-950 border-emerald-500/40 shadow-xs"
                    }`}
                  >
                    <div className="font-mono text-xs sm:text-sm font-black tracking-tight leading-tight">
                      {hw.timeRemaining}
                    </div>
                    <div
                      className={`text-[9px] font-extrabold leading-none mt-0.5 ${
                        hw.isOverdue ? "text-rose-100" : "text-emerald-950/80"
                      }`}
                    >
                      {hw.timeSubtext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer: Xem tất cả bài tập button */}
          <div className="relative z-10 flex items-center justify-between mt-3.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigateTab ? onNavigateTab("classes") : undefined}
              className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span>Xem tất cả bài tập</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ── Row 3: Bảng xếp hạng vinh danh (3fr) & Tổng quan năng lực (7fr) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-stretch">

        {/* Phần 3 (Col span 3): BẢNG XẾP HẠNG VINH DANH HỌC VIÊN (Thiết kế theo hướng dọc) */}
        <div className="lg:col-span-3 relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#5aa873]/70 bg-[#6ebe87] shadow-[0_8px_30px_rgba(110,190,135,0.16)] flex flex-col justify-between group">
          {/* Subtle glow background clipped */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-emerald-300/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-teal-200/20 blur-2xl" />
          </div>

          <div className="relative z-10">
            {/* Header: Title + Cup icon */}
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-slate-900 shadow-[0_2px_0_rgba(15,23,42,0.15)] flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight">
                    Vinh danh học viên
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-950/80 mt-0.5">
                    Top 3 tháng 9/2026
                  </p>
                </div>
              </div>
            </div>

            {/* Danh sách học viên xếp theo hướng DỌC */}
            <div className="space-y-2.5">
              {honoredStudents.slice(0, 3).map((student) => {
                const rankTheme =
                  student.rank === 1
                    ? {
                        cardBg:
                          "bg-gradient-to-r from-[#fffef0] to-[#fef08a]/40 border-2 border-[#f59e0b] shadow-[0_3px_0_rgba(245,158,11,0.25)]",
                        rankBadge: "bg-amber-400 text-slate-950 shadow-xs",
                        highlightTag: "bg-amber-100 text-amber-950 border-amber-300",
                        xpBadge: "bg-amber-100/90 text-amber-950 border-amber-300/80",
                        hoverText: "group-hover/item:text-amber-800",
                      }
                    : student.rank === 2
                    ? {
                        cardBg:
                          "bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0]/60 border-2 border-[#94a3b8] shadow-[0_3px_0_rgba(148,163,184,0.2)]",
                        rankBadge: "bg-slate-300 text-slate-900 shadow-xs",
                        highlightTag: "bg-slate-100 text-slate-800 border-slate-300",
                        xpBadge: "bg-slate-100/90 text-slate-900 border-slate-300/80",
                        hoverText: "group-hover/item:text-slate-800",
                      }
                    : {
                        cardBg:
                          "bg-gradient-to-r from-[#fff7ed] to-[#fed7aa]/50 border-2 border-[#f97316]/70 shadow-[0_3px_0_rgba(249,115,22,0.2)]",
                        rankBadge: "bg-[#ea580c] text-white shadow-xs",
                        highlightTag: "bg-orange-100 text-orange-950 border-orange-300",
                        xpBadge: "bg-orange-100/90 text-orange-950 border-orange-300/80",
                        hoverText: "group-hover/item:text-orange-800",
                      };

                return (
                  <div
                    key={student.id}
                    onClick={() => (onNavigateTab ? onNavigateTab("history") : undefined)}
                    className={`group/item relative rounded-xl sm:rounded-2xl p-2.5 sm:p-3 hover:-translate-y-0.5 transition-all flex items-center justify-between gap-2.5 cursor-pointer ${rankTheme.cardBg}`}
                  >
                    {/* Left: Rank + Avatar + Name & Tag */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center text-[11px] sm:text-xs font-black shrink-0 ${rankTheme.rankBadge}`}
                      >
                        {student.rank}
                      </span>
                      <div
                        className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${student.avatarBg} text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-2xs border border-white`}
                      >
                        {student.avatarText}
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-xs sm:text-[13px] font-black text-slate-900 ${rankTheme.hoverText} transition-colors truncate leading-tight`}
                        >
                          {student.name}
                        </h4>
                        <span
                          className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border mt-0.5 ${rankTheme.highlightTag}`}
                        >
                          {student.highlightTag}
                        </span>
                      </div>
                    </div>

                    {/* Right: XP Points */}
                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] sm:text-[11px] font-mono font-black px-1.5 py-0.5 rounded-md border ${rankTheme.xpBadge}`}
                      >
                        {student.points}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer: Thứ hạng cá nhân & nút xem chi tiết */}
          <div className="relative z-10 pt-3 mt-3 border-t border-emerald-600/30 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-950">
              Bạn: <strong className="font-black text-slate-950">#12</strong> (2,180 XP)
            </span>
            <button
              type="button"
              onClick={() => (onNavigateTab ? onNavigateTab("history") : undefined)}
              className="px-3 py-1 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-[10px] sm:text-[11px] shadow-sm hover:shadow-md flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Bảng vàng</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Phần 7 (Col span 7): TỔNG QUAN NĂNG LỰC & TIẾN ĐỘ HỌC TẬP (Di chuyển từ Row 1 xuống) */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-200/90 bg-gradient-to-br from-[#ffffff] via-[#f0fdf4] to-[#e6fcf5] shadow-[0_8px_30px_rgba(6,78,59,0.06)] flex flex-col justify-between group">
          {/* Decorative background glow & shapes */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-36 h-36 rounded-bl-[80px] bg-gradient-to-bl from-emerald-100/50 via-teal-50/20 to-transparent pointer-events-none" />

          {/* 3D Mascot: Thumbs up with honor medal & golden star */}
          <div className="absolute right-3 sm:right-5 top-2 sm:top-3 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1 drop-shadow-md z-10 hidden sm:block">
            <Image
              src="/stickers/mastery-capybara.png"
              alt="Mascot năng lực"
              fill
              className="object-contain"
            />
          </div>

          <div className="relative z-10">
            {/* Header: Title & Ranking Badge */}
            <div className="flex items-center justify-between gap-2 mb-3.5 sm:pr-24">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/70 block leading-none">
                    TỔNG QUAN NĂNG LỰC
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {currentSubjectData.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white/90 px-2.5 py-1 rounded-full border border-emerald-200/90 shadow-xs backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-emerald-600 fill-emerald-500" />
                <span>{currentSubjectData.badge}</span>
              </div>
            </div>

            {/* 3 Metric Cards Grid (Hiệu ứng kính mờ & viền màu thanh lịch) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-3.5">
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/85 backdrop-blur-xs border border-emerald-200/70 shadow-xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-semibold">Điểm trung bình</span>
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                  {currentSubjectData.score.toFixed(1)} <span className="text-xs font-medium text-slate-400">/ 10</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{currentSubjectData.scoreGrowth}</span>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-white/85 backdrop-blur-xs border border-blue-200/70 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-semibold">Đề hoàn thành</span>
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                  {currentSubjectData.testsCount} <span className="text-xs font-medium text-slate-400">bài thi</span>
                </div>
                <div className="text-[10px] font-medium text-slate-500 mt-1 truncate">
                  {currentSubjectData.questionsCountLabel}
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-white/85 backdrop-blur-xs border border-teal-200/70 shadow-xs hover:shadow-md hover:border-teal-300 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-semibold">Độ chính xác</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-lg sm:text-xl font-black text-emerald-800 tracking-tight leading-tight">
                  {currentSubjectData.accuracy.toFixed(1)}%
                </div>
                <div className="text-[10px] font-semibold text-emerald-700 mt-1 truncate">
                  {currentSubjectData.accuracyStatus}
                </div>
              </div>
            </div>

            {/* Subject Selector Tabs & Topic Mastery Breakdown */}
            <div className="pt-3 border-t border-emerald-100/80">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <span>Chọn môn học để xem chi tiết:</span>
                <span className="text-emerald-700 font-bold">{currentSubjectData.name}</span>
              </div>

              {/* Subject Pill Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none select-none">
                {subjectList.map((sub) => {
                  const isSelected = selectedSubject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? "bg-gradient-to-r from-[#064e3b] to-[#047857] text-white shadow-xs scale-102"
                          : "bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 border border-emerald-100 shadow-2xs"
                      }`}
                    >
                      <span>{sub.icon}</span>
                      <span>{sub.label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse ml-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
