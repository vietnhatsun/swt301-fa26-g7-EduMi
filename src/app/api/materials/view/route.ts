import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { generatePresignedDownloadUrl, isR2Configured } from "@/lib/r2";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Thiếu mã tài liệu." }, { status: 400 });

    const supabase = createServiceClient();
    const { data: material, error } = await supabase
      .from("teaching_materials")
      .select("id, teacher_id, title, subject, file_type, file_name, file_key, file_public_url, status, visibility, allow_download")
      .eq("id", id)
      .maybeSingle();

    if (error || !material) {
      return NextResponse.json({ error: "Không tìm thấy tài liệu." }, { status: 404 });
    }

    const canView = material.status === "approved" || material.teacher_id === user.id || user.role === "staff" || user.role === "admin";
    if (!canView) {
      return NextResponse.json({ error: "Bạn không có quyền xem tài liệu này." }, { status: 403 });
    }

    if (isR2Configured()) {
      const downloadUrl = await generatePresignedDownloadUrl({ key: material.file_key, expiresInSeconds: 900 });
      return NextResponse.json({ success: true, downloadUrl, expiresInSeconds: 900, material: { id: material.id, title: material.title, subject: material.subject, fileType: material.file_type, fileName: material.file_name, status: material.status, allowDownload: material.allow_download } });
    }

    return NextResponse.json({ success: true, downloadUrl: material.file_public_url || "/api/upload/mock", isMock: true, material: { id: material.id, title: material.title, subject: material.subject, fileType: material.file_type, fileName: material.file_name, status: material.status, allowDownload: material.allow_download } });
  } catch (error) {
    console.error("[Material View Error]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo liên kết xem tài liệu." }, { status: 500 });
  }
}
