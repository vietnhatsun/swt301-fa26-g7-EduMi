"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  Check,
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


  const weekStudyData = [
    {
      day: "T2",
      date: "22/9",
      hours: 3.33,
      timeText: "3h 20p",
      cx: 80.0,
      cy: 128.4,
      color: "#10b981",
      badgeFill: "#ecfdf5",
      badgeStroke: "#a7f3d0",
      badgeTextColor: "#047857",
      subjects: "Toán học 2.0h · Tiếng Anh 1h 20p",
      isPeak: false,
    },
    {
      day: "T3",
      date: "23/9",
      hours: 4.17,
      timeText: "4h 10p",
      cx: 168.0,
      cy: 115.4,
      color: "#10b981",
      badgeFill: "#ecfdf5",
      badgeStroke: "#a7f3d0",
      badgeTextColor: "#047857",
      subjects: "Vật lý 2.5h · Ngữ văn 1h 40p",
      isPeak: false,
    },
    {
      day: "T4",
      date: "24/9",
      hours: 2.83,
      timeText: "2h 50p",
      cx: 256.0,
      cy: 136.1,
      color: "#84cc16",
      badgeFill: "#ecfdf5",
      badgeStroke: "#a7f3d0",
      badgeTextColor: "#047857",
      subjects: "Toán 1.5h · Hóa học 1h 20p",
      isPeak: false,
    },
    {
      day: "T5",
      date: "25/9",
      hours: 6.25,
      timeText: "6h 15p",
      cx: 344.0,
      cy: 83.1,
      color: "#eab308",
      badgeFill: "#fef9c3",
      badgeStroke: "#fde047",
      badgeTextColor: "#854d0e",
      subjects: "Tiếng Anh IELTS 3.5h · Toán 2h 45p",
      isPeak: false,
    },
    {
      day: "T6",
      date: "26/9",
      hours: 8.33,
      timeText: "8h 20p",
      cx: 432.0,
      cy: 50.9,
      color: "#f59e0b",
      badgeFill: "#f59e0b",
      badgeStroke: "#f59e0b",
      badgeTextColor: "#ffffff",
      subjects: "Luyện đề THPTQG 5h · Chuyên đề VIP 3h 20p",
      isPeak: true,
    },
    {
      day: "T7",
      date: "27/9",
      hours: 5.67,
      timeText: "5h 40p",
      cx: 520.0,
      cy: 92.1,
      color: "#f97316",
      badgeFill: "#ffedd5",
      badgeStroke: "#fed7aa",
      badgeTextColor: "#c2410c",
      subjects: "Vật lý 3h · Ngữ văn 2h 40p",
      isPeak: false,
    },
    {
      day: "CN",
      date: "28/9",
      hours: 6.17,
      timeText: "6h 10p",
      cx: 608.0,
      cy: 84.4,
      color: "#ea580c",
      badgeFill: "#ffedd5",
      badgeStroke: "#fed7aa",
      badgeTextColor: "#c2410c",
      subjects: "Tổng ôn tuần 3.5h · Thi thử EduMi 2h 40p",
      isPeak: false,
    },
  ];

  // Môn học được chọn trong card Tổng quan năng lực
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState<boolean>(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubjectDropdownOpen(false);
      }
    };
    if (isSubjectDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSubjectDropdownOpen]);

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

  // Lời khuyên học tập chung cho từng môn học
  const subjectAdvice: Record<
    string,
    { title: string; tip: string; ctaText: string }
  > = {
    all: {
      title: "Lời khuyên học tập tổng thể",
      tip: "Phân bổ thời gian hợp lý giữa các môn, duy trì thói quen tự học đều đặn mỗi ngày và chủ động hệ thống hóa lại kiến thức sau mỗi tuần học.",
      ctaText: "Xem tài liệu học",
    },
    math: {
      title: "Lời khuyên môn Toán học",
      tip: "Nắm vững bản chất định lý và công thức cốt lõi trước khi giải bài tập, rèn luyện kỹ năng phân loại dạng đề và luôn kiểm tra lại các bước biến đổi.",
      ctaText: "Luyện bài tập Toán",
    },
    literature: {
      title: "Lời khuyên môn Ngữ văn",
      tip: "Đọc kỹ văn bản để hiểu sâu chủ đề, tích lũy các dẫn chứng đời sống phong phú, rèn luyện cách lập luận chặt chẽ và hành văn mạch lạc, truyền cảm.",
      ctaText: "Xem bài văn mẫu",
    },
    english: {
      title: "Lời khuyên môn Tiếng Anh",
      tip: "Tích lũy từ vựng theo chủ đề gắn liền ngữ cảnh bài đọc, nắm chắc các cấu trúc ngữ pháp trọng tâm và duy trì thói quen luyện đọc hiểu, phát âm mỗi ngày.",
      ctaText: "Luyện đề Tiếng Anh",
    },
    physics: {
      title: "Lời khuyên môn Vật lý",
      tip: "Gắn liền công thức với hiện tượng vật lý thực tế, chú trọng rèn luyện kỹ năng đọc đồ thị và nắm chắc các điều kiện áp dụng của từng định luật.",
      ctaText: "Luyện bài tập Vật lý",
    },
  };


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
      {/* ── BANNER CHÀO MỪNG TỔNG QUAN (Thiết kế đồng bộ theo mẫu tham khảo) ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#024a30] via-[#047857] to-[#059669] shadow-[0_10px_35px_rgba(6,78,59,0.16)] border border-emerald-400/25 flex items-center justify-between min-h-[136px] sm:min-h-[152px] md:min-h-[168px] px-6 sm:px-8 py-5 sm:py-6">
        {/* Luồng sáng ambient tỏa nhẹ phía sau mascot và trung tâm banner */}
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-300/15 blur-3xl pointer-events-none" />
        <div className="absolute right-[24%] bottom-0 w-48 h-36 rounded-full bg-amber-300/12 blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

        {/* Hình minh họa 3D bên phải: Mascot được phóng to cân đối, mây trắng ôm sát đáy */}
        <div className="absolute right-0 bottom-0 pointer-events-none flex items-end justify-end z-0 h-[110%] sm:h-[116%] md:h-[124%] max-w-[85%] sm:max-w-[75%] md:max-w-[66%] lg:max-w-[58%] select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner-mascot.png"
            alt="Mascot chào mừng EduMi"
            className="h-full w-auto object-contain object-bottom-right drop-shadow-sm select-none"
          />
        </div>

        {/* ── HIỆU ỨNG BONG BÓNG NỔI (Floating Translucent Glass Bubbles trải đều sinh động) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {/* Bubble 1: góc trái dưới */}
          <div
            className="banner-bubble animate-bubble-1 w-7 h-7"
            style={{ left: "5%", bottom: "14%", animationDuration: "5.5s" }}
          />
          {/* Bubble 2: gần tag bên trái */}
          <div
            className="banner-bubble animate-bubble-2 w-5 h-5"
            style={{ left: "20%", top: "14%", animationDuration: "4.2s", animationDelay: "0.8s" }}
          />
          {/* Bubble 3: chuyển tiếp giữa text và khoảng giữa */}
          <div
            className="banner-bubble animate-bubble-3 w-4 h-4"
            style={{ left: "34%", bottom: "22%", animationDuration: "4.8s", animationDelay: "1.2s" }}
          />
          {/* Bubble 4: trung tâm phía trên */}
          <div
            className="banner-bubble animate-bubble-1 w-8 h-8"
            style={{ left: "45%", top: "16%", animationDuration: "6.2s", animationDelay: "0.3s" }}
          />
          {/* Bubble 5: trung tâm phía dưới */}
          <div
            className="banner-bubble animate-bubble-2 w-6 h-6"
            style={{ left: "54%", bottom: "20%", animationDuration: "5.0s", animationDelay: "1.7s" }}
          />
          {/* Bubble 6: nhỏ xinh phía trên bên phải */}
          <div
            className="banner-bubble animate-bubble-3 w-5 h-5"
            style={{ right: "16%", top: "12%", animationDuration: "4.5s", animationDelay: "2.1s" }}
          />
        </div>

        {/* ── HIỆU ỨNG NGÔI SAO LẤP LÁNH ĐỘNG (Twinkling & Sparkling Stars lấp đầy khoảng trống) ── */}
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

          {/* Star 2: Trắng tinh khôi lấp lánh góc dưới text */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-white/90 w-3.5 h-3.5 animate-star-2"
            style={{ left: "28%", bottom: "22%", animationDelay: "0.9s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 3: Vàng kim ấm áp ở khu vực giữa (giúp đoạn giữa bớt trống) */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-200 w-4 h-4 animate-star-3"
            style={{ left: "39%", top: "20%", animationDelay: "1.4s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 4: Vàng sáng lấp lánh nổi bật ở trung tâm */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-yellow-300 w-5 h-5 animate-star-1 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
            style={{ left: "48%", bottom: "24%", animationDelay: "0.5s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          {/* Star 5: Sao trắng nhỏ lung linh gần mascot */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-emerald-100 w-3 h-3 animate-star-2"
            style={{ right: "32%", top: "18%", animationDelay: "1.8s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
        </div>

        {/* Bên trái: Nội dung chào mừng & khích lệ học tập */}
        <div className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-1 sm:space-y-1.5 select-none">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
            <span className="text-[#facc15] font-black drop-shadow-xs">TỔNG</span>
            <span className="text-white/95">QUAN HỌC TẬP · BẢNG ĐIỀU KHIỂN</span>
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
            Chào {fullName.split(" ").pop() || "bạn"}, mừng bạn trở lại! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50/95 font-medium drop-shadow-xs leading-relaxed">
            Theo dõi tiến độ, hoàn thành mục tiêu và duy trì phong độ học tập mỗi ngày.
          </p>
        </div>
      </div>

      {/* ── Row 1: Biểu đồ thời gian học tập & Chuỗi ngày học ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card: BIỂU ĐỒ THỜI GIAN HỌC TẬP (Col span 7 - Thiết kế theo đúng ảnh mẫu 100%, chỉ có 7 ngày trong tuần) */}
        <div className="relative overflow-hidden lg:col-span-7 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border border-amber-200/80 bg-gradient-to-b from-[#fffefc] to-[#fffdf9] shadow-[0_10px_35px_rgba(245,158,11,0.06)] flex flex-col justify-between group select-none">
          {/* Subtle ambient light glows */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-amber-300/15 blur-3xl pointer-events-none" />

          {/* ── HEADER: Tiêu đề ── */}
          <div className="relative z-10 flex items-center justify-between gap-3 mb-2 sm:mb-3">
            {/* Cụm Tiêu đề bên trái */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-600/20 flex items-center justify-center">
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-lg">
                    <span>📊</span>
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 text-xs drop-shadow-xs">🪙</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  Thời gian học tập
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Tổng thời gian học trong 7 ngày gần đây
                </p>
              </div>
            </div>
          </div>

          {/* ── BIỂU ĐỒ ĐƯỜNG SVG (7 ngày: T2 đến CN) ── */}
          <div className="relative z-10 w-full pt-1 pb-1">
            <svg
              viewBox="0 0 650 220"
              className="w-full h-auto min-h-[190px] sm:min-h-[220px] overflow-visible"
            >
              <defs>
                {/* Dải màu chuyển tiếp cho nét vẽ (Xanh lá -> Vàng chanh -> Hổ phách -> Cam) */}
                <linearGradient id="studyStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="28%" stopColor="#10b981" />
                  <stop offset="48%" stopColor="#84cc16" />
                  <stop offset="66%" stopColor="#f59e0b" />
                  <stop offset="85%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>

                {/* Dải màu ngang cho vùng diện tích dưới đường biểu đồ */}
                <linearGradient id="studyAreaHGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                  <stop offset="28%" stopColor="#10b981" stopOpacity="0.28" />
                  <stop offset="48%" stopColor="#84cc16" stopOpacity="0.32" />
                  <stop offset="66%" stopColor="#f59e0b" stopOpacity="0.45" />
                  <stop offset="85%" stopColor="#f97316" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.32" />
                </linearGradient>

                {/* Mặt nạ làm mờ dọc từ đỉnh xuống đáy */}
                <linearGradient id="studyAreaVMask" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="65%" stopColor="#ffffff" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                </linearGradient>

                <mask id="studyAreaMask">
                  <rect x="0" y="0" width="650" height="220" fill="url(#studyAreaVMask)" />
                </mask>

                {/* Gradient cho badge kỷ lục T6 */}
                <linearGradient id="peakBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>

                {/* Drop shadow cho badge kỷ lục */}
                <filter id="peakShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#d97706" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Lưới ngang nét đứt tương ứng với các mốc thời gian */}
              <line x1="42" y1="25" x2="640" y2="25" stroke="#f1f5f9" strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="42" y1="56" x2="640" y2="56" stroke="#f1f5f9" strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="42" y1="87" x2="640" y2="87" stroke="#f1f5f9" strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="42" y1="118" x2="640" y2="118" stroke="#f1f5f9" strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="42" y1="149" x2="640" y2="149" stroke="#f1f5f9" strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="42" y1="180" x2="640" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Nhãn trục Y bên trái (đặt tại x=32, tạo khoảng cách 25px tới thẻ T2) */}
              <text x="32" y="29" textAnchor="end" fontSize="10" fontWeight="bold" fill="#94a3b8">10h</text>
              <text x="32" y="60" textAnchor="end" fontSize="10" fontWeight="bold" fill="#94a3b8">8h</text>
              <text x="32" y="91" textAnchor="end" fontSize="10" fontWeight="bold" fill="#94a3b8">6h</text>
              <text x="32" y="122" textAnchor="end" fontSize="10" fontWeight="bold" fill="#94a3b8">4h</text>
              <text x="32" y="153" textAnchor="end" fontSize="10" fontWeight="bold" fill="#94a3b8">2h</text>
              <text x="32" y="184" textAnchor="end" fontSize="10" fontWeight="bold" fill="#94a3b8">0h</text>

              {/* Vùng diện tích mờ dưới đường cong */}
              <path
                d="M 80.0 128.4 C 94.7 126.2, 138.7 114.1, 168.0 115.4 C 197.3 116.7, 226.7 141.5, 256.0 136.1 C 285.3 130.7, 314.7 97.3, 344.0 83.1 C 373.3 68.9, 402.7 49.4, 432.0 50.9 C 461.3 52.4, 490.7 86.5, 520.0 92.1 C 549.3 97.7, 593.3 85.7, 608.0 84.4 L 608.0 180 L 80.0 180 Z"
                fill="url(#studyAreaHGrad)"
                mask="url(#studyAreaMask)"
                className="transition-all duration-300"
              />

              {/* Đường cong uốn lượn mềm mại */}
              <path
                d="M 80.0 128.4 C 94.7 126.2, 138.7 114.1, 168.0 115.4 C 197.3 116.7, 226.7 141.5, 256.0 136.1 C 285.3 130.7, 314.7 97.3, 344.0 83.1 C 373.3 68.9, 402.7 49.4, 432.0 50.9 C 461.3 52.4, 490.7 86.5, 520.0 92.1 C 549.3 97.7, 593.3 85.7, 608.0 84.4"
                fill="none"
                stroke="url(#studyStrokeGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-xs"
              />

              {/* ── CÁC ĐIỂM DỮ LIỆU & THẺ HIỂN THỊ GIỜ (Pill Badges cố định, không hover) ── */}
              {weekStudyData.map((item, idx) => {
                const isPeak = item.isPeak;

                return (
                  <g key={idx}>
                    {/* Thẻ giờ (Pill badge hiển thị giờ học cố định trên mỗi điểm) */}
                    {isPeak ? (
                      /* Badge Kỷ Lục T6: Màu vàng hổ phách nổi bật với mũi tên chỉ xuống */
                      <g filter="url(#peakShadow)">
                        <rect
                          x={item.cx - 26}
                          y={item.cy - 36}
                          width="52"
                          height="22"
                          rx="11"
                          fill="url(#peakBadgeGrad)"
                        />
                        <polygon
                          points={`${item.cx - 4},${item.cy - 14} ${item.cx + 4},${item.cy - 14} ${item.cx},${item.cy - 9}`}
                          fill="#f59e0b"
                        />
                        <text
                          x={item.cx}
                          y={item.cy - 21}
                          textAnchor="middle"
                          fontSize="10.5"
                          fontWeight="900"
                          fill="#ffffff"
                        >
                          {item.timeText}
                        </text>
                      </g>
                    ) : (
                      /* Thẻ giờ thường (Pill badge bo tròn mềm mại) */
                      <g>
                        <rect
                          x={item.cx - 23}
                          y={item.cy - 30}
                          width="46"
                          height="18"
                          rx="9"
                          fill={item.badgeFill}
                          stroke={item.badgeStroke}
                          strokeWidth="1.2"
                        />
                        <text
                          x={item.cx}
                          y={item.cy - 17.5}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="bold"
                          fill={item.badgeTextColor}
                        >
                          {item.timeText}
                        </text>
                      </g>
                    )}

                    {/* Vòng tròn điểm trên đường cong */}
                    {isPeak ? (
                      /* Điểm T6 có ngôi sao trắng ⭐ bên trong */
                      <g>
                        <circle
                          cx={item.cx}
                          cy={item.cy}
                          r="8.5"
                          fill="#f59e0b"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                        />
                        {/* Ngôi sao 5 cánh màu trắng */}
                        <path
                          d={`M ${item.cx} ${item.cy - 4.4} L ${item.cx + 1.3} ${item.cy - 1.4} L ${item.cx + 4.5} ${item.cy - 1.2} L ${item.cx + 2} ${item.cy + 0.8} L ${item.cx + 2.8} ${item.cy + 3.9} L ${item.cx} ${item.cy + 2.2} L ${item.cx - 2.8} ${item.cy + 3.9} L ${item.cx - 2} ${item.cy + 0.8} L ${item.cx - 4.5} ${item.cy - 1.2} L ${item.cx - 1.3} ${item.cy - 1.4} Z`}
                          fill="#ffffff"
                        />
                      </g>
                    ) : (
                      /* Điểm thường: Vòng tròn viền màu, nền trắng */
                      <circle
                        cx={item.cx}
                        cy={item.cy}
                        r="5.5"
                        fill="#ffffff"
                        stroke={item.color}
                        strokeWidth="3"
                      />
                    )}
                  </g>
                );
              })}

              {/* ── NHÃN TRỤC X: T2 đến CN và Ngày tương ứng ── */}
              <g fontSize="11" fontWeight="900" fill="#1e293b" textAnchor="middle">
                {weekStudyData.map((item, idx) => (
                  <text key={`day-${idx}`} x={item.cx} y="201">
                    {item.day}
                  </text>
                ))}
              </g>
              <g fontSize="10" fontWeight="600" fill="#64748b" textAnchor="middle">
                {weekStudyData.map((item, idx) => (
                  <text key={`date-${idx}`} x={item.cx} y="215">
                    {item.date}
                  </text>
                ))}
              </g>
            </svg>
          </div>
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
                        ? "border-2 border-dashed border-orange-500 text-orange-800 bg-white/90 shadow-xs ring-2 ring-orange-300/40"
                        : "bg-amber-100/90 text-amber-800/60 border-2 border-amber-300/85 shadow-[inset_0_1px_2px_rgba(180,83,9,0.08)]"
                  }`}
                >
                  {day.active ? "✓" : ""}
                </div>
                <span className="text-[11px] font-black text-amber-950/80">
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
            {/* Header: Title "Lịch học" with icon + Navigation < Tháng 9/2026 > */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-slate-900 shadow-[0_2px_0_rgba(15,23,42,0.12)] flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-900 stroke-[2.5]" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                  Lịch học
                </h3>
              </div>

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
                              ? "bg-blue-600 text-white font-black shadow-md scale-105 ring-2 ring-blue-300"
                              : "bg-blue-500 text-white font-extrabold shadow-2xs hover:bg-blue-600 hover:scale-105"
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
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
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

          {/* Footer Legend: Ô xanh lá (sắp tới/chưa học) và ô xanh dương (đã học xong) */}
          <div className="relative z-10 pt-2.5 border-t border-amber-300/60 flex items-center justify-between text-[11px] text-slate-700 select-none">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex items-center gap-1.5 font-bold text-[10px] sm:text-[11px] text-emerald-900">
                <span className="w-2.5 h-2.5 rounded-md bg-emerald-500 shadow-2xs" />
                Sắp tới (Chưa học)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-[10px] sm:text-[11px] text-blue-900">
                <span className="w-2.5 h-2.5 rounded-md bg-blue-500 shadow-2xs" />
                Đã học xong
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: BÀI TẬP CẦN LÀM (11fr - Nền cam rực rỡ, đậm đà nổi bật) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border-2 border-orange-500/80 bg-gradient-to-br from-[#fdba74] via-[#fb923c] to-[#f97316] shadow-[0_14px_40px_rgba(249,115,22,0.18)] flex flex-col justify-between group">
          {/* Subtle ambient light glows */}
          <div className="absolute -top-12 -right-8 w-44 h-44 rounded-full bg-purple-400/25 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-14 left-44 w-36 h-36 rounded-full border-[10px] border-emerald-400/30 pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-amber-300/35 blur-2xl pointer-events-none" />

          {/* Left-edge pointer */}
          <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[12px] border-l-orange-600 pointer-events-none z-10" />

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
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-950">
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

      {/* ── Row 3: Khoảng trống dự trữ (7fr bên trái) & Bảng xếp hạng vinh danh (3fr bên phải) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-stretch">

        {/* Khoảng trống dự trữ (Col span 7 - Bên trái): Giữ chỗ chờ bổ sung nội dung sau */}
        <div className="hidden lg:block lg:col-span-7" />

        {/* Phần 3 (Col span 3 - Bên phải): BẢNG XẾP HẠNG VINH DANH HỌC VIÊN (Thiết kế theo tông xanh thương hiệu chính) */}
        <div className="lg:col-span-3 relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-emerald-400/35 bg-gradient-to-br from-[#024a30] via-[#047857] to-[#059669] shadow-[0_10px_35px_rgba(6,78,59,0.18)] flex flex-col justify-between group">
          {/* Subtle glow background clipped */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-emerald-300/15 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-teal-300/15 blur-2xl" />
          </div>

          <div className="relative z-10">
            {/* Header: Title + Cup icon */}
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-slate-900 shadow-[0_2px_0_rgba(15,23,42,0.15)] flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                    Vinh danh học viên
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-emerald-100/90 mt-0.5">
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
          <div className="relative z-10 pt-3 mt-3 border-t border-emerald-400/30 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-white">
              Bạn: <strong className="font-black text-amber-300">#12</strong> (2,180 XP)
            </span>
            <button
              type="button"
              onClick={() => (onNavigateTab ? onNavigateTab("history") : undefined)}
              className="px-3.5 py-1 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-[10px] sm:text-[11px] shadow-sm hover:shadow-md border border-emerald-400/40 flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Bảng vàng</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
