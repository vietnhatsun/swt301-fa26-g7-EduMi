"use client";

import React from "react";
import Image from "next/image";
import {
  Brain,
  Zap,
  Repeat,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function LearningMethodSection() {
  const steps = [
    {
      num: "01",
      title: "Tiếp Thu Tinh Gọn (Micro-learning)",
      desc: "Nắm vững lý thuyết trọng tâm qua các video ngắn 15-20 phút và sơ đồ tư duy Mindmap, loại bỏ kiến thức thừa để học đúng trọng tâm thi.",
      icon: Brain,
      tag: "Hiểu sâu bản chất",
      color: "from-emerald-500/10 to-emerald-600/10 border-emerald-200 text-emerald-700",
    },
    {
      num: "02",
      title: "Phản Xạ Chủ Động (Active Recall)",
      desc: "Luyện đề trắc nghiệm tính giờ ngay sau mỗi bài học. Não bộ liên tục phải truy xuất dữ liệu giúp tạo liên kết nơ-ron bền vững gấp 3 lần đọc thụ động.",
      icon: Zap,
      tag: "Thực chiến phòng thi",
      color: "from-amber-500/10 to-amber-600/10 border-amber-200 text-amber-700",
    },
    {
      num: "03",
      title: "Lặp Lại Ngắt Quãng (Spaced Repetition)",
      desc: "Hệ thống Flashcard AI tự tính toán 'đường cong quên lãng' của Ebbinghaus, chủ động nhắc bạn ôn lại câu khó đúng vào thời điểm vàng trước khi bị quên.",
      icon: Repeat,
      tag: "Ghi nhớ vĩnh viễn",
      color: "from-blue-500/10 to-blue-600/10 border-blue-200 text-blue-700",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PHƯƠNG PHÁP HỌC KHOA HỌC</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Học thông minh, không cần học khổ: <br className="hidden sm:inline" />
            <span className="text-emerald-700">Quy trình 3 bước bứt phá</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Được kiểm chứng từ phương pháp ôn thi của các thủ khoa đại học và các chuyên gia giáo dục hàng đầu.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="bg-[#f8faf8] rounded-3xl p-7 border border-emerald-100/80 shadow-[0_4px_24px_rgba(6,78,59,0.04)] hover:shadow-[0_16px_36px_rgba(6,78,59,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-emerald-800/20 group-hover:text-emerald-700/40 transition-colors">
                      {st.num}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
                      {st.tag}
                    </span>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 bg-gradient-to-br shadow-xs ${st.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {st.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-medium">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã tích hợp sẵn trên EduMi</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
