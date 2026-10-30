# 🚀 QUY TRÌNH LÀM VIỆC NHÓM — SWT301 AUTOMATION TESTING (GROUP 7)

> **Dự án kiểm thử tự động hệ thống EduMi**  
> **Framework:** TypeScript + Vitest + Selenium WebDriver  
> **Mục tiêu:** 10 Modules, 100 Test Cases, tuân thủ nghiêm ngặt chuẩn ISTQB & Agile/Scrum.

---

## 📌 1. BẢNG PHÂN CÔNG NHIỆM VỤ (5 THÀNH VIÊN — 10 MODULES)

| Thành viên | Vai trò | Module phụ trách | Số lượng TC | Thư mục Test & Page |
|:---|:---|:---|:---:|:---|
| **SV1 (Leader)** | Test Lead / Framework | **M1** (Trang chủ & Khóa học) & **M2** (Xác thực & Phân quyền) | 20 TCs | `e2e/pages/HomePage.ts`, `LoginPage.ts`<br>`e2e/tests/m01_landing.test.ts`, `m02_auth.test.ts` |
| **SV2** | Automation Tester | **M3** (Hồ sơ cá nhân) & **M4** (Lớp học trực tuyến) | 20 TCs | `e2e/pages/ProfilePage.ts`, `ClassroomPage.ts`<br>`e2e/tests/m03_profile.test.ts`, `m04_classroom.test.ts` |
| **SV3** | Automation Tester | **M5** (Quản lý ngân hàng đề) & **M6** (Làm bài thi trực tuyến) | 20 TCs | `e2e/pages/ExamBankPage.ts`, `ExamRoomPage.ts`<br>`e2e/tests/m05_exambank.test.ts`, `m06_examroom.test.ts` |
| **SV4** | Automation Tester | **M7** (Chấm thi & AI Scanner) & **M8** (Thảo luận & Forum) | 20 TCs | `e2e/pages/ExamGradingPage.ts`, `ForumPage.ts`<br>`e2e/tests/m07_grading.test.ts`, `m08_forum.test.ts` |
| **SV5** | Automation Tester | **M9** (Thông báo & Tin nhắn) & **M10** (Báo cáo & Phân tích) | 20 TCs | `e2e/pages/NotificationPage.ts`, `AnalyticsPage.ts`<br>`e2e/tests/m09_notification.test.ts`, `m10_analytics.test.ts` |

---

## 🌳 2. QUY ƯỚC QUẢN LÝ NHÁNH (GIT BRANCHING STRATEGY)

Hệ thống repository áp dụng mô hình Git Flow rút gọn có thiết lập **Branch Protection Rules**:

```text
main (Khóa chặt - Cần 2 Reviews)
  └── develop (Mặc định - Cần 1 Review)
        ├── feat/m01-landing-page
        ├── feat/m02-auth-system
        ├── feat/m03-profile-management
        └── ... (Nhánh làm việc của từng thành viên)
```

1. **`main`**: Nhánh phát hành / nộp bài cuối kỳ. **Tuyệt đối cấm commit trực tiếp**. Chỉ merge từ `develop` khi kết thúc Sprint và cần tối thiểu **2 thành viên review**.
2. **`develop`**: Nhánh làm việc tích hợp chung của toàn nhóm. **Cấm commit trực tiếp**. Mọi công việc phải mở Pull Request từ nhánh con và cần tối thiểu **1 thành viên review**.
3. **`feat/mXX-<tên-chức-năng>`**: Nhánh riêng của từng thành viên khi làm Module được phân công. Tạo từ `develop` và merge lại vào `develop`.

---

## 🔄 3. QUY TRÌNH 6 BƯỚC LÀM VIỆC HẰNG NGÀY (DAILY WORKFLOW)

Mỗi khi bắt đầu làm một công việc kiểm thử mới, từng thành viên thực hiện nghiêm túc 6 bước sau:

### BƯỚC 1: Nhận Task trên GitHub Project Board
1. Truy cập tab **Projects** $\rightarrow$ mở board **`SWT301 - EduMi Automation Testing (Group 7)`**.
2. Tìm thẻ Issue nhiệm vụ Module của mình (hoặc bấm **New Issue** theo template `📌 Nhiệm vụ kiểm thử Module`).
3. Kéo thẻ từ cột **`Todo`** sang cột **`In Progress`**.

---

### BƯỚC 2: Cập nhật code mới nhất & Tạo nhánh riêng
Mở Terminal tại thư mục `EduMi` trên máy cá nhân và chạy:
```powershell
# 1. Chuyển về nhánh develop và kéo code mới nhất của cả nhóm về
git checkout develop
git pull origin develop

# 2. Tạo nhánh mới cho Module của mình (Ví dụ làm Module M3)
git checkout -b feat/m03-profile-management
```

---

### BƯỚC 3: Chuẩn bị môi trường Test Local
1. Đảm bảo đã có file cấu hình `.env.e2e` (nếu chưa có thì copy từ file mẫu):
   ```powershell
   copy .env.e2e.example .env.e2e
   ```
2. Nếu có thư viện mới, chạy:
   ```powershell
   npm install
   ```

---

### BƯỚC 4: Lập trình kiểm thử theo mô hình Page Object Model (POM)
Tuân thủ nghiêm ngặt cấu trúc 3 phần tách biệt:

#### 1. Dữ liệu Test (`e2e/data/mXX_..._data.csv`):
- Định dạng UTF-8, có dòng header. Cột đầu tiên là `tcId`, có cột `expected...`.
- Ví dụ: `e2e/data/m03_profile_data.csv`.

#### 2. Trang đại diện (`e2e/pages/MxxPage.ts`):
- Kế thừa từ `BasePage`.
- **Chỉ chứa các locator và hàm thao tác (`click`, `type`, `getText`, `waitVisible`)**.
- **Tuyệt đối KHÔNG chứa assertion (`expect`)**.

