import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MOCK_EXAMS } from "@/components/exam/exam-data";
import ExamRoomClient from "@/components/exam/ExamRoomClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = MOCK_EXAMS.find((e) => e.id === id);
  return {
    title: exam ? `${exam.cardCode}: ${exam.title} | Phòng Thi EduMi` : "Phòng Thi Trực Tuyến | EduMi",
    description: "Hệ thống phòng thi trực tuyến bấm giờ áp lực thật, tự động ghi nhận vi phạm cùng EduMi.",
  };
}

export default async function ExamRoomPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const mode = resolvedSearchParams.mode === "practice" ? "practice" : "exam";

  const exam = MOCK_EXAMS.find((e) => e.id === id);

  if (!exam) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f0f4f8] p-6 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200 max-w-md">
          <h2 className="text-xl font-black text-slate-900">Không tìm thấy phòng thi</h2>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Mã bài thi hoặc phòng thi không tồn tại trong hệ thống.
          </p>
          <Link
            href="/exam"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại sảnh phòng thi</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8] font-bold text-emerald-800">
          Đang kết nối phòng thi EduMi...
        </div>
      }
    >
      <ExamRoomClient exam={exam} mode={mode} />
    </Suspense>
  );
}
