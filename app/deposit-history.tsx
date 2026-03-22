import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMyDeposits } from "@/services/api/hooks/useDeposit";
import type { DepositRecord } from "@/services/api/deposit";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

function statusColor(status: DepositRecord["status"]) {
  if (status === "completed") return "#7AFEC3";
  if (status === "failed") return "#FF4D4D";
  return "#FFD700";
}

function statusLabel(status: DepositRecord["status"]) {
  if (status === "completed") return "Success";
  if (status === "failed") return "Failed";
  return "Pending";
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

export default function DepositHistoryScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useMyDeposits();

  const deposits = data?.deposits ?? [];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.screenTitle}>Deposit history</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#7AFEC3"
          />
        }
      >
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#7AFEC3" size="large" />
          </View>
        ) : deposits.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="document-text-outline" size={64} color="#1F4293" />
            <ThemedText style={styles.noDataText}>No deposits yet</ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {deposits.map((item) => (
              <View key={item._id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.cardLeft}>
                    <ThemedText style={styles.amount}>₹{item.amount.toLocaleString("en-IN")}</ThemedText>
                    {item.fee > 0 && (
                      <ThemedText style={styles.fee}>Fee: ₹{item.fee}</ThemedText>
                    )}
                    <ThemedText style={styles.date}>{formatDate(item.createdAt)}</ThemedText>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[styles.statusBadge, { borderColor: statusColor(item.status) }]}>
                      <ThemedText style={[styles.statusText, { color: statusColor(item.status) }]}>
                        {statusLabel(item.status)}
                      </ThemedText>
                    </View>
                    {item.proof && (
                      <ThemedText style={styles.proof} numberOfLines={1}>
                        UTR: {item.proof}
                      </ThemedText>
                    )}
                  </View>
                </View>
                {item.merchantOrderNo && (
                  <ThemedText style={styles.orderId} numberOfLines={1}>
                    Order: {item.merchantOrderNo}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1117",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 90,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 12,
    backgroundColor: "#0f1117",
  },
  backButton: {
    padding: 4,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 32,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 16,
  },
  noDataText: {
    fontSize: 18,
    color: "#7AFEC3",
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLeft: {
    gap: 4,
    flex: 1,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  fee: {
    fontSize: 12,
    color: "#94a3b8",
  },
  date: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  proof: {
    fontSize: 11,
    color: "#94a3b8",
    maxWidth: 140,
  },
  orderId: {
    fontSize: 11,
    color: "#4A5A7A",
  },
});
