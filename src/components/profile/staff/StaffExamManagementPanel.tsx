"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
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
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Hash,
  BookOpen,
  PenTool,
} from "lucide-react";
import CustomSelect from "@/components/common/CustomSelect";
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
    part: "Phần I",
    instruction: "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)",
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
    type: "true_false",
    part: "Phần II",
    instruction: "Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai",
    content: "Cho hàm số f(x) = x³ - 3x² + 2 có đồ thị là (C). Xét tính đúng sai của các khẳng định sau:",
    trueFalseItems: [
      { id: "a", content: "Hàm số đã cho có đạo hàm f'(x) = 3x² - 6x.", isCorrect: true, explanation: "Đạo hàm đúng." },
      { id: "b", content: "Hàm số đồng biến trên khoảng (0; 2).", isCorrect: false, explanation: "Nghịch biến trên (0; 2) vì f'(x) < 0." },
      { id: "c", content: "Giá trị cực tiểu của hàm số bằng -2.", isCorrect: true, explanation: "f(2) = -2 là giá trị cực tiểu." },
      { id: "d", content: "Đồ thị (C) cắt trục hoành tại đúng 3 điểm phân biệt.", isCorrect: true, explanation: "y_CĐ * y_CT = 2 * (-2) < 0." },
    ],
    explanation: "Phân tích cực trị và bảng biến thiên của hàm đa thức bậc 3 chuẩn cấu trúc Bộ GD&ĐT.",
    points: 1.0,
  },
  {
    id: "sq-3",
    questionNumber: 3,
    type: "short_answer",
    part: "Phần III",
    instruction: "Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)",
    content: "Một doanh nghiệp dự tính hàm số lợi nhuận khi bán x tấn sản phẩm là P(x) = -0.1x² + 4.1x - 15 (triệu đồng). Tìm sản lượng x (tấn) để doanh nghiệp đạt mức lợi nhuận lớn nhất. (Học sinh điền kết quả số thập phân, ví dụ: 20.5)",
    options: [],
    correctAnswer: "20.5",
    explanation: "Đỉnh parabol: x = -b / (2a) = -4.1 / (2 * -0.1) = 20.5 tấn.",
    points: 0.5,
  },
  {
    id: "sq-4",
    questionNumber: 4,
    type: "essay",
    part: "Phần IV",
    instruction: "Phần IV: Tự luận - Trình bày các bước giải chi tiết",
    content: "Trong không gian Oxyz, cho điểm M(1; 2; -1) và mặt phẳng (P): x + 2y - 2z + 1 = 0.\na) Viết phương trình chính tắc của đường thẳng d đi qua M và vuông góc với (P).\nb) Tìm tọa độ hình chiếu vuông góc H của điểm M lên mặt phẳng (P).",
    options: [],
    correctAnswer: "H(1/9; 2/9; 7/9)",
    sampleEssayAnswer: "Lời giải chi tiết:\n1. Vectơ pháp tuyến n_(P) = (1; 2; -2) là vectơ chỉ phương của d: (x - 1)/1 = (y - 2)/2 = (z + 1)/(-2).\n2. Tham số hóa H ∈ d: H(1 + t; 2 + 2t; -1 - 2t).\n3. Thay vào (P) tìm được t = -8/9 => H(1/9; 2/9; 7/9).",
    rubricCriteria: [
      "Viết đúng phương trình đường thẳng d (0.5 điểm)",
      "Thiết lập tọa độ điểm H theo tham số t (0.5 điểm)",
      "Giải đúng tham số t và kết luận tọa độ điểm H (0.5 điểm)",
    ],
    explanation: "Vận dụng kiến thức hình học giải tích trong không gian Oxyz.",
    points: 1.5,
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
  const [createdExamResult, setCreatedExamResult] = useState<{
    id: string;
    examCode: string;
    title: string;
    questionCount: number;
  } | null>(null);

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

  // Filter tab hiển thị câu hỏi trong form tạo đề
  const [questionTabFilter, setQuestionTabFilter] = useState<
    "all" | "single_choice" | "true_false" | "short_answer" | "essay"
  >("all");

  // Thống kê ma trận câu hỏi & tổng điểm
  const questionStats = useMemo(() => {
    let singleCount = 0;
    let tfCount = 0;
    let shortCount = 0;
    let essayCount = 0;
    let totalScore = 0;

    questions.forEach((q) => {
      const pts = Number(q.points) || 0;
      totalScore += pts;
      if (q.type === "true_false") tfCount++;
      else if (q.type === "short_answer") shortCount++;
      else if (q.type === "essay") essayCount++;
      else singleCount++;
    });

    return {
      total: questions.length,
      singleCount,
      tfCount,
      shortCount,
      essayCount,
      totalScore: Math.round(totalScore * 100) / 100,
    };
  }, [questions]);

  // Sinh mã đề mới tự động
  const handleGenerateExamCode = () => {
    const code = `EDM-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormExamCode(code);
  };

  // Thêm một câu hỏi theo loại cụ thể (Trắc nghiệm, Đúng/Sai, Trả lời ngắn, Tự luận)
  const handleAddQuestionByType = (type: ExamQuestion["type"]) => {
    const qNum = questions.length + 1;
    let newQ: ExamQuestion;

    if (type === "true_false") {
      newQ = {
        id: `q-${Date.now()}`,
        questionNumber: qNum,
        type: "true_false",
        part: "Phần II",
        section: "Trắc nghiệm Đúng/Sai",
        instruction: "Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai",
        content: "",
        trueFalseItems: [
          { id: "a", content: "", isCorrect: true, explanation: "" },
          { id: "b", content: "", isCorrect: false, explanation: "" },
          { id: "c", content: "", isCorrect: true, explanation: "" },
          { id: "d", content: "", isCorrect: false, explanation: "" },
        ],
        explanation: "",
        points: 1.0,
      };
    } else if (type === "short_answer") {
      newQ = {
        id: `q-${Date.now()}`,
        questionNumber: qNum,
        type: "short_answer",
        part: "Phần III",
        section: "Trả lời ngắn",
        instruction: "Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)",
        content: "",
        correctAnswer: "",
        explanation: "",
        points: 0.5,
      };
    } else if (type === "essay") {
      newQ = {
        id: `q-${Date.now()}`,
        questionNumber: qNum,
        type: "essay",
        part: "Phần IV",
        section: "Tự luận",
        instruction: "Phần IV: Tự luận - Trình bày các bước giải chi tiết",
        content: "",
        correctAnswer: "",
        sampleEssayAnswer: "",
        rubricCriteria: [
          "Trình bày đúng phương pháp và hướng giải (0.5 điểm)",
          "Tính toán hoặc lập luận chính xác kết quả (1.0 điểm)",
        ],
        wordLimit: { min: 100, max: 300 },
        explanation: "",
        points: 1.5,
      };
    } else {
      newQ = {
        id: `q-${Date.now()}`,
        questionNumber: qNum,
        type: "single_choice",
        part: "Phần I",
        section: "Trắc nghiệm",
        instruction: "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)",
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
    }
    setQuestions([...questions, newQ]);
  };

  // Thêm một câu hỏi mặc định
  const handleAddQuestion = () => {
    handleAddQuestionByType("single_choice");
  };

  // Nhân bản câu hỏi
  const handleDuplicateQuestion = (index: number) => {
    const q = questions[index];
    if (!q) return;
    const copy: ExamQuestion = {
      ...JSON.parse(JSON.stringify(q)),
      id: `q-${Date.now()}`,
      questionNumber: questions.length + 1,
    };
    setQuestions([...questions, copy]);
  };

  // Di chuyển câu hỏi lên / xuống
  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setQuestions(updated.map((item, idx) => ({ ...item, questionNumber: idx + 1 })));
  };

  // Quản lý tiêu chí rubric cho câu tự luận
  const handleAddRubricCriterion = (qIndex: number) => {
    const updated = [...questions];
    const q = updated[qIndex];
    if (!q) return;
    const criteria = Array.isArray(q.rubricCriteria) ? [...q.rubricCriteria] : [];
    criteria.push(`Tiêu chí chấm điểm ${criteria.length + 1} (0.5 điểm)`);
    updated[qIndex] = { ...q, rubricCriteria: criteria };
    setQuestions(updated);
  };

  const handleRemoveRubricCriterion = (qIndex: number, cIndex: number) => {
    const updated = [...questions];
    const q = updated[qIndex];
    if (!q) return;
    const criteria = (q.rubricCriteria || []).filter((_, idx) => idx !== cIndex);
    updated[qIndex] = { ...q, rubricCriteria: criteria };
    setQuestions(updated);
  };

  const handleUpdateRubricCriterion = (qIndex: number, cIndex: number, val: string) => {
    const updated = [...questions];
    const q = updated[qIndex];
    if (!q) return;
    const criteria = [...(q.rubricCriteria || [])];
    criteria[cIndex] = val;
    updated[qIndex] = { ...q, rubricCriteria: criteria };
    setQuestions(updated);
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
    const currentQuestion = updated[qIndex];
    if (!currentQuestion) return;
    const currentOptions = currentQuestion.options || [];
    const opts = currentOptions.map((opt) =>
      opt.id === optId ? { ...opt, text } : opt
    );
    updated[qIndex] = { ...currentQuestion, options: opts };
    setQuestions(updated);
  };

  // Cập nhật sub-item của câu hỏi Đúng/Sai
  const handleUpdateTrueFalseItem = (
    qIndex: number,
    itemId: "a" | "b" | "c" | "d",
    field: "content" | "isCorrect",
    val: any
  ) => {
    const updated = [...questions];
    const q = updated[qIndex];
    if (!q) return;
    const items = q.trueFalseItems || [
      { id: "a", content: "", isCorrect: true },
      { id: "b", content: "", isCorrect: false },
      { id: "c", content: "", isCorrect: true },
      { id: "d", content: "", isCorrect: false },
    ];
    const updatedItems = items.map((it) =>
      it.id === itemId ? { ...it, [field]: val } : it
    );
    updated[qIndex] = { ...q, trueFalseItems: updatedItems };
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

      const created = {
        id: data.exam?.id || formExamCode,
        examCode: data.exam?.examCode || formExamCode,
        title: formTitle,
        questionCount: questions.length,
      };
      setCreatedExamResult(created);
      setSubmitSuccess(`Đăng bài thi "${formTitle}" thành công! Mã phòng thi: ${created.examCode}`);
      // Refresh danh sách
      await fetchExams();
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

      {/* ── Banner Header (Đồng bộ chuẩn Staff Studio) ── */}
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
                  Staff Studio • Quản trị bài thi
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-200">
                  Đồng bộ Supabase &amp; Sảnh phòng thi
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
                Đăng &amp; Quản Lý Đề Thi EduMi
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-medium text-emerald-100/80 max-w-2xl leading-relaxed">
                Tạo và cấu hình các đề thi thử trực tuyến hiển thị trực tiếp tại sảnh phòng thi chung cho toàn bộ học sinh.
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
              <span>Danh sách đề thi</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                {exams.length}
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
              <span>Đăng bài thi mới</span>
            </button>
          </div>
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
              <CustomSelect
                value={filterSubject}
                onChange={setFilterSubject}
                prefixLabel="Môn: "
                options={["Tất cả", ...SUBJECT_OPTIONS]}
                buttonClassName="px-3 py-2 text-xs font-bold"
              />

              <CustomSelect
                value={filterCategory}
                onChange={setFilterCategory}
                prefixLabel="Kỳ thi: "
                options={["Tất cả", ...CATEGORY_OPTIONS]}
                buttonClassName="px-3 py-2 text-xs font-bold"
              />

              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                prefixLabel="Trạng thái: "
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "published", label: "Đã xuất bản" },
                  { value: "draft", label: "Bản nháp" },
                  { value: "hidden", label: "Đã ẩn" },
                ]}
                buttonClassName="px-3 py-2 text-xs font-bold"
              />

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
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormTitle(newTitle);
                      const lower = newTitle.toLowerCase();
                      if (lower.includes("vật lý") || lower.includes("vật lí") || lower.includes("vat ly") || lower.includes("vat li")) {
                        setFormSubject("Vật lý");
                        setFormCardCode("VẬT LÝ 12");
                        setSelectedTheme(CARD_THEME_PALETTES[3]);
                      } else if (lower.includes("hóa") || lower.includes("hoá")) {
                        setFormSubject("Hóa học");
                        setFormCardCode("HÓA HỌC");
                        setSelectedTheme(CARD_THEME_PALETTES[4]);
                      } else if (lower.includes("sinh")) {
                        setFormSubject("Sinh học");
                        setFormCardCode("SINH HỌC");
                        setSelectedTheme(CARD_THEME_PALETTES[7]);
                      } else if (lower.includes("anh") || lower.includes("tiếng anh") || lower.includes("english")) {
                        setFormSubject("Tiếng Anh");
                        setFormCardCode("TIẾNG ANH");
                        setSelectedTheme(CARD_THEME_PALETTES[2]);
                      } else if (lower.includes("văn") || lower.includes("ngữ văn")) {
                        setFormSubject("Ngữ văn");
                        setFormCardCode("NGỮ VĂN");
                        setSelectedTheme(CARD_THEME_PALETTES[5]);
                      } else if (lower.includes("lịch sử") || lower.includes("sử")) {
                        setFormSubject("Lịch sử");
                        setFormCardCode("LỊCH SỬ");
                        setSelectedTheme(CARD_THEME_PALETTES[8]);
                      } else if (lower.includes("địa lý") || lower.includes("địa lí") || lower.includes("địa")) {
                        setFormSubject("Địa lý");
                        setFormCardCode("ĐỊA LÝ");
                        setSelectedTheme(CARD_THEME_PALETTES[1]);
                      } else if (lower.includes("toán")) {
                        setFormSubject("Toán học");
                        setFormCardCode("TOÁN 12");
                        setSelectedTheme(CARD_THEME_PALETTES[0]);
                      }
                    }}
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
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                      Môn học
                    </label>
                    <CustomSelect
                      value={formSubject}
                      onChange={(val) => {
                        const s = val as ExamItem["subject"];
                        setFormSubject(s);
                        // Auto gợi ý palette màu và cardCode tương ứng
                        if (s === "Toán học") {
                          setSelectedTheme(CARD_THEME_PALETTES[0]);
                          setFormCardCode("TOÁN 12");
                        } else if (s === "Tiếng Anh") {
                          setSelectedTheme(CARD_THEME_PALETTES[2]);
                          setFormCardCode("TIẾNG ANH");
                        } else if (s === "Vật lý") {
                          setSelectedTheme(CARD_THEME_PALETTES[3]);
                          setFormCardCode("VẬT LÝ 12");
                        } else if (s === "Hóa học") {
                          setSelectedTheme(CARD_THEME_PALETTES[4]);
                          setFormCardCode("HÓA HỌC");
                        } else if (s === "Ngữ văn") {
                          setSelectedTheme(CARD_THEME_PALETTES[5]);
                          setFormCardCode("NGỮ VĂN");
                        } else if (s === "Sinh học") {
                          setSelectedTheme(CARD_THEME_PALETTES[6]);
                          setFormCardCode("SINH HỌC");
                        } else if (s === "Lịch sử") {
                          setSelectedTheme(CARD_THEME_PALETTES[8]);
                          setFormCardCode("LỊCH SỬ 12");
                        } else if (s === "Địa lý") {
                          setSelectedTheme(CARD_THEME_PALETTES[9]);
                          setFormCardCode("ĐỊA LÝ 12");
                        }
                      }}
                      options={SUBJECT_OPTIONS}
                      className="w-full"
                      buttonClassName="p-3 rounded-2xl bg-slate-50/50 border-slate-200 text-slate-800 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                      Danh mục kỳ thi
                    </label>
                    <CustomSelect
                      value={formCategory}
                      onChange={(val) => {
                        const cat = val as ExamItem["category"];
                        setFormCategory(cat);
                        if (cat === "ĐGNL ĐHQG") {
                          setSelectedTheme(CARD_THEME_PALETTES[1]);
                          setFormCardCode("ĐGNL HCM");
                        } else if (cat === "ĐGTD Bách Khoa") {
                          setSelectedTheme(CARD_THEME_PALETTES[7]);
                          setFormCardCode("ĐGTD BÁCH KHOA");
                        }
                      }}
                      options={CATEGORY_OPTIONS}
                      className="w-full"
                      buttonClassName="p-3 rounded-2xl bg-slate-50/50 border-slate-200 text-slate-800 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                      Độ khó ma trận
                    </label>
                    <CustomSelect
                      value={formDifficulty}
                      onChange={(val) => setFormDifficulty(val as ExamItem["difficulty"])}
                      options={DIFFICULTY_OPTIONS}
                      className="w-full"
                      buttonClassName="p-3 rounded-2xl bg-slate-50/50 border-slate-200 text-slate-800 text-xs font-bold"
                    />
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

            {/* Khối 3: Ngân hàng câu hỏi trong đề thi (4 định dạng chuẩn Bộ GD&ĐT 2025/2026) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 space-y-5">
              {/* Header Khối 3 */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <HelpCircle className="h-5 w-5" />
                    </span>
                    <h2 className="text-base font-black text-slate-900 sm:text-lg">
                      3. Ngân hàng câu hỏi đề thi ({questions.length} câu)
                    </h2>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Bổ sung các dạng câu hỏi theo đúng định dạng mới của Bộ GD&ĐT (Trắc nghiệm, Đúng/Sai, Điền số và Tự luận).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLoadSampleQuestions}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs self-start sm:self-auto"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Tải mẫu đề chuẩn (4 dạng câu)</span>
                </button>
              </div>

              {/* Bảng tổng kết cơ cấu ma trận & tổng điểm */}
              <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50 to-indigo-50/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tổng điểm ma trận đề thi:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900">
                          {questionStats.totalScore}
                          <span className="text-xs font-bold text-slate-400"> / 10.0 điểm</span>
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                            questionStats.totalScore === 10
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {questionStats.totalScore === 10 ? "✓ Chuẩn 10.0đ" : "Đang soạn thảo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Pills đếm số câu từng phần */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-xs font-black text-emerald-800">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Phần I (TN): {questionStats.singleCount}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-purple-50 border border-purple-200/70 px-2.5 py-1 text-xs font-black text-purple-800">
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                      Phần II (Đ/S): {questionStats.tfCount}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-sky-50 border border-sky-200/70 px-2.5 py-1 text-xs font-black text-sky-800">
                      <span className="h-2 w-2 rounded-full bg-sky-500" />
                      Phần III (Điền số): {questionStats.shortCount}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-200/70 px-2.5 py-1 text-xs font-black text-amber-800">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Phần IV (Tự luận): {questionStats.essayCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* THANH CÔNG CỤ THÊM CÂU HỎI NHANH THEO 4 DẠNG */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                  Thêm nhanh câu hỏi vào đề thi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {/* Nút 1: Trắc nghiệm ABCD */}
                  <button
                    type="button"
                    onClick={() => handleAddQuestionByType("single_choice")}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 text-emerald-800 transition hover:bg-emerald-100/70 hover:border-emerald-300 hover:shadow-xs active:scale-98 cursor-pointer"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black">Phần I: Trắc nghiệm</span>
                    <span className="text-[10px] font-semibold text-emerald-600">4 Lựa chọn (A, B, C, D)</span>
                  </button>

                  {/* Nút 2: Đúng / Sai */}
                  <button
                    type="button"
                    onClick={() => handleAddQuestionByType("true_false")}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-purple-200 bg-purple-50/50 p-3 text-purple-900 transition hover:bg-purple-100/70 hover:border-purple-300 hover:shadow-xs active:scale-98 cursor-pointer"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-600 text-white shadow-2xs">
                      <CheckSquare className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black">Phần II: Đúng / Sai</span>
                    <span className="text-[10px] font-semibold text-purple-600">4 ý a, b, c, d (1.0đ)</span>
                  </button>

                  {/* Nút 3: Trả lời ngắn */}
                  <button
                    type="button"
                    onClick={() => handleAddQuestionByType("short_answer")}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-200 bg-sky-50/50 p-3 text-sky-900 transition hover:bg-sky-100/70 hover:border-sky-300 hover:shadow-xs active:scale-98 cursor-pointer"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-600 text-white shadow-2xs">
                      <Hash className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black">Phần III: Điền số</span>
                    <span className="text-[10px] font-semibold text-sky-600">Trả lời ngắn (0.5đ)</span>
                  </button>

                  {/* Nút 4: Tự luận */}
                  <button
                    type="button"
                    onClick={() => handleAddQuestionByType("essay")}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-amber-200 bg-amber-50/50 p-3 text-amber-900 transition hover:bg-amber-100/70 hover:border-amber-300 hover:shadow-xs active:scale-98 cursor-pointer"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-600 text-white shadow-2xs">
                      <PenTool className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black">Phần IV: Tự luận</span>
                    <span className="text-[10px] font-semibold text-amber-600">Dàn ý & Barem điểm</span>
                  </button>
                </div>
              </div>

              {/* TABS LỌC DANH SÁCH CÂU HỎI */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuestionTabFilter("all")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    questionTabFilter === "all"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Tất cả ({questions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionTabFilter("single_choice")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    questionTabFilter === "single_choice"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70"
                  }`}
                >
                  Phần I: Trắc nghiệm ({questionStats.singleCount})
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionTabFilter("true_false")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    questionTabFilter === "true_false"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-purple-50 text-purple-900 hover:bg-purple-100/70"
                  }`}
                >
                  Phần II: Đúng / Sai ({questionStats.tfCount})
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionTabFilter("short_answer")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    questionTabFilter === "short_answer"
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-sky-50 text-sky-900 hover:bg-sky-100/70"
                  }`}
                >
                  Phần III: Điền số ({questionStats.shortCount})
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionTabFilter("essay")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    questionTabFilter === "essay"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100/70"
                  }`}
                >
                  Phần IV: Tự luận ({questionStats.essayCount})
                </button>
              </div>

              {/* RENDER DANH SÁCH CÂU HỎI */}
              <div className="space-y-4">
                {questions
                  .map((q, rawIndex) => ({ q, rawIndex }))
                  .filter(({ q }) =>
                    questionTabFilter === "all" ? true : (q.type || "single_choice") === questionTabFilter
                  )
                  .map(({ q, rawIndex }) => {
                    const qType = q.type || "single_choice";
                    const isSingleChoice = qType === "single_choice";
                    const isTrueFalse = qType === "true_false";
                    const isShortAnswer = qType === "short_answer";
                    const isEssay = qType === "essay";

                    const borderAccent = isSingleChoice
                      ? "border-l-4 border-l-emerald-500 border-slate-200"
                      : isTrueFalse
                      ? "border-l-4 border-l-purple-500 border-slate-200"
                      : isShortAnswer
                      ? "border-l-4 border-l-sky-500 border-slate-200"
                      : "border-l-4 border-l-amber-500 border-slate-200";

                    return (
                      <div
                        key={q.id || rawIndex}
                        className={`rounded-2xl border ${borderAccent} bg-white p-4 sm:p-5 shadow-xs transition focus-within:shadow-md space-y-4`}
                      >
                        {/* Header câu hỏi: Số thứ tự, Badge định dạng, Dropdown chọn loại, Điểm và Nút công cụ */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center justify-center rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-black text-white shadow-2xs">
                              Câu {q.questionNumber || rawIndex + 1}
                            </span>

                            {/* Dropdown chuyển đổi linh hoạt định dạng câu hỏi */}
                            <select
                              value={qType}
                              onChange={(e) => {
                                const nextType = e.target.value as ExamQuestion["type"];
                                let nextPoints = 0.25;
                                let nextPart = "Phần I";
                                let nextSection = "Trắc nghiệm";
                                let nextInstruction = "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)";
                                let nextTf = q.trueFalseItems;

                                if (nextType === "true_false") {
                                  nextPoints = 1.0;
                                  nextPart = "Phần II";
                                  nextSection = "Trắc nghiệm Đúng/Sai";
                                  nextInstruction = "Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai";
                                  if (!nextTf || nextTf.length === 0) {
                                    nextTf = [
                                      { id: "a", content: "Mệnh đề khẳng định a...", isCorrect: true, explanation: "" },
                                      { id: "b", content: "Mệnh đề khẳng định b...", isCorrect: false, explanation: "" },
                                      { id: "c", content: "Mệnh đề khẳng định c...", isCorrect: true, explanation: "" },
                                      { id: "d", content: "Mệnh đề khẳng định d...", isCorrect: false, explanation: "" },
                                    ];
                                  }
                                } else if (nextType === "short_answer") {
                                  nextPoints = 0.5;
                                  nextPart = "Phần III";
                                  nextSection = "Trả lời ngắn";
                                  nextInstruction = "Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)";
                                } else if (nextType === "essay") {
                                  nextPoints = 1.5;
                                  nextPart = "Phần IV";
                                  nextSection = "Tự luận";
                                  nextInstruction = "Phần IV: Tự luận - Trình bày các bước giải chi tiết";
                                }

                                const updated = [...questions];
                                updated[rawIndex] = {
                                  ...updated[rawIndex],
                                  type: nextType,
                                  part: nextPart,
                                  section: nextSection,
                                  instruction: nextInstruction,
                                  points: nextPoints,
                                  trueFalseItems: nextTf,
                                };
                                setQuestions(updated);
                              }}
                              className={`rounded-xl border px-3 py-1.5 text-xs font-black outline-none transition cursor-pointer shadow-2xs ${
                                isSingleChoice
                                  ? "border-emerald-300 bg-emerald-50/80 text-emerald-900"
                                  : isTrueFalse
                                  ? "border-purple-300 bg-purple-50/80 text-purple-900"
                                  : isShortAnswer
                                  ? "border-sky-300 bg-sky-50/80 text-sky-900"
                                  : "border-amber-300 bg-amber-50/80 text-amber-900"
                              }`}
                            >
                              <option value="single_choice">Phần I: Trắc nghiệm 4 Lựa chọn (A, B, C, D)</option>
                              <option value="true_false">Phần II: Trắc nghiệm Đúng / Sai (4 ý a, b, c, d)</option>
                              <option value="short_answer">Phần III: Trả lời ngắn (Điền kết quả số)</option>
                              <option value="essay">Phần IV: Tự luận (Dàn ý & Barem chấm)</option>
                            </select>
                          </div>

                          {/* Bộ công cụ câu hỏi: Điểm, Quick presets, Di chuyển, Nhân bản, Xóa */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Điểm số */}
                            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1">
                              <span className="text-[11px] font-bold text-slate-500">Điểm:</span>
                              <input
                                type="number"
                                step="0.25"
                                min="0.1"
                                max="10"
                                value={q.points || 0.25}
                                onChange={(e) =>
                                  handleUpdateQuestion(rawIndex, "points", parseFloat(e.target.value) || 0.25)
                                }
                                className="w-14 rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-center text-xs font-black text-slate-900 outline-none focus:border-indigo-500"
                              />
                            </div>

                            {/* Nút di chuyển thứ tự lên */}
                            <button
                              type="button"
                              onClick={() => handleMoveQuestion(rawIndex, "up")}
                              disabled={rawIndex === 0}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                              title="Di chuyển câu lên trên"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>

                            {/* Nút di chuyển thứ tự xuống */}
                            <button
                              type="button"
                              onClick={() => handleMoveQuestion(rawIndex, "down")}
                              disabled={rawIndex === questions.length - 1}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                              title="Di chuyển câu xuống dưới"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>

                            {/* Nút nhân bản câu */}
                            <button
                              type="button"
                              onClick={() => handleDuplicateQuestion(rawIndex)}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                              title="Nhân bản câu hỏi này"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            {/* Nút xóa câu hỏi */}
                            {questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(rawIndex)}
                                className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                                title="Xóa câu hỏi này"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Lời dẫn / Yêu cầu câu hỏi */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Lời dẫn câu hỏi (Instruction):
                          </label>
                          <input
                            type="text"
                            placeholder="Lời dẫn câu hỏi..."
                            value={q.instruction || ""}
                            onChange={(e) => handleUpdateQuestion(rawIndex, "instruction", e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                          />
                        </div>

                        {/* Nội dung đề bài */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Nội dung câu hỏi đề bài: <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            rows={3}
                            placeholder={`Nội dung đề bài câu số ${rawIndex + 1}...`}
                            value={q.content}
                            onChange={(e) => handleUpdateQuestion(rawIndex, "content", e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 p-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white leading-relaxed"
                          />
                        </div>

                        {/* ── CASE 1: TRẮC NGHIỆM 4 LỰA CHỌN (A, B, C, D) ── */}
                        {isSingleChoice && (
                          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-3.5 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-900">
                                4 Phương án lựa chọn (Click nút chữ cái để đánh dấu đáp án đúng):
                              </label>
                              <span className="text-[10px] font-bold text-emerald-700">
                                Đáp án đúng hiện tại: <span className="font-black underline">{q.correctAnswer || "A"}</span>
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              {(["A", "B", "C", "D"] as const).map((optId) => {
                                const opt = q.options?.find((o) => o.id === optId);
                                const isCorrect = q.correctAnswer === optId;
                                return (
                                  <div
                                    key={optId}
                                    className={`flex items-center gap-2 rounded-xl border p-2 transition shadow-2xs ${
                                      isCorrect
                                        ? "border-emerald-500 bg-emerald-100/70 ring-1 ring-emerald-500"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateQuestion(rawIndex, "correctAnswer", optId)}
                                      title={`Click để chọn ${optId} làm đáp án đúng`}
                                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black transition cursor-pointer ${
                                        isCorrect
                                          ? "bg-emerald-600 text-white shadow-xs"
                                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                      }`}
                                    >
                                      {optId}
                                    </button>
                                    <input
                                      type="text"
                                      placeholder={`Nội dung phương án ${optId}...`}
                                      value={opt?.text || ""}
                                      onChange={(e) => handleUpdateOption(rawIndex, optId, e.target.value)}
                                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none"
                                    />
                                    {isCorrect && (
                                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mr-1" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* ── CASE 2: TRẮC NGHIỆM ĐÚNG / SAI 4 Ý a, b, c, d ── */}
                        {isTrueFalse && (
                          <div className="rounded-2xl border border-purple-200/80 bg-purple-50/30 p-3.5 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-purple-200/60 pb-2">
                              <label className="text-[11px] font-black uppercase tracking-wider text-purple-900">
                                4 Mệnh đề khẳng định (Chọn Đúng hoặc Sai cho từng ý):
                              </label>
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                                Chuẩn barem Bộ GD&ĐT: 1 ý = 0.1đ | 2 ý = 0.25đ | 3 ý = 0.5đ | 4 ý = 1.0đ
                              </span>
                            </div>

                            <div className="space-y-2.5">
                              {(["a", "b", "c", "d"] as const).map((subId) => {
                                const item = q.trueFalseItems?.find((it) => it.id === subId) || {
                                  id: subId,
                                  content: "",
                                  isCorrect: true,
                                  explanation: "",
                                };
                                return (
                                  <div
                                    key={subId}
                                    className="rounded-xl border border-purple-200/90 bg-white p-2.5 space-y-2 shadow-2xs"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-900 text-xs font-black">
                                        {subId})
                                      </span>
                                      <input
                                        type="text"
                                        placeholder={`Nội dung mệnh đề khẳng định ý ${subId}...`}
                                        value={item.content}
                                        onChange={(e) =>
                                          handleUpdateTrueFalseItem(rawIndex, subId, "content", e.target.value)
                                        }
                                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:bg-white"
                                      />
                                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdateTrueFalseItem(rawIndex, subId, "isCorrect", true)
                                          }
                                          className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                                            item.isCorrect
                                              ? "bg-emerald-600 text-white shadow-xs"
                                              : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                                          }`}
                                        >
                                          ✓ ĐÚNG
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdateTrueFalseItem(rawIndex, subId, "isCorrect", false)
                                          }
                                          className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                                            !item.isCorrect
                                              ? "bg-rose-600 text-white shadow-xs"
                                              : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                                          }`}
                                        >
                                          ✕ SAI
                                        </button>
                                      </div>
                                    </div>
                                    {/* Lời giải thích riêng cho từng ý */}
                                    <input
                                      type="text"
                                      placeholder={`Giải thích ngắn vì sao ý ${subId} ${item.isCorrect ? "Đúng" : "Sai"} (tùy chọn)...`}
                                      value={item.explanation || ""}
                                      onChange={(e) => {
                                        const updated = [...questions];
                                        const curQ = updated[rawIndex];
                                        if (curQ) {
                                          const tfList = (curQ.trueFalseItems || []).map((tf) =>
                                            tf.id === subId ? { ...tf, explanation: e.target.value } : tf
                                          );
                                          updated[rawIndex] = { ...curQ, trueFalseItems: tfList };
                                          setQuestions(updated);
                                        }
                                      }}
                                      className="w-full rounded-lg border border-dashed border-slate-200 bg-slate-50/40 px-2.5 py-1 text-[11px] font-medium text-slate-600 outline-none focus:border-purple-400 focus:bg-white"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* ── CASE 3: TRẢ LỜI NGẮN (ĐIỀN KẾT QUẢ SỐ) ── */}
                        {isShortAnswer && (
                          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/30 p-3.5 space-y-2.5">
                            <label className="block text-[11px] font-black uppercase tracking-wider text-sky-900">
                              Đáp án chuẩn hệ thống (Kết quả số hoặc từ khóa): <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="VD: 20.5 (hệ thống tự động chấp nhận cả 20,5 hoặc 20.5)"
                              value={q.correctAnswer || ""}
                              onChange={(e) => handleUpdateQuestion(rawIndex, "correctAnswer", e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-sky-500 shadow-2xs"
                            />
                            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                              💡 <strong>Quy tắc chấm tự động:</strong> Đối với bài toán số học, thí sinh điền số thập phân với dấu chấm hoặc dấu phẩy đều được tính đúng (ví dụ: <code className="font-mono text-sky-700 bg-sky-100 px-1 rounded">20.5</code> hoặc <code className="font-mono text-sky-700 bg-sky-100 px-1 rounded">20,5</code>).
                            </p>
                          </div>
                        )}

                        {/* ── CASE 4: TỰ LUẬN (DÀN Ý & BAREM ĐIỂM) ── */}
                        {isEssay && (
                          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-3.5 space-y-3.5">
                            {/* Dàn ý & Đáp án mẫu */}
                            <div>
                              <label className="block text-[11px] font-black uppercase tracking-wider text-amber-900 mb-1">
                                Đáp án mẫu & Dàn ý giải chi tiết cho giáo viên chấm:
                              </label>
                              <textarea
                                rows={4}
                                placeholder="Nhập dàn ý các bước giải chi tiết, công thức áp dụng và kết quả cuối cùng để đối chiếu khi chấm bài..."
                                value={q.sampleEssayAnswer || ""}
                                onChange={(e) =>
                                  handleUpdateQuestion(rawIndex, "sampleEssayAnswer", e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 outline-none focus:border-amber-500 leading-relaxed shadow-2xs"
                              />
                            </div>

                            {/* Barem tiêu chí chấm điểm */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                                  Tiêu chí chấm điểm (Rubric):
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAddRubricCriterion(rawIndex)}
                                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                                >
                                  + Thêm tiêu chí barem
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                {(q.rubricCriteria || []).map((crit, cIdx) => (
                                  <div key={cIdx} className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-100 text-[10px] font-black text-amber-900">
                                      {cIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={crit}
                                      onChange={(e) =>
                                        handleUpdateRubricCriterion(rawIndex, cIdx, e.target.value)
                                      }
                                      placeholder={`Nội dung tiêu chí ${cIdx + 1} kèm điểm số (VD: Viết đúng phương trình - 0.5 điểm)...`}
                                      className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 outline-none focus:border-amber-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveRubricCriterion(rawIndex, cIdx)}
                                      className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                                      title="Xóa tiêu chí này"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                                {(!q.rubricCriteria || q.rubricCriteria.length === 0) && (
                                  <p className="text-[11px] italic text-slate-400">
                                    Chưa có tiêu chí barem điểm. Bấm &quot;+ Thêm tiêu chí barem&quot; để thiết lập.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Giới hạn số từ (tùy chọn) */}
                            <div className="flex items-center gap-3 pt-1 border-t border-amber-200/50">
                              <span className="text-[11px] font-bold text-amber-900">Giới hạn số từ:</span>
                              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                <span>Từ</span>
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="Min"
                                  value={q.wordLimit?.min || ""}
                                  onChange={(e) => {
                                    const min = parseInt(e.target.value) || undefined;
                                    handleUpdateQuestion(rawIndex, "wordLimit", {
                                      ...q.wordLimit,
                                      min,
                                    });
                                  }}
                                  className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs text-center font-bold outline-none"
                                />
                                <span>đến</span>
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="Max"
                                  value={q.wordLimit?.max || ""}
                                  onChange={(e) => {
                                    const max = parseInt(e.target.value) || undefined;
                                    handleUpdateQuestion(rawIndex, "wordLimit", {
                                      ...q.wordLimit,
                                      max,
                                    });
                                  }}
                                  className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs text-center font-bold outline-none"
                                />
                                <span>từ (khoảng trống nếu không giới hạn)</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lời giải thích chung cho cả câu */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Lời giải thích chung cho toàn bộ câu hỏi (Hiện sau khi nộp bài):
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Lời giải thích chi tiết, phương pháp giải hoặc mẹo làm bài..."
                            value={q.explanation || ""}
                            onChange={(e) => handleUpdateQuestion(rawIndex, "explanation", e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 p-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Thanh thao tác hoàn tất & Đăng bài thi ngay dưới danh sách câu hỏi */}
              <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/70 via-emerald-50/40 to-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-black text-slate-900">
                      Đã thiết lập {questions.length} câu hỏi ({questionStats.totalScore} / 10.0 điểm)
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Bấm &quot;Đăng bài thi ngay&quot; để lưu và mở phòng thi công khai cho học sinh vào thi.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitExam("draft")}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-60"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Lưu bản nháp</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitExam("published")}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    <span>Đăng bài thi ngay (Công khai)</span>
                  </button>
                </div>
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

      {/* =========================================================================
          MODAL THÔNG BÁO ĐĂNG BÀI THI THÀNH CÔNG & NÚT VÀO PHÒNG THI NGAY
         ========================================================================= */}
      {createdExamResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs font-black text-emerald-800">
                MÃ PHÒNG: {createdExamResult.examCode}
              </span>
              <h3 className="mt-2 text-lg font-black text-slate-900">
                Đăng bài thi thành công!
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-600 line-clamp-2">
                &ldquo;{createdExamResult.title}&rdquo;
              </p>
              <p className="mt-1 text-[11px] font-bold text-slate-400">
                Đã mở phòng thi với {createdExamResult.questionCount} câu hỏi (Trắc nghiệm, Đúng/Sai, Điền số, Tự luận).
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`/exam/${createdExamResult.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition"
              >
                <span>Vào phòng thi làm thử ngay</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setCreatedExamResult(null);
                  setActiveSubTab("manage");
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Quay về danh sách quản lý đề thi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
