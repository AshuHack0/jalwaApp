import { ThemedText } from "@/components/themed-text";
import { useMyDeposits } from "@/services/api/hooks/useDeposit";
import type { DepositRecord } from "@/services/api/deposit";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, View, Pressable } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

function statusColor(status: DepositRecord["status"]) {
  if (status === "completed") return "#17B15E";
  if (status === "failed") return "#FF4D4D";
  return "#FFD700";
}

function statusLabel(status: DepositRecord["status"]) {
  if (status === "completed") return "Complete";
  if (status === "failed") return "Failed";
  return "Pending";
}

function gatewayLabel(gateway: DepositRecord["gateway"]) {
  if (gateway === "usdt") return "USDT";
  if (gateway === "mcgindiamc") return "ArUpi Pay";
  if (gateway === "oxoxmg") return "Innate UPI-QR";
  return gateway;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export function DepositHistoryPreview({
  gateway,
}: { gateway?: string } = {}) {
  const { data, isLoading } = useMyDeposits();
  const router = useRouter();
  const allDeposits = data?.deposits ?? [];

  // Filter by gateway if provided
  const deposits = gateway
    ? allDeposits.filter((d) => d.gateway === gateway)
    : allDeposits;

  // Show only the latest 3
  const previewDeposits = deposits.slice(0, 3);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Image
          source={require("@/assets/icon-historyHead.svg")}
          style={{ width: 24, height: 24 }}
        />
        <ThemedText style={styles.sectionTitle}>Deposit history</ThemedText>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#7AFEC3" size="small" />
        </View>
      ) : previewDeposits.length === 0 ? (
        <View style={styles.emptyState}>
          <Svg viewBox="0 0 389 227" width={280} height={140} fill="none">
            <Defs>
              <LinearGradient
                id="paint0_linear_6306_124794"
                x1="185.676"
                y1="129.156"
                x2="185.676"
                y2="227"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="#484852" />
                <Stop offset="0.615" stopColor="#777783" stopOpacity="0.1" />
                <Stop offset="1" stopColor="#DEDEE6" stopOpacity="0" />
              </LinearGradient>
              <LinearGradient
                id="paint3_linear_6306_124794"
                x1="212.361"
                y1="177.425"
                x2="211.673"
                y2="-1.70206e-05"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="#100F15" />
                <Stop offset="0.232" stopColor="#27252F" />
                <Stop offset="0.925" stopColor="#514E5A" />
                <Stop offset="1" stopColor="#33323C" />
              </LinearGradient>
            </Defs>
            <Path
              opacity={0.3}
              d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z"
              fill="url(#paint0_linear_6306_124794)"
            />
            <Path
              d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z"
              fill="url(#paint3_linear_6306_124794)"
            />
          </Svg>
          <ThemedText style={styles.emptyText}>No data</ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          {previewDeposits.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.depositBadge}>
                  <ThemedText style={styles.depositBadgeText}>
                    Deposit
                  </ThemedText>
                </View>
                <ThemedText
                  style={[
                    styles.statusText,
                    { color: statusColor(item.status) },
                  ]}
                >
                  {statusLabel(item.status)}
                </ThemedText>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailsContainer}>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Balance</ThemedText>
                  <ThemedText style={styles.balanceValue}>
                    {item.gateway === "usdt"
                      ? `USDT ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `\u20B9${item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </ThemedText>
                </View>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Type</ThemedText>
                  <ThemedText style={styles.value}>
                    {gatewayLabel(item.gateway)}
                  </ThemedText>
                </View>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Time</ThemedText>
                  <ThemedText style={styles.value}>
                    {formatDate(item.createdAt)}
                  </ThemedText>
                </View>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Order number</ThemedText>
                  <View style={styles.orderContainer}>
                    <ThemedText style={styles.value} numberOfLines={1}>
                      {item.merchantOrderNo || item._id}
                    </ThemedText>
                    <Ionicons name="copy-outline" size={14} color="#92A8E3" />
                  </View>
                </View>
              </View>
            </View>
          ))}

          {deposits.length > 3 && (
            <Pressable
              style={styles.viewAllButton}
              onPress={() =>
                router.push(
                  gateway
                    ? {
                      pathname: "/deposit-history",
                      params: { filter: gateway === "usdt" ? "USDT" : "All" },
                    }
                    : "/deposit-history"
                )
              }
            >
              <ThemedText style={styles.viewAllText}>View all</ThemedText>
              <Ionicons name="chevron-forward" size={16} color="#7AFEC3" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_SemiBold",
    color: "#E3EFFF",
  },
  centered: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 11.8,
    color: "#92A8E3",
    fontFamily: "Inter_Regular",
    marginTop: 8,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#011341",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  depositBadge: {
    backgroundColor: "#17B15E",
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 6,
  },
  depositBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_Regular",
  },
  statusText: {
    fontSize: 13,
    fontFamily: "Inter_Regular",
  },
  divider: {
    height: 1,
    backgroundColor: "#2E3A59",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#92A8E3",
    fontFamily: "Inter_Regular",
  },
  value: {
    fontSize: 13,
    color: "#fff",
    fontFamily: "Inter_Regular",
  },
  balanceValue: {
    fontSize: 13,
    color: "#F39C12",
    fontFamily: "Inter_Regular",
  },
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-end",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 13,
    color: "#7AFEC3",
    fontFamily: "Inter_Regular",
  },
});
