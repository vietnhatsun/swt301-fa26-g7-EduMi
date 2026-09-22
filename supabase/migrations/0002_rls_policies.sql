-- ==============================================================================
-- EduMi (HIPZI) - Database Migration: 0002_rls_policies.sql
-- Mô tả: Thiết lập Row Level Security (RLS) cho tất cả các bảng dữ liệu
-- ==============================================================================

-- 1. BẬT RLS CHO TẤT CẢ CÁC BẢNG
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. POLICIES CHO BẢNG USERS
-- ==============================================================================

-- Người dùng đã đăng nhập có thể xem thông tin cá nhân của chính mình
CREATE POLICY "Users can view their own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Người dùng có thể cập nhật thông tin cá nhân của chính mình
CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Cho phép phụ huynh xem thông tin cơ bản của học sinh đã liên kết
CREATE POLICY "Parents can view linked students user profile"
ON users
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM parent_student_links
        WHERE parent_id = auth.uid()
          AND student_id = users.id
          AND is_confirmed = TRUE
    )
);

-- ==============================================================================
-- 3. POLICIES CHO BẢNG STUDENT_PROFILES
-- ==============================================================================

-- Học sinh xem hồ sơ học tập của chính mình
CREATE POLICY "Students can view their own profile"
ON student_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Học sinh cập nhật hồ sơ học tập của chính mình
CREATE POLICY "Students can update their own profile"
ON student_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Phụ huynh xem hồ sơ học tập (streak, points) của học sinh đã liên kết
CREATE POLICY "Parents can view linked student profiles"
ON student_profiles
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM parent_student_links
        WHERE parent_id = auth.uid()
          AND student_id = student_profiles.user_id
          AND is_confirmed = TRUE
    )
);

-- ==============================================================================
-- 4. POLICIES CHO BẢNG TEACHER_PROFILES
-- ==============================================================================

-- Hồ sơ giáo viên có thể được xem bởi mọi người dùng (để học sinh tìm gia sư/thầy cô)
CREATE POLICY "Public read for teacher profiles"
ON teacher_profiles
FOR SELECT
TO authenticated, anon
USING (TRUE);

-- Giáo viên chỉ được chỉnh sửa hồ sơ của chính mình
CREATE POLICY "Teachers can update their own profile"
ON teacher_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 5. POLICIES CHO BẢNG PARENT_STUDENT_LINKS
-- ==============================================================================

-- Phụ huynh xem danh sách các liên kết của mình
CREATE POLICY "Parents can view their student links"
ON parent_student_links
FOR SELECT
TO authenticated
USING (auth.uid() = parent_id);

-- Học sinh xem danh sách phụ huynh liên kết với mình
CREATE POLICY "Students can view their parent links"
ON parent_student_links
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Phụ huynh có thể tạo yêu cầu liên kết với học sinh
CREATE POLICY "Parents can insert student links"
ON parent_student_links
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = parent_id);

-- ==============================================================================
-- 6. POLICIES CHO BẢNG VERIFICATION_TOKENS
-- ==============================================================================
-- Bảng verification_tokens chỉ được truy cập và xử lý thông qua Service Role (Backend API)
-- Mặc định không cấp policy SELECT/INSERT/UPDATE cho client (authenticated/anon)
-- Nhờ đó mã OTP tuyệt đối an toàn và không bị lộ qua Supabase client-side API.
