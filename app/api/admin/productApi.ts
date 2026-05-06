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

export const getAllProducts = async (params?: ProductQueryParams) => {
  try {
    const res = await api.get("/admin/product", { params });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const createProduct = async (data: FormData) => {
  try {
    console.log("Creating product with data:", data);
    const res = await api.post("/admin/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const updateProduct = async (data: FormData, url: string) => {
  try {
    const res = await api.put(url, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await api.get(`/admin/product/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await api.delete(`/admin/product/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};