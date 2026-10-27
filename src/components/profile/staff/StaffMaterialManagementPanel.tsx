"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Eye,
  Trash2,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Download,
  Star,
  Globe,
  Lock,
  Edit3,
  Check,
  LayoutGrid,
  List,
  Flame,
  ArrowRight,
  ShieldCheck,
  FileText,
  Upload,
  FileUp,
  Loader2,
  X,
  ChevronRight,
  ChevronDown,
  Layers,
  Zap,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import CustomSelect from "@/components/common/CustomSelect";

// Bảng màu chủ đề chuẩn cho thẻ tài liệu EduMi
export const MATERIAL_THEME_PALETTES = [
  { name: "Cam THPT", bgClass: "bg-[#e07328]", accentClass: "text-[#e07328]", hex: "#e07328" },
  { name: "Xanh ĐGNL", bgClass: "bg-[#0284c7]", accentClass: "text-[#0284c7]", hex: "#0284c7" },
  { name: "Hồng sen Anh", bgClass: "bg-[#be4c73]", accentClass: "text-[#be4c73]", hex: "#be4c73" },
  { name: "Đỏ gạch Lý", bgClass: "bg-[#bf5447]", accentClass: "text-[#bf5447]", hex: "#bf5447" },
  { name: "Xanh ngọc Hóa", bgClass: "bg-[#0d9488]", accentClass: "text-[#0d9488]", hex: "#0d9488" },
  { name: "Tím Văn", bgClass: "bg-[#7356bc]", accentClass: "text-[#7356bc]", hex: "#7356bc" },
  { name: "Xanh lá Sinh", bgClass: "bg-[#16a34a]", accentClass: "text-[#16a34a]", hex: "#16a34a" },
  { name: "Xanh đậm Toán", bgClass: "bg-[#2563eb]", accentClass: "text-[#2563eb]", hex: "#2563eb" },
  { name: "Nâu Sử", bgClass: "bg-[#b45309]", accentClass: "text-[#b45309]", hex: "#b45309" },
  { name: "Xanh rừng Địa", bgClass: "bg-[#059669]", accentClass: "text-[#059669]", hex: "#059669" },
  { name: "Tím Học kỳ", bgClass: "bg-[#7c3aed]", accentClass: "text-[#7c3aed]", hex: "#7c3aed" },
  { name: "Hồng ĐGTD", bgClass: "bg-[#db2777]", accentClass: "text-[#db2777]", hex: "#db2777" },
];

export type MaterialPatternType = "waves" | "clouds" | "confetti" | "stripes" | "ripples" | "chevrons";

export const PATTERN_OPTIONS: { id: MaterialPatternType; label: string }[] = [
  { id: "waves", label: "Lượn sóng" },
  { id: "ripples", label: "Gợn nước đồng tâm" },
  { id: "clouds", label: "Mây uốn lượn" },
  { id: "confetti", label: "Kim tuyến" },
  { id: "stripes", label: "Sọc chéo" },
  { id: "chevrons", label: "Ziczac" },
];

export const SUBJECT_OPTIONS = [
  "Toán học",
  "Tiếng Anh",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Ngữ văn",
  "Lịch sử",
  "Địa lý",
  "Tin học",
  "IELTS",
];

export const GRADE_OPTIONS = [
  "Lớp 10",
  "Lớp 11",
  "Lớp 12",
  "Ôn thi THPT Quốc Gia",
  "ĐGNL ĐHQG",
  "ĐGTD Bách Khoa",
  "IELTS 7.0+",
];

