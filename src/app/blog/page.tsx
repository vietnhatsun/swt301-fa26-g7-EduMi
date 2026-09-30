"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Globe,
  MessageSquare,
  Bell,
  Clock,
  Crown,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Share2,
  Bookmark,
  X,
  GraduationCap,
  Flame,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu bài viết Blog
interface BlogPost {
  id: string;
  category: "Tips" | "Ngữ pháp" | "Từ vựng" | "Phát âm" | "Chiến lược" | "Tin tức";
  title: string;
  summary: string;
  publishDate: string;
  readTime: string;
  isFeatured?: boolean;
  bgGradient: string;
  illustrationType:
    | "writing-typewriter"
    | "speaking-mindmap"
    | "festival-cats"
    | "pasture-sky"
    | "apple-tree"
    | "speech-bubbles"
    | "snoopy-night";
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      bulletPoints?: string[];
      highlightBox?: string;
    }[];
    conclusion: string;
  };
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "notif-1",
    category: "Tips",
    title: "Kỹ thuật tư duy cho IELTS Writing Task 2",
    summary:
      "Hướng dẫn phương pháp tư duy lập luận tuyến tính (Linear Thinking), bóc tách đề bài và phát triển luận điểm mạch lạc, đạt điểm cao tiêu chí Task Response và Coherence.",
    publishDate: "09/09/2026",
    readTime: "1 phút đọc",
    isFeatured: true,
    bgGradient: "from-amber-200 via-yellow-300 to-lime-300",
    illustrationType: "writing-typewriter",
    content: {
      intro:
        "Writing Task 2 luôn là một trong những phần thi gây khó khăn nhất cho thí sinh vì yêu cầu không chỉ ở vốn từ vựng mà còn ở tư duy phân tích và cấu trúc bài luận logic.",
      sections: [
        {
          heading: "1. Phương pháp Tư duy Tuyến tính (Linear Thinking)",
          body: "Tư duy tuyến tính giúp bạn xây dựng chuỗi lập luận nguyên nhân - kết quả mà không bị lan man hay lạc đề.",
          bulletPoints: [
            "Bước 1: Xác định từ khóa trọng tâm (Keywords) và giới hạn của đề bài (Micro-topic).",
            "Bước 2: Đặt câu hỏi 'Tại sao điều này xảy ra?' để tìm luận điểm cấp 1 (Main Idea).",
            "Bước 3: Đặt tiếp câu hỏi 'Hệ quả trực tiếp là gì?' để tạo lập luận cấp 2 (Explanation & Example).",
          ],
          highlightBox:
            "💡 Mẹo từ EduMi: Mỗi đoạn thân bài chỉ nên phát triển tối đa 1 - 2 ý tưởng chính và đào sâu phân tích thay vì liệt kê quá nhiều ý hời hợt.",
        },
        {
          heading: "2. Cấu trúc một đoạn Thân bài (Body Paragraph) chuẩn Band 7.5+",
          body: "Áp dụng công thức P-E-E-L (Point - Explanation - Example - Link) để đoạn văn đạt độ liên kết chặt chẽ:",
          bulletPoints: [
            "Point: Câu chủ đề nêu rõ luận điểm của đoạn.",
            "Explanation: Giải thích chi tiết cơ chế hoặc nguyên nhân (2-3 câu).",
            "Example: Ví dụ cụ thể hoặc số liệu thực tế minh họa.",
            "Link: Câu chốt kết nối lại với chủ đề bài thi.",
          ],
        },
      ],
      conclusion:
        "Luyện tập thói quen lập dàn ý 5 phút trước khi viết sẽ giúp bạn tiết kiệm thời gian và đảm bảo tính mạch lạc tuyệt đối cho toàn bộ bài viết.",
    },
  },
  {
    id: "notif-2",
    category: "Tips",
    title: "Mở khóa band 7.0+ IELTS Speaking",
    summary:
      "Bí quyết cải thiện độ trôi chảy (Fluency), sử dụng idioms tự nhiên và kỹ thuật kéo dài câu trả lời trong Part 1 và Part 3.",
    publishDate: "05/09/2026",
    readTime: "1 phút đọc",
    bgGradient: "from-blue-200 via-indigo-200 to-purple-200",
    illustrationType: "speaking-mindmap",
    content: {
      intro:
        "Để bứt phá từ band 6.0 lên 7.0+ trong Speaking, điều quan trọng nhất không phải là nói thật nhanh mà là độ tự nhiên, phản xạ linh hoạt và cấu trúc câu đa dạng.",
      sections: [
        {
          heading: "Kỹ thuật Mở Rộng Câu Trả Lời (A-R-E-A)",
          body: "Áp dụng cấu trúc Answer - Reason - Example - Alternative khi trả lời bất kỳ câu hỏi nào của giám khảo.",
          bulletPoints: [
            "Answer: Trả lời trực tiếp vào trọng tâm.",
            "Reason: Nêu lý do vì sao bạn nghĩ như vậy.",
            "Example: Đưa ví dụ từ trải nghiệm bản thân.",
            "Alternative: Nêu trường hợp ngoại lệ hoặc góc nhìn ngược lại.",
          ],
          highlightBox:
            "🗣️ Tránh lạm dụng từ nối rập khuôn như 'First and foremost', hãy thay bằng 'To begin with', 'The main reason is that...'.",
        },
      ],
      conclusion:
        "Hãy ghi âm lại giọng nói của bạn mỗi ngày trên ứng dụng EduMi để Capy AI phân tích lỗi ngữ điệu và phát âm nhé!",
    },
  },
  {
    id: "notif-3",
    category: "Tips",
    title: 'Nói về "Lễ hội" trong IELTS Speaking Part 2',
    summary:
      "Tuyển tập từ vựng chủ đề Festivals, dàn ý mẫu chuẩn 2 phút và các cụm từ ăn điểm miêu tả không khí lễ hội truyền thống Việt Nam.",
    publishDate: "02/09/2026",
    readTime: "1 phút đọc",
    bgGradient: "from-amber-100 via-rose-200 to-orange-200",
    illustrationType: "festival-cats",
    content: {
      intro:
        "Chủ đề 'Describe a festival you enjoy' là một trong những đề bài quen thuộc nhất trong IELTS Speaking Part 2.",
      sections: [
        {
          heading: "Dàn ý 4 câu hỏi gợi ý (Cues)",
          body: "Phân bổ 2 phút nói theo cấu trúc thông minh:",
          bulletPoints: [
            "Khi nào và ở đâu diễn ra lễ hội? (When & Where - 20s)",
            "Mọi người thường làm gì trong dịp này? (Activities - 40s)",
            "Ý nghĩa văn hóa và không khí lễ hội (Atmosphere - 40s)",
            "Cảm xúc và lý do bạn yêu thích (Personal Feeling - 20s)",
          ],
          highlightBox:
            "🎉 Từ vựng nâng cao: 'bustling atmosphere', 'steeped in tradition', 'strengthen family bonds', 'mouth-watering delicacies'.",
        },
      ],
      conclusion:
        "Hãy chuẩn bị câu chuyện thực tế về Tết Nguyên Đán hoặc Lễ hội Trung Thu để thể hiện nét đẹp văn hóa một cách tự nhiên nhất.",
    },
  },
  {
    id: "notif-4",
    category: "Ngữ pháp",
    title: "CHINH PHỤC THÌ HIỆN TẠI HOÀN THÀNH",
    summary:
      "Tất tần tật cách dùng thì Hiện Tại Hoàn Thành (Present Perfect), các dấu hiệu nhận biết Since/For/Already/Yet và phân biệt với Quá Khứ Đơn.",
    publishDate: "28/08/2026",
    readTime: "1 phút đọc",
    bgGradient: "from-emerald-200 via-teal-200 to-cyan-200",
    illustrationType: "pasture-sky",
    content: {
      intro:
        "Hiện tại hoàn thành (Have/Has + V3/ed) kết nối quá khứ với hiện tại và xuất hiện liên tục trong đề thi THPT Quốc Gia và IELTS.",
      sections: [
        {
          heading: "3 Trường hợp sử dụng phổ biến nhất",
          body: "Nắm vững 3 hoàn cảnh sau:",
          bulletPoints: [
            "Hành động bắt đầu trong quá khứ và vẫn đang tiếp diễn ở hiện tại (kèm Since/For).",
            "Trải nghiệm bản thân cho đến thời điểm hiện tại (Ever, Never, First time).",
            "Hành động vừa mới xảy ra và để lại kết quả ở hiện tại (Just, Already, Yet).",
          ],
          highlightBox:
            "⚠️ Lưu ý: Nếu có mốc thời gian cụ thể trong quá khứ (in 2020, yesterday, 2 days ago), bắt buộc phải dùng Quá Khứ Đơn!",
        },
      ],
      conclusion:
        "Hãy thực hành các bài tập trắc nghiệm trong mục Tài liệu của EduMi để ghi nhớ quy tắc lâu hơn.",
    },
  },
  {
    id: "notif-5",
    category: "Ngữ pháp",
    title: "Phân biệt 12 thì tiếng Anh trong đề thi THPT",
    summary:
      "Bảng tổng hợp công thức, dấu hiệu nhận biết và mẹo loại trừ phương án nhiễu cực nhanh cho phần trắc nghiệm ngữ pháp THPT 2026.",
    publishDate: "25/08/2026",
    readTime: "2 phút đọc",
    bgGradient: "from-green-100 via-emerald-100 to-lime-200",
    illustrationType: "apple-tree",
    content: {
      intro:
        "Trong đề thi THPT, câu hỏi về thì động từ và sự hòa hợp thì luôn chiếm 2 - 3 câu dễ lấy trọn điểm.",
      sections: [
        {
          heading: "Quy tắc hòa hợp thì quan trọng",
          body: "Các cấu trúc thường gặp trong đề thi:",
          bulletPoints: [
            "When + Quá khứ đơn, Quá khứ tiếp diễn (Hành động đang xảy ra thì hành động khác chen vào).",
            "By the time + Hiện tại đơn, Tương lai hoàn thành (Trước thời điểm trong tương lai).",
            "By the time + Quá khứ đơn, Quá khứ hoàn thành (Trước thời điểm trong quá khứ).",
          ],
        },
      ],
      conclusion:
        "Nắm chắc trục thời gian Quá khứ - Hiện tại - Tương lai sẽ giúp bạn không bao giờ chọn nhầm thì.",
    },
  },
  {
    id: "notif-6",
    category: "Chiến lược",
    title: "Chiến thuật đạt 9+ Đọc hiểu tiếng Anh THPT & IELTS",
    summary:
      "Kỹ năng Skimming và Scanning chuyên sâu, cách bắt Keyword biến đổi (Paraphrase) và xử lý câu hỏi suy luận (Inference).",
    publishDate: "20/08/2026",
    readTime: "3 phút đọc",
    bgGradient: "from-amber-200 via-orange-200 to-rose-200",
    illustrationType: "speech-bubbles",
    content: {
      intro:
        "Bài đọc hiểu tiếng Anh kiểm tra khả năng định vị thông tin nhanh và hiểu nghĩa hàm ẩn của tác giả.",
      sections: [
        {
          heading: "Quy trình 3 bước xử lý bài đọc",
          body: "Không đọc toàn bộ bài trước mà làm theo quy trình:",
          bulletPoints: [
            "Bước 1: Đọc câu hỏi và gạch chân các từ khóa khó thay thế (Tên riêng, số liệu, thuật ngữ).",
            "Bước 2: Scan bài đọc để tìm đoạn chứa từ khóa hoặc từ đồng nghĩa.",
            "Bước 3: Đọc kỹ 1-2 câu xung quanh để đối chiếu và chọn đáp án chính xác.",
          ],
        },
      ],
      conclusion:
        "Luyện tập 1 bài đọc hiểu mỗi ngày sẽ giúp tăng tốc độ đọc và nâng cao vốn từ vựng học thuật vượt bậc.",
    },
  },
  {
    id: "notif-7",
    category: "Chiến lược",
    title: "Lộ trình tự học từ 5.0 lên 7.5 IELTS trong 90 ngày",
    summary:
      "Phân bổ thời gian học 4 kỹ năng khoa học, tài liệu luyện đề chuẩn Cambridge và phương pháp ôn luyện Spaced Repetition cùng Capy AI.",
    publishDate: "15/08/2026",
    readTime: "4 phút đọc",
    bgGradient: "from-blue-100 via-sky-200 to-indigo-200",
    illustrationType: "snoopy-night",
    content: {
      intro:
        "Tăng 2.5 band điểm trong 3 tháng đòi hỏi sự kỷ luật cao và phương pháp học tập tối ưu thời gian.",
      sections: [
        {
          heading: "Lịch trình học tập theo tuần",
          body: "Chia 90 ngày làm 3 giai đoạn:",
          bulletPoints: [
            "Tháng 1: Củng cố nền tảng phát âm chuẩn IPA và 1000 từ vựng cốt lõi theo chủ đề.",
            "Tháng 2: Luyện kỹ năng giải quyết từng dạng bài (Task 1, Task 2, Reading matching heading...).",
            "Tháng 3: Luyện giải đề bấm giờ thực tế và chữa đề chi tiết.",
          ],
        },
      ],
      conclusion:
        "Hãy theo dõi chuỗi ngày học Streak trên EduMi để giữ vững ngọn lửa quyết tâm mỗi ngày nhé!",
    },
  },
];

