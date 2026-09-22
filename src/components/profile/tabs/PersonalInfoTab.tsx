"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  Copy,
  Check,
  Save,
  ShieldCheck,
  Info,
} from "lucide-react";

interface PersonalInfoTabProps {
  initialFullName?: string;
  initialEmail?: string;
  studentCode?: string;
}

export default function PersonalInfoTab({
  initialFullName = "Nguyễn Ngọc Thạch 2k3",
  initialEmail = "student@edumi.vn",
  studentCode = "EDM-784920",
}: PersonalInfoTabProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("0912 345 678");
  const [school, setSchool] = useState("THPT Chuyên Lê Hồng Phong");
  const [grade, setGrade] = useState("Lớp 12");
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    if (initialFullName) setFullName(initialFullName);
    if (initialEmail) setEmail(initialEmail);
  }, [initialFullName, initialEmail]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(studentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          HỒ SƠ CÁ NHÂN · THÔNG TIN TÀI KHOẢN
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Thông tin cá nhân & Mã học sinh
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quản lý thông tin hồ sơ và mã định danh kết nối với phụ huynh.
        </p>
      </div>

      {/* ── Student Code Highlight Card ── */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] text-white shadow-lg shadow-emerald-950/10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-emerald-100">
              Mã kết nối phụ huynh
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Đã xác thực
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-wider text-amber-300 mt-1">
            {studentCode}
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1.5 leading-relaxed max-w-md">
            Cung cấp mã này cho phụ huynh để liên kết tài khoản và cho phép phụ huynh theo dõi bảng điểm rèn luyện.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064e3b] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Đã sao chép!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Sao chép mã</span>
            </>
          )}
        </button>
      </div>

      {/* ── Form Profile Details ── */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Họ và tên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-slate-900 transition-all outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-xs sm:text-sm cursor-not-allowed outline-none"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Email dùng để đăng nhập và nhận thông báo OTP.
            </span>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Số điện thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-slate-900 transition-all outline-none"
              />
            </div>
          </div>

          {/* School Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Trường học
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <School className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-slate-900 transition-all outline-none"
              />
            </div>
          </div>

          {/* Grade Level */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Khối lớp
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-slate-900 transition-all outline-none cursor-pointer"
              >
                <option value="Lớp 10">Lớp 10</option>
                <option value="Lớp 11">Lớp 11</option>
                <option value="Lớp 12">Lớp 12 (Ôn thi THPTQG)</option>
                <option value="Đại học">Đại học / Sinh viên</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save feedback & Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Đã cập nhật thông tin thành công!
            </span>
          ) : (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Nhấn Lưu để cập nhật hồ sơ
            </span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] hover:from-[#059669] hover:to-[#065f46] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
