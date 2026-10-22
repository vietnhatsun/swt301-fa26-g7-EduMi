-- ==============================================================================
-- EduMi - Database Migration: 0011_create_exams_and_questions.sql
-- Mô tả: Tạo bảng lưu trữ bài thi (exams) và câu hỏi trắc nghiệm (exam_questions).
-- Phân loại:
--   - scope = 'public': Bài thi công khai do Staff EduMi tạo, hiển thị ở Sảnh phòng thi (/exam).
--   - scope = 'class': Bài thi nội bộ lớp học do Giáo viên tạo trong lớp cụ thể.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_code VARCHAR(50) NOT NULL UNIQUE,
  card_code VARCHAR(80) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  difficulty VARCHAR(100) NOT NULL DEFAULT 'Vận dụng (7-8.5đ)',
  duration_minutes INT NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  question_count INT NOT NULL DEFAULT 0 CHECK (question_count >= 0),
  attempts INT NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  bg_class VARCHAR(100) NOT NULL DEFAULT 'bg-[#0284c7]',
  accent_class VARCHAR(100) NOT NULL DEFAULT 'text-[#0284c7]',
  pattern VARCHAR(50) NOT NULL DEFAULT 'waves',
  is_hot BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  author VARCHAR(255) NOT NULL DEFAULT 'Hội đồng Khảo thí EduMi',
  scope VARCHAR(30) NOT NULL DEFAULT 'public' CHECK (scope IN ('public', 'class')),
  class_id UUID REFERENCES teaching_classes(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'single_choice',
  part VARCHAR(50) DEFAULT 'Phần I',
  section VARCHAR(50) DEFAULT 'Trắc nghiệm',
  instruction TEXT NOT NULL DEFAULT 'Chọn một đáp án đúng',
  content TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  true_false_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT DEFAULT 'A',
  explanation TEXT,
  sample_essay_answer TEXT,
  rubric_criteria JSONB DEFAULT '[]'::jsonb,
  word_limit JSONB DEFAULT '{}'::jsonb,
  points NUMERIC(4,2) NOT NULL DEFAULT 0.25,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bổ sung cột nếu bảng exam_questions đã tồn tại từ trước
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS part VARCHAR(50) DEFAULT 'Phần I';
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS section VARCHAR(50) DEFAULT 'Trắc nghiệm';
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS true_false_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS sample_essay_answer TEXT;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS rubric_criteria JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS word_limit JSONB DEFAULT '{}'::jsonb;
ALTER TABLE exam_questions ALTER COLUMN correct_answer TYPE TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exams_scope ON exams(scope);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category);
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject);
CREATE INDEX IF NOT EXISTS idx_exams_class_id ON exams(class_id);
CREATE INDEX IF NOT EXISTS idx_exams_created_by ON exams(created_by);
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON exams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);

-- RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

-- Policy 1: Công khai ai cũng xem được bài thi đã xuất bản ở sảnh chung
DROP POLICY IF EXISTS "Public exams are viewable by all" ON exams;
CREATE POLICY "Public exams are viewable by all"
ON exams
FOR SELECT
TO authenticated, anon
USING (status = 'published' AND scope = 'public');

-- Policy 2: Học sinh và giáo viên trong lớp xem được bài thi lớp học
DROP POLICY IF EXISTS "Class exams are viewable by authenticated" ON exams;
CREATE POLICY "Class exams are viewable by authenticated"
ON exams
FOR SELECT
TO authenticated
USING (scope = 'class');

-- Policy 3: Staff/Admin quản lý toàn bộ bài thi
DROP POLICY IF EXISTS "Staff can manage all exams" ON exams;
CREATE POLICY "Staff can manage all exams"
ON exams
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.role = 'staff' OR users.role = 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.role = 'staff' OR users.role = 'admin')
  )
);

-- Policy 4: Câu hỏi của đề thi công khai ai cũng đọc được
DROP POLICY IF EXISTS "Questions of public exams are readable" ON exam_questions;
CREATE POLICY "Questions of public exams are readable"
ON exam_questions
FOR SELECT
TO authenticated, anon
USING (
  EXISTS (
    SELECT 1 FROM exams
    WHERE exams.id = exam_questions.exam_id
    AND exams.status = 'published'
  )
);

-- Policy 5: Staff quản lý câu hỏi
DROP POLICY IF EXISTS "Staff can manage all questions" ON exam_questions;
CREATE POLICY "Staff can manage all questions"
ON exam_questions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.role = 'staff' OR users.role = 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.role = 'staff' OR users.role = 'admin')
  )
);

