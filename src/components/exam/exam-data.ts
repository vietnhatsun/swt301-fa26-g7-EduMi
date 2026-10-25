export type ExamCategory =
  | "Tất cả"
  | "THPT Quốc Gia"
  | "ĐGNL ĐHQG"
  | "ĐGTD Bách Khoa"
  | "Kiểm tra Học kỳ";

export type ExamSubject =
  | "Tất cả"
  | "Toán học"
  | "Vật lý"
  | "Hóa học"
  | "Sinh học"
  | "Tiếng Anh"
  | "Ngữ văn"
  | "Lịch sử"
  | "Địa lý";

export type ExamDifficulty = "Tất cả" | "Cơ bản (5-7đ)" | "Vận dụng (7-8.5đ)" | "Vận dụng cao (9-10đ)";

export type ExamPatternType = "waves" | "clouds" | "confetti" | "stripes" | "ripples" | "chevrons";

export interface ExamItem {
  id: string;
  examCode: string; // Mã phòng thi độc nhất (VD: EDM-8899)
  category: "THPT Quốc Gia" | "ĐGNL ĐHQG" | "ĐGTD Bách Khoa" | "Kiểm tra Học kỳ";
  subject: "Toán học" | "Vật lý" | "Hóa học" | "Sinh học" | "Tiếng Anh" | "Ngữ văn" | "Lịch sử" | "Địa lý";
  cardCode: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  difficulty: "Cơ bản (5-7đ)" | "Vận dụng (7-8.5đ)" | "Vận dụng cao (9-10đ)";
  attempts: number;
  rating: number;
  bgClass: string;
  accentClass: string;
  pattern: ExamPatternType;
  isHot?: boolean;
  isNew?: boolean;
  author: string;
  createdAt?: string;
  updatedAt?: string;
}

