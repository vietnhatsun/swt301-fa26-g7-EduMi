import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HIPZI — Học thông minh cùng AI",
  description:
    "Nền tảng giáo dục trực tuyến ứng dụng AI dành cho học sinh Việt Nam. Tài liệu học tập, luyện đề thi thử, lớp học ảo và khóa học e-learning.",
};

const features = [
  {
    icon: "📚",
    title: "Kho Tài Liệu",
    desc: "Hàng nghìn tài liệu PDF, Word được kiểm duyệt bởi giáo viên đã xác thực. Tìm kiếm, lọc theo môn học, lớp.",
    color: "#6c63ff",
  },
  {
    icon: "🎯",
    title: "Phòng Thi Thử",
    desc: "Luyện đề thi trắc nghiệm với đồng hồ đếm ngược. Kết quả tức thì, lịch sử điểm số chi tiết.",
    color: "#ff6584",
  },
  {
    icon: "🤖",
    title: "AI Trợ Giảng",
    desc: "Chatbot AI tư vấn lộ trình học tập, gợi ý tài liệu và khóa học phù hợp với từng học sinh.",
    color: "#43e97b",
  },
  {
    icon: "🏫",
    title: "Lớp Học Ảo",
    desc: "Tham gia lớp học với mã code, nộp bài tập, làm quiz và nhận phản hồi trực tiếp từ giáo viên.",
    color: "#ffd93d",
  },
  {
    icon: "📖",
    title: "Khóa Học E-Learning",
    desc: "Học theo lộ trình có cấu trúc với video và bài học text. Thanh toán qua VietQR tiện lợi.",
    color: "#f093fb",
  },
  {
    icon: "✨",
    title: "AI Quét Đề Thi",
    desc: "Giáo viên chụp ảnh đề thi, AI tự động bóc tách thành bộ câu hỏi trắc nghiệm/tự luận.",
    color: "#4facfe",
  },
];

const stats = [
  { value: "10,000+", label: "Học sinh" },
  { value: "500+", label: "Giáo viên" },
  { value: "50,000+", label: "Tài liệu" },
  { value: "99%", label: "Uptime" },
];

