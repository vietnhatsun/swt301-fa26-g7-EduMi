"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Globe,
  Clock,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Bookmark,
  X,
  GraduationCap,
  Flame,
  CheckCircle2,
  Share2,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu bài viết Blog EduMi
interface BlogPost {
  id: string;
  category:
    | "Chiến lược 9+"
    | "Công nghệ AI"
    | "Luyện thi ĐGNL"
    | "Mẹo làm đề"
    | "Tiếng Anh THPT"
    | "Học không áp lực"
    | "Ngữ văn 12";
  title: string;
  summary: string;
  publishDate: string;
  readTime: string;
  isFeatured?: boolean;
  bgGradient: string;
  imageSrc: string;
  badgeTag?: string;
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
    id: "chien-luoc-9-thptqg-2026",
    category: "Chiến lược 9+",
    title: "Chiến lược phân bổ thời gian & lấp lỗ hổng kiến thức bứt phá 9+ THPTQG 2026",
    summary:
      "Phương pháp ôn thi thông minh theo cấu trúc đề mới của Bộ GD&ĐT: Ứng dụng AI Exam Scanner để định vị chính xác 20% lỗ hổng tư duy giúp tăng 2 - 2.5 điểm trong 60 ngày mà không bị kiệt sức.",
    publishDate: "12/10/2026",
    readTime: "4 phút đọc",
    isFeatured: true,
    bgGradient: "from-amber-100 via-amber-200 to-emerald-200",
    imageSrc: "/stickers/mastery-capybara.png",
    badgeTag: "Ma trận 2026 • Mục tiêu 9+ 🎯",
    content: {
      intro:
        "Kỳ thi THPT Quốc Gia 2026 áp dụng cấu trúc ma trận mới với các dạng câu hỏi trắc nghiệm Đúng/Sai và Trả lời ngắn. Phương pháp học vẹt giải đề hàng loạt đã không còn hiệu quả. Để bứt phá điểm 9+, bạn cần một chiến lược ôn tập cá nhân hóa dựa trên dữ liệu thực tế.",
      sections: [
        {
          heading: "1. Nguyên lý 80/20 trong việc rà soát ma trận kiến thức",
          body: "Thay vì dàn trải thời gian cho toàn bộ sách giáo khoa, hãy phân loại kiến thức thành 3 nhóm: Kiến thức đã vững (chỉ cần duy trì), Kiến thức hay bị nhầm lẫn (ưu tiên số 1), và Kiến thức vận dụng cao đặc thù.",
          bulletPoints: [
            "Dành 60% thời gian củng cố các dạng bài ở mức độ Thông hiểu và Vận dụng hay bị bẫy.",
            "Luyện đề có bấm giờ theo đúng khung giờ thi thật để não bộ thích nghi nhịp sinh học.",
            "Sau mỗi đề thi, dành ít nhất 45 phút đối chiếu lời giải chi tiết và ghi chú lỗi sai vào Sổ tay AI Note.",
          ],
          highlightBox:
            "💡 Lời khuyên từ EduMi: Một đề thi chữa kỹ lưỡng mang lại giá trị gấp 5 lần việc làm 10 đề thi nhưng chỉ xem điểm số rồi bỏ qua.",
        },
        {
          heading: "2. Tận dụng phòng thi ảo ma trận bấm giờ chuẩn format",
          body: "EduMi cung cấp hệ thống phòng thi thử mô phỏng 100% giao diện thi thật, tự động chấm điểm và tạo phổ điểm phân vị so sánh với toàn khóa, giúp bạn biết chính xác mình đang đứng ở đâu.",
          bulletPoints: [
            "Bộ đề bám sát 100% định dạng đề minh họa mới nhất của Bộ GD&ĐT.",
            "Hệ thống tự động ghi nhận thời gian làm từng câu để phát hiện câu hỏi bạn bị 'kẹt' quá lâu.",
            "Capy AI hướng dẫn phân tích bước tư duy bị sai ngay sau khi nộp bài.",
          ],
        },
      ],
      conclusion:
        "Học đúng cách sẽ giúp bạn đi xa hơn. Hãy giữ vững sự tự tin, rèn luyện đều đặn mỗi ngày cùng chú Capy và bứt phá điểm số trong kỳ thi sắp tới nhé!",
    },
  },
  {
    id: "ai-exam-scanner-phat-hien-bay",
    category: "Công nghệ AI",
    title: "Cách dùng AI Exam Scanner bóc tách câu hỏi bẫy trong 1.5 giây",
    summary:
      "Không chỉ đưa ra đáp án, công cụ AI Scanner của EduMi giúp phát hiện học sinh sai do nhầm công thức hay do bẫy tư duy, từ đó đề xuất bài tập khắc phục triệt để.",
    publishDate: "08/10/2026",
    readTime: "3 phút đọc",
    bgGradient: "from-emerald-100 via-teal-100 to-cyan-100",
    imageSrc: "/stickers/laptop-capybara.png",
    badgeTag: "AI Exam Scanner ⚡ 1.5s",
    content: {
      intro:
        "Mỗi năm có hàng ngàn học sinh mất điểm đáng tiếc không phải vì không biết làm bài, mà vì mắc phải các 'câu hỏi bẫy' được cài cắm tinh vi trong đề thi trắc nghiệm.",
      sections: [
        {
          heading: "AI Exam Scanner hoạt động như thế nào?",
          body: "Chỉ cần chụp ảnh đề bài hoặc câu hỏi bạn làm sai, AI của EduMi sẽ nhận diện văn bản, bóc tách cấu trúc câu và đối chiếu với ngân hàng dữ liệu 10,000+ câu hỏi chuẩn Bộ GD&ĐT.",
          bulletPoints: [
            "Chỉ rõ bước giải bị sai lệch tư duy thay vì chỉ đưa ra đáp án cuối cùng.",
            "Cung cấp 3 câu hỏi tương tự cùng dạng để học sinh luyện tập lại ngay lập tức.",
            "Tự động lưu câu hỏi vào danh mục 'Cần ôn lại' theo thuật toán Spaced Repetition.",
          ],
          highlightBox:
            "🔍 Mẹo nhỏ: Hãy chụp ảnh rõ nét cả đề bài và phần lời giải nháp của bạn để AI phân tích nguyên nhân sai sót chính xác nhất.",
        },
      ],
      conclusion:
        "Biến mỗi câu làm sai thành một bài học đắt giá chính là con đường ngắn nhất để đạt điểm tối đa.",
    },
  },
  {
    id: "on-thi-danh-gia-nang-luc-2026",
    category: "Luyện thi ĐGNL",
    title: "Bí quyết đạt 850+ kỳ thi ĐGNL HSA (ĐHQGHN) & VNU-HCM",
    summary:
      "Cẩm nang chinh phục phần Tư duy Định lượng, Định tính và Khoa học tự nhiên trong bài thi Đánh giá năng lực: Phương pháp tư duy logic và kỹ thuật giải nhanh.",
    publishDate: "04/10/2026",
    readTime: "5 phút đọc",
    bgGradient: "from-blue-100 via-indigo-100 to-purple-100",
    imageSrc: "/stickers/schedule-capybara.png",
    badgeTag: "ĐGNL HSA & VNU-HCM 🎓",
    content: {
      intro:
        "Kỳ thi Đánh giá năng lực đòi hỏi khả năng tư duy tổng hợp và giải quyết vấn đề thực tế chứ không kiểm tra việc học thuộc lòng máy móc.",
      sections: [
        {
          heading: "Chiến thuật xử lý 3 phần thi cốt lõi",
          body: "Phân bổ thời gian hợp lý là chìa khóa sống còn của bài thi ĐGNL với 150 câu hỏi trong 195 phút:",
          bulletPoints: [
            "Tư duy định lượng (Toán học): Ưu tiên nhận diện dạng đồ thị và số liệu thống kê trong 60 giây đầu.",
            "Tư duy định tính (Văn học - Ngôn ngữ): Rèn kỹ năng đọc nhanh văn bản dài, nắm bắt tư tưởng chủ đạo và quan điểm tác giả.",
            "Khoa học tự nhiên & xã hội: Tập trung vào các quy luật thực tế, thí nghiệm khoa học và hiện tượng đời sống.",
          ],
          highlightBox:
            "⚡ Chiến thuật phòng thi: Đừng dừng lại quá 2 phút ở bất kỳ câu hỏi nào. Đánh dấu câu khó và quay lại sau khi đã hoàn thành các câu quen thuộc.",
        },
      ],
      conclusion:
        "Luyện đề thi thử ĐGNL bấm giờ trên EduMi sẽ giúp bạn làm quen với áp lực thời gian và rèn luyện tâm lý vững vàng.",
    },
  },
  {
    id: "meo-bam-may-tinh-casio-580vnx",
    category: "Mẹo làm đề",
    title: "12 Thủ thuật Casio 580VNX: Giải nhanh hàm số & hình học Oxyz",
    summary:
      "Tiết kiệm 50% thời gian làm bài thi trắc nghiệm Toán với các mẹo bấm máy tính Casio chính xác: Tìm cực trị, tích phân, khoảng cách và góc trong không gian Oxyz.",
    publishDate: "29/09/2026",
    readTime: "3 phút đọc",
    bgGradient: "from-orange-100 via-amber-100 to-yellow-100",
    imageSrc: "/stickers/time-capybara.png",
    badgeTag: "Casio 580VNX Hacks 🧮",
    content: {
      intro:
        "Máy tính cầm tay là vũ khí đắc lực trong phòng thi môn Toán, nhưng nếu không biết cách bấm máy thông minh, bạn có thể tốn nhiều thời gian hơn cả giải tay.",
      sections: [
        {
          heading: "Các chức năng thần thánh nên tận dụng",
          body: "Nắm vững các lệnh Table (Menu 8), Vector (Menu 5) và Solve (Shift Solve) để kiểm tra đáp án:",
          bulletPoints: [
            "Menu 8 (Table): Quét giá trị lớn nhất - nhỏ nhất (GTLN-GTNN) của hàm số trên một đoạn với Step = (End - Start)/29.",
            "Menu 5 (Vector): Tính tích có hướng, khoảng cách từ điểm đến mặt phẳng Oxyz trong 20 giây.",
            "Lệnh CALC với giá trị 1000 hoặc 0.001 để dịch biểu thức nghiệm nguyên.",
          ],
          highlightBox:
            "⚠️ Cảnh báo: Máy tính chỉ là công cụ hỗ trợ. Đề thi mới có rất nhiều câu hỏi chứa tham số m chống bấm máy tính, vì vậy nền tảng bản chất toán học vẫn là cốt lõi.",
        },
      ],
      conclusion:
        "Kết hợp giữa tư duy tự luận chuẩn mực và mẹo bấm máy tính kiểm tra ngược sẽ mang lại sự chính xác tuyệt đối.",
    },
  },
  {
    id: "tieng-anh-thpt-doc-hieu-tu-vung",
    category: "Tiếng Anh THPT",
    title: "Bí kíp xử lý bài Đọc hiểu và Phrasal Verbs môn Tiếng Anh THPT",
    summary:
      "Chiến thuật Skimming & Scanning bắt từ khóa Paraphrase, bảng tổng hợp 100 cụm động từ thường gặp nhất và cách tránh các phương án bẫy từ vựng đồng âm.",
    publishDate: "24/09/2026",
    readTime: "3 phút đọc",
    bgGradient: "from-emerald-100 via-green-100 to-lime-100",
    imageSrc: "/stickers/pencil-capybara.png",
    badgeTag: "Tiếng Anh 9+ 🇬🇧",
    content: {
      intro:
        "Hai bài đọc hiểu chiếm tới 3.0 điểm trong đề thi tốt nghiệp THPT môn Tiếng Anh và là phần phân hóa học sinh rõ rệt nhất giữa band 7 và band 9+.",
      sections: [
        {
          heading: "Quy trình 3 bước đọc hiểu không cần dịch từng chữ",
          body: "Không bao giờ đọc toàn bộ văn bản trước khi đọc câu hỏi. Hãy áp dụng kỹ thuật định vị thông tin:",
          bulletPoints: [
            "Bước 1: Đọc câu hỏi và gạch chân từ khóa cố định (Tên riêng, mốc thời gian, thuật ngữ khoa học).",
            "Bước 2: Scan tìm đoạn chứa từ khóa hoặc các dạng từ biến đổi (Paraphrase) tương ứng.",
            "Bước 3: Đọc câu văn đứng trước và đứng sau vị trí từ khóa để suy luận ý nghĩa ngữ cảnh.",
          ],
          highlightBox:
            "📚 Mẹo ghi nhớ Phrasal Verbs: Học theo tiểu từ (ví dụ: các cụm đi với 'up', 'down', 'out') để nắm được sắc thái nghĩa chung của nhóm từ.",
        },
      ],
      conclusion:
        "Hãy luyện tập mỗi ngày 1 bài đọc trên tính năng Flashcard AI của EduMi để ghi nhớ từ vựng tự nhiên qua ngữ cảnh.",
    },
  },
  {
    id: "hoc-chill-khong-ap-luc-streak-capy",
    category: "Học không áp lực",
    title: "Học kiểu Chill: Duy trì Streak và tích lũy XP cùng Capy mỗi ngày",
    summary:
      "Khoa học tâm lý đằng sau phương pháp Gamification: Tại sao học tập 25 phút mỗi ngày với tâm trạng thoải mái lại giúp ghi nhớ sâu gấp 3 lần thức đêm cày cuốc.",
    publishDate: "18/09/2026",
    readTime: "4 phút đọc",
    bgGradient: "from-rose-100 via-orange-100 to-amber-100",
    imageSrc: "/Capybara_EduMi_và_bảng_học_tập-removebg-preview.png",
    badgeTag: "Chill & Streak 🔥 30 Ngày",
    content: {
      intro:
        "Áp lực thi cử và sự mệt mỏi tinh thần là kẻ thù số 1 của trí nhớ dài hạn. EduMi ra đời với triết lý học tập không áp lực, biến quá trình ôn thi thành một hành trình thú vị.",
      sections: [
        {
          heading: "Sức mạnh của ngọn lửa Streak và tính năng đổi quà",
          body: "Mỗi ngày hoàn thành 1 bài tập hoặc ôn tập 10 flashcard, ngọn lửa Streak của bạn sẽ bùng sáng:",
          bulletPoints: [
            "Tạo thói quen học tập bền bỉ thông qua hiệu ứng Dopamine tích cực.",
            "Tích lũy điểm kinh nghiệm (XP) để thăng hạng trên Bảng vinh danh và mở khóa quà tặng độc quyền từ EduMi.",
            "Chú Capy đồng hành luôn ở bên cạnh nhắc nhở lịch học và động viên tinh thần với những câu quotes hài hước, ấm áp.",
          ],
          highlightBox:
            "🌿 Bí quyết học chill: Áp dụng phương pháp Pomodoro 25 phút tập trung cao độ + 5 phút nghỉ ngơi thư giãn để duy trì năng lượng suốt ngày dài.",
        },
      ],
      conclusion:
        "Không cần phải học 12 tiếng một ngày để đạt điểm cao. Hãy học đều đặn, thông minh và giữ tinh thần vui vẻ cùng chú Capy nhé!",
    },
  },
  {
    id: "ngu-van-12-cong-thuc-mo-bai-ket-bai",
    category: "Ngữ văn 12",
    title: "Công thức Mở bài - Kết bài Nghị luận Văn học & Xã hội đạt điểm 8.5+",
    summary:
      "Cách mở bài gián tiếp bằng nhận định văn học, đưa dẫn chứng thời sự sắc bén và kết bài mở rộng tạo dư âm sâu lắng cho bài thi tốt nghiệp THPT.",
    publishDate: "14/09/2026",
    readTime: "4 phút đọc",
    bgGradient: "from-amber-100 via-rose-100 to-pink-100",
    imageSrc: "/stickers/classes-corner-3d.png",
    badgeTag: "Văn học 8.5+ ✍️",
    content: {
      intro:
        "Mở bài là ấn tượng đầu tiên quyết định cảm xúc của giám khảo chấm thi. Một mở bài độc đáo, tinh tế sẽ nâng tầm bài viết của bạn lên mức điểm xuất sắc.",
      sections: [
        {
          heading: "3 Cách mở bài gián tiếp kinh điển",
          body: "Tuyệt đối tránh lối mở bài liệt kê máy móc. Hãy thử các công thức sau:",
          bulletPoints: [
            "Mở bài bằng lý luận văn học: Đi từ chức năng của văn học nghệ thuật hoặc sứ mệnh của người cầm bút.",
            "Mở bài bằng hình ảnh tương đồng: Đi từ quy luật tự nhiên, dòng chảy thời gian đến vẻ đẹp tâm hồn con người trong tác phẩm.",
            "Mở bài bằng câu hỏi tu từ hoặc trích dẫn thơ: Gợi mở vấn đề một cách tự nhiên và giàu chất thơ.",
          ],
          highlightBox:
            "✨ Dẫn chứng Nghị luận xã hội: Hãy cập nhật các câu chuyện truyền cảm hứng gần gũi về thế hệ trẻ, công nghệ AI và lòng nhân ái thay vì dùng lại các dẫn chứng quá cũ kỹ.",
        },
      ],
      conclusion:
        "Văn học bắt nguồn từ cuộc sống. Hãy viết bằng rung cảm chân thực của trái tim kết hợp với tư duy lập luận mạch lạc.",
    },
  },
];

