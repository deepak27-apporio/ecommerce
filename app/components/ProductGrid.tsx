import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductGridProps {
  products: { data: any[]; pagination: Pagination };
  currentPage: number;
  onPageChange: (page: number) => void;
  // sortBy: string;
  // onSortByChange: (sortBy: string) => void;
}

export default function ProductGrid({ products, currentPage, onPageChange }: ProductGridProps) {
  const pagination = products?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const pageNumbers = (() => {
    const delta = 2;
    const pages: number[] = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  })();

  return (
    <div className="flex-1 text-black">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
        <span className="text-sm font-medium text-on-surface-variant">
          Showing {products?.data?.length ?? 0} of {pagination?.total ?? 0} products
        </span>
        {/* <div className="flex items-center">
          <span className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mr-3">
            Sort by:
          </span>
          <select className="bg-transparent border-none text-on-surface font-semibold text-sm focus:ring-0 cursor-pointer p-0">
            <option>New Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
        {products?.data?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-20 flex items-center justify-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!pagination?.hasPrevPage}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-sm font-semibold transition-all ${
                pageNum === currentPage
                  ? "bg-primary text-white"
                  : "border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!pagination?.hasNextPage}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
