import { Suspense } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import ExamLobbyClient from "@/components/exam/ExamLobbyClient";
import { Be_Vietnam_Pro } from "next/font/google";
import { createServiceClient } from "@/lib/supabase";
import { MOCK_EXAMS, ExamItem } from "@/components/exam/exam-data";
import { formatExamResponse, DbExam } from "@/app/api/staff/exams/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

async function getInitialExams(): Promise<ExamItem[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("status", "published")
      .eq("scope", "public")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_EXAMS;
    }

    return (data as DbExam[]).map(formatExamResponse) as unknown as ExamItem[];
  } catch (err) {
    console.error("[ExamPage getInitialExams Error]:", err);
    return MOCK_EXAMS;
  }
}

export default async function ExamPage() {
  const initialExams = await getInitialExams();

  return (
    <main className={`${beVietnam.className} min-h-screen overflow-hidden bg-[#7f9b5d] text-[#10213a]`}>
      <LandingNavbar />
      <Suspense fallback={<div className="min-h-screen pt-36 text-center text-white font-bold text-lg">Đang kết nối phòng thi EduMi...</div>}>
        <ExamLobbyClient initialExams={initialExams} />
      </Suspense>
    </main>
  );
}

