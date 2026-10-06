"use client";

import React, { useState } from "react";
import { X, CheckCircle, Copy, Check, QrCode, ShieldCheck, Sparkles, Users, Key, ExternalLink } from "lucide-react";
import { PricingPlan } from "./PremiumPlans";
import { GroupSize } from "./PremiumDiscounts";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  appliedDiscount: number;
  appliedCode: string;
  groupSize?: GroupSize;
}

export function PremiumCheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
  appliedDiscount,
  appliedCode,
  groupSize = 1,
}: CheckoutModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !selectedPlan) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-all cursor-pointer"
          title="Đóng"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {isSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              KÍCH HOẠT THÀNH CÔNG!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
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
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-800 cursor-pointer font-sans"
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
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              BẮT ĐẦU HỌC NGAY
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                <Sparkles className="w-3 h-3" />
                <span>NÂNG CẤP GÓI HỌC</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {selectedPlan.name}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>Học phí ({numMembers} học sinh):</span>
                <span className={effectiveDiscountPercent > 0 ? "line-through text-slate-400" : "font-bold text-slate-900"}>
                  {originalPriceFormatted}
                </span>
              </div>

              {effectiveDiscountPercent > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>Ưu đãi ({appliedCode ? `${appliedCode} ` : ""}-{effectiveDiscountPercent}%):</span>
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
                <span className="text-sm font-black text-slate-900">TỔNG THANH TOÁN:</span>
                <span className="text-2xl font-black text-emerald-700 tracking-tight">
                  {finalPriceFormatted}
                </span>
              </div>
            </div>

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
                      // Fallback if VietQR server is busy
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
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
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
