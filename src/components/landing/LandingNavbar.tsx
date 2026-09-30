"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Globe,
  Crown,
  User,
  Check,
  BookOpen,
  Clock,
} from "lucide-react";

interface UserSession {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  role?: string;
  studentCode?: string;
}

export default function LandingNavbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User session state
  const [user, setUser] = useState<UserSession | null>(null);

  // Language dropdown state
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"VI" | "EN">("VI");

  const langRef = useRef<HTMLDivElement>(null);

  // Scroll listener to calculate gradual fade-in progress smoothly with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          // Gradually fade in/out across 120px of scroll
          const progress = Math.min(1, Math.max(0, y / 120));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch auth session
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.warn("[LandingNavbar Auth Check]:", err);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Click outside listener for language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3.5 sm:py-4">
      {/* Background layer: 100% transparent at top (no blur), smoothly fades in on scroll */}
      <div
        className="absolute inset-0 -z-10 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(6,78,59,0.06)] transition-opacity duration-300 ease-out pointer-events-none will-change-[opacity]"
        style={{ opacity: isMobileMenuOpen ? 1 : scrollProgress }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* ── Brand Logo (Left) ── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9.5 h-9.5 rounded-xl overflow-hidden border border-emerald-200/90 shadow-2xs flex-shrink-0 relative bg-white group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/favicon.jpg"
                alt="EduMi Logo"
                width={38}
                height={38}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-[22px] font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                EduMi
              </span>
            </div>
          </Link>

          {/* ── Center Navigation Items (Separate boxes at top, unified capsule when scrolled) ── */}
          <nav className="hidden md:flex items-center">
            <ul
              className={`flex items-center transition-all duration-300 ${
                scrollProgress > 0.4
                  ? "p-1 rounded-full bg-white/75 hover:bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xs gap-1"
                  : "gap-2.5 bg-transparent border-transparent shadow-none p-0"
              }`}
            >
              <li>
                <a
                  href="#classes"
                  className={`relative overflow-hidden group/navitem flex items-center justify-center font-bold text-xs sm:text-[13px] transition-all duration-300 cursor-pointer ${
                    scrollProgress > 0.4
                      ? "px-3.5 sm:px-4 py-1.5 rounded-full text-slate-700 hover:text-white hover:bg-emerald-600 border border-transparent hover:border-emerald-400 hover:shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                      : "h-10 px-4 rounded-full bg-white/85 hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200/90 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)] hover:shadow-[0_0_18px_rgba(16,185,129,0.45)] backdrop-blur-md"
                  }`}
                >
                  <span className="relative z-10">Lớp Học</span>
                  {/* Diagonal light beam sweep across card */}
                  <span className="absolute inset-0 -translate-x-[150%] group-hover/navitem:translate-x-[150%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none" />
                </a>
              </li>
              <li>
                <Link
                  href="/profile?tab=materials"
                  className={`relative overflow-hidden group/navitem flex items-center justify-center font-bold text-xs sm:text-[13px] transition-all duration-300 cursor-pointer ${
                    scrollProgress > 0.4
                      ? "px-3.5 sm:px-4 py-1.5 rounded-full text-slate-700 hover:text-white hover:bg-emerald-600 border border-transparent hover:border-emerald-400 hover:shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                      : "h-10 px-4 rounded-full bg-white/85 hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200/90 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)] hover:shadow-[0_0_18px_rgba(16,185,129,0.45)] backdrop-blur-md"
                  }`}
                >
                  <span className="relative z-10">Tài liệu</span>
                  {/* Diagonal light beam sweep across card */}
                  <span className="absolute inset-0 -translate-x-[150%] group-hover/navitem:translate-x-[150%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none" />
                </Link>
              </li>
              <li>
                <a
                  href="#exams"
                  className={`relative overflow-hidden group/navitem flex items-center justify-center font-bold text-xs sm:text-[13px] transition-all duration-300 cursor-pointer ${
                    scrollProgress > 0.4
                      ? "px-3.5 sm:px-4 py-1.5 rounded-full text-slate-700 hover:text-white hover:bg-emerald-600 border border-transparent hover:border-emerald-400 hover:shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                      : "h-10 px-4 rounded-full bg-white/85 hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200/90 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)] hover:shadow-[0_0_18px_rgba(16,185,129,0.45)] backdrop-blur-md"
                  }`}
                >
                  <span className="relative z-10">Phòng Thi</span>
                  {/* Diagonal light beam sweep across card */}
                  <span className="absolute inset-0 -translate-x-[150%] group-hover/navitem:translate-x-[150%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none" />
                </a>
              </li>
              <li>
                <a
                  href="#ai-tutor"
                  className={`relative overflow-hidden group/navitem flex items-center justify-center font-bold text-xs sm:text-[13px] transition-all duration-300 cursor-pointer ${
                    scrollProgress > 0.4
                      ? "px-3.5 sm:px-4 py-1.5 rounded-full text-slate-700 hover:text-white hover:bg-emerald-600 border border-transparent hover:border-emerald-400 hover:shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                      : "h-10 px-4 rounded-full bg-white/85 hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200/90 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)] hover:shadow-[0_0_18px_rgba(16,185,129,0.45)] backdrop-blur-md"
                  }`}
                >
                  <span className="relative z-10">Trợ Lí Ảo</span>
                  {/* Diagonal light beam sweep across card */}
                  <span className="absolute inset-0 -translate-x-[150%] group-hover/navitem:translate-x-[150%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none" />
                </a>
              </li>
            </ul>
          </nav>

          {/* ── Compact Navigation Cluster (Right - Desktop) ── */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* 1. Language Capsule (VI) */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="h-10 px-3.5 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs backdrop-blur-md text-xs sm:text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Chọn ngôn ngữ"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentLang}</span>
              </button>

              {/* Language Dropdown */}
              {isLangOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang("VI");
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-emerald-50/70 transition-colors cursor-pointer ${
                      currentLang === "VI" ? "font-bold text-emerald-700" : "text-slate-700"
                    }`}
                  >
                    <span>🇻🇳 Tiếng Việt</span>
                    {currentLang === "VI" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang("EN");
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-emerald-50/70 transition-colors cursor-pointer ${
                      currentLang === "EN" ? "font-bold text-emerald-700" : "text-slate-700"
                    }`}
                  >
                    <span>🇬🇧 English</span>
                    {currentLang === "EN" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* 2. Unified Capsule: [ User • ONLINE | 👑 Nâng cấp ] */}
            <div className="h-10 flex items-center bg-white/85 hover:bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xs rounded-full p-1 pl-3 transition-all">
              {/* User Avatar & Name */}
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 pr-1 py-0.5 group/user cursor-pointer"
                  title="Vào trang cá nhân của bạn"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-300 relative bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                    {user.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-800">
                        {user.fullName?.charAt(0).toUpperCase() || "E"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover/user:text-emerald-700 transition-colors truncate max-w-[130px]">
                      {user.fullName || "Thạch Ngọc"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 pr-2 py-0.5 font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-700 transition-colors"
                  title="Đăng nhập tài khoản"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300/80 flex items-center justify-center text-slate-500">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>Đăng nhập</span>
                </Link>
              )}

              {/* Vertical Divider */}
              <span className="h-4.5 w-px bg-slate-200/90 mx-1.5 flex-shrink-0" />

              {/* Upgrade Button inside */}
              <a
                href="#pricing"
                className="relative overflow-hidden group/premium h-8 px-3.5 rounded-full bg-gradient-to-r from-[#FFF5CC] via-[#FFEBB0] to-[#FFE082] hover:from-[#FFECA0] hover:to-[#FFD54F] text-amber-950 border border-amber-300/90 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] font-black text-[11px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all flex-shrink-0"
                title="Khám phá các gói học nâng cấp"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500 relative z-10" />
                <span className="relative z-10">Nâng cấp</span>
                {/* Diagonal light beam sweep on upgrade button */}
                <span className="absolute inset-0 -translate-x-[150%] group-hover/premium:translate-x-[150%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] pointer-events-none" />
              </a>
            </div>
          </div>

          {/* ── Mobile Action Buttons (Right - Mobile/Tablet) ── */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Premium Button */}
            <a
              href="#pricing"
              className="h-8 px-3 rounded-full bg-gradient-to-r from-[#FFF5CC] to-[#FFE082] text-amber-950 border border-amber-300 shadow-2xs font-black text-[11px] tracking-wider uppercase flex items-center gap-1"
            >
              <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
              <span>PREMIUM</span>
            </a>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xl px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile User Status / Login */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 flex items-center justify-between">
            {user ? (
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-300 bg-white flex items-center justify-center">
                  {user.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-emerald-800">
                      {user.fullName?.charAt(0).toUpperCase() || "E"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.fullName || "Học sinh"}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Khách truy cập</span>
                </div>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>

          {/* Quick Shortcuts: Sổ ghi chú & Lịch sử */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/profile?tab=notes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Sổ ghi chú</span>
            </Link>
            <Link
              href="/profile?tab=history"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Lịch sử làm bài</span>
            </Link>
          </div>

          {/* Landing Sections Navigation */}
          <nav className="flex flex-col space-y-1 pt-1">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Tính năng nổi bật
            </a>
            <a
              href="#exams"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Kho đề thi THPT & ĐGNL
            </a>
            <a
              href="#ai-tutor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center justify-between"
            >
              <span>Gia sư Capy AI 24/7</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                AI Powered
              </span>
            </a>
            <a
              href="#classes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Lớp học trực tuyến
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Bảng giá & Gói học
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
