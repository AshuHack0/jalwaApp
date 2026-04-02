import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useDepositStatus } from "@/services/api/hooks/useDeposit";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";

export default function DepositStatusRedirect() {
  const { merchantOrderNo } = useLocalSearchParams<{ merchantOrderNo: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshWallet } = useAuth();
  const handled = useRef(false);

  const { data } = useDepositStatus(merchantOrderNo ?? null);

  // Timeout fallback — if still pending after 30s, go home with info toast
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (handled.current) return;
      handled.current = true;
      showToast({
        type: "info",
        title: "Payment Processing",
        message: "Your wallet will be credited once confirmed.",
        duration: 5000,
      });
      router.replace("/(tabs)" as any);
    }, 30000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (handled.current || !data) return;
    if (data.status === "completed") {
      handled.current = true;
      refreshWallet();
      showToast({ type: "success", title: "Payment Successful", message: "Your wallet has been credited." });
      router.replace("/(tabs)" as any);
    } else if (data.status === "failed") {
      handled.current = true;
      showToast({ type: "error", title: "Payment Failed", message: "This payment could not be processed." });
      router.replace("/(tabs)" as any);
    }
    // pending → do nothing, hook keeps polling every 5s
  }, [data?.status]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: "#05012B" }} />
    </>
  );
}
