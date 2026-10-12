"use client";

import React from "react";
import { UserPlus, ShieldAlert, Sparkles, ArrowRight, KeyRound } from "lucide-react";

interface ParentEmptyChildStateProps {
  title?: string;
  description?: string;
  featureName?: string;
  onNavigateTab: (tab: string) => void;
  onQuickLink?: (code: string) => void;
}

export default function ParentEmptyChildState({
  title = "Chưa liên kết tài khoản học sinh",
  description = "Bạn cần nhập mã định danh của học sinh (do con cung cấp) để mở khoá toàn bộ dữ liệu học tập, điểm số và bài tập trên hệ thống.",
  featureName = "tính năng theo dõi",
  onNavigateTab,
  onQuickLink,
}: ParentEmptyChildStateProps) {
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="relative rounded-3xl bg-gradient-to-b from-white via-white to-emerald-50/40 border border-emerald-100/90 shadow-[0_12px_40px_rgba(6,78,59,0.06)] p-6 sm:p-10 text-center overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-emerald-400/10 blur-3xl rounded-full pointer-events-none" />

        {/* Icon Header */}
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-amber-400/15 border-2 border-amber-300/40 flex items-center justify-center text-amber-600 shadow-md shadow-amber-400/10 mb-5">
          <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 animate-pulse" />
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-sm">
            <KeyRound className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Yêu cầu liên kết tài khoản</span>
        </div>

        {/* Main Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
          {description}
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => onNavigateTab("link-child")}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nhập mã liên kết học sinh ngay</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Quick Demo Linking Chips */}
        {onQuickLink && (
          <div className="pt-5 border-t border-slate-100 mb-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Thử nghiệm nhanh với tài khoản mẫu
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onQuickLink("EDM-784920")}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-bold transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Nguyễn Minh Khang (EDM-784920)</span>
              </button>
              <button
                type="button"
                onClick={() => onQuickLink("EDM-632190")}
                className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200/80 text-teal-900 text-xs font-bold transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>Nguyễn Hà My (EDM-632190)</span>
              </button>
            </div>
          </div>
        )}

        {/* 3 Step Guide Box */}
        <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 text-left">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800">
              3 bước đơn giản để kết nối với con:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
              <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] text-center leading-5 mb-1.5">
                1
              </span>
              <p className="font-bold text-slate-900 mb-0.5">Lấy mã EDM</p>
              <p className="text-[11px] text-slate-500">
                Học sinh đăng nhập và sao chép mã kết nối ở trang cá nhân.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
              <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] text-center leading-5 mb-1.5">
                2
              </span>
              <p className="font-bold text-slate-900 mb-0.5">Nhập mã vào cổng</p>
              <p className="text-[11px] text-slate-500">
                Dán mã học sinh vào ô kết nối trong tab &quot;Liên kết con&quot;.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
              <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] text-center leading-5 mb-1.5">
                3
              </span>
              <p className="font-bold text-slate-900 mb-0.5">Theo dõi tức thì</p>
              <p className="text-[11px] text-slate-500">
                Hệ thống đồng bộ toàn bộ bảng điểm, bài tập và thời gian học.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
