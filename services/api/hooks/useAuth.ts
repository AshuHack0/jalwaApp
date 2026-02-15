import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, getWalletBalance } from "../auth";

/** Query key factories for Auth APIs */
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  wallet: () => [...authKeys.all, "wallet"] as const,
};

/**
 * Fetch current user. Requires valid token in storage.
 */
export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    enabled: options?.enabled ?? true,
  });
}

/**
 * Fetch wallet balance. Requires valid token in storage.
 */
export function useWalletBalance(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.wallet(),
    queryFn: getWalletBalance,
    enabled: options?.enabled ?? true,
  });
}
