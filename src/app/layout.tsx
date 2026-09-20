import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HIPZI — Nền tảng học tập AI",
    template: "%s | HIPZI",
  },
  description:
    "Nền tảng giáo dục trực tuyến ứng dụng AI — Tài liệu học tập, luyện đề, lớp học ảo và khóa học e-learning cho học sinh Việt Nam.",
  keywords: ["học trực tuyến", "AI giáo dục", "luyện đề", "flashcard", "khóa học online", "HIPZI"],
  authors: [{ name: "HIPZI Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://hipzi.vn",
    title: "HIPZI — Nền tảng học tập AI",
    description: "Học thông minh hơn với AI. Tài liệu, luyện đề, lớp học ảo.",
    siteName: "HIPZI",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
