

## 1. Overall Description

### 1.1 Product Overview

HIPZI là nền tảng giáo dục trực tuyến ứng dụng AI, được thiết kế cho học sinh, phụ huynh, giáo viên, nhân viên kiểm duyệt (Staff) và quản trị viên (Admin) tại Việt Nam. Nền tảng hướng tới xây dựng một hệ sinh thái học tập hiện đại, nơi người học có thể tiếp cận tài liệu học tập chất lượng, luyện tập kiến thức qua các hình thức học tương tác — trắc nghiệm, flashcard, thi tự luận — kết nối với giáo viên đã được xác thực, và nhận hỗ trợ học tập từ AI.

HIPZI không chỉ là một kho lưu trữ tài liệu học tập. Tầm nhìn dài hạn là trở thành một nền tảng giáo dục thông minh, kết hợp tài liệu học tập được chọn lọc, lớp học ảo do giáo viên dẫn dắt, khóa học e-learning có cấu trúc, lộ trình học tập cá nhân hóa, và trí tuệ nhân tạo vào một trải nghiệm học tập thống nhất.

Trước khi tạo lộ trình , có survey trước khi đưa ra lộ trình.
Quy trình học tập cốt lõi của HIPZI diễn ra như sau:
- Giáo viên tải lên tài liệu học tập.
- Staff kiểm duyệt và phê duyệt nội dung.
- AI hỗ trợ scan tài liệu ra quiz hoặc flashcard.
- Giáo viên xem lại nội dung do AI tạo trước khi xuất bản.
- Học sinh luyện tập bằng các quiz, flashcard, và bài thi thử đã xuất bản.
- Nền tảng theo dõi hoạt động học tập và cung cấp phản hồi.
- Staff và Admin quản trị chất lượng nội dung và vận hành nền tảng.

*(Trình chiếu Context Diagram)*

### 1.2 Business Rules

Đây là các quy tắc nghiệp vụ cốt lõi chi phối toàn bộ nền tảng HIPZI:



- **BR-ROLE-001**: Mỗi tài khoản người dùng phải có ít nhất một vai trò được gán (Student, Parent, Teacher, Staff, hoặc Admin).
- **BR-ROLE-002**: Người dùng chỉ được truy cập các tính năng và dữ liệu được cho phép theo vai trò của mình.
- **BR-ROLE-003**: Teacher và Staff mặc định được xem là hai vai trò riêng biệt. Một người dùng chỉ có thể giữ cả hai vai trò khi được Admin gán rõ ràng.
- **BR-ROLE-004**: Một người dùng chỉ có thể giữ nhiều vai trò khi được Admin gán rõ ràng.
- **BR-TCH-001**: Người dùng phải nộp đơn đăng ký làm giáo viên và được Staff phê duyệt trước khi trở thành Teacher đã xác thực trên HIPZI.
- **BR-TCH-002**: Teacher không được phép tự phê duyệt đơn đăng ký giáo viên, khóa học hoặc lớp học của chính mình, kể cả khi họ cũng giữ vai trò Staff.
- **BR-MAT-001**: Tài liệu học tập do Teacher (đã được xác thực) tải lên sẽ tự động được phê duyệt (Approved) và xuất bản mà không cần qua quy trình kiểm duyệt của Staff.
- **BR-MAT-002**: Học sinh chỉ được truy cập các tài liệu ở trạng thái Approved và Visible.
- **BR-COURSE-001**: Trái ngược với tài liệu, Khóa học (Course) và Lớp học (Classroom) do Teacher tạo ra bắt buộc phải được Staff kiểm duyệt trước khi hiển thị công khai.
- **BR-AI-001**: Trợ lý AI (HIPZI AI Chatbot) chỉ được phép tư vấn và đề xuất các lớp học, khóa học, tài liệu đã ở trạng thái công khai (Public/Approved) cho người dùng.
BR-MOCK-001: Các bài thi thử (Mock Exam) sau khi tạo xong phải được đổi trạng thái thành "Xuất bản" (Published) thì mới xuất hiện trong Phòng Thi (Exam Room) của học sinh.
- **BR-PAY-001**: Việc mua khóa học được xử lý thông qua chuyển khoản trực tiếp (mã VietQR). Khóa học sẽ tự động được kích hoạt và cấp quyền sau khi hệ thống nhận được webhook xác nhận thanh toán thành công, thay vì trừ tiền vào ví nội bộ.



