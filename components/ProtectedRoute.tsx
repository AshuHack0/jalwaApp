import { useAuth } from "@/contexts/AuthContext";
import { useSegments, useRouter } from "expo-router";
import { useEffect } from "react";

const PROTECTED_TABS = ["activity", "promotion", "wallet", "account"];

/**
 * Protects non-home tabs. Redirects to login if user tries to access
 * activity, promotion, wallet, or account without being authenticated.
 * Home tab is always accessible.
 */
export function ProtectTabs() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const tabSegment = segments.find((s) => typeof s === "string" && s !== "(tabs)");
    const currentTab = tabSegment as string | undefined;

    if (currentTab && PROTECTED_TABS.includes(currentTab) && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [segments, isAuthenticated, isLoading, router]);

  return null;
}
