import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import LandingNavbar from "@/components/landing/LandingNavbar";
import TypewriterDescription from "@/components/classes/TypewriterDescription";
import ClassCardReveal from "@/components/classes/ClassCardReveal";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  FlaskConical,
  Globe2,
  GraduationCap,
  Leaf,
  LibraryBig,
  Search,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Star,
} from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

type MaterialPatternType = "waves" | "clouds" | "confetti" | "stripes" | "ripples" | "chevrons";

type MaterialCard = {
  subject: string;
  filterIcon: ReactNode;
  title: string;
  cardCode: string;
  detail: string;
  fileType: "PDF" | "DOCX";
  views: string;
  pages: string;
  bgClass: string;
  accentClass: string;
  pattern: MaterialPatternType;
};

const materialCards: MaterialCard[] = [
  {
    subject: "Toán học",
    filterIcon: <Sigma className="h-4 w-4" />,
    title: "Tuyển tập 50 Đề thi thử THPT Quốc Gia môn Toán 2026 (Có giải chi tiết)",
    cardCode: "TOÁN 12",
    detail: "Tuyển tập 50 Đề thi thử THPT Quốc Gia môn Toán 2026 (Có giải chi tiết)",
    fileType: "PDF",
    views: "45.120 lượt xem",
    pages: "180 trang",
    bgClass: "bg-[#e07328]",
    accentClass: "text-[#e07328]",
    pattern: "waves",
  },
  {
    subject: "Tiếng Anh",
    filterIcon: <Globe2 className="h-4 w-4" />,
    title: "Cẩm nang 1200 Collocations & Idioms Tiếng Anh thi Đại học điểm 9+",
    cardCode: "IELTS 9+",
    detail: "Cẩm nang 1200 Collocations & Idioms Tiếng Anh thi Đại học điểm 9+",
    fileType: "PDF",
    views: "45.240 lượt xem",
    pages: "96 trang",
    bgClass: "bg-[#be4c73]",
    accentClass: "text-[#be4c73]",
    pattern: "clouds",
  },
  {
    subject: "Vật lý",
    filterIcon: <Sparkles className="h-4 w-4" />,
    title: "Sơ đồ tư duy & Bí kíp giải nhanh Vật lý 12: Dao động cơ & Sóng cơ",
    cardCode: "VẬT LÝ 12",
    detail: "Sơ đồ tư duy & Bí kíp giải nhanh Vật lý 12: Dao động cơ & Sóng cơ",
    fileType: "PDF",
    views: "45.360 lượt xem",
    pages: "72 trang",
    bgClass: "bg-[#bf5447]",
    accentClass: "text-[#bf5447]",
    pattern: "confetti",
  },
  {
    subject: "Ngữ văn",
    filterIcon: <BookOpen className="h-4 w-4" />,
    title: "Hệ thống Luận điểm & Mở bài - Kết bài độc đáo môn Ngữ văn 12",
    cardCode: "NGỮ VĂN",
    detail: "Hệ thống Luận điểm & Mở bài - Kết bài độc đáo môn Ngữ văn 12",
    fileType: "DOCX",
    views: "45.490 lượt xem",
    pages: "64 trang",
    bgClass: "bg-[#7356bc]",
    accentClass: "text-[#7356bc]",
    pattern: "stripes",
  },
  {
    subject: "Hóa học",
    filterIcon: <FlaskConical className="h-4 w-4" />,
    title: "Phân dạng & Phương pháp giải bài tập Este - Lipit nâng cao 8+",
    cardCode: "HÓA HỌC",
    detail: "Phân dạng & Phương pháp giải bài tập Este - Lipit nâng cao 8+",
    fileType: "PDF",
    views: "38.200 lượt xem",
    pages: "85 trang",
    bgClass: "bg-[#0d9488]",
    accentClass: "text-[#0d9488]",
    pattern: "ripples",
  },
  {
    subject: "Sinh học",
    filterIcon: <Leaf className="h-4 w-4" />,
    title: "Slide Tóm tắt Toàn bộ Kiến thức Di truyền học & Tiến hóa Sinh 12",
    cardCode: "SINH HỌC",
    detail: "Slide Tóm tắt Toàn bộ Kiến thức Di truyền học & Tiến hóa Sinh 12",
    fileType: "PDF",
    views: "32.450 lượt xem",
    pages: "110 trang",
    bgClass: "bg-[#0284c7]",
    accentClass: "text-[#0284c7]",
    pattern: "chevrons",
  },
  {
    subject: "Toán học",
    filterIcon: <Sigma className="h-4 w-4" />,
    title: "Chuyên đề Hàm số 12 - Nhận diện đồ thị và bài toán cực trị",
    cardCode: "HÀM SỐ",
    detail: "Chuyên đề Hàm số 12 - Nhận diện đồ thị và bài toán cực trị",
    fileType: "PDF",
    views: "29.840 lượt xem",
    pages: "124 trang",
    bgClass: "bg-[#2563eb]",
    accentClass: "text-[#2563eb]",
    pattern: "waves",
  },
  {
    subject: "Tiếng Anh",
    filterIcon: <Globe2 className="h-4 w-4" />,
    title: "Bộ đề Reading & Listening THPT theo ma trận mới kèm đáp án",
    cardCode: "ENGLISH",
    detail: "Bộ đề Reading & Listening THPT theo ma trận mới kèm đáp án",
    fileType: "PDF",
    views: "31.270 lượt xem",
    pages: "140 trang",
    bgClass: "bg-[#7c3aed]",
    accentClass: "text-[#7c3aed]",
    pattern: "stripes",
  },
  {
    subject: "Hóa học",
    filterIcon: <FlaskConical className="h-4 w-4" />,
    title: "Bảng tổng hợp phản ứng hữu cơ thường gặp trong đề thi 12",
    cardCode: "HỮU CƠ",
    detail: "Bảng tổng hợp phản ứng hữu cơ thường gặp trong đề thi 12",
    fileType: "DOCX",
    views: "24.510 lượt xem",
    pages: "58 trang",
    bgClass: "bg-[#db2777]",
    accentClass: "text-[#db2777]",
    pattern: "confetti",
  },
  {
    subject: "Lịch sử",
    filterIcon: <BookOpen className="h-4 w-4" />,
    title: "Timeline Lịch sử Việt Nam 1919-2000 dạng sơ đồ dễ nhớ",
    cardCode: "LỊCH SỬ",
    detail: "Timeline Lịch sử Việt Nam 1919-2000 dạng sơ đồ dễ nhớ",
    fileType: "PDF",
    views: "18.930 lượt xem",
    pages: "42 trang",
    bgClass: "bg-[#b45309]",
    accentClass: "text-[#b45309]",
    pattern: "clouds",
  },
  {
    subject: "Địa lý",
    filterIcon: <Globe2 className="h-4 w-4" />,
    title: "Kỹ năng Atlat Địa lý Việt Nam: đọc nhanh, chọn đúng đáp án",
    cardCode: "ATLAT",
    detail: "Kỹ năng Atlat Địa lý Việt Nam: đọc nhanh, chọn đúng đáp án",
    fileType: "PDF",
    views: "21.680 lượt xem",
    pages: "76 trang",
    bgClass: "bg-[#059669]",
    accentClass: "text-[#059669]",
    pattern: "ripples",
  },
  {
    subject: "Sinh học",
    filterIcon: <Leaf className="h-4 w-4" />,
    title: "Ngân hàng câu hỏi Di truyền học phân tầng từ cơ bản đến vận dụng",
    cardCode: "DI TRUYỀN",
    detail: "Ngân hàng câu hỏi Di truyền học phân tầng từ cơ bản đến vận dụng",
    fileType: "PDF",
    views: "27.340 lượt xem",
    pages: "132 trang",
    bgClass: "bg-[#16a34a]",
    accentClass: "text-[#16a34a]",
    pattern: "chevrons",
  },
  {
    subject: "Ngữ văn",
    filterIcon: <BookOpen className="h-4 w-4" />,
    title: "Sổ tay dẫn chứng nghị luận xã hội theo chủ đề cập nhật 2026",
    cardCode: "DẪN CHỨNG",
    detail: "Sổ tay dẫn chứng nghị luận xã hội theo chủ đề cập nhật 2026",
    fileType: "DOCX",
    views: "33.120 lượt xem",
    pages: "88 trang",
    bgClass: "bg-[#9333ea]",
    accentClass: "text-[#9333ea]",
    pattern: "stripes",
  },
  {
    subject: "Vật lý",
    filterIcon: <Sparkles className="h-4 w-4" />,
    title: "Công thức nhanh Điện xoay chiều và mẹo bấm máy Casio",
    cardCode: "ĐIỆN AC",
    detail: "Công thức nhanh Điện xoay chiều và mẹo bấm máy Casio",
    fileType: "PDF",
    views: "26.760 lượt xem",
    pages: "69 trang",
    bgClass: "bg-[#ea580c]",
    accentClass: "text-[#ea580c]",
    pattern: "confetti",
  },
  {
    subject: "Tin học",
    filterIcon: <FileText className="h-4 w-4" />,
    title: "Bài tập Python nền tảng: biến, vòng lặp, hàm và xử lý danh sách",
    cardCode: "PYTHON",
    detail: "Bài tập Python nền tảng: biến, vòng lặp, hàm và xử lý danh sách",
    fileType: "PDF",
    views: "16.480 lượt xem",
    pages: "94 trang",
    bgClass: "bg-[#0f766e]",
    accentClass: "text-[#0f766e]",
    pattern: "waves",
  },
  {
    subject: "GDCD",
    filterIcon: <GraduationCap className="h-4 w-4" />,
    title: "Tình huống pháp luật công dân 11 kèm phân tích đáp án chi tiết",
    cardCode: "PHÁP LUẬT",
    detail: "Tình huống pháp luật công dân 11 kèm phân tích đáp án chi tiết",
    fileType: "DOCX",
    views: "14.950 lượt xem",
    pages: "52 trang",
    bgClass: "bg-[#4f46e5]",
    accentClass: "text-[#4f46e5]",
    pattern: "clouds",
  },];

