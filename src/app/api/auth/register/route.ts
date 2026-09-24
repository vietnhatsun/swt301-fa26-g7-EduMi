import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase";
import { sendVerificationOtpEmail } from "@/lib/mail";

// Helper sinh student code ngẫu nhiên (VD: EDM-749201)
function generateStudentCode(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `EDM-${randomNum}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, role = "student" } = body;

    // 1. Validation đầu vào
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Họ và tên phải có tối thiểu 2 ký tự." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Địa chỉ email không hợp lệ." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Mật khẩu phải có tối thiểu 8 ký tự." },
        { status: 400 }
      );
    }

    const validRoles = ["student", "teacher", "parent"];
    const userRole = validRoles.includes(role) ? role : "student";

    const supabase = createServiceClient();

    // 2. Kiểm tra email đã tồn tại chưa
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id, email, is_verified, password_hash")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (checkError) {
      console.error("[Register Check Error]:", checkError);
      return NextResponse.json(
        { error: "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau." },
        { status: 500 }
      );
    }

    if (existingUser) {
      // Trường hợp 1: Email này đã được đăng ký thông qua Google (password_hash là null)
      if (existingUser.password_hash === null) {
        return NextResponse.json(
          {
            error: "Email này đã được đăng ký bằng tài khoản Google. Vui lòng sử dụng tính năng 'Tiếp tục với Google' để đăng nhập.",
            provider: "google",
          },
          { status: 409 }
        );
      }

      // Trường hợp 2: Email này đã được đăng ký và đã xác thực mật khẩu
      if (existingUser.is_verified) {
        return NextResponse.json(
          {
            error: "Email này đã được đăng ký tài khoản. Vui lòng chuyển sang trang Đăng nhập hoặc chọn Quên mật khẩu.",
            provider: "password",
          },
          { status: 409 }
        );
      }
    }

    // 3. Hash mật khẩu bằng bcryptjs
    const passwordHash = await bcrypt.hash(password, 12);

    let userId: string;

    if (existingUser && !existingUser.is_verified) {
      // Người dùng đã tạo tài khoản trước đó nhưng chưa xác thực OTP -> cập nhật lại
      userId = existingUser.id;
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: fullName.trim(),
          password_hash: passwordHash,
          role: userRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("[Register Update User Error]:", updateError);
        return NextResponse.json(
          { error: "Không thể cập nhật thông tin đăng ký." },
          { status: 500 }
        );
      }
    } else {
      // Tạo user mới trong bảng users
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          email: cleanEmail,
          password_hash: passwordHash,
          full_name: fullName.trim(),
          role: userRole,
          status: "pending_verification",
          is_verified: false,
        })
        .select("id")
        .single();

      if (insertError || !newUser) {
        console.error("[Register Insert User Error]:", insertError);
        return NextResponse.json(
          { error: "Không thể tạo tài khoản người dùng." },
          { status: 500 }
        );
      }

      userId = newUser.id;

      // Tạo profile tương ứng với vai trò
      if (userRole === "student") {
        const studentCode = generateStudentCode();
        await supabase
          .from("student_profiles")
          .insert({
            user_id: userId,
            student_code: studentCode,
          })
          .select();
      } else if (userRole === "teacher") {
        await supabase
          .from("teacher_profiles")
          .insert({
            user_id: userId,
          })
          .select();
      }
    }

    // 4. Tạo mã OTP 6 số và lưu vào verification_tokens
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 phút

    // Vô hiệu hoá các token cũ chưa sử dụng của email này
    await supabase
      .from("verification_tokens")
      .update({ is_used: true })
      .eq("email", cleanEmail)
      .eq("type", "email_verification");

    const { error: tokenError } = await supabase
      .from("verification_tokens")
      .insert({
        email: cleanEmail,
        token: otp,
        type: "email_verification",
        expires_at: expiresAt,
        is_used: false,
      });

    if (tokenError) {
      console.error("[Register Token Insert Error]:", tokenError);
      return NextResponse.json(
        { error: "Không thể tạo mã xác thực." },
        { status: 500 }
      );
    }

    // 5. Gửi email chứa OTP qua Resend
    const mailResult = await sendVerificationOtpEmail(
      cleanEmail,
      otp,
      fullName.trim(),
      userRole
    );

    if (!mailResult.success) {
      console.warn("[Register Mail Warning]: Không thể gửi email:", mailResult.error);
      // Vẫn cho phép frontend chuyển sang bước OTP (nếu dev test có thể log hoặc user thử lại)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Mã xác thực OTP đã được gửi đến email của bạn.",
        email: cleanEmail,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống";
    console.error("[Register API Exception]:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
