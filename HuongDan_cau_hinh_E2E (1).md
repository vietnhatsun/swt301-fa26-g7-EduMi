# HƯỚNG DẪN CẤU HÌNH E2E TEST — EduMi (TypeScript + Vitest + Selenium)

> Mục tiêu: sau khi đọc xong, mỗi thành viên **clone repo, cài đặt, chạy được test mẫu** trong vòng 15 phút, rồi bắt đầu viết test cho module của mình.
>
> ⚠️ Các lệnh và đoạn code trong file này là **khung khởi đầu**, chưa được chạy thử trên máy nhóm. Người dựng skeleton (Framework Owner) phải chạy **smoke test ở mục 8** trước khi báo cả nhóm bắt đầu. Nếu có chỗ sai, sửa trực tiếp file này bằng PR.

---

## 1. Kiến trúc: các thành phần phối hợp thế nào

```
Vitest (chạy test, assert, báo cáo)
   └─ selenium-webdriver (thư viện điều khiển)
        └─ ChromeDriver  ←  Selenium Manager tự tải, không cần cài tay
             └─ Chrome  ──HTTP──►  EduMi đang chạy tại http://localhost:3000
```

- Test **không import code của EduMi**. Test chỉ "nhìn" website như người dùng (qua URL, DOM).
- Vì vậy **website phải đang chạy** trước khi chạy test (mục 6).
- Test E2E nằm **cùng repo EduMi**, thư mục `e2e/`, tách biệt hoàn toàn với unit test trong `src/`.

> Quyết định này nhằm: dùng chung ngôn ngữ, IDE, Git, commitlint/husky đã có; lịch sử commit của mỗi thành viên nằm một chỗ.

---

## 2. Yêu cầu cài đặt (mỗi thành viên)

| Công cụ | Phiên bản | Kiểm tra |
|---------|-----------|----------|
| Node.js | ≥ 20 (máy hiện tại: 24.x) | `node -v` |
| npm | đi kèm Node | `npm -v` |
| Google Chrome | bản mới nhất, cài mặc định | mở Chrome → Help → About |
| Git | bất kỳ | `git --version` |
| IDE | VS Code hoặc Antigravity (**không cần IntelliJ**) | |

Không cần cài JDK, Maven, ChromeDriver, WebDriverManager.

---

## 3. Cài đặt dự án (làm một lần)

```bash
git clone <repo-edumi>
cd EduMi
npm install

# Thư viện E2E (Framework Owner chạy một lần, rồi commit package.json + package-lock.json)
npm i -D selenium-webdriver @types/selenium-webdriver csv-parse
```

Các thành viên khác chỉ cần `git pull` rồi `npm install`.

---

## 4. Cấu trúc thư mục

```
EduMi/
├── e2e/
│   ├── config/
│   │   └── env.ts              # đọc cấu hình từ .env.e2e (không hard-code)
│   ├── base/
│   │   ├── BaseTest.ts         # tạo/đóng driver, chụp ảnh khi fail
│   │   └── BasePage.ts         # waitVisible, click, type... dùng chung
│   ├── pages/                  # Page Object (mỗi trang một class)
│   │   └── LoginPage.ts
│   ├── tests/                  # chỉ chứa test + assertion
│   │   ├── smoke.test.ts
│   │   └── login.test.ts
│   ├── data/                   # dữ liệu test dạng CSV (UTF-8, có header)
│   │   └── login_data.csv
│   └── utils/
│       ├── csv.ts              # đọc CSV
│       └── dataGenerator.ts    # sinh email/username ngẫu nhiên
├── e2e-reports/                # (tự sinh, đã ignore) junit.xml, screenshots/
├── vitest.config.ts            # unit test (đã có, cần sửa exclude – mục 5.1)
├── vitest.e2e.config.ts        # cấu hình riêng cho E2E (mục 5.2)
├── .env.e2e                    # KHÔNG commit (mục 5.3)
└── .env.e2e.example            # commit, làm mẫu
```

