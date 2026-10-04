import type { Metadata } from "next";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import SubjectShowcaseSection from "@/components/landing/SubjectShowcaseSection";
import HomeFeatureSection from "@/components/landing/HomeFeatureSection";
import LearningMethodSection from "@/components/landing/LearningMethodSection";
import ConsultationFormSection from "@/components/landing/ConsultationFormSection";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "EduMi - Học thông minh cùng Capy & Bứt phá điểm số THPT",
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
      <LandingNavbar />

      <main>
        <HeroSection />
        <SubjectShowcaseSection />
        <HomeFeatureSection />
        <LearningMethodSection />
        <ConsultationFormSection />
      </main>

      <LandingFooter />
    </div>
  );
}