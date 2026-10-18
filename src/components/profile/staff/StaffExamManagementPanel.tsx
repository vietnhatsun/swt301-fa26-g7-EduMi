"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Eye,
  Trash2,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Layers,
  Award,
  Zap,
  Globe,
  Lock,
  Edit3,
  Check,
  Copy,
  LayoutGrid,
  List,
  Flame,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import ExamCardItem from "@/components/exam/ExamCardItem";
import {
  ExamItem,
  ExamCategory,
  ExamSubject,
  ExamDifficulty,
  ExamPatternType,
  ExamQuestion,
} from "@/components/exam/exam-data";

// Danh mục chủ đề màu sắc có sẵn cho thẻ bài thi
export const CARD_THEME_PALETTES = [
  { name: "Cam THPT", bgClass: "bg-[#e07328]", accentClass: "text-[#e07328]", hex: "#e07328" },
  { name: "Xanh ĐGNL", bgClass: "bg-[#0284c7]", accentClass: "text-[#0284c7]", hex: "#0284c7" },
  { name: "Hồng sen Anh", bgClass: "bg-[#be4c73]", accentClass: "text-[#be4c73]", hex: "#be4c73" },
  { name: "Đỏ gạch Lý", bgClass: "bg-[#bf5447]", accentClass: "text-[#bf5447]", hex: "#bf5447" },
  { name: "Xanh ngọc Hóa", bgClass: "bg-[#0d9488]", accentClass: "text-[#0d9488]", hex: "#0d9488" },
  { name: "Tím Văn", bgClass: "bg-[#7356bc]", accentClass: "text-[#7356bc]", hex: "#7356bc" },
  { name: "Xanh lá Sinh", bgClass: "bg-[#16a34a]", accentClass: "text-[#16a34a]", hex: "#16a34a" },
  { name: "Xanh đậm ĐGTD", bgClass: "bg-[#2563eb]", accentClass: "text-[#2563eb]", hex: "#2563eb" },
  { name: "Nâu Sử", bgClass: "bg-[#b45309]", accentClass: "text-[#b45309]", hex: "#b45309" },
  { name: "Xanh rừng Địa", bgClass: "bg-[#059669]", accentClass: "text-[#059669]", hex: "#059669" },
  { name: "Tím Học kỳ", bgClass: "bg-[#7c3aed]", accentClass: "text-[#7c3aed]", hex: "#7c3aed" },
  { name: "Hồng HSA Hà Nội", bgClass: "bg-[#db2777]", accentClass: "text-[#db2777]", hex: "#db2777" },
];

export const PATTERN_OPTIONS: { id: ExamPatternType; label: string }[] = [
  { id: "waves", label: "Lượn sóng" },
  { id: "ripples", label: "Gợn nước đồng tâm" },
  { id: "clouds", label: "Mây uốn lượn" },
  { id: "confetti", label: "Kim tuyến" },
  { id: "stripes", label: "Sọc chéo" },
  { id: "chevrons", label: "Ziczac" },
];

export const SUBJECT_OPTIONS: ExamItem["subject"][] = [
  "Toán học",
  "Tiếng Anh",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Ngữ văn",
  "Lịch sử",
  "Địa lý",
];

export const CATEGORY_OPTIONS: ExamItem["category"][] = [
  "THPT Quốc Gia",
  "ĐGNL ĐHQG",
  "ĐGTD Bách Khoa",
  "Kiểm tra Học kỳ",
];

export const DIFFICULTY_OPTIONS: ExamItem["difficulty"][] = [
  "Cơ bản (5-7đ)",
  "Vận dụng (7-8.5đ)",
  "Vận dụng cao (9-10đ)",
];