**Nhóm Quy tắc Tài chính & Doanh thu (Finance & Revenue):**
- **BR-REV-001 (Phân bổ doanh thu):** Khi học sinh mua khóa học thành công, toàn bộ doanh thu (100% giá bán) sẽ được hệ thống cộng trực tiếp vào Số dư ví (Wallet Balance) của Teacher sở hữu khóa học đó.
- **BR-REV-002 (Rút tiền):** Teacher có quyền tạo yêu cầu rút tiền (Withdrawal Request) từ số dư ví của mình. Các yêu cầu rút tiền này bắt buộc phải qua sự kiểm duyệt và xử lý thủ công (Duyệt/Từ chối) từ phía Staff hoặc Admin.
**Nhóm Quy tắc Lớp học ảo (Virtual Classroom):**
- **BR-CLASS-001 (Quyền truy cập lớp học):** Học sinh chỉ có thể truy cập Tài liệu, Bài tập và Quiz của một lớp học ảo sau khi tham gia thành công và được Teacher cấp quyền (Trạng thái Enrollment là "Accepted").
- **BR-CLASS-002 (Nộp bài trễ hạn):** Hệ thống không chặn cứng việc nộp bài tập (Homework) sau thời hạn quy định (Deadline). Học sinh vẫn có thể nộp bài sau hạn, nhưng hệ thống sẽ tự động gắn cờ "Nộp trễ" (Late Submission) để Teacher xem xét trừ điểm.
**Nhóm Quy tắc Thi cử & Chấm điểm (Exam & Grading):**
- **BR-EXAM-001 (Chấm điểm tự động):** Đối với bài thi thử (Mock Exam) và bài kiểm tra trong lớp (Classroom Quiz), hệ thống sẽ tự động chấm điểm và trả về kết quả (Auto-scoring) ngay lập tức đối với các định dạng câu hỏi khách quan (Trắc nghiệm, Đúng/Sai).
- **BR-EXAM-002 (Chấm điểm tự luận):** Các câu hỏi dạng tự luận (Essay) trong bài thi/bài tập sẽ bị bỏ qua trong khâu chấm điểm tự động, và bắt buộc phải có sự can thiệp chấm điểm và ghi chú phản hồi (Feedback) thủ công từ Teacher.
**Nhóm Quy tắc Bảo mật & Quản trị (Security & Governance):**
- **BR-SEC-001 (Khóa tài khoản):** Quản trị viên (Admin) có đặc quyền khóa (Ban) hoặc cấm vĩnh viễn bất kỳ tài khoản vi phạm nào. Người dùng bị khóa sẽ bị chặn ở bước đăng nhập và mất toàn bộ quyền truy cập nền tảng hiện tại.
---

## 2. User Requirements

### 2.1 System Actors


1. **Student (Học sinh)**: Người học chính. Có thể tìm kiếm và xem các tài liệu miễn phí, tham gia các lớp học ảo, làm bài tập (Trắc nghiệm, Tự luận), tham gia các kỳ thi thử (Mock Exam) và thanh toán mua khóa học qua hình thức chuyển khoản (VietQR). 
2. **Parent (Phụ huynh)**: Người dùng phụ, có thể xem điểm số lớp học, lịch học và học phí học tập của con. 
3. **Teacher / Lecturer (Giáo viên)**: Giáo viên đã được xác thực (Approved). Có quyền tải lên tài liệu học tập, tạo các bài kiểm tra (Quiz/Essay), tạo và quản lý lớp học ảo, xây dựng các khóa học có cấu trúc, đồng thời theo dõi doanh thu bán khóa học và tạo yêu cầu rút tiền từ ví của mình.
4. **Staff (Nhân viên vận hành)**: Người vận hành nền tảng. Chịu trách nhiệm kiểm duyệt đơn đăng ký giáo viên, xét duyệt các Khóa học và Lớp học mới, tạo và quản lý các kỳ thi thử (Mock Exam), xử lý các yêu cầu rút tiền của Teacher và kiểm soát chất lượng nội dung nền tảng.
5. **Admin (Quản trị viên)**: Người quản trị cấp cao nhất. Có quyền quản lý danh sách người dùng, gán/thu hồi quyền Staff, quản lý danh mục hệ thống (Môn học), thiết lập chính sách, xem nhật ký kiểm duyệt (Audit Logs), khóa (Ban) tài khoản vi phạm và có quyền ghi đè mọi quyết định của Staff.
6. **Guest**: Khách chưa đăng nhập, có thể truy cập trang chủ và đăng ký tài khoản.

