"use client";

import axios from "axios";
import { api } from "./axios";
import { clearToken, setToken } from "./token";

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post("/api/auth/login", {
      email,
      password,
    });

    setToken(res.data.accessToken);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const userRegister = async (FormData: any) => {
  try {
    const res = await api.post("/auth/register", FormData);
    return res.data;
  } catch (error: any) {
    console.log("Registration API Error:", error);
    throw error?.response?.data;
  }
};

export const logout = async () => {
  try {
    const res = await axios.post("/api/auth/logout");
    clearToken();
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};
