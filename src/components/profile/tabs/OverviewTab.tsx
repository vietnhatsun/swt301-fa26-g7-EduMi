"use client";

import React, { useState } from "react";
import {
  Flame,
  BookOpen,
  Clock,
  ArrowUpRight,
  Video,
  CheckCircle2,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

interface OverviewTabProps {
  fullName?: string;
  streakCount?: number;
  studentCode?: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  dayLabel: string;
  dayKey: string;
  slotKey: "sang" | "chieu" | "toi";
  dateNum: string;
  time: string;
  teacher: string;
  room: string;
  isToday: boolean;
  isCompleted?: boolean;
  meetUrl?: string;
}

export default function OverviewTab({
  fullName = "Nguyễn Ngọc Thạch 2k3",
  streakCount = 0,
}: OverviewTabProps) {
  const [scheduleView, setScheduleView] = useState<"today" | "week">("today");
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Weekly study time data (hours per day)
  const weeklyStudyData = [
    { day: "T2", date: "15/09", hours: 1.5, minutes: 90, label: "1h 30m" },
    { day: "T3", date: "16/09", hours: 2.0, minutes: 120, label: "2h 00m" },
    { day: "T4", date: "17/09", hours: 3.2, minutes: 192, label: "3h 12m" },
    { day: "T5", date: "18/09", hours: 1.8, minutes: 108, label: "1h 48m" },
    { day: "T6", date: "19/09", hours: 2.5, minutes: 150, label: "2h 30m" },
    { day: "T7", date: "20/09", hours: 1.0, minutes: 60, label: "1h 00m" },
    { day: "CN", date: "21/09", hours: 0.5, minutes: 30, label: "30m", isToday: true },
  ];

  const totalWeeklyHours = weeklyStudyData.reduce((acc, cur) => acc + cur.hours, 0);
  const avgDailyHours = (totalWeeklyHours / weeklyStudyData.length).toFixed(1);

  // Chart coordinates (viewBox: 0 0 320 120)
  const maxScaleHours = 4.0;
  const chartPoints = weeklyStudyData.map((d, i) => {
    const x = 20 + i * (280 / 6);
    const y = 105 - (d.hours / maxScaleHours) * 85;
    return { x, y, ...d };
  });

  const linePath = chartPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }, "");

  const areaPath = `${linePath} L ${chartPoints[chartPoints.length - 1].x.toFixed(1)},115 L ${chartPoints[0].x.toFixed(1)},115 Z`;

  // Mock schedule data
  const scheduleItems: ScheduleItem[] = [
    {
      id: "s0",
      title: "Ngữ pháp Tiếng Anh: 12 Thì & Câu bị động nâng cao",
      subject: "Tiếng Anh",
      dayLabel: "T2",
      dayKey: "T2",
      slotKey: "sang",
      dateNum: "21",
      time: "08:00 - 09:30",
      teacher: "Cô Thu Hà",
      room: "Lớp học ảo EduMi #02",
      isToday: true,
      isCompleted: true,
    },
    {
      id: "s1",
      title: "Toán 12: Chuyên đề Hàm số & Logarit",
      subject: "Toán học",
      dayLabel: "T2",
      dayKey: "T2",
      slotKey: "toi",
      dateNum: "21",
      time: "19:30 - 21:00",
      teacher: "Thầy Đức",
      room: "Lớp học ảo EduMi #01",
      isToday: true,
      isCompleted: false,
      meetUrl: "https://meet.google.com",
    },
    {
      id: "s2",
      title: "Luyện đề IELTS Reading: Kỹ năng Skimming & Scanning",
      subject: "Tiếng Anh",
      dayLabel: "T3",
      dayKey: "T3",
      slotKey: "chieu",
      dateNum: "22",
      time: "14:00 - 15:30",
      teacher: "Cô Mai Anh",
      room: "Phòng học 302",
      isToday: false,
      isCompleted: false,
    },
    {
      id: "s3",
      title: "Vật lý 12: Dao động điều hòa & Con lắc lò xo",
      subject: "Vật lý",
      dayLabel: "T4",
      dayKey: "T4",
      slotKey: "toi",
      dateNum: "23",
      time: "19:30 - 21:00",
      teacher: "Thầy Quang",
      room: "Lớp học ảo EduMi #03",
      isToday: false,
      isCompleted: false,
    },
    {
      id: "s4",
      title: "Hóa học 12: Este - Lipit & Bài tập vận dụng cao",
      subject: "Hóa học",
      dayLabel: "T6",
      dayKey: "T6",
      slotKey: "toi",
      dateNum: "25",
      time: "18:00 - 19:30",
      teacher: "Cô Lan Hương",
      room: "Phòng học 201",
      isToday: false,
      isCompleted: false,
    },
  ];

  const displayedSchedule =
    scheduleView === "today"
      ? scheduleItems.filter((item) => item.isToday)
      : scheduleItems;

  // Caro table configuration
  const weekTableDays = [
    { key: "T2", label: "T2", date: "21", isToday: true },
    { key: "T3", label: "T3", date: "22", isToday: false },
    { key: "T4", label: "T4", date: "23", isToday: false },
    { key: "T5", label: "T5", date: "24", isToday: false },
    { key: "T6", label: "T6", date: "25", isToday: false },
    { key: "T7", label: "T7", date: "26", isToday: false },
    { key: "CN", label: "CN", date: "27", isToday: false },
  ];

  const timeSlots = [
    { key: "sang", label: "Sáng", timeRange: "08:00 - 11:30" },
    { key: "chieu", label: "Chiều", timeRange: "14:00 - 17:30" },
    { key: "toi", label: "Tối", timeRange: "18:00 - 21:30" },
  ];

  const getScheduleForSlot = (dayKey: string, slotKey: string) => {
    return scheduleItems.find(
      (item) => item.dayKey === dayKey && item.slotKey === slotKey
    );
  };

  const getTooltipPosition = (dayKey: string) => {
    if (dayKey === "T2" || dayKey === "T3") return "left-0";
    if (dayKey === "T6" || dayKey === "T7" || dayKey === "CN") return "right-0";
    return "left-1/2 -translate-x-1/2";
  };

  // 7 days of the week streak status
  const weekDays = [
    { label: "T2", active: false, current: false },
    { label: "T3", active: false, current: false },
    { label: "T4", active: false, current: false },
    { label: "T5", active: false, current: false },
    { label: "T6", active: false, current: false },
    { label: "T7", active: false, current: false },
    { label: "CN", active: false, current: true },
  ];

  // Recent test history
  const recentTests = [
    {
      id: "1",
      title: "Đề thi thử THPT Quốc Gia môn Tiếng Anh - Đề số 04",
      date: "20/09/2026",
      score: "8.5 / 10",
      status: "Đã hoàn thành",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "2",
      title: "Quiz từ vựng Unit 3: Environmental Protection",
      date: "19/09/2026",
      score: "18 / 20",
      status: "Đạt",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "3",
      title: "Mini-test Đọc hiểu: Reading Passage 2 (Academic)",
      date: "17/09/2026",
      score: "11 / 13",
      status: "Đạt",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Top Header Greeting ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          TỔNG QUAN · TIẾN ĐỘ LUYỆN ĐỀ
        </p>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Chào {fullName.split(" ").pop() || "bạn"}, hôm nay luyện đề nhé! 🚀
        </h1>
      </div>

      {/* ── Row 1: Khoảng trống chờ thêm các card mới ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Khoảng trống vị trí Lịch học cũ (Col span 7) */}
        <div className="hidden lg:flex lg:col-span-7 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200/80 items-center justify-center p-6 text-slate-400/80 bg-slate-50/30 min-h-[200px]">
          <div className="text-center">
            <span className="text-xs font-semibold text-slate-400">
              + Khoảng trống chờ cập nhật card mới
            </span>
          </div>
        </div>

        {/* Card: THỜI GIAN HỌC TẬP TRONG TUẦN (Col span 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col justify-between">
          <div>
            {/* Header: Title & Badge */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                    THỜI GIAN HỌC TẬP
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Tuần này · {totalWeeklyHours.toFixed(1)} giờ
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>+18%</span>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="relative w-full pt-1 pb-1">
              <svg
                viewBox="0 0 320 120"
                className="w-full h-28 sm:h-32 overflow-visible select-none"
              >
                <defs>
                  <linearGradient id="studyTimeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal guide lines */}
                <line
                  x1="15"
                  y1="20"
                  x2="305"
                  y2="20"
                  stroke="#f1f5f9"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <line
                  x1="15"
                  y1="62.5"
                  x2="305"
                  y2="62.5"
                  stroke="#f1f5f9"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <line
                  x1="15"
                  y1="105"
                  x2="305"
                  y2="105"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />

                {/* Area fill under curve */}
                <path d={areaPath} fill="url(#studyTimeGrad)" />

                {/* Curved line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Data Points */}
                {chartPoints.map((pt, idx) => {
                  const isHovered = hoveredDay === idx;
                  return (
                    <g
                      key={pt.day}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDay(idx)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {/* Invisible larger hit area */}
                      <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                      {/* Point halo on hover or today */}
                      {(isHovered || pt.isToday) && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? "9" : "7"}
                          fill="#10b981"
                          fillOpacity={isHovered ? "0.25" : "0.15"}
                          className="transition-all duration-200"
                        />
                      )}

                      {/* Core point circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? "4.5" : "3.5"}
                        fill="#ffffff"
                        stroke={pt.isToday ? "#064e3b" : "#10b981"}
                        strokeWidth={isHovered ? "3" : "2"}
                        className="transition-all duration-200"
                      />

                      {/* Tooltip on hover */}
                      {isHovered && (
                        <g className="transition-all duration-200 pointer-events-none">
                          <rect
                            x={Math.max(10, Math.min(240, pt.x - 40))}
                            y={Math.max(2, pt.y - 32)}
                            width="80"
                            height="22"
                            rx="6"
                            fill="#064e3b"
                            className="shadow-md"
                          />
                          <text
                            x={Math.max(50, Math.min(280, pt.x))}
                            y={Math.max(16, pt.y - 18)}
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {pt.day}: {pt.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Day Labels below chart */}
              <div className="flex justify-between px-2 text-[11px] font-bold text-slate-400 select-none">
                {weeklyStudyData.map((d, i) => (
                  <span
                    key={d.day}
                    className={`transition-colors cursor-pointer ${
                      hoveredDay === i
                        ? "text-emerald-700 font-extrabold"
                        : d.isToday
                        ? "text-slate-900 font-extrabold"
                        : "hover:text-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredDay(i)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {d.day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer of Card - 1 text động viên nhỏ gọn căn góc phải */}
          <div className="pt-2.5 border-t border-slate-100 flex justify-end">
            <span className="text-[11px] text-slate-400 font-medium">
              Mỗi ngày một chút, chạm đến mục tiêu! 🌱
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Lịch học của tôi & Chuỗi ngày học ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Card 1: LỊCH HỌC CỦA TÔI (Col span 7 - Đã chuyển xuống thay thế Kỹ năng gần đây) */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col justify-between">
          <div>
            {/* Header with Title & Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                    LỊCH HỌC CỦA TÔI
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {scheduleView === "today"
                      ? `Hôm nay · ${scheduleItems.filter((item) => item.isToday).length} buổi học`
                      : `Tuần này · ${scheduleItems.length} buổi học`}
                  </span>
                </div>
              </div>

              {/* Today / Week filter pills */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setScheduleView("today")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    scheduleView === "today"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Hôm nay
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleView("week")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    scheduleView === "week"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Cả tuần
                </button>
              </div>
            </div>

            {/* Schedule Body - Fixed height container so card height never changes */}
            <div className="min-h-[156px] flex flex-col justify-center">
              {scheduleView === "today" ? (
                /* List of today's classes */
                <div className="space-y-2.5">
                  {displayedSchedule.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 hover:bg-emerald-50 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Day / Date badge */}
                        <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-white flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
                          <span className="text-[10px] font-bold uppercase leading-none text-emerald-300">
                            {item.dayLabel}
                          </span>
                          <span className="text-xs font-black leading-tight">
                            {item.dateNum}
                          </span>
                        </div>

                        {/* Class details */}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              {item.title}
                            </h4>
                            {item.isToday && !item.isCompleted && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                                SẮP TỚI
                              </span>
                            )}
                            {item.isCompleted && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Đã hoàn thành
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                              <Clock className="w-3 h-3" />
                              {item.time}
                            </span>
                            <span>•</span>
                            <span>
                              {item.teacher} · {item.room}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Action button */}
                      {item.isToday && !item.isCompleted ? (
                        <a
                          href={item.meetUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all self-end sm:self-center shrink-0"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Vào lớp</span>
                        </a>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 self-end sm:self-center shrink-0">
                          {item.isCompleted ? "Đã kết thúc" : "Chưa bắt đầu"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Caro Grid Table for Cả tuần */
                <div className="w-full">
                  <div className="grid grid-cols-8 gap-1 sm:gap-1.5 text-center">
                    {/* Corner Header */}
                    <div className="flex items-center justify-center text-[10px] font-bold text-slate-400">
                      Buổi
                    </div>

                    {/* Day Column Headers (T2 - CN) */}
                    {weekTableDays.map((d) => (
                      <div
                        key={d.key}
                        className={`py-1 rounded-lg text-center transition-all ${
                          d.isToday
                            ? "bg-[#064e3b] text-white font-black shadow-xs"
                            : "bg-slate-100/90 text-slate-700 font-bold"
                        }`}
                      >
                        <div
                          className={`text-[10px] uppercase leading-none ${
                            d.isToday ? "text-emerald-300" : "text-slate-500"
                          }`}
                        >
                          {d.label}
                        </div>
                        <div className="text-[11px] font-bold leading-tight mt-0.5">
                          {d.date}
                        </div>
                      </div>
                    ))}

                    {/* Caro Rows: Sáng, Chiều, Tối */}
                    {timeSlots.map((slot) => (
                      <React.Fragment key={slot.key}>
                        {/* Slot label */}
                        <div className="flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100/80 rounded-lg">
                          {slot.label}
                        </div>

                        {/* 7 day cells */}
                        {weekTableDays.map((d) => {
                          const classItem = getScheduleForSlot(d.key, slot.key);
                          return (
                            <div
                              key={`${d.key}-${slot.key}`}
                              className="relative group h-9 sm:h-10"
                            >
                              {classItem ? (
                                <div
                                  className={`w-full h-full rounded-lg flex flex-col items-center justify-center p-1 transition-all cursor-pointer shadow-xs ${
                                    classItem.isToday && !classItem.isCompleted
                                      ? "bg-gradient-to-br from-[#10b981] to-[#059669] text-white ring-2 ring-amber-400"
                                      : classItem.isCompleted
                                      ? "bg-emerald-100/90 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                      : "bg-[#064e3b] text-white hover:bg-emerald-800"
                                  }`}
                                >
                                  <span className="text-[10px] font-black truncate max-w-full leading-tight">
                                    {classItem.subject.replace(" học", "")}
                                  </span>
                                  <span className="text-[8px] opacity-90 truncate max-w-full leading-none mt-0.5">
                                    {classItem.time.split(" - ")[0]}
                                  </span>
                                </div>
                              ) : (
                                <div className="w-full h-full rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-slate-100/50 transition-colors">
                                  <span className="text-xs select-none">·</span>
                                </div>
                              )}

                              {/* Tooltip on hover for green cells */}
                              {classItem && (
                                <div
                                  className={`hidden group-hover:flex flex-col absolute z-40 bottom-full mb-2 w-56 sm:w-64 p-3 rounded-xl bg-slate-900/95 text-white shadow-2xl backdrop-blur-sm pointer-events-none border border-slate-700/60 text-left ${getTooltipPosition(
                                    d.key
                                  )}`}
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                                      {classItem.subject}
                                    </span>
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                        classItem.isCompleted
                                          ? "bg-slate-700 text-slate-300"
                                          : classItem.isToday
                                          ? "bg-amber-400 text-slate-950 font-black"
                                          : "bg-emerald-900 text-emerald-300"
                                      }`}
                                    >
                                      {classItem.isCompleted
                                        ? "Đã hoàn thành"
                                        : classItem.isToday
                                        ? "Sắp tới hôm nay"
                                        : "Sắp diễn ra"}
                                    </span>
                                  </div>
                                  <h5 className="text-xs font-bold text-white leading-snug mb-1">
                                    {classItem.title}
                                  </h5>
                                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 mb-0.5">
                                    <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span>{classItem.time}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400">
                                    {classItem.teacher} · {classItem.room}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Caro footer legend */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 select-none">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-[#064e3b]" />
                        Lớp học
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-emerald-100 border border-emerald-300" />
                        Đã xong
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-slate-100 border border-slate-200" />
                        Trống
                      </span>
                    </div>
                    <span className="text-[9px] italic text-slate-400">
                      Rê chuột vào ô xanh để xem chi tiết
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer of Card 1 */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span>Đã hoàn thành <strong>2/5 buổi</strong></span>
              <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden inline-block">
                <div className="h-full bg-emerald-500 rounded-full w-[40%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: CHUỖI NGÀY HỌC (Col span 5 - Đã chuyển từ Row 1 xuống thay thế Đếm ngược kỳ thi) */}
        <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CHUỖI NGÀY HỌC
            </span>
            <div className="flex items-center gap-2 mt-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shadow-sm">
                <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
              </div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {streakCount}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                ngày liên tiếp
              </span>
            </div>
          </div>

          {/* 7-day circular checklist */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-3 border-t border-slate-100">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    day.active
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : day.current
                      ? "border-2 border-dashed border-amber-400 text-amber-600 bg-amber-50/50"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {day.active ? "✓" : ""}
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Row 3: Hoạt động học tập & Lịch sử làm bài gần đây ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Card 5: Lịch sử làm bài gần đây (Col span 12 hoặc 8) */}
        <div className="lg:col-span-12 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                HOẠT ĐỘNG HỌC TẬP · THÁNG 9 · 2026
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Lịch sử làm bài gần đây
              </h3>
            </div>
            <button
              type="button"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTests.map((test) => (
              <div
                key={test.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/70 hover:border-emerald-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {test.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {test.date}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {test.score}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${test.badgeColor}`}
                  >
                    {test.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
