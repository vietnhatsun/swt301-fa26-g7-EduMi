import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const staffUser = await getAuthenticatedUser(req);
    if (!staffUser) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    if (staffUser.role !== "staff" && staffUser.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền truy cập." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "Thiếu ID người dùng." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // 1. Lấy thông tin cơ bản người dùng
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("id, email, full_name, avatar_url, phone_number, role, status, is_verified, created_at, updated_at")
      .eq("id", userId)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng." }, { status: 404 });
    }

    // 2. Lấy thông tin mở rộng theo vai trò
    let profileData: Record<string, unknown> | null = null;

    if (user.role === "teacher") {
      const { data: teacherProfile } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      profileData = teacherProfile || null;
    } else if (user.role === "student") {
      const { data: studentProfile } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      profileData = studentProfile || null;
    } else if (user.role === "parent") {
      const { data: links } = await supabase
        .from("parent_student_links")
        .select("student_id, relationship, is_confirmed")
        .eq("parent_id", userId);
      profileData = { links: links || [] };
    }

    const code = user.role === "teacher"
      ? (profileData as Record<string, unknown>)?.teacher_code || null
      : user.role === "student"
      ? (profileData as Record<string, unknown>)?.student_code || null
      : null;

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        code,
        profile: profileData,
      },
    });
  } catch (error) {
    console.error("[Staff User Detail GET Error]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải chi tiết người dùng." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const staffUser = await getAuthenticatedUser(req);
    if (!staffUser) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    if (staffUser.role !== "staff" && staffUser.role !== "admin") {
      return NextResponse.json({ error: "Bạn không có quyền thực hiện thao tác này." }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !["ban", "unban"].includes(action)) {
      return NextResponse.json({ error: "Dữ liệu yêu cầu không hợp lệ." }, { status: 400 });
    }

    // Không cho phép tự ban chính mình
    if (userId === staffUser.id) {
      return NextResponse.json({ error: "Bạn không thể tự khóa tài khoản của chính mình." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Kiểm tra người dùng mục tiêu
    const { data: targetUser, error: targetErr } = await supabase
      .from("users")
      .select("id, full_name, email, role, status, is_verified")
      .eq("id", userId)
      .single();

    if (targetErr || !targetUser) {
      return NextResponse.json({ error: "Không tìm thấy người dùng." }, { status: 404 });
    }

    // Nhân viên không được ban Admin
    if (targetUser.role === "admin" && staffUser.role !== "admin") {
      return NextResponse.json({ error: "Chỉ Quản trị viên cấp cao (Admin) mới có quyền thao tác với tài khoản Admin." }, { status: 403 });
    }

    let nextStatus: string;
    let message: string;

    if (action === "ban") {
      nextStatus = "banned";
      message = `Đã khóa tài khoản của người dùng ${targetUser.full_name || targetUser.email}.`;
    } else {
      // unban: nếu đã xác thực thì chuyển thành active, nếu chưa thì pending_verification
      nextStatus = targetUser.is_verified ? "active" : "pending_verification";
      message = `Đã mở khóa tài khoản của người dùng ${targetUser.full_name || targetUser.email}.`;
    }

    const { error: updateErr } = await supabase
      .from("users")
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateErr) {
      console.error("[Staff Ban/Unban error]:", updateErr);
      return NextResponse.json({ error: "Cập nhật trạng thái người dùng thất bại." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message,
      newStatus: nextStatus,
      displayStatus: nextStatus === "banned" ? "Bị khóa" : targetUser.is_verified ? "Hoạt động" : "Chưa xác thực",
    });
  } catch (error) {
    console.error("[Staff User PUT Error]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xử lý người dùng." }, { status: 500 });
  }
}
