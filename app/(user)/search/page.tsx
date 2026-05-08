"use client";
import { useEffect, useState, Suspense } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { ProductGridSkeleton } from "@/app/components/skeleton/ProductCardSkeleton";
import ProductGrid from "@/app/components/ProductGrid";
import Sidebar from "@/app/components/Sidebar";
import { useProducts } from "@/app/hooks/useProducts";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={6} />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters = {
    search: debouncedSearch || undefined,
    category:
      selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 200000 ? priceRange[1] : undefined,
    page,
    // sortBy,
  };

  const { products, isLoading, error, refetch } = useProducts(filters);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setPage(1);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedCategories([]);
    setPriceRange([0, 200000]);
    setPage(1);
  };

  useEffect(() => {
    if (q) {
      setSelectedCategories((prev) => [...prev, q]);
    }
  }, [q]);
  const hasActiveFilters =
    debouncedSearch ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 200000;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={refetch}
          className="text-sm underline text-slate-600 hover:text-slate-900"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/10">
      <main className="pt-10 pb-20 max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3 text-black text-center">
            Shop All Essentials
          </h1>

          <div className="relative mt-8 max-w-xl text-black m-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-10 py-3 border border-slate-200 bg-white text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-sm"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          <Sidebar
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            clearFilters={clearFilters}
          />

          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : products?.data?.length > 0 ? (
            <ProductGrid
              products={products}
              currentPage={page}
              onPageChange={setPage}
              //   sortBy={sortBy}
              // onSortByChange={setSortBy}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-on-surface-variant text-sm">
                No products found.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm underline text-slate-600 hover:text-slate-900"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
