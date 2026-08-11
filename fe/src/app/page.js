import LoginForm from "@/components/login-form";

const metrics = [
  { value: "12+", label: "phòng ban đồng bộ dữ liệu" },
  { value: "98.4%", label: "tỷ lệ xử lý yêu cầu đúng hạn" },
  { value: "24/7", label: "giám sát hoạt động hệ thống" },
];

const highlights = [
  "Tập trung lịch họp, công văn, tác vụ và phê duyệt trên một bảng điều khiển duy nhất.",
  "Thiết kế ưu tiên tốc độ thao tác cho nhân sự vận hành, hành chính và quản trị.",
  "Cơ chế cảnh báo đăng nhập bất thường giúp kiểm soát tài khoản tốt hơn.",
];

const quickAccess = [
  "Phê duyệt đề xuất",
  "Lịch điều hành",
  "Báo cáo công việc",
  "Danh bạ nội bộ",
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(252,211,77,0.28),_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#fff7ed_42%,_#fff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute right-[-5rem] top-[-2rem] h-80 w-80 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="grid-overlay absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="glass-panel content-panel flex flex-col justify-between px-6 py-8 sm:px-8 md:px-10 lg:px-12 lg:py-10">
          <div className="space-y-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="brand-badge">ABC Office</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Workspace control
              </span>
            </div>

            <div className="max-w-2xl space-y-6">
              <p className="font-display text-5xl leading-none tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Không chỉ là trang đăng nhập. Đây là điểm vào của toàn bộ hệ vận hành.
              </p>
              <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Giao diện được tối ưu để nhân sự vào việc ngay: rõ thứ tự thị giác,
                ít nhiễu, nhấn mạnh trạng thái bảo mật và giữ đủ chiều sâu thương
                hiệu cho hệ thống doanh nghiệp.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {metrics.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur"
                >
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.9)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-white/50">
                      Hoạt động hôm nay
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">
                      31 yêu cầu mới cần xử lý trước 17:30
                    </h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    Live
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <p className="text-sm leading-6 text-white/75">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_70px_-50px_rgba(148,163,184,0.8)]">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-400">
                  Truy cập nhanh
                </p>
                <div className="mt-5 grid gap-3">
                  {quickAccess.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-sm font-bold text-amber-700">
                          0{index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{item}</p>
                          <p className="text-sm text-slate-500">
                            Mở ngay sau khi xác thực thành công
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-300">→</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>ISO-ready security</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Audit logs</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Role-based access</span>
          </div>
        </section>

        <section className="flex items-center">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
