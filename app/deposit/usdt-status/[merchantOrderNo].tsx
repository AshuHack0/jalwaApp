import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useUsdtDepositStatus } from "@/services/api/hooks/useDeposit";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UsdtDepositStatusScreen() {
  const { merchantOrderNo } = useLocalSearchParams<{ merchantOrderNo: string }>();
  const router = useRouter();
  const { refreshWallet } = useAuth();

  const { data, isLoading } = useUsdtDepositStatus(merchantOrderNo ?? null);

  useEffect(() => {
    if (data?.status === "completed") {
      refreshWallet();
    }
  }, [data?.status]);

  const isCompleted = data?.status === "completed";
  const isFailed = data?.status === "failed";
  const isPending = !data || data.status === "pending";

  function copyToClipboard(text: string, label: string) {
    Clipboard.setString(text);
    Alert.alert("Copied", `${label} copied to clipboard.`);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.screenTitle}>USDT Deposit</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color="#7AFEC3" size="large" />
              <ThemedText style={styles.loadingText}>Loading...</ThemedText>
            </View>
          ) : (
            <>
              {/* Status Icon */}
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
                {isCompleted ? "Payment Confirmed" : isFailed ? "Payment Failed" : "Awaiting Payment"}
              </ThemedText>

              <ThemedText style={styles.statusDesc}>
                {isCompleted
                  ? "USDT received. Your wallet has been credited."
                  : isFailed
                  ? "This deposit could not be processed."
                  : "Send the exact USDT amount to the address below. This page updates automatically."}
              </ThemedText>

              {/* Wallet Address Card — shown while pending */}
              {isPending && data?.address && (
                <View style={styles.card}>
                  <View style={styles.networkRow}>
                    <View style={styles.networkBadge}>
                      <ThemedText style={styles.networkBadgeText}>{data.network}</ThemedText>
                    </View>
                    <ThemedText style={styles.networkHint}>
                      Only send USDT on {data.network} network
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.fieldLabel}>Send exactly</ThemedText>
                  <View style={styles.copyRow}>
                    <ThemedText style={styles.amountValue}>{data.amount} USDT</ThemedText>
                  </View>

                  <ThemedText style={styles.fieldLabel}>To address</ThemedText>
                  <TouchableOpacity
                    style={styles.copyRow}
                    onPress={() => copyToClipboard(data.address, "Address")}
                  >
                    <ThemedText style={styles.addressValue} numberOfLines={2}>
                      {data.address}
                    </ThemedText>
                    <Ionicons name="copy-outline" size={18} color="#7AFEC3" style={styles.copyIcon} />
                  </TouchableOpacity>

                  {data.expireTime && (
                    <>
                      <ThemedText style={styles.fieldLabel}>Expires at</ThemedText>
                      <ThemedText style={styles.fieldValue}>{data.expireTime}</ThemedText>
                    </>
                  )}

                  <View style={styles.warningBox}>
                    <Ionicons name="warning-outline" size={16} color="#FFD700" />
                    <ThemedText style={styles.warningText}>
                      Send the exact amount shown. Wrong amount or network will result in lost funds.
                    </ThemedText>
                  </View>
                </View>
              )}

              {/* Order Detail Card */}
              {data && (
                <View style={styles.card}>
                  {data.proof && (
                    <View style={styles.row}>
                      <ThemedText style={styles.rowLabel}>TxHash</ThemedText>
                      <TouchableOpacity onPress={() => copyToClipboard(data.proof!, "TxHash")}>
                        <ThemedText style={[styles.rowValue, { color: "#7AFEC3", fontSize: 11 }]} numberOfLines={1}>
                          {data.proof.slice(0, 20)}…
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                  {data.fee > 0 && (
                    <View style={styles.row}>
                      <ThemedText style={styles.rowLabel}>Fee</ThemedText>
                      <ThemedText style={styles.rowValue}>{data.fee} USDT</ThemedText>
                    </View>
                  )}
                  <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>Order No</ThemedText>
                    <ThemedText style={[styles.rowValue, { fontSize: 11, color: "#7AFEC3" }]} numberOfLines={1}>
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
        </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 100, paddingHorizontal: 24, paddingBottom: 60, alignItems: "center" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, marginTop: 80 },
  loadingText: { fontSize: 16, color: "#92A8E3" },
  iconWrapper: { marginBottom: 24 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#011341",
  },
  statusLabel: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10, textAlign: "center" },
  statusDesc: { fontSize: 14, color: "#92A8E3", textAlign: "center", lineHeight: 22, marginBottom: 24, paddingHorizontal: 8 },
  card: {
    width: "100%", backgroundColor: "#011341",
    borderRadius: 16, padding: 20, gap: 12, marginBottom: 16,
  },
  networkRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  networkBadge: {
    backgroundColor: "#1a3a6e", borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  networkBadgeText: { fontSize: 13, fontWeight: "700", color: "#7AFEC3" },
  networkHint: { fontSize: 12, color: "#92A8E3", flex: 1 },
  fieldLabel: { fontSize: 12, color: "#92A8E3", marginBottom: 2 },
  fieldValue: { fontSize: 14, color: "#fff", fontWeight: "600" },
  amountValue: { fontSize: 22, fontWeight: "bold", color: "#7AFEC3" },
  copyRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0d2150", borderRadius: 10,
    padding: 12, gap: 8,
  },
  addressValue: { flex: 1, fontSize: 13, color: "#fff", fontWeight: "500", lineHeight: 20 },
  copyIcon: { flexShrink: 0 },
  warningBox: {
    flexDirection: "row", gap: 8, alignItems: "flex-start",
    backgroundColor: "#1a1a00", borderRadius: 10, padding: 12, marginTop: 4,
  },
  warningText: { flex: 1, fontSize: 12, color: "#FFD700", lineHeight: 18 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { fontSize: 14, color: "#92A8E3" },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#fff", maxWidth: "60%", textAlign: "right" },
  actions: { width: "100%", gap: 12, marginTop: 8 },
  primaryBtn: {
    backgroundColor: "#011341", borderRadius: 12,
    paddingVertical: 16, alignItems: "center",
    borderWidth: 2, borderColor: "#7AFEC3",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "bold", color: "#7AFEC3" },
  secondaryBtn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  secondaryBtnText: { fontSize: 14, color: "#92A8E3" },
});
