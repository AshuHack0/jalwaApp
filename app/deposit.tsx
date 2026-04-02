import { ArPayTab } from "@/components/deposit/ar-pay-tab";
import { DepositAmountSelector } from "@/components/deposit/deposit-amount-selector";
import { DepositBalanceCard } from "@/components/deposit/deposit-balance-card";
import { DepositBottomBar } from "@/components/deposit/deposit-bottom-bar";
import { DepositChannelSelector } from "@/components/deposit/deposit-channel-selector";
import { DepositHistoryPreview } from "@/components/deposit/deposit-history-preview";
import { DepositInstructions } from "@/components/deposit/deposit-instructions";
import { DepositMethodTabs } from "@/components/deposit/deposit-method-tabs";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import {
  useInitiateDeposit,
  useInitiateUsdtDeposit,
} from "@/services/api/hooks/useDeposit";
import { initiateOxoxmgDeposit } from "@/services/api/oxoxmgDeposit";
import type { UsdtNetwork } from "@/services/api/usdtDeposit";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
type Channel = {
  id: string;
  label: string;
  balance: string;
  quickAmounts: string[];
  placeholder: string;
};

type MethodConfig = {
  channels: Channel[];
};

const METHOD_CONFIG: Record<string, MethodConfig> = {
  "UPI-QR": {
    channels: [
      {
        id: "Phonepe_QR",
        label: "Phonepe_QR",
        balance: "Balance:100 - 50K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "1.1K",
          "1.5K",
          "3K",
          "5K",
        ],
        placeholder: "₹100.00 - ₹50,000.00",
      },
    ],
  },
  "Innate UPI-QR": {
    channels: [
      {
        id: "UPI-QR",
        label: "UPI-QR",
        balance: "Balance:100 - 50K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "1.1K",
          "1.5K",
          "3K",
          "5K",
        ],
        placeholder: "₹100.00 - ₹50,000.00",
      },
      {
        id: "YayaPay-QR",
        label: "YayaPay-QR",
        balance: "Balance:100 - 50K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "1.1K",
          "1.5K",
          "3K",
          "5K",
        ],
        placeholder: "₹100.00 - ₹50,000.00",
      },
      {
        id: "WePay-QR",
        label: "WePay-QR",
        balance: "Balance:100 - 10K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "2K",
          "3K",
          "5K",
          "8K",
          "10K",
        ],
        placeholder: "₹100.00 - ₹10,000.00",
      },
      {
        id: "MagicPay-QR",
        label: "MagicPay-QR",
        balance: "Balance:100 - 50K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "1.1K",
          "1.5K",
          "3K",
          "5K",
        ],
        placeholder: "₹100.00 - ₹50,000.00",
      },
      {
        id: "WPay-QR",
        label: "WPay-QR",
        balance: "Balance:200 - 50K",
        quickAmounts: ["200", "300", "500", "1K", "1.1K", "1.5K", "3K", "5K"],
        placeholder: "₹200.00 - ₹50,000.00",
      },
      {
        id: "Super-QR",
        label: "Super-QR",
        balance: "Balance:200 - 50K",
        quickAmounts: ["200", "300", "500", "1K", "1.1K", "1.5K", "3K", "5K"],
        placeholder: "₹200.00 - ₹50,000.00",
      },
      {
        id: "UpiPayINR",
        label: "UpiPayINR",
        balance: "Balance:100 - 10K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "2K",
          "3K",
          "5K",
          "8K",
          "10K",
        ],
        placeholder: "₹100.00 - ₹10,000.00",
      },
      {
        id: "MovPay-QR",
        label: "MovPay-QR",
        balance: "Balance:200 - 20K",
        quickAmounts: ["200", "300", "500", "1K", "2K", "5K", "10K", "20K"],
        placeholder: "₹200.00 - ₹20,000.00",
      },
      {
        id: "VstarPay-QR",
        label: "VstarPay-QR",
        balance: "Balance:200 - 10K",
        quickAmounts: ["200", "300", "500", "1K", "2K", "3K", "5K", "10K"],
        placeholder: "₹200.00 - ₹10,000.00",
      },
      {
        id: "Rspay-QR",
        label: "Rspay-QR",
        balance: "Balance:200 - 50K",
        quickAmounts: ["200", "300", "500", "1K", "1.1K", "1.5K", "3K", "5K"],
        placeholder: "₹200.00 - ₹50,000.00",
      },
      {
        id: "DiDiPayINR-Wake",
        label: "DiDiPayINR-Wake",
        balance: "Balance:100 - 50K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "1.1K",
          "1.5K",
          "3K",
          "5K",
        ],
        placeholder: "₹100.00 - ₹50,000.00",
      },
      {
        id: "NinePay-QR",
        label: "NinePay-QR",
        balance: "Balance:100 - 50K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "1.1K",
          "1.5K",
          "3K",
          "5K",
        ],
        placeholder: "₹100.00 - ₹50,000.00",
      },
      {
        id: "Cloudspay-QR",
        label: "Cloudspay-QR",
        balance: "Balance:100 - 50K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "1.1K",
          "1.5K",
          "3K",
          "5K",
        ],
        placeholder: "₹100.00 - ₹50,000.00",
      },
    ],
  },
  PAYTM: {
    channels: [
      {
        id: "PAYTM-WePay",
        label: "PAYTM-WePay",
        balance: "Balance:100 - 10K",
        quickAmounts: [
          "100",
          "300",
          "500",
          "800",
          "1K",
          "2K",
          "3K",
          "5K",
          "6K",
          "8K",
          "9K",
          "10K",
        ],
        placeholder: "₹100.00 - ₹10,000.00",
      },
    ],
  },
  "Expert UPI-QR": {
    channels: [
      {
        id: "Expert_QR1",
        label: "Expert_QR1",
        balance: "Balance:100 - 50K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "1.1K",
          "1.5K",
          "3K",
          "5K",
        ],
        placeholder: "₹100.00 - ₹50,000.00",
      },
      {
        id: "Expert_QR2",
        label: "Expert_QR2",
        balance: "Balance:200 - 50K",
        quickAmounts: ["200", "300", "500", "1K", "1.1K", "1.5K", "3K", "5K"],
        placeholder: "₹200.00 - ₹50,000.00",
      },
      {
        id: "Expert_QR3",
        label: "Expert_QR3",
        balance: "Balance:100 - 30K",
        quickAmounts: [
          "100",
          "200",
          "300",
          "500",
          "1K",
          "2K",
          "5K",
          "10K",
          "20K",
          "30K",
        ],
        placeholder: "₹100.00 - ₹30,000.00",
      },
    ],
  },
};

