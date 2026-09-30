import { describe, it, expect, beforeEach } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  getClaims,
  DEFAULT_SESSION_DURATION,
  SESSION_COOKIE_NAME,
  type SessionClaims,
} from "@/lib/auth-session";

// Helpers giải mã/mã hóa UTF-8 Base64URL trong môi trường test
function decodeBase64UrlJson(str: string) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function encodeBase64UrlJson(obj: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

describe("Authentication - Session Token & Claims Management (Unit Tests)", () => {
  const mockPayload = {
    sub: "usr_f89d3810-721a-4c2f-b4b1-e7373f1d882a",
    email: "student.edumi@gmail.com",
    fullName: "Nguyễn Văn An",
    role: "student" as const,
    studentCode: "EDM-123456",
    avatarUrl: null,
  };

  beforeEach(() => {
    process.env.NEXTAUTH_SECRET = "test-jwt-secret-key-edumi-swp391-2026";
  });

  describe("TC-SEC-01: createSessionToken", () => {
    it("phải tạo ra một chuỗi JWT hợp lệ gồm 3 phần (header.payload.signature)", async () => {
      const token = await createSessionToken(mockPayload);

      expect(typeof token).toBe("string");
      const parts = token.split(".");
      expect(parts.length).toBe(3);

      // Giải mã Header
      const header = decodeBase64UrlJson(parts[0]);
      expect(header).toEqual({ alg: "HS256", typ: "JWT" });

      // Giải mã Payload
      const payload = decodeBase64UrlJson(parts[1]);
      expect(payload.sub).toBe(mockPayload.sub);
      expect(payload.email).toBe(mockPayload.email);
      expect(payload.fullName).toBe(mockPayload.fullName);
      expect(payload.role).toBe(mockPayload.role);
      expect(payload.studentCode).toBe(mockPayload.studentCode);
      expect(payload.exp).toBeGreaterThan(payload.iat);
      expect(payload.exp - payload.iat).toBe(DEFAULT_SESSION_DURATION);
    });

    it("phải hỗ trợ tùy chỉnh thời hạn hết hạn (expiresInSeconds)", async () => {
      const customDuration = 3600; // 1 giờ
      const token = await createSessionToken(mockPayload, customDuration);

      const parts = token.split(".");
      const payload = decodeBase64UrlJson(parts[1]);
      expect(payload.exp - payload.iat).toBe(customDuration);
    });
  });

  describe("TC-SEC-02: verifySessionToken & getClaims", () => {
    it("phải xác thực thành công và trích xuất đúng các Claims từ token hợp lệ", async () => {
      const token = await createSessionToken(mockPayload);
      const claims = await verifySessionToken(token);

      expect(claims).not.toBeNull();
      expect(claims?.sub).toBe(mockPayload.sub);
      expect(claims?.email).toBe(mockPayload.email);
      expect(claims?.fullName).toBe(mockPayload.fullName);
      expect(claims?.role).toBe("student");
      expect(claims?.studentCode).toBe("EDM-123456");

      // getClaims là alias của verifySessionToken
      const aliasClaims = await getClaims(token);
      expect(aliasClaims).toEqual(claims);
    });
  });

  describe("TC-SEC-03: Security & Anti-Tampering (Chống giả mạo)", () => {
    it("phải từ chối và trả về null khi token bị chỉnh sửa nội dung payload", async () => {
      const validToken = await createSessionToken(mockPayload);
      const parts = validToken.split(".");

      // Giả mạo quyền từ "student" sang "admin"
      const fakeClaims: SessionClaims = {
        ...mockPayload,
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      const tamperedPayloadB64 = encodeBase64UrlJson(fakeClaims);

      const tamperedToken = `${parts[0]}.${tamperedPayloadB64}.${parts[2]}`;
      const result = await verifySessionToken(tamperedToken);

      expect(result).toBeNull();
    });

    it("phải từ chối và trả về null khi token có chữ ký sai", async () => {
      const validToken = await createSessionToken(mockPayload);
      const parts = validToken.split(".");

      // Thay đổi chữ ký
      const invalidSignature = "invalid_signature_xyz123";
      const tamperedToken = `${parts[0]}.${parts[1]}.${invalidSignature}`;

      const result = await verifySessionToken(tamperedToken);
      expect(result).toBeNull();
    });
  });

  describe("TC-SEC-04: Expiration & Boundary Cases (Thời hạn token)", () => {
    it("phải từ chối token đã hết hạn (exp < now)", async () => {
      // Tạo token với thời hạn âm (-10 giây)
      const expiredToken = await createSessionToken(mockPayload, -10);
      const result = await verifySessionToken(expiredToken);

      expect(result).toBeNull();
    });

    it("phải trả về null khi token rỗng, null hoặc sai định dạng", async () => {
      expect(await verifySessionToken("")).toBeNull();
      expect(await verifySessionToken("not-a-jwt")).toBeNull();
      expect(await verifySessionToken("part1.part2")).toBeNull();
      expect(await verifySessionToken("part1.part2.part3.part4")).toBeNull();
      // @ts-expect-error test invalid type input
      expect(await verifySessionToken(null)).toBeNull();
      // @ts-expect-error test undefined input
      expect(await verifySessionToken(undefined)).toBeNull();
    });
  });

  describe("Constant Variables Check", () => {
    it("phải đảm bảo hằng số tên Cookie là 'edumi_session'", () => {
      expect(SESSION_COOKIE_NAME).toBe("edumi_session");
    });

    it("phải đảm bảo thời hạn phiên mặc định là 7 ngày (604800 giây)", () => {
      expect(DEFAULT_SESSION_DURATION).toBe(7 * 24 * 60 * 60);
    });
  });
});
