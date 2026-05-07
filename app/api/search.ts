import { api } from "./axios";

export const aiSearchApi = async (query: string) => {
  const res = await api.post("/admin/product/search/ai-search", { query });
  return res.data;
};