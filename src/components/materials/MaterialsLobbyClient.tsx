"use client";

import React, { useState, useMemo, useEffect, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Leaf,
  LibraryBig,
  Search,
  Sparkles,
  Sprout,
  Star,
  SlidersHorizontal,
  X,
  FolderOpen,
} from "lucide-react";
import ClassCardReveal from "@/components/classes/ClassCardReveal";
import TypewriterDescription from "@/components/classes/TypewriterDescription";
import {
  PublicMaterialItem,
  MaterialPatternType,
  FALLBACK_MATERIALS,
} from "@/app/api/materials/route";

const materialTitleLines = ["Khám phá tài liệu", "học tập chọn lọc"];
const materialDescription =
  "Tổng hợp tài liệu theo môn học, dạng bài và mục tiêu điểm số. Tìm nhanh học liệu phù hợp, xem trước nội dung trực tuyến và tải về ôn tập cùng EduMi.";

function DropLetterTitle() {
  let letterIndex = 0;
  const fullTitle = materialTitleLines.join(" ");

  return (
    <h1
      aria-label={fullTitle}
      className="max-w-[720px] text-[46px] sm:text-[54px] font-black leading-[1.02] tracking-[-0.055em] text-[#092235]"
    >
      {materialTitleLines.map((line) => (
        <span key={line} aria-hidden="true" className="block">
          {line.split("").map((letter, index) => {
            const delay = letter === " " ? letterIndex : letterIndex++;

            return (
              <span
                key={`${line}-${index}`}
                className={letter === " " ? "inline-block w-[0.24em]" : "class-title-letter"}
                style={{ animationDelay: `${delay * 48}ms` }}
              >
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function MaterialPattern({ pattern }: { pattern: MaterialPatternType }) {
  if (pattern === "waves") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-25 pointer-events-none" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-50,80 Q50,20 150,100 T350,60" fill="none" stroke="white" strokeWidth="34" strokeLinecap="round" />
        <path d="M-30,220 Q70,150 170,230 T370,190" fill="none" stroke="white" strokeWidth="38" strokeLinecap="round" />
        <path d="M-40,360 Q60,300 160,370 T360,330" fill="none" stroke="white" strokeWidth="32" strokeLinecap="round" />
      </svg>
    );
  }

  if (pattern === "clouds") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-20,120 C40,65 95,150 145,90 C190,42 245,108 320,82 L320,400 L-20,400 Z" fill="white" />
        <path d="M-35,340 C60,280 95,365 170,315 C230,275 260,350 340,312 L340,420 L-35,420 Z" fill="white" opacity="0.7" />
      </svg>
    );
  }

  if (pattern === "confetti") {
    return (
      <div className="absolute inset-0 opacity-24 pointer-events-none">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-3 w-12 rotate-45 rounded-full bg-white/45"
            style={{ left: `${22 + (index % 4) * 62}px`, top: `${26 + Math.floor(index / 4) * 82}px` }}
          />
        ))}
      </div>
    );
  }

  if (pattern === "stripes") {
    return (
      <div className="absolute inset-0 opacity-18 pointer-events-none [background-image:repeating-linear-gradient(45deg,transparent_0,transparent_24px,white_24px,white_47px)]" />
    );
  }

  if (pattern === "ripples") {
    return (
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <span className="absolute -right-12 top-12 h-40 w-40 rounded-full border-[24px] border-white" />
        <span className="absolute -left-16 bottom-8 h-48 w-48 rounded-full border-[30px] border-white" />
        <span className="absolute bottom-28 right-12 h-24 w-24 rounded-full border-[18px] border-white" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 opacity-18 pointer-events-none [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_22px,white_22px,white_38px)]" />
  );
}

function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/y/g, "i")
    .trim();
}

function matchSearch(sourceText: string, query: string): boolean {
  if (!query) return true;
  if (!sourceText) return false;
  const normSource = normalizeSearchText(sourceText);
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return true;
  if (normQuery.length <= 2) {
    const words = normSource.split(/[^a-z0-9]+/);
    return words.some((w) => w === normQuery);
  }
  return normSource.includes(normQuery);
}

const SUBJECT_FILTER_OPTIONS = [
  "Tất cả",
  "Toán học",
  "Tiếng Anh",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Ngữ văn",
  "Lịch sử",
  "Địa lý",
  "Tin học",
  "IELTS",
];

const GRADE_FILTER_OPTIONS = ["Tất cả", "Lớp 10", "Lớp 11", "Lớp 12", "ĐGNL / ĐGTD"];
const FILE_TYPE_OPTIONS = ["Tất cả", "PDF", "DOCX"];

