import type { Metadata } from "next";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AiTutorSection from "@/components/landing/AiTutorSection";
import SubjectsSection from "@/components/landing/SubjectsSection";
import LearningMethodSection from "@/components/landing/LearningMethodSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import CtaBanner from "@/components/landing/CtaBanner";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "EduMi — Học thông minh cùng Capy & Bứt phá điểm số THPT",
  description:
    "Nền tảng giáo dục trực tuyến ứng dụng AI dành cho học sinh Việt Nam. 500+ bộ đề thi chuẩn ma trận mới, phòng thi thử có bấm giờ, thẻ ghi nhớ Flashcard AI và gia sư Capy giải đáp 24/7.",
  keywords: [
    "luyện thi THPT",
    "đề thi thử 2026",
    "đánh giá năng lực",
    "Capy AI",
    "EduMi",
    "flashcard spaced repetition",
    "phòng thi ảo",
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      {/* ── Top Fixed Navigation ── */}
      <LandingNavbar />

      {/* ── Main Content Sections ── */}
      <main>
        {/* 1. Hero Section (Uses ChatGPT Capy study room background image) */}
        <HeroSection />

        {/* 2. Core Features Showcase */}
        <FeaturesSection />

        {/* 4. Interactive Capy AI Tutor Section */}
        <AiTutorSection />

        {/* 5. Subjects & Exam Categories */}
        <SubjectsSection />

        {/* 6. Scientific 3-Step Study Method */}
        <LearningMethodSection />

        {/* 7. Student Testimonials & Hall of Fame */}
        <TestimonialsSection />

        {/* 8. Pricing & Subscription Plans */}
        <PricingSection />

        {/* 9. Frequently Asked Questions */}
        <FaqSection />

        {/* 10. Large Action Banner */}
        <CtaBanner />
      </main>

      {/* ── Footer ── */}
      <LandingFooter />
    </div>
  );
}
