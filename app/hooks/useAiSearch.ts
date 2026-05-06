// app/hooks/useAiSearch.ts
import { useState, useCallback } from "react";
import { aiSearchApi } from "../api/search";
import toast from "react-hot-toast";

export function useAiSearch() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiFilters, setAiFilters] = useState<any>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await aiSearchApi(query);
      setResults(data);
      setAiFilters(data.filters);
    } catch (err: any) {
      const msg = err?.message || "Search failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults(null);
    setAiFilters(null);
    setError(null);
  }, []);

  return { results, isLoading, error, aiFilters, search, clear };
}