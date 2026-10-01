"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ClipboardList,
  Layers,
  UserPlus,
  FileText,
  Sparkles,
  Mail,
  Heart,
} from "lucide-react";

// Social Icons SVG Components
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46 6.3 6.3 0 0 0 1.88-4.46V8.71a8.31 8.31 0 0 0 4.89 1.57V6.83a4.85 4.85 0 0 1-1-.14z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function LandingFooter() {
  return (
    <footer className="bg-[#1e3006] text-slate-300 text-xs sm:text-sm border-t border-[#2e470a]/90 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#2e470a]/80">
          {/* ══════════════════════════════════════════════════════════════════════
              CỘT 1: LOGO, GIỚI THIỆU & MẠNG XÃ HỘI
              ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-emerald-400/40 bg-white p-0.5 flex-shrink-0 shadow-md">
                <Image
                  src="/favicon.jpg"
                  alt="EduMi Mascot Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                EduMi
              </span>
            </Link>

            <p className="text-xs sm:text-[13px] text-slate-300/85 leading-relaxed max-w-sm">
              Nền tảng giáo dục thông minh kết hợp tài liệu học tập, luyện tập tương tác và công nghệ AI nhằm tối ưu hóa hành trình tri thức.
            </p>

            {/* Social Media Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 flex items-center justify-center transition-all cursor-pointer text-slate-300 hover:text-emerald-300 shadow-sm"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 flex items-center justify-center transition-all cursor-pointer text-slate-300 hover:text-emerald-300 shadow-sm"
                title="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 flex items-center justify-center transition-all cursor-pointer text-slate-300 hover:text-emerald-300 shadow-sm"
                title="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              CỘT 2: HỌC VIÊN
              ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-1 bg-emerald-400 rounded-full inline-block" />
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                HỌC VIÊN
              </h4>
            </div>

            <div className="space-y-3">
              <Link
                href="/materials"
                className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-400/30 transition-all shadow-sm">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-medium">
                  Tìm kiếm tài liệu
                </span>
              </Link>

              <Link
                href="/practice"
                className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-400/30 transition-all shadow-sm">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-medium">
                  Luyện tập Trắc nghiệm
                </span>
              </Link>

              <Link
                href="/flashcards"
                className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-400/30 transition-all shadow-sm">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-medium">
                  Bộ thẻ Flashcard
                </span>
              </Link>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              CỘT 3: GIẢNG VIÊN
              ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-1 bg-emerald-400 rounded-full inline-block" />
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                GIẢNG VIÊN
              </h4>
            </div>

            <div className="space-y-3">
              <Link
                href="/register"
                className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-400/30 transition-all shadow-sm">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-medium">
                  Đăng ký giảng dạy
                </span>
              </Link>

              <Link
                href="/terms"
                className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-400/30 transition-all shadow-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-medium">
                  Quy định tải lên
                </span>
              </Link>

              <Link
                href="/ai-tutor"
                className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-400/30 transition-all shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-medium">
                  Công cụ AI
                </span>
              </Link>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              CỘT 4: ĐỘI NGŨ PHÁT TRIỂN
              ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              ĐỘI NGŨ PHÁT TRIỂN
            </h4>

            {/* Admin 1: Nguyễn Ngọc Thạch */}
            <div className="space-y-1.5">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shadow-xs mb-1">
                  ADMIN
                </span>
                <p className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Nguyễn Ngọc Thạch
                </p>
              </div>
              <a
                href="mailto:nguyenngocthach531@gmail.com"
                className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-300 hover:text-emerald-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">nguyenngocthach531@gmail.com</span>
              </a>
            </div>

            {/* Admin 2: Văn Viết Nhật */}
            <div className="space-y-1.5 pt-1">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shadow-xs mb-1">
                  ADMIN
                </span>
                <p className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Văn Viết Nhật
                </p>
              </div>
              <a
                href="mailto:vnhat2644@gmail.com"
                className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-300 hover:text-emerald-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">vnhat2644@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            BOTTOM COPYRIGHT BAR
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400/80">
          <p>© 2026 EduMi Platform. Dự án SWP391. All rights reserved.</p>

          <div className="flex items-center gap-1.5">
            <span>Thiết kế & phát triển với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>dành cho học sinh Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
