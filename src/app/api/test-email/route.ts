import { NextResponse } from "next/server";
import { sendVerificationOtpEmail } from "@/lib/mail";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to") || "nguyenngocthach531@gmail.com";
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const result = await sendVerificationOtpEmail(to, otp);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Đã gửi mã OTP test (${otp}) tới ${to} thành công! Kiểm tra hòm thư của bạn.`,
    data: result.data,
  });
}
