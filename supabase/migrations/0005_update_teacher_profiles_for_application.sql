-- ==============================================================================
-- EduMi (HIPZI) - Database Migration: 0005_update_teacher_profiles_for_application.sql
-- Mô tả: Mở rộng bảng teacher_profiles phục vụ quy trình nộp hồ sơ giáo viên (UC-14),
--        lưu trữ thông tin chuyên môn, khối lớp, bằng cấp và file chứng minh qua Cloudflare R2.
-- ==============================================================================

ALTER TABLE teacher_profiles
ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS teacher_role VARCHAR(50),
ADD COLUMN IF NOT EXISTS work_experience TEXT,
ADD COLUMN IF NOT EXISTS grade_levels TEXT[],
ADD COLUMN IF NOT EXISTS degree VARCHAR(255),
ADD COLUMN IF NOT EXISTS experience_years VARCHAR(50),
ADD COLUMN IF NOT EXISTS certificate_url TEXT,
ADD COLUMN IF NOT EXISTS certificate_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS certificate_file_size INT,
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'draft'; -- 'draft' | 'pending' | 'approved' | 'rejected'

-- Index lọc hồ sơ theo trạng thái duyệt cho Staff (UC-15)
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_verification_status ON teacher_profiles(verification_status);
