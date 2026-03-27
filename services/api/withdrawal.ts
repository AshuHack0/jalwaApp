import { API_BASE_URL } from "./config";
import { getToken } from "@/services/auth-storage";

const WITHDRAWAL_BASE = `${API_BASE_URL}/api/v1/withdrawals`;

export type WithdrawalRecord = {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  orderId: string;
  paymentRef: string | null;
  remark: string;
  createdAt: string;
  updatedAt: string;
};

export type InitiateWithdrawalResponse = {
  success: boolean;
  message?: string;
  data?: {
    withdrawalId: string;
    merchantOrderNo: string;
    gatewayOrderNo: string;
    amount: number;
    fee: number;
    status: string;
  };
};

export type MyWithdrawalsResponse = {
  success: boolean;
  message?: string;
  data?: {
    withdrawals: WithdrawalRecord[];
    total: number;
    page: number;
    pages: number;
  };
};

async function authFetch<T>(
  method: "GET" | "POST",
  url: string,
  body?: object
): Promise<T> {
  const token = await getToken();
  if (!token) return { success: false, message: "Not authenticated." } as T;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json() as Promise<T>;
}

export async function initiateWithdrawal(
  amount: number
): Promise<InitiateWithdrawalResponse> {
  return authFetch<InitiateWithdrawalResponse>(
    "POST",
    `${WITHDRAWAL_BASE}/initiate`,
    { amount }
  );
}

export async function getMyWithdrawals(
  page = 1,
  limit = 20
): Promise<MyWithdrawalsResponse> {
  const token = await getToken();
  if (!token) return { success: false, message: "Not authenticated." };

  const res = await fetch(
    `${WITHDRAWAL_BASE}/my?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.json();
}
