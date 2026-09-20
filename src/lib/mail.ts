import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Service gửi email qua Resend cho hệ sinh thái EduMi
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo = "support@edumi.vn",
}: SendEmailParams) {
  try {
    const fromAddress = process.env.EMAIL_FROM || "EduMi <support@edumi.vn>";

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      replyTo,
      subject,
      html,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định khi gửi email";
    console.error("[SendEmail Exception]:", message);
    return { success: false, error: message };
  }
}

/**
 * Template mẫu gửi mã xác thực OTP kích hoạt tài khoản
 */
export async function sendVerificationOtpEmail(to: string, otpCode: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8faf8; margin: 0; padding: 20px; }
          .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
          .header { background: linear-gradient(135deg, #064e3b, #047857); padding: 24px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 22px; font-weight: bold; }
          .body { padding: 32px 24px; color: #1e293b; line-height: 1.6; }
          .otp-box { background: #f0fdf4; border: 1px dashed #10b981; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #047857; margin: 0; }
          .footer { padding: 16px 24px; background: #f8fafc; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>EduMi — AI Education</h1>
          </div>
          <div class="body">
            <h2 style="margin-top: 0; color: #0f172a; font-size: 18px;">Xác thực tài khoản EduMi của bạn 🚀</h2>
            <p>Chào bạn,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản trên nền tảng học tập <strong>EduMi</strong>. Đây là mã xác thực OTP của bạn:</p>
            <div class="otp-box">
              <p class="otp-code">${otpCode}</p>
            </div>
            <p style="font-size: 13px; color: #64748b;">Mã này có hiệu lực trong vòng <strong>10 phút</strong>. Vui lòng không chia sẻ mã xác thực này cho bất kỳ ai để đảm bảo an toàn tài khoản.</p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} EduMi Platform. Mọi quyền được bảo lưu.</p>
            <p style="margin: 4px 0 0;">Cần hỗ trợ? Gửi email về <a href="mailto:support@edumi.vn" style="color: #059669; text-decoration: none;">support@edumi.vn</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `[EduMi] Mã xác thực OTP: ${otpCode}`,
    html,
  });
}
