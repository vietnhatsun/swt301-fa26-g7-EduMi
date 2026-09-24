import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  DEFAULT_SESSION_DURATION,
} from "@/lib/auth-session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Email và Mật khẩu." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // 1. Tìm tài khoản trong bảng users
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (userError) {
      console.error("[Login API Query Error]:", userError);
      return NextResponse.json(
        { error: "Lỗi kết nối máy chủ. Vui lòng thử lại sau." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không chính xác." },
        { status: 401 }
      );
    }

    // 2. Kiểm tra trạng thái kích hoạt tài khoản
    if (!user.is_verified || user.status === "pending_verification") {
      return NextResponse.json(
        {
          error: "Tài khoản của bạn chưa được xác thực mã OTP. Vui lòng xác thực trước khi đăng nhập.",
          needVerification: true,
          email: cleanEmail,
        },
        { status: 403 }
      );
    }

    if (user.status === "banned") {
      return NextResponse.json(
        { error: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên." },
        { status: 403 }
      );
    }

    // 3. Kiểm tra mật khẩu
    if (!user.password_hash) {
      return NextResponse.json(
        { error: "Tài khoản này được đăng ký qua Google. Vui lòng chọn 'Đăng nhập với Google'." },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không chính xác." },
        { status: 401 }
      );
    }

    // 4. Kiểm tra quyền hạn (Ưu tiên vai trò Student trong giai đoạn này)
    if (user.role !== "student") {
      return NextResponse.json(
        {
          error: `Tài khoản của bạn có vai trò là '${user.role}'. Hệ thống hiện tại đang ưu tiên mở cổng cho vai trò Học sinh (Student).`,
        },
        { status: 403 }
      );
    }

    // 5. Lấy thông tin student_profiles
    let { data: studentProfile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Nếu chưa có student_profile, tự động tạo mã student_code cho học sinh
    if (!studentProfile) {
      const studentCode = `EDM-${Math.floor(100000 + Math.random() * 900000)}`;
      const { data: newProfile, error: profileInsertError } = await supabase
        .from("student_profiles")
        .insert({
          user_id: user.id,
          student_code: studentCode,
          current_streak: 0,
          longest_streak: 0,
          total_points: 0,
        })
        .select()
        .single();

      if (!profileInsertError && newProfile) {
        studentProfile = newProfile;
      }
    }

    // 6. Tạo payload phiên đăng nhập
    const sessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      avatarUrl: user.avatar_url || null,
      studentCode: studentProfile?.student_code || "EDM-784920",
      streakCount: studentProfile?.current_streak || 0,
      longestStreak: studentProfile?.longest_streak || 0,
      totalPoints: studentProfile?.total_points || 0,
      schoolName: studentProfile?.school_name || "THPT EduMi",
      gradeLevel: studentProfile?.grade_level || "Lớp 12",
      phoneNumber: user.phone_number || "",
    };

    // Tạo JWT Token có gắn chữ ký số HMAC-SHA256 và Claims bảo mật
    const sessionToken = await createSessionToken({
      sub: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      studentCode: studentProfile?.student_code || "EDM-784920",
      avatarUrl: user.avatar_url || null,
    });

    // 7. Tạo response và đính kèm Cookie HTTP-Only an toàn
    const response = NextResponse.json(
      {
        success: true,
        message: "Đăng nhập thành công!",
        user: sessionUser,
      },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: DEFAULT_SESSION_DURATION,
    });

    return response;
  } catch (error: unknown) {
    console.error("[Login API Exception]:", error);
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi máy chủ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
