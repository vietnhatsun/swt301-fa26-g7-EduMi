import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";

type ClassStatus = "draft" | "pending" | "approved" | "rejected" | "hidden" | "completed";

type RawTeachingClass = {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  subject: string;
  grade_level: string;
  schedule_days: string;
  time_slot: string;
  difficulty: string | null;
  rating_avg: number | null;
  rating_count: number | null;
  schedule_weekdays?: string[] | null;
  start_time?: string | null;
  end_time?: string | null;
  total_lessons: number;
  tuition_fee: number;
  cover_image: string | null;
  has_online_room: boolean;
  auto_record: boolean;
  allow_pinned_note: boolean;
  status: ClassStatus;
  student_count: number;
  completed_lessons: number;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
};

function cleanText(value: unknown, max = 255) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
const WEEKDAY_LABELS: Record<string, string> = {
  mon: "Thứ 2",
  tue: "Thứ 3",
  wed: "Thứ 4",
  thu: "Thứ 5",
  fri: "Thứ 6",
  sat: "Thứ 7",
  sun: "Chủ nhật",
};

function normalizeWeekdays(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
    .filter((item) => Object.prototype.hasOwnProperty.call(WEEKDAY_LABELS, item));
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function formatScheduleDays(weekdays: string[]) {
  return weekdays.map((item) => WEEKDAY_LABELS[item]).join(", ");
}

function formatTimeSlot(startTime: string, endTime: string) {
  return `${startTime} - ${endTime}`;
}

function normalizeClass(item: RawTeachingClass) {
  const totalLessons = Number(item.total_lessons || 0);
  const completedLessons = Number(item.completed_lessons || 0);
  return {
    id: item.id,
    teacherId: item.teacher_id,
    title: item.title,
    description: item.description || "",
    subject: item.subject,
    gradeLevel: item.grade_level,
    scheduleDays: item.schedule_days,
    timeSlot: item.time_slot,
    difficulty: item.difficulty || 'Trung bình',
    ratingAvg: Number(item.rating_avg || 0),
    ratingCount: Number(item.rating_count || 0),
    scheduleWeekdays: item.schedule_weekdays || [],
    startTime: item.start_time || null,
    endTime: item.end_time || null,
    totalLessons,
    tuitionFee: Number(item.tuition_fee || 0),
    coverImage: item.cover_image || null,
    hasOnlineRoom: item.has_online_room,
    autoRecord: item.auto_record,
    allowPinnedNote: item.allow_pinned_note,
    status: item.status,
    studentCount: Number(item.student_count || 0),
    completedLessons,
    progress: totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0,
    rejectReason: item.reject_reason || null,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (user.role !== "teacher" && user.role !== "admin") {
      return NextResponse.json({ error: "Chỉ giáo viên mới có thể xem lớp đã đăng." }, { status: 403 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("teaching_classes")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Teacher Classes GET Error]:", error);
      return NextResponse.json({ error: "Không thể tải danh sách lớp học." }, { status: 500 });
    }

    const classes = ((data || []) as RawTeachingClass[]).map(normalizeClass);
    return NextResponse.json({
      success: true,
      classes,
      counts: {
        total: classes.length,
        pending: classes.filter((item) => item.status === "pending").length,
        approved: classes.filter((item) => item.status === "approved").length,
        rejected: classes.filter((item) => item.status === "rejected").length,
      },
    });
  } catch (error) {
    console.error("[Teacher Classes GET Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải lớp học." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (user.role !== "teacher" && user.role !== "admin") {
      return NextResponse.json({ error: "Chỉ giáo viên mới có thể đăng lớp học." }, { status: 403 });
    }

    const body = await req.json();
    const title = cleanText(body.title, 180);
    const description = cleanText(body.description, 1000);
    const subject = cleanText(body.subject, 120);
    const gradeLevel = cleanText(body.gradeLevel, 80);
    const difficulty = cleanText(body.difficulty, 40);
    const allowedDifficulties = ['Cơ bản', 'Trung bình', 'Nâng cao'];
    const scheduleWeekdays = normalizeWeekdays(body.scheduleWeekdays);
    const startTime = cleanText(body.startTime, 5);
    const endTime = cleanText(body.endTime, 5);
    const scheduleDays = formatScheduleDays(scheduleWeekdays);
    const timeSlot = isValidTime(startTime) && isValidTime(endTime) ? formatTimeSlot(startTime, endTime) : "";
    const coverImage = cleanText(body.coverImage, 500) || null;
    const totalLessons = Number(body.totalLessons || 0);
    const tuitionFee = Number(body.tuitionFee || 0);

    if (!title || !subject || !gradeLevel || !allowedDifficulties.includes(difficulty) || scheduleWeekdays.length === 0 || !isValidTime(startTime) || !isValidTime(endTime) || startTime >= endTime || !Number.isFinite(totalLessons) || totalLessons <= 0 || !Number.isFinite(tuitionFee) || tuitionFee < 0) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ tên lớp, môn học, khối lớp, lịch học, khung giờ, số buổi và học phí hợp lệ." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("teaching_classes")
      .insert({
        teacher_id: user.id,
        title,
        description,
        subject,
        grade_level: gradeLevel,
        difficulty,
        schedule_days: scheduleDays,
        time_slot: timeSlot,
        schedule_weekdays: scheduleWeekdays,
        start_time: startTime,
        end_time: endTime,
        total_lessons: Math.round(totalLessons),
        tuition_fee: Math.round(tuitionFee),
        cover_image: coverImage,
        has_online_room: body.hasOnlineRoom !== false,
        auto_record: body.autoRecord !== false,
        allow_pinned_note: body.allowPinnedNote !== false,
        status: "pending",
        updated_at: now,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[Teacher Classes POST Error]:", error);
      return NextResponse.json({ error: "Không thể lưu lớp học vào hệ thống." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Lớp học đã được gửi tới staff để kiểm duyệt.",
      class: normalizeClass(data as RawTeachingClass),
    });
  } catch (error) {
    console.error("[Teacher Classes POST Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi đăng lớp học." }, { status: 500 });
  }
}