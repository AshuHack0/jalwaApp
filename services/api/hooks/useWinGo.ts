import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchWinGoCurrentRound,
  fetchWinGoHistory,
  fetchWinGoMyHistory,
  placeWinGoBet,
  type PlaceWinGoBetPayload,
} from "../winGo";

/** Query key factories for WinGo APIs */
export const winGoKeys = {
  all: ["winGo"] as const,
  currentRound: (apiPath: string) =>
    [...winGoKeys.all, "currentRound", apiPath] as const,
  history: (apiPath: string, page: number) =>
    [...winGoKeys.all, "history", apiPath, page] as const,
  myHistory: (apiPath: string, page: number) =>
    [...winGoKeys.all, "myHistory", apiPath, page] as const,
};

/**
 * Fetch only the current active round — lightweight, polled frequently.
 */
export function useWinGoCurrentRound(apiPath: string) {
  return useQuery({
    queryKey: winGoKeys.currentRound(apiPath),
    queryFn: () => fetchWinGoCurrentRound(apiPath),
    enabled: !!apiPath,
  });
}

/**
 * Fetch paginated history of past rounds.
 */
export function useWinGoHistory(apiPath: string, page = 1, pageSize = 10, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: winGoKeys.history(apiPath, page),
    queryFn: () => fetchWinGoHistory(apiPath, page, pageSize),
    enabled: !!apiPath && (options?.enabled ?? true),
  });
}

/**
 * Fetch WinGo my history with TanStack Query.
 */
export function useWinGoMyHistory(
  apiPath: string,
  page = 1,
  pageSize = 10,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: winGoKeys.myHistory(apiPath, page),
    queryFn: () => fetchWinGoMyHistory(apiPath, page, pageSize),
    enabled: !!apiPath && (options?.enabled ?? true),
  });
}

/**
 * Place a WinGo bet mutation. Invalidates game data and my history on success.
 */
export function usePlaceWinGoBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlaceWinGoBetPayload) => placeWinGoBet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: winGoKeys.all });
    },
  });
}
