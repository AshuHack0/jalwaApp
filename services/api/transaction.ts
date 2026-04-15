import { API_BASE_URL, API_DEBUG } from "./config";
import { getToken } from "@/services/auth-storage";

const TRANSACTION_BASE = `${API_BASE_URL}/api/v1/transactions`;


export type TransactionRecord = {
  _id: string;
  type: "deposit" | "withdrawal" | "game_in" | "game_out" | string;
  amount: number;
  detail: string;
  createdAt: string;
  balance?: number;
};

export type TransactionHistoryResponse = {
  success: boolean;
  message?: string;
  data?: {
    transactions: TransactionRecord[];
    total: number;
    page: number;
    pages: number;
  };
};

const TYPE_MAP: Record<string, string> = {
  Deposit: "deposit",
  Withdraw: "withdrawal",
  "Game moved in": "game_in",
  "Game moved out": "game_out",
};

const DATE_MAP: Record<string, string> = {
  Today: "today",
  Yesterday: "yesterday",
  "Last 7 days": "last7days",
  "Last 30 days": "last30days",
};

export async function getMyTransactions(
  page = 1,
  filter = "All",
  dateRange = "Choose a date"
): Promise<TransactionHistoryResponse> {
  const token = await getToken();
  if (!token) return { success: false, message: "Not authenticated." };

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (filter !== "All" && TYPE_MAP[filter]) {
    params.set("type", TYPE_MAP[filter]);
  }
  if (dateRange !== "Choose a date" && DATE_MAP[dateRange]) {
    params.set("dateRange", DATE_MAP[dateRange]);
  }

  const url = `${TRANSACTION_BASE}/my?${params.toString()}`;

  if (API_DEBUG) {
    console.log("[API] getMyTransactions GET:", url);
  }

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: TransactionHistoryResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] getMyTransactions response:", {
        status: res.status,
        ...json,
      });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] getMyTransactions error:", err);
    return { success: false, message: "Network error. Please check your connection." };
  }
}

/** Map a transaction type string to a display title */
export function txTitle(type: string): string {
  const map: Record<string, string> = {
    deposit: "Deposit",
    withdrawal: "Withdraw",
    game_in: "Game moved in",
    game_out: "Game moved out",
  };
  return map[type] ?? type;
}

/** Map a transaction type to the appropriate amount color */
export function txAmountColor(type: string): string {
  return type === "deposit" || type === "game_out" ? "#17B15E" : "#D23838";
}