const SAMPLE_QUESTIONS_TEMPLATE: ExamQuestion[] = [
  {
    id: "sq-1",
    questionNumber: 1,
    type: "single_choice",
    instruction: "Chọn một đáp án đúng",
    content: "Cho hàm số y = f(x) có bảng biến thiên với f'(x) đổi dấu từ dương sang âm khi qua điểm x = 2. Điểm cực đại của hàm số đã cho là:",
    options: [
      { id: "A", text: "x = 2" },
      { id: "B", text: "x = -2" },
      { id: "C", text: "y = 2" },
      { id: "D", text: "x = 0" },
    ],
    correctAnswer: "A",
    explanation: "Theo định lý đạo hàm cấp 1, khi f'(x) đổi dấu từ (+) sang (-) qua điểm x0 thì hàm số đạt cực đại tại x0 = 2.",
    points: 0.25,
  },
  {
    id: "sq-2",
    questionNumber: 2,
    type: "single_choice",
    instruction: "Chọn một đáp án đúng",
    content: "Tập nghiệm của bất phương trình log₂(x - 1) < 3 là:",
    options: [
      { id: "A", text: "(1; 9)" },
      { id: "B", text: "(-∞; 9)" },
      { id: "C", text: "(1; 8)" },
      { id: "D", text: "(1; +∞)" },
    ],
    correctAnswer: "A",
    explanation: "ĐK: x - 1 > 0 <=> x > 1. BPT <=> x - 1 < 2³ = 8 <=> x < 9. Kết hợp đk: S = (1; 9).",
    points: 0.25,
  },
  {
    id: "sq-3",
    questionNumber: 3,
    type: "single_choice",
    instruction: "Chọn một đáp án đúng",
    content: "Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 3z - 5 = 0. Một vectơ pháp tuyến của (P) có tọa độ là:",
    options: [
      { id: "A", text: "n = (2; -1; 3)" },
      { id: "B", text: "n = (2; 1; 3)" },
      { id: "C", text: "n = (2; -1; -5)" },
      { id: "D", text: "n = (-2; -1; 3)" },
    ],
    correctAnswer: "A",
    explanation: "Mặt phẳng Ax + By + Cz + D = 0 có VTPT n = (A; B; C) = (2; -1; 3).",
    points: 0.25,
  },
  {
    id: "sq-4",
    questionNumber: 4,
    type: "single_choice",
    instruction: "Chọn một đáp án đúng",
    content: "Tính tích phân I = ∫ từ 0 đến 1 của e^(2x) dx.",
    options: [
      { id: "A", text: "I = (e² - 1) / 2" },
      { id: "B", text: "I = e² - 1" },
      { id: "C", text: "I = (e² + 1) / 2" },
      { id: "D", text: "I = 2(e² - 1)" },
    ],
    correctAnswer: "A",
    explanation: "∫ e^(2x) dx = (1/2) e^(2x). Thay cận 0->1: (1/2)(e² - 1).",
    points: 0.25,
  },
];

interface StaffExamManagementPanelProps {
  staffName?: string;
  staffId?: string;
}

