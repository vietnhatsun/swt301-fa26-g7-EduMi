"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Sun,
  UsersRound,
  WalletCards,
} from "lucide-react";

type TeacherTabId =
  | "overview"
  | "classes"
  | "students"
  | "materials"
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
      { id: "classes", label: "Lớp giảng dạy", icon: GraduationCap },
      { id: "students", label: "Học viên", icon: UsersRound },
      { id: "materials", label: "Tài liệu", icon: BookOpen },
      { id: "grading", label: "Bài tập & Chấm điểm", icon: ClipboardCheck, badge: "12" },
      { id: "schedule", label: "Lịch dạy", icon: CalendarDays },
      { id: "messages", label: "Tin nhắn", icon: MessageSquare, badge: "3" },
      { id: "notifications", label: "Thông báo", icon: Bell, badge: "5" },
    ],
  },
  {
    title: "Tài khoản",
    items: [
      { id: "personal", label: "Hồ sơ cá nhân", icon: ShieldCheck },
      { id: "income", label: "Thu nhập", icon: WalletCards },
    ],
  },
];

const scheduleItems = [
  { time: "08:00", end: "09:30", title: "Lớp IELTS Foundation", tag: "IELTS", meta: "Unit 3: Daily Life - Listening", students: "32 học viên", room: "Phòng học Online", live: true, color: "bg-emerald-500" },
  { time: "10:00", end: "11:30", title: "Lớp 9A - Tiếng Anh", tag: "THCS", meta: "Unit 2: Communication", students: "28 học viên", room: "Phòng 203", live: false, color: "bg-blue-500" },
  { time: "13:30", end: "15:00", title: "Lớp IELTS Speaking", tag: "IELTS", meta: "Speaking Part 2 - Practice", students: "18 học viên", room: "Phòng học Online", live: true, color: "bg-orange-500" },
  { time: "19:00", end: "20:30", title: "Lớp 10A - Tiếng Anh", tag: "THPT", meta: "Review & Test", students: "26 học viên", room: "Phòng học Online", live: false, color: "bg-violet-500" },
];

const gradingItems = [
  { tag: "IELTS", title: "Writing Task 1 - Line graph", className: "Lớp IELTS Foundation", due: "Hạn: 24/9, 23:59", progress: "12/32" },
  { tag: "THCS", title: "Unit 2 - Vocabulary Quiz", className: "Lớp 9A - Tiếng Anh", due: "Hạn: 23/9, 23:59", progress: "18/28" },
  { tag: "IELTS", title: "Speaking Record - Part 2", className: "Lớp IELTS Speaking", due: "Hạn: 25/9, 23:59", progress: "8/18" },
  { tag: "THPT", title: "Reading Comprehension", className: "Lớp 10A - Tiếng Anh", due: "Hạn: 26/9, 23:59", progress: "15/26" },
];

const notices = [
  { icon: UsersRound, title: "Học viên mới tham gia lớp", desc: "Nguyễn Minh Anh đã tham gia lớp IELTS Foundation", time: "2 giờ trước", color: "bg-emerald-100 text-emerald-700" },
  { icon: FileText, title: "Nộp bài tập mới", desc: "Có 8 học viên đã nộp bài Writing Task 1", time: "4 giờ trước", color: "bg-violet-100 text-violet-700" },
  { icon: MessageSquare, title: "Tin nhắn mới từ học viên", desc: "Em không hiểu phần này ạ...", time: "6 giờ trước", color: "bg-blue-100 text-blue-700" },
  { icon: Star, title: "Lớp 9A đạt 90% hoàn thành", desc: "Tỷ lệ làm bài tuần này tăng tốt", time: "1 ngày trước", color: "bg-amber-100 text-amber-700" },
];

const monthDays = Array.from({ length: 30 }, (_, index) => index + 1);