export const MOCK_EXAMS: ExamItem[] = [
  {
    id: "toan-12-thpt-01",
    examCode: "EDM-8899",
    category: "THPT Quốc Gia",
    subject: "Toán học",
    cardCode: "TOÁN 12",
    title: "Đề thi thử THPT Quốc Gia môn Toán 2026 - Đề số 01 (Ma trận mới Bộ GD&ĐT)",
    description: "Chuẩn 100% cấu trúc mới Bộ GD&ĐT: Trắc nghiệm 4 lựa chọn, Trắc nghiệm Đúng/Sai, Trả lời ngắn thập phân 20.5 và Tự luận.",
    durationMinutes: 90,
    questionCount: 9,
    difficulty: "Vận dụng (7-8.5đ)",
    attempts: 45240,
    rating: 4.9,
    bgClass: "bg-[#e07328]",
    accentClass: "text-[#e07328]",
    pattern: "waves",
    isHot: true,
    author: "Thầy Trần Minh (Tổ Toán THPT)",
  },
  {
    id: "dgnl-hcm-2026-01",
    examCode: "EDM-2026",
    category: "ĐGNL ĐHQG",
    subject: "Toán học",
    cardCode: "ĐGNL HCM",
    title: "Đề chuẩn Đánh giá năng lực ĐHQG TP.HCM 2026 (Phần Tư duy Logic & Số liệu)",
    description: "Rèn luyện kỹ năng phân tích bảng số liệu, suy luận toán học và logic thực tế chuẩn 1200 điểm.",
    durationMinutes: 60,
    questionCount: 40,
    difficulty: "Vận dụng cao (9-10đ)",
    attempts: 38920,
    rating: 5.0,
    bgClass: "bg-[#0284c7]",
    accentClass: "text-[#0284c7]",
    pattern: "ripples",
    isHot: true,
    isNew: true,
    author: "Hội đồng Khảo thí EduMi",
  },
  {
    id: "vat-ly-12-thpt-01",
    examCode: "EDM-7749",
    category: "THPT Quốc Gia",
    subject: "Vật lý",
    cardCode: "VẬT LÝ 12",
    title: "Đề thi thử Vật lý 12 THPT Quốc Gia: Trọn bộ Dao động cơ & Sóng ánh sáng",
    description: "Hệ thống câu hỏi nhận biết, bài toán đồ thị dao động phức hợp và hiện tượng quang điện.",
    durationMinutes: 50,
    questionCount: 40,
    difficulty: "Vận dụng (7-8.5đ)",
    attempts: 41360,
    rating: 4.8,
    bgClass: "bg-[#bf5447]",
    accentClass: "text-[#bf5447]",
    pattern: "confetti",
    author: "Thầy Trần Minh - Thạc sĩ Vật lý",
  },
  {
    id: "english-thpt-2026",
    examCode: "EDM-9911",
    category: "THPT Quốc Gia",
    subject: "Tiếng Anh",
    cardCode: "TIẾNG ANH",
    title: "Đề thi thử Tốt nghiệp THPT Tiếng Anh 2026 - Reading & Cloze Test nâng cao",
    description: "Tập trung bẫy từ vựng Collocations, thì động từ và các đoạn văn đọc hiểu chủ đề Khoa học - Xã hội.",
    durationMinutes: 50,
    questionCount: 40,
    difficulty: "Vận dụng (7-8.5đ)",
    attempts: 43210,
    rating: 4.9,
    bgClass: "bg-[#be4c73]",
    accentClass: "text-[#be4c73]",
    pattern: "clouds",
    isHot: true,
    author: "Cô Emily Nguyễn - 8.5 IELTS",
  },
  {
    id: "hoa-hoc-12-este-01",
    examCode: "EDM-5522",
    category: "THPT Quốc Gia",
    subject: "Hóa học",
    cardCode: "HÓA HỌC",
    title: "Đề khảo sát chất lượng Hóa học 12: Este - Lipit, Amin và Kim loại kiềm",
    description: "Phân loại câu hỏi lý thuyết đếm chất, sơ đồ chuỗi phản ứng và bài toán thủy phân hỗn hợp.",
    durationMinutes: 50,
    questionCount: 40,
    difficulty: "Vận dụng cao (9-10đ)",
    attempts: 36450,
    rating: 4.8,
    bgClass: "bg-[#0d9488]",
    accentClass: "text-[#0d9488]",
    pattern: "ripples",
    author: "Thầy Đỗ Khải - Chuyên Hóa EduMi",
  },
  {
    id: "ngu-van-12-nlxh-01",
    examCode: "EDM-3344",
    category: "THPT Quốc Gia",
    subject: "Ngữ văn",
    cardCode: "NGỮ VĂN",
    title: "Đề thi thử Ngữ văn 12: Đọc hiểu văn bản Nghị luận & Làm văn Phân tích tác phẩm",
    description: "Rèn luyện kỹ năng đọc hiểu ngữ liệu ngoài sách giáo khoa, viết đoạn văn NLXH 200 chữ.",
    durationMinutes: 120,
    questionCount: 5,
    difficulty: "Vận dụng (7-8.5đ)",
    attempts: 29840,
    rating: 4.7,
    bgClass: "bg-[#7356bc]",
    accentClass: "text-[#7356bc]",
    pattern: "stripes",
    author: "Cô Mai Phương - Giảng viên Sư phạm",
  },
  {
    id: "sinh-hoc-12-di-truyen-01",
    examCode: "EDM-6677",
    category: "THPT Quốc Gia",
    subject: "Sinh học",
    cardCode: "SINH HỌC",
    title: "Đề ôn luyện Sinh học 12: Quy luật Di truyền Men-đen & Phả hệ di truyền người",
    description: "Chinh phục dạng toán phả hệ khó, bài toán xác suất di truyền liên kết và hoán vị gen.",
    durationMinutes: 50,
    questionCount: 40,
    difficulty: "Vận dụng cao (9-10đ)",
    attempts: 27150,
    rating: 4.8,
    bgClass: "bg-[#16a34a]",
    accentClass: "text-[#16a34a]",
    pattern: "chevrons",
    author: "Thầy Lê Văn Hoàng - Thạc sĩ Sinh học",
  },
  {
    id: "dgtd-bach-khoa-01",
    examCode: "EDM-1122",
    category: "ĐGTD Bách Khoa",
    subject: "Toán học",
    cardCode: "ĐGTD BÁCH KHOA",
    title: "Đề thi thử Đánh giá tư duy Bách Khoa: Tư duy Toán học & Khoa học thực nghiệm",
    description: "Mô phỏng 100% đề thi ĐGTD ĐH Bách Khoa Hà Nội với định dạng câu hỏi kéo thả, điền số tự động.",
    durationMinutes: 60,
    questionCount: 40,
    difficulty: "Vận dụng cao (9-10đ)",
    attempts: 34120,
    rating: 4.9,
    bgClass: "bg-[#2563eb]",
    accentClass: "text-[#2563eb]",
    pattern: "waves",
    isNew: true,
    author: "Tổ Tư duy KHTN EduMi",
  },
  {
    id: "lich-su-12-thpt-01",
    examCode: "EDM-4455",
    category: "THPT Quốc Gia",
    subject: "Lịch sử",
    cardCode: "LỊCH SỬ 12",
    title: "Đề thi thử THPT Lịch sử Việt Nam 1945 - 1975: Các chiến dịch quyết định",
    description: "Tập trung các sự kiện mốc thời gian, ý nghĩa lịch sử và bài học kinh nghiệm trong kháng chiến.",
    durationMinutes: 50,
    questionCount: 40,
    difficulty: "Cơ bản (5-7đ)",
    attempts: 21890,
    rating: 4.7,
    bgClass: "bg-[#b45309]",
    accentClass: "text-[#b45309]",
    pattern: "clouds",
    author: "Cô Thu Hằng - Chuyên gia Sử học",
  },
  {
    id: "dia-ly-12-atlat-01",
    examCode: "EDM-7788",
    category: "THPT Quốc Gia",
    subject: "Địa lý",
    cardCode: "ĐỊA LÝ 12",
    title: "Đề luyện kỹ năng Atlat Địa lý Việt Nam & Nhận diện biểu đồ tốc độ tăng trưởng",
    description: "Thực hành tra cứu Atlat nhanh trong 30 giây/câu, nhận dạng đúng biểu đồ tròn, miền, cột, đường.",
    durationMinutes: 50,
    questionCount: 40,
    difficulty: "Cơ bản (5-7đ)",
    attempts: 25410,
    rating: 4.8,
    bgClass: "bg-[#059669]",
    accentClass: "text-[#059669]",
    pattern: "ripples",
    author: "Thầy Quốc Tuấn - Giáo viên Địa lý",
  },
  {
    id: "toan-11-giua-ky-01",
    examCode: "EDM-1133",
    category: "Kiểm tra Học kỳ",
    subject: "Toán học",
    cardCode: "TOÁN 11",
    title: "Đề kiểm tra Giữa học kỳ II Toán 11: Dãy số, Cấp số cộng, Giới hạn hàm số",
    description: "Đề kiểm tra chuẩn kiến thức trọng tâm chương trình mới, phân loại học sinh khá giỏi rõ nét.",
    durationMinutes: 45,
    questionCount: 28,
    difficulty: "Vận dụng (7-8.5đ)",
    attempts: 18760,
    rating: 4.9,
    bgClass: "bg-[#7c3aed]",
    accentClass: "text-[#7c3aed]",
    pattern: "stripes",
    author: "Thầy Nguyễn Hữu Trí",
  },
  {
    id: "dgnl-hn-2026-01",
    examCode: "EDM-9988",
    category: "ĐGNL ĐHQG",
    subject: "Toán học",
    cardCode: "ĐGNL HÀ NỘI",
    title: "Đề thi thử HSA ĐHQG Hà Nội 2026: Phần Tư duy định lượng Toán & Số liệu",
    description: "50 câu hỏi trắc nghiệm khách quan và điền đáp án số bám sát 100% đề thi chính thức HSA.",
    durationMinutes: 75,
    questionCount: 50,
    difficulty: "Vận dụng cao (9-10đ)",
    attempts: 31200,
    rating: 4.9,
    bgClass: "bg-[#db2777]",
    accentClass: "text-[#db2777]",
    pattern: "confetti",
    isHot: true,
    author: "Hội đồng Khảo thí EduMi",
  },
];

