/**
 * EduMi - Cryptographic Auth Session & JWT Claims Helper
 * 
 * Sử dụng Web Crypto API (chuẩn W3C) - Tương thích 100% với Next.js Edge Runtime,
 * Node.js Server Components và Route Handlers mà không phụ thuộc thư viện ngoài.
 * Cung cấp:
 * 1. Ký chữ ký số HMAC-SHA256 bảo vệ Session Token.
 * 2. Xác thực và trích xuất Claims (Role, Sub/ID, Email, FullName, Exp).
 * 3. Kiểm tra tính hợp lệ và thời hạn của Token chống giả mạo client.
 */

export interface SessionClaims {
  sub: string; // User ID (UUID)
  email: string; // User Email
  fullName: string; // Tên hiển thị
  role: "student" | "teacher" | "parent" | "staff" | "admin"; // Phân quyền
  studentCode?: string; // Mã học sinh (EDM-XXXXXX)
  avatarUrl?: string | null;
  iat: number; // Issued at (Unix timestamp tính bằng giây)
  exp: number; // Expiration (Unix timestamp tính bằng giây)
}

export const SESSION_COOKIE_NAME = "edumi_session";
export const DEFAULT_SESSION_DURATION = 60 * 60 * 24 * 7; // 7 ngày (giây)

function getSecretKey(): string {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "edumi-jwt-secure-secret-key-2026-production"
  );
}

// Chuyển đổi Uint8Array sang Base64URL
function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Chuyển đổi Base64URL sang Uint8Array
function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Nhập HMAC Key từ Secret
async function getCryptoKey(usage: "sign" | "verify"): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSecretKey()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

/**
 * Ký và phát hành Session Token chuẩn JWT có gắn Claims và chữ ký số HMAC-SHA256
 */
export async function createSessionToken(
  payload: Omit<SessionClaims, "iat" | "exp">,
  expiresInSeconds: number = DEFAULT_SESSION_DURATION
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullClaims: SessionClaims = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const enc = new TextEncoder();
  const headerJson = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const claimsJson = JSON.stringify(fullClaims);

  const headerB64 = toBase64Url(enc.encode(headerJson));
  const payloadB64 = toBase64Url(enc.encode(claimsJson));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await getCryptoKey("sign");
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput));
  const signatureB64 = toBase64Url(new Uint8Array(signature));

  return `${signingInput}.${signatureB64}`;
}

/**
 * Xác minh chữ ký số của Token và trích xuất Claims (getClaims)
 * Trả về null nếu:
 * - Token sai format hoặc bị can thiệp sửa đổi dù chỉ 1 ký tự
 * - Chữ ký không khớp với Secret Key
 * - Token đã hết hạn (exp < now)
 */
export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    const enc = new TextEncoder();
    const signingInput = `${headerB64}.${payloadB64}`;
    const signatureBytes = fromBase64Url(signatureB64);

    const key = await getCryptoKey("verify");
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(signingInput)
    );

    if (!isValid) {
      console.warn("[Auth Security]: Token signature verification failed (tampered token).");
      return null;
    }

    const dec = new TextDecoder();
    const payloadJson = dec.decode(fromBase64Url(payloadB64));
    const claims = JSON.parse(payloadJson) as SessionClaims;

    // Kiểm tra thời hạn Claims (exp)
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) {
      console.warn("[Auth Security]: Token has expired.");
      return null;
    }

    return claims;
  } catch (error) {
    console.error("[Auth Security]: Error parsing or verifying session token:", error);
    return null;
  }
}

/**
 * Trích xuất Claims từ token (alias cho verifySessionToken)
 */
export async function getClaims(token: string): Promise<SessionClaims | null> {
  return verifySessionToken(token);
}