const CATEGORIES = [
  "Tất cả",
  "Chiến lược 9+",
  "Công nghệ AI",
  "Luyện thi ĐGNL",
  "Mẹo làm đề",
  "Tiếng Anh THPT",
  "Học không áp lực",
  "Ngữ văn 12",
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
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: "800ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`transform transition-all ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
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

  // Danh sách bài viết thông thường (loại bài nổi bật nếu đang ở tab Tất cả và không tìm kiếm)
  const regularPosts = filteredPosts.filter((p) =>
    selectedCategory === "Tất cả" && !searchQuery ? !p.isFeatured : true
  );

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      
      {/* ══════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION BAR (Header ứng dụng)
          ══════════════════════════════════════════════════════════════════════ */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-xs">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                EduMi{" "}
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Blog Tri Thức
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
                Nền tảng học tập thông minh 2026
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-300 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700" />
            <span>Về Trang chủ</span>
          </Link>

          {/* About Link */}
          <Link
            href="/about"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-bold border border-emerald-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Giới thiệu EduMi</span>
          </Link>

          {/* Language Selector */}
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>VI</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          2. HERO SECTION (Thiết kế phong cách EduMi: Thông thái, Hiện đại & Chill)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#102716] via-[#15341d] to-[#0c1f11] text-white py-16 sm:py-20 md:py-24 border-b border-emerald-900/40">
        
        {/* Signature Grid Lines Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient Lighting Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          
          {/* Centered Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-black mb-5 shadow-lg backdrop-blur-md">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wider uppercase text-[11px]">
              GÓC HỌC TẬP &amp; KHO TRI THỨC EDUMI 2026
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
            Cẩm nang học tập &amp; Bí quyết{" "}
            <span className="text-[#34d399] underline decoration-amber-400 decoration-wavy decoration-2">
              bứt phá điểm 9+
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-2xl mx-auto mb-6">
            Tổng hợp phương pháp ôn thi THPTQG &amp; ĐGNL mới nhất, mẹo giải đề thông minh từ thầy cô chuyên môn và người bạn đồng hành Capy AI.
          </p>

          {/* Quick Metrics Tag */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-emerald-200/90">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Chuẩn cấu trúc ma trận mới
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Học kiểu Chill • Không áp lực
            </span>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. MAIN CONTENT CONTAINER (Bộ lọc danh mục, Tìm kiếm & Lưới bài viết)
          ══════════════════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* ── Category Filters & Search Bar ── */}
        <ScrollReveal delay={0}>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-slate-900/10">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#059669] text-white shadow-md shadow-emerald-700/30 scale-105"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết, mẹo Casio, ĐGNL..."
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-semibold"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </ScrollReveal>

        {/* ── Featured Post Banner (Bài viết nổi bật Chuẩn EduMi) ── */}
        {selectedCategory === "Tất cả" && !searchQuery && featuredPost && (
          <ScrollReveal delay={60}>
            <div className="mb-10 group bg-white rounded-3xl sm:rounded-[36px] overflow-hidden shadow-xl border-2 border-slate-900/10 hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                
                {/* Featured Visual Illustration (EduMi Theme Banner) */}
                <div className="md:col-span-6 bg-gradient-to-br from-[#102716] via-[#183921] to-[#0e2213] relative min-h-[260px] sm:min-h-[300px] p-6 sm:p-8 flex items-center justify-center overflow-hidden">
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md border border-amber-300">
                    ★ Bài viết nổi bật
                  </div>

                  {/* Background decorative circles */}
                  <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

                  {/* Mascot Graphic with Badges */}
                  <div className="relative z-0 flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                      <Image
                        src={featuredPost.imageSrc}
                        alt={featuredPost.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 200px, 240px"
                        className="object-contain"
                      />
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -top-1 -right-2 px-3 py-1 bg-white/95 rounded-xl shadow-lg border border-slate-200 text-xs font-black text-slate-900 rotate-6 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Mục tiêu 9+ 🎯</span>
                    </div>
                    <div className="absolute -bottom-2 -left-2 px-3 py-1 bg-[#102716] rounded-xl shadow-lg border border-emerald-500/40 text-xs font-bold text-emerald-300 -rotate-6 flex items-center gap-1.5">
                      <span>AI Scanner 1.5s ⚡</span>
                    </div>
                  </div>
                </div>

                {/* Featured Details */}
                <div className="md:col-span-6 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                        {featuredPost.category}
                      </span>
                      <span>•</span>
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

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 mb-3 leading-snug group-hover:text-emerald-700 transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setActivePostModal(featuredPost)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <span>Đọc bài viết chi tiết</span>
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
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-200">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {regularPosts.map((post, index) => (
              <ScrollReveal
                key={post.id}
                delay={(index % 3) * 100}
                className="h-full"
              >
                <article className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border-2 border-slate-900/10 hover:border-emerald-600/40 transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1.5">
                  <div>
                    
                    {/* Article Thumbnail Illustration (Chuẩn EduMi Asset) */}
                    <div
                      className={`relative h-48 sm:h-52 bg-gradient-to-br ${post.bgGradient} p-4 flex items-center justify-center overflow-hidden`}
                    >
                      {/* Category Badge on Top Left */}
                      <div className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm border border-slate-200">
                        {post.category}
                      </div>

                      {/* Custom Badge Tag on Top Right if present */}
                      {post.badgeTag && (
                        <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-black shadow-sm">
                          {post.badgeTag}
                        </div>
                      )}

                      {/* Real EduMi Mascot / Illustration Asset */}
                      <div className="relative w-36 h-36 sm:w-40 sm:h-40 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md flex items-center justify-center">
                        <Image
                          src={post.imageSrc}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 150px, 180px"
                          className="object-contain"
                        />
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
                      <h3 className="text-base sm:text-lg font-black text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                        {post.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {post.summary}
                      </p>
                    </div>

                  </div>

                  {/* Article Footer with Action */}
                  <div className="px-5 sm:px-6 pb-5 pt-3 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-black text-emerald-800 group-hover:text-emerald-600 transition-colors">
                      Xem chi tiết
                    </span>

                    <button
                      type="button"
                      onClick={() => setActivePostModal(post)}
                      className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-[#059669] text-slate-700 group-hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs group-hover:scale-105"
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
          4. ARTICLE READER MODAL (Popup Đọc chi tiết bài viết Chuẩn EduMi)
          ══════════════════════════════════════════════════════════════════════ */}
      {activePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setActivePostModal(null)}
          />

          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border-2 border-slate-900/15 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header Bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider">
                  {activePostModal.category}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {activePostModal.publishDate} • {activePostModal.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert("Đã lưu bài viết vào Sổ tay EduMi!")}
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
            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto space-y-6">
              
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                {activePostModal.title}
              </h1>

              {/* Intro banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 text-xs sm:text-sm leading-relaxed font-semibold">
                {activePostModal.content.intro}
              </div>

              {/* Sections */}
              {activePostModal.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3 pt-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-950 border-l-4 border-emerald-600 pl-3">
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {sec.body}
                  </p>

                  {sec.bulletPoints && (
                    <ul className="space-y-2 pl-4">
                      {sec.bulletPoints.map((pt, pIdx) => (
                        <li
                          key={pIdx}
                          className="text-xs sm:text-sm text-slate-800 flex items-start gap-2.5 font-medium"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.highlightBox && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold leading-relaxed">
                      {sec.highlightBox}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-600 italic font-medium">
                {activePostModal.content.conclusion}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">
                Nguồn: Ban Học thuật &amp; Nghiên cứu EduMi 2026
              </span>
              <button
                type="button"
                onClick={() => setActivePostModal(null)}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                Đã hiểu &amp; Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
