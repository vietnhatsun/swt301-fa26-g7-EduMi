import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // Nhận dữ liệu stream trong môi trường local dev để mô phỏng PUT lên R2
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  return NextResponse.json({
    success: true,
    message: "Tải lên mô phỏng thành công (Local Dev Mock)",
    key,
  });
}
