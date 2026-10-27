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
    const { userId, userIds, action, status: rawTargetStatus, role: rawTargetRole, isVerified } = body;

    const supabase = createServiceClient();

    // 1. Xử lý cập nhật hàng loạt (Batch Actions)
    if (action === "batch_status" && Array.isArray(userIds) && userIds.length > 0) {
      const validStatuses = ["active", "banned", "inactive", "pending_verification"];
      const targetStatus = validStatuses.includes(rawTargetStatus) ? rawTargetStatus : "active";

      // Lọc bỏ tài khoản của chính staff đang đăng nhập
      const sanitizedUserIds = userIds.filter((id: string) => id !== staffUser.id);
      if (sanitizedUserIds.length === 0) {
        return NextResponse.json({ error: "Không có người dùng hợp lệ để xử lý." }, { status: 400 });
      }

      const updatePayload: Record<string, unknown> = {
        status: targetStatus,
        updated_at: new Date().toISOString(),
      };
      if (targetStatus === "active") {
        updatePayload.is_verified = true;
      } else if (targetStatus === "pending_verification") {
        updatePayload.is_verified = false;
      }

      const { error: batchErr } = await supabase
        .from("users")
        .update(updatePayload)
        .in("id", sanitizedUserIds);

      if (batchErr) {
        console.error("[Staff Batch Status Error]:", batchErr);
        return NextResponse.json({ error: "Cập nhật hàng loạt thất bại." }, { status: 500 });
      }

      const statusLabels: Record<string, string> = {
        active: "Hoạt động",
        banned: "Bị khóa",
        inactive: "Tạm ngưng",
        pending_verification: "Chưa xác thực",
      };

      return NextResponse.json({
        success: true,
        message: `Đã cập nhật trạng thái của ${sanitizedUserIds.length} người dùng sang "${statusLabels[targetStatus]}".`,
        affectedCount: sanitizedUserIds.length,
      });
    }

    // 2. Xử lý cập nhật từng người dùng đơn lẻ
    if (!userId) {
      return NextResponse.json({ error: "Thiếu ID người dùng." }, { status: 400 });
    }

    // Không cho phép tự thao tác với chính mình
    if (userId === staffUser.id) {
      return NextResponse.json({ error: "Bạn không thể tự thay đổi tài khoản của chính mình." }, { status: 400 });
    }

    // Kiểm tra người dùng mục tiêu
    const { data: targetUser, error: targetErr } = await supabase
      .from("users")
      .select("id, full_name, email, role, status, is_verified")
      .eq("id", userId)
      .single();

    if (targetErr || !targetUser) {
      return NextResponse.json({ error: "Không tìm thấy người dùng." }, { status: 404 });
    }

    // Nhân viên không được thao tác với Admin
    if (targetUser.role === "admin" && staffUser.role !== "admin") {
      return NextResponse.json({ error: "Chỉ Quản trị viên cấp cao (Admin) mới có quyền thao tác với tài khoản Admin." }, { status: 403 });
    }

    const userName = targetUser.full_name || targetUser.email;
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    let message = "";
    let nextStatus = targetUser.status;
    let nextVerified = targetUser.is_verified;
    let nextRole = targetUser.role;

    if (action === "ban") {
      nextStatus = "banned";
      updatePayload.status = "banned";
      message = `Đã khóa tài khoản của người dùng ${userName}.`;
    } else if (action === "unban") {
      nextStatus = "active";
      nextVerified = true;
      updatePayload.status = "active";
      updatePayload.is_verified = true;
      message = `Đã mở khóa và kích hoạt tài khoản của người dùng ${userName}.`;
    } else if (action === "activate" || action === "verify") {
      nextStatus = "active";
      nextVerified = true;
      updatePayload.status = "active";
      updatePayload.is_verified = true;
      message = `Đã kích hoạt và xác thực tài khoản của người dùng ${userName}.`;
    } else if (action === "set_status") {
      const validStatuses = ["active", "banned", "inactive", "pending_verification"];
      if (!validStatuses.includes(rawTargetStatus)) {
        return NextResponse.json({ error: "Trạng thái tài khoản không hợp lệ." }, { status: 400 });
      }
      nextStatus = rawTargetStatus;
      updatePayload.status = rawTargetStatus;
      if (rawTargetStatus === "active") {
        nextVerified = true;
        updatePayload.is_verified = true;
      } else if (rawTargetStatus === "pending_verification") {
        nextVerified = false;
        updatePayload.is_verified = false;
      }
      const statusLabels: Record<string, string> = {
        active: "Hoạt động",
        banned: "Bị khóa",
        inactive: "Tạm ngưng",
        pending_verification: "Chưa xác thực",
      };
      message = `Đã cập nhật trạng thái của ${userName} thành "${statusLabels[rawTargetStatus]}".`;
    } else if (action === "set_role") {
      const validRoles = ["student", "teacher", "parent", "staff"];
      if (!validRoles.includes(rawTargetRole)) {
        return NextResponse.json({ error: "Vai trò không hợp lệ." }, { status: 400 });
      }
      nextRole = rawTargetRole;
      updatePayload.role = rawTargetRole;
      const roleLabels: Record<string, string> = {
        student: "Học sinh",
        teacher: "Giáo viên",
        parent: "Phụ huynh",
        staff: "Nhân viên",
      };
      message = `Đã chuyển đổi vai trò của ${userName} thành "${roleLabels[rawTargetRole]}".`;
    } else if (action === "set_verified") {
      const isV = Boolean(isVerified);
      nextVerified = isV;
      updatePayload.is_verified = isV;
      if (isV && targetUser.status === "pending_verification") {
        nextStatus = "active";
        updatePayload.status = "active";
      }
      message = isV
        ? `Đã xác thực OTP cho tài khoản ${userName}.`
        : `Đã hủy xác thực OTP của tài khoản ${userName}.`;
    } else {
      return NextResponse.json({ error: "Hành động yêu cầu không hợp lệ." }, { status: 400 });
    }

    const { error: updateErr } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", userId);

    if (updateErr) {
      console.error("[Staff User Update Error]:", updateErr);
      return NextResponse.json({ error: "Cập nhật dữ liệu người dùng trên Supabase thất bại." }, { status: 500 });
    }

    const displayStatus =
      nextStatus === "banned"
        ? "Bị khóa"
        : nextStatus === "inactive"
        ? "Tạm ngưng"
        : !nextVerified || nextStatus === "pending_verification"
        ? "Chưa xác thực"
        : "Hoạt động";

    return NextResponse.json({
      success: true,
      message,
      newStatus: nextStatus,
      rawStatus: nextStatus,
      displayStatus,
      isVerified: nextVerified,
      role: nextRole,
    });
  } catch (error) {
    console.error("[Staff User PUT Error]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xử lý người dùng." }, { status: 500 });
  }
}
