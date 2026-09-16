# Giải Thích Chi Tiết Architecture — HIPZI

## Tổng quan cấu trúc

```text
e:/HIPZI/
├── public/                   # Static assets (ảnh, icon, SVG)
├── src/
│   ├── app/                  # Next.js App Router (trang web, layout, API)
│   ├── components/           # UI Components tái sử dụng
│   ├── config/               # Cấu hình ứng dụng & hằng số
│   ├── hooks/                # Custom React Hooks
│   ├── lib/                  # Utility functions & helpers
│   ├── server/               # Logic backend (Server Actions, DB, Services)
│   └── types/                # TypeScript type definitions
├── .editorconfig             # Quy chuẩn Editor
├── .env.example              # Mẫu biến môi trường
├── .gitignore                # Git ignore
├── .nvmrc                    # Phiên bản Node.js cố định
├── CLAUDE.md                 # Hướng dẫn cho AI Assistant
├── commitlint.config.mjs     # Chuẩn commit message
├── eslint.config.mjs         # Linter rules
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies & Scripts
├── postcss.config.mjs        # Tailwind CSS processor
├── prettier.config.mjs       # Code formatter
├── tsconfig.json             # TypeScript configuration
└── vitest.config.ts          # Test runner configuration
```

---

## 📂 Phần 1: Root Config Files (Tầng Cấu Hình)

> Đây là tầng nằm ngoài cùng, không chứa code ứng dụng, chỉ chứa **các file cấu hình** kiểm soát cách toàn bộ dự án hoạt động.

---

### `package.json`

**Vai trò:** Bộ não của dự án. Mọi thứ bắt đầu từ đây.

```json
{
  "scripts": {
    "dev":   "next dev",      // Khởi động server phát triển
    "build": "next build",    // Build production
    "start": "next start",    // Chạy bản production
    "lint":  "eslint",        // Kiểm tra lỗi code
    "test":  "vitest run"     // Chạy unit tests
  },
  "dependencies": { ... },    // Thư viện chạy khi production
  "devDependencies": { ... }  // Thư viện chỉ dùng khi dev
}
```

**Tương tác:** Là điểm khởi đầu cho tất cả. NPM đọc file này để cài thư viện và biết phải chạy lệnh gì.

---

### `tsconfig.json`

**Vai trò:** Quy định cách TypeScript hiểu và kiểm tra code của bạn.

Điểm quan trọng nhất:
```json
"paths": { "@/*": ["./src/*"] }
```
Dòng này cho phép viết:
```typescript
import { cn } from '@/lib/utils';   // ✅ Ngắn gọn
// Thay vì phải viết:
import { cn } from '../../../lib/utils';  // ❌ Dài và dễ lỗi
```

**Tương tác:** Ảnh hưởng đến toàn bộ file `.ts` và `.tsx` trong dự án.

---

### `next.config.ts`

**Vai trò:** Cấu hình cho framework Next.js. Nơi bật/tắt các tính năng như image optimization, headers, redirects, environment variables...

---

### `eslint.config.mjs`

**Vai trò:** Cảnh sát code. Tự động phát hiện lỗi logic, code không nhất quán, vi phạm best practices trước khi chạy.

```
Bạn viết code → ESLint quét → Báo lỗi/warning ngay trong IDE
```

---

### `prettier.config.mjs`

**Vai trò:** Thợ format code. Tự động căn chỉnh, xuống dòng, thêm/bỏ dấu phẩy... đảm bảo toàn team viết code trông giống nhau 100%.

---

### `commitlint.config.mjs` + `.husky/`

**Vai trò:** Bộ đôi bảo vệ lịch sử Git. **Husky** chặn commit khi bạn gõ `git commit`, **Commitlint** kiểm tra message có đúng chuẩn không.

```bash
# ✅ Đúng chuẩn Conventional Commits
git commit -m "feat: add user login page"
git commit -m "fix: correct auth token expiry"
git commit -m "docs: update README"

# ❌ Bị chặn lại
git commit -m "sua loi"
git commit -m "update code"
```

**Lợi ích:** Lịch sử Git rõ ràng, tự động generate CHANGELOG, dễ review.

---

### `vitest.config.ts`

**Vai trò:** Cấu hình test runner Vitest — tương tự Jest nhưng nhanh hơn nhiều vì tích hợp với Vite/ESBuild.

Quan trọng:
```typescript
environment: 'jsdom'   // Giả lập môi trường trình duyệt để test React components
alias: { '@': ... }    // Cùng path alias như tsconfig để import trong test files
```

---

### `.nvmrc`

**Vai trò:** Chứa 1 dòng duy nhất: `v20.18.0`. Bảo mọi người trong team (và CI/CD) phải dùng đúng bản Node.js này.

