import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { DepositRecord } from "@/services/api/deposit";
import { useMyDeposits } from "@/services/api/hooks/useDeposit";
import { useAuth } from "@/contexts/AuthContext";
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_600SemiBold,
  Inter_600SemiBold_Italic,
  Inter_700Bold_Italic,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { getToken } from "@/services/auth-storage";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
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

function gatewayLabel(gateway: DepositRecord["gateway"]) {
  if (gateway === "usdt") return "USDT";
  if (gateway === "mcgindiamc") return "ArUpi Pay";
  if (gateway === "oxoxmg") return "Innate UPI-QR";
  return gateway;
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
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [loaded] = useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  });
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_700Bold,
  });
  const [interLoaded] = useInter({
    Inter_Regular: Inter_400Regular,
    Inter_Regular_Italic: Inter_400Regular_Italic,
    Inter_SemiBold: Inter_600SemiBold,
    Inter_SemiBold_Italic: Inter_600SemiBold_Italic,
    Inter_Bold_Italic: Inter_700Bold_Italic,
  });
  const { data, isLoading, refetch, isRefetching } = useMyDeposits();
  const { user } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState<string>(filter || "All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusOptions = ["All", "Completed", "Pending", "Failed"];
  const [selectedDate, setSelectedDate] = useState<string>("Choose a date");

  const allDeposits = data?.deposits ?? [];

  const paymentMethods = [
    {
      id: "All",
      label: "All",
      icon: "grid",
      image: require("@/assets/all1.png"),
      image2: require("@/assets/all2.png"),
      gateways: [] as string[],
    },
    {
      id: "ArUpi Pay",
      label: "ArUpi Pay",
      icon: "qr-code",
      image: require("@/assets/dh3.png"),
      gateways: ["mcgindiamc"],
    },
    {
      id: "Innate UPI-QR",
      label: "Innate UPI-QR",
      icon: "qr-code-outline",
      image: require("@/assets/dh2.png"),
      gateways: ["oxoxmg"],
    },
    {
      id: "Paytm",
      label: "Paytm",
      icon: "wallet",
      image: require("@/assets/dh1.png"),
      gateways: ["paytm"],
    },
    {
      id: "Expert UPI-QR",
      label: "Expert UPI-QR",
      icon: "qr-code-outline",
      image: require("@/assets/dh2.png"),
      gateways: ["expert"],
    },
    {
      id: "USDT",
      label: "USDT",
      icon: "qr-code-outline",
      image: require("@/assets/payNameIcon_20250317165636a3yk.png"),
      gateways: ["usdt"],
    },
    {
      id: "AR Pay",
      label: "AR Pay",
      icon: "qr-code-outline",
      image: require("@/assets/payNameIcon2_20250317165730f7ml.png"),
      gateways: ["arpay"],
    },
  ];

  // Dynamic filtering based on selected tab and status
  const selectedMethod = paymentMethods.find((m) => m.id === selectedFilter);
  const filteredByGateway =
    selectedFilter === "All"
      ? allDeposits
      : allDeposits.filter((d) => selectedMethod?.gateways.includes(d.gateway));

  const deposits =
    selectedStatus === "All"
      ? filteredByGateway
      : filteredByGateway.filter(
        (d) => d.status === selectedStatus.toLowerCase(),
      );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
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
              <Pressable
                key={method.id}
                style={[
                  styles.filterTab,
                  selectedFilter === method.id && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(method.id)}
              >
                {method.image2 === require("@/assets/all2.png") ? (
                  <Image
                    source={
                      selectedFilter === method.id
                        ? method.image
                        : method.image2
                    }
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: "transparent",
                    }}
                    contentFit="cover"
                  />
                ) : (
                  <Image
                    source={method.image}
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: "transparent",
                    }}
                    contentFit="cover"
                  />
                )}
                <ThemedText
                  style={[
                    styles.filterTabText,
                    selectedFilter === method.id && styles.filterTabTextActive,
                  ]}
                >
                  {method.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          {/* Dropdowns */}
          <View style={styles.filterRow}>
            <View style={{ flex: 1 }}>
              <Pressable
                style={styles.filterDropdown}
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <ThemedText style={styles.filterDropdownText}>
                  {selectedStatus}
                </ThemedText>
                <Ionicons
                  name={showStatusDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#92A8E3"
                />
              </Pressable>
              {showStatusDropdown && (
                <View style={styles.dropdownList}>
                  {statusOptions.map((option) => (
                    <Pressable
                      key={option}
                      style={[
                        styles.dropdownItem,
                        selectedStatus === option && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setSelectedStatus(option);
                        setShowStatusDropdown(false);
                      }}
                    >
                      <ThemedText
                        style={[
                          styles.dropdownItemText,
                          selectedStatus === option &&
                          styles.dropdownItemTextActive,
                        ]}
                      >
                        {option}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
            <Pressable style={[styles.filterDropdown, { flex: 1 }]}>
              <ThemedText style={styles.filterDropdownText}>
                {selectedDate}
              </ThemedText>
              <Ionicons name="chevron-down" size={18} color="#92A8E3" />
            </Pressable>
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
                        { color: item.status === "pending" ? "#458DD7" : statusColor(item.status) },
                      ]}
                    >
                      {statusLabel(item.status) === "Pending" ? "To Be Paid" : statusLabel(item.status)}
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
                        {item.gateway === "usdt"
                          ? `USDT ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : `₹${item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </ThemedText>
                    </View>

                    <View style={styles.cardDetailsRow}>
                      <ThemedText style={styles.detailLabel}>Type</ThemedText>
                      <ThemedText style={styles.detailValue}>
                        {gatewayLabel(item.gateway)}
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
                        <Pressable style={styles.copyIconContainer}>
                          <Ionicons
                            name="copy-outline"
                            size={14}
                            color="#92A8E3"
                            style={{ transform: [{ rotate: "90deg" }] }}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>


                  {item.status === "pending" && <View>
                    <Pressable onPress={async () => {
                      const token = await getToken();
                      // Try user object first, then decode from JWT payload
                      let userId = (user as any)?._id || user?.id || "";
                      if (!userId && token) {
                        try {
                          const payload = JSON.parse(atob(token.split(".")[1]));
                          userId = payload.id || payload._id || "";
                        } catch {}
                      }
                      const orderNo = item.merchantOrderNo || item._id;
                      const url = token
                        ? `https://support.indgames.online/deposit-not-receive?token=${token}&userId=${userId}&orderNumber=${orderNo}`
                        : `https://support.indgames.online/deposit-not-receive?userId=${userId}&orderNumber=${orderNo}`;
                      Linking.openURL(url);
                    }} style={{ width: "97%", height: 40, backgroundColor: "#00E8BD", justifyContent: "center", alignItems: "center", borderRadius: 100, marginBottom: 20, marginHorizontal: 5 }}>
                      <ThemedText style={{ color: "white", fontSize: 16, fontFamily: "BahnschriftRegular" }}>Submit Receipt</ThemedText>
                    </Pressable>
                  </View>}

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
    fontSize: 19.2,
    fontFamily: "BahnschriftRegular",
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
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)", // Default tab background
  },
  filterTabActive: {
    backgroundColor: "#7AFEC3", // Green active tab
  },
  filterTabText: {
    fontSize: 12.8,
    color: "#92A8E3",
    fontFamily: "BahnschriftRegular",
  },
  filterTabTextActive: {
    color: "#000",
    fontFamily: "BahnschriftRegular",
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
    fontFamily: "BahnschriftRegular",
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
    fontFamily: "BahnschriftRegular",
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
    backgroundColor: "#17B15E",
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 6,
  },
  depositBadgeText: {
    color: "#fff",
    fontSize: 14.9,
    fontFamily: "BahnschriftRegular",
    fontWeight: "700"
  },
  statusText: {
    fontSize: 13.8,
    fontFamily: "BahnschriftRegular",
  },
  divider: {
    height: 1.2,
    backgroundColor: "#3C496C",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  detailsContainer: {
    paddingHorizontal: 16
  },
  cardDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 14,
    color: "#8CA1DB",
    fontFamily: "BahnschriftRegular",
    fontWeight: "bold"
  },
  detailValue: {
    fontSize: 14,
    color: "#91A8E2",
    fontFamily: "BahnschriftRegular",
  },
  balanceValue: {
    fontSize: 14,
    color: "#F39C12", // Bright orange
    fontFamily: "BahnschriftRegular",
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
    fontFamily: "BahnschriftRegular",
  },
  dropdownList: {
    backgroundColor: "#011341",
    borderRadius: 8,
    marginTop: 4,
    overflow: "hidden" as const,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemActive: {
    backgroundColor: "rgba(122, 254, 195, 0.15)",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#92A8E3",
    fontFamily: "BahnschriftRegular",
  },
  dropdownItemTextActive: {
    color: "#7AFEC3",
  },
});