const DEPOSIT_METHODS = [
  {
    id: "UPI-QR",
    label: "UPI-QR",
    icon: "UPI",
    image:
      "https://jalwaimg.jalwa-jalwa.com/Jalwa/payNameIcon/payNameIcon2_20250715163245arvw.png",
    enabled: true,
  },
  {
    id: "Innate UPI-QR",
    label: "Innate UPI-QR",
    icon: "UPI",
    image:
      "https://jalwaimg.jalwa-jalwa.com/Jalwa/payNameIcon/payNameIcon2_20250715163255fvu3.png",
    enabled: true,
  },
  {
    id: "PAYTM",
    label: "PAYTM",
    icon: "PAYTM",
    image:
      "https://jalwaimg.jalwa-jalwa.com/Jalwa/payNameIcon/payNameIcon_202507151825149rk6.png",
    enabled: true,
  },
  {
    id: "Expert UPI-QR",
    label: "Expert UPI-QR",
    icon: "UPI",
    image:
      "https://jalwaimg.jalwa-jalwa.com/Jalwa/payNameIcon/payNameIcon_20250715163305bo2u.png",
    enabled: true,
  },
  {
    id: "USDT",
    label: "USDT",
    icon: "USDT",
    image:
      "https://jalwaimg.jalwa-jalwa.com/Jalwa/payNameIcon/payNameIcon_20250317165636a3yk.png",
    enabled: true,
  },
  {
    id: "ARPay",
    label: "ARPay",
    icon: "ARPay",
    image:
      "https://jalwaimg.jalwa-jalwa.com/Jalwa/payNameIcon/payNameIcon_202503171657306civ.png",
    bonus: "+2%",
    enabled: true,
  },
];