> **Chủ sở hữu file chung:** `e2e/config`, `e2e/base`, `e2e/utils`, `vitest.e2e.config.ts` do **Framework Owner** quản lý. Người khác muốn sửa phải mở PR để tránh conflict.

---

## 5. Cấu hình

### 5.1. Sửa `vitest.config.ts` (unit test) để KHÔNG chạy E2E

Mặc định Vitest quét mọi `*.test.ts`. Nếu không loại trừ, `npm test` sẽ chạy cả test Selenium (chậm, cần server) và bị lỗi.

```ts
import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [...configDefaults.exclude, 'e2e/**'],   // ← thêm dòng này
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
});
```

### 5.2. Tạo `vitest.e2e.config.ts`

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',              // Selenium cần Node thật, KHÔNG dùng jsdom
    include: ['e2e/**/*.test.ts'],
    globals: true,
    testTimeout: 60_000,
    hookTimeout: 60_000,
    fileParallelism: false,           // mỗi lần một file → tránh tranh chấp dữ liệu/Chrome
    reporters: ['default', 'junit'],
    outputFile: { junit: './e2e-reports/junit.xml' },
  },
});
```

Thêm vào `package.json` → `scripts`:

```json
"test:e2e": "vitest run --config vitest.e2e.config.ts",
"test:e2e:headless": "cross-env E2E_HEADLESS=true vitest run --config vitest.e2e.config.ts"
```

> Nếu dùng `test:e2e:headless` trên Windows, cài thêm `npm i -D cross-env`. Nếu không, đặt `E2E_HEADLESS=true` trong `.env.e2e`.

Chạy một file / một test:

```bash
npm run test:e2e -- e2e/tests/login.test.ts
npm run test:e2e -- -t "TC-LOGIN-001"
```

### 5.3. Biến môi trường

Tạo `.env.e2e.example` (commit):

```properties
E2E_BASE_URL=http://localhost:3000
E2E_HEADLESS=false
E2E_TIMEOUT_SECONDS=10

# Tài khoản test (lấy từ Test Lead – KHÔNG dùng tài khoản thật)
E2E_STUDENT_EMAIL=
E2E_STUDENT_PASSWORD=
E2E_TEACHER_EMAIL=
E2E_TEACHER_PASSWORD=
E2E_STAFF_EMAIL=
E2E_STAFF_PASSWORD=
```

Mỗi người tự copy thành `.env.e2e` và điền giá trị:

```bash
copy .env.e2e.example .env.e2e      # Windows PowerShell/CMD
```

Thêm vào `.gitignore`:

```gitignore
# E2E
.env.e2e
e2e-reports/
```

> ⚠️ Không commit `.env.e2e`, mật khẩu hoặc key. `.env.local` của EduMi (Supabase) cũng đã nằm trong `.gitignore`.

### 5.4. `e2e/config/env.ts`

```ts
try {
  process.loadEnvFile('.env.e2e');   // Node ≥ 20.12; nếu thiếu file thì dùng giá trị mặc định
} catch {
  /* bỏ qua */
}

const required = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Thiếu biến môi trường ${key}. Hãy kiểm tra .env.e2e`);
  }
  return value;
};

export const env = {
  baseUrl: required('E2E_BASE_URL', 'http://localhost:3000'),
  headless: (process.env.E2E_HEADLESS ?? 'false') === 'true',
  timeoutMs: Number(process.env.E2E_TIMEOUT_SECONDS ?? '10') * 1000,
  accounts: {
    student: {
      email: process.env.E2E_STUDENT_EMAIL ?? '',
      password: process.env.E2E_STUDENT_PASSWORD ?? '',
    },
    teacher: {
      email: process.env.E2E_TEACHER_EMAIL ?? '',
      password: process.env.E2E_TEACHER_PASSWORD ?? '',
    },
    staff: {
      email: process.env.E2E_STAFF_EMAIL ?? '',
      password: process.env.E2E_STAFF_PASSWORD ?? '',
    },
  },
};
```

