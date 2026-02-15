import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Polygon } from "react-native-svg";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import {
  WINGO_MULTIPLIERS,
  BET_SELECTION_MAP,
  BET_SELECTION_NUMBER_MAP,
} from "@/constants/Wingo";

const BALANCE_AMOUNTS = [1, 10, 100, 1000];

function getBetSelectionColors(selection: string): string[] {
  const key = selection.toLowerCase();
  const colorMapEntry = BET_SELECTION_MAP[key as keyof typeof BET_SELECTION_MAP];
  if (colorMapEntry) return [colorMapEntry];
  const numberColors = BET_SELECTION_NUMBER_MAP[key as keyof typeof BET_SELECTION_NUMBER_MAP];
  if (numberColors) return numberColors;
  return ["#14B8A6"];
}
const MULTIPLIERS = WINGO_MULTIPLIERS.map((value) => `X${value}`);

function getMultiplierValue(mult: string): number {
  return parseInt(mult.replace("X", ""), 10);
}

export interface BetModalProps {
  visible: boolean;
  gameName: string;
  betSelection: string;
  selectedBalanceAmount: number;
  betQuantity: number;
  selectedMultiplier: string;
  agreed: boolean;
  totalBetAmount: number;
  onClose: () => void;
  onBalanceAmountChange: (amount: number) => void;
  onQuantityChange: (quantity: number) => void;
  onMultiplierChange: (multiplier: string) => void;
  onAgreedChange: (agreed: boolean) => void;
  onConfirm: () => void | Promise<void>;
  confirmLoading?: boolean;
}

