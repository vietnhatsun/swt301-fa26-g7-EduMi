import { BookOpen, ClipboardList, FileText, GraduationCap, MessageSquare, UploadCloud } from "lucide-react";

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
      { label: "Chương 1. Tổng quan", value: 100 },
      { label: "Chương 2. Dữ liệu", value: 80 },
      { label: "Chương 3. Điều kiện", value: 60 },
      { label: "Chương 4. Vòng lặp", value: 30 },
      { label: "Chương 5. Hàm", value: 0 },
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
    { label: "Tổng quan", icon: BookOpen, active: true },
    { label: "Tài liệu", icon: FileText, active: false },
    { label: "Tiến độ", icon: ClipboardList, active: false },
    { label: "Bài tập", icon: ClipboardList, active: false },
    { label: "Phòng thi", icon: GraduationCap, active: false },
    { label: "Thảo luận", icon: MessageSquare, active: false },
  ],
};