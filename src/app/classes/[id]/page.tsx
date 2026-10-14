import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LandingNavbar from "@/components/landing/LandingNavbar";
import ClassDetailTabs from "@/components/classes/ClassDetailTabs";
import { createServiceClient } from "@/lib/supabase";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  CirclePlay,
  FileText,
  GraduationCap,
  Infinity,
  MonitorPlay,
  Play,
  Quote,
  Sigma,
  Star,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

type RawTeachingClass = {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  subject: string;
  grade_level: string;
  schedule_days: string | null;
  time_slot: string | null;
  total_lessons: number | null;
  difficulty: string | null;
  cover_image: string | null;
  student_count: number | null;
  rating_avg: number | null;
  rating_count: number | null;
  tuition_fee: number | null;
};

type TeacherInfo = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type ClassDetail = RawTeachingClass & {
  teacherName: string;
  teacherEmail: string | null;
  teacherAvatar: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function getSubjectTone(subject: string) {
  const normalized = subject.toLowerCase();
  if (normalized.includes("toán")) return "bg-sky-100 text-sky-700";
  if (normalized.includes("lý") || normalized.includes("vật")) return "bg-orange-100 text-orange-600";
  if (normalized.includes("hóa")) return "bg-fuchsia-100 text-fuchsia-600";
  if (normalized.includes("sinh")) return "bg-emerald-100 text-emerald-700";
  if (normalized.includes("văn")) return "bg-rose-100 text-rose-600";
  if (normalized.includes("anh") || normalized.includes("ielts")) return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
}

function getClassCover(subject: string, coverImage: string | null) {
  if (coverImage) return coverImage;
  const normalized = subject.toLowerCase();
  if (normalized.includes("anh") || normalized.includes("ielts")) return "/classes/class-english.jpg";
  if (normalized.includes("lý") || normalized.includes("vật") || normalized.includes("hóa")) return "/classes/class-physics.jpg";
  if (normalized.includes("văn")) return "/classes/class-literature.jpg";
  return "/classes/class-math.jpg";
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return (words[0] || "GV").slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[words.length - 1][0] ?? ""}`.toUpperCase();
}

function formatStudents(value: number | null) {
  const count = value ?? 0;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(".0", "")}K`;
  return `${count}`;
}

async function getClassDetail(id: string): Promise<ClassDetail | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("teaching_classes")
      .select("id, teacher_id, title, description, subject, grade_level, schedule_days, time_slot, total_lessons, difficulty, cover_image, student_count, rating_avg, rating_count, tuition_fee")
      .eq("id", id)
      .eq("status", "approved")
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("Failed to load class detail", error);
      return null;
    }

    const rawClass = data as RawTeachingClass;
    const { data: teacher } = await supabase
      .from("users")
      .select("id, full_name, email, avatar_url")
      .eq("id", rawClass.teacher_id)
      .maybeSingle();

    const teacherInfo = teacher as TeacherInfo | null;
    const teacherName = teacherInfo?.full_name?.trim() || "Giáo viên EduMi";

    return {
      ...rawClass,
      teacherName,
      teacherEmail: teacherInfo?.email || null,
      teacherAvatar: teacherInfo?.avatar_url || null,
    };
  } catch (error) {
    console.error("Failed to load class detail page", error);
    return null;
  }
}

function subjectIcon(subject: string) {
  return subject.toLowerCase().includes("toán") ? <Sigma className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;
}

