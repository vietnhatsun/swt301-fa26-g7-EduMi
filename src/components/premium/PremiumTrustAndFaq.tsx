"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
  ShieldCheck,
  CheckCircle2,
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

export default function PremiumTrustAndFaq() {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

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
            title={isTableExpanded ? "Thu gọn bảng" : "Mở rộng bảng"}
          >
            <span>{isTableExpanded ? "Thu gọn" : "Xem chi tiết"}</span>
            {isTableExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {isTableExpanded && (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-3 sm:px-4 font-black text-slate-700 text-[11px] sm:text-xs uppercase tracking-wider w-[42%]">
                    Tính năng &amp; Quyền lợi
                  </th>
                  <th className="py-3 px-2 sm:px-3 font-extrabold text-slate-500 text-center w-[18%]">
                    Miễn phí
                  </th>
                  <th className="py-3 px-2 sm:px-3 font-extrabold text-teal-800 text-center w-[20%] bg-teal-50/50 rounded-t-xl">
                    Chuyên Khối
                  </th>
                  <th className="py-3 px-2 sm:px-3 font-black text-emerald-800 text-center w-[20%] bg-emerald-50 rounded-t-xl">
                    Full VIP 2026
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_FEATURES.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/70 transition-colors duration-150"
                  >
                    <td className="py-3 px-3 sm:px-4 text-slate-800 font-semibold text-xs sm:text-[13px]">
                      {row.name}
                    </td>

                    <td className="py-3 px-2 sm:px-3 text-center text-xs text-slate-500 font-medium">
                      {row.free === false ? (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        row.free
                      )}
                    </td>

                    <td className="py-3 px-2 sm:px-3 text-center text-xs font-bold text-teal-900 bg-teal-50/30">
                      {row.skill === false ? (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span className="inline-flex items-center gap-1 justify-center">
                          <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3]" />
                          <span>{row.skill}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-2 sm:px-3 text-center text-xs font-black text-emerald-900 bg-emerald-50/50">
                      <span className="inline-flex items-center gap-1 justify-center">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span>{row.vip}</span>
                      </span>
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
    </div>
  );
}
