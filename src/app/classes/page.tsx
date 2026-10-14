import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import TypewriterDescription from "@/components/classes/TypewriterDescription";
import ClassCardReveal from "@/components/classes/ClassCardReveal";
import { createServiceClient } from "@/lib/supabase";
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

type ClassCardData = {
  id: string;
  subject: string;
  icon: ReactNode;
  badgeClass: string;
  title: string;
  description: string;
  teacher: string;
  avatar: string;
  cover: string;
  lessons: string;
  level: string;
  students: string;
};

type ApprovedTeachingClass = {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  subject: string;
  grade_level: string;
  total_lessons: number | null;
  difficulty: string | null;
  cover_image: string | null;
  student_count: number | null;
  rating_avg: number | null;
  rating_count: number | null;
  reviewed_at: string | null;
  created_at: string;
};

type ClassTeacher = {
  id: string;
  full_name: string | null;
  email: string | null;
};

function getSubjectIcon(subject: string) {
  const normalized = subject.toLowerCase();

  if (normalized.includes("toán")) return <Sigma className="h-4 w-4" />;
  if (normalized.includes("lý") || normalized.includes("vật")) return <Sparkles className="h-4 w-4" />;
  if (normalized.includes("hóa")) return <FlaskConical className="h-4 w-4" />;
  if (normalized.includes("sinh")) return <Leaf className="h-4 w-4" />;
  if (normalized.includes("anh") || normalized.includes("ielts")) return <Globe2 className="h-4 w-4" />;
  if (normalized.includes("tin")) return <MonitorPlay className="h-4 w-4" />;
  if (normalized.includes("địa")) return <Globe2 className="h-4 w-4" />;

  return <BookOpen className="h-4 w-4" />;
}

function getSubjectBadgeClass(subject: string) {
  const normalized = subject.toLowerCase();

  if (normalized.includes("toán")) return "bg-sky-100 text-sky-700";
  if (normalized.includes("lý") || normalized.includes("vật")) return "bg-orange-100 text-orange-600";
  if (normalized.includes("hóa")) return "bg-fuchsia-100 text-fuchsia-600";
  if (normalized.includes("sinh")) return "bg-emerald-100 text-emerald-700";
  if (normalized.includes("văn")) return "bg-rose-100 text-rose-600";
  if (normalized.includes("anh") || normalized.includes("ielts")) return "bg-blue-100 text-blue-700";
  if (normalized.includes("địa")) return "bg-cyan-100 text-cyan-700";
  if (normalized.includes("tin")) return "bg-indigo-100 text-indigo-700";

  return "bg-amber-100 text-amber-700";
}

function getClassCover(subject: string, coverImage: string | null) {
  if (coverImage) return coverImage;

  const normalized = subject.toLowerCase();
  if (normalized.includes("anh") || normalized.includes("ielts")) return "/classes/class-english.jpg";
  if (normalized.includes("lý") || normalized.includes("vật") || normalized.includes("hóa")) return "/classes/class-physics.jpg";
  if (normalized.includes("văn")) return "/classes/class-literature.jpg";
  if (normalized.includes("sinh")) return "/about-classroom.jpg";

  return "/classes/class-math.jpg";
}

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "GV";
  const words = source.split(/\s+/).filter(Boolean);

  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0] ?? ""}${words[words.length - 1][0] ?? ""}`.toUpperCase();
}

function formatStudents(count: number | null) {
  const value = count ?? 0;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(".0", "")}K`;

  return `${value}`;
}

async function getApprovedClassCards(subjectFilter?: string): Promise<ClassCardData[]> {
  try {
    const supabase = createServiceClient();
    let query = supabase
      .from("teaching_classes")
      .select("id, teacher_id, title, description, subject, grade_level, total_lessons, difficulty, cover_image, student_count, rating_avg, rating_count, reviewed_at, created_at")
      .eq("status", "approved");

    if (subjectFilter) query = query.eq("subject", subjectFilter);

    const { data, error } = await query
      .order("reviewed_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load approved classes", error);
      return [];
    }

    const approvedClasses = (data ?? []) as ApprovedTeachingClass[];
    if (approvedClasses.length === 0) return [];

    const teacherIds = Array.from(new Set(approvedClasses.map((item) => item.teacher_id).filter(Boolean)));
    const { data: teachers } = teacherIds.length
      ? await supabase.from("users").select("id, full_name, email").in("id", teacherIds)
      : { data: [] as ClassTeacher[] };

    const teacherById = new Map(((teachers as ClassTeacher[] | null) ?? []).map((teacher) => [teacher.id, teacher]));

    return approvedClasses.map((item) => {
      const teacher = teacherById.get(item.teacher_id);
      const teacherName = teacher?.full_name?.trim() || "Giáo viên EduMi";

      return {
        id: item.id,
        subject: item.subject,
        icon: getSubjectIcon(item.subject),
        badgeClass: getSubjectBadgeClass(item.subject),
        title: item.title,
        description:
          item.description?.trim() ||
          `Lớp ${item.grade_level} được thiết kế theo lộ trình rõ ràng, giúp học sinh học chắc và tiến bộ đều.`,
        teacher: teacherName,
        avatar: getInitials(teacherName, teacher?.email),
        cover: getClassCover(item.subject, item.cover_image),
        lessons: `${item.total_lessons ?? 0} bài học`,
        level: item.difficulty || "Trung bình",
        students: formatStudents(item.student_count),
      };
    });
  } catch (error) {
    console.error("Failed to load classes page data", error);
    return [];
  }
}

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

function ClassCard({ card }: { card: ClassCardData }) {
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
        <Link href={`/classes/${card.id}`} className="flex h-[38px] shrink-0 items-center gap-2 rounded-full bg-[#00a66f] px-4 text-[13px] font-black text-white transition hover:bg-[#008b5f]">
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

type ClassesPageProps = {
  searchParams: Promise<{ subject?: string }>;
};

export default async function ClassesPage({ searchParams }: ClassesPageProps) {
  const { subject } = await searchParams;
  const approvedClassCards = await getApprovedClassCards(subject?.trim() || undefined);
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
          {approvedClassCards.length > 0 ? (
            approvedClassCards.map((card, index) => (
              <ClassCardReveal key={card.id} index={index}>
                <ClassCard card={card} />
              </ClassCardReveal>
            ))
          ) : (
            <div className="col-span-3 rounded-[24px] bg-white/95 p-8 text-center text-[16px] font-bold text-[#50627c] shadow-[0_10px_28px_rgba(25,60,35,0.1)]">
              Chưa có lớp học nào được duyệt để hiển thị công khai.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}