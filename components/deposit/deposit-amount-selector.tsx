import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  isUsdt: boolean;
  quickAmounts: string[];
  usdtQuickAmounts: string[];
  selectedAmount: string;
  depositAmount: string;
  usdtInrAmount: string;
  usdtRate: number;
  placeholder: string;
  onSelectAmount: (amount: string) => void;
  onChangeDeposit: (val: string) => void;
  onClearDeposit: () => void;
  onChangeInr?: (val: string) => void;
};

export function DepositAmountSelector({
  isUsdt,
  quickAmounts,
  usdtQuickAmounts,
  selectedAmount,
  depositAmount,
  usdtInrAmount,
  usdtRate,
  placeholder,
  onSelectAmount,
  onChangeDeposit,
  onClearDeposit,
}: Props) {
  const amounts = isUsdt ? usdtQuickAmounts : quickAmounts;

  return (
    <View style={styles.section}>
      <View style={styles.depositAmountInner}>
        <View style={styles.sectionHeader}>




          {!isUsdt ? (
            <Image source={require("@/assets/icon-saveWallet.svg")} style={{ width: 24, height: 24 }} />
          ) : (
            <Image source={{ uri: "https://www.jalwagame.win/assets/png/usdt-40311708.webp" }} style={{ width: 24, height: 24 }} />
          )}

          <ThemedText style={styles.sectionTitle}>
            {isUsdt ? "Select amount of USDT" : "Deposit amount"}
          </ThemedText>
        </View>

        <View style={styles.amountGrid}>
          {amounts.map((amount) => {
            const isActive = selectedAmount === amount;
            return (
              <TouchableOpacity
                key={amount}
                style={[styles.amountButton, isActive && styles.amountButtonActive]}
                onPress={() => onSelectAmount(amount)}
              >
                {isActive ? (
                  <LinearGradient
                    colors={["#7AFEC3", "#02AFB6"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.amountButtonGradient}
                  >
                    {isUsdt ? (
                      <View style={styles.usdtAmountIcon}>
                        <Image source={{ uri: "https://www.jalwagame.win/assets/png/usdt-40311708.webp" }} style={{ width: 19, height: 19 }} />
                      </View>
                    ) : (
                      <ThemedText style={[styles.amountRupee, { color: "white" }]}>₹</ThemedText>
                    )}
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <ThemedText style={[styles.amountValue, { color: "#000" }]}>{amount}</ThemedText>
                    </View>
                  </LinearGradient>
                ) : (
                  <>
                    {isUsdt ? (
                      <View style={styles.usdtAmountIcon}>
                        <Image source={{ uri: "https://www.jalwagame.win/assets/png/usdt-40311708.webp" }} style={{ width: 19, height: 19 }} />
                      </View>
                    ) : (
                      <ThemedText style={styles.amountRupee}>₹</ThemedText>
                    )}
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <ThemedText style={styles.amountValue}>{amount}</ThemedText>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.amountInputContainer}>
          {isUsdt ? (
            <View style={styles.usdtInputIcon}>
              <Image source={{ uri: "https://www.jalwagame.win/assets/png/usdt-40311708.webp" }} style={{ width: 19, height: 19 }} />
            </View>
          ) : (
            <ThemedText style={styles.currencySymbol}>₹</ThemedText>
          )}
          <View style={styles.inputDivider} />
          <TextInput
            style={[styles.amountInput, { fontWeight: depositAmount.length > 0 ? "bold" : "normal" }]}
            placeholder={isUsdt ? "Please enter UDST amount" : placeholder}
            placeholderTextColor="#92A8E3"
            value={depositAmount}
            onChangeText={onChangeDeposit}
            keyboardType="numeric"
          />
          {depositAmount.length > 0 && (
            <TouchableOpacity onPress={onClearDeposit}>
              <Ionicons name="close-circle-outline" size={22} color="#606062" />
            </TouchableOpacity>
          )}
        </View>

        {isUsdt && (
          <>
            
            <View style={[styles.amountInputContainer, { marginTop: 6 }]}>
              <ThemedText style={styles.currencySymbol}>₹</ThemedText>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.amountInput}
                placeholder="INR equivalent"
                placeholderTextColor="#92A8E3"
                value={usdtInrAmount}
                editable={false}
                keyboardType="numeric"
              />
            </View>
          </>
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
    fontSize: 17,
    fontWeight: "500",
    color: "#E3EFFF",
  },
  depositAmountInner: {
    backgroundColor: "#011341",
    borderRadius: 10,
    padding: 10,
    paddingVertical: 14
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  amountButton: {
    width: "30.5%",
    borderWidth: 1,
    borderColor: "#022c68",
    borderRadius: 4,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  amountButtonActive: {
    borderWidth: 0,
    borderColor: "transparent",
  },
  amountButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    margin: -4,
    padding: 4,
    borderRadius: 4,
  },
  amountRupee: {
    fontSize: 17,
    color: "#6f80a4",
    fontWeight: "600",
  },
  amountValue: {
    fontSize: 17,
    color: "#7AFEC3",
    fontWeight: "500",
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
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 2,
    gap: 10,
  },
  inputDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#92A8E3",
  },
  currencySymbol: {
    fontSize: 18,
    width: 28,
    textAlign:"center",
    fontWeight: "700",
    color: "#7AFEC3",
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#00ECBE",
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
  rateLabel: {
    fontSize: 12,
    color: "#7AFEC3",
    marginTop: 8,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
});
