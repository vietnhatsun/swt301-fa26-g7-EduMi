"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  GraduationCap,
  LibraryBig,
  Clock,
  Target,
  SlidersHorizontal,
  X,
  Check,
  KeyRound,
} from "lucide-react";
import { ExamCategory, ExamSubject, ExamDifficulty } from "./exam-data";

interface ExamFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ExamCategory;
  onCategoryChange: (value: ExamCategory) => void;
  selectedSubject: ExamSubject;
  onSubjectChange: (value: ExamSubject) => void;
  selectedDuration: string;
  onDurationChange: (value: string) => void;
  selectedDifficulty: ExamDifficulty;
  onDifficultyChange: (value: ExamDifficulty) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES: ExamCategory[] = [
  "Tất cả",
  "THPT Quốc Gia",
  "ĐGNL ĐHQG",
  "ĐGTD Bách Khoa",
  "Kiểm tra Học kỳ",
];

const SUBJECTS: ExamSubject[] = [
  "Tất cả",
  "Toán học",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Tiếng Anh",
  "Ngữ văn",
  "Lịch sử",
  "Địa lý",
];

const DURATIONS = [
  { label: "Tất cả", value: "all" },
  { label: "15 - 45 phút", value: "short" },
  { label: "50 - 60 phút", value: "medium" },
  { label: "90 - 150 phút", value: "long" },
];

const DIFFICULTIES: ExamDifficulty[] = [
  "Tất cả",
  "Cơ bản (5-7đ)",
  "Vận dụng (7-8.5đ)",
  "Vận dụng cao (9-10đ)",
];

const SORTS = [
  { label: "Phổ biến", value: "popular" },
  { label: "Lượt thi nhiều nhất", value: "attempts" },
  { label: "Đánh giá cao nhất", value: "rating" },
  { label: "Thời gian ngắn nhất", value: "duration_asc" },
];

