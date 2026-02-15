import { useQueryClient } from "@tanstack/react-query";
import { authKeys, useMe, useWalletBalance } from "@/services/api/hooks";
import type { AuthUser } from "@/services/api";
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
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  const { data: user, isLoading: meLoading, refetch: refetchMe } = useMe({
    enabled: hasToken === true,
  });
  const { data: walletBalanceData, refetch: refetchWallet } = useWalletBalance({
    enabled: hasToken === true,
  });

  const isLoading = hasToken === null || (hasToken && meLoading);
  const walletBalance = walletBalanceData ?? user?.walletBalance ?? 0;

  const refreshUser = useCallback(async () => {
    await refetchMe();
  }, [refetchMe]);

  const refreshWallet = useCallback(async () => {
    await refetchWallet();
  }, [refetchWallet]);

  const login = useCallback(
    async (token: string) => {
      await setToken(token);
      setHasToken(true);
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    await removeToken();
    setHasToken(false);
    queryClient.setQueryData(authKeys.me(), null);
    queryClient.setQueryData(authKeys.wallet(), null);
  }, [queryClient]);

  useEffect(() => {
    getToken().then((token) => setHasToken(!!token));
  }, []);

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    walletBalance,
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
