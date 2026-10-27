import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { deleteR2Object, isR2Configured } from "@/lib/r2";

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
  card_code?: string | null;
  bg_class?: string | null;
  accent_class?: string | null;
  pattern?: string | null;
  author?: string | null;
  created_at: string;
  updated_at: string;
};

type RawUser = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

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

function cleanDescription(description?: string | null) {
  if (!description) return "";
  return description.replace(/<!--EDUMI_META:[\s\S]*?-->/, "").trim();
}

function normalizeMaterial(item: RawMaterial, teacher?: RawUser) {
  const meta = parseMetadata(item.description);
  const cardCode = item.card_code || meta.cardCode || item.topic || item.subject.toUpperCase();
  const bgClass = item.bg_class || meta.bgClass || "bg-[#e07328]";
  const accentClass = item.accent_class || meta.accentClass || "text-[#e07328]";
  const pattern = item.pattern || meta.pattern || "waves";
  const author = item.author || meta.author || teacher?.full_name || "Hội đồng Khảo thí EduMi";

  return {
    id: item.id,
    teacherId: item.teacher_id,
    teacherName: author,
    teacherEmail: teacher?.email || "",
    teacherAvatarUrl: teacher?.avatar_url || null,
    title: item.title,
    description: cleanDescription(item.description),
    subject: item.subject,
    topic: item.topic || "",
    gradeLevel: item.grade_level || "",
    cardCode,
    bgClass,
    accentClass,
    pattern,
    author,
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
      return NextResponse.json({ error: "Bạn không có quyền truy cập quản lý tài liệu." }, { status: 403 });
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
        draft: materials.filter((item) => item.status === "draft").length,
        hidden: materials.filter((item) => item.status === "hidden").length,
      },
    });
  } catch (error) {
    console.error("[Staff Materials GET Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải tài liệu." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền đăng tài liệu." }, { status: 403 });
    }

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 255) : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "Toán học";
    const topic = typeof body.topic === "string" ? body.topic.trim() : "Chuyên đề";
    const gradeLevel = typeof body.gradeLevel === "string" ? body.gradeLevel.trim() : "Lớp 12";
    const cardCode = typeof body.cardCode === "string" ? body.cardCode.trim().slice(0, 50) : topic.toUpperCase();
    const fileType = body.fileType === "DOCX" ? "DOCX" : "PDF";
    const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";
    const fileSize = Number(body.fileSize || 0);
    const fileKey = typeof body.fileKey === "string" ? body.fileKey.trim() : "";
    const filePublicUrl = typeof body.filePublicUrl === "string" ? body.filePublicUrl.trim() : null;
    const pageCount = Number(body.pageCount || 0);
    const bgClass = typeof body.bgClass === "string" ? body.bgClass.trim() : "bg-[#e07328]";
    const accentClass = typeof body.accentClass === "string" ? body.accentClass.trim() : "text-[#e07328]";
    const pattern = typeof body.pattern === "string" ? body.pattern.trim() : "waves";
    const author = typeof body.author === "string" && body.author.trim() ? body.author.trim() : staff.full_name || "Hội đồng Khảo thí EduMi";
    const status = body.status === "draft" ? "draft" : "approved";
    const allowDownload = body.allowDownload !== false;
    const visibility = "public";

    if (!title) {
      return NextResponse.json({ error: "Vui lòng nhập tên tài liệu." }, { status: 400 });
    }
    if (!fileName || !fileKey) {
      return NextResponse.json({ error: "Vui lòng tải lên tệp tài liệu PDF hoặc DOCX." }, { status: 400 });
    }

    const metaComment = `<!--EDUMI_META:${JSON.stringify({ cardCode, bgClass, accentClass, pattern, author })}-->`;
    const fullDescription = `${metaComment}\n${description}`.trim();

    const supabase = createServiceClient();
    const now = new Date().toISOString();

    // Thử insert với các cột theme & card_code
    const insertPayloadFull = {
      teacher_id: staff.id,
      title,
      description: fullDescription,
      subject,
      topic,
      grade_level: gradeLevel,
      card_code: cardCode,
      bg_class: bgClass,
      accent_class: accentClass,
      pattern,
      author,
      file_type: fileType,
      file_name: fileName,
      file_size: fileSize,
      file_key: fileKey,
      file_public_url: filePublicUrl,
      page_count: pageCount > 0 ? pageCount : null,
      visibility,
      status,
      allow_download: allowDownload,
      reviewed_by: staff.id,
      reviewed_at: now,
      created_at: now,
      updated_at: now,
    };

    let { data, error } = await supabase
      .from("teaching_materials")
      .insert(insertPayloadFull)
      .select("*")
      .single();

    // Nếu database chưa chạy migration các cột mới, fallback insert không có các cột đó
    if (error && (error.message?.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
      console.warn("[Staff Materials POST]: Column not found, falling back to core columns:", error.message);
      const fallbackPayload = {
        teacher_id: staff.id,
        title,
        description: fullDescription,
        subject,
        topic,
        grade_level: gradeLevel,
        file_type: fileType,
        file_name: fileName,
        file_size: fileSize,
        file_key: fileKey,
        file_public_url: filePublicUrl,
        page_count: pageCount > 0 ? pageCount : null,
        visibility,
        status,
        allow_download: allowDownload,
        reviewed_by: staff.id,
        reviewed_at: now,
        created_at: now,
        updated_at: now,
      };

      const fallbackResult = await supabase
        .from("teaching_materials")
        .insert(fallbackPayload)
        .select("*")
        .single();

      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) {
      console.error("[Staff Materials POST Error]:", error);
      return NextResponse.json({ error: error.message || "Không thể đăng tài liệu." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: status === "approved" ? "Đã xuất bản tài liệu thành công!" : "Đã lưu bản nháp tài liệu thành công!",
      material: normalizeMaterial(data as RawMaterial, {
        id: staff.id,
        full_name: author,
        email: staff.email,
        avatar_url: staff.avatar_url,
      }),
    });
  } catch (error) {
    console.error("[Staff Materials POST Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi đăng tài liệu." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền cập nhật tài liệu." }, { status: 403 });
    }

    const body = await req.json();
    const { materialId, action, rejectReason } = body;
    if (!materialId || !["approve", "reject", "hide", "publish"].includes(action)) {
      return NextResponse.json({ error: "Thao tác cập nhật không hợp lệ." }, { status: 400 });
    }

    const cleanRejectReason = typeof rejectReason === "string" ? rejectReason.trim().slice(0, 500) : "";
    if (action === "reject" && !cleanRejectReason) {
      return NextResponse.json({ error: "Vui lòng nhập lý do từ chối tài liệu." }, { status: 400 });
    }

    const nextStatus = action === "approve" || action === "publish" ? "approved" : action === "reject" ? "rejected" : "hidden";
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
      message: nextStatus === "approved" ? "Đã công khai tài liệu." : nextStatus === "rejected" ? "Đã từ chối tài liệu." : "Đã ẩn tài liệu.",
      material: normalizeMaterial(data as RawMaterial),
    });
  } catch (error) {
    console.error("[Staff Materials PUT Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi cập nhật tài liệu." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền xóa tài liệu." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let materialId = searchParams.get("id");
    if (!materialId) {
      try {
        const body = await req.json();
        materialId = body.id || body.materialId;
      } catch {}
    }

    if (!materialId) {
      return NextResponse.json({ error: "Thiếu ID tài liệu cần xóa." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: material } = await supabase
      .from("teaching_materials")
      .select("id, file_key")
      .eq("id", materialId)
      .maybeSingle();

    if (!material) {
      return NextResponse.json({ error: "Tài liệu không tồn tại hoặc đã bị xóa." }, { status: 404 });
    }

    if (material.file_key && isR2Configured()) {
      await deleteR2Object(material.file_key).catch((err) => {
        console.warn("[Delete R2 Object Warning]:", err);
      });
    }

    const { error: deleteError } = await supabase
      .from("teaching_materials")
      .delete()
      .eq("id", materialId);

    if (deleteError) {
      console.error("[Staff Materials DELETE Error]:", deleteError);
      return NextResponse.json({ error: "Không thể xóa tài liệu." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Đã xóa tài liệu thành công." });
  } catch (error) {
    console.error("[Staff Materials DELETE Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xóa tài liệu." }, { status: 500 });
  }
}
