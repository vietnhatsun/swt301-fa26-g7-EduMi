"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Flame,
  ChevronDown,
  Check,
  Filter,
  Calendar,
} from "lucide-react";

/* ── Mock data ── */

const ACTIVITY_DATA = [
  {
    date: "Hôm nay · 06/10/2026",
    events: [
      {
        id: "a1",
        time: "20:30",
        title: "Hoàn thành bài trắc nghiệm Dao động điều hòa",
        subject: "Vật lý",
        type: "test_completed" as const,
        meta: "9.0/10 điểm · 28 phút",
        detail: "27/30 câu đúng. Sai: Câu 8, 15, 22.",
      },
      {
        id: "a2",
        time: "19:00",
        title: "Điểm danh vào lớp Livestream Thầy Dũng",
        subject: "Toán học",
        type: "class_joined" as const,
        meta: "Buổi 12/24 · Chuyên đề Hàm số",
        detail: "Tham gia đầy đủ 90 phút. Tương tác 3 lần.",
      },
      {
        id: "a3",
        time: "16:30",
        title: "Tải tài liệu Đề cương ôn tập Học kỳ 1",
        subject: "Tiếng Anh",
        type: "material_downloaded" as const,
        meta: "PDF · 2.4 MB",
        detail: null,
      },
      {
        id: "a4",
        time: "14:15",
        title: "Xem video bài giảng Writing Task 2",
        subject: "Tiếng Anh",
        type: "video_watched" as const,
        meta: "Thời lượng: 45 phút · Xem hết 100%",
        detail: null,
      },
    ],
  },
  {
    date: "Hôm qua · 05/10/2026",
    events: [
      {
        id: "b1",
        time: "21:15",
        title: "Xem video bài giảng Khảo sát đồ thị hàm số",
        subject: "Toán học",
        type: "video_watched" as const,
        meta: "Thời lượng: 32 phút · Xem hết 100%",
        detail: null,
      },
      {
        id: "b2",
        time: "18:45",
        title: "Nộp bài tập Chuyên đề Hàm số",
        subject: "Toán học",
        type: "homework_submitted" as const,
        meta: "Đúng hạn · 8.0/10 điểm",
        detail: "Giáo viên nhận xét: Bài làm tốt, cần trình bày rõ hơn phần tính đạo hàm.",
      },
      {
        id: "b3",
        time: "15:30",
        title: "Hoàn thành IELTS Mock Test - Reading",
        subject: "Tiếng Anh",
        type: "test_completed" as const,
        meta: "7.5/10 điểm · 60 phút",
        detail: "30/40 câu đúng. Cần cải thiện: Matching Headings.",
      },
      {
        id: "b4",
        time: "10:00",
        title: "Đạt mốc chuỗi học 10 ngày liên tục!",
        subject: "Hệ thống",
        type: "streak_milestone" as const,
        meta: "🔥 Milestone: 10 ngày",
        detail: null,
      },
    ],
  },
  {
    date: "04/10/2026 · Chủ Nhật",
    events: [
      {
        id: "c1",
        time: "20:00",
        title: "Hoàn thành Đề thi thử THPT QG Toán - Đề 03",
        subject: "Toán học",
        type: "test_completed" as const,
        meta: "9.0/10 điểm · 48 phút",
        detail: "45/50 câu đúng. Xuất sắc!",
      },
      {
        id: "c2",
        time: "16:00",
        title: "Điểm danh lớp học Vật lý Online",
        subject: "Vật lý",
        type: "class_joined" as const,
        meta: "Buổi 8/18 · Sóng điện từ",
        detail: null,
      },
      {
        id: "c3",
        time: "09:30",
        title: "Tải 3 bộ đề thi thử Toán",
        subject: "Toán học",
        type: "material_downloaded" as const,
        meta: "PDF · 5.1 MB tổng",
        detail: null,
      },
    ],
  },
];

/* ── Helpers ── */

