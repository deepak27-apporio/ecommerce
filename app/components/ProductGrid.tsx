import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: any[] }) {
  return (
    <div className="flex-1 text-black">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
        <span className="text-sm font-medium text-on-surface-variant">
          Showing {products?.data?.length} of 48 products
        </span>
        <div className="flex items-center">
          <span className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mr-3">
            Sort by:
          </span>
          <select className="bg-transparent border-none text-on-surface font-semibold text-sm focus:ring-0 cursor-pointer p-0">
            <option>New Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
          {products?.data?.length > 0 ? (
            products.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : null}
        </div>

      {/* Pagination */}
      <div className="mt-20 flex items-center justify-center space-x-2">
        <button className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all rounded-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold rounded-sm">
          1
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all rounded-sm font-semibold">
          2
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all rounded-sm font-semibold">
          3
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all rounded-sm">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
