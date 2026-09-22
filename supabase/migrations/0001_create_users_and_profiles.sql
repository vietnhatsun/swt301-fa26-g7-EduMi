-- ==============================================================================
-- EduMi (HIPZI) - Database Migration: 0001_create_users_and_profiles.sql
-- Mô tả: Thiết lập bảng users, hồ sơ học sinh (student_profiles với student_code, streak),
--        hồ sơ giáo viên, bảng liên kết phụ huynh - học sinh và mã xác thực OTP.
-- ==============================================================================

-- Bật extension tạo UUID ngẫu nhiên (nếu chưa có)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUM TYPES (Quy chuẩn phân quyền và trạng thái)
-- ==============================================================================

-- Phân quyền người dùng trong EduMi
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'parent', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Trạng thái tài khoản
DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('active', 'inactive', 'banned', 'pending_verification');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Loại mã xác thực
DO $$ BEGIN
    CREATE TYPE token_type AS ENUM ('email_verification', 'password_reset', 'parent_link');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. BẢNG USERS (Tài khoản gốc dùng chung cho mọi vai trò)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- Nullable nếu sau này đăng nhập bằng Google OAuth
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone_number VARCHAR(20),
    role user_role NOT NULL DEFAULT 'student',
    status account_status NOT NULL DEFAULT 'pending_verification',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index tìm kiếm nhanh theo email và role
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ==============================================================================
-- 3. BẢNG STUDENT_PROFILES (Hồ sơ học sinh - Mã liên kết phụ huynh, Streak học tập)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS student_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    -- Mã code độc nhất để học sinh đưa cho phụ huynh liên kết (VD: EDM-784920)
    student_code VARCHAR(32) NOT NULL UNIQUE,
    -- Chuỗi ngày học liên tiếp (Streak)
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_learning_date DATE,
    -- Điểm thưởng và cấp học
    total_points INT NOT NULL DEFAULT 0,
    grade_level VARCHAR(50), -- VD: "Lớp 10", "Lớp 11", "Đại học"
    school_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_code ON student_profiles(student_code);

-- ==============================================================================
-- 4. BẢNG TEACHER_PROFILES (Hồ sơ giáo viên)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS teacher_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(255), -- Tiêu đề giới thiệu (VD: "Thạc sĩ Toán học - THPT Chuyên")
    bio TEXT,
    subjects TEXT[], -- Danh sách môn giảng dạy (VD: ARRAY['Toán', 'Vật lý'])
    is_verified_educator BOOLEAN NOT NULL DEFAULT FALSE,
    rating_avg NUMERIC(3, 2) DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. BẢNG PARENT_STUDENT_LINKS (Liên kết giữa Phụ huynh và Học sinh)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS parent_student_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship VARCHAR(50) DEFAULT 'Phụ huynh', -- VD: Bố, Mẹ, Người giám hộ
    is_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_parent_student_link UNIQUE (parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_links_parent ON parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_links_student ON parent_student_links(student_id);

-- ==============================================================================
-- 6. BẢNG VERIFICATION_TOKENS (Mã OTP 6 số xác thực Email và Đổi mật khẩu)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token VARCHAR(10) NOT NULL, -- Mã OTP 6 chữ số (VD: 482910)
    type token_type NOT NULL DEFAULT 'email_verification',
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_lookup ON verification_tokens(email, token, is_used);

-- ==============================================================================
-- 7. FUNCTION & TRIGGER: Tự động cập nhật cột updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_student_profiles_updated_at ON student_profiles;
CREATE TRIGGER trg_student_profiles_updated_at
BEFORE UPDATE ON student_profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 8. FUNCTION: Tự động sinh student_code ngẫu nhiên dễ đọc (VD: EDM-683921)
-- ==============================================================================
CREATE OR REPLACE FUNCTION generate_unique_student_code()
RETURNS VARCHAR AS $$
DECLARE
    new_code VARCHAR(32);
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Sinh mã định dạng: EDM + 6 số ngẫu nhiên
        new_code := 'EDM-' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
        SELECT EXISTS (SELECT 1 FROM student_profiles WHERE student_code = new_code) INTO code_exists;
        IF NOT code_exists THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
