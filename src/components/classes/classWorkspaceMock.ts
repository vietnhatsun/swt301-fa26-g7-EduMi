import { BarChart3, BookOpen, CalendarClock, ClipboardCheck, FileText, GraduationCap, MessageSquare, UploadCloud } from "lucide-react";

export const classWorkspaceMock = {
  studentName: "Thạch Nguyễn",
  welcomeActions: [
    { label: "Xem tài liệu", tone: "green" },
    { label: "Làm bài tập", tone: "blue" },
    { label: "Vào phòng thi", tone: "yellow" },
  ],
  materials: [
    { title: "Bài 1. Giới thiệu tổng quan về Python", meta: "PDF • 2.4 MB • Cập nhật 12/09/2024", type: "PDF", color: "red" },
    { title: "Bài 2. Biến và kiểu dữ liệu trong Python", meta: "Slide • 3.1 MB • Cập nhật 14/09/2024", type: "PPT", color: "orange" },
    { title: "Bài 3. Cấu trúc điều kiện (If...Else)", meta: "Tài liệu • 1.8 MB • Cập nhật 16/09/2024", type: "DOC", color: "blue" },
    { title: "Bài 4. Vòng lặp trong Python (For, While)", meta: "Video • 12 phút • Cập nhật 18/09/2024", type: "Video", color: "purple" },
    { title: "Bài 5. Hàm và cách tổ chức chương trình", meta: "PDF • 2.7 MB • Cập nhật 20/09/2024", type: "PDF", color: "red" },
    { title: "Bài 6. Danh sách và thao tác cơ bản", meta: "Slide • 2.9 MB • Cập nhật 22/09/2024", type: "PPT", color: "orange" },
    { title: "Bài 7. Xử lý chuỗi ký tự", meta: "Tài liệu • 1.6 MB • Cập nhật 24/09/2024", type: "DOC", color: "blue" },
    { title: "Bài 8. Dự án mini: Quản lý điểm số", meta: "Video • 18 phút • Cập nhật 26/09/2024", type: "Video", color: "purple" },
  ],
  assignments: [
    { title: "Bài tập 1. Làm quen với Python", chapter: "Chương 1: Tổng quan", questions: "3 câu hỏi", deadline: "15/09/2024 23:59", status: "Đã nộp" },
    { title: "Bài tập 2. Biến và kiểu dữ liệu", chapter: "Chương 2: Dữ liệu", questions: "5 câu hỏi", deadline: "20/09/2024 23:59", status: "Sắp đến hạn" },
    { title: "Bài tập 3. Cấu trúc điều kiện", chapter: "Chương 3: Điều kiện", questions: "4 câu hỏi", deadline: "28/09/2024", status: "Chưa nộp" },
  ],
  progress: {
    overall: 68,
    learned: "26/42",
    chaptersDone: 5,
    streakDays: 12,
    chapters: [
      { label: "Chương 1. Tổng quan", desc: "Giới thiệu Python và môi trường lập trình", value: 100 },
      { label: "Chương 2. Dữ liệu", desc: "Biến, kiểu dữ liệu và các phép toán", value: 80 },
      { label: "Chương 3. Điều kiện", desc: "Cấu trúc điều kiện (if...else)", value: 60 },
      { label: "Chương 4. Vòng lặp", desc: "For, while và các bài toán lặp", value: 30 },
      { label: "Chương 5. Hàm", desc: "Định nghĩa hàm và ứng dụng", value: 0 },
    ],
  },
  activities: [
    { icon: FileText, title: "Giảng viên đã đăng tài liệu mới", desc: "Slide phân tích tác phẩm", time: "2 giờ trước", tone: "green" },
    { icon: UploadCloud, title: "Lê Minh đã nộp bài tập", desc: "Bài tập 2. Biến và kiểu dữ liệu", time: "4 giờ trước", tone: "blue" },
    { icon: GraduationCap, title: "Giảng viên đã tạo bài kiểm tra", desc: "Kiểm tra giữa chương 2", time: "1 ngày trước", tone: "purple" },
    { icon: MessageSquare, title: "Nguyễn An đã đặt câu hỏi", desc: "Làm sao để dùng vòng lặp lồng nhau?", time: "1 ngày trước", tone: "orange" },
  ],
  weeklyGoals: [
    { label: "Xem hết tài liệu chương 2", done: true },
    { label: "Tham gia 1 bài kiểm tra thử", done: true },
    { label: "Nộp 2 bài tập đúng hạn", done: false },
  ],
  navItems: [
    { id: "overview", label: "Tổng quan", icon: BookOpen },
    { id: "progress", label: "Tiến độ", icon: BarChart3 },
    { id: "materials", label: "Tài liệu", icon: FileText },
    { id: "assignments", label: "Bài tập", icon: ClipboardCheck },
    { id: "exams", label: "Phòng thi", icon: GraduationCap },
    { id: "schedule", label: "Lịch học", icon: CalendarClock },
  ],
};
