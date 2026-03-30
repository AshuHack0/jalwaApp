import { API_BASE_URL, API_DEBUG } from "./config";
import { getToken } from "@/services/auth-storage";

const OXOXMG_DEPOSIT_BASE = `${API_BASE_URL}/api/v1/oxoxmg/deposits`;

export type InitiateOxoxmgDepositResponse = {
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

export type OxoxmgDepositStatusResponse = {
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

async function authHeaders() {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function initiateOxoxmgDeposit(
  amount: number
): Promise<InitiateOxoxmgDepositResponse> {
  const url = `${OXOXMG_DEPOSIT_BASE}/initiate`;

  if (API_DEBUG) {
    console.log("[API] initiateOxoxmgDeposit POST:", url, { amount });
  }

  const token = await getToken();
  if (!token) return { success: false, message: "Not logged in" };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ amount }),
    });
    const json: InitiateOxoxmgDepositResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] initiateOxoxmgDeposit response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] initiateOxoxmgDeposit error:", err);
    return { success: false, message: "Network error. Please check your connection." };
  }
}

export async function getOxoxmgDepositStatus(
  merchantOrderNo: string
): Promise<OxoxmgDepositStatusResponse> {
  const url = `${OXOXMG_DEPOSIT_BASE}/status/${merchantOrderNo}`;

  if (API_DEBUG) {
    console.log("[API] getOxoxmgDepositStatus GET:", url);
  }

  try {
    const res = await fetch(url, { headers: await authHeaders() });
    const json: OxoxmgDepositStatusResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] getOxoxmgDepositStatus response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) console.warn("[API] getOxoxmgDepositStatus error:", err);
    return { success: false, message: "Network error." };
  }
}
