import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-session";
import { getRoleHomePath } from "@/lib/auth-roles";

type DbUser = {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "teacher" | "parent" | "staff" | "admin";
  avatar_url: string | null;
  phone_number: string | null;
  status: string;
  is_verified: boolean;
};

function teacherCodeFromId(id: string) {
  return `GV-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

async function buildUserPayload(supabase: ReturnType<typeof createServiceClient>, user: DbUser, fallbackAvatar?: string | null) {
  if (user.role === "parent") {
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      avatarUrl: user.avatar_url || fallbackAvatar || null,
      studentCode: "",
      streakCount: 0,
      longestStreak: 0,
      totalPoints: 0,
      schoolName: "EduMi Platform",
      gradeLevel: "Phụ huynh",
      phoneNumber: user.phone_number || "",
      redirectUrl: getRoleHomePath(user.role),
    };
  }
  if (user.role === "staff") {
    const staffCode = `NV-${user.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      avatarUrl: user.avatar_url || fallbackAvatar || null,
      studentCode: staffCode,
      staffCode,
      streakCount: 0,
      longestStreak: 0,
      totalPoints: 0,
      schoolName: "EduMi Platform",
      gradeLevel: "Nhân viên",
      phoneNumber: user.phone_number || "",
      ratingAvg: 5,
      redirectUrl: getRoleHomePath(user.role),
    };
  }
  if (user.role === "teacher") {
    const { data: teacherProfile } = await supabase
      .from("teacher_profiles")
      .select("teacher_code, headline, bio, subjects, is_verified_educator, rating_avg, total_reviews, gender, teacher_role, work_experience, grade_levels, degree, experience_years, certificate_url, certificate_file_name, certificate_file_size, verification_status")
      .eq("user_id", user.id)
      .maybeSingle();

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      avatarUrl: user.avatar_url || fallbackAvatar || null,
      studentCode: teacherProfile?.teacher_code || teacherCodeFromId(user.id),
      teacherCode: teacherProfile?.teacher_code || teacherCodeFromId(user.id),
      headline: teacherProfile?.headline || "",
      bio: teacherProfile?.bio || "",
      subjects: teacherProfile?.subjects || [],
      gender: teacherProfile?.gender || null,
      teacherRole: teacherProfile?.teacher_role || null,
      workExperience: teacherProfile?.work_experience || "",
      gradeLevels: teacherProfile?.grade_levels || [],
      degree: teacherProfile?.degree || "",
      experienceYears: teacherProfile?.experience_years || "",
      certificateUrl: teacherProfile?.certificate_url || null,
      certificateFileName: teacherProfile?.certificate_file_name || null,
      certificateFileSize: teacherProfile?.certificate_file_size || null,
      verificationStatus: teacherProfile?.verification_status || "draft",
      isVerifiedEducator: teacherProfile?.is_verified_educator ?? false,
      ratingAvg: teacherProfile?.rating_avg ? Number(teacherProfile.rating_avg) : 0,
      totalReviews: teacherProfile?.total_reviews ?? 0,
      streakCount: 0,
      longestStreak: 0,
      totalPoints: 0,
      schoolName: "EduMi Platform",
      gradeLevel: "Giáo viên",
      phoneNumber: user.phone_number || "",
      redirectUrl: getRoleHomePath(user.role),
    };
  }

  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    avatarUrl: user.avatar_url || fallbackAvatar || null,
    studentCode: studentProfile?.student_code || "EDM-784920",
    streakCount: studentProfile?.current_streak ?? 0,
    longestStreak: studentProfile?.longest_streak ?? 0,
    totalPoints: studentProfile?.total_points ?? 0,
    schoolName: studentProfile?.school_name || "THPT EduMi",
    gradeLevel: studentProfile?.grade_level || "Lớp 12",
    phoneNumber: user.phone_number || "",
    redirectUrl: getRoleHomePath(user.role),
  };
}

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const supabase = createServiceClient();

    if (sessionCookie) {
      try {
        const claims = await verifySessionToken(sessionCookie);
        if (claims?.sub) {
          const { data: user } = await supabase
            .from("users")
            .select("id, email, full_name, role, avatar_url, phone_number, status, is_verified")
            .eq("id", claims.sub)
            .maybeSingle<DbUser>();

          if (user && user.is_verified && user.status === "active") {
            return NextResponse.json({
              user: await buildUserPayload(supabase, user),
              claims: {
                sub: claims.sub,
                role: claims.role,
                email: claims.email,
                exp: claims.exp,
              },
            });
          }
        }
      } catch (cookieErr) {
        console.warn("[Auth Me Claims Verification Error]:", cookieErr);
      }
    }

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
          .maybeSingle<DbUser>();

        if (dbUser) {
          return NextResponse.json({
            user: await buildUserPayload(supabase, dbUser, sbUser.user_metadata?.avatar_url || null),
          });
        }
      }
    } catch (sbErr) {
      console.warn("[Auth Me Supabase Check Error]:", sbErr);
    }

    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  } catch (error: unknown) {
    console.error("[Auth Me API Exception]:", error);
    return NextResponse.json({ error: "Lỗi kiểm tra phiên đăng nhập." }, { status: 500 });
  }
}
