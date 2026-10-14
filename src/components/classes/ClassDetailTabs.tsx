"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  GraduationCap,
  HelpCircle,
  Infinity,
  Info,
  MessageCircle,
  MonitorPlay,
  Play,
  Quote,
  Star,
  Target,
  ThumbsUp,
  Trophy,
  UsersRound,
} from "lucide-react";

type ClassDetail = {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  grade_level: string;
  total_lessons: number | null;
  difficulty: string | null;
  student_count: number | null;
  rating_avg: number | null;
  rating_count: number | null;
  teacherName: string;
  teacherAvatar: string | null;
};

type TabKey = "overview" | "roadmap" | "fit" | "reviews";

type Props = {
  classItem: ClassDetail;
  totalLessons: number;
};

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return (words[0] || "GV").slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[words.length - 1][0] ?? ""}`.toUpperCase();
}

function clampLessonCount(totalLessons: number, ratio: number) {
  return Math.max(1, Math.round(Math.max(totalLessons, 6) * ratio));
}

function buildChapters(classItem: ClassDetail, totalLessons: number) {
  const subject = classItem.subject;
  const normalized = subject.toLowerCase();
  const isMath = normalized.includes("toán") || normalized.includes("toan");
  const isLiterature = normalized.includes("văn") || normalized.includes("van");
  const chapters = isMath
    ? ["Hàm số và đồ thị", "Đạo hàm và ứng dụng", "Khảo sát và vẽ đồ thị", "Luyện tập và đề vận dụng", "Tổng ôn chiến lược"]
    : isLiterature
      ? ["Kiến thức nền tảng", "Phân tích văn bản", "Nghị luận văn học", "Luyện đề chuyên sâu", "Tổng ôn và chữa bài"]
      : ["Nền tảng trọng tâm", "Kỹ năng vận dụng", "Bài tập thực hành", "Luyện đề theo chủ đề", "Tổng ôn nâng cao"];

  return chapters.map((title, index) => ({
    title: `Chương ${index + 1}: ${title}`,
    desc: index === 0 ? `Ôn lại kiến thức ${subject} cốt lõi` : index === 1 ? "Xây nền tư duy giải bài và ghi nhớ nhanh" : index === 2 ? "Thực hành theo dạng bài thường gặp" : index === 3 ? "Rèn kỹ năng qua bài tập và đề chọn lọc" : "Hệ thống kiến thức trước khi kiểm tra",
    lessons: index === 0 ? clampLessonCount(totalLessons, 0.35) : index === 1 ? clampLessonCount(totalLessons, 0.3) : index === 2 ? clampLessonCount(totalLessons, 0.25) : clampLessonCount(totalLessons, 0.2),
    duration: index === 0 ? "3 giờ 15 phút" : index === 1 ? "2 giờ 40 phút" : index === 2 ? "3 giờ 20 phút" : index === 3 ? "2 giờ 10 phút" : "1 giờ 20 phút",
    status: index < 2 ? "Đã xong" : index === 2 ? "Đang học" : "Sắp tới",
  }));
}

function CourseInfoCard({ classItem, totalLessons }: Props) {
  const items = [
    { icon: <BookOpen className="h-5 w-5" />, label: `${totalLessons} bài học`, desc: "Video bài giảng chất lượng cao" },
    { icon: <BarChart3 className="h-5 w-5" />, label: `Trình độ: ${classItem.difficulty || "Trung bình"}`, desc: "Phù hợp với học sinh lớp 12" },
    { icon: <MonitorPlay className="h-5 w-5" />, label: "Hình thức: Học online", desc: "Xem mọi lúc, mọi nơi" },
    { icon: <FileText className="h-5 w-5" />, label: "Tài liệu: Slide, bài tập", desc: "Tải về học offline" },
    { icon: <Infinity className="h-5 w-5" />, label: "Truy cập trọn đời", desc: "Sau khi đăng ký lớp" },
  ];

  return (
    <aside className="relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Info className="h-4 w-4" /></span>
        <h3 className="text-[18px] font-black text-[#10213a]">Thông tin khóa học</h3>
      </div>
      <div className="space-y-3 pb-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3 text-sm font-bold text-[#52657c]">
            <span className="mt-0.5 text-[#254469]">{item.icon}</span>
            <span><b className="block text-[#10213a]">{item.label}</b>{item.desc}</span>
          </div>
        ))}
      </div>
      <Image src="/stickers/classes-corner-3d.png" alt="" width={150} height={150} className="absolute bottom-[-22px] right-[-12px] h-auto w-[120px] opacity-95" />
    </aside>
  );
}

function LearningOutcomes({ classItem }: { classItem: ClassDetail }) {
  const outcomes = [
    `Nắm vững kiến thức trọng tâm của ${classItem.subject} theo đúng lộ trình khóa học`,
    "Biết cách hệ thống kiến thức, ghi nhớ nhanh và vận dụng vào bài tập",
    "Thành thạo các dạng bài thường gặp qua ví dụ minh họa dễ hiểu",
    "Vận dụng kiến thức vào bài kiểm tra, bài thi và tình huống thực tế",
    "Rèn luyện tư duy logic và kỹ năng trình bày lời giải rõ ràng",
    "Có hệ thống bài tập từ cơ bản đến nâng cao, kèm định hướng ôn luyện",
  ];

  return (
    <section className="rounded-[20px] border border-emerald-100/80 bg-white p-6 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Target className="h-5 w-5" /></span>
        <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#10213a]">Bạn sẽ học được gì?</h2>
        <span className="ml-auto hidden h-8 w-10 rotate-[-18deg] border-l-4 border-r-4 border-[#ffc93d] md:block" />
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[14px] font-semibold leading-relaxed text-[#51637c]">
        {outcomes.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#15b87a] text-white"><Check className="h-3.5 w-3.5" /></span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CurriculumCard({ classItem, totalLessons }: Props) {
  const chapters = buildChapters(classItem, totalLessons).slice(0, 3);
  return (
    <section className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><BookOpen className="h-5 w-5" /></span>
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
        <div><p className="font-black text-[#10213a]">{Number(classItem.rating_avg || 5).toFixed(1)}/5</p><p className="text-xs font-bold text-[#64728a]">đánh giá</p></div>
      </div>
      <div className="mt-5 rounded-2xl bg-emerald-50/80 p-4 text-[13px] font-semibold italic leading-relaxed text-[#52657c]">
        <Quote className="mb-2 h-5 w-5 text-emerald-600" />
        “Học tập hiệu quả bắt đầu từ một lộ trình rõ ràng và sự đồng hành đúng lúc.”
        <p className="mt-2 text-right font-bold not-italic text-[#10213a]">— {classItem.teacherName}</p>
      </div>
    </aside>
  );
}

function ProgressCard({ title = "Tiến độ của bạn" }: { title?: string }) {
  return (
    <aside className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
      <div className="mb-5 flex items-center gap-2">
        <Info className="h-5 w-5 text-emerald-700" />
        <h3 className="text-[18px] font-black text-[#10213a]">{title}</h3>
      </div>
      <div className="grid grid-cols-[150px_1fr] items-center gap-5">
        <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full bg-[conic-gradient(#10b981_0_42%,#e9f1f2_42%_100%)]">
          <div className="flex h-[106px] w-[106px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <span className="text-[34px] font-black text-[#10213a]">42%</span>
            <span className="text-xs font-bold text-[#64728a]">Đã hoàn thành</span>
          </div>
        </div>
        <div className="space-y-3">
          {[{ icon: BookOpen, value: "8/20", label: "bài đã học" }, { icon: Check, value: "2", label: "chương hoàn thành" }, { icon: Target, value: "Chương 2", label: "Chương hiện tại" }].map((item) => {
            const Icon = item.icon;
            return <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3"><Icon className="h-5 w-5 text-[#254469]" /><span><b className="block text-sm font-black text-[#10213a]">{item.value}</b><span className="text-xs font-bold text-[#64728a]">{item.label}</span></span></div>;
          })}
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-center text-[13px] font-semibold italic text-[#64728a]">“Bạn đang đi đúng hướng! Hãy tiếp tục cố gắng để chinh phục toàn bộ khóa học nhé!”</div>
    </aside>
  );
}

function OverviewTab({ classItem, totalLessons }: Props) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_386px] gap-5">
      <div className="space-y-5">
        <LearningOutcomes classItem={classItem} />
        <CurriculumCard classItem={classItem} totalLessons={totalLessons} />
      </div>
      <div className="space-y-5">
        <InstructorCard classItem={classItem} />
        <CourseInfoCard classItem={classItem} totalLessons={totalLessons} />
      </div>
    </div>
  );
}

function RoadmapTab({ classItem, totalLessons }: Props) {
  const chapters = buildChapters(classItem, totalLessons);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_386px] gap-5">
      <div className="space-y-5">
        <section className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
          <div className="mb-5 flex items-center gap-3">
            <UsersRound className="h-7 w-7 text-emerald-700" />
            <div><h2 className="text-[22px] font-black text-[#10213a]">Lộ trình học tập</h2><p className="text-sm font-semibold text-[#64728a]">Theo dõi hành trình chinh phục chuyên đề</p></div>
          </div>
          <div className="relative space-y-3 pl-12 before:absolute before:left-[18px] before:top-8 before:h-[calc(100%-64px)] before:w-1 before:rounded-full before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-200 before:to-slate-200">
            {chapters.map((chapter, index) => (
              <div key={chapter.title} className={`relative flex min-h-[70px] items-center gap-4 rounded-2xl border px-4 py-3 ${index === 2 ? "border-emerald-100 bg-emerald-50/80" : "border-slate-200 bg-white"}`}>
                <span className={`absolute -left-[46px] flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${index < 3 ? "bg-[#10b981] text-white" : "bg-slate-200 text-slate-500"}`}>{index + 1}</span>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">{["📘", "📊", "🎯", "📝", "🏆"][index]}</span>
                <div className="min-w-0 flex-1"><h3 className="truncate text-[16px] font-black text-[#10213a]">{chapter.title}</h3><p className="truncate text-xs font-semibold text-[#64728a]">{chapter.desc}</p></div>
                <span className="text-xs font-bold text-[#64728a]">{chapter.lessons} bài</span>
                <span className="text-xs font-bold text-[#64728a]">{chapter.duration}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${chapter.status === "Đang học" ? "bg-emerald-100 text-emerald-700" : chapter.status === "Đã xong" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{chapter.status}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
          <div className="mb-4 flex items-center gap-3"><BarChart3 className="h-6 w-6 text-emerald-700" /><h3 className="text-[18px] font-black text-[#10213a]">Mốc tiến độ</h3><span className="text-sm font-semibold text-[#64728a]">Theo dõi tiến độ học tập</span></div>
          <div className="grid grid-cols-3 gap-5">
            {[{ label: "Hoàn thành khóa học", value: "42%", color: "bg-emerald-500" }, { label: "Bài tập thực hành", value: "35%", color: "bg-blue-500" }, { label: "Bài kiểm tra chương 2", value: "60%", color: "bg-amber-400" }].map((item) => <div key={item.label}><div className="mb-2 flex justify-between text-sm font-bold text-[#52657c]"><span>{item.label}</span><b>{item.value}</b></div><div className="h-3 rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: item.value }} /></div></div>)}
          </div>
        </section>
      </div>
      <div className="space-y-5"><ProgressCard /><CourseInfoCard classItem={classItem} totalLessons={totalLessons} /></div>
    </div>
  );
}

function FitTab({ classItem, totalLessons }: Props) {
  const audienceItems = [
    {
      title: `Học sinh ${classItem.grade_level || "THPT"}`,
      desc: `Muốn củng cố ${classItem.subject} theo một lộ trình rõ ràng trước khi vào lớp chính thức.`,
      icon: GraduationCap,
    },
    {
      title: "Cần học có định hướng",
      desc: "Phù hợp với bạn muốn được giáo viên theo dõi, giao nhiệm vụ và phản hồi đều đặn.",
      icon: Target,
    },
    {
      title: "Sẵn sàng cam kết",
      desc: "Có thể tham gia đúng lịch học, hoàn thành bài tập và trao đổi khi gặp vướng mắc.",
      icon: Check,
    },
  ];

  const requestSteps = [
    "Gửi yêu cầu xin vào lớp để giáo viên kiểm tra thông tin học tập.",
    "Giáo viên phản hồi hoặc liên hệ nếu cần thêm mục tiêu học của bạn.",
    "Sau khi được duyệt, bạn mới vào không gian lớp học và xem bài học chi tiết.",
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_386px] gap-5">
      <div className="space-y-5">
        <section className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><UsersRound className="h-5 w-5" /></span>
              <div>
                <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#10213a]">Lớp này phù hợp với ai?</h2>
                <p className="text-sm font-semibold text-[#64728a]">Xem nhanh mức độ phù hợp trước khi gửi yêu cầu vào lớp.</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-700">Cần giáo viên duyệt</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {audienceItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[18px] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm"><Icon className="h-5 w-5" /></span>
                  <h3 className="text-[16px] font-black text-[#10213a]">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#5d6f88]">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><FileText className="h-5 w-5" /></span>
            <div>
              <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#10213a]">Quy trình xin vào lớp</h2>
              <p className="text-sm font-semibold text-[#64728a]">Nội dung bài học sẽ mở sau khi yêu cầu được chấp thuận.</p>
            </div>
          </div>
          <div className="space-y-3">
            {requestSteps.map((step, index) => (
              <div key={step} className="flex min-h-[58px] items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">{index + 1}</span>
                <p className="text-[15px] font-bold leading-relaxed text-[#52657c]">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-5">
        <aside className="rounded-[20px] border border-emerald-100 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Info className="h-4 w-4" /></span>
            <h3 className="text-[18px] font-black text-[#10213a]">Thông tin trước khi đăng ký</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Số buổi", value: `${totalLessons} buổi` },
              { label: "Mức độ", value: classItem.difficulty || "Trung bình" },
              { label: "Môn học", value: classItem.subject },
              { label: "Trạng thái", value: "Chờ giáo viên duyệt" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-[#64728a]">{item.label}</span>
                <b className="text-sm text-[#10213a]">{item.value}</b>
              </div>
            ))}
          </div>
        </aside>
        <CourseInfoCard classItem={classItem} totalLessons={totalLessons} />
      </div>
    </div>
  );
}
function ReviewsTab({ classItem, totalLessons }: Props) {
  const rating = Number(classItem.rating_avg || 4.9);
  const ratingCount = Number(classItem.rating_count || 286);
  const reviews = [
    { name: "Ngọc Anh", date: "12/03/2024", title: "Giải thích cực dễ hiểu", text: "Thầy giải thích phần khó rất rõ ràng, đặc biệt là cách lập bảng biến thiên và vẽ đồ thị.", tag: "Hữu ích" },
    { name: "Minh Khang", date: "28/02/2024", title: "Bài giảng logic, có chiều sâu", text: "Lộ trình học được thiết kế rất hợp lý, đi từ cơ bản đến nâng cao.", tag: "Chi tiết" },
    { name: "Thu Trang", date: "15/02/2024", title: "Nội dung đầy đủ", text: "Khóa học cung cấp rất nhiều ví dụ và bài tập đa dạng.", tag: "Có bài tập" },
    { name: "Quốc Bảo", date: "05/02/2024", title: "Rất đáng học", text: "Nội dung bám sát chương trình, video bài giảng dễ hiểu, tài liệu đầy đủ.", tag: "Có video" },
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_386px] gap-5">
      <div className="space-y-5">
        <section className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_28px_rgba(24,72,50,0.07)]">
          <div className="mb-4 flex items-start gap-3"><UsersRound className="mt-1 h-7 w-7 text-emerald-700" /><div><h2 className="text-[22px] font-black text-[#10213a]">Đánh giá từ học sinh</h2><p className="text-sm font-semibold text-[#64728a]">Những phản hồi thực tế từ học sinh đã tham gia khóa học</p></div></div>
          <div className="mb-4 grid grid-cols-[250px_1fr] gap-8 rounded-2xl border border-slate-200 bg-white p-5">
            <div><div className="flex items-end gap-2"><span className="text-[56px] font-black leading-none text-[#14264a]">{rating.toFixed(1)}</span><span className="mb-2 text-2xl font-black text-[#14264a]">/5</span></div><div className="mt-2 flex text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-6 w-6 fill-current" />)}</div><p className="mt-2 text-sm font-black text-[#10213a]">{ratingCount} đánh giá</p><span className="mt-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700"><ThumbsUp className="mr-2 h-4 w-4" />96% học sinh hài lòng</span></div>
            <div className="space-y-2">{[240, 32, 9, 3, 2].map((value, index) => <div key={index} className="grid grid-cols-[50px_1fr_34px] items-center gap-3 text-sm font-bold text-[#52657c]"><span>{5 - index} sao</span><div className="h-3 rounded-full bg-slate-100"><div className={`h-full rounded-full ${index === 0 ? "bg-emerald-500" : index === 1 ? "bg-emerald-400" : index === 2 ? "bg-emerald-300" : "bg-amber-400"}`} style={{ width: `${Math.max(8, (value / 240) * 100)}%` }} /></div><span>{value}</span></div>)}</div>
          </div>
          <div className="mb-4 flex gap-2">{["Tất cả", "5 sao", "Mới nhất", "Có bài tập", "Có video"].map((item, index) => <button key={item} className={`rounded-full border px-4 py-2 text-xs font-black ${index === 0 ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-[#254469]"}`}>{item}</button>)}</div>
          <div className="space-y-3">{reviews.map((review, index) => <div key={review.name} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">{review.name.split(" ").pop()?.[0]}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><div><b className="text-[#10213a]">{review.name}</b><p className="text-xs font-bold text-[#64728a]">{review.date}</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{review.tag}</span></div><div className="mt-1 flex text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i === 4 && index === 2 ? "text-slate-300" : "fill-current"}`} />)}</div><h4 className="mt-2 font-black text-[#10213a]">{review.title}</h4><p className="text-sm font-semibold leading-relaxed text-[#52657c]">{review.text}</p></div></div>)}</div>
        </section>
        <section className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]"><h3 className="mb-4 flex items-center gap-2 text-[18px] font-black text-[#10213a]"><HelpCircle className="h-5 w-5 text-emerald-700" />Câu hỏi thường gặp từ học viên</h3><div className="grid grid-cols-3 gap-3">{["Khóa học có phù hợp cho người mất gốc không?", "Có tài liệu tải về không?", "Sau khi mua có học lại được không?"].map((q) => <button key={q} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black text-[#254469]">{q}<ChevronDown className="h-4 w-4" /></button>)}</div></section>
      </div>
      <div className="space-y-5"><section className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]"><h3 className="mb-4 flex items-center gap-2 text-[18px] font-black text-[#10213a]"><Trophy className="h-5 w-5 text-emerald-700" />Điểm nổi bật</h3><div className="grid grid-cols-2 gap-3">{[{ icon: Star, value: `${rating.toFixed(1)}/5`, label: "Đánh giá trung bình" }, { icon: UsersRound, value: `${ratingCount}`, label: "đánh giá từ học sinh" }, { icon: ThumbsUp, value: "96%", label: "học sinh hài lòng" }, { icon: MessageCircle, value: "Giáo viên phản hồi tốt", label: "Hỗ trợ giải đáp nhanh" }].map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><Icon className="mb-2 h-5 w-5 text-emerald-700" /><b className="block text-[#10213a]">{item.value}</b><span className="text-xs font-bold text-[#64728a]">{item.label}</span></div>; })}</div></section><section className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_28px_rgba(24,72,50,0.07)]"><h3 className="mb-4 text-[18px] font-black text-[#10213a]">Nhận xét tiêu biểu</h3>{reviews.slice(0, 2).map((review) => <div key={review.name} className="mb-3 rounded-2xl bg-emerald-50 p-4"><Quote className="mb-2 h-5 w-5 text-emerald-700" /><p className="text-sm font-semibold italic text-[#52657c]">“{review.text}”</p><b className="mt-2 block text-sm text-[#10213a]">{review.name}</b><div className="mt-1 flex text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div></div>)}</section><CourseInfoCard classItem={classItem} totalLessons={totalLessons} /></div>
    </div>
  );
}

export default function ClassDetailTabs({ classItem, totalLessons }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const tabs = useMemo(() => [
    { key: "overview" as const, label: "Tổng quan", icon: FileText },
    { key: "roadmap" as const, label: "Lộ trình", icon: UsersRound },
    { key: "fit" as const, label: "Phù hợp", icon: Target },
    { key: "reviews" as const, label: "Đánh giá", icon: Star },
  ], []);

  return (
    <>
      <div className="mx-auto mb-6 flex h-[52px] max-w-[895px] items-center rounded-full border border-slate-200 bg-white p-1 shadow-[0_8px_22px_rgba(24,72,50,0.08)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`flex h-full flex-1 items-center justify-center gap-2 rounded-full text-sm font-black transition ${isActive ? "bg-[#00a66f] text-white shadow-[0_8px_18px_rgba(0,166,111,0.24)]" : "text-[#263a59] hover:bg-emerald-50"}`}>
              <Icon className="h-4 w-4" />{tab.label}
            </button>
          );
        })}
      </div>
      {activeTab === "overview" && <OverviewTab classItem={classItem} totalLessons={totalLessons} />}
      {activeTab === "roadmap" && <RoadmapTab classItem={classItem} totalLessons={totalLessons} />}
      {activeTab === "fit" && <FitTab classItem={classItem} totalLessons={totalLessons} />}
      {activeTab === "reviews" && <ReviewsTab classItem={classItem} totalLessons={totalLessons} />}
    </>
  );
}