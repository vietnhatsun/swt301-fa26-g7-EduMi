import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const supabase = createServiceClient();
    const { data: profile } = await supabase
      .from("teacher_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        avatarUrl: user.avatar_url,
        gender: profile?.gender || null,
        teacherRole: profile?.teacher_role || null,
        bio: profile?.bio || "",
        workExperience: profile?.work_experience || "",
        subjects: profile?.subjects || [],
        gradeLevels: profile?.grade_levels || [],
        degree: profile?.degree || "",
        experienceYears: profile?.experience_years || "",
        certificateUrl: profile?.certificate_url || null,
        certificateFileName: profile?.certificate_file_name || null,
        certificateFileSize: profile?.certificate_file_size || null,
        verificationStatus: profile?.verification_status || "draft",
        isVerifiedEducator: profile?.is_verified_educator ?? false,
      },
    });
  } catch (error) {
    console.error("[Teacher Profile GET Error]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải hồ sơ." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      avatarUrl,
      gender,
      teacherRole,
      bio,
      workExperience,
      subjects,
      gradeLevels,
      degree,
      experienceYears,
      certificateUrl,
      certificateFileName,
      certificateFileSize,
      action = "save_draft", // 'save_draft' | 'submit'
    } = body;

    const supabase = createServiceClient();

    // 1. Cập nhật thông tin cơ bản trong bảng users (họ tên, avatar)
    const userUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (fullName) userUpdates.full_name = fullName;
    if (avatarUrl !== undefined) userUpdates.avatar_url = avatarUrl;

    if (Object.keys(userUpdates).length > 1) {
      const { error: userError } = await supabase
        .from("users")
        .update(userUpdates)
        .eq("id", user.id);

      if (userError) {
        console.error("[Update users Error]:", userError);
      }
    }

    // 2. Xác định trạng thái hồ sơ
    const verificationStatus = action === "submit" ? "pending" : "draft";

    // 3. Upsert vào bảng teacher_profiles
    const profilePayload: Record<string, unknown> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
      gender: gender || null,
      teacher_role: teacherRole || null,
      bio: bio ?? "",
      work_experience: workExperience ?? "",
      subjects: Array.isArray(subjects) ? subjects : [],
      grade_levels: Array.isArray(gradeLevels) ? gradeLevels : [],
      degree: degree || null,
      experience_years: experienceYears || null,
      verification_status: verificationStatus,
    };

    if (certificateUrl !== undefined) profilePayload.certificate_url = certificateUrl;
    if (certificateFileName !== undefined) profilePayload.certificate_file_name = certificateFileName;
    if (certificateFileSize !== undefined) profilePayload.certificate_file_size = certificateFileSize;

    const { data: updatedProfile, error: profileError } = await supabase
      .from("teacher_profiles")
      .upsert(profilePayload, { onConflict: "user_id" })
      .select()
      .single();

    if (profileError) {
      console.error("[Update teacher_profiles Error]:", profileError);
      return NextResponse.json(
        { error: "Lỗi cơ sở dữ liệu khi cập nhật hồ sơ giáo viên." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === "submit"
          ? "Hồ sơ đã được gửi xét duyệt thành công tới ban kiểm duyệt (Staff)."
          : "Đã lưu nháp hồ sơ thành công.",
      verificationStatus,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("[Teacher Profile PUT Error]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi lưu hồ sơ." }, { status: 500 });
  }
}