#### 3. Kịch bản kiểm thử (`e2e/tests/mxx.test.ts`):
- Sử dụng `useDriver()` từ `../base/BaseTest`.
- Đọc dữ liệu từ file CSV bằng `readCsv(...)`.
- Chạy lặp kiểm thử bằng `it.each(rows)('$tcId: $description', async (row) => { ... })`.
- **Toàn bộ assertion (`expect(...)`) đặt tại đây**.

---

### BƯỚC 5: Chạy kiểm thử nội bộ (Self-Check Local)
Trước khi đẩy code lên, bắt buộc phải chạy thử trên máy của mình:

1. **Terminal 1 — Khởi chạy EduMi:**
   ```powershell
   npm run dev
   ```
2. **Terminal 2 — Chạy kịch bản kiểm thử của mình:**
   ```powershell
   npm run test:e2e -- e2e/tests/mxx.test.ts
   ```
   *(Trình duyệt Chrome sẽ tự động bật lên thực hiện các thao tác và đóng lại. Yêu cầu kết quả in ra **PASS 10/10**).*

3. **Kiểm tra tính an toàn với Unit Test:**
   ```powershell
   npm test
   ```
   *(Đảm bảo 45 bài Unit test cũ vẫn XANH 100%, không bị ảnh hưởng).*

---

### BƯỚC 6: Commit, Push & Mở Pull Request (PR)
1. Thêm và commit code theo chuẩn Conventional Commits:
   ```powershell
   git add .
   git commit -m "feat(m03): hoàn thành 10 test cases tự động cho module hồ sơ cá nhân (closes #số_issue)"
   git push -u origin feat/m03-profile-management
   ```

2. Lên GitHub, bấm **Compare & pull request**:
   - **Base branch:** Chọn **`develop`** (KHÔNG chọn `main`).
   - Điền đầy đủ thông tin theo mẫu **Pull Request Template** đã hiện sẵn.
   - Tick chọn checklist kiểm tra.
   - Dán ảnh chụp Terminal chạy PASS 10 TCs vào phần kết quả.
   - Bấm **`Create pull request`**.

---

## 👥 4. QUY TRÌNH REVIEW & MERGE CODE

1. **Nhờ người Review:**
   - Người tạo PR tag `@tên_thành_viên_khác` vào mục Reviewers hoặc nhắn lên nhóm Zalo/Discord để nhờ review.
2. **Thao tác của người Review:**
   - Mở PR $\rightarrow$ vào tab **Files changed**.
   - Kiểm tra xem code có vi phạm quy tắc: hard-code mật khẩu không, có dùng sleep cứng không, Page class có chứa expect không.
   - Bấm **Review changes** $\rightarrow$ chọn **Approve** $\rightarrow$ bấm **Submit review**.
3. **Merge PR:**
   - Sau khi có 1 Approval màu xanh, tác giả hoặc Leader bấm **Squash and merge** hoặc **Merge pull request**.
   - Xóa nhánh tính năng (`Delete branch`) trên GitHub để giữ repo gọn gàng.
4. **Cập nhật Kanban Board:**
   - Thẻ Issue gắn với PR sẽ tự động chuyển sang cột **`Done`** (nhờ cú pháp `closes #id`).

---

## 🐞 5. QUY TRÌNH BÁO CÁO LỖI PHẦN MỀM (DEFECT MANAGEMENT)

Trong quá trình chạy test tự động, nếu Test Case bị **FAILED** do website EduMi chạy sai nghiệp vụ (không phải do sai locator):
1. Kiểm tra ảnh chụp bằng chứng lỗi tự động sinh ra tại thư mục:  
   `e2e-reports/screenshots/<tên_test_fail>.png`.
2. Vào tab **Issues** trên GitHub $\rightarrow$ bấm **New issue**.
3. Chọn template: **`🐞 Báo cáo lỗi phần mềm (Defect / Bug Report)`**.
4. Điền các bước tái hiện, kết quả thực tế, kết quả mong đợi, độ nghiêm trọng (Severity: Critical / High / Medium / Low).
5. Đính kèm ảnh chụp lỗi từ thư mục `e2e-reports/screenshots/` vào Issue.
6. Gán nhãn `bug`, chọn Milestone Sprint tương ứng.

---

## ⚠️ 6. QUY TẮC VÀNG (DO'S & DON'TS CHO CẢ NHÓM)

| CẤM LÀM (DON'TS) ❌ | BẮT BUỘC LÀM (DO'S) ✅ |
|:---|:---|
| ❌ Cấm push thẳng lên `main` hoặc `develop`. | ✅ Luôn tạo nhánh riêng `feat/mXX-...` và mở PR. |
| ❌ Cấm commit file `.env.e2e` hoặc mật khẩu thật. | ✅ Dùng biến môi trường từ `env` hoặc placeholder CSV. |
| ❌ Cấm dùng `sleep()` hoặc `setTimeout()` cố định. | ✅ Dùng `waitVisible`, `driver.wait(until...)`. |
| ❌ Cấm viết `expect()` trong các file `Page.ts`. | ✅ Mọi assertion chỉ được nằm trong `*.test.ts`. |
| ❌ Cấm hard-code dữ liệu kiểm thử trong code. | ✅ Tách toàn bộ dữ liệu ra file `.csv` trong `e2e/data/`. |
| ❌ Cấm dùng XPath tuyệt đối (`/html/body/...`). | ✅ Ưu tiên dùng `data-testid`, `id`, CSS Selector ngắn gọn. |

---

*Chúc Group 7 hoàn thành xuất sắc đồ án môn SWT301 với kết quả cao nhất!* 🎓
