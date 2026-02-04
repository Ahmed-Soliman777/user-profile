import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 font-sans transition-colors duration-500 dark:bg-zinc-950">

      <div className="absolute top-0 left-1/2 -z-10 h-100 w-150 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-600/5"></div>

      <main className="text-center">
        <h1 className="mb-4 text-6xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-7xl">
          MOD<span className="text-blue-600">BOOK</span>
        </h1>

        <p className="mx-auto mb-8 max-w-112.5 text-lg text-zinc-600 dark:text-zinc-400">
          Share your moments, connect with friends, and explore the world in a whole new style.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-zinc-900 px-8 font-medium text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <span>Login now</span>
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-8 font-medium text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:hover:bg-zinc-900"
          >
            Create account
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-zinc-400 dark:text-zinc-600">
        &copy; {new Date().getFullYear()} MODBOOK. All rights reserved.
      </footer>
    </div>
  );
}