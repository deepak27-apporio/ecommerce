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
}

interface AuthContextType extends AuthState {
  setState: Dispatch<SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ user: null });

  useEffect(() => {
    try {
      const user = DecryptData("user") || null;
      console.log("Decrypted user from localStorage:", user);
      if (user) {
        setState({ user: user });
      } else {
        setState((s) => ({ ...s }));
      }
    } catch {
      setState((s) => ({ ...s }));
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
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
