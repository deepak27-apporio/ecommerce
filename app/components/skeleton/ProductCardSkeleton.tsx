const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function ProductCardSkeleton() {
  return (
    <div className="group">
      <div
        className={`relative aspect-[3/4] rounded-sm mb-6 bg-slate-100 ${shimmer}`}
      >
        <span className="absolute top-4 left-4 w-10 h-4 rounded-sm bg-slate-200/80" />
        <span className="absolute bottom-4 right-4 w-11 h-11 rounded-sm bg-slate-200/80" />
      </div>

      {/* Text block — matches space-y-1 */}
      <div className="space-y-2">
        {/* Category: text-[11px] uppercase tracking-wider → narrow pill */}
        <div className={`h-2.5 w-16 rounded-full bg-slate-200 ${shimmer}`} />

        {/* Name: text-lg font-semibold, can span two lines */}
        <div className={`h-4 w-4/5 rounded-full bg-slate-200 ${shimmer}`} />
        <div className={`h-4 w-3/5 rounded-full bg-slate-200 ${shimmer}`} />

        {/* Price: text-base */}
        <div className={`h-3.5 w-20 rounded-full bg-slate-200 ${shimmer} !mt-3`} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