export default function StaffExamManagementPanel({ staffName = "Staff EduMi", staffId }: StaffExamManagementPanelProps) {
  // Tabs: 'manage' (Danh sách bài thi) | 'create' (Đăng bài thi mới)
  const [activeSubTab, setActiveSubTab] = useState<"manage" | "create">("manage");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Danh sách bài thi lấy từ Supabase
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("Tất cả");
  const [filterCategory, setFilterCategory] = useState<string>("Tất cả");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // State cho Form Đăng bài thi
  const [formTitle, setFormTitle] = useState("");
  const [formExamCode, setFormExamCode] = useState(() => `EDM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [formCardCode, setFormCardCode] = useState("TOÁN 12");
  const [formSubject, setFormSubject] = useState<ExamItem["subject"]>("Toán học");
  const [formCategory, setFormCategory] = useState<ExamItem["category"]>("THPT Quốc Gia");
  const [formDifficulty, setFormDifficulty] = useState<ExamItem["difficulty"]>("Vận dụng (7-8.5đ)");
  const [formDuration, setFormDuration] = useState<number>(90);
  const [formDescription, setFormDescription] = useState("");
  const [formAuthor, setFormAuthor] = useState("Hội đồng Khảo thí EduMi");
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEME_PALETTES[0]);
  const [selectedPattern, setSelectedPattern] = useState<ExamPatternType>("waves");
  const [isHot, setIsHot] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");

  // Quản lý danh sách câu hỏi trong form
  const [questions, setQuestions] = useState<ExamQuestion[]>(SAMPLE_QUESTIONS_TEMPLATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Modal xem trước bài thi đã đăng
  const [previewExam, setPreviewExam] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Hàm tải danh sách bài thi từ API
  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/staff/exams?scope=all");
      const data = await res.json();
      if (data.success) {
        setExams(data.exams || []);
        if (data.warning) {
          setWarningMessage(data.warning);
        } else {
          setWarningMessage(null);
        }
      } else {
        console.warn("Failed to load exams:", data.error);
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Sinh mã đề mới tự động
  const handleGenerateExamCode = () => {
    const code = `EDM-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormExamCode(code);
  };

  // Thêm một câu hỏi mới vào form
  const handleAddQuestion = () => {
    const newQ: ExamQuestion = {
      id: `q-${Date.now()}`,
      questionNumber: questions.length + 1,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "",
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" },
      ],
      correctAnswer: "A",
      explanation: "",
      points: 0.25,
    };
    setQuestions([...questions, newQ]);
  };

  // Xóa câu hỏi khỏi form
  const handleRemoveQuestion = (index: number) => {
    const updated = questions.filter((_, idx) => idx !== index).map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
    }));
    setQuestions(updated);
  };

  // Cập nhật câu hỏi
  const handleUpdateQuestion = (index: number, field: keyof ExamQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  // Cập nhật option text của câu hỏi
  const handleUpdateOption = (qIndex: number, optId: "A" | "B" | "C" | "D", text: string) => {
    const updated = [...questions];
    const opts = updated[qIndex].options.map((opt) =>
      opt.id === optId ? { ...opt, text } : opt
    );
    updated[qIndex] = { ...updated[qIndex], options: opts };
    setQuestions(updated);
  };

  // Nạp bộ câu hỏi mẫu
  const handleLoadSampleQuestions = () => {
    setQuestions(SAMPLE_QUESTIONS_TEMPLATE);
  };

  // Xử lý gửi Form Đăng bài thi
  const handleSubmitExam = async (statusOverride?: "published" | "draft") => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!formTitle.trim()) {
      setSubmitError("Vui lòng điền tiêu đề bài thi.");
      return;
    }
    if (!formExamCode.trim()) {
      setSubmitError("Vui lòng nhập hoặc tự sinh mã phòng thi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalStatus = statusOverride || formStatus;
      const payload = {
        title: formTitle.trim(),
        examCode: formExamCode.trim(),
        cardCode: formCardCode.trim() || formSubject.toUpperCase(),
        category: formCategory,
        subject: formSubject,
        difficulty: formDifficulty,
        durationMinutes: formDuration,
        description: formDescription.trim(),
        author: formAuthor.trim() || staffName,
        bgClass: selectedTheme.bgClass,
        accentClass: selectedTheme.accentClass,
        pattern: selectedPattern,
        isHot,
        isNew,
        status: finalStatus,
        scope: "public", // Staff đăng bài thi công khai
        questions,
      };

      const res = await fetch("/api/staff/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể đăng bài thi.");
      }

      setSubmitSuccess(`Đăng bài thi "${formTitle}" thành công! Mã phòng thi: ${data.exam?.examCode}`);
      // Refresh danh sách
      await fetchExams();

      // Reset form sau 1.5 giây
      setTimeout(() => {
        setFormTitle("");
        handleGenerateExamCode();
        setFormDescription("");
        setActiveSubTab("manage");
      }, 1200);
    } catch (err: any) {
      setSubmitError(err.message || "Lỗi không xác định khi đăng bài thi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Đổi trạng thái bài thi (ẩn / xuất bản)
  const handleToggleStatus = async (examId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "published" ? "hidden" : "published";
    try {
      const res = await fetch(`/api/staff/exams/${examId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_status", status: nextStatus }),
      });
      if (res.ok) {
        fetchExams();
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  // Xóa bài thi
  const handleDeleteExam = async (examId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài thi này khỏi hệ thống không? Dữ liệu không thể khôi phục.")) return;
    setDeletingId(examId);
    try {
      const res = await fetch(`/api/staff/exams/${examId}`, { method: "DELETE" });
      if (res.ok) {
        fetchExams();
      }
    } catch (err) {
      console.error("Error deleting exam:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Card Preview Object cho live preview cột phải
  const previewCardItem: ExamItem = useMemo(() => {
    return {
      id: "preview-card",
      examCode: formExamCode || "EDM-8899",
      category: formCategory,
      subject: formSubject,
      cardCode: formCardCode || formSubject.toUpperCase(),
      title: formTitle || "Đề thi thử THPT Quốc Gia môn Toán 2026 - Đề số 01 (Ma trận mới Bộ GD&ĐT)",
      description: formDescription || "Bộ đề bám sát 100% định dạng mới: trắc nghiệm nhiều lựa chọn, đúng/sai và trả lời ngắn.",
      durationMinutes: formDuration || 90,
      questionCount: questions.length,
      difficulty: formDifficulty,
      attempts: 0,
      rating: 5.0,
      bgClass: selectedTheme.bgClass,
      accentClass: selectedTheme.accentClass,
      pattern: selectedPattern,
      isHot,
      isNew,
      author: formAuthor || staffName,
    };
  }, [
    formExamCode,
    formCategory,
    formSubject,
    formCardCode,
    formTitle,
    formDescription,
    formDuration,
    questions.length,
    formDifficulty,
    selectedTheme,
    selectedPattern,
    isHot,
    isNew,
    formAuthor,
    staffName,
  ]);

  // Lọc bài thi trong tab Quản lý
  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch =
        !searchTerm.trim() ||
        e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.examCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.cardCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.author?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubject = filterSubject === "Tất cả" || e.subject === filterSubject;
      const matchCategory = filterCategory === "Tất cả" || e.category === filterCategory;
      const matchStatus = filterStatus === "all" || e.status === filterStatus;

      return matchSearch && matchSubject && matchCategory && matchStatus;
    });
  }, [exams, searchTerm, filterSubject, filterCategory, filterStatus]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = exams.length;
    const published = exams.filter((e) => e.status === "published").length;
    const draft = exams.filter((e) => e.status === "draft").length;
    const totalAttempts = exams.reduce((acc, curr) => acc + (Number(curr.attempts) || 0), 0);
    return { total, published, draft, totalAttempts };
  }, [exams]);

  return (
    <div className="space-y-6">
      {/* Banner cảnh báo nếu chưa chạy migration trên Supabase */}
      {warningMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Thông báo kết nối cơ sở dữ liệu Supabase:</p>
            <p className="mt-0.5 text-amber-700">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* Top Header Card: Title, Role Badge & Sub Navigation */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              <Globe className="h-3.5 w-3.5" />
              Phòng thi công khai EduMi
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Staff Exclusive
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Đăng & Quản lý bài thi</h1>
          <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
            Tạo và cấu hình các đề thi thử trực tuyến hiển thị trực tiếp tại sảnh phòng thi chung cho toàn bộ học sinh.
          </p>
        </div>

        {/* Chuyển đổi giữa 2 tab: Danh sách vs Đăng mới */}
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => setActiveSubTab("manage")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
              activeSubTab === "manage"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Danh sách đề thi ({exams.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("create")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
              activeSubTab === "create"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Đăng bài thi mới</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tổng đề thi</span>
            <FileText className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{stats.total}</p>
          <span className="text-[11px] font-semibold text-slate-500">Bài thi trên hệ thống</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Đang công khai</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">{stats.published}</p>
          <span className="text-[11px] font-semibold text-slate-500">Học sinh có thể thi</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Bản nháp</span>
            <Edit3 className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{stats.draft}</p>
          <span className="text-[11px] font-semibold text-slate-500">Chờ hoàn thiện</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tổng lượt thi</span>
            <Zap className="h-4 w-4 text-sky-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-sky-600">{stats.totalAttempts.toLocaleString("vi-VN")}</p>
          <span className="text-[11px] font-semibold text-slate-500">Lượt làm bài thực tế</span>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: QUẢN LÝ DANH SÁCH BÀI THI ĐÃ ĐĂNG
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
                placeholder="Tìm bài thi theo tiêu đề, mã đề (EDM-xxxx), môn học, tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white sm:text-sm"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="Tất cả">Môn: Tất cả</option>
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="Tất cả">Kỳ thi: Tất cả</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="all">Trạng thái: Tất cả</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
                <option value="hidden">Đã ẩn</option>
              </select>

              <button
                type="button"
                onClick={fetchExams}
                title="Tải lại danh sách"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>

              {/* Toggle Grid/Table view */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    viewMode === "grid" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
                  }`}
                  title="Xem dạng thẻ phòng thi"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    viewMode === "table" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
                  }`}
                  title="Xem dạng bảng chi tiết"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hiển thị danh sách */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-16 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="mt-3 text-sm font-bold text-slate-600">Đang tải danh sách bài thi từ cơ sở dữ liệu...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center">
              <FileText className="h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-lg font-black text-slate-800">Chưa tìm thấy bài thi phù hợp</h3>
              <p className="mt-1 max-w-sm text-xs font-semibold text-slate-500">
                Chưa có bài thi nào khớp với bộ lọc tìm kiếm hoặc chưa có bài thi nào được đăng tải.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab("create")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo bài thi đầu tiên</span>
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Chế độ Grid: Hiển thị Thẻ bài thi giống hệt phòng thi */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredExams.map((item) => (
                <div key={item.id} className="relative flex flex-col">
                  {/* Exam Card Preview */}
                  <div className="flex-1">
                    <ExamCardItem
                      card={{
                        id: item.id,
                        examCode: item.examCode,
                        cardCode: item.cardCode,
                        category: item.category,
                        subject: item.subject,
                        title: item.title,
                        description: item.description,
                        durationMinutes: item.durationMinutes,
                        questionCount: item.questionCount,
                        difficulty: item.difficulty,
                        attempts: item.attempts,
                        rating: item.rating,
                        bgClass: item.bgClass,
                        accentClass: item.accentClass,
                        pattern: item.pattern,
                        isHot: item.isHot,
                        isNew: item.isNew,
                        author: item.author,
                      }}
                      onOpenModal={() => setPreviewExam(item)}
                    />
                  </div>

                  {/* Thanh điều khiển nhanh bên dưới thẻ */}
                  <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-black ${
                        item.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "draft"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      ● {item.status === "published" ? "Công khai" : item.status === "draft" ? "Bản nháp" : "Đã ẩn"}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        title={item.status === "published" ? "Ẩn bài thi" : "Xuất bản bài thi"}
                        className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
                      >
                        {item.status === "published" ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                      </button>

                      <a
                        href={`/exam/${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Vào làm thử bài thi này"
                        className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteExam(item.id)}
                        disabled={deletingId === item.id}
                        title="Xóa bài thi"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Chế độ Table */
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3.5">Mã đề / Tiêu đề</th>
                      <th className="px-4 py-3.5">Môn / Kỳ thi</th>
                      <th className="px-4 py-3.5">Thời gian & Số câu</th>
                      <th className="px-4 py-3.5">Lượt thi</th>
                      <th className="px-4 py-3.5">Tác giả</th>
                      <th className="px-4 py-3.5">Trạng thái</th>
                      <th className="px-4 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredExams.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-xs font-black text-slate-800">
                              {item.examCode}
                            </span>
                            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black text-emerald-700">
                              {item.cardCode}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-1 font-black text-slate-900">{item.title}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-800">{item.subject}</span>
                          <p className="text-[11px] text-slate-500">{item.category}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-800">{item.durationMinutes} phút</p>
                          <p className="text-[11px] text-slate-500">{item.questionCount} câu hỏi</p>
                        </td>

                        <td className="px-4 py-3.5 font-bold text-emerald-600">
                          {Number(item.attempts || 0).toLocaleString("vi-VN")} lượt
                        </td>

                        <td className="px-4 py-3.5 text-xs text-slate-600">
                          {item.author || "EduMi"}
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
                              item.status === "published"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "draft"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            ● {item.status === "published" ? "Công khai" : item.status === "draft" ? "Bản nháp" : "Đã ẩn"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewExam(item)}
                              title="Xem chi tiết"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item.id, item.status)}
                              title={item.status === "published" ? "Ẩn bài thi" : "Công khai bài thi"}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100"
                            >
                              {item.status === "published" ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                            </button>
                            <a
                              href={`/exam/${item.id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Mở phòng thi"
                              className="rounded-lg border border-slate-200 p-1.5 text-emerald-700 transition hover:bg-emerald-50"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteExam(item.id)}
                              disabled={deletingId === item.id}
                              title="Xóa đề thi"
                              className="rounded-lg border border-rose-100 bg-rose-50 p-1.5 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
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
          TAB 2: FORM ĐĂNG BÀI THI MỚI (CHI TIẾT & CÓ LIVE PREVIEW THẺ)
         ========================================================================= */}
      {activeSubTab === "create" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* CỘT TRÁI (8 CỘT): FORM NHẬP THÔNG TIN CHI TIẾT */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            {/* Thông báo lỗi/thành công */}
            {submitError && (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                <span>{submitError}</span>
              </div>
            )}
            {submitSuccess && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {/* Khối 1: Thông tin cơ bản bài thi */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                <FileText className="h-5 w-5 text-emerald-600" />
                <span>1. Thông tin bài thi & Sảnh thi</span>
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Các thông tin chính sẽ hiển thị trực tiếp trên thẻ phòng thi và sảnh làm bài.
              </p>

              <div className="mt-5 space-y-4">
                {/* Tiêu đề đề thi */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                    Tiêu đề bài thi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Đề thi thử THPT Quốc Gia môn Toán 2026 - Đề số 01 (Ma trận mới Bộ GD&ĐT)"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white sm:text-sm"
                  />
                </div>

                {/* Grid 2 cột: Mã phòng thi & Card Label */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Mã phòng thi độc nhất (Code) <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateExamCode}
                        className="text-[11px] font-bold text-emerald-600 hover:underline"
                      >
                        Tự sinh mã
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2 font-mono text-xs font-bold text-slate-800">
                      <span className="text-slate-400">PIN:</span>
                      <input
                        type="text"
                        value={formExamCode}
                        onChange={(e) => setFormExamCode(e.target.value.toUpperCase())}
                        className="ml-2 w-full bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                      Nhãn lớn trên thẻ (Card Code)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: TOÁN 12, ĐGNL HCM, TIẾNG ANH..."
                      value={formCardCode}
                      onChange={(e) => setFormCardCode(e.target.value.toUpperCase())}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold uppercase text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white sm:text-sm"
                    />
                  </div>
                </div>

                {/* Grid 3 cột: Môn học, Kỳ thi, Độ khó */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                      Môn học
                    </label>
                    <select
                      value={formSubject}
                      onChange={(e) => {
                        const val = e.target.value as ExamItem["subject"];
                        setFormSubject(val);
                        // Auto gợi ý palette màu và cardCode tương ứng
                        if (val === "Toán học") {
                          setSelectedTheme(CARD_THEME_PALETTES[0]);
                          setFormCardCode("TOÁN 12");
                        } else if (val === "Tiếng Anh") {
                          setSelectedTheme(CARD_THEME_PALETTES[2]);
                          setFormCardCode("TIẾNG ANH");
                        } else if (val === "Vật lý") {
                          setSelectedTheme(CARD_THEME_PALETTES[3]);
                          setFormCardCode("VẬT LÝ 12");
                        } else if (val === "Hóa học") {
                          setSelectedTheme(CARD_THEME_PALETTES[4]);
                          setFormCardCode("HÓA HỌC");
                        } else if (val === "Ngữ văn") {
                          setSelectedTheme(CARD_THEME_PALETTES[5]);
                          setFormCardCode("NGỮ VĂN");
                        } else if (val === "Sinh học") {
                          setSelectedTheme(CARD_THEME_PALETTES[6]);
                          setFormCardCode("SINH HỌC");
                        } else if (val === "Lịch sử") {
                          setSelectedTheme(CARD_THEME_PALETTES[8]);
                          setFormCardCode("LỊCH SỬ 12");
                        } else if (val === "Địa lý") {
                          setSelectedTheme(CARD_THEME_PALETTES[9]);
                          setFormCardCode("ĐỊA LÝ 12");
                        }
                      }}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                    >
                      {SUBJECT_OPTIONS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                      Danh mục kỳ thi
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        const cat = e.target.value as ExamItem["category"];
                        setFormCategory(cat);
                        if (cat === "ĐGNL ĐHQG") {
                          setSelectedTheme(CARD_THEME_PALETTES[1]);
                          setFormCardCode("ĐGNL HCM");
                        } else if (cat === "ĐGTD Bách Khoa") {
                          setSelectedTheme(CARD_THEME_PALETTES[7]);
                          setFormCardCode("ĐGTD BÁCH KHOA");
                        }
                      }}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                      Độ khó ma trận
                    </label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value as ExamItem["difficulty"])}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                    >
                      {DIFFICULTY_OPTIONS.map((diff) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grid 2 cột: Thời gian & Tác giả */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                      Thời gian làm bài (Phút)
                    </label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="number"
                        min={5}
                        max={240}
                        value={formDuration}
                        onChange={(e) => setFormDuration(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                      />
                      <div className="flex shrink-0 gap-1">
                        {[45, 50, 60, 90].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setFormDuration(mins)}
                            className={`rounded-xl px-2.5 py-2 text-xs font-bold ${
                              formDuration === mins
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {mins}&apos;
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                      Tác giả / Tổ bộ môn
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Hội đồng Khảo thí EduMi, Thầy Trần Minh..."
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Mô tả đề thi */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                    Mô tả cấu trúc đề thi
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VD: Bộ đề bám sát 100% định dạng mới: trắc nghiệm nhiều lựa chọn, đúng/sai và trả lời ngắn..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Khối 2: Visual Card Customizer (Thiết kế màu sắc & hoa văn thẻ) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>2. Thiết kế giao diện thẻ (Visual Card Style)</span>
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Tùy chỉnh màu sắc và họa tiết nền trên thẻ bài thi hiển thị tại phòng thi.
              </p>

              {/* Bảng màu thẻ */}
              <div className="mt-4">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                  Màu nền chủ đạo
                </label>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {CARD_THEME_PALETTES.map((palette) => (
                    <button
                      key={palette.name}
                      type="button"
                      onClick={() => setSelectedTheme(palette)}
                      className={`group relative flex items-center gap-2 rounded-xl border p-1.5 pr-3 text-xs font-bold transition ${
                        selectedTheme.name === palette.name
                          ? "border-slate-800 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className="h-5 w-5 rounded-lg shadow-inner"
                        style={{ backgroundColor: palette.hex }}
                      />
                      <span>{palette.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Họa tiết nền */}
              <div className="mt-4">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                  Họa tiết hoa văn nền
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PATTERN_OPTIONS.map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => setSelectedPattern(pat.id)}
                      className={`rounded-xl border p-2.5 text-center text-xs font-bold transition ${
                        selectedPattern === pat.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes: HOT & NEW */}
              <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isHot}
                    onChange={(e) => setIsHot(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1 text-xs font-black text-slate-700">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Gắn huy hiệu HOT (Đề thi thịnh hành)
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1 text-xs font-black text-slate-700">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    Gắn huy hiệu MỚI (Vừa cập nhật)
                  </span>
                </label>
              </div>
            </div>

            {/* Khối 3: Danh sách câu hỏi trắc nghiệm */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                    <HelpCircle className="h-5 w-5 text-indigo-600" />
                    <span>3. Ngân hàng câu hỏi trắc nghiệm ({questions.length} câu)</span>
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Thêm các câu hỏi để học sinh làm bài thi và hệ thống tự động chấm điểm.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleQuestions}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Tải mẫu đề chuẩn (4 câu)
                  </button>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-black text-white hover:bg-indigo-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Thêm câu</span>
                  </button>
                </div>
              </div>

              {/* Render danh sách từng câu hỏi */}
              <div className="mt-5 space-y-4">
                {questions.map((q, qIndex) => (
                  <div
                    key={q.id || qIndex}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition focus-within:border-indigo-300 focus-within:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-xs font-black text-indigo-800">
                        Câu {q.questionNumber || qIndex + 1}
                      </span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Nội dung câu hỏi */}
                    <textarea
                      rows={2}
                      placeholder={`Nội dung câu hỏi số ${qIndex + 1}...`}
                      value={q.content}
                      onChange={(e) => handleUpdateQuestion(qIndex, "content", e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500"
                    />

                    {/* 4 phương án A, B, C, D */}
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(["A", "B", "C", "D"] as const).map((optId) => {
                        const opt = q.options.find((o) => o.id === optId);
                        const isCorrect = q.correctAnswer === optId;
                        return (
                          <div
                            key={optId}
                            className={`flex items-center gap-2 rounded-xl border p-1.5 transition ${
                              isCorrect ? "border-emerald-500 bg-emerald-50/60" : "border-slate-200 bg-white"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleUpdateQuestion(qIndex, "correctAnswer", optId)}
                              title={`Chọn ${optId} làm đáp án đúng`}
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                isCorrect ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {optId}
                            </button>
                            <input
                              type="text"
                              placeholder={`Phương án ${optId}...`}
                              value={opt?.text || ""}
                              onChange={(e) => handleUpdateOption(qIndex, optId, e.target.value)}
                              className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Lời giải thích */}
                    <input
                      type="text"
                      placeholder="Lời giải thích chi tiết cho câu hỏi này (tùy chọn)..."
                      value={q.explanation || ""}
                      onChange={(e) => handleUpdateQuestion(qIndex, "explanation", e.target.value)}
                      className="mt-2.5 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-600 outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (4 CỘT - STICKY): REAL-TIME LIVE CARD PREVIEW & NÚT XUẤT BẢN */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6 space-y-5">
              {/* Preview Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-600">
                    <Eye className="h-4 w-4 text-emerald-600" />
                    Xem trước thẻ phòng thi
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                    Live Preview
                  </span>
                </div>

                <div className="mt-4">
                  <ExamCardItem card={previewCardItem} onOpenModal={() => {}} />
                </div>

                <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">
                  Thẻ sẽ xuất hiện với kích thước và màu sắc chuẩn xác như trên tại Sảnh phòng thi (/exam).
                </p>
              </div>

              {/* Action Buttons Box */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-900">Hoàn tất & Đăng tải</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Chọn hình thức lưu trữ. Bài thi công khai sẽ lập tức mở phòng thi cho thí sinh.
                </p>

                <div className="mt-4 space-y-2.5">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitExam("published")}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    <span>Đăng bài thi ngay (Công khai)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitExam("draft")}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Lưu bản nháp (Chưa công khai)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL XEM CHI TIẾT ĐỀ THI & CÂU HỎI
         ========================================================================= */}
      {previewExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-black text-emerald-700">{previewExam.examCode}</span>
                <h3 className="mt-1 text-lg font-black text-slate-900">{previewExam.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewExam(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400">Môn học</span>
                <p className="font-black text-slate-800">{previewExam.subject}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400">Thời gian</span>
                <p className="font-black text-slate-800">{previewExam.durationMinutes} phút</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400">Số câu hỏi</span>
                <p className="font-black text-slate-800">{previewExam.questionCount} câu</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400">Lượt thi</span>
                <p className="font-black text-emerald-600">{previewExam.attempts} lượt</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-400 uppercase">Mô tả đề thi</p>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-700">{previewExam.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setPreviewExam(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
              <a
                href={`/exam/${previewExam.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700"
              >
                <span>Vào phòng thi làm thử</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
