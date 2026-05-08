"use client";

const widths = [
  [85, 70, 60, 75, 55, 40],
  [60, 90, 80, 50, 70, 40],
  [75, 65, 70, 85, 60, 40],
  [90, 55, 65, 60, 80, 40],
  [65, 80, 75, 70, 50, 40],
];

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="h-[18px] w-36 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-9 w-44 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div className="grid gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100"
        style={{ gridTemplateColumns: "0.8fr 1.2fr 1fr 1fr 0.8fr 0.6fr" }}>
        {[70, 60, 55, 65, 75, 50].map((w, i) => (
          <div key={i} className="h-[11px] bg-gray-300 rounded animate-pulse"
            style={{ width: `${w}%` }} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-3 px-5 py-[14px] items-center border-b border-gray-50 last:border-0"
          style={{ gridTemplateColumns: "0.8fr 1.2fr 1fr 1fr 0.8fr 0.6fr" }}
        >
          {(widths[rowIndex % widths.length]).map((w, colIndex) => {
            if (colIndex === 4) {
              return (
                <div key={colIndex} className="h-5 bg-gray-200 rounded-full animate-pulse"
                  style={{ width: `${w}%` }} />
              );
            }
            if (colIndex === 5) {
              return (
                <div key={colIndex} className="h-7 w-7 bg-gray-200 rounded-lg animate-pulse" />
              );
            }
            return (
              <div key={colIndex} className="h-[13px] bg-gray-200 rounded animate-pulse"
                style={{ width: `${w}%` }} />
            );
          })}
        </div>
      ))}

      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <div className="h-[11px] w-28 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-2 items-center">
          <div className="h-7 w-14 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-[11px] w-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-7 w-14 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

    </div>
  );
};

export default TableSkeleton;