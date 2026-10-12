import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export type AuthenticatedDbUser = {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "teacher" | "parent" | "staff" | "admin";
  avatar_url: string | null;
  phone_number: string | null;
  status: string;
  is_verified: boolean;
};

/**
 * Lấy thông tin user hiện tại từ Cookie session (edumi_session hoặc Supabase Auth)
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedDbUser | null> {
  const supabase = createServiceClient();

  // 1. Kiểm tra session cookie edumi_session
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionCookie) {
    try {
      const claims = await verifySessionToken(sessionCookie);
      if (claims?.sub) {
        const { data: user } = await supabase
          .from("users")
          .select("id, email, full_name, role, avatar_url, phone_number, status, is_verified")
          .eq("id", claims.sub)
          .maybeSingle<AuthenticatedDbUser>();

        if (user && user.is_verified) {
          return user;
        }
      }
    } catch (err) {
      console.warn("[Auth Helper] Session cookie verification failed:", err);
    }
  }

  // 2. Fallback sang Supabase SSR cookie
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
        .maybeSingle<AuthenticatedDbUser>();

      if (dbUser) {
        return dbUser;
      }
    }
  } catch (err) {
    console.warn("[Auth Helper] Supabase auth check error:", err);
  }

  return null;
}
