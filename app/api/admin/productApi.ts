"use client";

import { api } from "../axios";

export interface ProductQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  aiSearch?:boolean
}

export const getAllProducts = async (params?: ProductQueryParams) => {
  try {
    const res = await api.get("/product", { params });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getAllAdminProducts = async (params?: ProductQueryParams) => {
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

export const updateProductStatus = async (id: number, data: boolean) => {
  try {
    const res = await api.patch(`/admin/product/status/${id}`, {
      status: data,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getProductAdminById = async (id: string) => {
  try {
    const res = await api.get(`/admin/product/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};
export const getProductById = async (id: string) => {
  try {
    const res = await api.get(`/product/${id}`);
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
