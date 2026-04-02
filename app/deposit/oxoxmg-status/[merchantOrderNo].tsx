import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useOxoxmgDepositStatus } from "@/services/api/hooks/useDeposit";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";

function formatAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OxoxmgDepositStatusScreen() {
  const { merchantOrderNo } = useLocalSearchParams<{ merchantOrderNo: string }>();
  const router = useRouter();
  const { refreshWallet } = useAuth();

  const { data, isLoading } = useOxoxmgDepositStatus(merchantOrderNo ?? null);

  useEffect(() => {
    if (data?.status === "completed") {
      refreshWallet();
    }
  }, [data?.status]);

  const isCompleted = data?.status === "completed";
  const isFailed = data?.status === "failed";
  const isPending = !data || data.status === "pending";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.screenTitle}>Payment Status</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.body}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color="#7AFEC3" size="large" />
              <ThemedText style={styles.loadingText}>Loading status...</ThemedText>
            </View>
          ) : (
            <>
              <View style={styles.iconWrapper}>
                {isPending && (
                  <View style={[styles.iconCircle, { borderColor: "#FFD700" }]}>
                    <ActivityIndicator color="#FFD700" size="large" />
                  </View>
                )}
                {isCompleted && (
                  <LinearGradient colors={["#7AFEC3", "#02AFB6"]} style={styles.iconCircle}>
                    <Ionicons name="checkmark" size={52} color="#05012B" />
                  </LinearGradient>
                )}
                {isFailed && (
                  <View style={[styles.iconCircle, { borderColor: "#FF4D4D", borderWidth: 2 }]}>
                    <Ionicons name="close" size={52} color="#FF4D4D" />
                  </View>
                )}
              </View>

              <ThemedText
                style={[
                  styles.statusLabel,
                  isCompleted && { color: "#7AFEC3" },
                  isFailed && { color: "#FF4D4D" },
                  isPending && { color: "#FFD700" },
                ]}
              >
                {isCompleted ? "Payment Successful" : isFailed ? "Payment Failed" : "Processing..."}
              </ThemedText>

              <ThemedText style={styles.statusDesc}>
                {isCompleted
                  ? "Your wallet has been credited."
                  : isFailed
                  ? "This payment could not be processed."
                  : "Your payment is being verified. This page updates automatically."}
              </ThemedText>

              {data && (
                <View style={styles.card}>
                  <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Amount</ThemedText>
                    <ThemedText style={styles.rowValue}>{formatAmount(data.amount)}</ThemedText>
                  </View>
                  {data.fee > 0 && (
                    <View style={styles.row}>
                      <ThemedText style={styles.rowLabel}>Fee</ThemedText>
                      <ThemedText style={styles.rowValue}>₹{data.fee}</ThemedText>
                    </View>
                  )}
                  {data.proof && (
                    <View style={styles.row}>
                      <ThemedText style={styles.rowLabel}>UTR</ThemedText>
                      <ThemedText style={styles.rowValue}>{data.proof}</ThemedText>
                    </View>
                  )}
                  <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Order No</ThemedText>
                    <ThemedText style={[styles.rowValue, styles.orderNo]} numberOfLines={1}>
                      {data.merchantOrderNo}
                    </ThemedText>
                  </View>
                  <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Time</ThemedText>
                    <ThemedText style={styles.rowValue}>{formatDate(data.createdAt)}</ThemedText>
                  </View>
                </View>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => router.replace("/(tabs)")}
                >
                  <ThemedText style={styles.primaryBtnText}>Go to Home</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => router.replace("/deposit-history")}
                >
                  <ThemedText style={styles.secondaryBtnText}>View Deposit History</ThemedText>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05012B" },
  topBar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#05012B",
  },
  backButton: { padding: 4 },
  screenTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  placeholder: { width: 32 },
  body: { flex: 1, paddingTop: 100, paddingHorizontal: 24, alignItems: "center" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText: { fontSize: 16, color: "#92A8E3" },
  iconWrapper: { marginBottom: 24 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#011341",
  },
  statusLabel: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10, textAlign: "center" },
  statusDesc: { fontSize: 14, color: "#92A8E3", textAlign: "center", lineHeight: 22, marginBottom: 32, paddingHorizontal: 8 },
  card: {
    width: "100%", backgroundColor: "#011341",
    borderRadius: 16, padding: 20, gap: 14, marginBottom: 32,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { fontSize: 14, color: "#92A8E3" },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#fff", maxWidth: "60%", textAlign: "right" },
  orderNo: { fontSize: 12, color: "#7AFEC3" },
  actions: { width: "100%", gap: 12 },
  primaryBtn: {
    backgroundColor: "#011341", borderRadius: 12,
    paddingVertical: 16, alignItems: "center",
    borderWidth: 2, borderColor: "#7AFEC3",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "bold", color: "#7AFEC3" },
  secondaryBtn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  secondaryBtnText: { fontSize: 14, color: "#92A8E3" },
});
