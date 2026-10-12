"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Search,
  LinkIcon,
  Check,
  X,
  Users,
  ShieldCheck,
  Clock,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface LinkedChild {
  id: string;
  fullName: string;
  studentCode: string;
  grade: string;
  avatarUrl: string | null;
  schoolName: string;
  relationship?: string;
  linkedAt?: string;
}

interface ParentLinkChildTabProps {
  linkedChildren?: LinkedChild[];
  onLinkChild?: (child: LinkedChild) => void;
  onUnlinkChild?: (childId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const PRESET_STUDENTS: Record<
  string,
  { fullName: string; grade: string; schoolName: string }
> = {
  "EDM-784920": {
    fullName: "Nguyễn Minh Khang",
    grade: "Lớp 12A1",
    schoolName: "THPT Chuyên Hà Nội - Amsterdam",
  },
  "EDM-632190": {
    fullName: "Nguyễn Hà My",
    grade: "Lớp 9B",
    schoolName: "THCS Chu Văn An",
  },
};

export default function ParentLinkChildTab({
  linkedChildren = [],
  onLinkChild,
  onUnlinkChild,
  onNavigateTab,
}: ParentLinkChildTabProps) {
  const [studentCodeInput, setStudentCodeInput] = useState("");
  const [relationship, setRelationship] = useState("Bố");
  const [nickname, setNickname] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkResult, setLinkResult] = useState<{
    success: boolean;
    message: string;
    studentName?: string;
    studentCode?: string;
  } | null>(null);

  const handleLinkStudent = async (codeToLink?: string) => {
    const rawCode = (codeToLink || studentCodeInput).trim().toUpperCase();
    if (!rawCode) return;

    setIsLinking(true);
    setLinkResult(null);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Resolve student info from preset or format
    const preset = PRESET_STUDENTS[rawCode];
    const studentFullName =
      nickname.trim() || preset?.fullName || `Học sinh (${rawCode})`;
    const studentGrade = preset?.grade || "Lớp 12A1";
    const studentSchool = preset?.schoolName || "Trường THPT EduMi";

    const newChild: LinkedChild = {
      id: `child-${Date.now()}`,
      fullName: studentFullName,
      studentCode: rawCode,
      grade: studentGrade,
      avatarUrl: null,
      schoolName: studentSchool,
      relationship,
      linkedAt: new Date().toLocaleDateString("vi-VN"),
    };

    if (onLinkChild) {
      onLinkChild(newChild);
    }

    setLinkResult({
      success: true,
      message: `Đã kết nối thành công với tài khoản học sinh ${studentFullName}!`,
      studentName: studentFullName,
      studentCode: rawCode,
    });

    setStudentCodeInput("");
    setNickname("");
    setIsLinking(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          CỔNG PHỤ HUYNH · LIÊN KẾT TÀI KHOẢN
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Liên kết tài khoản con
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Nhập mã học sinh (VD: EDM-XXXXXX) do con cung cấp để liên kết và mở khoá theo dõi tiến độ học tập.
        </p>
      </div>

      {/* ── Link Student Form Card ── */}
      <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] text-white shadow-lg shadow-emerald-950/10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <UserPlus className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Thêm liên kết học sinh mới
              </h3>
              <p className="text-[11px] text-emerald-200/90 font-medium">
                Nhập mã học sinh được cung cấp từ ứng dụng học sinh
              </p>
            </div>
          </div>

          {/* Quick Demo Chips */}
          <div className="mb-4 p-3 rounded-xl bg-black/20 border border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gợi ý mã học sinh thử nghiệm nhanh:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setStudentCodeInput("EDM-784920");
                  setNickname("Nguyễn Minh Khang");
                }}
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-emerald-100 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>⭐ EDM-784920</span>
                <span className="opacity-70">(Nguyễn Minh Khang - 12A1)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStudentCodeInput("EDM-632190");
                  setNickname("Nguyễn Hà My");
                }}
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-emerald-100 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>⭐ EDM-632190</span>
                <span className="opacity-70">(Nguyễn Hà My - 9B)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Student code input */}
            <div>
              <label className="block text-[10px] font-bold text-emerald-200 mb-1 uppercase tracking-wider">
                Mã học sinh <span className="text-amber-300">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-emerald-200/60" />
                </div>
                <input
                  type="text"
                  value={studentCodeInput}
                  onChange={(e) => {
                    setStudentCodeInput(e.target.value.toUpperCase());
                    setLinkResult(null);
                  }}
                  placeholder="VD: EDM-784920"
                  className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/25 focus:bg-white/15 focus:border-amber-300 rounded-xl text-sm font-bold text-white placeholder-emerald-200/50 transition-all outline-none tracking-wider"
                />
              </div>
            </div>

            {/* Relationship select */}
            <div>
              <label className="block text-[10px] font-bold text-emerald-200 mb-1 uppercase tracking-wider">
                Quan hệ với học sinh
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/10 border border-white/25 focus:bg-white/15 focus:border-amber-300 rounded-xl text-sm font-bold text-white transition-all outline-none cursor-pointer appearance-none"
              >
                <option value="Bố" className="text-slate-900">Bố</option>
                <option value="Mẹ" className="text-slate-900">Mẹ</option>
                <option value="Người giám hộ" className="text-slate-900">Người giám hộ</option>
              </select>
            </div>
          </div>

          {/* Optional nickname */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-emerald-200 mb-1 uppercase tracking-wider">
              Tên hiển thị / Tên gọi của con (tuỳ chọn)
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="VD: Nguyễn Minh Khang, Bé Bắp, ..."
              className="w-full px-3 py-2.5 bg-white/10 border border-white/25 focus:bg-white/15 focus:border-amber-300 rounded-xl text-sm text-white placeholder-emerald-200/50 transition-all outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => handleLinkStudent()}
            disabled={!studentCodeInput.trim() || isLinking}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLinking ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý kết nối...</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                <span>Xác nhận liên kết học sinh</span>
              </>
            )}
          </button>

          {/* Result feedback */}
          {linkResult && (
            <div
              className={`mt-4 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                linkResult.success
                  ? "bg-emerald-500/25 border border-emerald-300/40"
                  : "bg-rose-500/25 border border-rose-300/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {linkResult.message}
                  </p>
                  <p className="text-xs text-emerald-200/80">
                    Mã học sinh: {linkResult.studentCode}
                  </p>
                </div>
              </div>

              {linkResult.success && onNavigateTab && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onNavigateTab("overview")}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Xem Tổng quan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab("activity")}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Nhật ký hoạt động</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      </div>

      {/* ── Linked Children List ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Con đã liên kết ({linkedChildren.length})
            </h3>
          </div>
          {linkedChildren.length > 0 && onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab("overview")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Vào xem học tập</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {linkedChildren.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">
              Chưa có tài khoản học sinh nào được liên kết
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vui lòng nhập mã học sinh ở form trên để bắt đầu theo dõi quá trình học tập của con.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {linkedChildren.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200/60 hover:bg-emerald-50/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 font-extrabold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
                    {child.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">
                        {child.fullName}
                      </p>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Đã kết nối
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-medium">
                      <span className="font-bold text-emerald-700">{child.studentCode}</span>
                      <span>·</span>
                      <span>{child.grade}</span>
                      <span>·</span>
                      <span>{child.schoolName || "EduMi"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab("overview")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Xem tiến độ
                    </button>
                  )}
                  {onUnlinkChild && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Bạn có chắc chắn muốn hủy liên kết với học sinh ${child.fullName}?`
                          )
                        ) {
                          onUnlinkChild(child.id);
                        }
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Hủy liên kết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── How it works info ── */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Cách lấy mã kết nối từ học sinh?
          </h3>
        </div>
        <ol className="text-xs text-slate-600 space-y-2 ml-6 list-decimal">
          <li className="leading-relaxed">
            Học sinh đăng nhập vào tài khoản EduMi → Vào trang <span className="font-bold text-emerald-700">Hồ sơ cá nhân</span>
          </li>
          <li className="leading-relaxed">
            Xem phần <span className="font-bold text-emerald-700">&quot;Mã học sinh&quot;</span>
          </li>
          <li className="leading-relaxed">
            Sao chép mã <span className="font-bold text-amber-700">EDM-XXXXXX</span> (ví dụ: EDM-784920) và gửi cho phụ huynh.
          </li>
          <li className="leading-relaxed">
            Phụ huynh nhập mã vào ô ở trên → Bấm &quot;Xác nhận liên kết&quot; là hoàn tất và có thể theo dõi ngay!
          </li>
        </ol>
      </div>
    </div>
  );
}
