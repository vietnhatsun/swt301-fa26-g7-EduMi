"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Kho đề thi trên EduMi có bám sát cấu trúc thi tốt nghiệp THPT 2026 mới không?",
      a: "Có, 100% đề thi trên EduMi được biên soạn và cập nhật liên tục theo chuẩn ma trận và định dạng đề mới nhất của Bộ GD&ĐT (gồm đầy đủ phần Trắc nghiệm 4 lựa chọn, Trắc nghiệm Đúng/Sai và Trắc nghiệm Điền đáp án ngắn).",
    },
    {
      q: "Tôi có thể học và làm bài thi thử trên điện thoại hoặc máy tính bảng không?",
      a: "Hoàn toàn được! EduMi hoạt động mượt mà trên mọi thiết bị: Máy tính, Điện thoại (iOS & Android) và Máy tính bảng. Mọi dữ liệu làm bài, điểm số và chuỗi ngày học đều được đồng bộ tức thì trên đám mây.",
    },
    {
      q: "Phương pháp Thẻ Flashcard Spaced Repetition (Lặp lại ngắt quãng) giúp ích gì?",
      a: "Dựa trên đường cong quên lãng khoa học của Ebbinghaus, AI sẽ tự động phân loại những thẻ bạn chưa thuộc và lên lịch nhắc nhở ôn lại đúng vào 'thời điểm vàng'. Bạn chỉ cần 10-15 phút mỗi ngày để ghi nhớ sâu 1,500 từ vựng tiếng Anh và hàng trăm công thức Toán - Lý.",
    },
    {
      q: "Gia sư Capy AI giải đáp được những môn học nào và có chính xác không?",
      a: "Capy AI được huấn luyện chuyên sâu trên dữ liệu sách giáo khoa và các đề thi THPT Quốc Gia, hỗ trợ 9 môn học chính: Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa, GDCD. Capy không chỉ đưa đáp án mà phân tích bản chất và phương pháp tư duy từng bước.",
    },
    {
      q: "Làm thế nào để thanh toán học phí và kích hoạt tài khoản?",
      a: "EduMi hỗ trợ cổng thanh toán tự động SePay / VietQR. Khi chọn gói học, hệ thống hiển thị mã QR có sẵn số tiền và nội dung. Bạn chỉ cần mở app ngân hàng quét mã, tài khoản sẽ được nâng cấp tự động chỉ sau 3-5 giây.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#f8faf8] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HỎI ĐÁP & HỖ TRỢ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Câu hỏi thường gặp <br />
            <span className="text-emerald-700">về nền tảng EduMi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Mọi thắc mắc của bạn đều có câu trả lời rõ ràng tại đây.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_2px_12px_rgba(6,78,59,0.03)] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base leading-snug">{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
