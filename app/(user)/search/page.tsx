"use client";
import { ProductGridSkeleton } from "@/app/components/skeleton/ProductCardSkeleton";
import ProductGrid from "@/app/components/ProductGrid";
import Sidebar from "@/app/components/Sidebar";
import { useProducts } from "@/app/hooks/useProducts";
import { motion } from "motion/react";

export default function App() {
  const { products, isLoading, error, refetch } = useProducts();

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
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3 text-black">
            Shop All Essentials
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Discover our curated collection of premium lifestyle pieces designed
            for the modern minimalist. High-fidelity craftsmanship meets
            timeless aesthetic.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          <Sidebar />
          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <>
              {products?.data?.length > 0 ? (
                <ProductGrid products={products} />
              ) : null}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
