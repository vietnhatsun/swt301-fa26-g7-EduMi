"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, Award, Sparkles, CheckCircle } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Nguyễn Minh Châu",
      school: "THPT Chuyên Hà Nội - Amsterdam",
      score: "28.8 Điểm Khối A00",
      detail: "Toán 9.8 · Vật lý 9.5 · Hóa học 9.5",
      avatarLetter: "C",
      avatarBg: "bg-emerald-600 text-white",
      quote:
        "Kho đề thi trên EduMi rất sát với ma trận mới của Bộ GD&ĐT. Đặc biệt là tính năng Sổ tay câu hỏi sai và trợ lý Capy AI giúp em khắc phục triệt để các câu bẫy. Em tiết kiệm được hàng trăm giờ tự học mà điểm số tăng rõ rệt!",
    },
    {
      name: "Trần Hoàng Nam",
      school: "THPT Chuyên Lê Hồng Phong (TP.HCM)",
      score: "8.5 IELTS & 9.4 Toán",
      detail: "Thủ khoa xét tuyển sớm FTU",
      avatarLetter: "N",
      avatarBg: "bg-amber-600 text-white",
      quote:
        "Thẻ Flashcard Spaced Repetition của EduMi siêu tiện, mỗi ngày Capy nhắc nhở ôn 20 từ vựng đúng thời điểm là nhớ như in. Lớp học ảo cũng rất mượt mà, thầy cô chữa đề cặn kẽ và luôn lưu lại video để xem lại.",
    },
    {
      name: "Lê Thu Trang",
      school: "THPT Chu Văn An (Hà Nội)",
      score: "9.2 Ngữ Văn & 9.6 Tiếng Anh",
      detail: "Khối D01 · Top 1% Toàn quốc",
      avatarLetter: "T",
      avatarBg: "bg-blue-600 text-white",
      quote:
        "Trước đây mình rất sợ giải đề vì hay bị điểm thấp rồi nản lòng. Nhưng không gian học cùng Capy bên cửa sổ ngập tràn ánh nắng tạo cảm giác bình yên và tập trung lạ kỳ. Việc học thi không còn là áp lực nữa!",
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#f8faf8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Award className="w-3.5 h-3.5" />
            <span>KẾT QUẢ THỰC TẾ TỪ HỌC SINH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Thủ khoa & Học sinh nói gì <br className="hidden sm:inline" />
            <span className="text-emerald-700">về trải nghiệm tại EduMi?</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Hàng ngàn học sinh lớp 10, 11, 12 đã chạm tay đến cánh cửa trường đại học mơ ước nhờ phương pháp ôn luyện khoa học.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-emerald-100/80 shadow-[0_4px_24px_rgba(6,78,59,0.04)] hover:shadow-[0_16px_36px_rgba(6,78,59,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-emerald-200" />
                </div>

                {/* Score Tag */}
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 mb-3">
                  <Sparkles className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                  <span>{item.score}</span>
                </div>

                {/* Quote Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Student info */}
              <div className="pt-5 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs flex-shrink-0 ${item.avatarBg}`}
                >
                  {item.avatarLetter}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.school}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
