"use client";

import { api } from "../axios";

export interface ProductQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const getAllOrders = async (params?: ProductQueryParams) => {
  try {
    const res = await api.get("/admin/order", { params });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const res = await api.put(`/admin/order/${orderId}`, { status });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};
