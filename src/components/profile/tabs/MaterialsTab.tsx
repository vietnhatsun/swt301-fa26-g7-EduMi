"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  X,
  Filter,
  Check,
  RotateCcw,
  FileText,
  Download,
  Eye,
  BookmarkCheck,
  Bookmark,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Layers,
  Share2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  HardDrive,
  FolderOpen,
} from "lucide-react";

export interface SavedMaterial {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  author: string;
  fileType: "PDF" | "DOCX" | "SLIDE";
  fileSize: string;
  pages: number;
  downloads: number;
  savedAt: string; // ISO date string
  savedLabel: string;
  description: string;
  source: string;
  isFavorite?: boolean;
}

export default function MaterialsTab() {
  // ── Dữ liệu mẫu: Các tài liệu học sinh đã lưu về từ Kho tài liệu chung ──
  const [materials, setMaterials] = useState<SavedMaterial[]>([
    {
      id: "mat-01",
      title: "Tuyển tập 50 Đề thi thử THPT Quốc Gia môn Toán 2026 (Có giải chi tiết)",
      subject: "Toán học",
      subjectColor: "bg-blue-50 text-blue-700 border-blue-200",
      author: "Ban Chuyên môn Toán EduMi & Thầy Đức",
      fileType: "PDF",
      fileSize: "15.4 MB",
      pages: 180,
      downloads: 3420,
      savedAt: "2026-09-28T10:30:00Z",
      savedLabel: "Vừa lưu hôm nay (2 giờ trước)",
      description:
        "Tổng hợp các dạng bài phân loại 8+ và 9+, phương pháp giải nhanh Hàm số, Tích phân và Hình Oxyz bám sát cấu trúc đề minh họa mới nhất của Bộ GD&ĐT.",
      source: "Kho học liệu THPT Quốc Gia",
      isFavorite: true,
    },
    {
      id: "mat-02",
      title: "Cẩm nang 1200 Collocations & Idioms Tiếng Anh thi Đại học điểm 9+",
      subject: "Tiếng Anh",
      subjectColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      author: "Cô Thu Hà · 8.5 IELTS",
      fileType: "PDF",
      fileSize: "6.2 MB",
      pages: 96,
      downloads: 2890,
      savedAt: "2026-09-27T15:00:00Z",
      savedLabel: "Lưu hôm qua",
      description:
        "Tổng hợp cụm từ cố định, thành ngữ và cụm động từ thường gặp trong các đề thi Tiếng Anh chính thức qua các năm, kèm ví dụ thực tế và bài tập áp dụng.",
      source: "Kho đề thi & Chuyên đề Tiếng Anh",
      isFavorite: true,
    },
    {
      id: "mat-03",
      title: "Sơ đồ tư duy & Bí kíp giải nhanh Vật lý 12: Dao động cơ & Sóng cơ",
      subject: "Vật lý",
      subjectColor: "bg-purple-50 text-purple-700 border-purple-200",
      author: "Thầy Quang · Chuyên gia Luyện thi ĐH",
      fileType: "PDF",
      fileSize: "9.8 MB",
      pages: 72,
      downloads: 1940,
      savedAt: "2026-09-25T09:15:00Z",
      savedLabel: "Lưu 3 ngày trước",
      description:
        "Hệ thống hóa toàn bộ công thức cốt lõi bằng Mindmap trực quan, kèm 50 bài tập mẫu có hướng dẫn bấm máy tính Casio tối ưu thời gian làm bài.",
      source: "Kho tài liệu Vật lý Chuyên sâu",
      isFavorite: false,
    },
    {
      id: "mat-04",
      title: "Hệ thống Luận điểm & Mở bài - Kết bài độc đáo môn Ngữ văn 12",
      subject: "Ngữ văn",
      subjectColor: "bg-rose-50 text-rose-700 border-rose-200",
      author: "Cô Phương Linh · Giảng viên Văn học",
      fileType: "DOCX",
      fileSize: "4.1 MB",
      pages: 64,
      downloads: 2150,
      savedAt: "2026-09-21T08:30:00Z",
      savedLabel: "Lưu 1 tuần trước",
      description:
        "Tuyển chọn các dẫn chứng lý luận văn học sắc bén, các đoạn văn mở kết sáng tạo chinh phục giám khảo chấm thi cho các tác phẩm trọng tâm 12.",
      source: "Kho bài văn mẫu & Nghị luận",
      isFavorite: false,
    },
    {
      id: "mat-05",
      title: "Phân dạng & Phương pháp giải bài tập Este - Lipit nâng cao 8+",
      subject: "Hóa học",
      subjectColor: "bg-amber-50 text-amber-700 border-amber-200",
      author: "Thầy Hùng · Thủ khoa ĐH Dược",
      fileType: "PDF",
      fileSize: "7.5 MB",
      pages: 85,
      downloads: 1680,
      savedAt: "2026-09-14T14:00:00Z",
      savedLabel: "Lưu 2 tuần trước",
      description:
        "Kỹ thuật đồng đẳng hóa, dồn chất và bảo toàn nguyên tố giúp xử lý các câu hỏi điểm 9-10 este đa chức trong 3 phút không bị nhầm lẫn.",
      source: "Kho tài liệu Hóa học EduMi",
      isFavorite: false,
    },
    {
      id: "mat-06",
      title: "Slide Tóm tắt Toàn bộ Kiến thức Di truyền học & Tiến hóa Sinh 12",
      subject: "Sinh học",
      subjectColor: "bg-teal-50 text-teal-700 border-teal-200",
      author: "Ban Chuyên môn Sinh học EduMi",
      fileType: "SLIDE",
      fileSize: "18.2 MB",
      pages: 110,
      downloads: 1230,
      savedAt: "2026-08-28T11:20:00Z",
      savedLabel: "Lưu 1 tháng trước",
      description:
        "Slide hình ảnh minh họa sinh động về ADN, phiên mã, dịch mã và quy luật di truyền Menđen, liên kết gen kèm câu hỏi trắc nghiệm củng cố.",
      source: "Kho tài liệu Khoa học Tự nhiên",
      isFavorite: false,
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

  // Các tùy chọn bộ lọc thời gian theo yêu cầu người dùng:
  // "dropdown bộ lọc thì nên là lưu theo thời gian mới nhất và tất cả"
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
  ];

  // Xóa tài liệu khỏi danh sách đã lưu
  const handleRemoveMaterial = (id: string, title: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast(`Đã xóa "${title}" khỏi danh sách lưu trữ`);
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

  // Lọc tài liệu
  const now = new Date("2026-09-28T12:54:00Z").getTime();

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

  // Helper trả về badge loại file
  const renderFileTypeBadge = (type: SavedMaterial["fileType"]) => {
    switch (type) {
      case "PDF":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
            PDF
          </span>
        );
      case "DOCX":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
            DOCX
          </span>
        );
      case "SLIDE":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            SLIDE
          </span>
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

        {/* Bên phải: Hình ảnh chìm sâu tự nhiên vào góc phải banner */}
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
            {/* Dropdown 1: Lọc theo thời gian lưu (Mới nhất & Tất cả theo yêu cầu) */}
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

      {/* ── THANH THỐNG KÊ NHẸ & ĐƯỜNG DẪN ĐẾN KHO HỌC LIỆU CHUNG ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 text-xs">
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4 text-emerald-600" />
            <span>
              Đã lưu <strong className="text-slate-900">{filteredMaterials.length}</strong> tài liệu
            </span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>Kho lưu trữ cá nhân EduMi</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 italic">
            Lưu trực tiếp từ kho tài liệu chung của hệ thống
          </span>
        </div>
      </div>

      {/* ── DANH SÁCH THẺ TÀI LIỆU (GRID CARDS) ── */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 hover:border-emerald-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(5,150,105,0.08)] transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header card: Môn học, Loại file, Thời gian đã lưu */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${item.subjectColor}`}
                    >
                      {item.subject}
                    </span>
                    {renderFileTypeBadge(item.fileType)}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200/60">
                      <BookmarkCheck className="w-3 h-3 text-emerald-600" />
                      <span>{item.savedLabel}</span>
                    </span>
                  </div>

                  {/* Nút xóa bỏ lưu */}
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(item.id, item.title)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Bỏ lưu tài liệu này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Tiêu đề tài liệu */}
                <h3
                  onClick={() => setPreviewMaterial(item)}
                  className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2 mb-2"
                >
                  {item.title}
                </h3>

                {/* Mô tả tóm tắt */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 font-normal">
                  {item.description}
                </p>

                {/* Metadata tác giả và nguồn */}
                <div className="text-[11px] text-slate-400 space-y-1 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="font-semibold text-slate-700">Tác giả:</span>
                    <span className="truncate">{item.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700/80">
                    <span className="font-semibold text-slate-500">Nguồn:</span>
                    <span className="truncate">{item.source}</span>
                  </div>
                </div>
              </div>

              {/* Footer card: Dung lượng, số trang, hành động */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.pages} trang</span>
                  </span>
                  <span>·</span>
                  <span>{item.fileSize}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMaterial(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem trước</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về</span>
                  </button>
                </div>
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
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${previewMaterial.subjectColor}`}
                  >
                    {previewMaterial.subject}
                  </span>
                  {renderFileTypeBadge(previewMaterial.fileType)}
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
