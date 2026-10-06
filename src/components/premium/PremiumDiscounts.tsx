"use client";

import React, { useState } from "react";
import { Users, Sparkles, Check, Gift, CheckCircle2, AlertCircle, Tag, ArrowRight } from "lucide-react";

export type GroupSize = 1 | 2 | 3;

interface PremiumDiscountsProps {
  groupSize: GroupSize;
  onGroupSizeChange: (size: GroupSize) => void;
  appliedDiscount: number;
  appliedCode: string;
  onApplyCode: (code: string, discountPercent: number) => void;
  onRemoveCode: () => void;
}

export default function PremiumDiscounts({
  groupSize,
  onGroupSizeChange,
  appliedDiscount,
  appliedCode,
  onApplyCode,
  onRemoveCode,
}: PremiumDiscountsProps) {
  const [inputCode, setInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleApply = (codeToApply?: string) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setErrorMessage("Vui lòng nhập mã ưu đãi.");
      setSuccessMessage("");
      return;
    }

    if (code === "EDUMI5" || code === "GIAM5" || code === "CAPY5") {
      onApplyCode(code, 5);
      setSuccessMessage("Áp dụng mã thành công! Giảm 5% học phí.");
      setErrorMessage("");
    } else if (code === "EDUMI10" || code === "VIP10" || code === "CAPYBARA") {
      onApplyCode(code, 10);
      setSuccessMessage("Tuyệt vời! Áp dụng mã đặc biệt giảm ngay 10%.");
      setErrorMessage("");
    } else if (code.startsWith("EDUMI10-") || code.startsWith("THPT-")) {
      onApplyCode(code, 10);
      setSuccessMessage(`Áp dụng mã giới thiệu [${code}] thành công! Giảm ngay 10%.`);
      setErrorMessage("");
    } else {
      onApplyCode(code, 5);
      setSuccessMessage(`Áp dụng mã [${code}] thành công! Giảm 5% học phí.`);
      setErrorMessage("");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ── 1. Study Squad Selector with Silky GPU Hover Lift ── */}
      <div className="w-full bg-white rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-5 sm:p-7 space-y-4 transform-gpu transition-[box-shadow,border-color] duration-200 hover:shadow-md hover:border-emerald-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg flex-shrink-0">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
                  ƯU ĐÃI ĐĂNG KÝ HỌC THEO NHÓM (STUDY SQUAD)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider">
                  TIẾT KIỆM ĐẾN 20%
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Rủ bạn cùng bàn đăng ký để chia nhỏ học phí và nhận thêm ngày học VIP!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* 1 Student */}
          <button
            type="button"
            onClick={() => onGroupSizeChange(1)}
            className={`p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between space-y-2.5 transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
              groupSize === 1
                ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                : "bg-slate-50/60 border-slate-200 hover:border-emerald-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-900">1 Học sinh</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Cá nhân
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Học độc lập, toàn quyền sử dụng tài khoản theo thời gian đăng ký.
            </p>
            <div className="pt-1 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Giá tiêu chuẩn niêm yết</span>
            </div>
          </button>

          {/* 2 Students */}
          <button
            type="button"
            onClick={() => onGroupSizeChange(2)}
            className={`p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between space-y-2.5 transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
              groupSize === 2
                ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                : "bg-slate-50/60 border-slate-200 hover:border-amber-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-900">Nhóm 2 bạn</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                GIẢM THÊM 15%
              </span>
            </div>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              Cặp đôi cùng tiến — nhận 2 mã kích hoạt riêng biệt cho 2 tài khoản độc lập.
            </p>
            <div className="pt-1 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tặng thêm +15 ngày học mỗi bạn</span>
            </div>
          </button>

          {/* 3-5 Students */}
          <button
            type="button"
            onClick={() => onGroupSizeChange(3)}
            className={`p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between space-y-2.5 transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
              groupSize === 3
                ? "bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20 shadow-sm"
                : "bg-slate-50/60 border-slate-200 hover:border-rose-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-900">
                Nhóm 3 - 5 bạn
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white">
                GIẢM KHỦNG 20%
              </span>
            </div>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              Biệt đội thủ khoa — trọn bộ tài liệu ôn thi độc quyền + hỗ trợ nhóm 24/7.
            </p>
            <div className="pt-1 text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Tặng +30 ngày học &amp; bộ đề đặc biệt</span>
            </div>
          </button>
        </div>

        {groupSize > 1 && (
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 font-semibold flex items-center justify-between flex-wrap gap-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>
                Đã kích hoạt ưu đãi <strong className="text-amber-900 font-black">{groupSize === 2 ? "Nhóm 2 bạn (-15%)" : "Nhóm 3-5 bạn (-20%)"}</strong>! Học phí sẽ được tự động chia nhỏ khi bạn bấm chọn gói.
              </span>
            </div>
            <span className="text-[11px] bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full font-mono font-bold">
              MÃ: SQUAD{groupSize === 2 ? "15" : "20"}
            </span>
          </div>
        )}
      </div>

      {/* ── 2. Streamlined Promo Code Card ── */}
      <div className="w-full bg-white rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.04)] p-4 sm:p-5 space-y-3 transform-gpu transition-[box-shadow,border-color] duration-200 hover:shadow-md hover:border-emerald-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApply();
            }}
            className="flex items-center gap-2 flex-1"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="MÃ GIẢM GIÁ (VD: EDUMI10, CAPYBARA)"
                className="w-full h-11 sm:h-12 px-4 rounded-2xl border border-slate-300 font-mono text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 uppercase tracking-wider bg-slate-50/60 focus:bg-white transition-colors duration-150"
              />
              {appliedCode && (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1 animate-in zoom-in-95 duration-150">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  -{appliedDiscount}%
                </span>
              )}
            </div>

            <button
              type="submit"
              className="h-11 sm:h-12 px-5 sm:px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wide uppercase shadow-xs transition-all duration-150 transform-gpu cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0 hover:scale-105 active:scale-95"
            >
              <span>Áp dụng</span>
            </button>

            {appliedCode && (
              <button
                type="button"
                onClick={() => {
                  onRemoveCode();
                  setInputCode("");
                  setSuccessMessage("");
                }}
                className="h-11 sm:h-12 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all duration-150 transform-gpu cursor-pointer flex-shrink-0 hover:scale-105 active:scale-95"
              >
                Hủy
              </button>
            )}
          </form>

          {/* Quick Apply Code Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap sm:justify-end text-xs">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <Tag className="w-3 h-3 text-amber-600" />
              Mã gợi ý:
            </span>
            <button
              type="button"
              onClick={() => {
                setInputCode("EDUMI10");
                handleApply("EDUMI10");
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-mono font-bold text-[11px] transition-all duration-150 transform-gpu cursor-pointer hover:scale-105 active:scale-95"
            >
              EDUMI10 (-10%)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputCode("CAPYBARA");
                handleApply("CAPYBARA");
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono font-bold text-[11px] transition-all duration-150 transform-gpu cursor-pointer hover:scale-105 active:scale-95"
            >
              CAPYBARA (-10%)
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in duration-150">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
