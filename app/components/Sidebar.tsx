import { CATEGORIES } from "../types/Constants";

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-64 space-y-10 text-black">
      <section>
        <h3 className="text-[12px] uppercase tracking-[0.2em] text-on-surface font-bold mb-6">Categories</h3>
        <div className="space-y-4">
          {CATEGORIES.map((category,indx) => (
            <label key={indx} className="flex items-center group cursor-pointer">
              <input 
                type="checkbox"
                defaultChecked={category.value === 'Knitwear'}
                className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer"
              />
              <span className={`ml-3 text-sm font-medium transition-colors ${
                category.value === 'Knitwear' ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-primary'
              }`}>
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Price Filter */}
      <section>
        <h3 className="text-[12px] uppercase tracking-[0.2em] text-on-surface font-bold mb-6">Price Range</h3>
        <div className="space-y-6">
          <input 
            type="range" 
            min="0" 
            max="500" 
            step="10"
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">$0</span>
            <span className="text-xs font-semibold text-on-surface-variant">$500+</span>
          </div>
        </div>
      </section>

      {/* Color Swatches */}
      {/* <section>
        <h3 className="text-[12px] uppercase tracking-[0.2em] text-on-surface font-bold mb-6">Colors</h3>
        <div className="flex flex-wrap gap-3">
          <button className="w-6 h-6 rounded-full bg-slate-900 border border-transparent ring-2 ring-offset-2 ring-primary"></button>
          <button className="w-6 h-6 rounded-full bg-slate-200 border border-transparent hover:ring-2 hover:ring-offset-2 hover:ring-slate-200 transition-all"></button>
          <button className="w-6 h-6 rounded-full bg-stone-400 border border-transparent hover:ring-2 hover:ring-offset-2 hover:ring-stone-400 transition-all"></button>
          <button className="w-6 h-6 rounded-full bg-indigo-900 border border-transparent hover:ring-2 hover:ring-offset-2 hover:ring-indigo-900 transition-all"></button>
        </div>
      </section> */}
    </aside>
  );
}
