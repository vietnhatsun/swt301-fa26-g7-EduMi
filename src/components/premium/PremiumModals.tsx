"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
  Key,
  Tag,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { PricingPlan, GroupSize } from "./PremiumSections";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  initialGroupSize?: GroupSize;
  initialCode?: string;
  initialDiscount?: number;
}

export function PremiumCheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
  initialGroupSize = 1,
  initialCode = "",
  initialDiscount = 0,
}: CheckoutModalProps) {
  // Step 1: Ưu đãi & Mã giảm giá | Step 2: Quét mã QR thanh toán
  const [step, setStep] = useState<1 | 2>(1);

  // Group size discount (1 | 2 | 3)
  const [groupSize, setGroupSize] = useState<GroupSize>(initialGroupSize);

  // Promo code
  const [promoInput, setPromoInput] = useState(initialCode);
  const [appliedCode, setAppliedCode] = useState(initialCode);
  const [appliedDiscount, setAppliedDiscount] = useState(initialDiscount);
  const [promoMessage, setPromoMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Payment states
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when opening a new plan
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSuccess(false);
      setIsProcessing(false);
      setCopiedField(null);
    }
  }, [isOpen, selectedPlan]);

  if (!isOpen || !selectedPlan) return null;

  // Price calculations
  const basePricePerPerson = selectedPlan.basePrice;
  const numMembers = groupSize === 3 ? 3 : groupSize;
  const totalBasePrice = basePricePerPerson * numMembers;

  const groupDiscountPercent = groupSize === 2 ? 15 : groupSize === 3 ? 20 : 0;
  const effectiveDiscountPercent = Math.max(appliedDiscount, groupDiscountPercent);

  const finalPriceNumber =
    effectiveDiscountPercent > 0
      ? Math.round((totalBasePrice * (100 - effectiveDiscountPercent)) / 100)
      : totalBasePrice;

  const perPersonPrice = Math.round(finalPriceNumber / numMembers);

  const finalPriceFormatted =
    new Intl.NumberFormat("vi-VN").format(finalPriceNumber) + "đ";
  const perPersonPriceFormatted =
    new Intl.NumberFormat("vi-VN").format(perPersonPrice) + "đ";
  const originalPriceFormatted =
    new Intl.NumberFormat("vi-VN").format(totalBasePrice) + "đ";

  // Banking info
  const bankName = "MB Bank (Ngân hàng Quân Đội)";
  const accountNumber = "0388999888";
  const accountHolder = "CONG TY GIAO DUC EDUMI";
  const transferMemo = `EDUMI ${selectedPlan.id.toUpperCase().replace(/-/g, "")} ${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  // VietQR Napas URL format
  const vietQrUrl = `https://img.vietqr.io/image/MB-${accountNumber}-compact2.png?amount=${finalPriceNumber}&addInfo=${encodeURIComponent(
    transferMemo
  )}&accountName=${encodeURIComponent(accountHolder)}`;

  const mockActivationKeys = Array.from({ length: numMembers }).map((_, i) => ({
    name: `Tài khoản ${i + 1}`,
    key: `EDUMI-VIP-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`,
  }));

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) {
      setPromoMessage({ type: "error", text: "Vui lòng nhập mã ưu đãi." });
      return;
    }

    if (code === "EDUMI5" || code === "GIAM5" || code === "CAPY5") {
      setAppliedCode(code);
      setAppliedDiscount(5);
      setPromoMessage({ type: "success", text: "Áp dụng mã thành công! Giảm 5% học phí." });
    } else if (code === "EDUMI10" || code === "VIP10" || code === "CAPYBARA") {
      setAppliedCode(code);
      setAppliedDiscount(10);
      setPromoMessage({ type: "success", text: "Tuyệt vời! Áp dụng mã đặc biệt giảm ngay 10%." });
    } else if (code.startsWith("EDUMI10-") || code.startsWith("THPT-")) {
      setAppliedCode(code);
      setAppliedDiscount(10);
      setPromoMessage({ type: "success", text: `Áp dụng mã [${code}] thành công! Giảm 10%.` });
    } else {
      setAppliedCode(code);
      setAppliedDiscount(5);
      setPromoMessage({ type: "success", text: `Áp dụng mã [${code}] thành công! Giảm 5% học phí.` });
    }
  };

  const handleRemovePromo = () => {
    setAppliedCode("");
    setAppliedDiscount(0);
    setPromoInput("");
    setPromoMessage(null);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-emerald-100 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-all cursor-pointer z-10"
          title="Đóng"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* ── MÀN HÌNH HOÀN TẤT THÀNH CÔNG ── */}
        {isSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              KÍCH HOẠT THÀNH CÔNG!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              Cảm ơn bạn đã nâng cấp <strong className="text-slate-900">{selectedPlan.name}</strong>
              {numMembers > 1 ? ` cho nhóm ${numMembers} học sinh` : ""}.
            </p>

            {numMembers > 1 ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2.5">
                <p className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  <span>MÃ KÍCH HOẠT CHO TỪNG BẠN TRONG NHÓM:</span>
                </p>
                <div className="space-y-1.5">
                  {mockActivationKeys.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200 text-xs font-mono font-bold"
                    >
                      <span className="text-slate-600">{item.name}:</span>
                      <span className="text-emerald-700">{item.key}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.key, `key-${idx}`)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-800 cursor-pointer font-sans font-semibold transition-colors"
                      >
                        {copiedField === `key-${idx}` ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-bold space-y-1">
                <p>🎉 Tài khoản của bạn đã được nâng cấp VIP. Bắt đầu luyện thi cùng Capy AI ngay!</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
            >
              BẮT ĐẦU HỌC NGAY
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* ── STEP PROGRESS BAR ── */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 pr-8">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                    step === 1
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {step === 2 ? "✓" : "1"}
                </span>
                <span
                  className={`text-xs font-black uppercase tracking-tight ${
                    step === 1 ? "text-emerald-900" : "text-slate-500"
                  }`}
                >
                  1. Chọn ưu đãi
                </span>

                <span className="text-slate-300 mx-1">→</span>

                <span
                  className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                    step === 2
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  2
                </span>
                <span
                  className={`text-xs font-black uppercase tracking-tight ${
                    step === 2 ? "text-emerald-900" : "text-slate-400"
                  }`}
                >
                  2. Quét mã VietQR
                </span>
              </div>
            </div>

            {/* ── HEADER GÓI ĐÃ CHỌN ── */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>GÓI BẠN ĐANG CHỌN:</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase">
                  {selectedPlan.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold block">Giá niêm yết:</span>
                <span className="text-base sm:text-lg font-black text-emerald-800">
                  {selectedPlan.priceFormatted}
                </span>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                BƯỚC 1: CHỌN ƯU ĐÃI NHÓM & MÃ GIẢM GIÁ
            ═══════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* 1. Chọn Ưu Đãi Study Squad */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      <span>HÌNH THỨC ĐĂNG KÝ (STUDY SQUAD):</span>
                    </label>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white uppercase">
                      GIẢM ĐẾN 20%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* 1 Học sinh */}
                    <button
                      type="button"
                      onClick={() => setGroupSize(1)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        groupSize === 1
                          ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                          : "bg-slate-50/60 border-slate-200 hover:border-emerald-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 uppercase">1 Bạn</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          Cá nhân
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        Giá tiêu chuẩn
                      </p>
                    </button>

                    {/* Nhóm 2 bạn */}
                    <button
                      type="button"
                      onClick={() => setGroupSize(2)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        groupSize === 2
                          ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                          : "bg-slate-50/60 border-slate-200 hover:border-amber-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 uppercase">Nhóm 2 bạn</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-600 text-white">
                          -15%
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-bold mt-1">
                        +15 ngày VIP/bạn
                      </p>
                    </button>

                    {/* Nhóm 3-5 bạn */}
                    <button
                      type="button"
                      onClick={() => setGroupSize(3)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        groupSize === 3
                          ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs"
                          : "bg-slate-50/60 border-slate-200 hover:border-rose-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 uppercase">Nhóm 3+ bạn</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-rose-600 text-white">
                          -20%
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-800 font-bold mt-1">
                        +30 ngày VIP/bạn
                      </p>
                    </button>
                  </div>
                </div>

                {/* 2. Nhập Mã Giảm Giá */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>MÃ GIẢM GIÁ (PROMO CODE):</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        if (promoMessage) setPromoMessage(null);
                      }}
                      placeholder="NHẬP MÃ (VD: EDUMI10, CAPYBARA)"
                      className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 uppercase tracking-wider bg-slate-50/70 focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wide transition-all cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                      Áp dụng
                    </button>

                    {appliedCode && (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="h-11 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex-shrink-0"
                      >
                        Hủy
                      </button>
                    )}
                  </div>

                  {/* Mã gợi ý nhanh */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">Gợi ý:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPromoInput("EDUMI10");
                        handleApplyPromo("EDUMI10");
                      }}
                      className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-mono font-bold text-[10px] cursor-pointer"
                    >
                      EDUMI10 (-10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPromoInput("CAPYBARA");
                        handleApplyPromo("CAPYBARA");
                      }}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono font-bold text-[10px] cursor-pointer"
                    >
                      CAPYBARA (-10%)
                    </button>
                  </div>

                  {promoMessage && (
                    <div
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in duration-150 ${
                        promoMessage.type === "success"
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                          : "bg-rose-50 border border-rose-200 text-rose-700"
                      }`}
                    >
                      {promoMessage.type === "success" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      )}
                      <span>{promoMessage.text}</span>
                    </div>
                  )}
                </div>

                {/* 3. Bảng Tóm Tắt Học Phí */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                    <span>Học phí ({numMembers} học sinh):</span>
                    <span className={effectiveDiscountPercent > 0 ? "line-through text-slate-400" : "font-bold text-slate-900"}>
                      {originalPriceFormatted}
                    </span>
                  </div>

                  {effectiveDiscountPercent > 0 && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                      <span>Ưu đãi áp dụng ({appliedCode ? `${appliedCode} ` : ""}-{effectiveDiscountPercent}%):</span>
                      <span>
                        -
                        {new Intl.NumberFormat("vi-VN").format(
                          Math.round((totalBasePrice * effectiveDiscountPercent) / 100)
                        )}
                        đ
                      </span>
                    </div>
                  )}

                  {numMembers > 1 && (
                    <div className="flex items-center justify-between text-xs text-amber-900 font-bold bg-amber-100/70 p-2 rounded-xl border border-amber-300">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Chia nhỏ mỗi bạn:
                      </span>
                      <span className="text-emerald-800 font-black">{perPersonPriceFormatted} / bạn</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-slate-900">TỔNG THANH TOÁN:</span>
                    <span className="text-2xl font-black text-emerald-700 tracking-tight">
                      {finalPriceFormatted}
                    </span>
                  </div>
                </div>

                {/* Nút Chuyển Tiếp Sang Bước 2 */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                >
                  <span>TIẾP TỤC THANH TOÁN (QUÉT MÃ QR)</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                BƯỚC 2: QUÉT MÃ VIETQR THANH TOÁN
            ═══════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Back to Step 1 Button */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>← Quay lại chỉnh ưu đãi</span>
                  </button>

                  <span className="text-xs text-slate-500 font-bold">
                    Tổng cần chuyển: <strong className="text-emerald-700 font-black text-sm">{finalPriceFormatted}</strong>
                  </span>
                </div>

                {/* VietQR Frame */}
                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>QUÉT MÃ VIETQR QUA APP NGÂN HÀNG</span>
                  </p>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-36 h-36 bg-white rounded-xl p-1 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={vietQrUrl}
                        alt="VietQR Banking Payment"
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EDUMI-${encodeURIComponent(
                            transferMemo
                          )}-${finalPriceNumber}`;
                        }}
                      />
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700 flex-1 w-full">
                      <div>
                        <span className="text-slate-500 font-medium">Ngân hàng: </span>
                        <span className="font-bold text-slate-900">{bankName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-slate-500 font-medium">STK: </span>
                          <span className="font-mono font-black text-slate-900 text-sm">{accountNumber}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(accountNumber, "stk")}
                          className="p-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === "stk" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div>
                        <span className="text-slate-500 font-medium">Chủ TK: </span>
                        <span className="font-bold text-slate-900">{accountHolder}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-slate-500 font-medium">Nội dung: </span>
                          <span className="font-mono font-black text-emerald-700">{transferMemo}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(transferMemo, "memo")}
                          className="p-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[10px] font-bold text-emerald-800 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === "memo" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Hệ thống tự động kích hoạt tài khoản trong vòng 5 - 30 giây.</span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>ĐANG XÁC NHẬN GIAO DỊCH...</span>
                    </div>
                  ) : (
                    <span>TÔI ĐÃ CHUYỂN KHOẢN XONG</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface DocsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export function PremiumDocsPreviewModal({
  isOpen,
  onClose,
  title,
  description,
}: DocsPreviewModalProps) {
  if (!isOpen) return null;

  const sampleItems = [
    {
      subject: "TOÁN HỌC - CASIO 2026",
      topic: "Tìm cực trị hàm số hợp chứa trị tuyệt đối",
      tag: "Dạng 8.8+ Điểm",
      solution: "Bấm phím [TABLE] f(x) kết hợp đạo hàm nhanh 3 giây, loại trừ 3 đáp án nhiễu ngay lập tức.",
      preview: "Câu 45: Cho hàm số y = f(x)... Số điểm cực trị của hàm g(x) = f(|x| - 2) là 7.",
    },
    {
      subject: "ĐÁNH GIÁ NĂNG LỰC (HSA)",
      topic: "Tư duy định lượng & Giải quyết vấn đề số liệu",
      tag: "Ma trận HSA 2026",
      solution: "Phân tích biểu đồ tròn và bảng số liệu chéo bằng phương pháp loại suy và xấp xỉ tỉ lệ.",
      preview: "Dạng bài đọc biểu đồ kết hợp liên môn Kinh tế - Địa lý trong đề thi chính thức ĐHQG.",
    },
    {
      subject: "NGỮ VĂN THPT",
      topic: "Mở bài & Luận điểm nâng cao Nghị luận xã hội",
      tag: "Barem điểm 9+",
      solution: "Công thức mở bài gián tiếp 3 câu + Dẫn chứng thực tế đương đại giúp tăng điểm sáng tạo.",
      preview: "Đoạn văn 200 chữ về 'Trách nhiệm của thế hệ trẻ trước kỷ nguyên số và AI'.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-all cursor-pointer"
          title="Đóng"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>QUÀ TẶNG BẢN QUYỀN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {title || "TRỌN BỘ 50 ĐỀ ĐÁNH GIÁ NĂNG LỰC & KHO TÀI LIỆU 2026"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-0.5">
            <span className="text-lg font-black text-slate-900">500+ Đề</span>
            <p className="text-[10px] text-slate-600 font-bold uppercase">Chuẩn ma trận 2026</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-0.5">
            <span className="text-lg font-black text-slate-900">100% Giải</span>
            <p className="text-[10px] text-slate-600 font-bold uppercase">Có video &amp; lời giải</p>
          </div>
          <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 text-center space-y-0.5">
            <span className="text-lg font-black text-teal-800">Capy AI</span>
            <p className="text-[10px] text-slate-600 font-bold uppercase">Phân tích câu sai</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Xem trước một số chuyên đề tiêu biểu trong bộ đề:
          </p>

          <div className="space-y-2.5">
            {sampleItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.subject}
                  </span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-900 font-bold">📌 {item.topic}</p>
                <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                  💡 Bí kíp giải nhanh: {item.solution}
                </p>
                <p className="text-[11px] text-slate-500 italic">“{item.preview}”</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            ĐÃ HIỂU &amp; QUAY LẠI CHỌN GÓI
          </button>
        </div>
      </div>
    </div>
  );
}
