import { API_BASE_URL, API_DEBUG } from "./config";
import { getToken } from "@/services/auth-storage";

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
  serverTime?: string;
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

// ── My History types & fetch ──

export type MyHistoryBet = {
  _id: string;
  betType: "BIG_SMALL" | "NUMBER" | "COLOR";
  choiceBigSmall?: string | null;
  choiceNumber?: number | null;
  choiceColor?: string | null;
  amount: number;
  isWin: boolean | null;
  payoutAmount: number;
  createdAt: string;
  round: {
    _id: string;
    period: string;
    outcomeNumber: number | null;
    outcomeBigSmall: string | null;
    outcomeColor: string | null;
    status: string;
  };
};

export type MyHistoryData = {
  bets: MyHistoryBet[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

type MyHistoryApiResponse = {
  success: boolean;
  data?: MyHistoryData;
};

export async function fetchWinGoMyHistory(
  apiPath: string,
  page = 1,
  pageSize = 10
): Promise<MyHistoryData | null> {
  const token = await getToken();
  if (!token) return null;

  const url = `${API_BASE_URL}/api/v1/WinGo/${apiPath}/myHistory?page=${page}&pageSize=${pageSize}`;

  if (API_DEBUG) {
    console.log("[API] WinGo myHistory GET:", url);
  }

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: MyHistoryApiResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] WinGo myHistory response:", { status: res.status, success: json.success });
    }

    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] WinGo myHistory error:", err);
    }
    return null;
  }
}

/** Bet type for placeBet API */
export type WinGoBetType = "BIG_SMALL" | "NUMBER" | "COLOR";

export type PlaceWinGoBetPayload = {
  betType: WinGoBetType;
  choice: string | number;
  amount: number;
  roundId: string;
};

export type PlaceWinGoBetResponse = {
  success: boolean;
  data?: {
    _id: string;
    user: string;
    round: string;
    amount: number;
    betType: string;
    choiceBigSmall?: string;
    choiceNumber?: number;
    choiceColor?: string;
  };
  message?: string;
};

/**
 * Place a WinGo bet. Requires valid auth token.
 */
export async function placeWinGoBet(
  payload: PlaceWinGoBetPayload
): Promise<PlaceWinGoBetResponse> {
  const token = await getToken();
  if (!token) {
    return { success: false, message: "Not authenticated." };
  }

  const url = `${API_BASE_URL}/api/v1/WinGo/placeBet`;

  if (API_DEBUG) {
    console.log("[API] WinGo placeBet POST:", url, payload);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json: PlaceWinGoBetResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] WinGo placeBet response:", { status: res.status, success: json.success });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] WinGo placeBet error:", err);
    }
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
}
