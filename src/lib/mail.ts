import { Resend } from "resend";

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
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[Resend Warning]: RESEND_API_KEY chưa được cấu hình.");
      return { success: false, error: "RESEND_API_KEY chưa được cấu hình trong biến môi trường." };
    }

    const resend = new Resend(apiKey);
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
 * Role display helper
 */
const ROLE_NAMES: Record<string, string> = {
  student: "Học sinh",
  teacher: "Giáo viên",
  parent: "Phụ huynh",
  admin: "Quản trị viên",
};

/**
 * Template gửi mã xác thực OTP kích hoạt tài khoản
 * Thiết kế chuẩn Forest Green & White hiện đại, sang trọng
 */
export async function sendVerificationOtpEmail(
  to: string,
  otpCode: string,
  fullName?: string,
  role: string = "student"
) {
  const roleName = ROLE_NAMES[role] || "Thành viên";
  const greetingName = fullName ? `${fullName} (${roleName})` : roleName;

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã xác thực EduMi</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7f4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f7f4;
      padding: 40px 12px;
    }
    .container {
      max-width: 520px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(6, 78, 59, 0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%);
      padding: 36px 28px 30px;
      text-align: center;
      position: relative;
    }
    .badge-logo {
      display: inline-block;
      width: 44px;
      height: 44px;
      line-height: 44px;
      border-radius: 50%;
      background: #fbbf24;
      color: #0f172a;
      font-weight: 900;
      font-size: 14px;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      margin-bottom: 12px;
    }
    .brand-title {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      margin: 4px 0 0;
      color: #a7f3d0;
      font-size: 13px;
      font-weight: 500;
    }
    .content {
      padding: 36px 28px 28px;
    }
    .headline {
      margin: 0 0 16px;
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.3px;
    }
    .text {
      margin: 0 0 16px;
      font-size: 14px;
      line-height: 1.65;
      color: #475569;
    }
    .highlight-name {
      color: #047857;
      font-weight: 600;
    }
    .otp-container {
      background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%);
      border: 2px dashed #10b981;
      border-radius: 16px;
      padding: 24px 16px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-label {
      margin: 0 0 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #047857;
      font-weight: 700;
    }
    .otp-code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #064e3b;
      margin: 0;
      padding-left: 10px;
    }
    .expiry-note {
      display: inline-block;
      margin-top: 10px;
      font-size: 12px;
      color: #059669;
      background: #d1fae5;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
    }
    .security-notice {
      background: #f8fafc;
      border-left: 4px solid #10b981;
      border-radius: 8px;
      padding: 14px 16px;
      margin: 24px 0 0;
      font-size: 12px;
      line-height: 1.6;
      color: #64748b;
    }
    .security-notice strong {
      color: #334155;
    }
    .footer {
      background: #f8fafc;
      padding: 24px 28px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #059669;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-divider {
      margin: 12px auto;
      width: 40px;
      height: 2px;
      background: #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- Top Brand Header -->
      <div class="header">
        <div class="badge-logo">EDM</div>
        <h1 class="brand-title">EduMi Platform</h1>
        <p class="brand-subtitle">Nền tảng học tập thông minh & đồng hành cùng phụ huynh</p>
      </div>

      <!-- Main Content -->
      <div class="content">
        <h2 class="headline">Xác thực tài khoản của bạn ✨</h2>
        <p class="text">
          Xin chào <span class="highlight-name">${greetingName}</span>,
        </p>
        <p class="text">
          Cảm ơn bạn đã đăng ký tài khoản trên nền tảng <strong>EduMi</strong>. Để hoàn tất kích hoạt và bắt đầu hành trình học tập, vui lòng nhập mã OTP xác thực dưới đây vào ứng dụng:
        </p>

        <!-- OTP Display Box -->
        <div class="otp-container">
          <div class="otp-label">Mã xác thực của bạn</div>
          <div class="otp-code">${otpCode}</div>
          <div class="expiry-note">⏳ Hiệu lực trong vòng 10 phút</div>
        </div>

        <!-- Security Warning -->
        <div class="security-notice">
          <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên hỗ trợ EduMi. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div>© ${new Date().getFullYear()} EduMi Platform. All rights reserved.</div>
        <div class="footer-divider"></div>
        <div>
          Cần trợ giúp? Liên hệ <a href="mailto:support@edumi.vn">support@edumi.vn</a>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject: `[EduMi] Mã xác thực OTP của bạn: ${otpCode}`,
    html,
  });
}
