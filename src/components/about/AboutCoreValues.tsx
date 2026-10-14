"use client";

import React from "react";
import { BrainCircuit, ShieldCheck, Gamepad2, Network, Sparkles, ArrowRight } from "lucide-react";

interface CoreValue {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlights: string[];
  gradientBadge: string;
}

const CORE_VALUES: CoreValue[] = [
  {
    id: "ai-learning",
    badge: "Công nghệ tiên phong",
    title: "AI-Powered Learning",
    description:
      "Tự động quét đề thi (AI Exam Scanner), phân tích lỗi sai tư duy và đề xuất lộ trình luyện tập thông minh thích ứng theo thời gian thực.",
    icon: <BrainCircuit className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-800" />,
    gradientBadge: "bg-emerald-100 text-emerald-950 border-emerald-400",
    highlights: [
      "AI Scanner quét ảnh đề thi trong 1.5 giây",
      "Chỉ rõ nguyên nhân sai: nhầm công thức hay tư duy bẫy",
      "Gia sư Capy AI hướng dẫn giải từng bước 24/7",
    ],
  },
  {
    id: "verified-quality",
    badge: "Chất lượng kiểm chứng",
    title: "Verified Quality",
    description:
      "Kho 10,000+ tài liệu, đề thi và phòng học ảo được hội đồng chuyên môn kiểm duyệt khắt khe, bám sát 100% ma trận mới của Bộ GD&ĐT.",
    icon: <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-800" />,
    gradientBadge: "bg-blue-100 text-blue-950 border-blue-400",
    highlights: [
      "100% đề thi có lời giải chi tiết và phân loại độ khó",
      "Giáo viên bảo chứng: Thủ khoa & Giảng viên trường chuyên",
      "Cập nhật liên tục cấu trúc đề thi THPTQG & ĐGNL 2026",
    ],
  },
  {
    id: "gamification-chill",
    badge: "Trải nghiệm học tập",
    title: "Gamification & Chill",
    description:
      "Biến hành trình ôn thi căng thẳng thành trải nghiệm thú vị với chuỗi học tập (Streak), tích lũy XP, đổi quà và sự đồng hành của chú Capy siêu dễ thương.",
    icon: <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8 text-amber-800" />,
    gradientBadge: "bg-amber-100 text-amber-950 border-amber-400",
    highlights: [
      "Streak hàng ngày rèn luyện thói quen học tập bền bỉ",
      "Bảng xếp hạng Vinh danh và kho huy hiệu thành tích độc quyền",
      "Không khí học tập thoải mái, nói KHÔNG với áp lực độc hại",
    ],
  },
  {
    id: "all-in-one",
    badge: "Hệ sinh thái toàn diện",
    title: "All-in-One Ecosystem",
    description:
      "Cầu nối minh bạch 3 chiều giữa Học sinh, Giáo viên và Phụ huynh – Tạo nên một mạng lưới giáo dục hỗ trợ nhau tối đa mọi lúc mọi nơi.",
    icon: <Network className="w-7 h-7 sm:w-8 sm:h-8 text-purple-800" />,
    gradientBadge: "bg-purple-100 text-purple-950 border-purple-400",
    highlights: [
      "Parent Link: Báo cáo học tập tự động cho cha mẹ",
      "Teacher Workspace: Giáo viên tạo đề AI 1-click & tăng thu nhập",
      "Học sinh có đầy đủ: Phòng thi, Sổ AI, Flashcards & Lớp học",
    ],
  },
];

export default function AboutCoreValues() {
  return (
    <section className="relative w-full py-8 text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Main Unified Core Values Framed Container ── */}
        <div className="bg-[#fffdf7] rounded-[32px] sm:rounded-[40px] border-[3px] border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10 lg:p-14 overflow-hidden">
          
          {/* Header inside the Frame */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3 pb-6 border-b-2 border-slate-900/15">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>PHẦN 03 • 4 TRỤ CỘT ĐỘT PHÁ</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
              Giá trị cốt lõi &amp; Tính năng đột phá
            </h2>
            
            <p className="text-slate-700 text-sm sm:text-base md:text-lg font-semibold">
              4 trụ cột công nghệ và phương pháp sư phạm giúp EduMi tạo nên sự khác biệt vượt trội
            </p>
          </div>

          {/* ── 4 Grid Cards Layout ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {CORE_VALUES.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group"
              >
                <div className="space-y-4">
                  
                  {/* Card Top: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.gradientBadge}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Highlights List */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {item.highlights.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom subtle indicator */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Trải nghiệm tích hợp sẵn trên EduMi</span>
                  <span className="text-emerald-700 font-black group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Khám phá <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
