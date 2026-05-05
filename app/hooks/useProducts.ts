import { useCallback, useEffect, useState } from "react";
import { Product } from "../types/types";
import { getAllProducts } from "../api/admin/productApi";
import toast from "react-hot-toast";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getAllProducts();
      setProducts(res);
    } catch (err: any) {
      const message = err?.message || "Failed to load products.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
}
