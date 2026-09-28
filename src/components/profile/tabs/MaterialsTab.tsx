"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  RotateCcw,
  FileText,
  Download,
  Eye,
  BookmarkCheck,
  Clock,
  BookOpen,
  Trash2,
  CheckCircle2,
  HardDrive,
  FolderOpen,
  Star,
} from "lucide-react";

export interface SavedMaterial {
  id: string;
  title: string;
  cardCode: string;
  subject: string;
  author: string;
  fileType: "PDF" | "DOCX" | "SLIDE";
  fileSize: string;
  pages: number;
  downloads: number;
  savedAt: string; // ISO date string
  savedLabel: string;
  description: string;
  source: string;
  bgColor: string;
  accentColor: string;
  patternType: "waves" | "clouds" | "confetti" | "stripes" | "ripples" | "chevrons" | "sparkles" | "crosshatch";
}

export default function MaterialsTab() {
  // ── Dữ liệu mẫu: Các tài liệu học sinh đã lưu về từ Kho tài liệu chung ──
  const [materials, setMaterials] = useState<SavedMaterial[]>([
    {
      id: "mat-01",
      title: "Tuyển tập 50 Đề thi thử THPT Quốc Gia môn Toán 2026 (Có giải chi tiết)",
      cardCode: "TOÁN 12",
      subject: "Toán học",
      author: "Ban Chuyên môn Toán EduMi & Thầy Đức",
      fileType: "PDF",
      fileSize: "15.4 MB",
      pages: 180,
      downloads: 45120,
      savedAt: "2026-09-28T10:30:00Z",
      savedLabel: "Vừa lưu hôm nay (2 giờ trước)",
      description:
        "Tổng hợp các dạng bài phân loại 8+ và 9+, phương pháp giải nhanh Hàm số, Tích phân và Hình Oxyz bám sát cấu trúc đề minh họa mới nhất của Bộ GD&ĐT.",
      source: "Kho học liệu THPT Quốc Gia",
      bgColor: "bg-[#e07328]",
      accentColor: "text-[#e07328]",
      patternType: "waves",
    },
    {
      id: "mat-02",
      title: "Cẩm nang 1200 Collocations & Idioms Tiếng Anh thi Đại học điểm 9+",
      cardCode: "IELTS 9+",
      subject: "Tiếng Anh",
      author: "Cô Thu Hà · 8.5 IELTS",
      fileType: "PDF",
      fileSize: "6.2 MB",
      pages: 96,
      downloads: 45240,
      savedAt: "2026-09-27T15:00:00Z",
      savedLabel: "Lưu hôm qua",
      description:
        "Tổng hợp cụm từ cố định, thành ngữ và cụm động từ thường gặp trong các đề thi Tiếng Anh chính thức qua các năm, kèm ví dụ thực tế và bài tập áp dụng.",
      source: "Kho đề thi & Chuyên đề Tiếng Anh",
      bgColor: "bg-[#be4c73]",
      accentColor: "text-[#be4c73]",
      patternType: "clouds",
    },
    {
      id: "mat-03",
      title: "Sơ đồ tư duy & Bí kíp giải nhanh Vật lý 12: Dao động cơ & Sóng cơ",
      cardCode: "VẬT LÝ 12",
      subject: "Vật lý",
      author: "Thầy Quang · Chuyên gia Luyện thi ĐH",
      fileType: "PDF",
      fileSize: "9.8 MB",
      pages: 72,
      downloads: 45360,
      savedAt: "2026-09-25T09:15:00Z",
      savedLabel: "Lưu 3 ngày trước",
      description:
        "Hệ thống hóa toàn bộ công thức cốt lõi bằng Mindmap trực quan, kèm 50 bài tập mẫu có hướng dẫn bấm máy tính Casio tối ưu thời gian làm bài.",
      source: "Kho tài liệu Vật lý Chuyên sâu",
      bgColor: "bg-[#bf5447]",
      accentColor: "text-[#bf5447]",
      patternType: "confetti",
    },
    {
      id: "mat-04",
      title: "Hệ thống Luận điểm & Mở bài - Kết bài độc đáo môn Ngữ văn 12",
      cardCode: "NGỮ VĂN",
      subject: "Ngữ văn",
      author: "Cô Phương Linh · Giảng viên Văn học",
      fileType: "DOCX",
      fileSize: "4.1 MB",
      pages: 64,
      downloads: 45490,
      savedAt: "2026-09-21T08:30:00Z",
      savedLabel: "Lưu 1 tuần trước",
      description:
        "Tuyển chọn các dẫn chứng lý luận văn học sắc bén, các đoạn văn mở kết sáng tạo chinh phục giám khảo chấm thi cho các tác phẩm trọng tâm 12.",
      source: "Kho bài văn mẫu & Nghị luận",
      bgColor: "bg-[#7356bc]",
      accentColor: "text-[#7356bc]",
      patternType: "stripes",
    },
    {
      id: "mat-05",
      title: "Phân dạng & Phương pháp giải bài tập Este - Lipit nâng cao 8+",
      cardCode: "HÓA HỌC",
      subject: "Hóa học",
      author: "Thầy Hùng · Thủ khoa ĐH Dược",
      fileType: "PDF",
      fileSize: "7.5 MB",
      pages: 85,
      downloads: 38200,
      savedAt: "2026-09-14T14:00:00Z",
      savedLabel: "Lưu 2 tuần trước",
      description:
        "Kỹ thuật đồng đẳng hóa, dồn chất và bảo toàn nguyên tố giúp xử lý các câu hỏi điểm 9-10 este đa chức trong 3 phút không bị nhầm lẫn.",
      source: "Kho tài liệu Hóa học EduMi",
      bgColor: "bg-[#0d9488]",
      accentColor: "text-[#0d9488]",
      patternType: "ripples",
    },
    {
      id: "mat-06",
      title: "Slide Tóm tắt Toàn bộ Kiến thức Di truyền học & Tiến hóa Sinh 12",
      cardCode: "SINH HỌC",
      subject: "Sinh học",
      author: "Ban Chuyên môn Sinh học EduMi",
      fileType: "SLIDE",
      fileSize: "18.2 MB",
      pages: 110,
      downloads: 32450,
      savedAt: "2026-08-28T11:20:00Z",
      savedLabel: "Lưu 1 tháng trước",
      description:
        "Slide hình ảnh minh họa sinh động về ADN, phiên mã, dịch mã và quy luật di truyền Menđen, liên kết gen kèm câu hỏi trắc nghiệm củng cố.",
      source: "Kho tài liệu Khoa học Tự nhiên",
      bgColor: "bg-[#0284c7]",
      accentColor: "text-[#0284c7]",
      patternType: "chevrons",
    },
    {
      id: "mat-07",
      title: "Niên biểu Lịch sử Việt Nam giai đoạn 1919 - 1975 trọng tâm",
      cardCode: "LỊCH SỬ",
      subject: "Lịch sử",
      author: "Thầy Hoàng Tuấn · Giảng viên ĐH Sư Phạm",
      fileType: "PDF",
      fileSize: "5.8 MB",
      pages: 58,
      downloads: 29800,
      savedAt: "2026-08-15T09:00:00Z",
      savedLabel: "Lưu hơn 1 tháng trước",
      description:
        "Bảng tổng kết sự kiện, mốc thời gian, ý nghĩa lịch sử các chiến dịch Điện Biên Phủ, Hồ Chí Minh giúp ghi nhớ siêu tốc không bị lẫn lộn.",
      source: "Kho chuyên đề Lịch sử THPT",
      bgColor: "bg-[#b45309]",
      accentColor: "text-[#b45309]",
      patternType: "sparkles",
    },
    {
      id: "mat-08",
      title: "Kỹ năng Khai thác Atlat Địa lý Việt Nam đạt điểm tối đa 9+",
      cardCode: "ĐỊA LÝ 12",
      subject: "Địa lý",
      author: "Cô Mai Anh · Chuyên gia Địa lý THPT",
      fileType: "PDF",
      fileSize: "12.3 MB",
      pages: 92,
      downloads: 31200,
      savedAt: "2026-08-10T14:30:00Z",
      savedLabel: "Lưu hơn 1 tháng trước",
      description:
        "Bí kíp đọc nhanh bản đồ, bảng số liệu, biểu đồ kinh tế xã hội và nhận diện vùng miền trong Atlat mà không cần học vẹt lý thuyết.",
      source: "Kho tài liệu Địa lý Ôn thi ĐH",
      bgColor: "bg-[#4f46e5]",
      accentColor: "text-[#4f46e5]",
      patternType: "crosshatch",
    },
  ]);

  // ── Trạng thái Bộ lọc (Tìm kiếm + Dropdown Thời gian + Dropdown Môn học) ──
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<"all" | "newest" | "recent_7d" | "recent_30d">("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  // ── Modal xem nhanh tài liệu ──
  const [previewMaterial, setPreviewMaterial] = useState<SavedMaterial | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2800);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTimeDropdownOpen(false);
      }
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubjectDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTimeFilter("all");
    setSelectedSubject("all");
    setIsTimeDropdownOpen(false);
    setIsSubjectDropdownOpen(false);
  };

  // Các tùy chọn bộ lọc thời gian: "Mới nhất" và "Tất cả"
  const timeOptions = [
    { id: "all", label: "Tất cả", desc: "Tất cả tài liệu đã lưu" },
    { id: "newest", label: "Mới nhất", desc: "Ưu tiên tài liệu lưu gần đây nhất" },
    { id: "recent_7d", label: "7 ngày qua", desc: "Tài liệu lưu trong tuần này" },
    { id: "recent_30d", label: "30 ngày qua", desc: "Tài liệu lưu trong tháng này" },
  ];

  const subjectOptions = [
    { id: "all", label: "Tất cả môn học", icon: "📚" },
    { id: "Toán học", label: "Toán học", icon: "📐" },
    { id: "Ngữ văn", label: "Ngữ văn", icon: "📖" },
    { id: "Tiếng Anh", label: "Tiếng Anh", icon: "🇬🇧" },
    { id: "Vật lý", label: "Vật lý", icon: "⚡" },
    { id: "Hóa học", label: "Hóa học", icon: "🧪" },
    { id: "Sinh học", label: "Sinh học", icon: "🧬" },
    { id: "Lịch sử", label: "Lịch sử", icon: "🏛️" },
    { id: "Địa lý", label: "Địa lý", icon: "🌍" },
  ];

  // Xóa tài liệu khỏi danh sách đã lưu
  const handleRemoveMaterial = (id: string, title: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast(`Đã bỏ lưu "${title}"`);
  };

  // Tải tài liệu
  const handleDownload = (material: SavedMaterial) => {
    showToast(`Đang tải xuống: ${material.title} (${material.fileSize})`);
  };

  // Tính toán danh sách sau khi lọc
  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedTimeFilter !== "all" ||
    selectedSubject !== "all";

  const now = new Date("2026-09-28T15:53:00Z").getTime();

  let filteredMaterials = materials.filter((item) => {
    // 1. Tìm kiếm từ khóa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchAuthor = item.author.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchAuthor && !matchDesc) return false;
    }

    // 2. Lọc môn học
    if (selectedSubject !== "all" && item.subject !== selectedSubject) {
      return false;
    }

    // 3. Lọc theo thời gian
    if (selectedTimeFilter === "recent_7d") {
      const itemTime = new Date(item.savedAt).getTime();
      const diffDays = (now - itemTime) / (1000 * 3600 * 24);
      if (diffDays > 7) return false;
    } else if (selectedTimeFilter === "recent_30d") {
      const itemTime = new Date(item.savedAt).getTime();
      const diffDays = (now - itemTime) / (1000 * 3600 * 24);
      if (diffDays > 30) return false;
    }

    return true;
  });

  // Nếu chọn "Mới nhất", sắp xếp ngày lưu mới nhất lên đầu
  if (selectedTimeFilter === "newest") {
    filteredMaterials = [...filteredMaterials].sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }

  // Component vẽ các hoa văn doodle sinh động (Doodle patterns giống ảnh mẫu)
  const renderCardPattern = (pattern: SavedMaterial["patternType"]) => {
    switch (pattern) {
      case "waves":
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
            viewBox="0 0 300 400"
            preserveAspectRatio="none"
          >
            <path
              d="M-50,80 Q50,20 150,100 T350,60"
              fill="none"
              stroke="white"
              strokeWidth="34"
              strokeLinecap="round"
            />
            <path
              d="M-30,220 Q70,150 170,230 T370,190"
              fill="none"
              stroke="white"
              strokeWidth="38"
              strokeLinecap="round"
            />
            <path
              d="M-40,360 Q60,300 160,370 T360,330"
              fill="none"
              stroke="white"
              strokeWidth="32"
              strokeLinecap="round"
            />
          </svg>
        );

      case "clouds":
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 300 400"
            preserveAspectRatio="none"
          >
            <path
              d="M-20,130 Q40,70 100,130 Q160,60 220,120 Q280,70 340,130 L340,-20 L-20,-20 Z"
              fill="white"
            />
            <path
              d="M-20,250 Q50,180 120,240 Q190,170 260,240 Q310,190 340,230 L340,-20 L-20,-20 Z"
              fill="white"
              opacity="0.6"
            />
            <path
              d="M-20,370 Q60,300 140,360 Q220,290 300,360 L340,360 L340,-20 L-20,-20 Z"
              fill="white"
              opacity="0.4"
            />
          </svg>
        );

      case "confetti":
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
            viewBox="0 0 300 400"
          >
            <g stroke="white" strokeWidth="8" strokeLinecap="round">
              <line x1="30" y1="40" x2="55" y2="65" />
              <line x1="90" y1="30" x2="115" y2="55" />
              <line x1="160" y1="50" x2="185" y2="75" />
              <line x1="230" y1="35" x2="255" y2="60" />

              <line x1="45" y1="120" x2="70" y2="145" />
              <line x1="120" y1="105" x2="145" y2="130" />
              <line x1="200" y1="115" x2="225" y2="140" />
              <line x1="265" y1="110" x2="290" y2="135" />

              <line x1="25" y1="200" x2="50" y2="225" />
              <line x1="100" y1="190" x2="125" y2="215" />
              <line x1="175" y1="195" x2="200" y2="220" />
              <line x1="245" y1="185" x2="270" y2="210" />

              <line x1="40" y1="280" x2="65" y2="305" />
              <line x1="115" y1="270" x2="140" y2="295" />
              <line x1="190" y1="285" x2="215" y2="310" />
              <line x1="260" y1="275" x2="285" y2="300" />
            </g>
          </svg>
        );

      case "stripes":
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 300 400"
          >
            <g stroke="white" strokeWidth="26">
              <line x1="-50" y1="0" x2="400" y2="450" />
              <line x1="-50" y1="80" x2="400" y2="530" />
              <line x1="-50" y1="160" x2="400" y2="610" />
              <line x1="-50" y1="240" x2="400" y2="690" />
              <line x1="-50" y1="-80" x2="400" y2="370" />
              <line x1="-50" y1="-160" x2="400" y2="290" />
            </g>
          </svg>
        );

      case "ripples":
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 300 400"
          >
            <circle cx="280" cy="80" r="40" fill="none" stroke="white" strokeWidth="18" />
            <circle cx="280" cy="80" r="95" fill="none" stroke="white" strokeWidth="20" />
            <circle cx="280" cy="80" r="155" fill="none" stroke="white" strokeWidth="22" />
            <circle cx="20" cy="340" r="50" fill="none" stroke="white" strokeWidth="18" />
            <circle cx="20" cy="340" r="115" fill="none" stroke="white" strokeWidth="20" />
          </svg>
        );

      case "chevrons":
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 300 400"
          >
            <path
              d="M-20,90 L45,45 L115,90 L185,45 L255,90 L325,45"
              fill="none"
              stroke="white"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M-20,200 L45,155 L115,200 L185,155 L255,200 L325,155"
              fill="none"
              stroke="white"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M-20,310 L45,265 L115,310 L185,265 L255,310 L325,265"
              fill="none"
              stroke="white"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case "sparkles":
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
            viewBox="0 0 300 400"
          >
            <g fill="white">
              <path d="M60,60 C60,75 75,75 75,75 C75,75 60,75 60,90 C60,75 45,75 45,75 C45,75 60,75 60,60 Z" />
              <path d="M230,110 C230,130 250,130 250,130 C250,130 230,130 230,150 C230,130 210,130 210,130 C210,130 230,130 230,110 Z" />
              <path d="M80,240 C80,260 100,260 100,260 C100,260 80,260 80,280 C80,260 60,260 60,260 C60,260 80,260 80,240 Z" />
              <path d="M220,300 C220,318 238,318 238,318 C238,318 220,318 220,336 C220,318 202,318 202,318 C202,318 220,318 220,300 Z" />
              <circle cx="150" cy="50" r="7" />
              <circle cx="35" cy="160" r="6" />
              <circle cx="265" cy="220" r="7" />
              <circle cx="145" cy="340" r="6" />
            </g>
          </svg>
        );

      case "crosshatch":
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 300 400"
          >
            <g stroke="white" strokeWidth="4">
              <line x1="0" y1="50" x2="300" y2="50" />
              <line x1="0" y1="110" x2="300" y2="110" />
              <line x1="0" y1="170" x2="300" y2="170" />
              <line x1="0" y1="230" x2="300" y2="230" />
              <line x1="0" y1="290" x2="300" y2="290" />
              <line x1="0" y1="350" x2="300" y2="350" />

              <line x1="60" y1="0" x2="60" y2="400" />
              <line x1="120" y1="0" x2="120" y2="400" />
              <line x1="180" y1="0" x2="180" y2="400" />
              <line x1="240" y1="0" x2="240" y2="400" />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl text-xs sm:text-sm font-medium border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── KHUNG BANNER TÀI LIỆU (Thiết kế đồng bộ 100% với ClassesTab) ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#059669] to-[#047857] shadow-sm flex items-center justify-between min-h-[110px] sm:min-h-[125px] md:min-h-[135px] px-6 sm:px-8 py-5 sm:py-6">
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

          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-amber-300 w-4 h-4 animate-star-2"
            style={{ left: "83%", top: "22%", animationDelay: "0.5s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>

          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute text-yellow-100 w-2.5 h-2.5 animate-star-3"
            style={{ left: "19%", bottom: "16%", animationDelay: "1.8s" }}
          >
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
        </div>

        {/* Bên trái: Tiêu đề banner */}
        <div className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg space-y-1 sm:space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-200/90 flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>KHO TÀI LIỆU CHUNG · ĐÃ LƯU</span>
          </p>
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight leading-tight">
            Kho tài liệu đã lưu của bạn
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
            Quản lý và ôn tập các tài liệu, đề thi bạn đã lưu từ kho tài liệu chung EduMi.
          </p>
        </div>

        {/* Bên phải: Tranh minh họa mascot chìm sâu */}
        <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-64 md:w-80 lg:w-96 h-full overflow-hidden pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src="/classes/banner-illustration.jpg"
              alt="Mascot tài liệu học tập EduMi"
              fill
              priority
              sizes="(max-width: 640px) 190px, 360px"
              className="object-cover object-right [mask-image:linear-gradient(to_left,black_65%,transparent)]"
            />
          </div>
        </div>
      </div>

      {/* ── BỘ LỌC TÀI LIỆU (NẰM GIỮA BANNER VÀ DANH SÁCH TÀI LIỆU) ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 border border-slate-200/80 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-3">
        {/* Hàng điều khiển: Tìm kiếm + 2 Dropdown (Thời gian lưu + Môn học) */}
        <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between">
          {/* Thanh tìm kiếm */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên tài liệu, môn học, tác giả..."
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

          {/* Cụm 2 Dropdown (Thời gian lưu & Môn học) & Nút Đặt lại */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Dropdown 1: Lọc theo thời gian lưu (Mới nhất & Tất cả) */}
            <div className="relative flex-1 sm:flex-initial" ref={timeDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsTimeDropdownOpen(!isTimeDropdownOpen);
                  setIsSubjectDropdownOpen(false);
                }}
                className={`inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer w-full sm:w-auto min-w-[145px] ${
                  selectedTimeFilter !== "all"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs font-bold"
                    : "bg-slate-50/70 hover:bg-white border-slate-200/90 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {timeOptions.find((t) => t.id === selectedTimeFilter)?.label || "Tất cả"}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isTimeDropdownOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {/* Menu thời gian */}
              {isTimeDropdownOpen && (
                <div className="absolute right-0 sm:left-0 sm:right-auto mt-1.5 w-52 sm:w-56 rounded-2xl bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    Thời gian lưu tài liệu
                  </div>
                  <div className="space-y-0.5">
                    {timeOptions.map((opt) => {
                      const isSelected = selectedTimeFilter === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedTimeFilter(opt.id as any);
                            setIsTimeDropdownOpen(false);
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

            {/* Dropdown 2: Lọc theo môn học */}
            <div className="relative flex-1 sm:flex-initial" ref={subjectDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
                  setIsTimeDropdownOpen(false);
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
                <div className="absolute right-0 mt-1.5 w-48 sm:w-52 rounded-2xl bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    Lọc theo môn học
                  </div>
                  <div className="space-y-0.5 max-h-60 overflow-y-auto">
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

        {/* Hàng chip bộ lọc đang áp dụng */}
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

              {selectedTimeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold">
                  Thời gian: {timeOptions.find((t) => t.id === selectedTimeFilter)?.label}
                  <button
                    type="button"
                    onClick={() => setSelectedTimeFilter("all")}
                    className="hover:text-rose-600 cursor-pointer ml-0.5"
                    title="Xóa lọc thời gian"
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
                    title="Xóa lọc môn"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-rose-600 font-medium underline underline-offset-2 cursor-pointer ml-auto"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* ── THANH THỐNG KÊ NHẸ ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 text-xs">
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4 text-emerald-600" />
            <span>
              Đang hiển thị <strong className="text-slate-900">{filteredMaterials.length}</strong> tài liệu đã lưu
            </span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>Kho tài liệu cá nhân EduMi</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 italic">
            Lưu trực tiếp từ kho tài liệu chung của hệ thống
          </span>
        </div>
      </div>

      {/* ── DANH SÁCH THẺ TÀI LIỆU (4 CARD TRÊN MỖI HÀNG, THIẾT KẾ ĐỘC ĐÁO THEO ẢNH MẪU) ── */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewMaterial(item)}
              className={`relative overflow-hidden rounded-[26px] sm:rounded-[30px] p-5 sm:p-5.5 min-h-[350px] sm:min-h-[365px] flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group select-none text-white ${item.bgColor}`}
            >
              {/* Lớp hoa văn doodle nền sống động (Wavy, Clouds, Confetti, Stripes,...) */}
              {renderCardPattern(item.patternType)}

              {/* Lớp gradient đổ bóng nhẹ cho phần text nổi bật */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25 pointer-events-none" />

              {/* ── HEADER THẺ: Tag nhận diện + Icon tai nghe/file + Nút bỏ lưu ── */}
              <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[11px] font-bold tracking-wide text-white/90 truncate uppercase">
                    edumi | {item.subject.toLowerCase()}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-xs text-[9px] font-extrabold text-white">
                    {item.fileType}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMaterial(item.id, item.title);
                    }}
                    className="w-7 h-7 rounded-full bg-black/15 hover:bg-rose-600/80 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    title="Bỏ lưu tài liệu này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── BODY THẺ: Tiêu đề to đậm phá cách + Tên tài liệu + Thông số ── */}
              <div className="relative z-10 my-auto py-2">
                {/* Tiêu đề ngắn to đậm phong cách Retro/Chubby như ảnh mẫu ("TEST 1", "TEST 2",...) */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none drop-shadow-md mb-2 font-sans group-hover:scale-105 transition-transform origin-left">
                  {item.cardCode}
                </h2>

                {/* Tiêu đề chi tiết tài liệu */}
                <h3 className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-2 drop-shadow-xs mb-3 text-white/95">
                  {item.title}
                </h3>

                {/* Dòng thông số đánh giá và số trang y hệt ảnh mẫu */}
                <div className="flex items-center gap-2 text-white/90 text-[11px] font-semibold flex-wrap">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span>{item.downloads.toLocaleString("vi-VN")} lượt xem</span>
                  </span>
                  <span className="opacity-70">|</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-white/90" />
                    <span>{item.pages} trang</span>
                  </span>
                </div>
              </div>

              {/* ── FOOTER THẺ: 2 Nút bo tròn màu trắng nổi bật như ảnh mẫu ── */}
              <div className="relative z-10 grid grid-cols-2 gap-2 pt-3">
                {/* Nút 1: Xem */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewMaterial(item);
                  }}
                  className="w-full py-2.5 px-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all cursor-pointer group/btn"
                >
                  <Eye className={`w-3.5 h-3.5 ${item.accentColor}`} />
                  <span>Xem</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Nút 2: Tải về */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(item);
                  }}
                  className="w-full py-2.5 px-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all cursor-pointer group/btn"
                >
                  <Download className={`w-3.5 h-3.5 ${item.accentColor}`} />
                  <span className="truncate">Tải về</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7 text-emerald-600" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy tài liệu phù hợp
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Không có tài liệu đã lưu nào khớp với từ khóa hoặc bộ lọc bạn đang chọn.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      )}

      {/* ── MODAL XEM TRƯỚC TÀI LIỆU ── */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {previewMaterial.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {previewMaterial.fileType}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {previewMaterial.savedLabel}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {previewMaterial.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 space-y-1.5">
                <p className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Nguồn gốc tài liệu
                </p>
                <p className="text-emerald-800 text-xs font-medium">
                  Tài liệu này được bạn lưu về từ{" "}
                  <strong>{previewMaterial.source}</strong> thuộc hệ thống kho tài liệu chung EduMi.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Nội dung tóm tắt:</h4>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {previewMaterial.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tác giả</span>
                  <span className="font-bold text-slate-800">{previewMaterial.author}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Độ dài</span>
                  <span className="font-bold text-slate-800">{previewMaterial.pages} trang</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Dung lượng</span>
                  <span className="font-bold text-slate-800">{previewMaterial.fileSize}</span>
                </div>
              </div>
            </div>

            {/* Hành động Modal */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(previewMaterial);
                  setPreviewMaterial(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải tài liệu ({previewMaterial.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
