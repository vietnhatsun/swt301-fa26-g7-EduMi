"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle,
  Download,
  ChevronDown,
  ChevronLeft,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  Star,
  Sun,
  UsersRound,
  WalletCards,
  XCircle,
  Eye,
  ShieldAlert,
  X,
  ExternalLink,
  Check,
} from "lucide-react";
import TeacherApprovalPanel from "./TeacherApprovalPanel";

export interface StaffUserItem {
  id: string;
  name: string;
  code?: string | null;
  role: string;
  rawRole: string;
  email: string;
  phone: string;
  status: string;
  time: string;
  tone: string;
  avatar: string;
  avatarUrl: string | null;
}

type StaffTabId =
  | "overview"
  | "users"
  | "classes"
  | "materials"
  | "teachers"
  | "materialPosts"
  | "examPosts"
  | "withdrawals"
;

export interface StaffSession {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  studentCode?: string;
  staffCode?: string;
  gradeLevel?: string;
  phoneNumber?: string;
  ratingAvg?: number;
}

interface StaffProfileDashboardProps {
  staff: StaffSession;
  onLogout: () => void;
}

const navGroups: { title: string; items: { id: StaffTabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] }[] = [
  {
    title: "Quản trị",
    items: [
      { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
      { id: "users", label: "Quản lý người dùng", icon: UsersRound },
      { id: "classes", label: "Quản lý lớp học", icon: GraduationCap },
      { id: "materials", label: "Quản lý tài liệu", icon: BookOpen },
      { id: "teachers", label: "Duyệt giáo viên", icon: ShieldCheck, badge: "12" },
      { id: "withdrawals", label: "Duyệt rút tiền", icon: WalletCards, badge: "6" },
    ],
  },
  {
    title: "Đăng tải",
    items: [
      { id: "materialPosts", label: "Đăng tài liệu", icon: BookOpen },
      { id: "examPosts", label: "Đăng bài thi", icon: FileText },
    ],
  },
];

const stats = [
  { icon: UsersRound, value: "1,284", label: "Tổng người dùng", hint: "+12% so với tuần trước", tone: "emerald" },
  { icon: GraduationCap, value: "256", label: "Giáo viên", hint: "+8% so với tuần trước", tone: "amber" },
  { icon: BookOpen, value: "892", label: "Lớp học", hint: "+15% so với tuần trước", tone: "blue" },
  { icon: FileText, value: "1,320", label: "Tài liệu", hint: "+20% so với tuần trước", tone: "rose" },
];


const actionItems: {
  label: string;
  count: string;
  tone: string;
  icon: React.ComponentType<{ className?: string }>;
  tab?: StaffTabId;
}[] = [
  { label: "Hồ sơ giáo viên chờ duyệt", count: "12", tone: "amber", icon: GraduationCap, tab: "teachers" },
  { label: "Tài liệu chờ kiểm duyệt", count: "8", tone: "rose", icon: FileText, tab: "materials" },
  { label: "Báo cáo vi phạm", count: "3", tone: "red", icon: Bell },
];

function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggle,
  pendingCount = 0,
}: {
  activeTab: StaffTabId;
  onTabChange: (tab: StaffTabId) => void;
  collapsed: boolean;
  onToggle: () => void;
  pendingCount?: number;
}) {
  return (
    <aside className={`relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#00563f] via-[#087b58] to-[#02845f] text-white shadow-2xl transition-all duration-300 ${collapsed ? "w-22" : "w-72"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_8%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_70%_65%,rgba(255,214,79,0.10),transparent_34%)]" />
      <div className="relative z-10 flex h-20 items-center justify-between border-b border-white/10 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border-2 border-white/70 bg-white shadow-sm">
            <Image src="/banner-mascot.png" alt="EduMi" fill sizes="48px" className="object-cover" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="truncate text-xl font-black leading-tight">EduMi Platform</h2>
              <p className="text-xs font-bold text-emerald-100">Dạy hay - Học tốt hơn</p>
            </div>
          )}
        </div>
        <button onClick={onToggle} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/10 text-white transition-all hover:bg-white/10">
          <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="relative z-10 flex-1 space-y-6 overflow-hidden px-3 py-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && <p className="mb-3 px-3 text-xs font-black uppercase tracking-wider text-emerald-200/80">{group.title}</p>}
            <div className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const badge =
                  item.id === "teachers"
                    ? pendingCount > 0
                      ? String(pendingCount)
                      : undefined
                    : item.badge;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${isActive ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25" : "text-emerald-50 hover:bg-white/10"}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="flex-1 text-sm font-black">{item.label}</span>}
                    {!collapsed && badge && (
                      <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-black text-white">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>


    </aside>
  );
}

function Header({ staff, onToggleMobileSidebar, onLogout }: { staff: StaffSession; onToggleMobileSidebar: () => void; onLogout: () => void }) {
  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl lg:px-7">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button onClick={onToggleMobileSidebar} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden w-full max-w-[640px] sm:block">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-16 text-sm font-semibold outline-none transition-all placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder="Tìm lớp học, học viên, giáo viên, tài liệu..." />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-400">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden h-11 items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-sm font-black text-amber-700 shadow-sm sm:flex">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {staff.ratingAvg?.toFixed(1) || "5.0"}
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-amber-500 shadow-sm"><Sun className="h-5 w-5" /></button>
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">3</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-emerald-800 text-white ring-4 ring-emerald-50">
            {staff.avatarUrl ? <Image src={staff.avatarUrl} alt={staff.fullName} fill sizes="44px" className="object-cover" /> : <span className="flex h-full w-full items-center justify-center text-base font-black">S</span>}
          </div>
          <div className="hidden sm:block">
            <p className="max-w-[150px] truncate text-sm font-black text-slate-800">{staff.fullName}</p>
            <p className="text-xs font-bold text-slate-500">Nhân viên</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </div>
        <button onClick={onLogout} className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 lg:flex" title="Đăng xuất">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function StatCard({ icon: Icon, value, label, hint, tone }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string; hint: string; tone: string }) {
  const styles = {
    emerald: "border-emerald-100 bg-emerald-50/50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50/70 text-amber-600",
    blue: "border-blue-100 bg-blue-50/70 text-blue-600",
    rose: "border-rose-100 bg-rose-50/70 text-rose-600",
  }[tone] || "border-emerald-100 bg-emerald-50/50 text-emerald-700";

  return (
    <div className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${styles}`}>
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/75 shadow-sm"><Icon className="h-7 w-7" /></span>
        <div>
          <p className="text-3xl font-black leading-none text-slate-950">{value}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-sm font-black text-emerald-700">↑ {hint}</p>
        </div>
      </div>
      <div className="absolute bottom-4 right-5 flex items-end gap-1 opacity-25">
        {[18, 28, 40, 54, 72].map((height) => <span key={height} className="w-2 rounded-full bg-current" style={{ height }} />)}
      </div>
    </div>
  );
}

