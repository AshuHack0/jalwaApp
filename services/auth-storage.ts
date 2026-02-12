import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@jalwa_auth_token";

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export async function removeToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }
}
