"use client";

import React, { useState } from "react";
import {
  Clock,
  Award,
  CheckCircle2,
  Flame,
  TrendingUp,
  Target,
  BookOpen,
  CalendarDays,
  ArrowUpRight,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface ParentOverviewTabProps {
  childName?: string;
  childGrade?: string;
  childSchool?: string;
  onNavigateTab?: (tab: string) => void;
}

/* ── Mock data (sẽ thay bằng API thực) ── */

const STATS_CARDS = [
  {
    title: "Giờ học tuần này",
    value: "14.5",
    unit: "giờ",
    sub: "+2.0 giờ so với tuần trước",
    target: "Mục tiêu: 14 giờ/tuần",
    percentOfTarget: 103.5,
    icon: Clock,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    accentColor: "text-emerald-700",
  },
  {
    title: "Điểm trung bình",
    value: "8.8",
    unit: "/ 10",
    sub: "Tăng 0.6 so với tuần trước",
    trend: "up" as const,
    icon: Award,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    accentColor: "text-blue-700",
  },
  {
    title: "Chuỗi học liên tục",
    value: "12",
    unit: "ngày",
    sub: "Kỷ lục: 15 ngày",
    icon: Flame,
    color: "text-amber-500 bg-amber-50 border-amber-200",
    accentColor: "text-amber-700",
  },
  {
    title: "Bài tập cần nộp",
    value: "3",
    unit: "bài",
    sub: "1 bài quá hạn",
    isAlert: true,
    icon: CheckCircle2,
    color: "text-rose-500 bg-rose-50 border-rose-200",
    accentColor: "text-rose-600",
  },
];

const SUBJECT_PROGRESS = [
  { subject: "Toán học", icon: "📐", progress: 92, score: 8.6, trend: "up" as const, tests: 12 },
  { subject: "Vật lý", icon: "⚡", progress: 70, score: 7.8, trend: "up" as const, tests: 8 },
  { subject: "Tiếng Anh", icon: "🌍", progress: 60, score: 8.2, trend: "stable" as const, tests: 5 },
  { subject: "Ngữ văn", icon: "📝", progress: 45, score: 7.0, trend: "down" as const, tests: 3 },
];

const RECENT_ACTIVITY = [
  {
    id: "1",
    time: "20:30",
    date: "Hôm nay",
    title: "Hoàn thành bài trắc nghiệm Dao động điều hòa",
    subject: "Vật lý",
    type: "test_completed" as const,
    meta: "9.0/10 điểm · 28 phút",
  },
  {
    id: "2",
    time: "19:00",
    date: "Hôm nay",
    title: "Điểm danh vào lớp Livestream Thầy Dũng",
    subject: "Toán học",
    type: "class_joined" as const,
    meta: "Buổi 12/24",
  },
  {
    id: "3",
    time: "16:30",
    date: "Hôm nay",
    title: "Tải tài liệu Đề cương ôn tập Học kỳ 1",
    subject: "Tiếng Anh",
    type: "material_downloaded" as const,
    meta: "PDF · 2.4 MB",
  },
  {
    id: "4",
    time: "21:15",
    date: "Hôm qua",
    title: "Xem video bài giảng Khảo sát đồ thị hàm số",
    subject: "Toán học",
    type: "video_watched" as const,
    meta: "Thời lượng: 32 phút",
  },
  {
    id: "5",
    time: "18:45",
    date: "Hôm qua",
    title: "Nộp bài tập Chuyên đề Hàm số",
    subject: "Toán học",
    type: "homework_submitted" as const,
    meta: "Đúng hạn",
  },
];

const UPCOMING_DEADLINES = [
  { id: "1", title: "Bài kiểm tra Hóa học", time: "21:00 Hôm nay", isUrgent: true },
  { id: "2", title: "Buổi học Online Toán", time: "19:30 Ngày mai", isUrgent: false },
  { id: "3", title: "Nộp bài tập Vật lý", time: "23:59 Thứ Năm", isUrgent: false },
];

const AI_INSIGHT = `Tuần này Nam tiến bộ rõ rệt ở môn Toán (điểm tăng từ 7.2 lên 8.6). Tuy nhiên, em có dấu hiệu học dồn vào tối Chủ Nhật và làm bài Tiếng Anh hơi vội. Bố mẹ nên dành lời khen cho nỗ lực môn Toán và nhắc nhẹ con phân bổ thời gian đều các ngày trong tuần nhé!`;

const ACTIVE_GOALS = [
  {
    id: "1",
    title: "Đạt 9.0 bài kiểm tra Toán",
    reward: "Xem phim CGV cuối tuần 🎬",
    progress: 80,
    status: "in_progress" as const,
    deadline: "Chủ Nhật, 12/10",
  },
  {
    id: "2",
    title: "Hoàn thành 100% bài tập tuần",
    reward: "Đi ăn pizza 🍕",
    progress: 60,
    status: "in_progress" as const,
    deadline: "Thứ Bảy, 11/10",
  },
];

/* ── Helpers ── */

function getActivityIcon(type: string) {
  switch (type) {
    case "test_completed": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    case "class_joined": return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
    case "material_downloaded": return <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />;
    case "video_watched": return <Clock className="w-3.5 h-3.5 text-amber-600" />;
    case "homework_submitted": return <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />;
    default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
  }
}

function getActivityDotColor(type: string) {
  switch (type) {
    case "test_completed": return "bg-emerald-500";
    case "class_joined": return "bg-blue-500";
    case "material_downloaded": return "bg-purple-500";
    case "video_watched": return "bg-amber-500";
    case "homework_submitted": return "bg-teal-500";
    default: return "bg-slate-400";
  }
}

function getTrendIcon(trend: "up" | "down" | "stable") {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
  if (trend === "down") return <TrendingUp className="w-3.5 h-3.5 text-rose-500 rotate-180" />;
  return <span className="w-3.5 h-3.5 text-slate-400">—</span>;
}

export default function ParentOverviewTab({
  childName = "Nguyễn Văn Nam",
  childGrade = "Lớp 12",
  childSchool = "THPT Chuyên Lê Hồng Phong",
  onNavigateTab,
}: ParentOverviewTabProps) {
  const [showFullInsight, setShowFullInsight] = useState(false);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="space-y-6">
      {/* ── Greeting Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          CỔNG PHỤ HUYNH · TỔNG QUAN
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {greeting}! 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dưới đây là tình hình học tập hôm nay của{" "}
          <span className="font-bold text-emerald-700">{childName}</span>
          {" "}({childGrade} · {childSchool})
        </p>
      </div>

      {/* ── Stats Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col justify-between group hover:shadow-md hover:border-emerald-200/80 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">
                  {card.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                  <span className="text-sm font-bold text-slate-400 ml-1">
                    {card.unit}
                  </span>
                </h3>
                <p
                  className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                    card.isAlert ? "text-rose-600" : card.accentColor
                  }`}
                >
                  {card.isAlert && <AlertTriangle className="w-3 h-3" />}
                  {card.sub}
                </p>
                {"target" in card && card.target && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{card.target}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Two Columns: AI Insight + Deadlines ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* AI Weekly Insight */}
        <div className="lg:col-span-3 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-200/60 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                AI Đánh Giá & Lời Khuyên
              </h3>
              <p className="text-[10px] text-emerald-600 font-semibold">
                Báo cáo tuần · Tự động bởi EduMi AI
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {showFullInsight ? AI_INSIGHT : AI_INSIGHT.slice(0, 150) + "..."}
          </p>
          <button
            type="button"
            onClick={() => setShowFullInsight(!showFullInsight)}
            className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer flex items-center gap-1"
          >
            {showFullInsight ? "Thu gọn" : "Xem chi tiết báo cáo"}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showFullInsight ? "rotate-90" : ""}`} />
          </button>
        </div>

        {/* Upcoming deadlines */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Lịch & Hạn Chót
            </h3>
          </div>
          <div className="space-y-3">
            {UPCOMING_DEADLINES.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  item.isUrgent
                    ? "bg-rose-50/80 border-rose-200/60"
                    : "bg-slate-50/80 border-slate-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.isUrgent ? "bg-rose-500 animate-pulse" : "bg-emerald-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </p>
                  <p
                    className={`text-[10px] font-semibold ${
                      item.isUrgent ? "text-rose-600" : "text-slate-500"
                    }`}
                  >
                    {item.time}
                  </p>
                </div>
                {item.isUrgent && (
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Subject Progress Bars ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Tiến Độ Các Môn Học
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab?.("progress")}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer flex items-center gap-1"
          >
            Xem chi tiết
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-4">
          {SUBJECT_PROGRESS.map((sub, idx) => (
            <div key={idx} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{sub.icon}</span>
                  <span className="text-xs font-bold text-slate-900">
                    {sub.subject}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {sub.tests} bài thi
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(sub.trend)}
                  <span className="text-xs font-black text-slate-900">
                    {sub.score}/10
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {sub.progress}%
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700 ease-out"
                  style={{ width: `${sub.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two Columns: Activity Timeline + Goals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Activity Timeline */}
        <div className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Nhật Ký Hoạt Động Gần Đây
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab?.("activity")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              Xem tất cả
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((event, idx) => (
              <div
                key={event.id}
                className="flex gap-3 py-2.5 group"
              >
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${getActivityDotColor(event.type)} ring-2 ring-white shadow-sm`} />
                  {idx < RECENT_ACTIVITY.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 mt-1" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    {getActivityIcon(event.type)}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {event.time} · {event.date}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {event.subject}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {event.meta}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals & Rewards */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Mục Tiêu & Phần Thưởng
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab?.("goals")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              Quản lý
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {ACTIVE_GOALS.map((goal) => (
              <div
                key={goal.id}
                className="p-4 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900">
                      {goal.title}
                    </p>
                    <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
                      🎁 {goal.reward}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                    {goal.deadline}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-amber-700">
                    {goal.progress}%
                  </span>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onNavigateTab?.("goals")}
              className="w-full py-3 rounded-xl border-2 border-dashed border-emerald-200 text-xs font-bold text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              Tạo thử thách mới cho con
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
