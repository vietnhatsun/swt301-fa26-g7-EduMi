import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  DEFAULT_SESSION_DURATION,
} from "@/lib/auth-session";
import { getRoleHomePath, getRoleLabel, isRegisterableRole } from "@/lib/auth-roles";

function teacherCodeFromId(id: string) {
  return `GV-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

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

    if (!isRegisterableRole(user.role)) {
      return NextResponse.json(
        { error: "Vai trò tài khoản này chưa có không gian hồ sơ riêng trên EduMi." },
        { status: 403 }
      );
    }

    let { data: studentProfile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (user.role === "student" && !studentProfile) {
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

    const teacherCode = teacherCodeFromId(user.id);
    const isTeacher = user.role === "teacher";
    const isParent = user.role === "parent";
    const fallbackCode = isTeacher ? teacherCode : isParent ? "" : studentProfile?.student_code || "EDM-784920";
    const redirectUrl = getRoleHomePath(user.role);
    const sessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      avatarUrl: user.avatar_url || null,
      studentCode: fallbackCode,
      teacherCode: isTeacher ? teacherCode : undefined,
      streakCount: isTeacher || isParent ? 0 : studentProfile?.current_streak || 0,
      longestStreak: isTeacher || isParent ? 0 : studentProfile?.longest_streak || 0,
      totalPoints: isTeacher || isParent ? 0 : studentProfile?.total_points || 0,
      schoolName: studentProfile?.school_name || "EduMi Platform",
      gradeLevel: isTeacher ? "Giáo viên" : isParent ? "Phụ huynh" : studentProfile?.grade_level || "Lớp 12",
      phoneNumber: user.phone_number || "",
    };

    const sessionToken = await createSessionToken({
      sub: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      studentCode: sessionUser.studentCode,
      avatarUrl: user.avatar_url || null,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Đăng nhập thành công!",
        user: sessionUser,
        redirectUrl,
        roleLabel: getRoleLabel(user.role),
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
