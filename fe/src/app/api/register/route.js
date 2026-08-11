import { NextResponse } from "next/server";
import { beJson } from "@/lib/api";
import { setSessionCookies } from "@/lib/session";

export async function POST(request) {
    try {
        const { fullName, email, password } = await request.json();

        const data = await beJson("/auth/register", {
            method: "POST",
            body: JSON.stringify({ username: fullName, email, password }),
        });

        // Nếu đăng ký thành công, đặt cookies session
        await setSessionCookies({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });

        return NextResponse.json({ message: "Đăng ký thành công" }, { status: 200 });
    } catch (error) {
        console.error("Lỗi API đăng ký:", error);
        return NextResponse.json(
            { error: error.message || "Đăng ký thất bại" },
            { status: error.status || 500 }
        );
    }
}