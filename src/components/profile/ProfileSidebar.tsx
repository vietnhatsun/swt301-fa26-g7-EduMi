"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  School,
  BookMarked,
  Layers,
  Sparkles,
  History,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

export type ProfileTabId =
  | "overview"
  | "classes"
  | "materials"
  | "notes"
  | "flashcards"
  | "history"
  | "personal"
  | "transactions"
  | "settings";

interface ProfileSidebarProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  studentCode?: string;
  fullName?: string;
  onLogout?: () => void;
}

export default function ProfileSidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  studentCode = "EDM-784920",
  fullName = "Nguyễn Ngọc Thạch",
  onLogout,
}: ProfileSidebarProps) {
  const learningNavItems: {
    id: ProfileTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "classes", label: "Lớp học", icon: School },
    { id: "materials", label: "Tài liệu", icon: Layers },
    { id: "notes", label: "Sổ ghi chú", icon: BookMarked, badge: "3" },
    { id: "flashcards", label: "Flashcard", icon: Sparkles, badge: "Mới" },
    { id: "history", label: "Lịch sử làm bài", icon: History },
  ];

  const accountNavItems: {
    id: ProfileTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "personal", label: "Hồ sơ cá nhân", icon: User },
    { id: "transactions", label: "Giao dịch", icon: CreditCard },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col justify-between bg-gradient-to-b from-[#064e3b] via-[#047857] to-[#065f46] text-white transition-all duration-300 ease-in-out border-r border-emerald-900/30 select-none shadow-[4px_0_24px_rgba(6,78,59,0.15)] ${
        isCollapsed ? "w-20" : "w-64 sm:w-72"
      }`}
    >
      {/* ── Top Header Brand ── */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 overflow-hidden group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-md flex-shrink-0 relative bg-white group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/favicon.jpg"
                alt="EduMi Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-sm sm:text-base tracking-tight leading-tight text-white group-hover:text-emerald-200 transition-colors">
                  EduMi Platform
                </span>
                <span className="text-[10px] text-emerald-200/80 font-medium tracking-wide">
                  Học tập & Luyện thi
                </span>
              </div>
            )}
          </Link>

          {/* Collapse toggle button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-lg bg-black/20 hover:bg-black/30 border border-white/10 text-emerald-100 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title={isCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* ── Section: HỌC TẬP ── */}
        <div className="px-3 py-4">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              Học tập
            </div>
          )}
          <nav className="space-y-1">
            {learningNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold"
                      : "text-emerald-100/90 hover:bg-white/10 hover:text-white"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110 text-slate-950" : "text-emerald-200"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? "bg-slate-950/15 text-slate-900"
                          : "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Section: TÀI KHOẢN & HỆ THỐNG ── */}
        <div className="px-3 py-2 border-t border-white/10">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              Tài khoản
            </div>
          )}
          <nav className="space-y-1">
            {accountNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold"
                      : "text-emerald-100/90 hover:bg-white/10 hover:text-white"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110 text-slate-950" : "text-emerald-200"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Bottom User Card ── */}
      <div className="p-3 border-t border-white/10 bg-black/10">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <GraduationCap className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-emerald-200 font-medium">
                  Mã học sinh
                </p>
                <p className="text-xs font-bold text-white tracking-wide truncate">
                  {studentCode}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center p-2 rounded-xl bg-black/20 border border-white/10"
            title={`Mã học sinh: ${studentCode}`}
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
          </div>
        )}
      </div>
    </aside>
  );
}
