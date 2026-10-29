-- ==============================================================================
-- EduMi - Database Migration: 0013_search_optimization_indexes.sql
-- Mô tả: Kích hoạt extension pg_trgm & unaccent, tạo chỉ mục GIN Trigram & B-Tree
--        để tối ưu hóa tốc độ tìm kiếm cho Phòng thi (exams), Tài liệu (teaching_materials),
--        và Lớp học (teaching_classes). Hỗ trợ tìm kiếm mờ (Fuzzy search), tiếng Việt
--        không dấu và tìm kiếm một phần từ cực nhanh.
-- ==============================================================================

-- 1. Kích hoạt extension pg_trgm và unaccent
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Đánh chỉ mục GIN Trigram cho bảng Exams (Phòng thi)
-- Tối ưu tìm kiếm theo tiêu đề, môn học, mã thẻ và tác giả
CREATE INDEX IF NOT EXISTS idx_exams_title_trgm ON exams USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_exams_subject_trgm ON exams USING gin (subject gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_exams_card_code_trgm ON exams USING gin (card_code gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_exams_author_trgm ON exams USING gin (author gin_trgm_ops);

-- B-Tree index phục vụ tìm kiếm chính xác theo Mã PIN / Exam code
CREATE INDEX IF NOT EXISTS idx_exams_exam_code_exact ON exams (exam_code);
CREATE INDEX IF NOT EXISTS idx_exams_scope_status ON exams (scope, status, created_at DESC);

-- 3. Đánh chỉ mục GIN Trigram cho bảng Teaching Materials (Tài liệu học tập)
CREATE INDEX IF NOT EXISTS idx_materials_title_trgm ON teaching_materials USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_materials_subject_trgm ON teaching_materials USING gin (subject gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_materials_grade_level ON teaching_materials (grade_level);
CREATE INDEX IF NOT EXISTS idx_materials_public_approved ON teaching_materials (status, visibility, created_at DESC);

-- 4. Đánh chỉ mục GIN Trigram cho bảng Teaching Classes (Lớp học)
CREATE INDEX IF NOT EXISTS idx_classes_title_trgm ON teaching_classes USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_classes_subject_trgm ON teaching_classes USING gin (subject gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_classes_grade_level ON teaching_classes (grade_level);
CREATE INDEX IF NOT EXISTS idx_classes_status_approved ON teaching_classes (status, created_at DESC);
