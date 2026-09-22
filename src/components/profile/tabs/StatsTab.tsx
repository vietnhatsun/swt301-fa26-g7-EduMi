"use client";

import React from "react";
import {
  Clock,
  Award,
  CheckCircle2,
  Flame,
  TrendingUp,
  Target,
} from "lucide-react";

interface StatsTabProps {
  currentStreak?: number;
  longestStreak?: number;
  totalPoints?: number;
}

export default function StatsTab({
  currentStreak = 0,
  longestStreak = 7,
  totalPoints = 1250,
}: StatsTabProps) {
  const statCards = [
    {
      title: "Tổng thời gian học",
      value: "42.5 giờ",
      sub: "+3.5 giờ tuần này",
      icon: Clock,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Đề thi đã luyện",
      value: "28 bộ đề",
      sub: "Tỷ lệ hoàn thành 92%",
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Chuỗi ngày dài nhất",
      value: `${longestStreak} ngày`,
      sub: `Hiện tại: ${currentStreak} ngày`,
      icon: Flame,
      color: "text-amber-500 bg-amber-50 border-amber-200",
    },
    {
      title: "Điểm rèn luyện",
      value: `${totalPoints} pts`,
      sub: "Xếp hạng: Top 15%",
      icon: Award,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  const subjectStats = [
    { subject: "Tiếng Anh", accuracy: 88, tests: 12, avgScore: "8.6 / 10" },
    { subject: "Toán học", accuracy: 76, tests: 8, avgScore: "7.8 / 10" },
    { subject: "Ngữ văn", accuracy: 82, tests: 5, avgScore: "8.2 / 10" },
    { subject: "Vật lý", accuracy: 70, tests: 3, avgScore: "7.0 / 10" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
          HỌC TẬP · BÁO CÁO TIẾN ĐỘ
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Thống kê & Hiệu suất học tập
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi mức độ tiến bộ qua từng buổi luyện đề và bài tập.
        </p>
      </div>

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col justify-between"
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
                </h3>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                  {card.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Subject Performance Table ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Hiệu suất theo môn học</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">30 ngày qua</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="pb-3">Môn học</th>
                <th className="pb-3 text-center">Số bài đã luyện</th>
                <th className="pb-3 text-center">Tỷ lệ chính xác</th>
                <th className="pb-3 text-right">Điểm trung bình</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {subjectStats.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 text-slate-900 font-bold">{sub.subject}</td>
                  <td className="py-3.5 text-center text-slate-600">{sub.tests} bài</td>
                  <td className="py-3.5 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${sub.accuracy}%` }}
                        />
                      </div>
                      <span className="text-emerald-700 text-xs font-bold">
                        {sub.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-right font-black text-slate-900">
                    {sub.avgScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
