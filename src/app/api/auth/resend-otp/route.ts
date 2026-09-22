import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { sendVerificationOtpEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp email." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // 1. Kiểm tra tài khoản tồn tại và chưa kích hoạt
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, full_name, role, is_verified")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin đăng ký cho email này." },
        { status: 404 }
      );
    }

    if (user.is_verified) {
      return NextResponse.json(
        { error: "Tài khoản này đã được xác thực trước đó. Vui lòng đăng nhập." },
        { status: 400 }
      );
    }

    // 2. Vô hiệu hóa token cũ
    await supabase
      .from("verification_tokens")
      .update({ is_used: true })
      .eq("email", cleanEmail)
      .eq("type", "email_verification");

    // 3. Tạo OTP mới
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 phút

    const { error: insertError } = await supabase
      .from("verification_tokens")
      .insert({
        email: cleanEmail,
        token: otp,
        type: "email_verification",
        expires_at: expiresAt,
        is_used: false,
      });

    if (insertError) {
      console.error("[Resend OTP Insert Error]:", insertError);
      return NextResponse.json(
        { error: "Không thể tạo mã OTP mới." },
        { status: 500 }
      );
    }

    // 4. Gửi email
    const mailResult = await sendVerificationOtpEmail(
      cleanEmail,
      otp,
      user.full_name,
      user.role
    );

    if (!mailResult.success) {
      console.warn("[Resend OTP Mail Warning]:", mailResult.error);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Mã xác thực mới đã được gửi vào email của bạn.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống";
    console.error("[Resend OTP Exception]:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
