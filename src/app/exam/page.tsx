import { Suspense } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import ExamLobbyClient from "@/components/exam/ExamLobbyClient";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Phòng Thi Thử Trực Tuyến & Luyện Đề | EduMi",
  description:
    "Hệ thống đề thi thử bám sát ma trận mới Bộ GD&ĐT và ĐGNL 2026. Bấm giờ áp lực phòng thi thật, tự động chấm điểm và xem lời giải chi tiết cùng EduMi.",
};

export default function ExamPage() {
  return (
    <main className={`${beVietnam.className} min-h-screen overflow-hidden bg-[#7f9b5d] text-[#10213a]`}>
      <LandingNavbar />
      <Suspense fallback={<div className="min-h-screen pt-36 text-center text-white font-bold text-lg">Đang kết nối phòng thi EduMi...</div>}>
        <ExamLobbyClient />
      </Suspense>
    </main>
  );
}
