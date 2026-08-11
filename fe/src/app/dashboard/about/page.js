import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl rounded-lg border bg-white/80 p-8 shadow">
        <h1 className="text-3xl font-bold">About ABC Office</h1>
        <p className="mt-4 text-slate-700">
          This is an example About page to show how additional routes/pages are
          created when using the Next.js App Router. Create a folder with a
          `page.js` file under `src/app` and the folder name becomes the route.
        </p>

        <div className="mt-6 space-x-3">
          <Link href="/" className="text-amber-600 underline">
            Home
          </Link>
          <Link href="/dashboard" className="text-amber-600 underline">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