export default function MaterialsLobbyClient() {
  const searchParams = useSearchParams();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [selectedGrade, setSelectedGrade] = useState("Tất cả");
  const [selectedFileType, setSelectedFileType] = useState("Tất cả");
  const [selectedSort, setSelectedSort] = useState<"newest" | "popular">("newest");

  // Dữ liệu tài liệu tải từ API (có fallback)
  const [materialsList, setMaterialsList] = useState<PublicMaterialItem[]>(FALLBACK_MATERIALS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMaterials() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/materials", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.materials) && isMounted) {
            setMaterialsList(data.materials);
          }
        }
      } catch (err) {
        console.warn("[Public Materials Fetch Error]:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void loadMaterials();
    return () => {
      isMounted = false;
    };
  }, []);

  // Support direct URL query parameter: ?subject=...
  useEffect(() => {
    const subject = searchParams.get("subject")?.trim();
    if (subject && SUBJECT_FILTER_OPTIONS.includes(subject)) {
      setSelectedSubject(subject);
    }
    const q = searchParams.get("search")?.trim();
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Handle reset filters
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedSubject !== "Tất cả" ||
    selectedGrade !== "Tất cả" ||
    selectedFileType !== "Tất cả" ||
    selectedSort !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSubject("Tất cả");
    setSelectedGrade("Tất cả");
    setSelectedFileType("Tất cả");
    setSelectedSort("newest");
  };

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    let list = [...materialsList];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      list = list.filter(
        (item) =>
          matchSearch(item.title, q) ||
          matchSearch(item.cardCode, q) ||
          matchSearch(item.subject, q) ||
          (item.author && matchSearch(item.author, q)) ||
          item.title.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubject !== "Tất cả") {
      list = list.filter((item) => item.subject === selectedSubject);
    }

    // Grade filter
    if (selectedGrade !== "Tất cả") {
      list = list.filter((item) => item.gradeLevel === selectedGrade);
    }

    // File type filter
    if (selectedFileType !== "Tất cả") {
      list = list.filter((item) => item.fileType === selectedFileType);
    }

    // Sort: Newest first
    if (selectedSort === "newest") {
      list.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return timeB - timeA;
      });
    }

    return list;
  }, [
    materialsList,
    searchQuery,
    selectedSubject,
    selectedGrade,
    selectedFileType,
    selectedSort,
  ]);

  return (
    <div
      className="relative min-h-screen pb-16 pt-[92px]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      {/* Decorative leafy doodles */}
      <Leaf className="absolute left-10 top-[110px] h-10 w-10 rotate-[-20deg] text-white/65 pointer-events-none" />
      <Leaf className="absolute left-10 top-[480px] h-12 w-12 rotate-[30deg] text-white/65 pointer-events-none" />
      <Sprout className="absolute right-14 top-[510px] h-8 w-8 text-white/70 pointer-events-none" />

      {/* Decorative corner stickers */}
      <Image
        src="/stickers/classes-corner-3d.png"
        alt=""
        aria-hidden="true"
        width={210}
        height={222}
        className="pointer-events-none absolute bottom-5 left-3 z-[1] h-auto w-[170px] -rotate-6 opacity-95 drop-shadow-[0_18px_24px_rgba(29,55,30,0.22)]"
      />
      <Image
        src="/stickers/classes-corner-3d.png"
        alt=""
        aria-hidden="true"
        width={210}
        height={222}
        className="pointer-events-none absolute bottom-5 right-3 z-[1] h-auto w-[178px] rotate-6 scale-x-[-1] opacity-95 drop-shadow-[0_18px_24px_rgba(29,55,30,0.22)]"
      />

      {/* Capybara Mascot Character */}
      <Image
        src="/Capybara_EduMi_và_bảng_học_tập-removebg-preview.png"
        alt="Capybara EduMi Thư viện Tài liệu"
        width={523}
        height={477}
        priority
        className="class-hero-mascot-pop pointer-events-none absolute right-[210px] top-[70px] z-[2] hidden h-auto w-[330px] xl:block 2xl:right-[290px] 2xl:w-[370px] drop-shadow-[0_24px_34px_rgba(17,42,25,0.22)]"
      />

      {/* Hero Section */}
      <section className="mx-auto max-w-[1280px] px-6 pt-6">
        <div className="pb-8">
          <DropLetterTitle />
          <TypewriterDescription text={materialDescription} />

          <div className="relative mt-2 h-10">
            <span className="absolute left-[410px] top-0 text-[34px] font-black text-[#f6be3d]">〃</span>
            <span className="absolute left-[476px] top-6 h-[2px] w-14 -rotate-[20deg] bg-white/80" />
          </div>
        </div>
      </section>

      {/* Modern Interactive Filter Bar */}
      <section className="relative z-10 mx-auto max-w-[1390px] px-6">
        <div className="flex flex-wrap items-center gap-3 rounded-[32px] bg-white/95 p-3.5 shadow-[0_12px_34px_rgba(25,60,35,0.12)] backdrop-blur-md">
          {/* Search Input */}
          <div className="flex h-12 min-w-[260px] flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50/70 px-4 text-slate-800 transition focus-within:border-emerald-500 focus-within:bg-white">
            <Search className="h-5 w-5 text-emerald-600 shrink-0" />
            <input
              type="text"
              placeholder="Tìm tài liệu, mã thẻ, môn học, tác giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Khối lớp Dropdown */}
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="h-12 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-xs sm:text-sm font-extrabold text-[#10213a] outline-none transition hover:border-emerald-400 cursor-pointer"
            >
              <option value="Tất cả">🎓 Khối lớp: Tất cả</option>
              {GRADE_FILTER_OPTIONS.filter((g) => g !== "Tất cả").map((gr) => (
                <option key={gr} value={gr}>
                  Khối: {gr}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-slate-500" />
          </div>

          {/* Môn học Dropdown */}
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-12 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-xs sm:text-sm font-extrabold text-[#10213a] outline-none transition hover:border-emerald-400 cursor-pointer"
            >
              <option value="Tất cả">📚 Môn học: Tất cả</option>
              {SUBJECT_FILTER_OPTIONS.filter((s) => s !== "Tất cả").map((sub) => (
                <option key={sub} value={sub}>
                  Môn: {sub}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-slate-500" />
          </div>

          {/* Loại tệp tin Dropdown */}
          <div className="relative">
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="h-12 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-xs sm:text-sm font-extrabold text-[#10213a] outline-none transition hover:border-emerald-400 cursor-pointer"
            >
              <option value="Tất cả">📄 Định dạng: Tất cả</option>
              <option value="PDF">Tệp PDF</option>
              <option value="DOCX">Tệp Word (DOCX)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-slate-500" />
          </div>

          {/* Sắp xếp */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as "newest" | "popular")}
              className="h-12 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-xs sm:text-sm font-extrabold text-[#10213a] outline-none transition hover:border-emerald-400 cursor-pointer"
            >
              <option value="newest">⚡ Mới nhất</option>
              <option value="popular">🔥 Phổ biến</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-slate-500" />
          </div>

          {/* Xóa lọc */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex h-12 items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 text-xs font-black text-rose-700 hover:bg-rose-100 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </section>

      {/* Cards Grid */}
      <section className="relative z-10 mx-auto mt-6 grid max-w-[1390px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((card, index) => {
            const previewUrl = `/materials/preview?id=${encodeURIComponent(card.id)}`;
            const downloadUrl = card.filePublicUrl || previewUrl;

            return (
              <ClassCardReveal key={card.id || card.title} index={index} columns={4}>
                <article
                  className={`group relative flex min-h-[380px] select-none flex-col justify-between overflow-hidden rounded-[30px] p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${card.bgClass}`}
                >
                  <MaterialPattern pattern={card.pattern} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5 truncate">
                      <span className="truncate text-[11px] font-black uppercase tracking-wide text-white/90">
                        EDUMI | {card.subject}
                      </span>
                      <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-sm">
                        {card.fileType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {card.isNew && (
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950 shadow-sm animate-pulse">
                          Mới
                        </span>
                      )}
                      <button
                        type="button"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/15 text-white/80 transition hover:bg-amber-400 hover:text-slate-950 cursor-pointer"
                        aria-label="Đánh giá tài liệu"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="relative z-10 my-auto py-2">
                    <h2 className="mb-2.5 text-[32px] font-black uppercase leading-none tracking-[-0.04em] text-white drop-shadow-md transition-transform duration-300 group-hover:scale-[1.02]">
                      {card.cardCode}
                    </h2>
                    <h3 className="line-clamp-2 text-[16px] font-black leading-[1.25] text-white/95 drop-shadow-sm">
                      {card.detail || card.title}
                    </h3>
                    {card.author && (
                      <p className="mt-2 text-[11px] font-bold text-white/80 truncate">
                        Tác giả: {card.author}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-white/95">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-white text-white" />
                        {card.views}
                      </span>
                      <span className="opacity-70">|</span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-white/90" />
                        {card.pages}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative z-10 grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href={previewUrl}
                      className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-slate-800 shadow-sm transition hover:bg-slate-50 hover:shadow-md cursor-pointer"
                    >
                      <Eye className={`h-3.5 w-3.5 ${card.accentClass}`} />
                      <span>Xem</span>
                      <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-slate-800 shadow-sm transition hover:bg-slate-50 hover:shadow-md cursor-pointer"
                    >
                      <Download className={`h-3.5 w-3.5 ${card.accentClass}`} />
                      <span className="truncate">Tải về</span>
                      <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </article>
              </ClassCardReveal>
            );
          })
        ) : (
          <div className="col-span-full my-12 flex flex-col items-center justify-center rounded-[32px] bg-white/90 p-12 text-center shadow-lg backdrop-blur-md">
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-emerald-50 border border-emerald-200 p-2">
              <Image
                src="/Capybara_EduMi_và_bảng_học_tập-removebg-preview.png"
                alt="Capybara không tìm thấy tài liệu"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-900">
              Không tìm thấy tài liệu phù hợp
            </h3>
            <p className="mt-1 max-w-md text-xs font-medium text-slate-600">
              Hãy thử xóa bớt bộ lọc hoặc tìm kiếm bằng từ khóa môn học khác nhé!
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
    </div>
  );
}
