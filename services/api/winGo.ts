import { API_BASE_URL, API_DEBUG } from "./config";

export type WinGoRound = {
  _id: string;
  period: string;
  outcomeNumber?: number | null;
  outcomeBigSmall?: string | null;
  outcomeColor?: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
};

export type WinGoGameData = {
  currentRound: WinGoRound | null;
  historyRounds: WinGoRound[];
  historyPagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

type WinGoApiResponse = {
  success: boolean;
  data?: WinGoGameData;
};

/**
 * Fetch WinGo game data (current round + history) for a given path.
 * All WinGo API calls go through here for easy debugging.
 */
export async function fetchWinGoGameData(
  apiPath: string,
  page = 1,
  pageSize = 10
): Promise<WinGoGameData | null> {
  const url = `${API_BASE_URL}/api/v1/WinGo/${apiPath}?page=${page}&pageSize=${pageSize}`;

  if (API_DEBUG) {
    console.log("[API] WinGo GET:", url);
  }

  try {
    const res = await fetch(url);
    const json: WinGoApiResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] WinGo response:", { status: res.status, success: json.success });
    }

    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] WinGo error:", err);
    }
    return null;
  }
}