```bash
nvm use   # Tự động chuyển sang Node v20.18.0
```

**Lý do quan trọng:** Tránh lỗi *"chạy được trên máy tôi mà lại lỗi trên máy bạn"*.

---

### `.editorconfig`

**Vai trò:** Đảm bảo mọi editor (VSCode, WebStorm, Vim...) đều dùng cùng cài đặt: 2 spaces indent, UTF-8, xuống dòng kiểu Unix (LF).

---

### `.env.example`

**Vai trò:** Bản mẫu các biến môi trường. **Được commit lên Git** để ai clone về cũng biết cần điền những gì.

```bash
# .env.example (trên Git — không có giá trị thật)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXTAUTH_SECRET=your-secret-here

# .env.local (KHÔNG lên Git — chứa giá trị thật)
DATABASE_URL=postgresql://ngocthach:abc123@localhost:5432/hipzi_db
NEXTAUTH_SECRET=super-secret-production-key-xyz
```

---

### `CLAUDE.md`

**Vai trò:** File hướng dẫn cho AI Coding Assistants (Claude, Cursor, Antigravity...). Khi AI đọc file này trước, nó hiểu kiến trúc dự án và luôn tạo code đúng convention.

---

## 📂 Phần 2: `public/` — Static Assets

**Vai trò:** Chứa các file tĩnh được serve trực tiếp mà không qua xử lý của Next.js.

```
public/
├── file.svg     → icon dạng file
├── globe.svg    → icon hình quả địa cầu
└── window.svg   → icon dạng cửa sổ
```

**Cách truy cập:**
```html
<!-- Trong code: đường dẫn bắt đầu từ /  -->
<img src="/globe.svg" alt="globe" />
```

**Tương tác:** Next.js tự động serve toàn bộ `public/` tại root URL. Không cần import, không cần xử lý.

---

## 📂 Phần 3: `src/` — Toàn Bộ Code Ứng Dụng

---

### `src/app/` — Tầng Điều Hướng & Hiển Thị (App Router)

> **Đây là trái tim của ứng dụng.** Mọi URL trên trình duyệt tương ứng với một file trong thư mục này.

```
src/app/
├── layout.tsx      # Layout bọc ngoài TOÀN BỘ ứng dụng
├── globals.css     # CSS global (Tailwind import, CSS variables)
└── page.tsx        # Trang chủ (URL: /)
```

#### `layout.tsx` — Bộ khung ngoài cùng

```typescript
// Chạy 1 lần, bọc tất cả trang
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="...fonts...">
      <body>
        {children}  {/* ← Tất cả các trang được render vào đây */}
      </body>
    </html>
  );
}
```

**Vai trò:** Định nghĩa `<html>`, `<body>`, font chữ, metadata SEO, Provider (nếu có Auth/State). **Chỉ render 1 lần**, không re-render khi navigate giữa các trang.

---

#### `globals.css` — CSS Toàn Cục

```css
@import "tailwindcss";   /* Kích hoạt Tailwind utility classes */

:root {
  --background: #ffffff; /* CSS Variables cho Light mode */
  --foreground: #171717;
}
@media (prefers-color-scheme: dark) {
  :root { --background: #0a0a0a; } /* Dark mode tự động */
}
```

**Tương tác:** Được import trong `layout.tsx`, áp dụng cho toàn bộ ứng dụng.

---

#### `page.tsx` — Trang cụ thể

```typescript
// src/app/page.tsx → URL: /
export default function Home() { ... }

// src/app/about/page.tsx → URL: /about
// src/app/dashboard/page.tsx → URL: /dashboard
```

**Quy tắc App Router:** Mỗi **folder** = 1 URL segment, mỗi `page.tsx` trong folder = nội dung của URL đó.

---

#### Mở rộng trong tương lai:
```
src/app/
├── layout.tsx
├── page.tsx              → /
├── (auth)/               → Route Group (không tạo URL)
│   ├── login/page.tsx    → /login
│   └── register/page.tsx → /register
├── dashboard/
│   ├── layout.tsx        → Layout riêng cho /dashboard/*
│   └── page.tsx          → /dashboard
└── api/                  → API Routes (Backend endpoints)
    └── health/route.ts   → GET /api/health
```

---

### `src/components/` — Tầng UI Components

> Nơi chứa các **khối xây dựng giao diện** tái sử dụng. Rule: Component không biết gì về business logic, chỉ nhận data qua props và hiển thị.

```
src/components/
├── common/         # Components layout dùng chung (Header, Footer, Sidebar...)
│   └── Header.tsx
└── ui/             # Design system components (Button, Input, Modal, Card...)
    (tương lai)
```

