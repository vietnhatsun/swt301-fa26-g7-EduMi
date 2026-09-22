import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("edumi_session")?.value;
    const supabase = createServiceClient();

    // 1. Kiểm tra session cookie nội bộ của EduMi
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(Buffer.from(sessionCookie, "base64url").toString("utf8"));
        if (parsed?.id) {
          // Lấy dữ liệu mới nhất từ database
          const { data: user } = await supabase
            .from("users")
            .select("id, email, full_name, role, avatar_url, phone_number, status, is_verified")
            .eq("id", parsed.id)
            .maybeSingle();

          if (user && user.is_verified && user.status === "active") {
            const { data: studentProfile } = await supabase
              .from("student_profiles")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();

            return NextResponse.json({
              user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                avatarUrl: user.avatar_url || null,
                studentCode: studentProfile?.student_code || parsed.studentCode || "EDM-784920",
                streakCount: studentProfile?.current_streak ?? parsed.streakCount ?? 0,
                longestStreak: studentProfile?.longest_streak ?? parsed.longestStreak ?? 0,
                totalPoints: studentProfile?.total_points ?? parsed.totalPoints ?? 0,
                schoolName: studentProfile?.school_name || "THPT EduMi",
                gradeLevel: studentProfile?.grade_level || "Lớp 12",
                phoneNumber: user.phone_number || "",
              },
            });
          }
        }
      } catch (cookieErr) {
        console.warn("[Auth Me Cookie Parse Error]:", cookieErr);
      }
    }

    // 2. Kiểm tra nếu đăng nhập qua Supabase Auth (Google OAuth)
    try {
      const supabaseServer = await createServerSupabaseClient();
      const {
        data: { user: sbUser },
      } = await supabaseServer.auth.getUser();

      if (sbUser?.email) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id, email, full_name, role, avatar_url, phone_number, status, is_verified")
          .eq("email", sbUser.email.toLowerCase())
          .maybeSingle();

        if (dbUser) {
          const { data: studentProfile } = await supabase
            .from("student_profiles")
            .select("*")
            .eq("user_id", dbUser.id)
            .maybeSingle();

          return NextResponse.json({
            user: {
              id: dbUser.id,
              email: dbUser.email,
              fullName: dbUser.full_name,
              role: dbUser.role,
              avatarUrl: dbUser.avatar_url || sbUser.user_metadata?.avatar_url || null,
              studentCode: studentProfile?.student_code || "EDM-784920",
              streakCount: studentProfile?.current_streak ?? 0,
              longestStreak: studentProfile?.longest_streak ?? 0,
              totalPoints: studentProfile?.total_points ?? 0,
              schoolName: studentProfile?.school_name || "THPT EduMi",
              gradeLevel: studentProfile?.grade_level || "Lớp 12",
              phoneNumber: dbUser.phone_number || "",
            },
          });
        }
      }
    } catch (sbErr) {
      console.warn("[Auth Me Supabase Check Error]:", sbErr);
    }

    // Không tìm thấy phiên đăng nhập hợp lệ
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  } catch (error: unknown) {
    console.error("[Auth Me API Exception]:", error);
    return NextResponse.json({ error: "Lỗi kiểm tra phiên đăng nhập." }, { status: 500 });
  }
}
