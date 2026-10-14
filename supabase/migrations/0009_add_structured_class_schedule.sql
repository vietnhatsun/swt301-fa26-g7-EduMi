-- ==============================================================================
-- EduMi - Database Migration: 0009_add_structured_class_schedule.sql
-- Mô tả: Bổ sung lịch học có cấu trúc để phục vụ nhắc lịch/calendar về sau.
-- ==============================================================================

ALTER TABLE teaching_classes
  ADD COLUMN IF NOT EXISTS schedule_weekdays TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS start_time TIME,
  ADD COLUMN IF NOT EXISTS end_time TIME;

CREATE INDEX IF NOT EXISTS idx_teaching_classes_schedule_weekdays ON teaching_classes USING GIN(schedule_weekdays);
CREATE INDEX IF NOT EXISTS idx_teaching_classes_start_time ON teaching_classes(start_time);