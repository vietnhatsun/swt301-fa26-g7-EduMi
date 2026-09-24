"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Receipt,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  ShieldCheck,
  QrCode,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Building2,
  ChevronRight,
} from "lucide-react";

interface Transaction {
  id: string;
  code: string;
  title: string;
  category: "course" | "tuition" | "subscription" | "wallet";
  categoryLabel: string;
  amount: number;
  date: string;
  time: string;
  paymentMethod: string;
  status: "success" | "pending" | "failed";
  invoiceUrl?: string;
}

export default function TransactionsTab() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const transactions: Transaction[] = [
    {
      id: "tx-01",
      code: "EDM-TX-892147",
      title: "Khóa Luyện thi THPT Quốc Gia 2026 Toàn diện (Toán - Anh - Lý)",
      category: "course",
      categoryLabel: "Khóa học VIP",
      amount: 1490000,
      date: "15/09/2026",
      time: "14:32",
      paymentMethod: "Chuyển khoản QR (SePay / VietQR)",
      status: "success",
    },
    {
      id: "tx-02",
      code: "EDM-TX-781023",
      title: "Gói Flashcard AI 6 tháng (Spaced Repetition Pro)",
      category: "subscription",
      categoryLabel: "Tiện ích AI",
      amount: 299000,
      date: "01/09/2026",
      time: "09:15",
      paymentMethod: "Ví điện tử MoMo",
      status: "success",
    },
    {
      id: "tx-03",
      code: "EDM-TX-654812",
      title: "Học phí Lớp Toán 12 Thầy Đức (Tháng 9/2026)",
      category: "tuition",
      categoryLabel: "Học phí lớp",
      amount: 661000,
      date: "28/08/2026",
      time: "20:05",
      paymentMethod: "Thẻ ATM / Internet Banking",
      status: "success",
    },
  ];

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch =
      tx.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (filterCategory === "tuition") return tx.category === "tuition";
    if (filterCategory === "course") return tx.category === "course" || tx.category === "subscription";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
            QUẢN LÝ TÀI CHÍNH & THANH TOÁN
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Giao dịch & Học phí</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Đã kích hoạt SePay
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowPayModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Nạp học phí / Thanh toán</span>
        </button>
      </div>

      {/* ── 3 Summary KPI Financial Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Ví học tập / Số dư */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                SỐ DƯ VÍ HỌC TẬP
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              0 <span className="text-sm font-semibold text-slate-400">đ</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Điểm thưởng tích lũy:</span>
              <span className="font-bold text-emerald-700">1,250 EduPoint</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPayModal(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center gap-1"
            >
              <span>+ Nạp số dư ví</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-400">Tự động trừ khi đến hạn</span>
          </div>
        </div>

        {/* Card 2: Gói cước đang sử dụng */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                GÓI KHÓA HỌC HIỆN TẠI
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-slate-900 leading-snug">
              Pro Luyện thi THPT 2026
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Thời hạn đến: <strong className="text-slate-800">30/06/2026</strong> (còn 279 ngày)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">Đang hoạt động tốt</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              Đã thanh toán
            </span>
          </div>
        </div>

        {/* Card 3: Tổng chi tiêu học tập */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                TỔNG HỌC PHÍ ĐÃ ĐÓNG
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatVND(2450000)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tổng cộng 3 hóa đơn thành công
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Hóa đơn gần nhất</span>
            <span className="text-xs font-bold text-slate-800">15/09/2026</span>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Filter & Search ── */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả giao dịch (3)
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("tuition")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === "tuition"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Học phí lớp học
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("course")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === "course"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Khóa học & Gói VIP
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã GD, tên gói học..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ── Transaction History Table / Cards ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Lịch sử giao dịch gần đây
          </h3>
          <span className="text-xs text-slate-400">
            Hiển thị {filteredTransactions.length} giao dịch
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {tx.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {tx.categoryLabel}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug">
                    {tx.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                    <span>
                      {tx.date} lúc {tx.time}
                    </span>
                    <span>•</span>
                    <span>{tx.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {formatVND(tx.amount)}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Thành công
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTx(tx)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5 text-slate-400" />
                  <span>Biên lai</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Security & Support Information Box ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Cổng thanh toán tự động & Bảo mật chuẩn Quốc tế
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Hệ thống tích hợp cổng thanh toán SePay Webhook đối soát tự động 24/7. Mọi giao dịch đều được mã hóa SSL an toàn tuyệt đối.
            </p>
          </div>
        </div>

        <a
          href="tel:19008888"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <span>Hỗ trợ thanh toán: 1900 8888</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* ── Payment / Top-up Modal ── */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Thanh toán học phí / Nạp ví
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Chọn phương thức để đóng học phí tháng tới hoặc nạp tiền vào ví EduMi:
            </p>

            <div className="space-y-2.5 mb-5">
              <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/50 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs">
                    QR
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Chuyển khoản SePay / VietQR
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Quét mã QR qua app ngân hàng, kích hoạt ngay sau 5 giây
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Khuyên dùng
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-pink-600 font-bold text-xs">
                    MoMo
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Ví điện tử MoMo</h5>
                    <p className="text-[11px] text-slate-500">
                      Thanh toán nhanh qua ví điện tử
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                    ATM
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Thẻ ATM nội địa / Visa</h5>
                    <p className="text-[11px] text-slate-500">
                      Cổng thanh toán thẻ ngân hàng
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Tính năng tạo mã QR SePay đang kết nối API Sandbox. Cảm ơn bạn!");
                  setShowPayModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Transaction Receipt Modal ── */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-emerald-100">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Biên lai giao dịch</h3>
              <p className="text-xs text-slate-500">EduMi Education Platform</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Mã giao dịch:</span>
                <span className="font-mono font-bold text-slate-800">{selectedTx.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Thời gian:</span>
                <span className="font-medium text-slate-800">{selectedTx.date} {selectedTx.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nội dung:</span>
                <span className="font-bold text-slate-800 text-right max-w-[180px]">{selectedTx.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phương thức:</span>
                <span className="font-medium text-slate-800">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-800">Tổng thanh toán:</span>
                <span className="text-sm font-black text-emerald-700">{formatVND(selectedTx.amount)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Đóng biên lai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
