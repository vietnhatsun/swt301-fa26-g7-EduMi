# HƯỚNG DẪN BÀI TẬP KIỂM THỬ TỰ ĐỘNG VỚI SELENIUM
## Áp dụng cho Website Bán Sách (BookStore) — Selenium 4 + JUnit 5 + POM + dữ liệu CSV

> **Môn:** SWT301 — Software Testing | **Học kỳ:** Fall 2026 | **FPT University**
> **Hình thức:** Bài tập nhóm 4–5 sinh viên (RBL), làm trong 3 tuần
> **Chuẩn tham chiếu:** ISTQB CTFL v4.0 và ISO/IEC/IEEE 29119-3 (Test Documentation)

---

## Mục lục

1. [Mục tiêu và phạm vi](#1-mục-tiêu-và-phạm-vi)
2. [Hệ thống được kiểm thử (SUT) và môi trường](#2-hệ-thống-được-kiểm-thử-sut-và-môi-trường)
3. [Bộ biểu mẫu theo ISTQB](#3-bộ-biểu-mẫu-theo-istqb)
4. [Business Rules cho 4 module](#4-business-rules-cho-4-module)
5. [Thiết kế Test Case và test case mẫu](#5-thiết-kế-test-case-và-test-case-mẫu)
6. [Framework automation: POM + CSV](#6-framework-automation-pom--csv)
7. [Test Execution Log và Defect Report](#7-test-execution-log-và-defect-report)
8. [Test Summary Report theo ISTQB](#8-test-summary-report-theo-istqb)
9. [Làm việc nhóm: phân công công việc](#9-làm-việc-nhóm-phân-công-công-việc)
10. [Quy trình làm việc trên GitHub](#10-quy-trình-làm-việc-trên-github)
11. [Sản phẩm nộp và tiêu chí chấm điểm](#11-sản-phẩm-nộp-và-tiêu-chí-chấm-điểm)
12. [Checklist trước khi nộp](#12-checklist-trước-khi-nộp)

---

## 1. Mục tiêu và phạm vi

### 1.1. Mục tiêu học tập

Sau bài tập, sinh viên có thể:

| # | Mục tiêu | Liên hệ ISTQB CTFL v4.0 |
|---|----------|-------------------------|
| LO1 | Phân tích Business Rules thành Test Conditions | Ch.1.4 Test Activities: Test Analysis |
| LO2 | Thiết kế test case bằng EP, BVA, Decision Table, State Transition | Ch.4.2 Black-box techniques |
| LO3 | Xây dựng framework Selenium theo Page Object Model, dữ liệu tách ra file CSV | Ch.6 Test Tools; Data-driven testing |
| LO4 | Thực thi test, ghi log, viết defect report | Ch.5.5 Defect Management |
| LO5 | Lập Test Summary Report với số liệu đo được | Ch.5.3 Test Monitoring, Control and Completion |
| LO6 | Làm việc nhóm qua GitHub: branch, Pull Request, code review | Ch.1.5 Essential skills, Collaboration |

### 1.2. Phạm vi kiểm thử (Test Scope)

Chỉ test **các module cơ bản, quan trọng nhất** (rủi ro cao, dùng nhiều):

| Mã | Module | User Story | URL | Mức ưu tiên | Lý do chọn (Risk-based) |
|----|--------|-----------|-----|-------------|-------------------------|
| M1 | Đăng nhập | US-02 | `/login` | **Bắt buộc** | Cửa ngõ của mọi chức năng, ảnh hưởng bảo mật |
| M2 | Đăng ký | US-01 | `/register` | **Bắt buộc** | Nhiều rule validate, phù hợp EP/BVA |
| M3 | Tìm kiếm và lọc sách | US-07 | `/products`, thanh tìm kiếm | **Bắt buộc** | Tần suất dùng cao nhất |
| M4 | Giỏ hàng | US-03 | `/book/:id`, `/cart` | **Bắt buộc** | Ảnh hưởng trực tiếp doanh thu |
| M5 | Đặt hàng (Checkout) | US-05 | `/cart` → checkout | Tùy chọn (điểm cộng) | Luồng E2E dài, cho nhóm 5 người |

**Ngoài phạm vi (Out of scope):** thanh toán VNPay thật, gửi email, Admin, hiệu năng, bảo mật chuyên sâu, tương thích nhiều trình duyệt (chỉ dùng Chrome).


---

## 2. Hệ thống được kiểm thử (SUT) và môi trường

| Thành phần | Giá trị |
|-----------|---------|
| Frontend | React + Vite + MUI, chạy ở `http://localhost:3000` |
| Backend | Spring Boot, chạy ở `http://localhost:8080` (frontend gọi qua proxy `/api`) |
| Database | MySQL, có dữ liệu mẫu (seed) do giảng viên cung cấp |
| Trình duyệt | Google Chrome bản mới nhất |
| Công cụ test | Java 17, Maven, Selenium 4.21+, JUnit 5.10+, WebDriverManager 5.7+ |
| IDE | IntelliJ IDEA |
| Quản lý mã nguồn | GitHub (repo của nhóm, ưu tiên GitHub Classroom) |

**Tài khoản test chuẩn (giảng viên seed sẵn vào DB):**

| Username | Password | Trạng thái | Dùng cho |
|----------|----------|-----------|----------|
| `user01` | `Secret@123` | Active | Luồng đúng |
| `inactive01` | `Secret@123` | Chưa kích hoạt | RULE-LOGIN-05, RULE-CART-01 |
| `admin` | `Admin@123` | Active, quyền Admin | Kiểm tra phân quyền |

> ⚠️ **Lưu ý về khả năng kiểm thử (testability):** Ở trang `/login`, hai ô *Tên đăng nhập* và *Mật khẩu* cùng dùng `id="outlined-required"`, nên **trùng id**. Sinh viên không được dùng `By.id("outlined-required")`. Hãy dùng locator theo `type`, `placeholder` hoặc thứ tự, và **ghi nhận đây là một Improvement/Defect** (đề xuất thêm `data-testid`). Đây là ví dụ thực tế cho việc automation phát hiện vấn đề testability.

---

## 3. Bộ biểu mẫu theo ISTQB

Bảng dưới đây ánh xạ các hoạt động trong quy trình kiểm thử của ISTQB với biểu mẫu sinh viên phải nộp. Tên biểu mẫu theo ISO/IEC/IEEE 29119-3.

| Hoạt động (ISTQB Test Process) | Biểu mẫu | File nộp | Bắt buộc |
|-------------------------------|---------|----------|---------|
| Test Planning | **BM01 – Test Plan (rút gọn)** | `docs/BM01_TestPlan.md` | ✅ |
| Test Analysis | **BM02 – Business Rules & Test Conditions** | `docs/BM02_BusinessRules.md` | ✅ |
| Test Design | **BM03 – Test Case Specification** | `docs/BM03_TestCases.xlsx` | ✅ |
| Test Design | **BM04 – Requirements Traceability Matrix (RTM)** | Một sheet trong BM03 | ✅ |
| Test Implementation | **BM05 – Test Data (CSV)** | `src/test/resources/testdata/*.csv` | ✅ |
| Test Execution | **BM06 – Test Execution Log** | Một sheet trong BM03 + Surefire report | ✅ |
| Test Execution | **BM07 – Defect Report** | GitHub Issues + `docs/BM07_DefectReport.md` | ✅ |
| Test Completion | **BM08 – Test Summary Report** | `docs/BM08_TestSummaryReport.md` | ✅ |
| (Nhóm) | **BM09 – Bảng phân công & đóng góp** | `docs/BM09_PhanCong.md` | ✅ |

### BM01 – Test Plan (rút gọn, 1–2 trang)

```markdown
# TEST PLAN – BookStore Automation – Nhóm <số>
| Mục | Nội dung |
|-----|---------|
| 1. Test Plan ID | TP-BOOKSTORE-G<số>-v1.0 |
| 2. Mục tiêu | Tự động hóa kiểm thử chức năng 4 module M1–M4 |
| 3. Test items | Frontend BookStore build ngày ..., commit ... |
| 4. Features to be tested | M1 Login, M2 Register, M3 Search, M4 Cart |
| 5. Features not to be tested | Payment, Admin, Email, Performance |
| 6. Approach | Black-box (EP, BVA, DT, ST); Selenium POM; Data-driven bằng CSV; Regression chạy bằng mvn test |
| 7. Entry criteria | SUT chạy được ở localhost; DB đã seed; BR đã được review |
| 8. Exit criteria | 100% TC High được thực thi; Pass rate ≥ 90% (trừ TC fail do defect đã báo); 0 defect Critical đang mở chưa báo cáo |
| 9. Suspension/Resumption | Dừng nếu SUT không khởi động được hoặc trang login lỗi (blocker) |
| 10. Test deliverables | BM02–BM08, source code, báo cáo Surefire |
| 11. Environment | Win 10/11, Chrome xx, Java 17, Selenium 4.21 |
| 12. Roles | Xem BM09 |
| 13. Schedule | Tuần 1: phân tích và thiết kế; Tuần 2: code; Tuần 3: chạy, báo cáo |
| 14. Risks | (xem bảng rủi ro bên dưới) |
```

**Bảng rủi ro dự án (Project Risk):**

| ID | Rủi ro | Xác suất | Ảnh hưởng | Biện pháp |
|----|--------|---------|----------|-----------|
| R1 | Locator không ổn định (trùng id, class MUI sinh tự động) | Cao | Cao | Ưu tiên `data-testid`, `name`, `type`, `placeholder`; dùng Explicit Wait |
| R2 | Dữ liệu test bị thay đổi sau mỗi lần chạy (đăng ký trùng email) | Cao | TB | Sinh email ngẫu nhiên bằng timestamp; reset DB trước mỗi lần chạy regression |
| R3 | Thành viên trễ hạn, merge conflict | TB | Cao | Chia theo module, PR nhỏ, review trong 24 giờ |
| R4 | ChromeDriver không khớp version | TB | TB | Dùng WebDriverManager hoặc Selenium Manager |

### BM02 – Business Rules & Test Conditions

| Cột | Ý nghĩa |
|-----|---------|
| BR ID | `RULE-<MODULE>-<số>` |
| Mô tả rule | Phát biểu kiểm thử được (testable), có giá trị cụ thể |
| Test Condition ID | `TCOND-<MODULE>-<số>`: điều cần kiểm tra suy ra từ rule |
| Kỹ thuật | EP / BVA / DT / ST / Error Guessing |
| Automation? | Yes / No + lý do (ví dụ: cần đọc email nên No) |

### BM03 – Test Case Specification (Excel, 1 sheet cho mỗi module)

| Cột | Bắt buộc | Ghi chú |
|-----|---------|---------|
| TC ID | ✅ | `TC-LOGIN-001` |
| Test Case Title | ✅ | Bắt đầu bằng động từ: "Verify đăng nhập thất bại khi ..." |
| BR / Requirement ID | ✅ | Để truy vết (traceability) |
| Technique | ✅ | EP / BVA / DT / ST |
| Priority | ✅ | High / Medium / Low |
| Pre-condition | ✅ | Trạng thái cần có trước khi chạy |
| Test Steps | ✅ | Đánh số 1, 2, 3 … |
| Test Data | ✅ | Ghi tham chiếu: `login_data.csv` dòng 3 |
| Expected Result | ✅ | Cụ thể, đo được, có thông báo chính xác |
| Actual Result | ✅ | Điền khi chạy |
| Status | ✅ | Pass / Fail / Blocked / Not Run |
| Automated? | ✅ | Yes / No |
| Automation Method | ✅ | `LoginTest#loginWithInvalidData` |
| Defect ID | | `BUG-xx` nếu Fail |
| Author / Executor | ✅ | Tên sinh viên |

### BM04 – Requirements Traceability Matrix (RTM)

| BR ID | Test Condition | TC IDs | Số TC | Automated | Pass | Fail | Coverage |
|-------|---------------|--------|-------|-----------|------|------|---------|
| RULE-LOGIN-01 | TCOND-LOGIN-01..03 | TC-LOGIN-001..004 | 4 | 4 | 3 | 1 | 100% |
| RULE-REG-03 | TCOND-REG-05..08 | TC-REG-006..012 | 7 | 7 | 7 | 0 | 100% |
| … | | | | | | | |

> Mỗi BR trong phạm vi phải có **ít nhất 1 TC**. BR nào không test được thì ghi lý do.

### BM05 – Test Data (CSV)

Quy tắc file CSV:
- Dòng đầu là **header**; mã hóa **UTF-8** (để đọc được tiếng Việt).
- Cột đầu tiên là `tcId` để đối chiếu với BM03.
- Có cột `expected...` để test tự so sánh kết quả, **không hard-code** kết quả trong code.
- Giá trị rỗng để trống: `tc,,abc`. Chuỗi có dấu phẩy thì bọc trong nháy kép `"a,b"`.

---

## 4. Business Rules cho 4 module

> Rút gọn từ `AcceptanceCriteria_RuleBased.md`. Chỉ giữ những rule **kiểm chứng được qua giao diện** (UI-testable). Những rule cần email, thời gian chờ hoặc nhiều thiết bị được ghi là "Manual / Out of scope".
>
> ⚠️ Website thực tế đăng nhập bằng **Tên đăng nhập (username)**, không phải email như trong SRS. Đây là **điểm không nhất quán giữa SRS và sản phẩm**. Sinh viên cần ghi nhận nó trong Defect Report (loại *Requirement/Documentation defect*) và viết test theo hành vi đã được giảng viên xác nhận.

### M1 – Đăng nhập (US-02)

| BR ID | Rule | Kết quả mong đợi | Auto? |
|-------|------|------------------|-------|
| RULE-LOGIN-01 | Username và password đúng thì đăng nhập thành công | Chuyển về trang chủ (hoặc trang trước đó); Navbar hiển thị tên/menu người dùng | ✅ |
| RULE-LOGIN-02 | Sai username hoặc sai password | Hiện thông báo chung, **không tiết lộ trường nào sai**; vẫn ở `/login` | ✅ |
| RULE-LOGIN-03 | Username/password là trường bắt buộc | Để trống thì không submit (HTML5 `required`), thông báo validate hiển thị | ✅ |
| RULE-LOGIN-04 | Password phân biệt hoa thường | `secret@123` ≠ `Secret@123` | ✅ |
| RULE-LOGIN-05 | Tài khoản chưa kích hoạt không đăng nhập được | Thông báo "Tài khoản chưa được kích hoạt…" | ✅ |
| RULE-LOGIN-06 | Sai 5 lần liên tiếp thì khóa 30 phút | Lần 5 hiện thông báo khóa | ⚠️ Tùy chọn (nếu SUT có) |
| RULE-LOGIN-07 | Đăng xuất thì xóa phiên | Sau logout, truy cập `/profile` bị chuyển về `/login` | ✅ |

### M2 – Đăng ký (US-01)

| BR ID | Rule | Lớp hợp lệ / Biên | Auto? |
|-------|------|-------------------|-------|
| RULE-REG-01 | Email đúng định dạng `local@domain.tld` | ✅ `a@b.com`; ❌ `a@`, `@b.com`, `a b@c.com`, `a@@b.com` | ✅ |
| RULE-REG-02 | Email và username là duy nhất | Trùng thì báo "đã được sử dụng" | ✅ |
| RULE-REG-03 | Password dài 8–32 ký tự, có ≥1 chữ hoa, ≥1 chữ số, ≥1 ký tự đặc biệt `!@#$%^&*` | BVA: 7, **8**, 9, 31, **32**, 33 ký tự | ✅ |
| RULE-REG-04 | Xác nhận mật khẩu phải khớp (phân biệt hoa thường) | Khác nhau thì báo "Mật khẩu xác nhận không khớp" | ✅ |
| RULE-REG-05 | Họ tên dài 2–100 ký tự, chỉ chữ (có dấu tiếng Việt), dấu cách, gạch nối | ❌ `Nguyen123`, `<script>` | ✅ |
| RULE-REG-06 | Số điện thoại VN có 10 số, bắt đầu bằng 0 | ✅ `0912345678`; ❌ 9 số, 11 số, có chữ | ✅ |
| RULE-REG-07 | Đăng ký thành công thì gửi email kích hoạt | Hiện thông báo "Đăng ký thành công, vui lòng kiểm tra email" | ✅ (chỉ kiểm tra thông báo) |
| RULE-REG-08 | Link kích hoạt hết hạn sau 24 giờ | | ❌ Manual |

### M3 – Tìm kiếm và lọc sách (US-07)

| BR ID | Rule | Kết quả mong đợi | Auto? |
|-------|------|------------------|-------|
| RULE-SEARCH-01 | Tìm theo tên sách hoặc tác giả, không phân biệt hoa thường, cho phép tìm một phần | `"clean"` trả về các sách chứa "Clean" | ✅ |
| RULE-SEARCH-02 | Từ khóa rỗng hoặc chỉ có khoảng trắng | Không tìm, hoặc hiển thị toàn bộ danh sách (theo SUT, cần xác nhận với GV) | ✅ |
| RULE-SEARCH-03 | Không có kết quả | Hiện "Không tìm thấy…" | ✅ |
| RULE-SEARCH-04 | Input nguy hiểm (`' OR 1=1 --`, `<script>alert(1)</script>`) | Không crash, không thực thi script, không trả về toàn bộ DB | ✅ |
| RULE-SEARCH-05 | Lọc theo thể loại | Mọi sách trong kết quả thuộc thể loại đã chọn | ✅ |
| RULE-SEARCH-06 | Sắp xếp theo giá tăng/giảm | Danh sách giá được sắp đúng thứ tự | ✅ |
| RULE-SEARCH-07 | Phân trang | Chuyển trang thì nội dung thay đổi, không trùng sách giữa các trang | ✅ |

### M4 – Giỏ hàng (US-03)

| BR ID | Rule | Kết quả mong đợi | Auto? |
|-------|------|------------------|-------|
| RULE-CART-01 | Chưa đăng nhập mà bấm "Thêm vào giỏ" | Chuyển về `/login` hoặc báo "Vui lòng đăng nhập" | ✅ |
| RULE-CART-02 | Số lượng mỗi sách trong khoảng [1, min(99, tồn kho)] | BVA: 0, **1**, 2, 98, **99**, 100; vượt tồn kho thì báo lỗi | ✅ |
| RULE-CART-03 | Thêm sách đã có trong giỏ thì **cộng dồn số lượng**, không tạo dòng mới | A(2) + 3 = A(5) | ✅ |
| RULE-CART-04 | Thành tiền dòng = đơn giá × số lượng; Tổng = Σ thành tiền | Kiểm tra tính toán trên UI | ✅ |
| RULE-CART-05 | Xóa sản phẩm khỏi giỏ | Dòng biến mất, tổng tiền cập nhật, icon số lượng trên Navbar giảm | ✅ |
| RULE-CART-06 | Giỏ hàng giữ nguyên sau khi reload hoặc đăng nhập lại | Số dòng không đổi | ✅ |
| RULE-CART-07 | Sách hết hàng (stock = 0) | Nút "Thêm vào giỏ" bị vô hiệu hoặc báo "Hết hàng" | ✅ |

---

## 5. Thiết kế Test Case và test case mẫu

### 5.1. Yêu cầu số lượng

| Module | Số TC tối thiểu | Trong đó automated | Kỹ thuật bắt buộc |
|--------|----------------|-------------------|-------------------|
| M1 Login | 10 | ≥ 8 | EP, Decision Table |
| M2 Register | 15 | ≥ 12 | EP, BVA |
| M3 Search | 10 | ≥ 8 | EP, Error Guessing |
| M4 Cart | 12 | ≥ 10 | BVA, State Transition |

### 5.2. Ví dụ áp dụng kỹ thuật

**Decision Table – Đăng nhập (RULE-LOGIN-01, 02, 05):**

| Điều kiện / Rule | R1 | R2 | R3 | R4 | R5 |
|-----------------|----|----|----|----|----|
| Username tồn tại | Y | Y | N | Y | – |
| Password đúng | Y | N | – | Y | – |
| Tài khoản đã kích hoạt | Y | – | – | N | – |
| Trường trống | N | N | N | N | Y |
| **Hành động** | Login OK | Báo lỗi chung | Báo lỗi chung | Báo chưa kích hoạt | Chặn submit |
| **TC** | 001 | 002 | 003 | 005 | 006–007 |

**BVA – Độ dài mật khẩu (RULE-REG-03), khoảng hợp lệ [8, 32]:**

| Giá trị | 7 | 8 | 9 | 31 | 32 | 33 |
|--------|---|---|---|----|----|----|
| Kết quả | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Dữ liệu | `Abc@123` | `Abcd@123` | `Abcde@123` | 31 ký tự | 32 ký tự | 33 ký tự |

**State Transition – Giỏ hàng (RULE-CART-03, 05):**

```
[Rỗng] --thêm sách A--> [Có 1 dòng] --thêm A lần nữa--> [Có 1 dòng, SL tăng]
[Có 1 dòng] --thêm sách B--> [Có 2 dòng] --xóa A--> [Có 1 dòng] --xóa B--> [Rỗng]
```

### 5.3. Test case mẫu (trích BM03)

| TC ID | Title | BR | Tech | Pri | Pre-condition | Steps | Test Data | Expected Result |
|-------|-------|----|------|-----|---------------|-------|-----------|-----------------|
| TC-LOGIN-001 | Verify đăng nhập thành công với tài khoản hợp lệ | RULE-LOGIN-01 | DT | High | Tài khoản `user01` đã kích hoạt | 1. Mở `/login` 2. Nhập username 3. Nhập password 4. Bấm "Đăng nhập" | `user01` / `Secret@123` | Chuyển về `/`; Navbar hiển thị menu người dùng |
| TC-LOGIN-002 | Verify thông báo lỗi chung khi sai mật khẩu | RULE-LOGIN-02 | DT | High | Như trên | Như trên | `user01` / `Wrong@123` | Hiện thông báo lỗi; URL vẫn là `/login` |
| TC-LOGIN-004 | Verify mật khẩu phân biệt hoa thường | RULE-LOGIN-04 | EP | Medium | Như trên | Như trên | `user01` / `secret@123` | Đăng nhập thất bại |
| TC-REG-007 | Verify đăng ký thành công với mật khẩu dài đúng 8 ký tự | RULE-REG-03 | BVA | High | Email chưa tồn tại | 1. Mở `/register` 2. Nhập đủ các trường 3. Bấm "Đăng ký" | `Abcd@123` | Thông báo đăng ký thành công |
| TC-REG-006 | Verify đăng ký bị chặn khi mật khẩu dài 7 ký tự | RULE-REG-03 | BVA | High | Như trên | Như trên | `Abc@123` | Thông báo lỗi độ dài mật khẩu |
| TC-SEARCH-004 | Verify tìm kiếm an toàn với input XSS | RULE-SEARCH-04 | EG | High | – | 1. Nhập `<script>alert(1)</script>` 2. Bấm Enter | – | Không xuất hiện alert; trang vẫn hoạt động bình thường |
| TC-CART-003 | Verify cộng dồn số lượng khi thêm lại cùng một sách | RULE-CART-03 | ST | High | Đã đăng nhập, giỏ rỗng | 1. Thêm sách A với SL 2 2. Thêm sách A với SL 3 3. Mở `/cart` | idBook=1 | Có 1 dòng sách A, SL = 5 |
| TC-CART-007 | Verify tổng tiền giỏ hàng | RULE-CART-04 | EP | High | Đã đăng nhập | Thêm A×2, B×1, mở giỏ | – | Tổng = 2·giá(A) + giá(B) |

> **Quy tắc viết Expected Result:** phải **cụ thể và kiểm chứng được** (URL, nội dung thông báo, số lượng, số tiền). Không viết "hệ thống chạy đúng".

---

## 6. Framework automation: POM + CSV

### 6.1. Cấu trúc project (bắt buộc)

```
bookstore-selenium-g<số>/
├── pom.xml
├── README.md                         # Cách cài đặt và chạy test
├── .gitignore
├── .github/
│   ├── workflows/selenium.yml        # (Tùy chọn) CI
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/bug_report.md
├── docs/                             # BM01 → BM09
└── src/test/
    ├── java/com/swt301/bookstore/
    │   ├── base/
    │   │   ├── BaseTest.java         # setup/teardown driver  (Test Lead)
    │   │   └── BasePage.java         # wait, click, type, getText dùng chung (Test Lead)
    │   ├── utils/
    │   │   ├── ConfigReader.java     # đọc config.properties
    │   │   ├── DataGenerator.java    # sinh email/username ngẫu nhiên
    │   │   └── ScreenshotOnFailure.java  # JUnit 5 extension chụp màn hình khi fail
    │   ├── pages/
    │   │   ├── components/NavbarComponent.java
    │   │   ├── LoginPage.java        # SV1
    │   │   ├── RegisterPage.java     # SV2
    │   │   ├── ProductListPage.java  # SV3
    │   │   ├── BookDetailPage.java   # SV4
    │   │   └── CartPage.java         # SV4
    │   └── tests/
    │       ├── LoginTest.java
    │       ├── RegisterTest.java
    │       ├── SearchTest.java
    │       └── CartTest.java
    └── resources/
        ├── config.properties
        └── testdata/
            ├── login_data.csv
            ├── register_data.csv
            ├── search_data.csv
            └── cart_data.csv
```

### 6.2. Các quy tắc POM (sẽ được chấm)

1. **Page class không chứa assertion.** Page chỉ thao tác và trả về dữ liệu. Assertion nằm trong Test class.
2. **Test class không chứa `By` hoặc `driver.findElement`.** Mọi locator nằm trong Page.
3. Locator khai báo `private final By ...`, ưu tiên theo thứ tự: `data-testid` > `id` (duy nhất) > `name` > CSS > XPath tương đối. **Cấm** XPath tuyệt đối (`/html/body/div[2]/...`).
4. **Cấm `Thread.sleep()`.** Chỉ dùng `WebDriverWait` + `ExpectedConditions` (Explicit Wait).
5. Hàm hành động trả về Page tiếp theo (fluent): `loginPage.login(u, p)` trả về `HomePage`.
6. Mỗi test **độc lập**: không phụ thuộc thứ tự chạy, tự chuẩn bị dữ liệu của mình.
7. Không hard-code URL, tài khoản, timeout trong code. Tất cả đặt trong `config.properties` hoặc CSV.
8. Tên test method mô tả hành vi: `shouldShowErrorWhenPasswordIsWrong()`; `@DisplayName` chứa TC ID.

### 6.3. `pom.xml` (phần chính)

```xml
<properties>
  <maven.compiler.source>17</maven.compiler.source>
  <maven.compiler.target>17</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  <selenium.version>4.21.0</selenium.version>
  <junit.version>5.10.2</junit.version>
</properties>

<dependencies>
  <dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>${selenium.version}</version>
  </dependency>
  <dependency>
    <groupId>io.github.bonigarcia</groupId>
    <artifactId>webdrivermanager</artifactId>
    <version>5.7.0</version>
  </dependency>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>   <!-- đã bao gồm junit-jupiter-params -->
    <version>${junit.version}</version>
    <scope>test</scope>
  </dependency>
</dependencies>

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-surefire-plugin</artifactId>
      <version>3.2.5</version>
    </plugin>
    <plugin>  <!-- tạo HTML report: mvn surefire-report:report -->
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-surefire-report-plugin</artifactId>
      <version>3.2.5</version>
    </plugin>
  </plugins>
</build>
```

### 6.4. `config.properties`

```properties
base.url=http://localhost:3000
browser=chrome
headless=false
timeout.seconds=10
user.valid.username=user01
user.valid.password=Secret@123
```

### 6.5. `BaseTest.java`

```java
package com.swt301.bookstore.base;

import com.swt301.bookstore.utils.ConfigReader;
import com.swt301.bookstore.utils.ScreenshotOnFailure;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public abstract class BaseTest {
    protected WebDriver driver;
    protected static final String BASE_URL = ConfigReader.get("base.url");

    @RegisterExtension
    ScreenshotOnFailure screenshot = new ScreenshotOnFailure(() -> driver);

    @BeforeEach
    void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        if (Boolean.parseBoolean(ConfigReader.get("headless"))) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1366,768");
        driver = new ChromeDriver(options);
    }

    @AfterEach
    void tearDown() {
        if (driver != null) driver.quit();
    }
}
```

> Ghi chú: Extension chụp màn hình phải chạy **trước** `tearDown`. Cách đơn giản là để `ScreenshotOnFailure` cài đặt `TestWatcher` và tự `quit()` driver. Hoặc giữ như trên và chụp ảnh trong `AfterTestExecutionCallback` (callback này chạy trước `@AfterEach`). Mẫu bên dưới dùng cách thứ hai.

### 6.6. `ScreenshotOnFailure.java` (JUnit 5 Extension)

```java
package com.swt301.bookstore.utils;

import org.junit.jupiter.api.extension.AfterTestExecutionCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.openqa.selenium.*;
import java.nio.file.*;
import java.util.function.Supplier;

public class ScreenshotOnFailure implements AfterTestExecutionCallback {
    private final Supplier<WebDriver> driverSupplier;
    public ScreenshotOnFailure(Supplier<WebDriver> s) { this.driverSupplier = s; }

    @Override
    public void afterTestExecution(ExtensionContext ctx) throws Exception {
        if (ctx.getExecutionException().isPresent() && driverSupplier.get() != null) {
            byte[] png = ((TakesScreenshot) driverSupplier.get()).getScreenshotAs(OutputType.BYTES);
            Path dir = Paths.get("target", "screenshots");
            Files.createDirectories(dir);
            String name = ctx.getDisplayName().replaceAll("[^a-zA-Z0-9-_]", "_") + ".png";
            Files.write(dir.resolve(name), png);
        }
    }
}
```

### 6.7. `BasePage.java`

```java
package com.swt301.bookstore.base;

import com.swt301.bookstore.utils.ConfigReader;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;

public abstract class BasePage {
    protected final WebDriver driver;
    protected final WebDriverWait wait;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver,
                Duration.ofSeconds(Long.parseLong(ConfigReader.get("timeout.seconds"))));
    }

    protected WebElement waitVisible(By by) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(by));
    }
    protected void click(By by) {
        wait.until(ExpectedConditions.elementToBeClickable(by)).click();
    }
    protected void type(By by, String text) {
        WebElement el = waitVisible(by);
        el.clear();
        if (text != null) el.sendKeys(text);   // CSV ô trống → null → bỏ qua
    }
    protected String getText(By by) { return waitVisible(by).getText().trim(); }
    protected boolean isDisplayed(By by) {
        try { return waitVisible(by).isDisplayed(); }
        catch (TimeoutException e) { return false; }
    }
    public String getCurrentUrl() { return driver.getCurrentUrl(); }
}
```

### 6.8. `LoginPage.java` (mẫu, phải cập nhật locator theo DOM thực tế)

```java
package com.swt301.bookstore.pages;

import com.swt301.bookstore.base.BasePage;
import org.openqa.selenium.*;

public class LoginPage extends BasePage {
    // Không dùng By.id("outlined-required") vì trùng id (xem Defect BUG-01)
    private final By usernameInput = By.cssSelector("form.form input[placeholder='Nhập tên đăng nhập']");
    private final By passwordInput = By.cssSelector("form.form input[type='password']");
    private final By loginButton   = By.cssSelector("form.form button[type='submit']");
    private final By errorMessage  = By.cssSelector("p.text-danger");

    public LoginPage(WebDriver driver) { super(driver); }

    public LoginPage open(String baseUrl) {
        driver.get(baseUrl + "/login");
        waitVisible(usernameInput);
        return this;
    }

    public void login(String username, String password) {
        type(usernameInput, username);
        type(passwordInput, password);
        click(loginButton);
    }

    public String getErrorMessage()  { return getText(errorMessage); }
    public boolean isErrorDisplayed() { return isDisplayed(errorMessage); }

    /** Lấy thông báo validate HTML5 của ô username (khi bỏ trống trường required) */
    public String getUsernameValidationMessage() {
        return driver.findElement(usernameInput).getAttribute("validationMessage");
    }
}
```

### 6.9. Test data CSV: `src/test/resources/testdata/login_data.csv`

```csv
tcId,username,password,expectedResult,expectedMessage
TC-LOGIN-001,user01,Secret@123,SUCCESS,
TC-LOGIN-002,user01,Wrong@123,FAIL,Tên đăng nhập hoặc mật khẩu không đúng
TC-LOGIN-003,notexist99,Secret@123,FAIL,Tên đăng nhập hoặc mật khẩu không đúng
TC-LOGIN-004,user01,secret@123,FAIL,Tên đăng nhập hoặc mật khẩu không đúng
TC-LOGIN-005,inactive01,Secret@123,FAIL,Tài khoản chưa được kích hoạt
TC-LOGIN-006,,Secret@123,REQUIRED,
TC-LOGIN-007,user01,,REQUIRED,
TC-LOGIN-008,' OR '1'='1,' OR '1'='1,FAIL,Tên đăng nhập hoặc mật khẩu không đúng
```

> Nội dung `expectedMessage` phải lấy theo thông báo **thực tế đã được GV xác nhận** hoặc theo SRS. Nếu SUT hiển thị khác SRS thì TC **Fail** và phải viết Defect Report. Không được sửa CSV cho khớp với lỗi.

### 6.10. `LoginTest.java` (data-driven bằng `@CsvFileSource`)

```java
package com.swt301.bookstore.tests;

import com.swt301.bookstore.base.BaseTest;
import com.swt301.bookstore.pages.LoginPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("M1 - Đăng nhập")
class LoginTest extends BaseTest {

    @ParameterizedTest(name = "{0}: user={1}")
    @CsvFileSource(resources = "/testdata/login_data.csv", numLinesToSkip = 1, encoding = "UTF-8")
    void loginDataDriven(String tcId, String username, String password,
                         String expectedResult, String expectedMessage) {
        LoginPage loginPage = new LoginPage(driver).open(BASE_URL);
        loginPage.login(username, password);

        switch (expectedResult) {
            case "SUCCESS" -> {
                new WebDriverWait(driver, Duration.ofSeconds(10))
                        .until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));
                assertFalse(driver.getCurrentUrl().contains("/login"), tcId + " phải rời trang login");
            }
            case "FAIL" -> {
                assertTrue(loginPage.isErrorDisplayed(), tcId + " phải hiển thị lỗi");
                assertEquals(expectedMessage, loginPage.getErrorMessage(), tcId);
                assertTrue(driver.getCurrentUrl().contains("/login"), tcId + " phải ở lại /login");
            }
            case "REQUIRED" -> assertTrue(driver.getCurrentUrl().contains("/login"),
                    tcId + " form không được submit khi thiếu trường bắt buộc");
            default -> fail("expectedResult không hợp lệ trong CSV: " + expectedResult);
        }
    }
}
```

### 6.11. Gợi ý CSV cho các module khác

`register_data.csv` (dùng placeholder `{RANDOM}` để `DataGenerator` thay bằng timestamp, tránh trùng dữ liệu):

```csv
tcId,username,password,confirmPassword,lastName,firstName,phone,email,expectedResult,expectedMessage
TC-REG-001,u{RANDOM},Abcd@123,Abcd@123,Nguyễn Văn,An,0912345678,u{RANDOM}@mail.com,SUCCESS,Đăng ký thành công
TC-REG-002,u{RANDOM},Abcd@123,Abcd@123,Nguyễn Văn,An,0912345678,user@,FAIL,Email không đúng định dạng
TC-REG-006,u{RANDOM},Abc@123,Abc@123,Nguyễn Văn,An,0912345678,u{RANDOM}@mail.com,FAIL,Mật khẩu phải có ít nhất 8 ký tự
TC-REG-010,u{RANDOM},Abcd@123,Abcd@124,Nguyễn Văn,An,0912345678,u{RANDOM}@mail.com,FAIL,Mật khẩu xác nhận không khớp
TC-REG-013,user01,Abcd@123,Abcd@123,Nguyễn Văn,An,0912345678,u{RANDOM}@mail.com,FAIL,Tên đăng nhập đã tồn tại
```

`search_data.csv`:

```csv
tcId,keyword,expectedResult,expectedMinCount
TC-SEARCH-001,clean,FOUND,1
TC-SEARCH-002,CLEAN,FOUND,1
TC-SEARCH-003,zzzxxyy123,NOT_FOUND,0
TC-SEARCH-004,<script>alert(1)</script>,SAFE,0
TC-SEARCH-005,' OR 1=1 --,SAFE,0
```

`cart_data.csv`:

```csv
tcId,bookId,qty1,qty2,expectedQty,expectedMessage
TC-CART-003,1,2,3,5,
TC-CART-004,1,99,0,99,
TC-CART-005,1,100,0,99,Mỗi sản phẩm chỉ có thể mua tối đa 99 cuốn
TC-CART-006,1,0,0,1,Số lượng phải ít nhất là 1
```

> Có thể dùng `@CsvFileSource` (JUnit 5, đơn giản nhất, **khuyến nghị**). Nếu cần đọc CSV thành object (ví dụ `RegisterData`) thì viết `CsvReader` dùng OpenCSV và kết hợp `@MethodSource`.

### 6.12. Chạy test và lấy báo cáo

```bash
mvn clean test                                   # chạy toàn bộ
mvn test -Dtest=LoginTest                        # chạy 1 class
mvn surefire-report:report                       # HTML: target/site/surefire-report.html
```

Ảnh chụp màn hình khi fail nằm trong `target/screenshots/`. Ảnh dùng làm bằng chứng cho Defect Report.

### 6.13. (Tùy chọn, điểm cộng) Tiêu chí nâng cao
- Allure Report thay cho Surefire report.
- GitHub Actions chạy headless (cần SUT deploy được, hoặc chạy bằng docker-compose).
- `NavbarComponent` dùng chung (Page Component pattern).
- Chạy song song JUnit 5 (`junit.jupiter.execution.parallel.enabled=true`).

---

## 7. Test Execution Log và Defect Report

### BM06 – Test Execution Log

| Run ID | Ngày giờ | Build/Commit SUT | Commit test | Người chạy | Môi trường | Tổng | Pass | Fail | Blocked | Skipped | Thời gian | Ghi chú |
|--------|---------|------------------|------------|-----------|-----------|------|------|------|---------|---------|----------|--------|
| RUN-01 | 10/11 14:00 | `a1b2c3` | `d4e5f6` | SV1 | Chrome 130, Win11 | 47 | 40 | 6 | 1 | 0 | 6m12s | Lần chạy đầu |
| RUN-02 | 17/11 09:00 | `a1b2c3` | `g7h8i9` | SV1 | … | 47 | 42 | 5 | 0 | 0 | 5m50s | Sau khi sửa script flaky |

> Phân biệt rõ: **Fail do defect của SUT** (phải báo bug) và **Fail do lỗi script** (locator sai, thiếu wait). Lỗi script phải sửa, không được báo thành bug.

### BM07 – Defect Report (theo ISTQB CTFL 5.5)

```markdown
**Defect ID:** BUG-03
**Title:** [Cart] Thêm cùng một sách 2 lần tạo 2 dòng riêng thay vì cộng dồn số lượng
**Reporter / Date:** Nguyễn Văn A / 12-11-2026
**Module / BR / TC:** M4 Cart / RULE-CART-03 / TC-CART-003
**Environment:** Chrome 130, Win 11, FE commit a1b2c3, BE commit x9y8z7
**Severity:** Major      (Critical / Major / Minor / Trivial)
**Priority:** High       (High / Medium / Low)
**Status:** New          (New → Open → Fixed → Retest → Closed / Reopened / Rejected / Deferred)
**Pre-condition:** Đã đăng nhập user01, giỏ hàng rỗng
**Steps to reproduce:**
1. Mở /book/1, chọn SL = 2, bấm "Thêm vào giỏ"
2. Quay lại /book/1, chọn SL = 3, bấm "Thêm vào giỏ"
3. Mở /cart
**Expected result:** 1 dòng "Clean Code", SL = 5
**Actual result:** 2 dòng "Clean Code" với SL 2 và 3
**Evidence:** target/screenshots/TC-CART-003.png, log console
**Automated test:** CartTest#addSameBookTwice (CSV dòng 2)
**Reproducibility:** 5/5 lần
```

**Hướng dẫn phân loại Severity:**

| Severity | Định nghĩa | Ví dụ |
|----------|-----------|-------|
| Critical | Chặn chức năng chính, không có cách khác, mất dữ liệu hoặc lỗ hổng bảo mật | Không đăng nhập được; SQL injection thành công |
| Major | Chức năng sai nghiệp vụ nhưng vẫn có cách khác | Tổng tiền sai; không cộng dồn số lượng |
| Minor | Sai thông báo, sai validate nhẹ | Thông báo lỗi sai chính tả |
| Trivial | Giao diện, chính tả không ảnh hưởng nghiệp vụ | Lệch canh lề |

Ngoài lỗi chức năng, nhóm nên báo cả:
- **Testability issue:** trùng `id="outlined-required"` ở trang login.
- **Requirement defect:** SRS ghi đăng nhập bằng email nhưng sản phẩm dùng username.

---

## 8. Test Summary Report theo ISTQB

### BM08 – Test Summary (Completion) Report

```markdown
# TEST SUMMARY REPORT – BookStore Automation – Nhóm <số>
Report ID: TSR-BOOKSTORE-G<số>-v1.0     Ngày: …     Người lập: Test Lead

## 1. Tóm tắt (Executive Summary)
3–5 câu: đã test gì, kết quả chung, chất lượng SUT, khuyến nghị Go/No-Go.

## 2. Phạm vi đã kiểm thử
| Module | Có trong kế hoạch | Đã thực thi | Ghi chú |
| M1 Login | ✅ | ✅ | |
| ...

## 3. Sai khác so với Test Plan (Deviations)
Ví dụ: RULE-LOGIN-06 (khóa sau 5 lần) không test vì SUT chưa cài đặt.

## 4. Số liệu thực thi (Test Execution Metrics)
| Module | Tổng TC | Automated | Executed | Pass | Fail | Blocked | Pass rate |
| M1 | 10 | 8 | 10 | 9 | 1 | 0 | 90% |
| M2 | 15 | 12 | 15 | 12 | 3 | 0 | 80% |
| M3 | 10 | 8 | 10 | 10 | 0 | 0 | 100% |
| M4 | 12 | 10 | 12 | 9 | 2 | 1 | 75% |
| **Tổng** | **47** | **38** | **47** | **40** | **6** | **1** | **85,1%** |

Các chỉ số:
- Test execution rate = Executed / Total = …%
- Pass rate = Pass / Executed = …%
- Automation rate = Automated / Total = …%
- Requirement coverage = BR có ≥1 TC Pass / Tổng BR trong phạm vi = …%
- Thời gian chạy regression = … phút (so với chạy thủ công ước tính … phút)

## 5. Tình trạng Defect
| Severity | New/Open | Fixed | Closed | Rejected | Tổng |
| Critical | | | | | |
| Major | | | | | |
| Minor | | | | | |
- Defect density = Số defect / Số module (hoặc / số BR)
- Top 3 defect quan trọng: BUG-03, BUG-05, …
- Module nhiều lỗi nhất (Defect clustering): …

## 6. Đánh giá theo Exit Criteria
| Tiêu chí | Mục tiêu | Thực tế | Đạt? |
| TC High được thực thi | 100% | 100% | ✅ |
| Pass rate | ≥ 90% | 85,1% | ❌ (do 6 defect SUT đã báo) |

## 7. Rủi ro còn lại (Residual Risks)
## 8. Bài học kinh nghiệm (Lessons Learned) – về kỹ thuật và làm việc nhóm
## 9. Khuyến nghị (Go / No-Go / Go có điều kiện)
## 10. Phụ lục: link Surefire report, RTM, danh sách Issue GitHub
```

---

## 9. Làm việc nhóm: phân công công việc

### 9.1. Nguyên tắc phân công

- **Chia theo chiều dọc (theo module), không chia theo chiều ngang (theo loại việc).** Mỗi sinh viên sở hữu **trọn vẹn 1 module**: BR, TC, CSV, Page, Test, chạy, báo bug. Như vậy ai cũng phải học đủ mọi kỹ năng và dễ đánh giá cá nhân.
- Thêm một **vai trò chung** cho mỗi người (Test Lead, Framework Owner, Doc Owner, Defect Manager, Reviewer).
- Những file dùng chung (`BaseTest`, `BasePage`, `pom.xml`, `config.properties`) **chỉ một người sở hữu**, người khác muốn sửa phải tạo PR để tránh conflict.

### 9.2. Bảng phân công mẫu (BM09), nhóm 4–5 người

| Thành viên | Module (dọc) | Vai trò chung (ngang) | Trách nhiệm chính |
|-----------|-------------|-----------------------|-------------------|
| SV1 | M1 Login | **Test Lead** | Viết BM01 Test Plan, BM08 Test Summary; điều phối; merge PR vào `main`; chạy regression cuối |
| SV2 | M2 Register | **Framework Owner** | Tạo skeleton project tuần 1: `pom.xml`, `BaseTest`, `BasePage`, `ConfigReader`, `ScreenshotOnFailure`, `DataGenerator` |
| SV3 | M3 Search | **Documentation Owner** | Gom BM02, BM03, BM04 (RTM); kiểm tra định dạng tài liệu thống nhất |
| SV4 | M4 Cart | **Defect Manager** | Quản lý GitHub Issues, labels, review chất lượng bug report, theo dõi trạng thái defect |
| SV5 (nếu có) | M5 Checkout | **CI/QA Reviewer** | GitHub Actions, review code chéo, kiểm tra quy tắc POM |

**Ma trận RACI** (R = thực hiện, A = chịu trách nhiệm cuối, C = được hỏi ý kiến, I = được thông báo):

| Công việc | SV1 Lead | SV2 FW | SV3 Doc | SV4 Defect | SV5 CI |
|----------|---------|--------|---------|-----------|--------|
| Test Plan (BM01) | A/R | C | C | C | C |
| BR và TC cho module của mình | R (M1) | R (M2) | R/A (M3) | R (M4) | R (M5) |
| Framework base | C | A/R | I | I | C |
| Page + Test + CSV của module | R | R | R | R | R |
| Code review | A | R | R | R | R |
| Defect report | R | R | R | A/R | R |
| Regression cuối và Summary Report | A/R | C | R | R | C |

### 9.3. Kế hoạch 3 tuần

| Tuần | Công việc | Đầu ra (milestone) | GitHub |
|------|----------|--------------------|--------|
| **Tuần 1 – Analysis & Design** | Họp kickoff, thống nhất quy ước; viết Test Plan; mỗi người phân tích BR, viết test condition và TC của module mình; Framework Owner dựng skeleton | BM01, BM02, BM03 (bản nháp); skeleton chạy được 1 test mẫu | Milestone `W1-Design`; PR skeleton được merge **trước ngày 3** |
| **Tuần 2 – Implementation** | Viết Page Object, CSV, Test class; review chéo; chạy thử, sửa script | ≥ 80% TC đã automated | Milestone `W2-Implementation`; mỗi người ≥ 2 PR được merge |
| **Tuần 3 – Execution & Closure** | Code freeze (ngày 2); chạy regression 2 lần (RUN-01, RUN-02); báo bug; viết Summary Report; slide demo | BM06, BM07, BM08, video/demo | Milestone `W3-Closure`; tag `v1.0` |

**Họp nhóm:** daily stand-up 10 phút (online), mỗi người trả lời 3 câu: *Hôm qua làm gì? Hôm nay làm gì? Có vướng gì không?*. Biên bản ghi trong GitHub Discussions hoặc `docs/meetings/`.

### 9.4. Đánh giá đóng góp cá nhân

Điểm cá nhân = Điểm nhóm × Hệ số đóng góp (0,6–1,1). Hệ số dựa trên:
- **Bằng chứng trên GitHub:** số commit, số PR được merge, số review đã làm, số Issue đã tạo (`Insights → Contributors`).
- **Module do mình sở hữu:** chất lượng TC và code.
- **Peer review:** đánh giá chéo trong nhóm (phiếu ẩn danh).
- **Vấn đáp:** GV hỏi ngẫu nhiên một thành viên giải thích code của người khác trong nhóm.

---

## 10. Quy trình làm việc trên GitHub

### 10.1. Khởi tạo (Test Lead + Framework Owner, ngày 1–2)

1. GV tạo **GitHub Classroom group assignment** (hoặc nhóm tự tạo repo private `swt301-fa26-g<số>-selenium` và mời GV làm collaborator).
2. Framework Owner push skeleton project + `.gitignore` + `README.md`.
3. Test Lead cấu hình:
   - **Branch protection** cho `main`: bắt buộc PR, ≥ 1 approval, cấm force push, cấm push trực tiếp.
   - Tạo **Labels**: `bug`, `severity:critical/major/minor/trivial`, `priority:high/medium/low`, `module:login/register/search/cart`, `test-script`, `docs`, `enhancement`.
   - Tạo **Milestones**: `W1-Design`, `W2-Implementation`, `W3-Closure`.
   - Tạo **GitHub Projects (Kanban)** với các cột: *Backlog → To Do → In Progress → In Review → Done*.
   - Thêm `pull_request_template.md` và `ISSUE_TEMPLATE/bug_report.md`.

`.gitignore` tối thiểu:

```gitignore
target/
.idea/
*.iml
out/
.DS_Store
*.log
allure-results/
```

### 10.2. Chiến lược nhánh (GitHub Flow, đơn giản và phù hợp nhóm sinh viên)

```
main  ─────●────────●─────────●──────────●──── (luôn chạy được, tag v1.0)
            \      /  \       /  \        /
 feature/M1-login-page  feature/M2-register-csv  fix/cart-wait-flaky
```

| Loại nhánh | Quy ước tên | Ví dụ |
|-----------|------------|------|
| Tính năng test mới | `feature/<module>-<mô-tả>` | `feature/login-page-object`, `feature/cart-csv-data` |
| Sửa script | `fix/<module>-<mô-tả>` | `fix/search-stale-element` |
| Tài liệu | `docs/<mô-tả>` | `docs/test-plan`, `docs/summary-report` |

> Nhóm muốn thực hành Git Flow thì có thể thêm nhánh `develop`: feature merge vào `develop`, cuối tuần Test Lead merge `develop` vào `main`. Nhóm 4–5 người dùng GitHub Flow là đủ.

### 10.3. Vòng làm việc hằng ngày của một thành viên

```bash
# 1. Lấy code mới nhất
git checkout main
git pull origin main

# 2. Tạo nhánh cho việc mình làm (gắn với Issue #12 trên Kanban)
git checkout -b feature/login-data-driven

# 3. Làm việc và commit nhỏ, thường xuyên
git add src/test/java/.../LoginPage.java
git commit -m "test(login): add LoginPage object with stable locators (#12)"

# 4. Trước khi push, cập nhật main để giảm conflict
git fetch origin
git rebase origin/main          # hoặc: git merge origin/main
mvn clean test -Dtest=LoginTest # PHẢI chạy pass (hoặc fail đúng do bug SUT) trước khi push

# 5. Push và mở Pull Request trên GitHub
git push -u origin feature/login-data-driven
```

### 10.4. Quy ước commit (Conventional Commits)

```
<type>(<scope>): <mô tả ngắn, thể mệnh lệnh> (#issue)

type : test | feat | fix | docs | refactor | chore | ci
scope: login | register | search | cart | base | config
```

Ví dụ:
- `test(cart): add BVA tests for quantity 0,1,99,100 (#21)`
- `fix(search): replace Thread.sleep with explicit wait (#30)`
- `docs(report): add test summary report v1.0`
- `chore(base): bump selenium to 4.21.0`

### 10.5. Pull Request và Code Review

**`.github/pull_request_template.md`:**

```markdown
## Mô tả
- Module: M_ / Issue: #__
- Thay đổi: …

## TC liên quan
TC-XXX-001 … TC-XXX-00n

## Checklist tác giả
- [ ] Đã chạy `mvn clean test -Dtest=<Class>` trên máy local
- [ ] Không có Thread.sleep, không có XPath tuyệt đối
- [ ] Không có assertion trong Page class; không có locator trong Test class
- [ ] Dữ liệu test nằm trong CSV, không hard-code
- [ ] Đã cập nhật BM03 (cột Automation Method)

## Kết quả chạy
Tests run: _, Failures: _, Errors: _ (đính kèm ảnh chụp nếu có)
```

**Quy tắc review:**
- Mỗi PR cần **≥ 1 approve** từ thành viên khác (ưu tiên review chéo theo vòng: SV1→SV2→SV3→SV4→SV1).
- Review trong **24 giờ**. Comment phải cụ thể (ví dụ: "Dòng 23: nên dùng `waitVisible` thay vì `findElement`").
- PR nhỏ: **≤ 300 dòng thay đổi**, 1 PR = 1 mục đích.
- Merge bằng **Squash and merge**, xóa nhánh sau khi merge.

### 10.6. Báo bug bằng GitHub Issues

`.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug report
about: Báo lỗi SUT phát hiện khi chạy test
labels: bug
---
**Module / BR / TC:**
**Severity:**   **Priority:**
**Environment:**
**Pre-condition:**
**Steps to reproduce:**
1.
**Expected:**
**Actual:**
**Evidence:** (kéo thả screenshot từ target/screenshots)
**Automated test:** Class#method
```

- Defect Manager gắn label severity/priority và milestone.
- Tiêu đề Issue chính là Defect ID trong BM07 (ví dụ Issue #15 tương ứng BUG-03), giúp truy vết hai chiều.
- Lỗi script của nhóm dùng label `test-script`, **không** dùng label `bug`.

### 10.7. Xử lý merge conflict

- Hay xảy ra ở: `pom.xml`, `BaseTest`, file Excel BM03.
- **Phòng tránh:** file chung chỉ có 1 owner; **mỗi người một sheet** trong BM03, hoặc tốt hơn là mỗi người một file `docs/testcases/TC_<module>.csv/xlsx`, Doc Owner gộp ở tuần 3.
- File Excel (nhị phân) **không merge được**: phải thống nhất thứ tự người cập nhật, hoặc dùng Google Sheets rồi export vào repo ở cuối.
- Khi có conflict: `git pull --rebase origin main`, sửa file, `git add`, `git rebase --continue`, chạy lại test, rồi push.

### 10.8. (Tùy chọn) GitHub Actions: `.github/workflows/selenium.yml`

```yaml
name: Selenium Regression
on:
  pull_request:
    branches: [ main ]
  workflow_dispatch:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '17', cache: maven }
      # Yêu cầu: SUT được deploy công khai hoặc khởi động bằng docker compose ở bước trước
      - name: Run tests (headless)
        run: mvn -B clean test -Dheadless=true -Dbase.url=${{ vars.BASE_URL }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: |
            target/surefire-reports
            target/screenshots
```

> Để `-Dheadless` và `-Dbase.url` có tác dụng, `ConfigReader` phải ưu tiên `System.getProperty(key)` trước khi đọc file properties.

---

## 11. Sản phẩm nộp và tiêu chí chấm điểm

### 11.1. Nộp bài
- Link repo GitHub (đã gắn tag `v1.0`) + file nén repo.
- Thư mục `docs/` có đủ BM01–BM09.
- `target/site/surefire-report.html` của lần chạy cuối (copy vào `docs/reports/`).
- Video demo 5–7 phút: chạy `mvn clean test`, giải thích 1 TC fail và Defect tương ứng.

### 11.2. Rubric (10 điểm)

| Tiêu chí | Trọng số | Mức tốt (đủ điểm) |
|---------|---------|-------------------|
| 1. Phân tích BR và Test Plan (BM01, BM02) | 1,0 | BR testable, rõ ràng; Test Plan đủ mục; rủi ro hợp lý |
| 2. Thiết kế Test Case và RTM (BM03, BM04) | 2,0 | Áp dụng đúng EP/BVA/DT/ST; Expected cụ thể; 100% BR có TC |
| 3. Framework POM | 2,0 | Đúng 8 quy tắc ở 6.2; BasePage tái sử dụng; không Thread.sleep; locator ổn định |
| 4. Data-driven CSV | 1,0 | Toàn bộ dữ liệu trong CSV có cột expected; dữ liệu động không trùng |
| 5. Thực thi, Log, Defect (BM06, BM07) | 1,5 | ≥ 2 lần chạy; bug report tái hiện được, có screenshot; phân biệt lỗi script và lỗi SUT |
| 6. Test Summary Report (BM08) | 1,0 | Số liệu khớp với Surefire; đánh giá theo exit criteria; có khuyến nghị |
| 7. Làm việc nhóm và GitHub | 1,5 | Branch protection, PR có review, commit đúng quy ước, Issue và Kanban được dùng thật, đóng góp đều |
| **Cộng** | **10** | |
| Điểm cộng (tối đa +1) | | CI GitHub Actions, Allure, M5 Checkout, chạy song song |

**Trừ điểm (lỗi nặng):** Thread.sleep (−0,5); assertion trong Page (−0,5); hard-code dữ liệu trong test (−0,5); push thẳng vào `main` hoặc không có review (−0,5); sửa expected trong CSV cho khớp bug (−1).

---

## 12. Checklist trước khi nộp

**Tài liệu**
- [ ] BM01 Test Plan có scope, approach, entry/exit criteria, rủi ro
- [ ] BM02 mọi BR có ID, testable
- [ ] BM03 đủ số TC tối thiểu; có cột Automation Method
- [ ] BM04 RTM: 100% BR có ít nhất 1 TC
- [ ] BM06 có ≥ 2 lần chạy
- [ ] BM07 mỗi TC Fail do SUT có Defect ID và GitHub Issue tương ứng
- [ ] BM08 số liệu khớp Surefire report
- [ ] BM09 bảng phân công + tự đánh giá đóng góp

**Code**
- [ ] `mvn clean test` chạy được trên máy sạch theo hướng dẫn trong README
- [ ] Không có `Thread.sleep`, XPath tuyệt đối, `By` trong Test class, assert trong Page
- [ ] Dữ liệu test 100% từ CSV (UTF-8, có header, có cột `tcId`)
- [ ] Screenshot tự động khi fail

**GitHub**
- [ ] `main` được bảo vệ; mọi thay đổi qua PR có ≥ 1 approve
- [ ] Commit theo Conventional Commits, có tham chiếu Issue
- [ ] Mỗi thành viên có ≥ 3 PR được merge và ≥ 3 lần review
- [ ] Kanban cập nhật; Issues được đóng hoặc ghi rõ trạng thái
- [ ] Tag `v1.0` trên commit nộp bài

---