### 2.2 Use Cases



Hệ thống có tổng cộng 18 use case chính, được nhóm theo luồng nghiệp vụ:

**Nhóm Xác thực & Đăng ký:**
- UC-01 System Login: Người dùng đã đăng ký đăng nhập an toàn, hỗ trợ Google OAuth.
- UC-13 Register Account: Guest đăng ký tài khoản mới. Đối với đăng ký thường, người dùng chọn trực tiếp vai trò (Học sinh, Giảng viên, Phụ huynh) ngay trong form; đối với đăng ký qua Google OAuth, hệ thống sẽ chuyển hướng đến trang chọn vai trò sau khi xác thực thành công.


**Nhóm Giáo viên & Kiểm duyệt:**
- UC-14 Apply for Teacher Role: Người dùng nộp hồ sơ giáo viên để Staff xét duyệt.
- UC-15 Moderate Teacher Application: Staff/Admin xét duyệt hồ sơ, phê duyệt hoặc từ chối.
- UC-02 Upload Learning Document: Teacher đã xác thực tải lên tài liệu (PDF/Word) kèm metadata và hệ thống tự động xuất bản công khai.
- UC-03 Moderate Course and Classroom: Staff xét duyệt Khóa học (Course) và Lớp học (Classroom) đang ở trạng thái chờ, phê duyệt để hiển thị công khai hoặc từ chối kèm phản hồi.

**Nhóm Học tập & Thi cử:**
- UC-16 Browse and Search Materials: Student tìm kiếm, lọc theo môn học, và xem tài liệu công khai.
- UC-06 AI Chat Assistant: Người dùng tương tác với Trợ lý AI (HIPZI Bot) để được tư vấn lộ trình và gợi ý các tài liệu, khóa học, lớp học.
- UC-04 Take Mock Exam: Student chọn một bài thi thử (Mock Exam) đã xuất bản, hoàn thành, và xem kết quả cùng lịch sử điểm số.

**Nhóm Khóa học & Doanh thu:**
- UC-09 Create E-Learning Course: Teacher tạo khóa học có cấu trúc (module, bài học) kèm giá, gửi Staff xét duyệt.
- UC-10 Purchase Course via Bank Transfer: Student thanh toán khóa học thông qua mã VietQR. Hệ thống tự động mở khóa nội dung dựa trên webhook từ SePay.
- UC-20 Request Revenue Withdrawal: Teacher tạo yêu cầu rút doanh thu bán khóa học (rút về ví MoMo); Staff tiếp nhận, phê duyệt và xử lý thanh toán thủ công.

**Nhóm Lớp học ảo:**
- UC-17 Create and Manage Classroom: Teacher tạo lớp học ảo với thẻ lớp học có code riêng, gửi Staff xét duyệt trước khi học sinh có thể tham gia.
- UC-18 Enroll in Classroom: Student tham gia lớp bằng mã code lớp học và gửi yêu cầu truy cập và chờ Teacher chấp nhận.
- UC-11 Create Classroom Assignment / Quiz: Teacher tạo bài tập (yêu cầu nộp file) hoặc bài thi trắc nghiệm, tự luận, đúng sai trong lớp học.
- UC-12 Submit Classroom Assignment / Quiz: Student nộp bài tập hoặc làm quiz được giao trong lớp.
- UC-19 Grade Classroom Assignment: Teacher chấm bài nộp tự luận của học sinh, ghi phản hồi và cho điểm (Trắc nghiệm được hệ thống chấm tự động).

**Nhóm Quản trị:**
- UC-21 Manage Platform Governance: Admin quản lý toàn bộ nền tảng — vai trò người dùng, khóa tài khoản (Ban), gán quyền Staff, quản lý môn học, xem nhật ký hoạt động và ghi đè cấp nền tảng.

