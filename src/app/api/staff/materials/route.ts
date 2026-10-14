import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";

type RawMaterial = {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  subject: string;
  topic: string | null;
  grade_level: string | null;
  file_type: "PDF" | "DOCX";
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

type RawUser = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

function normalizeMaterial(item: RawMaterial, teacher?: RawUser) {
  return {
    id: item.id,
    teacherId: item.teacher_id,
    teacherName: teacher?.full_name || "Giáo viên EduMi",
    teacherEmail: teacher?.email || "",
    teacherAvatarUrl: teacher?.avatar_url || null,
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

export async function GET(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền duyệt tài liệu." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const supabase = createServiceClient();

    let query = supabase.from("teaching_materials").select("*").order("created_at", { ascending: false });
    if (status && ["pending", "approved", "rejected", "hidden", "draft"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[Staff Materials GET Error]:", error);
      return NextResponse.json({ error: "Không thể tải danh sách tài liệu." }, { status: 500 });
    }

    const rawMaterials = (data || []) as RawMaterial[];
    const teacherIds = [...new Set(rawMaterials.map((item) => item.teacher_id))];
    let teacherMap: Record<string, RawUser> = {};
    if (teacherIds.length) {
      const { data: teachers } = await supabase
        .from("users")
        .select("id, full_name, email, avatar_url")
        .in("id", teacherIds);
      teacherMap = Object.fromEntries((teachers || []).map((item) => [item.id, item as RawUser]));
    }

    const materials = rawMaterials.map((item) => normalizeMaterial(item, teacherMap[item.teacher_id]));
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
    console.error("[Staff Materials GET Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải tài liệu." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền duyệt tài liệu." }, { status: 403 });
    }

    const body = await req.json();
    const { materialId, action, rejectReason } = body;
    if (!materialId || !["approve", "reject", "hide"].includes(action)) {
      return NextResponse.json({ error: "Dữ liệu duyệt tài liệu không hợp lệ." }, { status: 400 });
    }

    const cleanRejectReason = typeof rejectReason === "string" ? rejectReason.trim().slice(0, 500) : "";
    if (action === "reject" && !cleanRejectReason) {
      return NextResponse.json({ error: "Vui lòng nhập lý do từ chối tài liệu." }, { status: 400 });
    }

    const nextStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "hidden";
    const supabase = createServiceClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("teaching_materials")
      .update({
        status: nextStatus,
        reviewed_by: staff.id,
        reviewed_at: now,
        reject_reason: action === "reject" ? cleanRejectReason : null,
        updated_at: now,
      })
      .eq("id", materialId)
      .select("*")
      .single();

    if (error) {
      console.error("[Staff Materials PUT Error]:", error);
      return NextResponse.json({ error: "Không thể cập nhật trạng thái tài liệu." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "Đã phê duyệt tài liệu." : action === "reject" ? "Đã từ chối tài liệu." : "Đã ẩn tài liệu.",
      material: normalizeMaterial(data as RawMaterial),
    });
  } catch (error) {
    console.error("[Staff Materials PUT Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi duyệt tài liệu." }, { status: 500 });
  }
}
