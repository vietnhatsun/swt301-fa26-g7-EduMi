import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  DEFAULT_SESSION_DURATION,
} from "@/lib/auth-session";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

  if (!code) {
    console.error("[Auth Callback]: No code found in request");
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookiesToSetLater: { name: string; value: string; options: any }[] = [];

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((item) => {
          cookiesToSetLater.push(item);
        });
      },
    },
  });

  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !sessionData?.user) {
    console.error("[Auth Callback Exchange Error]:", error?.message);
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const authUser = sessionData.user;
  const cleanEmail = authUser.email?.trim().toLowerCase();

  if (!cleanEmail) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const serviceClient = createServiceClient();

  // 1. Kiểm tra tài khoản trong bảng users
  const { data: dbUser } = await serviceClient
    .from("users")
    .select("id, email, password_hash, full_name, role, status, is_verified, avatar_url")
    .eq("email", cleanEmail)
    .maybeSingle();

  // 2. NẾU ĐÃ ĐĂNG KÝ BẰNG MẬT KHẨU (password_hash !== null):
  // -> CHẶN NGAY! Không cho phép dùng Google để đăng nhập hay ghi đè tài khoản này.
  if (dbUser && dbUser.password_hash !== null) {
    try {
      await supabase.auth.signOut();
    } catch (signOutErr) {
      console.warn("[OAuth Callback SignOut Error]:", signOutErr);
    }

    const conflictResponse = NextResponse.redirect(
      `${origin}/login?error=account_exists_with_password&email=${encodeURIComponent(cleanEmail)}`
    );
    // Xóa session cookie nếu có
    conflictResponse.cookies.set("edumi_session", "", { path: "/", maxAge: 0 });
    return conflictResponse;
  }

  // 3. NẾU LÀ TÀI KHOẢN GOOGLE HỢP LỆ (Chưa có trong DB, hoặc đã có và password_hash === null):
  let userId = dbUser?.id || authUser.id;
  const fullName =
    dbUser?.full_name ||
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    cleanEmail.split("@")[0];
  const avatarUrl =
    dbUser?.avatar_url ||
    authUser.user_metadata?.avatar_url ||
    authUser.user_metadata?.picture ||
    null;

  if (!dbUser) {
    // Người dùng mới đăng nhập Google lần đầu -> Tạo vào bảng users
    const { data: newUser } = await serviceClient
      .from("users")
      .insert({
        id: authUser.id,
        email: cleanEmail,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: "student",
        status: "active",
        is_verified: true,
        password_hash: null,
      })
      .select()
      .maybeSingle();

    if (newUser) {
      userId = newUser.id;
    }
  } else {
    // Đã có trong DB -> Cập nhật trạng thái active & verified
    await serviceClient
      .from("users")
      .update({
        is_verified: true,
        status: "active",
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dbUser.id);
  }

  // 4. Lấy hoặc tạo hồ sơ học sinh (student_profiles)
  let { data: studentProfile } = await serviceClient
    .from("student_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!studentProfile) {
    const studentCode = `EDM-${Math.floor(100000 + Math.random() * 900000)}`;
    const { data: newProfile } = await serviceClient
      .from("student_profiles")
      .insert({
        user_id: userId,
        student_code: studentCode,
        current_streak: 0,
        longest_streak: 0,
        total_points: 0,
      })
      .select()
      .maybeSingle();

    if (newProfile) {
      studentProfile = newProfile;
    }
  }

  // 5. Chuẩn bị response chuyển hướng
  const response = NextResponse.redirect(`${origin}${next}`);

  // Đính kèm các cookies của Supabase Auth
  cookiesToSetLater.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  // 6. Cấp thêm cookie phiên HTTP-Only edumi_session
  const sessionUser = {
    id: userId,
    email: cleanEmail,
    fullName: fullName,
    role: "student",
    avatarUrl: avatarUrl,
    studentCode: studentProfile?.student_code || "EDM-784920",
    streakCount: studentProfile?.current_streak || 0,
    longestStreak: studentProfile?.longest_streak || 0,
    totalPoints: studentProfile?.total_points || 0,
    schoolName: studentProfile?.school_name || "THPT EduMi",
    gradeLevel: studentProfile?.grade_level || "Lớp 12",
  };

  // 6. Cấp thêm cookie phiên HTTP-Only edumi_session có chữ ký HMAC-SHA256
  const sessionToken = await createSessionToken({
    sub: userId,
    email: cleanEmail,
    fullName: fullName,
    role: "student",
    avatarUrl: avatarUrl,
    studentCode: studentProfile?.student_code || "EDM-784920",
  });

  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEFAULT_SESSION_DURATION,
  });

  return response;
}

