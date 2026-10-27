"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Moon,
  Award,
  Home,
  UsersRound,
  WalletCards,
  XCircle,
  Eye,
  ShieldAlert,
  X,
  ExternalLink,
  Check,
  Lock,
  Unlock,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import NotificationDropdown, { NotificationItem } from "../NotificationDropdown";
import TeacherApprovalPanel from "./TeacherApprovalPanel";
import StaffExamManagementPanel from "./StaffExamManagementPanel";
import StaffMaterialManagementPanel from "./StaffMaterialManagementPanel";
import CustomSelect from "@/components/common/CustomSelect";

export interface StaffUserItem {
  id: string;
  name: string;
  code?: string | null;
  role: string;
  rawRole: string;
  email: string;
  phone: string;
  status: string;
  rawStatus?: string;
  isVerified?: boolean;
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
  staff,
}: {
  activeTab: StaffTabId;
  onTabChange: (tab: StaffTabId) => void;
  collapsed: boolean;
  onToggle: () => void;
  pendingCount?: number;
  staff: StaffSession;
}) {
  return (
    <aside
      className={`relative z-20 flex h-full flex-col justify-between bg-gradient-to-b from-[#064e3b] via-[#047857] to-[#065f46] text-white border-r border-emerald-900/30 select-none shadow-[4px_0_24px_rgba(6,78,59,0.15)] transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* ── Top Header Brand & Nav items ── */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
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
            {!collapsed && (
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
            onClick={onToggle}
            className="w-7 h-7 rounded-lg bg-black/20 hover:bg-black/30 border border-white/10 text-emerald-100 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title={collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar">
          {navGroups.map((group, groupIndex) => (
            <div
              key={group.title}
              className={groupIndex > 0 ? "pt-3 border-t border-white/10" : ""}
            >
              {!collapsed && (
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                  {group.title}
                </div>
              )}
              <nav className="space-y-1">
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
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
                        isActive
                          ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold"
                          : "text-emerald-100/90 hover:bg-white/10 hover:text-white"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                          isActive ? "scale-110 text-slate-950" : "text-emerald-200"
                        }`}
                      />
                      {!collapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      {!collapsed && badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-slate-950/15 text-slate-900"
                              : item.id === "teachers" || item.id === "withdrawals"
                              ? "bg-rose-500 text-white"
                              : "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                      {collapsed && badge && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#064e3b]" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Staff Code Card ── */}
      <div className="p-3 border-t border-white/10 bg-black/10 flex-shrink-0">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-emerald-200 font-medium">
                  Mã nhân viên
                </p>
                <p className="text-xs font-bold text-white tracking-wide truncate">
                  {staff.staffCode || "ST-8899"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center p-2 rounded-xl bg-black/20 border border-white/10"
            title={`Mã nhân viên: ${staff.staffCode || "ST-8899"}`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
          </div>
        )}
      </div>
    </aside>
  );
}

function Header({
  staff,
  onToggleMobileSidebar,
  onLogout,
  onNavigate,
  pendingTeacherCount = 0,
}: {
  staff: StaffSession;
  onToggleMobileSidebar: () => void;
  onLogout: () => void;
  onNavigate: (tab: StaffTabId) => void;
  pendingTeacherCount?: number;
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchHeaderQuery, setSearchHeaderQuery] = useState("");
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: `${pendingTeacherCount || 8} hồ sơ giáo viên mới đang chờ xét duyệt chuyên môn.`,
      timeAgo: "Vừa xong",
      isRead: false,
    },
    {
      id: "notif-2",
      title: "Hệ thống đã cập nhật bộ đề thi thử THPT Quốc Gia & ĐGNL 2026 mới.",
      timeAgo: "45 phút trước",
      isRead: false,
    },
    {
      id: "notif-3",
      title: "6 yêu cầu duyệt đơn rút tiền của giáo viên đang chờ đối soát.",
      timeAgo: "2 giờ trước",
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationOpen(false);
    if (item.id === "notif-1") onNavigate("teachers");
    else if (item.id === "notif-2") onNavigate("examPosts");
    else if (item.id === "notif-3") onNavigate("withdrawals");
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between gap-3 select-none">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchHeaderQuery}
            onChange={(e) => setSearchHeaderQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchHeaderQuery.trim()) {
                const q = searchHeaderQuery.toLowerCase();
                if (q.includes("đề") || q.includes("thi") || q.includes("exam")) {
                  onNavigate("examPosts");
                } else if (q.includes("tài liệu") || q.includes("sách") || q.includes("file")) {
                  onNavigate("materials");
                } else if (q.includes("giáo viên") || q.includes("thầy") || q.includes("cô")) {
                  onNavigate("teachers");
                } else {
                  onNavigate("users");
                }
              }
            }}
            placeholder="Tìm tài liệu, bài học, bộ đề..."
            className="w-full pl-9 pr-12 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
            <kbd
              onClick={() => searchInputRef.current?.focus()}
              className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-200"
            >
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Stats, Actions, and User Profile Chip (Identical scale to student profile) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Rating Badge (Compact Pill style like Student Streak) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsRatingModalOpen(!isRatingModalOpen);
              setIsNotificationOpen(false);
              setIsProfileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 shadow-sm transition-all hover:shadow cursor-pointer active:scale-95"
            title="Đánh giá hiệu suất: 5.0 ★"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-amber-900">
              {staff.ratingAvg?.toFixed(1) || "5.0"}
            </span>
          </button>

          {isRatingModalOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsRatingModalOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">Hiệu suất công tác</h4>
                    <p className="text-sm font-black text-slate-800">5.0 / 5.0 (Xuất sắc)</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Tỷ lệ duyệt đúng hạn:</span>
                    <strong className="text-emerald-600 font-black">99.8%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian phản hồi TB:</span>
                    <strong className="text-slate-800 font-black">&lt; 15 phút</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Chuẩn kiểm duyệt:</span>
                    <strong className="text-amber-600 font-black">Bộ GD&amp;ĐT 2026</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Light / Dark Mode Toggle Button (w-9 h-9 like Student) */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          title={isDarkMode ? "Chuyển sang chế độ ban ngày" : "Chuyển sang chế độ ban đêm"}
        >
          {isDarkMode ? (
            <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-300 rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
          )}
        </button>

        {/* Notification Bell with NotificationDropdown (w-9 h-9 like Student) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              if (isProfileMenuOpen) setIsProfileMenuOpen(false);
              if (isRatingModalOpen) setIsRatingModalOpen(false);
            }}
            className={`relative w-9 h-9 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center justify-center active:scale-95 ${
              isNotificationOpen
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-600 hover:text-slate-900"
            }`}
            title="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            fullName={staff.fullName}
            notifications={notifications}
            onSelectNotification={handleSelectNotification}
            onViewAllPosts={() => {
              setIsNotificationOpen(false);
              onNavigate("overview");
            }}
          />
        </div>

        {/* User Profile Chip (Exactly matching Student ProfileHeader) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              if (isNotificationOpen) setIsNotificationOpen(false);
              if (isRatingModalOpen) setIsRatingModalOpen(false);
            }}
            className={`flex items-center gap-2 p-1 sm:pr-3 rounded-full transition-all cursor-pointer ${
              isProfileMenuOpen
                ? "bg-slate-100 border border-slate-200 shadow-xs"
                : "hover:bg-slate-100 border border-transparent hover:border-slate-200"
            }`}
          >
            {/* User Avatar w-8 h-8 */}
            <div className="w-8 h-8 rounded-full bg-[#064e3b] text-white font-bold text-xs flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden relative">
              {staff.avatarUrl ? (
                <Image src={staff.avatarUrl} alt={staff.fullName} fill sizes="32px" className="object-cover" />
              ) : (
                <span>{staff.fullName ? staff.fullName.charAt(0).toUpperCase() : "S"}</span>
              )}
            </div>
            <span className="hidden sm:inline-block text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[140px]">
              {staff.fullName}
            </span>
            <ChevronDown
              className={`hidden sm:inline-block w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* User Dropdown Menu with Dropdown Cascade Effect (animate-in slide-in-from-top-2) */}
          {isProfileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsProfileMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {staff.fullName}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Nhân viên EduMi</span>
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Trang chủ EduMi</span>
                  </Link>
                  <Link
                    href="/exam"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phòng thi trực tuyến</span>
                  </Link>
                  <Link
                    href="/materials"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Thư viện tài liệu</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate("overview");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Bảng điều khiển Staff</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
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
    queueMicrotask(() => setLocalUsers(users));
  }, [users]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tất cả vai trò");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");

  // Multi-selection for batch operations
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Per-row processing indicator
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

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
  const [isSavingDetail, setIsSavingDetail] = useState(false);

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

  // Checkbox selection logic
  const nonSelfFilteredUsers = useMemo(() => {
    return filteredUsers.filter((u) => u.id !== currentStaffId);
  }, [filteredUsers, currentStaffId]);

  const allFilteredSelected =
    nonSelfFilteredUsers.length > 0 &&
    nonSelfFilteredUsers.every((u) => selectedUserIds.has(u.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedUserIds(new Set());
    } else {
      const next = new Set<string>();
      nonSelfFilteredUsers.forEach((u) => next.add(u.id));
      setSelectedUserIds(next);
    }
  };

  const handleToggleSelectUser = (id: string) => {
    if (id === currentStaffId) return;
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // Xử lý trực tiếp từ hàng bảng: Kích hoạt / Mở khóa / Ban
  const handleDirectAction = async (user: StaffUserItem, action: "ban" | "unban" | "activate") => {
    if (user.id === currentStaffId) {
      setFeedback({ type: "error", message: "Bạn không thể tự thay đổi tài khoản của chính mình." });
      return;
    }
    setProcessingUserId(user.id);
    setFeedback(null);
    try {
      const res = await fetch("/api/staff/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Thao tác cập nhật người dùng thất bại.");

      const newDisplayStatus = data.displayStatus || (action === "ban" ? "Bị khóa" : "Hoạt động");
      const newRawStatus = data.rawStatus || (action === "ban" ? "banned" : "active");
      const newIsVerified = data.isVerified !== undefined ? data.isVerified : action !== "ban";

      setLocalUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: newDisplayStatus, rawStatus: newRawStatus, isVerified: newIsVerified }
            : u
        )
      );

      if (viewingUser?.id === user.id) {
        setViewingUser((prev) =>
          prev ? { ...prev, status: newDisplayStatus, rawStatus: newRawStatus, isVerified: newIsVerified } : null
        );
        setViewingDetail((prev) =>
          prev ? { ...prev, status: newRawStatus, is_verified: newIsVerified } : null
        );
      }

      setFeedback({ type: "success", message: `✓ Đã đồng bộ Supabase: ${data.message}` });
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setProcessingUserId(null);
    }
  };

  // Xác nhận Ban / Unban từ Modal
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
      const newRawStatus = data.rawStatus || (action === "ban" ? "banned" : "active");
      const newIsVerified = data.isVerified !== undefined ? data.isVerified : action !== "ban";

      setLocalUsers((prev) =>
        prev.map((u) =>
          u.id === targetBanUser.id
            ? { ...u, status: newDisplayStatus, rawStatus: newRawStatus, isVerified: newIsVerified }
            : u
        )
      );

      if (viewingUser?.id === targetBanUser.id) {
        setViewingUser((prev) =>
          prev ? { ...prev, status: newDisplayStatus, rawStatus: newRawStatus, isVerified: newIsVerified } : null
        );
        setViewingDetail((prev) =>
          prev ? { ...prev, status: newRawStatus, is_verified: newIsVerified } : null
        );
      }

      setFeedback({ type: "success", message: `✓ Đã đồng bộ Supabase: ${data.message}` });
      setTargetBanUser(null);
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsProcessingBan(false);
    }
  };

  // Thay đổi trạng thái tài khoản từ Modal xem chi tiết
  const handleUpdateUserStatusFromModal = async (displayStatus: string) => {
    if (!viewingUser) return;
    if (viewingUser.id === currentStaffId) {
      setFeedback({ type: "error", message: "Bạn không thể tự thay đổi trạng thái của chính mình." });
      return;
    }

    const statusMap: Record<string, string> = {
      "Hoạt động": "active",
      "Chưa xác thực": "pending_verification",
      "Tạm ngưng": "inactive",
      "Bị khóa": "banned",
    };
    const rawStatus = statusMap[displayStatus];
    if (!rawStatus) return;

    setIsSavingDetail(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/staff/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: viewingUser.id,
          action: "set_status",
          status: rawStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cập nhật trạng thái thất bại.");

      const newDisplayStatus = data.displayStatus || displayStatus;
      const newRawStatus = data.rawStatus || rawStatus;
      const newIsVerified = data.isVerified !== undefined ? data.isVerified : rawStatus === "active";

      setViewingUser((prev) =>
        prev ? { ...prev, status: newDisplayStatus, rawStatus: newRawStatus, isVerified: newIsVerified } : null
      );
      setViewingDetail((prev) =>
        prev ? { ...prev, status: newRawStatus, is_verified: newIsVerified } : null
      );

      setLocalUsers((prev) =>
        prev.map((u) =>
          u.id === viewingUser.id
            ? { ...u, status: newDisplayStatus, rawStatus: newRawStatus, isVerified: newIsVerified }
            : u
        )
      );

      setFeedback({ type: "success", message: `✓ Đã đồng bộ Supabase: ${data.message}` });
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsSavingDetail(false);
    }
  };

  // Thay đổi vai trò người dùng từ Modal xem chi tiết
  const handleUpdateUserRoleFromModal = async (displayRole: string) => {
    if (!viewingUser) return;
    if (viewingUser.id === currentStaffId) {
      setFeedback({ type: "error", message: "Bạn không thể tự thay đổi vai trò của chính mình." });
      return;
    }

    const roleMap: Record<string, string> = {
      "Học sinh": "student",
      "Giáo viên": "teacher",
      "Nhân viên": "staff",
      "Phụ huynh": "parent",
    };
    const rawRole = roleMap[displayRole];
    if (!rawRole) return;

    setIsSavingDetail(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/staff/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: viewingUser.id,
          action: "set_role",
          role: rawRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cập nhật vai trò thất bại.");

      const tone =
        rawRole === "teacher"
          ? "amber"
          : rawRole === "staff"
          ? "rose"
          : rawRole === "parent"
          ? "purple"
          : "blue";

      setViewingUser((prev) => (prev ? { ...prev, role: displayRole, rawRole, tone } : null));
      setViewingDetail((prev) => (prev ? { ...prev, role: rawRole } : null));

      setLocalUsers((prev) =>
        prev.map((u) => (u.id === viewingUser.id ? { ...u, role: displayRole, rawRole, tone } : u))
      );

      setFeedback({ type: "success", message: `✓ Đã đồng bộ Supabase: ${data.message}` });
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsSavingDetail(false);
    }
  };

  // Bật/tắt xác thực OTP từ Modal xem chi tiết
  const handleVerifyOtpFromModal = async (isVerified: boolean) => {
    if (!viewingUser) return;
    setIsSavingDetail(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/staff/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: viewingUser.id,
          action: "set_verified",
          isVerified,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cập nhật xác thực OTP thất bại.");

      const newDisplayStatus = data.displayStatus || (isVerified ? "Hoạt động" : "Chưa xác thực");
      const newRawStatus = data.rawStatus || (isVerified ? "active" : "pending_verification");

      setViewingUser((prev) =>
        prev ? { ...prev, status: newDisplayStatus, rawStatus: newRawStatus, isVerified } : null
      );
      setViewingDetail((prev) =>
        prev ? { ...prev, is_verified: isVerified, status: newRawStatus } : null
      );

      setLocalUsers((prev) =>
        prev.map((u) =>
          u.id === viewingUser.id
            ? { ...u, status: newDisplayStatus, rawStatus: newRawStatus, isVerified }
            : u
        )
      );

      setFeedback({ type: "success", message: `✓ Đã đồng bộ Supabase: ${data.message}` });
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsSavingDetail(false);
    }
  };

  // Cập nhật hàng loạt (Batch Status)
  const handleBatchStatus = async (status: "banned" | "active") => {
    if (selectedUserIds.size === 0) return;
    setIsProcessingBatch(true);
    setFeedback(null);
    const userIds = Array.from(selectedUserIds).filter((id) => id !== currentStaffId);

    if (userIds.length === 0) {
      setFeedback({ type: "error", message: "Không thể áp dụng thao tác hàng loạt cho tài khoản của chính bạn." });
      setIsProcessingBatch(false);
      return;
    }

    try {
      const res = await fetch("/api/staff/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "batch_status",
          userIds,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cập nhật hàng loạt thất bại.");

      const newDisplayStatus = status === "banned" ? "Bị khóa" : "Hoạt động";
      const newIsVerified = status === "active";

      setLocalUsers((prev) =>
        prev.map((u) =>
          userIds.includes(u.id)
            ? { ...u, status: newDisplayStatus, rawStatus: status, isVerified: newIsVerified }
            : u
        )
      );

      setSelectedUserIds(new Set());
      setFeedback({ type: "success", message: `✓ Đã đồng bộ Supabase: ${data.message}` });
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsProcessingBatch(false);
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
        STT: idx + 1,
        "Mã người dùng": u.code || "—",
        "Họ và tên": u.name,
        Email: u.email,
        "Vai trò": u.role,
        "Trạng thái": u.status,
        "Ngày tạo": u.time,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);

      // Căn chỉnh độ rộng các cột tối ưu cho Microsoft Excel
      worksheet["!cols"] = [
        { wch: 6 }, // STT
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
    <div className="relative space-y-5">
      {/* Thông báo Feedback */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-sm font-bold shadow-xs transition-all ${
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
          <CustomSelect
            value={selectedRole}
            onChange={setSelectedRole}
            options={[
              "Tất cả vai trò",
              "Học sinh",
              "Giáo viên",
              "Nhân viên",
              "Phụ huynh",
            ]}
            className="w-full"
            buttonClassName="h-12 rounded-2xl border-slate-200 text-sm font-bold text-slate-700"
          />
          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              "Tất cả trạng thái",
              "Hoạt động",
              "Chưa xác thực",
              "Bị khóa",
              "Tạm ngưng",
            ]}
            className="w-full"
            buttonClassName="h-12 rounded-2xl border-slate-200 text-sm font-bold text-slate-700"
          />
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
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-slate-950">Danh sách người dùng hệ thống (Supabase)</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <span className="text-sm font-bold text-slate-400">
              Hiển thị {filteredUsers.length} / {localUsers.length} người dùng
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleToggleSelectAll}
                      title="Chọn tất cả người dùng"
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
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
                        <span>Đang tải danh sách người dùng từ cơ sở dữ liệu Supabase...</span>
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
                        : user.status === "Tạm ngưng"
                        ? "border border-slate-200 bg-slate-100 text-slate-700"
                        : "border border-rose-200 bg-rose-50 text-rose-700";

                    const isCurrentUser = user.id === currentStaffId;
                    const isSelected = selectedUserIds.has(user.id);
                    const isProcessingThis = processingUserId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className={`transition-colors ${
                          isSelected ? "bg-emerald-50/40" : "hover:bg-slate-50/70"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isCurrentUser}
                            onChange={() => handleToggleSelectUser(user.id)}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-40"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {user.avatarUrl ? (
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                                <Image
                                  src={user.avatarUrl}
                                  alt={user.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                                {user.avatar}
                              </span>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-black text-slate-900">{user.name}</p>
                                {isCurrentUser && (
                                  <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-800">
                                    Bạn
                                  </span>
                                )}
                              </div>
                              {user.code ? (
                                <p className="text-xs font-bold text-slate-400">{user.code}</p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-xl px-3 py-1 text-xs font-black ${roleTone}`}>
                            {user.role}
                          </span>
                        </td>
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
                                  : user.status === "Tạm ngưng"
                                  ? "bg-slate-400"
                                  : "bg-rose-500"
                              }`}
                            />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-500">{user.time}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {/* Nút Xem chi tiết */}
                            <button
                              type="button"
                              onClick={() => handleOpenViewUser(user)}
                              className="flex h-8 items-center gap-1 rounded-xl border border-slate-200 px-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" /> Xem
                            </button>

                            {isCurrentUser ? (
                              <span className="flex h-8 items-center rounded-xl bg-slate-100 px-2.5 text-[11px] font-bold text-slate-400 select-none">
                                Bạn
                              </span>
                            ) : isProcessingThis ? (
                              <span className="flex h-8 items-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-600">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                                Đang lưu...
                              </span>
                            ) : user.status === "Bị khóa" ? (
                              <button
                                type="button"
                                onClick={() => setTargetBanUser(user)}
                                className="flex h-8 items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shadow-xs"
                                title="Mở khóa tài khoản này trên Supabase"
                              >
                                <Unlock className="h-3.5 w-3.5" /> Mở khóa
                              </button>
                            ) : user.status === "Chưa xác thực" ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDirectAction(user, "activate")}
                                  className="flex h-8 items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shadow-xs"
                                  title="Kích hoạt và xác thực OTP tài khoản này trên Supabase"
                                >
                                  <UserCheck className="h-3.5 w-3.5" /> Kích hoạt
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setTargetBanUser(user)}
                                  className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-2 text-xs font-black text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                                  title="Khóa tài khoản trên Supabase"
                                >
                                  <Lock className="h-3.5 w-3.5" /> Ban
                                </button>
                              </div>
                            ) : user.status === "Tạm ngưng" ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDirectAction(user, "activate")}
                                  className="flex h-8 items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-black text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shadow-xs"
                                  title="Kích hoạt lại tài khoản này trên Supabase"
                                >
                                  <Check className="h-3.5 w-3.5" /> Kích hoạt
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setTargetBanUser(user)}
                                  className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-2 text-xs font-black text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                                  title="Khóa tài khoản trên Supabase"
                                >
                                  <Lock className="h-3.5 w-3.5" /> Ban
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setTargetBanUser(user)}
                                className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-2.5 text-xs font-black text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                                title="Khóa tài khoản người dùng trên Supabase"
                              >
                                <Lock className="h-3.5 w-3.5" /> Ban
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

      {/* Floating Toolbar thao tác hàng loạt */}
      {selectedUserIds.size > 0 && (
        <div className="sticky bottom-4 z-40 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/95 px-5 py-3.5 text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-xs font-black text-slate-950">
              {selectedUserIds.size}
            </span>
            <span className="text-sm font-bold">
              Đã chọn <strong className="text-emerald-400">{selectedUserIds.size}</strong> người dùng
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProcessingBatch}
              onClick={() => handleBatchStatus("banned")}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white hover:bg-rose-700 transition cursor-pointer disabled:opacity-50 shadow-md shadow-rose-600/30"
            >
              {isProcessingBatch ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              Khóa hàng loạt
            </button>

            <button
              type="button"
              disabled={isProcessingBatch}
              onClick={() => handleBatchStatus("active")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-600/30"
            >
              {isProcessingBatch ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Unlock className="h-3.5 w-3.5" />
              )}
              Mở khóa & Kích hoạt hàng loạt
            </button>

            <button
              type="button"
              onClick={() => setSelectedUserIds(new Set())}
              className="flex h-8 items-center gap-1 rounded-xl bg-slate-800 px-3 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Modal 1: Xem chi tiết và Điều khiển trực tiếp với Supabase */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-emerald-100 bg-white p-6 shadow-2xl">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-950">Thông tin chi tiết người dùng</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Live
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-slate-400">
                  Dữ liệu tài khoản thời gian thực trên cơ sở dữ liệu EduMi. Mọi thay đổi sẽ lập tức đồng bộ với Supabase.
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
                        : viewingUser.status === "Tạm ngưng"
                        ? "bg-slate-100 text-slate-700 border-slate-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    ● {viewingUser.status}
                  </span>
                </div>
              </div>

              {/* Bảng điều khiển đồng bộ Supabase */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                      Bảng điều khiển Supabase Database
                    </span>
                  </div>
                  {isSavingDetail && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Đang đồng bộ với Supabase...
                    </span>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Trạng thái tài khoản (Cột <code className="text-emerald-700">status</code>):
                    </label>
                    <CustomSelect
                      value={viewingUser.status}
                      onChange={handleUpdateUserStatusFromModal}
                      options={["Hoạt động", "Chưa xác thực", "Tạm ngưng", "Bị khóa"]}
                      disabled={isSavingDetail || viewingUser.id === currentStaffId}
                      className="w-full"
                      buttonClassName="h-10 rounded-xl border-slate-200 text-xs font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Vai trò người dùng (Cột <code className="text-emerald-700">role</code>):
                    </label>
                    <CustomSelect
                      value={viewingUser.role}
                      onChange={handleUpdateUserRoleFromModal}
                      options={["Học sinh", "Giáo viên", "Nhân viên", "Phụ huynh"]}
                      disabled={isSavingDetail || viewingUser.id === currentStaffId}
                      className="w-full"
                      buttonClassName="h-10 rounded-xl border-slate-200 text-xs font-bold bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin tài khoản */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <p className="text-xs font-bold text-slate-400">Địa chỉ Email</p>
                  <p className="mt-1 text-sm font-black text-slate-900 break-all">{viewingUser.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <p className="text-xs font-bold text-slate-400">Trạng thái xác thực Email / OTP</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    {viewingDetail?.is_verified ? (
                      <span className="text-emerald-700 flex items-center gap-1 text-xs font-black">
                        <CheckCircle className="h-4 w-4 text-emerald-600" /> Đã xác thực OTP
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1 text-xs font-black">
                        <ShieldAlert className="h-4 w-4 text-amber-600" /> Chưa xác thực OTP
                      </span>
                    )}

                    {viewingUser.id !== currentStaffId && (
                      <button
                        type="button"
                        disabled={isSavingDetail}
                        onClick={() => handleVerifyOtpFromModal(!viewingDetail?.is_verified)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-black transition cursor-pointer ${
                          viewingDetail?.is_verified
                            ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {viewingDetail?.is_verified ? "Hủy OTP" : "Xác thực ngay"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <p className="text-xs font-bold text-slate-400">Ngày tham gia hệ thống</p>
                  <p className="mt-1 text-sm font-black text-slate-900">{viewingUser.time}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <p className="text-xs font-bold text-slate-400">Số điện thoại</p>
                  <p className="mt-1 text-sm font-black text-slate-900">{viewingUser.phone || "Chưa cập nhật"}</p>
                </div>
              </div>

              {/* Thông tin mở rộng theo vai trò */}
              {isLoadingDetail ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm font-bold text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  <span>Đang tải thông tin chuyên môn hồ sơ từ Supabase...</span>
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
                      <Unlock className="h-4 w-4" /> Mở khóa tài khoản này
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" /> Khóa tài khoản này
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
                  <Unlock className="h-6 w-6" />
                ) : (
                  <Lock className="h-6 w-6" />
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
                ? `Bạn có chắc chắn muốn mở khóa cho tài khoản ${targetBanUser.name}? Trạng thái trên cơ sở dữ liệu Supabase sẽ chuyển sang "active" và người dùng sẽ có thể đăng nhập bình thường.`
                : `Bạn có chắc chắn muốn khóa tài khoản của ${targetBanUser.name}? Trạng thái trên cơ sở dữ liệu Supabase sẽ chuyển sang "banned" và người dùng sẽ bị chặn quyền đăng nhập ngay lập tức.`}
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
                    <span>Đang xử lý với Supabase...</span>
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

const CLASS_REJECT_REASONS = [
  "Thông tin lớp học chưa đầy đủ, cần bổ sung mô tả, lộ trình hoặc mục tiêu học tập.",
  "Lịch học hoặc khung giờ chưa rõ ràng, cần điều chỉnh trước khi duyệt.",
  "Môn học, khối lớp hoặc độ khó chưa phù hợp với nội dung lớp học.",
  "Học phí hoặc số buổi chưa hợp lý, cần kiểm tra lại thông tin đăng ký.",
  "Nội dung lớp học cần chỉnh sửa để phù hợp tiêu chuẩn hiển thị của EduMi.",
];
function ClassManagementPanel() {
  type StaffClassItem = {
    id: string;
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
    title: string;
    description: string;
    subject: string;
    gradeLevel: string;
    scheduleDays: string;
    timeSlot: string;
    totalLessons: number;
    tuitionFee: number;
    coverImage: string | null;
    status: "draft" | "pending" | "approved" | "rejected" | "hidden" | "completed";
    studentCount: number;
    completedLessons: number;
    rejectReason: string | null;
    createdAt: string;
  };

  const [classes, setClasses] = useState<StaffClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [rejectingClass, setRejectingClass] = useState<StaffClassItem | null>(null);
  const [selectedClassRejectReason, setSelectedClassRejectReason] = useState(CLASS_REJECT_REASONS[0]);
  const [customClassRejectReason, setCustomClassRejectReason] = useState("");
  const [viewingClass, setViewingClass] = useState<StaffClassItem | null>(null);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/staff/classes");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể tải lớp học.");
      setClasses(data.classes || []);
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Không thể tải danh sách lớp học." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchClasses);
  }, [fetchClasses]);

  const handleReview = async (classId: string, action: "approve" | "reject" | "hide", rejectReason = "") => {
    if (action === "reject" && !rejectReason.trim()) return;
    setProcessingId(classId);
    try {
      const res = await fetch("/api/staff/classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, action, rejectReason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể cập nhật lớp học.");
      setClasses((current) => current.map((item) => (item.id === classId ? data.class : item)));
      if (action === "reject") {
        setRejectingClass(null);
        setCustomClassRejectReason("");
        setSelectedClassRejectReason(CLASS_REJECT_REASONS[0]);
      }
      setNotice({ type: "success", message: data.message || "Đã cập nhật lớp học." });
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Cập nhật lớp học thất bại." });
    } finally {
      setProcessingId(null);
    }
  };

  const confirmClassReject = () => {
    if (!rejectingClass) return;
    const reason = customClassRejectReason.trim() || selectedClassRejectReason;
    if (!reason.trim()) {
      setNotice({ type: "error", message: "Vui lòng nhập lý do từ chối lớp học." });
      return;
    }
    void handleReview(rejectingClass.id, "reject", reason);
  };
  const pendingClasses = classes.filter((item) => item.status === "pending");
  const reviewedClasses = classes.filter((item) => item.status !== "pending");

  const [classSearch, setClassSearch] = useState("");
  const [classSubjectFilter, setClassSubjectFilter] = useState("Tất cả môn học");
  const [classStatusFilter, setClassStatusFilter] = useState("Tất cả trạng thái");

  const filteredReviewedClasses = useMemo(() => {
    return reviewedClasses.filter((item) => {
      const q = classSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.teacherName.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q);
      const matchSubject =
        classSubjectFilter === "Tất cả môn học" ||
        item.subject.toLowerCase().includes(classSubjectFilter.toLowerCase());
      const matchStatus =
        classStatusFilter === "Tất cả trạng thái" ||
        (classStatusFilter === "Đã duyệt" && item.status === "approved") ||
        (classStatusFilter === "Đã ban" && item.status === "hidden") ||
        (classStatusFilter === "Từ chối" && item.status === "rejected") ||
        (classStatusFilter === "Hoàn thành" && item.status === "completed") ||
        (classStatusFilter === "Bản nháp" && item.status === "draft");
      return matchSearch && matchSubject && matchStatus;
    });
  }, [reviewedClasses, classSearch, classSubjectFilter, classStatusFilter]);

  const formatCurrency = (value: number) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;
  const formatSubmitted = (createdAt: string) => {
    if (!createdAt) return "Mới gửi";
    const [date] = createdAt.split("T");
    return date ? date.split("-").reverse().join("/") : "Mới gửi";
  };
  const getCover = (item: StaffClassItem) => item.coverImage || (item.subject.includes("Anh") || item.subject.includes("IELTS") ? "/classes/class-english.jpg" : item.subject.includes("Vật") || item.subject.includes("Hóa") ? "/classes/class-physics.jpg" : item.subject.includes("Văn") ? "/classes/class-literature.jpg" : "/classes/class-math.jpg");
  const getStatusTone = (status: StaffClassItem["status"]) => status === "approved" ? "bg-emerald-50 text-emerald-700" : status === "hidden" ? "bg-amber-50 text-amber-700" : status === "rejected" ? "bg-rose-50 text-rose-700" : status === "completed" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-700";
  const getStatusLabel = (status: StaffClassItem["status"]) => status === "approved" ? "Đã duyệt" : status === "hidden" ? "Đã ban" : status === "rejected" ? "Từ chối" : status === "completed" ? "Hoàn thành" : "Bản nháp";

  return (
    <div className="space-y-5">
      {notice && <div className={`rounded-2xl border px-4 py-3 text-sm font-bold ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{notice.message}</div>}

      <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Xác minh lớp học</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">Chấp nhận hoặc từ chối đơn đăng ký lớp học mới từ giảng viên.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">{isLoading ? "Đang tải" : `${pendingClasses.length} chờ duyệt`}</span>
        </div>
        {pendingClasses.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {pendingClasses.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="grid gap-4 p-4 sm:grid-cols-[170px_1fr]">
                  <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-100 sm:h-full">
                    <Image src={getCover(item)} alt={item.title} fill sizes="170px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="rounded-2xl bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">{item.subject}</span>
                      <span className="text-xs font-bold text-slate-400">{formatSubmitted(item.createdAt)}</span>
                    </div>
                    <h3 className="line-clamp-2 text-lg font-black leading-tight text-slate-950">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-500">{item.description || "Lớp học mới đang chờ staff kiểm tra nội dung và lịch học."}</p>
                    <p className="mt-3 text-sm font-black text-slate-700">{item.teacherName}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-black text-slate-500">
                      <span>{item.totalLessons} buổi</span><span>•</span><span>{item.gradeLevel}</span><span>•</span><span>{formatCurrency(item.tuitionFee)} / khóa</span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2 border-t border-slate-100 p-4 sm:grid-cols-3">
                  <button disabled={processingId === item.id} onClick={() => handleReview(item.id, "approve")} className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/20 disabled:opacity-60"><CheckCircle className="h-4 w-4" /> Chấp nhận</button>
                  <button onClick={() => setViewingClass(item)} className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700"><Eye className="h-4 w-4" /> Xem</button>
                  <button disabled={processingId === item.id} onClick={() => { setRejectingClass(item); setSelectedClassRejectReason(CLASS_REJECT_REASONS[0]); setCustomClassRejectReason(""); }} className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 text-sm font-black text-rose-600 disabled:opacity-60"><XCircle className="h-4 w-4" /> Từ chối</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">Không có lớp học nào đang chờ duyệt.</div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_200px_200px_auto]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={classSearch}
              onChange={(e) => setClassSearch(e.target.value)}
              placeholder="Tìm theo tên lớp, giáo viên, môn học..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {classSearch && (
              <button
                type="button"
                onClick={() => setClassSearch("")}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <CustomSelect
            value={classSubjectFilter}
            onChange={setClassSubjectFilter}
            options={[
              "Tất cả môn học",
              "Toán học",
              "Tiếng Anh",
              "Vật lý",
              "Hóa học",
              "Sinh học",
              "Ngữ văn",
              "Lịch sử",
              "Địa lý",
              "Tin học",
            ]}
            className="w-full"
            buttonClassName="h-12 rounded-2xl border-slate-200 text-sm font-bold text-slate-700"
          />
          <CustomSelect
            value={classStatusFilter}
            onChange={setClassStatusFilter}
            options={[
              "Tất cả trạng thái",
              "Đã duyệt",
              "Đã ban",
              "Từ chối",
              "Hoàn thành",
            ]}
            className="w-full"
            buttonClassName="h-12 rounded-2xl border-slate-200 text-sm font-bold text-slate-700"
          />
          <button
            type="button"
            onClick={fetchClasses}
            disabled={isLoading}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-xl font-black text-slate-950">Danh sách lớp học</h2>
          <span className="text-sm font-bold text-slate-400">Hiển thị {filteredReviewedClasses.length} / {classes.length} lớp học</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500"><tr><th className="px-4 py-3">Lớp học</th><th className="px-4 py-3">Giảng viên</th><th className="px-4 py-3">Môn học</th><th className="px-4 py-3">Số buổi</th><th className="px-4 py-3">Đánh giá</th><th className="px-4 py-3">Hành động</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviewedClasses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4"><p className="font-black text-slate-950">{item.title}</p>{item.rejectReason && <p className="mt-1 text-xs font-bold text-rose-500">Lý do: {item.rejectReason}</p>}</td>
                  <td className="px-4 py-4 font-bold text-slate-600">{item.teacherName}</td>
                  <td className="px-4 py-4"><span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{item.subject}</span></td>
                  <td className="px-4 py-4 font-bold text-slate-600">{item.totalLessons} buổi</td>
                  <td className="px-4 py-4"><span className={`rounded-xl px-3 py-1 text-xs font-black ${getStatusTone(item.status)}`}>● {getStatusLabel(item.status)}</span></td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2"><button onClick={() => setViewingClass(item)} className="flex h-8 items-center gap-1 rounded-xl border border-slate-200 px-2 text-xs font-black text-slate-700"><Eye className="h-4 w-4" /> Xem</button><button disabled={processingId === item.id} onClick={() => handleReview(item.id, "hide")} className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-2 text-xs font-black text-rose-600 disabled:opacity-60"><ShieldCheck className="h-4 w-4" /> Ban</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    

      {viewingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-2xl shadow-slate-950/20">
            <div className="relative h-40 bg-emerald-900">
              <Image src={getCover(viewingClass)} alt={viewingClass.title} fill sizes="720px" className="object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/50 to-transparent" />
              <button type="button" onClick={() => setViewingClass(null)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-5 left-5 right-16">
                <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-black text-emerald-700">{viewingClass.subject}</span>
                <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight text-white">{viewingClass.title}</h3>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Giảng viên</p>
                <p className="mt-1 text-sm font-black text-slate-900">{viewingClass.teacherName}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{viewingClass.teacherEmail || "Chưa có email"}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Trạng thái</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${getStatusTone(viewingClass.status)}`}>● {getStatusLabel(viewingClass.status)}</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Lịch học</p>
                <p className="mt-1 text-sm font-black text-slate-900">{viewingClass.scheduleDays}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{viewingClass.timeSlot}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Thông tin khóa</p>
                <p className="mt-1 text-sm font-black text-slate-900">{viewingClass.totalLessons} buổi · {viewingClass.gradeLevel}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{formatCurrency(viewingClass.tuitionFee)} / khóa</p>
              </div>
            </div>

            <div className="border-t border-slate-100 px-5 pb-5">
              <p className="pt-4 text-xs font-black uppercase tracking-wide text-slate-400">Mô tả lớp học</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">
                {viewingClass.description || "Lớp học chưa có mô tả chi tiết."}
              </p>
              {viewingClass.rejectReason && (
                <p className="mt-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-700">
                  Lý do từ chối: {viewingClass.rejectReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {rejectingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-rose-100 bg-white p-5 shadow-2xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-950">Từ chối lớp học</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Lớp: <strong className="text-slate-800">{rejectingClass.title}</strong> · {rejectingClass.teacherName}
                </p>
              </div>
              <button type="button" onClick={() => setRejectingClass(null)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {CLASS_REJECT_REASONS.map((reason) => (
                <label key={reason} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-xs font-bold transition ${selectedClassRejectReason === reason && !customClassRejectReason ? "border-rose-400 bg-rose-50/70 text-rose-950" : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100/70"}`}>
                  <input
                    type="radio"
                    name="classRejectReason"
                    checked={selectedClassRejectReason === reason && !customClassRejectReason}
                    onChange={() => {
                      setSelectedClassRejectReason(reason);
                      setCustomClassRejectReason("");
                    }}
                    className="mt-0.5 accent-rose-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Lý do khác</span>
              <textarea
                value={customClassRejectReason}
                onChange={(event) => setCustomClassRejectReason(event.target.value)}
                placeholder="Nhập lý do cụ thể nếu các mẫu trên chưa phù hợp..."
                className="mt-2 min-h-[92px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setRejectingClass(null)} className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50">
                Hủy
              </button>
              <button type="button" disabled={processingId === rejectingClass.id} onClick={confirmClassReject} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-black text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 disabled:opacity-50">
                {processingId === rejectingClass.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
type StaffMaterialItem = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  fileType: "PDF" | "DOCX";
  fileName: string;
  fileSize: number;
  fileKey: string;
  pageCount: number;
  status: "draft" | "pending" | "approved" | "rejected" | "hidden";
  downloadCount: number;
  viewCount: number;
  ratingAvg: number;
  ratingCount: number;
  rejectReason: string | null;
  createdAt: string;
};

const MATERIAL_REVIEW_STYLES = [
  { bg: "from-[#e36f1f] to-[#bf5a18]", accent: "bg-orange-400/25", pattern: "waves" },
  { bg: "from-[#c04576] to-[#a64b71]", accent: "bg-pink-200/20", pattern: "waves" },
  { bg: "from-[#c45143] to-[#9f3d36]", accent: "bg-red-200/20", pattern: "confetti" },
  { bg: "from-[#7356bc] to-[#5b45a3]", accent: "bg-violet-200/20", pattern: "confetti" },
];

const MATERIAL_REJECT_REASONS = [
  "File tài liệu bị lỗi, không mở được hoặc không đúng định dạng PDF/DOCX.",
  "Nội dung tài liệu chưa đầy đủ, cần bổ sung mô tả, tiêu đề hoặc thông tin lớp học.",
  "Tài liệu chưa phù hợp với môn học, lớp học hoặc chủ đề đã chọn.",
  "Tài liệu có chất lượng trình bày chưa đạt, cần chỉnh sửa bố cục hoặc nội dung trước khi duyệt.",
  "Tài liệu có dấu hiệu trùng lặp hoặc cần xác minh thêm nguồn nội dung.",
];

function formatFileSize(size: number) {
  if (!size) return "0 MB";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function MaterialManagementPanel() {
  const [materials, setMaterials] = useState<StaffMaterialItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [rejectingMaterial, setRejectingMaterial] = useState<StaffMaterialItem | null>(null);
  const [selectedMaterialRejectReason, setSelectedMaterialRejectReason] = useState(MATERIAL_REJECT_REASONS[0]);
  const [customMaterialRejectReason, setCustomMaterialRejectReason] = useState("");

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/staff/materials");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể tải danh sách tài liệu.");
      setMaterials(data.materials || []);
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Không thể tải tài liệu." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchMaterials);
  }, [fetchMaterials]);

  const handleReview = async (materialId: string, action: "approve" | "reject" | "hide", rejectReason = "") => {
    setProcessingId(materialId);
    try {
      const res = await fetch("/api/staff/materials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId, action, rejectReason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể cập nhật tài liệu.");
      setNotice({ type: "success", message: data.message });
      setMaterials((current) => current.map((item) => (item.id === materialId ? { ...item, status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "hidden", rejectReason: action === "reject" ? rejectReason : null } : item)));
      if (action === "reject") {
        setRejectingMaterial(null);
        setCustomMaterialRejectReason("");
        setSelectedMaterialRejectReason(MATERIAL_REJECT_REASONS[0]);
      }
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Thao tác duyệt thất bại." });
    } finally {
      setProcessingId(null);
    }
  };

  const confirmMaterialReject = () => {
    if (!rejectingMaterial) return;
    const reason = customMaterialRejectReason.trim() || selectedMaterialRejectReason;
    if (!reason.trim()) {
      setNotice({ type: "error", message: "Vui lòng nhập lý do từ chối tài liệu." });
      return;
    }
    void handleReview(rejectingMaterial.id, "reject", reason);
  };

  const handleView = (materialId: string) => {
    window.open(`/materials/preview?id=${encodeURIComponent(materialId)}`, "_blank", "noopener,noreferrer");
  };

  const pendingMaterials = materials.filter((item) => item.status === "pending");
  const reviewedMaterials = materials.filter((item) => item.status === "approved");

  return (
    <div className="space-y-5">
      {notice && <div className={`rounded-2xl border px-4 py-3 text-sm font-bold ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{notice.message}</div>}

      <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Kiểm duyệt tài liệu</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">Chấp nhận hoặc từ chối tài liệu PDF/DOCX do giáo viên tải lên Cloudflare R2.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">{isLoading ? "Đang tải" : `${pendingMaterials.length} chờ duyệt`}</span>
        </div>
        {pendingMaterials.length ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {pendingMaterials.map((item, index) => {
              const style = MATERIAL_REVIEW_STYLES[index % MATERIAL_REVIEW_STYLES.length];
              return (
                <article key={item.id} className={`relative min-h-[430px] overflow-hidden rounded-3xl bg-gradient-to-br ${style.bg} p-6 text-white shadow-sm`}>
                  <div className="pointer-events-none absolute inset-0 opacity-70">
                    {style.pattern === "waves" ? <><span className={`absolute -left-16 top-20 h-40 w-80 rounded-[50%] ${style.accent}`} /><span className={`absolute -bottom-16 right-0 h-40 w-80 rounded-[50%] ${style.accent}`} /></> : <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.10)_0_14px,transparent_14px_42px)]" />}
                  </div>
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-14 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide"><span>EDUMI | {item.subject}</span><span className="rounded-full bg-white/20 px-2 py-1">{item.fileType}</span></div>
                    <div className="flex-1">
                      <h3 className="text-4xl font-black leading-none">{item.gradeLevel || item.subject.toUpperCase()}</h3>
                      <p className="mt-5 line-clamp-2 text-xl font-black leading-tight">{item.title}</p>
                      <p className="mt-4 text-sm font-bold text-white/85">{item.teacherName}</p>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold text-white/75">{item.description || item.fileName}</p>
                      <div className="mt-5 flex items-center gap-3 text-sm font-black text-white/90"><span>{formatFileSize(item.fileSize)}</span><span className="h-5 w-px bg-white/40" /><span>{item.pageCount || "--"} trang</span></div>
                    </div>
                    <div className="mt-8 grid gap-2 sm:grid-cols-3">
                      <button disabled={processingId === item.id} onClick={() => handleReview(item.id, "approve")} className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-emerald-700 disabled:opacity-60"><CheckCircle className="h-4 w-4" /> Chấp nhận</button>
                      <button onClick={() => handleView(item.id)} className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-slate-800"><Eye className="h-4 w-4" /> Xem</button>
                      <button disabled={processingId === item.id} onClick={() => { setRejectingMaterial(item); setSelectedMaterialRejectReason(MATERIAL_REJECT_REASONS[0]); setCustomMaterialRejectReason(""); }} className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/90 text-sm font-black text-rose-600 disabled:opacity-60"><XCircle className="h-4 w-4" /> Từ chối</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">Không có tài liệu nào đang chờ duyệt.</div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_auto]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><Search className="h-5 w-5 text-slate-400" /><span className="text-sm font-bold text-slate-400">Tìm theo tên tài liệu, giáo viên, môn học...</span></div>
          {["Loại tài liệu", "Đánh giá"].map((label) => <button key={label} className="flex h-12 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600">{label}<ChevronDown className="h-4 w-4" /></button>)}
          <button onClick={fetchMaterials} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"><RotateCcw className="h-4 w-4" /> Làm mới</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="text-xl font-black text-slate-950">Danh sách tài liệu</h2><span className="text-sm font-bold text-slate-400">Hiển thị {reviewedMaterials.length} / {materials.length} tài liệu</span></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500"><tr><th className="px-4 py-3">Tài liệu</th><th className="px-4 py-3">Giảng viên</th><th className="px-4 py-3">Môn học</th><th className="px-4 py-3">Loại</th><th className="px-4 py-3">Lượt xem</th><th className="px-4 py-3">Đánh giá</th><th className="px-4 py-3">Hành động</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {reviewedMaterials.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4"><p className="font-black text-slate-950">{item.title}</p></td>
                  <td className="px-4 py-4 font-bold text-slate-600">{item.teacherName}</td>
                  <td className="px-4 py-4"><span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{item.subject}</span></td>
                  <td className="px-4 py-4 font-bold text-slate-600">{item.fileType}</td>
                  <td className="px-4 py-4 font-bold text-slate-600">{item.viewCount}</td>
                  <td className="px-4 py-4"><span className="rounded-xl bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">★ {item.ratingAvg || "Mới"}</span></td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2"><button onClick={() => handleView(item.id)} className="flex h-8 items-center gap-1 rounded-xl border border-slate-200 px-2 text-xs font-black text-slate-700"><Eye className="h-4 w-4" /> Xem</button><button disabled={processingId === item.id} onClick={() => handleReview(item.id, "hide")} className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-rose-50 px-2 text-xs font-black text-rose-600 disabled:cursor-not-allowed disabled:opacity-55"><ShieldCheck className="h-4 w-4" /> Ban</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {rejectingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-[28px] border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-black text-slate-950">Từ chối tài liệu giảng dạy</h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                  Tài liệu: <strong className="text-slate-800">{rejectingMaterial.title}</strong> · {rejectingMaterial.teacherName}
                </p>
              </div>
              <button type="button" onClick={() => setRejectingMaterial(null)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <label className="text-xs font-extrabold text-slate-700">Chọn lý do từ chối để thông báo tới giáo viên:</label>
              <div className="space-y-1.5">
                {MATERIAL_REJECT_REASONS.map((reason) => (
                  <label key={reason} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-xs font-bold transition ${selectedMaterialRejectReason === reason && !customMaterialRejectReason ? "border-rose-400 bg-rose-50/70 text-rose-950" : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100/70"}`}>
                    <input
                      type="radio"
                      name="materialRejectReason"
                      checked={selectedMaterialRejectReason === reason && !customMaterialRejectReason}
                      onChange={() => {
                        setSelectedMaterialRejectReason(reason);
                        setCustomMaterialRejectReason("");
                      }}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700">Hoặc nhập lý do chi tiết khác:</label>
                <textarea
                  rows={2}
                  value={customMaterialRejectReason}
                  onChange={(event) => setCustomMaterialRejectReason(event.target.value)}
                  placeholder="Nhập lý do cụ thể hoặc hướng dẫn giáo viên chỉnh sửa tài liệu..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 shadow-inner outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setRejectingMaterial(null)} className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50">
                Hủy bỏ
              </button>
              <button type="button" disabled={processingId === rejectingMaterial.id} onClick={confirmMaterialReject} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-black text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 disabled:opacity-50">
                {processingId === rejectingMaterial.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                <span>Xác nhận từ chối</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
    void Promise.resolve().then(fetchOverviewData);
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
    <StaffMaterialManagementPanel staffName={staff.fullName} staffId={staff.id} defaultSubTab="manage" />
  ) : activeTab === "teachers" ? (
    <TeacherApprovalPanel onStatsChange={handleTeacherStatsChange} />
  ) : activeTab === "examPosts" ? (
    <StaffExamManagementPanel staffName={staff.fullName} staffId={staff.id} />
  ) : activeTab === "materialPosts" ? (
    <StaffMaterialManagementPanel staffName={staff.fullName} staffId={staff.id} defaultSubTab="create" />
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
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          pendingCount={pendingTeacherCount}
          staff={staff}
        />
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="relative z-10 h-full w-64">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              collapsed={false}
              onToggle={() => setIsMobileSidebarOpen(false)}
              pendingCount={pendingTeacherCount}
              staff={staff}
            />
          </div>
        </div>
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          staff={staff}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={onLogout}
          onNavigate={setActiveTab}
          pendingTeacherCount={pendingTeacherCount}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">{content}</div>
        </main>
      </div>
    </div>
  );
}
