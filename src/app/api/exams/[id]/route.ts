import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { MOCK_EXAMS, MOCK_QUESTIONS_DATABASE } from "@/components/exam/exam-data";
import { formatExamResponse, DbExam } from "@/app/api/staff/exams/route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    // Tìm theo id hoặc exam_code (VD: EDM-8899)
    const { data: exam, error } = await supabase
      .from("exams")
      .select("*")
      .or(`id.eq.${id},exam_code.eq.${id.toUpperCase()}`)
      .eq("status", "published")
      .maybeSingle();

    if (exam) {
      const { data: questions } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("exam_id", exam.id)
        .order("question_number", { ascending: true });

      return NextResponse.json({
        success: true,
        source: "supabase",
        exam: formatExamResponse(exam as DbExam),
        questions: (questions || []).map((q) => ({
          id: q.id,
          questionNumber: q.question_number,
          type: q.type,
          instruction: q.instruction,
          content: q.content,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          points: Number(q.points),
        })),
      });
    }

    // Fallback: Tìm trong MOCK_EXAMS
    const mockExam = MOCK_EXAMS.find(
      (e) => e.id === id || e.examCode.toLowerCase() === id.toLowerCase()
    );

    if (mockExam) {
      const mockQuestions = MOCK_QUESTIONS_DATABASE[mockExam.id] || [];
      return NextResponse.json({
        success: true,
        source: "mock",
        exam: mockExam,
        questions: mockQuestions,
      });
    }

    return NextResponse.json({ error: "Không tìm thấy bài thi." }, { status: 404 });
  } catch (error) {
    console.error("[Public Exam Single Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải bài thi." }, { status: 500 });
  }
}
