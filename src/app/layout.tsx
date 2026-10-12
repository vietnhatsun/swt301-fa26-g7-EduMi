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
    default: "EduMi — Nền tảng học tập AI",
    template: "%s | EduMi",
  },
  description:
    "Nền tảng giáo dục trực tuyến ứng dụng AI — Tài liệu học tập, luyện đề, lớp học ảo và khóa học e-learning cho học sinh Việt Nam.",
  keywords: ["học trực tuyến", "AI giáo dục", "luyện đề", "flashcard", "khóa học online", "EduMi"],
  authors: [{ name: "EduMi Team" }],
  icons: {
    icon: [
      { url: "/favicon.jpg", type: "image/jpeg" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://edumi.vn",
    title: "EduMi — Nền tảng học tập AI",
    description: "Học thông minh hơn với AI. Tài liệu, luyện đề, lớp học ảo.",
    siteName: "EduMi",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`${inter.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
