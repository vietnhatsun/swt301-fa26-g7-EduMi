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
} from "lucide-react";

/* ── Mock data ── */

const LINKED_CHILDREN = [
  {
    id: "child-1",
    fullName: "Nguyễn Văn Nam",
    studentCode: "EDM-749201",
    grade: "Lớp 12",
    school: "THPT Chuyên Lê Hồng Phong",
    relationship: "Bố",
    status: "active" as const,
    linkedAt: "15/09/2026",
    avatarUrl: null,
  },
  {
    id: "child-2",
    fullName: "Nguyễn Thị Hoa",
    studentCode: "EDM-385742",
    grade: "Lớp 10",
    school: "THPT Nguyễn Thượng Hiền",
    relationship: "Bố",
    status: "active" as const,
    linkedAt: "20/09/2026",
    avatarUrl: null,
  },
];

const PENDING_REQUESTS = [
  {
    id: "req-1",
    studentCode: "EDM-192847",
    relationship: "Bố",
    status: "pending" as const,
    requestedAt: "06/10/2026",
  },
];

export default function ParentLinkChildTab() {
  const [studentCodeInput, setStudentCodeInput] = useState("");
  const [relationship, setRelationship] = useState("Bố");
  const [nickname, setNickname] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkResult, setLinkResult] = useState<{
    success: boolean;
    message: string;
    studentName?: string;
  } | null>(null);

  const handleLinkStudent = async () => {
    if (!studentCodeInput.trim()) return;

    setIsLinking(true);
    setLinkResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response
    if (studentCodeInput.toUpperCase().startsWith("EDM-")) {
      setLinkResult({
        success: true,
        message: "Đã gửi yêu cầu liên kết! Đang chờ học sinh xác nhận.",
        studentName: "Nguyễn Văn Minh",
      });
    } else {
      setLinkResult({
        success: false,
        message: "Không tìm thấy mã học sinh này. Vui lòng kiểm tra lại.",
      });
    }

    setIsLinking(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          CỔNG PHỤ HUYNH · LIÊN KẾT
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Liên kết tài khoản con
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Nhập mã học sinh (VD: EDM-XXXXXX) mà con đã cung cấp để liên kết và theo dõi tiến độ học tập.
        </p>
      </div>

      {/* ── Link Student Form ── */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] text-white shadow-lg shadow-emerald-950/10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Thêm con mới
              </h3>
              <p className="text-[10px] text-emerald-200/80 font-medium">
                Nhập mã kết nối từ trang hồ sơ của học sinh
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Student code input */}
            <div>
              <label className="block text-[10px] font-bold text-emerald-200 mb-1 uppercase tracking-wider">
                Mã học sinh
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-emerald-200/50" />
                </div>
                <input
                  type="text"
                  value={studentCodeInput}
                  onChange={(e) => {
                    setStudentCodeInput(e.target.value.toUpperCase());
                    setLinkResult(null);
                  }}
                  placeholder="EDM-XXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 focus:bg-white/15 focus:border-amber-300/60 rounded-xl text-sm font-bold text-white placeholder-emerald-200/50 transition-all outline-none tracking-wider"
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
                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 focus:bg-white/15 focus:border-amber-300/60 rounded-xl text-sm font-bold text-white transition-all outline-none cursor-pointer appearance-none"
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
              Tên gọi thân mật (tuỳ chọn)
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="VD: Con trai, Bé Na, ..."
              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 focus:bg-white/15 focus:border-amber-300/60 rounded-xl text-sm text-white placeholder-emerald-200/50 transition-all outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleLinkStudent}
            disabled={!studentCodeInput.trim() || isLinking}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLinking ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Đang tìm kiếm...</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                <span>Gửi yêu cầu liên kết</span>
              </>
            )}
          </button>

          {/* Result feedback */}
          {linkResult && (
            <div
              className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                linkResult.success
                  ? "bg-emerald-500/20 border border-emerald-300/30"
                  : "bg-rose-500/20 border border-rose-300/30"
              }`}
            >
              {linkResult.success ? (
                <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-rose-300 flex-shrink-0" />
              )}
              <div>
                <p className="text-xs font-bold text-white">
                  {linkResult.success && linkResult.studentName
                    ? `Tìm thấy: ${linkResult.studentName}`
                    : "Lỗi"}
                </p>
                <p className="text-[10px] text-emerald-100/80">
                  {linkResult.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* ── Pending Requests ── */}
      {PENDING_REQUESTS.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/60">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-900">
              Đang chờ xác nhận ({PENDING_REQUESTS.length})
            </h3>
          </div>
          <div className="space-y-2">
            {PENDING_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-amber-200/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Mã: {req.studentCode}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Quan hệ: {req.relationship} · Gửi: {req.requestedAt}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  Chờ học sinh duyệt
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Linked Children List ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Con đã liên kết ({LINKED_CHILDREN.length})
          </h3>
        </div>

        <div className="space-y-3">
          {LINKED_CHILDREN.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200/60 hover:bg-emerald-50/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
                  {child.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      {child.fullName}
                    </p>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Đã kết nối
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
                    <span className="font-bold text-emerald-700">{child.studentCode}</span>
                    <span>·</span>
                    <span>{child.grade}</span>
                    <span>·</span>
                    <span>{child.school}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Quan hệ: {child.relationship} · Liên kết: {child.linkedAt}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                title="Hủy liên kết"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works info ── */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Cách lấy mã kết nối?
          </h3>
        </div>
        <ol className="text-xs text-slate-600 space-y-2 ml-6 list-decimal">
          <li className="leading-relaxed">
            Con đăng nhập vào tài khoản EduMi → Vào trang <span className="font-bold text-emerald-700">Hồ sơ cá nhân</span>
          </li>
          <li className="leading-relaxed">
            Chọn tab <span className="font-bold text-emerald-700">&quot;Thông tin cá nhân & Mã học sinh&quot;</span>
          </li>
          <li className="leading-relaxed">
            Sao chép mã <span className="font-bold text-amber-700">EDM-XXXXXX</span> và gửi cho phụ huynh qua Zalo, tin nhắn, v.v.
          </li>
          <li className="leading-relaxed">
            Phụ huynh nhập mã vào ô ở trên → Con xác nhận trên hệ thống → Hoàn tất!
          </li>
        </ol>
      </div>
    </div>
  );
}