const materialTitleLines = ["Khám phá tài liệu", "học tập chọn lọc"];
const materialDescription =
  "Tổng hợp tài liệu theo môn học, dạng bài và mục tiêu điểm số. Tìm nhanh học liệu phù hợp, xem trước nội dung và lưu lại cho hành trình ôn tập của bạn.";

const filters = [
  { label: "Khối lớp", icon: <GraduationCap className="h-5 w-5" /> },
  { label: "Môn học", icon: <LibraryBig className="h-5 w-5" /> },
  { label: "Loại tài liệu", icon: <FileText className="h-5 w-5" /> },
  { label: "Đánh giá", icon: <Star className="h-5 w-5" /> },
];

function DropLetterTitle() {
  let letterIndex = 0;
  const fullTitle = materialTitleLines.join(" ");

  return (
    <h1
      aria-label={fullTitle}
      className="max-w-[620px] text-[54px] font-black leading-[0.98] tracking-[-0.055em] text-[#092235]"
    >
      {materialTitleLines.map((line) => (
        <span key={line} aria-hidden="true" className="block">
          {line.split("").map((letter, index) => {
            const delay = letter === " " ? letterIndex : letterIndex++;

            return (
              <span
                key={`${line}-${index}`}
                className={letter === " " ? "inline-block w-[0.24em]" : "class-title-letter"}
                style={{ animationDelay: `${delay * 54}ms` }}
              >
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
function MaterialPattern({ pattern }: { pattern: MaterialPatternType }) {
  if (pattern === "waves") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-50,80 Q50,20 150,100 T350,60" fill="none" stroke="white" strokeWidth="34" strokeLinecap="round" />
        <path d="M-30,220 Q70,150 170,230 T370,190" fill="none" stroke="white" strokeWidth="38" strokeLinecap="round" />
        <path d="M-40,360 Q60,300 160,370 T360,330" fill="none" stroke="white" strokeWidth="32" strokeLinecap="round" />
      </svg>
    );
  }

  if (pattern === "clouds") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M-20,120 C40,65 95,150 145,90 C190,42 245,108 320,82 L320,400 L-20,400 Z" fill="white" />
        <path d="M-35,340 C60,280 95,365 170,315 C230,275 260,350 340,312 L340,420 L-35,420 Z" fill="white" opacity="0.7" />
      </svg>
    );
  }

  if (pattern === "confetti") {
    return (
      <div className="absolute inset-0 opacity-24">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-3 w-12 rotate-45 rounded-full bg-white/45"
            style={{ left: `${22 + (index % 4) * 62}px`, top: `${26 + Math.floor(index / 4) * 82}px` }}
          />
        ))}
      </div>
    );
  }

  if (pattern === "stripes") {
    return <div className="absolute inset-0 opacity-18 [background-image:repeating-linear-gradient(45deg,transparent_0,transparent_24px,white_24px,white_47px)]" />;
  }

  if (pattern === "ripples") {
    return (
      <div className="absolute inset-0 opacity-20">
        <span className="absolute -right-12 top-12 h-40 w-40 rounded-full border-[24px] border-white" />
        <span className="absolute -left-16 bottom-8 h-48 w-48 rounded-full border-[30px] border-white" />
        <span className="absolute bottom-28 right-12 h-24 w-24 rounded-full border-[18px] border-white" />
      </div>
    );
  }

  return <div className="absolute inset-0 opacity-18 [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_22px,white_22px,white_38px)]" />;
}

function FilterBar() {
  return (
    <div className="relative z-10 mx-auto -mt-[18px] flex h-[74px] max-w-[1390px] items-center gap-3 rounded-[32px] bg-white px-6 shadow-[0_12px_34px_rgba(25,60,35,0.12)]">
      <div className="flex h-[50px] min-w-0 flex-[1.1] items-center gap-3 rounded-full border border-[#e2e9e2] bg-white px-5 text-[#7a8795]">
        <Search className="h-6 w-6 text-[#00a66f]" />
        <span className="text-[16px] font-semibold">Tìm tài liệu, môn học, giảng viên...</span>
      </div>
      {filters.map((filter) => (
        <button key={filter.label} className="flex h-[50px] items-center gap-3 rounded-full border border-[#e2e9e2] bg-white px-5 text-[15px] font-extrabold text-[#10213a] transition hover:border-emerald-400 hover:bg-emerald-50/60">
          <span className="text-[#2e466b]">{filter.icon}</span>
          {filter.label}
          <ChevronDown className="h-4 w-4" />
        </button>
      ))}
      <div className="mx-1 h-9 w-px bg-slate-200" />
      <button className="flex h-[50px] items-center gap-3 rounded-full border border-[#e2e9e2] bg-white px-5 text-[15px] font-extrabold text-[#10213a] transition hover:border-emerald-400 hover:bg-emerald-50/60">
        <SlidersHorizontal className="h-5 w-5 text-[#2e466b]" /> Phổ biến <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}

function MaterialCardItem({ card }: { card: MaterialCard }) {
  return (
    <article className={`group relative flex min-h-[365px] select-none flex-col justify-between overflow-hidden rounded-[30px] p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${card.bgClass}`}>
      <MaterialPattern pattern={card.pattern} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 truncate">
          <span className="truncate text-[11px] font-black uppercase tracking-wide text-white/90">EDUMI | {card.subject}</span>
          <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-sm">{card.fileType}</span>
        </div>
        <button type="button" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/15 text-white/80 transition hover:bg-amber-400/90 hover:text-white" aria-label="Đánh giá tài liệu">
          <Star className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative z-10">
        <h2 className="mb-3 text-[33px] font-black uppercase leading-none tracking-[-0.055em] text-white drop-shadow-md transition-transform duration-300 group-hover:scale-[1.03]">
          {card.cardCode}
        </h2>
        <h3 className="line-clamp-2 text-[17px] font-black leading-[1.18] text-white/95 drop-shadow-sm">
          {card.detail}
        </h3>
        <div className="mt-5 flex items-center gap-2 text-[12px] font-black text-white/95">
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-white text-white" />{card.views}</span>
          <span className="opacity-70">|</span>
          <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-white/90" />{card.pages}</span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 pt-3">
        <Link href="#" className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-3 text-[13px] font-black text-slate-800 shadow-sm transition hover:bg-slate-50 hover:shadow-md">
          <Eye className={`h-3.5 w-3.5 ${card.accentClass}`} />
          <span>Xem</span>
          <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href="#" className="flex w-full items-center justify-center gap-1 rounded-2xl bg-white px-2 py-3 text-[13px] font-black text-slate-800 shadow-sm transition hover:bg-slate-50 hover:shadow-md">
          <Download className={`h-3.5 w-3.5 ${card.accentClass}`} />
          <span className="truncate">Tải về</span>
          <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export const metadata = {
  title: "Tài liệu",
  description: "Khám phá kho tài liệu học tập chọn lọc cùng EduMi.",
};

export default function MaterialsPage() {
  return (
    <main className={`${beVietnam.className} min-h-screen overflow-hidden bg-[#7f9b5d] text-[#10213a]`}>
      <LandingNavbar />
      <div
        className="relative min-h-screen pb-8 pt-[92px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        <Leaf className="absolute left-12 top-[110px] h-10 w-10 rotate-[-20deg] text-white/65" />
        <Leaf className="absolute left-12 top-[450px] h-12 w-12 rotate-[30deg] text-white/65" />
        <Sprout className="absolute right-16 top-[490px] h-8 w-8 text-white/70" />
        <Image
          src="/stickers/classes-corner-3d.png"
          alt=""
          aria-hidden="true"
          width={210}
          height={222}
          className="pointer-events-none absolute bottom-5 left-3 z-[1] h-auto w-[170px] -rotate-6 opacity-95 drop-shadow-[0_18px_24px_rgba(29,55,30,0.22)]"
        />
        <Image
          src="/stickers/classes-corner-3d.png"
          alt=""
          aria-hidden="true"
          width={210}
          height={222}
          className="pointer-events-none absolute bottom-5 right-3 z-[1] h-auto w-[178px] rotate-6 scale-x-[-1] opacity-95 drop-shadow-[0_18px_24px_rgba(29,55,30,0.22)]"
        />
        <Image
          src="/Capybara_EduMi_và_bảng_học_tập-removebg-preview.png"
          alt="Capybara EduMi với bảng học tập"
          width={523}
          height={477}
          priority
          className="class-hero-mascot-pop pointer-events-none absolute right-[255px] top-[80px] z-[2] hidden h-auto w-[330px] xl:block 2xl:right-[320px] 2xl:w-[370px] drop-shadow-[0_24px_34px_rgba(17,42,25,0.22)]"
        />

        <section className="mx-auto max-w-[1280px] px-6 pt-6">
          <div className="pb-10">
            <DropLetterTitle />
            <TypewriterDescription text={materialDescription} />
            <div className="relative mt-2 h-10">
              <span className="absolute left-[390px] top-0 text-[34px] font-black text-[#f6be3d]">〃</span>
              <span className="absolute left-[456px] top-6 h-[2px] w-14 -rotate-[20deg] bg-white/80" />
            </div>
          </div>
        </section>

        <FilterBar />

        <section className="relative z-10 mx-auto mt-6 grid max-w-[1390px] grid-cols-4 gap-6 px-6">
          {materialCards.map((card, index) => (
            <ClassCardReveal key={card.title} index={index} columns={4}>
              <MaterialCardItem card={card} />
            </ClassCardReveal>
          ))}
        </section>
      </div>
    </main>
  );
}
