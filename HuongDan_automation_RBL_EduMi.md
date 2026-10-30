# HƯỚNG DẪN BÀI TẬP KIỂM THỬ TỰ ĐỘNG VỚI SELENIUM (RBL)
## Áp dụng cho Hệ thống Nền tảng Học tập & Luyện thi Trực tuyến EduMi
### Framework: Selenium 4 + JUnit 5 + Page Object Model (POM) + Data-driven CSV
### Quy mô: 5 Thành viên × 2 Modules = 10 Modules | 100 Test Cases chi tiết (10 TC / Module)

> **Môn học:** SWT301 — Software Testing | **Học kỳ:** Fall 2026 | **FPT University**  
> **Hình thức:** Bài tập nhóm 5 sinh viên (Resource-based Learning / Project-based Learning)  
> **Chuẩn tham chiếu quốc tế:** ISTQB CTFL v4.0 và ISO/IEC/IEEE 29119-3 (Software Testing Documentation)

---

## Mục lục

1. [Mục tiêu và bảng phân bổ 10 Modules cho 5 Thành viên](#1-mục-tiêu-và-bảng-phân-bổ-10-modules-cho-5-thành-viên)
2. [Hệ thống được kiểm thử (SUT) và môi trường](#2-hệ-thống-được-kiểm-thử-sut-và-môi-trường)
3. [Bộ biểu mẫu kiểm thử chuẩn ISTQB (BM01 – BM09)](#3-bộ-biểu-mẫu-kiểm-thử-chuẩn-istqb-bm01--bm09)
4. [Business Rules chi tiết cho toàn bộ 10 Modules](#4-business-rules-chi-tiết-cho-toàn-bộ-10-modules)
5. [Đặc tả 100 Test Cases chi tiết (10 Test Cases / Module)](#5-đặc-tả-100-test-cases-chi-tiết-10-test-cases--module)
6. [Xây dựng Framework Automation: POM + CSV](#6-xây-dựng-framework-automation-pom--csv)
7. [Test Execution Log và Defect Report](#7-test-execution-log-và-defect-report)
8. [Test Summary Report theo chuẩn ISTQB](#8-test-summary-report-theo-chuẩn-istqb)
9. [Bảng phân công RACI cho 5 thành viên & Kế hoạch 3 tuần](#9-bảng-phân-công-raci-cho-5-thành-viên--kế-hoạch-3-tuần)
10. [Quy trình làm việc trên GitHub & CI/CD](#10-quy-trình-làm-việc-trên-github--cicd)
11. [Tiêu chí đánh giá & Rubric chấm điểm (Thang điểm 10)](#11-tiêu-chí-đánh-giá--rubric-chấm-điểm)
12. [Checklist trước khi nộp bài](#12-checklist-trước-khi-nộp-bài)

---

## 1. Mục tiêu và bảng phân bổ 10 Modules cho 5 Thành viên

### 1.1. Mục tiêu bài tập
- Mỗi thành viên chịu trách nhiệm trọn vẹn theo chiều dọc (**Vertical Ownership**) cho **2 Modules liên quan**.
- Mỗi Module bắt buộc thiết kế **10 Test Cases kiểm thử tự động**, tổng cộng cả nhóm là **100 Test Cases**.
- Áp dụng đầy đủ các kỹ thuật thiết kế Black-box: Phân vùng tương đương (EP), Phân tích giá trị biên (BVA), Bảng quyết định (Decision Table), Chuyển trạng thái (State Transition), và Đoán lỗi (Error Guessing).

### 1.2. Bảng phân công 10 Modules cho 5 Thành viên

| Thành viên | Vai trò ngang | Mã Module | Tên Module kiểm thử (Phạm vi) | URL / Vị trí SUT | Số TC |
|:---:|---|:---:|---|---|:---:|
| **SV1** | **Test Lead** | **M1** | Xác thực Đăng nhập & Phân quyền Vai trò (Role Login) | `/login` | 10 |
| | | **M2** | Quản lý Phiên (Session JWT) & Bảo vệ Route riêng tư | `/profile`, Middleware | 10 |
| **SV2** | **Framework Owner** | **M3** | Đăng ký tài khoản người dùng mới (Register Validation) | `/register` | 10 |
| | | **M4** | Xác thực mã OTP Email & Kích hoạt tài khoản (Verify OTP) | `/auth/verify-otp` | 10 |
| **SV3** | **Doc Owner** | **M5** | Tìm kiếm & Bộ lọc Đề thi luyện tập đa tiêu chí (Exam Filter) | `/exam` | 10 |
| | | **M6** | Sảnh chờ thi & Modal xác nhận bắt đầu làm bài (Exam Lobby) | `/exam`, Modal Start | 10 |
| **SV4** | **Defect Manager**| **M7** | Phòng thi trực tuyến & Tương tác làm bài trắc nghiệm (Exam Room) | `/exam/:id` | 10 |
| | | **M8** | Nộp bài thi, Chấm điểm tự động & Xem kết quả (Result & LaTeX) | `/exam/:id/result` | 10 |
| **SV5** | **CI/QA Reviewer** | **M9** | Staff Quản lý Ngân hàng câu hỏi & Tạo đề thi (Staff Panel) | `/profile` (Tab Staff) | 10 |
| | | **M10** | AI Exam Scanner: Quét bóc tách đề thi & Preview LaTeX | Modal Scanner | 10 |
| **TỔNG CỘNG** | **5 Thành viên** | **10 M** | **Bao phủ toàn diện hệ thống EduMi** | | **100 TC** |

---

## 2. Hệ thống được kiểm thử (SUT) và môi trường

| Thành phần | Công nghệ / Môi trường | Ghi chú vận hành |
|---|---|---|
| **SUT Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS | Chạy tại: `http://localhost:3000` |
| **SUT Backend** | Next.js Route Handlers (`/api/*`), Supabase Database | API nội bộ xử lý Auth, Exams, AI Scanner |
| **Trình duyệt kiểm thử** | Google Chrome (bản ổn định mới nhất) | Chạy chế độ GUI hoặc Headless |
| **Công cụ Automation** | Java 17 (LTS), Maven 3.8+, Selenium WebDriver 4.21+, JUnit 5.10+, WebDriverManager 5.7+ | Framework kiểm thử tự động độc lập |
| **IDE đề xuất** | IntelliJ IDEA (Community hoặc Ultimate) / VS Code | Cài plugin Lombok, JUnit 5 |

### Dữ liệu tài khoản test chuẩn trong EduMi:
- `student@edumi.vn` / `Secret@123` (Học sinh - Active)
- `teacher@edumi.vn` / `Teacher@123` (Giáo viên - Active)
- `parent@edumi.vn` / `Parent@123` (Phụ huynh - Active)
- `staff@edumi.vn` / `Staff@123` (Quản trị viên Staff - Active)
- `unverified@edumi.vn` / `Secret@123` (Chưa xác thực OTP)
- `banned@edumi.vn` / `Secret@123` (Tài khoản bị khóa)

---

## 3. Bộ biểu mẫu kiểm thử chuẩn ISTQB (BM01 – BM09)

| STT | Mã biểu mẫu | Tên tài liệu theo chuẩn ISO/IEC/IEEE 29119-3 | File nộp | Bắt buộc |
|:---:|---|---|---|:---:|
| 1 | **BM01** | Test Plan (Kế hoạch kiểm thử rút gọn) | `docs/BM01_TestPlan.md` | ✅ |
| 2 | **BM02** | Business Rules & Test Conditions Matrix (10 Modules) | `docs/BM02_BusinessRules.md` | ✅ |
| 3 | **BM03** | Test Case Specification (100 Test Cases) | `docs/BM03_TestCases.xlsx` (hoặc `.md`) | ✅ |
| 4 | **BM04** | Requirements Traceability Matrix (RTM) | `docs/BM04_RTM.md` | ✅ |
| 5 | **BM05** | Test Data (10 file CSV chuẩn UTF-8) | `src/test/resources/testdata/*.csv` | ✅ |
| 6 | **BM06** | Test Execution Log (Nhật ký thực thi test) | `docs/BM06_ExecutionLog.md` | ✅ |
| 7 | **BM07** | Defect Report (Báo cáo lỗi phần mềm) | GitHub Issues + `docs/BM07_DefectReport.md` | ✅ |
| 8 | **BM08** | Test Summary Report (Báo cáo tổng kết kiểm thử) | `docs/BM08_TestSummaryReport.md` | ✅ |
| 9 | **BM09** | Bảng phân công RACI & Đánh giá đóng góp 5 thành viên | `docs/BM09_PhanCong.md` | ✅ |

---

## 4. Business Rules chi tiết cho toàn bộ 10 Modules

### M1 – Xác thực Đăng nhập & Phân quyền Vai trò
- **BR-M1-01:** Nhập đúng Email và Password của học sinh chuyển hướng vào `/profile`.
- **BR-M1-02:** Sai Email hoặc Mật khẩu báo lỗi chung *"Email hoặc mật khẩu không chính xác"*.
- **BR-M1-03:** Để trống Email hoặc Mật khẩu bị chặn submit ở form client.
- **BR-M1-04:** Mật khẩu phân biệt hoa thường (`Secret@123` $\ne$ `secret@123`).
- **BR-M1-05:** Tài khoản chưa kích hoạt OTP (`is_verified = false`) bị chặn đăng nhập.
- **BR-M1-06:** Tài khoản bị khóa (`status = 'banned'`) bị chặn với thông báo thích hợp.
- **BR-M1-07:** Đăng nhập tài khoản Giáo viên hiển thị menu dành cho Giáo viên.
- **BR-M1-08:** Đăng nhập tài khoản Phụ huynh hiển thị giao diện theo dõi con cái.
- **BR-M1-09:** Đăng nhập tài khoản Staff hiển thị bảng quản lý đề thi.
- **BR-M1-10:** Kiểm tra bảo mật form đăng nhập trước SQL Injection (`' OR 1=1 --`).

### M2 – Quản lý Phiên & Bảo vệ Route bằng Middleware
- **BR-M2-01:** Sau khi đăng nhập thành công, Cookie `edumi_session` được thiết lập với cờ `HttpOnly`.
- **BR-M2-02:** Bấm nút "Đăng xuất" xóa sạch Cookie `edumi_session`.
- **BR-M2-03:** Người dùng chưa đăng nhập truy cập `/profile` bị Middleware chuyển hướng về `/login`.
- **BR-M2-04:** Lưu tham số `?redirect=` khi bị chuyển hướng để tự quay lại trang cũ sau khi đăng nhập.
- **BR-M2-05:** Người dùng đã đăng nhập truy cập lại trang `/login` tự động được chuyển vào `/profile`.
- **BR-M2-06:** Người dùng đã đăng nhập truy cập lại trang `/register` tự động chuyển vào `/profile`.
- **BR-M2-07:** Token phiên giả mạo chữ ký (Tampered Token) bị Middleware từ chối và xóa cookie.
- **BR-M2-08:** Token phiên hết hạn (Expired Token) tự động hết hiệu lực và yêu cầu đăng nhập lại.
- **BR-M2-09:** F5 Refresh lại trang không làm mất trạng thái đăng nhập của người dùng.
- **BR-M2-10:** Mở nhiều tab trên cùng một trình duyệt giữ đồng bộ phiên làm việc.

### M3 – Đăng ký tài khoản người dùng mới
- **BR-M3-01:** Đăng ký thành công với thông tin hợp lệ (Họ tên, Email mới, Mật khẩu $\ge 8$ ký tự).
- **BR-M3-02:** Họ tên dưới 2 ký tự bị báo lỗi không hợp lệ.
- **BR-M3-03:** Email sai định dạng RFC (thiếu `@`, thiếu domain) bị chặn submit.
- **BR-M3-04:** Email đã tồn tại và đã kích hoạt báo lỗi *"Email này đã được sử dụng"*.
- **BR-M3-05:** Mật khẩu 7 ký tự (dưới biên tối thiểu) bị báo lỗi độ dài.
- **BR-M3-06:** Mật khẩu đúng 8 ký tự (biên chuẩn) đăng ký thành công.
- **BR-M3-07:** Mật khẩu 32 ký tự (biên tối đa) đăng ký thành công.
- **BR-M3-08:** Mật khẩu 33 ký tự (vượt biên tối đa) bị chặn báo lỗi.
- **BR-M3-09:** Chọn đúng vai trò khi đăng ký (Học sinh, Giáo viên, Phụ huynh).
- **BR-M3-10:** Đăng ký thành công tự động chuyển hướng sang màn hình nhập mã xác thực OTP.

### M4 – Xác thực mã OTP Email & Kích hoạt tài khoản
- **BR-M4-01:** Nhập đúng mã OTP 6 số kích hoạt tài khoản thành công (`status: active`).
- **BR-M4-02:** Nhập sai mã OTP hiển thị thông báo *"Mã xác thực không chính xác"*.
- **BR-M4-03:** Nhập thiếu số (dưới 6 chữ số) nút "Xác nhận" bị vô hiệu hóa.
- **BR-M4-04:** Nhập ký tự chữ cái vào ô OTP không được chấp nhận (chỉ nhận số 0-9).
- **BR-M4-05:** Mã OTP đã sử dụng (`is_used = true`) không thể dùng lại lần 2.
- **BR-M4-06:** Mã OTP quá 10 phút kể từ lúc gửi báo lỗi hết hạn.
- **BR-M4-07:** Bấm nút "Gửi lại mã OTP" sinh mã mới và gửi lại email thành công.
- **BR-M4-08:** Nút gửi lại mã có bộ đếm chờ 60 giây chống spam.
- **BR-M4-09:** Sau khi kích hoạt OTP thành công, tự động đăng nhập hoặc chuyển sang trang `/login`.
- **BR-M4-10:** Bấm quay lại sửa email từ màn hình OTP hoạt động chính xác.

### M5 – Tìm kiếm & Bộ lọc Đề thi luyện tập đa tiêu chí
- **BR-M5-01:** Tìm kiếm theo từ khóa tên đề thi không phân biệt hoa thường ("toán" = "TOÁN").
- **BR-M5-02:** Tìm kiếm không tìm thấy kết quả hiển thị thông báo rỗng phù hợp.
- **BR-M5-03:** Lọc đề thi theo Khối Lớp 10 chỉ hiện các đề Lớp 10.
- **BR-M5-04:** Lọc đề thi theo Khối Lớp 11 chỉ hiện các đề Lớp 11.
- **BR-M5-05:** Lọc đề thi theo Khối Lớp 12 chỉ hiện các đề Lớp 12.
- **BR-M5-06:** Lọc theo Môn học (Toán, Vật lý, Hóa học, Ngữ văn...) hiển thị đúng thẻ đề thi.
- **BR-M5-07:** Lọc theo Độ khó (Dễ, Trung bình, Nâng cao).
- **BR-M5-08:** Kết hợp đồng thời 3 bộ lọc (Lớp 12 + Môn Toán + Nâng cao).
- **BR-M5-09:** Nhập ký tự đặc biệt XSS `<script>alert(1)</script>` không gây crash trang.
- **BR-M5-10:** Bấm nút "Xóa tất cả bộ lọc" đưa danh sách về trạng thái mặc định ban đầu.

### M6 – Sảnh chờ thi & Modal xác nhận bắt đầu làm bài
- **BR-M6-01:** Click vào thẻ đề thi hiển thị Modal chi tiết thông tin đề thi.
- **BR-M6-02:** Modal hiển thị chính xác tên đề, số lượng câu hỏi, thời gian làm bài (phút).
- **BR-M6-03:** Hiển thị cấu trúc đề thi (Số câu trắc nghiệm đơn, số câu đúng sai, số câu điền số).
- **BR-M6-04:** Người dùng chưa đăng nhập bấm "Bắt đầu làm bài" yêu cầu đăng nhập.
- **BR-M6-05:** Người dùng đã đăng nhập bấm "Bắt đầu làm bài" chuyển hướng vào phòng thi `/exam/:id`.
- **BR-M6-06:** Bấm nút "Đóng" hoặc click ngoài modal đóng cửa sổ chờ thi an toàn.
- **BR-M6-07:** Đề thi hiển thị đúng badge trạng thái (Miễn phí / Pro).
- **BR-M6-08:** Hiển thị số lượt thi thực tế của cộng đồng học sinh.
- **BR-M6-09:** Kiểm tra tính năng chia sẻ đề thi (sao chép link đề thi vào clipboard).
- **BR-M6-10:** URL đề thi không tồn tại (`/exam/invalid-slug`) hiển thị trang 404 không crash.

### M7 – Phòng thi trực tuyến & Tương tác làm bài trắc nghiệm
- **BR-M7-01:** Đồng hồ đếm ngược bắt đầu chạy ngay khi vào phòng thi.
- **BR-M7-02:** Chọn đáp án câu trắc nghiệm A/B/C/D cập nhật trạng thái đã chọn.
- **BR-M7-03:** Click đổi sang đáp án khác cập nhật lại lựa chọn mới nhất.
- **BR-M7-04:** Trắc nghiệm Đúng/Sai cho phép chọn độc lập ĐÚNG hoặc SAI cho từng ý a, b, c, d.
- **BR-M7-05:** Click câu số bất kỳ ở thanh mục lục bên phải nhảy đúng tới câu hỏi đó.
- **BR-M7-06:** Nút "Câu tiếp theo" và "Câu trước" điều hướng mượt mà giữa các câu hỏi.
- **BR-M7-07:** Nút "Đánh dấu xem lại" (Flag) đổi màu câu hỏi trên bảng điều hướng.
- **BR-M7-08:** Chức năng phóng to / thu nhỏ cỡ chữ hoạt động tốt cho thí sinh.
- **BR-M7-09:** Các công thức Toán/Lý/Hóa LaTeX hiển thị sắc nét, không bị lỗi mã thô `$ ... $`.
- **BR-M7-10:** Đồng hồ đếm ngược chuyển sang cảnh báo đỏ khi còn dưới 5 phút làm bài.

### M8 – Nộp bài thi, Chấm điểm tự động & Xem kết quả
- **BR-M8-01:** Bấm "Nộp bài" khi chưa làm hết các câu hỏi hiển thị modal cảnh báo số câu chưa làm.
- **BR-M8-02:** Bấm "Tiếp tục làm bài" trên modal cảnh báo đóng modal và giữ nguyên bài thi.
- **BR-M8-03:** Hết giờ làm bài (`00:00`) hệ thống tự động khóa đề và nộp bài tự động.
- **BR-M8-04:** Nộp bài thành công chuyển hướng sang trang kết quả `/exam/:id/result`.
- **BR-M8-05:** Trang kết quả hiển thị tổng điểm chính xác trên thang điểm 10.
- **BR-M8-06:** Hiển thị thống kê số câu làm đúng, số câu làm sai, số câu bỏ qua.
- **BR-M8-07:** Kiểm tra tính điểm trắc nghiệm Đúng/Sai lũy tiến chuẩn Bộ GD&ĐT (0.1đ - 0.25đ - 0.5đ - 1.0đ).
- **BR-M8-08:** Hiển thị chi tiết đáp án đúng của từng câu kèm lời giải thích chi tiết.
- **BR-M8-09:** Công thức Toán LaTeX trong phần giải thích kết quả hiển thị chuẩn KaTeX.
- **BR-M8-10:** Bấm nút "Làm lại đề thi" reset toàn bộ câu trả lời và bắt đầu lượt thi mới.

### M9 – Staff Quản lý Ngân hàng câu hỏi & Tạo đề thi mới
- **BR-M9-01:** Tài khoản quyền Staff truy cập được tab "Quản lý đề thi" trong `/profile`.
- **BR-M9-02:** Tài khoản thường (Student) không truy cập được chức năng Staff.
- **BR-M9-03:** Điền tiêu đề đề thi, chọn môn học, chọn khối lớp, thời gian làm bài hợp lệ.
- **BR-M9-04:** Thêm câu hỏi trắc nghiệm mới vào đề thi thành công.
- **BR-M9-05:** Chọn đáp án đúng (A, B, C, D) cho từng câu hỏi tạo mới.
- **BR-M9-06:** Thêm câu hỏi dạng Đúng/Sai với 4 ý a, b, c, d.
- **BR-M9-07:** Xóa câu hỏi khỏi đề thi cập nhật lại tổng số lượng câu hỏi và tổng điểm.
- **BR-M9-08:** Live Math Preview hiển thị công thức trực quan ngay khi Staff gõ mã `$...$`.
- **BR-M9-09:** Nút "Lưu đề thi" kiểm tra tổng điểm phải đạt 10.0 điểm mới cho xuất bản.
- **BR-M9-10:** Đề thi tạo thành công xuất hiện ngay trên danh sách đề thi của hệ thống.

### M10 – AI Exam Scanner: Quét bóc tách đề thi & Preview LaTeX
- **BR-M10-01:** Bấm nút "Scan đề bằng AI" mở modal AI Exam Scanner.
- **BR-M10-02:** Kéo thả tải lên file ảnh đề thi định dạng PNG, JPG hợp lệ.
- **BR-M10-03:** Tải lên file sai định dạng (ví dụ `.exe`, `.mp3`) bị chặn với thông báo lỗi.
- **BR-M10-04:** Hỗ trợ tab dán trực tiếp nội dung văn bản đề thi từ file Word.
- **BR-M10-05:** Bấm "Quét đề bằng AI" hiển thị trạng thái loading đang xử lý.
- **BR-M10-06:** AI bóc tách chính xác danh sách câu hỏi và tự động nhận diện đáp án.
- **BR-M10-07:** Các công thức Toán học như $\Delta U = A + Q$, $\frac{a}{b}$ tự động render đẹp mắt qua KaTeX.
- **BR-M10-08:** Bấm nút xóa từng câu quét nhầm trên danh sách xem trước.
- **BR-M10-09:** Bấm "Áp dụng vào đề thi" chuyển toàn bộ câu hỏi vào form biên tập đề của Staff.
- **BR-M10-10:** Bấm "Hủy" hoặc nút đóng modal giải phóng bộ nhớ và không làm mất dữ liệu cũ.

---

## 5. Đặc tả 100 Test Cases chi tiết (10 Test Cases / Module)

### 👤 SV1 – Phụ trách Module M1 & M2 (20 Test Cases)

#### Module M1: Xác thực Đăng nhập & Phân quyền Vai trò
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M01-01** | Đăng nhập thành công với tài khoản học sinh | BR-M1-01 | DT | High | `student@edumi.vn` / `Secret@123` | Đăng nhập thành công, chuyển hướng vào `/profile` |
| **TC-M01-02** | Báo lỗi khi nhập sai mật khẩu | BR-M1-02 | DT | High | `student@edumi.vn` / `WrongPass@123` | Hiện Toast: *"Email hoặc mật khẩu không chính xác"* |
| **TC-M01-03** | Báo lỗi khi email không tồn tại | BR-M1-02 | EP | High | `notfound@edumi.vn` / `Secret@123` | Hiện Toast: *"Email hoặc mật khẩu không chính xác"* |
| **TC-M01-04** | Chặn submit khi để trống trường email | BR-M1-03 | EP | High | Email: `""` / `Secret@123` | Form client chặn submit, URL vẫn ở `/login` |
| **TC-M01-05** | Chặn submit khi để trống mật khẩu | BR-M1-03 | EP | High | `student@edumi.vn` / `""` | Form client chặn submit, URL vẫn ở `/login` |
| **TC-M01-06** | Mật khẩu phân biệt hoa thường | BR-M1-04 | EP | Medium | `student@edumi.vn` / `secret@123` | Đăng nhập thất bại, hiện toast lỗi |
| **TC-M01-07** | Chặn đăng nhập tài khoản chưa kích hoạt OTP | BR-M1-05 | DT | High | `unverified@edumi.vn` / `Secret@123` | Chặn đăng nhập, hiện thông báo chưa xác thực |
| **TC-M01-08** | Chặn đăng nhập tài khoản bị khóa (banned) | BR-M1-06 | DT | High | `banned@edumi.vn` / `Secret@123` | Hiện Toast: *"Tài khoản của bạn đã bị khóa"* |
| **TC-M01-09** | Đăng nhập tài khoản Giáo viên thành công | BR-M1-07 | DT | Medium | `teacher@edumi.vn` / `Teacher@123` | Đăng nhập thành công, giao diện giáo viên hiển thị |
| **TC-M01-10** | Chống tấn công SQL Injection vào ô đăng nhập | BR-M1-10 | EG | High | `' OR '1'='1` / `' OR '1'='1` | Đăng nhập thất bại, hệ thống an toàn không lỗi 500 |

#### Module M2: Quản lý Phiên (Session JWT) & Bảo vệ Route
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M02-01** | Kiểm tra thiết lập Cookie `edumi_session` | BR-M2-01 | EP | High | Đăng nhập `student@edumi.vn` | Cookie `edumi_session` tồn tại với cờ HttpOnly |
| **TC-M02-02** | Đăng xuất người dùng xóa cookie phiên | BR-M2-02 | ST | High | Bấm nút "Đăng xuất" ở Navbar | Cookie phiên bị xóa, chuyển về trang chủ |
| **TC-M02-03** | Chặn truy cập `/profile` khi chưa đăng nhập | BR-M2-03 | ST | High | Trình duyệt ẩn danh mở `/profile` | Tự động chuyển hướng về `/login?redirect=%2Fprofile` |
| **TC-M02-04** | Tự động quay lại trang cũ sau khi đăng nhập | BR-M2-04 | ST | High | Mở link có `?redirect=/exam/math-12` | Đăng nhập xong tự động điều hướng sang `/exam/math-12` |
| **TC-M02-05** | Đã đăng nhập truy cập lại `/login` bị điều hướng | BR-M2-05 | ST | Medium | Đã đăng nhập, gõ URL `/login` | Tự động chuyển hướng vào `/profile` |
| **TC-M02-06** | Đã đăng nhập truy cập lại `/register` bị điều hướng | BR-M2-06 | ST | Medium | Đã đăng nhập, gõ URL `/register` | Tự động chuyển hướng vào `/profile` |
| **TC-M02-07** | Từ chối token phiên bị sửa đổi chữ ký số | BR-M2-07 | EG | High | Sửa giá trị payload cookie session | Middleware từ chối, xóa cookie và đẩy về `/login` |
| **TC-M02-08** | Phiên đăng nhập giữ nguyên khi F5 Refresh trang | BR-M2-09 | ST | High | Nhấn F5 tại trang `/profile` | Người dùng vẫn ở trạng thái đăng nhập, không bị văng |
| **TC-M02-09** | Đồng bộ phiên đăng nhập giữa các tab trình duyệt | BR-M2-10 | EP | Medium | Mở tab mới truy cập `/profile` | Tab mới tự nhận phiên đăng nhập hợp lệ |
| **TC-M02-10** | Đăng xuất ở tab 1 thì tab 2 tự hết phiên | BR-M2-02 | ST | Medium | Tab 1 đăng xuất, tab 2 tải lại trang | Tab 2 bị điều hướng về màn hình đăng nhập |

---

### 👤 SV2 – Phụ trách Module M3 & M4 (20 Test Cases)

#### Module M3: Đăng ký tài khoản người dùng mới
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M03-01** | Đăng ký thành công tài khoản học sinh hợp lệ | BR-M3-01 | EP | High | `Nguyễn Văn A`, email timestamp, `Secret@123` | Đăng ký thành công, chuyển sang màn hình OTP |
| **TC-M03-02** | Báo lỗi khi họ và tên chỉ có 1 ký tự | BR-M3-02 | BVA | High | Họ tên: `"A"` (dưới biên 2 ký tự) | Báo lỗi: *"Họ và tên phải có tối thiểu 2 ký tự"* |
| **TC-M03-03** | Báo lỗi khi nhập email sai định dạng | BR-M3-03 | EP | High | Email: `student@`, `student@.com` | Trình duyệt báo lỗi email không hợp lệ |
| **TC-M03-04** | Báo lỗi khi email đã được sử dụng trước đó | BR-M3-04 | EP | High | Email: `student@edumi.vn` | Báo lỗi: *"Email này đã được sử dụng"* |
| **TC-M03-05** | Báo lỗi khi mật khẩu dài 7 ký tự (dưới biên) | BR-M3-05 | BVA | High | Mật khẩu: `Abc@123` (7 ký tự) | Báo lỗi: *"Mật khẩu phải có tối thiểu 8 ký tự"* |
| **TC-M03-06** | Đăng ký thành công với mật khẩu đúng 8 ký tự | BR-M3-06 | BVA | High | Mật khẩu: `Abcd@123` (8 ký tự) | Đăng ký thành công, mật khẩu hợp lệ |
| **TC-M03-07** | Đăng ký thành công với mật khẩu 32 ký tự | BR-M3-07 | BVA | Medium | Mật khẩu đúng 32 ký tự hợp lệ | Đăng ký thành công |
| **TC-M03-08** | Chặn đăng ký khi mật khẩu vượt 32 ký tự | BR-M3-08 | BVA | Medium | Mật khẩu dài 33 ký tự | Báo lỗi vượt quá độ dài mật khẩu |
| **TC-M03-09** | Chọn đăng ký vai trò Giáo viên | BR-M3-09 | EP | Medium | Chọn tab "Giáo viên", điền thông tin | Tài khoản tạo ra có vai trò Teacher |
| **TC-M03-10** | Chọn đăng ký vai trò Phụ huynh | BR-M3-09 | EP | Medium | Chọn tab "Phụ huynh", điền thông tin | Tài khoản tạo ra có vai trò Parent |

#### Module M4: Xác thực mã OTP Email & Kích hoạt tài khoản
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M04-01** | Kích hoạt thành công khi nhập đúng mã OTP 6 số | BR-M4-01 | EP | High | Nhập đúng mã OTP từ DB | Tài khoản chuyển trạng thái active, thông báo thành công |
| **TC-M04-02** | Báo lỗi khi nhập sai mã OTP | BR-M4-02 | EP | High | Nhập `000000` (mã không đúng) | Báo lỗi: *"Mã xác thực không chính xác"* |
| **TC-M04-03** | Nút xác nhận bị vô hiệu hóa khi nhập thiếu số | BR-M4-03 | BVA | High | Nhập `12345` (5 chữ số) | Nút "Xác thực" ở trạng thái disabled |
| **TC-M04-04** | Ô OTP tự động ngăn chặn nhập ký tự chữ | BR-M4-04 | EG | Medium | Gõ ký tự `abcXYZ` vào ô OTP | Ô input không nhận chữ cái, chỉ nhận số |
| **TC-M04-05** | Báo lỗi khi sử dụng lại mã OTP đã kích hoạt | BR-M4-05 | ST | High | Dùng lại mã OTP của lượt kích hoạt trước | Báo lỗi mã xác thực đã hết hạn hoặc đã sử dụng |
| **TC-M04-06** | Báo lỗi khi mã OTP hết hạn quá 10 phút | BR-M4-06 | EP | High | Nhập mã OTP tạo cách đây 15 phút | Báo lỗi: *"Mã xác thực đã hết hạn"* |
| **TC-M04-07** | Bấm nút gửi lại mã OTP thành công | BR-M4-07 | ST | High | Bấm link "Gửi lại mã OTP" | Hiện toast gửi mã thành công, vô hiệu mã cũ |
| **TC-M04-08** | Bộ đếm ngược 60 giây xuất hiện khi gửi lại mã | BR-M4-08 | ST | Medium | Vừa bấm gửi lại mã | Link gửi lại bị mờ, đếm ngược `60s, 59s...` |
| **TC-M04-09** | Tự động chuyển hướng sau khi kích hoạt thành công | BR-M4-09 | ST | High | Xác thực OTP thành công | Tự động chuyển vào `/login` hoặc `/profile` |
| **TC-M04-10** | Nút quay lại màn hình đăng ký hoạt động đúng | BR-M4-10 | ST | Low | Bấm "Quay lại" tại màn hình OTP | Điều hướng về trang `/register` giữ nguyên thông tin |

---

### 👤 SV3 – Phụ trách Module M5 & M6 (20 Test Cases)

#### Module M5: Tìm kiếm & Bộ lọc Đề thi luyện tập đa tiêu chí
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M05-01** | Tìm kiếm đề thi theo từ khóa tên môn học | BR-M5-01 | EP | High | Nhập từ khóa `"Toán"` vào ô tìm kiếm | Danh sách chỉ hiển thị các đề thi thuộc môn Toán |
| **TC-M05-02** | Tìm kiếm không phân biệt chữ hoa chữ thường | BR-M5-01 | EP | Medium | Nhập `"vật lý"` và `"VẬT LÝ"` | Cả 2 lần đều trả về kết quả đề thi môn Vật lý |
| **TC-M05-03** | Tìm kiếm không có kết quả hiển thị thông báo | BR-M5-02 | EP | High | Nhập từ khóa `"zzzyyy123456"` | Hiển thị: *"Không tìm thấy đề thi phù hợp"* |
| **TC-M05-04** | Lọc đề thi theo Khối Lớp 10 | BR-M5-03 | EP | High | Chọn tab Lớp 10 trên thanh filter | Mọi thẻ đề thi đều mang nhãn Lớp 10 |
| **TC-M05-05** | Lọc đề thi theo Khối Lớp 11 | BR-M5-04 | EP | High | Chọn tab Lớp 11 trên thanh filter | Mọi thẻ đề thi đều mang nhãn Lớp 11 |
| **TC-M05-06** | Lọc đề thi theo Khối Lớp 12 | BR-M5-05 | EP | High | Chọn tab Lớp 12 trên thanh filter | Mọi thẻ đề thi đều mang nhãn Lớp 12 |
| **TC-M05-07** | Lọc đề thi theo Độ khó (Dễ / Trung bình / Nâng cao) | BR-M5-07 | EP | Medium | Chọn độ khó "Nâng cao" | Chỉ hiện các đề có độ khó Nâng cao |
| **TC-M05-08** | Kết hợp đồng thời bộ lọc Lớp và Môn học | BR-M5-08 | DT | High | Chọn Lớp 12 + Môn Hóa học | Danh sách hiển thị đúng đề Hóa học Lớp 12 |
| **TC-M05-09** | Tìm kiếm an toàn trước ký tự mã độc XSS | BR-M5-09 | EG | High | Gõ `<script>alert(1)</script>` | Không bật alert, hiển thị an toàn |
| **TC-M05-10** | Bấm nút "Đặt lại bộ lọc" reset về mặc định | BR-M5-10 | ST | Medium | Đang lọc, bấm "Xóa bộ lọc" | Hiển thị lại toàn bộ danh sách đề thi |

#### Module M6: Sảnh chờ thi & Modal xác nhận bắt đầu làm bài
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M06-01** | Click thẻ đề thi hiển thị Modal chi tiết sảnh chờ | BR-M6-01 | ST | High | Click vào thẻ đề thi bất kỳ | Modal sảnh chờ thi xuất hiện giữa màn hình |
| **TC-M06-02** | Kiểm tra hiển thị đúng thời lượng làm bài | BR-M6-02 | EP | High | Đề thi 50 phút | Modal hiển thị đúng thông số `50 phút` |
| **TC-M06-03** | Kiểm tra hiển thị đúng số lượng câu hỏi | BR-M6-03 | EP | High | Đề thi 40 câu | Modal hiển thị đúng `40 câu hỏi` |
| **TC-M06-04** | Hiển thị cấu trúc các phần thi trong đề | BR-M6-03 | EP | Medium | Đề chuẩn Bộ GD&ĐT | Thấy thông tin Phần I, Phần II, Phần III |
| **TC-M06-05** | Bấm nút đóng modal sảnh chờ | BR-M6-06 | ST | Low | Bấm icon `X` hoặc nút "Đóng" | Modal biến mất, người dùng vẫn ở trang `/exam` |
| **TC-M06-06** | Chưa đăng nhập bấm bắt đầu thi chuyển hướng | BR-M6-04 | ST | High | Khách chưa đăng nhập bấm "Bắt đầu thi" | Điều hướng sang `/login` |
| **TC-M06-07** | Đã đăng nhập bấm bắt đầu thi vào phòng thi | BR-M6-05 | ST | High | Đã đăng nhập bấm "Bắt đầu làm bài" | Chuyển hướng thành công vào URL `/exam/:id` |
| **TC-M06-08** | Hiển thị badge loại đề thi (Miễn phí / Trọng điểm) | BR-M6-07 | EP | Low | Xem thông tin thẻ đề thi | Hiển thị badge màu tương ứng chính xác |
| **TC-M06-09** | Sao chép đường dẫn chia sẻ đề thi | BR-M6-09 | EP | Low | Bấm nút "Chia sẻ" | Hiện thông báo đã chép link vào bộ nhớ tạm |
| **TC-M06-10** | Truy cập đề thi có mã slug không tồn tại | BR-M6-10 | EG | Medium | Mở URL `/exam/de-thi-khong-ton-tai` | Hiển thị trang 404 hoặc thông báo không tìm thấy |

---

### 👤 SV4 – Phụ trách Module M7 & M8 (20 Test Cases)

#### Module M7: Phòng thi trực tuyến & Tương tác làm bài trắc nghiệm
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M07-01** | Đồng hồ đếm ngược hoạt động giảm dần từng giây | BR-M7-01 | ST | High | Vào phòng thi đề 45 phút | Thời gian hiển thị đếm lùi `44:59, 44:58...` |
| **TC-M07-02** | Chọn đáp án trắc nghiệm A/B/C/D thành công | BR-M7-02 | ST | High | Click vào phương án A ở câu 1 | Nút A đổi màu active, ô số 1 bên phải đổi màu đã làm |
| **TC-M07-03** | Thay đổi đáp án đã chọn sang phương án khác | BR-M7-03 | ST | High | Câu 1 đang chọn A, click chọn C | Phương án A hủy active, phương án C active |
| **TC-M07-04** | Chọn ĐÚNG hoặc SAI cho từng ý của câu hỏi Phần II | BR-M7-04 | DT | High | Câu Đúng/Sai: ý a chọn Đúng, ý b chọn Sai | Các nút giữ đúng trạng thái thí sinh đã chọn |
| **TC-M07-05** | Nhảy câu hỏi trực tiếp bằng thanh mục lục | BR-M7-05 | ST | Medium | Click vào ô số `15` ở cột bên phải | Màn hình cuộn và focus ngay tới câu số 15 |
| **TC-M07-06** | Nút "Câu tiếp theo" và "Câu trước" điều hướng | BR-M7-06 | ST | Medium | Đang ở câu 1 bấm "Tiếp tục" | Giao diện hiển thị nội dung câu số 2 |
| **TC-M07-07** | Đánh dấu câu hỏi cần xem lại (Flag Question) | BR-M7-07 | ST | Medium | Bấm nút cờ đánh dấu ở câu 3 | Ô số 3 hiển thị icon cờ màu cam trên mục lục |
| **TC-M07-08** | Thay đổi kích thước font chữ phòng thi | BR-M7-08 | EP | Low | Bấm chọn cỡ chữ "Lớn" (A+) | Cỡ chữ đề bài tăng kích thước rõ rệt |
| **TC-M07-09** | Công thức Toán học LaTeX hiển thị sắc nét KaTeX | BR-M7-09 | EP | High | Đề bài có `$\Delta U = A + Q$` | Hiển thị ký hiệu toán học $\Delta U = A + Q$, không lộ mã thô |
| **TC-M07-10** | Cảnh báo đổi màu đỏ khi đồng hồ dưới 5 phút | BR-M7-10 | BVA | Medium | Thời gian đếm ngược còn `04:59` | Khung đồng hồ chuyển sang màu đỏ nhấp nháy |

#### Module M8: Nộp bài thi, Chấm điểm tự động & Xem kết quả
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M08-01** | Bấm Nộp bài khi chưa làm hết hiện modal cảnh báo | BR-M8-01 | DT | High | Làm 5/10 câu, bấm "Nộp bài" | Hiện modal: *"Bạn còn 5 câu chưa làm. Bạn có chắc muốn nộp?"* |
| **TC-M08-02** | Bấm "Tiếp tục làm bài" trên modal cảnh báo | BR-M8-02 | ST | High | Click "Làm tiếp" trên modal | Đóng modal, giữ nguyên các câu đã chọn để làm tiếp |
| **TC-M08-03** | Tự động nộp bài khi đồng hồ đếm về `00:00` | BR-M8-03 | ST | High | Chờ đồng hồ về 00:00 | Khóa đề thi, tự động chuyển sang trang nộp bài |
| **TC-M08-04** | Nộp bài thành công chuyển hướng sang `/result` | BR-M8-04 | ST | High | Xác nhận nộp bài | Chuyển hướng sang URL `/exam/:id/result` |
| **TC-M08-05** | Hiển thị chính xác tổng điểm trên thang điểm 10 | BR-M8-05 | EP | High | Làm đúng 8/10 câu trắc nghiệm đơn | Điểm số hiển thị chính xác: `8.0 / 10.0 điểm` |
| **TC-M08-06** | Thống kê số câu đúng, sai và chưa làm | BR-M8-06 | EP | High | Đúng 5, Sai 3, Chưa làm 2 | Bảng tổng kết hiển thị đúng 5 câu xanh, 3 câu đỏ, 2 câu xám |
| **TC-M08-07** | Tính điểm câu Đúng/Sai lũy tiến theo Bộ GD&ĐT | BR-M8-07 | DT | High | Đúng 1 ý (0.1đ), đúng 2 ý (0.25đ), 4 ý (1.0đ) | Tổng điểm cộng dồn chính xác theo barem chuẩn |
| **TC-M08-08** | Hiển thị chi tiết đáp án và lời giải từng câu | BR-M8-08 | EP | High | Bấm xem giải thích chi tiết câu 1 | Khung giải thích mở ra ghi rõ phương pháp giải |
| **TC-M08-09** | Công thức Toán trong lời giải hiển thị chuẩn KaTeX | BR-M8-09 | EP | High | Lời giải chứa công thức tích phân, căn bậc hai | Hiển thị chuẩn ký hiệu toán học, sắc nét |
| **TC-M08-10** | Bấm nút "Làm lại đề thi" reset lượt thi mới | BR-M8-10 | ST | Medium | Bấm "Làm lại bài thi" | Đưa về phòng thi mới, reset toàn bộ đáp án trắng |

---

### 👤 SV5 – Phụ trách Module M9 & M10 (20 Test Cases)

#### Module M9: Staff Quản lý Ngân hàng câu hỏi & Tạo đề thi mới
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M09-01** | Staff truy cập thành công tab quản lý đề thi | BR-M9-01 | DT | High | Đăng nhập tài khoản `staff@edumi.vn` | Tab "Quản lý đề thi" hiển thị đầy đủ công cụ |
| **TC-M09-02** | Học sinh không thể truy cập giao diện quản trị Staff | BR-M9-02 | DT | High | Đăng nhập tài khoản `student@edumi.vn` | Không thấy các nút quản trị và tạo đề thi |
| **TC-M09-03** | Tạo đề thi với tiêu đề, khối lớp, môn học hợp lệ | BR-M9-03 | EP | High | Tên đề: "Khảo sát Toán 12", Môn: Toán, Lớp 12 | Thông tin đề thi được lưu thành công |
| **TC-M09-04** | Thêm câu hỏi trắc nghiệm đơn 4 lựa chọn (A,B,C,D) | BR-M9-04 | ST | High | Bấm "Thêm câu hỏi", chọn loại trắc nghiệm | Một khối câu hỏi mới xuất hiện trong danh sách |
| **TC-M09-05** | Thiết lập đáp án đúng cho câu hỏi trắc nghiệm | BR-M9-05 | EP | High | Click chọn phương án `B` làm đáp án đúng | Badge đáp án đúng cập nhật thành `B` |
| **TC-M09-06** | Thêm câu hỏi trắc nghiệm Đúng/Sai 4 ý con | BR-M9-06 | ST | High | Chọn loại câu hỏi "Đúng / Sai" | Xuất hiện 4 ý a, b, c, d kèm nút chọn Đúng/Sai |
| **TC-M09-07** | Xóa câu hỏi khỏi ngân hàng đề thi | BR-M9-07 | ST | Medium | Bấm icon Thùng rác tại câu số 3 | Câu số 3 bị xóa, số lượng câu giảm 1 |
| **TC-M09-08** | Live Math Preview hiển thị công thức khi Staff nhập | BR-M9-08 | EP | High | Gõ `$\Delta U = A + Q$` vào ô nội dung | Khung xem trước hiện công thức toán sắc nét |
| **TC-M09-09** | Cảnh báo khi lưu đề thi chưa đủ 10 điểm | BR-M9-09 | BVA | Medium | Tổng điểm các câu đang là 8.5 điểm | Cảnh báo tổng điểm chưa đạt chuẩn 10.0 điểm |
| **TC-M09-10** | Đề thi lưu thành công xuất hiện trong danh sách | BR-M9-10 | ST | High | Điền đủ 10 điểm, bấm "Lưu đề thi" | Đề thi mới hiển thị ngay trong danh sách quản lý |

#### Module M10: AI Exam Scanner: Quét bóc tách đề thi & Preview LaTeX
| TC ID | Tiêu đề Test Case | BR ID | Kỹ thuật | Mức ưu tiên | Dữ liệu kiểm thử | Kết quả mong đợi |
|---|---|---|:---:|:---:|---|---|
| **TC-M10-01** | Bấm nút Scan đề thi mở Modal AI Scanner | BR-M10-01 | ST | High | Click nút "Scan đề bằng AI 🚀" | Modal AI Exam Scanner mở ra |
| **TC-M10-02** | Tải lên file ảnh đề thi PNG / JPG hợp lệ | BR-M10-02 | EP | High | Kéo thả file `de-thi-vat-ly.png` | File được nhận, hiển thị thumbnail xem trước |
| **TC-M10-03** | Báo lỗi khi tải file sai định dạng (ví dụ `.exe`) | BR-M10-03 | EG | High | Chọn file `virus.exe` | Báo lỗi: *"Chỉ hỗ trợ file ảnh hoặc PDF"* |
| **TC-M10-04** | Dán văn bản thô đề thi từ file Word | BR-M10-04 | EP | Medium | Chuyển sang tab Dán văn bản, paste đề | Khung văn bản hiển thị nội dung vừa dán |
| **TC-M10-05** | Hiển thị hiệu ứng loading trong khi AI quét đề | BR-M10-05 | ST | Medium | Bấm "Quét đề ngay" | Thanh tiến trình và spinner loading xoay |
| **TC-M10-06** | AI bóc tách chính xác danh sách câu hỏi | BR-M10-06 | EP | High | Đề thi có 4 câu hỏi | Danh sách xem trước hiển thị đủ 4 câu hỏi |
| **TC-M10-07** | Tự động vẽ công thức Toán KaTeX trong modal scan | BR-M10-07 | EP | High | Ảnh có công thức $\Delta U = A + Q$ | Hiển thị công thức toán học đẹp, không lộ mã thô |
| **TC-M10-08** | Xóa bỏ câu hỏi quét lỗi trực tiếp trên modal | BR-M10-08 | ST | Medium | Bấm icon xóa ở câu số 2 trên modal | Câu số 2 bị loại khỏi danh sách chuẩn bị nhập |
| **TC-M10-09** | Bấm "Áp dụng vào đề thi" chuyển dữ liệu vào đề | BR-M10-09 | ST | High | Click nút "Áp dụng 4 câu hỏi" | Toàn bộ câu hỏi được đưa vào form tạo đề của Staff |
| **TC-M10-10** | Đóng modal không làm mất dữ liệu câu hỏi cũ | BR-M10-10 | ST | Low | Bấm nút "Đóng" modal scanner | Modal đóng lại, ngân hàng câu hỏi cũ giữ nguyên |

---

## 6. Xây dựng Framework Automation: POM + CSV

### 6.1. Cấu trúc Package Java 17 chuẩn mực

```text
src/test/java/com/edumi/test/
├── base/
│   ├── BaseTest.java             # SV1 (Lead) & SV2 (FW Owner)
│   └── BasePage.java             # Các hàm waitVisible, click, type, getText
├── utils/
│   ├── ConfigReader.java         # Đọc config.properties
│   ├── DataGenerator.java        # Sinh timestamp dữ liệu ngẫu nhiên
│   └── ScreenshotOnFailure.java  # Tự động chụp màn hình khi Test Case Fail
├── pages/
│   ├── LoginPage.java            # SV1 - M1 & M2
│   ├── RegisterPage.java         # SV2 - M3
│   ├── VerifyOtpPage.java        # SV2 - M4
│   ├── ExamLobbyPage.java        # SV3 - M5 & M6
│   ├── ExamRoomPage.java         # SV4 - M7
│   ├── ExamResultPage.java       # SV4 - M8
│   └── StaffExamPage.java        # SV5 - M9 & M10
└── tests/
    ├── LoginTest.java            # SV1 - 10 TCs
    ├── SessionSecurityTest.java  # SV1 - 10 TCs
    ├── RegisterTest.java         # SV2 - 10 TCs
    ├── VerifyOtpTest.java        # SV2 - 10 TCs
    ├── ExamFilterTest.java       # SV3 - 10 TCs
    ├── ExamLobbyTest.java        # SV3 - 10 TCs
    ├── ExamRoomTest.java         # SV4 - 10 TCs
    ├── ExamResultTest.java       # SV4 - 10 TCs
    ├── StaffExamTest.java        # SV5 - 10 TCs
    └── ExamScannerTest.java      # SV5 - 10 TCs
```

---

### 6.2. 10 File dữ liệu CSV kiểm thử tương ứng (Data-driven)

Đặt trong thư mục `src/test/resources/testdata/`:
1. `m01_login_data.csv`
2. `m02_session_data.csv`
3. `m03_register_data.csv`
4. `m04_verify_otp_data.csv`
5. `m05_exam_filter_data.csv`
6. `m06_exam_lobby_data.csv`
7. `m07_exam_room_data.csv`
8. `m08_exam_result_data.csv`
9. `m09_staff_exam_data.csv`
10. `m10_exam_scanner_data.csv`

---

## 7. Test Execution Log và Defect Report

### 7.1. Bảng theo dõi thực thi qua các lần chạy (BM06)

| Lần chạy | Thời gian | Người chạy | Số TC thực thi | Pass | Fail | Tỷ lệ Pass | Hành động tiếp theo |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **RUN-01** | Tuần 2 | Cả nhóm | 100 | 84 | 16 | 84.0% | Ghi nhận 10 Defect SUT và sửa 6 test script flaky |
| **RUN-02** | Tuần 3 | Test Lead | 100 | 96 | 4 | 96.0% | Chạy lại sau khi nhóm DEV sửa lỗi; hoàn thiện báo cáo |

### 7.2. Quản lý Defect Report trên GitHub Issues (BM07)
- Mỗi thành viên khi phát hiện lỗi ở Module của mình có trách nhiệm tạo Issue theo mẫu:
  - `Title`: `[Module] Mô tả ngắn gọn lỗi` (Ví dụ: `[ExamRoom] Hết giờ đếm ngược không tự động nộp bài`)
  - `Label`: `bug`, `severity:critical/major/minor`, `module:M1...M10`
  - `Evidence`: Đính kèm ảnh chụp màn hình tự động từ `target/screenshots/`.

---

## 8. Test Summary Report theo chuẩn ISTQB

Báo cáo tổng kết kiểm thử (`docs/BM08_TestSummaryReport.md`) sẽ tổng hợp định lượng:
- **Độ bao phủ Test Case:** 100/100 Test Cases thực thi thành công.
- **Tỷ lệ kiểm thử đạt:** Đạt $\ge 95\%$ ở lần chạy cuối cùng (RUN-02).
- **Độ bao phủ Business Rules:** 100% các quy tắc nghiệp vụ trong 10 Modules đều có Test Case kiểm chứng.
- **Đánh giá chất lượng SUT EduMi:** Sẵn sàng cho buổi bảo vệ đồ án môn học.

---

## 9. Bảng phân công RACI cho 5 thành viên & Kế hoạch 3 tuần

### 9.1. Ma trận trách nhiệm RACI (BM09)

* **R (Responsible):** Trực tiếp viết Page Object, CSV và chạy 10 Test Cases của module đó.
* **A (Accountable):** Chịu trách nhiệm duyệt Pull Request và chất lượng cuối cùng.
* **C (Consulted):** Trao đổi giải pháp kỹ thuật, hỗ trợ sửa locator.
* **I (Informed):** Nhận thông báo tiến độ.

| Nhiệm vụ / Module | SV1 (Lead) | SV2 (FW Owner) | SV3 (Doc Owner) | SV4 (Defect Mgr) | SV5 (CI/Reviewer) |
|---|:---:|:---:|:---:|:---:|:---:|
| **M1 Đăng nhập & M2 Phiên** | **A / R** | C | I | I | C |
| **M3 Đăng ký & M4 Verify OTP** | C | **A / R** | I | I | C |
| **M5 Lọc Đề & M6 Sảnh Chờ** | I | C | **A / R** | C | I |
| **M7 Phòng Thi & M8 Nộp Bài** | I | C | C | **A / R** | I |
| **M9 Staff Đề & M10 Scan AI** | C | I | I | C | **A / R** |
| Dựng Skeleton BaseTest & POM | C | **A / R** | I | I | C |
| Tổng hợp BM01 Test Plan & BM08 | **A / R** | C | C | C | C |
| Quản lý tài liệu BM02, BM03, BM04 | C | I | **A / R** | I | I |
| Quản lý GitHub Issues & Bug (BM07)| I | I | I | **A / R** | I |
| Cấu hình GitHub Actions CI & Code Review | C | C | I | I | **A / R** |

---

### 9.2. Kế hoạch chạy 3 tuần (Sprint Schedule)

| Tuần | Mục tiêu chính | Đầu ra cần hoàn thành (Milestone) |
|---|---|---|
| **Tuần 1** | Phân tích & Thiết kế | - Hoàn thành BM01 Test Plan và BM02 Business Rules cho 10 Modules.<br>- Mỗi thành viên viết nháp 10 Test Cases của 2 module mình phụ trách (BM03).<br>- SV2 dựng xong Skeleton project Maven + Selenium 4 chạy thử pass 1 test mẫu. |
| **Tuần 2** | Lập trình Automation | - Viết xong toàn bộ 7 Page Object classes.<br>- Viết 10 file CSV dữ liệu kiểm thử tương ứng.<br>- Hoàn thiện 100 Test Cases, tạo PR trên GitHub và review chéo. |
| **Tuần 3** | Chạy kiểm thử & Đóng dự án | - Chạy Regression Test toàn diện lần 1 (RUN-01), log bug lên GitHub Issues.<br>- Nhóm DEV sửa bug, chạy lại lần 2 (RUN-02).<br>- Xuất file HTML Surefire Report, hoàn thiện BM06, BM07, BM08 và slide thuyết trình. |

---

## 10. Quy trình làm việc trên GitHub & CI/CD

- **Nhánh chính (`main`):** Bật chế độ **Branch Protection** (Bắt buộc tối thiểu 1 Reviewer Approve trước khi Merge, không push trực tiếp).
- **Nhánh tính năng:** Đặt tên rõ ràng: `feature/M1-login`, `feature/M7-exam-room`, `feature/M10-ai-scanner`.
- **Commit theo chuẩn Conventional Commits:**
  - `test(m01): add 10 data-driven test cases for login module (#01)`
  - `test(m07): implement exam room page object with timer wait (#07)`
  - `docs: update BM03 test cases specification v1.0`

---

## 11. Tiêu chí đánh giá & Rubric chấm điểm (Thang điểm 10)

| STT | Tiêu chí đánh giá | Trọng số | Yêu cầu đạt điểm tối đa |
|:---:|---|:---:|---|
| 1 | **Phân tích Business Rules & Kế hoạch (BM01, BM02)** | 1.0 đ | Cả 10 Modules có Business Rules rõ ràng, testable; Test Plan đầy đủ mục tiêu, rủi ro. |
| 2 | **Thiết kế Test Case & RTM (BM03, BM04)** | 2.0 đ | Đủ 100 Test Cases chi tiết (10 TC/Module); Áp dụng chuẩn EP, BVA, Decision Table; 100% BR được phủ. |
| 3 | **Kiến trúc Framework POM** | 2.0 đ | Đúng 8 quy tắc POM; BasePage tái sử dụng; Tuyệt đối không dùng `Thread.sleep()`; Locator ổn định. |
| 4 | **Data-driven Testing với 10 file CSV** | 1.0 đ | Dữ liệu tách riêng ra 10 file CSV UTF-8; có cột Expected Result rõ ràng; không hard-code dữ liệu. |
| 5 | **Thực thi, Nhật ký & Báo cáo lỗi (BM06, BM07)** | 1.5 đ | Thực hiện tối thiểu 2 lần chạy toàn bộ 100 TC; Defect Report tái hiện được, kèm screenshot làm bằng chứng. |
| 6 | **Báo cáo tổng kết kiểm thử (BM08)** | 1.0 đ | Số liệu đo đạc chính xác khớp với HTML Surefire report; có đánh giá exit criteria và khuyến nghị Go/No-Go. |
| 7 | **Làm việc nhóm & Đóng góp đều trên GitHub** | 1.5 đ | 5 thành viên đều có commits, Pull Requests và Reviews chéo đồng đều; Kanban cập nhật liên tục. |
| **+** | **Điểm cộng sáng tạo (Tối đa +1.0đ)** | +1.0 đ | Tích hợp CI GitHub Actions tự động; Hỗ trợ kiểm thử công thức Toán học KaTeX trên UI. |

---

## 12. Checklist trước khi nộp bài

- [ ] Hệ thống EduMi chạy bình thường tại `http://localhost:3000`.
- [ ] Đủ 10 Modules, mỗi Module có đúng 10 Test Cases (Tổng cộng 100 Test Cases).
- [ ] Chạy lệnh `mvn clean test` thực thi toàn bộ 100 Test Cases trên máy tính mới thành công.
- [ ] Không chứa bất kỳ câu lệnh `Thread.sleep()` nào trong toàn bộ mã nguồn kiểm thử.
- [ ] Thư mục `docs/` chứa đầy đủ các file từ biểu mẫu **BM01** đến **BM09**.
- [ ] Thư mục `src/test/resources/testdata/` có đủ 10 file CSV mã hóa chuẩn UTF-8.
- [ ] File HTML báo cáo `target/site/surefire-report.html` được lưu vào `docs/reports/`.
- [ ] Toàn bộ 5 thành viên đều có lịch sử đóng góp đồng đều trên GitHub Network Insights.
- [ ] Đã gắn tag phiên bản `v1.0` trên commit cuối cùng trước khi đóng link nộp bài.

---
*Tài liệu hướng dẫn kiểm thử tự động RBL cho 5 thành viên nhóm EduMi — Fall 2026.*
