import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WalletScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.screenTitle}>Wallet</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Wallet Balance Summary */}
        <View style={styles.balanceSection}>
          <View style={styles.walletIconContainer}>
            <Ionicons name="wallet-outline" size={48} color="#9BA1A6" />
          </View>
          <ThemedText style={styles.mainBalance}>₹0.00</ThemedText>
          <ThemedText style={styles.balanceLabel}>Total balance</ThemedText>
          
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <ThemedText style={styles.balanceNumber}>0</ThemedText>
              <ThemedText style={styles.balanceText}>Total amount</ThemedText>
            </View>
            <View style={styles.balanceItem}>
              <ThemedText style={styles.balanceNumber}>0</ThemedText>
              <ThemedText style={styles.balanceText}>Total deposit amount</ThemedText>
            </View>
          </View>
        </View>

        {/* Wallet Type Breakdown */}
        <View style={styles.walletTypeSection}>
          <View style={styles.walletTypes}>
            <View style={styles.walletTypeItem}>
              <View style={styles.progressCircle}>
                <ThemedText style={styles.progressText}>0%</ThemedText>
              </View>
              <ThemedText style={styles.walletAmount}>₹0.00</ThemedText>
              <ThemedText style={styles.walletTypeLabel}>Main wallet</ThemedText>
            </View>
            <View style={styles.walletTypeItem}>
              <View style={styles.progressCircle}>
                <ThemedText style={styles.progressText}>0%</ThemedText>
              </View>
              <ThemedText style={styles.walletAmount}>₹0.00</ThemedText>
              <ThemedText style={styles.walletTypeLabel}>3rd party wallet</ThemedText>
            </View>
          </View>
          
          <LinearGradient
            colors={['#10B981', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.transferButton}
          >
            <TouchableOpacity style={styles.transferButtonGradient}>
              <ThemedText style={styles.transferButtonText}>Main wallet transfer</ThemedText>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Transaction Actions */}
        <View style={styles.transactionGrid}>
          <TouchableOpacity style={styles.transactionButton}>
            <View style={[styles.transactionIconContainer, styles.depositIcon]}>
              <Ionicons name="bag-outline" size={32} color="#fff" />
            </View>
            <ThemedText style={styles.transactionLabel}>Deposit</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.transactionButton}>
            <View style={[styles.transactionIconContainer, styles.withdrawIcon]}>
              <Ionicons name="remove-outline" size={32} color="#fff" />
            </View>
            <ThemedText style={styles.transactionLabel}>Withdraw</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.transactionButton}>
            <View style={[styles.transactionIconContainer, styles.depositHistoryIcon]}>
              <Ionicons name="bag-check-outline" size={32} color="#fff" />
            </View>
            <ThemedText style={styles.transactionLabel}>Deposit history</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.transactionButton}>
            <View style={[styles.transactionIconContainer, styles.withdrawalHistoryIcon]}>
              <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
            </View>
            <ThemedText style={styles.transactionLabel}>Withdrawal history</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Game Balances */}
        <View style={styles.gameBalances}>
          <TouchableOpacity style={styles.gameBalanceCard}>
            <ThemedText style={styles.gameBalanceAmount}>0.00</ThemedText>
            <ThemedText style={styles.gameBalanceLabel}>ARGame</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gameBalanceCard}>
            <ThemedText style={styles.gameBalanceAmount}>0.00</ThemedText>
            <View style={styles.lotteryContent}>
              <ThemedText style={styles.lotteryIcon}>🎱</ThemedText>
              <ThemedText style={styles.gameBalanceLabel}>Lottery</ThemedText>
            </View>
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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 32,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  walletIconContainer: {
    marginBottom: 16,
  },
  mainBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 24,
  },
  balanceDetails: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  balanceText: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  walletTypeSection: {
    backgroundColor: '#1a0a3d',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  walletTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  walletTypeItem: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  walletTypeLabel: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  transferButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  transferButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  transferButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  transactionButton: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  transactionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositIcon: {
    backgroundColor: '#D97706',
  },
  withdrawIcon: {
    backgroundColor: '#3B82F6',
  },
  depositHistoryIcon: {
    backgroundColor: '#EC4899',
  },
  withdrawalHistoryIcon: {
    backgroundColor: '#10B981',
  },
  transactionLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  gameBalances: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  gameBalanceCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  gameBalanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  gameBalanceLabel: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  lotteryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lotteryIcon: {
    fontSize: 24,
  },
});
