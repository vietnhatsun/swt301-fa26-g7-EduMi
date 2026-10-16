"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Bell,
  BarChart3,
  BookOpen,
  Briefcase,
  BadgeCheck,
  Camera,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  Download,
  FileText,
  Filter,
  GraduationCap,
  FolderOpen,
  LayoutDashboard,
  HardDrive,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  Monitor,
  Pin,
  PlayCircle,
  Quote,
  Search,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Sun,
  Upload,
  UserRound,
  Video,
  WalletCards,
  X,
} from "lucide-react";
import NotificationDropdown, { NotificationItem } from "../NotificationDropdown";

const INITIAL_TEACHER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Kỹ thuật tư duy cho IELTS Writing Task 2",
    timeAgo: "18 NGÀY TRƯỚC",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Mở khóa band 7.0+ IELTS Speaking",
    timeAgo: "23 NGÀY TRƯỚC",
    isRead: false,
  },
  {
    id: "notif-3",
    title: 'Nói về "Lễ hội" trong IELTS Speaking Part 2',
    timeAgo: "25 NGÀY TRƯỚC",
    isRead: true,
  },
];

type TeacherTabId =
  | "overview"
  | "classes"
  | "students"
  | "materials"
  | "teacherProfile"
  | "grading"
  | "schedule"
  | "messages"
  | "notifications"
  | "personal"
  | "income";

export interface TeacherSession {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  teacherCode?: string;
  studentCode?: string;
  headline?: string;
  bio?: string;
  subjects?: string[];
  gender?: "Nam" | "Nữ" | "Khác";
  teacherRole?: "Gia sư" | "Giáo viên sư phạm";
  workExperience?: string;
  gradeLevels?: string[];
  degree?: string;
  experienceYears?: string;
  certificateUrl?: string | null;
  certificateFileName?: string | null;
  certificateFileSize?: number | null;
  verificationStatus?: "draft" | "pending" | "approved" | "rejected";
  isVerifiedEducator?: boolean;
  ratingAvg?: number;
  totalReviews?: number;
  phoneNumber?: string;
}

interface TeacherProfileDashboardProps {
  teacher: TeacherSession;
  onLogout: () => void;
}

