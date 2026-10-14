import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import LandingNavbar from "@/components/landing/LandingNavbar";
import { classWorkspaceMock } from "@/components/classes/classWorkspaceMock";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  Check,
  CircleDot,
  ClipboardList,
  CloudUpload,
  FileText,
  GraduationCap,
  MoreVertical,
  PencilLine,
  Play,
  Target,
} from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

type PageProps = {
  params: Promise<{ id: string }>;
};

const fileIconTone = {
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-violet-100 text-violet-600",
};

const actionTone = {
  green: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  yellow: "bg-amber-100 text-amber-800 hover:bg-amber-200",
};

function CardHeader({ icon, title, action }: { icon: ReactNode; title: string; action?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">{icon}</span>
        <h2 className="text-[20px] font-black tracking-[-0.03em] text-[#11263F]">{title}</h2>
      </div>
      {action && <button className="inline-flex items-center gap-1 text-xs font-black text-emerald-700">{action}<ArrowRight className="h-3.5 w-3.5" /></button>}
    </div>
  );
}

function ClassSidebar({ classId }: { classId: string }) {
  return (
    <aside className="sticky top-[92px] hidden h-[calc(100vh-112px)] w-[198px] shrink-0 rounded-[24px] border border-[#E7EEE9] bg-white p-4 shadow-[0_8px_28px_rgba(20,75,50,.07)] xl:block">
      <nav className="space-y-2">
        {classWorkspaceMock.navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={`/classes/${classId}/workspace`}
              className={`flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-black transition ${item.active ? "bg-emerald-100 text-[#0C6047]" : "text-[#263A59] hover:bg-emerald-50"}`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-[22px] bg-[#F2FBF6] px-3 pb-3 pt-5">
        <p className="relative z-10 ml-auto w-[96px] rotate-[-8deg] text-center text-[13px] font-bold leading-tight text-[#16875A]">
          Cùng học<br />cùng tiến bộ nha! <span className="text-rose-400">♥</span>
        </p>
        <Image src="/stickers/laptop-capybara.png" alt="Capybara học cùng EduMi" width={180} height={150} className="mt-1 h-auto w-[150px] -translate-x-1" />
      </div>
    </aside>
  );
}

function WelcomeCard() {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-[#DDEDE4] bg-gradient-to-r from-[#FFF9ED] via-[#F1FAF4] to-[#EAF8F1] px-6 py-5 shadow-[0_8px_28px_rgba(20,75,50,.07)]">
      <div className="relative z-10 max-w-[560px]">
        <p className="mb-1 flex items-center gap-2 text-sm font-extrabold text-[#16875A]"><span className="text-xl">☀</span> Chào {classWorkspaceMock.studentName}!</p>
        <h1 className="text-[26px] font-black tracking-[-0.04em] text-[#11263F]">Tiếp tục học hôm nay nhé!</h1>
        <p className="mt-1 text-sm font-semibold text-[#62718A]">Mỗi ngày một chút, bạn đang tiến gần hơn đến mục tiêu của mình đó!</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {classWorkspaceMock.welcomeActions.map((action) => (
            <button key={action.label} className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-black transition ${actionTone[action.tone as keyof typeof actionTone]}`}>
              {action.tone === "green" ? <BookOpen className="h-4 w-4" /> : action.tone === "blue" ? <PencilLine className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
              {action.label}<ArrowRight className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-5 hidden h-full w-[270px] md:block">
        <div className="absolute right-2 top-5 rounded-[18px] border border-emerald-100 bg-white px-4 py-2 text-center text-xs font-black leading-tight text-[#0C6047] shadow-sm">Cố lên<br />bạn nhé!</div>
        <Image src="/hero-capybara-study.png" alt="Capybara đọc sách" width={260} height={190} className="absolute bottom-[-18px] right-8 h-auto w-[190px]" />
      </div>
    </section>
  );
}

function MaterialsCard() {
  return (
    <section className="rounded-[22px] border border-[#E7EEE9] bg-white p-5 shadow-[0_8px_28px_rgba(20,75,50,.07)]">
      <CardHeader icon={<FileText className="h-4 w-4" />} title="Tài liệu học tập" action="Xem tất cả" />
      <p className="-mt-2 mb-2 text-xs font-semibold text-[#718199]">Tài liệu, bài giảng và học liệu được giáo viên chia sẻ cho lớp.</p>
      <div className="divide-y divide-slate-100">
        {classWorkspaceMock.materials.map((item) => (
          <div key={item.title} className="grid min-h-[58px] grid-cols-[40px_minmax(0,1fr)_70px_78px_28px] items-center gap-3 py-2">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${fileIconTone[item.color as keyof typeof fileIconTone]}`}><FileText className="h-4 w-4" /></span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-[#11263F]">{item.title}</h3>
              <p className="truncate text-xs font-semibold text-[#7A889C]">{item.meta}</p>
            </div>
            <span className="rounded-full bg-slate-50 px-2 py-1 text-center text-[11px] font-black text-[#52657C]">{item.type}</span>
            <button className="h-8 rounded-xl bg-emerald-50 text-xs font-black text-emerald-700">Xem</button>
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </div>
        ))}
      </div>
    </section>
  );
}

function AssignmentsCard() {
  const statusTone: Record<string, string> = {
    "Đã nộp": "bg-emerald-100 text-emerald-700",
    "Sắp đến hạn": "bg-amber-100 text-amber-700",
    "Chưa nộp": "bg-rose-100 text-rose-700",
  };

  return (
    <section className="rounded-[22px] border border-[#E7EEE9] bg-white p-5 shadow-[0_8px_28px_rgba(20,75,50,.07)]">
      <CardHeader icon={<ClipboardList className="h-4 w-4" />} title="Nộp bài tập" action="Xem tất cả" />
      <p className="-mt-2 mb-2 text-xs font-semibold text-[#718199]">Các bài tập, đề bài và hạn nộp từ giáo viên.</p>
      <div className="divide-y divide-slate-100">
        {classWorkspaceMock.assignments.map((item) => (
          <div key={item.title} className="grid min-h-[62px] grid-cols-[40px_minmax(0,1fr)_168px_96px_92px] items-center gap-3 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><ClipboardList className="h-4 w-4" /></span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-[#11263F]">{item.title}</h3>
              <p className="truncate text-xs font-semibold text-[#7A889C]">{item.chapter} • {item.questions}</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-[#64728A]"><CalendarClock className="h-4 w-4" />Hạn nộp: {item.deadline}</span>
            <span className={`rounded-full px-3 py-1 text-center text-xs font-black ${statusTone[item.status]}`}>{item.status}</span>
            <button className={`h-9 rounded-xl text-xs font-black ${item.status === "Đã nộp" ? "bg-emerald-50 text-emerald-700" : "bg-[#16875A] text-white"}`}>{item.status === "Đã nộp" ? "Xem chi tiết" : "Nộp bài"}</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex min-h-[58px] items-center justify-between rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 px-5 text-sm">
        <div className="flex items-center gap-3 text-[#0C6047]"><CloudUpload className="h-6 w-6" /><div><b className="block">Tải lên bài làm của bạn</b><span className="text-xs font-semibold text-[#718199]">Hỗ trợ PDF, DOC, DOCX, ZIP... | Tối đa 50MB</span></div></div>
        <button className="hidden rounded-full bg-white px-4 py-2 text-xs font-black text-[#0C6047] shadow-sm sm:block">Chọn tệp</button>
      </div>
    </section>
  );
}

function WeeklyGoalsCard() {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-[#E7EEE9] bg-white p-5 shadow-[0_8px_28px_rgba(20,75,50,.07)]">
      <div className="mb-4 flex items-center gap-2"><Target className="h-6 w-6 text-rose-500" /><h2 className="text-[20px] font-black text-[#11263F]">Mục tiêu tuần này</h2><span className="ml-auto text-sm font-black text-emerald-700">67%</span></div>
      <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[67%] rounded-full bg-[#16875A]" /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {classWorkspaceMock.weeklyGoals.map((goal) => <div key={goal.label} className="flex items-start gap-2 text-xs font-bold text-[#52657C]"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${goal.done ? "bg-emerald-500 text-white" : "border border-slate-300 bg-white text-transparent"}`}>{goal.done && <Check className="h-3.5 w-3.5" />}</span>{goal.label}</div>)}
      </div>
      <Image src="/stickers/pencil-capybara.png" alt="Capybara cổ vũ" width={150} height={140} className="absolute bottom-[-18px] right-4 hidden w-[94px] md:block" />
    </section>
  );
}

function ProgressCard() {
  const progress = classWorkspaceMock.progress;
  return (
    <section className="rounded-[22px] border border-[#E7EEE9] bg-white p-5 shadow-[0_8px_28px_rgba(20,75,50,.07)]">
      <CardHeader icon={<BarChart3 className="h-4 w-4" />} title="Tiến độ học tập" action="Chi tiết" />
      <div className="grid grid-cols-[126px_1fr] gap-4">
        <div className="relative flex h-[126px] w-[126px] items-center justify-center rounded-full bg-[conic-gradient(#16875A_0_68%,#E7EEE9_68%_100%)]">
          <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white"><b className="text-[26px] text-[#11263F]">68%</b><span className="text-[11px] font-bold text-[#7A889C]">Hoàn thành</span></div>
        </div>
        <div className="space-y-3 pt-2 text-sm">
          <p className="font-black text-[#11263F]">{progress.learned}<span className="ml-1 text-xs font-bold text-[#7A889C]">bài học</span></p>
          <p className="font-black text-[#11263F]">{progress.chaptersDone}<span className="ml-1 text-xs font-bold text-[#7A889C]">chương hoàn thành</span></p>
          <p className="font-black text-[#11263F]">{progress.streakDays} ngày<span className="ml-1 text-xs font-bold text-[#7A889C]">tham gia học tập</span></p>
        </div>
      </div>
      <h3 className="mt-4 text-sm font-black text-[#11263F]">Tiến độ theo chương</h3>
      <div className="mt-3 space-y-2">
        {progress.chapters.map((chapter) => <div key={chapter.label} className="grid grid-cols-[1fr_116px_34px] items-center gap-2 text-[11px] font-bold text-[#52657C]"><span className="truncate">{chapter.label}</span><div className="h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${chapter.value >= 60 ? "bg-emerald-500" : chapter.value > 0 ? "bg-amber-400" : "bg-slate-200"}`} style={{ width: `${chapter.value}%` }} /></div><b>{chapter.value}%</b></div>)}
      </div>
    </section>
  );
}

function ActivityCard() {
  const tone: Record<string, string> = { green: "bg-emerald-100 text-emerald-700", blue: "bg-blue-100 text-blue-700", purple: "bg-violet-100 text-violet-700", orange: "bg-orange-100 text-orange-700" };
  return (
    <section className="rounded-[22px] border border-[#E7EEE9] bg-white p-5 shadow-[0_8px_28px_rgba(20,75,50,.07)]">
      <CardHeader icon={<CircleDot className="h-4 w-4" />} title="Hoạt động lớp học" action="Xem tất cả" />
      <div className="space-y-4">
        {classWorkspaceMock.activities.map((activity) => {
          const Icon = activity.icon;
          return <div key={activity.title} className="flex gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone[activity.tone]}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-black text-[#11263F]">{activity.title}</h3><p className="truncate text-xs font-semibold text-[#718199]">{activity.desc}</p></div><span className="whitespace-nowrap text-[11px] font-bold text-[#94A0B3]">{activity.time}</span></div>;
        })}
      </div>
    </section>
  );
}

function ExamRoomCard() {
  return (
    <section className="rounded-[22px] border border-[#E7EEE9] bg-white p-5 shadow-[0_8px_28px_rgba(20,75,50,.07)]">
      <CardHeader icon={<GraduationCap className="h-4 w-4" />} title="Phòng thi" action="Xem tất cả" />
      <div className="relative overflow-hidden rounded-[18px] bg-[#F6FBF7] p-4">
        <Image src="/stickers/classes-corner-3d.png" alt="" width={110} height={110} className="absolute bottom-2 left-2 w-[82px]" />
        <div className="ml-[92px] min-h-[92px]"><div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-black text-[#11263F]">Kiểm tra giữa chương 2</h3><span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-700">Sắp diễn ra</span></div><p className="text-xs font-bold text-[#64728A]">60 phút • 30 câu hỏi</p><p className="mt-1 text-xs font-bold text-[#0C6047]">Hôm nay, 20:00 - 21:00</p></div>
        <button className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0C6047] text-sm font-black text-white">Vào phòng thi <ArrowRight className="h-4 w-4" /></button>
      </div>
    </section>
  );
}

export default async function ClassWorkspacePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className={`${beVietnam.className} min-h-screen bg-[#F6F8F5] text-[#11263F]`}>
      <LandingNavbar />
      <div className="mx-auto flex max-w-[1500px] gap-4 px-4 pb-8 pt-[92px] sm:px-6">
        <ClassSidebar classId={id} />
        <section className="min-w-0 flex-1 space-y-4">
          <WelcomeCard />
          <MaterialsCard />
          <AssignmentsCard />
          <WeeklyGoalsCard />
        </section>
        <aside className="hidden w-[326px] shrink-0 space-y-4 lg:block">
          <ProgressCard />
          <ActivityCard />
          <ExamRoomCard />
        </aside>
      </div>
    </main>
  );
}