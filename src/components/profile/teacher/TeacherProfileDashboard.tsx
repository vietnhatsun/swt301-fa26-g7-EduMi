"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bell,
  BarChart3,
  BookOpen,
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
  Download,
  FileText,
  Filter,
  GraduationCap,
  FolderOpen,
  LayoutDashboard,
  HardDrive,
  LogOut,
  MapPin,
  Menu,
  Monitor,
  Pin,
  PlayCircle,
  Search,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  Star,
  Trophy,
  Sun,
  Upload,
  UserRound,
  Video,
  X,
  WalletCards,
} from "lucide-react";

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
    <aside className={`relative z-20 flex h-full flex-col justify-between bg-gradient-to-b from-[#064e3b] via-[#047857] to-[#065f46] text-white shadow-[4px_0_24px_rgba(6,78,59,0.18)] transition-all duration-300 ${collapsed ? "w-20" : "w-72"}`}>
      <div>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white">
              <Image src="/favicon.jpg" alt="EduMi" fill sizes="40px" className="object-cover" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-base font-black leading-tight">EduMi Platform</p>
                <p className="truncate text-[11px] font-semibold text-emerald-200/85">Dạy hay - Học tốt hơn</p>
              </div>
            )}
          </Link>
          <button type="button" onClick={onToggle} className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-emerald-100 hover:bg-black/30">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="space-y-5 px-3 py-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-wider text-emerald-300/85">{group.title}</p>}
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${collapsed ? "justify-center" : ""} ${isActive ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20" : "text-emerald-100/90 hover:bg-white/10 hover:text-white"}`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                      {!collapsed && item.badge && <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-black text-white">{item.badge}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/10 p-4">
        {!collapsed ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-[11px] font-semibold text-emerald-200">Giáo viên</p>
            <p className="mt-1 text-sm font-black text-white">{teacherCode}</p>
          </div>
        ) : (
          <div className="flex justify-center rounded-2xl border border-white/10 bg-black/20 p-3">
            <GraduationCap className="h-5 w-5 text-amber-300" />
          </div>
        )}
      </div>
    </aside>
  );
}

