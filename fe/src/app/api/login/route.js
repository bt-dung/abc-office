import { NextResponse } from "next/server";
import { beJson } from "@/lib/api";
import { setSessionCookies } from "@/lib/session";

export async function POST(request) {
  try {
    const { identifier, password } = await request.json();

    // Gọi API backend để đăng nhập
    const data = await beJson("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });

    // Nếu đăng nhập thành công, đặt cookies session
    await setSessionCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return NextResponse.json({ ok: true, message: "Đăng nhập thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi API đăng nhập:", error);
    return NextResponse.json(
      { error: error.message || "Đăng nhập thất bại" },
      { status: error.status || 500 }
    );
  }
}