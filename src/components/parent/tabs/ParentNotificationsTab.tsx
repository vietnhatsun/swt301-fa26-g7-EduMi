"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Target,
  Clock,
  Trash2,
  Check,
  Filter,
  MessageSquare,
  Gift,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "score" | "deadline" | "streak" | "goal" | "system" | "report";
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  priority?: "high" | "normal" | "low";
  actionLabel?: string;
  actionTab?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "goal",
    title: "Con đã hoàn thành mục tiêu học tập! 🎯",
    message: "Nguyễn Minh Khang đã hoàn thành mục tiêu 'Đạt điểm 8.5+ môn Toán'. Phần thưởng đã giao hẹn: 'Một buổi xem phim cuối tuần'.",
    time: "10 phút trước",
    date: "Hôm nay",
    isRead: false,
    priority: "high",
    actionLabel: "Xác nhận thưởng ngay",
    actionTab: "goals",
  },
  {
    id: "notif-2",
    type: "score",
    title: "Kết quả bài kiểm tra mới: 9.0/10 ✨",
    message: "Khang vừa hoàn thành bài kiểm tra 'Vật lý 12 - Dao động điều hòa' trong 28 phút. Vượt kỳ vọng 1.2 điểm!",
    time: "2 giờ trước",
    date: "Hôm nay",
    isRead: false,
    priority: "normal",
    actionLabel: "Xem bài thi",
    actionTab: "progress",
  },
  {
    id: "notif-3",
    type: "deadline",
    title: "Cảnh báo bài tập sắp đến hạn ⚠️",
    message: "Bài tập 'Hình học Oxyz chuyên đề 3' sẽ hết hạn vào 23:59 hôm nay. Con hiện chưa bắt đầu làm bài.",
    time: "4 giờ trước",
    date: "Hôm nay",
    isRead: false,
    priority: "high",
    actionLabel: "Nhắc nhở con",
    actionTab: "activity",
  },
  {
    id: "notif-4",
    type: "streak",
    title: "Chuỗi học tập đạt 12 ngày liên tục! 🔥",
    message: "Con đang giữ phong độ học tập rất tốt trong 2 tuần qua. Hãy gửi lời khen để tiếp thêm động lực cho con.",
    time: "Hôm qua",
    date: "Hôm qua",
    isRead: true,
    priority: "normal",
    actionLabel: "Gửi lời khen",
  },
  {
    id: "notif-5",
    type: "report",
    title: "Báo cáo tuần 40 đã sẵn sàng 📊",
    message: "Tổng thời gian học: 14.5 giờ (đạt 103% mục tiêu). Điểm trung bình tăng +0.6 so với tuần trước. Xem phân tích AI chi tiết.",
    time: "2 ngày trước",
    date: "Tuần này",
    isRead: true,
    priority: "normal",
    actionLabel: "Xem báo cáo",
    actionTab: "overview",
  },
  {
    id: "notif-6",
    type: "system",
    title: "Liên kết tài khoản thành công 🛡️",
    message: "Bạn đã kết nối thành công với học sinh Nguyễn Minh Khang (Mã: EDM-784920).",
    time: "5 ngày trước",
    date: "Tuần trước",
    isRead: true,
    priority: "low",
  },
];

interface ParentNotificationsTabProps {
  onNavigateTab?: (tab: string) => void;
}

export default function ParentNotificationsTab({
  onNavigateTab,
}: ParentNotificationsTabProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [filterType, setFilterType] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((item) => {
    if (showUnreadOnly && item.isRead) return false;
    if (filterType === "all") return true;
    if (filterType === "score" && item.type === "score") return true;
    if (filterType === "deadline" && item.type === "deadline") return true;
    if (filterType === "goals" && (item.type === "goal" || item.type === "streak"))
      return true;
    if (filterType === "reports" && item.type === "report") return true;
    return false;
  });

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "goal":
        return <Gift className="w-5 h-5 text-amber-600" />;
      case "score":
        return <Award className="w-5 h-5 text-blue-600" />;
      case "deadline":
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case "streak":
        return <Sparkles className="w-5 h-5 text-orange-500" />;
      case "report":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "system":
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNotificationBadgeColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "goal":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "score":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "deadline":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "streak":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "report":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Trung tâm thông báo
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-xs">
                {unreadCount} mới
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cập nhật thời gian thực về điểm số, hạn nộp bài tập và các dấu mốc của con
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-xs font-bold transition-all border border-emerald-200 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Đánh dấu đã đọc tất cả
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              showUnreadOnly
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {showUnreadOnly ? "Hiển thị tất cả" : "Chỉ tin chưa đọc"}
          </button>
        </div>
      </div>

      {/* ── Category Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "Tất cả" },
          { id: "score", label: "Điểm số & Thi cử" },
          { id: "deadline", label: "Hạn nộp & Cảnh báo" },
          { id: "goals", label: "Mục tiêu & Động lực" },
          { id: "reports", label: "Báo cáo tuần" },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilterType(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterType === cat.id
                ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Notifications List ── */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Không có thông báo nào
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Bạn đã cập nhật hết tất cả các thông báo mới nhất từ con.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`group relative bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                !notif.isRead
                  ? "border-emerald-200 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-500/10"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Type Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${getNotificationBadgeColor(
                    notif.type
                  )}`}
                >
                  {getNotificationIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-bold truncate ${
                          !notif.isRead ? "text-slate-900 font-extrabold" : "text-slate-800"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex-shrink-0">
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {/* Actions Bar */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {notif.actionLabel && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notif.actionTab && onNavigateTab) {
                              onNavigateTab(notif.actionTab);
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          {notif.actionLabel}
                        </button>
                      )}

                      {notif.type === "streak" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCopiedSuccess("Đã gửi lời động viên: 'Bố mẹ rất tự hào về con! Tiếp tục phát huy nhé!'");
                            setTimeout(() => setCopiedSuccess(null), 3500);
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Gửi lời nhắn động viên
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa thông báo này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast alert when cheer sent */}
      {copiedSuccess && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-white/10 z-50 animate-fade-in-up flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{copiedSuccess}</span>
        </div>
      )}
    </div>
  );
}
