import {
  getAccessToken,
  getRefreshToken,
  setSessionCookies,
  clearSessionCookies,
} from "./session";

const BASE_URL = process.env.BE_API_URL;
if (!BASE_URL) {
  // Trong môi trường server, việc này sẽ dừng build hoặc khởi động server nếu biến môi trường bị thiếu.
  throw new Error(
    "Biến môi trường BE_API_URL chưa được thiết lập. Vui lòng kiểm tra file .env hoặc cấu hình docker-compose.yml của bạn."
  );
}

async function rawFetch(path, opts, accessToken) {
  return fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts?.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: "no-store",
  });
}

// Gọi backend NestJS kèm access token; nếu 401 (hết hạn) thì tự refresh 1 lần
// và thử lại, theo mẫu BFF (token không bao giờ rời khỏi server Next.js).
export async function beFetch(path, opts = {}) {
  try {
    const accessToken = await getAccessToken();
    let res = await rawFetch(path, opts, accessToken);

    if (res.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          cache: "no-store",
        });

        if (refreshRes.ok) {
          const tokens = await refreshRes.json();
          await setSessionCookies(tokens);
          res = await rawFetch(path, opts, tokens.accessToken);
        }
      }
    }

    return res;
  } catch (error) {
    console.error(`[beFetch] Error in beFetch for ${path}:`, error);
    throw error; // Re-throw to propagate
  }
}

export async function beJson(path, opts = {}) {
  try {
    const res = await beFetch(path, opts);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message || "Yêu cầu tới backend thất bại";
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`Lỗi khi gọi API backend (${path}):`, error);
    throw error;
  }
}

/**
 * Gửi yêu cầu `multipart/form-data` đến backend.
 * Không set 'Content-Type', trình duyệt sẽ tự động làm điều đó.
 */
export async function beFormData(path, formData, opts = {}) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${BASE_URL}${path}`, {
      ...opts,
      method: opts.method || 'POST',
      headers: {
        ...(opts?.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: 'no-store',
      body: formData,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || 'Yêu cầu thất bại');
    }
    return data;
  } catch (error) {
    throw error;
  }
}