function Header({ teacher, onToggleMobileSidebar, onLogout }: { teacher: TeacherSession; onToggleMobileSidebar: () => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex max-w-xl flex-1 items-center gap-3">
        <button type="button" onClick={onToggleMobileSidebar} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-14 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" placeholder="Tìm lớp học, học viên, tài liệu, bài tập..." />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-400 sm:block">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-black text-amber-800 sm:flex">
          <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
          {teacher.ratingAvg?.toFixed(1) || "5.0"}
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-amber-500"><Sun className="h-4 w-4" /></button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600"><Bell className="h-4 w-4" /><span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white">3</span></button>
        <div className="relative">
          <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full px-1 py-1 transition hover:bg-slate-100 sm:pr-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-emerald-900 text-white">
              {teacher.avatarUrl ? <Image src={teacher.avatarUrl} alt={teacher.fullName} fill sizes="36px" className="object-cover" /> : <span className="flex h-full w-full items-center justify-center text-sm font-black">{teacher.fullName.charAt(0)}</span>}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-[150px] truncate text-sm font-black text-slate-800">{teacher.fullName}</p>
              <p className="text-[11px] font-bold text-slate-500">Giáo viên</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"><Settings className="h-4 w-4" />Cài đặt</button>
              <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Đăng xuất</button>
            </div>
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
                <span className="text-5xl font-black leading-none tracking-tight text-slate-950">{teacher.ratingAvg?.toFixed(1) || "5.0"}</span>
                <span className="pb-1 text-sm font-black text-amber-800">/ 5.0</span>
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
  subject: string;
  subjectColor: string;
  coverImage: string;
  teacher: string;
  schedule: string;
  roomName: string;
  status: TeacherClassStatus;
  statusLabel: string;
  statusColor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextSessionTime?: string;
};

const teacherClassCards: TeacherClassCard[] = [
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

function TeacherClassesPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "in_progress" | "completed">("all");

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
  const filteredClasses = teacherClassCards.filter((cls) => {
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

      <TeacherCreateClassForm />

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
          {filteredClasses.map((cls) => <TeacherClassListCard key={cls.id} cls={cls} />)}
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

function TeacherCreateClassForm() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_12px_34px_rgba(6,78,59,0.06)]">
      <div className="flex flex-col gap-4 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/90 via-white to-amber-50/70 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-950">Đăng lớp học mới</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Tạo lớp giảng dạy, thiết lập lịch học và thông tin hiển thị cho học viên.</p>
          </div>
        </div>
        <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-800">
          <Send className="h-4 w-4" />
          Đăng lớp học
        </button>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.9fr]">
        <FormControl label="Tên lớp học" value="Toán 12: Chuyên đề Hàm số VIP" />
        <FormControl label="Môn học" value="Toán học" select />
        <FormControl label="Khối lớp" value="THPT" select />
        <FormControl label="Hình thức" value="Online" select />
      </div>
      <div className="grid gap-4 border-t border-slate-100 px-5 pb-5 pt-4 lg:grid-cols-[1fr_1fr_1fr_1fr]">
        <FormControl label="Lịch học" value="Thứ 2, Thứ 5" />
        <FormControl label="Khung giờ" value="19:30 - 21:00" />
        <FormControl label="Sĩ số tối đa" value="32 học viên" />
        <FormControl label="Học phí" value="300,000 / buổi" />
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
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-black text-emerald-800 shadow-sm transition-all hover:bg-emerald-50">
          <Eye className="h-4 w-4" />
          Xem trước lớp
        </button>
      </div>
    </section>
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
    <div className="relative flex-1 sm:flex-initial">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-[42px] w-full min-w-[150px] appearance-none rounded-xl border py-2.5 pl-10 pr-9 text-sm font-semibold outline-none transition-all sm:w-auto ${value !== "all" ? "border-emerald-300 bg-emerald-50 text-emerald-900 shadow-2xs" : "border-slate-200/90 bg-slate-50/70 text-slate-700 hover:bg-white"}`}
      >
        {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">{icon}</span>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function TeacherClassListCard({ cls }: { cls: TeacherClassCard }) {
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-emerald-100/80 bg-white p-3.5 shadow-[0_4px_20px_rgba(6,78,59,0.04)] transition-all hover:shadow-[0_12px_32px_rgba(6,78,59,0.08)] sm:flex-row sm:gap-5 sm:rounded-3xl sm:p-4">
      <div className="relative h-44 min-h-[160px] w-full shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100 shadow-2xs sm:h-auto sm:min-h-[190px] sm:w-44 sm:rounded-2xl md:w-52 lg:w-56">
        <Image src={cls.coverImage} alt={cls.title} fill sizes="(max-width: 640px) 100vw, 240px" className="object-cover object-center transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute left-2.5 top-2.5 z-10">
          <span className={`rounded-full border bg-white/95 px-2.5 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-md ${cls.subjectColor}`}>{cls.subject}</span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold sm:text-[11px] ${cls.statusColor}`}>{cls.statusLabel}</span>
            <span className="truncate text-[11px] font-medium text-slate-400">{cls.roomName.split(" ").slice(0, 2).join(" ")}</span>
          </div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-800 sm:text-base">{cls.title}</h3>
          <div className="mt-2.5 space-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <UserRound className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span className="truncate font-semibold text-slate-800">{cls.teacher}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{cls.schedule}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-3 border-t border-slate-100 pt-2.5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-slate-500">Tiến độ khóa học</span>
              <span className="text-[11px] font-bold text-slate-800">{cls.completedLessons}/{cls.totalLessons} buổi ({cls.progress}%)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-600 transition-all duration-300" style={{ width: `${cls.progress}%` }} />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
            <span className="truncate text-[11px] font-medium text-slate-400">{cls.nextSessionTime ? `Lịch: ${cls.nextSessionTime}` : "Đang cập nhật"}</span>
            {cls.status === "upcoming" && (
              <div className="flex shrink-0 items-center gap-1.5">
                <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs transition-all hover:bg-emerald-100">
                  <Pin className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Vào + Ghim Note</span>
                  <span className="sm:hidden">+ Note</span>
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700">
                  <Video className="h-3.5 w-3.5" />
                  Vào lớp
                </button>
              </div>
            )}
            {cls.status === "completed" && (
              <button type="button" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200">
                <PlayCircle className="h-3.5 w-3.5 text-emerald-600" />
                Xem Record
              </button>
            )}
            {cls.status === "future" && (
              <button type="button" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100">
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                Tài liệu
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
type TeacherMaterialCard = {
  id: string;
  title: string;
  cardCode: string;
  subject: string;
  fileType: "PDF" | "DOCX" | "SLIDE";
  pages: number;
  downloads: number;
  publishedLabel: string;
  bgColor: string;
  accentColor: string;
  pattern: "waves" | "clouds" | "confetti" | "stripes";
};

const teacherMaterials: TeacherMaterialCard[] = [
  { id: "tm-01", title: "Tuyển tập 50 đề luyện thi THPT Quốc Gia môn Toán 2026 có lời giải", cardCode: "TOÁN 12", subject: "Toán học", fileType: "PDF", pages: 180, downloads: 45120, publishedLabel: "Đăng hôm nay", bgColor: "bg-[#e07328]", accentColor: "text-[#e07328]", pattern: "waves" },
  { id: "tm-02", title: "Cẩm nang Collocations & Idioms Tiếng Anh thi Đại học điểm 9+", cardCode: "IELTS 9+", subject: "Tiếng Anh", fileType: "PDF", pages: 96, downloads: 45240, publishedLabel: "Đăng hôm qua", bgColor: "bg-[#be4c73]", accentColor: "text-[#be4c73]", pattern: "clouds" },
  { id: "tm-03", title: "Sơ đồ tư duy Vật lý 12: Dao động cơ và Sóng cơ trọng tâm", cardCode: "VẬT LÝ 12", subject: "Vật lý", fileType: "PDF", pages: 72, downloads: 45360, publishedLabel: "Đăng 3 ngày trước", bgColor: "bg-[#bf5447]", accentColor: "text-[#bf5447]", pattern: "confetti" },
  { id: "tm-04", title: "Hệ thống luận điểm và mở bài kết bài Ngữ văn 12 đạt điểm cao", cardCode: "NGỮ VĂN", subject: "Ngữ văn", fileType: "DOCX", pages: 64, downloads: 45490, publishedLabel: "Đăng 1 tuần trước", bgColor: "bg-[#7356bc]", accentColor: "text-[#7356bc]", pattern: "stripes" },
  { id: "tm-05", title: "Phân dạng bài tập Este Lipit nâng cao 8+ kèm đáp án chi tiết", cardCode: "HÓA HỌC", subject: "Hóa học", fileType: "PDF", pages: 85, downloads: 38200, publishedLabel: "Đăng 2 tuần trước", bgColor: "bg-[#0d9488]", accentColor: "text-[#0d9488]", pattern: "waves" },
  { id: "tm-06", title: "Slide tổng ôn Di truyền học và Tiến hóa Sinh 12 trực quan", cardCode: "SINH HỌC", subject: "Sinh học", fileType: "SLIDE", pages: 110, downloads: 32450, publishedLabel: "Đăng 1 tháng trước", bgColor: "bg-[#0284c7]", accentColor: "text-[#0284c7]", pattern: "clouds" },
  { id: "tm-07", title: "Niên biểu Lịch sử Việt Nam 1919 - 1975 dễ nhớ theo mốc", cardCode: "LỊCH SỬ", subject: "Lịch sử", fileType: "PDF", pages: 58, downloads: 29800, publishedLabel: "Đăng 1 tháng trước", bgColor: "bg-[#b45309]", accentColor: "text-[#b45309]", pattern: "confetti" },
  { id: "tm-08", title: "Kỹ năng khai thác Atlat Địa lý Việt Nam đạt điểm tối đa", cardCode: "ĐỊA LÝ 12", subject: "Địa lý", fileType: "PDF", pages: 92, downloads: 31200, publishedLabel: "Đăng 1 tháng trước", bgColor: "bg-[#4f46e5]", accentColor: "text-[#4f46e5]", pattern: "stripes" },
];

function TeacherMaterialsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTime, setSelectedTime] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

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
  const filteredMaterials = teacherMaterials.filter((item) => {
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

  return (
    <div className="space-y-5">
      <section className="relative h-[170px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b5a43] via-[#07966c] to-[#08a777] px-6 py-8 shadow-[0_14px_36px_rgba(6,78,59,0.15)] sm:h-[180px] sm:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <span className="absolute left-[24%] top-[18%] h-6 w-6 rounded-full border border-white/30 bg-white/15 shadow-[0_0_18px_rgba(255,255,255,0.25)]" />
          <span className="absolute left-[52%] top-[28%] h-5 w-5 rounded-full border border-white/25 bg-white/10" />
          <span className="absolute left-[72%] top-[14%] h-8 w-8 rounded-full border border-white/30 bg-white/15" />
          <span className="absolute left-[60%] top-[21%] text-3xl text-amber-200">✦</span>
          <span className="absolute left-[69%] bottom-[28%] text-xl text-emerald-100">✦</span>
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-200/90">Tài liệu · Kho giảng dạy</p>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Khám phá tài liệu của bạn</h1>
          <p className="text-sm font-semibold text-emerald-100 sm:text-base">Quản lý học liệu đã đăng, xem lượt tải và chia sẻ tài nguyên học tập.</p>
        </div>
        <div className="absolute bottom-0 right-0 top-0 w-52 overflow-hidden sm:w-72 md:w-96">
          <Image src="/classes/banner-classes.jpg" alt="EduMi tài liệu" fill priority sizes="(max-width: 640px) 220px, 390px" className="object-cover object-right [mask-image:linear-gradient(to_left,black_65%,transparent)]" />
        </div>
      </section>

      <TeacherUploadMaterialForm />

      <section className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] sm:rounded-3xl sm:p-4">
        <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm tài liệu, môn học, bộ đề..."
              className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 pl-9.5 pr-9 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
            <FilterSelect icon={<Clock className="h-3.5 w-3.5 text-emerald-600" />} value={selectedTime} options={timeOptions} onChange={setSelectedTime} />
            <FilterSelect icon={<BookOpen className="h-3.5 w-3.5 text-emerald-600" />} value={selectedSubject} options={subjectOptions} onChange={setSelectedSubject} />
            {isFiltered && (
              <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2.5 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100">
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col justify-between gap-3 px-1 text-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <FolderOpen className="h-4 w-4 text-emerald-600" />
            <span>Đang hiển thị <strong className="text-slate-900">{filteredMaterials.length}</strong> tài liệu đã đăng</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <HardDrive className="h-3.5 w-3.5 text-slate-400" />
            Kho tài liệu giảng dạy EduMi
          </span>
        </div>
        <span className="text-[11px] italic text-slate-400">Tài liệu hiển thị trong hồ sơ giáo viên và kho học liệu chung</span>
      </div>

      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {filteredMaterials.map((item) => <TeacherMaterialListCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Search className="h-7 w-7 text-emerald-600" />
          </div>
          <div className="mx-auto max-w-md space-y-1">
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy tài liệu phù hợp</h3>
            <p className="text-sm text-slate-500">Không có tài liệu nào khớp với từ khóa hoặc bộ lọc bạn đang chọn.</p>
          </div>
          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-700">
            <RotateCcw className="h-3.5 w-3.5" />
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}

function TeacherUploadMaterialForm() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_12px_34px_rgba(6,78,59,0.06)]">
      <div className="flex flex-col gap-4 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/90 via-white to-orange-50/70 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-950">Đăng tài liệu giảng dạy</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Tải học liệu lên kho EduMi và gắn thông tin để học viên tìm thấy nhanh hơn.</p>
          </div>
        </div>
        <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-800">
          <Upload className="h-4 w-4" />
          Đăng tài liệu
        </button>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1.3fr_0.75fr_0.75fr_0.8fr]">
        <FormControl label="Tên tài liệu" value="Bộ đề Toán 12 luyện thi 2026" />
        <FormControl label="Môn học" value="Toán học" select />
        <FormControl label="Loại file" value="PDF" select />
        <FormControl label="Quyền xem" value="Công khai" select />
      </div>
      <div className="grid gap-4 border-t border-slate-100 px-5 pb-5 pt-4 lg:grid-cols-[1fr_1fr]">
        <button type="button" className="flex min-h-[92px] items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 px-4 text-sm font-black text-emerald-800 transition-all hover:bg-emerald-50">
          <Upload className="h-5 w-5" />
          Kéo thả hoặc chọn file PDF, DOCX, SLIDE
        </button>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner">
          <span className="text-xs font-extrabold text-slate-500">Mô tả ngắn</span>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">Tài liệu tổng hợp dạng bài trọng tâm, có lời giải chi tiết và gợi ý phương pháp học hiệu quả.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
        {["Hiển thị trên hồ sơ", "Cho phép tải về", "Gợi ý cho học viên phù hợp"].map((item) => (
          <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-extrabold text-amber-800">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
function TeacherMaterialListCard({ item }: { item: TeacherMaterialCard }) {
  return (
    <article className={`group relative flex min-h-[350px] select-none flex-col justify-between overflow-hidden rounded-[26px] p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl sm:min-h-[365px] sm:rounded-[30px] ${item.bgColor}`}>
      <TeacherMaterialPattern pattern={item.pattern} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative z-10 mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[11px] font-bold uppercase tracking-wide text-white/90">edumi | {item.subject.toLowerCase()}</span>
          <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-xs">{item.fileType}</span>
        </div>
        <button type="button" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/15 text-white/80 transition-all hover:bg-amber-400 hover:text-white" title="Đánh dấu nổi bật">
          <Star className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative z-10 my-auto py-2">
        <h2 className="mb-2 origin-left text-2xl font-black uppercase leading-none tracking-tight text-white drop-shadow-md transition-transform group-hover:scale-105 sm:text-3xl">{item.cardCode}</h2>
        <h3 className="mb-3 line-clamp-2 text-xs font-bold leading-snug text-white/95 drop-shadow-xs sm:text-sm">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white/90">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-white text-white" />{item.downloads.toLocaleString("vi-VN")} lượt xem</span>
          <span className="opacity-70">|</span>
          <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-white/90" />{item.pages} trang</span>
        </div>
        <p className="mt-2 text-[11px] font-semibold text-white/75">{item.publishedLabel}</p>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 pt-3">
        <button type="button" className="group/btn flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
          <Eye className={`h-3.5 w-3.5 ${item.accentColor}`} />
          Xem
          <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
        <button type="button" className="group/btn flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
          <Download className={`h-3.5 w-3.5 ${item.accentColor}`} />
          Tải về
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
function TeacherProfileForm({ teacher }: { teacher: TeacherSession }) {
  const subjects = teacher.subjects?.length ? teacher.subjects.slice(0, 3) : ["Toán", "Vật lý", "Tiếng Anh"];
  const styles = [
    { label: "Tận tâm", active: true },
    { label: "Dễ hiểu", active: true },
    { label: "Luyện thi", active: true },
    { label: "Sáng tạo", active: false },
    { label: "Kiên nhẫn", active: false },
    { label: "Tương tác tốt", active: true },
    { label: "Truyền động lực", active: false },
  ];

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[28px] border border-emerald-200 bg-gradient-to-r from-white via-emerald-50/70 to-white p-6 shadow-[0_16px_40px_rgba(15,118,110,0.08)] lg:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_12%_80%,rgba(254,240,138,0.24),transparent_28%)]" />
        <div className="relative z-10 grid items-center gap-5 lg:grid-cols-[1fr_420px_170px]">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-700 lg:hidden">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Đang hoàn thiện hồ sơ
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">Hồ sơ giáo viên</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600 lg:text-base">
              Tạo hồ sơ giảng dạy để học viên dễ dàng tìm thấy bạn trên EduMi. Đây là CV trực tuyến thể hiện kinh nghiệm, chuyên môn và phong cách giảng dạy của bạn.
            </p>
          </div>

          <div className="relative hidden min-h-[98px] items-center justify-end lg:flex">
            <div className="absolute left-0 top-0 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-extrabold text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Đang hoàn thiện hồ sơ
            </div>
            <div className="absolute right-28 top-0 rotate-[-6deg] text-center font-handwriting text-lg font-bold leading-6 text-emerald-800/80">
              Chia sẻ<br />tri thức<br />Kiến tạo<br />tương lai
            </div>
            <Image src="/banner-mascot.png" alt="EduMi mascot" width={150} height={110} className="absolute bottom-[-18px] right-[175px] h-[120px] w-auto object-contain" />
            <span className="absolute bottom-2 right-[330px] text-2xl text-amber-400">✦</span>
            <span className="absolute right-[118px] top-8 text-xl text-amber-400">✦</span>
          </div>

          <button className="relative z-10 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-500/60 bg-white px-5 text-sm font-black text-emerald-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Eye className="h-4 w-4" />
            Xem trước CV
          </button>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-4">
          <section className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[270px_1fr_1fr]">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-emerald-700" />
                <div>
                  <h2 className="text-base font-black text-slate-950">Chọn vai trò giảng dạy của bạn</h2>
                  <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">Vui lòng chọn vai trò phù hợp nhất với bạn. Bạn có thể thay đổi sau này.</p>
                </div>
              </div>
              <button className="relative flex items-center gap-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 p-3 text-left shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)]">
                <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white"><Check className="h-3 w-3" /></span>
                <span className="ml-7 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100">
                  <UserRound className="h-7 w-7 text-emerald-700" />
                </span>
                <span>
                  <strong className="block text-base font-black text-slate-950">Gia sư</strong>
                  <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">Có chứng chỉ, kinh nghiệm, dạy linh hoạt</span>
                </span>
              </button>
              <button className="relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 text-left">
                <span className="absolute left-3 top-3 h-5 w-5 rounded-full border-2 border-slate-300 bg-white" />
                <span className="ml-7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <GraduationCap className="h-7 w-7 text-slate-700" />
                </span>
                <span>
                  <strong className="block text-base font-black text-slate-950">Giáo viên sư phạm</strong>
                  <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">Có bằng cấp sư phạm, chuyên môn chính quy</span>
                </span>
              </button>
            </div>
          </section>

          <section className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm">
            <SectionTitle icon={UserRound} title="Thông tin cơ bản" />
            <div className="mt-4 grid gap-5 lg:grid-cols-[150px_1fr_1fr]">
              <div className="text-center">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-emerald-50 ring-4 ring-emerald-100">
                  <Image src={teacher.avatarUrl || "/cv-teacher.png"} alt={teacher.fullName} fill className="object-cover" />
                  <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">Tải ảnh đại diện<br />JPG, PNG (tối đa 5MB)</p>
              </div>
              <div className="space-y-3">
                <FormField label="Họ và tên" required value={teacher.fullName} />
                <div>
                  <label className="text-xs font-extrabold text-slate-700">Giới thiệu ngắn về bản thân <span className="text-rose-500">*</span></label>
                  <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold leading-5 text-slate-700 shadow-inner">
                    Tôi là giáo viên Toán với hơn 3 năm kinh nghiệm, yêu thích việc đồng hành cùng học sinh chinh phục mục tiêu học tập.
                    <div className="mt-1 text-right text-xs font-bold text-slate-400">108/300</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-slate-700">Môn giảng dạy <span className="text-rose-500">*</span></label>
                <div className="mt-1 flex min-h-[45px] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-inner">
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => <Chip key={subject} label={subject} />)}
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">Chọn một hoặc nhiều môn bạn có thể giảng dạy</p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm">
            <SectionTitle icon={BookOpen} title="Chuyên môn & kinh nghiệm" />
            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.55fr_1fr_1.25fr]">
              <SelectBox label="Số năm kinh nghiệm" value="3 - 5 năm" />
              <div>
                <label className="text-xs font-extrabold text-slate-700">Khối lớp giảng dạy <span className="text-rose-500">*</span></label>
                <div className="mt-1 flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-inner">
                  <div className="flex flex-wrap gap-2">{["Tiểu học", "THCS", "THPT"].map((item) => <Chip key={item} label={item} />)}</div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-slate-700">Hình thức dạy <span className="text-rose-500">*</span></label>
                <div className="mt-3 flex gap-4">
                  {[
                    { label: "Online", icon: Monitor },
                    { label: "Offline", icon: CheckCircle2 },
                  ].map((item) => <CheckOption key={item.label} label={item.label} Icon={item.icon} />)}
                </div>
              </div>
              <SelectBox label="Khu vực giảng dạy" value="Hà Nội" icon={<MapPin className="h-4 w-4 text-slate-500" />} />
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
              <SectionTitle icon={FileText} title="Chứng chỉ / bằng cấp" />
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.25fr]">
                <SelectBox label="Loại hồ sơ" value="Chứng chỉ & bằng cấp khác" />
                <button className="mt-5 flex min-h-[48px] items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-500">
                  <Upload className="h-5 w-5" />
                  <span>Tải lên chứng chỉ / bằng cấp<br className="hidden sm:block" /><span className="text-xs"> PDF, JPG, PNG (tối đa 10MB)</span></span>
                </button>
              </div>
            </section>
            <section className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
              <SectionTitle icon={WalletCards} title="Mức học phí & lịch dạy" />
              <div className="mt-4 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <label className="text-xs font-extrabold text-slate-700">Học phí (VND/giờ) <span className="text-rose-500">*</span></label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 shadow-inner">150,000</span>
                    <span className="text-slate-400">-</span>
                    <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 shadow-inner">300,000</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-700">Lịch trống trong tuần <span className="text-rose-500">*</span></label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => <span key={day} className={`rounded-lg px-3 py-2 text-xs font-black ${[0, 1, 3, 4].includes(index) ? "bg-emerald-700 text-white" : "bg-slate-50 text-slate-700 ring-1 ring-slate-200"}`}>{day}</span>)}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm">
            <SectionTitle icon={BadgeCheck} title="Phong cách giảng dạy" />
            <p className="mt-1 text-xs font-semibold text-slate-500">Chọn những phong cách thể hiện đúng nhất về bạn (có thể chọn nhiều)</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {styles.map((style) => (
                <button key={style.label} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-extrabold ${style.active ? "border-emerald-700 bg-emerald-700 text-white shadow-sm" : "border-slate-200 bg-white text-slate-500"}`}>
                  {style.active && <Check className="h-4 w-4" />}
                  {style.label}
                </button>
              ))}
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-white text-sm font-black text-emerald-800 shadow-sm">
              <FileText className="h-4 w-4" />
              Lưu nháp
            </button>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-black text-white shadow-lg shadow-emerald-700/20">
              <Send className="h-4 w-4" />
              Gửi xét duyệt
            </button>
          </div>
        </div>

        <TeacherProfilePreview teacher={teacher} subjects={subjects} />
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

function TeacherProfilePreview({ teacher, subjects }: { teacher: TeacherSession; subjects: string[] }) {
  return (
    <aside className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-4 xl:self-start">
      <div className="flex items-start gap-3">
        <Eye className="mt-1 h-5 w-5 text-emerald-700" />
        <div>
          <h2 className="text-lg font-black text-slate-950">Xem trước hồ sơ</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">Đây là giao diện hồ sơ của bạn hiển thị với học viên trên EduMi.</p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <div className="relative min-h-[150px] bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-5 text-center">
          <p className="absolute left-5 top-8 max-w-[110px] rotate-[-8deg] text-sm font-bold leading-5 text-emerald-900/75">Mỗi học sinh đều có cách tỏa sáng riêng của mình</p>
          <div className="relative mx-auto mt-2 h-24 w-24 overflow-hidden rounded-full bg-white ring-4 ring-white shadow-lg">
            <Image src={teacher.avatarUrl || "/cv-teacher.png"} alt={teacher.fullName} fill className="object-cover" />
          </div>
          <span className="absolute left-[54%] top-[102px] h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
          <GraduationCap className="absolute right-8 top-8 h-9 w-9 rotate-12 text-slate-800" />
          <BookOpen className="absolute bottom-8 right-10 h-9 w-9 text-slate-700" />
        </div>
        <div className="p-5 text-center">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-black text-slate-950">Thầy {teacher.fullName}</h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">Gia sư</span>
            <BadgeCheck className="h-5 w-5 fill-emerald-600 text-white" />
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {subjects.map((subject) => <span key={subject} className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800">{subject}</span>)}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />5.0 (24 đánh giá)</span>
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />3+ năm KN</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />Hà Nội</span>
            <span className="inline-flex items-center gap-1"><Monitor className="h-4 w-4" />Dạy online</span>
          </div>
          <p className="mt-4 text-left text-sm font-semibold leading-6 text-slate-600">
            Tôi là giáo viên Toán với hơn 3 năm kinh nghiệm, yêu thích việc đồng hành cùng học sinh phục mục tiêu học tập. Luôn hướng đến phương pháp giảng dạy dễ hiểu, thực tế và truyền cảm hứng cho học sinh.
          </p>
          <PreviewInfo icon={GraduationCap} title="Kinh nghiệm nổi bật" items={["Hơn 3 năm kinh nghiệm giảng dạy Toán THCS, THPT", "Từng kèm 50+ học sinh đạt điểm 8.0+ trong kỳ thi", "Có kinh nghiệm luyện thi vào 10 và tốt nghiệp THPT"]} />
          <PreviewInfo icon={FileText} title="Chứng chỉ / bằng cấp" items={["Cử nhân Sư phạm Toán - ĐH Sư phạm Hà Nội", "Chứng chỉ IELTS 7.5", "Chứng chỉ nghiệp vụ sư phạm"]} />
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 shadow-sm">
            <GraduationCap className="h-4 w-4" />
            Đăng ký giảng dạy cùng EduMi
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function PreviewInfo({ icon: Icon, title, items }: { icon: React.ComponentType<{ className?: string }>; title: string; items: string[] }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left">
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Icon className="h-5 w-5" /></span>
        <div>
          <h4 className="text-sm font-black text-slate-950">{title}</h4>
          <ul className="mt-1 space-y-1 text-xs font-semibold leading-5 text-slate-600">
            {items.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </div>
    </div>
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
        <Header teacher={teacher} onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">{content}</div>
        </main>
      </div>
    </div>
  );
}
