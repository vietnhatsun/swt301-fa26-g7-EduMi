"use client";

import React, { useState } from "react";
import { Star, X, Send, CheckCircle2, MessageSquareHeart, Sparkles } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  avatarLetter: string;
  avatarBg: string;
  timeAgo: string;
  rating: number;
  snippet: string;
  fullReview: string;
  subject?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Trang Đoan",
    avatarLetter: "T",
    avatarBg: "bg-slate-700",
    timeAgo: "2 tuần trước",
    rating: 5,
    snippet:
      "Mình thường xuyên bị mất phương hướng khi tự ôn thi vì không biết mình yếu ở đâu. Từ khi làm bài thi thử ma trận trên EduMi và được AI phân tích chi tiết lỗi sai tư duy, điểm môn Toán của mình đã tăng từ 6.2 lên 8.8...",
    fullReview:
      "Mình thường xuyên bị mất phương hướng khi tự ôn thi vì không biết mình yếu ở đâu. Từ khi làm bài thi thử ma trận trên EduMi và được AI phân tích chi tiết lỗi sai tư duy, điểm môn Toán của mình đã tăng từ 6.2 lên 8.8. Giáo viên và trợ lý ảo Capy rèn cho mình thói quen lập dàn ý và ôn tập mỗi ngày rất bài bản!",
    subject: "Môn Toán 12 • Tăng 2.6 điểm",
  },
  {
    id: "2",
    name: "Nhi Võ",
    avatarLetter: "N",
    avatarBg: "bg-[#ea580c]",
    timeAgo: "2 tuần trước",
    rating: 5,
    snippet:
      "Phương pháp học bằng sơ đồ tư duy và trợ lý gia sư Capy AI của EduMi thực sự rất hiệu quả luôn á. Thầy cô và Capy hướng dẫn giải từng bước chi tiết, phân tích rõ cách nhận diện câu hỏi bẫy theo nhiều khía cạnh...",
    fullReview:
      "Phương pháp học bằng sơ đồ tư duy và trợ lý gia sư Capy AI của EduMi thực sự rất hiệu quả luôn á. Thầy cô và Capy hướng dẫn giải từng bước chi tiết, phân tích rõ cách nhận diện câu hỏi bẫy theo nhiều khía cạnh. Nhờ đó đợt thi thử Đánh giá năng lực vừa rồi mình đã đạt 870+ điểm!",
    subject: "Ôn thi ĐGNL HSA",
  },
  {
    id: "3",
    name: "Huy Trần",
    avatarLetter: "H",
    avatarBg: "bg-[#0284c7]",
    timeAgo: "2 tuần trước",
    rating: 5,
    snippet:
      "Mình từng mất nhiều điểm ở các câu hỏi bẫy trắc nghiệm Lí & Hóa vì đọc ẩu và thiếu thời gian. Nhờ kho 1,000+ đề thi chuẩn ma trận có bấm giờ của EduMi, mình đã rèn được phản xạ phòng thi cực kỳ bình tĩnh...",
    fullReview:
      "Mình từng mất nhiều điểm ở các câu hỏi bẫy trắc nghiệm Lí & Hóa vì đọc ẩu và thiếu thời gian. Nhờ kho 1,000+ đề thi chuẩn ma trận có bấm giờ của EduMi, mình đã rèn được phản xạ phòng thi cực kỳ bình tĩnh và không còn bị lừa ở các câu lý thuyết bẫy nữa. Rất đáng để các bạn lớp 12 học!",
    subject: "Khối A00 (Toán - Lí - Hóa)",
  },
  {
    id: "4",
    name: "Thùy Thanh",
    avatarLetter: "T",
    avatarBg: "bg-[#059669]",
    timeAgo: "2 tuần trước",
    rating: 5,
    snippet:
      "Mình rất thích tính năng AI Exam Scanner quét ảnh đề thi trong 1.5 giây và sổ tay ôn tập tự động không giới hạn của EduMi luôn nè. Capy nhắc học mỗi ngày rất đáng yêu, không bị cảm giác áp lực độc hại...",
    fullReview:
      "Mình rất thích tính năng AI Exam Scanner quét ảnh đề thi trong 1.5 giây và sổ tay ôn tập tự động không giới hạn của EduMi luôn nè. Mỗi câu hỏi làm sai đều có giải thích cặn kẽ tại sao sai và đề xuất các bài tập tương tự để làm lại. Capy nhắc học mỗi ngày rất đáng yêu, không bị cảm giác áp lực độc hại như trước!",
    subject: "Luyện thi THPTQG 2026",
  },
  {
    id: "5",
    name: "Minh Khang",
    avatarLetter: "M",
    avatarBg: "bg-[#7c3aed]",
    timeAgo: "3 tuần trước",
    rating: 5,
    snippet:
      "Phòng thi thử mô phỏng đúng 100% format cấu trúc đề thi THPT Quốc gia 2026 của Bộ GD&ĐT. Làm bài xong có phổ điểm và so sánh phân vị với toàn khóa, giúp mình tự tin hơn hẳn khi bước vào phòng thi...",
    fullReview:
      "Phòng thi thử mô phỏng đúng 100% format cấu trúc đề thi THPT Quốc gia 2026 của Bộ GD&ĐT. Làm bài xong có phổ điểm và so sánh phân vị với toàn khóa, chỉ ra rõ chủ đề nào còn yếu để củng cố ngay. Lời giải chi tiết đến từng bước, xứng đáng 5 sao!",
    subject: "Học sinh THPT Chuyên",
  },
  {
    id: "6",
    name: "Bảo Trâm",
    avatarLetter: "B",
    avatarBg: "bg-[#e11d48]",
    timeAgo: "1 tháng trước",
    rating: 5,
    snippet:
      "Học cùng chú Capy siêu cưng, có Streak chuỗi ngày học tạo động lực mỗi ngày mà không bị cảm giác áp lực nặng nề. Ba mẹ mình cũng theo dõi được tiến độ qua báo cáo Parent Link nên rất yên tâm...",
    fullReview:
      "Học cùng chú Capy siêu cưng, có Streak chuỗi ngày học tạo động lực mỗi ngày mà không bị cảm giác áp lực nặng nề. Ba mẹ mình cũng theo dõi được tiến độ qua báo cáo Parent Link nên rất yên tâm. Nền tảng học tập cá nhân hóa tốt nhất mình từng trải nghiệm!",
    subject: "Lớp 11 lên 12",
  },
];

