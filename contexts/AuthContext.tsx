import { getMe, getWalletBalance, type AuthUser } from "@/services/api";
import { getToken, removeToken, setToken } from "@/services/auth-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  walletBalance: number;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshWallet: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setUser(null);
      return;
    }
    const me = await getMe();
    setUser(me);
  }, []);

  const refreshWallet = useCallback(async () => {
    const balance = await getWalletBalance();
    if (balance !== null) {
      setUser((prev) => (prev ? { ...prev, walletBalance: balance } : null));
    }
  }, []);

  const login = useCallback(async (token: string) => {
    await setToken(token);
    const me = await getMe();
    setUser(me);
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function init() {
      const token = await getToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const me = await getMe();
      if (mounted) {
        setUser(me);
      }
      setIsLoading(false);
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    walletBalance: user?.walletBalance ?? 0,
    login,
    logout,
    refreshUser,
    refreshWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