-- ==============================================================================
-- Dữ liệu mẫu ban đầu (Seed initial exams)
-- ==============================================================================
INSERT INTO exams (
  exam_code, card_code, title, description, category, subject, difficulty,
  duration_minutes, question_count, attempts, rating, bg_class, accent_class,
  pattern, is_hot, is_new, author, scope, status
) VALUES
(
  'EDM-8899', 'TOÁN 12',
  'Đề thi thử THPT Quốc Gia môn Toán 2026 - Đề số 01 (Ma trận mới Bộ GD&ĐT)',
  'Bộ đề bám sát 100% định dạng mới: trắc nghiệm nhiều lựa chọn, đúng/sai và trả lời ngắn.',
  'THPT Quốc Gia', 'Toán học', 'Vận dụng (7-8.5đ)',
  90, 34, 45240, 4.9, 'bg-[#e07328]', 'text-[#e07328]', 'waves', TRUE, FALSE,
  'Thầy Trần Minh (Tổ Toán THPT)', 'public', 'published'
),
(
  'EDM-2026', 'ĐGNL HCM',
  'Đề chuẩn Đánh giá năng lực ĐHQG TP.HCM 2026 (Phần Tư duy Logic & Số liệu)',
  'Rèn luyện kỹ năng phân tích bảng số liệu, suy luận toán học và logic thực tế chuẩn 1200 điểm.',
  'ĐGNL ĐHQG', 'Toán học', 'Vận dụng cao (9-10đ)',
  60, 40, 38920, 5.0, 'bg-[#0284c7]', 'text-[#0284c7]', 'ripples', TRUE, TRUE,
  'Hội đồng Khảo thí EduMi', 'public', 'published'
),
(
  'EDM-7749', 'VẬT LÝ 12',
  'Đề thi thử Vật lý 12 THPT Quốc Gia: Trọn bộ Dao động cơ & Sóng ánh sáng',
  'Hệ thống câu hỏi nhận biết, bài toán đồ thị dao động phức hợp và hiện tượng quang điện.',
  'THPT Quốc Gia', 'Vật lý', 'Vận dụng (7-8.5đ)',
  50, 40, 41360, 4.8, 'bg-[#bf5447]', 'text-[#bf5447]', 'confetti', FALSE, FALSE,
  'Thầy Trần Minh - Thạc sĩ Vật lý', 'public', 'published'
),
(
  'EDM-9911', 'TIẾNG ANH',
  'Đề thi thử Tốt nghiệp THPT Tiếng Anh 2026 - Reading & Cloze Test nâng cao',
  'Tập trung bẫy từ vựng Collocations, thì động từ và các đoạn văn đọc hiểu chủ đề Khoa học - Xã hội.',
  'THPT Quốc Gia', 'Tiếng Anh', 'Vận dụng (7-8.5đ)',
  50, 40, 43210, 4.9, 'bg-[#be4c73]', 'text-[#be4c73]', 'clouds', TRUE, FALSE,
  'Cô Emily Nguyễn - 8.5 IELTS', 'public', 'published'
),
(
  'EDM-5522', 'HÓA HỌC',
  'Đề khảo sát chất lượng Hóa học 12: Este - Lipit, Amin và Kim loại kiềm',
  'Phân loại câu hỏi lý thuyết đếm chất, sơ đồ chuỗi phản ứng và bài toán thủy phân hỗn hợp.',
  'THPT Quốc Gia', 'Hóa học', 'Vận dụng cao (9-10đ)',
  50, 40, 36450, 4.8, 'bg-[#0d9488]', 'text-[#0d9488]', 'ripples', FALSE, FALSE,
  'Thầy Đỗ Khải - Chuyên Hóa EduMi', 'public', 'published'
),
(
  'EDM-3344', 'NGỮ VĂN',
  'Đề thi thử Ngữ văn 12: Đọc hiểu văn bản Nghị luận & Làm văn Phân tích tác phẩm',
  'Rèn luyện kỹ năng đọc hiểu ngữ liệu ngoài sách giáo khoa, viết đoạn văn NLXH 200 chữ.',
  'THPT Quốc Gia', 'Ngữ văn', 'Vận dụng (7-8.5đ)',
  120, 5, 29840, 4.7, 'bg-[#7356bc]', 'text-[#7356bc]', 'stripes', FALSE, FALSE,
  'Cô Mai Phương - Giảng viên Sư phạm', 'public', 'published'
),
(
  'EDM-6677', 'SINH HỌC',
  'Đề ôn luyện Sinh học 12: Quy luật Di truyền Men-đen & Phả hệ di truyền người',
  'Chinh phục dạng toán phả hệ khó, bài toán xác suất di truyền liên kết và hoán vị gen.',
  'THPT Quốc Gia', 'Sinh học', 'Vận dụng cao (9-10đ)',
  50, 40, 27150, 4.8, 'bg-[#16a34a]', 'text-[#16a34a]', 'chevrons', FALSE, FALSE,
  'Thầy Lê Văn Hoàng - Thạc sĩ Sinh học', 'public', 'published'
),
(
  'EDM-1122', 'ĐGTD BÁCH KHOA',
  'Đề thi thử Đánh giá tư duy Bách Khoa: Tư duy Toán học & Khoa học thực nghiệm',
  'Mô phỏng 100% đề thi ĐGTD ĐH Bách Khoa Hà Nội với định dạng câu hỏi kéo thả, điền số tự động.',
  'ĐGTD Bách Khoa', 'Toán học', 'Vận dụng cao (9-10đ)',
  60, 40, 34120, 4.9, 'bg-[#2563eb]', 'text-[#2563eb]', 'waves', FALSE, TRUE,
  'Tổ Tư duy KHTN EduMi', 'public', 'published'
),
(
  'EDM-4455', 'LỊCH SỬ 12',
  'Đề thi thử THPT Lịch sử Việt Nam 1945 - 1975: Các chiến dịch quyết định',
  'Tập trung các sự kiện mốc thời gian, ý nghĩa lịch sử và bài học kinh nghiệm trong kháng chiến.',
  'THPT Quốc Gia', 'Lịch sử', 'Cơ bản (5-7đ)',
  50, 40, 21890, 4.7, 'bg-[#b45309]', 'text-[#b45309]', 'clouds', FALSE, FALSE,
  'Cô Thu Hằng - Chuyên gia Sử học', 'public', 'published'
),
(
  'EDM-7788', 'ĐỊA LÝ 12',
  'Đề luyện kỹ năng Atlat Địa lý Việt Nam & Nhận diện biểu đồ tốc độ tăng trưởng',
  'Thực hành tra cứu Atlat nhanh trong 30 giây/câu, nhận dạng đúng biểu đồ tròn, miền, cột, đường.',
  'THPT Quốc Gia', 'Địa lý', 'Cơ bản (5-7đ)',
  50, 40, 25410, 4.8, 'bg-[#059669]', 'text-[#059669]', 'ripples', FALSE, FALSE,
  'Thầy Quốc Tuấn - Giáo viên Địa lý', 'public', 'published'
),
(
  'EDM-1133', 'TOÁN 11',
  'Đề kiểm tra Giữa học kỳ II Toán 11: Dãy số, Cấp số cộng, Giới hạn hàm số',
  'Đề kiểm tra chuẩn kiến thức trọng tâm chương trình mới, phân loại học sinh khá giỏi rõ nét.',
  'Kiểm tra Học kỳ', 'Toán học', 'Vận dụng (7-8.5đ)',
  45, 28, 18760, 4.9, 'bg-[#7c3aed]', 'text-[#7c3aed]', 'stripes', FALSE, FALSE,
  'Thầy Nguyễn Hữu Trí', 'public', 'published'
),
(
  'EDM-9988', 'ĐGNL HÀ NỘI',
  'Đề thi thử HSA ĐHQG Hà Nội 2026: Phần Tư duy định lượng Toán & Số liệu',
  '50 câu hỏi trắc nghiệm khách quan và điền đáp án số bám sát 100% đề thi chính thức HSA.',
  'ĐGNL ĐHQG', 'Toán học', 'Vận dụng cao (9-10đ)',
  75, 50, 31200, 4.9, 'bg-[#db2777]', 'text-[#db2777]', 'confetti', TRUE, FALSE,
  'Hội đồng Khảo thí EduMi', 'public', 'published'
)
ON CONFLICT (exam_code) DO NOTHING;

