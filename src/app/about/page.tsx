import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AboutHero from "@/components/about/AboutHero";
import AboutBenefits from "@/components/about/AboutBenefits";
import AboutFeatures from "@/components/about/AboutFeatures";
import AboutEcosystem from "@/components/about/AboutEcosystem";
import AboutSteps from "@/components/about/AboutSteps";
import AboutBottomMarquee from "@/components/about/AboutBottomMarquee";
import AboutFAQConsultation from "@/components/about/AboutFAQConsultation";

export const metadata: Metadata = {
  title: "Khám phá EduMi — Học tập thông minh, kiến tạo tương lai cùng Capy",
  description:
    "EduMi là nền tảng học tập trực tuyến được thiết kế dành riêng cho học sinh, giúp bạn học hiệu quả hơn, cá nhân hóa lộ trình và đồng hành cùng gia sư AI 24/7.",
  keywords: [
    "Khám phá EduMi",
    "Giới thiệu EduMi",
    "Học trực tuyến",
    "Lớp học thông minh",
    "Capybara EduMi",
    "Hệ sinh thái EduMi",
  ],
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 flex flex-col overflow-x-hidden">
      {/* ── Chill Cozy Study Background (GPU Optimized) ── */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      >
        <Image
          src="/about-chill-bg.jpg"
          alt="Cozy chill study room background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle depth gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
      </div>

      {/* ── Always Fixed Top-Left 'Về trang chủ' Button ── */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-7 md:left-8 z-50">
        <Link
          href="/"
          aria-label="Quay về trang chủ EduMi"
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#084e36]/95 hover:bg-[#063f2c] text-white text-xs sm:text-sm font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/40 backdrop-blur-md group cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      {/* ── Main Content Sections ── */}
      <main className="flex-grow relative z-10">
        {/* 1. Hero Section */}
        <AboutHero />

        {/* 2. Quyền lợi học viên (Giá trị thật sự) */}
        <AboutBenefits />

        {/* 3. 4 Core Features Cards */}
        <AboutFeatures />

        {/* 4. Hệ sinh thái học tập (Sổ AI, Dashboard, Flashcards, Hệ sinh thái) */}
        <AboutEcosystem />

        {/* 5. 4-Step Learning Guide */}
        <AboutSteps />

        {/* 6. Full-Width Moss Green Marquee */}
        <AboutBottomMarquee />

        {/* 7. FAQ & Direct Consultation / Registration (Replaces old dark footer) */}
        <AboutFAQConsultation />
      </main>
    </div>
  );
}
