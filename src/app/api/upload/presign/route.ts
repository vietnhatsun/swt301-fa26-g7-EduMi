import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { isR2Configured, generatePresignedUploadUrl, getR2PublicUrl } from "@/lib/r2";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CERTIFICATE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_CERTIFICATE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export async function POST(req: NextRequest) {
  try {
    // 1. Xác thực người dùng
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện tải lên tệp tin." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fileName, fileType, fileSize, category } = body;

    if (!fileName || !fileType || !fileSize || !category) {
      return NextResponse.json(
        { error: "Thiếu thông tin tệp tin cần tải lên." },
        { status: 400 }
      );
    }

    // 2. Kiểm tra theo từng loại tệp (Category)
    let maxAllowedSize = MAX_AVATAR_SIZE;
    let allowedTypes = ALLOWED_AVATAR_TYPES;
    let folder = "avatars";

    if (category === "certificate") {
      maxAllowedSize = MAX_CERTIFICATE_SIZE;
      allowedTypes = ALLOWED_CERTIFICATE_TYPES;
      folder = "certificates";
    } else if (category !== "avatar") {
      return NextResponse.json(
        { error: "Loại tệp không hợp lệ. Chỉ chấp nhận avatar hoặc certificate." },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        {
          error: `Định dạng tệp không được hỗ trợ (${fileType}). Hỗ trợ: ${allowedTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (fileSize > maxAllowedSize) {
      const maxMb = maxAllowedSize / (1024 * 1024);
      return NextResponse.json(
        { error: `Dung lượng tệp vượt quá giới hạn tối đa (${maxMb}MB).` },
        { status: 400 }
      );
    }

    // 3. Chuẩn hóa phần mở rộng file (Extension)
    const ext = fileName.split(".").pop()?.toLowerCase() || (fileType === "application/pdf" ? "pdf" : "png");
    const sanitizedExt = ext.replace(/[^a-z0-9]/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const key = `${folder}/${user.id}-${Date.now()}-${randomSuffix}.${sanitizedExt}`;

    // 4. Nếu Cloudflare R2 đã cấu hình: Sinh Presigned PUT URL
    if (isR2Configured()) {
      const { uploadUrl, publicUrl } = await generatePresignedUploadUrl({
        key,
        contentType: fileType,
        expiresInSeconds: 600, // 10 phút
      });

      return NextResponse.json({
        success: true,
        uploadUrl,
        fileKey: key,
        publicUrl: category === "avatar" ? publicUrl : undefined,
        storage: "r2",
      });
    }

    // 5. Chế độ Mock / Local Dev khi chưa điền thông tin R2 vào .env.local
    console.warn(
      "[R2 Storage]: R2 credentials chưa được cấu hình. Sử dụng chế độ mô phỏng cho local development."
    );

    return NextResponse.json({
      success: true,
      uploadUrl: `/api/upload/mock?key=${encodeURIComponent(key)}`,
      fileKey: key,
      publicUrl: category === "avatar" ? `/mock-avatar.png` : undefined,
      storage: "mock",
      message: "Chế độ mô phỏng upload cục bộ do chưa cấu hình biến môi trường R2.",
    });
  } catch (error) {
    console.error("[Upload Presign Error]:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi khởi tạo liên kết tải lên." },
      { status: 500 }
    );
  }
}
