import React, { createContext, useCallback, useContext, useState } from "react";
import { DepositModal } from "@/components/DepositModal";

type DepositModalContextType = {
  openDepositModal: (preselectedAmount?: number) => void;
  closeDepositModal: () => void;
};

const DepositModalContext = createContext<DepositModalContextType | null>(null);

export function DepositModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [preselectedAmount, setPreselectedAmount] = useState<number | undefined>();

  const openDepositModal = useCallback((amount?: number) => {
    setPreselectedAmount(amount);
    setVisible(true);
  }, []);

  const closeDepositModal = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <DepositModalContext.Provider value={{ openDepositModal, closeDepositModal }}>
      {children}
      <DepositModal
        visible={visible}
        onClose={closeDepositModal}
        preselectedAmount={preselectedAmount}
      />
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