export function BetModal({
  visible,
  gameName,
  betSelection,
  selectedBalanceAmount,
  betQuantity,
  selectedMultiplier,
  agreed,
  totalBetAmount,
  onClose,
  onBalanceAmountChange,
  onQuantityChange,
  onMultiplierChange,
  onAgreedChange,
  onConfirm,
  confirmLoading = false,
}: BetModalProps) {
  const handleMultiplierPress = (mult: string) => {
    onMultiplierChange(mult);
    onQuantityChange(getMultiplierValue(mult));
  };

  const headerColors = getBetSelectionColors(betSelection);
  const hasGradient = headerColors.length > 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.overlay} edges={[]}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <View style={styles.headerWrapper}>
          <MaskedView
            style={styles.header}
            maskElement={
              <View style={styles.headerMask}>
                <Svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <Polygon
                    fill="white"
                    points="0,0 100,0 100,70 50,100 0,70"
                  />
                </Svg>
              </View>
            }
          >
            {hasGradient ? (
              <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={[headerColors[0], headerColors[1]]}
                locations={[0.5, 0.5]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.11, y: 1.7 }}
              />
            ) : (
              <View style={[styles.headerBackground, { backgroundColor: headerColors[0] }]} />
            )}
            <View style={styles.headerContent}>
              <ThemedText style={styles.title}>{gameName}</ThemedText>
              <View style={styles.selectionBox}>
                <ThemedText style={styles.selectionText}>
                  Select {betSelection}
                </ThemedText>
              </View>
            </View>
          </MaskedView>
          </View>

          {/* Modal Body */}
          <View style={styles.body}>
            {/* Balance */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <ThemedText style={{ fontSize: 18, fontWeight: "500", color: "#E3EFFF" }}>Balance</ThemedText>
              <View style={{ flexDirection: "row", gap: 6 }}>
                {BALANCE_AMOUNTS.map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[
                      {paddingHorizontal: 12, paddingVertical: 4, backgroundColor: "#05012B", alignItems: "center", justifyContent: "center", borderRadius: 6 },
                      selectedBalanceAmount === amt && { backgroundColor: headerColors[0], borderRadius: 0 },
                    ]}
                    onPress={() => onBalanceAmountChange(amt)}
                  >
                    <ThemedText
                      style={[
                        { fontSize: 15, fontWeight: "500", color: "#92A8E3" },
                        selectedBalanceAmount === amt &&
                          { color: "white" },
                      ]}
                    >
                      {amt}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quantity */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
              <ThemedText style={{ fontSize: 18, fontWeight: "500", color: "#E3EFFF" }}>Quantity</ThemedText>
              <View style={{ flexDirection: "row", gap: 14 }}>
                <TouchableOpacity
                  style={[styles.quantityBtn, { backgroundColor: headerColors[0] }]}
                  onPress={() =>
                    onQuantityChange(Math.max(1, betQuantity - 1))
                  }
                >
                  <ThemedText style={styles.quantityBtnText}>-</ThemedText>
                </TouchableOpacity>
                <View style={styles.quantityValue}>
                  <ThemedText style={styles.quantityText}>{betQuantity}</ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.quantityBtn, { backgroundColor: headerColors[0] }]}
                  onPress={() => onQuantityChange(betQuantity + 1)}
                >
                  <ThemedText style={styles.quantityBtnText}>+</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Multipliers */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 14, justifyContent:"flex-end" }}>
              {MULTIPLIERS.map((mult) => (
                <TouchableOpacity
                  key={mult}
                  style={[
                    {paddingVertical: 6, paddingHorizontal: 14, borderRadius: 5, backgroundColor: "#05012B" },
                    selectedMultiplier === mult && { backgroundColor: headerColors[0], borderRadius: 0 },
                  ]}
                  onPress={() => handleMultiplierPress(mult)}
                >
                  <ThemedText
                    style={[
                      { fontSize: 14, fontWeight: "600", color: "#92A8E3" },
                      selectedMultiplier === mult &&
                        { color: "white" },
                    ]}
                  >
                    {mult}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Agreement */}
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", marginTop: 14 }}
              onPress={() => onAgreedChange(!agreed)}
            >
              <View
                style={[
                  { width: 20, height: 20, borderRadius: 50, borderWidth: 1, borderColor: "#92A8E3", alignItems: "center", justifyContent: "center", marginRight: 8 },
                  agreed && { backgroundColor: "#00ECBE", borderWidth:0},
                ]}
              >
                {agreed && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <ThemedText style={{ fontSize: 14, fontWeight: "500", color: "#92A8E3", marginRight: 2 }}>I agree </ThemedText>
              <ThemedText style={{ fontSize: 14, fontWeight: "500", color: "#Fd565d" }}>《Pre-sale rules》</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Modal Footer */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 10, backgroundColor: "#05012B", alignItems: "center" }}
              onPress={onClose}
            >
              <ThemedText style={{ fontSize: 16, fontWeight: "600", color: "#92A8E3" }}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                { flex: 2, paddingVertical: 10, backgroundColor: headerColors[0], alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
                !agreed && { backgroundColor: headerColors[0], opacity: 0.7 },
              ]}
              onPress={() => {
                if (!agreed || confirmLoading) return;
                onConfirm();
              }}
              disabled={!agreed || confirmLoading}
            >
              {confirmLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : null}
              <ThemedText
                style={[
                  { fontSize: 16, fontWeight: "600", color: "#fff" },
                  !agreed && { color: "#94a3b8" },
                ]}
              >
                Total amount ₹{totalBetAmount.toFixed(2)}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#011341",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  headerWrapper: {
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    minHeight: 130,
    paddingHorizontal: 50,
  },
  headerMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#14B8A6",
  },
  headerContent: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  selectionBox: {
    backgroundColor: "#fff",
    marginTop: 6,
    height: 29,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "black"
  },
  body: {
    padding: 20,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    gap: 10,
  },
  amountButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#05012B",
    alignItems: "center",
  },
  amountButtonActive: {
    backgroundColor: "#17B15E",
  },
  amountText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#92A8E3",
  },
  amountTextActive: {
    color: "#fff",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityBtn: {
    height:32,
    width:28,
    borderRadius: 5,
    backgroundColor: "#17B15E",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "black",
  },
  quantityValue: {
    width:90,
    height:33,
    backgroundColor: "#05012B",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  multiplierRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  multiplierBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#05012B",
  },
  multiplierBtnActive: {
    backgroundColor: "#17B15E",
  },
  multiplierText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92A8E3",
  },
  multiplierTextActive: {
    color: "#fff",
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#92A8E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#17B15E",
    borderColor: "#17B15E",
  },
  agreementText: {
    fontSize: 14,
    color: "#fff",
  },
  rulesLink: {
    fontSize: 14,
    color: "#EF4444",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#05012B",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#17B15E",
    alignItems: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: "#334155",
    opacity: 0.7,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  confirmTextDisabled: {
    color: "#94a3b8",
  },
});