export interface QuestionOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface TrueFalseItem {
  id: "a" | "b" | "c" | "d";
  content: string;
  isCorrect: boolean;
  explanation?: string;
}

export type ExamQuestionType = "single_choice" | "true_false" | "short_answer" | "essay";

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  type: ExamQuestionType;
  section?: "Trắc nghiệm" | "Tự luận" | string;
  part?: "Phần I" | "Phần II" | "Phần III" | "Phần IV" | string;
  instruction: string;
  content: string;
  options?: QuestionOption[];
  trueFalseItems?: TrueFalseItem[];
  correctAnswer?: string;
  explanation: string;
  sampleEssayAnswer?: string;
  rubricCriteria?: string[];
  wordLimit?: { min?: number; max?: number };
  points: number;
}

/**
 * Chuẩn hóa và so sánh câu trả lời ngắn (hỗ trợ số thập phân 20.5 = 20,5 hoặc từ khóa)
 */
export function isShortAnswerCorrect(userAns?: string, correctAns?: string): boolean {
  if (!userAns || !correctAns) return false;
  const cleanUser = userAns.trim().replace(",", ".").replace(/\s+/g, "").toLowerCase();
  const cleanCorrect = correctAns.trim().replace(",", ".").replace(/\s+/g, "").toLowerCase();

  const numUser = parseFloat(cleanUser);
  const numCorrect = parseFloat(cleanCorrect);
  if (!isNaN(numUser) && !isNaN(numCorrect)) {
    return Math.abs(numUser - numCorrect) < 0.001;
  }
  return cleanUser === cleanCorrect;
}

/**
 * Tính điểm câu hỏi Trắc nghiệm Đúng / Sai theo quy chuẩn Bộ GD&ĐT:
 * - Đúng 1 ý: 0.1 điểm
 * - Đúng 2 ý: 0.25 điểm
 * - Đúng 3 ý: 0.5 điểm
 * - Đúng 4 ý: 1.0 điểm
 */
export function calculateTrueFalseScore(
  userTf: Record<string, boolean> = {},
  items: TrueFalseItem[] = []
): { correctCount: number; points: number; totalItems: number } {
  if (!items || items.length === 0) return { correctCount: 0, points: 0, totalItems: 0 };

  let correctCount = 0;
  items.forEach((item) => {
    if (userTf[item.id] !== undefined && userTf[item.id] === item.isCorrect) {
      correctCount++;
    }
  });

  let points = 0;
  if (correctCount === 1) points = 0.1;
  else if (correctCount === 2) points = 0.25;
  else if (correctCount === 3) points = 0.5;
  else if (correctCount === 4) points = 1.0;

  return { correctCount, points, totalItems: items.length };
}

