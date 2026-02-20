import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { deposit } from "@/services/api/promotion";
import { authKeys } from "@/services/api/hooks/useAuth";
import { promotionKeys } from "@/services/api/hooks/useFirstDepositBonus";
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
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

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
    if (num <= 0) return;

    setLoading(true);
    try {
      const res = await deposit(num);
      if (res.success && res.data) {
        await queryClient.invalidateQueries({ queryKey: authKeys.all });
        await queryClient.invalidateQueries({ queryKey: promotionKeys.firstDepositBonus() });
        onClose();
      } else {
        Alert.alert("Deposit failed", res.message ?? "Please try again.");
      }
    } catch {
      Alert.alert("Deposit failed", "Please try again.");
    } finally {
      setLoading(false);
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
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.modal}
        >
          <View style={styles.header}>
            <ThemedText style={styles.title}>Deposit</ThemedText>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <View style={styles.closeCircle}>
                <Ionicons name="close" size={18} color="#0a0e27" />
              </View>
            </TouchableOpacity>
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
                <TouchableOpacity
                  key={value}
                  style={[styles.quickButton, isSelected && styles.quickButtonActive]}
                  onPress={() => handleQuickAmount(value)}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    style={[
                      styles.quickButtonText,
                      isSelected && styles.quickButtonTextActive,
                    ]}
                  >
                    ₹{value}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleDeposit}
            activeOpacity={0.8}
            style={styles.depositButtonWrap}
            disabled={loading || numAmount <= 0}
          >
            <LinearGradient
              colors={["#7AFEC3", "#02AFB6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.depositButton}
            >
              {loading ? (
                <ActivityIndicator color="#05012B" />
              ) : (
                <ThemedText style={styles.depositButtonText}>Deposit</ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
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