// Duplicate list 4 times for seamless infinite loop on any screen width
const MARQUEE_TESTIMONIALS = [
  ...TESTIMONIALS,
  ...TESTIMONIALS,
  ...TESTIMONIALS,
  ...TESTIMONIALS,
];

export default function AboutStudentReviews() {
  // Modal States
  const [selectedReview, setSelectedReview] = useState<Testimonial | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewContent.trim()) return;
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setIsWriteModalOpen(false);
      setReviewerName("");
      setReviewContent("");
    }, 1800);
  };

  return (
    <section className="relative w-full py-12 sm:py-16 text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Headline Title (Direct match to reference: "Học sinh nói gì về EduMi") ── */}
        <div className="text-center mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-1">
            <MessageSquareHeart className="w-4 h-4 text-[#ea580c]" />
            <span>PHẦN 04 • TIẾNG NÓI TỪ HỌC SINH</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight flex flex-col items-center justify-center gap-2">
            <span>Học sinh</span>
            <span className="inline-block px-7 sm:px-10 py-2 sm:py-2.5 rounded-full bg-[#ea580c] text-white text-3xl sm:text-4xl lg:text-5xl font-black border-[3px] sm:border-[3.5px] border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1 select-none">
              nói gì về EduMi
            </span>
          </h2>
        </div>

        {/* ── Google Reviews Summary Bar (Direct match to reference design) ── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-5 sm:px-8 mb-6 sm:mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Google Logo & Rating */}
          <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto justify-center md:justify-start">
            <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
              {/* Google Multi-Color SVG Logo */}
              <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div className="space-y-0.5 text-center md:text-left">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                Đánh giá trên Google
              </h3>
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                <span className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
                  4,9
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400 stroke-amber-500"
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  (128 đánh giá)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-center md:justify-end">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="px-5 sm:px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Viết đánh giá
            </button>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-6 py-2.5 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] font-bold text-xs sm:text-sm border border-blue-200 hover:scale-105 active:scale-95 transition-all cursor-pointer text-center"
            >
              Xem trên Google Maps
            </a>
          </div>

        </div>

        {/* Small subtle tip */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-950/80 mb-3 select-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Đánh giá tự động cuộn liên tục • Rê chuột vào thẻ để dừng lại đọc chi tiết</span>
        </div>

      </div>

      {/* ── Infinite Seamless Marquee (Right-to-Left Continuous Ticker) ── */}
      <div
        className="w-full overflow-hidden py-3 relative select-none"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div
          className="animate-reviews-marquee reviews-marquee-track flex gap-4 sm:gap-6 px-4"
          style={{
            display: "flex",
            width: "max-content",
            willChange: "transform",
            animation: "studentReviewsMarquee 36s linear infinite",
          }}
        >
          {MARQUEE_TESTIMONIALS.map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 p-5 sm:p-6 w-[290px] sm:w-[330px] md:w-[350px] flex-shrink-0 flex flex-col justify-between cursor-default group"
            >
              <div>
                {/* Card Header: Avatar + Name + Google Logo */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${t.avatarBg} text-white font-black text-sm flex items-center justify-center border border-slate-900/10 shadow-sm flex-shrink-0`}
                    >
                      {t.avatarLetter}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm sm:text-base leading-snug">
                        {t.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                        {t.timeAgo}
                      </p>
                    </div>
                  </div>

                  {/* Google G Icon */}
                  <div className="flex-shrink-0 pt-0.5">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                </div>

                {/* 5 Yellow Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-amber-400 fill-amber-400 stroke-amber-500"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-4">
                  {t.snippet}
                </p>
              </div>

              {/* "Đọc thêm" Link */}
              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedReview(t)}
                  className="text-xs font-bold text-slate-900 hover:text-emerald-700 underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Đọc thêm
                </button>
                {t.subject && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {t.subject}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal: Full Review Reader ── */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border-3 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              aria-label="Đóng"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            >
              <X className="w-4 h-4 text-slate-700 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div
                className={`w-12 h-12 rounded-full ${selectedReview.avatarBg} text-white font-black text-base flex items-center justify-center border border-slate-900/15 shadow-sm`}
              >
                {selectedReview.avatarLetter}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950 leading-tight">
                  {selectedReview.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    {selectedReview.timeAgo}
                  </span>
                  {selectedReview.subject && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedReview.subject}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              {[...Array(selectedReview.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-amber-400 stroke-amber-500"
                />
              ))}
            </div>

            <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
              &ldquo;{selectedReview.fullReview}&rdquo;
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow hover:bg-slate-800 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Write Review (Viết đánh giá) ── */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border-3 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              aria-label="Đóng"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            >
              <X className="w-4 h-4 text-slate-700 stroke-[2.5]" />
            </button>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Cảm ơn bạn đã đánh giá!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold">
                  Đánh giá của bạn sẽ giúp cộng đồng học sinh EduMi ngày càng hoàn thiện hơn.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <MessageSquareHeart className="w-6 h-6 text-[#ea580c]" />
                  <h3 className="text-xl font-black">Chia sẻ cảm nhận về EduMi</h3>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    Mức độ hài lòng của bạn
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating
                              ? "text-amber-400 fill-amber-400 stroke-amber-500"
                              : "text-slate-300 stroke-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-slate-700 ml-2">
                      {newRating === 5 ? "Tuyệt vời (5/5)" : `${newRating}/5 sao`}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Tên của bạn
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="VD: Nguyễn Nhật Nam (Lớp 12)"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Nội dung đánh giá
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm học tập, sự hỗ trợ từ Capy AI hoặc kết quả thi thử của bạn..."
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-black text-xs sm:text-sm shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi đánh giá</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
