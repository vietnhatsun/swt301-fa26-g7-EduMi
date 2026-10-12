import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    if (user.role !== "staff" && user.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền truy cập." }, { status: 403 });
    }

    const supabase = createServiceClient();

    // 1. Lấy danh sách users
    const { data: usersData, error: usersErr } = await supabase
      .from("users")
      .select("id, full_name, email, role, avatar_url, phone_number, status, is_verified, created_at")
      .order("created_at", { ascending: false });

    if (usersErr) {
      console.error("[Staff Overview usersErr]:", usersErr);
    }

    const allUsers = usersData || [];

    // 2. Lấy mã thực tế từ student_profiles và teacher_profiles
    const { data: studentProfiles } = await supabase
      .from("student_profiles")
      .select("user_id, student_code");
    const studentCodeMap: Record<string, string> = {};
    studentProfiles?.forEach((sp) => {
      if (sp.student_code) studentCodeMap[sp.user_id] = sp.student_code;
    });

    const { data: teacherProfiles } = await supabase
      .from("teacher_profiles")
      .select("user_id, teacher_code");
    const teacherCodeMap: Record<string, string> = {};
    teacherProfiles?.forEach((tp) => {
      if (tp.teacher_code) teacherCodeMap[tp.user_id] = tp.teacher_code;
    });

    // 3. Lấy số lượng đơn xét duyệt pending từ teacher_profiles
    const { data: pendingData, error: pendingErr } = await supabase
      .from("teacher_profiles")
      .select("user_id, verification_status")
      .eq("verification_status", "pending");

    if (pendingErr) {
      console.error("[Staff Overview pendingErr]:", pendingErr);
    }

    const pendingCount = pendingData?.length || 0;
    const teachersCount = allUsers.filter((u) => u.role === "teacher").length;

    // 4. Chuẩn hóa danh sách users cho UserManagementPanel
    const normalizedUsers = allUsers.map((u) => {
      // Chỉ học sinh và giáo viên mới có mã người dùng, phụ huynh và nhân viên không có mã
      let code: string | null = null;
      if (u.role === "student") {
        code = studentCodeMap[u.id] || null;
      } else if (u.role === "teacher") {
        code = teacherCodeMap[u.id] || `GV-${u.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
      }

      let displayStatus = "Hoạt động";
      if (u.status === "banned") {
        displayStatus = "Bị khóa";
      } else if (!u.is_verified || u.status === "pending_verification") {
        displayStatus = "Chưa xác thực";
      }

      return {
        id: u.id,
        name: u.full_name || "Chưa cập nhật tên",
        code,
        role: u.role === "teacher" ? "Giáo viên" : u.role === "staff" ? "Nhân viên" : u.role === "parent" ? "Phụ huynh" : "Học sinh",
        rawRole: u.role,
        email: u.email || "Không có email",
        phone: u.phone_number || "Chưa cập nhật",
        status: displayStatus,
        rawStatus: u.status,
        isVerified: Boolean(u.is_verified),
        time: u.created_at ? new Date(u.created_at).toLocaleDateString("vi-VN") : "Gần đây",
        tone: u.role === "teacher" ? "amber" : u.role === "staff" ? "rose" : u.role === "parent" ? "purple" : "blue",
        avatar: (u.full_name || "U").trim().charAt(0).toUpperCase(),
        avatarUrl: u.avatar_url || null,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: allUsers.length,
        totalTeachers: teachersCount,
        pendingTeacherApplications: pendingCount,
      },
      users: normalizedUsers,
    });
  } catch (error) {
    console.error("[Staff Overview GET Exception]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải dữ liệu tổng quan." }, { status: 500 });
  }
}