export interface MaterialItem {
  id: string;
  teacherId?: string;
  teacherName?: string;
  teacherEmail?: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  cardCode: string;
  fileType: "PDF" | "DOCX";
  fileName: string;
  fileSize: number;
  fileKey: string;
  filePublicUrl: string | null;
  pageCount: number;
  bgClass: string;
  accentClass: string;
  pattern: MaterialPatternType;
  author: string;
  visibility: string;
  status: "approved" | "draft" | "hidden" | "pending" | "rejected";
  allowDownload: boolean;
  downloadCount: number;
  viewCount: number;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

interface StaffMaterialManagementPanelProps {
  staffName?: string;
  staffId?: string;
  defaultSubTab?: "manage" | "create";
}

// Hoa văn trang trí SVG nền thẻ tài liệu
function MaterialCardPattern({ pattern }: { pattern: MaterialPatternType }) {
  if (pattern === "waves") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-25 pointer-events-none" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-50,80 Q50,20 150,100 T350,60" fill="none" stroke="white" strokeWidth="34" strokeLinecap="round" />
        <path d="M-30,220 Q70,150 170,230 T370,190" fill="none" stroke="white" strokeWidth="38" strokeLinecap="round" />
        <path d="M-40,360 Q60,300 160,370 T360,330" fill="none" stroke="white" strokeWidth="32" strokeLinecap="round" />
      </svg>
    );
  }

  if (pattern === "clouds") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-20,120 C40,65 95,150 145,90 C190,42 245,108 320,82 L320,400 L-20,400 Z" fill="white" />
        <path d="M-35,340 C60,280 95,365 170,315 C230,275 260,350 340,312 L340,420 L-35,420 Z" fill="white" opacity="0.7" />
      </svg>
    );
  }

  if (pattern === "confetti") {
    return (
      <div className="absolute inset-0 opacity-24 pointer-events-none">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-3 w-12 rotate-45 rounded-full bg-white/45"
            style={{ left: `${22 + (index % 4) * 62}px`, top: `${26 + Math.floor(index / 4) * 82}px` }}
          />
        ))}
      </div>
    );
  }

  if (pattern === "stripes") {
    return (
      <div className="absolute inset-0 opacity-18 pointer-events-none [background-image:repeating-linear-gradient(45deg,transparent_0,transparent_24px,white_24px,white_47px)]" />
    );
  }

  if (pattern === "ripples") {
    return (
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <span className="absolute -right-12 top-12 h-40 w-40 rounded-full border-[24px] border-white" />
        <span className="absolute -left-16 bottom-8 h-48 w-48 rounded-full border-[30px] border-white" />
        <span className="absolute bottom-28 right-12 h-24 w-24 rounded-full border-[18px] border-white" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 opacity-18 pointer-events-none [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_22px,white_22px,white_38px)]" />
  );
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return mb < 0.1 ? "<0.1 MB" : `${mb.toFixed(1)} MB`;
}

