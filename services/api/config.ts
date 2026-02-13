import { Platform } from "react-native";

/** Set to true to log API requests/responses in dev */
export const API_DEBUG = __DEV__;

/**
 * Environment: "local" | "staging" | "production"
 * Change this to switch API targets for debugging.
 */
export const API_ENV = "local" as const;

const BASE_URLS = {
  local:
    Platform.OS === "android"
      ? "https://jalwabackend.vercel.app"
      : "http://192.168.0.104:3000",
  staging: "https://staging-api.example.com",
  production: "https://api.example.com",
} as const;

export const API_BASE_URL = BASE_URLS[API_ENV];
