"use client";

import React from "react";
import { X, Bell } from "lucide-react";
import { ProfileTabId } from "./ProfileSidebar";

export interface NotificationItem {
  id: string;
  title: string;
  timeAgo: string;
  isRead: boolean;
  tabTarget?: ProfileTabId;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  fullName?: string;
  notifications: NotificationItem[];
  onSelectNotification: (item: NotificationItem) => void;
  onViewAllPosts: () => void;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
  fullName = "Học sinh",
  notifications,
  onSelectNotification,
  onViewAllPosts,
}: NotificationDropdownProps) {
  if (!isOpen) return null;

  // Lấy tên ngắn (First name / Display name)
  const displayName = fullName.split(" ").slice(-2).join(" ") || fullName;

  return (
    <>
      {/* ── Overlay click outside để đóng ── */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Dropdown Modal Container (Nhỏ gọn) ── */}
      <div className="absolute right-0 top-full mt-2 w-[285px] sm:w-[315px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 origin-top-right">
        {/* ── Header: Tiêu đề + Nút đóng ── */}
        <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 bg-white">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Thông báo
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="w-5.5 h-5.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Body: Danh sách 3 thông báo nhỏ gọn ── */}
        <div className="divide-y divide-slate-100 bg-white select-text">
          {notifications.length === 0 ? (
            <div className="py-8 px-3 text-center">
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Bell className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Chưa có thông báo mới nào
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                className={`p-2.5 sm:px-3.5 sm:py-3 transition-colors cursor-pointer text-left flex items-start justify-between gap-2.5 ${
                  item.isRead
                    ? "hover:bg-slate-50/80 bg-white"
                    : "bg-emerald-50/30 hover:bg-emerald-50/60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-xs leading-relaxed text-slate-800 font-medium">
                    <span className="text-[#3f5a36] font-bold">
                      {displayName} ơi
                    </span>
                    , có bài viết mới{" "}
                    <span className="font-semibold text-slate-900">
                      &quot;{item.title}&quot;
                    </span>{" "}
                    đó!
                  </p>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                    {item.timeAgo}
                  </span>
                </div>

                {!item.isRead && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 flex-shrink-0 mt-1"
                    title="Chưa đọc"
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* ── Footer: Xem tất cả bài viết ── */}
        <button
          type="button"
          onClick={onViewAllPosts}
          className="w-full py-2.5 px-3 text-center text-xs font-bold text-[#3f5a36] hover:text-[#283b23] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 border-t border-slate-100 cursor-pointer"
        >
          <span>Xem tất cả bài viết</span>
          <span className="text-sm leading-none">→</span>
        </button>
      </div>
    </>
  );
}
