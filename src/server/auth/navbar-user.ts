import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth-session";
import type { UserSession } from "@/components/landing/LandingNavbarClient";

export async function getNavbarUser(): Promise<UserSession | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  try {
    if (sessionCookie) {
      const claims = await verifySessionToken(sessionCookie);

      if (claims?.sub) {
        return {
          id: claims.sub,
          fullName: claims.fullName,
          role: claims.role,
          studentCode: claims.studentCode,
          avatarUrl: claims.avatarUrl ?? null,
        };
      }
    }

    const supabaseServer = await createServerSupabaseClient();
    const {
      data: { user: supabaseUser },
    } = await supabaseServer.auth.getUser();

    if (!supabaseUser?.email) return null;

    const { data: dbUser } = await createServiceClient()
      .from("users")
      .select("id, email, full_name, role, avatar_url, status, is_verified")
      .eq("email", supabaseUser.email.toLowerCase())
      .maybeSingle();

    if (!dbUser || !dbUser.is_verified || dbUser.status !== "active") return null;

    return {
      id: dbUser.id,
      fullName: dbUser.full_name,
      role: dbUser.role,
      avatarUrl: dbUser.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
    };
  } catch (error) {
    console.warn("[Navbar User Server Check]:", error);
    return null;
  }
}