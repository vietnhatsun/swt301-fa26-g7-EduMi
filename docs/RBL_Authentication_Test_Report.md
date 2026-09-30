# BÁO CÁO RBL: KIỂM THỬ CHỨC NĂNG AUTHENTICATION (XÁC THỰC NGƯỜI DÙNG)
**Dự án:** Nền tảng Giáo dục Trực tuyến EduMi (SWP391)  
**Công nghệ:** TypeScript, Next.js 16 (App Router), Supabase, Web Crypto API  
**Framework kiểm thử:** **Vitest** (Native Vite/Next.js Testing Framework)

---

## I. TỔNG QUAN VỀ KIỂM THỬ HỆ THỐNG AUTHENTICATION

Hệ thống Authentication của EduMi được xây dựng theo mô hình **Claims-based Authentication** kết hợp **JWT HMAC-SHA256 (Web Crypto API)** và **Cookie HTTP-Only**, hỗ trợ luồng xác thực hai bước qua **mã OTP 6 số (Email)**.

Toàn bộ test suite được viết bằng **Vitest** đặt trong thư mục `tests/auth/`, đảm bảo kiểm thử toàn diện từ tầng lõi xử lý mã hóa đến các API Route Handlers và Middleware.

```text
tests/
└── auth/
    ├── auth-session.test.ts   # Unit Test: Ký chữ ký số, xác minh token & trích xuất Claims
    ├── login.test.ts          # API Test: Đăng nhập, kiểm tra mật khẩu, tài khoản active/banned
    ├── register.test.ts       # API Test: Đăng ký tài khoản, validation & sinh mã OTP
    ├── verify-otp.test.ts     # API Test: Kích hoạt tài khoản bằng mã OTP 6 số
    ├── resend-otp.test.ts     # API Test: Gửi lại mã OTP và vô hiệu hóa mã cũ
    ├── logout.test.ts         # API Test: Đăng xuất và dọn dẹp cookie phiên
    └── middleware.test.ts     # Security Test: Chặn route bảo vệ (/profile, /dashboard) & RBAC
```

---

## II. BUSINESS LOGIC CỦA TỪNG TÍNH NĂNG ĐƯỢC TEST

### 1. Quản lý Phiên & Token Claims (`src/lib/auth-session.ts`)
* **Ký chữ ký số HMAC-SHA256:** Sử dụng Web Crypto API chuẩn W3C ký số Token JWT bao gồm Header (`HS256`), Payload Claims (`sub`, `email`, `fullName`, `role`, `studentCode`, `iat`, `exp`).
* **Thời hạn phiên:** Mặc định 7 ngày (`604,800` giây).
* **Kiểm tra tính toàn vẹn (Anti-tampering):** Token được kiểm tra chữ ký với Secret Key. Nếu bất kỳ trường dữ liệu nào bị thay đổi trái phép (ví dụ sửa `role: "student"` thành `"admin"`), hàm xác thực trả về `null`.
* **Kiểm tra hạn sử dụng:** Nếu `exp < now`, token tự động bị vô hiệu hóa.

### 2. Đăng ký tài khoản (`src/app/api/auth/register/route.ts`)
* **Validation đầu vào:**
  * Họ và tên: Tối thiểu 2 ký tự.
  * Email: Đúng định dạng chuẩn RFC qua biểu thức chính quy (Regex).
  * Mật khẩu: Tối thiểu 8 ký tự.
* **Kiểm tra trạng thái email:**
  * Nếu đã đăng ký bằng Google OAuth (`password_hash == null`): Chặn và hướng dẫn đăng nhập bằng Google (HTTP 409).
  * Nếu email đã tồn tại và đã kích hoạt (`is_verified == true`): Báo lỗi tài khoản đã tồn tại (HTTP 409).
  * Nếu email đã đăng ký nhưng chưa kích hoạt OTP: Cho phép cập nhật lại thông tin và mật khẩu mới.
* **Mã hóa:** Băm mật khẩu bằng `bcrypt` với 12 salt rounds.
* **Khởi tạo:** Tạo user trong bảng `users` (`status: "pending_verification"`), sinh mã học sinh duy nhất dạng `EDM-XXXXXX` trong `student_profiles`.
* **OTP Email:** Tạo mã số 6 chữ số ngẫu nhiên, thời hạn 10 phút, lưu vào `verification_tokens` và gửi qua Resend Email API.

