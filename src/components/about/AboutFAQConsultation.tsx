"use client";

import React, { useState } from "react";
import { Plus, Minus, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import InteractivePeekingCapy from "@/components/about/InteractivePeekingCapy";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 1,
    question: "Tôi chưa từng học trực tuyến cùng AI, có dễ làm quen không?",
    answer:
      "Hoàn toàn dễ dàng! EduMi được thiết kế trực quan và thân thiện. Chú Capy cùng Trợ lý ảo AI sẽ hướng dẫn bạn từng bước từ làm quen lộ trình, giải bài tập từng bước đến tra cứu đáp án một cách tự nhiên như trò chuyện hàng ngày.",
  },
  {
    id: 2,
    question: "EduMi có ưu đãi học phí hoặc học thử không?",
    answer:
      "Có! Khi đăng ký tài khoản mới, bạn được trải nghiệm miễn phí phòng thi thử chuẩn ma trận, sổ tay kiến thức AI và nhận ngay 100+ công thức giải nhanh. Ngoài ra còn có ưu đãi hấp dẫn khi đăng ký theo nhóm hoặc combo khóa học.",
  },
  {
    id: 3,
    question: "Lịch học và thời gian truy cập tại EduMi như thế nào?",
    answer:
      "Bạn hoàn toàn chủ động 100% thời gian! Tất cả video bài giảng, hệ thống câu hỏi, flashcard lặp lại ngắt quãng (Spaced Repetition) đều mở 24/7 trên cả máy tính, máy tính bảng và điện thoại.",
  },
  {
    id: 4,
    question: "Một tài khoản có thể học được những môn học nào?",
    answer:
      "Một tài khoản EduMi cho phép bạn học tất cả môn học trọng tâm: Toán học, Ngữ văn, Tiếng Anh / IELTS, Vật lý, Hóa học, Sinh học và ôn thi Đánh giá năng lực (HSA, V-SAT) theo chương trình giáo dục mới nhất.",
  },
  {
    id: 5,
    question: "Đội ngũ giáo viên và trợ lý AI hỗ trợ giải đáp thắc mắc ra sao?",
    answer:
      "Trợ lý AI giải đáp thắc mắc 24/7 ngay lập tức kèm gợi ý phương pháp giải chi tiết. Đội ngũ giáo viên chuyên môn EduMi sẽ trực tiếp đồng hành, chấm bài tự luận và livestream giải đề định kỳ.",
  },
];