const USDT_NETWORKS: { id: UsdtNetwork; label: string; balance: string }[] = [
  { id: "TRC20", label: "USDT-4", balance: "Balance:10 - 100K" },
];

const USDT_QUICK_AMOUNTS = [
  "10",
  "50",
  "100",
  "500",
  "1K",
  "5K",
  "8K",
  "10K",
  "30K",
  "50K",
  "80K",
  "100K",
];

export default function DepositScreen() {
  const [loaded] = useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  });
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  const [interLoaded] = useInter({
    Inter_Regular: Inter_400Regular,
    Inter_SemiBold: Inter_600SemiBold,
  });
  const router = useRouter();
  const { amount: amountParam } = useLocalSearchParams<{ amount?: string }>();
  const { walletBalance, refreshWallet } = useAuth();
  const { mutateAsync: initiateDeposit, isPending } = useInitiateDeposit();
  const { mutateAsync: initiateUsdtDeposit, isPending: isUsdtPending } =
    useInitiateUsdtDeposit();

  const [selectedMethod, setSelectedMethod] = useState<string>("UPI-QR");
  const [selectedChannel, setSelectedChannel] = useState<string>("Phonepe_QR");
  const [selectedNetwork, setSelectedNetwork] = useState<UsdtNetwork>("TRC20");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [usdtInrAmount, setUsdtInrAmount] = useState<string>("");
  const [usdtRate, setUsdtRate] = useState<number>(0);

  useEffect(() => {
    if (amountParam) setDepositAmount(amountParam);
  }, [amountParam]);

  useEffect(() => {
    const fetchUsdtRate = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr",
        );
        const data = await res.json();
        if (data?.tether?.inr) setUsdtRate(data.tether.inr);
      } catch {}
    };
    fetchUsdtRate();
    const interval = setInterval(fetchUsdtRate, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedMethod === "USDT" && depositAmount && usdtRate > 0) {
      const usdt = parseFloat(depositAmount);
      if (!isNaN(usdt)) {
        setUsdtInrAmount((usdt * usdtRate).toFixed(2));
      } else {
        setUsdtInrAmount("");
      }
    } else if (!depositAmount) {
      setUsdtInrAmount("");
    }
  }, [depositAmount, usdtRate, selectedMethod]);

  const isUsdt = selectedMethod === "USDT";
  const isArPay = selectedMethod === "ARPay";

  const currentConfig = METHOD_CONFIG[selectedMethod];
  const currentChannels: Channel[] = currentConfig?.channels ?? [];
  const currentChannelConfig = currentChannels.find(
    (c) => c.id === selectedChannel,
  );
  const quickAmounts: string[] = currentChannelConfig?.quickAmounts ?? [
    "100",
    "200",
    "300",
    "500",
    "1K",
    "1.1K",
    "1.5K",
    "3K",
    "5K",
  ];
  const amountPlaceholder: string =
    currentChannelConfig?.placeholder ?? "₹100.00 - ₹50,000.00";

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId);
    const firstChannel = METHOD_CONFIG[methodId]?.channels?.[0]?.id ?? "";
    setSelectedChannel(firstChannel);
    setSelectedAmount("");
    setDepositAmount("");
  };

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    let numeric = amount;
    if (amount === "1K") numeric = "1000";
    else if (amount === "1.1K") numeric = "1100";
    else if (amount === "1.5K") numeric = "1500";
    else if (amount.endsWith("K")) numeric = String(parseFloat(amount) * 1000);
    setDepositAmount(numeric);
  };

  const handleDeposit = async () => {
    const num = parseFloat(depositAmount.replace(/[^0-9.]/g, ""));
    if (!num || num <= 0) {
      Alert.alert(
        "Invalid amount",
        isUsdt ? "Enter a USDT amount." : "Minimum deposit is ₹100.",
      );
      return;
    }
    if (!isUsdt && num < 100) {
      Alert.alert("Invalid amount", "Minimum deposit is ₹100.");
      return;
    }
    try {
      if (isUsdt) {
        const res = await initiateUsdtDeposit({
          amount: num,
          network: selectedNetwork,
        });
        if (res.success && res.data) {
          await Linking.openURL(res.data.address);
          router.push({
            pathname: "/deposit/usdt-status/[merchantOrderNo]" as any,
            params: { merchantOrderNo: res.data.merchantOrderNo },
          });
        } else {
          Alert.alert("Deposit failed", res.message ?? "Please try again.");
        }
        return;
      }
      const isOxoxmg = selectedMethod === "PAYTM" || selectedMethod === "Expert UPI-QR";
      const res = isOxoxmg
        ? await initiateOxoxmgDeposit(num)
        : await initiateDeposit(num);
      if (res.success && res.data?.payUrl) {
        await Linking.openURL(res.data.payUrl);
        router.push({
          pathname: isOxoxmg
            ? "/deposit/oxoxmg-status/[merchantOrderNo]"
            : "/deposit/status/[merchantOrderNo]",
          params: { merchantOrderNo: res.data.merchantOrderNo },
        } as any);
      } else {
        Alert.alert("Deposit failed", res.message ?? "Please try again.");
      }
    } catch {
      Alert.alert("Deposit failed", "Please try again.");
    }
  };

  const rechargeMethod = isArPay
    ? "ArbPayINR"
    : isUsdt
      ? "USDT-4"
      : selectedChannel;
  const isDepositDisabled = isPending || isUsdtPending || isArPay;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.screenTitle}>Deposit</ThemedText>
          <TouchableOpacity
            onPress={() => router.push("/deposit-history")}
            style={styles.historyButton}
          >
            <ThemedText style={styles.historyButtonText}>
              Deposit history
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DepositBalanceCard
            walletBalance={walletBalance}
            onRefresh={refreshWallet}
          />

          <DepositMethodTabs
            methods={DEPOSIT_METHODS}
            selectedMethod={selectedMethod}
            onSelect={handleMethodChange}
          />

          {isArPay ? (
            <ArPayTab />
          ) : (
            <>
              <DepositChannelSelector
                isUsdt={isUsdt}
                channels={currentChannels}
                selectedChannel={selectedChannel}
                onSelectChannel={setSelectedChannel}
                usdtChannels={USDT_NETWORKS}
                selectedNetwork={selectedNetwork}
                onSelectNetwork={setSelectedNetwork}
              />

              <DepositAmountSelector
                isUsdt={isUsdt}
                quickAmounts={quickAmounts}
                usdtQuickAmounts={USDT_QUICK_AMOUNTS}
                selectedAmount={selectedAmount}
                depositAmount={depositAmount}
                usdtInrAmount={usdtInrAmount}
                usdtRate={usdtRate}
                placeholder={amountPlaceholder}
                onSelectAmount={handleAmountSelect}
                onChangeDeposit={setDepositAmount}
                onClearDeposit={() => {
                  setDepositAmount("");
                  setSelectedAmount("");
                }}
                onChangeInr={setUsdtInrAmount}
              />

              <DepositInstructions isUsdt={isUsdt} />

              <DepositHistoryPreview />
            </>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        <DepositBottomBar
          rechargeMethod={rechargeMethod}
          isPending={isPending || isUsdtPending}
          isDisabled={isDepositDisabled}
          onDeposit={handleDeposit}
        />
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
    paddingBottom: 20,
    paddingTop: 100,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#05012B",
  },
  backButton: { padding: 4 },
  screenTitle: {
    fontSize: 17.2,
    fontFamily: "Inter_Regular",
    color: "#fff",
    textAlign: "center",
    marginLeft: 70,
  },
  historyButton: { padding: 4 },
  historyButtonText: {
    fontFamily: "Inter_Regular",
    fontSize: 11.8,
    color: "white",
  },
});
