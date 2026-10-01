"use client";

import React from "react";
import Image from "next/image";
import { Clock3, Leaf, Play, Zap } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const methods = [
  {
    number: "01",
    tag: "Học ít nhưng chất",
    title: "Tiếp Thu Tinh Gọn",
    subtitle: "(Micro-learning)",
    desc: "Nắm vững lý thuyết trọng tâm qua các video ngắn 15-20 phút và sơ đồ tư duy Mindmap, loại bỏ kiến thức thừa để học đúng trọng tâm nhất trước khi bước vào luyện tập.",
    chip: "Học nhanh, nhớ lâu",
    image: "/method-card1-gfx.png",
    icon: Play,
    imageOffset: "translate-y-[8px]",
  },
  {
    number: "02",
    tag: "Kích hoạt trí nhớ",
    title: "Phản Xạ Chủ Động",
    subtitle: "(Active Recall)",
    desc: "Luyện đề trắc nghiệm tính giờ ngay sau mỗi bài học. Não bộ liên tục phải truy xuất dữ liệu giúp tạo liên kết nơ-ron bền vững gấp 3 lần đọc thụ động.",
    chip: "Nhớ nhanh hơn",
    image: "/method-card2-gfx.png",
    icon: Zap,
    imageOffset: "translate-y-[8px]",
  },
  {
    number: "03",
    tag: "Ghi nhớ bền vững",
    title: "Lặp Lại Ngắt Quãng",
    subtitle: "(Spaced Repetition)",
    desc: "Hệ thống Flashcard AI tự tính toán “đường cong quên lãng” của Ebbinghaus, chủ động nhắc bạn ôn lại câu khó đúng vào thời điểm vàng trước khi bị quên.",
    chip: "Ôn đúng lúc, nhớ lâu",
    image: "/method-card3-gfx.png",
    icon: Clock3,
    imageOffset: "translate-y-[8px]",
  },
];

