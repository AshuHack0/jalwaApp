import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  isUsdt: boolean;
  quickAmounts: string[];
  usdtQuickAmounts: string[];
  selectedAmount: string;
  depositAmount: string;
  usdtInrAmount: string;
  placeholder: string;
  onSelectAmount: (amount: string) => void;
  onChangeDeposit: (val: string) => void;
  onClearDeposit: () => void;
  onChangeInr: (val: string) => void;
};

export function DepositAmountSelector({
  isUsdt,
  quickAmounts,
  usdtQuickAmounts,
  selectedAmount,
  depositAmount,
  usdtInrAmount,
  placeholder,
  onSelectAmount,
  onChangeDeposit,
  onClearDeposit,
  onChangeInr,
}: Props) {
  const amounts = isUsdt ? usdtQuickAmounts : quickAmounts;

  return (
    <View style={styles.section}>
      <View style={styles.depositAmountInner}>
        <View style={styles.sectionHeader}>
          <Image
            source={require("../../assets/rechargeIcon-efb79f43.webp")}
            style={styles.sectionIconImg}
          />
          <ThemedText style={styles.sectionTitle}>
            {isUsdt ? "Select amount of USDT" : "Deposit amount"}
          </ThemedText>
        </View>

        <View style={styles.amountGrid}>
          {amounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[styles.amountButton, selectedAmount === amount && styles.amountButtonActive]}
              onPress={() => onSelectAmount(amount)}
            >
              {isUsdt ? (
                <View style={styles.usdtAmountIcon}>
                  <ThemedText style={styles.usdtAmountIconText}>₮</ThemedText>
                </View>
              ) : (
                <ThemedText style={styles.amountRupee}>₹</ThemedText>
              )}
              <ThemedText style={styles.amountValue}>{amount}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.amountInputContainer}>
          {isUsdt ? (
            <View style={styles.usdtInputIcon}>
              <ThemedText style={styles.usdtInputIconText}>₮</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.currencySymbol}>₹</ThemedText>
          )}
          <View style={styles.inputDivider} />
          <TextInput
            style={styles.amountInput}
            placeholder={isUsdt ? "Please enter UDST amount" : placeholder}
            placeholderTextColor="#92A8E3"
            value={depositAmount}
            onChangeText={onChangeDeposit}
            keyboardType="numeric"
          />
          {depositAmount.length > 0 && (
            <TouchableOpacity onPress={onClearDeposit}>
              <Ionicons name="close-circle-outline" size={22} color="#92A8E3" />
            </TouchableOpacity>
          )}
        </View>

        {isUsdt && (
          <View style={[styles.amountInputContainer, { marginTop: 10 }]}>
            <ThemedText style={styles.currencySymbol}>₹</ThemedText>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.amountInput}
              placeholder="Please enter the amount"
              placeholderTextColor="#92A8E3"
              value={usdtInrAmount}
              onChangeText={onChangeInr}
              keyboardType="numeric"
            />
          </View>
        )}
      </View>
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
  sectionIconImg: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  depositAmountInner: {
    backgroundColor: "#0D1B4B",
    borderRadius: 14,
    padding: 16,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  amountButton: {
    width: "30.5%",
    backgroundColor: "#05012B",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  amountButtonActive: {
    borderWidth: 1,
    borderColor: "#7AFEC3",
  },
  amountRupee: {
    fontSize: 13,
    color: "#7AFEC3",
    fontWeight: "600",
  },
  amountValue: {
    fontSize: 13,
    color: "#7AFEC3",
    fontWeight: "600",
  },
  usdtAmountIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#26A17B",
    alignItems: "center",
    justifyContent: "center",
  },
  usdtAmountIconText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#05012B",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  inputDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#92A8E3",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7AFEC3",
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    color: "#92A8E3",
  },
  usdtInputIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#26A17B",
    alignItems: "center",
    justifyContent: "center",
  },
  usdtInputIconText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});
