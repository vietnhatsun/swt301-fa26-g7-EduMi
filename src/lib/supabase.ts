import { createClient } from "@supabase/supabase-js";
import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase Client cho Client Components (Browser)
 * Tự động đồng bộ session cookie theo chuẩn PKCE của Supabase SSR.
 * An toàn tuyệt đối để sử dụng trong các Client Component ("use client").
 */
export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY chưa được cấu hình."
    );
  }

  return createSSRBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Supabase Client cho Server-side Administrative (API Routes)
 * Sử dụng Service Role Key để bypass RLS một cách an toàn trên server
 */
export function createServiceClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY chưa được cấu hình."
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
