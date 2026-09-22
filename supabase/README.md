# Supabase SQL Migrations & Scripts — EduMi (HIPZI)

Thư mục này dùng để lưu trữ và quản lý phiên bản toàn bộ các câu lệnh SQL (DDL, DML, Policies, Triggers, Functions) đã thực thi trên cơ sở dữ liệu Supabase của dự án.

## Cấu trúc khuyến nghị

```text
supabase/
├── migrations/          # Chứa các file migration theo thứ tự thời gian
│   └── 0001_initial_schema.sql
├── seeds/               # Dữ liệu mẫu ban đầu (nếu có)
│   └── seed.sql
└── README.md
```

## Quy ước đặt tên file SQL
- `0001_create_users_table.sql`
- `0002_create_verification_tokens_table.sql`
- `0003_add_roles_and_permissions.sql`
