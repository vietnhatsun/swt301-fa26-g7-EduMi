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
  instruction TEXT NOT NULL DEFAULT 'Chọn một đáp án đúng',
  content TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer VARCHAR(10) NOT NULL DEFAULT 'A',
  explanation TEXT,
  points NUMERIC(4,2) NOT NULL DEFAULT 0.25,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
