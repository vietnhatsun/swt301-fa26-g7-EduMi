import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import AboutHeroBrand from "@/components/about/AboutHeroBrand";
import AboutBrandStory from "@/components/about/AboutBrandStory";
import AboutCoreValues from "@/components/about/AboutCoreValues";
import AboutStudentReviews from "@/components/about/AboutStudentReviews";
import AboutFAQConsultation from "@/components/about/AboutFAQConsultation";
import AboutScrollReveal from "@/components/about/AboutScrollReveal";

export const metadata: Metadata = {
  title: "Giới thiệu EduMi — Nền tảng học tập cá nhân hóa & thông minh",
  description:
    "EduMi là nền tảng học tập cá nhân hóa và thông minh cho thế hệ mới, kết hợp tài liệu chuẩn hóa ma trận, lớp học ảo và trợ lý gia sư Capy AI 24/7.",
  keywords: [
    "EduMi",
    "Giới thiệu EduMi",
    "Team Hợp Lưu",
    "Học tập thông minh",
    "Luyện thi cá nhân hóa",
    "Gia sư Capy AI",
  ],
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950 flex flex-col overflow-x-hidden">
      
      {/* ── Signature EduMi Green Grid Background (Direct match to reference) ── */}
      <div
        className="fixed inset-0 pointer-events-none -z-20"
        style={{
          backgroundColor: "#678847",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Decorative Corner Foliage Accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/stickers/classes-corner-3d.png"
          alt=""
          aria-hidden="true"
          width={210}
          height={222}
          className="absolute -bottom-6 -left-6 h-auto w-[160px] -rotate-6 opacity-60 drop-shadow-[0_18px_24px_rgba(29,55,30,0.22)] hidden sm:block"
        />
        <Image
          src="/stickers/classes-corner-3d.png"
          alt=""
          aria-hidden="true"
          width={210}
          height={222}
          className="absolute -bottom-6 -right-6 h-auto w-[168px] rotate-6 scale-x-[-1] opacity-60 drop-shadow-[0_18px_24px_rgba(29,55,30,0.22)] hidden sm:block"
        />
      </div>

      {/* ── Fixed Top-Left 'Về trang chủ' Button ── */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-7 md:left-8 z-50">
        <Link
          href="/"
          aria-label="Quay về trang chủ EduMi"
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#183921]/95 hover:bg-[#102716] text-white text-xs sm:text-sm font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/40 backdrop-blur-md group cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      {/* ── Main Content: 5 Curated Core Sections with Smooth Fade-in on Scroll ── */}
      <main className="flex-grow relative z-10 space-y-4">
        {/* Phần 01: Hero Section (Lời chào & Khái quát định vị) */}
        <AboutScrollReveal duration={850} yOffset={36}>
          <AboutHeroBrand />
        </AboutScrollReveal>

        {/* Phần 02: Ý nghĩa tên gọi & Khởi nguồn sứ mệnh (Our Story) */}
        <AboutScrollReveal duration={850} yOffset={48}>
          <AboutBrandStory />
        </AboutScrollReveal>

        {/* Phần 03: Giá trị cốt lõi & Tính năng đột phá (Core Values & 4 Pillars) */}
        <AboutScrollReveal duration={850} yOffset={48}>
          <AboutCoreValues />
        </AboutScrollReveal>

        {/* Phần 04: Đánh giá thực tế từ học sinh (Google Reviews & Student Testimonials) */}
        <AboutScrollReveal duration={850} yOffset={48}>
          <AboutStudentReviews />
        </AboutScrollReveal>

        {/* Phần 05: Tư vấn trực tiếp, FAQ & Con Capy nháy mắt tương tác */}
        <AboutScrollReveal duration={850} yOffset={48}>
          <AboutFAQConsultation />
        </AboutScrollReveal>
      </main>

    </div>
  );
}
