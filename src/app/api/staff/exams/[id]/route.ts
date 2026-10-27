import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { formatExamResponse, DbExam } from "../route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const staff = await getAuthenticatedUser(req);
    if (!staff) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const supabase = createServiceClient();
    const { data: exam, error: examError } = await supabase
      .from("exams")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (examError || !exam) {
      return NextResponse.json({ error: "Không tìm thấy bài thi." }, { status: 404 });
    }

    const { data: questions } = await supabase
      .from("exam_questions")
      .select("*")
      .eq("exam_id", id)
      .order("question_number", { ascending: true });

    return NextResponse.json({
      success: true,
      exam: formatExamResponse(exam as DbExam),
      questions: (questions || []).map((q) => ({
        id: q.id,
        questionNumber: q.question_number,
        type: q.type,
        part: q.part || (q.type === "true_false" ? "Phần II" : q.type === "short_answer" ? "Phần III" : q.type === "essay" ? "Phần IV" : "Phần I"),
        section: q.section || (q.type === "essay" ? "Tự luận" : "Trắc nghiệm"),
        instruction: q.instruction,
        content: q.content,
        options: q.options || [],
        trueFalseItems: q.true_false_items || [],
        correctAnswer: q.correct_answer || "",
        explanation: q.explanation || "",
        sampleEssayAnswer: q.sample_essay_answer || "",
        rubricCriteria: q.rubric_criteria || [],
        wordLimit: q.word_limit || undefined,
        points: Number(q.points),
      })),
    });
  } catch (error) {
    console.error("[Staff Exam ID GET Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải chi tiết bài thi." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const staff = await getAuthenticatedUser(req);
    if (!staff || (staff.role !== "staff" && staff.role !== "admin")) {
      return NextResponse.json({ error: "Bạn không có quyền cập nhật bài thi." }, { status: 403 });
    }

    const body = await req.json();
    const { action, status, ...updateFields } = body;
    const supabase = createServiceClient();

    // 1. Thao tác đổi trạng thái nhanh (toggle status / action)
    if (action === "toggle_status") {
      const nextStatus = status === "published" ? "published" : status === "draft" ? "draft" : "hidden";
      const { data: updated, error } = await supabase
        .from("exams")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error || !updated) {
        return NextResponse.json({ error: "Không thể đổi trạng thái bài thi." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Đã cập nhật trạng thái bài thi thành: ${nextStatus}`,
        exam: formatExamResponse(updated as DbExam),
      });
    }

    // 2. Cập nhật chi tiết
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updateFields.title) updatePayload.title = updateFields.title.trim();
    if (updateFields.cardCode) updatePayload.card_code = updateFields.cardCode.trim();
    if (updateFields.category) updatePayload.category = updateFields.category.trim();
    if (updateFields.subject) updatePayload.subject = updateFields.subject.trim();
    if (updateFields.difficulty) updatePayload.difficulty = updateFields.difficulty;
    if (updateFields.durationMinutes) updatePayload.duration_minutes = Number(updateFields.durationMinutes);
    if (updateFields.description !== undefined) updatePayload.description = updateFields.description;
    if (updateFields.author) updatePayload.author = updateFields.author;
    if (updateFields.bgClass) updatePayload.bg_class = updateFields.bgClass;
    if (updateFields.accentClass) updatePayload.accent_class = updateFields.accentClass;
    if (updateFields.pattern) updatePayload.pattern = updateFields.pattern;
    if (updateFields.isHot !== undefined) updatePayload.is_hot = Boolean(updateFields.isHot);
    if (updateFields.isNew !== undefined) updatePayload.is_new = Boolean(updateFields.isNew);
    if (status) updatePayload.status = status;

    const { data: updatedExam, error: updateError } = await supabase
      .from("exams")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updatedExam) {
      console.error("[Staff Exam Update Error]:", updateError);
      return NextResponse.json({ error: "Không thể cập nhật bài thi." }, { status: 500 });
    }

    // Cập nhật câu hỏi nếu được gửi lên
    if (Array.isArray(updateFields.questions)) {
      await supabase.from("exam_questions").delete().eq("exam_id", id);
      const questionRows = updateFields.questions.map((q: any, idx: number) => {
        const qType = q.type || "single_choice";
        let defaultPart = "Phần I";
        let defaultSection = "Trắc nghiệm";
        let defaultInstruction = "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)";
        let defaultPoints = 0.25;

        if (qType === "true_false") {
          defaultPart = "Phần II";
          defaultSection = "Trắc nghiệm Đúng/Sai";
          defaultInstruction = "Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai";
          defaultPoints = 1.0;
        } else if (qType === "short_answer") {
          defaultPart = "Phần III";
          defaultSection = "Trả lời ngắn";
          defaultInstruction = "Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)";
          defaultPoints = 0.5;
        } else if (qType === "essay") {
          defaultPart = "Phần IV";
          defaultSection = "Tự luận";
          defaultInstruction = "Phần IV: Tự luận - Trình bày các bước giải chi tiết";
          defaultPoints = 1.5;
        }

        return {
          exam_id: id,
          question_number: q.questionNumber || idx + 1,
          type: qType,
          part: q.part || defaultPart,
          section: q.section || defaultSection,
          instruction: q.instruction || defaultInstruction,
          content: q.content || `Câu hỏi số ${idx + 1}`,
          options: Array.isArray(q.options) ? q.options : [],
          true_false_items: Array.isArray(q.trueFalseItems) ? q.trueFalseItems : [],
          correct_answer: typeof q.correctAnswer === "string" ? q.correctAnswer : (q.correctAnswer || "A"),
          explanation: q.explanation || "",
          sample_essay_answer: q.sampleEssayAnswer || null,
          rubric_criteria: Array.isArray(q.rubricCriteria) ? q.rubricCriteria : [],
          word_limit: q.wordLimit || {},
          points: Number(q.points) > 0 ? Number(q.points) : defaultPoints,
        };
      });

      if (questionRows.length > 0) {
        await supabase.from("exam_questions").insert(questionRows);
      }
      await supabase.from("exams").update({ question_count: questionRows.length }).eq("id", id);
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật bài thi thành công!",
      exam: formatExamResponse(updatedExam as DbExam),
    });
  } catch (error) {
    console.error("[Staff Exam PUT Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi cập nhật bài thi." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const staff = await getAuthenticatedUser(req);
    if (!staff || (staff.role !== "staff" && staff.role !== "admin")) {
      return NextResponse.json({ error: "Bạn không có quyền xóa bài thi." }, { status: 403 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("exams").delete().eq("id", id);

    if (error) {
      console.error("[Staff Exam DELETE Error]:", error);
      return NextResponse.json({ error: "Không thể xóa bài thi." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa bài thi thành công.",
    });
  } catch (error) {
    console.error("[Staff Exam DELETE Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xóa bài thi." }, { status: 500 });
  }
}
