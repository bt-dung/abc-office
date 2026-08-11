import { NextResponse } from "next/server";
import { getRefreshToken, clearSessionCookies } from "@/lib/session";

const BASE_URL = process.env.BE_API_URL;

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }).catch(() => null);
  }

  await clearSessionCookies();
  return NextResponse.json({ ok: true });
}
