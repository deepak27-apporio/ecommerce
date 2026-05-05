"use client";

import Link from "next/link";


const S =
  "relative overflow-hidden bg-neutral-100 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent";

export function ProductPageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-10 rounded-full ${S}`} />
          <div className="h-3 w-2 rounded-full bg-neutral-100" />
          <div className={`h-3 w-16 rounded-full ${S}`} />
          <div className="h-3 w-2 rounded-full bg-neutral-100" />
          <div className={`h-3 w-24 rounded-full ${S}`} />
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Gallery skeleton */}
        <div className="flex flex-col gap-3">
          <div className={`w-full aspect-[4/3] rounded-2xl ${S}`} />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-16 h-16 rounded-xl ${S}`} />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-8">
          <div className={`h-6 w-24 rounded-full ${S}`} />
          <div className="flex flex-col gap-2">
            <div className={`h-9 w-4/5 rounded-lg ${S}`} />
            <div className={`h-9 w-3/5 rounded-lg ${S}`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className={`h-3.5 w-full rounded-full ${S}`} />
            <div className={`h-3.5 w-full rounded-full ${S}`} />
            <div className={`h-3.5 w-2/3 rounded-full ${S}`} />
          </div>
          <hr className="border-neutral-100" />
          <div className={`h-10 w-36 rounded-lg ${S}`} />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${S}`} />
            <div className={`h-3.5 w-24 rounded-full ${S}`} />
          </div>
          <hr className="border-neutral-100" />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`flex-1 h-12 rounded-xl ${S}`} />
            <div className={`flex-1 h-12 rounded-xl ${S}`} />
          </div>
        </aside>
      </section>
    </main>
  );
}

export function ProductError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            Something went wrong
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-neutral-200 hover:border-neutral-400 text-neutral-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}

export function ProductNotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-neutral-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            Product not found
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            This product may have been removed or the link is incorrect.
          </p>
        </div>
        <Link
          href="/"
          className="bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          ← Back to Shop
        </Link>
      </div>
    </main>
  );
}