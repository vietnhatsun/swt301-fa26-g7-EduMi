import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    const cleanEmail = email?.trim().toLowerCase();
    const cleanOtp = otp?.trim();

    if (!cleanEmail || !cleanOtp || cleanOtp.length !== 6) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ email và mã OTP 6 chữ số." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // 1. Tìm token hợp lệ
    const { data: tokenRecord, error: tokenError } = await supabase
      .from("verification_tokens")
      .select("id, expires_at, is_used")
      .eq("email", cleanEmail)
      .eq("token", cleanOtp)
      .eq("type", "email_verification")
      .eq("is_used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tokenError) {
      console.error("[Verify OTP Query Error]:", tokenError);
      return NextResponse.json(
        { error: "Lỗi kiểm tra mã xác thực. Vui lòng thử lại." },
        { status: 500 }
      );
    }

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Mã OTP không chính xác hoặc đã được sử dụng." },
        { status: 400 }
      );
    }

    // Kiểm tra thời hạn
    const isExpired = new Date(tokenRecord.expires_at) < new Date();
    if (isExpired) {
      return NextResponse.json(
        { error: "Mã OTP đã hết hạn (chỉ có hiệu lực trong 10 phút). Vui lòng yêu cầu mã mới." },
        { status: 400 }
      );
    }

    // 2. Cập nhật trạng thái người dùng trong bảng users
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        is_verified: true,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("email", cleanEmail);

    if (userUpdateError) {
      console.error("[Verify OTP User Update Error]:", userUpdateError);
      return NextResponse.json(
        { error: "Không thể kích hoạt tài khoản. Vui lòng thử lại." },
        { status: 500 }
      );
    }

    // 3. Đánh dấu token đã được sử dụng
    await supabase
      .from("verification_tokens")
      .update({ is_used: true })
      .eq("id", tokenRecord.id);

    return NextResponse.json(
      {
        success: true,
        message: "Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống";
    console.error("[Verify OTP Exception]:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
