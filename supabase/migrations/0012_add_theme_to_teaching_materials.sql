-- ==============================================================================
-- EduMi - Database Migration: 0012_add_theme_to_teaching_materials.sql
-- Mô tả: Thêm các cột giao diện thẻ, mã thẻ và tác giả cho bảng teaching_materials
-- ==============================================================================

ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS card_code VARCHAR(50);
ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS bg_class VARCHAR(80) DEFAULT 'bg-[#e07328]';
ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS accent_class VARCHAR(80) DEFAULT 'text-[#e07328]';
ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS pattern VARCHAR(50) DEFAULT 'waves';
ALTER TABLE teaching_materials ADD COLUMN IF NOT EXISTS author VARCHAR(150);