### 3. Xác thực OTP kích hoạt tài khoản (`src/app/api/auth/verify-otp/route.ts`)
* **Kiểm tra đầu vào:** Email và mã OTP bắt buộc đủ 6 chữ số.
* **Xác minh mã:** Tra cứu trong bảng `verification_tokens` với điều kiện: đúng email, đúng mã, đúng loại `email_verification`, và `is_used = false`.
* **Kiểm tra hạn dùng:** Nếu quá 10 phút kể từ lúc tạo, trả về lỗi hết hạn (HTTP 400).
* **Kích hoạt tài khoản:** Cập nhật `users.is_verified = true`, `users.status = 'active'`, và đánh dấu mã OTP `is_used = true`.

### 4. Gửi lại mã OTP (`src/app/api/auth/resend-otp/route.ts`)
* **Kiểm tra tài khoản:** Email phải tồn tại trong hệ thống. Nếu tài khoản đã kích hoạt rồi thì yêu cầu đăng nhập thay vì gửi lại OTP.
* **Thu hồi mã cũ:** Cập nhật toàn bộ mã OTP chưa dùng của email này thành `is_used = true`.
* **Cấp phát mã mới:** Sinh mã OTP 6 số mới, hạn 10 phút, lưu DB và gửi lại email cho người dùng.

### 5. Đăng nhập (`src/app/api/auth/login/route.ts`)
* **Kiểm tra đầu vào:** Email và mật khẩu không được rỗng.
* **Tìm kiếm người dùng:** Tra cứu người dùng theo email. Nếu không tìm thấy, trả về HTTP 401 ("Email hoặc mật khẩu không chính xác" - thông báo chung để chống tấn công rà quét tài khoản).
* **Kiểm duyệt trạng thái:**
  * Chưa kích hoạt OTP: Trả về HTTP 403 kèm cờ `needVerification: true`.
  * Tài khoản bị khóa (`status = "banned"`): Trả về HTTP 403.
  * Tài khoản Google: Trả về HTTP 400 yêu cầu đăng nhập bằng Google.
* **Xác thực mật khẩu:** Sử dụng `bcrypt.compare` đối chiếu mật khẩu nhập với chuỗi băm trong DB.
* **Cấp phát phiên:** Ký JWT Claims và đính kèm vào Cookie `edumi_session` với các cờ bảo mật cao: `httpOnly: true`, `sameSite: "lax"`, `secure: true` (ở production), `path: "/"`.

### 6. Đăng xuất (`src/app/api/auth/logout/route.ts`)
* Thiết lập Cookie `edumi_session` với `maxAge = 0` để trình duyệt lập tức xóa phiên làm việc.

### 7. Middleware bảo vệ Route & RBAC (`src/middleware.ts`)
* Chạy tại Edge Runtime, kiểm tra trước khi bất kỳ page nào render.
* Chặn truy cập vào các đường dẫn riêng tư: `/profile`, `/dashboard`, `/practice`.
  * Nếu không có cookie hoặc token giả mạo/hết hạn: Tự động redirect về `/login?redirect=...`.
  * Nếu hợp lệ: Giải nén Claims và đính kèm vào Request Headers (`x-user-id`, `x-user-email`, `x-user-role`, `x-user-name`) cho các Server Components.
* Nếu người dùng đã đăng nhập mà truy cập lại trang `/login` hoặc `/register`: Tự động chuyển hướng vào `/profile`.

---

## III. MA TRẬN TEST CASES CHI TIẾT (TEST SUITE SPECIFICATION)