---

### 3.1 System Functional Overview



Hệ thống có 17 màn hình chính, chia theo nhóm chức năng:

- **Authentication**: Login Page, Register Page.
- **Student Learning**: Student Dashboard — tổng quan XP, streak, truy cập nhanh Exam Room, Materials Repository, My Courses, Classrooms.
- **Exam Room**: Exam Room Home, Mock Exam Interface.
- **Materials Repository**: Repository List, Material Detail.
- **Course Store**: Course Catalog, Course Detail/Lesson Player.
- **Classroom**: Classroom Space — các tab Materials, Assignments, Quizzes, Members, Class Rules.
- **Teacher Tools**: Teacher Dashboard, Material Upload Form, AI Exam Generation Panel (Scan đề thi).
- **Staff Tools**: Staff Dashboard — hàng chờ Teacher Applications, Course Review Queue, Classroom Review Queue, Withdrawal Request Queue.
- **Admin Tools**: Admin Dashboard — User Management, Role Assignment, Subject Management, Audit Logs.
- **Profile & Wallet**: Hiển thị XP, streak, thống kê học tập, số dư ví, lịch sử giao dịch.

Về phân quyền màn hình: Guest chỉ truy cập được Landing Page và Login/Register. Student truy cập được Dashboard, Materials Repository, Exam Room, Course Catalog, Course Enrollment, Classroom (view), và Profile & Wallet. Teacher có thêm quyền vào Teacher Dashboard, Material Upload, AI Exam Generation, và Classroom/Course Management. Staff và Admin có quyền vào Staff Dashboard/Review Queues và Mock Exam Management. Riêng Admin Dashboard/User Management chỉ Admin mới truy cập được.

**Các chức năng không có màn hình riêng (Non-Screen Functions)** — chạy nền:
- AI Exam Scanner: Chạy ngầm xử lý ảnh (OCR) hoặc văn bản thô, gọi API LLM (Groq/Gemini) để tự động bóc tách thành danh sách câu hỏi trắc nghiệm/tự luận cho lớp học.
- AI Chat Assistant: Chạy nền gọi API LLM để tư vấn lộ trình học tập, gợi ý tài liệu và lớp học dựa trên truy vấn của người dùng.
- OTP Verification Service: gửi mã OTP qua email cho đăng ký, đặt lại mật khẩu, xác thực 2 lớp.
- In-App Notification Dispatcher: gửi thông báo hệ thống khi có sự kiện quan trọng (duyệt hồ sơ, duyệt rút tiền, nhắc bài).
- Cloud File Upload Service: xử lý upload file an toàn lên nền tảng Cloud Storage - Supabase Storage.
- Exam Auto-Scorer: tự động chấm điểm bài thi trắc nghiệm ngay khi nộp bài.
- Streak Updater: chuỗi ngày học tập (streak) khi vào hoạt động học tập.
- Payment Gateway Webhook Handler: xử lý webhook từ SePay (chuyển khoản VietQR), tự động mở khóa khóa học hoặc cập nhật ví.


Hệ thống có 16 thực thể dữ liệu chính: User, Role, Teacher_Application, Subject, Learning_Material, Course, Course_Order, Course_Enrollment, Wallet_Transaction, Withdrawal_Request, Mock_Exam, Exam_Question, Classroom, Classroom_Exam, Classroom_Assignment, và Assignment_Submission.


### 3.2 Feature: Authentication & Role Management

**Đăng ký tài khoản (User Registration):** Guest chọn vai trò tương ứng (Student/Teacher/Parent) và điền thông tin đăng ký, hệ thống xác thực tên, email, mật khẩu , tạo tài khoản mới, gửi email xác thực OTP. Người dùng Google OAuth được xác thực tự động.

Chi tiết quan trọng: email phải duy nhất trên toàn hệ thống; mật khẩu tối thiểu 8 ký tự, được lưu dưới dạng băm SHA-256 kết hợp Base64 (dự kiến nâng cấp BCrypt ở Phase 2); trường vai trò trong yêu cầu đăng ký được whitelist phía server chỉ cho phép 'student', 'parent', hoặc 'teacher' — vai trò Admin/Staff tuyệt đối không thể tự gán; mã OTP hết hạn sau 5 phút.

