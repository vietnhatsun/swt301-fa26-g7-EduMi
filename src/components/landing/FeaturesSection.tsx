"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Layers,
  School,
  BookMarked,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Bot,
  Video,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      id: "exams",
      icon: BookOpen,
      tag: "500+ Bộ Đề",
      title: "Kho Đề Luyện Thi Chuẩn Ma Trận",
      desc: "Trọn bộ đề thi thử THPT Quốc Gia và Đánh giá năng lực mới nhất có đáp án giải thích chi tiết từng bước, tải PDF hoặc làm trực tiếp.",
      iconColor: "text-emerald-700 bg-emerald-100/80 border-emerald-200",
      accentBorder: "hover:border-emerald-300",
      preview: {
        badge: "Toán 12 · Chuẩn 2026",
        title: "Đề số 08: Hàm số & Khảo sát đồ thị",
        meta: "50 câu · 90 phút · 4,210 lượt thi",
      },
    },
    {
      id: "room",
      icon: Clock,
      tag: "Áp Lực Thi Thật",
      title: "Phòng Thi Thử Trực Tuyến Bấm Giờ",
      desc: "Mô phỏng 100% áp lực phòng thi với đồng hồ đếm ngược, tự động thu bài, chấm điểm tức thì và phân tích phổ điểm so với toàn quốc.",
      iconColor: "text-amber-700 bg-amber-100/80 border-amber-200",
      accentBorder: "hover:border-amber-300",
      preview: {
        badge: "Đang diễn ra",
        title: "Đồng hồ đếm ngược: 48:15",
        meta: "Điểm trung bình toàn quốc: 7.4/10",
      },
    },
    {
      id: "flashcards",
      icon: Layers,
      tag: "Spaced Repetition",
      title: "Thẻ Flashcard AI Ghi Nhớ Sâu",
      desc: "Ứng dụng phương pháp lặp lại ngắt quãng khoa học, nhắc nhở ôn tập công thức Toán - Lý và từ vựng Tiếng Anh đúng vào 'thời điểm vàng'.",
      iconColor: "text-blue-700 bg-blue-100/80 border-blue-200",
      accentBorder: "hover:border-blue-300",
      preview: {
        badge: "Học ngắt quãng",
        title: "IELTS & THPT: 1,500 Từ vựng cốt lõi",
        meta: "Ghi nhớ lâu gấp 3 lần cách học vẹt",
      },
    },
    {
      id: "classes",
      icon: School,
      tag: "Tương Tác 2 Chiều",
      title: "Lớp Học Trực Tuyến & Video Record",
      desc: "Học cùng các thầy cô giỏi và thủ khoa các trường top đầu, tương tác trực tiếp qua phòng học ảo và xem lại video bài giảng không giới hạn.",
      iconColor: "text-teal-700 bg-teal-100/80 border-teal-200",
      accentBorder: "hover:border-teal-300",
      preview: {
        badge: "Lớp học ảo #01",
        title: "Chuyên đề Logarit Vận dụng cao",
        meta: "Thầy Đức · Lưu video xem lại 24/7",
      },
    },
    {
      id: "wrong-notes",
      icon: BookMarked,
      tag: "Không Mất Điểm Oan",
      title: "Sổ Tay Bắt Lỗi Câu Hỏi Sai",
      desc: "Tự động phân loại các câu trả lời sai từ mọi bài thi thử, phân tích nguyên nhân nhầm lẫn và tạo đề ôn tập lại cho đến khi thành thạo.",
      iconColor: "text-rose-700 bg-rose-100/80 border-rose-200",
      accentBorder: "hover:border-rose-300",
      preview: {
        badge: "Tự động lưu",
        title: "14 câu hay sai phần Oxyz",
        meta: "Luyện lại để tránh lặp lại lỗi cũ",
      },
    },
    {
      id: "ai-roadmap",
      icon: Sparkles,
      tag: "Cá Nhân Hóa 100%",
      title: "Lộ Trình Tối Ưu Bằng Trí Tuệ Nhân Tạo",
      desc: "AI đánh giá chính xác từng lỗ hổng kiến thức sau mỗi bài kiểm tra, đề xuất lộ trình ôn tập cá nhân giúp tối đa điểm số trong thời gian ngắn nhất.",
      iconColor: "text-purple-700 bg-purple-100/80 border-purple-200",
      accentBorder: "hover:border-purple-300",
      preview: {
        badge: "Gợi ý thông minh",
        title: "Mục tiêu nâng từ 7.5 lên 9.0 điểm",
        meta: "Tập trung 3 chuyên đề còn yếu",
      },
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-[#f8faf8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HỆ SINH THÁI HỌC TẬP TOÀN DIỆN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Đầy đủ công cụ giúp bạn học nhàn mà <br className="hidden sm:inline" />
            <span className="text-emerald-700">điểm số vẫn bứt phá</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            EduMi tích hợp trọn gói mọi giải pháp bạn cần trong suốt năm học, loại bỏ cảm giác lan man và áp lực quá tải.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100/80 shadow-[0_4px_24px_rgba(6,78,59,0.04)] hover:shadow-[0_16px_36px_rgba(6,78,59,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${item.accentBorder}`}
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shadow-xs ${item.iconColor}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Micro Visual Card Preview */}
                  <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800 mb-1">
                      <span>{item.preview.badge}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="font-bold text-slate-800 truncate">
                      {item.preview.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.preview.meta}
                    </p>
                  </div>
                </div>

                {/* Footer Action Link */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Trải nghiệm ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
