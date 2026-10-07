import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  DEFAULT_SESSION_DURATION,
} from "@/lib/auth-session";
import { getRoleHomePath, isUserRole } from "@/lib/auth-roles";

function teacherCodeFromId(id: string) {
  return `GV-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");

  if (!code) {
    console.error("[Auth Callback]: No code found in request");
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookiesToSetLater: { name: string; value: string; options: CookieOptions }[] = [];

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
  const { data: dbUser } = await serviceClient
    .from("users")
    .select("id, email, password_hash, full_name, role, status, is_verified, avatar_url")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (dbUser && dbUser.password_hash !== null) {
    try {
      await supabase.auth.signOut();
    } catch (signOutErr) {
      console.warn("[OAuth Callback SignOut Error]:", signOutErr);
    }

    const conflictResponse = NextResponse.redirect(
      `${origin}/login?error=account_exists_with_password&email=${encodeURIComponent(cleanEmail)}`
    );
    conflictResponse.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
    return conflictResponse;
  }

  let userId = dbUser?.id || authUser.id;
  const userRole = isUserRole(dbUser?.role) ? dbUser.role : "student";
  const roleHomePath = getRoleHomePath(userRole);
  const redirectPath = userRole === "parent" ? roleHomePath : requestedNext?.startsWith("/") ? requestedNext : roleHomePath;
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
    const { data: newUser } = await serviceClient
      .from("users")
      .insert({
        id: authUser.id,
        email: cleanEmail,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: userRole,
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

  let studentCode = "";
  if (userRole === "student") {
    let { data: studentProfile } = await serviceClient
      .from("student_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!studentProfile) {
      const generatedCode = `EDM-${Math.floor(100000 + Math.random() * 900000)}`;
      const { data: newProfile } = await serviceClient
        .from("student_profiles")
        .insert({
          user_id: userId,
          student_code: generatedCode,
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

    studentCode = studentProfile?.student_code || "EDM-784920";
  } else if (userRole === "teacher") {
    studentCode = teacherCodeFromId(userId);

    const { data: teacherProfile } = await serviceClient
      .from("teacher_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!teacherProfile) {
      await serviceClient.from("teacher_profiles").insert({ user_id: userId });
    }
  }

  const response = NextResponse.redirect(`${origin}${redirectPath}`);

  cookiesToSetLater.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  const sessionToken = await createSessionToken({
    sub: userId,
    email: cleanEmail,
    fullName,
    role: userRole,
    avatarUrl,
    studentCode,
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
