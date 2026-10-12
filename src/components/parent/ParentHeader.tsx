"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Users,
  UserPlus,
} from "lucide-react";
import { ParentTabId } from "./ParentSidebar";

interface ParentHeaderProps {
  fullName?: string;
  activeChildName?: string;
  onTabChange?: (tab: ParentTabId) => void;
  onToggleMobileSidebar?: () => void;
  onLogout?: () => void;
}

export default function ParentHeader({
  fullName = "Phụ huynh EduMi",
  activeChildName,
  onTabChange,
  onToggleMobileSidebar,
  onLogout,
}: ParentHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between gap-3 select-none">
      {/* ── Left: Mobile Hamburger & Search Input ── */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm môn học, bài kiểm tra, hoạt động..."
            className="w-full pl-9 pr-12 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* ── Right: Active child indicator, Actions, and User Profile Chip ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active child badge */}
        {activeChildName ? (
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 shadow-sm"
            title={`Đang xem: ${activeChildName}`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800 truncate max-w-[120px]">
              {activeChildName}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange?.("link-child")}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-800 shadow-sm transition-all cursor-pointer"
            title="Nhấn để liên kết tài khoản học sinh"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold text-amber-900">
              Chưa liên kết con
            </span>
          </button>
        )}

        {/* Light mode indicator */}
        <button
          type="button"
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          title="Chế độ giao diện"
        >
          <Sun className="w-4 h-4 text-amber-500" />
        </button>

        {/* Notifications button */}
        <button
          type="button"
          onClick={() => onTabChange?.("notifications")}
          className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          title="Thông báo"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        {/* User Profile Chip */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 sm:pr-3 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#064e3b] text-white font-bold text-xs flex items-center justify-center shadow-sm flex-shrink-0">
              {fullName.charAt(0)}
            </div>
            <span className="hidden sm:inline-block text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[140px]">
              {fullName}
            </span>
            <ChevronDown className="hidden sm:inline-block w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-fade-in-up">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {fullName}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Phụ huynh EduMi</span>
                  </p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onTabChange?.("settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Thông tin tài khoản</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onTabChange?.("settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Cài đặt thông báo</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (onLogout) onLogout();
                      else window.location.href = "/login";
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