**Đăng nhập (User Login):** Người dùng đã đăng ký nhập thông tin đăng nhập, hệ thống xác thực với hash đã lưu, tạo phiên đăng nhập (Session), và chuyển hướng đến dashboard tương ứng với vai trò.

Chi tiết: sai thông tin đăng nhập trả về thông báo lỗi an toàn; tài khoản bị khóa/tạm ngưng bị từ chối kèm cảnh báo; đăng nhập Google OAuth tự tạo tài khoản nếu chưa tồn tại, hoặc liên kết với tài khoản hiện có; token "Remember Me" dùng mô hình selector/validator với validator được băm bảo mật trong database.


### 3.3 Feature: Teacher Application & Staff Moderation

**Nộp đơn đăng ký giáo viên:** Người dùng đã đăng nhập tải lên bằng cấp, chứng chỉ, giấy tờ tùy thân, nhập tiểu sử giảng dạy và các môn học, rồi nộp. Đơn được lưu với trạng thái 'Pending' và xuất hiện trong hàng chờ xét duyệt của Staff.

Chi tiết: mỗi người dùng chỉ có một đơn đang hoạt động tại một thời điểm; người đã có vai trò Teacher được có thể cập nhập lại thông tin.

**Staff xét duyệt đơn giáo viên:** Staff xem xét chứng chỉ đã nộp, phê duyệt hoặc từ chối. Khi phê duyệt, hệ thống sẽ cho phép người dùng đăng tải tài nguyên lên trang web. Khi từ chối, có thể ghi lý do (tùy chọn).


### 3.4 Feature: Study Material Upload (Tự động xuất bản)

**Tải lên tài liệu học tập:** Teacher đã được duyệt (Approved) truy cập vào form tải lên trong Teacher Dashboard, điền metadata tài liệu (tiêu đề, môn học, lớp, phân loại) và tải lên file (PDF/Word). Sau khi nộp, hệ thống sẽ lưu file trên Cloud Storage (Supabase) và tài liệu được tự động chuyển sang trạng thái xuất bản công khai (Published) mà không cần qua bước Staff xét duyệt. 

Chi tiết: chỉ Teacher đã được Staff xác thực mới có quyền tải lên; hệ thống kiểm tra định dạng file (chặn mã độc, file thực thi) và giới hạn dung lượng tải lên tối đa (50MB) tại server trước khi đẩy lên cloud; đường dẫn file an toàn được lưu trong database.


### 3.5 Feature: AI Exam Scanner (Quét & Tạo đề thi tự động)

**Tạo đề thi bằng AI trong Lớp học ảo:** Teacher truy cập vào không gian quản lý lớp học (Classroom Space), chọn tính năng "Scan bằng AI". Hệ thống cho phép tải lên ảnh chụp đề thi hoặc nhập đoạn văn bản thô. Ảnh sẽ được xử lý bằng OCR (nếu có), sau đó toàn bộ dữ liệu văn bản được gửi qua API LLM (Groq/Gemini). Hệ thống nhận về cấu trúc câu hỏi (trắc nghiệm/tự luận) và tự động điền sẵn vào form tạo đề thi.

Chi tiết: Teacher có thể tự do chỉnh sửa, xóa, hoặc thêm bớt các câu hỏi do AI quét ra trước khi chính thức lưu vào cơ sở dữ liệu; chức năng này đã khóa loại hình Flashcard; mọi lỗi nhận diện hình ảnh hoặc đứt kết nối API sẽ được thông báo ngay lập tức (toast message) để người dùng thử lại.

### 3.6 Feature: Mock Exam Room 

**Làm bài thi thử (Take Mock Exam):** Student vào Exam Room và chọn một Mock Exam (do Staff xuất bản). Hệ thống hiển thị giao diện thi tương tác (trắc nghiệm hoặc tự luận) kèm đồng hồ đếm ngược. Khi nộp bài, hệ thống tự động chấm điểm các câu hỏi khách quan (trắc nghiệm/đúng sai) và hiển thị kết quả (điểm số, độ chính xác). Lần làm bài được lưu vào lịch sử.

