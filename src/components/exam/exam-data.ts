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
}

export const MOCK_EXAMS: ExamItem[] = [
  {
    id: "toan-12-thpt-01",
    examCode: "EDM-8899",
    category: "THPT Quốc Gia",
    subject: "Toán học",
    cardCode: "TOÁN 12",
    title: "Đề thi thử THPT Quốc Gia môn Toán 2026 - Đề số 01 (Ma trận mới Bộ GD&ĐT)",
    description: "Bộ đề bám sát 100% định dạng mới: trắc nghiệm nhiều lựa chọn, đúng/sai và trả lời ngắn.",
    durationMinutes: 90,
    questionCount: 34,
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

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  type: "single_choice" | "true_false" | "short_answer";
  instruction: string;
  content: string;
  options: QuestionOption[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  points: number;
}

// Question bank by exam ID
export const MOCK_QUESTIONS_DATABASE: Record<string, ExamQuestion[]> = {
  "toan-12-thpt-01": [
    {
      id: "q1",
      questionNumber: 1,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
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
      instruction: "Chọn một đáp án đúng",
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
      instruction: "Chọn một đáp án đúng",
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
      instruction: "Chọn một đáp án đúng",
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
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, SA vuông góc với đáy và SA = a√3. Thể tích khối chóp S.ABCD bằng:",
      options: [
        { id: "A", text: "(a³√3) / 3" },
        { id: "B", text: "a³√3" },
        { id: "C", text: "(a³√3) / 6" },
        { id: "D", text: "(a³) / 3" },
      ],
      correctAnswer: "A",
      explanation: "Diện tích đáy S_ABCD = a². Chiều cao h = SA = a√3. Thể tích V = (1/3) * S_đáy * h = (1/3) * a² * a√3 = (a³√3)/3.",
      points: 0.25,
    },
    {
      id: "q6",
      questionNumber: 6,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Từ một hộp chứa 5 quả cầu xanh và 4 quả cầu đỏ, lấy ngẫu nhiên đồng thời 2 quả. Xác suất để lấy được 2 quả khác màu là:",
      options: [
        { id: "A", text: "5/9" },
        { id: "B", text: "4/9" },
        { id: "C", text: "20/81" },
        { id: "D", text: "1/2" },
      ],
      correctAnswer: "A",
      explanation: "Số phần tử không gian mẫu n(Ω) = C(9, 2) = 36. Số cách chọn 1 xanh và 1 đỏ: C(5, 1) * C(4, 1) = 5 * 4 = 20. Xác suất P = 20 / 36 = 5/9.",
      points: 0.25,
    },
    {
      id: "q7",
      questionNumber: 7,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Đạo hàm của hàm số y = ln(x² + 1) là:",
      options: [
        { id: "A", text: "y' = 2x / (x² + 1)" },
        { id: "B", text: "y' = 1 / (x² + 1)" },
        { id: "C", text: "y' = x / (x² + 1)" },
        { id: "D", text: "y' = 2 / (x² + 1)" },
      ],
      correctAnswer: "A",
      explanation: "Công thức đạo hàm hàm hợp [ln(u)]' = u'/u. Với u = x² + 1 thì u' = 2x. Vậy y' = 2x / (x² + 1).",
      points: 0.25,
    },
    {
      id: "q8",
      questionNumber: 8,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Số nghiệm thực của phương trình 3^(x² - 4) = 1 là:",
      options: [
        { id: "A", text: "2" },
        { id: "B", text: "1" },
        { id: "C", text: "0" },
        { id: "D", text: "4" },
      ],
      correctAnswer: "A",
      explanation: "3^(x² - 4) = 1 <=> x² - 4 = 0 <=> x = ±2. Vậy phương trình có 2 nghiệm thực phân biệt.",
      points: 0.25,
    },
    {
      id: "q9",
      questionNumber: 9,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Tìm giá trị lớn nhất M của hàm số f(x) = x³ - 3x + 2 trên đoạn [0; 2].",
      options: [
        { id: "A", text: "M = 4" },
        { id: "B", text: "M = 2" },
        { id: "C", text: "M = 0" },
        { id: "D", text: "M = 6" },
      ],
      correctAnswer: "A",
      explanation: "f'(x) = 3x² - 3 = 0 <=> x = 1 (vì thuộc [0; 2]). Tính các giá trị: f(0) = 2, f(1) = 0, f(2) = 4. Vậy M = max = 4 tại x = 2.",
      points: 0.25,
    },
    {
      id: "q10",
      questionNumber: 10,
      type: "single_choice",
      instruction: "Chọn một đáp án đúng",
      content: "Cho số phức z = 3 - 4i. Môđun của số phức z bằng:",
      options: [
        { id: "A", text: "5" },
        { id: "B", text: "25" },
        { id: "C", text: "7" },
        { id: "D", text: "√7" },
      ],
      correctAnswer: "A",
      explanation: "Môđun của số phức z = a + bi là |z| = √(a² + b²) = √(3² + (-4)²) = √(9 + 16) = √25 = 5.",
      points: 0.25,
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
};

// Fallback dynamic generator for any exam
export function getExamQuestions(examId: string): ExamQuestion[] {
  if (MOCK_QUESTIONS_DATABASE[examId]) {
    return MOCK_QUESTIONS_DATABASE[examId];
  }

  const exam = MOCK_EXAMS.find((e) => e.id === examId);
  const count = Math.min(exam?.questionCount || 10, 10);
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