-- ==============================================================================
-- Dữ liệu câu hỏi mẫu cho Đề thi EDM-8899 (Toán 12 - Chuẩn cấu trúc 2025/2026)
-- Gồm đầy đủ 4 phần:
--   Phần I: 4 câu Trắc nghiệm nhiều lựa chọn (A, B, C, D)
--   Phần II: 2 câu Trắc nghiệm Đúng / Sai (Mỗi câu 4 mệnh đề a, b, c, d)
--   Phần III: 2 câu Trắc nghiệm trả lời ngắn (Điền số thập phân 20.5 & số nguyên)
--   Phần IV: 1 câu Tự luận giải toán chi tiết Oxyz (Có đáp án tham khảo & rubric)
-- ==============================================================================
DO $$
DECLARE
  v_exam_id UUID;
BEGIN
  SELECT id INTO v_exam_id FROM exams WHERE exam_code = 'EDM-8899' LIMIT 1;
  IF v_exam_id IS NOT NULL THEN
    -- Xóa câu hỏi cũ nếu đã tồn tại để tránh trùng lặp
    DELETE FROM exam_questions WHERE exam_id = v_exam_id;

    -- 1. Câu 1 (Phần I - ABCD)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, options, correct_answer, points, explanation)
    VALUES (
      v_exam_id, 1, 'single_choice', 'Phần I', 'Trắc nghiệm',
      'Phần I: Chọn một đáp án đúng (A, B, C hoặc D)',
      'Cho hàm số y = f(x) có bảng biến thiên với f''(x) đổi dấu từ dương sang âm khi qua x = 2. Điểm cực đại của hàm số đã cho là:',
      '[{"id": "A", "text": "x = 2"}, {"id": "B", "text": "x = -2"}, {"id": "C", "text": "y = 2"}, {"id": "D", "text": "x = 0"}]'::jsonb,
      'A', 0.25,
      'Theo định nghĩa, nếu f''(x) đổi dấu từ dương (+) sang âm (-) khi qua điểm x0 thì hàm số đạt cực đại tại điểm x0. Ở đây x0 = 2.'
    );

    -- 2. Câu 2 (Phần I - ABCD)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, options, correct_answer, points, explanation)
    VALUES (
      v_exam_id, 2, 'single_choice', 'Phần I', 'Trắc nghiệm',
      'Phần I: Chọn một đáp án đúng (A, B, C hoặc D)',
      'Tập nghiệm của bất phương trình log₂(x - 1) < 3 là:',
      '[{"id": "A", "text": "(1; 9)"}, {"id": "B", "text": "(-∞; 9)"}, {"id": "C", "text": "(1; 8)"}, {"id": "D", "text": "(1; +∞)"}]'::jsonb,
      'A', 0.25,
      'Điều kiện xác định: x - 1 > 0 <=> x > 1. Bất phương trình: log₂(x - 1) < 3 <=> x - 1 < 2³ = 8 <=> x < 9. Kết hợp điều kiện ta được tập nghiệm S = (1; 9).'
    );

    -- 3. Câu 3 (Phần I - ABCD)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, options, correct_answer, points, explanation)
    VALUES (
      v_exam_id, 3, 'single_choice', 'Phần I', 'Trắc nghiệm',
      'Phần I: Chọn một đáp án đúng (A, B, C hoặc D)',
      'Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 3z - 5 = 0. Một vectơ pháp tuyến của (P) có tọa độ là:',
      '[{"id": "A", "text": "n = (2; -1; 3)"}, {"id": "B", "text": "n = (2; 1; 3)"}, {"id": "C", "text": "n = (2; -1; -5)"}, {"id": "D", "text": "n = (-2; -1; 3)"}]'::jsonb,
      'A', 0.25,
      'Mặt phẳng Ax + By + Cz + D = 0 có một vectơ pháp tuyến là n = (A; B; C). Do đó n = (2; -1; 3).'
    );

    -- 4. Câu 4 (Phần I - ABCD)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, options, correct_answer, points, explanation)
    VALUES (
      v_exam_id, 4, 'single_choice', 'Phần I', 'Trắc nghiệm',
      'Phần I: Chọn một đáp án đúng (A, B, C hoặc D)',
      'Tính tích phân I = ∫ từ 0 đến 1 của e^(2x) dx.',
      '[{"id": "A", "text": "I = (e² - 1) / 2"}, {"id": "B", "text": "I = e² - 1"}, {"id": "C", "text": "I = (e² + 1) / 2"}, {"id": "D", "text": "I = 2(e² - 1)"}]'::jsonb,
      'A', 0.25,
      'Ta có nguyên hàm ∫ e^(2x) dx = (1/2) e^(2x). Thay cận từ 0 đến 1: (1/2) * (e² - e⁰) = (e² - 1)/2.'
    );

    -- 5. Câu 5 (Phần II - Đúng / Sai)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, true_false_items, points, explanation)
    VALUES (
      v_exam_id, 5, 'true_false', 'Phần II', 'Trắc nghiệm Đúng/Sai',
      'Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai',
      'Cho hàm số f(x) = x³ - 3x² + 2 có đồ thị là (C). Xét tính đúng sai của các khẳng định sau:',
      '[
        {"id": "a", "content": "Hàm số đã cho có đạo hàm f''(x) = 3x² - 6x.", "isCorrect": true, "explanation": "Đạo hàm: (x³ - 3x² + 2)'' = 3x² - 6x. Khẳng định ĐÚNG."},
        {"id": "b", "content": "Hàm số đồng biến trên khoảng (0; 2).", "isCorrect": false, "explanation": "Ta có f''(x) = 3x(x - 2) < 0 với mọi x thuộc (0; 2), do đó hàm số nghịch biến trên khoảng (0; 2). Khẳng định SAI."},
        {"id": "c", "content": "Giá trị cực tiểu của hàm số bằng -2.", "isCorrect": true, "explanation": "f''(x) đổi dấu từ âm sang dương tại x = 2 nên x = 2 là điểm cực tiểu, f(2) = 2³ - 3(2²) + 2 = -2. Khẳng định ĐÚNG."},
        {"id": "d", "content": "Đồ thị (C) cắt trục hoành tại đúng 3 điểm phân biệt.", "isCorrect": true, "explanation": "Ta có f(0) = 2 (cực đại) và f(2) = -2 (cực tiểu). Vì y_CĐ * y_CT = 2 * (-2) = -4 < 0 nên đồ thị cắt Ox tại đúng 3 điểm phân biệt. Khẳng định ĐÚNG."}
      ]'::jsonb,
      1.0,
      'Phân tích bảng biến thiên hàm bậc ba: Đồng biến trên (-∞; 0) và (2; +∞), nghịch biến trên (0; 2). Cực đại tại (0; 2), cực tiểu tại (2; -2).'
    );

    -- 6. Câu 6 (Phần II - Đúng / Sai)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, true_false_items, points, explanation)
    VALUES (
      v_exam_id, 6, 'true_false', 'Phần II', 'Trắc nghiệm Đúng/Sai',
      'Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai',
      'Trong không gian Oxyz, cho mặt cầu (S): (x - 1)² + (y - 2)² + (z + 1)² = 9 và mặt phẳng (P): 2x - 2y + z + 8 = 0. Xét tính đúng sai của các khẳng định sau:',
      '[
        {"id": "a", "content": "Mặt cầu (S) có tọa độ tâm I(1; 2; -1) và bán kính R = 3.", "isCorrect": true, "explanation": "Phương trình chính tắc (x - a)² + (y - b)² + (z - c)² = R² => tâm I(1; 2; -1), R = √9 = 3. Khẳng định ĐÚNG."},
        {"id": "b", "content": "Khoảng cách từ tâm I của mặt cầu đến mặt phẳng (P) bằng 1.", "isCorrect": false, "explanation": "d(I, (P)) = |2(1) - 2(2) + 1(-1) + 8| / √(2² + (-2)² + 1²) = |5| / 3 = 5/3 ≠ 1. Khẳng định SAI."},
        {"id": "c", "content": "Mặt phẳng (P) tiếp xúc với mặt cầu (S).", "isCorrect": false, "explanation": "Vì d(I, (P)) = 5/3 < R = 3 nên mặt phẳng (P) cắt mặt cầu (S) theo giao tuyến là một đường tròn, không tiếp xúc. Khẳng định SAI."},
        {"id": "d", "content": "Đường thẳng Δ đi qua tâm I và vuông góc với (P) có vectơ chỉ phương u = (2; -2; 1).", "isCorrect": true, "explanation": "Δ vuông góc với (P) nên vectơ chỉ phương của Δ cùng phương với vectơ pháp tuyến n_(P) = (2; -2; 1). Khẳng định ĐÚNG."}
      ]'::jsonb,
      1.0,
      'Vận dụng kiến thức hình học không gian Oxyz: Khoảng cách từ điểm đến mặt phẳng, vị trí tương đối giữa mặt cầu và mặt phẳng.'
    );

    -- 7. Câu 7 (Phần III - Điền số thập phân 20.5)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, correct_answer, points, explanation)
    VALUES (
      v_exam_id, 7, 'short_answer', 'Phần III', 'Trả lời ngắn',
      'Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)',
      'Một doanh nghiệp dự tính hàm số lợi nhuận khi bán x tấn sản phẩm là P(x) = -0.1x² + 4.1x - 15 (triệu đồng). Tìm sản lượng x (tấn) để doanh nghiệp đạt mức lợi nhuận lớn nhất. (Học sinh điền kết quả dạng số thập phân, ví dụ: 20.5)',
      '20.5', 0.5,
      'Hàm bậc hai P(x) = -0.1x² + 4.1x - 15 có hệ số a = -0.1 < 0 nên đạt giá trị lớn nhất tại đỉnh parabol: x = -b / (2a) = -4.1 / (2 * -0.1) = 4.1 / 0.2 = 20.5. Khi đó lợi nhuận cực đại đạt 27.025 triệu đồng.'
    );

    -- 8. Câu 8 (Phần III - Điền số nguyên 12)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, correct_answer, points, explanation)
    VALUES (
      v_exam_id, 8, 'short_answer', 'Phần III', 'Trả lời ngắn',
      'Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số nguyên)',
      'Cho khối chóp tam giác S.ABC có đáy ABC là tam giác vuông tại B, AB = 3, BC = 4. Cạnh bên SA vuông góc với mặt phẳng đáy (ABC) và SA = 6. Tính thể tích V của khối chóp S.ABC.',
      '12', 0.5,
      'Diện tích tam giác vuông ABC: S_đáy = (1/2) * AB * BC = (1/2) * 3 * 4 = 6. Chiều cao khối chóp h = SA = 6. Thể tích V = (1/3) * S_đáy * h = (1/3) * 6 * 6 = 12.'
    );

    -- 9. Câu 9 (Phần IV - Tự luận)
    INSERT INTO exam_questions (exam_id, question_number, type, part, section, instruction, content, correct_answer, sample_essay_answer, rubric_criteria, points, explanation)
    VALUES (
      v_exam_id, 9, 'essay', 'Phần IV', 'Tự luận',
      'Phần IV: Tự luận - Trình bày các bước giải chi tiết',
      'Trong không gian Oxyz, cho điểm M(1; 2; -1) và mặt phẳng (P): x + 2y - 2z + 1 = 0.
a) Viết phương trình chính tắc của đường thẳng d đi qua điểm M và vuông góc với mặt phẳng (P).
b) Tìm tọa độ hình chiếu vuông góc H của điểm M lên mặt phẳng (P). Trình bày rõ các bước giải chi tiết vào khung làm bài.',
      'H(1/9; 2/9; 7/9)',
      'Lời giải tham khảo:
- Bước 1: Mặt phẳng (P) có vectơ pháp tuyến n = (1; 2; -2).
- Bước 2: Vì đường thẳng d ⊥ (P) nên d nhận n làm vectơ chỉ phương.
Phương trình tham số của d: x = 1 + t, y = 2 + 2t, z = -1 - 2t (t ∈ R).
- Bước 3: Điểm H là giao điểm của d và (P). Thay phương trình d vào (P):
(1 + t) + 2(2 + 2t) - 2(-1 - 2t) + 1 = 0 <=> 9t + 8 = 0 <=> t = -8/9.
- Kết luận: Tọa độ hình chiếu H là H(1/9; 2/9; 7/9).',
      '["Xác định đúng VTCP của đường thẳng d và viết đúng PT đường thẳng (0.5 điểm)", "Thiết lập tọa độ điểm tham số H và lập phương trình tìm t (0.5 điểm)", "Giải đúng giá trị tham số t và kết luận chính xác tọa độ điểm H (0.5 điểm)"]'::jsonb,
      1.5,
      'Hướng dẫn giải chi tiết:
1. Đường thẳng d qua M(1; 2; -1) nhận VTPT n_(P) = (1; 2; -2) làm VTCP: (x - 1)/1 = (y - 2)/2 = (z + 1)/(-2).
2. Tham số hóa H ∈ d: H(1 + t; 2 + 2t; -1 - 2t).
3. Thay tọa độ H vào (P): (1 + t) + 2(2 + 2t) - 2(-1 - 2t) + 1 = 0 <=> 9t + 8 = 0 => t = -8/9 => H(1/9; 2/9; 7/9).'
    );

    -- Cập nhật question_count cho bài thi EDM-8899 là 9
    UPDATE exams SET question_count = 9 WHERE id = v_exam_id;
  END IF;
END $$;
