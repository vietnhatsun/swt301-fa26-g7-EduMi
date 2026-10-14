import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { deleteR2Object, isR2Configured } from "@/lib/r2";

const ALLOWED_TYPES = ["PDF", "DOCX"] as const;

type MaterialFileType = (typeof ALLOWED_TYPES)[number];

type RawMaterial = {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  subject: string;
  topic: string | null;
  grade_level: string | null;
  file_type: MaterialFileType;
  file_name: string;
  file_size: number;
  file_key: string;
  file_public_url: string | null;
  page_count: number | null;
  visibility: string;
  status: string;
  allow_download: boolean;
  download_count: number;
  view_count: number;
  rating_avg: number;
  rating_count: number;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
};

function normalizeMaterial(item: RawMaterial) {
  return {
    id: item.id,
    teacherId: item.teacher_id,
    title: item.title,
    description: item.description || "",
    subject: item.subject,
    topic: item.topic || "",
    gradeLevel: item.grade_level || "",
    fileType: item.file_type,
    fileName: item.file_name,
    fileSize: Number(item.file_size || 0),
    fileKey: item.file_key,
    filePublicUrl: item.file_public_url || null,
    pageCount: item.page_count || 0,
    visibility: item.visibility,
    status: item.status,
    allowDownload: item.allow_download,
    downloadCount: item.download_count || 0,
    viewCount: item.view_count || 0,
    ratingAvg: Number(item.rating_avg || 0),
    ratingCount: item.rating_count || 0,
    rejectReason: item.reject_reason || null,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function cleanText(value: unknown, max = 255) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (user.role !== "teacher" && user.role !== "admin") {
      return NextResponse.json({ error: "Chỉ giáo viên mới có thể xem kho tài liệu đã đăng." }, { status: 403 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("teaching_materials")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Teacher Materials GET Error]:", error);
      return NextResponse.json({ error: "Không thể tải danh sách tài liệu." }, { status: 500 });
    }

    const materials = ((data || []) as RawMaterial[]).map(normalizeMaterial);
    return NextResponse.json({
      success: true,
      materials,
      counts: {
        total: materials.length,
        pending: materials.filter((item) => item.status === "pending").length,
        approved: materials.filter((item) => item.status === "approved").length,
        rejected: materials.filter((item) => item.status === "rejected").length,
      },
    });
  } catch (error) {
    console.error("[Teacher Materials GET Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải tài liệu." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (user.role !== "teacher" && user.role !== "admin") {
      return NextResponse.json({ error: "Chỉ giáo viên mới có thể đăng tài liệu." }, { status: 403 });
    }

    const body = await req.json();
    const title = cleanText(body.title, 180);
    const description = cleanText(body.description, 1000);
    const subject = cleanText(body.subject, 120);
    const topic = cleanText(body.topic, 80);
    const gradeLevel = cleanText(body.gradeLevel, 80);
    const fileType = cleanText(body.fileType, 10).toUpperCase() as MaterialFileType;
    const fileName = cleanText(body.fileName, 255);
    const fileKey = cleanText(body.fileKey, 700);
    const filePublicUrl = cleanText(body.filePublicUrl, 1000) || null;
    const fileSize = Number(body.fileSize || 0);
    const pageCount = Number(body.pageCount || 0);
    const visibility = body.visibility === "private" ? "private" : "public";
    const allowDownload = body.allowDownload !== false;

    if (!title || !subject || !topic || !gradeLevel || !fileName || !fileKey || !ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: "Vui lòng nhập đủ tên, môn học, chủ đề, lớp học và chọn file PDF/DOCX hợp lệ." }, { status: 400 });
    }

    if (!fileKey.startsWith(`materials/${user.id}/`)) {
      return NextResponse.json({ error: "File tải lên không thuộc tài khoản giáo viên hiện tại." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("teaching_materials")
      .insert({
        teacher_id: user.id,
        title,
        description,
        subject,
        topic: topic || null,
        grade_level: gradeLevel || null,
        file_type: fileType,
        file_name: fileName,
        file_size: Number.isFinite(fileSize) ? fileSize : 0,
        file_key: fileKey,
        file_public_url: filePublicUrl,
        page_count: Number.isFinite(pageCount) && pageCount > 0 ? pageCount : null,
        visibility,
        allow_download: allowDownload,
        status: "pending",
        updated_at: now,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[Teacher Materials POST Error]:", error);
      return NextResponse.json({ error: "Không thể lưu tài liệu vào hệ thống." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Tài liệu đã được gửi tới staff để kiểm duyệt.",
      material: normalizeMaterial(data as RawMaterial),
    });
  } catch (error) {
    console.error("[Teacher Materials POST Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi đăng tài liệu." }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (user.role !== "teacher" && user.role !== "admin") {
      return NextResponse.json({ error: "Chỉ giáo viên mới có thể xóa tài liệu." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Thiếu mã tài liệu." }, { status: 400 });

    const supabase = createServiceClient();
    let selectQuery = supabase.from("teaching_materials").select("id, teacher_id, file_key").eq("id", id).maybeSingle();
    if (user.role === "teacher") {
      selectQuery = supabase.from("teaching_materials").select("id, teacher_id, file_key").eq("id", id).eq("teacher_id", user.id).maybeSingle();
    }

    const { data: material, error: findError } = await selectQuery;
    if (findError) {
      console.error("[Teacher Materials DELETE Find Error]:", findError);
      return NextResponse.json({ error: "Không thể kiểm tra tài liệu cần xóa." }, { status: 500 });
    }
    if (!material) {
      return NextResponse.json({ error: "Không tìm thấy tài liệu thuộc tài khoản của bạn." }, { status: 404 });
    }

    if (isR2Configured() && material.file_key) {
      try {
        await deleteR2Object({ key: material.file_key });
      } catch (r2Error) {
        console.error("[Teacher Materials DELETE R2 Error]:", r2Error);
        return NextResponse.json({ error: "Không thể xóa file trên Cloudflare R2. Vui lòng thử lại." }, { status: 502 });
      }
    }

    const { error: deleteError } = await supabase.from("teaching_materials").delete().eq("id", material.id);
    if (deleteError) {
      console.error("[Teacher Materials DELETE DB Error]:", deleteError);
      return NextResponse.json({ error: "File đã được xóa trên R2 nhưng chưa thể xóa dữ liệu trong hệ thống." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Đã xóa tài liệu và file lưu trữ trên R2." });
  } catch (error) {
    console.error("[Teacher Materials DELETE Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xóa tài liệu." }, { status: 500 });
  }
}