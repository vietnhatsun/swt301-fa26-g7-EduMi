-- ==============================================================================
-- EduMi - Database Migration: 0007_create_teaching_materials.sql
-- Mô tả: Tạo bảng tài liệu giảng dạy do giáo viên đăng tải, file lưu trên Cloudflare R2
--        và staff duyệt trước khi hiển thị công khai.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS teaching_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject VARCHAR(120) NOT NULL,
  topic VARCHAR(80),
  grade_level VARCHAR(80),
  file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('PDF', 'DOCX')),
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_key TEXT NOT NULL,
  file_public_url TEXT,
  page_count INT,
  visibility VARCHAR(30) NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'hidden')),
  allow_download BOOLEAN NOT NULL DEFAULT TRUE,
  download_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  reject_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS topic VARCHAR(80);

CREATE INDEX IF NOT EXISTS idx_teaching_materials_teacher_id ON teaching_materials(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teaching_materials_status ON teaching_materials(status);
CREATE INDEX IF NOT EXISTS idx_teaching_materials_subject ON teaching_materials(subject);
CREATE INDEX IF NOT EXISTS idx_teaching_materials_topic ON teaching_materials(topic);
CREATE INDEX IF NOT EXISTS idx_teaching_materials_created_at ON teaching_materials(created_at DESC);

ALTER TABLE teaching_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved materials are public" ON teaching_materials;
CREATE POLICY "Approved materials are public"
ON teaching_materials
FOR SELECT
TO authenticated, anon
USING (status = 'approved' AND visibility = 'public');

DROP POLICY IF EXISTS "Teachers can view own materials" ON teaching_materials;
CREATE POLICY "Teachers can view own materials"
ON teaching_materials
FOR SELECT
TO authenticated
USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can insert own materials" ON teaching_materials;
CREATE POLICY "Teachers can insert own materials"
ON teaching_materials
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can update own draft or rejected materials" ON teaching_materials;
CREATE POLICY "Teachers can update own draft or rejected materials"
ON teaching_materials
FOR UPDATE
TO authenticated
USING (auth.uid() = teacher_id AND status IN ('draft', 'rejected'))
WITH CHECK (auth.uid() = teacher_id AND status IN ('draft', 'pending'));

-- Staff/Admin sử dụng service role qua API server để duyệt, service role tự bypass RLS.