function getTypeConfig(type: string) {
  switch (type) {
    case "test_completed":
      return { icon: CheckCircle2, dotColor: "bg-emerald-500", iconColor: "text-emerald-600", bgColor: "bg-emerald-50", label: "Kiểm tra" };
    case "class_joined":
      return { icon: BookOpen, dotColor: "bg-blue-500", iconColor: "text-blue-600", bgColor: "bg-blue-50", label: "Lớp học" };
    case "material_downloaded":
      return { icon: ArrowUpRight, dotColor: "bg-purple-500", iconColor: "text-purple-600", bgColor: "bg-purple-50", label: "Tài liệu" };
    case "video_watched":
      return { icon: Clock, dotColor: "bg-amber-500", iconColor: "text-amber-600", bgColor: "bg-amber-50", label: "Video" };
    case "homework_submitted":
      return { icon: CheckCircle2, dotColor: "bg-teal-500", iconColor: "text-teal-600", bgColor: "bg-teal-50", label: "Bài tập" };
    case "streak_milestone":
      return { icon: Flame, dotColor: "bg-orange-500", iconColor: "text-orange-600", bgColor: "bg-orange-50", label: "Mốc streak" };
    default:
      return { icon: Clock, dotColor: "bg-slate-400", iconColor: "text-slate-500", bgColor: "bg-slate-50", label: "Khác" };
  }
}

const TYPE_FILTERS = [
  { id: "all", label: "Tất cả", icon: "📋" },
  { id: "test_completed", label: "Kiểm tra", icon: "✅" },
  { id: "class_joined", label: "Lớp học", icon: "📚" },
  { id: "video_watched", label: "Video", icon: "🎬" },
  { id: "homework_submitted", label: "Bài tập", icon: "📝" },
  { id: "material_downloaded", label: "Tài liệu", icon: "📄" },
];

interface ParentActivityTabProps {
  childName?: string;
}

export default function ParentActivityTab({
  childName = "Nguyễn Minh Khang",
}: ParentActivityTabProps) {
  const [selectedType, setSelectedType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const activeFilter = TYPE_FILTERS.find((f) => f.id === selectedType);

  const filteredData = ACTIVITY_DATA.map((day) => ({
    ...day,
    events:
      selectedType === "all"
        ? day.events
        : day.events.filter((e) => e.type === selectedType),
  })).filter((day) => day.events.length > 0);

  // Count total events
  const totalEvents = ACTIVITY_DATA.reduce((sum, day) => sum + day.events.length, 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          CỔNG PHỤ HUYNH · NHẬT KÝ
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Nhật ký hoạt động
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dòng thời gian chi tiết mọi hoạt động học tập của con trong 7 ngày qua ({totalEvents} hoạt động).
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Type filter dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>{activeFilter?.icon}</span>
            <span>{activeFilter?.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50">
                {TYPE_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(filter.id);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                      selectedType === filter.id
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{filter.icon}</span>
                    <span className="flex-1">{filter.label}</span>
                    {selectedType === filter.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick filter chips */}
        <div className="hidden sm:flex items-center gap-1.5">
          {TYPE_FILTERS.slice(1).map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSelectedType(selectedType === filter.id ? "all" : filter.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                selectedType === filter.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="space-y-6">
        {filteredData.map((day, dayIdx) => (
          <div key={dayIdx}>
            {/* Day header */}
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {day.date}
              </h3>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] text-slate-400 font-semibold">
                {day.events.length} hoạt động
              </span>
            </div>

            {/* Events */}
            <div className="ml-2 space-y-0">
              {day.events.map((event, eventIdx) => {
                const config = getTypeConfig(event.type);
                const Icon = config.icon;
                const isExpanded = expandedEventId === event.id;
                const isLast = eventIdx === day.events.length - 1;

                return (
                  <div key={event.id} className="flex gap-3">
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center flex-shrink-0 pt-1">
                      <div className={`w-3 h-3 rounded-full ${config.dotColor} ring-2 ring-white shadow-sm`} />
                      {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                    </div>

                    {/* Event card */}
                    <button
                      type="button"
                      onClick={() => event.detail ? setExpandedEventId(isExpanded ? null : event.id) : null}
                      className={`flex-1 mb-2 p-3 sm:p-4 rounded-xl border text-left transition-all ${
                        isExpanded
                          ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                          : "bg-white border-slate-100 hover:border-emerald-200/60 hover:shadow-sm"
                      } ${event.detail ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-3 h-3 ${config.iconColor}`} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {event.time}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${config.bgColor} ${config.iconColor}`}>
                            {config.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {event.subject}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-900 mt-1">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {event.meta}
                      </p>

                      {/* Expandable detail */}
                      {isExpanded && event.detail && (
                        <div className="mt-2 pt-2 border-t border-emerald-200/60">
                          <p className="text-[11px] text-emerald-800 font-semibold leading-relaxed">
                            📋 {event.detail}
                          </p>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-emerald-100 text-center py-16">
          <p className="text-sm font-bold text-slate-900 mb-1">
            Không có hoạt động nào
          </p>
          <p className="text-xs text-slate-500">
            Thử bỏ bộ lọc hoặc chọn khoảng thời gian khác.
          </p>
        </div>
      )}
    </div>
  );
}
