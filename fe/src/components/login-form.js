"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const socialButtons = [
  {
    name: "Google",
    icon: "G",
  },
  {
    name: "Microsoft",
    icon: "M",
  },
];

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data?.error || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      setError("Lỗi mạng. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel login-shell animate-rise">
      <div className="space-y-3">
        <span className="section-chip">Truy cập hệ thống</span>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Đăng nhập để tiếp tục điều hành văn phòng
          </h1>
          <p className="max-w-xl text-sm leading-7 text-slate-600 md:text-base">
            Theo dõi công việc, phê duyệt hồ sơ, quản lý lịch họp và nắm toàn bộ
            hoạt động nội bộ trên một giao diện tập trung.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {socialButtons.map((item) => (
          <button
            key={item.name}
            type="button"
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-900">
              {item.icon}
            </span>
            Tiếp tục với {item.name}
          </button>
        ))}
      </div>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
          hoặc dùng email
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="field-group md:col-span-2">
            <span className="field-label">Tài khoản</span>
            <input
              type="text"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username hoặc email nội bộ"
              className="field-input"
              required
            />
            <span className="field-hint">
              Dùng username hoặc email nội bộ để đồng bộ vai trò và quyền truy cập.
            </span>
          </label>

          <label className="field-group md:col-span-2">
            <span className="field-label">Mật khẩu</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                className="field-input pr-24"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            <span className="field-hint">
              Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa và số.
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-semibold">Lớp bảo vệ khuyến nghị</p>
            <p className="text-amber-800/80">
              Bật xác minh 2 bước để hạn chế truy cập trái phép vào tài liệu nội
              bộ.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-amber-300 px-4 py-2 font-semibold transition hover:bg-amber-100"
          >
            Thiết lập ngay
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
            />
            <span>Ghi nhớ thiết bị này trong 30 ngày</span>
          </label>
          <Link
            href="/"
            className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-900"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Đang xác thực..." : "Đăng nhập vào bảng điều khiển"}
        </button>
      </form>

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50/90 p-5 text-sm text-slate-600 md:grid-cols-3">
        <div>
          <p className="font-semibold text-slate-900">Bảo mật phiên</p>
          <p className="mt-1">Phiên đăng nhập được kiểm tra trên từng thiết bị.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Lịch sử truy cập</p>
          <p className="mt-1">Theo dõi vị trí, thời gian và trình duyệt đã dùng.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Hỗ trợ nội bộ</p>
          <p className="mt-1">Liên hệ IT Desk nếu tài khoản bị khóa hoặc nghi ngờ rủi ro.</p>
        </div>
      </div>
    </div>
  );
}