const navGroups: { title: string; items: { id: TeacherTabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] }[] = [
  {
    title: "Giảng dạy",
    items: [
      { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
      { id: "teacherProfile", label: "Hồ sơ giáo viên", icon: ShieldCheck },
      { id: "classes", label: "Lớp giảng dạy", icon: GraduationCap },
      { id: "materials", label: "Tài liệu", icon: BookOpen },
    ],
  },
  {
    title: "Tài khoản",
    items: [
      { id: "personal", label: "Cài đặt tài khoản", icon: Settings },
      { id: "income", label: "Thu nhập", icon: WalletCards },
    ],
  },
];


function Sidebar({ activeTab, onTabChange, collapsed, onToggle, teacherCode }: { activeTab: TeacherTabId; onTabChange: (tab: TeacherTabId) => void; collapsed: boolean; onToggle: () => void; teacherCode: string }) {
  return (
    <aside className={`relative z-20 flex h-full flex-col justify-between bg-gradient-to-b from-[#064e3b] via-[#047857] to-[#065f46] text-white shadow-[4px_0_24px_rgba(6,78,59,0.18)] transition-all duration-300 select-none ${collapsed ? "w-20" : "w-64 sm:w-72"}`}>
      <div>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" className="flex min-w-0 items-center gap-3 overflow-hidden group cursor-pointer">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Image src="/favicon.jpg" alt="EduMi" fill sizes="40px" className="object-cover" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex flex-col">
                <p className="truncate text-sm sm:text-base font-extrabold tracking-tight leading-tight text-white group-hover:text-emerald-200 transition-colors">EduMi Platform</p>
                <p className="truncate text-[10px] font-medium text-emerald-200/80 tracking-wide">Dạy hay - Học tốt hơn</p>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={onToggle}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-emerald-100 hover:bg-black/30 hover:text-white transition-all cursor-pointer active:scale-95"
            title={collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="space-y-4 px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">{group.title}</p>}
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                        collapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold"
                          : "text-emerald-100/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-200 ${
                          isActive ? "scale-110 text-slate-950" : "text-emerald-200"
                        }`}
                      />
                      {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-white/10 bg-black/10">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <GraduationCap className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-emerald-200 font-medium">Mã giáo viên</p>
                <p className="text-xs font-bold text-white tracking-wide truncate">{teacherCode}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-xl bg-black/20 border border-white/10" title={`Mã giáo viên: ${teacherCode}`}>
            <GraduationCap className="w-4 h-4 text-amber-300" />
          </div>
        )}
      </div>
    </aside>
  );
}

function Header({
  teacher,
  onToggleMobileSidebar,
  onLogout,
  onTabChange,
}: {
  teacher: TeacherSession;
  onToggleMobileSidebar: () => void;
  onLogout: () => void;
  onTabChange?: (tab: TeacherTabId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_TEACHER_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationOpen(false);
    window.location.href = `/blog?id=${item.id}`;
  };

  const handleViewAllPosts = () => {
    setIsNotificationOpen(false);
    window.location.href = "/blog";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6 select-none">
      <div className="flex max-w-md flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer active:scale-95 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-12 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all hover:bg-slate-100/80 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder="Tìm lớp học, học viên, tài liệu, bài tập..."
          />
          <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1.5 text-xs sm:text-sm font-black text-amber-900 shadow-xs sm:flex">
          <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
          {teacher.totalReviews && teacher.totalReviews > 0 ? (teacher.ratingAvg?.toFixed(1) || "5.0") : "Mới"}
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-amber-500 hover:bg-slate-100 transition-all cursor-pointer active:scale-95 shadow-xs"
          title="Chế độ giao diện"
        >
          <Sun className="h-4 w-4" />
        </button>

        {/* Notifications button & dropdown popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              if (open) setOpen(false);
            }}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer active:scale-95 shadow-xs ${
              isNotificationOpen
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-600 hover:text-slate-900"
            }`}
            title="Thông báo giảng dạy"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notification Popover Dropdown */}
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            fullName={teacher.fullName}
            notifications={notifications}
            onSelectNotification={handleSelectNotification}
            onViewAllPosts={handleViewAllPosts}
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpen(!open);
              if (isNotificationOpen) setIsNotificationOpen(false);
            }}
            className={`flex items-center gap-2 rounded-full p-1 transition-all cursor-pointer active:scale-95 sm:pr-3 ${
              open
                ? "bg-slate-100 border border-slate-200 shadow-xs"
                : "hover:bg-slate-100 border border-transparent hover:border-slate-200"
            }`}
          >
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-full bg-[#064e3b] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs">
              {teacher.avatarUrl ? (
                <Image src={teacher.avatarUrl} alt={teacher.fullName} fill sizes="36px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-black">
                  {teacher.fullName.charAt(0)}
                </span>
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-[140px] truncate text-xs sm:text-sm font-bold text-slate-800">{teacher.fullName}</p>
              <p className="text-[11px] font-medium text-slate-500">Giáo viên</p>
            </div>
            <ChevronDown className={`hidden h-3.5 w-3.5 text-slate-400 transition-transform duration-200 sm:block ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-fade-in-up">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{teacher.fullName}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Giáo viên EduMi</span>
                  </p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onTabChange?.("teacherProfile");
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Hồ sơ giáo viên</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onTabChange?.("personal");
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Cài đặt tài khoản</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onTabChange?.("income");
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <WalletCards className="w-3.5 h-3.5" />
                    <span>Thu nhập & Ví</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Overview({ teacher }: { teacher: TeacherSession }) {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#024a30] via-[#047857] to-[#059669] shadow-[0_10px_35px_rgba(6,78,59,0.16)] border border-emerald-400/25 flex items-center justify-between min-h-[136px] sm:min-h-[152px] md:min-h-[168px] px-6 sm:px-8 py-5 sm:py-6">
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-300/15 blur-3xl pointer-events-none" />
        <div className="absolute right-[24%] bottom-0 w-48 h-36 rounded-full bg-amber-300/12 blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

        <div className="absolute right-0 bottom-0 pointer-events-none flex items-end justify-end z-0 h-[110%] sm:h-[116%] md:h-[124%] max-w-[85%] sm:max-w-[75%] md:max-w-[66%] lg:max-w-[58%] select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner-mascot.png"
            alt="Mascot chào mừng EduMi"
            className="h-full w-auto object-contain object-bottom-right drop-shadow-sm select-none"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div className="banner-bubble animate-bubble-1 w-7 h-7" style={{ left: "5%", bottom: "14%", animationDuration: "5.5s" }} />
          <div className="banner-bubble animate-bubble-2 w-5 h-5" style={{ left: "20%", top: "14%", animationDuration: "4.2s", animationDelay: "0.8s" }} />
          <div className="banner-bubble animate-bubble-3 w-4 h-4" style={{ left: "34%", bottom: "22%", animationDuration: "4.8s", animationDelay: "1.2s" }} />
          <div className="banner-bubble animate-bubble-1 w-8 h-8" style={{ left: "45%", top: "16%", animationDuration: "6.2s", animationDelay: "0.3s" }} />
          <div className="banner-bubble animate-bubble-2 w-6 h-6" style={{ left: "54%", bottom: "20%", animationDuration: "5.0s", animationDelay: "1.7s" }} />
          <div className="banner-bubble animate-bubble-3 w-5 h-5" style={{ right: "16%", top: "12%", animationDuration: "4.5s", animationDelay: "2.1s" }} />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute text-amber-300 w-4 h-4 animate-star-1" style={{ left: "4%", top: "18%", animationDelay: "0.2s" }}>
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute text-white/90 w-3.5 h-3.5 animate-star-2" style={{ left: "28%", bottom: "22%", animationDelay: "0.9s" }}>
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute text-amber-200 w-4 h-4 animate-star-3" style={{ left: "39%", top: "20%", animationDelay: "1.4s" }}>
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute text-yellow-300 w-5 h-5 animate-star-1 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" style={{ left: "48%", bottom: "24%", animationDelay: "0.5s" }}>
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute text-emerald-100 w-3 h-3 animate-star-2" style={{ right: "32%", top: "18%", animationDelay: "1.8s" }}>
            <path d="M12 1 C12 7.075 16.925 12 23 12 C16.925 12 12 16.925 12 23 C12 16.925 7.075 12 1 12 C7.075 12 12 7.075 12 1 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-1 sm:space-y-1.5 select-none">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
            <span className="text-[#facc15] font-black drop-shadow-xs">TỔNG</span>
            <span className="text-white/95">QUAN GIẢNG DẠY · BẢNG ĐIỀU KHIỂN</span>
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
            Chào {teacher.fullName}, chúc bạn một ngày giảng dạy hiệu quả! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50/95 font-medium drop-shadow-xs leading-relaxed">
            Quản lý lớp học, theo dõi tiến độ học viên và lan tỏa tri thức cùng EduMi mỗi ngày.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="relative h-[330px] overflow-hidden rounded-[28px] border border-amber-200/80 bg-gradient-to-br from-white via-[#fffef8] to-emerald-50/35 p-6 shadow-[0_10px_35px_rgba(245,158,11,0.06)]">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-[0_10px_24px_rgba(16,185,129,0.16)]">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">Tiến độ lớp học</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">Theo dõi mức hoàn thành & tham gia trong 7 ngày</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex-1">
              <svg viewBox="0 0 720 210" className="h-full w-full overflow-visible" role="img" aria-label="Biểu đồ tiến độ lớp học">
                <defs>
                  <linearGradient id="teacherProgressFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="teacherProgressLine" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="55%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="teacherJoinLine" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3, 4].map((line) => (
                  <line key={`grid-${line}`} x1="54" x2="692" y1={28 + line * 38} y2={28 + line * 38} stroke="#e2e8f0" strokeDasharray="4 6" strokeWidth="1" />
                ))}
                {[0, 1, 2, 3, 4, 5, 6].map((line) => (
                  <line key={`vgrid-${line}`} x1={72 + line * 100} x2={72 + line * 100} y1="28" y2="180" stroke="#e2e8f0" strokeOpacity="0.6" strokeWidth="1" />
                ))}

                <path d="M72 82 L172 76 L272 61 L372 40 L472 55 L572 69 L672 52 L672 180 L72 180 Z" fill="url(#teacherProgressFill)" />
                <path d="M72 82 L172 76 L272 61 L372 40 L472 55 L572 69 L672 52" fill="none" stroke="url(#teacherProgressLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                <path d="M72 130 L172 119 L272 98 L372 86 L472 93 L572 106 L672 88" fill="none" stroke="url(#teacherJoinLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />

                {[
                  ["72", "82", "68"],
                  ["172", "76", "72"],
                  ["272", "61", "78"],
                  ["372", "40", "85"],
                  ["472", "55", "80"],
                  ["572", "69", "76"],
                  ["672", "52", "82"],
                ].map(([x, y, label]) => (
                  <g key={`done-${x}`}>
                    <circle cx={x} cy={y} r="6" fill="#10b981" stroke="white" strokeWidth="3" />
                    <text x={x} y={Number(y) - 14} textAnchor="middle" className="fill-emerald-600 text-[13px] font-black">{label}</text>
                  </g>
                ))}

                {[
                  ["72", "130", "52"],
                  ["172", "119", "58"],
                  ["272", "98", "65"],
                  ["372", "86", "70"],
                  ["472", "93", "68"],
                  ["572", "106", "62"],
                  ["672", "88", "68"],
                ].map(([x, y, label]) => (
                  <g key={`join-${x}`}>
                    <circle cx={x} cy={y} r="6" fill="#f59e0b" stroke="white" strokeWidth="3" />
                    <text x={x} y={Number(y) + 24} textAnchor="middle" className="fill-orange-500 text-[12px] font-black">{label}</text>
                  </g>
                ))}

                {[
                  ["0%", "180"],
                  ["20%", "142"],
                  ["40%", "104"],
                  ["60%", "66"],
                  ["80%", "28"],
                ].map(([label, y]) => (
                  <text key={label} x="18" y={Number(y) + 4} className="fill-slate-400 text-[12px] font-black">{label}</text>
                ))}

                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
                  <text key={day} x={72 + index * 100} y="202" textAnchor="middle" className="fill-slate-400 text-[13px] font-black">{day}</text>
                ))}
              </svg>
            </div>

            <div className="mt-1 flex items-center justify-center gap-8 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" />Tỉ lệ hoàn thành bài tập</span>
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" />Mức độ tham gia</span>
            </div>
          </div>
        </div>

        <div className="relative h-[330px] overflow-hidden rounded-[28px] border border-amber-200/80 bg-gradient-to-br from-[#fffdf5] via-white to-[#ffe8a3] p-6 shadow-[0_10px_35px_rgba(245,158,11,0.08)]">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-300/40 blur-3xl" />
          <div className="absolute -bottom-24 left-6 h-52 w-52 rounded-full bg-emerald-200/20 blur-3xl" />
          <Image src="/start-teacher-removebg-preview.png" alt="Đánh giá giảng viên EduMi" width={260} height={260} className="pointer-events-none absolute bottom-[-8px] right-[-4px] z-0 w-[190px] select-none drop-shadow-xl sm:w-[220px]" />
          <p className="absolute bottom-6 left-6 z-10 max-w-[260px] text-xs font-bold leading-5 text-amber-900/70">Tích cực hoạt động để được gợi ý<br />nhiều hơn tới học sinh.</p>

          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">Đánh giá giảng viên</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-lg shadow-amber-300/40">
                <Star className="h-7 w-7 fill-white" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black leading-none tracking-tight text-slate-950">
                  {teacher.totalReviews && teacher.totalReviews > 0 ? (teacher.ratingAvg?.toFixed(1) || "5.0") : "--"}
                </span>
                <span className="pb-1 text-sm font-black text-amber-800">
                  {teacher.totalReviews && teacher.totalReviews > 0 ? "/ 5.0" : "(Chưa có đánh giá)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[5fr_7fr]">
        <div className="group relative z-20 flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-300/70 bg-[#fef8c4] p-4 shadow-[0_8px_30px_rgba(234,179,8,0.08)] sm:rounded-3xl sm:p-5">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/15 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-yellow-300/20 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white shadow-[0_2px_0_rgba(15,23,42,0.12)]">
                  <CalendarDays className="h-4 w-4 text-slate-900" />
                </div>
                <h3 className="whitespace-nowrap text-xl font-black tracking-tight text-slate-900">Lịch dạy</h3>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900/15 bg-white/80 text-slate-900 shadow-2xs transition-all hover:scale-105 hover:bg-white active:scale-95">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="min-w-[72px] select-none text-center leading-tight">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-700">Tháng</span>
                  <span className="text-sm font-black text-slate-950">9/2026</span>
                </div>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900/15 bg-white/80 text-slate-900 shadow-2xs transition-all hover:scale-105 hover:bg-white active:scale-95">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-1.5 grid grid-cols-7 gap-1 text-center select-none">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayName) => (
                <div key={dayName} className="py-0.5 text-xs font-bold text-slate-700/80">{dayName}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {[
                { day: "31", muted: true }, { day: "1" }, { day: "2" }, { day: "3" }, { day: "4" }, { day: "5" }, { day: "6" },
                { day: "7" }, { day: "8" }, { day: "9", done: true }, { day: "10" }, { day: "11" }, { day: "12" }, { day: "13" },
                { day: "14" }, { day: "15" }, { day: "16", done: true }, { day: "17" }, { day: "18" }, { day: "19" }, { day: "20" },
                { day: "21", upcoming: true }, { day: "22" }, { day: "23", upcoming: true }, { day: "24" }, { day: "25" }, { day: "26" }, { day: "27" },
                { day: "28", upcoming: true }, { day: "29" }, { day: "30" }, { day: "1", muted: true }, { day: "2", muted: true }, { day: "3", muted: true }, { day: "4", muted: true },
                { day: "5", muted: true }, { day: "6", muted: true }, { day: "7", muted: true }, { day: "8", muted: true }, { day: "9", muted: true }, { day: "10", muted: true }, { day: "11", muted: true },
              ].map((cell, index) => (
                <div key={`${cell.day}-${index}`} className={`flex h-8 items-center justify-center rounded-xl text-[13px] font-bold transition ${cell.muted ? "text-slate-400/40" : cell.upcoming ? "bg-emerald-500 text-white shadow-2xs" : cell.done ? "bg-blue-500 text-white shadow-2xs" : "text-slate-900 hover:bg-black/5"}`}>
                  {cell.day}
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-3 right-2 z-10 h-36 w-36 drop-shadow-md sm:-bottom-2.5 sm:right-4 sm:h-44 sm:w-44">
            <Image src="/stickers/pencil-capybara.png" alt="Capybara cưỡi bút chì" width={176} height={176} className="h-full w-full object-contain" />
          </div>

          <div className="relative z-10 mt-3 flex items-center justify-between border-t border-amber-300/60 pt-2.5 text-[11px] text-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900"><span className="h-2.5 w-2.5 rounded-md bg-emerald-500 shadow-2xs" />Sắp dạy</span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900"><span className="h-2.5 w-2.5 rounded-md bg-blue-500 shadow-2xs" />Đã dạy xong</span>
            </div>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-orange-500/80 bg-gradient-to-br from-[#fdba74] via-[#fb923c] to-[#f97316] p-4 shadow-[0_14px_40px_rgba(249,115,22,0.18)] sm:rounded-3xl sm:p-5 lg:p-6">
          <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full bg-purple-400/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 left-44 h-36 w-36 rounded-full border-[10px] border-emerald-400/30" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-amber-300/35 blur-2xl" />
          <div className="pointer-events-none absolute -left-0.5 top-1/2 z-10 h-0 w-0 -translate-y-1/2 border-b-[10px] border-l-[12px] border-t-[10px] border-b-transparent border-l-orange-600 border-t-transparent" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white shadow-[0_2px_0_rgba(15,23,42,0.15)]">
                <svg viewBox="0 0 40 40" className="h-8 w-8">
                  <circle cx="20" cy="20" r="18" fill="white" />
                  <line x1="20" y1="4" x2="20" y2="7" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="33" x2="20" y2="36" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="4" y1="20" x2="7" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="33" y1="20" x2="36" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="20" x2="13" y2="13" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="20" x2="20" y2="7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="20" cy="20" r="2" fill="#0f172a" />
                </svg>
              </div>

              <div>
                <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-950">Thông báo quan trọng</h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-extrabold text-slate-950">4 thông báo mới</span>
                  <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-2xs">2 cần xử lý</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { title: "Nguyễn Minh Anh xin vào lớp IELTS Foundation", meta: "Lớp IELTS Foundation · Chờ duyệt", time: "Mới", sub: "Cần xác nhận", overdue: true },
                { title: "Trần Minh Đức đã nộp Writing Task 1", meta: "Lớp 9A · Bài tập mới", time: "5p", sub: "Vừa nộp" },
                { title: "Lê Hoàng Nam xin vào lớp Toán nâng cao", meta: "Lớp Toán 9 · Chờ duyệt", time: "12p", sub: "Cần xác nhận" },
                { title: "Hà My đã nộp Speaking Record Part 2", meta: "Lớp IELTS Speaking · Bài tập mới", time: "28p", sub: "Vừa nộp" },
              ].map((hw) => (
                <div key={hw.title} className="group/item relative flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border-2 border-slate-950/15 bg-white p-2.5 shadow-[0_3px_0_rgba(15,23,42,0.12)] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(15,23,42,0.18)] sm:rounded-2xl sm:p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {hw.overdue ? (
                      <span className="relative flex h-2.5 w-2.5 shrink-0"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" /></span>
                    ) : (
                      <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                    )}
                    <div className="min-w-0">
                      <h4 className="truncate text-[13px] font-extrabold leading-tight text-slate-900 transition-colors group-hover/item:text-orange-600">{hw.title}</h4>
                      <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">{hw.meta}</p>
                    </div>
                  </div>

                  <div className={`min-w-[95px] shrink-0 rounded-xl border px-3 py-1 text-center transition-transform group-hover/item:scale-105 ${hw.overdue ? "border-rose-600 bg-[#ef4444] text-white shadow-xs" : "border-emerald-500/40 bg-[#4ade80] text-emerald-950 shadow-xs"}`}>
                    <div className="font-mono text-sm font-black leading-tight tracking-tight">{hw.time}</div>
                    <div className={`mt-0.5 text-[9px] font-extrabold leading-none ${hw.overdue ? "text-rose-100" : "text-emerald-950/80"}`}>{hw.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-3.5 flex items-center justify-between pt-1">
            <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-md active:scale-95">
              <span>Xem tất cả thông báo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_390px]">
        <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-amber-100/35 blur-3xl" />
          <div className="absolute right-10 top-10 h-52 w-52 rounded-full bg-emerald-100/60 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <Award className="h-11 w-11 fill-amber-300 text-amber-500 drop-shadow-sm" />
                <Star className="absolute h-5 w-5 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black leading-tight tracking-tight text-[#07153a]">Danh hiệu của bạn</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Thành tích nổi bật tháng 9/2026</p>
              </div>
            </div>

            <div className="relative hidden rounded-full border border-emerald-100 bg-emerald-50/80 px-5 py-2.5 text-sm font-black text-emerald-700 shadow-sm lg:flex lg:items-center lg:gap-3">
              <Trophy className="h-5 w-5 text-emerald-600" />
              Tiếp tục lan tỏa tri thức
              <span className="absolute -right-3 -top-3 h-3 w-1 rotate-45 rounded-full bg-amber-400" />
              <span className="absolute -right-7 top-2 h-3 w-1 rotate-[30deg] rounded-full bg-amber-400" />
            </div>
          </div>

          <div className="relative z-10 mt-4 grid gap-5 lg:grid-cols-[240px_1fr]">
            <div className="relative hidden min-h-[210px] lg:block">
              <div className="absolute bottom-0 left-3 h-4 w-48 rounded-[50%] bg-emerald-100/80 blur-sm" />
              <Image src="/Capybara_ôm_huy_hiệu_ngôi_sao-removebg-preview.png" alt="Mascot danh hiệu EduMi" width={260} height={260} className="absolute bottom-[-15px] left-0 w-[240px] select-none object-contain drop-shadow-sm" />
              <Star className="absolute left-2 top-14 h-6 w-6 fill-amber-300 text-amber-300" />
              <span className="absolute right-10 top-12 h-7 w-2 rotate-[24deg] rounded-full bg-amber-300" />
              <span className="absolute right-4 top-20 h-6 w-2 rotate-[72deg] rounded-full bg-amber-300" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: "Người chấm bài", desc: "Hoàn thành 10 bài chấm", progress: "10/10", width: "100%", tone: "green", sticker: "/sticker1.png" },
                  { title: "Người chia sẻ tài liệu", desc: "Đăng tải 10 tài liệu", progress: "10/10", width: "100%", tone: "amber", sticker: "/sticker2.png" },
                  { title: "Người truyền lửa", desc: "Duy trì lớp tích cực", progress: "8/10", width: "80%", tone: "rose", sticker: "/sticker3.png" },
                ].map((item) => {
                  const toneClass = item.tone === "green"
                    ? {
                        card: "border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/90",
                        blob: "from-emerald-100 via-emerald-50 to-white",
                        bar: "from-emerald-400 to-emerald-500",
                      }
                    : item.tone === "amber"
                      ? {
                          card: "border-amber-100 bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/90",
                          blob: "from-amber-100 via-yellow-50 to-white",
                          bar: "from-amber-400 to-yellow-500",
                        }
                      : {
                          card: "border-rose-100 bg-gradient-to-br from-rose-50/80 via-white to-pink-50/90",
                          blob: "from-rose-100 via-pink-50 to-white",
                          bar: "from-rose-400 to-pink-500",
                        };
                  return (
                    <div key={item.title} className={`relative overflow-hidden rounded-[24px] border p-4 shadow-sm ${toneClass.card}`}>
                      <div className="relative mx-auto h-24 overflow-hidden rounded-[22px]">
                        <div className={`absolute inset-x-3 bottom-0 h-20 rounded-[50%] bg-gradient-to-br ${toneClass.blob}`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image src={item.sticker} alt={item.title} width={116} height={92} className="h-[88px] w-auto object-contain drop-shadow-sm" />
                        </div>
                        <Star className="absolute right-4 top-3 h-4 w-4 fill-amber-300 text-amber-300" />
                        <Star className="absolute left-5 bottom-5 h-3.5 w-3.5 fill-amber-200 text-amber-200" />
                      </div>
                      <p className="mt-3 min-h-10 text-center text-sm font-semibold leading-5 text-slate-500">{item.desc}</p>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/80 shadow-inner">
                          <div className={`h-full rounded-full bg-gradient-to-r ${toneClass.bar}`} style={{ width: item.width }} />
                        </div>
                        <span className="text-sm font-black text-slate-500">{item.progress}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex h-[360px] w-full max-w-[390px] flex-col justify-between overflow-hidden rounded-2xl border border-emerald-400/35 bg-gradient-to-br from-[#024a30] via-[#047857] to-[#059669] p-4 text-white shadow-[0_10px_35px_rgba(6,78,59,0.18)] sm:rounded-3xl sm:p-5 xl:justify-self-end">
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-emerald-300/15 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-teal-300/15 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="mb-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-amber-500 shadow-[0_2px_0_rgba(15,23,42,0.15)] sm:h-10 sm:w-10">
                  <Trophy className="h-5 w-5 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-base font-black leading-tight tracking-tight text-white sm:text-lg">Vinh danh giảng viên</h2>
                  <p className="mt-0.5 text-[10px] font-bold text-emerald-100/90 sm:text-[11px]">Top 3 tháng 9/2026</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { rank: 1, name: teacher.fullName, short: teacher.fullName.split(" ").slice(-2).map((word) => word.charAt(0)).join("") || "TL", badge: "Dẫn đầu", score: "9.9 ĐG", tone: "gold" },
                { rank: 2, name: "Thầy Minh Quân", short: "MQ", badge: "Bứt phá", score: "9.7 ĐG", tone: "silver" },
                { rank: 3, name: "Cô Hoàng An", short: "HA", badge: "Ấn tượng", score: "9.5 ĐG", tone: "bronze" },
              ].map((item) => {
                const toneClass = item.tone === "gold" ? "border-[#f59e0b] bg-gradient-to-r from-[#fffef0] to-[#fef08a]/40 shadow-[0_3px_0_rgba(245,158,11,0.25)]" : item.tone === "silver" ? "border-[#94a3b8] bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0]/60 shadow-[0_3px_0_rgba(148,163,184,0.2)]" : "border-[#f97316]/70 bg-gradient-to-r from-[#fff7ed] to-[#fed7aa]/50 shadow-[0_3px_0_rgba(249,115,22,0.2)]";
                const rankClass = item.tone === "gold" ? "bg-amber-400 text-slate-950" : item.tone === "silver" ? "bg-slate-300 text-slate-900" : "bg-[#ea580c] text-white";
                const avatarClass = item.tone === "gold" ? "bg-gradient-to-br from-amber-400 to-orange-500" : item.tone === "silver" ? "bg-gradient-to-br from-sky-400 to-blue-600" : "bg-gradient-to-br from-emerald-400 to-teal-600";
                const badgeClass = item.tone === "gold" ? "border-amber-300 bg-amber-100 text-amber-950" : item.tone === "silver" ? "border-slate-300 bg-slate-100 text-slate-800" : "border-orange-300 bg-orange-100 text-orange-950";
                const scoreClass = item.tone === "gold" ? "border-amber-300/80 bg-amber-100/90 text-amber-950" : item.tone === "silver" ? "border-slate-300/80 bg-slate-100/90 text-slate-900" : "border-orange-300/80 bg-orange-100/90 text-orange-950";
                return (
                  <div key={item.rank} className={`flex items-center justify-between gap-2.5 rounded-xl border-2 p-2.5 transition-all sm:rounded-2xl sm:p-3 ${toneClass}`}>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md text-[11px] font-black sm:h-6 sm:w-6 sm:rounded-lg sm:text-xs ${rankClass}`}>{item.rank}</span>
                      <div className={`flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border border-white text-[11px] font-extrabold text-white shadow-2xs sm:h-8 sm:w-8 ${avatarClass}`}>{item.short}</div>
                      <div className="min-w-0">
                        <h3 className="truncate text-xs font-black leading-tight text-slate-900 sm:text-[13px]">{item.name}</h3>
                        <span className={`mt-0.5 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-extrabold ${badgeClass}`}>{item.badge}</span>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-black sm:text-[11px] ${scoreClass}`}>{item.score}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-3 flex items-center justify-between gap-2 border-t border-emerald-400/30 pt-3">
            <span className="text-[11px] font-bold text-white">Bạn: <strong className="font-black text-amber-300">#1</strong> (9.9 ĐG)</span>
            <button className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/40 bg-slate-950 px-3.5 py-1 text-[10px] font-extrabold text-white shadow-sm transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-md active:scale-95 sm:text-[11px]">
              <span>Bảng vàng</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

type TeacherClassStatus = "upcoming" | "completed" | "future";

type TeacherClassCard = {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectColor: string;
  coverImage: string;
  teacher: string;
  schedule: string;
  roomName: string;
  difficulty: string;
  ratingAvg: number;
  ratingCount: number;
  studentCount: number;
  rejectReason: string | null;
  status: TeacherClassStatus;
  statusLabel: string;
  statusColor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextSessionTime?: string;
};

const teacherClassCards = [
  {
    id: "teach-01",
    title: "Toán 12: Chuyên đề Hàm số, Tích phân & Logarit VIP",
    subject: "Toán học",
    subjectColor: "bg-blue-50 text-blue-700 border-blue-200",
    coverImage: "/classes/class-math.jpg",
    teacher: "Thầy Trần Long · Thạc sĩ Sư phạm Toán",
    schedule: "Thứ 2, Thứ 5 (19:30 - 21:00)",
    roomName: "Lớp học ảo EduMi #01 (Google Meet)",
    status: "upcoming",
    statusLabel: "Sắp diễn ra hôm nay",
    statusColor: "bg-amber-50 text-amber-800 border-amber-200/80 animate-pulse",
    progress: 35,
    completedLessons: 12,
    totalLessons: 36,
    nextSessionTime: "Hôm nay, 19:30 - 21:00",
  },
  {
    id: "teach-02",
    title: "Ngữ pháp Tiếng Anh: 12 Thì & Câu bị động nâng cao",
    subject: "Tiếng Anh",
    subjectColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    coverImage: "/classes/class-english.jpg",
    teacher: "Cô Thu Hà · 8.5 IELTS",
    schedule: "Thứ 2, Thứ 4 (08:00 - 09:30)",
    roomName: "Lớp học ảo EduMi #02",
    status: "completed",
    statusLabel: "Đã hoàn thành hôm nay",
    statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    progress: 75,
    completedLessons: 18,
    totalLessons: 24,
    nextSessionTime: "Thứ 4 tới, 08:00 - 09:30",
  },
  {
    id: "teach-03",
    title: "Vật lý 12: Dao động cơ học & Dòng điện xoay chiều",
    subject: "Vật lý",
    subjectColor: "bg-purple-50 text-purple-700 border-purple-200",
    coverImage: "/classes/class-physics.jpg",
    teacher: "Thầy Trần Long · Chuyên gia luyện thi",
    schedule: "Thứ 4, Thứ 7 (19:30 - 21:00)",
    roomName: "Lớp học ảo EduMi #03",
    status: "future",
    statusLabel: "Buổi tới: Thứ 4",
    statusColor: "bg-slate-100 text-slate-700 border-slate-200",
    progress: 26,
    completedLessons: 8,
    totalLessons: 30,
    nextSessionTime: "Thứ 4 (23/09), 19:30",
  },
  {
    id: "teach-04",
    title: "Ngữ văn 12: Kỹ năng Viết nghị luận văn học đạt điểm 8+",
    subject: "Ngữ văn",
    subjectColor: "bg-rose-50 text-rose-700 border-rose-200",
    coverImage: "/classes/class-literature.jpg",
    teacher: "Cô Phương Linh · Giảng viên Văn học",
    schedule: "Chủ nhật (14:00 - 16:30)",
    roomName: "Lớp học ảo EduMi #05",
    status: "future",
    statusLabel: "Buổi tới: Chủ nhật",
    statusColor: "bg-slate-100 text-slate-700 border-slate-200",
    progress: 30,
    completedLessons: 6,
    totalLessons: 20,
    nextSessionTime: "Chủ nhật (27/09), 14:00",
  },
  {
    id: "teach-05",
    title: "Hóa học 12: Bứt phá điểm 9+ chuyên đề Este & Nitơ",
    subject: "Hóa học",
    subjectColor: "bg-amber-50 text-amber-700 border-amber-200",
    coverImage: "/classes/class-physics.jpg",
    teacher: "Thầy Trần Long · Lớp luyện đề tăng tốc",
    schedule: "Thứ 3, Thứ 6 (18:00 - 19:30)",
    roomName: "Lớp học ảo EduMi #07",
    status: "completed",
    statusLabel: "Đã hoàn thành khóa học",
    statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    progress: 100,
    completedLessons: 24,
    totalLessons: 24,
    nextSessionTime: "Đã lưu record",
  },
  {
    id: "teach-06",
    title: "Toán 11: Nền tảng Hình học không gian & Lượng giác cơ bản",
    subject: "Toán học",
    subjectColor: "bg-blue-50 text-blue-700 border-blue-200",
    coverImage: "/classes/class-math.jpg",
    teacher: "Thầy Trần Long · EduMi Mentor",
    schedule: "Thứ 7 (09:00 - 11:00)",
    roomName: "Lớp học ảo EduMi #08",
    status: "future",
    statusLabel: "Buổi tới: Thứ 7",
    statusColor: "bg-slate-100 text-slate-700 border-slate-200",
    progress: 18,
    completedLessons: 4,
    totalLessons: 22,
    nextSessionTime: "Thứ 7 (26/09), 09:00",
  },
];
type TeacherClassApiItem = {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  scheduleDays: string;
  timeSlot: string;
  difficulty: string;
  ratingAvg: number;
  ratingCount: number;
  scheduleWeekdays?: string[];
  startTime?: string | null;
  endTime?: string | null;
  totalLessons: number;
  tuitionFee: number;
  coverImage: string | null;
  status: "draft" | "pending" | "approved" | "rejected" | "hidden" | "completed";
  studentCount: number;
  completedLessons: number;
  progress: number;
  rejectReason: string | null;
  createdAt: string;
};

function getTeacherClassSubjectTone(subject: string) {
  if (subject.includes("Toán")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (subject.includes("Anh") || subject.includes("IELTS")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (subject.includes("Vật")) return "bg-purple-50 text-purple-700 border-purple-200";
  if (subject.includes("Hóa")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (subject.includes("Văn")) return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function getTeacherClassCover(subject: string, coverImage?: string | null) {
  if (coverImage) return coverImage;
  if (subject.includes("Anh") || subject.includes("IELTS")) return "/classes/class-english.jpg";
  if (subject.includes("Vật") || subject.includes("Hóa")) return "/classes/class-physics.jpg";
  if (subject.includes("Văn")) return "/classes/class-literature.jpg";
  return "/classes/class-math.jpg";
}

function mapApiClass(item: TeacherClassApiItem): TeacherClassCard {
  const approvedLike = item.status === "approved" || item.status === "completed";
  const status: TeacherClassStatus = item.status === "completed" ? "completed" : approvedLike ? "upcoming" : "future";
  const statusLabel = item.status === "pending" ? "Đã gửi duyệt" : item.status === "rejected" ? "Từ chối" : item.status === "hidden" ? "Đã ẩn" : item.status === "completed" ? "Đã hoàn thành" : "Đã duyệt";
  const statusColor = item.status === "pending" ? "bg-amber-50 text-amber-800 border-amber-200/80" : item.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-200/80" : item.status === "approved" ? "bg-emerald-50 text-emerald-800 border-emerald-200/80" : "bg-slate-100 text-slate-700 border-slate-200";

  return {
    id: item.id,
    title: item.title,
    description: item.description || "Lớp học đang được cập nhật mô tả chi tiết.",
    subject: item.subject,
    subjectColor: getTeacherClassSubjectTone(item.subject),
    coverImage: getTeacherClassCover(item.subject, item.coverImage),
    teacher: "Lớp giảng dạy của bạn",
    schedule: `${item.scheduleDays} (${item.timeSlot})`,
    roomName: item.status,
    difficulty: item.difficulty || "Trung bình",
    ratingAvg: item.ratingAvg || 0,
    ratingCount: item.ratingCount || 0,
    studentCount: item.studentCount || 0,
    rejectReason: item.rejectReason || null,
    status,
    statusLabel,
    statusColor,
    progress: item.progress || 0,
    completedLessons: item.completedLessons || 0,
    totalLessons: item.totalLessons || 0,
    nextSessionTime: item.rejectReason ? `Lý do: ${item.rejectReason}` : `${item.scheduleDays}, ${item.timeSlot}`,
  };
}

function TeacherClassesPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "in_progress" | "completed">("all");
  const [classes, setClasses] = useState<TeacherClassCard[]>([]);
  const [classNotice, setClassNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  const fetchClasses = useCallback(async () => {
    setIsLoadingClasses(true);
    try {
      const res = await fetch("/api/teacher/classes");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể tải lớp học.");
      setClasses((data.classes || []).map((item: TeacherClassApiItem) => mapApiClass(item)));
    } catch (error) {
      setClassNotice({ type: "error", message: error instanceof Error ? error.message : "Không thể tải dữ liệu lớp học thật." });
    } finally {
      setIsLoadingClasses(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchClasses);
  }, [fetchClasses]);

  const subjectOptions = [
    { id: "all", label: "Tất cả môn học" },
    { id: "Toán học", label: "Toán học" },
    { id: "Ngữ văn", label: "Ngữ văn" },
    { id: "Tiếng Anh", label: "Tiếng Anh" },
    { id: "Vật lý", label: "Vật lý" },
    { id: "Hóa học", label: "Hóa học" },
  ];

  const statusOptions = [
    { id: "all", label: "Tất cả trạng thái" },
    { id: "in_progress", label: "Đang dạy" },
    { id: "completed", label: "Đã hoàn thành" },
  ];

  const isFiltered = searchQuery.trim() !== "" || selectedSubject !== "all" || selectedStatus !== "all";
  const filteredClasses = classes.filter((cls) => {
    if (searchQuery.trim()) {
      const keyword = searchQuery.toLowerCase();
      const haystack = `${cls.title} ${cls.subject} ${cls.teacher}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (selectedSubject !== "all" && cls.subject !== selectedSubject) return false;
    if (selectedStatus === "completed" && cls.status !== "completed") return false;
    if (selectedStatus === "in_progress" && cls.status === "completed") return false;
    return true;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-5">
      <section className="relative h-[170px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b5a43] via-[#07966c] to-[#08a777] px-6 py-8 shadow-[0_14px_36px_rgba(6,78,59,0.15)] sm:h-[180px] sm:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <span className="absolute left-[20%] top-[18%] h-6 w-6 rounded-full border border-white/30 bg-white/15 shadow-[0_0_18px_rgba(255,255,255,0.25)]" />
          <span className="absolute left-[48%] top-[25%] h-5 w-5 rounded-full border border-white/25 bg-white/10" />
          <span className="absolute left-[70%] top-[10%] h-8 w-8 rounded-full border border-white/30 bg-white/15" />
          <span className="absolute left-[78%] top-[48%] h-9 w-9 rounded-full border border-white/30 bg-white/15" />
          <span className="absolute left-[58%] top-[20%] text-3xl text-amber-200">✦</span>
          <span className="absolute left-[68%] bottom-[30%] text-xl text-emerald-100">✦</span>
        </div>
        <div className="relative z-10 max-w-xl space-y-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-200/90">Lớp học · Thời gian thực</p>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Khám phá lớp học của bạn</h1>
          <p className="text-sm font-semibold text-emerald-100 sm:text-base">Tham gia các buổi học tương tác và xem lại bài giảng dễ dàng.</p>
        </div>
        <div className="absolute bottom-0 right-0 top-0 w-52 overflow-hidden sm:w-72 md:w-96">
          <Image src="/classes/banner-classes.jpg" alt="Mascot lớp học EduMi" fill priority sizes="(max-width: 640px) 220px, 390px" className="object-cover object-right [mask-image:linear-gradient(to_left,black_65%,transparent)]" />
        </div>
      </section>

      {classNotice && (
        <div className={`rounded-2xl border px-4 py-3 text-sm font-bold ${classNotice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {classNotice.message}
        </div>
      )}

      <TeacherCreateClassForm
        onCreated={(createdClass) => {
          setClasses((current) => [mapApiClass(createdClass), ...current]);
          setClassNotice({ type: "success", message: "Lớp học đã được gửi staff duyệt." });
        }}
        onError={(message) => setClassNotice({ type: "error", message })}
      />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] sm:rounded-3xl sm:p-4">
        <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm kiếm theo tên lớp, môn học, giáo viên..."
              className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 pl-9.5 pr-9 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
            <FilterSelect icon={<BookOpen className="h-3.5 w-3.5 text-emerald-600" />} value={selectedSubject} options={subjectOptions} onChange={setSelectedSubject} />
            <FilterSelect icon={<Filter className="h-3.5 w-3.5 text-emerald-600" />} value={selectedStatus} options={statusOptions} onChange={(value) => setSelectedStatus(value as "all" | "in_progress" | "completed")} />
            {isFiltered && (
              <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2.5 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100">
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2">
          {isLoadingClasses ? <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 xl:col-span-2">Đang tải lớp học...</div> : filteredClasses.map((cls) => <TeacherClassListCard key={cls.id} cls={cls} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Không tìm thấy lớp học phù hợp</h3>
          <p className="max-w-sm text-sm text-slate-500">Không có lớp học nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.</p>
          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-xs transition-all hover:bg-emerald-700">
            <RotateCcw className="h-4 w-4" />
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}

function TeacherCreateClassForm({ onCreated, onError }: { onCreated: (createdClass: TeacherClassApiItem) => void; onError: (message: string) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [scheduleWeekdays, setScheduleWeekdays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalLessons, setTotalLessons] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = ["Toán học", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", "IELTS"];
  const grades = ["Lớp 10", "Lớp 11", "Lớp 12", "Ôn thi THPT"];
  const difficulties = ["Cơ bản", "Trung bình", "Nâng cao"];

  const handleCoverImageFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Vui lòng chọn ảnh bìa định dạng JPG, PNG hoặc WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError("Ảnh bìa lớp học tối đa 5MB.");
      event.target.value = "";
      return;
    }

    setIsUploadingCover(true);
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size, category: "class-cover" }),
      });
      const presign = await presignRes.json();
      if (!presignRes.ok || !presign.success) throw new Error(presign.error || "Không thể tạo liên kết upload ảnh bìa.");

      const uploadRes = await fetch(presign.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!uploadRes.ok) throw new Error("Upload ảnh bìa lớp học thất bại.");

      setCoverImage(presign.publicUrl || URL.createObjectURL(file));
      setCoverFileName(file.name);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Upload ảnh bìa lớp học thất bại.");
      event.target.value = "";
    } finally {
      setIsUploadingCover(false);
    }
  };
  const handleSubmit = async () => {
    if (!title.trim() || !subject || !gradeLevel || !difficulty || scheduleWeekdays.length === 0 || !startTime || !endTime || !totalLessons || Number(totalLessons) <= 0 || !tuitionFee || Number(tuitionFee) < 0) {
      onError("Vui lòng nhập đầy đủ tên lớp, môn học, khối lớp, lịch học, khung giờ, số buổi và học phí hợp lệ.");
      return;
    }

    if (startTime >= endTime) {
      onError("Giờ kết thúc phải sau giờ bắt đầu. Ví dụ: 19:30 - 21:00.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/teacher/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          subject,
          gradeLevel,
          difficulty,
          scheduleWeekdays,
          startTime,
          endTime,
          totalLessons: Number(totalLessons),
          tuitionFee: Number(tuitionFee),
          coverImage: coverImage || getTeacherClassCover(subject),
          hasOnlineRoom: true,
          autoRecord: true,
          allowPinnedNote: true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể đăng lớp học.");
      onCreated(data.class);
      setTitle("");
      setDescription("");
      setSubject("");
      setGradeLevel("");
      setDifficulty("");
      setScheduleWeekdays([]);
      setStartTime("");
      setEndTime("");
      setTotalLessons("");
      setTuitionFee("");
      setCoverImage("");
      setCoverFileName("");
      if (coverInputRef.current) coverInputRef.current.value = "";
    } catch (error) {
      onError(error instanceof Error ? error.message : "Đăng lớp học thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_12px_34px_rgba(6,78,59,0.06)]">
      <div className="flex flex-col gap-4 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/90 via-white to-amber-50/70 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-950">Đăng lớp học mới</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Tạo lớp giảng dạy, gửi staff duyệt trước khi hiển thị cho học viên.</p>
          </div>
        </div>
        <button type="button" disabled={isSubmitting} onClick={handleSubmit} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Đăng lớp học
        </button>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1.25fr_0.7fr_0.7fr_0.7fr]">
        <ClassTextInput label="Tên lớp học" value={title} onChange={setTitle} placeholder="VD: Toán 12 - Chuyên đề hàm số VIP" />
        <ClassSelectInput label="Môn học" value={subject} onChange={setSubject} options={subjects} placeholder="Chọn môn học" />
        <ClassSelectInput label="Khối lớp" value={gradeLevel} onChange={setGradeLevel} options={grades} placeholder="Chọn khối lớp" />
        <ClassSelectInput label="Độ khó" value={difficulty} onChange={setDifficulty} options={difficulties} placeholder="Chọn độ khó" />
      </div>
      <div className="grid gap-4 border-t border-slate-100 px-5 pb-5 pt-4 lg:grid-cols-[1.25fr_0.9fr_0.7fr_0.8fr]">
        <ClassWeekdayPicker value={scheduleWeekdays} onChange={setScheduleWeekdays} />
        <div className="grid grid-cols-2 gap-3">
          <ClassTextInput label="Giờ bắt đầu" value={startTime} onChange={setStartTime} placeholder="19:30" type="time" />
          <ClassTextInput label="Giờ kết thúc" value={endTime} onChange={setEndTime} placeholder="21:00" type="time" />
        </div>
        <ClassTextInput label="Số buổi" value={totalLessons} onChange={setTotalLessons} placeholder="VD: 36" type="number" />
        <ClassTextInput label="Học phí cả khóa" value={tuitionFee} onChange={setTuitionFee} placeholder="VD: 3000000" type="number" />
      </div>
      <div className="grid gap-4 border-t border-slate-100 px-5 pb-5 pt-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <label className="block">
          <span className="text-xs font-extrabold text-slate-500">Mô tả lớp học</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Mô tả mục tiêu học tập, lộ trình, đối tượng phù hợp và điểm nổi bật của lớp..." className="mt-1 min-h-[118px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-inner outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white" />
        </label>
        <div>
          <span className="text-xs font-extrabold text-slate-500">Ảnh bìa lớp học</span>
          <button type="button" onClick={() => coverInputRef.current?.click()} disabled={isUploadingCover} className="group relative mt-1 flex min-h-[118px] w-full overflow-hidden rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 text-left shadow-inner transition-all hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70">
            {coverImage ? (
              <Image src={coverImage} alt="Ảnh bìa lớp học" fill sizes="320px" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
            ) : (
              <span className="flex w-full flex-col items-center justify-center gap-2 px-4 text-center text-sm font-black text-emerald-800">
                {isUploadingCover ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                {isUploadingCover ? "Đang tải ảnh..." : "Tải ảnh bìa lớp học"}
                <span className="text-[11px] font-bold text-emerald-700/70">JPG, PNG, WEBP tối đa 5MB</span>
              </span>
            )}
            {coverImage ? <span className="absolute inset-x-3 bottom-3 truncate rounded-full bg-white/90 px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">{coverFileName || "Đã tải ảnh bìa"}</span> : null}
          </button>
          <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverImageFile} />
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {["Có phòng học online", "Tự động lưu record", "Cho phép ghim note"].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-extrabold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {item}
            </span>
          ))}
        </div>
        <span className="text-xs font-bold italic text-slate-400">Lớp học cần staff duyệt trước khi công khai.</span>
      </div>
    </section>
  );
}

const CLASS_WEEKDAYS = [
  { id: "mon", label: "T2" },
  { id: "tue", label: "T3" },
  { id: "wed", label: "T4" },
  { id: "thu", label: "T5" },
  { id: "fri", label: "T6" },
  { id: "sat", label: "T7" },
  { id: "sun", label: "CN" },
];

function ClassWeekdayPicker({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const toggle = (weekday: string) => {
    onChange(value.includes(weekday) ? value.filter((item) => item !== weekday) : [...value, weekday]);
  };

  return (
    <label className="block">
      <span className="text-xs font-extrabold text-slate-500">Lịch học</span>
      <div className="mt-1 grid grid-cols-7 gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner">
        {CLASS_WEEKDAYS.map((weekday) => {
          const active = value.includes(weekday.id);
          return (
            <button
              key={weekday.id}
              type="button"
              onClick={() => toggle(weekday.id)}
              className={`h-9 rounded-lg text-xs font-black transition ${active ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20" : "bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"}`}
            >
              {weekday.label}
            </button>
          );
        })}
      </div>
    </label>
  );
}
function ClassTextInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1 flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 shadow-inner outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white" />
    </label>
  );
}

function ModernFormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  icon: Icon,
  required,
  helperText,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | { id: string; label: string }[];
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  helperText?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const normalizedOptions: { id: string; label: string }[] = options.map((opt) =>
    typeof opt === "string" ? { id: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.id === value);
  const displayLabel = selectedOption ? selectedOption.label : "";

  return (
    <div ref={containerRef} className="relative block">
      {label && (
        <label className="mb-1 block text-xs font-extrabold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex h-11 w-full items-center justify-between rounded-xl border bg-slate-50 px-3 text-sm font-bold shadow-inner outline-none transition-all duration-200 cursor-pointer ${
          isOpen
            ? "border-emerald-500 bg-white ring-2 ring-emerald-100"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
        } ${Icon ? "pl-9" : ""}`}
      >
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-700" />
        )}
        <span className={`truncate text-left ${displayLabel ? "text-slate-800" : "text-slate-400 font-normal"}`}>
          {displayLabel || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>

      {helperText && (
        <p className="mt-1.5 text-xs font-semibold text-slate-500">{helperText}</p>
      )}

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-emerald-600 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ModernFilterSelect({
  icon,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const currentLabel = options.find((opt) => opt.id === value)?.label || options[0]?.label || "";
  const isFiltered = value !== "all";

  return (
    <div ref={containerRef} className="relative flex-1 sm:flex-initial">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-[42px] w-full min-w-[160px] items-center justify-between gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer sm:w-auto select-none ${
          isFiltered
            ? "border-emerald-400 bg-emerald-50 text-emerald-900 shadow-sm"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/80"
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="shrink-0">{icon}</span>
          <span className="truncate">{currentLabel}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full min-w-[200px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {options.map((option) => {
              const isSelected = option.id === value;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-emerald-600 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ClassSelectInput({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return (
    <ModernFormSelect
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      required
    />
  );
}

function FormControl({ label, value, select }: { label: string; value: string; select?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold text-slate-500">{label}</span>
      <span className="mt-1 flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 shadow-inner">
        {value}
        {select && <ChevronDown className="h-4 w-4 text-slate-400" />}
      </span>
    </label>
  );
}

function FilterSelect({ icon, value, options, onChange }: { icon: React.ReactNode; value: string; options: { id: string; label: string }[]; onChange: (value: string) => void }) {
  return (
    <ModernFilterSelect
      icon={icon}
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}

function TeacherClassListCard({ cls }: { cls: TeacherClassCard }) {
  const ratingText = cls.ratingAvg > 0 ? `${cls.ratingAvg.toFixed(1)} (${cls.ratingCount})` : "Chưa có đánh giá";

  return (
    <article className="group flex h-auto flex-col overflow-hidden rounded-[18px] bg-white p-3 shadow-[0_8px_24px_rgba(25,60,35,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(25,60,35,0.13)] sm:h-[286px]">
      <div className="grid min-h-0 flex-1 gap-4 sm:grid-cols-[40%_60%]">
        <div className="relative min-h-[190px] overflow-hidden rounded-[14px] bg-emerald-50 sm:min-h-0">
          <Image src={cls.coverImage} alt={cls.title} fill sizes="(max-width: 640px) 100vw, 220px" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
        </div>
        <div className="flex min-w-0 flex-col py-1 pr-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={`inline-flex h-8 w-fit items-center gap-2 rounded-full px-3.5 text-[14px] font-extrabold ${cls.subjectColor}`}>
              <BookOpen className="h-4 w-4" />
              {cls.subject}
            </span>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${cls.statusColor}`}>{cls.statusLabel}</span>
          </div>
          <h2 className="line-clamp-2 text-[18px] font-black leading-[1.16] tracking-[-0.035em] text-[#10213a]">
            {cls.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-[13.5px] font-medium leading-[1.42] text-[#64728a]">
            {cls.description}
          </p>
          {cls.rejectReason && (
            <div className="mt-2 line-clamp-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[12px] font-bold leading-snug text-rose-700">
              Lý do từ chối: {cls.rejectReason}
            </div>
          )}
          <div className="mt-auto flex items-center gap-2.5 pb-1 pt-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">
              GV
            </span>
            <span className="truncate text-[13px] font-extrabold text-[#23324a]">{cls.teacher}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex min-h-[46px] flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-4 text-[12px] font-bold text-[#66758d]">
          <span className="flex items-center gap-1 whitespace-nowrap"><BookOpen className="h-4 w-4" />{cls.totalLessons} buổi</span>
          <span className="flex items-center gap-1 whitespace-nowrap"><BarChart3 className="h-4 w-4" />{cls.difficulty}</span>
          <span className="flex items-center gap-1 whitespace-nowrap"><UserRound className="h-4 w-4" />{cls.studentCount.toLocaleString("vi-VN")} học viên</span>
          <span className="flex items-center gap-1 whitespace-nowrap"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{ratingText}</span>
        </div>
        <Link href="#" className="flex h-[38px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#00a66f] px-4 text-[13px] font-black text-white transition hover:bg-[#008b5f]">
          Xem lớp học <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
type MaterialStatus = "draft" | "pending" | "approved" | "rejected" | "hidden";

type TeacherMaterialCard = {
  id: string;
  title: string;
  description?: string;
  cardCode: string;
  subject: string;
  topic?: string;
  fileType: "PDF" | "DOCX" | "SLIDE";
  fileName?: string;
  fileKey?: string;
  fileSize?: number;
  pages: number;
  viewCount: number;
  downloadCount: number;
  bgColor: string;
  accentColor: string;
  pattern: "waves" | "clouds" | "confetti" | "stripes";
  status?: MaterialStatus;
  rejectReason?: string | null;
};

type TeacherMaterialApiItem = {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  fileType: "PDF" | "DOCX";
  fileName: string;
  fileKey: string;
  fileSize: number;
  pageCount: number;
  status: MaterialStatus;
  viewCount: number;
  downloadCount: number;
  rejectReason: string | null;
  createdAt: string;
};


const MATERIAL_CARD_STYLES = [
  { bgColor: "bg-[#e07328]", accentColor: "text-[#e07328]", pattern: "waves" as const },
  { bgColor: "bg-[#be4c73]", accentColor: "text-[#be4c73]", pattern: "clouds" as const },
  { bgColor: "bg-[#bf5447]", accentColor: "text-[#bf5447]", pattern: "confetti" as const },
  { bgColor: "bg-[#7356bc]", accentColor: "text-[#7356bc]", pattern: "stripes" as const },
  { bgColor: "bg-[#0d9488]", accentColor: "text-[#0d9488]", pattern: "waves" as const },
  { bgColor: "bg-[#0284c7]", accentColor: "text-[#0284c7]", pattern: "clouds" as const },
];
function getMaterialCardStyle(seed: string, fallbackIndex: number) {
  let hash = fallbackIndex;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return MATERIAL_CARD_STYLES[hash % MATERIAL_CARD_STYLES.length];
}

function mapApiMaterial(item: TeacherMaterialApiItem, index: number): TeacherMaterialCard {
  const style = getMaterialCardStyle(`${item.id}-${item.subject}-${item.title}`, index);
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    cardCode: item.gradeLevel || item.subject.toUpperCase(),
    subject: item.subject,
    topic: item.topic,
    fileType: item.fileType,
    fileName: item.fileName,
    fileKey: item.fileKey,
    fileSize: item.fileSize,
    pages: item.pageCount || (item.fileType === "DOCX" ? 24 : 48),
    viewCount: item.viewCount || 0,
    downloadCount: item.downloadCount || 0,
    bgColor: style.bgColor,
    accentColor: style.accentColor,
    pattern: style.pattern,
    status: item.status,
    rejectReason: item.rejectReason,
  };
}

function TeacherMaterialsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTime, setSelectedTime] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [materials, setMaterials] = useState<TeacherMaterialCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teacher/materials");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể tải tài liệu.");
      const apiMaterials = (data.materials || []).map((item: TeacherMaterialApiItem, index: number) => mapApiMaterial(item, index));
      setMaterials(apiMaterials);
    } catch (error) {
      console.error("[Teacher materials fetch error]:", error);
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Không thể tải dữ liệu tài liệu thật." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchMaterials);
  }, [fetchMaterials]);

  const timeOptions = [
    { id: "all", label: "Tất cả" },
    { id: "newest", label: "Mới nhất" },
    { id: "recent_7d", label: "7 ngày qua" },
    { id: "recent_30d", label: "30 ngày qua" },
  ];
  const subjectOptions = [
    { id: "all", label: "Tất cả môn học" },
    { id: "Toán học", label: "Toán học" },
    { id: "Tiếng Anh", label: "Tiếng Anh" },
    { id: "Vật lý", label: "Vật lý" },
    { id: "Ngữ văn", label: "Ngữ văn" },
    { id: "Hóa học", label: "Hóa học" },
  ];

  const isFiltered = searchQuery.trim() !== "" || selectedTime !== "all" || selectedSubject !== "all";
  const filteredMaterials = materials.filter((item) => {
    if (searchQuery.trim()) {
      const keyword = searchQuery.toLowerCase();
      const haystack = `${item.title} ${item.subject} ${item.cardCode}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (selectedSubject !== "all" && item.subject !== selectedSubject) return false;
    return true;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTime("all");
    setSelectedSubject("all");
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!window.confirm("Bạn muốn xóa tài liệu này khỏi kho đã đăng?")) return;
    try {
      const res = await fetch(`/api/teacher/materials?id=${encodeURIComponent(materialId)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể xóa tài liệu.");
      setMaterials((current) => current.filter((item) => item.id !== materialId));
      setNotice({ type: "success", message: data.message || "Đã xóa tài liệu." });
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Xóa tài liệu thất bại." });
    }
  };

  return (
    <div className="space-y-5">
      <section className="relative h-[170px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b5a43] via-[#07966c] to-[#08a777] px-6 py-8 shadow-[0_14px_36px_rgba(6,78,59,0.15)] sm:h-[180px] sm:px-10">
        <div className="relative z-10 max-w-2xl space-y-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-200/90">Tài liệu · Kho giảng dạy</p>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Khám phá tài liệu của bạn</h1>
          <p className="text-sm font-semibold text-emerald-100 sm:text-base">Đăng tài liệu PDF/DOCX, gửi staff duyệt và quản lý trạng thái học liệu đã tải lên.</p>
        </div>
        <div className="absolute bottom-0 right-0 top-0 w-52 overflow-hidden sm:w-72 md:w-96">
          <Image src="/classes/banner-classes.jpg" alt="EduMi tài liệu" fill priority sizes="(max-width: 640px) 220px, 390px" className="object-cover object-right [mask-image:linear-gradient(to_left,black_65%,transparent)]" />
        </div>
      </section>

      {notice && (
        <div className={`rounded-2xl border px-4 py-3 text-sm font-bold ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {notice.message}
        </div>
      )}

      <TeacherUploadMaterialForm
        onUploaded={(material) => {
          setMaterials((current) => [mapApiMaterial(material, 0), ...current]);
          setNotice({ type: "success", message: "Tài liệu đã được gửi staff duyệt." });
        }}
        onError={(message) => setNotice({ type: "error", message })}
      />

      <section className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] sm:rounded-3xl sm:p-4">
        <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Tìm tài liệu, môn học, bộ đề..." className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 pl-9 pr-9 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"><X className="h-4 w-4" /></button>}
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
            <FilterSelect icon={<Clock className="h-3.5 w-3.5 text-emerald-600" />} value={selectedTime} options={timeOptions} onChange={setSelectedTime} />
            <FilterSelect icon={<BookOpen className="h-3.5 w-3.5 text-emerald-600" />} value={selectedSubject} options={subjectOptions} onChange={setSelectedSubject} />
            {isFiltered && <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2.5 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100"><RotateCcw className="h-3.5 w-3.5" />Đặt lại</button>}
          </div>
        </div>
      </section>

      <div className="flex flex-col justify-between gap-3 px-1 text-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 font-medium text-slate-600">
          <span className="flex items-center gap-1.5"><FolderOpen className="h-4 w-4 text-emerald-600" />Đang hiển thị <strong className="text-slate-900">{filteredMaterials.length}</strong> tài liệu</span>
          {isLoading && <span className="inline-flex items-center gap-1 text-emerald-700"><Loader2 className="h-3.5 w-3.5 animate-spin" />Đang đồng bộ</span>}
        </div>
        <span className="text-[11px] italic text-slate-400">Tài liệu cần được staff duyệt trước khi hiển thị công khai</span>
      </div>

      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {filteredMaterials.map((item) => <TeacherMaterialListCard key={item.id} item={item} onDeleted={handleDeleteMaterial} />)}
        </div>
      ) : (
        <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Search className="h-7 w-7 text-emerald-600" /></div>
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy tài liệu phù hợp</h3>
          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-700"><RotateCcw className="h-3.5 w-3.5" />Đặt lại bộ lọc</button>
        </div>
      )}
    </div>
  );
}

function TeacherUploadMaterialForm({ onUploaded, onError }: { onUploaded: (material: TeacherMaterialApiItem) => void; onError: (message: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState<"Đọc hiểu" | "Bài tập">("Đọc hiểu");
  const [gradeLevel, setGradeLevel] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<"PDF" | "DOCX">("PDF");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions = ["Toán học", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", "Tin học", "IELTS"];
  const gradeOptions = ["Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12", "THPT", "Ôn thi THPT Quốc gia", "ĐGNL", "IELTS"];

  const materialMimeType = selectedFileType === "DOCX" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/pdf";
  const acceptedFileTypes = selectedFileType === "DOCX" ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : ".pdf,application/pdf";
  const selectedFileExt = selectedFile?.name.split(".").pop()?.toLowerCase();

  const handleSubmit = async () => {
    if (!title.trim() || !subject.trim() || !gradeLevel.trim()) return onError("Vui lòng nhập tên tài liệu, chọn môn học và lớp học.");
    if (!selectedFile) return onError("Vui lòng chọn file tài liệu trước khi đăng.");
    if ((selectedFileType === "PDF" && selectedFileExt !== "pdf") || (selectedFileType === "DOCX" && selectedFileExt !== "docx")) {
      return onError(`File đã chọn chưa khớp với loại ${selectedFileType}. Vui lòng chọn đúng định dạng.`);
    }

    setIsSubmitting(true);
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: selectedFile.name, fileType: materialMimeType, fileSize: selectedFile.size, category: "material" }),
      });
      const presign = await presignRes.json();
      if (!presignRes.ok || !presign.success) throw new Error(presign.error || "Không thể tạo liên kết upload R2.");

      const uploadRes = await fetch(presign.uploadUrl, { method: "PUT", headers: { "Content-Type": materialMimeType }, body: selectedFile });
      if (!uploadRes.ok) throw new Error("Upload tài liệu lên R2 thất bại.");

      const saveRes = await fetch("/api/teacher/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, subject, topic, gradeLevel, fileType: selectedFileType, fileName: selectedFile.name, fileSize: selectedFile.size, fileKey: presign.fileKey, filePublicUrl: presign.publicUrl, visibility: "public", allowDownload: true }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok || !saved.success) throw new Error(saved.error || "Không thể lưu tài liệu.");

      onUploaded(saved.material);
      setTitle("");
      setSubject("");
      setTopic("Đọc hiểu");
      setGradeLevel("");
      setDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      onError(error instanceof Error ? error.message : "Đăng tài liệu thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_12px_34px_rgba(6,78,59,0.06)]">
      <div className="flex flex-col gap-4 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/90 via-white to-orange-50/70 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25"><FileText className="h-5 w-5" /></span>
          <div>
            <h2 className="text-xl font-black text-slate-950">Đăng tài liệu giảng dạy</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Hỗ trợ PDF và DOCX. File lưu trên Cloudflare R2, staff duyệt trước khi công khai.</p>
          </div>
        </div>
        <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Gửi duyệt</button>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.7fr_0.65fr_0.65fr_0.65fr]">
        <TextInput label="Tên tài liệu" value={title} onChange={setTitle} placeholder="VD: Bộ đề luyện thi Toán 12 có lời giải" />
        <ModernFormSelect label="Môn học" value={subject} onChange={setSubject} placeholder="Chọn môn học" options={subjectOptions} />
        <ModernFormSelect
          label="Chủ đề"
          value={topic}
          onChange={(val) => setTopic(val as "Đọc hiểu" | "Bài tập")}
          placeholder="Chọn chủ đề"
          options={["Đọc hiểu", "Bài tập"]}
        />
        <ModernFormSelect label="Lớp học" value={gradeLevel} onChange={setGradeLevel} placeholder="Chọn lớp học" options={gradeOptions} />
        <ModernFormSelect
          label="Loại file"
          value={selectedFileType}
          onChange={(val) => {
            setSelectedFileType(val as "PDF" | "DOCX");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          placeholder="Chọn loại file"
          options={["PDF", "DOCX"]}
        />
      </div>

      <div className="grid gap-4 border-t border-slate-100 px-5 pb-5 pt-4 lg:grid-cols-[1fr_1fr]">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex min-h-[92px] items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 px-4 text-sm font-black text-emerald-800 transition-all hover:bg-emerald-50 cursor-pointer active:scale-[0.99]"><Upload className="h-5 w-5" />{selectedFile ? selectedFile.name : `Chọn file ${selectedFileType} để gửi duyệt`}</button>
        <input ref={fileInputRef} type="file" accept={acceptedFileTypes} className="hidden" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner">
          <span className="text-xs font-extrabold text-slate-500">Mô tả ngắn</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tóm tắt nội dung, mục tiêu học tập hoặc điểm nổi bật của tài liệu..." className="mt-2 min-h-[72px] w-full resize-none bg-transparent text-sm font-semibold leading-6 text-slate-700 outline-none placeholder:text-slate-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
        {["Lưu R2", "Chờ staff duyệt", "Hỗ trợ PDF/DOCX"].map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-extrabold text-amber-800"><CheckCircle2 className="h-3.5 w-3.5" />{item}</span>)}
      </div>
    </section>
  );
}

function SelectInput({ label, value, onChange, placeholder, options }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; options: string[] }) {
  return (
    <ModernFormSelect
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
    />
  );
}
function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label><span className="text-xs font-extrabold text-slate-500">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 shadow-inner outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white" /></label>;
}
function getMaterialStatusBadge(status?: MaterialStatus) {
  if (status === "approved") return { label: "Chấp thuận", className: "border-emerald-200 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
  if (status === "rejected") return { label: "Từ chối", className: "border-rose-200 bg-rose-50 text-rose-700", dot: "bg-rose-500" };
  if (status === "hidden") return { label: "Đã ẩn", className: "border-slate-200 bg-slate-50 text-slate-600", dot: "bg-slate-400" };
  return { label: "Đã gửi", className: "border-amber-200 bg-amber-50 text-amber-700", dot: "bg-amber-500" };
}

function TeacherMaterialListCard({ item, onDeleted }: { item: TeacherMaterialCard; onDeleted: (materialId: string) => void }) {
  const statusBadge = getMaterialStatusBadge(item.status);

  const handleView = () => {
    window.open(`/materials/preview?id=${encodeURIComponent(item.id)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <article className={`group relative flex min-h-[350px] select-none flex-col justify-between overflow-hidden rounded-[26px] p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl sm:min-h-[365px] sm:rounded-[30px] ${item.bgColor}`}>
      <TeacherMaterialPattern pattern={item.pattern} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative z-10 mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[11px] font-bold uppercase tracking-wide text-white/90">edumi | {item.subject.toLowerCase()}</span>
          <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-xs">{item.fileType}</span>
        </div>
        <button type="button" onClick={() => onDeleted(item.id)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/15 text-white/80 transition-all hover:bg-rose-500 hover:text-white" title="Xóa tài liệu"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>

      <div className="relative z-10 my-auto py-2">
        <h2 className="mb-2 origin-left text-2xl font-black uppercase leading-none tracking-tight text-white drop-shadow-md transition-transform group-hover:scale-105 sm:text-3xl">{item.cardCode}</h2>
        <h3 className="mb-3 line-clamp-2 text-xs font-bold leading-snug text-white/95 drop-shadow-xs sm:text-sm">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white/90">
          <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-white" />{item.viewCount.toLocaleString("vi-VN")} lượt xem</span>
          <span className="opacity-70">|</span>
          <span className="flex items-center gap-1"><Download className="h-3 w-3 text-white" />{item.downloadCount.toLocaleString("vi-VN")} lượt tải</span>
        </div>
        {item.status === "rejected" && item.rejectReason && (
          <p className="mt-2 line-clamp-2 rounded-xl bg-white/15 px-3 py-2 text-[11px] font-bold leading-snug text-white/95 backdrop-blur-sm">
            Lý do từ chối: {item.rejectReason}
          </p>
        )}
      </div>

      <div className="relative z-10 flex items-center gap-2 pt-3">
        <span className={`inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-black shadow-sm ${statusBadge.className}`}>
          <span className={`h-2 w-2 rounded-full ${statusBadge.dot}`} />
          {statusBadge.label}
        </span>
        <button type="button" onClick={handleView} className="group/btn flex h-10 min-w-[104px] items-center justify-center gap-1 rounded-2xl bg-white px-3 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
          <Eye className={`h-3.5 w-3.5 ${item.accentColor}`} />
          Xem
          <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}
function TeacherMaterialPattern({ pattern }: { pattern: TeacherMaterialCard["pattern"] }) {
  if (pattern === "waves") {
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-25" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-50,80 Q50,20 150,100 T350,60" fill="none" stroke="white" strokeLinecap="round" strokeWidth="34" />
        <path d="M-30,220 Q70,150 170,230 T370,190" fill="none" stroke="white" strokeLinecap="round" strokeWidth="38" />
        <path d="M-40,360 Q60,300 160,370 T360,330" fill="none" stroke="white" strokeLinecap="round" strokeWidth="32" />
      </svg>
    );
  }
  if (pattern === "clouds") {
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-20,130 Q40,70 100,130 Q160,60 220,120 Q280,70 340,130 L340,-20 L-20,-20 Z" fill="white" />
        <path d="M-20,250 Q50,180 120,240 Q190,170 260,240 Q310,190 340,230 L340,-20 L-20,-20 Z" fill="white" opacity="0.6" />
      </svg>
    );
  }
  if (pattern === "confetti") {
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-25" viewBox="0 0 300 400">
        <g stroke="white" strokeLinecap="round" strokeWidth="8">
          {[30, 90, 160, 230].map((x, row) => [40, 120, 200, 280].map((y) => <line key={`${x}-${y}`} x1={x + row * 5} y1={y} x2={x + 25 + row * 5} y2={y + 25} />))}
        </g>
      </svg>
    );
  }
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 300 400">
      <g stroke="white" strokeWidth="26">
        {[-160, -80, 0, 80, 160, 240].map((y) => <line key={y} x1="-50" y1={y} x2="400" y2={y + 450} />)}
      </g>
    </svg>
  );
}
const POPULAR_SUBJECTS = [
  "Toán",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Ngữ văn",
  "Tiếng Anh",
  "Lịch sử",
  "Địa lý",
  "Tin học",
];

const AVAILABLE_GRADES = ["Lớp 10", "Lớp 11", "Lớp 12", "Ôn Thi THPT"];

const EXPERIENCE_OPTIONS = ["Dưới 1 năm", "1 - 3 năm", "3 - 5 năm", "Trên 5 năm"];

function TeacherProfileSummaryCard({
  teacher,
  subjects,
  workExperience,
}: {
  teacher: TeacherSession;
  subjects: string[];
  workExperience: string;
}) {
  const subjectsText = subjects.length ? subjects.join(", ") : "";
  const gradeLevelsText = teacher.gradeLevels?.length ? teacher.gradeLevels.join(", ") : "";
  const isVerified = Boolean(teacher.isVerifiedEducator || teacher.verificationStatus === "approved");

  // Status Badge
  const statusBadge = (() => {
    switch (teacher.verificationStatus) {
      case "pending":
        return {
          label: "Đang chờ Staff xét duyệt",
          className: "border-amber-200 bg-amber-50 text-amber-800",
          dot: "bg-amber-500",
        };
      case "approved":
        return {
          label: "Đã phê duyệt giảng dạy",
          className: "border-emerald-200 bg-emerald-50 text-emerald-800",
          dot: "bg-emerald-500",
        };
      case "rejected":
        return {
          label: "Hồ sơ bị từ chối / cần bổ sung",
          className: "border-rose-200 bg-rose-50 text-rose-800",
          dot: "bg-rose-500",
        };
      default:
        return {
          label: "Chưa gửi đơn xét duyệt",
          className: "border-slate-200 bg-slate-50 text-slate-600",
          dot: "bg-slate-400",
        };
    }
  })();

  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-100/90 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-300 lg:p-6">
      <div className="flex flex-col gap-5">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 lg:text-3xl">Hồ sơ của bạn</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              Bản xem trước hồ sơ giảng dạy hiển thị với học viên và phụ huynh trên EduMi.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black shadow-2xs ${statusBadge.className}`}
          >
            <span className="relative flex h-2 w-2">
              {teacher.verificationStatus === "pending" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${statusBadge.dot}`} />
            </span>
            {statusBadge.label}
          </span>
        </div>

        {/* Main Profile Grid: Left Preview Thumbnail + Right Details */}
        <div className="grid gap-5 lg:grid-cols-[190px_1fr] lg:items-start">
          {/* Left Preview Box with cute doodle */}
          <div className="relative mx-auto flex flex-col items-center lg:mx-0">
            <div className="pointer-events-none absolute -left-2 -top-2 z-10 text-emerald-500 opacity-80">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>

            <div className="group relative h-44 w-44 overflow-hidden rounded-[24px] border-2 border-emerald-300/80 bg-white p-1.5 shadow-[0_8px_24px_rgba(6,78,59,0.08)] ring-4 ring-emerald-50/80 transition-all hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(6,78,59,0.12)]">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[18px] bg-slate-100">
                {teacher.avatarUrl ? (
                  <Image
                    src={teacher.avatarUrl}
                    alt={teacher.fullName || "Giáo viên"}
                    fill
                    sizes="180px"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#064e3b] via-[#047857] to-[#065f46] text-white select-none shadow-inner">
                    <span className="text-6xl font-black drop-shadow-md">
                      {(teacher.fullName || "G").trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="mt-2 text-xs font-bold tracking-wide text-emerald-100">
                      {teacher.fullName || "Giáo viên"}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </div>
            </div>

            <div className="mt-4.5 flex items-center justify-center gap-1.5 -rotate-3 text-emerald-700">
              <span
                className="text-[15px] font-black italic tracking-tight text-[#047857]"
                style={{ fontFamily: "cursive, sans-serif" }}
              >
                Giảng dạy cùng EduMi! ♡
              </span>
            </div>
          </div>

          {/* Right Details Column */}
          <div className="flex min-w-0 flex-col justify-center">
            {/* Name & Badge Row */}
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-slate-950">
                {teacher.fullName ? `Thầy/Cô ${teacher.fullName}` : "Họ và tên của bạn"}
              </h2>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-black ${
                  teacher.teacherRole
                    ? "bg-emerald-100 text-emerald-800"
                    : "border border-dashed border-slate-300 bg-slate-100/80 text-slate-500"
                }`}
              >
                {teacher.teacherRole || "Chưa chọn vai trò"}
              </span>
              {isVerified && <BadgeCheck className="h-5 w-5 fill-emerald-600 text-white" />}
            </div>

            {/* Meta Subtitle Row */}
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                {subjectsText || "Chưa đăng ký môn"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                {teacher.experienceYears ? `${teacher.experienceYears} kinh nghiệm` : "Chưa cập nhật kinh nghiệm"}
              </span>
            </div>

            {/* Section 1: Giới thiệu bản thân */}
            <div className="mt-3.5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 transition-all hover:border-emerald-200/80 hover:bg-emerald-50/70">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  Giới thiệu bản thân
                </p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-600">
                  {teacher.bio ? (
                    teacher.bio
                  ) : (
                    <span className="italic text-slate-400">
                      Chưa có lời giới thiệu bản thân. Hãy viết vài dòng để học viên và phụ huynh biết thêm về bạn.
                    </span>
                  )}
                </p>
              </div>
              <Quote className="h-4 w-4 shrink-0 rotate-180 text-emerald-300/80" />
            </div>

            {/* Section 2: Kinh nghiệm làm việc */}
            <div className="mt-2.5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 transition-all hover:border-emerald-200/80 hover:bg-emerald-50/70">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  Kinh nghiệm làm việc
                </p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-600">
                  {workExperience ? (
                    workExperience
                  ) : (
                    <span className="italic text-slate-400">Chưa cập nhật quá trình kinh nghiệm công tác.</span>
                  )}
                </p>
              </div>
            </div>

            {/* 4 Pastel Metric Pills */}
            <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {/* 1. Đánh giá */}
              <div className="group rounded-2xl border border-amber-200/80 bg-amber-50/60 p-3 transition-all hover:-translate-y-0.5 hover:bg-amber-50/90 hover:shadow-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span>Đánh giá</span>
                </div>
                <p className="mt-1 text-base font-black text-slate-900">
                  {teacher.totalReviews && teacher.totalReviews > 0
                    ? teacher.ratingAvg?.toFixed(1)
                    : "Chưa có"}
                </p>
              </div>

              {/* 2. Kinh nghiệm */}
              <div className="group rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 transition-all hover:-translate-y-0.5 hover:bg-emerald-50/90 hover:shadow-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800">
                  <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Kinh nghiệm</span>
                </div>
                <p className="mt-1 text-base font-black text-slate-900">
                  {teacher.experienceYears || "Chưa chọn"}
                </p>
              </div>

              {/* 3. Chuyên môn */}
              <div className="group rounded-2xl border border-sky-200/80 bg-sky-50/60 p-3 transition-all hover:-translate-y-0.5 hover:bg-sky-50/90 hover:shadow-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-sky-800">
                  <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                  <span>Chuyên môn</span>
                </div>
                <p className="mt-1 truncate text-base font-black text-slate-900">
                  {subjectsText || "Chưa chọn"}
                </p>
              </div>

              {/* 4. Khối lớp */}
              <div className="group rounded-2xl border border-violet-200/80 bg-violet-50/60 p-3 transition-all hover:-translate-y-0.5 hover:bg-violet-50/90 hover:shadow-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-violet-800">
                  <GraduationCap className="h-3.5 w-3.5 text-violet-600" />
                  <span>Khối lớp</span>
                </div>
                <p className="mt-1 truncate text-base font-black text-slate-900">
                  {gradeLevelsText || "Chưa chọn"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeacherProfileForm({ teacher }: { teacher: TeacherSession }) {
  // 1. Form States (khởi tạo từ dữ liệu thật, nếu chưa đăng ký đơn thì để trống)
  const [teacherRole, setTeacherRole] = useState<"Gia sư" | "Giáo viên sư phạm" | null>(
    teacher.teacherRole || null
  );
  const [fullName, setFullName] = useState(teacher.fullName || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(teacher.avatarUrl || null);
  const [gender, setGender] = useState<"Nam" | "Nữ" | "Khác" | null>(teacher.gender || null);
  const [bio, setBio] = useState(teacher.bio || "");
  const [workExperience, setWorkExperience] = useState(teacher.workExperience || "");
  const [subjects, setSubjects] = useState<string[]>(teacher.subjects || []);
  const [gradeLevels, setGradeLevels] = useState<string[]>(teacher.gradeLevels || []);
  const [degree, setDegree] = useState(teacher.degree || "");
  const [experienceYears, setExperienceYears] = useState(teacher.experienceYears || "");

  // Certificate / Bằng cấp & Chứng chỉ
  const [certificateUrl, setCertificateUrl] = useState<string | null>(teacher.certificateUrl || null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(teacher.certificateFileName || null);
  const [certificateFileSize, setCertificateFileSize] = useState<number | null>(teacher.certificateFileSize || null);

  // Trạng thái hồ sơ & Upload
  const [verificationStatus, setVerificationStatus] = useState<
    "draft" | "pending" | "approved" | "rejected"
  >(teacher.verificationStatus || "draft");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCert, setIsUploadingCert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  // Dropdown states & refs cho Môn học & Khối lớp
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const gradeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubjectDropdownOpen(false);
      }
      if (
        gradeDropdownRef.current &&
        !gradeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGradeDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format dung lượng tệp
  const formatBytes = (bytes?: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Toggle môn học
  const toggleSubject = (sub: string) => {
    setSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  // Toggle khối lớp
  const toggleGrade = (grade: string) => {
    setGradeLevels((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  // Upload Avatar lên Cloudflare R2
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setActionFeedback({ type: "error", message: "Ảnh đại diện không được vượt quá 5MB." });
      return;
    }

    setIsUploadingAvatar(true);
    setActionFeedback(null);

    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          category: "avatar",
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok || !presignData.uploadUrl) {
        throw new Error(presignData.error || "Không thể tạo liên kết tải ảnh lên Cloudflare R2.");
      }

      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Lỗi khi tải tệp lên Cloudflare R2.");
      }

      const uploadedUrl = presignData.publicUrl || URL.createObjectURL(file);
      setAvatarUrl(uploadedUrl);
      setActionFeedback({ type: "success", message: "Đã tải lên ảnh đại diện thành công!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi tải lên ảnh đại diện.";
      setActionFeedback({ type: "error", message: msg });
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  // Upload Chứng chỉ / Bằng cấp lên Cloudflare R2 (Private)
  const handleCertificateFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setActionFeedback({ type: "error", message: "Tệp chứng chỉ không được vượt quá 10MB." });
      return;
    }

    setIsUploadingCert(true);
    setActionFeedback(null);

    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          category: "certificate",
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok || !presignData.uploadUrl) {
        throw new Error(presignData.error || "Không thể tạo liên kết tải chứng chỉ lên Cloudflare R2.");
      }

      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Lỗi khi tải tệp lên Cloudflare R2.");
      }

      setCertificateUrl(presignData.fileKey);
      setCertificateFileName(file.name);
      setCertificateFileSize(file.size);
      setActionFeedback({ type: "success", message: "Đã tải lên tệp chứng chỉ vào kho Cloudflare R2 an toàn!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi tải lên tệp chứng chỉ.";
      setActionFeedback({ type: "error", message: msg });
    } finally {
      setIsUploadingCert(false);
      if (certInputRef.current) certInputRef.current.value = "";
    }
  };

  // Xem trước chứng chỉ (gọi presigned download url)
  const handleViewCertificate = async () => {
    if (!certificateUrl) return;
    try {
      const res = await fetch(`/api/teacher/certificate-view?key=${encodeURIComponent(certificateUrl)}`);
      const data = await res.json();
      if (res.ok && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        setActionFeedback({ type: "error", message: data.error || "Không thể mở tệp xem trước." });
      }
    } catch {
      setActionFeedback({ type: "error", message: "Lỗi kết nối khi lấy link xem tệp." });
    }
  };

  // Xóa chứng chỉ đã chọn
  const handleRemoveCertificate = () => {
    setCertificateUrl(null);
    setCertificateFileName(null);
    setCertificateFileSize(null);
  };

  // Lưu nháp hoặc Gửi xét duyệt
  const handleSubmitProfile = async (action: "save_draft" | "submit") => {
    if (action === "submit") {
      if (!fullName.trim()) {
        setActionFeedback({ type: "error", message: "Vui lòng nhập họ và tên của bạn." });
        return;
      }
      if (!teacherRole) {
        setActionFeedback({ type: "error", message: "Vui lòng chọn vai trò giảng dạy (Gia sư hoặc Giáo viên sư phạm)." });
        return;
      }
      if (!gender) {
        setActionFeedback({ type: "error", message: "Vui lòng chọn giới tính." });
        return;
      }
      if (subjects.length === 0) {
        setActionFeedback({ type: "error", message: "Vui lòng chọn ít nhất 1 môn học đăng ký giảng dạy." });
        return;
      }
      if (gradeLevels.length === 0) {
        setActionFeedback({ type: "error", message: "Vui lòng chọn khối lớp giảng dạy." });
        return;
      }
      if (!degree.trim()) {
        setActionFeedback({ type: "error", message: "Vui lòng nhập thông tin bằng cấp chuyên môn." });
        return;
      }
      if (!experienceYears) {
        setActionFeedback({ type: "error", message: "Vui lòng chọn số năm kinh nghiệm." });
        return;
      }
      if (!certificateUrl && !certificateFileName) {
        setActionFeedback({ type: "error", message: "Vui lòng tải lên hình ảnh chứng chỉ hoặc bằng cấp để xét duyệt." });
        return;
      }
    }

    setIsSubmitting(true);
    setActionFeedback(null);

    try {
      const res = await fetch("/api/teacher/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          avatarUrl,
          gender,
          teacherRole,
          bio,
          workExperience,
          subjects,
          gradeLevels,
          degree,
          experienceYears,
          certificateUrl,
          certificateFileName,
          certificateFileSize,
          action,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu thông tin hồ sơ.");
      }

      setVerificationStatus(data.verificationStatus);
      setActionFeedback({ type: "success", message: data.message });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra khi cập nhật hồ sơ.";
      setActionFeedback({ type: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewTeacher: TeacherSession = {
    ...teacher,
    fullName: fullName || "",
    avatarUrl: avatarUrl || teacher.avatarUrl || null,
    bio,
    teacherRole: teacherRole || undefined,
    experienceYears,
    gradeLevels,
    verificationStatus,
  };

  return (
    <div className="space-y-5">
      {/* Hidden File Inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleAvatarFile}
        className="hidden"
      />
      <input
        ref={certInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        onChange={handleCertificateFile}
        className="hidden"
      />

      {/* Application Status Banner */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-2xl border p-4 transition-all shadow-xs ${
          verificationStatus === "approved"
            ? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
            : verificationStatus === "pending"
            ? "border-amber-200 bg-amber-50/90 text-amber-950"
            : verificationStatus === "rejected"
            ? "border-rose-200 bg-rose-50/90 text-rose-950"
            : "border-slate-200 bg-slate-50/90 text-slate-800"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              verificationStatus === "approved"
                ? "bg-emerald-100 text-emerald-700"
                : verificationStatus === "pending"
                ? "bg-amber-100 text-amber-700"
                : verificationStatus === "rejected"
                ? "bg-rose-100 text-rose-700"
                : "bg-slate-200/80 text-slate-700"
            }`}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                {verificationStatus === "approved"
                  ? "Hồ sơ đã được phê duyệt giảng dạy chính thức"
                  : verificationStatus === "pending"
                  ? "Đơn đăng ký đang chờ Staff EduMi xét duyệt"
                  : verificationStatus === "rejected"
                  ? "Hồ sơ bị từ chối / Cần bổ sung tài liệu"
                  : "Chưa nộp đơn đăng ký xét duyệt giáo viên"}
              </span>
              {verificationStatus !== "draft" && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    verificationStatus === "approved"
                      ? "bg-emerald-200/70 text-emerald-900"
                      : verificationStatus === "pending"
                      ? "bg-amber-200/70 text-amber-900"
                      : "bg-rose-200/70 text-rose-900"
                  }`}
                >
                  {verificationStatus === "approved"
                    ? "Đã duyệt"
                    : verificationStatus === "pending"
                    ? "Chờ duyệt"
                    : "Cần bổ sung"}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600">
              {verificationStatus === "approved"
                ? "Hồ sơ của bạn đã sẵn sàng nhận học viên và mở các lớp học trực tuyến trên nền tảng EduMi."
                : verificationStatus === "pending"
                ? "Staff EduMi đang thẩm định bằng cấp và thông tin của bạn. Chúng tôi sẽ thông báo kết quả trong vòng 24-48 giờ làm việc."
                : verificationStatus === "rejected"
                ? "Vui lòng kiểm tra lại hình ảnh bằng cấp, chứng chỉ hoặc bổ sung đầy đủ thông tin chuyên môn rồi nhấn 'Gửi xét duyệt' lại."
                : "Hồ sơ của bạn chưa được gửi đi. Vui lòng điền đầy đủ các trường thông tin bên dưới, tải lên ảnh chụp bằng cấp hoặc chứng chỉ và nhấn 'Gửi xét duyệt' để Staff kiểm tra."}
            </p>
          </div>
        </div>
      </div>

      {/* Top Preview Summary Card */}
      <TeacherProfileSummaryCard teacher={previewTeacher} subjects={subjects} workExperience={workExperience} />

      {/* Feedback Banner */}
      {actionFeedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition-all ${
            actionFeedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {actionFeedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          )}
          <p className="text-sm font-bold">{actionFeedback.message}</p>
        </div>
      )}

      <div>
        <div className="space-y-4">
          {/* Section: Chọn vai trò giảng dạy */}
          <section className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[270px_1fr_1fr]">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-emerald-700" />
                <div>
                  <h2 className="text-base font-black text-slate-950">Chọn vai trò giảng dạy của bạn</h2>
                  <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">
                    Vui lòng chọn vai trò phù hợp nhất với bạn. Bạn có thể thay đổi sau này.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTeacherRole("Gia sư")}
                className={`relative flex items-center gap-4 rounded-2xl p-3 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  teacherRole === "Gia sư"
                    ? "border-2 border-emerald-500 bg-emerald-50/70 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)]"
                    : "border border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                    teacherRole === "Gia sư"
                      ? "bg-emerald-700 text-white"
                      : "border-2 border-slate-300 bg-white"
                  }`}
                >
                  {teacherRole === "Gia sư" && <Check className="h-3 w-3" />}
                </span>
                <span className="ml-7 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100">
                  <UserRound className="h-7 w-7 text-emerald-700" />
                </span>
                <span>
                  <strong className="block text-base font-black text-slate-950">Gia sư</strong>
                  <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">
                    Có chứng chỉ, kinh nghiệm, dạy linh hoạt
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTeacherRole("Giáo viên sư phạm")}
                className={`relative flex items-center gap-4 rounded-2xl p-3 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  teacherRole === "Giáo viên sư phạm"
                    ? "border-2 border-emerald-500 bg-emerald-50/70 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)]"
                    : "border border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                    teacherRole === "Giáo viên sư phạm"
                      ? "bg-emerald-700 text-white"
                      : "border-2 border-slate-300 bg-white"
                  }`}
                >
                  {teacherRole === "Giáo viên sư phạm" && <Check className="h-3 w-3" />}
                </span>
                <span className="ml-7 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100">
                  <GraduationCap className="h-7 w-7 text-slate-700" />
                </span>
                <span>
                  <strong className="block text-base font-black text-slate-950">Giáo viên sư phạm</strong>
                  <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">
                    Có bằng cấp sư phạm, chuyên môn chính quy
                  </span>
                </span>
              </button>
            </div>
          </section>

          {/* Section: Thông tin cơ bản */}
          <section className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm">
            <SectionTitle icon={UserRound} title="Thông tin cơ bản" />
            <div className="mt-4 grid gap-5 lg:grid-cols-[150px_1fr]">
              <div className="text-center">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-4 ring-emerald-100 shadow-sm">
                  {avatarUrl || teacher.avatarUrl ? (
                    <Image
                      src={(avatarUrl || teacher.avatarUrl)!}
                      alt={fullName || "Giáo viên"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#065f46] text-white select-none">
                      <span className="text-3xl font-black drop-shadow-sm">
                        {(fullName || teacher.fullName || "G").trim().charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={isUploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                  {isUploadingAvatar ? "Đang tải lên R2..." : "Tải ảnh đại diện"}
                  <br />
                  JPG, PNG (tối đa 5MB)
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-extrabold text-slate-700">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên đầy đủ..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 shadow-inner outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700">
                    Giới tính <span className="text-rose-500">*</span>
                  </label>
                  <div className="mt-1 flex min-h-[45px] items-center gap-2 sm:gap-2.5">
                    {[
                      { id: "Nam", label: "Nam" },
                      { id: "Nữ", label: "Nữ" },
                      { id: "Khác", label: "Khác" },
                    ].map((item) => {
                      const active = gender === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setGender(item.id as "Nam" | "Nữ" | "Khác")}
                          className={`flex h-[45px] flex-1 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-extrabold transition-all cursor-pointer ${
                            active
                              ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs ring-1 ring-emerald-400"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/70"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                              active ? "border-emerald-600 bg-emerald-600" : "border-slate-300 bg-white"
                            }`}
                          >
                            {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">
                    {gender ? `Đã chọn: ${gender}` : "Vui lòng chọn giới tính"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700">
                    Giới thiệu ngắn về bản thân <span className="text-rose-500">*</span>
                  </label>
                  <div className="mt-1 flex min-h-[92px] flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold leading-5 text-slate-700 shadow-inner focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
                    <textarea
                      rows={3}
                      maxLength={300}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Giới thiệu ngắn gọn về bản thân, phong cách truyền đạt và phương pháp giảng dạy..."
                      className="w-full resize-none bg-transparent outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                    <div className="mt-1 text-right text-xs font-bold text-slate-400">{bio.length}/300</div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700">
                    Kinh nghiệm làm việc <span className="text-rose-500">*</span>
                  </label>
                  <div className="mt-1 flex min-h-[92px] flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold leading-5 text-slate-700 shadow-inner focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
                    <textarea
                      rows={3}
                      maxLength={300}
                      value={workExperience}
                      onChange={(e) => setWorkExperience(e.target.value)}
                      placeholder="Mô tả các trường, trung tâm bạn từng công tác, số học viên hoặc thành tích nổi bật..."
                      className="w-full resize-none bg-transparent outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                    <div className="mt-1 text-right text-xs font-bold text-slate-400">{workExperience.length}/300</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Chuyên môn & kinh nghiệm */}
          <section className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm">
            <SectionTitle icon={BookOpen} title="Chuyên môn & kinh nghiệm" />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* 1. Môn học đăng ký giảng dạy */}
              <div className="relative" ref={subjectDropdownRef}>
                <label className="text-xs font-extrabold text-slate-700">
                  Môn học đăng ký giảng dạy <span className="text-rose-500">*</span>
                </label>
                <div
                  onClick={() => setIsSubjectDropdownOpen((prev) => !prev)}
                  className={`mt-1 flex min-h-[46px] items-center justify-between gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm shadow-inner transition cursor-pointer ${
                    isSubjectDropdownOpen
                      ? "border-emerald-500 bg-white ring-2 ring-emerald-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                    {subjects.length > 0 ? (
                      subjects.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800 shadow-2xs"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubject(item);
                            }}
                            className="hover:text-rose-600 transition cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-medium text-slate-400 select-none">
                        -- Chọn môn học đăng ký giảng dạy --
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isSubjectDropdownOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </div>

                {/* Dropdown Options */}
                {isSubjectDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-60 overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-2 shadow-xl ring-1 ring-slate-900/5">
                    <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Chọn một hoặc nhiều môn ({subjects.length} đã chọn)
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {POPULAR_SUBJECTS.map((item) => {
                        const isSelected = subjects.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleSubject(item)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                              isSelected
                                ? "bg-emerald-50 text-emerald-900 font-extrabold"
                                : "text-slate-700 hover:bg-slate-100/80"
                            }`}
                          >
                            <span>{item}</span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-md border transition ${
                                isSelected
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <p className="mt-1.5 text-xs font-semibold text-slate-500">
                  {subjects.length > 0
                    ? `Đã chọn ${subjects.length} môn học`
                    : "Nhấp để mở danh sách môn học và chọn"}
                </p>
              </div>

              {/* 2. Khối lớp giảng dạy */}
              <div className="relative" ref={gradeDropdownRef}>
                <label className="text-xs font-extrabold text-slate-700">
                  Khối lớp giảng dạy <span className="text-rose-500">*</span>
                </label>
                <div
                  onClick={() => setIsGradeDropdownOpen((prev) => !prev)}
                  className={`mt-1 flex min-h-[46px] items-center justify-between gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm shadow-inner transition cursor-pointer ${
                    isGradeDropdownOpen
                      ? "border-emerald-500 bg-white ring-2 ring-emerald-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                    {gradeLevels.length > 0 ? (
                      gradeLevels.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800 shadow-2xs"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGrade(item);
                            }}
                            className="hover:text-rose-600 transition cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-medium text-slate-400 select-none">
                        -- Chọn khối lớp giảng dạy --
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isGradeDropdownOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </div>

                {/* Dropdown Options */}
                {isGradeDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1.5 rounded-2xl border border-emerald-100 bg-white p-2 shadow-xl ring-1 ring-slate-900/5">
                    <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Chọn khối lớp giảng dạy ({gradeLevels.length} đã chọn)
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {AVAILABLE_GRADES.map((item) => {
                        const isSelected = gradeLevels.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleGrade(item)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                              isSelected
                                ? "bg-emerald-50 text-emerald-900 font-extrabold"
                                : "text-slate-700 hover:bg-slate-100/80"
                            }`}
                          >
                            <span>{item}</span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-md border transition ${
                                isSelected
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <p className="mt-1.5 text-xs font-semibold text-slate-500">
                  {gradeLevels.length > 0
                    ? `Đã chọn: ${gradeLevels.join(", ")}`
                    : "Nhấp để mở danh sách khối lớp và chọn"}
                </p>
              </div>

              {/* 3. Bằng cấp */}
              <div>
                <label className="text-xs font-extrabold text-slate-700">
                  Bằng cấp <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="Nhập bằng cấp cao nhất (VD: Cử nhân Sư phạm Toán, Thạc sĩ, IELTS 8.0...)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm font-bold text-slate-800 shadow-inner outline-none transition placeholder:text-slate-400 placeholder:font-normal focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-emerald-700" />
                </div>
                <p className="mt-1.5 text-xs font-semibold text-slate-500">
                  Văn bằng hoặc chứng chỉ chuyên môn cao nhất của bạn
                </p>
              </div>

              {/* 4. Số năm kinh nghiệm */}
              <div>
                <ModernFormSelect
                  label="Số năm kinh nghiệm"
                  required
                  value={experienceYears}
                  onChange={setExperienceYears}
                  options={EXPERIENCE_OPTIONS}
                  placeholder="-- Chọn số năm kinh nghiệm --"
                  icon={Award}
                  helperText="Tổng thời gian giảng dạy hoặc gia sư thực tế"
                />
              </div>

              {/* 5. Hình ảnh chứng minh */}
              <div className="md:col-span-2">
                <label className="text-xs font-extrabold text-slate-700">
                  Hình ảnh chứng minh <span className="text-rose-500">*</span>
                </label>
                <div className="mt-1.5 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50/60">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-xs">
                        {isUploadingCert ? (
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                        ) : (
                          <Upload className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-900">
                          {isUploadingCert
                            ? "Đang tải tệp lên Cloudflare R2..."
                            : "Tải lên hình ảnh bằng cấp, chứng chỉ hoặc thẻ giáo viên"}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                          Định dạng hỗ trợ: PDF, JPG, PNG (tối đa 10MB) - Lưu trữ bảo mật tại Cloudflare R2
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isUploadingCert}
                      onClick={() => certInputRef.current?.click()}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-black text-white shadow-sm transition hover:bg-emerald-800 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingCert ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>{certificateFileName ? "Thay đổi tệp khác" : "Chọn tệp tải lên"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {certificateFileName ? (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="truncate text-xs font-extrabold text-slate-800">
                          {certificateFileName}
                        </span>
                        {certificateFileSize && (
                          <span className="shrink-0 text-[11px] font-bold text-slate-400">
                            ({formatBytes(certificateFileSize)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {certificateUrl && (
                          <button
                            type="button"
                            onClick={handleViewCertificate}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-700 hover:bg-slate-200 cursor-pointer transition"
                          >
                            <ExternalLink className="h-3 w-3" /> Xem
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleRemoveCertificate}
                          className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] font-extrabold text-rose-700 hover:bg-rose-100 cursor-pointer transition"
                        >
                          <Trash2 className="h-3 w-3" /> Xóa
                        </button>
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800">
                          <Check className="h-3 w-3" /> Đã tải lên R2
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2 text-center text-xs font-semibold text-slate-400">
                      Chưa có tài liệu nào được đính kèm. Vui lòng tải lên ảnh chụp bằng cấp hoặc chứng chỉ để được xét duyệt.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Action Button: Gửi xét duyệt */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isSubmitting || verificationStatus === "pending"}
              onClick={() => handleSubmitProfile("submit")}
              className={`inline-flex h-12 w-full sm:w-auto px-8 items-center justify-center gap-2 rounded-xl text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50 ${
                verificationStatus === "pending"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : verificationStatus === "pending" ? (
                <>
                  <Clock className="h-4 w-4" />
                  <span>Đang chờ Staff xét duyệt</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Gửi xét duyệt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-emerald-700" />
      <h2 className="text-base font-black text-slate-950">{title}</h2>
    </div>
  );
}

function FormField({ label, value, required }: { label: string; value: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-extrabold text-slate-700">{label} {required && <span className="text-rose-500">*</span>}</label>
      <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 shadow-inner">{value}</div>
    </div>
  );
}

function SelectBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-extrabold text-slate-700">{label} <span className="text-rose-500">*</span></label>
      <div className="mt-1 flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 shadow-inner">
        <span className="inline-flex items-center gap-2">{icon}{value}</span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">{label} ×</span>;
}

function CheckOption({ label, Icon }: { label: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-700 text-white"><Icon className="h-3.5 w-3.5" /></span>
      {label}
    </span>
  );
}

function PlaceholderPanel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white p-12 text-center shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">{desc}</p>
    </div>
  );
}

export default function TeacherProfileDashboard({ teacher, onLogout }: TeacherProfileDashboardProps) {
  const [activeTab, setActiveTab] = useState<TeacherTabId>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const teacherCode = teacher.teacherCode || teacher.studentCode || "GV-2024001";

  const content = activeTab === "overview" ? (
    <Overview teacher={teacher} />
  ) : activeTab === "teacherProfile" ? (
    <TeacherProfileForm teacher={teacher} />
  ) : activeTab === "classes" ? (
    <TeacherClassesPanel />
  ) : activeTab === "materials" ? (
    <TeacherMaterialsPanel />
  ) : (
    <PlaceholderPanel
      title={{
        classes: "Quản lý lớp giảng dạy",
        students: "Danh sách học viên",
        materials: "Kho tài liệu giảng dạy",
        grading: "Bài tập & chấm điểm",
        schedule: "Lịch dạy",
        messages: "Tin nhắn học viên",
        notifications: "Thông báo giảng dạy",
        teacherProfile: "Hồ sơ giáo viên",
        personal: "Cài đặt tài khoản",
        income: "Thu nhập",
      }[activeTab]}
      desc="Khu vực này đã được định hướng theo role giáo viên và sẽ tiếp tục được kết nối dữ liệu thật trong các bước sau."
    />
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8faf8]">
      <div className="hidden h-full shrink-0 lg:flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} teacherCode={teacherCode} />
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="relative z-10 h-full w-72">
            <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setIsMobileSidebarOpen(false); }} collapsed={false} onToggle={() => setIsMobileSidebarOpen(false)} teacherCode={teacherCode} />
          </div>
        </div>
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <Header teacher={teacher} onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} onLogout={onLogout} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">{content}</div>
        </main>
      </div>
    </div>
  );
}
