import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFirstDepositBonus,
  claimFirstDepositBonus,
  type FirstDepositBonusItem,
} from "../promotion";

export const promotionKeys = {
  all: ["promotion"] as const,
  firstDepositBonus: () => [...promotionKeys.all, "first-deposit-bonus"] as const,
};

/**
 * Fetch first deposit bonus offers. Data is used by FirstDepositBonusModal.
 * Invalidate after deposit or claim to refresh.
 */
export function useFirstDepositBonus(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: promotionKeys.firstDepositBonus(),
    queryFn: async () => {
      const res = await getFirstDepositBonus();
      return res?.data ?? [];
    },
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });

  const data = query.data ?? [];
  const allReceived =
    data.length > 0 && data.every((o: FirstDepositBonusItem) => o.isFinshed);

  return {
    ...query,
    data,
    allReceived,
  };
}

/**
 * Hook that returns claimFirstDepositBonus mutation. Use for Receive button.
 */
export function useClaimFirstDepositBonus() {
  const queryClient = useQueryClient();

  return {
    claim: async (offerId: number) => {
      const res = await claimFirstDepositBonus(offerId);
      if (res.code === 0) {
        await queryClient.invalidateQueries({ queryKey: promotionKeys.firstDepositBonus() });
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
      return res;
    },
  };
}