### 5.5. `e2e/base/BasePage.ts`

```ts
import { By, until, type WebDriver, type WebElement } from 'selenium-webdriver';
import { env } from '../config/env';

export abstract class BasePage {
  constructor(protected readonly driver: WebDriver) {}

  protected async waitVisible(locator: By): Promise<WebElement> {
    const element = await this.driver.wait(until.elementLocated(locator), env.timeoutMs);
    await this.driver.wait(until.elementIsVisible(element), env.timeoutMs);
    return element;
  }

  protected async click(locator: By): Promise<void> {
    const element = await this.waitVisible(locator);
    await this.driver.wait(until.elementIsEnabled(element), env.timeoutMs);
    await element.click();
  }

  protected async type(locator: By, text: string | undefined): Promise<void> {
    const element = await this.waitVisible(locator);
    await element.clear();
    if (text) await element.sendKeys(text);   // ô CSV trống → bỏ qua
  }

  protected async getText(locator: By): Promise<string> {
    return (await this.waitVisible(locator)).getText();
  }

  protected async isDisplayed(locator: By): Promise<boolean> {
    try {
      return await (await this.waitVisible(locator)).isDisplayed();
    } catch {
      return false;
    }
  }

  async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }

  async open(path: string): Promise<void> {
    await this.driver.get(`${env.baseUrl}${path}`);
  }
}
```

### 5.6. `e2e/base/BaseTest.ts`

Mỗi test chạy trong một Chrome mới → các test **độc lập** nhau.

```ts
import { Builder, type WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { mkdirSync, writeFileSync } from 'node:fs';
import { afterEach, beforeEach } from 'vitest';
import { env } from '../config/env';

export function useDriver(): { get: () => WebDriver } {
  let driver: WebDriver | undefined;

  beforeEach(async ({ task, onTestFailed }) => {
    const options = new chrome.Options();
    if (env.headless) options.addArguments('--headless=new');
    options.addArguments('--window-size=1366,768');

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    // Chụp ảnh làm bằng chứng cho Defect Report khi test fail
    onTestFailed(async () => {
      if (!driver) return;
      const png = await driver.takeScreenshot();
      mkdirSync('e2e-reports/screenshots', { recursive: true });
      const name = task.name.replace(/[^a-zA-Z0-9-_]/g, '_');
      writeFileSync(`e2e-reports/screenshots/${name}.png`, png, 'base64');
    });
  });

  afterEach(async () => {
    await driver?.quit();
    driver = undefined;
  });

  return {
    get: () => {
      if (!driver) throw new Error('Driver chưa được khởi tạo');
      return driver;
    },
  };
}
```

### 5.7. `e2e/utils/csv.ts` và `dataGenerator.ts`

```ts
// e2e/utils/csv.ts
import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';

export function readCsv<T extends Record<string, string>>(path: string): T[] {
  return parse(readFileSync(path, 'utf-8'), {
    columns: true,
    skip_empty_lines: true,
    bom: true,               // an toàn khi Excel lưu UTF-8 có BOM
    trim: false,
  }) as T[];
}
```

```ts
// e2e/utils/dataGenerator.ts
export const randomSuffix = (): string => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

/** Thay {RANDOM} trong dữ liệu CSV bằng chuỗi ngẫu nhiên để tránh trùng email */
export const resolvePlaceholders = (value: string, suffix = randomSuffix()): string =>
  value.replaceAll('{RANDOM}', suffix);
```

---

## 6. Quy trình chạy test hằng ngày

**Terminal 1 — chạy EduMi (giữ nguyên, không tắt):**

```bash
npm run dev          # http://localhost:3000
```

**Terminal 2 — chạy test:**

```bash
npm run test:e2e
```

Chrome sẽ tự mở, thao tác, rồi đóng. Nếu EduMi không chạy, test sẽ lỗi kết nối — đó là **Entry criteria** trong Test Plan.

