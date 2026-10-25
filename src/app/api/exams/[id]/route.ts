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

    // Tìm theo id (nếu là UUID) hoặc exam_code (VD: EDM-8899)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let examQuery = supabase.from("exams").select("*").eq("status", "published");
    if (isUuid) {
      examQuery = examQuery.or(`id.eq.${id},exam_code.eq.${id.toUpperCase()}`);
    } else {
      examQuery = examQuery.eq("exam_code", id.toUpperCase());
    }
    const { data: exam, error } = await examQuery.maybeSingle();

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
          part: q.part || "Phần I",
          section: q.section || (q.type === "essay" ? "Tự luận" : "Trắc nghiệm"),
          instruction: q.instruction || "",
          content: q.content || "",
          options: q.options || [],
          trueFalseItems: q.true_false_items || [],
          correctAnswer: q.correct_answer || "A",
          sampleEssayAnswer: q.sample_essay_answer || "",
          rubricCriteria: q.rubric_criteria || [],
          wordLimit: q.word_limit || {},
          explanation: q.explanation || "",
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
