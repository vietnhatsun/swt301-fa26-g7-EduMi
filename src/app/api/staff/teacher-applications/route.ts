import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";

interface RawTeacherProfile {
  user_id: string;
  headline?: string | null;
  bio?: string | null;
  subjects?: string[] | null;
  is_verified_educator?: boolean | null;
  rating_avg?: number | null;
  total_reviews?: number | null;
  gender?: string | null;
  teacher_role?: string | null;
  work_experience?: string | null;
  grade_levels?: string[] | null;
  degree?: string | null;
  experience_years?: string | null;
  certificate_url?: string | null;
  certificate_file_name?: string | null;
  certificate_file_size?: number | null;
  verification_status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface RawUser {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
  created_at?: string | null;
}

/**
 * GET: Lấy danh sách hồ sơ giáo viên cho Staff xét duyệt (Pending, Approved, Rejected)
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    if (user.role !== "staff" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập chức năng xét duyệt hồ sơ giáo viên." },
        { status: 403 }
      );
    }

    const supabase = createServiceClient();

    // 1. Truy vấn toàn bộ teacher_profiles
    const { data: profiles, error: profileErr } = await supabase
      .from("teacher_profiles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (profileErr) {
      console.error("[Staff Teacher Apps GET Error]:", profileErr);
      return NextResponse.json({ error: "Lỗi truy vấn hồ sơ giáo viên." }, { status: 500 });
    }

    const rawProfiles = (profiles || []) as RawTeacherProfile[];

    // 2. Lấy thông tin user tương ứng
    const userIds = rawProfiles.map((p) => p.user_id);
    let usersMap: Record<string, RawUser> = {};

    if (userIds.length > 0) {
      const { data: usersData, error: userErr } = await supabase
        .from("users")
        .select("id, full_name, email, avatar_url, phone_number, created_at")
        .in("id", userIds);

      if (!userErr && usersData) {
        usersMap = Object.fromEntries(usersData.map((u) => [u.id, u as RawUser]));
      }
    }

    // 3. Chuẩn hóa dữ liệu đơn
    const applications = rawProfiles.map((p) => {
      const u = usersMap[p.user_id] || {};
      const teacherCode = `GV-${p.user_id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

      return {
        id: p.user_id,
        userId: p.user_id,
        teacherCode,
        fullName: u.full_name || "Chưa cập nhật tên",
        email: u.email || "",
        avatarUrl: u.avatar_url || null,
        phoneNumber: u.phone_number || "",
        gender: p.gender || null,
        teacherRole: (p.teacher_role as "Gia sư" | "Giáo viên sư phạm") || "Gia sư",
        headline: p.headline || "",
        bio: p.bio || "",
        workExperience: p.work_experience || "",
        subjects: Array.isArray(p.subjects) ? p.subjects : [],
        gradeLevels: Array.isArray(p.grade_levels) ? p.grade_levels : [],
        degree: p.degree || "",
        experienceYears: p.experience_years || "",
        certificateUrl: p.certificate_url || null,
        certificateFileName: p.certificate_file_name || null,
        certificateFileSize: p.certificate_file_size || null,
        verificationStatus: (p.verification_status as "draft" | "pending" | "approved" | "rejected") || "draft",
        isVerifiedEducator: Boolean(p.is_verified_educator),
        ratingAvg: Number(p.rating_avg ?? 5),
        totalReviews: p.total_reviews ?? 0,
        createdAt: p.created_at || u.created_at || new Date().toISOString(),
        updatedAt: p.updated_at || new Date().toISOString(),
      };
    });

    const pending = applications.filter((app) => app.verificationStatus === "pending");
    const approved = applications.filter((app) => app.verificationStatus === "approved");
    const rejected = applications.filter((app) => app.verificationStatus === "rejected");
    const draft = applications.filter((app) => app.verificationStatus === "draft");

    return NextResponse.json({
      success: true,
      counts: {
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
        total: applications.length,
      },
      applications,
      pending,
      approved,
      rejected,
      draft,
    });
  } catch (error) {
    console.error("[Staff Teacher Applications Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải danh sách đơn." }, { status: 500 });
  }
}

/**
 * PUT: Xử lý Duyệt (approve), Từ chối (reject) hoặc Thu hồi quyền (revoke)
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    if (user.role !== "staff" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Bạn không có quyền thực hiện thao tác xét duyệt." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { teacherId, action, rejectReason } = body;

    if (!teacherId || !["approve", "reject", "revoke"].includes(action)) {
      return NextResponse.json(
        { error: "Dữ liệu yêu cầu không hợp lệ." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const now = new Date().toISOString();

    let updatePayload: Record<string, unknown> = {
      updated_at: now,
    };

    if (action === "approve") {
      updatePayload = {
        ...updatePayload,
        verification_status: "approved",
        is_verified_educator: true,
      };
      // Đồng bộ phân quyền role = 'teacher' cho tài khoản người dùng
      await supabase
        .from("users")
        .update({ role: "teacher", updated_at: now })
        .eq("id", teacherId);
    } else if (action === "reject") {
      updatePayload = {
        ...updatePayload,
        verification_status: "rejected",
        is_verified_educator: false,
      };
    } else if (action === "revoke") {
      updatePayload = {
        ...updatePayload,
        verification_status: "rejected",
        is_verified_educator: false,
      };
    }

    const { error: updateError } = await supabase
      .from("teacher_profiles")
      .update(updatePayload)
      .eq("user_id", teacherId);

    if (updateError) {
      console.error("[Update Teacher Status Error]:", updateError);
      return NextResponse.json(
        { error: "Lỗi cơ sở dữ liệu khi cập nhật trạng thái hồ sơ." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "Đã phê duyệt hồ sơ giáo viên thành công!"
          : action === "reject"
          ? `Đã từ chối đơn đăng ký giáo viên.${rejectReason ? ` Lý do: ${rejectReason}` : ""}`
          : "Đã thu hồi quyền giảng dạy của giáo viên.",
      verificationStatus: updatePayload.verification_status,
      isVerifiedEducator: updatePayload.is_verified_educator,
    });
  } catch (error) {
    console.error("[Staff Action Exception]:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi cập nhật trạng thái đơn." },
      { status: 500 }
    );
  }
}