export default function ExamFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSubject,
  onSubjectChange,
  selectedDuration,
  onDurationChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedSort,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}: ExamFilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close any open dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const getDurationLabel = () => {
    const found = DURATIONS.find((d) => d.value === selectedDuration);
    return found && found.value !== "all" ? found.label : "Thời gian";
  };

  const getSortLabel = () => {
    const found = SORTS.find((s) => s.value === selectedSort);
    return found ? found.label : "Phổ biến";
  };

  return (
    <div
      ref={containerRef}
      className="relative z-30 mx-auto -mt-[32px] flex h-[74px] max-w-[1390px] items-center gap-3 rounded-[32px] bg-white px-6 shadow-[0_12px_34px_rgba(25,60,35,0.12)]"
    >
      {/* Search input */}
      <div className="flex h-[50px] min-w-0 flex-[1.1] items-center gap-3 rounded-full border border-[#e2e9e2] bg-white px-5 text-[#7a8795] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
        <Search className="h-5 w-5 shrink-0 text-[#00a66f]" />
        <input
          suppressHydrationWarning
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm tên đề thi, giáo viên hoặc nhập Mã PIN (VD: EDM-8899)..."
          className="w-full bg-transparent text-[15px] font-semibold text-[#10213a] placeholder:text-[#8b98a5] focus:outline-none"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            title="Xóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            suppressHydrationWarning
            type="button"
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                if (text) onSearchChange(text.trim());
              } catch {
                // clipboard API not permitted
              }
            }}
            className="hidden sm:flex items-center gap-1 shrink-0 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 px-2.5 py-1 text-[11px] font-bold text-slate-500 transition cursor-pointer"
            title="Dán nhanh mã PIN từ bộ nhớ đệm"
          >
            <KeyRound className="h-3 w-3" />
            <span>Dán mã PIN</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="relative shrink-0">
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => toggleDropdown("category")}
          className={`flex h-[50px] items-center gap-3 rounded-full border px-5 text-[15px] font-extrabold transition cursor-pointer select-none ${
            selectedCategory !== "Tất cả"
              ? "border-emerald-500 bg-emerald-50 text-emerald-800"
              : "border-[#e2e9e2] bg-white text-[#10213a] hover:border-emerald-400 hover:bg-emerald-50/60"
          }`}
        >
          <GraduationCap className="h-5 w-5 text-[#2e466b]" />
          <span>{selectedCategory === "Tất cả" ? "Kỳ thi" : selectedCategory}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "category" ? "rotate-180" : ""}`} />
        </button>

        {openDropdown === "category" && (
          <div className="absolute left-0 top-[56px] z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-400">Chọn Kỳ thi / Mục tiêu</div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onCategoryChange(cat);
                  setOpenDropdown(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Subject Filter */}
      <div className="relative shrink-0">
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => toggleDropdown("subject")}
          className={`flex h-[50px] items-center gap-3 rounded-full border px-5 text-[15px] font-extrabold transition cursor-pointer select-none ${
            selectedSubject !== "Tất cả"
              ? "border-emerald-500 bg-emerald-50 text-emerald-800"
              : "border-[#e2e9e2] bg-white text-[#10213a] hover:border-emerald-400 hover:bg-emerald-50/60"
          }`}
        >
          <LibraryBig className="h-5 w-5 text-[#2e466b]" />
          <span>{selectedSubject === "Tất cả" ? "Môn học" : selectedSubject}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "subject" ? "rotate-180" : ""}`} />
        </button>

        {openDropdown === "subject" && (
          <div className="absolute left-0 top-[56px] z-50 w-52 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-400">Chọn Môn học</div>
            {SUBJECTS.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  onSubjectChange(sub);
                  setOpenDropdown(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                  selectedSubject === sub
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{sub}</span>
                {selectedSubject === sub && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Duration Filter */}
      <div className="relative shrink-0">
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => toggleDropdown("duration")}
          className={`flex h-[50px] items-center gap-3 rounded-full border px-5 text-[15px] font-extrabold transition cursor-pointer select-none ${
            selectedDuration !== "all"
              ? "border-emerald-500 bg-emerald-50 text-emerald-800"
              : "border-[#e2e9e2] bg-white text-[#10213a] hover:border-emerald-400 hover:bg-emerald-50/60"
          }`}
        >
          <Clock className="h-5 w-5 text-[#2e466b]" />
          <span>{getDurationLabel()}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "duration" ? "rotate-180" : ""}`} />
        </button>

        {openDropdown === "duration" && (
          <div className="absolute left-0 top-[56px] z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-400">Thời gian làm bài</div>
            {DURATIONS.map((dur) => (
              <button
                key={dur.value}
                type="button"
                onClick={() => {
                  onDurationChange(dur.value);
                  setOpenDropdown(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                  selectedDuration === dur.value
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{dur.label}</span>
                {selectedDuration === dur.value && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Difficulty Filter */}
      <div className="relative shrink-0">
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => toggleDropdown("difficulty")}
          className={`flex h-[50px] items-center gap-3 rounded-full border px-5 text-[15px] font-extrabold transition cursor-pointer select-none ${
            selectedDifficulty !== "Tất cả"
              ? "border-emerald-500 bg-emerald-50 text-emerald-800"
              : "border-[#e2e9e2] bg-white text-[#10213a] hover:border-emerald-400 hover:bg-emerald-50/60"
          }`}
        >
          <Target className="h-5 w-5 text-[#2e466b]" />
          <span>{selectedDifficulty === "Tất cả" ? "Độ khó" : selectedDifficulty}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "difficulty" ? "rotate-180" : ""}`} />
        </button>

        {openDropdown === "difficulty" && (
          <div className="absolute left-0 top-[56px] z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-400">Chọn Độ khó</div>
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  onDifficultyChange(diff);
                  setOpenDropdown(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{diff}</span>
                {selectedDifficulty === diff && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-1 h-9 w-px bg-slate-200 shrink-0" />

      {/* 5. Sort Dropdown */}
      <div className="relative shrink-0">
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => toggleDropdown("sort")}
          className="flex h-[50px] items-center gap-3 rounded-full border border-[#e2e9e2] bg-white px-5 text-[15px] font-extrabold text-[#10213a] transition hover:border-emerald-400 hover:bg-emerald-50/60 cursor-pointer select-none"
        >
          <SlidersHorizontal className="h-5 w-5 text-[#2e466b]" />
          <span>{getSortLabel()}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "sort" ? "rotate-180" : ""}`} />
        </button>

        {openDropdown === "sort" && (
          <div className="absolute right-0 top-[56px] z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-400">Sắp xếp theo</div>
            {SORTS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  onSortChange(s.value);
                  setOpenDropdown(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                  selectedSort === s.value
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{s.label}</span>
                {selectedSort === s.value && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset button if active */}
      {hasActiveFilters && (
        <button
          suppressHydrationWarning
          type="button"
          onClick={onResetFilters}
          className="flex h-[50px] items-center gap-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 px-4 text-xs font-bold text-slate-600 transition cursor-pointer shrink-0"
          title="Đặt lại toàn bộ bộ lọc"
        >
          <X className="h-3.5 w-3.5" />
          <span>Xóa lọc</span>
        </button>
      )}
    </div>
  );
}
