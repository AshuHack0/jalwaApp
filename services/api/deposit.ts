import { API_BASE_URL, API_DEBUG } from "./config";
import { getToken } from "@/services/auth-storage";

const DEPOSIT_BASE = `${API_BASE_URL}/api/v1/deposits`;

// ─── Types ───────────────────────────────────────────────────────────────────

export type InitiateDepositResponse = {
  success: boolean;
  message?: string;
  data?: {
    depositId: string;
    merchantOrderNo: string;
    gatewayOrderNo: string;
    amount: number;
    fee: number;
    payUrl: string;
    expireTime: number;
    status: string;
  };
};

export type DepositRecord = {
  _id: string;
  amount: number;
  fee: number;
  status: "pending" | "completed" | "failed";
  gateway: "mcgindiamc" | "oxoxmg" | "usdt";
  merchantOrderNo: string | null;
  gatewayOrderNo: string | null;
  payUrl: string | null;
  proof: string | null;
  isGatewayPayment: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MyDepositsResponse = {
  success: boolean;
  message?: string;
  data?: {
    deposits: DepositRecord[];
    total: number;
    page: number;
    pages: number;
  };
};

export type DepositStatusResponse = {
  success: boolean;
  message?: string;
  data?: {
    depositId: string;
    merchantOrderNo: string;
    gatewayOrderNo: string;
    amount: number;
    fee: number;
    status: "pending" | "completed" | "failed";
    proof: string | null;
    payUrl: string | null;
    expireTime: number;
    createdAt: string;
    updatedAt: string;
  };
};

// ─── API calls ────────────────────────────────────────────────────────────────

async function authHeaders() {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Initiate a real-money deposit via the payment gateway.
 * Returns a payUrl to open in browser.
 */
export async function initiateDeposit(amount: number): Promise<InitiateDepositResponse> {
  const url = `${DEPOSIT_BASE}/initiate`;

  if (API_DEBUG) {
    console.log("[API] initiateDeposit POST:", url, { amount });
  }

  const token = await getToken();
  if (!token) {
    return { success: false, message: "Not logged in" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ amount }),
    });
    const json: InitiateDepositResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] initiateDeposit response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] initiateDeposit error:", err);
    return { success: false, message: "Network error. Please check your connection." };
  }
}

/**
 * Fetch the status of a specific deposit order.
 */
export async function getDepositStatus(merchantOrderNo: string): Promise<DepositStatusResponse> {
  const url = `${DEPOSIT_BASE}/status/${merchantOrderNo}`;

  if (API_DEBUG) {
    console.log("[API] getDepositStatus GET:", url);
  }

  try {
    const res = await fetch(url, { headers: await authHeaders() });
    const json: DepositStatusResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] getDepositStatus response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] getDepositStatus error:", err);
    return { success: false, message: "Network error." };
  }
}

/**
 * Fetch the authenticated user's deposit history.
 */
export async function getMyDeposits(page = 1): Promise<MyDepositsResponse> {
  const url = `${DEPOSIT_BASE}/my?page=${page}&limit=20`;

  if (API_DEBUG) {
    console.log("[API] getMyDeposits GET:", url);
  }

  try {
    const res = await fetch(url, { headers: await authHeaders() });
    const json: MyDepositsResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] getMyDeposits response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] getMyDeposits error:", err);
    return { success: false, message: "Network error." };
  }
}
