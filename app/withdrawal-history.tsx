import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMyWithdrawals } from "@/services/api/hooks/useWithdrawal";
import type { WithdrawalRecord } from "@/services/api/withdrawal";
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
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import * as Clipboard from "expo-clipboard";

function statusColor(status: WithdrawalRecord["status"]) {
  if (status === "approved") return "#17B15E";
  if (status === "rejected") return "#FF4D4D";
  return "#5E84FF";
}

function statusLabel(status: WithdrawalRecord["status"]) {
  if (status === "approved") return "Completed";
  if (status === "rejected") return "Rejected";
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

export default function WithdrawalHistoryScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusOptions = ["All", "Pending", "Approved", "Rejected"];
  const [selectedDate, setSelectedDate] = useState<string>("Choose a date");
  const { data, isLoading, refetch, isRefetching } = useMyWithdrawals();

  const allWithdrawals = data?.withdrawals ?? [];

  const paymentMethodGateways: Record<string, string[]> = {
    ARPay: ["arpay"],
    "BANK CARD": ["bank"],
    UPI: ["oxoxmg", "upi"],
    USDT: ["usdt"],
  };

  const filteredByMethod =
    selectedFilter === "All"
      ? allWithdrawals
      : allWithdrawals.filter((w) => {
        const gateways = paymentMethodGateways[selectedFilter] ?? [];
        return gateways.some((g) =>
          (w.bankName ?? "").toLowerCase().includes(g) ||
          (w.orderId ?? "").toLowerCase().includes(g)
        );
      });

  const withdrawals =
    selectedStatus === "All"
      ? filteredByMethod
      : filteredByMethod.filter(
        (w) => w.status === selectedStatus.toLowerCase()
      );

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
  const paymentMethods = [
    {
      id: "All",
      label: "All",
      icon: "grid",
      image: require("@/assets/all1.png"),
      image2: require("@/assets/all2.png"),
    },
    {
      id: "ARPay",
      label: "ARPay",
      icon: "triangle",
      image: require("@/assets/payNameIcon2_20250317165730f7ml.png"),
    },
    {
      id: "BANK CARD",
      label: "BANK CARD",
      icon: "card",
      image: require("@/assets/WithBeforeImgIcon_20250317170035rogo.png"),
    },
    {
      id: "UPI",
      label: "UPI",
      icon: "qr-code-outline",
      image: require("@/assets/WithBeforeImgIcon2_20250802174209t2y7.png"),
      gateways: ["oxoxmg"],
    },
    {
      id: "USDT",
      label: "USDT",
      icon: "qr-code-outline",
      image: require("@/assets/payNameIcon_20250317165636a3yk.png"),
      gateways: ["usdt"],
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#F3F8FF" />
          </Pressable>
          <ThemedText style={styles.screenTitle}>Withdrawal history</ThemedText>
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
          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
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
                  style={[styles.filterTab, { paddingHorizontal: selectedFilter === method.id ? 0 : method.id == "All" ? 22 : 12, paddingVertical: selectedFilter === method.id ? 0 : 8 }]}
                  onPress={() => setSelectedFilter(method.id)}
                >
                  {selectedFilter === method.id ? (
                    <ExpoLinearGradient
                      colors={["#7AFEC3", "#02AFB6"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{
                        paddingHorizontal: method.id == "All" ? 22 : 12,
                        paddingVertical: 8,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5
                      }}
                    >
                      {method.image2 === require("@/assets/all2.png") ? (
                        <Image
                          source={method.image}
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
                        style={[styles.filterTabText, styles.filterTabTextActive]}
                      >
                        {method.label}
                      </ThemedText>
                    </ExpoLinearGradient>
                  ) : (
                    <>
                      {method.image2 === require("@/assets/all2.png") ? (
                        <Image
                          source={method.image2}
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
                      <ThemedText style={styles.filterTabText}>
                        {method.label}
                      </ThemedText>
                    </>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Status and Date Filters */}
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
                          selectedStatus === option && styles.dropdownItemTextActive,
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

          {withdrawals.length === 0 ? (
            <View style={styles.noDataContainer}>
              <View style={styles.noDataIllustration}>
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
                      <Stop
                        offset="0.615"
                        stopColor="#777783"
                        stopOpacity="0.1"
                      />
                      <Stop offset="1" stopColor="#DEDEE6" stopOpacity="0" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint1_linear_6306_124794"
                      x1="110.557"
                      y1="19.5694"
                      x2="110.557"
                      y2="79.5818"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#353240" />
                      <Stop offset="1" stopColor="#24212F" stopOpacity="0" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint2_linear_6306_124794"
                      x1="303.907"
                      y1="65.2301"
                      x2="303.907"
                      y2="109.586"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#353240" />
                      <Stop offset="1" stopColor="#24212F" stopOpacity="0" />
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
                    <LinearGradient
                      id="paint4_linear_6306_124794"
                      x1="188.942"
                      y1="9.13086"
                      x2="188.942"
                      y2="155.486"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#676570" />
                      <Stop offset="1" stopColor="#403F4B" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint5_linear_6306_124794"
                      x1="177.68"
                      y1="144.809"
                      x2="177.68"
                      y2="177.424"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#504F5C" />
                      <Stop offset="1" stopColor="#2E2C3B" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint6_linear_6306_124794"
                      x1="275.816"
                      y1="28.1825"
                      x2="275.816"
                      y2="3.62035"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#31303A" />
                      <Stop offset="1" stopColor="#2B2930" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint7_linear_6306_124794"
                      x1="51.3203"
                      y1="144"
                      x2="51.3203"
                      y2="164"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#33303E" />
                      <Stop offset="1" stopColor="#3D3B46" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint8_linear_6306_124794"
                      x1="52.0976"
                      y1="99.1497"
                      x2="52.0976"
                      y2="149.74"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#302C3F" />
                      <Stop offset="1" stopColor="#494854" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint9_linear_6306_124794"
                      x1="344.097"
                      y1="165.449"
                      x2="344.097"
                      y2="181.337"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#23202A" />
                      <Stop offset="1" stopColor="#42404B" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint10_linear_6306_124794"
                      x1="344.795"
                      y1="140.896"
                      x2="344.795"
                      y2="172.673"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#302C3F" />
                      <Stop offset="1" stopColor="#494854" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint11_linear_6306_124794"
                      x1="296.068"
                      y1="131.764"
                      x2="296.068"
                      y2="170.902"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#494855" />
                      <Stop offset="1" stopColor="#312F3B" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint12_linear_6306_124794"
                      x1="84.0489"
                      y1="52.2659"
                      x2="113.914"
                      y2="80.8551"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#605D6A" />
                      <Stop offset="1" stopColor="#7D7B8B" />
                    </LinearGradient>
                    <LinearGradient
                      id="paint13_linear_6306_124794"
                      x1="83.5475"
                      y1="51.2645"
                      x2="106.537"
                      y2="69.6654"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#7C7A84" />
                      <Stop offset="1" stopColor="#ABAAB3" />
                    </LinearGradient>
                  </Defs>
                  <Path
                    opacity={0.3}
                    d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z"
                    fill="url(#paint0_linear_6306_124794)"
                  />
                  <Path
                    d="M24.2361 48.4838C39.3083 46.0376 45.4084 44.1986 60.1233 29.9067C74.8398 15.6163 89.7608 36.4663 111.891 28.0943C134.02 19.7238 136.044 9.58829 169.892 40.6345C185.494 53.8291 197.904 48.6052 205.553 53.8291C210.65 57.3103 215.564 65.8955 220.296 79.5818H24.2361C8.62556 74.1061 0.820312 69.5603 0.820312 65.9399C0.820312 60.5116 9.1638 50.9284 24.2361 48.4838Z"
                    fill="url(#paint1_linear_6306_124794)"
                  />
                  <Path
                    d="M237.112 86.6013C248.773 84.7933 253.495 83.4326 264.881 72.8706C276.268 62.3072 287.815 77.7185 304.939 71.5305C322.063 65.3441 323.628 57.8532 349.821 80.7998C361.895 90.5518 371.497 86.6901 377.415 90.5518C381.36 93.1253 385.162 99.4702 388.823 109.586H237.112C225.031 105.54 218.992 102.178 218.992 99.5043C218.992 95.4915 225.448 88.4078 237.112 86.6013Z"
                    fill="url(#paint2_linear_6306_124794)"
                  />
                  <Path
                    d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z"
                    fill="url(#paint3_linear_6306_124794)"
                  />
                  <Path
                    opacity={0.712}
                    d="M240.78 9.13086H137.104C136.363 9.13086 135.629 9.27668 134.944 9.55999C134.26 9.84329 133.637 10.2585 133.113 10.782C132.589 11.3055 132.174 11.9269 131.89 12.6108C131.607 13.2948 131.461 14.0277 131.461 14.7679V162.656C131.461 163.396 131.607 164.129 131.89 164.813C132.174 165.496 132.59 166.118 133.114 166.641C133.638 167.164 134.26 167.579 134.945 167.863C135.629 168.146 136.363 168.292 137.104 168.292H240.78C241.522 168.292 242.255 168.146 242.94 167.863C243.625 167.579 244.247 167.164 244.771 166.641C245.295 166.118 245.711 165.496 245.994 164.813C246.278 164.129 246.424 163.396 246.424 162.656V14.7679C246.424 14.0277 246.278 13.2948 245.995 12.6108C245.711 11.9269 245.296 11.3055 244.771 10.782C244.247 10.2585 243.625 9.84329 242.94 9.55999C242.256 9.27668 241.522 9.13086 240.78 9.13086Z"
                    fill="url(#paint4_linear_6306_124794)"
                  />
                  <Path
                    d="M225.836 144.809V160.94C225.836 170.043 233.226 177.424 242.343 177.424H114.529C104.401 177.424 96.1875 169.223 96.1875 159.108V144.809H225.836ZM259.174 161.117C259.174 170.123 251.863 177.424 242.843 177.424H242.667C251.783 177.424 259.174 170.043 259.174 160.94L259.173 161.028L259.174 161.117Z"
                    fill="url(#paint5_linear_6306_124794)"
                  />
                  <Path
                    d="M275.816 0C284.834 0 292.145 7.29993 292.145 16.3071L292.144 30.0052H259.484V16.3086C259.484 7.30141 266.796 0 275.816 0Z"
                    fill="url(#paint6_linear_6306_124794)"
                  />
                  <Rect
                    x={48.8203}
                    y={144}
                    width={5}
                    height={20}
                    rx={2.5}
                    fill="url(#paint7_linear_6306_124794)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M46.1844 105.961C41.438 115.8 25.098 145.98 47.9933 149.359C70.8901 152.738 69.8685 132.651 65.8517 125.462C61.8364 118.273 57.3036 114.249 57.3036 105.961C57.3036 97.6734 50.9292 96.1201 46.1829 105.961H46.1844Z"
                    fill="url(#paint8_linear_6306_124794)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M343.974 165.449H344.221C344.921 165.449 345.491 166.016 345.491 166.717V180.068C345.491 180.405 345.357 180.727 345.119 180.965C344.881 181.203 344.558 181.337 344.221 181.337H343.974C343.637 181.337 343.314 181.204 343.075 180.966C342.837 180.728 342.703 180.405 342.703 180.068V166.717C342.703 166.016 343.272 165.449 343.974 165.449Z"
                    fill="url(#paint9_linear_6306_124794)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M340.932 145.174C337.834 151.355 327.164 170.311 342.114 172.434C357.066 174.556 356.399 161.939 353.778 157.424C351.155 152.908 348.195 150.38 348.195 145.174C348.195 139.968 344.031 138.994 340.932 145.174Z"
                    fill="url(#paint10_linear_6306_124794)"
                  />
                  <Path
                    d="M269.941 131.764H322.196C323.639 131.764 324.809 132.933 324.809 134.373V168.292C324.809 169.734 323.639 170.901 322.196 170.901H269.941C269.248 170.901 268.583 170.626 268.093 170.137C267.603 169.648 267.328 168.984 267.328 168.292V134.373C267.328 132.933 268.498 131.764 269.941 131.764Z"
                    fill="url(#paint11_linear_6306_124794)"
                  />
                  <Path
                    opacity={0.398}
                    d="M284.309 32.6133C282.541 53.9608 273.212 64.0459 263.885 69.6786C249.04 78.6443 231.874 74.1814 227.627 69.6786C220.715 62.3476 233.578 51.1844 246.322 59.5164C259.065 67.8484 223.925 97.2125 187.223 92.0122C162.755 88.5459 140.684 82.0766 121.008 72.6045"
                    stroke="#908E9B"
                    strokeWidth={0.881}
                    strokeLinecap="round"
                    strokeDasharray="2.64 2.64"
                  />
                  <Path
                    d="M83.2109 50.6191L124.558 71.2914L116.173 82.6011L83.2109 50.6191Z"
                    fill="#565461"
                  />
                  <Path
                    d="M83.2109 50.6191L116.168 82.5997L118.765 69.3487L83.2109 50.6191Z"
                    fill="url(#paint12_linear_6306_124794)"
                  />
                  <Path
                    d="M83.2109 50.6191L103.479 66.3814L118.759 69.3443L83.2109 50.6191Z"
                    fill="url(#paint13_linear_6306_124794)"
                  />
                  <Path
                    d="M88.8516 53.4336L136.814 71.5901L124.564 71.291L88.8516 53.4336Z"
                    fill="#6D6B7A"
                  />
                </Svg>
              </View>
              <ThemedText style={styles.noDataText}>No data</ThemedText>
            </View>
          ) : (
            <View style={styles.list}>
              {withdrawals.map((item) => {
                const copyOrderId = async () => {
                  await Clipboard.setStringAsync(item.orderId || item._id);
                };

                return (
                  <View key={item._id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.withdrawalBadge}>
                        <ThemedText style={styles.withdrawalBadgeText}>
                          Withdraw
                        </ThemedText>
                      </View>
                      <ThemedText
                        style={[styles.statusText, { color: statusColor(item.status) }]}
                      >
                        {statusLabel(item.status)}
                      </ThemedText>
                    </View>

                    <View style={styles.detailsContainer}>
                      <View style={styles.cardDetailsRow}>
                        <ThemedText style={styles.detailLabel}>Balance</ThemedText>
                        <ThemedText style={styles.balanceValue}>
                          ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </ThemedText>
                      </View>

                      <View style={styles.cardDetailsRow}>
                        <ThemedText style={styles.detailLabel}>Type</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {item.bankName}
                        </ThemedText>
                      </View>

                      <View style={styles.cardDetailsRow}>
                        <ThemedText style={styles.detailLabel}>Time</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {formatDate(item.createdAt)}
                        </ThemedText>
                      </View>

                      <View style={styles.cardDetailsRow}>
                        <ThemedText style={styles.detailLabel}>Order number</ThemedText>
                        <View style={styles.orderNumberContainer}>
                          <ThemedText style={[styles.detailValue, { flex: 1, textAlign: "right", marginRight: 6 }]} numberOfLines={1}>
                            {item.orderId || item._id}
                          </ThemedText>
                          <Pressable onPress={copyOrderId}>
                            <Ionicons name="copy-outline" size={16} color="#91A8E2" style={{ transform: [{ rotate: "90deg" }] }} />
                          </Pressable>
                        </View>
                      </View>

                      {item.remark ? (
                        <View style={styles.cardDetailsRow}>
                          <ThemedText style={styles.detailLabel}>Remarks</ThemedText>
                          <ThemedText style={styles.detailValue}>{item.remark}</ThemedText>
                        </View>
                      ) : (
                        <View style={styles.cardDetailsRow}>
                          <ThemedText style={styles.detailLabel}>Remarks</ThemedText>
                          <ThemedText style={styles.detailValue}></ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}

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
    backgroundColor: "#05012B",
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
    paddingTop: 50,
    paddingBottom: 12,
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
  filterTabs: {
    flexDirection: "row",
    marginTop: 13,
    gap: 8,
    marginBottom: 0,
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
    borderRadius: 5,
    backgroundColor: "#011341",
    fontFamily: "BahnschriftRegular",
    overflow: "hidden"
  },
  filterTabActive: {
    backgroundColor: "#7AFEC3",
    color: "#05012B",
  },
  filterTabText: {
    fontSize: 12.8,
    color: "#92A8E3",
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: "#05012B",
    fontWeight: "600",
    marginTop: -3
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  filterDropdown: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#011341",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterDropdownText: {
    fontSize: 14,
    color: "#91A8E2",
    fontWeight: "700"
  },
  noDataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  noDataIllustration: {
    width: 200,
    height: 170,
    position: "relative",
    marginBottom: 0,
    alignItems: "center",
    paddingVertical: 24,
    paddingBottom: 0,
  },
  scrollShape: {
    position: "absolute",
    top: 20,
    left: 30,
    width: 120,
    height: 140,
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2a2a3e",
    transform: [{ rotate: "-5deg" }],
  },
  airplane: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#2a2a3e",
    transform: [{ rotate: "45deg" }],
  },
  tree: {
    position: "absolute",
    width: 20,
    height: 30,
    backgroundColor: "#1a1a2e",
    borderRadius: 4,
  },
  noDataText: {
    fontSize: 13.8,
    color: "#6F80A4",
    fontFamily: "BahnschriftRegular",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  list: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#011341",
    borderRadius: 12,
    overflow: "hidden",
    paddingBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  withdrawalBadge: {
    backgroundColor: "#D23638",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  withdrawalBadgeText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "BahnschriftRegular",
    fontWeight: "700",
  },
  statusText: {
    fontSize: 16,
    fontFamily: "BahnschriftRegular",
    fontWeight: "600",
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  cardDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 15,
    color: "#8CA1DB",
    fontFamily: "BahnschriftRegular",
  },
  detailValue: {
    fontSize: 15,
    color: "#87A2E0",
    fontFamily: "BahnschriftRegular",
    textAlign: "right",
  },
  balanceValue: {
    fontSize: 15,
    color: "#BF8944",
    fontFamily: "BahnschriftRegular",
    fontWeight: "700",
  },
  orderNumberContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 20,
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
