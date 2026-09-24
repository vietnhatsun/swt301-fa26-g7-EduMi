"use client";

import React, { useState } from "react";
import {
  School,
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Search,
  Sparkles,
  ExternalLink,
  Plus,
  PlayCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

interface OnlineClass {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  teacher: string;
  teacherAvatar?: string;
  schedule: string;
  roomName: string;
  status: "upcoming" | "completed" | "in_progress" | "future";
  statusLabel: string;
  statusColor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextSessionTime?: string;
  meetUrl?: string;
  hasRecord?: boolean;
}

export default function ClassesTab() {
  const [filter, setFilter] = useState<"all" | "today" | "active" | "ended">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [joinSuccessMsg, setJoinSuccessMsg] = useState("");

  const myClasses: OnlineClass[] = [
    {
      id: "cls-01",
      title: "Toán 12: Chuyên đề Hàm số, Tích phân & Logarit VIP",
      subject: "Toán học",
      subjectColor: "bg-blue-50 text-blue-700 border-blue-200",
      teacher: "Thầy Đức · Thạc sĩ Sư phạm Toán",
      schedule: "Thứ 2, Thứ 5 (19:30 - 21:00)",
      roomName: "Lớp học ảo EduMi #01 (Google Meet)",
      status: "upcoming",
      statusLabel: "Sắp diễn ra hôm nay",
      statusColor: "bg-amber-50 text-amber-800 border-amber-200/80 animate-pulse",
      progress: 35,
      completedLessons: 12,
      totalLessons: 36,
      nextSessionTime: "Hôm nay, 19:30 - 21:00",
      meetUrl: "https://meet.google.com",
    },
    {
      id: "cls-02",
      title: "Ngữ pháp Tiếng Anh: 12 Thì & Câu bị động nâng cao",
      subject: "Tiếng Anh",
      subjectColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      teacher: "Cô Thu Hà · 8.5 IELTS",
      schedule: "Thứ 2, Thứ 4 (08:00 - 09:30)",
      roomName: "Lớp học ảo EduMi #02",
      status: "completed",
      statusLabel: "Đã hoàn thành hôm nay",
      statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      progress: 75,
      completedLessons: 18,
      totalLessons: 24,
      nextSessionTime: "Thứ 4 tới, 08:00 - 09:30",
      hasRecord: true,
    },
    {
      id: "cls-03",
      title: "Vật lý 12: Dao động cơ học & Dòng điện xoay chiều",
      subject: "Vật lý",
      subjectColor: "bg-purple-50 text-purple-700 border-purple-200",
      teacher: "Thầy Quang · Chuyên gia Luyện thi ĐH",
      schedule: "Thứ 4, Thứ 7 (19:30 - 21:00)",
      roomName: "Lớp học ảo EduMi #03",
      status: "future",
      statusLabel: "Buổi tới: Thứ 4",
      statusColor: "bg-slate-100 text-slate-700 border-slate-200",
      progress: 26,
      completedLessons: 8,
      totalLessons: 30,
      nextSessionTime: "Thứ 4 (23/09), 19:30",
    },
    {
      id: "cls-04",
      title: "Ngữ văn 12: Kỹ năng Viết Nghị luận văn học đạt điểm 8+",
      subject: "Ngữ văn",
      subjectColor: "bg-rose-50 text-rose-700 border-rose-200",
      teacher: "Cô Phương Linh · Giảng viên Văn học",
      schedule: "Chủ nhật (14:00 - 16:30)",
      roomName: "Lớp học ảo EduMi #05",
      status: "future",
      statusLabel: "Buổi tới: Chủ nhật",
      statusColor: "bg-slate-100 text-slate-700 border-slate-200",
      progress: 30,
      completedLessons: 6,
      totalLessons: 20,
      nextSessionTime: "Chủ nhật (27/09), 14:00",
    },
  ];

  const filteredClasses = myClasses.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (filter === "today") return item.status === "upcoming" || item.status === "completed";
    if (filter === "active") return item.status !== "completed";
    return true;
  });

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCodeInput.trim()) return;
    setJoinSuccessMsg(`Đã gửi yêu cầu tham gia lớp với mã "${classCodeInput.toUpperCase()}"!`);
    setTimeout(() => {
      setShowJoinModal(false);
      setClassCodeInput("");
      setJoinSuccessMsg("");
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
            QUẢN LÝ LỚP HỌC TRỰC TUYẾN
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Lớp học của tôi</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              4 lớp đang học
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowJoinModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tham gia bằng mã lớp</span>
        </button>
      </div>

      {/* ── 4 KPI Stats Summary ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <School className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Lớp đang theo học
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">4</span>
            <span className="text-xs text-slate-500 font-medium">lớp trực tuyến</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Toán, Văn, Anh, Lý</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Lịch học hôm nay
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">2</span>
            <span className="text-xs text-slate-500 font-medium">buổi học</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">1 hoàn thành · 1 sắp tới</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Giờ học tích lũy
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">32.5</span>
            <span className="text-xs text-slate-500 font-medium">giờ học</span>
          </div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">+4.5h trong tuần này</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Tỉ lệ chuyên cần
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">98%</span>
            <span className="text-xs text-slate-500 font-medium">tham dự đúng giờ</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Xuất sắc · Hạng A</p>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả (4)
          </button>
          <button
            type="button"
            onClick={() => setFilter("today")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "today"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Lịch hôm nay (2)
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "active"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Đang học (3)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo môn, tên lớp, giáo viên..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ── Class Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] hover:shadow-[0_8px_30px_rgba(6,78,59,0.08)] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Subject badge & Status tag */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cls.subjectColor}`}
                >
                  {cls.subject}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cls.statusColor}`}
                >
                  {cls.statusLabel}
                </span>
              </div>

              {/* Class Title */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                {cls.title}
              </h3>

              {/* Teacher & Schedule info */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">{cls.teacher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{cls.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{cls.roomName}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Tiến độ khóa học</span>
                  <span className="font-bold text-slate-800">
                    {cls.completedLessons}/{cls.totalLessons} buổi ({cls.progress}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${cls.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                {cls.nextSessionTime ? `Lịch: ${cls.nextSessionTime}` : "Đang cập nhật"}
              </span>

              {cls.status === "upcoming" && (
                <a
                  href={cls.meetUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Vào lớp học ngay</span>
                </a>
              )}

              {cls.status === "completed" && (
                <button
                  type="button"
                  onClick={() => alert("Đang mở video ghi hình buổi học đã hoàn thành.")}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xem Record</span>
                </button>
              )}

              {cls.status === "future" && (
                <button
                  type="button"
                  onClick={() => alert("Tài liệu bài học sẽ được mở trước giờ học 30 phút.")}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tài liệu</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Join Class Modal ── */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Tham gia lớp học</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Nhập mã lớp học gồm 6 ký tự do thầy cô hoặc ban đào tạo EduMi cung cấp để vào lớp.
            </p>

            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã lớp học (Ví dụ: EDM-12A)
                </label>
                <input
                  type="text"
                  required
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  placeholder="Nhập mã lớp..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 uppercase tracking-wider"
                />
              </div>

              {joinSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{joinSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                >
                  Xác nhận vào lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
