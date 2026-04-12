import { useQuery } from "@tanstack/react-query";
import { getMyWithdrawals } from "@/services/api/withdrawal";

export const withdrawalKeys = {
  all: ["withdrawals"] as const,
  list: (page: number) => ["withdrawals", "list", page] as const,
};

export function useMyWithdrawals(page = 1) {
  return useQuery({
    queryKey: withdrawalKeys.list(page),
    queryFn: async () => {
      const res = await getMyWithdrawals(page);
      if (!res.success || !res.data) return null;
      return res.data;
    },
  });
}
