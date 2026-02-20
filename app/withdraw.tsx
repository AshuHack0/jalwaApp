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

export default function WithdrawScreen() {
  const router = useRouter();
  const { walletBalance, refreshWallet } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>("UPI");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const withdrawableBalance = walletBalance; // You can adjust this based on your logic

  const paymentMethods = [
    { id: "BANK CARD", label: "BANK CARD", icon: "card" },
    { id: "UPI", label: "UPI", icon: "phone-portrait" },
    { id: "USDT", label: "USDT", icon: "logo-bitcoin" },
  ];

  const handleWithdraw = () => {
    // Handle withdraw logic here
    console.log("Withdraw:", { selectedMethod, withdrawAmount });
  };

  const handleAllAmount = () => {
    setWithdrawAmount(withdrawableBalance.toFixed(2));
  };

  return (
    <ThemedView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.screenTitle}>Withdraw</ThemedText>
        <TouchableOpacity onPress={() => router.push("/withdrawal-history")} style={styles.historyButton}>
          <ThemedText style={styles.historyButtonText}>Withdrawal history</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Available Balance Card */}
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
                <ThemedText style={styles.balanceLabel}>Available balance</ThemedText>
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

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <View style={styles.paymentMethodHeader}>
            <View style={styles.arPayLogo}>
              <Ionicons name="triangle" size={24} color="#FFD700" />
              <ThemedText style={styles.arPayText}>ARPay</ThemedText>
            </View>
            <ThemedText style={styles.paymentMethodSubtext}>Supports UPI for fast payment</ThemedText>
          </View>
          <View style={styles.methodsRow}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodButton,
                  selectedMethod === method.id && styles.methodButtonActive
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <Ionicons 
                  name={method.icon as any} 
                  size={24} 
                  color={selectedMethod === method.id ? "#05012B" : "#fff"} 
                />
                <ThemedText style={[
                  styles.methodLabel,
                  selectedMethod === method.id && styles.methodLabelActive
                ]}>
                  {method.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          {selectedMethod === "UPI" && (
            <TouchableOpacity style={styles.addUPIButton}>
              <Ionicons name="add-circle-outline" size={24} color="#7AFEC3" />
              <ThemedText style={styles.addUPIText}>Add UPI</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Withdrawal Amount */}
        <View style={styles.section}>
          <View style={styles.amountInputContainer}>
            <ThemedText style={styles.currencySymbol}>₹</ThemedText>
            <TextInput
              style={styles.amountInput}
              placeholder="Please enter the amount"
              placeholderTextColor="#92A8E3"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.balanceInfo}>
            <ThemedText style={styles.balanceInfoText}>
              Withdrawable balance {formatBalance(withdrawableBalance)}
            </ThemedText>
          </View>
          <View style={styles.amountReceivedRow}>
            <ThemedText style={styles.amountReceivedLabel}>Withdrawal amount received</ThemedText>
            <View style={styles.amountReceivedRight}>
              <ThemedText style={styles.amountReceivedValue}>
                ₹{withdrawAmount || "0.00"}
              </ThemedText>
              <TouchableOpacity onPress={handleAllAmount} style={styles.allButton}>
                <ThemedText style={styles.allButtonText}>All</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity 
          style={[
            styles.withdrawButton,
            (!withdrawAmount || parseFloat(withdrawAmount) <= 0) && styles.withdrawButtonDisabled
          ]}
          onPress={handleWithdraw}
          disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
        >
          <ThemedText style={[
            styles.withdrawButtonText,
            (!withdrawAmount || parseFloat(withdrawAmount) <= 0) && styles.withdrawButtonTextDisabled
          ]}>
            Withdraw
          </ThemedText>
        </TouchableOpacity>

        {/* Withdrawal Rules */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={18} color="#7AFEC3" />
            <ThemedText style={styles.sectionTitle}>Withdrawal Rules</ThemedText>
          </View>
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <ThemedText style={styles.ruleBullet}>◆</ThemedText>
              <ThemedText style={styles.ruleText}>
                Need to bet {formatBalance(0)} to be able to withdraw
              </ThemedText>
            </View>
            <View style={styles.ruleItem}>
              <ThemedText style={styles.ruleBullet}>◆</ThemedText>
              <ThemedText style={styles.ruleText}>
                Withdraw time 00:00-23:59
              </ThemedText>
            </View>
            <View style={styles.ruleItem}>
              <ThemedText style={styles.ruleBullet}>◆</ThemedText>
              <ThemedText style={styles.ruleText}>
                Inday Remaining Withdrawal Times 3
              </ThemedText>
            </View>
            <View style={styles.ruleItem}>
              <ThemedText style={styles.ruleBullet}>◆</ThemedText>
              <ThemedText style={styles.ruleText}>
                Withdrawal amount range ₹100.00-₹50,000.00
              </ThemedText>
            </View>
            <View style={styles.ruleItem}>
              <ThemedText style={styles.ruleBullet}>◆</ThemedText>
              <ThemedText style={styles.ruleText}>
                Please confirm your beneficial account information before withdrawing. If your information is incorrect, our company will not be liable for the amount of loss
              </ThemedText>
            </View>
            <View style={styles.ruleItem}>
              <ThemedText style={styles.ruleBullet}>◆</ThemedText>
              <ThemedText style={styles.ruleText}>
                If your beneficial information is incorrect, please contact customer service
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Withdrawal History Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={18} color="#7AFEC3" />
            <ThemedText style={styles.sectionTitle}>Withdrawal history</ThemedText>
          </View>
          <View style={styles.historyPlaceholder}>
            <ThemedText style={styles.noDataText}>No data</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.allHistoryButton}
            onPress={() => router.push("/withdrawal-history")}
          >
            <ThemedText style={styles.allHistoryButtonText}>All history</ThemedText>
          </TouchableOpacity>
        </View>
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
  paymentMethodHeader: {
    marginBottom: 16,
  },
  arPayLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  arPayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  paymentMethodSubtext: {
    fontSize: 14,
    color: '#92A8E3',
  },
  methodsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  methodButton: {
    flex: 1,
    backgroundColor: '#011341',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  methodButtonActive: {
    backgroundColor: '#7AFEC3',
  },
  methodLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  methodLabelActive: {
    color: '#05012B',
  },
  addUPIButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#011341',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#7AFEC3',
    borderStyle: 'dashed',
  },
  addUPIText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7AFEC3',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#011341',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 12,
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
  balanceInfo: {
    marginBottom: 12,
  },
  balanceInfoText: {
    fontSize: 14,
    color: '#92A8E3',
  },
  amountReceivedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#011341',
    borderRadius: 12,
    padding: 16,
  },
  amountReceivedLabel: {
    fontSize: 14,
    color: '#92A8E3',
  },
  amountReceivedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountReceivedValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  allButton: {
    backgroundColor: '#7AFEC3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  allButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#05012B',
  },
  withdrawButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#7AFEC3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  withdrawButtonDisabled: {
    backgroundColor: '#011341',
    opacity: 0.5,
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#05012B',
  },
  withdrawButtonTextDisabled: {
    color: '#92A8E3',
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  ruleBullet: {
    fontSize: 12,
    color: '#7AFEC3',
    marginTop: 2,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#92A8E3',
    lineHeight: 20,
  },
  historyPlaceholder: {
    backgroundColor: '#011341',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 12,
  },
  noDataText: {
    fontSize: 14,
    color: '#92A8E3',
  },
  allHistoryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7AFEC3',
  },
  allHistoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7AFEC3',
  },
});
