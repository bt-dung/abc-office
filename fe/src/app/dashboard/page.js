import Link from "next/link";
import styles from "./dashboard.module.scss";

export default function DashboardPage() {
  return (
    <main className={styles['dashboard-page']}>
      <div className={styles['content-wrapper']}>
        <div className={`${styles['content-box']} max-w-2xl rounded-lg border bg-white/80 p-8 shadow`}>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-4 text-slate-700">This is a sample dashboard route.</p>

          <div className="mt-6 space-x-3">
            <Link href="/" className={`${styles['link']} text-amber-600 underline`}>
              Home
            </Link>
            <Link href="/dashboard/about" className={styles['link']}>
              About
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