> 💡 Dùng `npm run build && npm start` thay cho `npm run dev` khi chạy regression chính thức (RUN-01, RUN-02): ổn định hơn, ít bị biên dịch lại giữa chừng.

---

## 7. Ví dụ hoàn chỉnh: module Đăng nhập

### 7.1. Page Object — `e2e/pages/LoginPage.ts`

Quy tắc: **chỉ thao tác và trả dữ liệu, không assertion**.

```ts
import { By } from 'selenium-webdriver';
import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
  // ⚠️ CẬP NHẬT locator theo DOM thực tế của EduMi (xem mục 9: thêm data-testid)
  private readonly emailInput = By.css("[data-testid='login-email']");
  private readonly passwordInput = By.css("[data-testid='login-password']");
  private readonly submitButton = By.css("[data-testid='login-submit']");
  private readonly errorMessage = By.css("[data-testid='login-error']");

  async openPage(): Promise<this> {
    await this.open('/login');
    await this.waitVisible(this.emailInput);
    return this;
  }

  async login(email: string, password: string): Promise<void> {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  isErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(this.errorMessage);
  }

  getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }
}
```

### 7.2. Dữ liệu — `e2e/data/login_data.csv`

Dòng đầu là header, mã hóa UTF-8, cột đầu là `tcId`, có cột `expected...`. **Không sửa cột expected cho khớp lỗi của website** — nếu khác thì TC Fail và phải báo Defect.

```csv
tcId,email,password,expectedResult,expectedMessage
TC-LOGIN-001,{STUDENT_EMAIL},{STUDENT_PASSWORD},SUCCESS,
TC-LOGIN-002,{STUDENT_EMAIL},WrongPass@123,FAIL,Email hoặc mật khẩu không chính xác.
TC-LOGIN-003,notexist@example.com,Abcd@1234,FAIL,Email hoặc mật khẩu không chính xác.
TC-LOGIN-004,,Abcd@1234,FAIL,Vui lòng nhập đầy đủ Email và Mật khẩu.
```

> Thông báo lấy từ `src/app/api/auth/login/route.ts` tại thời điểm viết. Nếu giao diện hiển thị khác, hãy xác nhận lại với Test Lead trước khi quyết định đó là lỗi website hay lỗi script.

### 7.3. Test — `e2e/tests/login.test.ts`

Quy tắc: **assertion nằm ở đây, không có `By` hoặc `findElement`**.

```ts
import { describe, expect, it } from 'vitest';
import { useDriver } from '../base/BaseTest';
import { env } from '../config/env';
import { LoginPage } from '../pages/LoginPage';
import { readCsv } from '../utils/csv';

interface LoginRow extends Record<string, string> {
  tcId: string;
  email: string;
  password: string;
  expectedResult: string;
  expectedMessage: string;
}

const rows = readCsv<LoginRow>('e2e/data/login_data.csv').map((row) => ({
  ...row,
  email: row.email
    .replace('{STUDENT_EMAIL}', env.accounts.student.email),
  password: row.password
    .replace('{STUDENT_PASSWORD}', env.accounts.student.password),
}));

describe('M2 - Đăng nhập', () => {
  const browser = useDriver();

  it.each(rows)('$tcId: $email', async (row) => {
    const loginPage = await new LoginPage(browser.get()).openPage();
    await loginPage.login(row.email, row.password);

    if (row.expectedResult === 'SUCCESS') {
      await browser.get().wait(async () => !(await loginPage.getCurrentUrl()).includes('/login'), env.timeoutMs);
      expect(await loginPage.getCurrentUrl(), `${row.tcId} phải rời trang login`).not.toContain('/login');
    } else {
      expect(await loginPage.isErrorDisplayed(), `${row.tcId} phải hiển thị lỗi`).toBe(true);
      expect(await loginPage.getErrorMessage(), row.tcId).toBe(row.expectedMessage);
      expect(await loginPage.getCurrentUrl(), `${row.tcId} phải ở lại /login`).toContain('/login');
    }
  });
});
```