#### `common/Header.tsx`

```typescript
import React from 'react';
import { siteConfig } from '@/config/site';  // ← Lấy data từ config

export function Header() {
  return (
    <header>
      <span>{siteConfig.name}</span>  {/* Hiển thị tên app */}
      <nav>...</nav>
    </header>
  );
}
```

**Tương tác:**
- Nhận dữ liệu từ `src/config/site.ts`
- Được sử dụng trong `src/app/page.tsx` (hoặc `layout.tsx`)
- **Không** gọi API, **không** xử lý logic nghiệp vụ

---

### `src/config/` — Tầng Cấu Hình Ứng Dụng

> Nơi lưu trữ **hằng số và cấu hình** của ứng dụng. Thay đổi 1 chỗ → ảnh hưởng toàn bộ.

```
src/config/
├── site.ts    # Thông tin ứng dụng (tên, mô tả, URL, links)
└── env.ts     # Wrapper an toàn cho biến môi trường
```

#### `site.ts`

```typescript
export const siteConfig = {
  name: "HIPZI",
  description: "Enterprise Web Application...",
  url: "https://hipzi.local",
  links: { github: "https://github.com/hipzi/hipzi" },
};
```

**Tại sao cần?** Nếu bạn đổi tên app từ "HIPZI" sang "MyApp", chỉ cần sửa 1 dòng ở đây, thay vì tìm kiếm trong toàn bộ codebase.

#### `env.ts`

```typescript
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
```

**Tại sao cần?** Thay vì dùng `process.env.NEXT_PUBLIC_APP_URL` rải rác khắp nơi (có thể typo), bạn import `env.NEXT_PUBLIC_APP_URL` — có TypeScript kiểm tra, có fallback value.

---

### `src/hooks/` — Custom React Hooks

> **Hook** là hàm TypeScript đặc biệt cho phép tái sử dụng **logic có trạng thái** (state, side effects) giữa nhiều components.

```
src/hooks/
└── use-mounted.ts
```

#### `use-mounted.ts`

```typescript
'use client'; // ← Hook này chỉ chạy trên trình duyệt

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}
```

**Giải quyết vấn đề gì?** Next.js render HTML trên server trước (SSR), sau đó trình duyệt "hydrate". Trong quãng thời gian đó, một số UI (dark mode toggle, browser-only animations) chưa thể hiển thị. Hook này báo hiệu *"component đã mount xong trên client"*.

```typescript
// Cách dùng trong component
function ThemeToggle() {
  const mounted = useMounted();
  if (!mounted) return null;  // Không render khi đang SSR
  return <DarkModeButton />;
}
```

**Tương tác:** Được dùng trong `src/components/`. Phụ thuộc vào React runtime (không thể dùng phía server).

---

### `src/lib/` — Utility Functions & Helpers

> Nơi chứa các **hàm thuần túy** (pure functions) không phụ thuộc vào React, dùng được ở cả client lẫn server.

```
src/lib/
├── utils.ts        # cn() helper — merge Tailwind classes
└── utils.test.ts   # Unit tests cho utils.ts
```

#### `utils.ts` — Hàm `cn()`

```typescript
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Giải quyết vấn đề gì?** Tailwind CSS có xung đột khi dùng conditional classes:

```typescript
// ❌ Không dùng cn() — xung đột: cả p-2 và p-4 đều trong class string
const className = `p-2 ${isLarge ? 'p-4' : ''}`;
// → "p-2 p-4" — p-2 thắng vì specificity bằng nhau, khó đoán

// ✅ Dùng cn() — tự động resolve xung đột
const className = cn('p-2', isLarge && 'p-4');
// → "p-4" — cn() thông minh loại bỏ p-2
```

**Tương tác:** Hàm `cn()` được dùng **trong mọi component** khi cần dynamic class.

#### `utils.test.ts` — Unit Test

```typescript
describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-blue-500', { 'text-white': true });
    expect(result).toBe('px-2 py-1 bg-blue-500 text-white');
  });
});
```

**Vai trò:** Đảm bảo `cn()` luôn hoạt động đúng. Chạy bằng `npm run test`.

---

### `src/server/` — Tầng Backend (Server-Side Only)

> **Quan trọng nhất về bảo mật.** Code trong thư mục này **KHÔNG BAO GIỜ** gửi xuống trình duyệt. Database passwords, API keys, business logic nhạy cảm — tất cả nằm đây.

```
src/server/
├── actions/           # Next.js Server Actions (RPC functions)
│   └── example.ts
└── services/          # Business logic, data transformation
    └── .gitkeep
```

#### `actions/example.ts` — Server Action

```typescript
'use server'; // ← Magic directive: file này chạy trên SERVER, không bao giờ leak xuống browser