// Question bank by exam ID
export const MOCK_QUESTIONS_DATABASE: Record<string, ExamQuestion[]> = {
  "toan-12-thpt-01": [
    {
      id: "q1",
      questionNumber: 1,
      type: "single_choice",
      part: "Phần I",
      section: "Trắc nghiệm",
      instruction: "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)",
      content: "Cho hàm số y = f(x) có bảng biến thiên với f'(x) đổi dấu từ dương sang âm khi qua x = 2. Điểm cực đại của hàm số đã cho là:",
      options: [
        { id: "A", text: "x = 2" },
        { id: "B", text: "x = -2" },
        { id: "C", text: "y = 2" },
        { id: "D", text: "x = 0" },
      ],
      correctAnswer: "A",
      explanation: "Theo định nghĩa, nếu f'(x) đổi dấu từ dương (+) sang âm (-) khi qua điểm x0 thì hàm số đạt cực đại tại điểm x0. Ở đây x0 = 2.",
      points: 0.25,
    },
    {
      id: "q2",
      questionNumber: 2,
      type: "single_choice",
      part: "Phần I",
      section: "Trắc nghiệm",
      instruction: "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)",
      content: "Tập nghiệm của bất phương trình log₂(x - 1) < 3 là:",
      options: [
        { id: "A", text: "(1; 9)" },
        { id: "B", text: "(-∞; 9)" },
        { id: "C", text: "(1; 8)" },
        { id: "D", text: "(1; +∞)" },
      ],
      correctAnswer: "A",
      explanation: "Điều kiện xác định: x - 1 > 0 <=> x > 1. Bất phương trình: log₂(x - 1) < 3 <=> x - 1 < 2³ = 8 <=> x < 9. Kết hợp điều kiện ta được tập nghiệm S = (1; 9).",
      points: 0.25,
    },
    {
      id: "q3",
      questionNumber: 3,
      type: "single_choice",
      part: "Phần I",
      section: "Trắc nghiệm",
      instruction: "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)",
      content: "Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 3z - 5 = 0. Một vectơ pháp tuyến của (P) có tọa độ là:",
      options: [
        { id: "A", text: "n = (2; -1; 3)" },
        { id: "B", text: "n = (2; 1; 3)" },
        { id: "C", text: "n = (2; -1; -5)" },
        { id: "D", text: "n = (-2; -1; 3)" },
      ],
      correctAnswer: "A",
      explanation: "Mặt phẳng Ax + By + Cz + D = 0 có một vectơ pháp tuyến là n = (A; B; C). Do đó n = (2; -1; 3).",
      points: 0.25,
    },
    {
      id: "q4",
      questionNumber: 4,
      type: "single_choice",
      part: "Phần I",
      section: "Trắc nghiệm",
      instruction: "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)",
      content: "Tính tích phân I = ∫ từ 0 đến 1 của e^(2x) dx.",
      options: [
        { id: "A", text: "I = (e² - 1) / 2" },
        { id: "B", text: "I = e² - 1" },
        { id: "C", text: "I = (e² + 1) / 2" },
        { id: "D", text: "I = 2(e² - 1)" },
      ],
      correctAnswer: "A",
      explanation: "Ta có nguyên hàm ∫ e^(2x) dx = (1/2) e^(2x). Thay cận từ 0 đến 1: (1/2) * (e² - e⁰) = (e² - 1)/2.",
      points: 0.25,
    },
    {
      id: "q5",
      questionNumber: 5,
      type: "true_false",
      part: "Phần II",
      section: "Trắc nghiệm Đúng/Sai",
      instruction: "Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai",
      content: "Cho hàm số f(x) = x³ - 3x² + 2 có đồ thị là (C). Xét tính đúng sai của các khẳng định sau:",
      trueFalseItems: [
        {
          id: "a",
          content: "Hàm số đã cho có đạo hàm f'(x) = 3x² - 6x.",
          isCorrect: true,
          explanation: "Đạo hàm: (x³ - 3x² + 2)' = 3x² - 6x. Khẳng định ĐÚNG.",
        },
        {
          id: "b",
          content: "Hàm số đồng biến trên khoảng (0; 2).",
          isCorrect: false,
          explanation: "Ta có f'(x) = 3x(x - 2) < 0 với mọi x thuộc (0; 2), do đó hàm số nghịch biến trên khoảng (0; 2). Khẳng định SAI.",
        },
        {
          id: "c",
          content: "Giá trị cực tiểu của hàm số bằng -2.",
          isCorrect: true,
          explanation: "f'(x) đổi dấu từ âm sang dương tại x = 2 nên x = 2 là điểm cực tiểu, f(2) = 2³ - 3(2²) + 2 = -2. Khẳng định ĐÚNG.",
        },
        {
          id: "d",
          content: "Đồ thị (C) cắt trục hoành tại đúng 3 điểm phân biệt.",
          isCorrect: true,
          explanation: "Ta có f(0) = 2 (cực đại) và f(2) = -2 (cực tiểu). Vì y_CĐ * y_CT = 2 * (-2) = -4 < 0 nên đồ thị cắt Ox tại đúng 3 điểm phân biệt. Khẳng định ĐÚNG.",
        },
      ],
      explanation: "Phân tích bảng biến thiên hàm bậc ba: Đồng biến trên (-∞; 0) và (2; +∞), nghịch biến trên (0; 2). Cực đại tại (0; 2), cực tiểu tại (2; -2).",
      points: 1.0,
    },
    {
      id: "q6",
      questionNumber: 6,
      type: "true_false",
      part: "Phần II",
      section: "Trắc nghiệm Đúng/Sai",
      instruction: "Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai",
      content: "Trong không gian Oxyz, cho mặt cầu (S): (x - 1)² + (y - 2)² + (z + 1)² = 9 và mặt phẳng (P): 2x - 2y + z + 8 = 0. Xét tính đúng sai của các khẳng định sau:",
      trueFalseItems: [
        {
          id: "a",
          content: "Mặt cầu (S) có tọa độ tâm I(1; 2; -1) và bán kính R = 3.",
          isCorrect: true,
          explanation: "Phương trình chính tắc (x - a)² + (y - b)² + (z - c)² = R² => tâm I(1; 2; -1), R = √9 = 3. Khẳng định ĐÚNG.",
        },
        {
          id: "b",
          content: "Khoảng cách từ tâm I của mặt cầu đến mặt phẳng (P) bằng 1.",
          isCorrect: false,
          explanation: "d(I, (P)) = |2(1) - 2(2) + 1(-1) + 8| / √(2² + (-2)² + 1²) = |5| / 3 = 5/3 ≠ 1. Khẳng định SAI.",
        },
        {
          id: "c",
          content: "Mặt phẳng (P) tiếp xúc với mặt cầu (S).",
          isCorrect: false,
          explanation: "Vì d(I, (P)) = 5/3 < R = 3 nên mặt phẳng (P) cắt mặt cầu (S) theo giao tuyến là một đường tròn, không tiếp xúc. Khẳng định SAI.",
        },
        {
          id: "d",
          content: "Đường thẳng Δ đi qua tâm I và vuông góc với (P) có vectơ chỉ phương u = (2; -2; 1).",
          isCorrect: true,
          explanation: "Δ vuông góc với (P) nên vectơ chỉ phương của Δ cùng phương với vectơ pháp tuyến n_(P) = (2; -2; 1). Khẳng định ĐÚNG.",
        },
      ],
      explanation: "Vận dụng kiến thức hình học không gian Oxyz: Khoảng cách từ điểm đến mặt phẳng, vị trí tương đối giữa mặt cầu và mặt phẳng.",
      points: 1.0,
    },
    {
      id: "q7",
      questionNumber: 7,
      type: "short_answer",
      part: "Phần III",
      section: "Trả lời ngắn",
      instruction: "Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)",
      content: "Một doanh nghiệp dự tính hàm số lợi nhuận khi bán x tấn sản phẩm là P(x) = -0.1x² + 4.1x - 15 (triệu đồng). Tìm sản lượng x (tấn) để doanh nghiệp đạt mức lợi nhuận lớn nhất. (Học sinh điền kết quả dạng số thập phân, ví dụ: 20.5)",
      options: [],
      correctAnswer: "20.5",
      explanation: "Hàm bậc hai P(x) = -0.1x² + 4.1x - 15 có hệ số a = -0.1 < 0 nên đạt giá trị lớn nhất tại đỉnh parabol: x = -b / (2a) = -4.1 / (2 * -0.1) = 4.1 / 0.2 = 20.5. Khi đó lợi nhuận cực đại đạt 27.025 triệu đồng.",
      points: 0.5,
    },
    {
      id: "q8",
      questionNumber: 8,
      type: "short_answer",
      part: "Phần III",
      section: "Trả lời ngắn",
      instruction: "Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số nguyên)",
      content: "Cho khối chóp tam giác S.ABC có đáy ABC là tam giác vuông tại B, AB = 3, BC = 4. Cạnh bên SA vuông góc với mặt phẳng đáy (ABC) và SA = 6. Tính thể tích V của khối chóp S.ABC.",
      options: [],
      correctAnswer: "12",
      explanation: "Diện tích tam giác vuông ABC: S_đáy = (1/2) * AB * BC = (1/2) * 3 * 4 = 6. Chiều cao khối chóp h = SA = 6. Thể tích V = (1/3) * S_đáy * h = (1/3) * 6 * 6 = 12.",
      points: 0.5,
    },
    {
      id: "q9",
      questionNumber: 9,
      type: "essay",
      part: "Phần IV",
      section: "Tự luận",
      instruction: "Phần IV: Tự luận - Trình bày các bước giải chi tiết",
      content: "Trong không gian Oxyz, cho điểm M(1; 2; -1) và mặt phẳng (P): x + 2y - 2z + 1 = 0.\na) Viết phương trình chính tắc của đường thẳng d đi qua điểm M và vuông góc với mặt phẳng (P).\nb) Tìm tọa độ hình chiếu vuông góc H của điểm M lên mặt phẳng (P). Trình bày rõ các bước giải chi tiết vào khung làm bài.",
      options: [],
      correctAnswer: "H(1/9; 2/9; 7/9)",
      explanation: "Hướng dẫn giải chi tiết:\n1. Đường thẳng d qua M(1; 2; -1) nhận VTPT n_(P) = (1; 2; -2) làm VTCP: (x - 1)/1 = (y - 2)/2 = (z + 1)/(-2).\n2. Tham số hóa H ∈ d: H(1 + t; 2 + 2t; -1 - 2t).\n3. Thay tọa độ H vào (P): (1 + t) + 2(2 + 2t) - 2(-1 - 2t) + 1 = 0 <=> 9t + 8 = 0 => t = -8/9 => H(1/9; 2/9; 7/9).",
      sampleEssayAnswer: "Lời giải tham khảo:\n- Bước 1: Mặt phẳng (P) có vectơ pháp tuyến n = (1; 2; -2).\n- Bước 2: Vì đường thẳng d ⊥ (P) nên d nhận n làm vectơ chỉ phương.\nPhương trình tham số của d: x = 1 + t, y = 2 + 2t, z = -1 - 2t (t ∈ R).\n- Bước 3: Điểm H là giao điểm của d và (P). Thay phương trình d vào (P):\n(1 + t) + 2(2 + 2t) - 2(-1 - 2t) + 1 = 0 <=> 9t + 8 = 0 <=> t = -8/9.\n- Kết luận: Tọa độ hình chiếu H là H(1/9; 2/9; 7/9).",
      rubricCriteria: [
        "Xác định đúng VTCP của đường thẳng d và viết đúng PT đường thẳng (0.5 điểm)",
        "Thiết lập tọa độ điểm tham số H và lập phương trình tìm t (0.5 điểm)",
        "Giải đúng giá trị tham số t và kết luận chính xác tọa độ điểm H (0.5 điểm)",
      ],
      points: 1.5,
    },
  ],
  "dgnl-hcm-2026-01": [
    {
      id: "d1",
      questionNumber: 1,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Biết rằng mệnh đề: 'Nếu trời mưa thì đường trơn' là đúng. Trong các trường hợp sau, trường hợp nào KHÔNG THỂ xảy ra?",
      options: [
        { id: "A", text: "Trời mưa và đường không trơn" },
        { id: "B", text: "Trời không mưa và đường trơn" },
        { id: "C", text: "Trời không mưa và đường không trơn" },
        { id: "D", text: "Trời mưa và đường trơn" },
      ],
      correctAnswer: "A",
      explanation: "Mệnh đề kéo theo P => Q chỉ sai khi P đúng (Trời mưa) mà Q sai (Đường không trơn). Vì mệnh đề đã cho là đúng nên trường hợp này không thể xảy ra.",
      points: 10,
    },
    {
      id: "d2",
      questionNumber: 2,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Một lớp học có 40 học sinh. Trong đó có 25 bạn thích bóng đá, 20 bạn thích cầu lông và 5 bạn không thích cả hai môn này. Hỏi có bao nhiêu bạn thích cả hai môn thể thao?",
      options: [
        { id: "A", text: "10" },
        { id: "B", text: "15" },
        { id: "C", text: "5" },
        { id: "D", text: "12" },
      ],
      correctAnswer: "A",
      explanation: "Số học sinh thích ít nhất 1 môn là: 40 - 5 = 35 bạn. Theo công thức hợp của hai tập hợp: |A ∪ B| = |A| + |B| - |A ∩ B| => 35 = 25 + 20 - |A ∩ B| => |A ∩ B| = 45 - 35 = 10.",
      points: 10,
    },
    {
      id: "d3",
      questionNumber: 3,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Dãy số: 2, 6, 12, 20, 30, ... Số hạng tiếp theo của dãy là:",
      options: [
        { id: "A", text: "42" },
        { id: "B", text: "40" },
        { id: "C", text: "44" },
        { id: "D", text: "46" },
      ],
      correctAnswer: "A",
      explanation: "Quy luật: 2 = 1*2, 6 = 2*3, 12 = 3*4, 20 = 4*5, 30 = 5*6. Số tiếp theo là 6*7 = 42 (hoặc khoảng cách tăng dần: +4, +6, +8, +10, +12).",
      points: 10,
    },
  ],
  "english-thpt-2026": [
    {
      id: "e1",
      questionNumber: 1,
      type: "single_choice",
      instruction: "Choose the correct option",
      content: "If she _______ more carefully yesterday, she wouldn't have caused the accident.",
      options: [
        { id: "A", text: "had driven" },
        { id: "B", text: "drove" },
        { id: "C", text: "has driven" },
        { id: "D", text: "drives" },
      ],
      correctAnswer: "A",
      explanation: "Câu điều kiện loại 3 diễn tả giả định trái ngược với quá khứ: If + S + had + V3/ed, S + would/could + have + V3/ed.",
      points: 0.25,
    },
    {
      id: "e2",
      questionNumber: 2,
      type: "single_choice",
      instruction: "Choose the correct option",
      content: "The government has introduced several measures to reduce _______ emission into the atmosphere.",
      options: [
        { id: "A", text: "carbon" },
        { id: "B", text: "oxygen" },
        { id: "C", text: "plastic" },
        { id: "D", text: "solar" },
      ],
      correctAnswer: "A",
      explanation: "Cụm danh từ 'carbon emission' (khí thải carbon) là thuật ngữ môi trường phổ biến.",
      points: 0.25,
    },
  ],
  "ngu-van-12-nlxh-01": [
    {
      id: "v1",
      questionNumber: 1,
      type: "short_answer",
      section: "Tự luận",
      instruction: "Phần I: Đọc hiểu - Trả lời ngắn",
      content: "Đọc đoạn trích sau và trả lời câu hỏi:\n\"Con người sinh ra không phải để tan biến như một hạt cát vô danh. Họ sinh ra để in dấu chân trên mặt đất, in dấu ấn vào trái tim người khác. Cuộc sống chỉ thật sự có ý nghĩa khi ta dám đương đầu với những cơn gió ngược và kiên định đi trên con đường mình đã chọn.\"\n\nCâu 1: Xác định phương thức biểu đạt chính được sử dụng trong đoạn trích trên.",
      options: [],
      correctAnswer: "Nghị luận",
      explanation: "Phương thức biểu đạt chính là Nghị luận (bày tỏ quan điểm, tư tưởng, dẫn dắt nhận thức về ý nghĩa cuộc đời).",
      sampleEssayAnswer: "Phương thức biểu đạt chính của đoạn trích là: Nghị luận.",
      rubricCriteria: ["Nêu đúng phương thức biểu đạt chính: Nghị luận (0.75 điểm)"],
      points: 0.75,
    },
    {
      id: "v2",
      questionNumber: 2,
      type: "short_answer",
      section: "Tự luận",
      instruction: "Phần I: Đọc hiểu - Trả lời câu hỏi",
      content: "Theo tác giả trong đoạn trích, con người sinh ra trên cõi đời này để làm gì?",
      options: [],
      correctAnswer: "Để in dấu chân trên mặt đất, in dấu ấn vào trái tim người khác",
      explanation: "Căn cứ vào câu văn: 'Họ sinh ra để in dấu chân trên mặt đất, in dấu ấn vào trái tim người khác.'",
      sampleEssayAnswer: "Theo tác giả, con người sinh ra để: 'in dấu chân trên mặt đất, in dấu ấn vào trái tim người khác', tức là tạo dựng giá trị sống đích thực và lan tỏa tình yêu thương, sự cống hiến cho cộng đồng.",
      rubricCriteria: [
        "Trích xuất chính xác ý trong ngữ liệu (0.5 điểm)",
        "Diễn đạt mạch lạc, chuẩn ngữ pháp (0.25 điểm)",
      ],
      points: 0.75,
    },
    {
      id: "v3",
      questionNumber: 3,
      type: "essay",
      section: "Tự luận",
      instruction: "Phần I: Đọc hiểu - Rút ra bài học",
      content: "Anh/chị hiểu như thế nào về hình ảnh 'những cơn gió ngược' trong câu văn: 'Cuộc sống chỉ thật sự có ý nghĩa khi ta dám đương đầu với những cơn gió ngược...'?",
      options: [],
      correctAnswer: "Gió ngược ẩn dụ cho những nghịch cảnh, khó khăn, thử thách",
      explanation: "Hình ảnh ẩn dụ 'cơn gió ngược' tượng trưng cho những khó khăn, trở ngại, thất bại hoặc định kiến mà mỗi cá nhân phải đối mặt trên hành trình trưởng thành.",
      sampleEssayAnswer: "Gợi ý trả lời:\n- 'Những cơn gió ngược' là hình ảnh ẩn dụ biểu tượng cho những chông gai, khó khăn, nghịch cảnh và những thử thách khắc nghiệt trong cuộc sống.\n- Câu nói khẳng định: Giá trị và bản lĩnh của con người chỉ được tôi luyện khi dám dũng cảm đối diện, vượt lên trên thử thách chứ không trốn tránh hay đầu hàng số phận.",
      rubricCriteria: [
        "Giải thích đúng ý nghĩa ẩn dụ của 'cơn gió ngược' (0.5 điểm)",
        "Nêu được bài học nhân sinh sâu sắc về ý chí vươn lên (0.5 điểm)",
      ],
      points: 1.0,
    },
    {
      id: "v4",
      questionNumber: 4,
      type: "essay",
      section: "Tự luận",
      instruction: "Phần II: Làm văn - Đoạn văn Nghị luận xã hội (khoảng 200 chữ)",
      content: "Từ nội dung đoạn trích ở phần Đọc hiểu, anh/chị hãy viết một đoạn văn (khoảng 200 chữ) trình bày suy nghĩ về ý nghĩa của sự kiên định trong việc theo đuổi ước mơ của tuổi trẻ hiện nay.",
      options: [],
      correctAnswer: "Bài viết nghị luận xã hội 200 chữ đạt chuẩn cấu trúc mở - thân - kết.",
      explanation: "Đoạn văn cần đảm bảo cấu trúc: Nêu vấn đề -> Giải thích -> Bàn luận ý nghĩa -> Phản đề/Mở rộng -> Bài học hành động bản thân.",
      sampleEssayAnswer: "Đoạn văn mẫu tham khảo (khoảng 200 chữ):\nKiên định theo đuổi ước mơ chính là ngọn hải đăng soi sáng con đường trưởng thành của mỗi người trẻ. Sự kiên định là bản lĩnh giữ vững niềm tin, không lung lay trước thất bại hay những lời bàn tán tiêu cực để kiên trì đi đến cùng mục tiêu đã chọn. Trong thời đại số biến đổi không ngừng, người trẻ có muôn vàn cơ hội nhưng cũng đối diện với không ít áp lực đồng trang lứa. Nếu thiếu đi sự kiên định, chúng ta rất dễ nản lòng và bỏ cuộc trước những 'cơn gió ngược' của cuộc đời. Kiên định không đồng nghĩa với bảo thủ, mà là sự kiên trì có trí tuệ, biết học hỏi từ vấp ngã để hoàn thiện bản thân. Hãy nhớ rằng, hạt giống chỉ có thể nảy mầm khi bền bỉ vươn qua lớp đất dày bóng tối để đón ánh mặt trời. Là một học sinh trước ngưỡng cửa tương lai, tôi tự nhắc nhở mình phải luôn kiên tâm học tập và nuôi dưỡng đam mê mỗi ngày.",
      rubricCriteria: [
        "Đảm bảo yêu cầu về hình thức đoạn văn khoảng 200 chữ, không tách đoạn bừa bãi (0.25 điểm)",
        "Xác định đúng vấn đề nghị luận: Ý nghĩa của sự kiên định với tuổi trẻ (0.25 điểm)",
        "Bàn luận sâu sắc: Nêu được vai trò, dẫn chứng thực tế, phản đề và bài học liên hệ (1.25 điểm)",
        "Sáng tạo, diễn đạt giàu cảm xúc, chuẩn chính tả (0.25 điểm)",
      ],
      wordLimit: { min: 150, max: 250 },
      points: 2.0,
    },
    {
      id: "v5",
      questionNumber: 5,
      type: "essay",
      section: "Tự luận",
      instruction: "Phần II: Làm văn - Bài văn Nghị luận văn học (Soạn thảo trực tiếp)",
      content: "Anh/chị hãy viết bài văn nghị luận phân tích tư tưởng nhân đạo sâu sắc và thông điệp về khát vọng sống mãnh liệt của con người được thể hiện qua tác phẩm văn học lớp 12 mà anh/chị tâm đắc nhất. (Thí sinh soạn thảo bài làm trực tiếp vào khung bài làm của hệ thống).",
      options: [],
      correctAnswer: "Bài văn hoàn chỉnh có mở bài, thân bài, kết bài và phân tích sâu sắc tác phẩm văn học.",
      explanation: "Đánh giá khả năng cảm thụ tác phẩm, tư duy lập luận văn học và năng lực diễn đạt ngôn ngữ học sinh.",
      sampleEssayAnswer: "Dàn ý gợi ý bài làm:\nI. Mở bài:\n- Dẫn dắt vấn đề tư tưởng nhân đạo và khát vọng sống trong văn học.\n- Giới thiệu tác giả, tác phẩm tiêu biểu (ví dụ: 'Vợ nhặt' - Kim Lân hoặc 'Hồn Trương Ba, da hàng thịt' - Lưu Quang Vũ).\nII. Thân bài:\n1. Giải thích tư tưởng nhân đạo và khát vọng sống: Sự đồng cảm với nỗi khổ đau, phát hiện và ngợi ca vẻ đẹp tâm hồn con người trong hoàn cảnh khốn cùng.\n2. Phân tích qua tác phẩm:\n- Hoàn cảnh ngặt nghèo đẩy con người đến bờ vực cái chết/sự tha hóa.\n- Khát vọng sống, khát vọng hạnh phúc bùng cháy xua tan bóng tối u ám.\n- Nghệ thuật xây dựng tình huống, miêu tả tâm lý nhân vật tinh tế.\n3. Đánh giá, nâng cao: Giá trị nhân văn vĩnh cửu của tác phẩm đối với thế hệ người đọc hôm nay.\nIII. Kết bài:\n- Khẳng định lại sức sống của tác phẩm và bài học nhân sinh sâu sắc.",
      rubricCriteria: [
        "Đầy đủ bố cục 3 phần: Mở bài, Thân bài, Kết bài (0.5 điểm)",
        "Xác định đúng trọng tâm vấn đề nghị luận văn học (0.5 điểm)",
        "Triển khai luận điểm logic, kết hợp dẫn chứng xác đáng, phân tích nghệ thuật (3.5 điểm)",
        "Chính tả, dùng từ, diễn đạt trôi chảy, sáng tạo (0.5 điểm)",
      ],
      points: 5.0,
    },
  ],
};