Tên test chứa **TC ID** để truy vết với BM03 và dùng được `-t "TC-LOGIN-001"`.

---

## 8. Smoke test — kiểm tra cấu hình đã chạy (BẮT BUỘC làm trước)

`e2e/tests/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { useDriver } from '../base/BaseTest';
import { env } from '../config/env';

describe('Smoke', () => {
  const browser = useDriver();

  it('SMOKE-001: mở được trang chủ EduMi', async () => {
    await browser.get().get(env.baseUrl);
    expect(await browser.get().getTitle()).not.toBe('');
  });
});
```

Chạy:

```bash
npm run dev                               # terminal 1
npm run test:e2e -- e2e/tests/smoke.test.ts   # terminal 2
```

Kỳ vọng: Chrome mở, trang chủ tải xong, test **Pass**. Chỉ khi smoke test pass, Framework Owner mới được merge skeleton và thông báo cả nhóm.

Nếu `npm test` (unit) vẫn chạy bình thường và **không** chạy smoke test, tức là bước 5.1 đã đúng.

---

## 9. Thêm `data-testid` vào EduMi (khuyến nghị mạnh)

Next.js + Tailwind sinh class dài và dễ đổi, nên dùng `data-testid` thay cho class CSS. Đây là **phần duy nhất bạn sửa trong code EduMi** để phục vụ test.

```tsx
<input data-testid="login-email" ... />
<button data-testid="login-submit" ... />
```

Quy ước đặt tên: `<màn hình>-<phần tử>` bằng chữ thường, nối bằng gạch ngang (ví dụ `register-password`, `class-join-button`).

Thứ tự ưu tiên locator: `data-testid` > `id` duy nhất > `name` > CSS ngắn gọn > XPath tương đối. **Cấm XPath tuyệt đối** (`/html/body/div[2]/...`).

> Khi thêm `data-testid`, tạo PR riêng (`chore(testid): ...`) nhỏ gọn để dễ review và không làm đổi hành vi giao diện.

---

## 10. Quy tắc viết test (sẽ bị review)

1. **Page class không chứa assertion** (`expect`). Page chỉ thao tác và trả dữ liệu.
2. **Test class không chứa `By` hoặc `driver.findElement`**. Mọi locator nằm trong Page.
3. **Cấm `setTimeout`/sleep cố định** để chờ. Chỉ dùng `driver.wait(until...)`.
4. Mỗi test **độc lập**: không phụ thuộc thứ tự chạy, tự chuẩn bị dữ liệu.
5. Không hard-code URL, tài khoản, timeout. Dùng `env` hoặc CSV.
6. Dữ liệu test nằm trong **CSV** (UTF-8, header, cột `tcId`, cột `expected...`). Dữ liệu dễ trùng (email, username) dùng `{RANDOM}`.
7. Tên test chứa TC ID: `it('TC-XXX-001: ...')`.
8. **Không sửa expected cho khớp lỗi.** Khác với kỳ vọng → TC Fail → báo Defect.
9. Phân biệt rõ **lỗi website** (báo bug) và **lỗi script** (sửa script, label `test-script`).

---

## 11. Làm việc với Git (repo đã có commitlint + husky)

- Nhánh: `feature/e2e-<module>-<mô-tả>`, `fix/e2e-<module>-<mô-tả>`, `docs/e2e-<mô-tả>`.
- Commit theo Conventional Commits (hook sẽ kiểm tra):
  - `test(login): add LoginPage and login_data.csv`
  - `fix(e2e): replace fixed wait with explicit wait`
  - `chore(testid): add data-testid to login form`
- Trước khi push: chạy `npm run test:e2e -- <file của mình>` và `npm test` (unit test không được hỏng).
- Mỗi PR ≤ khoảng 300 dòng, có ít nhất 1 người review, dùng Squash and merge.
- File chung (`e2e/base`, `e2e/config`, `vitest.e2e.config.ts`) chỉ sửa qua PR được Framework Owner duyệt.

---