function StatCard({ icon: Icon, label, value, hint, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; hint: string; tone: "green" | "blue" | "orange" | "purple" }) {
  const tones = {
    green: "border-emerald-200 bg-emerald-50/55 text-emerald-700",
    blue: "border-blue-200 bg-blue-50/65 text-blue-700",
    orange: "border-amber-200 bg-amber-50/65 text-orange-700",
    purple: "border-purple-200 bg-purple-50/65 text-purple-700",
  };

  return (
    <div className={`flex items-center gap-4 rounded-3xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/65">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm font-extrabold text-slate-700">{label}</p>
        <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        <p className="mt-1 text-xs font-bold text-emerald-600">{hint}</p>
      </div>
    </div>
  );
}

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
      <section className="relative overflow-hidden rounded-[28px] border border-emerald-200 bg-gradient-to-r from-[#006946] via-[#00a66f] to-[#7ee0b8] p-7 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Tổng quan giảng dạy · Bảng điều khiển giáo viên</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Chào {teacher.fullName}, chúc bạn một ngày giảng dạy hiệu quả! 🎉</h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold text-emerald-50 sm:text-base">Quản lý lớp học, theo dõi tiến độ học viên và lan tỏa tri thức cùng EduMi mỗi ngày.</p>
        </div>
        <Image src="/Capybara_EduMi_và_bảng_học_tập-removebg-preview.png" alt="EduMi teacher mascot" width={523} height={477} className="pointer-events-none absolute bottom-[-46px] right-8 hidden w-[270px] drop-shadow-2xl xl:block" />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Tổng số lớp giảng dạy" value="5" hint="↑ +1 lớp so với tháng trước" tone="green" />
        <StatCard icon={GraduationCap} label="Tổng học viên" value="128" hint="↑ +12 học viên mới" tone="blue" />
        <StatCard icon={FileText} label="Bài tập cần chấm" value="12" hint="↑ +5 bài so với hôm qua" tone="orange" />
        <StatCard icon={Star} label="Tỷ lệ hoàn thành bài tập" value="92%" hint="↑ +6% so với tuần trước" tone="purple" />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[26px] border border-amber-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950">Lịch dạy hôm nay</h2>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-700">Xem toàn bộ lịch →</button>
          </div>
          <div className="space-y-3">
            {scheduleItems.map((item) => (
              <div key={item.title} className="grid grid-cols-[74px_1fr_auto] items-center gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="text-sm font-black text-slate-700"><p>{item.time}</p><p className="text-slate-400">{item.end}</p></div>
                <div className="relative pl-5">
                  <span className={`absolute left-0 top-2 h-3 w-3 rounded-full ${item.color}`} />
                  <p className="font-black text-slate-900">{item.title} <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] text-rose-600">{item.tag}</span></p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{item.meta} · {item.students} · {item.room}</p>
                </div>
                <button className={`rounded-2xl px-4 py-2 text-xs font-black ${item.live ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-700"}`}>{item.live ? "Vào lớp" : "Xem chi tiết"}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-orange-200 bg-orange-50/45 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950">Bài tập cần chấm <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">12 bài</span></h2>
            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700">Xem tất cả →</button>
          </div>
          <div className="space-y-3">
            {gradingItems.map((item) => (
              <div key={item.title} className="grid grid-cols-[64px_1fr_auto_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <span className="rounded-xl bg-rose-100 px-3 py-2 text-center text-xs font-black text-rose-600">{item.tag}</span>
                <div><p className="font-black text-slate-900">{item.title}</p><p className="text-xs font-semibold text-slate-500">{item.className}</p></div>
                <div className="hidden text-xs font-bold text-red-500 md:block">{item.due}</div>
                <button className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-orange-500/20">Chấm bài</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_0.8fr_0.9fr]">
        <div className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950">Tiến độ học tập của lớp</h2>
            <span className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600">7 ngày qua</span>
          </div>
          <div className="flex h-56 items-end gap-5 border-b border-l border-slate-100 px-4 pb-4">
            {[45, 62, 58, 76, 69, 85, 78].map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">{value}%</span>
                <div className="w-full rounded-t-2xl bg-gradient-to-t from-amber-200 to-emerald-400" style={{ height: `${value * 1.55}px` }} />
                <span className="text-xs font-black text-slate-500">T{index + 2}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-amber-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black text-slate-950">Lịch tháng</h2><p className="text-sm font-black text-slate-700">Tháng 9/2025</p></div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-500">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => <span key={d}>{d}</span>)}
            {monthDays.map((day) => <span key={day} className={`rounded-full py-2 ${[17, 19, 22, 23, 24, 25, 27].includes(day) ? "bg-amber-100 text-amber-800" : ""} ${day === 23 ? "bg-emerald-600 text-white" : ""}`}>{day}</span>)}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black text-slate-950">Thông báo mới</h2><button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-600">Xem tất cả</button></div>
          <div className="space-y-3">
            {notices.map((notice) => {
              const Icon = notice.icon;
              return (
                <div key={notice.title} className="flex gap-3 rounded-2xl p-2 hover:bg-slate-50">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${notice.color}`}><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-slate-900">{notice.title}</p><p className="truncate text-xs font-semibold text-slate-500">{notice.desc}</p></div>
                  <span className="text-[11px] font-bold text-slate-400">{notice.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
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
        personal: "Hồ sơ cá nhân giáo viên",
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