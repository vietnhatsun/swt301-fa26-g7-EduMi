"use client";

import React from "react";
import Image from "next/image";

export default function LearningMethodSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#f9fdfa] via-white to-[#f4faf6] relative overflow-hidden select-none">
      {/* ── Soft Ambient Glows ── */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── Floating Decorative Leaves ── */}
      <div className="absolute top-12 left-10 text-emerald-500/30 text-2xl -rotate-45 pointer-events-none hidden sm:block">
        🍃
      </div>
      <div className="absolute top-36 right-1/3 text-emerald-500/25 text-xl rotate-12 pointer-events-none hidden sm:block">
        🍃
      </div>
      <div className="absolute top-72 right-12 text-emerald-500/30 text-lg rotate-45 pointer-events-none hidden sm:block">
        🍃
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ══════════════════════════════════════════════════════════════════════
            TOP HEADER AREA: Title on Left, Cute Capybara Mascot on Right
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center mb-16 lg:mb-20">
          {/* Left Column: Heading & Subtitle */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f7ee] border border-emerald-200/70 text-emerald-800 text-xs font-bold tracking-wide shadow-2xs">
              <span className="text-emerald-600 text-sm">🍃</span>
              <span className="uppercase text-[11px] font-black tracking-wider">
                PHƯƠNG PHÁP HỌC TẬP
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Bứt Phá Điểm Số <br className="hidden sm:inline" />
              Bằng{" "}
              <span className="text-[#059669] relative inline-block">
                Phương Pháp Khoa Học
                {/* Curved green underline stroke */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-3 sm:h-3.5 text-emerald-500 overflow-visible"
                  viewBox="0 0 350 14"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C95 3 245 3 347 9.5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            {/* Description Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl pt-1">
              Không chỉ học nhiều, mà học đúng cách! EduMi áp dụng 3 phương pháp
              học tập khoa học giúp bạn ghi nhớ lâu hơn, hiểu sâu hơn và tiến bộ
              vượt bậc.
            </p>
          </div>

          {/* Right Column: Capybara Mascot Seamlessly Integrated with Natural Depth */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[400px] sm:max-w-[440px] lg:max-w-[480px]">
              {/* Soft ambient mint aura behind mascot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

              <Image
                src="/method-capybara.png"
                alt="EduMi Capybara Học đúng cách – Đi xa hơn!"
                width={520}
                height={360}
                className="w-full h-auto object-contain pointer-events-none"
                priority
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            3 PROCESS CARDS WITH CONNECTORS
            Card 1: Tiếp Thu Tinh Gọn (Micro-learning)
            Card 2: Phản Xạ Chủ Động (Active Recall)
            Card 3: Lặp Lại Ngắt Quãng (Spaced Repetition)
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="relative">
          {/* Curved Arrow Connectors between cards (Desktop only) */}
          <div className="hidden md:block absolute -top-3.5 left-0 w-full pointer-events-none z-20">
            <svg
              className="w-full h-12"
              viewBox="0 0 1100 48"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Connector from Card 1 to Card 2 */}
              <path
                d="M 330 20 C 370 2 400 2 430 20"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />
              <path
                d="M 426 13 L 434 20 L 424 24"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Connector from Card 2 to Card 3 */}
              <path
                d="M 700 20 C 740 2 770 2 800 20"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />
              <path
                d="M 796 13 L 804 20 L 794 24"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-7 lg:gap-8 items-stretch pt-4">
            {/* ── CARD 01: Tiếp Thu Tinh Gọn (Micro-learning) ── */}
            <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 rounded-[32px] p-7 sm:p-8 pt-10 border-2 border-emerald-100/90 shadow-[0_12px_36px_rgba(6,78,59,0.06)] hover:shadow-[0_20px_45px_rgba(6,78,59,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative min-h-[430px] group overflow-hidden">
              {/* Circular Number Badge */}
              <div className="w-14 h-14 rounded-full bg-[#059669] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-700/25 absolute -top-7 left-8 border-4 border-white z-10">
                01
              </div>

              <div>
                {/* Top Right Tag */}
                <div className="flex justify-end mb-6">
                  <span className="bg-[#e8f7ee] text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200/60">
                    Học ít nhưng chất
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  Tiếp Thu Tinh Gọn
                </h3>
                <p className="text-slate-500 font-bold text-xs sm:text-[13px] mt-1 mb-4">
                  (Micro-learning)
                </p>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed font-medium">
                  Nắm vững lý thuyết trọng tâm qua các video ngắn 15–20 phút và sơ đồ
                  tư duy Mindmap, loại bỏ kiến thức thừa để học đúng trọng tâm
                  nhất.
                </p>
              </div>

              {/* Bottom Feature Tag & 3D Graphic with integrated depth */}
              <div className="pt-6 mt-auto flex items-end justify-between relative z-10">
                <span className="bg-[#e8f7ee] text-emerald-800 border border-emerald-200/80 px-3.5 py-2 rounded-full font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs self-end mb-1">
                  <span className="text-[10px] text-emerald-600">▶</span>
                  <span>Học nhanh, nhớ lâu</span>
                </span>

                {/* 3D Sticker nestled with ambient depth glow */}
                <div className="relative -mr-2 -mb-2 w-32 sm:w-36 h-20 sm:h-24 flex items-end justify-end pointer-events-none">
                  <div className="absolute bottom-2 right-2 w-20 h-20 bg-emerald-200/35 rounded-full blur-xl -z-10" />
                  <Image
                    src="/method-card1-gfx.png"
                    alt="Video và Mindmap Tinh Gọn"
                    width={150}
                    height={95}
                    className="w-full h-full object-contain drop-shadow-[0_10px_16px_rgba(6,78,59,0.15)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* ── CARD 02: Phản Xạ Chủ Động (Active Recall) ── */}
            <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 rounded-[32px] p-7 sm:p-8 pt-10 border-2 border-emerald-100/90 shadow-[0_12px_36px_rgba(6,78,59,0.06)] hover:shadow-[0_20px_45px_rgba(6,78,59,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative min-h-[430px] group overflow-hidden">
              {/* Circular Number Badge */}
              <div className="w-14 h-14 rounded-full bg-[#059669] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-700/25 absolute -top-7 left-8 border-4 border-white z-10">
                02
              </div>

              <div>
                {/* Top Right Tag */}
                <div className="flex justify-end mb-6">
                  <span className="bg-[#e8f7ee] text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200/60">
                    Kích hoạt trí nhớ
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  Phản Xạ Chủ Động
                </h3>
                <p className="text-slate-500 font-bold text-xs sm:text-[13px] mt-1 mb-4">
                  (Active Recall)
                </p>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed font-medium">
                  Luyện đề trắc nghiệm tính giờ ngay sau mỗi bài học. Não bộ liên
                  tục phải truy xuất dữ liệu giúp tạo liên kết nó-ron bền vững gấp 3
                  lần đọc thụ động.
                </p>
              </div>

              {/* Bottom Feature Tag & 3D Graphic with integrated depth */}
              <div className="pt-6 mt-auto flex items-end justify-between relative z-10">
                <span className="bg-[#e8f7ee] text-emerald-800 border border-emerald-200/80 px-3.5 py-2 rounded-full font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs self-end mb-1">
                  <span className="text-[12px] text-emerald-600">⚡</span>
                  <span>Nhớ nhanh hơn</span>
                </span>

                {/* 3D Sticker nestled with ambient depth glow */}
                <div className="relative -mr-2 -mb-2 w-32 sm:w-36 h-20 sm:h-24 flex items-end justify-end pointer-events-none">
                  <div className="absolute bottom-2 right-2 w-20 h-20 bg-emerald-200/35 rounded-full blur-xl -z-10" />
                  <Image
                    src="/method-card2-gfx.png"
                    alt="Trắc nghiệm phản xạ và Đồng hồ bấm giờ"
                    width={150}
                    height={95}
                    className="w-full h-full object-contain drop-shadow-[0_10px_16px_rgba(6,78,59,0.15)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* ── CARD 03: Lặp Lại Ngắt Quãng (Spaced Repetition) ── */}
            <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 rounded-[32px] p-7 sm:p-8 pt-10 border-2 border-emerald-100/90 shadow-[0_12px_36px_rgba(6,78,59,0.06)] hover:shadow-[0_20px_45px_rgba(6,78,59,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative min-h-[430px] group overflow-hidden">
              {/* Circular Number Badge */}
              <div className="w-14 h-14 rounded-full bg-[#059669] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-700/25 absolute -top-7 left-8 border-4 border-white z-10">
                03
              </div>

              <div>
                {/* Top Right Tag */}
                <div className="flex justify-end mb-6">
                  <span className="bg-[#e8f7ee] text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200/60">
                    Ghi nhớ bền vững
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  Lặp Lại Ngắt Quãng
                </h3>
                <p className="text-slate-500 font-bold text-xs sm:text-[13px] mt-1 mb-4">
                  (Spaced Repetition)
                </p>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed font-medium">
                  Hệ thống Flashcard AI tự tính toán “đường cong quên lãng” của
                  Ebbinghaus, chủ động nhắc bạn ôn lại câu khó đúng vào thời điểm
                  vàng trước khi bị quên.
                </p>
              </div>

              {/* Bottom Feature Tag & 3D Graphic with integrated depth */}
              <div className="pt-6 mt-auto flex items-end justify-between relative z-10">
                <span className="bg-[#e8f7ee] text-emerald-800 border border-emerald-200/80 px-3.5 py-2 rounded-full font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs self-end mb-1">
                  <span className="text-[12px] text-emerald-600">⏰</span>
                  <span>Ôn đúng lúc, nhớ lâu</span>
                </span>

                {/* 3D Sticker nestled with ambient depth glow */}
                <div className="relative -mr-2 -mb-2 w-32 sm:w-36 h-20 sm:h-24 flex items-end justify-end pointer-events-none">
                  <div className="absolute bottom-2 right-2 w-20 h-20 bg-emerald-200/35 rounded-full blur-xl -z-10" />
                  <Image
                    src="/method-card3-gfx.png"
                    alt="Flashcard AI thông minh"
                    width={150}
                    height={95}
                    className="w-full h-full object-contain drop-shadow-[0_10px_16px_rgba(6,78,59,0.15)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Center Footer Slogan ── */}
        <div className="pt-14 pb-2 flex items-center justify-center gap-3 text-xs sm:text-[13px] font-black text-emerald-800 tracking-[0.22em] uppercase">
          <span className="text-emerald-500 text-sm">🍃</span>
          <span>HỌC THÔNG MINH • TIẾN BỘ MỖI NGÀY</span>
          <span className="text-emerald-500 text-sm">🍃</span>
        </div>
      </div>
    </section>
  );
}
