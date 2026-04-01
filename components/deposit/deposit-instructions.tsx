import { ThemedText } from "@/components/themed-text";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

const UPI_INSTRUCTIONS = [
  "If the transfer time is up, please fill out the deposit form again.",
  "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
  "If you transfer the wrong amount, our company will not be responsible for the lost amount!",
  "Note: do not cancel the deposit order after the money has been transferred.",
];

const USDT_INSTRUCTIONS = [
  "Minimum deposit: 10USDT , deposits less than 10USDT will not be credited",
  "Do not deposit any non-currency assets to the above address, or the assets will not be recovered.",
  "Please confirm that the operating environment is safe to avoid information being tampered with or leaked.",
  "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
  "Note: do not cancel the deposit order after the money has been transferred.",
];

type Props = { isUsdt: boolean };

export function DepositInstructions({ isUsdt }: Props) {
  const instructions = isUsdt ? USDT_INSTRUCTIONS : UPI_INSTRUCTIONS;

  return (
    <View style={styles.section}>
      <View style={styles.instructionsBox}>
        <View style={styles.sectionHeader}>
          <Image
            source={require("@/assets/icon-shuoming.svg")}
            style={{ width: 24, height: 24 }}
          />
          <ThemedText style={styles.sectionTitle}>
            Recharge instructions
          </ThemedText>
        </View>
        <View style={styles.instructionsList}>
          {instructions.map((text, i) => (
            <View key={i} style={styles.instructionItem}>
              <ThemedText style={styles.instructionBullet}>◆</ThemedText>
              <ThemedText style={styles.instructionText}>{text}</ThemedText>
            </View>
          ))}
        </View>
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
    fontFamily: "Inter_SemiBold_Italic",
    color: "#E3EFFF",
  },
  instructionsBox: {
    backgroundColor: "#011341",
    borderRadius: 10,
    padding: 10,
    paddingVertical: 14,
  },
  instructionsList: {
    gap: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#022c68",
    borderRadius: 10,
    padding: 10,
  },
  instructionItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  instructionBullet: {
    fontSize: 11,
    color: "#7AFEC3",
    marginTop: 3,
  },
  instructionText: {
    flex: 1,
    fontSize: 12.8,
    fontFamily: "Inter_Regular_Italic",
    color: "#92A8E3",
    lineHeight: 20,
  },
});
