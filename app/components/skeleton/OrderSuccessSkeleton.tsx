const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export default function OrderSuccessSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* Left: order items */}
      <div className="lg:col-span-8 bg-white p-8 lg:p-10 rounded-xl border border-slate-100 shadow-sm">
        <div
          className={`h-8 w-48 rounded-full bg-slate-200 mb-10 ${shimmer}`}
        />
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <div
                className={`w-24 h-32 rounded-lg bg-slate-100 shrink-0 ${shimmer}`}
              />
              <div className="grow space-y-2">
                <div
                  className={`h-2.5 w-16 rounded-full bg-slate-200 ${shimmer}`}
                />
                <div
                  className={`h-5 w-3/5 rounded-full bg-slate-200 ${shimmer}`}
                />
                <div
                  className={`h-3.5 w-24 rounded-full bg-slate-200 ${shimmer}`}
                />
              </div>
              <div
                className={`h-6 w-20 rounded-full bg-slate-200 ${shimmer}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right: payment + address */}
      <aside className="lg:col-span-4 space-y-gutter">
        <div className="bg-slate-50/50 p-8 rounded-xl border border-slate-200">
          <div
            className={`h-6 w-32 rounded-full bg-slate-200 mb-8 ${shimmer}`}
          />
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div
                  className={`h-4 w-20 rounded-full bg-slate-200 ${shimmer}`}
                />
                <div
                  className={`h-4 w-16 rounded-full bg-slate-200 ${shimmer}`}
                />
              </div>
            ))}
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex justify-between">
              <div
                className={`h-5 w-12 rounded-full bg-slate-200 ${shimmer}`}
              />
              <div
                className={`h-5 w-24 rounded-full bg-slate-200 ${shimmer}`}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
          <div
            className={`h-6 w-40 rounded-full bg-slate-200 mb-6 ${shimmer}`}
          />
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-3.5 rounded-full bg-slate-200 ${shimmer}`}
                style={{ width: `${[55, 70, 45, 60, 40][i]}%` }}
              />
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className={`h-4 w-48 rounded-full bg-slate-200 ${shimmer}`} />
          </div>
        </div>
      </aside>
    </div>
  );
}
