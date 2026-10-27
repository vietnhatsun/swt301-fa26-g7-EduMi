import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type MaterialPatternType = "waves" | "clouds" | "confetti" | "stripes" | "ripples" | "chevrons";

export interface PublicMaterialItem {
  id: string;
  subject: string;
  title: string;
  cardCode: string;
  detail: string;
  fileType: "PDF" | "DOCX";
  views: string;
  pages: string;
  bgClass: string;
  accentClass: string;
  pattern: MaterialPatternType;
  gradeLevel?: string;
  author?: string;
  filePublicUrl?: string | null;
  allowDownload?: boolean;
  isNew?: boolean;
  createdAt?: string;
}

export const FALLBACK_MATERIALS: PublicMaterialItem[] = [
  {
    id: "fb-1",
    subject: "Toán học",
    title: "Tuyển tập 50 Đề thi thử THPT Quốc Gia môn Toán 2026 (Có giải chi tiết)",
    cardCode: "TOÁN 12",
    detail: "Tuyển tập 50 Đề thi thử THPT Quốc Gia môn Toán 2026 (Có giải chi tiết)",
    fileType: "PDF",
    views: "45.120 lượt xem",
    pages: "180 trang",
    bgClass: "bg-[#e07328]",
    accentClass: "text-[#e07328]",
    pattern: "waves",
    gradeLevel: "Lớp 12",
    author: "Hội đồng Khảo thí EduMi",
  },
  {
    id: "fb-2",
    subject: "Tiếng Anh",
    title: "Cẩm nang 1200 Collocations & Idioms Tiếng Anh thi Đại học điểm 9+",
    cardCode: "IELTS 9+",
    detail: "Cẩm nang 1200 Collocations & Idioms Tiếng Anh thi Đại học điểm 9+",
    fileType: "PDF",
    views: "45.240 lượt xem",
    pages: "96 trang",
    bgClass: "bg-[#be4c73]",
    accentClass: "text-[#be4c73]",
    pattern: "clouds",
    gradeLevel: "Lớp 12",
    author: "Ban Biên soạn EduMi",
  },
  {
    id: "fb-3",
    subject: "Vật lý",
    title: "Sơ đồ tư duy & Bí kíp giải nhanh Vật lý 12: Dao động cơ & Sóng cơ",
    cardCode: "VẬT LÝ 12",
    detail: "Sơ đồ tư duy & Bí kíp giải nhanh Vật lý 12: Dao động cơ & Sóng cơ",
    fileType: "PDF",
    views: "45.360 lượt xem",
    pages: "72 trang",
    bgClass: "bg-[#bf5447]",
    accentClass: "text-[#bf5447]",
    pattern: "confetti",
    gradeLevel: "Lớp 12",
    author: "Thầy Trần Minh",
  },
  {
    id: "fb-4",
    subject: "Ngữ văn",
    title: "Hệ thống Luận điểm & Mở bài - Kết bài độc đáo môn Ngữ văn 12",
    cardCode: "NGỮ VĂN",
    detail: "Hệ thống Luận điểm & Mở bài - Kết bài độc đáo môn Ngữ văn 12",
    fileType: "DOCX",
    views: "45.490 lượt xem",
    pages: "64 trang",
    bgClass: "bg-[#7356bc]",
    accentClass: "text-[#7356bc]",
    pattern: "waves",
    gradeLevel: "Lớp 12",
    author: "Cô Mai Phương",
  },
  {
    id: "fb-5",
    subject: "Hóa học",
    title: "Bộ 30 Đề luyện thi THPT Hóa học: Chuyên đề Hóa học hữu cơ & Vô cơ",
    cardCode: "HÓA HỌC",
    detail: "Bộ 30 Đề luyện thi THPT Hóa học: Chuyên đề Hóa học hữu cơ & Vô cơ",
    fileType: "PDF",
    views: "42.100 lượt xem",
    pages: "112 trang",
    bgClass: "bg-[#0d9488]",
    accentClass: "text-[#0d9488]",
    pattern: "ripples",
    gradeLevel: "Lớp 12",
    author: "Thầy Hoàng Nam",
  },
  {
    id: "fb-6",
    subject: "Sinh học",
    title: "Ngân hàng câu hỏi Di truyền học phân tầng từ cơ bản đến vận dụng",
    cardCode: "DI TRUYỀN",
    detail: "Ngân hàng câu hỏi Di truyền học phân tầng từ cơ bản đến vận dụng",
    fileType: "PDF",
    views: "27.340 lượt xem",
    pages: "132 trang",
    bgClass: "bg-[#16a34a]",
    accentClass: "text-[#16a34a]",
    pattern: "chevrons",
    gradeLevel: "Lớp 12",
    author: "Hội đồng Khảo thí EduMi",
  },
  {
    id: "fb-7",
    subject: "Tin học",
    title: "Bài tập Python nền tảng: biến, vòng lặp, hàm và xử lý danh sách",
    cardCode: "PYTHON",
    detail: "Bài tập Python nền tảng: biến, vòng lặp, hàm và xử lý danh sách",
    fileType: "PDF",
    views: "16.480 lượt xem",
    pages: "94 trang",
    bgClass: "bg-[#0f766e]",
    accentClass: "text-[#0f766e]",
    pattern: "waves",
    gradeLevel: "Lớp 12",
    author: "Ban Biên soạn EduMi",
  },
];

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

