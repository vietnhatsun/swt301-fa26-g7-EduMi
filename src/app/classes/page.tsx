import Image from "next/image";
import Link from "next/link";
import LandingNavbar from "@/components/landing/LandingNavbar";
import TypewriterDescription from "@/components/classes/TypewriterDescription";
import ClassCardReveal from "@/components/classes/ClassCardReveal";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  FlaskConical,
  Globe2,
  GraduationCap,
  Leaf,
  LibraryBig,
  MonitorPlay,
  Search,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  UsersRound,
} from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const classCards = [
  {
    subject: "Toán",
    icon: <Sigma className="h-4 w-4" />,
    badgeClass: "bg-sky-100 text-sky-700",
    title: "Toán 9 - Nắm chắc kiến thức vững vàng vào 10",
    description: "Hệ thống kiến thức trọng tâm, bài tập có lời giải chi tiết và mẹo làm nhanh.",
    teacher: "Cô Nguyễn Thảo",
    avatar: "NT",
    cover: "/classes/class-math.jpg",
    lessons: "48 bài học",
    level: "Trung bình",
    students: "12.4K",
  },
  {
    subject: "Vật lý",
    icon: <Sparkles className="h-4 w-4" />,
    badgeClass: "bg-orange-100 text-orange-600",
    title: "Vật lý 10 - Khám phá thế giới quanh ta",
    description: "Hiểu bản chất, liên hệ thực tế, học Vật lý dễ dàng và thú vị hơn.",
    teacher: "Thầy Trần Minh",
    avatar: "TM",
    cover: "/classes/class-physics.jpg",
    lessons: "36 bài học",
    level: "Trung bình",
    students: "9.8K",
  },
  {
    subject: "Hóa học",
    icon: <FlaskConical className="h-4 w-4" />,
    badgeClass: "bg-fuchsia-100 text-fuchsia-600",
    title: "Hóa học 11 - Từ nền tảng đến nâng cao",
    description: "Học chắc lý thuyết, làm chủ bài tập và chinh phục các dạng đề khó.",
    teacher: "Cô Lê Mai Anh",
    avatar: "MA",
    cover: "/about-documents.jpg",
    lessons: "42 bài học",
    level: "Nâng cao",
    students: "8.1K",
  },
  {
    subject: "Sinh học",
    icon: <Leaf className="h-4 w-4" />,
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Sinh học 10 - Thế giới sống quanh ta",
    description: "Khám phá thế giới sinh vật kỳ thú qua hình ảnh, ví dụ thực tế sinh động.",
    teacher: "Thầy Phạm Đức",
    avatar: "PĐ",
    cover: "/about-classroom.jpg",
    lessons: "38 bài học",
    level: "Dễ - Trung bình",
    students: "7.6K",
  },
  {
    subject: "Ngữ văn",
    icon: <BookOpen className="h-4 w-4" />,
    badgeClass: "bg-rose-100 text-rose-600",
    title: "Ngữ văn 9 - Cảm thụ và làm văn hiệu quả",
    description: "Học văn bằng cảm hứng, phương pháp rõ ràng và bài mẫu chọn lọc.",
    teacher: "Cô Trần Khánh Linh",
    avatar: "KL",
    cover: "/classes/class-literature.jpg",
    lessons: "40 bài học",
    level: "Trung bình",
    students: "6.9K",
  },
  {
    subject: "Tiếng Anh",
    icon: <Globe2 className="h-4 w-4" />,
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Tiếng Anh 9 - Giao tiếp tự tin, thi cử vững vàng",
    description: "Phát triển toàn diện 4 kỹ năng với phương pháp học hiện đại.",
    teacher: "Thầy Lê Hoàng",
    avatar: "LH",
    cover: "/classes/class-english.jpg",
    lessons: "50 bài học",
    level: "Trung bình",
    students: "15.2K",
  },
  {
    subject: "Lịch sử",
    icon: <BookOpen className="h-4 w-4" />,
    badgeClass: "bg-amber-100 text-amber-700",
    title: "Lịch sử 12 - Chinh phục mốc sự kiện trọng tâm",
    description: "Hệ thống dòng thời gian, sơ đồ tư duy và bài luyện theo chủ đề giúp ghi nhớ sâu hơn.",
    teacher: "Cô Hà Minh Châu",
    avatar: "HC",
    cover: "/classes/banner-classes.jpg",
    lessons: "44 bài học",
    level: "Trung bình",
    students: "10.6K",
  },
  {
    subject: "Địa lý",
    icon: <Globe2 className="h-4 w-4" />,
    badgeClass: "bg-cyan-100 text-cyan-700",
    title: "Địa lý 12 - Atlat, biểu đồ và kỹ năng làm bài",
    description: "Luyện đọc Atlat, nhận dạng biểu đồ và xử lý số liệu nhanh cho các kỳ thi quan trọng.",
    teacher: "Thầy Võ Quốc Bảo",
    avatar: "QB",
    cover: "/classes/banner-illustration.jpg",
    lessons: "32 bài học",
    level: "Dễ - Trung bình",
    students: "8.7K",
  },
  {
    subject: "Tin học",
    icon: <MonitorPlay className="h-4 w-4" />,
    badgeClass: "bg-indigo-100 text-indigo-700",
    title: "Tin học 10 - Tư duy thuật toán từ nền tảng",
    description: "Học lập trình qua ví dụ trực quan, bài tập nhỏ và thử thách tăng dần mỗi tuần.",
    teacher: "Thầy Đỗ Minh Khang",
    avatar: "MK",
    cover: "/classes/class-physics.jpg",
    lessons: "35 bài học",
    level: "Cơ bản",
    students: "5.4K",
  },
  {
    subject: "GDCD",
    icon: <GraduationCap className="h-4 w-4" />,
    badgeClass: "bg-lime-100 text-lime-700",
    title: "GDCD 11 - Hiểu luật, nhớ nhanh tình huống",
    description: "Tóm tắt kiến thức bằng tình huống đời sống, câu hỏi nhận biết và vận dụng sát đề.",
    teacher: "Cô Bùi Thanh Vân",
    avatar: "TV",
    cover: "/about-classroom.jpg",
    lessons: "28 bài học",
    level: "Cơ bản",
    students: "4.9K",
  },
  {
    subject: "IELTS",
    icon: <Globe2 className="h-4 w-4" />,
    badgeClass: "bg-violet-100 text-violet-700",
    title: "IELTS Foundation - Xây nền 4 kỹ năng vững chắc",
    description: "Tăng vốn từ, luyện phát âm, đọc hiểu và viết câu chuẩn trước khi bước vào band cao.",
    teacher: "Ms. Linh Nguyễn",
    avatar: "LN",
    cover: "/classes/class-english.jpg",
    lessons: "52 bài học",
    level: "Cơ bản",
    students: "13.3K",
  },
  {
    subject: "Toán tư duy",
    icon: <Sigma className="h-4 w-4" />,
    badgeClass: "bg-teal-100 text-teal-700",
    title: "Toán tư duy 8 - Rèn logic và phản xạ giải đề",
    description: "Kết hợp bài toán thực tế, hình học trực quan và mẹo phân tích đề nhanh, chắc.",
    teacher: "Thầy Lâm Nhật Anh",
    avatar: "NA",
    cover: "/classes/class-math.jpg",
    lessons: "46 bài học",
    level: "Nâng cao",
    students: "9.2K",
  },];

