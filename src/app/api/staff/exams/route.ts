import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { MOCK_EXAMS } from "@/components/exam/exam-data";

export interface DbExam {
  id: string;
  exam_code: string;
  card_code: string;
  title: string;
  description: string | null;
  category: string;
  subject: string;
  difficulty: string;
  duration_minutes: number;
  question_count: number;
  attempts: number;
  rating: number;
  bg_class: string;
  accent_class: string;
  pattern: string;
  is_hot: boolean;
  is_new: boolean;
  author: string;
  scope: "public" | "class";
  class_id: string | null;
  created_by: string | null;
  status: "published" | "draft" | "hidden";
  created_at: string;
  updated_at: string;
}

export function formatExamResponse(exam: DbExam) {
  return {
    id: exam.id,
    examCode: exam.exam_code,
    cardCode: exam.card_code,
    title: exam.title,
    description: exam.description || "",
    category: exam.category,
    subject: exam.subject,
    difficulty: exam.difficulty,
    durationMinutes: Number(exam.duration_minutes || 60),
    questionCount: Number(exam.question_count || 0),
    attempts: Number(exam.attempts || 0),
    rating: Number(exam.rating || 5.0),
    bgClass: exam.bg_class || "bg-[#0284c7]",
    accentClass: exam.accent_class || "text-[#0284c7]",
    pattern: exam.pattern || "waves",
    isHot: Boolean(exam.is_hot),
    isNew: Boolean(exam.is_new),
    author: exam.author || "Hội đồng Khảo thí EduMi",
    scope: exam.scope,
    classId: exam.class_id,
    createdBy: exam.created_by,
    status: exam.status,
    createdAt: exam.created_at,
    updatedAt: exam.updated_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền quản lý bài thi." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const subject = searchParams.get("subject");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim().toLowerCase();
    const scope = searchParams.get("scope") || "public";

    const supabase = createServiceClient();
    let query = supabase.from("exams").select("*").order("created_at", { ascending: false });

    if (scope && scope !== "all") {
      query = query.eq("scope", scope);
    }
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (subject && subject !== "Tất cả") {
      query = query.eq("subject", subject);
    }
    if (category && category !== "Tất cả") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    let rawExams: DbExam[] = [];
    let isMockFallback = false;

    if (error || !data || data.length === 0) {
      isMockFallback = true;
      rawExams = MOCK_EXAMS.map((m) => ({
        id: m.id,
        exam_code: m.examCode,
        card_code: m.cardCode,
        title: m.title,
        description: m.description,
        category: m.category,
        subject: m.subject,
        difficulty: m.difficulty,
        duration_minutes: m.durationMinutes,
        question_count: m.questionCount,
        attempts: m.attempts,
        rating: m.rating,
        bg_class: m.bgClass,
        accent_class: m.accentClass,
        pattern: m.pattern,
        is_hot: Boolean(m.isHot),
        is_new: Boolean(m.isNew),
        author: m.author,
        scope: "public" as const,
        class_id: null,
        created_by: null,
        status: "published" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      if (subject && subject !== "Tất cả") {
        rawExams = rawExams.filter((e) => e.subject === subject);
      }
      if (category && category !== "Tất cả") {
        rawExams = rawExams.filter((e) => e.category === category);
      }
      if (status && status !== "all") {
        rawExams = rawExams.filter((e) => e.status === status);
      }
    } else {
      rawExams = data as DbExam[];
    }
    if (search) {
      rawExams = rawExams.filter(
        (e) =>
          e.title.toLowerCase().includes(search) ||
          e.exam_code.toLowerCase().includes(search) ||
          e.card_code.toLowerCase().includes(search) ||
          e.author.toLowerCase().includes(search)
      );
    }

    const formatted = rawExams.map(formatExamResponse);
    const totalAttempts = formatted.reduce((acc, curr) => acc + curr.attempts, 0);

    return NextResponse.json({
      success: true,
      isMockFallback,
      exams: formatted,
      counts: {
        total: formatted.length,
        published: formatted.filter((item) => item.status === "published").length,
        draft: formatted.filter((item) => item.status === "draft").length,
        totalAttempts,
      },
    });
  } catch (error) {
    console.error("[Staff Exams GET Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải bài thi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Chỉ nhân viên EduMi mới có quyền đăng bài thi công khai." }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      examCode,
      cardCode,
      category,
      subject,
      difficulty,
      durationMinutes,
      description,
      author,
      bgClass,
      accentClass,
      pattern,
      isHot,
      isNew,
      status,
      scope = "public",
      questions = [],
    } = body;

    // Validate bắt buộc
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập tiêu đề bài thi." }, { status: 400 });
    }
    if (!subject || typeof subject !== "string") {
      return NextResponse.json({ error: "Vui lòng chọn môn học." }, { status: 400 });
    }
    if (!category || typeof category !== "string") {
      return NextResponse.json({ error: "Vui lòng chọn danh mục kỳ thi." }, { status: 400 });
    }

    // Tự sinh mã phòng thi nếu chưa có (VD: EDM-4821)
    let finalExamCode = (examCode || "").trim().toUpperCase();
    if (!finalExamCode) {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      finalExamCode = `EDM-${randomCode}`;
    }

    const finalCardCode = (cardCode || "").trim() || subject.toUpperCase();
    const finalDuration = Math.max(5, Math.min(240, Number(durationMinutes) || 60));
    const finalAuthor = (author || "").trim() || staff.full_name || "Hội đồng Khảo thí EduMi";
    const finalStatus = status === "draft" ? "draft" : "published";

    const supabase = createServiceClient();

    // 1. Kiểm tra trùng mã đề thi
    const { data: existingCode } = await supabase
      .from("exams")
      .select("id")
      .eq("exam_code", finalExamCode)
      .maybeSingle();

    if (existingCode) {
      // Đổi sang mã mới nếu trùng
      finalExamCode = `EDM-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // 2. Chèn vào bảng exams
    const { data: insertedExam, error: examError } = await supabase
      .from("exams")
      .insert([
        {
          exam_code: finalExamCode,
          card_code: finalCardCode,
          title: title.trim(),
          description: (description || "").trim(),
          category: category.trim(),
          subject: subject.trim(),
          difficulty: difficulty || "Vận dụng (7-8.5đ)",
          duration_minutes: finalDuration,
          question_count: Array.isArray(questions) ? questions.length : 0,
          bg_class: bgClass || "bg-[#0284c7]",
          accent_class: accentClass || "text-[#0284c7]",
          pattern: pattern || "waves",
          is_hot: Boolean(isHot),
          is_new: Boolean(isNew),
          author: finalAuthor,
          scope: scope === "class" ? "class" : "public",
          created_by: staff.id,
          status: finalStatus,
          attempts: 0,
          rating: 5.0,
        },
      ])
      .select()
      .single();

    if (examError || !insertedExam) {
      console.error("[Staff Exams Insert Error]:", examError);
      return NextResponse.json(
        { error: examError?.message || "Không thể tạo bài thi vào cơ sở dữ liệu." },
        { status: 500 }
      );
    }

    // 3. Chèn các câu hỏi đề thi (hỗ trợ 4 định dạng chuẩn Bộ GD&ĐT 2025/2026)
    if (Array.isArray(questions) && questions.length > 0) {
      const questionRows = questions.map((q: any, idx: number) => {
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
          exam_id: insertedExam.id,
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

      const { error: questionsError } = await supabase.from("exam_questions").insert(questionRows);
      if (questionsError) {
        console.warn("[Staff Exams Questions Insert Warning]:", questionsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Đăng bài thi thành công!",
      exam: formatExamResponse(insertedExam),
    });
  } catch (error) {
    console.error("[Staff Exams POST Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo bài thi." }, { status: 500 });
  }
}
