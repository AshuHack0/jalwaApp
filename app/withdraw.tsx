import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { type BankAccount, getBankAccount } from "@/services/api/bankAccount";
import {
  type WithdrawalRecord,
  getMyWithdrawals,
  initiateWithdrawal,
} from "@/services/api/withdrawal";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Rect,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";

const TOTAL_ASSETS_BG =
  "https://www.jalwagame.win/assets/png/TotalAssetsBg-ad5afbbb.webp";

const BANK_CARD_ICON = require("@/assets/WithBeforeImgIcon_20250317170035rogo.png");
const UPI_ICON = require("@/assets/WithBeforeImgIcon2_20250802174209t2y7.png");
const USDT_ICON = require("@/assets/payNameIcon_20250317165636a3yk.png");

type WithdrawMethod = "BANK_CARD" | "UPI" | "USDT";

function formatBalance(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getFullYear()}`;
}

function statusColor(status: WithdrawalRecord["status"]): string {
  if (status === "approved") return "#7AFEC3";
  if (status === "rejected") return "#FF6B6B";
  return "#FFD700";
}

export default function WithdrawScreen() {
  const router = useRouter();
  const { walletBalance, refreshWallet } = useAuth();
  const { showToast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [usdtAmount, setUsdtAmount] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] =
    useState<WithdrawMethod>("BANK_CARD");
  const [recentWithdrawals, setRecentWithdrawals] = useState<
    WithdrawalRecord[]
  >([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getBankAccount().then(setBankAccount);
      getMyWithdrawals(1, 3).then((res) => {
        if (res.success && res.data) {
          setRecentWithdrawals(res.data.withdrawals);
        }
      });
    }, []),
  );

  const withdrawableBalance = walletBalance;
  const isDisabled =
    loading || !withdrawAmount || parseFloat(withdrawAmount) <= 0;

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!bankAccount?.accountNumber) {
      showToast({
        type: "warning",
        title: "No Bank Account",
        message: "Please add your bank account before withdrawing.",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await initiateWithdrawal(amount);
      if (result.success) {
        await refreshWallet();
        setWithdrawAmount("");
        setShowSuccessModal(true);
      } else {
        showToast({
          type: "error",
          title: "Withdrawal Failed",
          message: result.message || "Please try again.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Network Error",
        message: "Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAllAmount = () => {
    setWithdrawAmount(withdrawableBalance.toFixed(2));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Success Modal ── */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Confetti dots */}
            <View style={styles.confettiContainer}>
              <View style={[styles.confettiDot, { backgroundColor: "#7AFEC3", top: 10, left: "34%" }]} />
              <View style={[styles.confettiDot, { backgroundColor: "#FFD700", top: -10, right: "40%", width: 8, height: 8 }]} />
              <View style={[styles.confettiDot, { backgroundColor: "#7AFEC3", top: -2, left: "45%", width: 10, height: 10 }]} />
              <View style={[styles.confettiLine, { top: 25, left: "30%", transform: [{ rotate: "-45deg" }] }]} />
              <View style={[styles.confettiLine, { top: -13, right: "32%", backgroundColor: "#FFD700", transform: [{ rotate: "-140deg" }] }]} />
              <View style={[styles.confettiArc, { top: 20, right: "32%", borderColor: "#FFD700", transform: [{ rotate: "180deg" }] }]} />
              <View style={[styles.confettiLine, { top: -20, right: "62%", backgroundColor: "#FFD700", transform: [{ rotate: "-60deg" }] }]} />

            </View>

            <Image source={require("@/assets/tick.png")} style={{ height: 50, aspectRatio: 1 }} />
            <ThemedText style={styles.modalTitle}>
              Withdrawal request successful
            </ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              We will complete the withdrawal within 2 hours!{"\n"}Please wait patiently...
            </ThemedText>

            <Pressable
              style={styles.confirmButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/withdrawal-history");
              }}
            >
              <LinearGradient
                colors={["#7AFEC3", "#02AFB6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ThemedView style={styles.container}>
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View style={[styles.topBarSide, styles.topBarSideLeft]}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>
          </View>
          <View style={[styles.topBarSide, styles.topBarSideRight]}>
            <Pressable
              onPress={() => router.push("/withdrawal-history")}
              style={styles.historyNavButton}
            >
              <ThemedText style={styles.historyNavText}>
                Withdrawal history
              </ThemedText>
            </Pressable>
          </View>
          <View style={styles.topBarTitleWrap} pointerEvents="none">
            <ThemedText style={styles.screenTitle}>Withdraw</ThemedText>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Balance Card ── */}
          <ImageBackground
            source={{ uri: TOTAL_ASSETS_BG }}
            style={styles.balanceCard}
            imageStyle={styles.balanceCardBgImage}
            resizeMode="cover"
          >
            <View style={styles.balanceCardInner}>
              <View style={styles.balanceHeaderRow}>
              <Image source={{ uri: "https://www.jalwagame.win/assets/png/balance-b2c8faab.webp" }} style={{ width: 18, height: 18, paddingLeft: 20 , marginLeft: 5 }} />
                <ThemedText style={styles.balanceLabel}>
                  Available balance
                </ThemedText>
              </View>
              <View style={styles.balanceAmountRow}>
                <ThemedText style={styles.balanceAmount}>
                  {formatBalance(walletBalance)}
                </ThemedText>
                <Pressable
                  onPress={refreshWallet}
                  style={styles.refreshBtn}
                >
                  {/* <Ionicons
                    name="refresh-circle-outline"
                    size={22}
                    color="rgba(255,255,255,0.85)"
                  /> */}
               
                  <Image source={{ uri: "https://www.jalwagame.win/assets/png/refresh-8e0efe26.webp" }} style={{ width: 18, height: 18, paddingLeft: 20 , marginLeft: 5 }} />
                </Pressable>
              </View>
              <View style={styles.cardFooterRow}  >
                {/* <Ionicons
                  name="card-outline"
                  size={30}
                  color="rgba(255,255,255,0.55)"
                /> */}
                <ThemedText style={styles.cardMask}></ThemedText>
              </View>
            </View>
          </ImageBackground>

          {/* ── ARPay + Method Tabs ── */}
          <View style={styles.methodSection}>
            {/* ARPay header */}
            <View style={styles.arPayRow}>
              <View style={styles.arPayIconWrap}>
              <Image source={{ uri: "https://jalwaimg.jalwa-jalwa.com/Jalwa/payNameIcon/WithBeforeImgIcon_2025031717011158q1.png" }} style={{ width: 42, height: 42 }} />
              </View>
              <View style={styles.arPayTextWrap}>
                <ThemedText style={styles.arPayTitle}>ARPay</ThemedText>
                <ThemedText style={styles.arPaySubtitle}>
                  Supports UPI for fast payment
                </ThemedText>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
              {/* BANK CARD */}
              <Pressable
                style={styles.methodTabWrap}
                onPress={() => setSelectedMethod("BANK_CARD")}
              >
                {selectedMethod === "BANK_CARD" ? (
                  <LinearGradient
                    colors={["#66F5C2", "#01B8BF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.methodTab}
                  >
                    <Image
                      source={BANK_CARD_ICON}
                      style={styles.tabIconLarge}
                      resizeMode="contain"
                    />
                    <Text style={styles.tabLabelActive}>BANK CARD</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.methodTab, styles.methodTabInactive]}>
                    <Image
                      source={BANK_CARD_ICON}
                      style={styles.tabIconLarge}
                      resizeMode="contain"
                    />
                    <Text style={styles.tabLabel}>BANK CARD</Text>
                  </View>
                )}
              </Pressable>

              {/* UPI */}
              <Pressable
                style={styles.methodTabWrap}
                onPress={() => setSelectedMethod("UPI")}
              >
                {selectedMethod === "UPI" ? (
                  <LinearGradient
                    colors={["#66F5C2", "#01B8BF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.methodTab}
                  >
                    <Image
                      source={UPI_ICON}
                      style={styles.tabIconMedium}
                      resizeMode="contain"
                    />
                    <Text style={styles.tabLabelActive}>UPI</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.methodTab, styles.methodTabInactive]}>
                    <Image
                      source={UPI_ICON}
                      style={styles.tabIconMedium}
                      resizeMode="contain"
                    />
                    <Text style={styles.tabLabel}>UPI</Text>
                  </View>
                )}
              </Pressable>

              {/* USDT */}
              <Pressable
                style={styles.methodTabWrap}
                onPress={() => setSelectedMethod("USDT")}
              >
                {selectedMethod === "USDT" ? (
                  <LinearGradient
                    colors={["#66F5C2", "#01B8BF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.methodTab}
                  >
                    <Image
                      source={USDT_ICON}
                      style={styles.tabIconMedium}
                      resizeMode="contain"
                    />
                    <Text style={styles.tabLabelActive}>USDT</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.methodTab, styles.methodTabInactive]}>
                    <Image
                      source={USDT_ICON}
                      style={styles.tabIconMedium}
                      resizeMode="contain"
                    />
                    <Text style={styles.tabLabel}>USDT</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* Bank account section (BANK CARD only) */}
            {selectedMethod === "BANK_CARD" &&
              (bankAccount && bankAccount.accountNumber ? (
                <Pressable
                  style={styles.savedBankCard}
                  onPress={() => router.push("/add-bank")}
                >
                  <View style={styles.savedBankRow}>
                    <View style={styles.bankIconCircle}>
                      <Ionicons name="business" size={20} color="#7AFEC3" />
                    </View>
                    <View style={styles.savedBankInfo}>
                      <ThemedText style={styles.savedBankName}>
                        {bankAccount.bankName}
                      </ThemedText>
                      <ThemedText style={styles.savedBankHolder}>
                        {bankAccount.accountHolder}
                      </ThemedText>
                      <ThemedText style={styles.savedBankNumber}>
                        {"**** **** " + bankAccount.accountNumber.slice(-4)}
                      </ThemedText>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#92A8E3"
                    />
                  </View>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    style={styles.addBankBtn}
                    onPress={() => router.push("/add-bank")}
                  >
                    <View style={styles.addBankIconBox}>
                      <Ionicons name="add" size={28} color="#92A8E3" />
                    </View>
                    <ThemedText style={styles.addBankText}>
                      Add a bank account number
                    </ThemedText>
                  </Pressable>
                  <ThemedText style={styles.addBankWarning}>
                    Need to add beneficiary information to be able to withdraw
                    money
                  </ThemedText>
                </>
              ))}

            {/* UPI / USDT: add wallet (hidden on BANK CARD) */}
            {(selectedMethod === "UPI" || selectedMethod === "USDT") && (
              <Pressable
                style={styles.addBankBtn}
                onPress={() => router.push("/add-bank")}
              >
                <View style={styles.addBankIconBox}>
                  <Ionicons name="add" size={28} color="#92A8E3" />
                </View>
                <ThemedText style={styles.addBankText}>
                  Add{" "}
                  {selectedMethod === "UPI" ? "UPI ID" : "USDT wallet address"}
                </ThemedText>
              </Pressable>
            )}
          </View>

          {/* ── Amount Input ── */}
          <View style={styles.amountCard}>
            {selectedMethod === "USDT" ? (
              <>
                {/* USDT header */}
                <View style={styles.usdtHeader}>
                  <Image source={USDT_ICON} style={styles.usdtHeaderIcon} resizeMode="contain" />
                  <ThemedText style={styles.usdtHeaderTitle}>
                    Select amount of USDT
                  </ThemedText>
                </View>

                {/* INR input */}
                <View style={styles.usdtInputRow}>
                  <ThemedText style={styles.usdtInputCurrency}>₹</ThemedText>
                  <TextInput
                    style={styles.usdtInput}
                    placeholder="Please enter withdrawal amount"
                    placeholderTextColor="#4A5B7A"
                    value={withdrawAmount}
                    onChangeText={setWithdrawAmount}
                    keyboardType="numeric"
                  />
                </View>

                {/* USDT input */}
                <View style={styles.usdtInputRow}>
                  <Image source={USDT_ICON} style={styles.usdtInputIcon} resizeMode="contain" />
                  <TextInput
                    style={styles.usdtInput}
                    placeholder="Please enter USDT amount"
                    placeholderTextColor="#4A5B7A"
                    value={usdtAmount}
                    onChangeText={setUsdtAmount}
                    keyboardType="numeric"
                  />
                </View>

                {/* Balance + All */}
                <View style={styles.usdtBalanceRow}>
                  <ThemedText style={styles.usdtBalanceText}>
                    Withdrawable balance{" "}
                    <Text style={styles.usdtBalanceAmount}>
                      {formatBalance(withdrawableBalance)}
                    </Text>
                  </ThemedText>
                  <Pressable
                    onPress={() => setWithdrawAmount(withdrawableBalance.toFixed(2))}
                    style={styles.allBtn}
                  >
                    <ThemedText style={styles.allBtnText}>All</ThemedText>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <View style={styles.amountInputRow}>
                  <ThemedText style={styles.currencySymbol}>₹</ThemedText>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Please enter the amount"
                    placeholderTextColor="#4A5B7A"
                    value={withdrawAmount}
                    onChangeText={setWithdrawAmount}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.balanceInfoRow}>
                  <ThemedText style={styles.balanceInfoText}>
                    Withdrawable balance{" "}
                    <Text style={styles.balanceInfoAmount}>
                      {formatBalance(withdrawableBalance)}
                    </Text>
                  </ThemedText>
                  <Pressable
                    onPress={handleAllAmount}
                    style={styles.allBtn}
                  >
                    <ThemedText style={styles.allBtnText}>All</ThemedText>
                  </Pressable>
                </View>
                <View style={styles.receivedRow}>
                  <ThemedText style={styles.receivedLabel}>
                    Withdrawal amount received
                  </ThemedText>
                  <ThemedText style={styles.receivedValue}>
                    ₹
                    {withdrawAmount
                      ? parseFloat(withdrawAmount).toFixed(2)
                      : "0.00"}
                  </ThemedText>
                </View>
              </>
            )}

            {/* ── Withdraw Button ── */}
            <Pressable
              style={[
                styles.withdrawBtn,
                isDisabled && styles.withdrawBtnDisabled,
              ]}
              onPress={handleWithdraw}
              disabled={isDisabled}
            >
              <ThemedText
                style={[
                  styles.withdrawBtnText,
                  isDisabled && styles.withdrawBtnTextDisabled,
                ]}
              >
                {loading ? "Processing..." : "Withdraw"}
              </ThemedText>
            </Pressable>
            {/* ── Withdrawal Rules ── */}
            <View style={styles.rulesSection}>
              <RuleItem>
                {"Need to bet "}
                <Text style={styles.highlight}>{formatBalance(0)}</Text>
                {" to be able to withdraw"}
              </RuleItem>
              <RuleItem>
                {"Withdraw time "}
                <Text style={styles.highlight}>{"00:00-23:59"}</Text>
              </RuleItem>
              <RuleItem>
                {"Inday Remaining Withdrawal Times"}
                <Text style={styles.highlight}>{"3"}</Text>
              </RuleItem>
              <RuleItem>
                {"Withdrawal amount range "}
                <Text style={styles.highlight}>{"₹110.00-₹100,000.00"}</Text>
              </RuleItem>
              <RuleItem>
                {
                  "Please confirm your beneficial account information before withdrawing. If your information is incorrect, our company will not be liable for the amount of loss"
                }
              </RuleItem>
              <RuleItem>
                {
                  "If your beneficial information is incorrect, please contact customer service"
                }
              </RuleItem>
            </View>
          </View>

          {/* ── Withdrawal History Preview ── */}
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                source={require("@/assets/Screenshot_2026-04-08_025104-removebg-preview (1).png")}
                style={styles.historySectionIcon}
                resizeMode="contain"
              />
              <ThemedText style={styles.historySectionTitle}>
                Withdrawal history
              </ThemedText>
            </View>

            {recentWithdrawals.length > 0 ? (
              <View style={styles.historyList}>
                {recentWithdrawals.map((item) => (
                  <View key={item._id} style={styles.historyItem}>
                    <View>
                      <ThemedText style={styles.historyItemAmount}>
                        {formatBalance(item.amount)}
                      </ThemedText>
                      <ThemedText style={styles.historyItemDate}>
                        {formatDate(item.createdAt)}
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={[
                        styles.historyItemStatus,
                        { color: statusColor(item.status) },
                      ]}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDataWrap}>
                <Svg viewBox="0 0 389 227" width={240} height={130} fill="none">
                  <Defs>
                    <SvgGradient
                      id="wg0"
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
                    </SvgGradient>
                    <SvgGradient
                      id="wg1"
                      x1="110.557"
                      y1="19.5694"
                      x2="110.557"
                      y2="79.5818"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#353240" />
                      <Stop offset="1" stopColor="#24212F" stopOpacity="0" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg2"
                      x1="303.907"
                      y1="65.2301"
                      x2="303.907"
                      y2="109.586"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#353240" />
                      <Stop offset="1" stopColor="#24212F" stopOpacity="0" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg3"
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
                    </SvgGradient>
                    <SvgGradient
                      id="wg4"
                      x1="188.942"
                      y1="9.13086"
                      x2="188.942"
                      y2="155.486"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#676570" />
                      <Stop offset="1" stopColor="#403F4B" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg5"
                      x1="177.68"
                      y1="144.809"
                      x2="177.68"
                      y2="177.424"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#504F5C" />
                      <Stop offset="1" stopColor="#2E2C3B" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg6"
                      x1="275.816"
                      y1="28.1825"
                      x2="275.816"
                      y2="3.62035"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#31303A" />
                      <Stop offset="1" stopColor="#2B2930" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg7"
                      x1="51.3203"
                      y1="144"
                      x2="51.3203"
                      y2="164"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#33303E" />
                      <Stop offset="1" stopColor="#3D3B46" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg8"
                      x1="52.0976"
                      y1="99.1497"
                      x2="52.0976"
                      y2="149.74"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#302C3F" />
                      <Stop offset="1" stopColor="#494854" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg9"
                      x1="344.097"
                      y1="165.449"
                      x2="344.097"
                      y2="181.337"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#23202A" />
                      <Stop offset="1" stopColor="#42404B" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg10"
                      x1="344.795"
                      y1="140.896"
                      x2="344.795"
                      y2="172.673"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#302C3F" />
                      <Stop offset="1" stopColor="#494854" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg11"
                      x1="296.068"
                      y1="131.764"
                      x2="296.068"
                      y2="170.902"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#494855" />
                      <Stop offset="1" stopColor="#312F3B" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg12"
                      x1="84.0489"
                      y1="52.2659"
                      x2="113.914"
                      y2="80.8551"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#605D6A" />
                      <Stop offset="1" stopColor="#7D7B8B" />
                    </SvgGradient>
                    <SvgGradient
                      id="wg13"
                      x1="83.5475"
                      y1="51.2645"
                      x2="106.537"
                      y2="69.6654"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#7C7A84" />
                      <Stop offset="1" stopColor="#ABAAB3" />
                    </SvgGradient>
                  </Defs>
                  <Path
                    opacity={0.3}
                    d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z"
                    fill="url(#wg0)"
                  />
                  <Path
                    d="M24.2361 48.4838C39.3083 46.0376 45.4084 44.1986 60.1233 29.9067C74.8398 15.6163 89.7608 36.4663 111.891 28.0943C134.02 19.7238 136.044 9.58829 169.892 40.6345C185.494 53.8291 197.904 48.6052 205.553 53.8291C210.65 57.3103 215.564 65.8955 220.296 79.5818H24.2361C8.62556 74.1061 0.820312 69.5603 0.820312 65.9399C0.820312 60.5116 9.1638 50.9284 24.2361 48.4838Z"
                    fill="url(#wg1)"
                  />
                  <Path
                    d="M237.112 86.6013C248.773 84.7933 253.495 83.4326 264.881 72.8706C276.268 62.3072 287.815 77.7185 304.939 71.5305C322.063 65.3441 323.628 57.8532 349.821 80.7998C361.895 90.5518 371.497 86.6901 377.415 90.5518C381.36 93.1253 385.162 99.4702 388.823 109.586H237.112C225.031 105.54 218.992 102.178 218.992 99.5043C218.992 95.4915 225.448 88.4078 237.112 86.6013Z"
                    fill="url(#wg2)"
                  />
                  <Path
                    d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z"
                    fill="url(#wg3)"
                  />
                  <Path
                    opacity={0.712}
                    d="M240.78 9.13086H137.104C136.363 9.13086 135.629 9.27668 134.944 9.55999C134.26 9.84329 133.637 10.2585 133.113 10.782C132.589 11.3055 132.174 11.9269 131.89 12.6108C131.607 13.2948 131.461 14.0277 131.461 14.7679V162.656C131.461 163.396 131.607 164.129 131.89 164.813C132.174 165.496 132.59 166.118 133.114 166.641C133.638 167.164 134.26 167.579 134.945 167.863C135.629 168.146 136.363 168.292 137.104 168.292H240.78C241.522 168.292 242.255 168.146 242.94 167.863C243.625 167.579 244.247 167.164 244.771 166.641C245.295 166.118 245.711 165.496 245.994 164.813C246.278 164.129 246.424 163.396 246.424 162.656V14.7679C246.424 14.0277 246.278 13.2948 245.995 12.6108C245.711 11.9269 245.296 11.3055 244.771 10.782C244.247 10.2585 243.625 9.84329 242.94 9.55999C242.256 9.27668 241.522 9.13086 240.78 9.13086Z"
                    fill="url(#wg4)"
                  />
                  <Path
                    d="M225.836 144.809V160.94C225.836 170.043 233.226 177.424 242.343 177.424H114.529C104.401 177.424 96.1875 169.223 96.1875 159.108V144.809H225.836ZM259.174 161.117C259.174 170.123 251.863 177.424 242.843 177.424H242.667C251.783 177.424 259.174 170.043 259.174 160.94L259.173 161.028L259.174 161.117Z"
                    fill="url(#wg5)"
                  />
                  <Path
                    d="M275.816 0C284.834 0 292.145 7.29993 292.145 16.3071L292.144 30.0052H259.484V16.3086C259.484 7.30141 266.796 0 275.816 0Z"
                    fill="url(#wg6)"
                  />
                  <Rect
                    x={48.8203}
                    y={144}
                    width={5}
                    height={20}
                    rx={2.5}
                    fill="url(#wg7)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M46.1844 105.961C41.438 115.8 25.098 145.98 47.9933 149.359C70.8901 152.738 69.8685 132.651 65.8517 125.462C61.8364 118.273 57.3036 114.249 57.3036 105.961C57.3036 97.6734 50.9292 96.1201 46.1829 105.961H46.1844Z"
                    fill="url(#wg8)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M343.974 165.449H344.221C344.921 165.449 345.491 166.016 345.491 166.717V180.068C345.491 180.405 345.357 180.727 345.119 180.965C344.881 181.203 344.558 181.337 344.221 181.337H343.974C343.637 181.337 343.314 181.204 343.075 180.966C342.837 180.728 342.703 180.405 342.703 180.068V166.717C342.703 166.016 343.272 165.449 343.974 165.449Z"
                    fill="url(#wg9)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M340.932 145.174C337.834 151.355 327.164 170.311 342.114 172.434C357.066 174.556 356.399 161.939 353.778 157.424C351.155 152.908 348.195 150.38 348.195 145.174C348.195 139.968 344.031 138.994 340.932 145.174Z"
                    fill="url(#wg10)"
                  />
                  <Path
                    d="M269.941 131.764H322.196C323.639 131.764 324.809 132.933 324.809 134.373V168.292C324.809 169.734 323.639 170.901 322.196 170.901H269.941C269.248 170.901 268.583 170.626 268.093 170.137C267.603 169.648 267.328 168.984 267.328 168.292V134.373C267.328 132.933 268.498 131.764 269.941 131.764Z"
                    fill="url(#wg11)"
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
                    fill="url(#wg12)"
                  />
                  <Path
                    d="M83.2109 50.6191L103.479 66.3814L118.759 69.3443L83.2109 50.6191Z"
                    fill="url(#wg13)"
                  />
                  <Path
                    d="M88.8516 53.4336L136.814 71.5901L124.564 71.291L88.8516 53.4336Z"
                    fill="#6D6B7A"
                  />
                </Svg>
                <ThemedText style={styles.noDataText}>No data</ThemedText>
              </View>
            )}

            <Pressable
              style={styles.allHistoryBtn}
              onPress={() => router.push("/withdrawal-history")}
            >
              <ThemedText style={styles.allHistoryBtnText}>
                All history
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

function RuleItem({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.ruleItem}>
      <Text style={styles.ruleBullet}>◆</Text>
      <Text style={styles.ruleText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40, paddingTop: 88 },

  /* Top bar */
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: "#05012B",
  },
  topBarSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  topBarSideLeft: {
    justifyContent: "flex-start",
  },
  topBarSideRight: {
    justifyContent: "flex-end",
  },
  backButton: { padding: 4 },
  topBarTitleWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 30,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  historyNavButton: { padding: 4 },
  historyNavText: { fontSize: 13, color: "#ffffff" },

  /* Balance card */
  balanceCard: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  balanceCardBgImage: {
    borderRadius: 16,
  },
  balanceCardInner: { padding: 18 },
  balanceHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  balanceLabel: { fontSize: 14, color: "blacka", fontWeight: "500" },
  balanceAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  balanceAmount: { fontSize: 30, fontWeight: "800", color: "#05012B" },
  refreshBtn: { paddingTop: 2 },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMask: {
    fontSize: 15,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 3,
  },

  /* Method section */
  methodSection: {
    marginHorizontal: 14,
    marginTop: 16,
  },
  arPayRow: {
    padding: 14,
    paddingVertical: 7,
    flexDirection: "row",
    borderRadius: 14,
    backgroundColor: "#0A1A45",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  arPayIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#12204E",
    alignItems: "center",
    justifyContent: "center",
  },
  arPayTextWrap: { gap: 2 },
  arPayTitle: { fontSize: 18, fontWeight: "700", color: "#ffffff" },
  arPaySubtitle: { fontSize: 14, color: "#92A8E3" },

  /* Tabs */
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  methodTabWrap: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  methodTab: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
  },
  methodTabInactive: {
    backgroundColor: "#0D1E52",
  },
  methodTabActive: {
    backgroundColor: "#7AFEC3",
  },
  tabIconLarge: {
    width: 40,
    height: 40,
  },
  tabIconMedium: {
    width: 36,
    height: 36,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92A8E3",
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#05012B",
    letterSpacing: 0.3,
  },

  /* Add bank */
  addBankBtn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 22,
    backgroundColor: "#011341",
    // borderWidth: 1.5,
    // borderColor: "rgba(146,168,227,0.25)",
    // borderStyle: "dashed",
  },
  addBankIconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(146,168,227,0.35)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addBankText: { fontSize: 14, fontWeight: "600", color: "#92A8E3" },
  addBankWarning: {
    fontSize: 12.5,
    color: "#D23838",
    marginTop: 8,
    textAlign: "center",
  },

  /* Saved bank card */
  savedBankCard: {
    backgroundColor: "#0D1E52",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(122,254,195,0.25)",
  },
  savedBankRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bankIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(122,254,195,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  savedBankInfo: { flex: 1, gap: 2 },
  savedBankName: { fontSize: 13, fontWeight: "600", color: "#7AFEC3" },
  savedBankHolder: { fontSize: 12, color: "#fff" },
  savedBankNumber: { fontSize: 12, color: "#92A8E3" },

  /* Amount card */
  amountCard: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: "#0A1A45",
    borderRadius: 14,
    overflow: "hidden",
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 5,
    gap: 8,
    backgroundColor: "#05012B",
    borderRadius: 100,
    margin: 15,
  },
  currencySymbol: { fontSize: 20, fontWeight: "600", color: "#00ECBE" },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingLeft: 20,
  },
  amountDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 0,
  },
  balanceInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  balanceInfoText: { fontSize: 13, color: "#92A8E3" },
  balanceInfoAmount: { fontSize: 13, color: "#DD9138" },
  allBtn: {
    borderWidth: 0.5,
    borderColor: "#7AFEC3",
    borderRadius: 6,
    paddingHorizontal: 44,
    paddingVertical: 0,
  },
  allBtnText: { fontSize: 13, fontWeight: "600", color: "#7AFEC3" },
  receivedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
  },
  receivedLabel: { fontSize: 13, color: "#92A8E3" },
  receivedValue: { fontSize: 16, fontWeight: "700", color: "#DD9138" },

  /* Withdraw button */
  withdrawBtn: {
    marginHorizontal: 14,
    marginTop: 16,
    backgroundColor: "#7AFEC3",
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: "center",
  },
  withdrawBtnDisabled: { backgroundColor: "#2A3A5C", opacity: 0.7 },
  withdrawBtnText: {
    fontSize: 17,
    fontWeight: "400",
    color: "#05012B",
  },
  withdrawBtnTextDisabled: { color: "#6A7FA8" },

  /* Rules */
  rulesSection: {
    marginHorizontal: 14,
    marginVertical: 20,
    padding: 15,
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#022C68",
  },
  ruleItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  ruleBullet: {
    fontSize: 11,
    color: "#7AFEC3",
    marginTop: 3,
  },
  ruleText: {
    flex: 1,
    fontSize: 13.5,
    color: "#7B8FC0",
    lineHeight: 20,
  },
  highlight: {
    color: "#D23838",
    fontWeight: "600",
  },

  /* History section */
  historySection: {
    marginHorizontal: 14,
    marginTop: 24,
  },
  historySectionIcon: {
    width: 22,
    height: 22,
  },
  historySectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  historySectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  historyList: { gap: 10, marginBottom: 14 },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0A1A45",
    borderRadius: 10,
    padding: 14,
  },
  historyItemAmount: { fontSize: 15, fontWeight: "700", color: "#fff" },
  historyItemDate: { fontSize: 12, color: "#92A8E3", marginTop: 2 },
  historyItemStatus: { fontSize: 13, fontWeight: "600" },
  noDataWrap: {
    alignItems: "center",
    paddingVertical: 10,
  },
  noDataText: { fontSize: 13.5, color: "#6F80A4", marginTop: 4 },
  allHistoryBtn: {
    marginTop: 10,
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7AFEC3",
  },
  allHistoryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7AFEC3",
  },

  /* USDT amount section */
  usdtHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  usdtHeaderIcon: {
    width: 22,
    height: 22,
  },
  usdtHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    fontStyle: "italic",
  },
  usdtInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1E52",
    borderRadius: 10,
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  usdtInputCurrency: {
    fontSize: 18,
    fontWeight: "600",
    color: "#92A8E3",
  },
  usdtInputIcon: {
    width: 22,
    height: 22,
  },
  usdtInput: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
  },
  usdtBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 14,
  },
  usdtBalanceText: {
    fontSize: 13,
    color: "#7AFEC3",
  },
  usdtBalanceAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7AFEC3",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: "#011341",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 0,
    width: "100%",
    alignItems: "center"
  },
  confettiContainer: {
    width: "100%",
    height: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
    marginBottom: 12,
  },
  confettiDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7AFEC3",
  },
  confettiLine: {
    position: "absolute",
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: "#7AFEC3",
  },
  confettiArc: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: "#7AFEC3",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#7AFEC3",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E2EEFC",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "BahnschriftBold",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#92A8E3",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    fontFamily: "BahnschriftRegular",
  },
  confirmButton: {
    width: "100%",
    height: 48,
    borderRadius: 100,
    overflow: "hidden"
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#05012B",
    fontFamily: "BahnschriftSemibold",
  },
});