function Overview({
  onNavigate,
  statsData,
  pendingCount = 0,
}: {
  onNavigate?: (tab: StaffTabId) => void;
  statsData?: { totalUsers: number; totalTeachers: number; pendingTeacherApplications: number };
  pendingCount?: number;
}) {
  const dynamicStats = [
    {
      icon: UsersRound,
      value: statsData?.totalUsers !== undefined ? statsData.totalUsers.toLocaleString("vi-VN") : "...",
      label: "Tổng người dùng",
      hint: "Dữ liệu người dùng hệ thống",
      tone: "emerald",
    },
    {
      icon: GraduationCap,
      value: statsData?.totalTeachers !== undefined ? statsData.totalTeachers.toLocaleString("vi-VN") : "...",
      label: "Giáo viên",
      hint: "Giảng viên chính thức",
      tone: "amber",
    },
    { icon: BookOpen, value: "892", label: "Lớp học", hint: "+15% so với tuần trước", tone: "blue" },
    { icon: FileText, value: "1,320", label: "Tài liệu", hint: "+20% so với tuần trước", tone: "rose" },
  ];

  const dynamicActionItems: {
    label: string;
    count: string;
    tone: string;
    icon: React.ComponentType<{ className?: string }>;
    tab?: StaffTabId;
  }[] = [
    {
      label: "Hồ sơ giáo viên chờ duyệt",
      count: String(pendingCount),
      tone: "amber",
      icon: GraduationCap,
      tab: "teachers",
    },
    { label: "Tài liệu chờ kiểm duyệt", count: "8", tone: "rose", icon: FileText, tab: "materials" },
    { label: "Báo cáo vi phạm", count: "3", tone: "red", icon: Bell },
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dynamicStats.map((item) => <StatCard key={item.label} {...item} />)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="h-[330px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><FileText className="h-5 w-5" /></span>
              <div>
                <h2 className="text-2xl font-black text-slate-950">Bài thi hệ thống</h2>
                <p className="text-sm font-bold text-slate-500">Số bài thi được đăng trong 7 ngày</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm font-black text-emerald-700">Xem tất cả <ArrowRight className="h-4 w-4" /></button>
          </div>
          <svg viewBox="0 0 620 210" className="h-[230px] w-full overflow-visible" role="img" aria-label="Bài thi hệ thống">
            <defs>
              <linearGradient id="staffExamBars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>
            <g stroke="#e2e8f0" strokeDasharray="4 8" strokeWidth="1">
              {[38, 78, 118, 158].map((y) => <line key={y} x1="45" y1={y} x2="590" y2={y} />)}
            </g>
            {[72, 146, 220, 294, 368, 442, 516].map((x, i) => {
              const heights = [74, 112, 90, 132, 104, 146, 118];
              const h = heights[i];
              const y = 178 - h;
              return (
                <g key={x}>
                  <rect x={x} y={y} width="38" height={h} rx="15" fill="url(#staffExamBars)" />
                  <text x={x + 19} y={y - 10} textAnchor="middle" className="fill-emerald-700 text-[14px] font-black">{[8, 12, 10, 15, 11, 18, 14][i]}</text>
                </g>
              );
            })}
            <line x1="45" y1="178" x2="590" y2="178" stroke="#cbd5e1" strokeWidth="1.5" />
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => <text key={day} x={91 + i * 74} y="202" textAnchor="middle" className="fill-slate-400 text-[13px] font-black">{day}</text>)}
          </svg>
        </div>
        <div>
          <div className="h-[330px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <BarChart3 className="mt-1 h-7 w-7 text-emerald-700" />
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Tải xử lý trong tuần</h2>
                </div>
              </div>
              <button className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600">7 ngày qua</button>
            </div>
            <div className="mb-2 flex flex-wrap gap-2 text-[11px] font-black text-slate-500">
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Duyệt giáo viên</span>
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1"><i className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Duyệt tài liệu</span>
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1"><i className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Rút tiền</span>
            </div>
            <svg viewBox="0 0 520 150" className="h-[145px] w-full overflow-visible" role="img" aria-label="Tải xử lý trong tuần">
              <g stroke="#e2e8f0" strokeDasharray="4 8" strokeWidth="1">
                {[28, 58, 88, 118].map((y) => <line key={y} x1="35" y1={y} x2="500" y2={y} />)}
              </g>
              <path d="M35 98 L112 62 L189 92 L266 104 L343 60 L420 44 L500 78" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="4" />
              <path d="M35 112 L112 82 L189 108 L266 120 L343 86 L420 76 L500 102" fill="none" stroke="#3b82f6" strokeLinecap="round" strokeWidth="4" />
              <path d="M35 122 L112 94 L189 116 L266 126 L343 92 L420 84 L500 108" fill="none" stroke="#fbbf24" strokeLinecap="round" strokeWidth="4" />
              {["01/08", "02/08", "03/08", "04/08", "05/08", "06/08", "07/08"].map((day, i) => <text key={day} x={35 + i * 77} y="145" textAnchor="middle" className="fill-slate-400 text-[11px] font-bold">{day}</text>)}
            </svg>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
              <span className="rounded-2xl bg-emerald-50 px-2 py-2 text-emerald-700">42 hồ sơ</span>
              <span className="rounded-2xl bg-blue-50 px-2 py-2 text-blue-700">68 tài liệu</span>
              <span className="rounded-2xl bg-amber-50 px-2 py-2 text-amber-700">19 đơn rút</span>
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2"><Star className="h-6 w-6 fill-amber-400 text-amber-400" /><h2 className="text-xl font-black text-slate-950">Cần xử lý</h2></div>
          <button className="flex items-center gap-1 text-sm font-black text-emerald-700">Xem tất cả <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {dynamicActionItems.map((item) => {
            const Icon = item.icon;
            const tone = item.tone === "amber" ? "bg-amber-100 text-amber-700 border-amber-200" : item.tone === "rose" ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-red-100 text-red-700 border-red-200";
            const desc = item.tone === "amber" ? "Hồ sơ mới cần xác minh" : item.tone === "rose" ? "Tài nguyên chờ kiểm duyệt" : "Báo cáo cần phản hồi";
            return (
              <div
                key={item.label}
                onClick={() => item.tab && onNavigate?.(item.tab)}
                className={`min-h-[128px] rounded-3xl border border-slate-100 bg-slate-50 p-4 shadow-sm transition-all ${
                  item.tab ? "cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-md" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tone}`}><Icon className="h-6 w-6" /></span>
                  <span className="rounded-2xl bg-white px-4 py-1.5 text-xl font-black text-rose-500 shadow-sm">{item.count}</span>
                </div>
                <h3 className="mt-4 text-base font-black text-slate-900">{item.label}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function UserManagementPanel({
  users = [],
  isLoading = false,
  onRefresh,
  currentStaffId,
}: {
  users?: StaffUserItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
  currentStaffId?: string;
}) {
  const [localUsers, setLocalUsers] = useState<StaffUserItem[]>(users);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tất cả vai trò");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");

  // Modal Xem chi tiết
  const [viewingUser, setViewingUser] = useState<StaffUserItem | null>(null);
  const [viewingDetail, setViewingDetail] = useState<{
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string | null;
    role: string;
    status: string;
    is_verified: boolean;
    created_at: string;
    profile?: Record<string, unknown> | null;
  } | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Modal Khóa / Mở khóa
  const [targetBanUser, setTargetBanUser] = useState<StaffUserItem | null>(null);
  const [isProcessingBan, setIsProcessingBan] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const filteredUsers = useMemo(() => {
    return localUsers.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesCode = u.code ? u.code.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesEmail && !matchesCode) return false;
      }
      if (selectedRole !== "Tất cả vai trò" && u.role !== selectedRole) {
        return false;
      }
      if (selectedStatus !== "Tất cả trạng thái" && u.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [localUsers, searchQuery, selectedRole, selectedStatus]);

  // Mở modal xem chi tiết người dùng
  const handleOpenViewUser = async (user: StaffUserItem) => {
    setViewingUser(user);
    setViewingDetail(null);
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/staff/users?id=${user.id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setViewingDetail(data.user);
      }
    } catch (e) {
      console.error("[Staff fetch user detail error]:", e);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Xác nhận Ban / Unban
  const handleConfirmBanToggle = async () => {
    if (!targetBanUser) return;
    setIsProcessingBan(true);
    setFeedback(null);
    const action = targetBanUser.status === "Bị khóa" ? "unban" : "ban";

    try {
      const res = await fetch("/api/staff/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetBanUser.id, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Thao tác cập nhật trạng thái người dùng thất bại.");
      }

      const newDisplayStatus = data.displayStatus || (action === "ban" ? "Bị khóa" : "Hoạt động");

      setLocalUsers((prev) =>
        prev.map((u) => (u.id === targetBanUser.id ? { ...u, status: newDisplayStatus } : u))
      );

      if (viewingUser?.id === targetBanUser.id) {
        setViewingUser((prev) => (prev ? { ...prev, status: newDisplayStatus } : null));
      }

      setFeedback({ type: "success", message: data.message });
      setTargetBanUser(null);
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsProcessingBan(false);
    }
  };

  // Xuất danh sách người dùng ra tệp Excel (.xlsx)
  const handleExportExcel = async () => {
    if (filteredUsers.length === 0) {
      setFeedback({ type: "error", message: "Không có người dùng nào để xuất danh sách." });
      return;
    }

    setIsExporting(true);
    try {
      const XLSX = await import("xlsx");

      const exportRows = filteredUsers.map((u, idx) => ({
        "STT": idx + 1,
        "Mã người dùng": u.code || "—",
        "Họ và tên": u.name,
        "Email": u.email,
        "Vai trò": u.role,
        "Trạng thái": u.status,
        "Ngày tạo": u.time,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);

      // Căn chỉnh độ rộng các cột tối ưu cho Microsoft Excel
      worksheet["!cols"] = [
        { wch: 6 },  // STT
        { wch: 16 }, // Mã người dùng
        { wch: 28 }, // Họ và tên
        { wch: 36 }, // Email
        { wch: 16 }, // Vai trò
        { wch: 18 }, // Trạng thái
        { wch: 16 }, // Ngày tạo
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Người dùng EduMi");

      const now = new Date();
      const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
      const filename = `danh_sach_nguoi_dung_edumi_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, filename);

      setFeedback({
        type: "success",
        message: `Đã xuất thành công ${filteredUsers.length} người dùng ra tệp Excel (${filename})!`,
      });
    } catch (err: unknown) {
      console.error("[Export Excel error]:", err);
      setFeedback({ type: "error", message: "Có lỗi xảy ra khi tạo tệp Excel." });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Thông báo Feedback */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-sm font-bold shadow-xs ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="hover:opacity-75 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bộ lọc và Tìm kiếm */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_auto]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, email, mã người dùng..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none cursor-pointer"
          >
            <option value="Tất cả vai trò">Tất cả vai trò</option>
            <option value="Học sinh">Học sinh</option>
            <option value="Giáo viên">Giáo viên</option>
            <option value="Nhân viên">Nhân viên</option>
            <option value="Phụ huynh">Phụ huynh</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none cursor-pointer"
          >
            <option value="Tất cả trạng thái">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Chưa xác thực">Chưa xác thực</option>
            <option value="Bị khóa">Bị khóa</option>
          </select>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Làm mới
              </button>
            )}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportExcel}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  <span>Đang xuất...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-emerald-600" />
                  <span>Xuất Excel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Bảng danh sách người dùng */}
      <section>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h2 className="text-xl font-black text-slate-950">Danh sách người dùng hệ thống (Supabase)</h2>
            <span className="text-sm font-bold text-slate-400">
              Hiển thị {filteredUsers.length} / {localUsers.length} người dùng
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /></th>
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày tạo</th>
                  <th className="px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-bold">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                        <span>Đang tải danh sách người dùng từ cơ sở dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const roleTone =
                      user.tone === "blue"
                        ? "bg-blue-50 text-blue-700"
                        : user.tone === "amber"
                        ? "bg-amber-50 text-amber-700"
                        : user.tone === "rose"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-purple-50 text-purple-700";

                    const statusTone =
                      user.status === "Hoạt động"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : user.status === "Chưa xác thực"
                        ? "border border-amber-200 bg-amber-50 text-amber-700"
                        : "border border-rose-200 bg-rose-50 text-rose-700";

                    const isCurrentUser = user.id === currentStaffId;

                    return (
                      <tr key={user.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-4 py-3"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {user.avatarUrl ? (
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                                <Image src={user.avatarUrl} alt={user.name} fill sizes="40px" className="object-cover" />
                              </div>
                            ) : (
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                                {user.avatar}
                              </span>
                            )}
                            <div>
                              <p className="font-black text-slate-900">{user.name}</p>
                              {user.code ? (
                                <p className="text-xs font-bold text-slate-400">{user.code}</p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={`rounded-xl px-3 py-1 text-xs font-black ${roleTone}`}>{user.role}</span></td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-700">{user.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${statusTone}`}>
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.status === "Hoạt động"
                                  ? "bg-emerald-500"
                                  : user.status === "Chưa xác thực"
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-500">{user.time}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenViewUser(user)}
                              className="flex h-8 items-center gap-1 rounded-xl border border-slate-200 px-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              <Eye className="h-4 w-4" /> Xem
                            </button>
                            {isCurrentUser ? (
                              <span className="flex h-8 items-center rounded-xl bg-slate-100 px-2 text-[11px] font-bold text-slate-400 select-none">
                                Bạn
                              </span>
                            ) : user.status === "Bị khóa" ? (
                              <button
                                type="button"
                                onClick={() => setTargetBanUser(user)}
                                className="flex h-8 items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                              >
                                <CheckCircle className="h-3.5 w-3.5" /> Mở khóa
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setTargetBanUser(user)}
                                className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-2.5 text-xs font-black text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                              >
                                <ShieldAlert className="h-3.5 w-3.5" /> Ban
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400 font-bold">
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal 1: Xem chi tiết người dùng */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-emerald-100 bg-white p-6 shadow-2xl">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-950">Thông tin chi tiết người dùng</h3>
                <p className="mt-0.5 text-xs font-semibold text-slate-400">
                  Dữ liệu tài khoản thời gian thực trên cơ sở dữ liệu EduMi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewingUser(null);
                  setViewingDetail(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="mt-5 space-y-5">
              {/* User Hero Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-slate-50 p-4 border border-emerald-100/60">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white shadow-sm">
                  {viewingUser.avatarUrl ? (
                    <Image
                      src={viewingUser.avatarUrl}
                      alt={viewingUser.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#064e3b] to-[#047857] text-white text-2xl font-black">
                      {viewingUser.avatar}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-lg font-black text-slate-950">{viewingUser.name}</h4>
                    <span className="rounded-xl bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800">
                      {viewingUser.role}
                    </span>
                  </div>
                  {viewingUser.code ? (
                    <p className="mt-0.5 text-xs font-bold text-slate-500">Mã định danh: {viewingUser.code}</p>
                  ) : null}
                  <p className="text-xs font-medium text-slate-400">ID: {viewingUser.id}</p>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black border ${
                      viewingUser.status === "Hoạt động"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : viewingUser.status === "Chưa xác thực"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    ● {viewingUser.status}
                  </span>
                </div>
              </div>

              {/* Thông tin tài khoản */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <p className="text-xs font-bold text-slate-400">Địa chỉ Email</p>
                  <p className="mt-1 text-sm font-black text-slate-900 break-all">{viewingUser.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <p className="text-xs font-bold text-slate-400">Trạng thái xác thực Email</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-black">
                    {viewingDetail?.is_verified ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-emerald-600" /> Đã xác thực OTP
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1">
                        <ShieldAlert className="h-4 w-4 text-amber-600" /> Chưa xác thực OTP
                      </span>
                    )}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <p className="text-xs font-bold text-slate-400">Ngày tham gia hệ thống</p>
                  <p className="mt-1 text-sm font-black text-slate-900">{viewingUser.time}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <p className="text-xs font-bold text-slate-400">Quyền phân cấp</p>
                  <p className="mt-1 text-sm font-black text-slate-900 capitalize">{viewingUser.rawRole}</p>
                </div>
              </div>

              {/* Thông tin mở rộng theo vai trò */}
              {isLoadingDetail ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm font-bold text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  <span>Đang tải thông tin chuyên môn hồ sơ...</span>
                </div>
              ) : viewingDetail?.profile ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <h5 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                    {viewingUser.rawRole === "teacher"
                      ? "Thông tin hồ sơ giảng dạy"
                      : viewingUser.rawRole === "student"
                      ? "Thông tin hồ sơ học tập"
                      : "Thông tin liên kết"}
                  </h5>

                  {viewingUser.rawRole === "teacher" && (
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-500">Chuyên môn:</span>{" "}
                        <span className="font-black text-slate-900">
                          {Array.isArray((viewingDetail.profile as Record<string, unknown>).subjects)
                            ? ((viewingDetail.profile as Record<string, unknown>).subjects as string[]).join(", ")
                            : "Chưa chọn"}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Khối lớp:</span>{" "}
                        <span className="font-black text-slate-900">
                          {Array.isArray((viewingDetail.profile as Record<string, unknown>).grade_levels)
                            ? ((viewingDetail.profile as Record<string, unknown>).grade_levels as string[]).join(", ")
                            : "Chưa chọn"}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Kinh nghiệm:</span>{" "}
                        <span className="font-black text-slate-900">
                          {String((viewingDetail.profile as Record<string, unknown>).experience_years || "Chưa cập nhật")}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Trạng thái hồ sơ:</span>{" "}
                        <span className="font-black text-slate-900 capitalize">
                          {String((viewingDetail.profile as Record<string, unknown>).verification_status || "draft")}
                        </span>
                      </div>
                      {Boolean((viewingDetail.profile as Record<string, unknown>).certificate_url) && (
                        <div className="sm:col-span-2 mt-1">
                          <a
                            href={String((viewingDetail.profile as Record<string, unknown>).certificate_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800 hover:bg-emerald-200 transition"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Xem tệp bằng cấp / chứng chỉ R2
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {viewingUser.rawRole === "student" && (
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-500">Mã học sinh:</span>{" "}
                        <span className="font-black text-slate-900">
                          {String((viewingDetail.profile as Record<string, unknown>).student_code || viewingUser.code)}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Streak học tập:</span>{" "}
                        <span className="font-black text-slate-900">
                          {String((viewingDetail.profile as Record<string, unknown>).current_streak || 0)} ngày
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Điểm thưởng:</span>{" "}
                        <span className="font-black text-slate-900">
                          {String((viewingDetail.profile as Record<string, unknown>).total_points || 0)} pts
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Footer Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setViewingUser(null);
                  setViewingDetail(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Đóng
              </button>

              {viewingUser.id !== currentStaffId && (
                <button
                  type="button"
                  onClick={() => {
                    const u = viewingUser;
                    setViewingUser(null);
                    setTargetBanUser(u);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-black transition cursor-pointer ${
                    viewingUser.status === "Bị khóa"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                      : "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20"
                  }`}
                >
                  {viewingUser.status === "Bị khóa" ? (
                    <>
                      <CheckCircle className="h-4 w-4" /> Mở khóa tài khoản này
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4 w-4" /> Khóa tài khoản này
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Xác nhận Khóa / Mở khóa tài khoản */}
      {targetBanUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  targetBanUser.status === "Bị khóa"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {targetBanUser.status === "Bị khóa" ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <ShieldAlert className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  {targetBanUser.status === "Bị khóa"
                    ? "Mở khóa tài khoản"
                    : "Khóa tài khoản người dùng"}
                </h3>
                <p className="text-xs font-semibold text-slate-400">
                  {targetBanUser.name} {targetBanUser.code ? `(${targetBanUser.code})` : ""}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-600">
              {targetBanUser.status === "Bị khóa"
                ? `Bạn có chắc chắn muốn mở khóa cho tài khoản ${targetBanUser.name}? Người dùng sẽ có thể đăng nhập và tiếp tục sử dụng nền tảng EduMi.`
                : `Bạn có chắc chắn muốn khóa tài khoản của ${targetBanUser.name}? Sau khi khóa, người dùng này sẽ lập tức bị chặn quyền đăng nhập vào hệ thống EduMi.`}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isProcessingBan}
                onClick={() => setTargetBanUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isProcessingBan}
                onClick={handleConfirmBanToggle}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black text-white shadow-md transition cursor-pointer disabled:opacity-50 ${
                  targetBanUser.status === "Bị khóa"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                }`}
              >
                {isProcessingBan ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : targetBanUser.status === "Bị khóa" ? (
                  <span>Xác nhận mở khóa</span>
                ) : (
                  <span>Xác nhận khóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassManagementPanel() {
  const pendingClasses = [
    { title: "Toán 12 - Chuyên đề Hàm số", teacher: "Thầy Đức", subject: "Toán học", level: "THPT", lessons: "36 buổi", price: "399.000đ", submitted: "2 giờ trước", image: "/classes/class-math.jpg", desc: "Luyện chuyên đề hàm số, logarit và tích phân theo lộ trình thi THPT." },
    { title: "IELTS Foundation - Listening", teacher: "Cô Bảo Ngọc", subject: "Tiếng Anh", level: "IELTS", lessons: "28 buổi", price: "599.000đ", submitted: "5 giờ trước", image: "/classes/class-english.jpg", desc: "Rèn nghe theo chủ điểm, bổ sung từ vựng và chiến lược làm bài IELTS." },
    { title: "Vật lý 10 - Nền tảng chuyển động", teacher: "Thầy Minh Quân", subject: "Vật lý", level: "THPT", lessons: "24 buổi", price: "349.000đ", submitted: "1 ngày trước", image: "/classes/class-physics.jpg", desc: "Nắm chắc chuyển động, lực và các bài tập vật lý cốt lõi." },
  ];
  const classes = [
    { title: "Toán 12: Hàm số, Tích phân & Logarit", teacher: "Thầy Đức", subject: "Toán học", students: "124", status: "Đang học" },
    { title: "Ngữ pháp Tiếng Anh: 12 Thì nâng cao", teacher: "Cô Thu Hà", subject: "Tiếng Anh", students: "98", status: "Đang học" },
    { title: "Vật lý 10: Dao động và Sóng", teacher: "Thầy Trần Minh", subject: "Vật lý", students: "76", status: "Tạm ẩn" },
    { title: "Hóa học 11: Từ nền tảng đến nâng cao", teacher: "Cô Mai Anh", subject: "Hóa học", students: "81", status: "Đang học" },
    { title: "Ngữ văn 12: Nghị luận xã hội", teacher: "Cô Hoàng An", subject: "Ngữ văn", students: "64", status: "Hoàn thành" },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Xác minh lớp học</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">Chấp nhận hoặc từ chối đơn đăng ký lớp học mới từ giảng viên.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">{pendingClasses.length} chờ duyệt</span>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {pendingClasses.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <div className="grid gap-4 p-4 sm:grid-cols-[170px_1fr]">
                <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-100 sm:h-full">
                  <Image src={item.image} alt={item.title} fill sizes="170px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="rounded-2xl bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">{item.subject}</span>
                    <span className="text-xs font-bold text-slate-400">{item.submitted}</span>
                  </div>
                  <h3 className="line-clamp-2 text-lg font-black leading-tight text-slate-950">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-500">{item.desc}</p>
                  <p className="mt-3 text-sm font-black text-slate-700">{item.teacher}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-black text-slate-500">
                    <span>{item.lessons}</span>
                    <span>•</span>
                    <span>{item.level}</span>
                    <span>•</span>
                    <span>{item.price}</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-2 border-t border-slate-100 p-4 sm:grid-cols-3">
                <button className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/20"><CheckCircle className="h-4 w-4" /> Chấp nhận</button>
                <button className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700"><Eye className="h-4 w-4" /> Xem</button>
                <button className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 text-sm font-black text-rose-600"><XCircle className="h-4 w-4" /> Từ chối</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_auto]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <Search className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-400">Tìm theo tên lớp, giáo viên, môn học...</span>
          </div>
          {["Môn học", "Trạng thái"].map((label) => (
            <button key={label} className="flex h-12 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600">{label}<ChevronDown className="h-4 w-4" /></button>
          ))}
          <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"><Download className="h-4 w-4" /> Xuất danh sách</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-xl font-black text-slate-950">Danh sách lớp học</h2>
          <span className="text-sm font-bold text-slate-400">Hiển thị 5 / 892 lớp học</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Lớp học</th>
                <th className="px-4 py-3">Giảng viên</th>
                <th className="px-4 py-3">Môn học</th>
                <th className="px-4 py-3">Học viên</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((item) => {
                const statusTone = item.status === "Đang học" ? "bg-emerald-50 text-emerald-700" : item.status === "Tạm ẩn" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700";
                return (
                  <tr key={item.title} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4"><p className="font-black text-slate-950">{item.title}</p></td>
                    <td className="px-4 py-4 font-bold text-slate-600">{item.teacher}</td>
                    <td className="px-4 py-4"><span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{item.subject}</span></td>
                    <td className="px-4 py-4 font-bold text-slate-600">{item.students}</td>
                    <td className="px-4 py-4"><span className={`rounded-xl px-3 py-1 text-xs font-black ${statusTone}`}>● {item.status}</span></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2"><button className="flex h-8 items-center gap-1 rounded-xl border border-slate-200 px-2 text-xs font-black text-slate-700"><Eye className="h-4 w-4" /> Xem</button><button className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-2 text-xs font-black text-rose-600"><ShieldCheck className="h-4 w-4" /> Ban</button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MaterialManagementPanel() {
  const pendingMaterials = [
    { title: "Tuyển tập 50 đề thi thử THPT Quốc Gia môn Toán", teacher: "Cô Nguyễn Thảo", subject: "Toán học", code: "TOÁN 12", type: "PDF", pages: "128 trang", views: "45.120", submitted: "1 giờ trước", bg: "from-[#e36f1f] to-[#bf5a18]", accent: "bg-orange-400/25", pattern: "waves" },
    { title: "IELTS 9+ Collocations & Idioms Handbook", teacher: "Thầy Minh Quân", subject: "Tiếng Anh", code: "IELTS 9+", type: "PDF", pages: "84 trang", views: "45.240", submitted: "4 giờ trước", bg: "from-[#c04576] to-[#a64b71]", accent: "bg-pink-200/20", pattern: "waves" },
    { title: "Sơ đồ tư duy Vật lý 12: Dao động và Sóng cơ", teacher: "Thầy Trần Minh", subject: "Vật lý", code: "VẬT LÝ 12", type: "PDF", pages: "72 trang", views: "45.360", submitted: "Hôm qua", bg: "from-[#c45143] to-[#9f3d36]", accent: "bg-red-200/20", pattern: "confetti" },
  ];

  const materials = [
    { title: "Toán 12 - Bộ công thức tích phân nhanh", teacher: "Cô Nguyễn Thảo", subject: "Toán học", type: "PDF", downloads: "12.4K", rating: "5.0" },
    { title: "Ngữ pháp Tiếng Anh 12 thì nâng cao", teacher: "Cô Thu Hà", subject: "Tiếng Anh", type: "PDF", downloads: "9.8K", rating: "4.9" },
    { title: "Vật lý 10 - Chuyển động thẳng biến đổi đều", teacher: "Thầy Minh Quân", subject: "Vật lý", type: "DOCX", downloads: "6.7K", rating: "4.8" },
    { title: "Hóa học 11 - Cân bằng phản ứng oxi hóa khử", teacher: "Cô Mai Anh", subject: "Hóa học", type: "PDF", downloads: "8.1K", rating: "5.0" },
    { title: "Ngữ văn 12 - Dàn ý nghị luận xã hội", teacher: "Cô Hoàng An", subject: "Ngữ văn", type: "DOCX", downloads: "5.4K", rating: "4.7" },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Kiểm duyệt tài liệu</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">Chấp nhận hoặc từ chối tài liệu học tập mới do giảng viên tải lên.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">{pendingMaterials.length} chờ duyệt</span>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {pendingMaterials.map((item) => (
            <article key={item.title} className={`relative min-h-[430px] overflow-hidden rounded-3xl bg-gradient-to-br ${item.bg} p-6 text-white shadow-sm`}>
              <div className="pointer-events-none absolute inset-0 opacity-70">
                {item.pattern === "waves" ? (
                  <>
                    <span className={`absolute -left-16 top-20 h-40 w-80 rounded-[50%] ${item.accent}`} />
                    <span className={`absolute -bottom-16 right-0 h-40 w-80 rounded-[50%] ${item.accent}`} />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.10)_0_14px,transparent_14px_42px)]" />
                )}
              </div>
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-14 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide">
                  <span>EDUMI | {item.subject}</span>
                  <span className="rounded-full bg-white/20 px-2 py-1">{item.type}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-black leading-none">{item.code}</h3>
                  <p className="mt-5 line-clamp-2 text-xl font-black leading-tight">{item.title}</p>
                  <p className="mt-4 text-sm font-bold text-white/85">{item.teacher}</p>
                  <div className="mt-5 flex items-center gap-3 text-sm font-black text-white/90">
                    <span>★ {item.views} lượt xem</span>
                    <span className="h-5 w-px bg-white/40" />
                    <span>{item.pages}</span>
                  </div>
                </div>
                <div className="mt-8 grid gap-2 sm:grid-cols-3">
                  <button className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-emerald-700"><CheckCircle className="h-4 w-4" /> Chấp nhận</button>
                  <button className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-slate-800"><Eye className="h-4 w-4" /> Xem</button>
                  <button className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/90 text-sm font-black text-rose-600"><XCircle className="h-4 w-4" /> Từ chối</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_auto]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <Search className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-400">Tìm theo tên tài liệu, giáo viên, môn học...</span>
          </div>
          {["Loại tài liệu", "Đánh giá"].map((label) => (
            <button key={label} className="flex h-12 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600">{label}<ChevronDown className="h-4 w-4" /></button>
          ))}
          <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"><Download className="h-4 w-4" /> Xuất danh sách</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-xl font-black text-slate-950">Danh sách tài liệu</h2>
          <span className="text-sm font-bold text-slate-400">Hiển thị 5 / 1.320 tài liệu</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tài liệu</th>
                <th className="px-4 py-3">Giảng viên</th>
                <th className="px-4 py-3">Môn học</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Lượt tải</th>
                <th className="px-4 py-3">Đánh giá</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map((item) => (
                <tr key={item.title} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4"><p className="font-black text-slate-950">{item.title}</p></td>
                  <td className="px-4 py-4 font-bold text-slate-600">{item.teacher}</td>
                  <td className="px-4 py-4"><span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{item.subject}</span></td>
                  <td className="px-4 py-4 font-bold text-slate-600">{item.type}</td>
                  <td className="px-4 py-4 font-bold text-slate-600">{item.downloads}</td>
                  <td className="px-4 py-4"><span className="rounded-xl bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">★ {item.rating}</span></td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2"><button className="flex h-8 items-center gap-1 rounded-xl border border-slate-200 px-2 text-xs font-black text-slate-700"><Eye className="h-4 w-4" /> Xem</button><button className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-2 text-xs font-black text-rose-600"><ShieldCheck className="h-4 w-4" /> Ban</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white p-12 text-center shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">Khu vực quản trị này sẽ được kết nối dữ liệu thật trong các bước tiếp theo.</p>
    </div>
  );
}

export default function StaffProfileDashboard({ staff, onLogout }: StaffProfileDashboardProps) {
  const [activeTab, setActiveTab] = useState<StaffTabId>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Real data states from Supabase
  const [pendingTeacherCount, setPendingTeacherCount] = useState<number>(0);
  const [realUsers, setRealUsers] = useState<StaffUserItem[]>([]);
  const [statsData, setStatsData] = useState<{
    totalUsers: number;
    totalTeachers: number;
    pendingTeacherApplications: number;
  }>({
    totalUsers: 0,
    totalTeachers: 0,
    pendingTeacherApplications: 0,
  });
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);

  const fetchOverviewData = async () => {
    setIsOverviewLoading(true);
    try {
      const res = await fetch("/api/staff/overview");
      const data = await res.json();
      if (res.ok && data.success) {
        setStatsData(data.stats);
        setRealUsers(data.users || []);
        setPendingTeacherCount(data.stats.pendingTeacherApplications || 0);
      }
    } catch (e) {
      console.error("[Staff Overview fetch error]:", e);
    } finally {
      setIsOverviewLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleTeacherStatsChange = useCallback((counts: { pending: number; approved: number; total: number }) => {
    setPendingTeacherCount(counts.pending);
    setStatsData((prev) => {
      if (prev.pendingTeacherApplications === counts.pending) return prev;
      return {
        ...prev,
        pendingTeacherApplications: counts.pending,
      };
    });
  }, []);

  const content = activeTab === "overview" ? (
    <Overview onNavigate={setActiveTab} statsData={statsData} pendingCount={pendingTeacherCount} />
  ) : activeTab === "users" ? (
    <UserManagementPanel
      users={realUsers}
      isLoading={isOverviewLoading}
      onRefresh={fetchOverviewData}
      currentStaffId={staff.id}
    />
  ) : activeTab === "classes" ? (
    <ClassManagementPanel />
  ) : activeTab === "materials" ? (
    <MaterialManagementPanel />
  ) : activeTab === "teachers" ? (
    <TeacherApprovalPanel onStatsChange={handleTeacherStatsChange} />
  ) : (
    <PlaceholderPanel
      title={{
        users: "Quản lý người dùng",
        classes: "Quản lý lớp học",
        materials: "Quản lý tài liệu",
        teachers: "Duyệt giáo viên",
        materialPosts: "Đăng tài liệu",
        examPosts: "Đăng bài thi",
        withdrawals: "Duyệt đơn rút tiền",
      }[activeTab]}
    />
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8faf8]">
      <div className="hidden h-full shrink-0 lg:flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} pendingCount={pendingTeacherCount} />
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="relative z-10 h-full w-72">
            <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setIsMobileSidebarOpen(false); }} collapsed={false} onToggle={() => setIsMobileSidebarOpen(false)} pendingCount={pendingTeacherCount} />
          </div>
        </div>
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <Header staff={staff} onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">{content}</div>
        </main>
      </div>
    </div>
  );
}
