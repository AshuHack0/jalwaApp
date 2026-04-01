import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { DepositRecord } from "@/services/api/deposit";
import { useMyDeposits } from "@/services/api/hooks/useDeposit";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function statusColor(status: DepositRecord["status"]) {
  if (status === "completed") return "#17B15E"; // Bright Green from image
  if (status === "failed") return "#FF4D4D";
  return "#FFD700";
}

function statusLabel(status: DepositRecord["status"]) {
  if (status === "completed") return "Complete";
  if (status === "failed") return "Failed";
  return "Pending";
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default function DepositHistoryScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useMyDeposits();

  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("Choose a date");

  const deposits = data?.deposits ?? [];

  const paymentMethods = [
    {
      id: "All",
      label: "All",
      icon: "grid",
      image: require("@/assets/dh1.png"),
    },
    {
      id: "ArUpi Pay",
      label: "ArUpi Pay",
      icon: "qr-code",
      image: require("@/assets/dh3.png"),
    },
    {
      id: "Innate UPI-QR",
      label: "Innate UPI-QR",
      icon: "qr-code-outline",
      image: require("@/assets/dh2.png"),
    },
    {
      id: "Paytm",
      label: "Paytm",
      icon: "wallet",
      image: require("@/assets/dh1.png"),
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
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
          {/* Filter Tabs - Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabsContainer}
            contentContainerStyle={styles.filterTabsContent}
          >
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.filterTab,
                  selectedFilter === method.id && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(method.id)}
              >
                <Image
                  source={method.image}
                  style={{
                    width: 22,
                    height: 22,
                    backgroundColor: "transparent",
                  }}
                  contentFit="cover"
                />
                <ThemedText
                  style={[
                    styles.filterTabText,
                    selectedFilter === method.id && styles.filterTabTextActive,
                  ]}
                >
                  {method.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Dropdowns */}
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterDropdown}>
              <ThemedText style={styles.filterDropdownText}>
                {selectedStatus}
              </ThemedText>
              <Ionicons name="chevron-down" size={18} color="#92A8E3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterDropdown}>
              <ThemedText style={styles.filterDropdownText}>
                {selectedDate}
              </ThemedText>
              <Ionicons name="chevron-down" size={18} color="#92A8E3" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color="#7AFEC3" size="large" />
            </View>
          ) : deposits.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Ionicons
                name="document-text-outline"
                size={64}
                color="#1F4293"
              />
              <ThemedText style={styles.noDataText}>No deposits yet</ThemedText>
            </View>
          ) : (
            <View style={styles.list}>
              {deposits.map((item) => (
                <View key={item._id} style={styles.card}>
                  {/* Header */}
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

                  {/* Divider */}
                  <View style={styles.divider} />

                  {/* Details */}
                  <View style={styles.detailsContainer}>
                    <View style={styles.cardDetailsRow}>
                      <ThemedText style={styles.detailLabel}>
                        Balance
                      </ThemedText>
                      <ThemedText style={styles.balanceValue}>
                        ₹
                        {item.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </ThemedText>
                    </View>

                    {item.fee > 0 && (
                      <View style={styles.cardDetailsRow}>
                        <ThemedText style={styles.detailLabel}>Fee</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          ₹{item.fee}
                        </ThemedText>
                      </View>
                    )}

                    <View style={styles.cardDetailsRow}>
                      <ThemedText style={styles.detailLabel}>Type</ThemedText>
                      <ThemedText style={styles.detailValue}>
                        UPay13USDT
                      </ThemedText>
                    </View>

                    <View style={styles.cardDetailsRow}>
                      <ThemedText style={styles.detailLabel}>Time</ThemedText>
                      <View style={styles.timeValueContainer}>
                        <ThemedText style={styles.detailValue}>
                          {formatDate(item.createdAt)}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.cardDetailsRow}>
                      <ThemedText style={styles.detailLabel}>
                        Order number
                      </ThemedText>
                      <View style={styles.orderNumberContainer}>
                        <ThemedText
                          style={styles.detailValue}
                          numberOfLines={1}
                        >
                          {item.merchantOrderNo || item._id}
                        </ThemedText>
                        <TouchableOpacity style={styles.copyIconContainer}>
                          <Ionicons
                            name="copy-outline"
                            size={14}
                            color="#92A8E3"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <View style={styles.footerContainer}>
                <ThemedText style={styles.footerText}>No more</ThemedText>
              </View>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B", // Matches overall app background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 100, // Adjusted for top bar height
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
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#05012B",
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
  filterTabsContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  filterTabsContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#011341", // Default tab background
  },
  filterTabActive: {
    backgroundColor: "#7AFEC3", // Green active tab
  },
  filterTabText: {
    fontSize: 14,
    color: "#92A8E3",
    fontWeight: "600",
  },
  filterTabTextActive: {
    color: "#000",
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  filterDropdown: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#011341",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  filterDropdownText: {
    fontSize: 14,
    color: "#92A8E3",
    fontWeight: "500",
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
    gap: 16,
  },
  card: {
    backgroundColor: "#011341",
    borderRadius: 8,
    padding: 0,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  depositBadge: {
    backgroundColor: "#31C268", // Deposit badge green
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  depositBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#2E3A59",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 14,
    color: "#92A8E3",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  balanceValue: {
    fontSize: 14,
    color: "#F39C12", // Bright orange
    fontWeight: "bold",
  },
  timeValueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  orderNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  copyIconContainer: {
    padding: 2,
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
});
