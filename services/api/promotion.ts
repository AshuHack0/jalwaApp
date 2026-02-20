import { API_BASE_URL, API_DEBUG } from "./config";
import { getToken } from "@/services/auth-storage";

const PROMOTION_BASE = `${API_BASE_URL}/api/v1/promotion`;

export type FirstDepositBonusItem = {
  id: number;
  rewardAmount: number;
  rechargeAmount: number;
  order: number;
  state: number;
  createTime: string;
  lastUpdateTime: string;
  canReceive: boolean;
  isFinshed: boolean;
  currentProgress?: number;
};

export type FirstDepositBonusResponse = {
  data: FirstDepositBonusItem[];
  code: number;
  msg: string;
  msgCode: number;
  serviceNowTime: string;
};

export type DepositResponse = {
  success: boolean;
  data?: {
    depositId: string;
    amount: number;
    totalDeposited: number;
    walletBalance: number;
  };
  message?: string;
};

/**
 * Deposit amount for the logged-in user.
 * Creates a Deposit entry and adds amount to wallet balance.
 * Requires valid token.
 */
export async function deposit(amount: number): Promise<DepositResponse> {
  const url = `${PROMOTION_BASE}/deposit`;

  if (API_DEBUG) {
    console.log("[API] deposit POST:", url, { amount });
  }

  const token = await getToken();
  if (!token) {
    return { success: false, message: "Not logged in" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    const json: DepositResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] deposit response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] deposit error:", err);
    }
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
}

/**
 * Fetch first deposit bonus offers (tiered deposit rewards).
 * Sorted by order descending (higher amounts first in display).
 */
export async function getFirstDepositBonus(): Promise<FirstDepositBonusResponse | null> {
  const url = `${PROMOTION_BASE}/first-deposit-bonus`;

  if (API_DEBUG) {
    console.log("[API] getFirstDepositBonus GET:", url);
  }

  try {
    const token = await getToken();
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json: FirstDepositBonusResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] getFirstDepositBonus response:", { status: res.status, ...json });
    }

    if (json.code === 0 && Array.isArray(json.data)) {
      return json;
    }
    return null;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] getFirstDepositBonus error:", err);
    }
    return null;
  }
}

export type ClaimFirstDepositBonusResponse = {
  code: number;
  msg: string;
  data?: { rewardAmount: number };
  serviceNowTime: string;
};

/**
 * Claim a first deposit bonus tier. User must have deposited >= rechargeAmount
 * and must not have already claimed this tier.
 */
export async function claimFirstDepositBonus(
  offerId: number
): Promise<ClaimFirstDepositBonusResponse> {
  const url = `${PROMOTION_BASE}/claim-first-deposit-bonus`;

  const token = await getToken();
  if (!token) {
    return { code: -1, msg: "Not logged in", serviceNowTime: new Date().toISOString() };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ offerId }),
    });
    const json: ClaimFirstDepositBonusResponse = await res.json();
    if (API_DEBUG) {
      console.log("[API] claimFirstDepositBonus response:", { status: res.status, ...json });
    }
    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] claimFirstDepositBonus error:", err);
    return {
      code: -1,
      msg: "Network error",
      serviceNowTime: new Date().toISOString(),
    };
  }
}
