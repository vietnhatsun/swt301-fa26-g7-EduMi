import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { isR2Configured, generatePresignedDownloadUrl } from "@/lib/r2";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const targetUserId = searchParams.get("userId") || user.id;

    if (!key) {
      return NextResponse.json({ error: "Thiếu tham số key tệp tin." }, { status: 400 });
    }

    // Bảo mật: Chỉ cho phép chính chủ hoặc Staff/Admin xem chứng chỉ
    const isOwner = targetUserId === user.id;
    const isStaffOrAdmin = user.role === "staff" || user.role === "admin";

    if (!isOwner && !isStaffOrAdmin) {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập tài liệu chứng chỉ này." },
        { status: 403 }
      );
    }

    // Kiểm tra trong DB xem key có thuộc về teacher này không
    const supabase = createServiceClient();
    const { data: teacherProfile } = await supabase
      .from("teacher_profiles")
      .select("certificate_url, user_id")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (!teacherProfile || !teacherProfile.certificate_url) {
      return NextResponse.json(
        { error: "Không tìm thấy chứng chỉ liên kết với hồ sơ này." },
        { status: 404 }
      );
    }

    // Nếu R2 đã cấu hình: sinh Presigned GET URL
    if (isR2Configured()) {
      const downloadUrl = await generatePresignedDownloadUrl({
        key,
        expiresInSeconds: 900, // 15 phút
      });

      return NextResponse.json({
        success: true,
        downloadUrl,
        expiresInSeconds: 900,
      });
    }

    // Fallback nếu chưa cấu hình R2
    return NextResponse.json({
      success: true,
      downloadUrl: key.startsWith("http") ? key : `/cv-teacher.png`,
      isMock: true,
    });
  } catch (error) {
    console.error("[Certificate View Error]:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tạo liên kết xem chứng chỉ." },
      { status: 500 }
    );
  }
}
