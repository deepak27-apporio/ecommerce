import { useCallback, useEffect, useState } from "react";
import { getAllProducts, ProductQueryParams } from "../api/admin/productApi";
import toast from "react-hot-toast";

export function useProducts(filters: ProductQueryParams = {}) {
  const [products, setProducts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { search, category, minPrice, maxPrice, page, limit } = filters;

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: ProductQueryParams = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice !== undefined) params.minPrice = minPrice;
      if (maxPrice !== undefined) params.maxPrice = maxPrice;
      if (page) params.page = page;
      if (limit) params.limit = limit;
      const res = await getAllProducts(params);
      setProducts(res);
    } catch (err: any) {
      const message = err?.message || "Failed to load products.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [search, category, minPrice, maxPrice, page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
}
