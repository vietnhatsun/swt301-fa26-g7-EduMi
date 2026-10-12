-- ==============================================================================
-- EduMi (HIPZI) - Database Migration: 0006_add_teacher_code.sql
-- Mô tả: Thêm cột teacher_code vào bảng teacher_profiles, sinh mã giáo viên
--        độc nhất (VD: GV-456BA4 hoặc GV-XXXXXX) và đánh index.
-- ==============================================================================

-- 1. Thêm cột teacher_code vào teacher_profiles nếu chưa có
ALTER TABLE teacher_profiles
ADD COLUMN IF NOT EXISTS teacher_code VARCHAR(32);

-- 2. Cập nhật mã teacher_code cho các giáo viên hiện có chưa có mã
-- Định dạng chuẩn: GV- + 6 ký tự hex in hoa từ user_id (VD: GV-456BA4)
UPDATE teacher_profiles
SET teacher_code = 'GV-' || UPPER(SUBSTRING(REPLACE(user_id::text, '-', ''), 1, 6))
WHERE teacher_code IS NULL OR teacher_code = '';

-- 3. Đánh index và ràng buộc unique cho teacher_code
CREATE UNIQUE INDEX IF NOT EXISTS idx_teacher_profiles_code ON teacher_profiles(teacher_code);