function parseMetadata(description?: string | null) {
  if (!description) return {};
  const match = description.match(/<!--EDUMI_META:([\s\S]*?)-->/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return {};
    }
  }
  return {};
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject")?.trim();
    const grade = searchParams.get("grade")?.trim();
    const fileType = searchParams.get("fileType")?.trim();
    const search = searchParams.get("search")?.trim();

    const supabase = createServiceClient();
    const { data: dbData, error } = await supabase
      .from("teaching_materials")
      .select("*")
      .eq("status", "approved")
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    let realMaterials: PublicMaterialItem[] = [];

    if (!error && Array.isArray(dbData) && dbData.length > 0) {
      realMaterials = dbData.map((item) => {
        const meta = parseMetadata(item.description);
        const cardCode =
          item.card_code ||
          meta.cardCode ||
          (item.subject ? `${item.subject.toUpperCase()} 12` : "TÀI LIỆU");
        const bgClass = item.bg_class || meta.bgClass || "bg-[#be4c73]";
        const accentClass = item.accent_class || meta.accentClass || "text-[#be4c73]";
        const pattern = (item.pattern || meta.pattern || "waves") as MaterialPatternType;
        const author = item.author || meta.author || "Hội đồng Khảo thí EduMi";

        const isRecent =
          item.created_at &&
          Date.now() - new Date(item.created_at).getTime() < 7 * 86400000;

        return {
          id: item.id,
          subject: item.subject || "Khác",
          title: item.title,
          cardCode,
          detail: item.title,
          fileType: (item.file_type || "PDF") as "PDF" | "DOCX",
          views: `${(item.view_count || 0).toLocaleString("vi-VN")} lượt xem`,
          pages: `${item.page_count || 30} trang`,
          bgClass,
          accentClass,
          pattern,
          gradeLevel: item.grade_level || "Lớp 12",
          author,
          filePublicUrl: item.file_public_url,
          allowDownload: item.allow_download !== false,
          isNew: Boolean(isRecent),
          createdAt: item.created_at,
        };
      });
    }

    // Kết hợp bài thi từ Supabase (ở đầu) và fallback items (ở sau)
    let allMaterials = [...realMaterials, ...FALLBACK_MATERIALS];

    // Lọc môn học
    if (subject && subject !== "Tất cả") {
      allMaterials = allMaterials.filter((m) => m.subject === subject);
    }

    // Lọc khối lớp
    if (grade && grade !== "Tất cả") {
      allMaterials = allMaterials.filter((m) => m.gradeLevel === grade);
    }

    // Lọc loại tệp tin
    if (fileType && fileType !== "Tất cả") {
      allMaterials = allMaterials.filter((m) => m.fileType === fileType);
    }

    // Lọc tìm kiếm tiếng Việt thông minh
    if (search) {
      allMaterials = allMaterials.filter(
        (m) =>
          matchSearch(m.title, search) ||
          matchSearch(m.cardCode, search) ||
          matchSearch(m.subject, search) ||
          (m.author && matchSearch(m.author, search)) ||
          m.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: realMaterials.length > 0 ? "supabase" : "fallback",
        materials: allMaterials,
        total: allMaterials.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Public Materials API Exception]:", error);
    return NextResponse.json(
      { success: true, source: "fallback", materials: FALLBACK_MATERIALS },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