Chi tiết: bài thi thử phải ở trạng thái 'Published' mới hiển thị công khai; mọi lần làm bài đều được lưu lại kể cả khi học sinh thoát ra giữa chừng; màn hình kết quả hiển thị tổng điểm, tỷ lệ chính xác, đúng/sai theo từng câu.

### 3.7 Feature: Courses & Payment Webhook

**Mua khóa học qua Chuyển khoản (VietQR & SePay):** Student nhấn 'Purchase' trên trang chi tiết khóa học. Hệ thống hiển thị mã VietQR độc nhất chứa số tiền và nội dung chuyển khoản. Khi Student chuyển khoản thành công, cổng thanh toán (SePay) sẽ bắn Webhook xác nhận về cho máy chủ HIPZI. Hệ thống tự động mở khóa khóa học cho học sinh, đồng thời trích phần trăm doanh thu cộng vào ví nội bộ (Wallet) của Teacher sở hữu khóa học.

Chi tiết: giao dịch có tính nguyên tử; nếu webhook báo lỗi hoặc sai số tiền, khóa học không được mở; Teacher có thể kiểm tra số dư ví nội bộ và lịch sử biến động doanh thu; học sinh truy cập bài học từ trang 'My Courses'. Teacher sau đó có thể làm lệnh Rút tiền (Withdrawal) từ ví nội bộ về MoMo để Staff xử lý.

**Tạo khóa học E-Learning:** Teacher đã được duyệt nhấn 'Create Course' trong Teacher Dashboard. Teacher định nghĩa tiêu đề, mô tả, môn học, giá, và cấu trúc khóa học thành các module và bài học (video/text). Khóa học được gửi để Staff xét duyệt trước khi hiển thị trong Course Catalog.


### 3.8 Feature: Virtual Classroom

**Quản lý lớp học (Classroom Management):** Teacher đã được duyệt nhấn 'Create Classroom' trong Teacher Dashboard, nhập tên lớp, môn học, mô tả. Lớp học sau khi tạo sẽ được chuyển vào hàng chờ để Staff xét duyệt. Sau khi được Staff phê duyệt (Approved), hệ thống mới phát sinh mã mời riêng để Teacher chia sẻ cho học sinh. Học sinh tham gia bằng mã; Teacher có thể phê duyệt/từ chối yêu cầu tham gia.

Chi tiết: lớp học có các tab Materials, Assignments, Quizzes, Members, Rules; Teacher có thể đăng bài tập kèm hạn nộp và yêu cầu tải file; Teacher có thể tạo quiz trắc nghiệm (hoặc dùng AI Scan đề thi) cho lớp; Teacher có thể chấm bài nộp và ghi phản hồi.


**Tham gia lớp học (Enroll in Classroom):** Student nhập mã mời lớp học trên màn hình 'Join Classroom', hoặc yêu cầu truy cập từ danh sách công khai của lớp. Nếu mã hợp lệ, học sinh được thêm trực tiếp vào lớp (hoặc thành yêu cầu chờ duyệt, tùy cài đặt lớp). Teacher có thể phê duyệt/từ chối yêu cầu chờ từ tab Members.

Chi tiết: mã mời không hợp lệ hoặc hết hạn trả về lỗi inline, học sinh không được thêm vào lớp; học sinh đã tham gia lớp không thể gửi yêu cầu tham gia trùng lặp cho cùng lớp đó; khi được duyệt, học sinh nhận thông báo trong ứng dụng và có quyền truy cập các tab Materials, Assignments, Quizzes.

**Nộp và chấm bài tập lớp học:** Student mở bài tập/quiz được giao trong Classroom Space và nộp file hoặc câu trả lời quiz trước hạn; Teacher sau đó mở bài nộp để chấm. Với bài tập, học sinh tải file lên trước hạn, hệ thống đánh dấu thời gian nộp là 'On Time' hoặc 'Late'. Với quiz, học sinh nộp câu trả lời, hệ thống tự động chấm điểm. Teacher xem lại bài nộp, nhập điểm, và ghi phản hồi.

