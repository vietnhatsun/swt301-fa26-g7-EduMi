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
  ChevronUp,
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
  Scan,
  Camera,
  UploadCloud,
  CheckSquare,
  Hash,
  BookOpen,
  PenTool,
  Wand2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ExamCardItem from "@/components/exam/ExamCardItem";
import {
  ExamItem,
  ExamCategory,
  ExamSubject,
  ExamDifficulty,
  ExamPatternType,
  ExamQuestion,
  QuestionOption,
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

// Hàm khởi tạo một câu hỏi mới theo loại
export function createNewQuestion(
  type: ExamQuestion["type"] = "single_choice",
  questionNumber: number = 1,
  subject: string = "Toán học"
): ExamQuestion {
  const uniqueId = `q-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  if (type === "single_choice") {
    const defaultOptions: QuestionOption[] = [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ];
    return {
      id: uniqueId,
      questionNumber,
      type: "single_choice",
      part: "Phần I",
      instruction: "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)",
      content: "",
      options: defaultOptions,
      correctAnswer: "A",
      explanation: "",
      points: 0.25,
    };
  }

  if (type === "true_false") {
    return {
      id: uniqueId,
      questionNumber,
      type: "true_false",
      part: "Phần II",
      instruction: "Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai",
      content: "",
      trueFalseItems: [
        { id: "a", content: "Mệnh đề khẳng định ý a)", isCorrect: true },
        { id: "b", content: "Mệnh đề khẳng định ý b)", isCorrect: false },
        { id: "c", content: "Mệnh đề khẳng định ý c)", isCorrect: true },
        { id: "d", content: "Mệnh đề khẳng định ý d)", isCorrect: false },
      ],
      explanation: "",
      points: 1.0,
    };
  }

  if (type === "short_answer") {
    return {
      id: uniqueId,
      questionNumber,
      type: "short_answer",
      part: "Phần III",
      instruction: "Phần III: Trả lời ngắn - Điền kết quả số",
      content: "",
      correctAnswer: "",
      explanation: "",
      points: 0.5,
    };
  }

  // Tự luận (essay)
  return {
    id: uniqueId,
    questionNumber,
    type: "essay",
    part: "Phần IV",
    instruction: "Phần IV: Tự luận - Trình bày bài giải hoặc bài văn chi tiết",
    content: "",
    sampleEssayAnswer: "",
    explanation: "",
    points: 1.5,
  };
}

// Hàm sinh sẵn ma trận câu hỏi chuẩn theo môn học và kỳ thi
export function generateSubjectPresetQuestions(
  subject: ExamItem["subject"],
  category: ExamItem["category"] = "THPT Quốc Gia"
): ExamQuestion[] {
  const now = Date.now();

  // 1. Các môn Tự nhiên (Toán học, Vật lý, Hóa học, Sinh học)
  const isNaturalScience = ["Toán học", "Vật lý", "Hóa học", "Sinh học"].includes(subject);
  if (isNaturalScience) {
    const list: ExamQuestion[] = [];
    let currentNumber = 1;

    // Phần I: 20 câu trắc nghiệm 4 lựa chọn (A, B, C, D)
    for (let i = 1; i <= 20; i++) {
      const defaultOptions: QuestionOption[] = [
        { id: "A", text: "Phương án A" },
        { id: "B", text: "Phương án B" },
        { id: "C", text: "Phương án C" },
        { id: "D", text: "Phương án D" },
      ];
      list.push({
        id: `q-part1-${i}-${now}`,
        questionNumber: currentNumber++,
        type: "single_choice",
        part: "Phần I",
        instruction: "Phần I: Câu trắc nghiệm nhiều phương án lựa chọn (Thí sinh chọn 1 trong 4 phương án A, B, C, D)",
        content: `Câu ${i} (${subject}): [Nhập nội dung câu hỏi trắc nghiệm ${i}...]`,
        options: defaultOptions,
        correctAnswer: "A",
        explanation: "",
        points: 0.25,
      });
    }

    // Phần II: 12 câu trắc nghiệm Đúng / Sai (Mỗi câu gồm 4 ý a, b, c, d)
    for (let i = 1; i <= 12; i++) {
      list.push({
        id: `q-part2-${i}-${now}`,
        questionNumber: currentNumber++,
        type: "true_false",
        part: "Phần II",
        instruction: "Phần II: Câu trắc nghiệm Đúng / Sai. Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai",
        content: `Câu ${currentNumber - 1} (${subject} - Đúng/Sai): [Nhập dữ liệu đề bài, đồ thị, bài toán câu ${i}...]`,
        trueFalseItems: [
          { id: "a", content: `Khẳng định a của câu ${i}`, isCorrect: true },
          { id: "b", content: `Khẳng định b của câu ${i}`, isCorrect: false },
          { id: "c", content: `Khẳng định c của câu ${i}`, isCorrect: true },
          { id: "d", content: `Khẳng định d của câu ${i}`, isCorrect: false },
        ],
        explanation: "",
        points: 1.0,
      });
    }

    // Phần III: 12 câu trắc nghiệm Trả lời ngắn (Điền số)
    for (let i = 1; i <= 12; i++) {
      list.push({
        id: `q-part3-${i}-${now}`,
        questionNumber: currentNumber++,
        type: "short_answer",
        part: "Phần III",
        instruction: "Phần III: Câu trắc nghiệm trả lời ngắn (Điền kết quả số nguyên hoặc số thập phân)",
        content: `Câu ${currentNumber - 1} (${subject} - Điền số): [Nhập bài toán tính toán yêu cầu điền kết quả số...]`,
        correctAnswer: "",
        explanation: "",
        points: 0.5,
      });
    }

    // Phần IV: 6 câu Tự luận / Vận dụng cao
    for (let i = 1; i <= 6; i++) {
      list.push({
        id: `q-part4-${i}-${now}`,
        questionNumber: currentNumber++,
        type: "essay",
        part: "Phần IV",
        instruction: "Phần IV: Câu hỏi tự luận giải chi tiết & vận dụng thực tế",
        content: `Câu ${currentNumber - 1} (${subject} - Tự luận): [Nhập bài toán tự luận hoặc bài tập tình huống thực tế...]`,
        sampleEssayAnswer: `Dàn ý bài giải mẫu và barem chấm điểm chi tiết cho câu ${i}:...`,
        explanation: "",
        points: 1.0,
      });
    }

    return list;
  }

  // 2. Môn Ngôn ngữ (Tiếng Anh) -> 50 câu trắc nghiệm 4 lựa chọn
  if (subject === "Tiếng Anh") {
    const list: ExamQuestion[] = [];
    for (let i = 1; i <= 50; i++) {
      const defaultOptions: QuestionOption[] = [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
        { id: "C", text: "Option C" },
        { id: "D", text: "Option D" },
      ];
      list.push({
        id: `q-eng-${i}-${now}`,
        questionNumber: i,
        type: "single_choice",
        part: "Phần I",
        instruction: "Section: Multiple Choice Questions (Choose the best answer A, B, C or D)",
        content: `Question ${i} (English): [Enter question text / gap-filling / reading comprehension question ${i}...]`,
        options: defaultOptions,
        correctAnswer: "A",
        explanation: "",
        points: 0.2,
      });
    }
    return list;
  }

  // 3. Môn Ngữ văn -> 100% Tự luận (Đọc hiểu 4 câu + Viết 2 câu)
  if (subject === "Ngữ văn") {
    return [
      {
        id: `q-van-1-${now}`,
        questionNumber: 1,
        type: "short_answer",
        part: "Phần I",
        instruction: "I. ĐỌC HIỂU (4.0 điểm) - Đọc đoạn trích văn bản và trả lời câu hỏi 1 đến 4",
        content: "Câu 1 (Nhận biết): Xác định thể thơ / phương thức biểu đạt chính của đoạn trích trên.",
        correctAnswer: "Thể thơ tự do / Phương thức biểu đạt chính: Biểu cảm",
        explanation: "Căn cứ vào số chữ trong các dòng thơ và đặc trưng phương thức biểu đạt.",
        points: 0.75,
      },
      {
        id: `q-van-2-${now}`,
        questionNumber: 2,
        type: "short_answer",
        part: "Phần I",
        instruction: "I. ĐỌC HIỂU (4.0 điểm)",
        content: "Câu 2 (Thông hiểu): Theo tác giả trong đoạn trích, hình ảnh người lao động/nhân vật được miêu tả qua những từ ngữ, chi tiết nào?",
        correctAnswer: "Các từ ngữ, chi tiết được trích dẫn trực tiếp từ ngữ liệu.",
        explanation: "Tìm đúng chi tiết trong văn bản theo yêu cầu đề bài.",
        points: 0.75,
      },
      {
        id: `q-van-3-${now}`,
        questionNumber: 3,
        type: "essay",
        part: "Phần I",
        instruction: "I. ĐỌC HIỂU (4.0 điểm)",
        content: "Câu 3 (Thông hiểu): Nêu hiệu quả nghệ thuật của biện pháp tu từ (so sánh / nhân hóa / điệp từ) được sử dụng trong dòng thơ thứ 3 và 4.",
        sampleEssayAnswer: "Biện pháp tu từ giúp câu thơ thêm sinh động, gợi hình gợi cảm và nhấn mạnh tình cảm gắn bó tha thiết...",
        explanation: "Nêu đúng tên phép tu từ và chỉ rõ 2 tác dụng: nghệ thuật biểu đạt và nội dung ý nghĩa.",
        points: 1.0,
      },
      {
        id: `q-van-4-${now}`,
        questionNumber: 4,
        type: "essay",
        part: "Phần I",
        instruction: "I. ĐỌC HIỂU (4.0 điểm)",
        content: "Câu 4 (Vận dụng): Anh/Chị hãy rút ra một thông điệp ý nghĩa nhất từ văn bản trên và giải thích vì sao (viết từ 5 đến 7 dòng).",
        sampleEssayAnswer: "Học sinh tự do nêu thông điệp tích cực (lòng biết ơn, sự kiên trì, tình yêu quê hương...) và có lập luận thuyết phục.",
        explanation: "Đánh giá khả năng rút ra bài học nhận thức và hành động của thí sinh.",
        points: 1.5,
      },
      {
        id: `q-van-5-${now}`,
        questionNumber: 5,
        type: "essay",
        part: "Phần II",
        instruction: "II. LÀM VĂN (6.0 điểm) - Câu 1: Nghị luận xã hội (2.0 điểm)",
        content: "Từ nội dung đoạn trích ở phần Đọc hiểu, anh/chị hãy viết một đoạn văn (khoảng 200 chữ) trình bày suy nghĩ về ý nghĩa của tinh thần trách nhiệm và lòng cống hiến của thế hệ trẻ hôm nay.",
        sampleEssayAnswer: "Dàn ý gợi ý:\n1. Mở đoạn: Dẫn dắt vấn đề nghị luận.\n2. Thân đoạn: Giải thích thế nào là cống hiến; Biểu hiện trong học tập và đời sống; Phản đề những người sống ích kỷ.\n3. Kết đoạn: Bài học hành động bản thân.",
        rubricCriteria: [
          "Đảm bảo đúng hình thức đoạn văn 200 chữ (0.25đ)",
          "Xác định đúng vấn đề nghị luận (0.25đ)",
          "Triển khai luận điểm rõ ràng, dẫn chứng xác thực (1.0đ)",
          "Chính tả, ngữ pháp, sáng tạo (0.5đ)",
        ],
        explanation: "Chấm theo quy chuẩn barem chấm thi THPT Quốc Gia môn Ngữ văn.",
        points: 2.0,
      },
      {
        id: `q-van-6-${now}`,
        questionNumber: 6,
        type: "essay",
        part: "Phần II",
        instruction: "II. LÀM VĂN (6.0 điểm) - Câu 2: Nghị luận văn học (4.0 điểm)",
        content: "Cảm nhận của anh/chị về hình tượng nhân vật trong đoạn trích văn học đã học. Từ đó nhận xét ngắn gọn về nét đặc sắc trong ngòi bút nhân đạo của nhà văn.",
        sampleEssayAnswer: "Dàn ý gợi ý:\nI. Mở bài: Giới thiệu tác giả, tác phẩm, vấn đề nghị luận.\nII. Thân bài: Phân tích các luận điểm nghệ thuật và vẻ đẹp hình tượng nhân vật; Đánh giá giá trị nhân đạo.\nIII. Kết bài: Khẳng định sức sống trường tồn của tác phẩm.",
        rubricCriteria: [
          "Bố cục 3 phần Mở - Thân - Kết (0.5đ)",
          "Xác định đúng vấn đề nghị luận (0.5đ)",
          "Luận điểm rõ ràng, dẫn chứng sâu sắc (2.5đ)",
          "Chính tả, sáng tạo, cảm xúc chân thành (0.5đ)",
        ],
        explanation: "Bài văn nghị luận văn học chuẩn cấu trúc Bộ GD&ĐT.",
        points: 4.0,
      },
    ];
  }

  // 4. Các môn Xã hội khác (Lịch sử, Địa lý) -> 50 câu trắc nghiệm
  const list: ExamQuestion[] = [];
  for (let i = 1; i <= 50; i++) {
    const defaultOptions: QuestionOption[] = [
      { id: "A", text: "Phương án A" },
      { id: "B", text: "Phương án B" },
      { id: "C", text: "Phương án C" },
      { id: "D", text: "Phương án D" },
    ];
    list.push({
      id: `q-soc-${i}-${now}`,
      questionNumber: i,
      type: "single_choice",
      part: "Phần I",
      instruction: "Chọn một đáp án đúng (A, B, C hoặc D)",
      content: `Câu ${i} (${subject}): [Nhập nội dung câu hỏi trắc nghiệm số ${i}...]`,
      options: defaultOptions,
      correctAnswer: "A",
      explanation: "",
      points: 0.2,
    });
  }
  return list;
}

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

  // Quản lý danh sách câu hỏi trong form (mặc định nạp 50 câu chuẩn THPT Toán học)
  const [questions, setQuestions] = useState<ExamQuestion[]>(() =>
    generateSubjectPresetQuestions("Toán học", "THPT Quốc Gia")
  );
  const [collapsedQuestions, setCollapsedQuestions] = useState<Record<string, boolean>>({});
  const [activeFilterPart, setActiveFilterPart] = useState<string>("all");

  // State cho Modal Scan OCR AI từ hình ảnh
  const [showOcrModal, setShowOcrModal] = useState<boolean>(false);
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrPreviewUrl, setOcrPreviewUrl] = useState<string | null>(null);
  const [ocrScanning, setOcrScanning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStatusText, setOcrStatusText] = useState<string>("");
  const [ocrExtractedCount, setOcrExtractedCount] = useState<number>(0);

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
      const res = await fetch("/api/staff/exams?scope=all", { cache: "no-store" });
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

  // Đổi môn học -> Tự động sinh preset ma trận câu hỏi & màu sắc phù hợp
  const handleSelectSubject = (val: ExamItem["subject"]) => {
    setFormSubject(val);

    // Gợi ý chủ đề và mã thẻ tương ứng
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

    // Tự động khởi tạo ngân hàng câu hỏi chuẩn cho môn đó
    const preset = generateSubjectPresetQuestions(val, formCategory);
    setQuestions(preset);
  };

  // Đổi kỳ thi -> Tự động đồng bộ
  const handleSelectCategory = (cat: ExamItem["category"]) => {
    setFormCategory(cat);
    if (cat === "ĐGNL ĐHQG") {
      setSelectedTheme(CARD_THEME_PALETTES[1]);
      setFormCardCode("ĐGNL HCM");
    } else if (cat === "ĐGTD Bách Khoa") {
      setSelectedTheme(CARD_THEME_PALETTES[7]);
      setFormCardCode("ĐGTD BÁCH KHOA");
    }
  };

  // Thu gọn / Mở rộng câu hỏi
  const toggleCollapseQuestion = (qId: string) => {
    setCollapsedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Thu gọn tất cả hoặc mở tất cả
  const toggleCollapseAll = (collapse: boolean) => {
    const next: Record<string, boolean> = {};
    questions.forEach((q) => {
      next[q.id] = collapse;
    });
    setCollapsedQuestions(next);
  };

  // Thêm một câu hỏi vào cuối
  const handleAddQuestionOfType = (type: ExamQuestion["type"] = "single_choice") => {
    const newQ = createNewQuestion(type, questions.length + 1, formSubject);
    setQuestions([...questions, newQ]);
  };

  // Thêm một câu hỏi mặc định
  const handleAddQuestion = () => {
    handleAddQuestionOfType("single_choice");
  };

  // Thêm câu hỏi ngay sau một câu cụ thể (Theo yêu cầu người dùng)
  const handleAddQuestionAfter = (
    index: number,
    type: ExamQuestion["type"] = "single_choice"
  ) => {
    const newQ = createNewQuestion(type, index + 2, formSubject);
    const updated = [...questions];
    updated.splice(index + 1, 0, newQ);
    const renumbered = updated.map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
    }));
    setQuestions(renumbered);
  };

  // Sao chép nhân đôi câu hỏi
  const handleDuplicateQuestion = (index: number) => {
    const target = questions[index];
    if (!target) return;
    const duplicated: ExamQuestion = {
      ...JSON.parse(JSON.stringify(target)),
      id: `q-dup-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      questionNumber: index + 2,
    };
    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    const renumbered = updated.map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
    }));
    setQuestions(renumbered);
  };

  // Di chuyển câu hỏi lên hoặc xuống
  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...questions];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    const renumbered = updated.map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
    }));
    setQuestions(renumbered);
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

  // Bắt đầu mô phỏng AI OCR Quét đề thi từ file hình ảnh
  const handleStartOcrScan = () => {
    if (!ocrFile && !ocrPreviewUrl) return;
    setOcrScanning(true);
    setOcrProgress(10);
    setOcrStatusText("Đang tải hình ảnh lên bộ xử lý AI Vision...");

    setTimeout(() => {
      setOcrProgress(35);
      setOcrStatusText("Đang nhận diện quang học (OCR) các khối văn bản và công thức...");
    }, 700);

    setTimeout(() => {
      setOcrProgress(70);
      setOcrStatusText("Đang phân loại các câu hỏi, bảng phương án A, B, C, D...");
    }, 1500);

    setTimeout(() => {
      setOcrProgress(100);
      setOcrScanning(false);
      setOcrExtractedCount(10);
      setOcrStatusText("Hoàn tất trích xuất thành công 10 câu hỏi từ đề thi!");
    }, 2400);
  };

  // Áp dụng các câu hỏi vừa scan vào form
  const handleApplyOcrResults = () => {
    const newOcrQuestions: ExamQuestion[] = [];
    const now = Date.now();
    for (let i = 1; i <= 10; i++) {
      newOcrQuestions.push({
        id: `ocr-q-${i}-${now}`,
        questionNumber: questions.length + i,
        type: "single_choice",
        part: "Phần I",
        instruction: "Phần I: Câu hỏi trắc nghiệm quét từ hình ảnh AI OCR",
        content: `[AI OCR Đề thi - Câu ${questions.length + i}]: Nội dung câu hỏi được trích xuất tự động từ hình ảnh bản quét...`,
        options: [
          { id: "A", text: "Phương án A (trích xuất)" },
          { id: "B", text: "Phương án B (trích xuất)" },
          { id: "C", text: "Phương án C (trích xuất)" },
          { id: "D", text: "Phương án D (trích xuất)" },
        ],
        correctAnswer: "A",
        explanation: "Lời giải thích tự động nhận diện từ tài liệu.",
        points: 0.25,
      });
    }

    setQuestions((prev) => [...prev, ...newOcrQuestions]);
    setShowOcrModal(false);
    setOcrFile(null);
    setOcrPreviewUrl(null);
    setOcrProgress(0);
    setOcrExtractedCount(0);
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
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                        Môn học
                      </label>
                      <span className="text-[10px] font-bold text-emerald-600">⚡ Tự động nạp đề</span>
                    </div>
                    <select
                      value={formSubject}
                      onChange={(e) => handleSelectSubject(e.target.value as ExamItem["subject"])}
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
                      onChange={(e) => handleSelectCategory(e.target.value as ExamItem["category"])}
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

            {/* Khối 3: Danh sách câu hỏi thi & Soạn thảo chi tiết */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              {(() => {
                const part1Count = questions.filter((q) => (q.type || "single_choice") === "single_choice").length;
                const part2Count = questions.filter((q) => q.type === "true_false").length;
                const part3Count = questions.filter((q) => q.type === "short_answer").length;
                const part4Count = questions.filter((q) => q.type === "essay").length;
                const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

                const displayedQuestions = questions.filter((q) => {
                  if (activeFilterPart === "part1") return (q.type || "single_choice") === "single_choice";
                  if (activeFilterPart === "part2") return q.type === "true_false";
                  if (activeFilterPart === "part3") return q.type === "short_answer";
                  if (activeFilterPart === "part4") return q.type === "essay";
                  return true;
                });

                return (
                  <div>
                    {/* Header Khối 3 */}
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                            <HelpCircle className="h-5 w-5 text-indigo-600" />
                            <span>3. Ngân hàng & Cấu trúc câu hỏi thi ({questions.length} câu)</span>
                          </h2>
                          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-black text-indigo-700">
                            Tổng: {totalPoints.toFixed(1)}đ
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Ma trận đề thi tự động: TN 4 lựa chọn ({part1Count}), Đúng/Sai ({part2Count}), Điền số ({part3Count}), Tự luận ({part4Count}).
                        </p>
                      </div>

                      {/* Các nút công cụ trên thanh tiêu đề */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Nút Scan đề thi từ hình ảnh (AI OCR) */}
                        <button
                          type="button"
                          onClick={() => setShowOcrModal(true)}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-indigo-600/20 transition hover:from-violet-700 hover:to-indigo-700"
                        >
                          <Scan className="h-4 w-4" />
                          <span>Scan đề từ ảnh (AI OCR)</span>
                          <span className="rounded-md bg-amber-400 px-1 py-0.2 text-[9px] font-black uppercase text-slate-950">
                            Mới
                          </span>
                        </button>

                        {/* Nút nạp lại ma trận chuẩn của môn */}
                        <button
                          type="button"
                          onClick={() => handleSelectSubject(formSubject)}
                          title={`Tự động nạp lại cấu trúc chuẩn 50 câu cho ${formSubject}`}
                          className="flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-2 text-xs font-black text-indigo-700 transition hover:bg-indigo-100"
                        >
                          <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Nạp chuẩn {formSubject}</span>
                        </button>

                        {/* Thu gọn / Mở rộng tất cả */}
                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                          <button
                            type="button"
                            onClick={() => toggleCollapseAll(true)}
                            title="Thu gọn tất cả câu hỏi"
                            className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-white hover:text-slate-900"
                          >
                            Thu gọn
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCollapseAll(false)}
                            title="Mở rộng tất cả câu hỏi"
                            className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-white hover:text-slate-900"
                          >
                            Mở hết
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bộ lọc phân loại & Mini-map nhảy nhanh câu hỏi */}
                    <div className="mt-4 space-y-3">
                      {/* Filter Tabs */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveFilterPart("all")}
                          className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                            activeFilterPart === "all"
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Tất cả ({questions.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFilterPart("part1")}
                          className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                            activeFilterPart === "part1"
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Phần I: TN ABCD ({part1Count})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFilterPart("part2")}
                          className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                            activeFilterPart === "part2"
                              ? "bg-purple-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Phần II: Đúng / Sai ({part2Count})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFilterPart("part3")}
                          className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                            activeFilterPart === "part3"
                              ? "bg-sky-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Phần III: Điền số ({part3Count})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFilterPart("part4")}
                          className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                            activeFilterPart === "part4"
                              ? "bg-amber-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Phần IV: Tự luận ({part4Count})
                        </button>
                      </div>

                      {/* Mini-map Quick Jump Bar: Hiển thị các chip số 1..50 */}
                      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-500">
                            <Layers className="h-3.5 w-3.5 text-slate-400" />
                            Sơ đồ điều hướng nhanh (Nhấp để cuộn tới câu):
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {questions.length} vị trí câu hỏi
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                          {questions.map((q, idx) => {
                            const isAnswered =
                              q.content.trim() !== "" &&
                              !q.content.includes("[Nhập nội dung");
                            return (
                              <button
                                key={q.id || idx}
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById(`question-card-${idx}`);
                                  if (el) {
                                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                                  }
                                }}
                                title={`Câu ${idx + 1} (${q.type}) - ${q.points}đ`}
                                className={`h-6 min-w-[28px] px-1 rounded-md text-[11px] font-black transition ${
                                  isAnswered
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Render danh sách từng câu hỏi */}
                    <div className="mt-5 space-y-4">
                      {displayedQuestions.map((q) => {
                        // Tìm index thực trong mảng questions gốc
                        const originalIndex = questions.findIndex((item) => item.id === q.id);
                        const qIndex = originalIndex >= 0 ? originalIndex : 0;
                        const qType = q.type || "single_choice";
                        const isCollapsed = collapsedQuestions[q.id] || false;

                        return (
                          <div
                            key={q.id || qIndex}
                            id={`question-card-${qIndex}`}
                            className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-indigo-300 shadow-xs space-y-3"
                          >
                            {/* Header câu hỏi: Số câu, Loại câu hỏi, Điểm số, Thao tác nhanh */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-800">
                                  Câu {q.questionNumber || qIndex + 1}
                                </span>

                                {q.part && (
                                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                                    {q.part}
                                  </span>
                                )}

                                {/* Chọn loại câu hỏi */}
                                <select
                                  value={qType}
                                  onChange={(e) => {
                                    const nextType = e.target.value as ExamQuestion["type"];
                                    let nextPoints = 0.25;
                                    let nextTf = q.trueFalseItems;
                                    let nextPart = "Phần I";

                                    if (nextType === "true_false") {
                                      nextPoints = 1.0;
                                      nextPart = "Phần II";
                                      if (!nextTf || nextTf.length === 0) {
                                        nextTf = [
                                          { id: "a", content: "Mệnh đề khẳng định ý a)", isCorrect: true },
                                          { id: "b", content: "Mệnh đề khẳng định ý b)", isCorrect: false },
                                          { id: "c", content: "Mệnh đề khẳng định ý c)", isCorrect: true },
                                          { id: "d", content: "Mệnh đề khẳng định ý d)", isCorrect: false },
                                        ];
                                      }
                                    } else if (nextType === "short_answer") {
                                      nextPoints = 0.5;
                                      nextPart = "Phần III";
                                    } else if (nextType === "essay") {
                                      nextPoints = 1.5;
                                      nextPart = "Phần IV";
                                    }

                                    const updated = [...questions];
                                    updated[qIndex] = {
                                      ...updated[qIndex],
                                      type: nextType,
                                      part: nextPart,
                                      points: nextPoints,
                                      trueFalseItems: nextTf,
                                    };
                                    setQuestions(updated);
                                  }}
                                  className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
                                >
                                  <option value="single_choice">Phần I: TN 4 Lựa chọn (A, B, C, D)</option>
                                  <option value="true_false">Phần II: TN Đúng / Sai (4 ý a, b, c, d)</option>
                                  <option value="short_answer">Phần III: Trả lời ngắn (Điền số)</option>
                                  <option value="essay">Phần IV: Tự luận</option>
                                </select>
                              </div>

                              {/* Điều khiển: Điểm số, Di chuyển, Nhân bản, Thu gọn, Xóa */}
                              <div className="flex items-center gap-1.5">
                                {/* Điểm số */}
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mr-1">
                                  <span>Điểm:</span>
                                  <input
                                    type="number"
                                    step="0.25"
                                    min="0.1"
                                    max="10"
                                    value={q.points || 0.25}
                                    onChange={(e) =>
                                      handleUpdateQuestion(qIndex, "points", parseFloat(e.target.value) || 0.25)
                                    }
                                    className="w-14 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-center text-xs font-black text-slate-800 outline-none focus:bg-white"
                                  />
                                </div>

                                {/* Di chuyển lên */}
                                <button
                                  type="button"
                                  disabled={qIndex === 0}
                                  onClick={() => handleMoveQuestion(qIndex, "up")}
                                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                                  title="Di chuyển lên trên"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </button>

                                {/* Di chuyển xuống */}
                                <button
                                  type="button"
                                  disabled={qIndex === questions.length - 1}
                                  onClick={() => handleMoveQuestion(qIndex, "down")}
                                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                                  title="Di chuyển xuống dưới"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </button>

                                {/* Nhân đôi câu hỏi */}
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateQuestion(qIndex)}
                                  className="rounded-lg p-1 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                                  title="Nhân đôi câu hỏi này"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>

                                {/* Thu gọn / Mở rộng */}
                                <button
                                  type="button"
                                  onClick={() => toggleCollapseQuestion(q.id)}
                                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                                  title={isCollapsed ? "Mở rộng câu hỏi" : "Thu gọn câu hỏi"}
                                >
                                  {isCollapsed ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronUp className="h-4 w-4" />
                                  )}
                                </button>

                                {/* Xóa câu hỏi */}
                                {questions.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveQuestion(qIndex)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                                    title="Xóa câu hỏi này"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Thân câu hỏi (Khi không bị thu gọn) */}
                            {!isCollapsed && (
                              <div className="space-y-3 pt-1">
                                {/* Nội dung câu hỏi */}
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                                    Nội dung câu hỏi:
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder={`Nội dung đề bài số ${q.questionNumber || qIndex + 1}...`}
                                    value={q.content}
                                    onChange={(e) => handleUpdateQuestion(qIndex, "content", e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
                                  />
                                </div>

                                {/* ── CASE 1: 4 phương án A, B, C, D ── */}
                                {qType === "single_choice" && (
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                      Phương án lựa chọn (Click nút chữ cái để chọn đáp án đúng):
                                    </label>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                      {(["A", "B", "C", "D"] as const).map((optId) => {
                                        const opt = q.options?.find((o) => o.id === optId);
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
                                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black transition cursor-pointer ${
                                                isCorrect ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                                  </div>
                                )}

                                {/* ── CASE 2: Trắc nghiệm Đúng / Sai 4 ý a, b, c, d ── */}
                                {qType === "true_false" && (
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <label className="text-[11px] font-bold text-purple-900 uppercase">
                                        4 ý khẳng định (Chọn Đúng hoặc Sai cho từng ý):
                                      </label>
                                      <span className="text-[10px] font-bold text-purple-700">
                                        Chuẩn Bộ GD&ĐT: 1 ý = 0.1đ | 2 ý = 0.25đ | 3 ý = 0.5đ | 4 ý = 1.0đ
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {(["a", "b", "c", "d"] as const).map((subId) => {
                                        const item = q.trueFalseItems?.find((it) => it.id === subId) || {
                                          id: subId,
                                          content: "",
                                          isCorrect: true,
                                        };
                                        return (
                                          <div
                                            key={subId}
                                            className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-purple-200/80 bg-purple-50/30 p-2"
                                          >
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-900 text-xs font-black">
                                              {subId})
                                            </span>
                                            <input
                                              type="text"
                                              placeholder={`Mệnh đề khẳng định ý ${subId}...`}
                                              value={item.content}
                                              onChange={(e) =>
                                                handleUpdateTrueFalseItem(qIndex, subId, "content", e.target.value)
                                              }
                                              className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500"
                                            />
                                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleUpdateTrueFalseItem(qIndex, subId, "isCorrect", true)
                                                }
                                                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                                                  item.isCorrect
                                                    ? "bg-emerald-600 text-white shadow-xs"
                                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50"
                                                }`}
                                              >
                                                ✓ ĐÚNG
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleUpdateTrueFalseItem(qIndex, subId, "isCorrect", false)
                                                }
                                                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                                                  !item.isCorrect
                                                    ? "bg-rose-600 text-white shadow-xs"
                                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-rose-50"
                                                }`}
                                              >
                                                ✕ SAI
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* ── CASE 3: Trả lời ngắn (Điền kết quả số) ── */}
                                {qType === "short_answer" && (
                                  <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3">
                                    <label className="block text-[11px] font-bold text-sky-900 uppercase mb-1">
                                      Đáp án số chuẩn hệ thống (VD: 20.5, 12, -4...):
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Nhập kết quả số chuẩn (hỗ trợ số nguyên, số thập phân 20.5 hoặc 20,5)..."
                                      value={q.correctAnswer || ""}
                                      onChange={(e) => handleUpdateQuestion(qIndex, "correctAnswer", e.target.value)}
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-sky-500"
                                    />
                                  </div>
                                )}

                                {/* ── CASE 4: Tự luận ── */}
                                {qType === "essay" && (
                                  <div className="space-y-2 rounded-xl border border-indigo-200 bg-indigo-50/40 p-3">
                                    <label className="block text-[11px] font-bold text-indigo-900 uppercase">
                                      Đáp án mẫu & Dàn ý giải chi tiết cho giáo viên chấm:
                                    </label>
                                    <textarea
                                      rows={3}
                                      placeholder="Nhập các bước giải, gợi ý đáp án mẫu để học sinh đối chiếu sau khi nộp bài..."
                                      value={q.sampleEssayAnswer || ""}
                                      onChange={(e) =>
                                        handleUpdateQuestion(qIndex, "sampleEssayAnswer", e.target.value)
                                      }
                                      className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500"
                                    />
                                  </div>
                                )}

                                {/* Lời giải thích chung */}
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-500 uppercase">
                                    Lời giải thích chung cho cả câu:
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Lời giải thích chi tiết cho câu hỏi này (tùy chọn)..."
                                    value={q.explanation || ""}
                                    onChange={(e) => handleUpdateQuestion(qIndex, "explanation", e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-600 outline-none focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                            )}

                            {/* ════════════════════════════════════════════════════════════════════════
                                YÊU CẦU ĐẶC BIỆT: NÚT THÊM CÂU NGAY PHÍA DƯỚI TỪNG CÂU HỎI
                                Người dùng có thể click trực tiếp thêm câu trắc nghiệm / đúng sai... ở đây!
                               ════════════════════════════════════════════════════════════════════════ */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs">
                              <span className="flex items-center gap-1 text-[11px] font-black uppercase text-slate-400">
                                <Plus className="h-3.5 w-3.5 text-indigo-500" />
                                Thêm câu ngay phía sau câu {q.questionNumber || qIndex + 1}:
                              </span>

                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddQuestionAfter(qIndex, "single_choice")}
                                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                >
                                  <span>+ Trắc nghiệm ABCD</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddQuestionAfter(qIndex, "true_false")}
                                  className="flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50/50 px-2.5 py-1 text-[11px] font-bold text-purple-700 transition hover:bg-purple-100"
                                >
                                  <span>+ Đúng / Sai</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddQuestionAfter(qIndex, "short_answer")}
                                  className="flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50/50 px-2.5 py-1 text-[11px] font-bold text-sky-700 transition hover:bg-sky-100"
                                >
                                  <span>+ Điền số</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddQuestionAfter(qIndex, "essay")}
                                  className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/50 px-2.5 py-1 text-[11px] font-bold text-amber-700 transition hover:bg-amber-100"
                                >
                                  <span>+ Tự luận</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ════════════════════════════════════════════════════════════════════════
                        BẢNG ĐIỀU KHIỂN THÊM CÂU HỎI Ở CUỐI MỤC 3 (DOCK 4 NÚT)
                       ════════════════════════════════════════════════════════════════════════ */}
                    <div className="mt-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 text-xs font-black uppercase text-indigo-950">
                          <Plus className="h-4 w-4 text-indigo-600" />
                          Thêm nhanh câu hỏi vào cuối danh sách:
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          Đang có {questions.length} câu
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <button
                          type="button"
                          onClick={() => handleAddQuestionOfType("single_choice")}
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-white p-3 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50 group"
                        >
                          <CheckCircle className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition" />
                          <span className="text-xs font-black text-slate-800">
                            + Trắc nghiệm ABCD
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Phần I (0.25đ)
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddQuestionOfType("true_false")}
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-purple-200 bg-white p-3 text-center transition hover:border-purple-400 hover:bg-purple-50/50 group"
                        >
                          <CheckSquare className="h-4 w-4 text-purple-600 group-hover:scale-110 transition" />
                          <span className="text-xs font-black text-slate-800">
                            + Đúng / Sai (a,b,c,d)
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Phần II (1.0đ)
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddQuestionOfType("short_answer")}
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-sky-200 bg-white p-3 text-center transition hover:border-sky-400 hover:bg-sky-50/50 group"
                        >
                          <Hash className="h-4 w-4 text-sky-600 group-hover:scale-110 transition" />
                          <span className="text-xs font-black text-slate-800">
                            + Điền kết quả số
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Phần III (0.5đ)
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddQuestionOfType("essay")}
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-amber-200 bg-white p-3 text-center transition hover:border-amber-400 hover:bg-amber-50/50 group"
                        >
                          <PenTool className="h-4 w-4 text-amber-600 group-hover:scale-110 transition" />
                          <span className="text-xs font-black text-slate-800">
                            + Bài Tự luận
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Phần IV (1.0đ - 4.0đ)
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
          MODAL SCAN ĐỀ THI TỪ HÌNH ẢNH (AI OCR)
         ========================================================================= */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Scan className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Scan đề thi từ hình ảnh (AI Vision OCR)
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Tính năng đang thử nghiệm - Tự động trích xuất đề thi từ ảnh chụp hoặc tài liệu PDF
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowOcrModal(false);
                  setOcrFile(null);
                  setOcrPreviewUrl(null);
                  setOcrProgress(0);
                  setOcrExtractedCount(0);
                }}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="mt-5 space-y-4">
              {/* Vùng tải file / Drag & Drop */}
              <div
                onClick={() => {
                  const input = document.getElementById("ocr-file-input");
                  if (input) input.click();
                }}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 p-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
              >
                <input
                  id="ocr-file-input"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setOcrFile(file);
                      setOcrPreviewUrl(URL.createObjectURL(file));
                      setOcrProgress(0);
                      setOcrExtractedCount(0);
                    }
                  }}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-indigo-600">
                  <Camera className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-black text-slate-800">
                  {ocrFile ? ocrFile.name : "Nhấp hoặc kéo thả ảnh chụp trang đề thi vào đây"}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">
                  Hỗ trợ định dạng PNG, JPG, JPEG hoặc PDF chụp rõ nét
                </p>
              </div>

              {/* Preview ảnh nếu đã chọn */}
              {ocrPreviewUrl && (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
                  <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-600">
                    <span>Ảnh đề thi đã nạp:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setOcrFile(null);
                        setOcrPreviewUrl(null);
                        setOcrProgress(0);
                        setOcrExtractedCount(0);
                      }}
                      className="text-rose-500 hover:underline"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ocrPreviewUrl}
                    alt="Bản scan đề thi"
                    className="max-h-56 w-full rounded-xl object-contain bg-white"
                  />
                </div>
              )}

              {/* Tiến trình quét OCR */}
              {ocrScanning && (
                <div className="space-y-2 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <div className="flex items-center justify-between text-xs font-black text-indigo-900">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                      {ocrStatusText}
                    </span>
                    <span>{ocrProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-200/60">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Kết quả scan thành công */}
              {!ocrScanning && ocrExtractedCount > 0 && (
                <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-900">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>{ocrStatusText}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-700">
                    Hệ thống AI đã nhận dạng và bóc tách thành công {ocrExtractedCount} câu hỏi trắc nghiệm gồm đề bài, 4 phương án A, B, C, D và lời giải thích. Nhấp &ldquo;Nạp vào đề thi&rdquo; để thêm trực tiếp vào danh sách.
                  </p>
                </div>
              )}

              {/* Thông tin chuẩn bị cho bản phát triển tương lai */}
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-3.5 text-xs text-slate-500">
                <span className="font-bold text-slate-700">Ghi chú phát triển (Roadmap):</span> Mô hình AI Vision OCR đang được kết nối với API nhận dạng công thức Toán LaTeX và bóc tách bảng đáp án tự động. Khi hoàn thiện, bạn chỉ cần tải ảnh chụp đề là toàn bộ 50 câu sẽ được điền đầy đủ!
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowOcrModal(false);
                  setOcrFile(null);
                  setOcrPreviewUrl(null);
                  setOcrProgress(0);
                  setOcrExtractedCount(0);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>

              {ocrExtractedCount > 0 ? (
                <button
                  type="button"
                  onClick={handleApplyOcrResults}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nạp 10 câu vào đề thi</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={(!ocrFile && !ocrPreviewUrl) || ocrScanning}
                  onClick={handleStartOcrScan}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {ocrScanning ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Scan className="h-4 w-4" />
                  )}
                  <span>Quét & Nhận diện AI</span>
                </button>
              )}
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
