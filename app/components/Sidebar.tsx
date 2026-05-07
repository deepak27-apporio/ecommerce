"use client";
import { useState, useEffect, memo } from "react";
import { CATEGORIES } from "../types/Constants";

interface SidebarProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  clearFilters:()=>any;
}

 function Sidebar({
  selectedCategories,
  onCategoryToggle,
  priceRange,
  onPriceRangeChange,
  clearFilters
}: SidebarProps) {
  const [localMin, setLocalMin] = useState(
    priceRange[0] > 0 ? String(priceRange[0]) : "",
  );
  const [localMax, setLocalMax] = useState(
    priceRange[1] < 200000 ? String(priceRange[1]) : "",
  );

  useEffect(() => {
    setLocalMin(priceRange[0] > 0 ? String(priceRange[0]) : "");
    setLocalMax(priceRange[1] < 200000 ? String(priceRange[1]) : "");
  }, [priceRange[0], priceRange[1]]);

  const applyPrice = () => {
    const min = Math.max(0, Number(localMin) || 0);
    const max = localMax === "" ? 200000 : Math.max(min, Number(localMax));
    onPriceRangeChange([min, max]);
  };

  return (
    <aside className="w-full lg:w-64 space-y-10 text-black">
      <section>
        <div className="flex justify-between ">
          <h3 className="text-[12px] uppercase tracking-[0.2em] text-on-surface font-bold mb-6">Categories</h3>
          <h6 className="underline text-red-400 cursor-pointer mb-6" onClick={clearFilters}>Clear all filter</h6>
        </div>
        <div className="space-y-4">
          {CATEGORIES.map((category, indx) => (
            <label
              key={indx}
              className="flex items-center group cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.value)}
                onChange={() => onCategoryToggle(category.value)}
                className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer"
              />
              <span
                className={`ml-3 text-sm font-medium transition-colors ${
                  selectedCategories.includes(category.value)
                    ? "text-on-surface"
                    : "text-on-surface-variant group-hover:text-primary"
                }`}
              >
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[12px] uppercase tracking-[0.2em] text-on-surface font-bold mb-6">
          Price Range
        </h3>
        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[11px] text-on-surface-variant font-medium mb-1 block">
                Min
              </label>
              <input
                type="number"
                min={0}
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                onBlur={applyPrice}
                onKeyDown={(e) => e.key === "Enter" && applyPrice()}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-sm"
              />
            </div>
            <span className="text-on-surface-variant pb-2.5 font-medium">
              —
            </span>
            <div className="flex-1">
              <label className="text-[11px] text-on-surface-variant font-medium mb-1 block">
                Max
              </label>
              <input
                type="number"
                min={0}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                onBlur={applyPrice}
                onKeyDown={(e) => e.key === "Enter" && applyPrice()}
                placeholder="Any"
                className="w-full px-3 py-2 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-sm"
              />
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Press Enter or click away to apply
          </p>
        </div>
      </section>
    </aside>
  );
}
export default memo(Sidebar)
