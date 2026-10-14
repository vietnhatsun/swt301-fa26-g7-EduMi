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

type RawUser = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

function normalizeClass(item: RawTeachingClass, teacher?: RawUser) {
  return {
    id: item.id,
    teacherId: item.teacher_id,
    teacherName: teacher?.full_name || "Giáo viên EduMi",
    teacherEmail: teacher?.email || "",
    teacherAvatarUrl: teacher?.avatar_url || null,
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
    totalLessons: Number(item.total_lessons || 0),
    tuitionFee: Number(item.tuition_fee || 0),
    coverImage: item.cover_image || null,
    hasOnlineRoom: item.has_online_room,
    autoRecord: item.auto_record,
    allowPinnedNote: item.allow_pinned_note,
    status: item.status,
    studentCount: Number(item.student_count || 0),
    completedLessons: Number(item.completed_lessons || 0),
    rejectReason: item.reject_reason || null,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền duyệt lớp học." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const supabase = createServiceClient();

    let query = supabase.from("teaching_classes").select("*").order("created_at", { ascending: false });
    if (status && ["pending", "approved", "rejected", "hidden", "completed", "draft"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[Staff Classes GET Error]:", error);
      return NextResponse.json({ error: "Không thể tải danh sách lớp học." }, { status: 500 });
    }

    const rawClasses = (data || []) as RawTeachingClass[];
    const teacherIds = [...new Set(rawClasses.map((item) => item.teacher_id))];
    let teacherMap: Record<string, RawUser> = {};
    if (teacherIds.length) {
      const { data: teachers } = await supabase
        .from("users")
        .select("id, full_name, email, avatar_url")
        .in("id", teacherIds);
      teacherMap = Object.fromEntries((teachers || []).map((item) => [item.id, item as RawUser]));
    }

    const classes = rawClasses.map((item) => normalizeClass(item, teacherMap[item.teacher_id]));
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
    console.error("[Staff Classes GET Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải lớp học." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const staff = await getAuthenticatedUser(req);
    if (!staff) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    if (staff.role !== "staff" && staff.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền duyệt lớp học." }, { status: 403 });
    }

    const body = await req.json();
    const { classId, action, rejectReason } = body;
    if (!classId || !["approve", "reject", "hide"].includes(action)) {
      return NextResponse.json({ error: "Dữ liệu duyệt lớp học không hợp lệ." }, { status: 400 });
    }

    const cleanRejectReason = typeof rejectReason === "string" ? rejectReason.trim().slice(0, 500) : "";
    if (action === "reject" && !cleanRejectReason) {
      return NextResponse.json({ error: "Vui lòng nhập lý do từ chối lớp học." }, { status: 400 });
    }

    const nextStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "hidden";
    const supabase = createServiceClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("teaching_classes")
      .update({
        status: nextStatus,
        reviewed_by: staff.id,
        reviewed_at: now,
        reject_reason: action === "reject" ? cleanRejectReason : null,
        updated_at: now,
      })
      .eq("id", classId)
      .select("*")
      .single();

    if (error) {
      console.error("[Staff Classes PUT Error]:", error);
      return NextResponse.json({ error: "Không thể cập nhật trạng thái lớp học." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "Đã phê duyệt lớp học." : action === "reject" ? "Đã từ chối lớp học." : "Đã ẩn lớp học.",
      class: normalizeClass(data as RawTeachingClass),
    });
  } catch (error) {
    console.error("[Staff Classes PUT Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi duyệt lớp học." }, { status: 500 });
  }
}