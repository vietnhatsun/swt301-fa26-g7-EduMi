"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
  ScanLine,
  X,
} from "lucide-react";
import CustomSelect from "@/components/common/CustomSelect";
import MathRenderer, { hasMathFormula } from "@/components/common/MathRenderer";
import ExamCardItem from "@/components/exam/ExamCardItem";
import ExamScannerModal from "./ExamScannerModal";
import { generateExamTemplateByCategoryAndSubject } from "@/lib/subject-exam-templates";
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

  // Quản lý danh sách câu hỏi trong form (Tự động khởi tạo theo chuẩn THPT Quốc Gia môn Toán)
  const [questions, setQuestions] = useState<ExamQuestion[]>(() =>
    generateExamTemplateByCategoryAndSubject("Toán học", "THPT Quốc Gia")
  );
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
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

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

  // Dropdown menu thêm câu hỏi nhanh
  const [isAddQuestionDropdownOpen, setIsAddQuestionDropdownOpen] = useState(false);
  const addQuestionDropdownRef = useRef<HTMLDivElement>(null);

  // Modal hướng dẫn chi tiết lưu ý Scan & Copy từ Word
  const [isScanGuideModalOpen, setIsScanGuideModalOpen] = useState(false);
  const [guideActiveTab, setGuideActiveTab] = useState<"word" | "image">("word");
  const [isCopiedSample, setIsCopiedSample] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        addQuestionDropdownRef.current &&
        !addQuestionDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAddQuestionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Tự động nhận diện Môn & Kỳ thi để sinh sẵn khung câu hỏi chuẩn:
  // - "Kiểm tra Học kỳ": Tự động tạo 50 câu trắc nghiệm (0.2đ/câu = 10.0đ)
  // - "THPT Quốc Gia": Tự động tạo theo format Bộ GD&ĐT 2025 của môn đó (Toán 22 câu, Lý/Hóa/Sinh 28 câu, Tiếng Anh 40 câu...)
  const handleUpdateExamStructure = (
    s: ExamItem["subject"],
    cat: ExamItem["category"]
  ) => {
    setFormSubject(s);
    setFormCategory(cat);
    const generated = generateExamTemplateByCategoryAndSubject(s, cat);
    setQuestions(generated);

    // Tự động gợi ý thời gian làm bài chuẩn
    if (cat === "Kiểm tra Học kỳ") {
      setFormDuration(s === "Ngữ văn" ? 90 : 50);
    } else if (cat === "THPT Quốc Gia") {
      if (s === "Toán học") setFormDuration(90);
      else if (s === "Ngữ văn") setFormDuration(120);
      else setFormDuration(50);
    } else if (cat === "ĐGNL ĐHQG") {
      setFormDuration(150);
    } else if (cat === "ĐGTD Bách Khoa") {
      setFormDuration(60);
    }

    // Auto gợi ý palette màu và cardCode
    if (cat === "ĐGNL ĐHQG") {
      setSelectedTheme(CARD_THEME_PALETTES[1]);
      setFormCardCode("ĐGNL HCM");
    } else if (cat === "ĐGTD Bách Khoa") {
      setSelectedTheme(CARD_THEME_PALETTES[7]);
      setFormCardCode("ĐGTD BÁCH KHOA");
    } else {
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
    }
  };

  // Áp dụng câu hỏi quét được từ AI Exam Scanner (Datalab OCR + Gemini AI)
  const handleApplyScannedQuestions = (
    scannedList: ExamQuestion[],
    mode: "replace" | "append" | "fill_template",
    meta?: { examTitle?: string; subject?: string }
  ) => {
    // Tự động điền tiêu đề đề thi nếu chưa có hoặc đang là mặc định
    if (meta?.examTitle && (!formTitle.trim() || formTitle === "Bài thi trắc nghiệm mới")) {
      setFormTitle(meta.examTitle);
    }

    if (mode === "fill_template") {
      // PHASE 4: Smart Type-Based Template Matching
      // Khớp theo từng nhóm loại câu hỏi (type) thay vì theo index mảng mù quáng
      const singlePool = scannedList.filter((q) => q.type === "single_choice");
      const tfPool = scannedList.filter((q) => q.type === "true_false");
      const shortPool = scannedList.filter((q) => q.type === "short_answer");
      const essayPool = scannedList.filter((q) => q.type === "essay");

      let singleIdx = 0;
      let tfIdx = 0;
      let shortIdx = 0;
      let essayIdx = 0;

      setQuestions((prev) => {
        const updated = prev.map((templateQ) => {
          let matched: ExamQuestion | undefined;

          if (templateQ.type === "single_choice" && singleIdx < singlePool.length) {
            matched = singlePool[singleIdx++];
          } else if (templateQ.type === "true_false" && tfIdx < tfPool.length) {
            matched = tfPool[tfIdx++];
          } else if (templateQ.type === "short_answer" && shortIdx < shortPool.length) {
            matched = shortPool[shortIdx++];
          } else if (templateQ.type === "essay" && essayIdx < essayPool.length) {
            matched = essayPool[essayIdx++];
          }

          if (!matched) return templateQ;

          return {
            ...templateQ,
            content: matched.content || templateQ.content,
            type: matched.type || templateQ.type,
            part: matched.part || templateQ.part,
            section: matched.section || templateQ.section,
            instruction: matched.instruction || templateQ.instruction,
            options: (matched.options && matched.options.length > 0) ? matched.options : templateQ.options,
            trueFalseItems: (matched.trueFalseItems && matched.trueFalseItems.length > 0) ? matched.trueFalseItems : templateQ.trueFalseItems,
            correctAnswer: matched.correctAnswer || templateQ.correctAnswer,
            explanation: matched.explanation || templateQ.explanation,
            sampleEssayAnswer: matched.sampleEssayAnswer || templateQ.sampleEssayAnswer,
            rubricCriteria: matched.rubricCriteria || templateQ.rubricCriteria,
            points: matched.points !== undefined ? matched.points : templateQ.points,
          };
        });

        // Nếu còn câu quét được dư ở bất kỳ nhóm nào, gom lại và nối thêm vào cuối
        const leftovers = [
          ...singlePool.slice(singleIdx),
          ...tfPool.slice(tfIdx),
          ...shortPool.slice(shortIdx),
          ...essayPool.slice(essayIdx),
        ];

        if (leftovers.length > 0) {
          const currentTotal = updated.length;
          const extras = leftovers.map((q, idx) => ({
            ...q,
            id: `scanned-extra-${Date.now()}-${currentTotal + idx + 1}`,
            questionNumber: currentTotal + idx + 1,
          }));
          return [...updated, ...extras];
        }

        return updated;
      });
    } else if (mode === "replace") {
      const renumbered = scannedList.map((q, idx) => ({
        ...q,
        id: `scanned-q-${Date.now()}-${idx + 1}`,
        questionNumber: idx + 1,
      }));
      setQuestions(renumbered);
    } else {
      setQuestions((prev) => {
        const currentLen = prev.length;
        const renumbered = scannedList.map((q, idx) => ({
          ...q,
          id: `scanned-q-${Date.now()}-${currentLen + idx + 1}`,
          questionNumber: currentLen + idx + 1,
        }));
        return [...prev, ...renumbered];
      });
    }

    setSubmitSuccess(`Đã nạp thành công ${scannedList.length} câu hỏi và đáp án vào đề thi!`);
    setSubmitError(null);
    setIsScannerModalOpen(false);
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
                        handleUpdateExamStructure(s, formCategory);
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
                        handleUpdateExamStructure(formSubject, cat);
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
            <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h2 className="text-sm font-black text-slate-900 sm:text-base">
                    2. Giao diện thẻ bài thi
                  </h2>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                    Đang chọn: <strong className="text-slate-800">{selectedTheme.name}</strong> •{" "}
                    <strong className="text-slate-800">
                      {PATTERN_OPTIONS.find((p) => p.id === selectedPattern)?.label}
                    </strong>
                  </span>
                </div>

                {/* Huy hiệu HOT & MỚI */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHot(!isHot)}
                    className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer border ${
                      isHot
                        ? "border-orange-300 bg-orange-50 text-orange-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Flame className={`h-3.5 w-3.5 ${isHot ? "text-orange-500 fill-orange-500" : "text-slate-400"}`} />
                    <span>HOT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsNew(!isNew)}
                    className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer border ${
                      isNew
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Sparkles className={`h-3.5 w-3.5 ${isNew ? "text-emerald-600 fill-emerald-600" : "text-slate-400"}`} />
                    <span>MỚI</span>
                  </button>
                </div>
              </div>

              {/* Dải chọn màu sắc (12 color circle swatches) */}
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                <span className="text-xs font-bold text-slate-600 shrink-0 min-w-[70px]">Màu nền:</span>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                  {CARD_THEME_PALETTES.map((palette) => {
                    const isSelected = selectedTheme.name === palette.name;
                    return (
                      <button
                        key={palette.name}
                        type="button"
                        onClick={() => setSelectedTheme(palette)}
                        title={palette.name}
                        className={`group relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-slate-900 ring-offset-2 scale-110 shadow-sm"
                            : "opacity-80 hover:scale-105 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: palette.hex }}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-white drop-shadow-xs" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dải chọn họa tiết hoa văn */}
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center border-t border-slate-100 pt-2.5">
                <span className="text-xs font-bold text-slate-600 shrink-0 min-w-[70px]">Họa tiết:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {PATTERN_OPTIONS.map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => setSelectedPattern(pat.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                        selectedPattern === pat.id
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {pat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Khối 3: Ngân hàng câu hỏi trong đề thi (4 định dạng chuẩn Bộ GD&ĐT 2025/2026) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 space-y-4">
              {/* Header Khối 3: Tinh giản, chuẩn mực, hiện đại */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                      3. Ngân hàng câu hỏi
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      {questions.length} câu
                    </span>
                    {/* Badge tổng điểm ma trận inline */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        questionStats.totalScore === 10
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <Award className="h-3.5 w-3.5" />
                      {questionStats.totalScore} / 10.0đ
                      {questionStats.totalScore === 10 ? " (Chuẩn)" : ""}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Cấu trúc tự động: <span className="font-semibold text-slate-700">{formCategory}</span> môn{" "}
                    <span className="font-semibold text-slate-700">{formSubject}</span>
                  </p>
                </div>

                {/* Cụm công cụ: Nút dấu ? đỏ nhạt tinh tế (bên trái) & Nút Scan AI */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                  {/* Nút dấu ? màu đỏ nhạt thanh lịch nằm ở phía bên trái */}
                  <button
                    type="button"
                    onClick={() => setIsScanGuideModalOpen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200/60 bg-rose-50/70 hover:bg-rose-100/80 text-rose-500 hover:text-rose-600 font-bold text-xs transition cursor-pointer select-none active:scale-95"
                    title="Xem các lưu ý quan trọng để scan đề thi và copy từ Word chuẩn nhất"
                  >
                    ?
                  </button>

                  {/* Nút Scan đề AI */}
                  <button
                    type="button"
                    onClick={() => setIsScannerModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition active:scale-98 cursor-pointer select-none"
                    title="Quét ảnh/PDF đề thi và bảng đáp án để AI tự điền toàn bộ"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Scan đề & Điền đáp án AI</span>
                  </button>
                </div>
              </div>

              {/* THANH ĐIỀU HƯỚNG TẬP TRUNG: Tabs Phân loại dạng Segmented Control + Menu Thêm câu */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
                {/* Tabs lọc theo chuẩn Bộ GD&ĐT - Gọn gàng, không bị khuất */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  <button
                    type="button"
                    onClick={() => setQuestionTabFilter("all")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      questionTabFilter === "all"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    Tất cả ({questions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionTabFilter("single_choice")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      questionTabFilter === "single_choice"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    Phần I: TN ({questionStats.singleCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionTabFilter("true_false")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      questionTabFilter === "true_false"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    Phần II: Đ/S ({questionStats.tfCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionTabFilter("short_answer")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      questionTabFilter === "short_answer"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    Phần III: Điền số ({questionStats.shortCount})
                  </button>
                  {questionStats.essayCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuestionTabFilter("essay")}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        questionTabFilter === "essay"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      Phần IV: Tự luận ({questionStats.essayCount})
                    </button>
                  )}
                </div>

                {/* Dropdown Thêm câu hỏi gọn gàng - Không gây chật chội hay che khuất tabs */}
                <div ref={addQuestionDropdownRef} className="relative shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsAddQuestionDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer select-none"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Thêm câu hỏi</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isAddQuestionDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isAddQuestionDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-64 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-20 space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-150">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Chọn loại câu hỏi muốn thêm
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddQuestionByType("single_choice");
                          setIsAddQuestionDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-slate-900">Phần I: Trắc nghiệm ABCD</div>
                          <div className="text-[11px] text-slate-500">4 lựa chọn, 1 đáp án đúng</div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          0.25đ
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddQuestionByType("true_false");
                          setIsAddQuestionDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-slate-900">Phần II: Đúng / Sai 4 ý</div>
                          <div className="text-[11px] text-slate-500">Ý a, b, c, d độc lập</div>
                        </div>
                        <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                          1.0đ
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddQuestionByType("short_answer");
                          setIsAddQuestionDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-slate-900">Phần III: Trả lời ngắn</div>
                          <div className="text-[11px] text-slate-500">Thí sinh điền kết quả số</div>
                        </div>
                        <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-md">
                          0.5đ
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddQuestionByType("essay");
                          setIsAddQuestionDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-slate-900">Phần IV: Tự luận</div>
                          <div className="text-[11px] text-slate-500">Trình bày bài giải & barem</div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          1.5đ
                        </span>
                      </button>
                    </div>
                  )}
                </div>
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

                        {/* Lời dẫn & Đề bài câu hỏi */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Lời dẫn chung (tùy chọn: vd đọc đoạn trích sau, bảng số liệu...)"
                            value={q.instruction || ""}
                            onChange={(e) => handleUpdateQuestion(rawIndex, "instruction", e.target.value)}
                            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white placeholder:text-slate-400"
                          />

                          <textarea
                            rows={2}
                            placeholder={`Nội dung đề bài câu số ${q.questionNumber || rawIndex + 1}...`}
                            value={q.content}
                            onChange={(e) => handleUpdateQuestion(rawIndex, "content", e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/30 p-2.5 text-xs font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white leading-relaxed resize-y"
                          />

                          {/* Xem trước công thức LaTeX tức thì khi có ký hiệu toán */}
                          {hasMathFormula(q.content) && (
                            <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-2.5 text-xs text-slate-800 shadow-2xs">
                              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 mb-1">
                                <Sparkles className="h-3 w-3 text-indigo-500" />
                                <span>Xem trước công thức trực quan:</span>
                              </div>
                              <div className="font-medium leading-relaxed">
                                <MathRenderer text={q.content} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ── CASE 1: TRẮC NGHIỆM 4 LỰA CHỌN (A, B, C, D) ── */}
                        {isSingleChoice && (
                          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-2.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-emerald-950">4 Phương án (click chữ cái để chọn đáp án đúng):</span>
                              <span className="rounded-md bg-emerald-100/90 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                                Đáp án đúng: {q.correctAnswer || "A"}
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
                                    <div className="flex-1 min-w-0">
                                      <input
                                        type="text"
                                        placeholder={`Nội dung phương án ${optId}...`}
                                        value={opt?.text || ""}
                                        onChange={(e) => handleUpdateOption(rawIndex, optId, e.target.value)}
                                        className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none"
                                      />
                                      {hasMathFormula(opt?.text) && (
                                        <div className="text-[11px] font-medium text-emerald-950 bg-white/80 rounded px-1.5 py-0.5 mt-1 border border-emerald-200/60 shadow-2xs">
                                          <MathRenderer text={opt?.text} />
                                        </div>
                                      )}
                                    </div>
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

                                    {/* Xem trước công thức cho ý đúng sai nếu có */}
                                    {hasMathFormula(item.content) && (
                                      <div className="text-[11px] font-medium text-purple-950 bg-purple-50/70 rounded-lg p-2 border border-purple-200/50">
                                        <span className="text-[10px] font-bold text-purple-600 block mb-0.5">👁️ Xem trước ý {subId}:</span>
                                        <MathRenderer text={item.content} />
                                      </div>
                                    )}

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
                          {hasMathFormula(q.explanation) && (
                            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-2.5 text-xs text-slate-800 shadow-2xs mt-1.5">
                              <span className="text-[10px] font-bold text-amber-800 block mb-0.5">👁️ Xem trước giải thích:</span>
                              <div className="font-medium leading-relaxed">
                                <MathRenderer text={q.explanation} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Nút thêm câu hỏi nhanh ở cuối danh sách (Tiện dụng khi cuộn xuống dưới cùng) */}
              <div className="flex flex-wrap items-center justify-center gap-2 py-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-400 mr-1">Thêm nhanh câu mới:</span>
                <button
                  type="button"
                  onClick={() => handleAddQuestionByType("single_choice")}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Plus className="h-3 w-3 text-emerald-600" />
                  <span>+ Trắc nghiệm (0.25đ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestionByType("true_false")}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Plus className="h-3 w-3 text-purple-600" />
                  <span>+ Đúng / Sai (1.0đ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestionByType("short_answer")}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Plus className="h-3 w-3 text-sky-600" />
                  <span>+ Trả lời ngắn (0.5đ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestionByType("essay")}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Plus className="h-3 w-3 text-amber-600" />
                  <span>+ Tự luận (1.5đ)</span>
                </button>
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

      {/* =========================================================================
          MODAL HƯỚNG DẪN CHI TIẾT: LƯU Ý SCAN ẢNH & COPY TỪ WORD
         ========================================================================= */}
      {isScanGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-100 bg-white shadow-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-rose-50/70 via-indigo-50/40 to-white">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-500/20">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">
                    Hướng dẫn Scan Đề & Copy từ Word
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Quy chuẩn cấu trúc Bộ GD&ĐT 2025 giúp AI nhận diện & điền đáp án chuẩn xác 100%
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsScanGuideModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Segmented Tab chuyển đổi 2 nội dung */}
            <div className="border-b border-slate-100 px-6 pt-3 pb-2 bg-slate-50/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuideActiveTab("word")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  guideActiveTab === "word"
                    ? "bg-white text-indigo-700 shadow-xs border border-indigo-100"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                }`}
              >
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>1. Dữ liệu thô (Copy từ Word / Docs)</span>
              </button>

              <button
                type="button"
                onClick={() => setGuideActiveTab("image")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  guideActiveTab === "image"
                    ? "bg-white text-rose-700 shadow-xs border border-rose-100"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                }`}
              >
                <ScanLine className="h-4 w-4 text-rose-600" />
                <span>2. Scan Hình ảnh & File PDF</span>
              </button>
            </div>

            {/* Nội dung Tab */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {guideActiveTab === "word" ? (
                /* TAB 1: DỮ LIỆU THÔ TỪ WORD */
                <div className="space-y-5">
                  <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Quy tắc vàng khi copy đề từ Word / Docs
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      Chỉ cần giữ tiền tố đánh số câu <strong className="text-indigo-900">&quot;Câu 1:&quot;</strong>, <strong className="text-indigo-900">&quot;Câu 2.&quot;</strong> và các ký hiệu phương án. AI sẽ tự động phân loại đúng 4 phần chuẩn Bộ GD&ĐT 2025.
                    </p>
                  </div>

                  {/* 4 Định dạng chuẩn */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Phần I: Trắc nghiệm ABCD</span>
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">0.25đ</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Mỗi phương án bắt đầu bằng chữ hoa: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">A.</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">B.</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">C.</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">D.</code> (trên từng dòng hoặc cách nhau khoảng trắng).
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Phần II: Đúng / Sai (4 ý)</span>
                        <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">1.0đ</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500">
                        4 khẳng định bắt đầu bằng chữ thường: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">a)</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">b)</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">c)</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">d)</code>.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Phần III: Trả lời ngắn</span>
                        <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">0.5đ</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Câu hỏi tính toán yêu cầu điền kết quả số (số nguyên hoặc số thập phân như <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">20.5</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">-3</code>).
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Phần IV: Tự luận / Ngữ văn</span>
                        <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">1.5đ</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Đánh số câu rõ ràng. Có thể ghi kèm điểm như <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Câu 1 (0.5 điểm): ...</code> AI sẽ tự tạo dàn ý và barem điểm.
                      </p>
                    </div>
                  </div>

                  {/* Cách dán bảng đáp án */}
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Cách dán BẢNG ĐÁP ÁN ở cuối để AI tự điền chính xác 100%:
                    </h4>
                    <p className="text-xs text-slate-600">
                      Chỉ cần để đoạn văn bản đáp án ở cuối đề theo bất kỳ định dạng nào quen thuộc:
                    </p>
                    <div className="rounded-xl bg-slate-900 p-3 font-mono text-[11px] text-emerald-400">
                      BẢNG ĐÁP ÁN:<br />
                      Phần I: 1.A | 2.B | 3.C | 4.D<br />
                      Phần II: Câu 1: a-Đ, b-S, c-Đ, d-Đ<br />
                      Phần III: Câu 1: 20.5 | Câu 2: -3
                    </div>
                    <p className="text-[11px] italic text-slate-400">
                      * Lưu ý: Nếu trong tài liệu KHÔNG có đáp án, AI sẽ tự động giải chi tiết và điền đáp án chuẩn nhất kèm giải thích!
                    </p>
                  </div>

                  {/* Box ví dụ mẫu có nút copy */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between bg-slate-100 px-4 py-2 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-700">Đề thi mẫu chuẩn Bộ GD&ĐT</span>
                      <button
                        type="button"
                        onClick={() => {
                          const sample = `KỲ THI TỐT NGHIỆP THPT\nMÔN: TOÁN HỌC\n\nPHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn\nCâu 1: Cho hàm số y = f(x). Điểm cực đại của hàm số là:\nA. x = 2\nB. x = -2\nC. y = 2\nD. x = 0\n\nPHẦN II. Câu trắc nghiệm đúng sai\nCâu 1: Cho hàm số f(x) = x^3 - 3x^2 + 2.\na) Đạo hàm f'(x) = 3x^2 - 6x.\nb) Hàm số đồng biến trên khoảng (0; 2).\nc) Giá trị cực tiểu bằng -2.\nd) Đồ thị cắt trục hoành tại 3 điểm phân biệt.\n\nPHẦN III. Câu trắc nghiệm trả lời ngắn\nCâu 1: Tìm sản lượng x (tấn) để doanh nghiệp đạt lợi nhuận cực đại với P(x) = -0.1x^2 + 4.1x - 15?\n\nBẢNG ĐÁP ÁN:\nPhần I: 1.A\nPhần II: Câu 1: a-Đ, b-S, c-Đ, d-Đ\nPhần III: Câu 1: 20.5`;
                          navigator.clipboard.writeText(sample);
                          setIsCopiedSample(true);
                          setTimeout(() => setIsCopiedSample(false), 2000);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition border border-slate-200 shadow-2xs cursor-pointer"
                      >
                        {isCopiedSample ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Đã sao chép!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Sao chép mẫu thử</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-48 scrollbar-thin">
                      {`PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn
Câu 1: Cho hàm số y = f(x). Điểm cực đại của hàm số là:
A. x = 2
B. x = -2
C. y = 2
D. x = 0

PHẦN II. Câu trắc nghiệm đúng sai
Câu 1: Cho hàm số f(x) = x^3 - 3x^2 + 2.
a) Đạo hàm f'(x) = 3x^2 - 6x.
b) Hàm số đồng biến trên khoảng (0; 2).
c) Giá trị cực tiểu bằng -2.
d) Đồ thị cắt trục hoành tại 3 điểm phân biệt.

PHẦN III. Câu trắc nghiệm trả lời ngắn
Câu 1: Tìm sản lượng x (tấn) để doanh nghiệp đạt lợi nhuận lớn nhất?

BẢNG ĐÁP ÁN:
Phần I: 1.A
Phần II: Câu 1: a-Đ, b-S, c-Đ, d-Đ
Phần III: Câu 1: 20.5`}
                    </pre>
                  </div>
                </div>
              ) : (
                /* TAB 2: HƯỚNG DẪN SCAN HÌNH ẢNH & FILE PDF */
                <div className="space-y-5">
                  <div className="rounded-2xl bg-rose-50/70 border border-rose-100 p-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-900 mb-2 flex items-center gap-1.5">
                      <ScanLine className="h-4 w-4 text-rose-600" />
                      3 Nguyên tắc vàng khi chụp ảnh đề thi
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      AI sử dụng Datalab OCR và Gemini Vision để nhận diện. Để chất lượng tốt nhất, hình ảnh đầu vào cần rõ ràng và không bị biến dạng.
                    </p>
                  </div>

                  {/* Bảng so sánh Nên & Không nên */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2.5">
                      <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        NÊN LÀM:
                      </span>
                      <ul className="text-xs space-y-2 text-slate-700">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span><strong>Chụp thẳng góc 90°:</strong> Đặt đề thi phẳng trên bàn, chụp vuông góc từ trên xuống, không chụp xéo góc.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span><strong>Đủ ánh sáng & rõ nét:</strong> Đảm bảo văn bản rõ ràng, tương phản tốt, không bị nhòe nét khi zoom vào.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span><strong>Tải cùng lúc Đề & Đáp án:</strong> Bạn có thể chọn cùng lúc nhiều ảnh (ảnh các trang đề + ảnh bảng đáp án ở cuối).</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span><strong>Công thức Toán LaTeX:</strong> Phân số, căn bậc hai, tích phân sẽ tự động được chuyển thành chuẩn LaTeX ($...$).</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-2.5">
                      <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                        TRÁNH CÁC LỖI SAU:
                      </span>
                      <ul className="text-xs space-y-2 text-slate-700">
                        <li className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">✕</span>
                          <span><strong>Sấp bóng tay & điện thoại:</strong> Tránh để bóng đen của bàn tay hoặc điện thoại đè lên mặt chữ.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">✕</span>
                          <span><strong>Lóa đèn flash:</strong> Không bật đèn flash quá gần làm cháy sáng và mất trắng công thức toán.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">✕</span>
                          <span><strong>Ảnh bị xoay ngược / xoay ngang:</strong> Hãy xoay ảnh thẳng chiều đọc trước khi tải lên.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">✕</span>
                          <span><strong>Chữ viết tay nghệch ngoạc:</strong> Hệ thống tối ưu tốt nhất cho đề in máy. Chữ viết tay mờ có thể bị nhận nhầm ký tự.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Định dạng hỗ trợ */}
                  <div className="rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
                    <div>
                      <span className="text-xs font-bold text-slate-800">Định dạng tệp hỗ trợ:</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        PNG, JPG, JPEG, WEBP hoặc file PDF (tự động nén tăng tốc độ xử lý).
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">PDF</span>
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">PNG</span>
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">JPG</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Hệ thống tự động lưu & áp dụng vào đề thi sau khi quét
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsScanGuideModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsScanGuideModalOpen(false);
                    setIsScannerModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-black text-white shadow-xs transition active:scale-98 cursor-pointer select-none"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Mở công cụ Scan AI ngay 🚀</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal AI Exam Scanner (Datalab OCR + Gemini AI) */}
      <ExamScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onApplyQuestions={handleApplyScannedQuestions}
        currentQuestionCount={questions.length}
        currentSubject={formSubject}
      />
    </div>
  );
}
