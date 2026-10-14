"use client";

import React from "react";
import { Lightbulb, Compass, Users2, CheckCircle2, XCircle, HeartHandshake, Sparkles } from "lucide-react";

export default function AboutBrandStory() {
  return (
    <section id="our-story" className="relative w-full py-8 text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Main Unified Our Story Framed Container ── */}
        <div className="bg-[#fffdf7] rounded-[32px] sm:rounded-[40px] border-[3px] border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10 lg:p-14 overflow-hidden">
          
          {/* Header Inside the Frame */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3 pb-6 border-b-2 border-slate-900/15">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>PHẦN 02 • KHỞI NGUỒN SỨ MỆNH</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
              Ý nghĩa tên gọi &amp; Câu chuyện thương hiệu
            </h2>
            
            <p className="text-slate-700 text-sm sm:text-base md:text-lg font-semibold">
              Tại sao EduMi ra đời và chúng tôi đang thay đổi trải nghiệm học tập của thế hệ mới như thế nào?
            </p>
          </div>

          {/* ── 2-Column Zig-Zag Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Giải nghĩa tên gọi & Sứ mệnh */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* EduMi Brand Name Breakdown Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Ý NGHĨA CÁI TÊN &ldquo;EDUMI&rdquo;</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-emerald-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono">Edu</div>
                    <div className="text-xs sm:text-sm font-black text-emerald-950">Education (Giáo dục)</div>
                    <p className="text-xs text-slate-700 font-medium">
                      Nền tảng tri thức chuẩn hóa, khoa học và không ngừng đổi mới.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-amber-900 font-mono">Mi</div>
                    <div className="text-xs sm:text-sm font-black text-amber-950">Mind &amp; Me (Trí tuệ &amp; Cá nhân)</div>
                    <p className="text-xs text-slate-700 font-medium">
                      Phát triển tư duy độc lập, học tập cá nhân hóa cho chính bạn.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  <strong>EduMi</strong> chính là tuyên ngôn: <em>&ldquo;Giáo dục phải lấy người học làm trung tâm, tôn trọng nhịp độ tiếp thu của từng cá nhân và nuôi dưỡng niềm say mê tri thức đích thực.&rdquo;</em>
                </div>
              </div>

              {/* Lý do ra đời: Giải quyết 3 nỗi đau lớn */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3.5">
                <h3 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-emerald-700" />
                  <span>Giải quyết nỗi đau học tập truyền thống</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-300">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-950">Học vẹt &amp; Thiếu định hướng:</strong> Học sinh ngập trong biển đề trôi nổi nhưng không biết mình yếu ở đâu, dẫn đến mất thời gian và kiệt sức.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-950">Giải pháp từ EduMi:</strong> AI Exam Scanner tự động định vị lỗ hổng kiến thức, lập tức đề xuất bài tập trọng tâm lấp đầy khoảng trống.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                    <HeartHandshake className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-950">Gắn kết 3 chiều minh bạch:</strong> Học sinh được thấu hiểu, Giáo viên có công cụ AI tạo đề 1-click, Phụ huynh nắm bắt tiến độ thực tế không cần thúc ép.
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Infographic Comparison Box */}
            <div className="lg:col-span-6 relative">
              <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className="font-black text-slate-950 text-base sm:text-lg">
                      Sự chuyển dịch phương pháp học
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
                    New Gen 2026
                  </span>
                </div>

                {/* Comparison items */}
                <div className="space-y-3.5">
                  
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                        TRƯỚC ĐÂY
                      </span>
                      <p className="font-semibold text-slate-800">1 giáo trình chung cho cả lớp 40 học sinh</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                        TẠI EDUMI
                      </span>
                      <p className="font-bold text-emerald-950">Lộ trình động cá nhân hóa theo từng mục tiêu</p>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                        TRƯỚC ĐÂY
                      </span>
                      <p className="font-semibold text-slate-800">Hỏi bài phụ thuộc vào giờ lên lớp của thầy cô</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                        TẠI EDUMI
                      </span>
                      <p className="font-bold text-emerald-950">Gia sư Capy AI giải đáp chi tiết từng bước 24/7</p>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                        TRƯỚC ĐÂY
                      </span>
                      <p className="font-semibold text-slate-800">Học tập căng thẳng, áp lực điểm số nặng nề</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                        TẠI EDUMI
                      </span>
                      <p className="font-bold text-emerald-950">Học kiểu Chill: Gamification, Streak &amp; Tích XP</p>
                    </div>
                  </div>

                </div>

                {/* Bottom Quote Banner */}
                <div className="p-4 rounded-xl bg-amber-50 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-900 shadow-sm flex items-center justify-center text-xl shrink-0">
                    🐾
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-950">
                      &ldquo;Học tập là niềm vui khám phá, không phải gánh nặng.&rdquo;
                    </div>
                    <div className="text-[11px] text-slate-600 font-semibold">
                      Triết lý định hình từng tính năng của EduMi.
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