// Fallback dynamic generator for any exam
export function getExamQuestions(examId: string): ExamQuestion[] {
  if (MOCK_QUESTIONS_DATABASE[examId]) {
    return MOCK_QUESTIONS_DATABASE[examId];
  }

  const exam = MOCK_EXAMS.find((e) => e.id === examId);
  const count = exam?.questionCount || 10;
  const subjectName = exam?.subject || "Kiến thức tổng hợp";

  const genericBank: ExamQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    genericBank.push({
      id: `gen-${examId}-${i}`,
      questionNumber: i,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: `[${subjectName} - Câu ${i}]: Đề thi ${exam?.cardCode || "EduMi"}. Cho câu hỏi trọng tâm kiến thức kỳ thi 2026, hãy chọn phương án chính xác nhất trong các nhận định dưới đây:`,
      options: [
        { id: "A", text: `Phương án A: Khẳng định chuẩn xác theo ma trận kiến thức câu ${i}` },
        { id: "B", text: `Phương án B: Nhận định chưa chính xác hoặc thiếu dữ kiện` },
        { id: "C", text: `Phương án C: Dữ kiện ngược lại với giả thiết đề bài` },
        { id: "D", text: `Phương án D: Kết luận không phù hợp với định lý` },
      ],
      correctAnswer: "A",
      explanation: `Lời giải chi tiết câu ${i}: Vận dụng phương pháp giải cốt lõi của môn ${subjectName}. Lựa chọn phương án A là chính xác nhất.`,
      points: 0.25,
    });
  }

  return genericBank;
}

