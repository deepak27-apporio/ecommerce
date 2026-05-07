import { api } from "../axios";

export const getDashboardData = async () => {
  try {
    const res = await api.get("/admin/dashboard");
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};