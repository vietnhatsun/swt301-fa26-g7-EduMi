"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Bot,
  CreditCard,
  MessageSquare,
} from "lucide-react";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(6,78,59,0.06)] border-b border-emerald-100/80 py-3"
          : "bg-white/60 backdrop-blur-sm border-b border-emerald-100/40 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* ── Brand Logo ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-emerald-200 shadow-sm flex-shrink-0 relative bg-emerald-50 p-0.5 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/capybara-mascot.png"
                alt="EduMi Capy Mascot"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                  EduMi
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                  AI 2026
                </span>
              </div>
              <span className="text-[11px] font-medium text-emerald-800/80 -mt-0.5">
                Học thông minh cùng Capy
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <nav className="hidden lg:flex items-center gap-7">
            <a
              href="#features"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Tính năng
            </a>
            <a
              href="#exams"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Kho đề thi
            </a>
            <a
              href="#ai-tutor"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              <span>Gia sư Capy AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </a>
            <a
              href="#classes"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Lớp trực tuyến
            </a>
            <a
              href="#pricing"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Gói học
            </a>
            <a
              href="#testimonials"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Học sinh nói gì
            </a>
          </nav>

          {/* ── Auth CTA Buttons ── */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-full transition-all"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <span>Học thử miễn phí</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Mobile Hamburger Button ── */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
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

      {/* ── Mobile Menu Dropdown ── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
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
                Online
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
            <a
              href="#testimonials"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Cảm nhận học sinh
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl border border-emerald-200 text-center text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-center text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Đăng ký học thử miễn phí</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
