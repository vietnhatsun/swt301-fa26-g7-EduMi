"use client";

import React, { useState } from "react";
import {
  Target,
  Plus,
  Trophy,
  Clock,
  Check,
  Gift,
  Calendar,
  X,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import ParentEmptyChildState from "@/components/parent/ParentEmptyChildState";

/* ── Mock data ── */

const GOALS_DATA = {
  active: [
    {
      id: "g1",
      title: "Đạt 9.0 bài kiểm tra Toán tuần này",
      reward: "Xem phim CGV cuối tuần 🎬",
      progress: 80,
      status: "in_progress" as const,
      deadline: "Chủ Nhật, 12/10/2026",
      createdAt: "06/10/2026",
      milestones: [
        { label: "Hoàn thành 5 bài ôn tập", done: true },
        { label: "Làm 2 đề thử", done: true },
        { label: "Kiểm tra chính thức ≥ 9.0", done: false },
      ],
    },
    {
      id: "g2",
      title: "Hoàn thành 100% bài tập tuần",
      reward: "Đi ăn pizza cuối tuần 🍕",
      progress: 60,
      status: "in_progress" as const,
      deadline: "Thứ Bảy, 11/10/2026",
      createdAt: "05/10/2026",
      milestones: [
        { label: "Bài tập Toán (3/3)", done: true },
        { label: "Bài tập Vật lý (1/2)", done: false },
        { label: "Bài tập Tiếng Anh (0/2)", done: false },
      ],
    },
  ],
  completed: [
    {
      id: "g3",
      title: "Học liên tục 7 ngày không nghỉ",
      reward: "Mua sách mới 📚",
      progress: 100,
      status: "rewarded" as const,
      deadline: "01/10/2026",
      createdAt: "25/09/2026",
      completedAt: "01/10/2026",
    },
    {
      id: "g4",
      title: "Đạt Top 10 bảng xếp hạng lớp Toán",
      reward: "Đi công viên cuối tuần 🎢",
      progress: 100,
      status: "completed" as const,
      deadline: "28/09/2026",
      createdAt: "20/09/2026",
      completedAt: "27/09/2026",
    },
  ],
};

interface ParentGoalsTabProps {
  childName?: string;
  onNavigateTab?: (tab: string) => void;
  onQuickLink?: (code: string) => void;
}

export default function ParentGoalsTab({
  childName,
  onNavigateTab,
  onQuickLink,
}: ParentGoalsTabProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeView, setActiveView] = useState<"active" | "completed">("active");

  if (!childName) {
    return (
      <ParentEmptyChildState
        title="Chưa có mục tiêu học tập"
        description="Vui lòng liên kết tài khoản học sinh để đặt mục tiêu tuần, tạo phần thưởng khích lệ và theo dõi con thực hiện."
        onNavigateTab={onNavigateTab || (() => {})}
        onQuickLink={onQuickLink}
      />
    );
  }

  // Form state for new goal
  const [newTitle, setNewTitle] = useState("");
  const [newReward, setNewReward] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const handleCreateGoal = () => {
    // In production, this would call POST /api/parent/goals
    alert(`Tạo mục tiêu:\n• ${newTitle}\n• Phần thưởng: ${newReward}\n• Hạn: ${newDeadline}`);
    setShowCreateModal(false);
    setNewTitle("");
    setNewReward("");
    setNewDeadline("");
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
            CỔNG PHỤ HUYNH · MỤC TIÊU
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mục tiêu & Phần thưởng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tạo thử thách học tập cho con và đặt phần thưởng khích lệ khi hoàn thành.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tạo thử thách mới</span>
          <span className="sm:hidden">Tạo mới</span>
        </button>
      </div>

      {/* ── Tab switch ── */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveView("active")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeView === "active"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            Đang thực hiện ({GOALS_DATA.active.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView("completed")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeView === "completed"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Đã hoàn thành ({GOALS_DATA.completed.length})
          </span>
        </button>
      </div>

      {/* ── Active Goals ── */}
      {activeView === "active" && (
        <div className="space-y-4">
          {GOALS_DATA.active.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {goal.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {goal.reward}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Hạn: {goal.deadline}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-lg font-black text-emerald-700">
                    {goal.progress}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 transition-all duration-700 relative"
                    style={{ width: `${goal.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Milestones checklist */}
              {goal.milestones && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Các bước hoàn thành
                  </p>
                  {goal.milestones.map((ms, msIdx) => (
                    <div
                      key={msIdx}
                      className={`flex items-center gap-2.5 py-2 px-3 rounded-lg transition-colors ${
                        ms.done ? "bg-emerald-50/80" : "bg-slate-50/80"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          ms.done
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        {ms.done ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          ms.done
                            ? "text-emerald-700 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {ms.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Create new goal CTA */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="w-full py-6 rounded-2xl border-2 border-dashed border-emerald-200 text-sm font-bold text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Tạo thử thách mới cho con
          </button>
        </div>
      )}

      {/* ── Completed Goals ── */}
      {activeView === "completed" && (
        <div className="space-y-4">
          {GOALS_DATA.completed.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {goal.status === "rewarded" ? (
                      <PartyPopper className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Trophy className="w-4 h-4 text-emerald-600" />
                    )}
                    <h3 className="text-sm font-bold text-slate-900">
                      {goal.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] mt-1">
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {goal.reward}
                    </span>
                    <span className="text-slate-400 font-medium">
                      Hoàn thành: {goal.completedAt}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {goal.status === "rewarded" ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      Đã thưởng
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Xác nhận thưởng
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Goal Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 z-10 border border-emerald-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Tạo Thử Thách Mới
                </h2>
                <p className="text-[10px] text-slate-500 font-medium">
                  Đặt mục tiêu và phần thưởng khích lệ con
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mục tiêu / Nhiệm vụ
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Đạt 9.0 bài kiểm tra Toán tuần này"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl text-xs sm:text-sm text-slate-900 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phần thưởng gia đình 🎁
                </label>
                <input
                  type="text"
                  value={newReward}
                  onChange={(e) => setNewReward(e.target.value)}
                  placeholder="VD: Đi xem phim CGV cuối tuần"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl text-xs sm:text-sm text-slate-900 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl text-xs sm:text-sm text-slate-900 transition-all outline-none cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleCreateGoal}
                disabled={!newTitle || !newReward}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                Tạo thử thách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
