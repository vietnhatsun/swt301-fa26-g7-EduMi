"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

interface FeatureRow {
  name: string;
  category: string;
  free: string | boolean;
  skill: string | boolean;
  vip: string | boolean;
}

const COMPARISON_FEATURES: FeatureRow[] = [
  {
    name: "Lượt luyện thi trắc nghiệm & đề thi",
    category: "Luyện đề",
    free: "50 lượt cơ bản",
    skill: "Theo khối thi đăng ký",
    vip: "Không giới hạn 8 môn",
  },
  {
    name: "Chấm chữa bài tự luận Văn & giải chi tiết AI",
    category: "AI & Chấm điểm",
    free: false,
    skill: "Theo môn đăng ký",
    vip: "Không giới hạn theo barem Bộ GD",
  },
  {
    name: "Gia sư Capy AI giải đề 24/7 & Mẹo Casio",
    category: "AI & Chấm điểm",
    free: "10 câu / ngày",
    skill: "Ưu tiên khối thi",
    vip: "Không giới hạn 24/7",
  },
  {
    name: "Sổ tay câu hỏi sai & Phân tích ma trận",
    category: "Cá nhân hoá",
    free: "Lưu tối đa 30 câu",
    skill: "Không giới hạn",
    vip: "Tự động tạo đề ôn lại",
  },
  {
    name: "Flashcard Spaced Repetition công thức & lý thuyết",
    category: "Ghi nhớ",
    free: "Bộ thẻ cơ bản",
    skill: "Bộ thẻ theo khối thi",
    vip: "Trọn bộ 3.000+ thẻ công thức",
  },
  {
    name: "Tải đề thi PDF bản in chuẩn A4 kèm đáp án",
    category: "Học liệu",
    free: false,
    skill: "Theo khối thi",
    vip: "Toàn bộ kho 500+ đề",
  },
  {
    name: "Quà tặng Bộ đề ĐGNL & Ebook 100 trường chuyên",
    category: "Quà tặng",
    free: false,
    skill: false,
    vip: "Tặng kèm trọn bộ bản quyền",
  },
  {
    name: "Đồng hành 1-1 & Thưởng ngày học Streak",
    category: "Hỗ trợ",
    free: false,
    skill: "Hỗ trợ 1-1",
    vip: "Tối ưu hóa lộ trình 9+",
  },
];

const FAQ_LIST = [
  {
    question: "Sau khi chuyển khoản bao lâu tài khoản của mình được kích hoạt?",
    answer:
      "Hệ thống EduMi tích hợp cổng thanh toán tự động VietQR. Ngay sau khi bạn hoàn tất giao dịch quét mã, tài khoản sẽ được nâng cấp VIP tự động trong vòng 5 - 30 giây mà không cần chờ duyệt thủ công.",
  },
  {
    question: "Mình có thể học trên nhiều thiết bị (Điện thoại, Laptop, iPad) cùng lúc không?",
    answer:
      "Có! Bạn có thể đăng nhập tài khoản EduMi trên mọi thiết bị có kết nối Internet. Tiến độ học tập, lịch sử làm đề và sổ tay câu hỏi sai sẽ được tự động đồng bộ thời gian thực.",
  },
  {
    question: "Nếu đăng ký gói Nhóm 2 bạn hoặc Nhóm 3-5 bạn thì kích hoạt thế nào?",
    answer:
      "Sau khi thanh toán thành công, hệ thống sẽ cung cấp danh sách mã kích hoạt (Activation Key) tương ứng với số lượng thành viên trong nhóm. Mỗi bạn chỉ cần nhập mã vào tài khoản EduMi của riêng mình để nhận trọn vẹn quyền lợi độc lập.",
  },
  {
    question: "Mình có thể nâng cấp từ gói 1 tháng lên gói 3 tháng hoặc 6 tháng được không?",
    answer:
      "Hoàn toàn được! Bạn có thể nâng cấp bất cứ lúc nào. EduMi sẽ hỗ trợ bảo lưu thời gian còn lại của gói cũ và cộng dồn thêm thời gian của gói mới, kèm chiết khấu bù trừ hợp lý.",
  },
  {
    question: "Gia sư Capy AI có hỗ trợ giải đáp bài tập vận dụng cao 9+ không?",
    answer:
      "Có! Capy AI có khả năng giải thích chi tiết các bài toán phân loại điểm 9+, chỉ ra mẹo bấm máy Casio nhanh, chấm bài tự luận Văn và phân tích các dạng câu hỏi mới trong đề thi 2026.",
  },
];