| Test ID | Module / File | Mô tả kịch bản kiểm thử | Input Data | Expected Output | Kết quả |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-01** | `auth-session` | Tạo JWT token hợp lệ gồm 3 phần (header.payload.sig) | Payload chứa ID, email, role: 'student' | Chuỗi Token hợp lệ, đúng cấu trúc HS256, thời hạn 7 ngày | **PASS** |
| **TC-SEC-02** | `auth-session` | Xác thực và trích xuất đúng toàn bộ Claims từ token | Token hợp lệ vừa tạo | Object `SessionClaims` khớp 100% dữ liệu gốc | **PASS** |
| **TC-SEC-03** | `auth-session` | Ngăn chặn hành vi giả mạo quyền hạn (Tampered Payload) | Sửa đổi payload từ `role: student` sang `admin` | Trả về `null`, cảnh báo token bị giả mạo | **PASS** |
| **TC-SEC-04** | `auth-session` | Ngăn chặn hành vi sửa chữ ký số (Invalid Signature) | Sửa đổi chuỗi signature | Trả về `null` | **PASS** |
| **TC-SEC-05** | `auth-session` | Tự động từ chối token đã hết hạn | Token có thời hạn âm (`exp < now`) | Trả về `null` | **PASS** |
| **TC-SEC-06** | `auth-session` | Xử lý an toàn khi token rỗng, null hoặc sai định dạng | `""`, `"not-a-token"`, `null`, `undefined` | Trả về `null`, không gây crash hệ thống | **PASS** |
| **TC-LOG-01** | `POST /api/auth/login` | Đăng nhập thành công với tài khoản học sinh hợp lệ | Email & Mật khẩu chính xác, đã kích hoạt | HTTP 200, trả về thông tin user, Set-Cookie `edumi_session` | **PASS** |
| **TC-LOG-02** | `POST /api/auth/login` | Báo lỗi 400 khi thiếu email hoặc password | `email: ""` hoặc `password: ""` | HTTP 400, "Vui lòng nhập đầy đủ Email và Mật khẩu" | **PASS** |
| **TC-LOG-03** | `POST /api/auth/login` | Báo lỗi 401 khi email không tồn tại trong hệ thống | `email: "notfound@edumi.vn"` | HTTP 401, "Email hoặc mật khẩu không chính xác" | **PASS** |
| **TC-LOG-04** | `POST /api/auth/login` | Báo lỗi 401 khi mật khẩu không trùng khớp | Password sai | HTTP 401, "Email hoặc mật khẩu không chính xác" | **PASS** |
| **TC-LOG-05** | `POST /api/auth/login` | Chặn 403 khi tài khoản chưa kích hoạt mã OTP | User có `is_verified: false` | HTTP 403, trả về `needVerification: true` | **PASS** |
| **TC-LOG-06** | `POST /api/auth/login` | Chặn 403 khi tài khoản bị khóa (banned) | User có `status: "banned"` | HTTP 403, "Tài khoản của bạn đã bị khóa" | **PASS** |
| **TC-LOG-07** | `POST /api/auth/login` | Báo lỗi 400 khi đăng nhập tài khoản tạo từ Google | User có `password_hash: null` | HTTP 400, yêu cầu đăng nhập bằng Google | **PASS** |
| **TC-REG-01** | `POST /api/auth/register` | Đăng ký thành công học sinh mới, sinh profile & OTP | Họ tên >= 2 ký tự, Email chuẩn, Pass >= 8 | HTTP 201, tạo mã học sinh, gọi hàm gửi mail OTP | **PASS** |
| **TC-REG-02** | `POST /api/auth/register` | Báo lỗi 400 khi họ tên dưới 2 ký tự | `fullName: "A"` | HTTP 400, "Họ và tên phải có tối thiểu 2 ký tự" | **PASS** |
| **TC-REG-03** | `POST /api/auth/register` | Báo lỗi 400 khi mật khẩu yếu (< 8 ký tự) | `password: "12345"` | HTTP 400, "Mật khẩu phải có tối thiểu 8 ký tự" | **PASS** |
| **TC-REG-04** | `POST /api/auth/register` | Báo lỗi 400 khi email sai định dạng | `email: "sai-dinh-dang"` | HTTP 400, "Địa chỉ email không hợp lệ" | **PASS** |
| **TC-REG-05** | `POST /api/auth/register` | Báo lỗi 409 khi email đã kích hoạt trước đó | Email đã tồn tại và `is_verified: true` | HTTP 409, "Email này đã được đăng ký tài khoản" | **PASS** |
| **TC-REG-06** | `POST /api/auth/register` | Báo lỗi 409 khi email đã dùng đăng ký Google | User Google đã tồn tại trong DB | HTTP 409, `provider: "google"` | **PASS** |
| **TC-OTP-01** | `POST /api/auth/verify-otp` | Xác thực OTP thành công, kích hoạt tài khoản | Email đúng, OTP 6 số còn hạn | HTTP 200, user chuyển `active`, token mark `is_used` | **PASS** |
| **TC-OTP-02** | `POST /api/auth/verify-otp` | Báo lỗi 400 khi OTP không tồn tại hoặc đã dùng | OTP sai hoặc đã dùng | HTTP 400, "Mã OTP không chính xác hoặc đã được sử dụng" | **PASS** |
| **TC-OTP-03** | `POST /api/auth/verify-otp` | Báo lỗi 400 khi OTP đã hết hạn (quá 10 phút) | OTP quá 10 phút | HTTP 400, "Mã OTP đã hết hạn" | **PASS** |
| **TC-OTP-04** | `POST /api/auth/verify-otp` | Báo lỗi 400 khi thiếu email hoặc độ dài OTP != 6 | `otp: "123"` | HTTP 400 | **PASS** |
| **TC-RES-01** | `POST /api/auth/resend-otp` | Gửi lại mã OTP thành công, vô hiệu hóa mã cũ | Email hợp lệ chưa kích hoạt | HTTP 200, gọi hàm gửi mail OTP mới | **PASS** |
| **TC-RES-02** | `POST /api/auth/resend-otp` | Báo lỗi 404 khi email không tồn tại | Email chưa từng đăng ký | HTTP 404, "Không tìm thấy thông tin đăng ký" | **PASS** |
| **TC-RES-03** | `POST /api/auth/resend-otp` | Báo lỗi 400 khi tài khoản đã kích hoạt rồi | User đã verify | HTTP 400, "Tài khoản này đã được xác thực trước đó" | **PASS** |
| **TC-OUT-01** | `POST /api/auth/logout` | Đăng xuất thành công, dọn dẹp cookie phiên | Gọi POST logout | HTTP 200, `Set-Cookie: edumi_session; Max-Age=0` | **PASS** |
| **TC-MID-01** | `middleware` | Chuyển hướng người dùng chưa đăng nhập khi vào `/profile` | Truy cập `/profile` không có cookie | HTTP 307 Redirect về `/login?redirect=%2Fprofile` | **PASS** |
| **TC-MID-02** | `middleware` | Xóa cookie rác và chuyển hướng khi token giả mạo | Cookie chứa token không hợp lệ | HTTP 307 Redirect `/login`, xóa cookie | **PASS** |
| **TC-MID-03** | `middleware` | Cho phép truy cập route bảo vệ khi có token hợp lệ | Cookie chứa session token chuẩn | Cho phép qua, gán headers (`x-user-id`, `x-user-role`,...) | **PASS** |
| **TC-MID-04** | `middleware` | Tự động chuyển về `/profile` nếu đã đăng nhập mà vào `/login` | Đã có cookie hợp lệ truy cập `/login` | HTTP 307 Redirect `/profile` | **PASS** |

---

## IV. KẾT QUẢ THỰC THI KIỂM THỬ THỰC TẾ

Lệnh chạy kiểm thử:
```bash
npm run test
```

Kết quả thực tế ghi nhận trên máy:
```text
> edumi@0.1.0 test
> vitest run

 RUN  v4.1.11 E:/Fall2026/SWP391/EduMi

 ✓ src/lib/utils.test.ts (1 test)
 ✓ tests/auth/auth-session.test.ts (9 tests)
 ✓ tests/auth/verify-otp.test.ts (5 tests)
 ✓ src/lib/mail.test.ts (2 tests)
 ✓ tests/auth/logout.test.ts (1 test)
 ✓ tests/auth/middleware.test.ts (5 tests)
 ✓ tests/auth/resend-otp.test.ts (4 tests)
 ✓ tests/auth/login.test.ts (7 tests)
 ✓ tests/auth/register.test.ts (6 tests)

 Test Files  9 passed (9)
      Tests  40 passed (40)
   Duration  1.43s
```
**Tổng kết:** **40/40 test cases** đều đạt kết quả **PASSED (100%)** với thời gian thực thi cực nhanh (1.43s).
