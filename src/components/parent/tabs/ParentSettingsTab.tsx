"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Bell,
  Lock,
  Save,
  Check,
  ShieldCheck,
  Smartphone,
  Calendar,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface ParentSettingsTabProps {
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export default function ParentSettingsTab({
  parentName = "Nguyễn Văn Tuấn",
  parentEmail = "tuan.nguyen@gmail.com",
  parentPhone = "0912 345 678",
}: ParentSettingsTabProps) {
  // Form states
  const [name, setName] = useState(parentName);
  const [email, setEmail] = useState(parentEmail);
  const [phone, setPhone] = useState(parentPhone);
  const [relation, setRelation] = useState("Bố");

  // Notification toggles
  const [notifyZalo, setNotifyZalo] = useState(true);
  const [notifyEmailReport, setNotifyEmailReport] = useState(true);
  const [notifyLowScore, setNotifyLowScore] = useState(true);
  const [notifyDeadline, setNotifyDeadline] = useState(true);
  const [notifyGoalReward, setNotifyGoalReward] = useState(true);
  const [notifyAttendance, setNotifyAttendance] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);

  // Status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Title Header ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Cài đặt tài khoản & Thông báo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý thông tin liên hệ, kênh nhận báo cáo học tập và bảo mật tài khoản
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedSuccess ? "Đã lưu thành công" : "Lưu cài đặt"}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Cập nhật cấu hình thông báo và thông tin phụ huynh thành công!</span>
        </div>
      )}

      {/* ── Form Body ── */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Thông tin phụ huynh */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Thông tin người giám hộ
              </h2>
              <p className="text-[11px] text-slate-400">
                Dùng để gửi thông báo và liên hệ từ phía nhà trường/gia sư
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Họ và tên phụ huynh
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mối quan hệ với học sinh
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all cursor-pointer"
              >
                <option value="Bố">Bố / Cha</option>
                <option value="Mẹ">Mẹ</option>
                <option value="Người giám hộ">Người giám hộ hợp pháp</option>
                <option value="Khác">Người thân trong gia đình</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Số điện thoại (Nhận SMS / Zalo ZNS)</span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Đã xác thực
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email nhận báo cáo tổng hợp tuần
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Kênh & Tần suất thông báo */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Kênh nhận thông báo & Cảnh báo học tập
              </h2>
              <p className="text-[11px] text-slate-400">
                Tùy chỉnh những sự kiện bạn muốn EduMi gửi tin nhắn đến điện thoại
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Zalo Notification */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  Zalo
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    Tin nhắn Zalo Official Account (ZNS)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Nhận thông báo ngay lập tức khi có điểm kiểm tra, nhắc nộp bài hoặc vắng học
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyZalo}
                  onChange={(e) => setNotifyZalo(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            {/* Email Weekly Report */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    Email tổng kết tiến độ hàng tuần
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Gửi biểu đồ tiến bộ và lời khuyên AI vào 20:00 Chủ Nhật hàng tuần
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyEmailReport}
                  onChange={(e) => setNotifyEmailReport(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            {/* Detailed Preferences */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-800 mb-3">
                Các sự kiện chi tiết nhận cảnh báo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyLowScore}
                    onChange={(e) => setNotifyLowScore(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Điểm kiểm tra dưới 6.5 (để kịp thời hỗ trợ)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyDeadline}
                    onChange={(e) => setNotifyDeadline(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Bài tập sắp hết hạn trước 6 tiếng
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyGoalReward}
                    onChange={(e) => setNotifyGoalReward(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Con hoàn thành mục tiêu giao ước & nhận thưởng
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyAttendance}
                    onChange={(e) => setNotifyAttendance(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Điểm danh buổi học trực tuyến (vào lớp / vắng)
                  </span>
                </label>
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Chế độ không làm phiền ban đêm
                </p>
                <p className="text-[11px] text-slate-500">
                  Tắt âm và giữ thông báo từ 22:30 đến 06:30 sáng hôm sau
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={quietHoursEnabled}
                  onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Bảo mật & Đổi mật khẩu */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Bảo mật tài khoản
              </h2>
              <p className="text-[11px] text-slate-400">
                Đổi mật khẩu và thiết lập xác thực 2 lớp
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mật khẩu mới
              </label>
              <input
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
