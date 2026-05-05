"use client";

import { api } from "./axios";
import { clearToken, setToken } from "./token";

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    setToken(res?.data?.accessToken);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const userRegister = async (FormData: any) => {
  try {
    const res = await api.post("/auth/register", FormData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    clearToken();
    return res.data;
  } catch (error) {
    throw error;
  }
};
