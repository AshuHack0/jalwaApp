import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, TextInput, View, Pressable } from "react-native";
import { useInitiateDeposit } from "@/services/api/hooks/useDeposit";
import { useToast } from "@/contexts/ToastContext";
import { ThemedText } from "./themed-text";

const QUICK_AMOUNTS = [100, 300, 500, 1000, 5000];

type Props = {
  visible: boolean;
  onClose: () => void;
  preselectedAmount?: number;
};

export function DepositModal({
  visible,
  onClose,
  preselectedAmount,
}: Props) {
  const [amount, setAmount] = useState("");
  const { mutateAsync: initiateDeposit, isPending } = useInitiateDeposit();
  const { showToast } = useToast();

  useEffect(() => {
    if (visible) {
      setAmount(preselectedAmount ? String(preselectedAmount) : "");
    }
  }, [visible, preselectedAmount]);

  const handleQuickAmount = (value: number) => {
    setAmount(String(value));
  };

  const handleDeposit = async () => {
    const num = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (!num || num < 100) {
      showToast({ type: "error", title: "Invalid Amount", message: "Minimum deposit is ₹100." });
      return;
    }

    try {
      const res = await initiateDeposit(num);
      if (res.success && res.data?.payUrl) {
        const { Linking } = await import("react-native");
        await Linking.openURL(res.data.payUrl);
        onClose();
      } else {
        showToast({ type: "error", title: "Deposit Failed", message: res.message ?? "Please try again." });
      }
    } catch {
      showToast({ type: "error", title: "Deposit Failed", message: "Please try again." });
    }
  };

  const numAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={styles.modal}
        >
          <View style={styles.header}>
            <ThemedText style={styles.title}>Deposit</ThemedText>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <View style={styles.closeCircle}>
                <Ionicons name="close" size={18} color="#0a0e27" />
              </View>
            </Pressable>
          </View>

          <ThemedText style={styles.label}>Amount (₹)</ThemedText>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor="#6F80A4"
            keyboardType="number-pad"
            maxLength={10}
          />

          <ThemedText style={styles.quickLabel}>Quick select</ThemedText>
          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((value) => {
              const isSelected = numAmount === value;
              return (
                <Pressable
                  key={value}
                  style={[styles.quickButton, isSelected && styles.quickButtonActive]}
                  onPress={() => handleQuickAmount(value)}
                >
                  <ThemedText
                    style={[
                      styles.quickButtonText,
                      isSelected && styles.quickButtonTextActive,
                    ]}
                  >
                    ₹{value}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={handleDeposit}
            style={styles.depositButtonWrap}
            disabled={isPending || numAmount <= 0}
          >
            <LinearGradient
              colors={["#7AFEC3", "#02AFB6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.depositButton}
            >
              {isPending ? (
                <ActivityIndicator color="#05012B" />
              ) : (
                <ThemedText style={styles.depositButtonText}>Deposit</ThemedText>
              )}
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#0f1a3d",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: "#1F4293",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {},
  closeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    color: "#92A8E3",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(31, 66, 147, 0.4)",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#224BA2",
    marginBottom: 20,
  },
  quickLabel: {
    fontSize: 14,
    color: "#92A8E3",
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  quickButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#224BA2",
    backgroundColor: "rgba(31, 66, 147, 0.3)",
  },
  quickButtonActive: {
    borderColor: "#14B8A6",
    backgroundColor: "rgba(20, 184, 166, 0.2)",
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92A8E3",
  },
  quickButtonTextActive: {
    color: "#14B8A6",
  },
  depositButtonWrap: {
    borderRadius: 12,
    overflow: "hidden",
  },
  depositButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  depositButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#05012B",
  },
});
