import { Platform } from "react-native";

/** Set to true to log API requests/responses in dev */
export const API_DEBUG = __DEV__;

/**
 * Environment: "local" | "staging" | "production"
 * Change this to switch API targets for debugging.
 */
export const API_ENV = "local" as const;

const BASE_URLS = {
  // local:
  //   Platform.OS === "android"
  //     ? "http://192.168.29.131:3000"
  //     : "http://192.168.29.131:3000",
  local:
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://10.0.2.2:3000",
  staging: "https://jalwabackend.vercel.app",
  production: "https://jalwabackend.vercel.app",
} as const;

export const API_BASE_URL = BASE_URLS[API_ENV];