## 12. Xử lý sự cố thường gặp

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|-------------|------------------------|------------|
| `ECONNREFUSED localhost:3000` | EduMi chưa chạy | Chạy `npm run dev` ở terminal khác |
| Không tìm thấy Chrome / ChromeDriver | Chrome chưa cài hoặc đặt ở đường dẫn lạ | Cài Chrome mặc định; Selenium Manager tự tải driver |
| Tải ChromeDriver lỗi do mạng/proxy | Selenium Manager cần Internet | Thử lại hoặc đổi mạng; kiểm tra firewall |
| `document is not defined` / lỗi `jsdom` | Chạy nhầm bằng config unit test | Dùng `npm run test:e2e`, không dùng `npm test` |
| `npm test` chạy cả E2E | Chưa thêm `exclude: ['e2e/**']` | Làm mục 5.1 |
| Test fail ngẫu nhiên (flaky) | Thiếu wait, trang chưa tải xong | Dùng `waitVisible`/`until`, không dùng sleep |
| `Thiếu biến môi trường ...` | Chưa tạo `.env.e2e` | Copy từ `.env.e2e.example` và điền |
| `process.loadEnvFile is not a function` | Node quá cũ | Nâng lên Node ≥ 20.12 |
| Email đăng ký bị trùng | Dùng dữ liệu cố định | Dùng `{RANDOM}` trong CSV |
| Hai người chạy test cùng lúc làm hỏng dữ liệu | Dùng chung DB | Mỗi người dùng email/lớp riêng, hoặc thống nhất DB test |
| Ảnh chụp lỗi không có | Test fail trước khi driver tạo xong | Xem lỗi gốc, ảnh nằm ở `e2e-reports/screenshots/` |

---

## 13. Các vấn đề cần chốt trước khi viết hàng loạt test

| # | Vấn đề | Người quyết định |
|---|--------|------------------|
| 1 | Dùng DB test (Supabase) riêng hay DB dev? Tài khoản student/teacher/staff seed ở đâu? | Test Lead |
| 2 | Xác thực OTP: đọc mã từ DB, mailbox test, hay đánh dấu Manual? | Test Lead + Framework Owner |
| 3 | AI Assistant: chỉ test luồng điều khiển và trạng thái UI, **không** assert nội dung câu trả lời AI | Cả nhóm |
| 4 | Thời điểm "đóng băng UI" của từng module để tránh sửa locator liên tục | Từng chủ module |
| 5 | Có chạy CI (GitHub Actions, headless) không? (tùy chọn) | Test Lead |

---

## 14. Checklist cho thành viên mới bắt đầu

- [ ] Cài Node ≥ 20, Chrome, Git
- [ ] `git pull`, `npm install`
- [ ] Tạo `.env.e2e` từ `.env.e2e.example` và điền tài khoản test
- [ ] Chạy `npm run dev` và mở được `http://localhost:3000`
- [ ] Chạy `npm run test:e2e -- e2e/tests/smoke.test.ts` → **Pass**
- [ ] Chạy `npm test` → unit test vẫn xanh
- [ ] Đọc mục 10 (quy tắc) trước khi viết test đầu tiên
- [ ] Tạo nhánh `feature/e2e-<module>-...` và bắt đầu

---

## 15. Phân công khởi động (đề xuất)

| Bước | Việc | Người | Hạn |
|------|------|-------|-----|
| 1 | Cài thư viện, tạo `e2e/` skeleton (mục 3–5), sửa `vitest.config.ts`, thêm script | Framework Owner | Ngày 1–2 |
| 2 | Chạy smoke test, sửa lỗi cấu hình trong file này | Framework Owner | Ngày 2 |
| 3 | Merge skeleton qua PR, thông báo nhóm | Test Lead | Ngày 3 |
| 4 | Mỗi người tạo `.env.e2e`, chạy smoke test | Tất cả | Ngày 3 |
| 5 | Mỗi người viết Page + CSV + Test cho module của mình | Tất cả | Tuần 2 |