const roles = [
  {
    icon: "🎓",
    role: "Học Sinh",
    points: [
      "Truy cập tài liệu miễn phí",
      "Luyện đề thi thử mọi lúc",
      "Tham gia lớp học ảo",
      "Mua khóa học yêu thích",
    ],
  },
  {
    icon: "👨‍🏫",
    role: "Giáo Viên",
    points: [
      "Tải lên tài liệu học tập",
      "Tạo và quản lý lớp học",
      "Xây dựng khóa học có phí",
      "Kiếm thu nhập từ nền tảng",
    ],
  },
  {
    icon: "👨‍👩‍👧",
    role: "Phụ Huynh",
    points: [
      "Theo dõi điểm số của con",
      "Xem lịch học và bài tập",
      "Giám sát tiến trình học",
      "Kết nối với giáo viên",
    ],
  },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      {/* ── Navbar ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(10,10,26,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              H
            </div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
              className="gradient-text-blue"
            >
              HIPZI
            </span>
          </div>

          {/* Nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>
              Tính năng
            </a>
            <a href="#roles" style={{ color: "inherit", textDecoration: "none" }}>
              Vai trò
            </a>
            <a href="#stats" style={{ color: "inherit", textDecoration: "none" }}>
              Thống kê
            </a>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/dang-nhap" className="btn-secondary" style={{ padding: "10px 20px", fontSize: "0.875rem" }}>
              Đăng nhập
            </a>
            <a href="/dang-ky" className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.875rem" }}>
              Bắt đầu miễn phí
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: 160,
          paddingBottom: 120,
          textAlign: "center",
        }}
      >
        {/* Background orbs */}
        <div
          className="orb animate-float"
          style={{
            width: 600,
            height: 600,
            background: "#6c63ff",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.15,
          }}
        />
        <div
          className="orb"
          style={{
            width: 300,
            height: 300,
            background: "#ff6584",
            top: 100,
            left: "10%",
            opacity: 0.12,
          }}
        />
        <div
          className="orb"
          style={{
            width: 250,
            height: 250,
            background: "#43e97b",
            top: 200,
            right: "8%",
            opacity: 0.1,
          }}
        />

        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          {/* Badge */}
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 100,
              background: "rgba(108,99,255,0.12)",
              border: "1px solid rgba(108,99,255,0.3)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#a78bfa",
              marginBottom: 32,
            }}
          >
            <span>✨</span>
            <span>Nền tảng giáo dục AI đầu tiên tại Việt Nam</span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 24px",
            }}
          >
            Học thông minh hơn
            <br />
            <span className="gradient-text">cùng trí tuệ nhân tạo</span>
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              maxWidth: 600,
              margin: "0 auto 48px",
              lineHeight: 1.7,
            }}
          >
            Tài liệu học tập chất lượng · Luyện đề AI · Lớp học ảo · Khóa học e-learning.
            Tất cả trong một nền tảng dành cho học sinh Việt Nam.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-in-up delay-300"
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <a href="/dang-ky" className="btn-primary animate-pulse-glow">
              🚀 Bắt đầu miễn phí
            </a>
            <a href="#features" className="btn-secondary">
              Xem tính năng →
            </a>
          </div>

          {/* Social proof */}
          <div
            className="animate-fade-in-up delay-400"
            style={{
              marginTop: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            <div style={{ display: "flex" }}>
              {["👩‍🎓", "👨‍🎓", "👩‍🏫", "👨‍🏫", "🧑‍🎓"].map((e, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "1.5rem",
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
            <span>Hơn <strong style={{ color: "var(--text-primary)" }}>10,000</strong> học sinh đang học mỗi ngày</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" style={{ padding: "60px 24px", background: "rgba(108,99,255,0.05)" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "32px 16px" }}>
              <div
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 900,
                  marginBottom: 8,
                }}
                className="gradient-text"
              >
                {s.value}
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: 100,
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.25)",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#a78bfa",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              Tính năng
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              Mọi thứ bạn cần để{" "}
              <span className="gradient-text">học hiệu quả</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Hệ sinh thái học tập toàn diện — từ tài liệu đến lớp học, từ luyện đề đến AI trợ giảng.
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {features.map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: 32 }}>
                {/* Icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.75rem",
                    marginBottom: 20,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    marginBottom: 12,
                    color: "var(--text-primary)",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.925rem", margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section
        id="roles"
        style={{
          padding: "100px 24px",
          background: "linear-gradient(180deg, transparent, rgba(108,99,255,0.06), transparent)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: 100,
                background: "rgba(255,101,132,0.12)",
                border: "1px solid rgba(255,101,132,0.25)",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#ff6584",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}
            >
              Vai trò
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              HIPZI dành cho <span className="gradient-text">tất cả mọi người</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 28,
            }}
          >
            {roles.map((r, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ padding: 36, position: "relative", overflow: "hidden" }}
              >
                {/* Glow */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    background: ["#6c63ff", "#ff6584", "#43e97b"][i],
                    borderRadius: "50%",
                    filter: "blur(40px)",
                    opacity: 0.15,
                  }}
                />

                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{r.icon}</div>
                <h3
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: 800,
                    marginBottom: 20,
                    color: "var(--text-primary)",
                  }}
                >
                  {r.role}
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {r.points.map((p, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "var(--text-secondary)",
                        fontSize: "0.925rem",
                        padding: "8px 0",
                        borderBottom: j < r.points.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}
                    >
                      <span style={{ color: "#43e97b", fontSize: "1rem" }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "80px 24px" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
            padding: "72px 48px",
            borderRadius: 28,
            background: "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(139,92,246,0.15))",
            border: "1px solid rgba(108,99,255,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="orb animate-float"
            style={{
              width: 400,
              height: 400,
              background: "#6c63ff",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.12,
            }}
          />
          <div style={{ position: "relative" }}>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 900,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Sẵn sàng học thông minh hơn?
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: 40,
                fontSize: "1.1rem",
                lineHeight: 1.7,
              }}
            >
              Tham gia miễn phí ngay hôm nay — không cần thẻ tín dụng.
              <br />
              Bắt đầu luyện đề, tham gia lớp học và học cùng AI.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/dang-ky" className="btn-primary">
                🎓 Đăng ký học sinh
              </a>
              <a href="/dang-ky?role=teacher" className="btn-secondary">
                👨‍🏫 Đăng ký giáo viên
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "40px 24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.875rem",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              H
            </div>
            <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>HIPZI</span>
          </div>
          <p style={{ margin: 0 }}>
            © 2026 HIPZI. Nền tảng giáo dục trực tuyến ứng dụng AI tại Việt Nam.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Điều khoản</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Bảo mật</a>
            <a href="https://github.com/ngocthach324/EduMi" style={{ color: "inherit", textDecoration: "none" }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
