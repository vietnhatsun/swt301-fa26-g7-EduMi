"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Clock,
  Target,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  ChevronDown,
} from "lucide-react";

export type ParentTabId =
  | "overview"
  | "progress"
  | "activity"
  | "goals"
  | "notifications"
  | "link-child"
  | "settings";

interface LinkedChild {
  id: string;
  fullName: string;
  studentCode: string;
  grade: string;
  avatarUrl: string | null;
}

interface ParentSidebarProps {
  activeTab: ParentTabId;
  onTabChange: (tab: ParentTabId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  parentName?: string;
  linkedChildren: LinkedChild[];
  activeChildId: string;
  onChildChange: (childId: string) => void;
  onLogout?: () => void;
}

export default function ParentSidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  parentName = "Phụ huynh EduMi",
  linkedChildren,
  activeChildId,
  onChildChange,
}: ParentSidebarProps) {
  const [isChildSelectorOpen, setIsChildSelectorOpen] = React.useState(false);

  const activeChild = linkedChildren.find((c) => c.id === activeChildId) || linkedChildren[0];

  const trackingNavItems: {
    id: ParentTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "progress", label: "Tiến độ học tập", icon: TrendingUp },
    { id: "activity", label: "Nhật ký hoạt động", icon: Clock },
    { id: "goals", label: "Mục tiêu & Thưởng", icon: Target, badge: "Mới" },
  ];

  const systemNavItems: {
    id: ParentTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "link-child", label: "Liên kết con", icon: UserPlus },
    { id: "settings", label: "Cài đặt", icon: Settings },
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
                  Cổng Phụ huynh
                </span>
              </div>
            )}
          </Link>

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

        {/* ── Child Selector ── */}
        {!isCollapsed && linkedChildren.length > 0 && (
          <div className="px-3 pt-4 pb-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsChildSelectorOpen(!isChildSelectorOpen)}
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 hover:bg-black/30 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      {activeChild?.fullName?.charAt(0) || "?"}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">
                        {activeChild?.fullName || "Chưa liên kết"}
                      </p>
                      <p className="text-[10px] text-emerald-200/80 font-medium">
                        {activeChild?.grade} · {activeChild?.studentCode}
                      </p>
                    </div>
                  </div>
                  {linkedChildren.length > 1 && (
                    <ChevronDown
                      className={`w-4 h-4 text-emerald-200 flex-shrink-0 transition-transform duration-200 ${
                        isChildSelectorOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </button>

              {/* Dropdown chọn con */}
              {isChildSelectorOpen && linkedChildren.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#064e3b] rounded-xl border border-white/15 shadow-xl overflow-hidden z-50">
                  {linkedChildren.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => {
                        onChildChange(child.id);
                        setIsChildSelectorOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                        child.id === activeChildId
                          ? "bg-amber-400/20 text-amber-300"
                          : "text-emerald-100 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full font-bold text-[10px] flex items-center justify-center flex-shrink-0 ${
                          child.id === activeChildId
                            ? "bg-amber-400 text-slate-900"
                            : "bg-white/15 text-white"
                        }`}
                      >
                        {child.fullName.charAt(0)}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold truncate">
                          {child.fullName}
                        </p>
                        <p className="text-[10px] opacity-70">
                          {child.grade} · {child.studentCode}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isCollapsed && linkedChildren.length > 0 && (
          <div className="px-3 pt-4 pb-2 flex justify-center">
            <div
              className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 font-bold text-sm flex items-center justify-center shadow-sm cursor-pointer"
              title={activeChild?.fullName || "Học sinh"}
            >
              {activeChild?.fullName?.charAt(0) || "?"}
            </div>
          </div>
        )}

        {/* ── Section: THEO DÕI CON ── */}
        <div className="px-3 py-4">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              Theo dõi học tập
            </div>
          )}
          <nav className="space-y-1">
            {trackingNavItems.map((item) => {
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

        {/* ── Section: HỆ THỐNG ── */}
        <div className="px-3 py-2 border-t border-white/10">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              Quản lý
            </div>
          )}
          <nav className="space-y-1">
            {systemNavItems.map((item) => {
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
      </div>

      {/* ── Bottom User Card ── */}
      <div className="p-3 border-t border-white/10 bg-black/10">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Users className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-emerald-200 font-medium">
                  Phụ huynh
                </p>
                <p className="text-xs font-bold text-white tracking-wide truncate">
                  {parentName}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center p-2 rounded-xl bg-black/20 border border-white/10"
            title={`Phụ huynh: ${parentName}`}
          >
            <Users className="w-4 h-4 text-amber-300" />
          </div>
        )}
      </div>
    </aside>
  );
}
