import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
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
    <LinearGradient
      colors={["#7AFEC3", "#02AFB6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      <View style={styles.balanceCardContent}>
        <View style={styles.balanceHeader}>
          <View style={styles.balanceHeaderLeft}>
            <ThemedText style={styles.walletEmoji}>🏅</ThemedText>
            <ThemedText style={styles.balanceLabel}>Balance</ThemedText>
          </View>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.balanceAmount}>{formatBalance(walletBalance)}</ThemedText>
        <View style={styles.cardFooter}>
          <Ionicons name="card-outline" size={28} color="rgba(255,255,255,0.7)" />
          <ThemedText style={styles.cardNumber}>**** &nbsp;&nbsp; ****</ThemedText>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  balanceCardContent: {
    padding: 20,
    paddingBottom: 16,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  walletEmoji: { fontSize: 18 },
  balanceLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
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
