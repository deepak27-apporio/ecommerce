"use client";

import { api } from "../axios";

export const getAllProducts = async () => {
  try {
    const res = await api.get("/admin/product");
    return res.data;
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (data: FormData, url: string) => {
  try {
    const res = await api.put(url, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await api.get(`/admin/product/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await api.delete(`/admin/product/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};