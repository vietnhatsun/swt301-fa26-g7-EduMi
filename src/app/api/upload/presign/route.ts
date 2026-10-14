import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { isR2Configured, generatePresignedUploadUrl } from "@/lib/r2";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const MAX_CERTIFICATE_SIZE = 10 * 1024 * 1024;
const MAX_MATERIAL_SIZE = 30 * 1024 * 1024;
const MAX_CLASS_COVER_SIZE = 5 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_CERTIFICATE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const ALLOWED_MATERIAL_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để tải lên tệp tin." }, { status: 401 });
    }

    const body = await req.json();
    const { fileName, fileType, fileSize, category } = body;
    if (!fileName || !fileType || !fileSize || !category) {
      return NextResponse.json({ error: "Thiếu thông tin tệp tin cần tải lên." }, { status: 400 });
    }

    let maxAllowedSize = MAX_AVATAR_SIZE;
    let allowedTypes = ALLOWED_AVATAR_TYPES;
    let folder = "avatars";

    if (category === "certificate") {
      maxAllowedSize = MAX_CERTIFICATE_SIZE;
      allowedTypes = ALLOWED_CERTIFICATE_TYPES;
      folder = "certificates";
    } else if (category === "material") {
      if (user.role !== "teacher" && user.role !== "admin") {
        return NextResponse.json({ error: "Chỉ giáo viên mới có thể tải lên tài liệu." }, { status: 403 });
      }
      maxAllowedSize = MAX_MATERIAL_SIZE;
      allowedTypes = ALLOWED_MATERIAL_TYPES;
      folder = `materials/${user.id}`;
    } else if (category === "class-cover") {
      if (user.role !== "teacher" && user.role !== "admin") {
        return NextResponse.json({ error: "Chỉ giáo viên mới có thể tải ảnh bìa lớp học." }, { status: 403 });
      }
      maxAllowedSize = MAX_CLASS_COVER_SIZE;
      allowedTypes = ALLOWED_AVATAR_TYPES;
      folder = `class-covers/${user.id}`;
    } else if (category !== "avatar") {
      return NextResponse.json({ error: "Loại tệp không hợp lệ. Chỉ chấp nhận avatar, certificate, material hoặc class-cover." }, { status: 400 });
    }

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: `Định dạng tệp không được hỗ trợ (${fileType}). Hỗ trợ: ${allowedTypes.join(", ")}` }, { status: 400 });
    }

    if (Number(fileSize) > maxAllowedSize) {
      return NextResponse.json({ error: `Dung lượng tệp vượt quá giới hạn tối đa (${maxAllowedSize / (1024 * 1024)}MB).` }, { status: 400 });
    }

    const fallbackExt = fileType === "application/pdf" ? "pdf" : fileType.includes("wordprocessingml") ? "docx" : "png";
    const ext = fileName.split(".").pop()?.toLowerCase() || fallbackExt;
    const sanitizedExt = ext.replace(/[^a-z0-9]/g, "") || fallbackExt;
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const key = `${folder}/${Date.now()}-${randomSuffix}.${sanitizedExt}`;

    if (isR2Configured()) {
      const { uploadUrl, publicUrl } = await generatePresignedUploadUrl({
        key,
        contentType: fileType,
        expiresInSeconds: 600,
      });

      return NextResponse.json({
        success: true,
        uploadUrl,
        fileKey: key,
        publicUrl: category === "avatar" || category === "material" || category === "class-cover" ? publicUrl : undefined,
        storage: "r2",
      });
    }

    console.warn("[R2 Storage]: R2 credentials chưa được cấu hình. Sử dụng mock upload cho local development.");

    return NextResponse.json({
      success: true,
      uploadUrl: `/api/upload/mock?key=${encodeURIComponent(key)}`,
      fileKey: key,
      publicUrl: category === "avatar" ? "/mock-avatar.png" : `/api/upload/mock?key=${encodeURIComponent(key)}`,
      storage: "mock",
      message: "Chế độ mô phỏng upload cục bộ do chưa cấu hình biến môi trường R2.",
    });
  } catch (error) {
    console.error("[Upload Presign Error]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi khởi tạo liên kết tải lên." }, { status: 500 });
  }
}
