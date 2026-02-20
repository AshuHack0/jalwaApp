import { API_BASE_URL, API_DEBUG } from "./config";
import { getToken } from "@/services/auth-storage";

const AUTH_BASE = `${API_BASE_URL}/api/v1/auth`;

export type AuthUser = {
  id: string;
  phone: string;
  nickname: string;
  role: string;
  lastLogin?: number;
  walletBalance?: number;
  [key: string]: unknown;
};

export type AuthResponse = {
  success: boolean;
  token?: string;
  data?: AuthUser;
  message?: string;
};

async function authFetch(
  path: string,
  body: Record<string, string>
): Promise<AuthResponse> {
  const url = `${AUTH_BASE}${path}`;

  if (API_DEBUG) {
    console.log("[API] Auth POST:", url, body);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json: AuthResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] Auth response:", { status: res.status, ...json });
    }

    return json;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] Auth error:", err);
    }
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
}

/**
 * Login with phone and password.
 * Backend currently supports phone only (no email).
 */
export async function login(
  phone: string,
  password: string
): Promise<AuthResponse> {
  return authFetch("/login", { phone, password });
}

/**
 * Register with phone, password and invite code.
 */
export async function register(
  phone: string,
  password: string,
  inviteCode: string
): Promise<AuthResponse> {
  return authFetch("/register", { phone, password, inviteCode });
}

export type GetMeResponse = {
  success: boolean;
  data?: AuthUser;
  message?: string;
};

/**
 * Fetch current user (requires valid token).
 * Returns null if unauthorized or network error.
 */
export async function getMe(): Promise<AuthUser | null> {
  const token = await getToken();
  if (!token) return null;

  const url = `${AUTH_BASE}/me`;

  if (API_DEBUG) {
    console.log("[API] getMe GET:", url);
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json: GetMeResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] getMe response:", { status: res.status, ...json });
    }

    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] getMe error:", err);
    }
    return null;
  }
}

export type WalletResponse = {
  success: boolean;
  data?: { balance: number };
  message?: string;
};

/**
 * Fetch wallet balance (requires valid token).
 * Returns balance or null on error.
 */
export async function getWalletBalance(): Promise<number | null> {
  const token = await getToken();
  if (!token) return null;

  const url = `${AUTH_BASE}/wallet`;

  if (API_DEBUG) {
    console.log("[API] getWalletBalance GET:", url);
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json: WalletResponse = await res.json();

    if (API_DEBUG) {
      console.log("[API] getWalletBalance response:", { status: res.status, ...json });
    }

    if (json.success && json.data != null) {
      return json.data.balance ?? 0;
    }
    return null;
  } catch (err) {
    if (API_DEBUG) {
      console.warn("[API] getWalletBalance error:", err);
    }
    return null;
  }
}
