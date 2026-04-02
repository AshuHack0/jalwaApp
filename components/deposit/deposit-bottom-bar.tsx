import { ThemedText } from "@/components/themed-text";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  rechargeMethod: string;
  isPending: boolean;
  isDisabled: boolean;
  onDeposit: () => void;
};

export function DepositBottomBar({
  rechargeMethod,
  isPending,
  isDisabled,
  onDeposit,
}: Props) {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarLeft}>
        <ThemedText style={styles.rechargeMethodLabel}>
          Recharge Method:
        </ThemedText>
        <ThemedText style={styles.rechargeMethodValue}>
          {rechargeMethod}
        </ThemedText>
      </View>
      <TouchableOpacity
        style={[
          styles.depositButton,
          isDisabled && styles.depositButtonDisabled,
        ]}
        onPress={onDeposit}
        disabled={isDisabled}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.depositButtonText}>Deposit</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#05012B",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#0D1B4B",
  },
  bottomBarLeft: { flex: 1 },
  rechargeMethodLabel: {
    fontSize: 10.8,
    color: "#ffffff",
    fontFamily: "Inter_Regular",
  },
  rechargeMethodValue: {
    fontSize: 11.8,
    fontFamily: "Inter_SemiBold",
    color: "#fff",
    marginTop: 2,
  },
  depositButton: {
    backgroundColor: "#7AFEC3",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  depositButtonDisabled: { backgroundColor: "#3A4A6B" },
  depositButtonText: {
    fontSize: 14,
    fontFamily: "Inter_Regular",
    color: "#05012B",
  },
});
