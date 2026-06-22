import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.34em] text-white/36">404</p>
        <h1 className="mt-5 text-4xl font-medium text-white">Project not found</h1>
        <Link
          href="/"
          className="focus-ring mt-8 inline-flex rounded-full border border-white/12 px-5 py-3 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