Chi tiết: bài nộp sau hạn được đánh dấu 'Late' nhưng vẫn được chấp nhận trừ khi Teacher tắt tính năng nộp trễ cho bài tập đó; chỉ Teacher sở hữu lớp mới có thể chấm bài của lớp đó; quiz được tự động chấm điểm ngay khi nộp, bài tập cần Teacher chấm thủ công và hiển thị 'Pending Grade' cho đến khi được chấm; học sinh nhận thông báo trong ứng dụng khi điểm và phản hồi được đăng.

### 3.9 Feature: Platform Governance

**Quản lý quản trị nền tảng:** Admin mở Admin Dashboard, vào User Management, Role Assignment, Subject Management, hoặc Audit Logs. Admin có thể gán hoặc thu hồi vai trò Staff cho bất kỳ người dùng nào, quản lý danh sách môn học/danh mục toàn nền tảng, ghi đè quyết định kiểm duyệt của Staff khi được nâng cấp xử lý, và xem nhật ký kiểm toán mọi thay đổi vai trò và hành động kiểm duyệt trên toàn nền tảng.

Chi tiết: chỉ Admin mới có thể gán hoặc thu hồi vai trò Staff, hành động này được ghi log kèm ID Admin, người dùng mục tiêu, và thời gian; việc Admin ghi đè quyết định kiểm duyệt của Staff cần ghi rõ lý do và hiển thị cho Staff đã xét duyệt ban đầu; nhật ký kiểm toán chỉ đọc, không thể chỉnh sửa hay xóa kể cả bởi tài khoản Admin.

---

### 4.1 External Interfaces
- **Google OAuth 2.0 API**: dùng cho đăng nhập mạng xã hội ở cả trang đăng ký và đăng nhập. Nếu email đã tồn tại, người dùng được liên kết đăng nhập; nếu chưa, tài khoản mới được tạo tự động.
- **LLM API (Groq / Gemini)**: dùng cho tính năng AI Exam Scanner trong Lớp học ảo (quét và tạo đề thi từ ảnh/văn bản) và AI Chat Assistant. Hệ thống gửi dữ liệu kèm prompt có cấu trúc, nhận về payload JSON. Cuộc gọi API thực hiện phía server, API key không bao giờ lộ ra client.
- **Email Service (SMTP / Transactional Email API)**: gửi mã OTP cho đăng ký và đặt lại mật khẩu. Cần cấu hình timeout kết nối và đọc để tránh treo request.
- **Cloud Storage Service**: lưu file tải lên (PDF, Word, ảnh hồ sơ giáo viên) trên hệ sinh thái Supabase Storage. Backend đảm bảo file thô không được phục vụ trực tiếp qua application server mà qua cơ chế lưu trữ cloud an toàn.
- **Payment Gateway (SePay / VietQR)**: xử lý yêu cầu mua khóa học qua hình thức chuyển khoản ngân hàng. Cổng SePay gửi webhook xác nhận thanh toán thành công; hệ thống xác minh dữ liệu webhook trước khi mở khóa khóa học và cộng tiền vào ví giáo viên.
### 4.2 Quality Attributes
**Usability**: Giao diện HIPZI phải viết bằng tiếng Việt cho toàn bộ nội dung hướng đến người dùng (nhãn điều hướng, nút bấm, form, thông báo lỗi, nhãn trạng thái). Tài liệu kỹ thuật có thể giữ tiếng Anh. Học sinh phải tìm và bắt đầu một bài thi thử trong vòng 3 lần nhấp từ khi đăng nhập; giáo viên phải tải được tài liệu trong vòng 5 phút khi dùng lần đầu; thông báo lỗi phải rõ ràng, cụ thể, có hướng xử lý.
**Reliability**: Mục tiêu uptime hệ thống là 99% trong giờ cao điểm. Việc quét AI (AI Scanner) có thể lỗi tạm thời do giới hạn API bên ngoài; hệ thống phải xử lý lỗi bằng thông báo (toast message) cho người dùng thử lại; lỗi AI không được ảnh hưởng đến các chức năng khác. Giao dịch mua khóa học bằng Webhook phải có tính nguyên tử. Dữ liệu làm bài thi không được mất do server restart; các lần làm bài đang dở phải khôi phục được.
**Performance**: Thời gian tải trang — các trang chính dành cho học sinh (Dashboard, Exam Room, Repository) tải trong vòng 3 giây. Thời gian phản hồi API — các API CRUD chuẩn hoàn thành trong vòng 1 giây ở tải bình thường. Phân tích AI Scanner — cuộc gọi LLM API có thể mất 5-15 giây, phải hiển thị chỉ báo đang tải (loading). Hệ thống hỗ trợ ít nhất 100 phiên làm bài đồng thời mà không giảm hiệu năng.
**Security**: Mọi thông tin bí mật (database url, API key, email credentials) phải lưu dưới dạng biến môi trường, không hard-code trong source code. Băm mật khẩu hiện tại áp dụng SHA-256 kết hợp Base64 (đã có lộ trình nâng cấp lên BCrypt/Argon2 ở Phase 2 để tăng tính bảo mật). Đặt lại mật khẩu phải dùng OTP với thời gian hết hạn ngắn (5 phút). Kiểm soát truy cập theo vai trò (Role-based Access Control) được thực thi nghiêm ngặt phía server, đặc biệt là chặn Staff không được tự kiểm duyệt hồ sơ của chính mình. 
**Maintainability**: Codebase phải theo cấu trúc MVC (Model-View-Controller) kết hợp Service Layer và DAO Layer rõ ràng. Các phần mềm, thư viện bên thứ ba phải được quản lý chặt chẽ. Phải có file .gitignore chuẩn (loại bỏ class, war, env). Sử dụng cơ chế logging an toàn cho code chạy production để phục vụ quá trình bảo trì và dò lỗi.