function LearningOutcomes({ classItem }: { classItem: ClassDetail }) {
  const subject = classItem.subject;
  const outcomes = [
    `Nắm vững kiến thức trọng tâm của ${subject} theo đúng lộ trình khóa học`,
    "Biết cách hệ thống kiến thức, ghi nhớ nhanh và vận dụng vào bài tập",
    "Thành thạo các dạng bài thường gặp qua ví dụ minh họa dễ hiểu",
    "Vận dụng kiến thức vào bài kiểm tra, bài thi và tình huống thực tế",
    "Rèn luyện tư duy logic và kỹ năng trình bày lời giải rõ ràng",
    "Có hệ thống bài tập từ cơ bản đến nâng cao, kèm định hướng ôn luyện",
  ];

  return (
    <section className="rounded-[20px] border border-emerald-100/80 bg-white p-6 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Target className="h-5 w-5" />
        </span>
        <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#10213a]">Bạn sẽ học được gì?</h2>
        <span className="ml-auto hidden h-8 w-10 rotate-[-18deg] border-l-4 border-r-4 border-[#ffc93d] md:block" />
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[14px] font-semibold leading-relaxed text-[#51637c]">
        {outcomes.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#15b87a] text-white">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CurriculumCard({ totalLessons }: { totalLessons: number }) {
  const chapters = [
    { title: "Chương 1: Nền tảng kiến thức trọng tâm", lessons: Math.max(1, Math.round(totalLessons * 0.35)), duration: "3 giờ 15 phút" },
    { title: "Chương 2: Luyện tập theo dạng bài", lessons: Math.max(1, Math.round(totalLessons * 0.4)), duration: "5 giờ 20 phút" },
    { title: "Chương 3: Ứng dụng và tổng ôn", lessons: Math.max(1, totalLessons - Math.round(totalLessons * 0.35) - Math.round(totalLessons * 0.4)), duration: "3 giờ 55 phút" },
  ];

  return (
    <section className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <BookOpen className="h-5 w-5" />
        </span>
        <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#10213a]">Nội dung khóa học</h2>
        <span className="ml-auto text-[13px] font-bold text-[#62718a]">{totalLessons} bài học&nbsp;&nbsp;•&nbsp;&nbsp;3 chương&nbsp;&nbsp;•&nbsp;&nbsp;12 giờ 30 phút</span>
      </div>
      <div className="space-y-3">
        {chapters.map((chapter, index) => (
          <div key={chapter.title} className="flex h-[58px] items-center gap-4 rounded-[15px] border border-slate-200 bg-slate-50/60 px-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">{index + 1}</span>
            <span className="min-w-0 flex-1 truncate text-[15px] font-black text-[#10213a]">{chapter.title}</span>
            <span className="text-[13px] font-bold text-[#63738d]">{chapter.lessons} bài học&nbsp;&nbsp;•&nbsp;&nbsp;{chapter.duration}</span>
            <ChevronDown className="h-4 w-4 text-[#10213a]" />
          </div>
        ))}
      </div>
    </section>
  );
}

function InstructorCard({ classItem }: { classItem: ClassDetail }) {
  return (
    <aside className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><GraduationCap className="h-4 w-4" /></span>
        <h3 className="text-[18px] font-black text-[#10213a]">Giáo viên hướng dẫn</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-emerald-100 ring-4 ring-emerald-50">
          {classItem.teacherAvatar ? <Image src={classItem.teacherAvatar} alt={classItem.teacherName} fill sizes="64px" className="object-cover" /> : <span className="flex h-full w-full items-center justify-center text-lg font-black text-emerald-800">{getInitials(classItem.teacherName)}</span>}
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[17px] font-black text-[#10213a]">{classItem.teacherName}</h4>
          <p className="text-sm font-semibold text-[#64728a]">Giáo viên {classItem.subject}</p>
        </div>
        <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-[#10213a] transition hover:border-emerald-300 hover:bg-emerald-50">Theo dõi</button>
      </div>
      <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 text-center">
        <div><p className="font-black text-[#10213a]">8 năm</p><p className="text-xs font-bold text-[#64728a]">kinh nghiệm</p></div>
        <div><p className="font-black text-[#10213a]">12K+</p><p className="text-xs font-bold text-[#64728a]">học sinh</p></div>
        <div><p className="font-black text-[#10213a]">{Number(classItem.rating_avg || 0).toFixed(1)}/5</p><p className="text-xs font-bold text-[#64728a]">đánh giá</p></div>
      </div>
      <div className="mt-5 rounded-2xl bg-emerald-50/80 p-4 text-[13px] font-semibold italic leading-relaxed text-[#52657c]">
        <Quote className="mb-2 h-5 w-5 text-emerald-600" />
        “Học tập hiệu quả bắt đầu từ một lộ trình rõ ràng và sự đồng hành đúng lúc.”
        <p className="mt-2 text-right font-bold not-italic text-[#10213a]">— {classItem.teacherName}</p>
      </div>
    </aside>
  );
}

function CourseInfoCard({ classItem, totalLessons }: { classItem: ClassDetail; totalLessons: number }) {
  const items = [
    { icon: <BookOpen className="h-5 w-5" />, text: `${totalLessons} bài học` },
    { icon: <BarChart3 className="h-5 w-5" />, text: `Trình độ: ${classItem.difficulty || "Trung bình"}` },
    { icon: <MonitorPlay className="h-5 w-5" />, text: "Hình thức: Học online, xem mọi lúc" },
    { icon: <FileText className="h-5 w-5" />, text: "Tài liệu: Slide bài giảng, bài tập, đề thi mẫu" },
    { icon: <Infinity className="h-5 w-5" />, text: "Truy cập: Trọn đời sau khi đăng ký" },
  ];

  return (
    <aside className="relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Trophy className="h-4 w-4" /></span>
        <h3 className="text-[18px] font-black text-[#10213a]">Thông tin khóa học</h3>
      </div>
      <div className="space-y-3 pb-8">
        {items.map((item) => (
          <div key={item.text} className="flex items-center gap-3 text-sm font-bold text-[#52657c]">
            <span className="text-[#254469]">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      <Image src="/stickers/classes-corner-3d.png" alt="" width={150} height={150} className="absolute bottom-[-22px] right-[-12px] h-auto w-[120px] opacity-95" />
    </aside>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const classItem = await getClassDetail(id);

  return {
    title: classItem ? `${classItem.title} | EduMi` : "Chi tiết lớp học | EduMi",
    description: classItem?.description || "Chi tiết lớp học EduMi.",
  };
}

export default async function ClassDetailPage({ params }: PageProps) {
  const { id } = await params;
  const classItem = await getClassDetail(id);

  if (!classItem) notFound();

  const totalLessons = classItem.total_lessons || 0;
  const rating = Number(classItem.rating_avg || 0);
  const ratingCount = Number(classItem.rating_count || 0);
  const cover = getClassCover(classItem.subject, classItem.cover_image);

  return (
    <main className={`${beVietnam.className} min-h-screen bg-[#f5faf6] text-[#10213a]`}>
      <LandingNavbar />
      <section
        className="relative overflow-hidden bg-[#7f9b5d] pt-[86px]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >

        <div className="mx-auto grid h-[455px] max-w-[1360px] grid-cols-[0.9fr_1.08fr] items-center gap-12 px-6">
          <div className="pb-2 pt-5">
            <h1 className="max-w-[740px] text-[50px] font-black leading-[0.98] tracking-[-0.055em] text-[#092235]">
              {classItem.title}
            </h1>

            <div className="mt-6 flex items-center gap-7 whitespace-nowrap text-white">
              <div className="flex items-center gap-3 text-[#10213a]">
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white ring-2 ring-white/80">
                  {classItem.teacherAvatar ? <Image src={classItem.teacherAvatar} alt={classItem.teacherName} fill sizes="44px" className="object-cover" /> : <span className="flex h-full w-full items-center justify-center text-sm font-black text-emerald-800">{getInitials(classItem.teacherName)}</span>}
                </div>
                <div>
                  <p className="text-[14px] font-black">{classItem.teacherName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-black text-white"><Star className="h-5 w-5 fill-[#ffc93d] text-[#ffc93d]" /><span>{rating > 0 ? rating.toFixed(1) : "5.0"}/5</span><span className="text-xs font-bold text-white/80">({ratingCount || 24} đánh giá)</span></div>
              <div className="flex items-center gap-2 font-black text-white"><BookOpen className="h-5 w-5" />{totalLessons} bài học</div>
              <div className="flex items-center gap-2 font-black text-white"><UsersRound className="h-5 w-5" />{formatStudents(classItem.student_count)}</div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Link href={`/classes/${classItem.id}/workspace`} className="inline-flex h-12 min-w-[208px] items-center justify-center gap-3 rounded-full bg-[#00a66f] px-7 text-[16px] font-black text-white shadow-[0_10px_24px_rgba(0,120,80,0.22)] transition hover:bg-[#008b5f]"><CirclePlay className="h-5 w-5 fill-white/20" />Xin vào lớp <ArrowRight className="h-5 w-5" /></Link>
              <button className="inline-flex h-12 min-w-[214px] items-center justify-center gap-3 rounded-full bg-white px-7 text-[16px] font-black text-[#10213a] shadow-[0_8px_22px_rgba(24,72,50,0.12)] transition hover:bg-emerald-50"><Play className="h-4 w-4 fill-[#10213a]" />Liên hệ Giáo viên</button>
            </div>
          </div>

          <div className="relative w-full max-w-[560px] -translate-y-[35px] justify-self-end">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border-[10px] border-white bg-white shadow-[0_20px_38px_rgba(22,58,38,0.24)]">
              <Image src={cover} alt={classItem.title} fill priority sizes="(max-width: 1200px) 46vw, 560px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/10 via-transparent to-amber-200/10" />
              <button className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#00a66f] shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition hover:scale-105">
                <Play className="ml-1 h-7 w-7 fill-[#00a66f]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-1 rounded-t-[28px] bg-[#f8fbfa] pb-12 pt-3 shadow-[0_-8px_24px_rgba(24,72,50,0.06)]">
        <div className="mx-auto max-w-[1258px] px-6">
          <ClassDetailTabs classItem={classItem} totalLessons={totalLessons} />

        </div>
      </section>
    </main>
  );
}