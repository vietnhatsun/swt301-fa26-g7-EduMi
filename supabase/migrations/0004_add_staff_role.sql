-- EduMi - Database Migration: 0004_add_staff_role.sql
-- Mô tả: Bổ sung role staff cho tài khoản nhân viên vận hành hệ thống.

ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'staff';