import { ApiResponse } from '@/types';

export async function fetchServerStatus(): Promise<ApiResponse<...>> {
  // Ở đây có thể:
  // - Query database trực tiếp
  // - Gọi API với secret keys
  // - Đọc file system
  // - Xử lý logic nhạy cảm
  return { success: true, data: { status: 'operational' } };
}
```

**Cách gọi từ Client Component:**
```typescript
// src/app/page.tsx (Server Component — không cần 'use client')
import { fetchServerStatus } from '@/server/actions/example';

export default async function Page() {
  const result = await fetchServerStatus(); // Gọi trực tiếp như function bình thường
  return <div>{result.data?.status}</div>;
}
```

**Tương tác:**
```
Browser → [Next.js tự tạo API endpoint ẩn] → Server Action → Database
```
Không lộ database connection string ra trình duyệt!

---

### `src/types/` — TypeScript Type Definitions

> Bộ từ điển chung của toàn bộ ứng dụng. Định nghĩa **hình dạng của dữ liệu** — tất cả các tầng đều phải theo.

```
src/types/
└── index.ts
```

#### `index.ts`

```typescript
// Mọi entity trong DB đều có 3 fields này
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Format trả về chuẩn cho mọi API response
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
```

**Tại sao cần tập trung types?**

```typescript
// ❌ Không có types tập trung — mỗi file tự định nghĩa, dễ lệch nhau
// file-a.ts: interface Response { data: User, ok: boolean }
// file-b.ts: interface Response { payload: User, success: boolean }

// ✅ Có types tập trung — mọi nơi dùng chung 1 định nghĩa
import type { ApiResponse } from '@/types';
// Server trả về ApiResponse<User>, Client nhận ApiResponse<User> — LUÔN khớp
```

**Tương tác:** `src/types/index.ts` được import bởi **cả server lẫn client**:
- `src/server/actions/*.ts` — dùng để typed return value
- `src/components/**/*.tsx` — dùng để typed props
- `src/hooks/**/*.ts` — dùng để typed state

---

## 🔄 Phần 4: Sơ Đồ Tương Tác Toàn Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER (Client Side)                                      │
│                                                             │
│  src/app/page.tsx                                           │
│       │                                                     │
│       ├──── import ──→ src/components/common/Header.tsx     │
│       │                      │                             │
│       │                      └──── import ──→ src/config/site.ts
│       │                                                     │
│       └──── import ──→ src/lib/utils.ts (cn helper)        │
│                                                             │
│  src/hooks/use-mounted.ts ←── dùng trong components        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Server Actions (HTTP POST ẩn)
┌──────────────────────────────▼──────────────────────────────┐
│  SERVER (Node.js)                                           │
│                                                             │
│  src/server/actions/example.ts ←── 'use server'            │
│       │                                                     │
│       ├──── import ──→ src/types/index.ts (ApiResponse<T>) │
│       │                                                     │
│       └──── (tương lai) ──→ src/server/db/ (Database)      │
│                              src/server/services/ (Logic)   │
└─────────────────────────────────────────────────────────────┘

Mọi file đều có thể import:
  src/types/index.ts     — Shared TypeScript contracts
  src/config/site.ts     — App constants
  src/config/env.ts      — Environment variables
  src/lib/utils.ts       — Pure utility functions
```

---

## 📋 Phần 5: Bảng Tóm Tắt Nhanh

| Thư mục/File | Chạy ở đâu | Có thể import DB? | Được render ra HTML? |
|:---|:---:|:---:|:---:|
| `src/app/page.tsx` | Server & Client | ✅ Nếu Server Component | ✅ |
| `src/app/layout.tsx` | Server | ✅ | ✅ |
| `src/components/` | Client (mặc định) | ❌ | ✅ |
| `src/server/actions/` | Server only | ✅ | ❌ |
| `src/server/services/` | Server only | ✅ | ❌ |
| `src/hooks/` | Client only | ❌ | ❌ |
| `src/lib/utils.ts` | Both | ❌ | ❌ |
| `src/config/` | Both | ❌ | ❌ |
| `src/types/` | Both | ❌ | ❌ |
| `public/` | Static CDN | ❌ | ❌ |

---

## 💡 Nguyên tắc vàng của Architecture này

> **"Mỗi tầng chỉ biết về tầng bên dưới nó, không biết về tầng trên."**

```
app/         → biết về components, config, server/actions
components/  → biết về config, lib, hooks, types
server/      → biết về types, config, lib
lib/         → biết về types (không biết gì khác)
types/       → không biết gì cả (pure definitions)
```

Vi phạm quy tắc này → code tạo ra **circular dependencies** → ứng dụng lỗi, khó debug.
