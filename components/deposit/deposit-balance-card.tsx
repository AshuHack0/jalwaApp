import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View } from "react-native";

function formatBalance(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type Props = {
  walletBalance: number;
  onRefresh: () => void;
};

export function DepositBalanceCard({ walletBalance, onRefresh }: Props) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={styles.balanceCardContent}>
        <Image style={{ position: "absolute", height: "100%", width: "100%" }} source={{ uri: "https://www.jalwagame.win/assets/png/TotalAssetsBg-ad5afbbb.webp" }} />
        <View style={{ padding: 14 }}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceHeaderLeft}>
              <Image source={{ uri: "https://www.jalwagame.win/assets/png/balance-b2c8faab.webp" }} style={{ width: 16, aspectRatio: 1 }} />
              <ThemedText style={styles.balanceLabel}>Balance</ThemedText>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10 }}>
            <ThemedText style={styles.balanceAmount}>{formatBalance(walletBalance)}</ThemedText>
            <TouchableOpacity style={{ marginBottom: 20 }} onPress={onRefresh}>
              <Image source={{ uri: "https://www.jalwagame.win/assets/png/refresh-8e0efe26.webp" }} style={{ width: 23, height: 15 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCardContent: {
    height: 138,
    width: "100%",
    position: "relative",
    borderRadius: 10,
    overflow: "hidden"
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    zIndex: 100
  },
  balanceHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  walletEmoji: { fontSize: 18 },
  balanceLabel: {
    fontSize: 13,
    color: "black",
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardNumber: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 4,
  },
});
