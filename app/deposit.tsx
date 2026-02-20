import { useAuth } from "@/contexts/AuthContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput } from "react-native";

function formatBalance(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export default function DepositScreen() {
  const router = useRouter();
  const { walletBalance, refreshWallet } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>("UPI-QR");
  const [selectedChannel, setSelectedChannel] = useState<string>("Phonepe_QR");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<string>("");

  const depositMethods = [
    { id: "UPI-QR", label: "UPI-QR", icon: "UPI" },
    { id: "Innate UPI-QR", label: "Innate UPI-QR", icon: "UPI" },
    { id: "PAYTM", label: "PAYTM", icon: "PAYTM" },
    { id: "Expert UPI-QR", label: "Expert UPI-QR", icon: "UPI" },
    { id: "USDT", label: "USDT", icon: "USDT" },
    { id: "ARPay", label: "ARPay", icon: "ARPay", bonus: "+2%" },
  ];

  const quickAmounts = ["100", "200", "400", "500", "1K", "1.1K", "2K", "3K", "5K"];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    const numericAmount = amount.replace("K", "000");
    setDepositAmount(numericAmount);
  };

  const handleDeposit = () => {
    // Handle deposit logic here
    console.log("Deposit:", { selectedMethod, selectedChannel, depositAmount });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.screenTitle}>Deposit</ThemedText>
        <TouchableOpacity onPress={() => router.push("/deposit-history")} style={styles.historyButton}>
          <ThemedText style={styles.historyButtonText}>Deposit history</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <LinearGradient
          colors={['#7AFEC3', '#02AFB6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceCardContent}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceHeaderLeft}>
                <Ionicons name="wallet" size={20} color="#FFD700" />
                <ThemedText style={styles.balanceLabel}>Balance</ThemedText>
              </View>
              <TouchableOpacity onPress={refreshWallet}>
                <Ionicons name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.balanceAmount}>{formatBalance(walletBalance)}</ThemedText>
            <View style={styles.cardFooter}>
              <Ionicons name="card" size={24} color="#fff" style={styles.cardIcon} />
              <ThemedText style={styles.cardNumber}>**** ****</ThemedText>
            </View>
          </View>
        </LinearGradient>

        {/* Deposit Methods */}
        <View style={styles.section}>
          <View style={styles.methodsGrid}>
            {depositMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodButton,
                  selectedMethod === method.id && styles.methodButtonActive
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodIconContainer}>
                  <ThemedText style={styles.methodIconText}>{method.icon}</ThemedText>
                </View>
                <ThemedText style={styles.methodLabel}>{method.label}</ThemedText>
                {method.bonus && (
                  <View style={styles.bonusBadge}>
                    <ThemedText style={styles.bonusText}>{method.bonus}</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Select Channel */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet" size={18} color="#7AFEC3" />
            <ThemedText style={styles.sectionTitle}>Select channel</ThemedText>
          </View>
          <TouchableOpacity
            style={[
              styles.channelButton,
              selectedChannel === "Phonepe_QR" && styles.channelButtonActive
            ]}
            onPress={() => setSelectedChannel("Phonepe_QR")}
          >
            <ThemedText style={styles.channelLabel}>Phonepe_QR</ThemedText>
            <ThemedText style={styles.channelBalance}>Balance: 100 - 50K</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Deposit Amount */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet" size={18} color="#7AFEC3" />
            <ThemedText style={styles.sectionTitle}>Deposit amount</ThemedText>
          </View>
          <View style={styles.amountGrid}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.amountButtonActive
                ]}
                onPress={() => handleAmountSelect(amount)}
              >
                <ThemedText style={styles.amountButtonText}>₹ {amount}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.amountInputContainer}>
            <ThemedText style={styles.currencySymbol}>₹</ThemedText>
            <TextInput
              style={styles.amountInput}
              placeholder="₹100.00 - ₹50,000.00"
              placeholderTextColor="#92A8E3"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="numeric"
            />
            {depositAmount.length > 0 && (
              <TouchableOpacity onPress={() => {
                setDepositAmount("");
                setSelectedAmount("");
              }}>
                <Ionicons name="close-circle" size={20} color="#92A8E3" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recharge Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={18} color="#7AFEC3" />
            <ThemedText style={styles.sectionTitle}>Recharge instructions</ThemedText>
          </View>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <ThemedText style={styles.instructionBullet}>◆</ThemedText>
              <ThemedText style={styles.instructionText}>
                If the transfer time is up, please fill out the deposit form again.
              </ThemedText>
            </View>
            <View style={styles.instructionItem}>
              <ThemedText style={styles.instructionBullet}>◆</ThemedText>
              <ThemedText style={styles.instructionText}>
                The transfer amount must match the order you created, otherwise the money cannot be credited successfully.
              </ThemedText>
            </View>
            <View style={styles.instructionItem}>
              <ThemedText style={styles.instructionBullet}>◆</ThemedText>
              <ThemedText style={styles.instructionText}>
                If you transfer the wrong amount, our company will not be responsible for the lost amount!
              </ThemedText>
            </View>
            <View style={styles.instructionItem}>
              <ThemedText style={styles.instructionBullet}>◆</ThemedText>
              <ThemedText style={styles.instructionText}>
                Note: do not cancel the deposit order after the money has been transferred.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Deposit History Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={18} color="#7AFEC3" />
            <ThemedText style={styles.sectionTitle}>Deposit history</ThemedText>
          </View>
          <View style={styles.historyPlaceholder}>
            <ThemedText style={styles.historyText}>Recharge Method: Phonepe_QR</ThemedText>
          </View>
        </View>

        {/* Deposit Button */}
        <TouchableOpacity style={styles.depositButton} onPress={handleDeposit}>
          <ThemedText style={styles.depositButtonText}>Deposit</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05012B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 90,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#05012B',
  },
  backButton: {
    padding: 4,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyButton: {
    padding: 4,
  },
  historyButtonText: {
    fontSize: 14,
    color: '#7AFEC3',
  },
  balanceCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceCardContent: {
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcon: {
    opacity: 0.8,
  },
  cardNumber: {
    fontSize: 16,
    color: '#fff',
    letterSpacing: 2,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#011341',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    position: 'relative',
  },
  methodButtonActive: {
    backgroundColor: '#7AFEC3',
  },
  methodIconContainer: {
    marginBottom: 8,
  },
  methodIconText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  methodLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  bonusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  bonusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  channelButton: {
    backgroundColor: '#011341',
    borderRadius: 12,
    padding: 16,
  },
  channelButtonActive: {
    backgroundColor: '#7AFEC3',
  },
  channelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  channelBalance: {
    fontSize: 14,
    color: '#92A8E3',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  amountButton: {
    backgroundColor: '#011341',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  amountButtonActive: {
    backgroundColor: '#7AFEC3',
  },
  amountButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#011341',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  instructionBullet: {
    fontSize: 12,
    color: '#7AFEC3',
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#92A8E3',
    lineHeight: 20,
  },
  historyPlaceholder: {
    backgroundColor: '#011341',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  historyText: {
    fontSize: 14,
    color: '#92A8E3',
  },
  depositButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    backgroundColor: '#011341',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7AFEC3',
  },
  depositButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7AFEC3',
  },
});
