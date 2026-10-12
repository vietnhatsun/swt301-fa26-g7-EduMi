"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Loader2,
  Quote,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

export interface TeacherApplication {
  id: string;
  userId: string;
  teacherCode?: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phoneNumber?: string;
  gender?: "Nam" | "Nữ" | "Khác" | null;
  teacherRole?: "Gia sư" | "Giáo viên sư phạm";
  headline?: string;
  bio?: string;
  workExperience?: string;
  subjects?: string[];
  gradeLevels?: string[];
  degree?: string;
  experienceYears?: string;
  certificateUrl?: string | null;
  certificateFileName?: string | null;
  certificateFileSize?: number | null;
  verificationStatus: "draft" | "pending" | "approved" | "rejected";
  isVerifiedEducator: boolean;
  ratingAvg?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

const FILTER_SUBJECTS = [
  "Tất cả môn học",
  "Toán",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Ngữ văn",
  "Tiếng Anh",
  "Lịch sử",
  "Địa lý",
  "Tin học",
];

const FILTER_GRADES = ["Tất cả khối lớp", "Lớp 10", "Lớp 11", "Lớp 12", "Ôn Thi THPT"];

const FILTER_ROLES = ["Tất cả vai trò", "Gia sư", "Giáo viên sư phạm"];

const REJECT_REASONS = [
  "Ảnh chụp bằng cấp / chứng chỉ bị mờ, không rõ thông tin cá nhân và dấu mộc.",
  "Chưa cung cấp đầy đủ văn bằng chuyên môn hoặc bảng điểm sư phạm phù hợp.",
  "Môn học đăng ký chưa khớp với ngành học trong văn bằng chuyên môn.",
  "Thông tin kinh nghiệm giảng dạy chưa đầy đủ, cần bổ sung thời gian và đơn vị công tác.",
  "Hình ảnh chứng chỉ không hợp lệ hoặc không thuộc định dạng được chấp nhận.",
];

export interface TeacherApprovalPanelProps {
  onStatsChange?: (counts: { pending: number; approved: number; total: number }) => void;
}

export default function TeacherApprovalPanel({ onStatsChange }: TeacherApprovalPanelProps = {}) {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tất cả môn học");
  const [selectedGrade, setSelectedGrade] = useState("Tất cả khối lớp");
  const [selectedRole, setSelectedRole] = useState("Tất cả vai trò");

  // Modal xem chứng chỉ
  const [viewingCert, setViewingCert] = useState<{
    url: string;
    fileName: string;
    teacherName: string;
    isMock?: boolean;
  } | null>(null);

  // Modal từ chối đơn
  const [rejectingApp, setRejectingApp] = useState<TeacherApplication | null>(null);
  const [customRejectReason, setCustomRejectReason] = useState("");
  const [selectedPresetReason, setSelectedPresetReason] = useState(REJECT_REASONS[0]);

  // Tải danh sách hồ sơ từ API thực tế (Supabase)
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/staff/teacher-applications");
      const data = await res.json();

      if (res.ok && Array.isArray(data.applications)) {
        const dbApps = data.applications as TeacherApplication[];
        setApplications(dbApps);
        if (data.counts && onStatsChange) {
          onStatsChange(data.counts);
        }
      } else {
        setApplications([]);
        if (onStatsChange) {
          onStatsChange({ pending: 0, approved: 0, total: 0 });
        }
      }
    } catch {
      setApplications([]);
      if (onStatsChange) {
        onStatsChange({ pending: 0, approved: 0, total: 0 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Xử lý Duyệt đơn
  const handleApprove = async (teacherId: string) => {
    setActionProcessingId(teacherId);
    setActionFeedback(null);

    try {
      const res = await fetch("/api/staff/teacher-applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, action: "approve" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể duyệt hồ sơ giáo viên.");
      }

      const updatedApps = applications.map((app) =>
        app.id === teacherId
          ? { ...app, verificationStatus: "approved" as const, isVerifiedEducator: true }
          : app
      );
      setApplications(updatedApps);
      const pending = updatedApps.filter((a) => a.verificationStatus === "pending").length;
      const approved = updatedApps.filter((a) => a.verificationStatus === "approved").length;
      onStatsChange?.({ pending, approved, total: updatedApps.length });

      setActionFeedback({
        type: "success",
        message: "Phê duyệt hồ sơ giáo viên thành công! Quyền giảng dạy đã được kích hoạt.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setActionFeedback({ type: "error", message: msg });
    } finally {
      setActionProcessingId(null);
    }
  };

  // Xác nhận từ chối đơn
  const confirmReject = async () => {
    if (!rejectingApp) return;

    const teacherId = rejectingApp.id;
    const reason = customRejectReason.trim() || selectedPresetReason;

    setActionProcessingId(teacherId);
    setActionFeedback(null);

    try {
      const res = await fetch("/api/staff/teacher-applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId,
          action: "reject",
          rejectReason: reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể từ chối hồ sơ.");
      }

      const updatedApps = applications.map((app) =>
        app.id === teacherId
          ? { ...app, verificationStatus: "rejected" as const, isVerifiedEducator: false }
          : app
      );
      setApplications(updatedApps);
      const pending = updatedApps.filter((a) => a.verificationStatus === "pending").length;
      const approved = updatedApps.filter((a) => a.verificationStatus === "approved").length;
      onStatsChange?.({ pending, approved, total: updatedApps.length });

      setActionFeedback({
        type: "success",
        message: `Đã từ chối đơn xét duyệt của ${rejectingApp.fullName}. Lý do: ${reason}`,
      });
      setRejectingApp(null);
      setCustomRejectReason("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setActionFeedback({ type: "error", message: msg });
    } finally {
      setActionProcessingId(null);
    }
  };

  // Thu hồi quyền giảng dạy
  const handleRevoke = async (teacherId: string) => {
    if (!confirm("Bạn có chắc chắn muốn thu hồi quyền giảng dạy của giáo viên này?")) return;

    setActionProcessingId(teacherId);
    setActionFeedback(null);

    try {
      const res = await fetch("/api/staff/teacher-applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, action: "revoke" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể thu hồi quyền.");
      }

      const updatedApps = applications.map((app) =>
        app.id === teacherId
          ? { ...app, verificationStatus: "rejected" as const, isVerifiedEducator: false }
          : app
      );
      setApplications(updatedApps);
      const pending = updatedApps.filter((a) => a.verificationStatus === "pending").length;
      const approved = updatedApps.filter((a) => a.verificationStatus === "approved").length;
      onStatsChange?.({ pending, approved, total: updatedApps.length });

      setActionFeedback({
        type: "success",
        message: "Đã thu hồi quyền giảng dạy của giáo viên.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      setActionFeedback({ type: "error", message: msg });
    } finally {
      setActionProcessingId(null);
    }
  };

  // Xem chứng chỉ Cloudflare R2
  const handleViewCert = async (app: TeacherApplication) => {
    if (!app.certificateUrl) {
      alert("Hồ sơ này chưa có file chứng chỉ đính kèm.");
      return;
    }

    try {
      const res = await fetch(
        `/api/teacher/certificate-view?key=${encodeURIComponent(app.certificateUrl)}&userId=${encodeURIComponent(app.id)}`
      );
      const data = await res.json();

      if (res.ok && data.downloadUrl) {
        setViewingCert({
          url: data.downloadUrl,
          fileName: app.certificateFileName || "Chung_Chi_Giang_Vien.pdf",
          teacherName: app.fullName,
          isMock: Boolean(data.isMock),
        });
      } else {
        alert(data.error || "Không thể lấy liên kết xem tài liệu.");
      }
    } catch {
      alert("Lỗi kết nối khi tải chứng chỉ.");
    }
  };

  // Danh sách đơn pending (Phần trên)
  const pendingApplications = useMemo(() => {
    return applications.filter((app) => app.verificationStatus === "pending");
  }, [applications]);

  // Danh sách hồ sơ đã duyệt kèm lọc (Phần dưới)
  const approvedApplications = useMemo(() => {
    return applications.filter((app) => {
      if (app.verificationStatus !== "approved") return false;

      // Tìm kiếm theo text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = app.fullName.toLowerCase().includes(query);
        const matchesEmail = app.email.toLowerCase().includes(query);
        const matchesSubjects = app.subjects?.some((s) => s.toLowerCase().includes(query));
        const matchesDegree = app.degree?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesSubjects && !matchesDegree) {
          return false;
        }
      }

      // Lọc theo môn học
      if (selectedSubject !== "Tất cả môn học") {
        if (!app.subjects?.includes(selectedSubject)) return false;
      }

      // Lọc theo khối lớp
      if (selectedGrade !== "Tất cả khối lớp") {
        if (!app.gradeLevels?.includes(selectedGrade)) return false;
      }

      // Lọc theo vai trò
      if (selectedRole !== "Tất cả vai trò") {
        if (app.teacherRole !== selectedRole) return false;
      }

      return true;
    });
  }, [applications, searchQuery, selectedSubject, selectedGrade, selectedRole]);

  const totalApprovedCount = applications.filter((a) => a.verificationStatus === "approved").length;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSubject("Tất cả môn học");
    setSelectedGrade("Tất cả khối lớp");
    setSelectedRole("Tất cả vai trò");
  };

  const isFiltered =
    Boolean(searchQuery.trim()) ||
    selectedSubject !== "Tất cả môn học" ||
    selectedGrade !== "Tất cả khối lớp" ||
    selectedRole !== "Tất cả vai trò";

  return (
    <div className="space-y-7 pb-12">
      {/* 1. Header Banner của Tab Duyệt giáo viên */}
      <section className="relative overflow-hidden rounded-[28px] border border-emerald-400/30 bg-gradient-to-r from-[#00563f] via-[#087b58] to-[#02845f] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 h-44 w-72 rounded-full bg-amber-300/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-amber-300 shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-200">
                Staff Portal · Xét duyệt hồ sơ giáo viên
              </p>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Tiếp nhận & Duyệt đơn xin làm giáo viên
            </h1>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-50/90 sm:text-sm">
              Kiểm tra thông tin chuyên môn, xác minh văn bằng chứng chỉ qua Cloudflare R2 an toàn và
              cấp quyền mở lớp giảng dạy cho các ứng viên đủ điều kiện.
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md">
              <span className="text-2xl font-black text-amber-300">{pendingApplications.length}</span>
              <span className="text-[11px] font-bold text-emerald-100">Chờ xét duyệt</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md">
              <span className="text-2xl font-black text-white">{totalApprovedCount}</span>
              <span className="text-[11px] font-bold text-emerald-100">Đã phê duyệt</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Banner */}
      {actionFeedback && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm transition-all ${
            actionFeedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : "border-rose-200 bg-rose-50 text-rose-950"
          }`}
        >
          <div className="flex items-center gap-3">
            {actionFeedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            )}
            <p className="text-sm font-bold">{actionFeedback.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          2. PHẦN TRÊN: NHỮNG ĐƠN MÀ GIẢNG VIÊN GỬI (PENDING APPLICATIONS)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  Đơn xin làm giáo viên chờ xét duyệt
                </h2>
                <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                  {pendingApplications.length} đơn mới
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Các hồ sơ đang chờ Staff kiểm tra văn bằng và xác nhận quyền giảng dạy.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchApplications}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-extrabold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới danh sách
          </button>
        </div>

        {isLoading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[28px] border border-emerald-100 bg-white p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="mt-3 text-sm font-bold text-slate-600">Đang tải danh sách hồ sơ giáo viên...</p>
          </div>
        ) : pendingApplications.length > 0 ? (
          <div className="space-y-6">
            {pendingApplications.map((app) => (
              <StaffTeacherCvCard
                key={app.id}
                application={app}
                isProcessing={actionProcessingId === app.id}
                onView={handleViewCert}
                onApprove={handleApprove}
                onReject={(a) => {
                  setRejectingApp(a);
                  setSelectedPresetReason(REJECT_REASONS[0]);
                  setCustomRejectReason("");
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[190px] flex-col items-center justify-center rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-base font-black text-slate-900">
              Không có đơn nào đang chờ duyệt
            </h3>
            <p className="mt-1 max-w-md text-xs font-semibold leading-relaxed text-slate-500">
              Tất cả các đơn đăng ký giáo viên đã được Staff xử lý hoàn tất. Các đơn mới gửi sẽ hiển
              thị tại đây ngay khi ứng viên nộp hồ sơ.
            </p>
          </div>
        )}
      </section>

      {/* =========================================================================
          3. PHẦN DƯỚI: BỘ LỌC & DANH SÁCH HỒ SƠ ĐÃ DUYỆT THÀNH CÔNG
      ========================================================================= */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  Hồ sơ giáo viên đã duyệt thành công
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800">
                  {approvedApplications.length} giáo viên
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Danh sách giáo viên chính thức đã được xác thực bằng cấp và đang hoạt động trên hệ thống EduMi.
              </p>
            </div>
          </div>
        </div>

        {/* Thanh công cụ Bộ lọc (Filters Toolbar) */}
        <div className="rounded-[24px] border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            {/* Input tìm kiếm */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên giáo viên, email, văn bằng..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-bold text-slate-800 shadow-inner outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Dropdown Môn học */}
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-8 text-xs font-extrabold text-slate-700 shadow-inner outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 cursor-pointer"
              >
                {FILTER_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Dropdown Khối lớp */}
            <div className="relative">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-8 text-xs font-extrabold text-slate-700 shadow-inner outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 cursor-pointer"
              >
                {FILTER_GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Dropdown Vai trò */}
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-8 text-xs font-extrabold text-slate-700 shadow-inner outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 cursor-pointer"
              >
                {FILTER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Nút Reset bộ lọc */}
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-black text-rose-700 hover:bg-rose-100 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* Danh sách Card CV đã duyệt thành công */}
        {approvedApplications.length > 0 ? (
          <div className="space-y-6">
            {approvedApplications.map((app) => (
              <StaffTeacherCvCard
                key={app.id}
                application={app}
                mode="approved"
                isProcessing={actionProcessingId === app.id}
                onView={handleViewCert}
                onRevoke={handleRevoke}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[190px] flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white p-8 text-center">
            <UserRound className="h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-base font-black text-slate-900">
              {isFiltered
                ? "Không tìm thấy giáo viên phù hợp với bộ lọc"
                : "Chưa có giáo viên nào được phê duyệt"}
            </h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {isFiltered
                ? "Hãy thử tìm với từ khóa khác hoặc bấm 'Đặt lại' bộ lọc."
                : "Các hồ sơ sau khi được duyệt ở phần trên sẽ hiển thị tại danh sách này."}
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800 transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. MODAL XEM CHI TIẾT & CHỨNG CHỈ (R2 VIEW MODAL)
      ========================================================================= */}
      {viewingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Bằng cấp & Chứng chỉ: {viewingCert.teacherName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 truncate max-w-md">
                    Tệp: {viewingCert.fileName} · Lưu trữ an toàn Cloudflare R2
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingCert(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: File Viewer */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
              {viewingCert.fileName.toLowerCase().endsWith(".pdf") ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                  <FileText className="h-16 w-16 text-rose-500" />
                  <p className="mt-4 text-base font-black text-slate-900">{viewingCert.fileName}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Tệp tài liệu PDF đã được xác thực an toàn qua chữ ký presigned URL của Cloudflare R2.
                  </p>
                  <a
                    href={viewingCert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-emerald-800 transition"
                  >
                    <ExternalLink className="h-4 w-4" /> Mở xem toàn màn hình
                  </a>
                </div>
              ) : (
                <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={viewingCert.url}
                    alt={viewingCert.fileName}
                    className="max-h-[500px] w-auto rounded-xl object-contain shadow-xs"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
              <span className="text-[11px] font-bold text-slate-400">
                Được bảo vệ bởi chứng chỉ số Cloudflare R2 Bucket
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={viewingCert.url}
                  download={viewingCert.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
                >
                  <Download className="h-3.5 w-3.5" /> Tải về máy
                </a>
                <button
                  type="button"
                  onClick={() => setViewingCert(null)}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-black text-white hover:bg-slate-900 transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. MODAL TỪ CHỐI ĐƠN (REJECT APPLICATION MODAL)
      ========================================================================= */}
      {rejectingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-[28px] border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-slate-950">
                  Từ chối đơn xin làm giáo viên
                </h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                  Ứng viên: <strong className="text-slate-800">{rejectingApp.fullName}</strong> ({rejectingApp.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRejectingApp(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <label className="text-xs font-extrabold text-slate-700">
                Chọn lý do từ chối để thông báo tới giáo viên:
              </label>
              <div className="space-y-1.5">
                {REJECT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                      selectedPresetReason === reason && !customRejectReason
                        ? "border-rose-400 bg-rose-50/70 text-rose-950"
                        : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      checked={selectedPresetReason === reason && !customRejectReason}
                      onChange={() => {
                        setSelectedPresetReason(reason);
                        setCustomRejectReason("");
                      }}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700">
                  Hoặc nhập lý do chi tiết khác:
                </label>
                <textarea
                  rows={2}
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  placeholder="Nhập lý do cụ thể hoặc hướng dẫn ứng viên bổ sung thêm tài liệu..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 shadow-inner outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setRejectingApp(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={actionProcessingId === rejectingApp.id}
                onClick={confirmReject}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-black text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
              >
                {actionProcessingId === rejectingApp.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>Xác nhận từ chối</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Component hiển thị Card CV của giáo viên cho Staff
 * Thiết kế ĐỒNG NHẤT với "Hồ sơ của bạn" bên Teacher (TeacherProfileSummaryCard)
 */
function StaffTeacherCvCard({
  application,
  mode = "pending",
  isProcessing = false,
  onView,
  onApprove,
  onReject,
  onRevoke,
}: {
  application: TeacherApplication;
  mode?: "pending" | "approved";
  isProcessing?: boolean;
  onView: (app: TeacherApplication) => void;
  onApprove?: (id: string) => void;
  onReject?: (app: TeacherApplication) => void;
  onRevoke?: (id: string) => void;
}) {
  const subjectsText = application.subjects?.length ? application.subjects.join(", ") : "";
  const gradeLevelsText = application.gradeLevels?.length ? application.gradeLevels.join(", ") : "";
  const isVerified = Boolean(
    application.isVerifiedEducator || application.verificationStatus === "approved"
  );

  const formatBytes = (bytes?: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <article className="overflow-hidden rounded-[28px] border border-emerald-100/90 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-300 lg:p-6">
      <div className="flex flex-col gap-5">
        {/* Top Header Row của Card */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              {application.teacherCode || "GV-MỚI"}
            </span>
            {application.createdAt && (
              <span className="text-xs font-semibold text-slate-400">
                Nộp đơn ngày: {new Date(application.createdAt).toLocaleDateString("vi-VN")}
              </span>
            )}
          </div>

          {/* Status Badge */}
          {mode === "pending" ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-black text-amber-800 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              Đang chờ Staff xét duyệt
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-black text-emerald-800 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Đã phê duyệt giảng dạy
            </span>
          )}
        </div>

        {/* Main Grid: Cột trái (Avatar + Dòng chữ ký) | Cột phải (Chi tiết hồ sơ) */}
        <div className="grid gap-5 lg:grid-cols-[190px_1fr] lg:items-start">
          {/* Cột trái */}
          <div className="relative mx-auto flex flex-col items-center lg:mx-0">
            <div className="pointer-events-none absolute -left-2 -top-2 z-10 text-emerald-500 opacity-80">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>

            <div className="group relative h-44 w-44 overflow-hidden rounded-[24px] border-2 border-emerald-300/80 bg-white p-1.5 shadow-[0_8px_24px_rgba(6,78,59,0.08)] ring-4 ring-emerald-50/80 transition-all hover:scale-[1.02]">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[18px] bg-slate-100">
                {application.avatarUrl ? (
                  <Image
                    src={application.avatarUrl}
                    alt={application.fullName || "Giáo viên"}
                    fill
                    sizes="180px"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#064e3b] via-[#047857] to-[#065f46] text-white select-none shadow-inner">
                    <span className="text-6xl font-black drop-shadow-md">
                      {(application.fullName || "G").trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="mt-2 text-xs font-bold tracking-wide text-emerald-100">
                      {application.fullName ? application.fullName.split(" ").slice(-1)[0] : "Giáo viên"}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </div>
            </div>

            <div className="mt-4.5 flex items-center justify-center gap-1.5 -rotate-3 text-emerald-700">
              <span
                className="text-[15px] font-black italic tracking-tight text-[#047857]"
                style={{ fontFamily: "cursive, sans-serif" }}
              >
                Giảng dạy cùng EduMi! ♡
              </span>
            </div>
          </div>

          {/* Cột phải */}
          <div className="flex min-w-0 flex-col justify-center">
            {/* Tên & Badge vai trò */}
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-slate-950">
                Thầy/Cô {application.fullName}
              </h2>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800">
                {application.teacherRole || "Gia sư"}
              </span>
              {isVerified && <BadgeCheck className="h-5 w-5 fill-emerald-600 text-white" />}
            </div>

            {/* Meta Subtitle */}
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                {subjectsText || "Toán"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                {application.experienceYears || "Chưa cập nhật kinh nghiệm"}
              </span>
              {application.email && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{application.email}</span>
                </>
              )}
              {application.phoneNumber && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{application.phoneNumber}</span>
                </>
              )}
            </div>

            {/* Section 1: Giới thiệu bản thân */}
            <div className="mt-3.5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 transition-all hover:border-emerald-200/80 hover:bg-emerald-50/70">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  Giới thiệu bản thân
                </p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-600">
                  {application.bio ? (
                    application.bio
                  ) : (
                    <span className="italic text-slate-400">Chưa có lời giới thiệu bản thân.</span>
                  )}
                </p>
              </div>
              <Quote className="h-4 w-4 shrink-0 rotate-180 text-emerald-300/80" />
            </div>

            {/* Section 2: Kinh nghiệm làm việc */}
            <div className="mt-2.5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 transition-all hover:border-emerald-200/80 hover:bg-emerald-50/70">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  Kinh nghiệm làm việc
                </p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-600">
                  {application.workExperience ? (
                    application.workExperience
                  ) : (
                    <span className="italic text-slate-400">
                      Chưa cập nhật quá trình kinh nghiệm công tác.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* 4 Pastel Metric Pills */}
            <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {/* 1. Đánh giá */}
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span>Đánh giá</span>
                </div>
                <p className="mt-1 text-base font-black text-slate-900">
                  {application.totalReviews && application.totalReviews > 0
                    ? application.ratingAvg?.toFixed(1)
                    : "Mới"}
                </p>
              </div>

              {/* 2. Kinh nghiệm */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800">
                  <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Kinh nghiệm</span>
                </div>
                <p className="mt-1 text-base font-black text-slate-900 truncate">
                  {application.experienceYears || "Chưa có"}
                </p>
              </div>

              {/* 3. Chuyên môn */}
              <div className="rounded-2xl border border-sky-200/80 bg-sky-50/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-sky-800">
                  <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                  <span>Chuyên môn</span>
                </div>
                <p className="mt-1 truncate text-base font-black text-slate-900">
                  {application.subjects?.length ? application.subjects.join(", ") : "Chưa chọn"}
                </p>
              </div>

              {/* 4. Khối lớp */}
              <div className="rounded-2xl border border-violet-200/80 bg-violet-50/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-violet-800">
                  <GraduationCap className="h-3.5 w-3.5 text-violet-600" />
                  <span>Khối lớp</span>
                </div>
                <p className="mt-1 truncate text-base font-black text-slate-900">
                  {gradeLevelsText || "Chưa chọn"}
                </p>
              </div>
            </div>

            {/* Bằng cấp & Tài liệu chứng chỉ đính kèm */}
            <div className="mt-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {application.degree || application.certificateFileName || "Chưa có bằng cấp"}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 truncate">
                      {application.certificateFileName
                        ? `${application.certificateFileName} ${
                            application.certificateFileSize
                              ? `(${formatBytes(application.certificateFileSize)})`
                              : ""
                          } · Lưu trữ Cloudflare R2`
                        : "Chưa tải lên tệp chứng chỉ"}
                    </p>
                  </div>
                </div>

                {application.certificateUrl && (
                  <button
                    type="button"
                    onClick={() => onView(application)}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    <span>Xem file</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HÀNG 3 BUTTON CHO STAFF: XEM, DUYỆT, TỪ CHỐI
        ========================================================================= */}
        {mode === "pending" ? (
          <div className="mt-2 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
            {/* 1. Button XEM */}
            <button
              type="button"
              onClick={() => onView(application)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-black text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
            >
              <Eye className="h-4 w-4 text-slate-600" />
              <span>Xem chi tiết & Chứng chỉ</span>
            </button>

            {/* 2. Button TỪ CHỐI */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onReject && onReject(application)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 text-xs font-black text-rose-700 shadow-2xs hover:bg-rose-100 hover:border-rose-300 transition cursor-pointer disabled:opacity-50"
            >
              <XCircle className="h-4 w-4 text-rose-600" />
              <span>Từ chối</span>
            </button>

            {/* 3. Button DUYỆT */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onApprove && onApprove(application.id)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-xs font-black text-white shadow-md shadow-emerald-700/25 hover:bg-emerald-800 transition cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang duyệt...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Duyệt hồ sơ</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              Giáo viên đã được xác thực chính thức và mở khóa quyền giảng dạy
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onView(application)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-slate-500" />
                <span>Xem lại chứng chỉ</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onRevoke && onRevoke(application.id)}
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
              >
                Thu hồi quyền
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