---

## 5. Other & Future Requirements

### 5.1 Business Rules & Common Constraints (MVP)
- **Cộng XP & Streak:** Hệ thống tự động cộng XP và cập nhật chuỗi ngày học tập (streak) khi học sinh hoàn thành các hoạt động hợp lệ.
- **Xác thực File:** Bắt buộc kiểm tra MIME type phía server (PDF, Word, Image) thay vì chỉ tin tưởng đuôi file từ client để chặn mã độc.

### 5.2 Future Enhancements (Tầm nhìn phát triển Phase 2)
Dự án HIPZI được thiết kế với kiến trúc mở, sẵn sàng để tích hợp các tính năng EdTech nâng cao sau khi hoàn thiện MVP:

1. **AI Explanation Assistant (Trợ giảng ảo):** Tích hợp chatbot AI trực tiếp vào màn hình học tập; học sinh có thể bôi đen một câu hỏi hoặc một đoạn văn khó hiểu và yêu cầu AI giải thích lại theo nhiều phong cách (ngắn gọn, chi tiết, ví dụ thực tế).
2. **Personalized Learning Roadmap (Lộ trình học cá nhân hóa):** Phân tích dữ liệu lịch sử làm bài (điểm yếu, môn học yêu thích, thời gian học) để LLM tự động phác thảo và đề xuất lộ trình học tập tối ưu cho từng học sinh.
3. **Smart Flashcards Generation:** Mở rộng tính năng AI Scanner hiện tại để tự động bóc tách từ vựng, công thức, khái niệm từ tài liệu PDF thành các bộ Flashcard học tập tương tác.

4. **Advanced Gamification:** Bổ sung hệ thống Bảng xếp hạng (Leaderboard) theo tuần/tháng để kích thích phong trào học tập, kèm theo Cửa hàng vật phẩm ảo (dùng điểm XP để đổi avatar, khung viền).
5. **Marketplace Payment Gateway:** Tích hợp cổng thanh toán quốc tế (Stripe/PayPal) để mở rộng tệp khách hàng và tự động đối soát, chia tỷ lệ hoa hồng (Revenue Share) cho giáo viên một cách minh bạch hơn.
6. **Anti-Cheating & Proctoring:** Tích hợp cơ chế khóa trình duyệt (Browser Lockdown) và giám sát qua webcam bằng AI cho các kỳ thi thử/chứng chỉ quan trọng nhằm đảm bảo tính công bằng.
7. **Mobile Application:** Triển khai ứng dụng Native (React Native / Flutter) để mang lại trải nghiệm học tập và nhận thông báo liền mạch trên thiết bị di động (iOS/Android).

