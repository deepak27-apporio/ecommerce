"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import { DecryptData } from "../utils/EncryptDecrypt";
import { Address } from "../types/types";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  addresses?: Address[];
};

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  setState: Dispatch<SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    try {
      const user = DecryptData("user") || null;

      setState({
        user,
        loading: false,
      });
    } catch {
      setState({
        user: null,
        loading: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);      

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};