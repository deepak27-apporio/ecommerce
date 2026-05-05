"use client";

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden">
      
      {/* Header */}
      <div className="grid grid-cols-5 gap-4 bg-gray-100 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-300 rounded animate-pulse"
          />
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-5 gap-4 p-4"
          >
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;