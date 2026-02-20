import { Platform } from "react-native";

/** Set to true to log all API requests/responses (full response body) in console */
export const API_DEBUG = __DEV__;

/**
 * Environment: "local" | "staging" | "production"
 * Change this to switch API targets for debugging.
 */
export const API_ENV = "production" as const;

const BASE_URLS = {
  // local:
  //   Platform.OS === "android"
  //     ? "http://192.168.29.131:3000"
  //     : "http://192.168.29.131:3000",
  local:
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://10.0.2.2:3000",
  staging: "http://185.219.83.167:3000",
  production: "http://185.219.83.167:3000",
} as const;

export const API_BASE_URL = BASE_URLS[API_ENV];