const CATEGORIES = [
  "Tất cả",
  "Tips",
  "Ngữ pháp",
  "Từ vựng",
  "Phát âm",
  "Chiến lược",
  "Tin tức",
] as const;

// Component cuộn để hiển thị nội dung mượt mà khi người dùng lướt tới (Scroll Reveal)
function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: "700ms",
      }}
      className={`transform transition-all ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 filter-none"
          : "opacity-0 translate-y-12 scale-[0.96] blur-[2px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePostModal, setActivePostModal] = useState<BlogPost | null>(null);

  // Lọc bài viết theo danh mục & tìm kiếm
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchCategory =
        selectedCategory === "Tất cả" || post.category === selectedCategory;
      const matchSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Bài viết nổi bật
  const featuredPost = BLOG_POSTS.find((p) => p.isFeatured) || BLOG_POSTS[0];

  // Danh sách bài viết thông thường (loại bài nổi bật nếu đang ở tab Tất cả)
  const regularPosts = filteredPosts.filter((p) =>
    selectedCategory === "Tất cả" && !searchQuery ? !p.isFeatured : true
  );

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      {/* ══════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION BAR (Header ứng dụng)
          ══════════════════════════════════════════════════════════════════════ */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#3f5a36] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                EduMi{" "}
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                  Blog
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1">
                The Learning Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Quick actions matching design */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Hồ sơ cá nhân</span>
          </Link>

          {/* Language Selector */}
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>VI</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          2. HERO SECTION (Thiết kế Dark Minimalist chuẩn TID, Căn giữa sang trọng)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#09131c] border-b border-slate-800/60 py-16 sm:py-20 md:py-24 flex items-center justify-center">
        {/* Subtle Ambient Radial Lighting in Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-emerald-500/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[200px] bg-teal-400/[0.05] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          {/* Centered Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10242e]/90 backdrop-blur-md border border-[#1b3d4a] text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wider uppercase text-[11px] font-bold">
              Kiến thức & Chia sẻ
            </span>
          </div>

          {/* Main Centered Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-5">
            Bài viết của{" "}
            <span className="text-[#00d285] font-black">
              EduMi
            </span>
          </h1>

          {/* Centered Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            Tổng hợp các bài viết hướng dẫn, bí quyết luyện thi và tài liệu học
            thuật độc quyền từ đội ngũ EduMi.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. MAIN CONTENT CONTAINER (Bọc trong nền xanh kẻ ô lưới nhỏ gọn)
          ══════════════════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Category Filters & Search Bar ── */}
        <ScrollReveal delay={0}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border border-white/40">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#3f5a36] text-white shadow-md shadow-[#3f5a36]/30 scale-[1.02]"
                        : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#3f5a36] focus:ring-2 focus:ring-[#3f5a36]/20 rounded-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Featured Post Banner (Bài viết nổi bật) ── */}
        {selectedCategory === "Tất cả" && !searchQuery && featuredPost && (
          <ScrollReveal delay={60}>
            <div className="mb-8 group bg-white rounded-3xl sm:rounded-[32px] overflow-hidden shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                {/* Featured Visual Illustration (Mustard Yellow Banner) */}
                <div className="md:col-span-6 bg-[#ded939] relative min-h-[220px] sm:min-h-[260px] p-6 flex items-center justify-center overflow-hidden">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#3f5a36] text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                    Bài viết nổi bật
                  </div>

                  {/* Conceptual Typewriter & Scattered Papers Art */}
                  <div className="relative z-0 flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    <div className="w-32 h-32 rounded-full bg-slate-800/15 flex items-center justify-center p-3 relative shadow-inner">
                      <div className="w-24 h-24 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-2 shadow-2xl border border-slate-700">
                        <div className="w-16 h-2 bg-slate-700 rounded-full mb-2" />
                        <div className="w-12 h-6 bg-amber-100 text-slate-900 font-mono text-[9px] font-bold flex items-center justify-center rounded-sm">
                          IELTS 8.0
                        </div>
                        <div className="flex gap-1 mt-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                      </div>
                    </div>
                    {/* Floating paper notes */}
                    <div className="absolute -top-2 -right-4 px-2 py-1 bg-white rounded-md shadow-md text-[10px] font-bold text-slate-800 rotate-12">
                      Task 2 Idea ✨
                    </div>
                    <div className="absolute -bottom-2 -left-4 px-2 py-1 bg-white rounded-md shadow-md text-[10px] font-bold text-emerald-800 -rotate-12">
                      Linear Thinking 💡
                    </div>
                  </div>
                </div>

                {/* Featured Details */}
                <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredPost.publishDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-[#3f5a36] transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setActivePostModal(featuredPost)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#3f5a36] hover:text-[#283b23] hover:underline transition-colors cursor-pointer"
                    >
                      <span>Đọc ngay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ── Articles Grid (3 Cột) ── */}
        {regularPosts.length === 0 ? (
          <ScrollReveal delay={80}>
            <div className="bg-white/95 rounded-3xl p-12 text-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Không tìm thấy bài viết nào
              </h3>
              <p className="text-xs text-slate-500">
                Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác nhé!
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <ScrollReveal
                key={post.id}
                delay={(index % 3) * 120}
                className="h-full"
              >
                <article className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-white/70 transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1">
                  <div>
                    {/* Article Thumbnail Illustration */}
                    <div
                      className={`relative h-44 sm:h-48 bg-gradient-to-br ${post.bgGradient} p-4 flex items-center justify-center overflow-hidden`}
                    >
                      {/* Category Badge on Top Left */}
                      <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#3f5a36] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm border border-slate-100">
                        {post.category}
                      </div>

                      {/* Conceptual Graphics by Type */}
                      <div className="transform group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                        {post.illustrationType === "speaking-mindmap" && (
                          <div className="flex flex-col items-center gap-1.5 text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-900 text-white flex items-center justify-center text-xl font-black shadow-lg">
                              7.0+
                            </div>
                            <span className="px-2 py-0.5 bg-white/90 rounded-full text-[10px] font-bold text-indigo-950 shadow-sm">
                              Speaking Mastery
                            </span>
                          </div>
                        )}

                        {post.illustrationType === "festival-cats" && (
                          <div className="flex items-center gap-1">
                            <div className="text-3xl sm:text-4xl animate-bounce">
                              🐱
                            </div>
                            <div className="text-3xl sm:text-4xl">🏮</div>
                            <div className="text-3xl sm:text-4xl animate-bounce">
                              🐱
                            </div>
                          </div>
                        )}

                        {post.illustrationType === "pasture-sky" && (
                          <div className="flex flex-col items-center gap-1 text-center">
                            <div className="w-20 h-12 bg-white/90 rounded-xl shadow-md flex items-center justify-center border border-emerald-200">
                              <span className="text-xs font-black text-emerald-800">
                                Have / Has + V3
                              </span>
                            </div>
                            <span className="text-xs font-bold text-emerald-950">
                              Present Perfect 🌿
                            </span>
                          </div>
                        )}

                        {post.illustrationType === "apple-tree" && (
                          <div className="flex items-center gap-2">
                            <div className="text-3xl">🌳</div>
                            <div className="text-2xl animate-pulse">🍎</div>
                            <div className="text-3xl">⏰</div>
                          </div>
                        )}

                        {post.illustrationType === "speech-bubbles" && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="px-3 py-1 bg-white rounded-xl shadow-md text-[11px] font-bold text-amber-900">
                              Skim & Scan ⚡
                            </div>
                            <div className="text-3xl">🎯</div>
                          </div>
                        )}

                        {post.illustrationType === "snoopy-night" && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-3xl">🌙</div>
                            <div className="px-3 py-1 bg-slate-900 text-emerald-300 rounded-full text-[10px] font-mono font-bold shadow-md">
                              90-Day Roadmap 🚀
                            </div>
                          </div>
                        )}

                        {post.illustrationType === "writing-typewriter" && (
                          <div className="text-4xl">✍️</div>
                        )}
                      </div>
                    </div>

                    {/* Article Card Body */}
                    <div className="p-5 sm:p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.publishDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#3f5a36] transition-colors line-clamp-2 leading-snug mb-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  {/* Article Footer with Action */}
                  <div className="px-5 sm:px-6 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-600 group-hover:text-[#3f5a36] transition-colors">
                      Xem chi tiết
                    </span>

                    <button
                      type="button"
                      onClick={() => setActivePostModal(post)}
                      className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#3f5a36] text-slate-600 group-hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Đọc bài viết"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          4. ARTICLE READER MODAL (Popup Đọc chi tiết bài viết)
          ══════════════════════════════════════════════════════════════════════ */}
      {activePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setActivePostModal(null)}
          />

          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header Bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#3f5a36] text-white text-[10px] font-bold uppercase tracking-wider">
                  {activePostModal.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activePostModal.publishDate} • {activePostModal.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert("Đã lưu bài viết vào danh sách yêu thích!")}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Lưu bài viết"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePostModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {activePostModal.title}
              </h1>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm leading-relaxed font-medium">
                {activePostModal.content.intro}
              </div>

              {activePostModal.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 border-l-4 border-[#3f5a36] pl-3">
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {sec.body}
                  </p>

                  {sec.bulletPoints && (
                    <ul className="space-y-2 pl-4">
                      {sec.bulletPoints.map((pt, pIdx) => (
                        <li
                          key={pIdx}
                          className="text-xs sm:text-sm text-slate-700 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3f5a36] mt-2 flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.highlightBox && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-medium leading-relaxed">
                      {sec.highlightBox}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 italic">
                {activePostModal.content.conclusion}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Nguồn: Ban Học thuật EduMi 2026
              </span>
              <button
                type="button"
                onClick={() => setActivePostModal(null)}
                className="px-5 py-2 rounded-xl bg-[#3f5a36] hover:bg-[#283b23] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
