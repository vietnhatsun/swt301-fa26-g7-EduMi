"use client";

import React, { useState, useMemo, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  GraduationCap,
  LibraryBig,
  Loader2,
  MonitorPlay,
  Search,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import ClassCardReveal from "@/components/classes/ClassCardReveal";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { matchSmartSearch } from "@/lib/search-utils";

export type ClassCardData = {
  id: string;
  subject: string;
  icon: ReactNode;
  badgeClass: string;
  title: string;
  description: string;
  teacher: string;
  avatar: string;
  cover: string;
  lessons: string;
  level: string;
  students: string;
  gradeLevel?: string;
};

const SUBJECT_OPTIONS = [
  "Tất cả",
  "Toán học",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Ngữ văn",
  "Tiếng Anh",
  "IELTS",
  "Tin học",
  "Địa lý",
];

const LEVEL_OPTIONS = ["Tất cả", "Cơ bản", "Trung bình", "Nâng cao"];

const SORT_OPTIONS = [
  { label: "Phổ biến nhất", value: "popular" },
  { label: "Học sinh đông nhất", value: "students" },
  { label: "Nhiều bài giảng nhất", value: "lessons" },
];

export default function ClassesLobbyClient({
  initialClasses = [],
}: {
  initialClasses: ClassCardData[];
}) {
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    debouncedQuery,
    isPending: isSearching,
    clearQuery: clearSearch,
  } = useDebouncedSearch({ delay: 300 });

  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [selectedSort, setSelectedSort] = useState("popular");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedSubject !== "Tất cả" ||
    selectedLevel !== "Tất cả" ||
    selectedSort !== "popular";

  const handleResetFilters = () => {
    clearSearch();
    setSelectedSubject("Tất cả");
    setSelectedLevel("Tất cả");
    setSelectedSort("popular");
    setOpenDropdown(null);
  };

  // Filtered & Sorted Classes with Smart Search
  const filteredClasses = useMemo(() => {
    let list = [...initialClasses];

    // 1. Smart multi-token search
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim();
      list = list.filter(
        (card) =>
          matchSmartSearch(card.title, q) ||
          matchSmartSearch(card.subject, q) ||
          matchSmartSearch(card.teacher, q) ||
          matchSmartSearch(card.description, q)
      );
    }

    // 2. Subject filter
    if (selectedSubject !== "Tất cả") {
      list = list.filter((card) =>
        card.subject.toLowerCase().includes(selectedSubject.toLowerCase())
      );
    }

    // 3. Level filter
    if (selectedLevel !== "Tất cả") {
      list = list.filter((card) =>
        card.level.toLowerCase().includes(selectedLevel.toLowerCase())
      );
    }

    // 4. Sort
    if (selectedSort === "students") {
      list.sort((a, b) => {
        const numA = parseInt(a.students.replace(/[^0-9]/g, "")) || 0;
        const numB = parseInt(b.students.replace(/[^0-9]/g, "")) || 0;
        return numB - numA;
      });
    } else if (selectedSort === "lessons") {
      list.sort((a, b) => {
        const numA = parseInt(a.lessons.replace(/[^0-9]/g, "")) || 0;
        const numB = parseInt(b.lessons.replace(/[^0-9]/g, "")) || 0;
        return numB - numA;
      });
    }

    return list;
  }, [initialClasses, debouncedQuery, selectedSubject, selectedLevel, selectedSort]);

  return (
    <>
      {/* Interactive Filter Bar */}
      <section ref={filterBarRef} className="relative z-30 mx-auto -mt-[18px] max-w-[1390px] px-6">
        <div className="flex min-h-[74px] flex-wrap items-center gap-2.5 rounded-[32px] bg-white p-3 sm:px-6 shadow-[0_12px_34px_rgba(25,60,35,0.12)]">
          {/* Search Input */}
          <div className="flex h-[50px] min-w-[280px] flex-1 items-center gap-2.5 rounded-full border border-[#e2e9e2] bg-white px-4 text-[#7a8795] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
            {isSearching ? (
              <Loader2 className="h-5 w-5 shrink-0 text-[#00a66f] animate-spin" />
            ) : (
              <Search className="h-5 w-5 shrink-0 text-[#00a66f]" />
            )}
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Tìm lớp học, môn học, giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[14px] sm:text-[15px] font-semibold text-[#10213a] placeholder:text-[#8b98a5] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 1. Môn học Dropdown */}
          <div className="relative">
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => toggleDropdown("subject")}
              className={`flex h-[50px] items-center gap-2 rounded-full border px-4 sm:px-5 text-[14px] font-extrabold transition cursor-pointer select-none ${
                selectedSubject !== "Tất cả"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-[#e2e9e2] bg-white text-[#10213a] hover:border-emerald-400 hover:bg-emerald-50/60"
              }`}
            >
              <LibraryBig className={`h-4 w-4 ${selectedSubject !== "Tất cả" ? "text-emerald-600" : "text-[#2e466b]"}`} />
              <span className="truncate max-w-[110px]">
                {selectedSubject === "Tất cả" ? "Môn học" : selectedSubject}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "subject" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "subject" && (
              <div className="absolute left-0 top-[56px] z-50 w-52 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-400">Chọn Môn học</div>
                {SUBJECT_OPTIONS.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(sub);
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                      selectedSubject === sub
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{sub === "Tất cả" ? "Tất cả môn học" : sub}</span>
                    {selectedSubject === sub && <Check className="h-4 w-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Mức độ Dropdown */}
          <div className="relative">
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => toggleDropdown("level")}
              className={`flex h-[50px] items-center gap-2 rounded-full border px-4 sm:px-5 text-[14px] font-extrabold transition cursor-pointer select-none ${
                selectedLevel !== "Tất cả"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-[#e2e9e2] bg-white text-[#10213a] hover:border-emerald-400 hover:bg-emerald-50/60"
              }`}
            >
              <BarChart3 className={`h-4 w-4 ${selectedLevel !== "Tất cả" ? "text-emerald-600" : "text-[#2e466b]"}`} />
              <span className="truncate max-w-[110px]">
                {selectedLevel === "Tất cả" ? "Mức độ" : selectedLevel}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "level" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "level" && (
              <div className="absolute left-0 top-[56px] z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-400">Chọn Mức độ</div>
                {LEVEL_OPTIONS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                      selectedLevel === lvl
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{lvl === "Tất cả" ? "Tất cả mức độ" : lvl}</span>
                    {selectedLevel === lvl && <Check className="h-4 w-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block mx-1 h-9 w-px bg-slate-200" />

          {/* 3. Sắp xếp Dropdown */}
          <div className="relative">
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => toggleDropdown("sort")}
              className="flex h-[50px] items-center gap-2 rounded-full border border-[#e2e9e2] bg-white px-4 sm:px-5 text-[14px] font-extrabold text-[#10213a] transition hover:border-emerald-400 hover:bg-emerald-50/60 cursor-pointer select-none"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#2e466b]" />
              <span>{SORT_OPTIONS.find((s) => s.value === selectedSort)?.label || "Phổ biến"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "sort" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "sort" && (
              <div className="absolute right-0 top-[56px] z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-400">Sắp xếp theo</div>
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      setSelectedSort(s.value);
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
              onClick={handleResetFilters}
              className="flex h-[50px] items-center gap-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 px-4 text-xs font-bold text-slate-600 transition cursor-pointer"
              title="Đặt lại toàn bộ bộ lọc"
            >
              <X className="h-3.5 w-3.5" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </section>

      {/* Class Cards Grid */}
      <section className="relative z-10 mx-auto mt-6 grid max-w-[1390px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((card, index) => (
            <ClassCardReveal key={card.id} index={index}>
              <article className="group flex h-[242px] flex-col overflow-hidden rounded-[22px] bg-white p-3.5 shadow-[0_8px_24px_rgba(25,60,35,0.08)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_16px_34px_rgba(25,60,35,0.13)]">
                <div className="grid min-h-0 flex-1 grid-cols-[40%_60%] gap-4">
                  <div className="relative min-h-0 overflow-hidden rounded-[16px] bg-emerald-50">
                    <Image
                      src={card.cover}
                      alt={card.title}
                      fill
                      sizes="220px"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col py-1 pr-2">
                    <span
                      className={`mb-2 inline-flex h-7 w-fit items-center gap-1.5 rounded-full px-3 text-[13px] font-extrabold ${card.badgeClass}`}
                    >
                      {card.icon}
                      {card.subject}
                    </span>
                    <h2 className="line-clamp-2 text-[17px] font-black leading-[1.2] tracking-[-0.035em] text-[#10213a]">
                      {card.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-[1.4] text-[#64728a]">
                      {card.description}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pb-1">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">
                        {card.avatar}
                      </span>
                      <span className="truncate text-[13px] font-extrabold text-[#23324a]">
                        {card.teacher}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex h-[38px] items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <div className="flex min-w-0 items-center gap-3 text-[12px] font-semibold text-[#66758d]">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                      {card.lessons}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <BarChart3 className="h-4 w-4 text-emerald-600" />
                      {card.level}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <UsersRound className="h-4 w-4 text-emerald-600" />
                      {card.students}
                    </span>
                  </div>
                  <Link
                    href={`/classes/${card.id}`}
                    className="flex h-[36px] shrink-0 items-center gap-1.5 rounded-full bg-[#00a66f] px-3.5 text-[12.5px] font-black text-white transition hover:bg-[#008b5f]"
                  >
                    Xem lớp <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </ClassCardReveal>
          ))
        ) : (
          <div className="col-span-full my-12 flex flex-col items-center justify-center rounded-[32px] bg-white/90 p-12 text-center shadow-lg backdrop-blur-md">
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-emerald-50 border border-emerald-200 p-2">
              <Image
                src="/Capybara_EduMi_và_bảng_học_tập-removebg-preview.png"
                alt="Capybara không tìm thấy lớp"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-900">
              Không tìm thấy lớp học phù hợp
            </h3>
            <p className="mt-1 max-w-md text-xs font-medium text-slate-600">
              Hãy thử xóa bớt bộ lọc hoặc tìm kiếm theo tên môn học khác nhé!
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </section>
    </>
  );
}
