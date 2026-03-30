import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initiateDeposit, getMyDeposits, getDepositStatus } from "@/services/api/deposit";
import { initiateUsdtDeposit, getUsdtDepositStatus, type UsdtNetwork } from "@/services/api/usdtDeposit";
import { authKeys } from "./useAuth";
import { promotionKeys } from "./useFirstDepositBonus";

export const depositKeys = {
  all: ["deposits"] as const,
  list: (page: number) => ["deposits", "list", page] as const,
  status: (merchantOrderNo: string) => ["deposits", "status", merchantOrderNo] as const,
};

/** Fetch authenticated user's deposit history */
export function useMyDeposits(page = 1) {
  return useQuery({
    queryKey: depositKeys.list(page),
    queryFn: async () => {
      const res = await getMyDeposits(page);
      if (!res.success || !res.data) return null;
      return res.data;
    },
  });
}

/** Poll a specific deposit's status (useful after payment redirect back) */
export function useDepositStatus(merchantOrderNo: string | null) {
  return useQuery({
    queryKey: depositKeys.status(merchantOrderNo ?? ""),
    queryFn: async () => {
      if (!merchantOrderNo) return null;
      const res = await getDepositStatus(merchantOrderNo);
      if (!res.success || !res.data) return null;
      return res.data;
    },
    enabled: !!merchantOrderNo,
    refetchInterval: (query) => {
      // Keep polling every 5s while the deposit is still pending
      const data = query.state.data;
      if (!data) return false;
      return data.status === "pending" ? 5000 : false;
    },
  });
}

/** Initiate a real-money deposit. Opens payUrl on success. */
export function useInitiateDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => initiateDeposit(amount),
    onSuccess: (res) => {
      if (res.success) {
        // Invalidate deposit history so it refreshes
        queryClient.invalidateQueries({ queryKey: depositKeys.all });
        // Also refresh wallet and bonus data
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        queryClient.invalidateQueries({ queryKey: promotionKeys.firstDepositBonus() });
      }
    },
  });
}

/** Initiate a USDT deposit. Returns wallet address for the user to send USDT to. */
export function useInitiateUsdtDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount, network }: { amount: number; network: UsdtNetwork }) =>
      initiateUsdtDeposit(amount, network),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: depositKeys.all });
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        queryClient.invalidateQueries({ queryKey: promotionKeys.firstDepositBonus() });
      }
    },
  });
}

/** Poll a USDT deposit's status */
export function useUsdtDepositStatus(merchantOrderNo: string | null) {
  return useQuery({
    queryKey: depositKeys.status(`usdt-${merchantOrderNo ?? ""}`),
    queryFn: async () => {
      if (!merchantOrderNo) return null;
      const res = await getUsdtDepositStatus(merchantOrderNo);
      if (!res.success || !res.data) return null;
      return res.data;
    },
    enabled: !!merchantOrderNo,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      return data.status === "pending" ? 5000 : false;
    },
  });
}
