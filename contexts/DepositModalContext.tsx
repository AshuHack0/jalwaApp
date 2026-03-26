import React, { createContext, useCallback, useContext } from "react";
import { useRouter } from "expo-router";

type DepositModalContextType = {
  openDepositModal: (preselectedAmount?: number) => void;
  closeDepositModal: () => void;
};

const DepositModalContext = createContext<DepositModalContextType | null>(null);

export function DepositModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const openDepositModal = useCallback((amount?: number) => {
    router.push({ pathname: "/deposit" as any, params: amount ? { amount: String(amount) } : {} });
  }, [router]);

  const closeDepositModal = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <DepositModalContext.Provider
      value={{ openDepositModal, closeDepositModal }}
    >
      {children}
    </DepositModalContext.Provider>
  );
}

export function useDepositModal() {
  const ctx = useContext(DepositModalContext);
  if (!ctx) {
    throw new Error("useDepositModal must be used within DepositModalProvider");
  }
  return ctx;
}