export default function LearningMethodSection() {
  const { ref: cardsRevealRef, isRevealed: cardsRevealed } =
    useScrollReveal<HTMLDivElement>(0.08, "0px 0px -18% 0px");

  return (
    <section className="relative overflow-hidden bg-[#fbfffd] py-16 sm:py-20 lg:py-24 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_54%,rgba(16,185,129,0.13),transparent_23%),radial-gradient(circle_at_84%_18%,rgba(209,250,229,0.92),transparent_31%),linear-gradient(180deg,#ffffff_0%,#f5fff9_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-emerald-50/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-wide text-emerald-800 shadow-[0_6px_18px_rgba(16,185,129,0.08)]">
              <Leaf className="h-4 w-4 fill-emerald-500 text-emerald-600" />
              Phương pháp học tập
            </div>

            <h2 className="mt-7 max-w-5xl text-[34px] font-black leading-[1.04] tracking-tight text-[#111b35] sm:text-5xl lg:text-[56px] xl:text-[62px]">
              <span className="block sm:whitespace-nowrap">Bứt Phá Bằng</span>
              <span className="relative mt-1 inline-block text-emerald-600 sm:whitespace-nowrap">
                Phương Pháp Khoa Học
                <svg
                  className="absolute -bottom-2 left-0 h-3.5 w-full text-emerald-500"
                  viewBox="0 0 760 28"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 18C170 5 515 5 755 17"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="mt-9 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              Không chỉ học nhiều, mà học đúng cách! EduMi áp dụng 3 phương pháp học tập khoa học giúp bạn ghi nhớ lâu hơn, hiểu sâu hơn và tiến bộ vượt bậc.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="relative mx-auto h-[270px] max-w-[440px] lg:ml-auto lg:h-[310px]">
              <div className="absolute inset-x-4 top-8 h-56 rounded-[46%_54%_48%_52%] bg-gradient-to-br from-emerald-50 via-emerald-100/80 to-white shadow-[inset_0_-18px_45px_rgba(16,185,129,0.11),0_28px_60px_rgba(6,78,59,0.10)]" />
              <div className="absolute bottom-8 left-1/2 h-12 w-72 -translate-x-1/2 rounded-full bg-emerald-900/10 blur-2xl" />
              <Image
                src="/method-capybara-transparent.png"
                alt="Capy học đúng cách cùng EduMi"
                width={768}
                height={512}
                priority
                className="relative z-10 mx-auto h-full w-full object-contain drop-shadow-[0_32px_38px_rgba(6,78,59,0.20)]"
              />
            </div>
          </div>
        </div>

        <div className="relative mt-20 lg:mt-24">

          <div ref={cardsRevealRef} className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {methods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.number}
                  className={`transition-all duration-700 ease-out will-change-transform ${
                    cardsRevealed ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: cardsRevealed ? `${index * 180}ms` : "0ms" }}
                >
                  <article
                    className="group relative min-h-[430px] rounded-[34px] border border-emerald-200/90 bg-white/72 p-7 shadow-[0_24px_70px_rgba(15,118,78,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,118,78,0.13)] sm:p-8"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[34px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_94%,rgba(167,243,208,0.56),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(236,253,245,0.54))]" />
                    <div className="absolute -left-6 top-2 h-28 w-28 rounded-full bg-emerald-100/80 blur-sm" />
                    <div className="absolute -left-3 top-8 h-20 w-10 -rotate-12 rounded-full bg-emerald-200/75" />
                    <div className="absolute bottom-0 right-0 h-32 w-48 rounded-tl-full bg-emerald-100/58" />
                  </div>

                  <div className="absolute -top-11 left-10 z-30 flex h-[112px] w-[112px] items-center justify-center rounded-full bg-white/90 shadow-[0_22px_35px_rgba(5,150,105,0.18)]">
                    <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-4xl font-black text-white shadow-[0_18px_34px_rgba(5,150,105,0.32)]">
                      {method.number}
                    </div>
                  </div>

                  <div className="relative z-10 flex min-h-[374px] flex-col pt-1">
                    <div className="flex justify-end">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-black text-emerald-800 shadow-[0_8px_18px_rgba(6,78,59,0.08)]">
                        {method.tag}
                      </span>
                    </div>

                    <div className="pt-16">
                      <h3 className="text-[28px] font-black leading-tight tracking-tight text-[#102047] sm:text-[30px]">
                        {method.title}
                      </h3>
                      <p className="mt-1 text-lg font-black text-slate-500">
                        {method.subtitle}
                      </p>
                      <p className="mt-6 max-w-sm text-sm font-semibold leading-7 text-slate-600">
                        {method.desc}
                      </p>
                    </div>

                    <div className="mt-auto grid grid-cols-[minmax(0,1fr)_150px] items-end gap-3 pt-8">
                      <span className="inline-flex h-11 w-full max-w-[190px] items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 text-xs font-black text-emerald-800 shadow-[0_10px_20px_rgba(6,78,59,0.08)]">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="whitespace-nowrap">{method.chip}</span>
                      </span>

                      <div className="relative -mb-4 -mr-4 flex h-[112px] w-[150px] items-end justify-center">
                        <div className="absolute bottom-2 left-1/2 h-20 w-36 -translate-x-1/2 rounded-full bg-emerald-200/45 blur-xl" />
                        <Image
                          src={method.image}
                          alt={method.title}
                          width={190}
                          height={125}
                          className={`relative z-10 h-[92px] w-[136px] object-contain drop-shadow-[0_16px_22px_rgba(6,78,59,0.16)] transition-transform duration-300 group-hover:scale-105 ${method.imageOffset}`}
                        />
                      </div>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="absolute left-4 top-9 z-10 hidden h-16 w-8 -rotate-12 rounded-full bg-emerald-200/75 lg:block" />
                  )}
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.42em] text-emerald-700 sm:text-xs">
          <Leaf className="h-4 w-4 fill-emerald-500 text-emerald-600" />
          <span>Học thông minh • Tiến bộ mỗi ngày</span>
          <Leaf className="h-4 w-4 fill-emerald-500 text-emerald-600" />
        </div>
      </div>
    </section>
  );
}