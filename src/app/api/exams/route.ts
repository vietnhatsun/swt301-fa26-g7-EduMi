import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { MOCK_EXAMS } from "@/components/exam/exam-data";
import { formatExamResponse, DbExam } from "@/app/api/staff/exams/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim().toLowerCase();

    const supabase = createServiceClient();
    let query = supabase
      .from("exams")
      .select("*")
      .eq("status", "published")
      .eq("scope", "public")
      .order("created_at", { ascending: false });

    if (subject && subject !== "Tất cả") {
      query = query.eq("subject", subject);
    }
    if (category && category !== "Tất cả") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    const noCacheHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    };

function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/y/g, "i")
    .trim();
}

function matchSearch(sourceText: string, query: string): boolean {
  if (!query) return true;
  if (!sourceText) return false;
  const normSource = normalizeSearchText(sourceText);
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return true;
  if (normQuery.length <= 2) {
    const words = normSource.split(/[^a-z0-9]+/);
    return words.some((w) => w === normQuery);
  }
  return normSource.includes(normQuery);
}

    // Nếu có lỗi hoặc bảng chưa có trên DB, fallback về MOCK_EXAMS
    if (error || !data || data.length === 0) {
      let filtered = [...MOCK_EXAMS];
      if (subject && subject !== "Tất cả") {
        filtered = filtered.filter((e) => e.subject === subject);
      }
      if (category && category !== "Tất cả") {
        filtered = filtered.filter((e) => e.category === category);
      }
      if (search) {
        filtered = filtered.filter(
          (e) =>
            matchSearch(e.title, search) ||
            matchSearch(e.cardCode, search) ||
            matchSearch(e.subject, search) ||
            e.examCode.toLowerCase().includes(search)
        );
      }
      return NextResponse.json(
        {
          success: true,
          source: "mock",
          exams: filtered,
        },
        { headers: noCacheHeaders }
      );
    }

    let exams = (data as DbExam[]).map(formatExamResponse);
    if (search) {
      exams = exams.filter(
        (e) =>
          matchSearch(e.title, search) ||
          matchSearch(e.cardCode, search) ||
          matchSearch(e.subject, search) ||
          e.examCode.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: "supabase",
        exams,
      },
      { headers: noCacheHeaders }
    );
  } catch (error) {
    console.error("[Public Exams API Exception]:", error);
    return NextResponse.json({ success: true, source: "mock", exams: MOCK_EXAMS });
  }
}
