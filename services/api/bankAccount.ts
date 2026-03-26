import { API_BASE_URL, API_DEBUG } from "./config";
import { getToken } from "@/services/auth-storage";

const BANK_BASE = `${API_BASE_URL}/api/v1/bank-account`;

export type BankAccount = {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankPhone: string;
  bankEmail: string;
};

export type BankAccountResponse = {
  success: boolean;
  message?: string;
  data?: { bankAccount: BankAccount };
};

async function bankFetch(
  method: "GET" | "POST",
  body?: BankAccount
): Promise<BankAccountResponse> {
  const token = await getToken();
  if (!token) return { success: false, message: "Not authenticated." };

  if (API_DEBUG) {
    console.log("[API] BankAccount", method, BANK_BASE, body);
  }

  try {
    const res = await fetch(BANK_BASE, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json: BankAccountResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] BankAccount response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] BankAccount error:", err);
    }
    return { success: false, message: "Network error. Please check your connection." };
  }
}

export async function getBankAccount(): Promise<BankAccount | null> {
  const res = await bankFetch("GET");
  if (res.success && res.data?.bankAccount) return res.data.bankAccount;
  return null;
}

export async function saveBankAccount(data: BankAccount): Promise<BankAccountResponse> {
  return bankFetch("POST", data);
}
