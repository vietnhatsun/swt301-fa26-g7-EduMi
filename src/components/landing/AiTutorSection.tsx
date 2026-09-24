"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Send,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Zap,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export default function AiTutorSection() {
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  const samplePrompts = [
    {
      title: "Giải toán hình không gian",
      studentMsg: "Capy ơi, câu 35 đề thi thử Toán về góc giữa 2 mặt phẳng trong hình chóp, em nên vẽ hình phụ thế nào để dễ nhìn nhất ạ?",
      capyReply:
        "Chào bạn nhé! Với dạng bài góc giữa hai mặt phẳng, mình có mẹo tư duy 3 bước siêu nhanh này:\n\n1. Xác định giao tuyến d của hai mặt phẳng.\n2. Từ đỉnh, hạ đường cao vuông góc với mặt phẳng đáy.\n3. Từ chân đường cao, kẻ đoạn vuông góc tới giao tuyến d — góc cần tìm chính là góc giữa hai đường vuông góc đó!\n\n💡 Gợi ý thêm: Bạn có thể gắn trục tọa độ Oxyz để tính tích có hướng nếu hình có các cạnh đôi một vuông góc. Cố lên nhé! 🌱",
    },
    {
      title: "Mở bài Nghị luận văn học",
      studentMsg: "Capy gợi ý cho mình 1 mở bài gián tiếp sâu sắc khi phân tích tác phẩm 'Vợ chồng A Phủ' được không?",
      capyReply:
        "Tất nhiên rồi! Bạn thử tham khảo mở bài đi từ quy luật văn học này nhé:\n\n'Văn học chân chính bao giờ cũng bắt đầu từ nỗi đau của con người và kết thúc bằng khát vọng sống bất diệt. Đến với thiên truyện 'Vợ chồng A Phủ' của nhà văn Tô Hoài, người đọc không chỉ xót xa trước kiếp đời cay đắng của cô Mị dưới ách thống trị tàn bạo của nhà thống lý Pá Tra, mà còn xúc động trước sức sống tiềm tàng, mãnh liệt của một tâm hồn khao khát tự do...'\n\n✨ Hãy dùng làm điểm nhấn để bài viết đạt 8.5+ nhé!",
    },
    {
      title: "Phân biệt 12 thì Tiếng Anh",
      studentMsg: "Làm sao để không bị nhầm lẫn giữa Hiện tại hoàn thành (Present Perfect) và Quá khứ đơn (Past Simple)?",
      capyReply:
        "Rất đơn giản luôn bạn ơi, nhớ quy tắc 'Thời gian cụ thể' này nhé:\n\n• Quá khứ đơn (Past Simple): Dùng khi hành động ĐÃ CHẤM DỨT tại một thời điểm RÕ RÀNG trong quá khứ (yesterday, last year, in 2020).\n• Hiện tại hoàn thành (Present Perfect): Dùng khi hành động xảy ra nhưng KHÔNG RÕ thời gian, hoặc kết quả CÒN LIÊN QUAN đến hiện tại (already, yet, since, for 3 years).\n\n🎯 Mẹo làm bài thi: Cứ thấy mốc thời gian đã qua hẳn -> chọn Quá khứ đơn ngay!",
    },
  ];

  return (
    <section id="ai-tutor" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background soft blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ── Left Column: Interactive Capy AI Chat Mockup ── */}
          <div className="lg:col-span-7">
            <div className="bg-[#f8faf8] rounded-3xl p-4 sm:p-6 border border-emerald-200/80 shadow-[0_16px_40px_rgba(6,78,59,0.08)]">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200 overflow-hidden flex-shrink-0 relative">
                    <Image
                      src="/capybara-mascot.png"
                      alt="Capy Mascot Avatar"
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">
                        Capy AI Tutor
                      </h4>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      Trực tuyến 24/7 · Sẵn sàng trợ giúp bạn
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/60 hidden sm:inline-block">
                  Phản hồi sau 1.2s
                </span>
              </div>

              {/* Chat Messages Body */}
              <div className="py-4 space-y-4 min-h-[300px]">
                {/* Student message */}
                <div className="flex justify-end">
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-xs p-3.5 max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-xs">
                    {samplePrompts[selectedPrompt].studentMsg}
                  </div>
                </div>

                {/* Capy reply */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 overflow-hidden flex-shrink-0 mt-1">
                    <Image
                      src="/capybara-mascot.png"
                      alt="Capy Avatar"
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-white text-slate-800 rounded-2xl rounded-tl-xs p-4 max-w-[90%] text-xs sm:text-sm leading-relaxed border border-emerald-100/80 shadow-xs whitespace-pre-line font-medium">
                    {samplePrompts[selectedPrompt].capyReply}
                  </div>
                </div>
              </div>

              {/* Sample prompt chips */}
              <div className="pt-3 border-t border-emerald-100">
                <p className="text-[11px] font-bold text-slate-500 mb-2">
                  Thử đổi câu hỏi để xem Capy tư vấn:
                </p>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPrompt(idx)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        selectedPrompt === idx
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: AI Tutor Benefits & Highlights ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Bot className="w-3.5 h-3.5" />
              <span>GIA SƯ CÁ NHÂN HÓA 24/7</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Hỏi bài không ngại ngùng, <br />
              giải đáp <span className="text-emerald-700">tức thì không đợi chờ</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Bạn có câu hỏi khó khi tự học lúc nửa đêm? Capy luôn ngồi bên bàn học như trong bức tranh, kiên nhẫn phân tích và chỉ bạn phương pháp giải tối ưu nhất.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Dạy tư duy từng bước — Không chép vẹt
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Capy hướng dẫn cách suy luận để khi vào phòng thi bạn tự làm được dạng bài tương tự.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Hỗ trợ trọn gói 9 môn thi THPT
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Từ công thức Toán, Lý, Hóa đến phân tích ngữ liệu Văn và luyện kỹ năng đọc hiểu Tiếng Anh.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Động viên tinh thần học tập tích cực
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chú chuột túi Capy luôn dễ thương, nhắc nhở giữ gìn sức khỏe và duy trì chuỗi học đều đặn.
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <span>Trải nghiệm Gia sư Capy miễn phí</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