export default function AboutFAQConsultation() {
  const { ref, isRevealed } = useScrollReveal(0.05);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState("");
  const [grade, setGrade] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ Họ tên và Số điện thoại.");
      return;
    }
    setErrorMsg("");
    setIsSubmitted(true);
  };

  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 50/50 Equal Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* ── Left Column: Frequently Asked Questions (Folder Accordion) ── */}
          <div
            className={`flex flex-col space-y-6 transition-all duration-700 ease-out transform ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Left Header Container (Equal Height Rhythm) */}
            <div className="flex flex-col justify-end min-h-[100px] space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight drop-shadow-[1px_1px_0px_rgba(255,255,255,0.8)]">
                Frequently Asked
              </h2>
              <div>
                <span className="inline-block px-5 py-1.5 rounded-2xl bg-[#ea580c] text-white text-2xl sm:text-3xl lg:text-4xl font-black border-[2.5px] border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] tracking-wide -rotate-1">
                  Questions
                </span>
              </div>
            </div>

            {/* Folder Tabs Accordion List */}
            <div className="space-y-4">
              {FAQ_LIST.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={faq.id} className="relative group select-none">
                    {/* Folder Tab Ear */}
                    <div className="flex">
                      <div className="bg-[#f59e0b] border-t-[2.5px] border-l-[2.5px] border-r-[2.5px] border-slate-900 rounded-t-xl px-4 py-1 text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wider">
                        Folder #{idx + 1}
                      </div>
                    </div>

                    {/* Folder Body Container */}
                    <div className="bg-[#f59e0b] border-[2.5px] border-slate-900 rounded-r-2xl rounded-b-2xl rounded-tl-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-200 group-hover:translate-x-0.5">
                      {/* Question Button Header */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(idx)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer transition-colors hover:bg-[#fbbf24] gap-4"
                        aria-expanded={isOpen}
                      >
                        <span className="font-extrabold text-slate-950 text-sm sm:text-base md:text-lg leading-snug">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
                          {isOpen ? (
                            <Minus className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Plus className="w-4 h-4 stroke-[3]" />
                          )}
                        </div>
                      </button>

                      {/* Expandable Answer Content */}
                      {isOpen && (
                        <div className="bg-[#fffdf7] p-5 sm:p-6 border-t-[2.5px] border-slate-900 text-slate-800 text-sm sm:text-base font-semibold leading-relaxed animate-fadeIn">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right Column: Consultation / Contact Registration Form Card ── */}
          <div
            className={`flex flex-col space-y-6 transition-all duration-700 delay-150 ease-out transform ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Right Header Container (Equal Height Rhythm) */}
            <div className="flex flex-col justify-end min-h-[100px] space-y-2">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight drop-shadow-[2px_2px_0px_rgba(255,255,255,0.9)]">
                Tư vấn trực tiếp!
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                Liên hệ ngay với đội ngũ EduMi nếu bạn có bất kỳ câu hỏi hay thắc mắc nào về khóa học.
              </p>
            </div>

            {/* Retro White Form Card */}
            <div className="bg-white rounded-[28px] border-[2.5px] border-slate-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-7 md:p-8">
              {isSubmitted ? (
                <div className="flex flex-col items-center text-center py-8 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                    Đăng ký thành công!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold max-w-xs">
                    Cảm ơn <strong>{fullName}</strong>. Chuyên viên tư vấn EduMi sẽ gọi điện qua số <strong>{phone}</strong> trong vòng 15 phút để hỗ trợ bạn.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName("");
                      setPhone("");
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Họ và tên */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
                      HỌ VÀ TÊN *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 bg-[#f8fafc] text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm transition-all shadow-2xs"
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
                      SỐ ĐIỆN THOẠI *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0901 234 567"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 bg-[#f8fafc] text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm transition-all shadow-2xs"
                    />
                  </div>

                  {/* Mục tiêu học tập */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
                      MỤC TIÊU HỌC TẬP *
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 bg-[#f8fafc] text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="">Chọn mục tiêu học tập</option>
                      <option value="thpt">Luyện thi THPT Quốc Gia 2026</option>
                      <option value="dgnl">Luyện thi ĐGNL (HSA / V-SAT)</option>
                      <option value="ielts">Tiếng Anh THPT & Luyện thi IELTS</option>
                      <option value="butpha">Ôn tập lấy gốc & Bứt phá điểm số</option>
                      <option value="combo">Combo toàn diện cùng AI Capy</option>
                    </select>
                  </div>

                  {/* Độ tuổi / Lớp hiện tại */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
                      ĐỘ TUỔI / LỚP HỌC HIỆN TẠI *
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 bg-[#f8fafc] text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="">Chọn độ tuổi / lớp học</option>
                      <option value="lop10">Học sinh Lớp 10</option>
                      <option value="lop11">Học sinh Lớp 11</option>
                      <option value="lop12">Học sinh Lớp 12</option>
                      <option value="phuhuynh">Phụ huynh học sinh</option>
                      <option value="khac">Khác</option>
                    </select>
                  </div>

                  {errorMsg && (
                    <p className="text-xs font-bold text-red-600 animate-pulse">
                      {errorMsg}
                    </p>
                  )}

                  {/* Orange Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-sm sm:text-base border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Nhận tư vấn miễn phí</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[11px] text-slate-500 font-semibold pt-1">
                    Thông tin của bạn sẽ không được chia sẻ cho bên thứ ba.
                  </p>

                  {/* Divider */}
                  <div className="flex items-center my-3">
                    <div className="flex-grow border-t border-slate-300" />
                    <span className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      HOẶC
                    </span>
                    <div className="flex-grow border-t border-slate-300" />
                  </div>

                  {/* Facebook Messenger Button */}
                  <a
                    href="https://m.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 rounded-2xl bg-[#1877f2] hover:bg-[#0c63d4] text-white font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {/* Facebook Icon SVG */}
                    <svg
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Nhận tư vấn qua Facebook</span>
                  </a>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Centered Peeking Interactive Capybara at Very Bottom ── */}
        <div className="mt-14 -mb-5 flex flex-col items-center justify-center relative z-20">
          <InteractivePeekingCapy />
        </div>

        {/* ── Mini Cozy Copyright Notice at very bottom ── */}
        <div className="relative z-10 pt-6 pb-4 border-t-2 border-slate-900/15 bg-white/80 backdrop-blur-md rounded-2xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-800 select-none shadow-sm">
          <p>© 2026 EduMi Platform. Học thông minh cùng Capy.</p>
          <p className="flex items-center gap-1">
            Thiết kế & phát triển với <span className="text-red-500">❤️</span> dành cho học sinh Việt Nam
          </p>
        </div>
      </div>

      {/* ── Floating Messenger Bubble (Bottom Right) ── */}
      <a
        href="https://m.me"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat qua Facebook Messenger"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white hover:border-slate-900 group"
      >
        <MessageCircle className="w-7 h-7 transition-transform group-hover:rotate-6" />
      </a>
    </section>
  );
}
