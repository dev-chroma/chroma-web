"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import type { PublicUser } from "@/types/user";

interface AuthContextType {
  user: PublicUser | null;
  loading: boolean;
  login: (token: string, user: PublicUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.users.getMe();

        setUser(userData);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = (token: string, userData: PublicUser) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}
