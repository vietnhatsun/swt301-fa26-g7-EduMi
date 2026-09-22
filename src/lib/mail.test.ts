import { describe, it, expect, vi } from "vitest";
import { sendVerificationOtpEmail } from "./mail";

// Mock resend module with standard constructor function
vi.mock("resend", () => {
  return {
    Resend: class {
      emails = {
        send: vi.fn().mockResolvedValue({
          data: { id: "test-email-id" },
          error: null,
        }),
      };
    },
  };
});

describe("Mail Service - sendVerificationOtpEmail", () => {
  it("should format email correctly with OTP, full name and student role", async () => {
    process.env.RESEND_API_KEY = "test_key";
    process.env.EMAIL_FROM = "EduMi <support@edumi.vn>";

    const result = await sendVerificationOtpEmail(
      "student@edumi.vn",
      "123456",
      "Nguyen Van A",
      "student"
    );

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: "test-email-id" });
  });

  it("should handle missing RESEND_API_KEY gracefully", async () => {
    delete process.env.RESEND_API_KEY;

    const result = await sendVerificationOtpEmail(
      "student@edumi.vn",
      "123456"
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("RESEND_API_KEY");
  });
});
