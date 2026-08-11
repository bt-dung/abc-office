import "server-only";
import { beJson } from "./api";

export async function getSession() {
  try {
    return await beJson("/auth/me");
  } catch (error) {
    console.error("Lỗi khi lấy session (getSession):", error);
    return null;
  }
}