export default function StaffMaterialManagementPanel({
  staffName = "Ban Biên soạn EduMi",
  staffId,
  defaultSubTab = "manage",
}: StaffMaterialManagementPanelProps) {
  // Tabs điều hướng chính: 'manage' (Danh sách tài liệu đã đăng) | 'create' (Đăng tài liệu mới)
  const [activeSubTab, setActiveSubTab] = useState<"manage" | "create">(defaultSubTab);

  useEffect(() => {
    if (defaultSubTab) {
      setActiveSubTab(defaultSubTab);
    }
  }, [defaultSubTab]);

  // Dữ liệu danh sách tài liệu từ Supabase
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Bộ lọc & Tìm kiếm ở Tab Quản lý
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("Tất cả");
  const [filterGrade, setFilterGrade] = useState<string>("Tất cả");
  const [filterFileType, setFilterFileType] = useState<string>("Tất cả");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [previewMaterial, setPreviewMaterial] = useState<MaterialItem | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<MaterialItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ==========================================
  // STATE CHO FORM ĐĂNG TÀI LIỆU MỚI
  // ==========================================
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formCardCode, setFormCardCode] = useState("");
  const [formSubject, setFormSubject] = useState("Toán học");
  const [formGradeLevel, setFormGradeLevel] = useState("Lớp 12");
  const [formTopic, setFormTopic] = useState("Chuyên đề ôn thi");
  const [formFileType, setFormFileType] = useState<"PDF" | "DOCX">("PDF");
  const [formPageCount, setFormPageCount] = useState<number>(30);
  const [formAuthor, setFormAuthor] = useState(staffName);
  const [formDescription, setFormDescription] = useState("");
  const [formAllowDownload, setFormAllowDownload] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(MATERIAL_THEME_PALETTES[0]);
  const [selectedPattern, setSelectedPattern] = useState<MaterialPatternType>("waves");

  // Upload & submit status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<MaterialItem | null>(null);

  // Tải danh sách tài liệu từ API
  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/staff/materials", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tải danh sách tài liệu.");
      }
      setMaterials(data.materials || []);
    } catch (err) {
      console.error("[Staff Materials Fetch Error]:", err);
      setFetchError(err instanceof Error ? err.message : "Lỗi khi nạp dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchMaterials);
  }, [fetchMaterials]);

  // Cập nhật cardCode tự động khi chọn môn học nếu chưa gõ
  const handleSubjectChange = (newSub: string) => {
    setFormSubject(newSub);
    if (!formCardCode || formCardCode.includes("TOÁN") || formCardCode.includes("ANH") || formCardCode.includes("LÝ")) {
      const prefix = newSub.split(" ")[0].toUpperCase();
      setFormCardCode(`${prefix} 12`);
    }
  };

  // Drag & drop file handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      setFormFileType("PDF");
    } else if (ext === "docx" || ext === "doc") {
      setFormFileType("DOCX");
    } else {
      setSubmitError("Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp PDF hoặc DOCX.");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setSubmitError("Dung lượng tệp vượt quá 30MB.");
      return;
    }

    setSelectedFile(file);
    setSubmitError(null);

    // Gợi ý tên tài liệu theo tên file nếu ô title đang trống
    if (!formTitle.trim()) {
      const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setFormTitle(rawName);
    }
  };

  // Gửi Form Đăng tài liệu
  const handleSubmitMaterial = async (statusOverride?: "approved" | "draft") => {
    setSubmitError(null);

    if (!formTitle.trim()) {
      setSubmitError("Vui lòng nhập tên tài liệu.");
      return;
    }
    if (!selectedFile) {
      setSubmitError("Vui lòng chọn hoặc kéo thả tệp tài liệu PDF/DOCX.");
      return;
    }

    setIsSubmitting(true);
    try {
      setUploadProgress("Đang khởi tạo liên kết lưu trữ Cloudflare R2...");

      const mimeType =
        formFileType === "DOCX"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/pdf";

      // 1. Lấy presigned URL
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: mimeType,
          fileSize: selectedFile.size,
          category: "material",
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok || !presignData.success) {
        throw new Error(presignData.error || "Không thể khởi tạo đường dẫn tải lên.");
      }

      // 2. Upload file trực tiếp lên R2
      setUploadProgress("Đang tải tệp tin lên hệ thống lưu trữ...");
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": mimeType },
        body: selectedFile,
      });

      if (!uploadRes.ok) {
        throw new Error("Tải tệp tin lên Cloudflare R2 thất bại.");
      }

      // 3. Đồng bộ bản ghi vào Supabase
      setUploadProgress("Đang đồng bộ dữ liệu vào Supabase...");
      const finalStatus = statusOverride || "approved";

      const payload = {
        title: formTitle.trim(),
        cardCode: formCardCode.trim() || `${formSubject.toUpperCase()} 12`,
        subject: formSubject,
        gradeLevel: formGradeLevel,
        topic: formTopic.trim() || "Chuyên đề ôn thi",
        fileType: formFileType,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileKey: presignData.fileKey,
        filePublicUrl: presignData.publicUrl || null,
        pageCount: Number(formPageCount) || 30,
        description: formDescription.trim(),
        author: formAuthor.trim() || staffName,
        bgClass: selectedTheme.bgClass,
        accentClass: selectedTheme.accentClass,
        pattern: selectedPattern,
        status: finalStatus,
        allowDownload: formAllowDownload,
        visibility: "public",
      };

      const res = await fetch("/api/staff/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Không thể lưu thông tin tài liệu.");
      }

      setCreatedResult(resData.material);
      // Tải lại danh sách tài liệu
      void fetchMaterials();
    } catch (err) {
      console.error("[Submit Material Error]:", err);
      setSubmitError(err instanceof Error ? err.message : "Đăng tài liệu thất bại.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  // Reset Form
  const handleResetForm = () => {
    setSelectedFile(null);
    setFormTitle("");
    setFormCardCode("TOÁN 12");
    setFormSubject("Toán học");
    setFormGradeLevel("Lớp 12");
    setFormTopic("Chuyên đề ôn thi");
    setFormFileType("PDF");
    setFormPageCount(30);
    setFormAuthor(staffName);
    setFormDescription("");
    setFormAllowDownload(true);
    setSelectedTheme(MATERIAL_THEME_PALETTES[0]);
    setSelectedPattern("waves");
    setCreatedResult(null);
    setSubmitError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Bật/tắt trạng thái hiển thị (Công khai / Ẩn)
  const handleToggleStatus = async (materialId: string, currentStatus: string) => {
    setTogglingId(materialId);
    try {
      const nextAction = currentStatus === "approved" ? "hide" : "publish";
      const res = await fetch("/api/staff/materials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId, action: nextAction }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMaterials((prev) =>
          prev.map((item) => (item.id === materialId ? { ...item, status: data.material.status } : item))
        );
      }
    } catch (err) {
      console.error("[Toggle status error]:", err);
    } finally {
      setTogglingId(null);
    }
  };

  // Xóa tài liệu
  const handleConfirmDelete = async () => {
    if (!deletingMaterial) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/staff/materials?id=${deletingMaterial.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMaterials((prev) => prev.filter((item) => item.id !== deletingMaterial.id));
        setDeletingMaterial(null);
      } else {
        alert(data.error || "Không thể xóa tài liệu.");
      }
    } catch (err) {
      console.error("[Delete error]:", err);
      alert("Lỗi hệ thống khi xóa tài liệu.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = materials.length;
    const published = materials.filter((m) => m.status === "approved").length;
    const drafts = materials.filter((m) => m.status === "draft").length;
    const totalViews = materials.reduce((acc, cur) => acc + (cur.viewCount || 0), 0);
    const totalDownloads = materials.reduce((acc, cur) => acc + (cur.downloadCount || 0), 0);
    return { total, published, drafts, totalViews, totalDownloads };
  }, [materials]);

  // Danh sách đã lọc theo search và select box
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      // Search text
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesCode = item.cardCode?.toLowerCase().includes(query);
        const matchesSub = item.subject?.toLowerCase().includes(query);
        const matchesAuthor = item.author?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCode && !matchesSub && !matchesAuthor) return false;
      }

      // Filter Môn
      if (filterSubject !== "Tất cả" && item.subject !== filterSubject) return false;

      // Filter Khối lớp
      if (filterGrade !== "Tất cả" && item.gradeLevel !== filterGrade) return false;

      // Filter Định dạng
      if (filterFileType !== "Tất cả" && item.fileType !== filterFileType) return false;

      // Filter Trạng thái
      if (filterStatus !== "all" && item.status !== filterStatus) return false;

      return true;
    });
  }, [materials, searchTerm, filterSubject, filterGrade, filterFileType, filterStatus]);

  return (
    <div className="space-y-6">
      {/* ── Banner Header ── */}
      <div className="relative overflow-hidden rounded-[32px] border border-emerald-100/80 bg-gradient-to-br from-emerald-900 via-teal-900 to-[#004d38] p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-48 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-300/60 bg-white/10 p-2 backdrop-blur-md shadow-inner">
              <Image
                src="/banner-mascot.png"
                alt="EduMi Mascot"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300 backdrop-blur-sm border border-amber-400/30">
                  Staff Studio • Quản trị tài liệu
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-200">
                  Đồng bộ Supabase &amp; Cloudflare R2
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
                Kho Tài Liệu &amp; Chuyên Đề EduMi
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-medium text-emerald-100/80 max-w-2xl leading-relaxed">
                Đăng tải tài liệu học tập, chuyên đề bồi dưỡng và đề thi PDF/DOCX chất lượng cao cho cộng đồng học sinh toàn hệ thống.
              </p>
            </div>
          </div>

          {/* SubTab Switcher Buttons */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/20 p-1.5 backdrop-blur-md shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubTab("manage")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
                activeSubTab === "manage"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25"
                  : "text-emerald-100 hover:bg-white/10"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Kho tài liệu</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                {stats.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("create")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
                activeSubTab === "create"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                  : "text-emerald-100 hover:bg-white/10"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Đăng tài liệu mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Stats Counters ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tổng tài liệu</span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{stats.total}</p>
          <span className="text-[11px] font-semibold text-emerald-700">Đã cập nhật hệ thống</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Đang công khai</span>
            <Globe className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">{stats.published}</p>
          <span className="text-[11px] font-semibold text-slate-500">Hiển thị cho học sinh</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Bản nháp</span>
            <Layers className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{stats.drafts}</p>
          <span className="text-[11px] font-semibold text-slate-500">Đang chỉnh sửa</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tổng lượt xem / tải</span>
            <Download className="h-4 w-4 text-sky-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-sky-600">
            {(stats.totalViews + stats.totalDownloads).toLocaleString("vi-VN")}
          </p>
          <span className="text-[11px] font-semibold text-slate-500">
            {stats.totalDownloads} lượt tải về
          </span>
        </div>
      </div>

      {/* =========================================================================
          SUBTAB 1: KHO TÀI LIỆU ĐÃ ĐĂNG
         ========================================================================= */}
      {activeSubTab === "manage" && (
        <div className="space-y-4">
          {/* Filter Bar & View Switcher */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tài liệu theo tiêu đề, mã thẻ, môn học, tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white sm:text-sm"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <CustomSelect
                value={filterSubject}
                onChange={setFilterSubject}
                prefixLabel="Môn: "
                options={["Tất cả", ...SUBJECT_OPTIONS]}
                buttonClassName="px-3 py-2 text-xs font-bold"
              />

              <CustomSelect
                value={filterGrade}
                onChange={setFilterGrade}
                prefixLabel="Lớp: "
                options={["Tất cả", ...GRADE_OPTIONS]}
                buttonClassName="px-3 py-2 text-xs font-bold"
              />

              <CustomSelect
                value={filterFileType}
                onChange={setFilterFileType}
                prefixLabel="Định dạng: "
                options={["Tất cả", "PDF", "DOCX"]}
                buttonClassName="px-3 py-2 text-xs font-bold"
              />

              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                prefixLabel="Trạng thái: "
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "approved", label: "Công khai" },
                  { value: "draft", label: "Bản nháp" },
                  { value: "hidden", label: "Đã ẩn" },
                ]}
                buttonClassName="px-3 py-2 text-xs font-bold"
              />

              <button
                type="button"
                onClick={fetchMaterials}
                disabled={isLoading}
                title="Làm mới dữ liệu từ Supabase"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
              </button>

              {/* View Switcher */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Chế độ Thẻ (Grid)"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Chế độ Bảng (Table)"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Error notice */}
          {fetchError && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-[30px] bg-slate-200/80" />
              ))}
            </div>
          ) : filteredMaterials.length === 0 ? (
            /* Empty State */
            <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">Không tìm thấy tài liệu phù hợp</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Chưa có tài liệu nào khớp với bộ lọc hiện tại. Bạn có thể xóa bộ lọc hoặc đăng thêm tài liệu mới.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab("create")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Đăng tài liệu đầu tiên</span>
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Chế độ Grid: Hiển thị Thẻ tài liệu chuẩn EduMi */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMaterials.map((item) => (
                <div key={item.id} className="relative flex flex-col">
                  {/* EduMi Material Card Item */}
                  <article
                    className={`group relative flex min-h-[350px] select-none flex-col justify-between overflow-hidden rounded-[30px] p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      item.bgClass || "bg-[#e07328]"
                    }`}
                  >
                    <MaterialCardPattern pattern={item.pattern || "waves"} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

                    {/* Top Row */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5 truncate">
                        <span className="truncate text-[11px] font-black uppercase tracking-wide text-white/90">
                          EDUMI | {item.subject}
                        </span>
                        <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-sm">
                          {item.fileType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="rounded-md bg-black/20 px-1.5 py-0.5 text-[9px] font-black text-amber-300">
                          {item.gradeLevel}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10 my-auto py-2">
                      <h2 className="mb-2 text-[30px] font-black uppercase leading-none tracking-[-0.04em] text-white drop-shadow-md">
                        {item.cardCode}
                      </h2>
                      <h3 className="line-clamp-2 text-[15px] font-black leading-[1.25] text-white/95 drop-shadow-sm">
                        {item.title}
                      </h3>
                      <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-white/95">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-white/90" />
                          {Number(item.viewCount || 0).toLocaleString("vi-VN")} lượt xem
                        </span>
                        <span className="opacity-70">|</span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-white/90" />
                          {item.pageCount || 30} trang
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="relative z-10 grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setPreviewMaterial(item)}
                        className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-slate-800 shadow-sm transition hover:bg-slate-100 cursor-pointer"
                      >
                        <Eye className={`h-3.5 w-3.5 ${item.accentClass || "text-[#e07328]"}`} />
                        <span>Xem</span>
                      </button>

                      {item.filePublicUrl ? (
                        <a
                          href={item.filePublicUrl}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-slate-800 shadow-sm transition hover:bg-slate-100 cursor-pointer"
                        >
                          <Download className={`h-3.5 w-3.5 ${item.accentClass || "text-[#e07328]"}`} />
                          <span className="truncate">Tải file</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPreviewMaterial(item)}
                          className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-slate-800 shadow-sm transition hover:bg-slate-100 cursor-pointer"
                        >
                          <Download className={`h-3.5 w-3.5 ${item.accentClass || "text-[#e07328]"}`} />
                          <span>Chi tiết</span>
                        </button>
                      )}
                    </div>
                  </article>

                  {/* Thanh điều khiển nhanh Staff bên dưới thẻ */}
                  <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-xs">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-black ${
                        item.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "draft"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      ● {item.status === "approved" ? "Công khai" : item.status === "draft" ? "Bản nháp" : "Đã ẩn"}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        disabled={togglingId === item.id}
                        title={item.status === "approved" ? "Ẩn tài liệu" : "Công khai tài liệu"}
                        className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700 cursor-pointer disabled:opacity-50"
                      >
                        {item.status === "approved" ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingMaterial(item)}
                        title="Xóa tài liệu này"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Chế độ Bảng (Table) */
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3.5">Mã thẻ / Tên tài liệu</th>
                      <th className="px-4 py-3.5">Môn &amp; Khối lớp</th>
                      <th className="px-4 py-3.5">Định dạng &amp; Dung lượng</th>
                      <th className="px-4 py-3.5">Lượt xem / Tải</th>
                      <th className="px-4 py-3.5">Tác giả</th>
                      <th className="px-4 py-3.5">Trạng thái</th>
                      <th className="px-4 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredMaterials.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-xs font-black text-slate-800">
                              {item.cardCode}
                            </span>
                            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black text-emerald-700">
                              {item.fileType}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-1 font-black text-slate-900">{item.title}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-800">{item.subject}</span>
                          <p className="text-[11px] text-slate-500">{item.gradeLevel}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-800">{item.fileName}</p>
                          <p className="text-[11px] text-slate-500">
                            {formatFileSize(item.fileSize)} • {item.pageCount || 30} trang
                          </p>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="font-bold text-emerald-600">{item.viewCount || 0} xem</p>
                          <p className="text-[11px] text-slate-500">{item.downloadCount || 0} tải</p>
                        </td>

                        <td className="px-4 py-3.5 text-xs text-slate-600">
                          {item.author || "EduMi"}
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
                              item.status === "approved"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "draft"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            ● {item.status === "approved" ? "Công khai" : item.status === "draft" ? "Bản nháp" : "Đã ẩn"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewMaterial(item)}
                              title="Xem chi tiết"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item.id, item.status)}
                              title={item.status === "approved" ? "Ẩn tài liệu" : "Công khai tài liệu"}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 cursor-pointer"
                            >
                              {item.status === "approved" ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                            </button>

                            {item.filePublicUrl && (
                              <a
                                href={item.filePublicUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                title="Tải tệp tin về máy"
                                className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 cursor-pointer"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => setDeletingMaterial(item)}
                              title="Xóa tài liệu"
                              className="rounded-lg border border-slate-200 p-1.5 text-rose-500 transition hover:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: STUDIO ĐĂNG TÀI LIỆU MỚI
         ========================================================================= */}
      {activeSubTab === "create" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* CỘT TRÁI: FORM NHẬP THÔNG TIN TÀI LIỆU (7 CỘT) */}
          <div className="space-y-6 lg:col-span-7">
            {/* 1. Upload File Box */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <FileUp className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  1. Tải lên tệp tài liệu (PDF hoặc DOCX)
                </h3>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/70 scale-[1.01]"
                    : selectedFile
                    ? "border-emerald-300 bg-emerald-50/40"
                    : "border-slate-200 bg-slate-50/60 hover:border-emerald-400 hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
                      <FileText className="h-7 w-7" />
                    </div>
                    <p className="mt-3 text-sm font-black text-slate-900 max-w-md truncate">
                      {selectedFile.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-500">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-800">
                        {formFileType}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(selectedFile.size)}</span>
                    </div>
                    <p className="mt-2 text-[11px] font-semibold text-emerald-600">
                      Bấm để chọn tệp khác hoặc kéo thả tệp mới vào đây
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-inner">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-black text-slate-800">
                      Kéo &amp; thả tệp tài liệu vào đây, hoặc <span className="text-emerald-600 underline">chọn tệp</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Hỗ trợ định dạng PDF hoặc Microsoft Word (DOCX) • Tối đa 30MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Metadata Box */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Edit3 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  2. Thông tin chi tiết tài liệu
                </h3>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Tiêu đề tài liệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Tuyển tập 50 Đề thi thử THPT Quốc Gia môn Toán 2026 (Có giải chi tiết)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Card Code & Page Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Mã thẻ hiển thị lớn (Card Code)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: TOÁN 12, IELTS 9+, VẬT LÝ..."
                    value={formCardCode}
                    onChange={(e) => setFormCardCode(e.target.value.toUpperCase())}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 font-mono text-xs sm:text-sm font-black text-slate-900 uppercase outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                  <span className="mt-1 block text-[10px] text-slate-400">
                    Chữ in hoa nổi bật trên thẻ ngoài giao diện
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Số trang ước tính
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1500}
                    value={formPageCount}
                    onChange={(e) => setFormPageCount(parseInt(e.target.value, 10) || 1)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Subject & Grade Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Môn học <span className="text-rose-500">*</span>
                  </label>
                  <CustomSelect
                    value={formSubject}
                    onChange={(val) => handleSubjectChange(val)}
                    options={SUBJECT_OPTIONS}
                    className="w-full"
                    buttonClassName="p-3 bg-slate-50/70 border-slate-200 text-slate-800 text-xs sm:text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Khối lớp / Cấp thi <span className="text-rose-500">*</span>
                  </label>
                  <CustomSelect
                    value={formGradeLevel}
                    onChange={(val) => setFormGradeLevel(val)}
                    options={GRADE_OPTIONS}
                    className="w-full"
                    buttonClassName="p-3 bg-slate-50/70 border-slate-200 text-slate-800 text-xs sm:text-sm font-bold"
                  />
                </div>
              </div>

              {/* Topic & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Chủ đề / Chuyên đề
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Đề thi thử, Sơ đồ tư duy, Lý thuyết trọng tâm..."
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Tác giả / Ban biên soạn
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Hội đồng Khảo thí EduMi"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Mô tả ngắn gọn về tài liệu
                </label>
                <textarea
                  rows={3}
                  placeholder="Giới thiệu nội dung trọng tâm, đối tượng phù hợp và cách khai thác tài liệu hiệu quả..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Allow Download Option */}
              <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formAllowDownload}
                  onChange={(e) => setFormAllowDownload(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Cho phép học sinh tải tệp tin về máy (Download file)
                </span>
              </label>
            </div>

            {/* 3. Theme & Pattern Customizer */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  3. Tùy biến màu sắc &amp; Hoa văn thẻ
                </h3>
              </div>

              {/* Palettes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Bảng màu nền thẻ
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {MATERIAL_THEME_PALETTES.map((pal) => (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => setSelectedTheme(pal)}
                      className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-all cursor-pointer ${
                        selectedTheme.name === pal.name
                          ? "border-emerald-600 bg-emerald-50/60 shadow-xs"
                          : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className="h-6 w-6 rounded-full shadow-inner transition group-hover:scale-110"
                        style={{ backgroundColor: pal.hex }}
                      />
                      <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                        {pal.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Patterns */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Hoa văn nền nghệ thuật
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PATTERN_OPTIONS.map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => setSelectedPattern(pat.id)}
                      className={`rounded-xl border p-2.5 text-xs font-bold transition text-left cursor-pointer ${
                        selectedPattern === pat.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {pat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error or Progress Box */}
            {submitError && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {uploadProgress && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600 shrink-0" />
                <span>{uploadProgress}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                disabled={isSubmitting}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Nhập lại
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmitMaterial("draft")}
                className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-xs font-black text-amber-800 hover:bg-amber-100 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                Lưu bản nháp
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmitMaterial("approved")}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3 text-xs font-black text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                <span>Xuất bản tài liệu ngay</span>
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: REAL-TIME LIVE CARD PREVIEW (5 CỘT) */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Xem trước thẻ tài liệu (Live Preview)
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                    Thời gian thực
                  </span>
                </div>

                {/* Preview Material Card Item */}
                <div className="mt-5 flex justify-center">
                  <div className="w-full max-w-[320px]">
                    <article
                      className={`group relative flex min-h-[380px] select-none flex-col justify-between overflow-hidden rounded-[30px] p-5 text-white shadow-xl transition-all duration-300 ${
                        selectedTheme.bgClass
                      }`}
                    >
                      <MaterialCardPattern pattern={selectedPattern} />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

                      {/* Header */}
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5 truncate">
                          <span className="truncate text-[11px] font-black uppercase tracking-wide text-white/90">
                            EDUMI | {formSubject}
                          </span>
                          <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-sm">
                            {formFileType}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/15 text-white/80 transition"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 my-auto py-2">
                        <h2 className="mb-2 text-[32px] font-black uppercase leading-none tracking-[-0.04em] text-white drop-shadow-md">
                          {formCardCode || `${formSubject.toUpperCase()} 12`}
                        </h2>
                        <h3 className="line-clamp-2 text-[16px] font-black leading-[1.25] text-white/95 drop-shadow-sm">
                          {formTitle || "Tuyển tập 50 Đề thi thử THPT Quốc Gia môn Toán 2026 (Có giải chi tiết)"}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-white/95">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-white text-white" />
                            0 lượt xem
                          </span>
                          <span className="opacity-70">|</span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5 text-white/90" />
                            {formPageCount || 30} trang
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="relative z-10 grid grid-cols-2 gap-2 pt-2">
                        <div className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-slate-800 shadow-sm">
                          <Eye className={`h-3.5 w-3.5 ${selectedTheme.accentClass}`} />
                          <span>Xem</span>
                          <ChevronRight className="h-3 w-3 text-slate-400" />
                        </div>
                        <div className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-2.5 text-xs font-black text-slate-800 shadow-sm">
                          <Download className={`h-3.5 w-3.5 ${selectedTheme.accentClass}`} />
                          <span>Tải về</span>
                          <ChevronRight className="h-3 w-3 text-slate-400" />
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-[11px] font-semibold text-slate-500 leading-relaxed">
                  💡 Thẻ trên là hình ảnh hiển thị thực tế tại trang Thư viện tài liệu của EduMi. Mọi thay đổi về tiêu đề, màu nền và hoa văn sẽ được cập nhật tức thì.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: XEM CHI TIẾT TÀI LIỆU (PREVIEW MODAL)
         ========================================================================= */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header with selected card theme */}
            <div className={`relative p-6 text-white ${previewMaterial.bgClass || "bg-[#e07328]"}`}>
              <MaterialCardPattern pattern={previewMaterial.pattern || "waves"} />
              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative z-10 flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                  EDUMI | {previewMaterial.subject}
                </span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  {previewMaterial.gradeLevel}
                </span>
                <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-[11px] font-black text-amber-300">
                  {previewMaterial.fileType}
                </span>
              </div>

              <h2 className="relative z-10 mt-3 text-2xl font-black text-white">
                {previewMaterial.title}
              </h2>
              <p className="relative z-10 mt-1 text-xs font-medium text-white/80">
                Biên soạn bởi: <strong className="text-white">{previewMaterial.author || "EduMi"}</strong>
              </p>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <div className="text-[11px] font-bold text-slate-500">Mã thẻ</div>
                  <div className="mt-1 font-mono text-sm font-black text-slate-900">
                    {previewMaterial.cardCode}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <div className="text-[11px] font-bold text-slate-500">Số trang</div>
                  <div className="mt-1 text-sm font-black text-slate-900">
                    {previewMaterial.pageCount || 30} trang
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <div className="text-[11px] font-bold text-slate-500">Dung lượng</div>
                  <div className="mt-1 text-sm font-black text-slate-900">
                    {formatFileSize(previewMaterial.fileSize)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="font-bold text-slate-900">Mô tả nội dung:</div>
                <p className="mt-1 text-slate-600 leading-relaxed font-medium">
                  {previewMaterial.description || "Chưa có mô tả chi tiết cho tài liệu này."}
                </p>
              </div>

              {/* Tên file & Trạng thái */}
              <div className="space-y-1.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tên tệp gốc:</span>
                  <span className="font-bold text-slate-800">{previewMaterial.fileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span
                    className={`font-black ${
                      previewMaterial.status === "approved"
                        ? "text-emerald-600"
                        : previewMaterial.status === "draft"
                        ? "text-amber-600"
                        : "text-slate-600"
                    }`}
                  >
                    {previewMaterial.status === "approved"
                      ? "Công khai"
                      : previewMaterial.status === "draft"
                      ? "Bản nháp"
                      : "Đã ẩn"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Quyền tải về:</span>
                  <span className="font-bold text-slate-800">
                    {previewMaterial.allowDownload ? "Cho phép tải về" : "Chỉ đọc online"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 p-4 px-6">
              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>

              {previewMaterial.filePublicUrl && (
                <a
                  href={previewMaterial.filePublicUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-black text-white hover:bg-emerald-700 shadow-md cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Tải tệp tin về</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: XÁC NHẬN XÓA TÀI LIỆU
         ========================================================================= */}
      {deletingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3">
              <Trash2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900">Xóa tài liệu này?</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa tài liệu <strong className="text-slate-900">&ldquo;{deletingMaterial.title}&rdquo;</strong>? Hành động này sẽ xóa dữ liệu trên Supabase và tệp tin lưu trên R2 vĩnh viễn.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingMaterial(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-black text-white hover:bg-rose-700 shadow-md shadow-rose-600/25 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: THÔNG BÁO XUẤT BẢN THÀNH CÔNG
         ========================================================================= */}
      {createdResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Đăng tài liệu thành công!
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Tài liệu <strong className="text-slate-900">&ldquo;{createdResult.title}&rdquo;</strong> đã được đồng bộ vào cơ sở dữ liệu Supabase và hệ thống tệp Cloudflare R2 của EduMi.
            </p>

            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs font-bold text-emerald-800">
              Mã thẻ: <span className="font-mono">{createdResult.cardCode}</span> • Trạng thái:{" "}
              {createdResult.status === "approved" ? "Đã công khai" : "Bản nháp"}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedResult(null);
                  setActiveSubTab("manage");
                }}
                className="w-full rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Về kho tài liệu đã đăng
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full rounded-2xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Tiếp tục đăng tài liệu khác
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
