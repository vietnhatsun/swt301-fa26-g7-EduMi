import { Suspense } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import MaterialsLobbyClient from "@/components/materials/MaterialsLobbyClient";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Kho Tài Liệu Học Tập & Chuyên Đề Ôn Thi | EduMi",
  description:
    "Tổng hợp kho tài liệu, đề thi thử, cẩm nang công thức và sơ đồ tư duy môn học chọn lọc. Xem trực tuyến và tải về miễn phí cùng EduMi.",
};

export default function MaterialsPage() {
  return (
    <main className={`${beVietnam.className} min-h-screen overflow-hidden bg-[#7f9b5d] text-[#10213a]`}>
      <LandingNavbar />
      <Suspense
        fallback={
          <div className="min-h-screen pt-36 text-center text-white font-bold text-lg">
            Đang tải kho tài liệu EduMi...
          </div>
        }
      >
        <MaterialsLobbyClient />
      </Suspense>
    </main>
  );
}
