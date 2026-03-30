import { API_BASE_URL, API_DEBUG } from "./config";
import { getToken } from "@/services/auth-storage";

const USDT_DEPOSIT_BASE = `${API_BASE_URL}/api/v1/usdt/deposits`;

export type UsdtNetwork = "TRC20" | "ERC20" | "BEP20";

export type InitiateUsdtDepositResponse = {
  success: boolean;
  message?: string;
  data?: {
    depositId: string;
    merchantOrderNo: string;
    orderId: string;
    amount: number;
    currency: string;
    network: UsdtNetwork;
    address: string;
    qrCode: string | null;
    expireTime: string | null;
    status: string;
  };
};

export type UsdtDepositStatusResponse = {
  success: boolean;
  message?: string;
  data?: {
    depositId: string;
    merchantOrderNo: string;
    orderId: string;
    amount: number;
    currency: string;
    network: UsdtNetwork;
    address: string;
    fee: number;
    proof: string | null;
    status: "pending" | "completed" | "failed";
    expireTime: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

async function authHeaders() {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function initiateUsdtDeposit(
  amount: number,
  network: UsdtNetwork
): Promise<InitiateUsdtDepositResponse> {
  const url = `${USDT_DEPOSIT_BASE}/initiate`;

  if (API_DEBUG) {
    console.log("[API] initiateUsdtDeposit POST:", url, { amount, network });
  }

  const token = await getToken();
  if (!token) return { success: false, message: "Not logged in" };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ amount, network }),
    });
    const json: InitiateUsdtDepositResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] initiateUsdtDeposit response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] initiateUsdtDeposit error:", err);
    return { success: false, message: "Network error. Please check your connection." };
  }
}

export async function getUsdtDepositStatus(
  merchantOrderNo: string
): Promise<UsdtDepositStatusResponse> {
  const url = `${USDT_DEPOSIT_BASE}/status/${merchantOrderNo}`;

  if (API_DEBUG) {
    console.log("[API] getUsdtDepositStatus GET:", url);
  }

  try {
    const res = await fetch(url, { headers: await authHeaders() });
    const json: UsdtDepositStatusResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] getUsdtDepositStatus response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] getUsdtDepositStatus error:", err);
    return { success: false, message: "Network error." };
  }
}