export default function PremiumTrustAndFaq() {
  const [isTableExpanded, setIsTableExpanded] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="w-full space-y-8">
      {/* ── 1. Comparison Table with Hover Lift ── */}
      <div className="w-full bg-white rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-6 sm:p-8 space-y-6 transform-gpu transition-[box-shadow,border-color] duration-200 hover:shadow-md hover:border-emerald-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              <span>SO SÁNH MINH BẠCH</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              BẢNG SO SÁNH QUYỀN LỢI CÁC GÓI TÀI KHOẢN
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Xem rõ chi tiết từng tính năng để chọn gói học phù hợp nhất với mục tiêu của bạn.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTableExpanded(!isTableExpanded)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all duration-150 transform-gpu cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <span>{isTableExpanded ? "Thu gọn" : "Xem chi tiết"}</span>
            {isTableExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isTableExpanded && (
          <div className="overflow-x-auto animate-in fade-in duration-200">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider font-bold text-slate-700">
                  <th className="py-3 px-4 w-2/5">Tính năng &amp; Quyền lợi</th>
                  <th className="py-3 px-3 text-center w-1/5 bg-slate-50 rounded-t-xl">
                    Tài khoản Miễn Phí
                  </th>
                  <th className="py-3 px-3 text-center w-1/5 bg-amber-50/60 rounded-t-xl text-amber-900">
                    Gói Khối Môn
                  </th>
                  <th className="py-3 px-3 text-center w-1/5 bg-emerald-50 rounded-t-xl text-emerald-900 font-black">
                    VIP Toàn Diện 👑
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px] text-slate-800">
                {COMPARISON_FEATURES.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-emerald-50/50 transform-gpu transition-colors duration-150"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">
                        {row.category}
                      </span>
                      {row.name}
                    </td>

                    <td className="py-3.5 px-3 text-center bg-slate-50/40">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-500 font-medium">{row.free}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center bg-amber-50/30">
                      {typeof row.skill === "boolean" ? (
                        row.skill ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                        )
                      ) : (
                        <span className="text-amber-950 font-bold">{row.skill}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center bg-emerald-50/40">
                      {typeof row.vip === "boolean" ? (
                        row.vip ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <X className="w-4 h-4 text-slate-300 stroke-[2] mx-auto" />
                        )
                      ) : (
                        <span className="text-emerald-900 font-black">{row.vip}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 2. Streak Challenge & Quality Support with Silky Hover Lifting ── */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-3xl border border-amber-200/80 shadow-[0_4px_20px_rgba(245,158,11,0.06)] p-6 sm:p-7 flex flex-col justify-between space-y-4 transform-gpu transition-[transform,box-shadow,border-color] duration-250 ease-out hover:scale-[1.018] hover:-translate-y-1 hover:shadow-lg hover:border-amber-400 group cursor-default">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-105 transform-gpu transition-transform duration-200">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest block">
                  THỬ THÁCH HỌC TẬP EDUMI
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-amber-900 transition-colors duration-200">
                  STREAK 30 NGÀY — TẶNG 15 NGÀY VIP
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed">
              Học tập là sự bền bỉ mỗi ngày! Khi nâng cấp bất kỳ gói nào, chỉ cần duy trì chuỗi Streak 30 ngày học liên tục (làm tối thiểu 1 bài trắc nghiệm/ngày), Capy AI sẽ tự động <strong className="text-slate-900">cộng thêm 15 ngày VIP miễn phí</strong> vào tài khoản của bạn.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2 group-hover:bg-white transition-colors duration-150">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Hơn 1.200+ học viên đã chinh phục thành công thử thách tháng vừa qua!</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-3xl border border-emerald-200/80 shadow-[0_4px_20px_rgba(6,78,59,0.06)] p-6 sm:p-7 flex flex-col justify-between space-y-4 transform-gpu transition-[transform,box-shadow,border-color] duration-250 ease-out hover:scale-[1.018] hover:-translate-y-1 hover:shadow-lg hover:border-emerald-400 group cursor-default">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-105 transform-gpu transition-transform duration-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-widest block">
                  ĐỒNG HÀNH TẬN TÂM
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-900 transition-colors duration-200">
                  HỖ TRỢ GIẢI ĐỀ 1-1 &amp; TỐI ƯU ĐIỂM SỐ
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed">
              EduMi luôn đồng hành sát cánh cùng bạn đến ngày thi tốt nghiệp &amp; ĐGNL cuối cùng. Đội ngũ trợ giảng và giáo viên giỏi luôn sẵn sàng <strong className="text-slate-900">hỗ trợ giải đáp bài tập khó 24/7</strong>, phân tích điểm yếu và hướng dẫn chiến thuật trong phòng thi.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2 group-hover:bg-white transition-colors duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Hỗ trợ giải đáp bài tập 24/7 từ đội ngũ Trợ giảng &amp; Thầy cô giỏi.</span>
          </div>
        </div>
      </div>

      {/* ── 3. FAQ Accordion ── */}
      <div className="w-full bg-white rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-6 sm:p-8 space-y-5 transform-gpu transition-[box-shadow,border-color] duration-200 hover:shadow-md hover:border-emerald-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HỖ TRỢ GIẢI ĐÁP</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
            CÂU HỎI THƯỜNG GẶP (FAQ)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Tất cả những điều bạn cần biết trước khi nâng cấp gói học tại EduMi.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {FAQ_LIST.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-200 overflow-hidden hover:scale-[1.008] ${
                  isOpen
                    ? "border-emerald-400 bg-emerald-50/50 shadow-xs"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 hover:shadow-2xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-emerald-600 text-white rotate-180 border-emerald-600" : "bg-white text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed border-t border-emerald-100/60 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Bottom Mentor Course Banner ── */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg transform-gpu transition-[transform,box-shadow] duration-250 hover:scale-[1.01] hover:shadow-xl border border-transparent">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0 hidden sm:flex">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black uppercase text-amber-300">
              LỚP HỌC TRỰC TUYẾN CÙNG THỦ KHOA &amp; GIÁO VIÊN GIỎI
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-1">
              Khám phá các khóa học chuyên sâu theo chuyên đề, tương tác trực tiếp và nhận hướng dẫn 1-1 để tối ưu điểm 9+.
            </p>
          </div>
        </div>

        <Link
          href="/classes"
          className="w-full md:w-auto px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 transform-gpu cursor-pointer flex items-center justify-center gap-2 flex-shrink-0 shadow-md hover:scale-105 active:scale-95"
        >
          <span>Xem các lớp học</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}