const filters = [
  { label: "Khối lớp", icon: <GraduationCap className="h-5 w-5" /> },
  { label: "Môn học", icon: <LibraryBig className="h-5 w-5" /> },
  { label: "Hình thức học", icon: <MonitorPlay className="h-5 w-5" /> },
  { label: "Mức độ", icon: <BarChart3 className="h-5 w-5" /> },
];

const heroTitleLines = ["Khám phá lớp học", "phù hợp cho bạn"];
const heroDescription =
  "Hàng ngàn lớp học chất lượng, được thiết kế bởi giáo viên và chuyên gia hàng đầu. Tìm lớp phù hợp, bắt đầu hành trình học tập hiệu quả ngay hôm nay!";

function DropLetterTitle() {
  let letterIndex = 0;
  const fullTitle = heroTitleLines.join(" ");

  return (
    <h1
      aria-label={fullTitle}
      className="max-w-[520px] text-[54px] font-black leading-[0.98] tracking-[-0.055em] text-[#092235]"
    >
      {heroTitleLines.map((line) => (
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

function FilterBar() {
  return (
    <div className="relative z-10 mx-auto -mt-[18px] flex h-[74px] max-w-[1390px] items-center gap-3 rounded-[32px] bg-white px-6 shadow-[0_12px_34px_rgba(25,60,35,0.12)]">
      <div className="flex h-[50px] min-w-0 flex-[1.1] items-center gap-3 rounded-full border border-[#e2e9e2] bg-white px-5 text-[#7a8795]">
        <Search className="h-6 w-6 text-[#00a66f]" />
        <span className="text-[16px] font-semibold">Tìm lớp học, môn học, giáo viên...</span>
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

function ClassCard({ card }: { card: (typeof classCards)[number] }) {
  return (
    <article className="group flex h-[242px] flex-col overflow-hidden rounded-[18px] bg-white p-3 shadow-[0_8px_24px_rgba(25,60,35,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(25,60,35,0.13)]">
      <div className="grid min-h-0 flex-1 grid-cols-[40%_60%] gap-4">
        <div className="relative min-h-0 overflow-hidden rounded-[14px] bg-emerald-50">
          <Image src={card.cover} alt={card.title} fill sizes="220px" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
        </div>
        <div className="flex min-w-0 flex-col py-1 pr-2">
          <span className={`mb-2 inline-flex h-8 w-fit items-center gap-2 rounded-full px-3.5 text-[14px] font-extrabold ${card.badgeClass}`}>
            {card.icon}
            {card.subject}
          </span>
          <h2 className="line-clamp-2 text-[18px] font-black leading-[1.16] tracking-[-0.035em] text-[#10213a]">
            {card.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-[13.5px] font-medium leading-[1.42] text-[#64728a]">
            {card.description}
          </p>
          <div className="mt-auto flex items-center gap-2.5 pb-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">
              {card.avatar}
            </span>
            <span className="truncate text-[13px] font-extrabold text-[#23324a]">{card.teacher}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex h-[38px] items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex min-w-0 items-center gap-4 text-[12px] font-semibold text-[#66758d]">
          <span className="flex items-center gap-1 whitespace-nowrap"><BookOpen className="h-4 w-4" />{card.lessons}</span>
          <span className="flex items-center gap-1 whitespace-nowrap"><BarChart3 className="h-4 w-4" />{card.level}</span>
          <span className="flex items-center gap-1 whitespace-nowrap"><UsersRound className="h-4 w-4" />{card.students}</span>
        </div>
        <Link href="#" className="flex h-[38px] shrink-0 items-center gap-2 rounded-full bg-[#00a66f] px-4 text-[13px] font-black text-white transition hover:bg-[#008b5f]">
          Xem l&#7899;p h&#7885;c <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
export const metadata = {
  title: "Lớp học",
  description: "Khám phá lớp học phù hợp cho bạn cùng EduMi.",
};

export default function ClassesPage() {
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
          src="/Mascot_học_tập_và_bảng_checklist_xanh-removebg-preview.png"
          alt="Mascot học tập với bảng checklist xanh"
          width={500}
          height={500}
          priority
          className="class-hero-mascot-pop pointer-events-none absolute right-[250px] top-[83px] z-[2] hidden h-auto w-[320px] xl:block 2xl:right-[315px] 2xl:w-[360px] drop-shadow-[0_24px_34px_rgba(17,42,25,0.22)]"
        />

        <section className="mx-auto max-w-[1280px] px-6 pt-6">
          <div className="pb-10">
            <DropLetterTitle />
            <TypewriterDescription text={heroDescription} />
            <div className="relative mt-2 h-10">
              <span className="absolute left-[390px] top-0 text-[34px] font-black text-[#f6be3d]">〃</span>
              <span className="absolute left-[456px] top-6 h-[2px] w-14 -rotate-[20deg] bg-white/80" />
            </div>
          </div>
        </section>

        <FilterBar />

        <section className="relative z-10 mx-auto mt-4 grid max-w-[1390px] grid-cols-3 gap-4 px-3">
          {classCards.map((card, index) => (
            <ClassCardReveal key={card.title} index={index}>
              <ClassCard card={card} />
            </ClassCardReveal>
          ))}
        </section>
      </div>
    </main>
  );
}