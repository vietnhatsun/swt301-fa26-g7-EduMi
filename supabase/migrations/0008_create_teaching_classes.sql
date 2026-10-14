-- ==============================================================================
-- EduMi - Database Migration: 0008_create_teaching_classes.sql
-- Mô tả: Tạo bảng lớp học do giáo viên đăng ký, staff duyệt trước khi công khai.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS teaching_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject VARCHAR(120) NOT NULL,
  grade_level VARCHAR(80) NOT NULL,
  schedule_days VARCHAR(160) NOT NULL,
  time_slot VARCHAR(80) NOT NULL,
  total_lessons INT NOT NULL DEFAULT 0 CHECK (total_lessons >= 0),
  tuition_fee INT NOT NULL DEFAULT 0 CHECK (tuition_fee >= 0),
  cover_image TEXT,
  has_online_room BOOLEAN NOT NULL DEFAULT TRUE,
  auto_record BOOLEAN NOT NULL DEFAULT TRUE,
  allow_pinned_note BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'hidden', 'completed')),
  student_count INT NOT NULL DEFAULT 0 CHECK (student_count >= 0),
  completed_lessons INT NOT NULL DEFAULT 0 CHECK (completed_lessons >= 0),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  reject_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teaching_classes_teacher_id ON teaching_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teaching_classes_status ON teaching_classes(status);
CREATE INDEX IF NOT EXISTS idx_teaching_classes_subject ON teaching_classes(subject);
CREATE INDEX IF NOT EXISTS idx_teaching_classes_created_at ON teaching_classes(created_at DESC);

ALTER TABLE teaching_classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved classes are public" ON teaching_classes;
CREATE POLICY "Approved classes are public"
ON teaching_classes
FOR SELECT
TO authenticated, anon
USING (status = 'approved');

DROP POLICY IF EXISTS "Teachers can view own classes" ON teaching_classes;
CREATE POLICY "Teachers can view own classes"
ON teaching_classes
FOR SELECT
TO authenticated
USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can insert own classes" ON teaching_classes;
CREATE POLICY "Teachers can insert own classes"
ON teaching_classes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can update own draft or rejected classes" ON teaching_classes;
CREATE POLICY "Teachers can update own draft or rejected classes"
ON teaching_classes
FOR UPDATE
TO authenticated
USING (auth.uid() = teacher_id AND status IN ('draft', 'rejected'))
WITH CHECK (auth.uid() = teacher_id AND status IN ('draft', 'pending'));

-- Staff/Admin sử dụng service role qua API server để duyệt, service role tự bypass RLS.