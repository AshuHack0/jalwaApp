import { useAuth } from "@/contexts/AuthContext";
import { useDepositModal } from "@/contexts/DepositModalContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

function formatBalance(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export default function WalletScreen() {
  const router = useRouter();
  const { walletBalance, refreshWallet } = useAuth();
  const { openDepositModal } = useDepositModal();

  return (
    <ThemedView style={styles.container}>
      {/* Top Navigation Bar - Sticky Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.screenTitle}>Wallet</ThemedText>
        <TouchableOpacity onPress={refreshWallet} style={styles.refreshButton}>
          
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Balance Summary */}
        <View style={styles.balanceSection}>
          <View style={styles.walletIconContainer}>
            <Image 
              source={require('@/assets/walletimg.png')} 
              style={{ width: 42, height: 42 }}
              contentFit="contain"
            />
          </View>
          <ThemedText style={styles.mainBalance}>{formatBalance(walletBalance)}</ThemedText>
          <ThemedText style={styles.balanceLabel}>Total balance</ThemedText>
          
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <ThemedText style={styles.balanceNumber}>{walletBalance.toFixed(0)}</ThemedText>
              <ThemedText style={styles.balanceText}>Total amount</ThemedText>
            </View>
            <View style={styles.balanceItem}>
              <ThemedText style={styles.balanceNumber}>{walletBalance.toFixed(0)}</ThemedText>
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
              <ThemedText style={styles.walletAmount}>{formatBalance(walletBalance)}</ThemedText>
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
              colors={['#7AFEC3', '#02AFB6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.qrButton}
            >
              <TouchableOpacity style={styles.qrButtonContent}>
                <ThemedText style={styles.qrButtonText}>Main wallet transfer</ThemedText>
              </TouchableOpacity>
            </LinearGradient>
            {/* Transaction Actions */}
          <View style={styles.transactionGrid}>
            <TouchableOpacity style={styles.transactionButton} onPress={() => openDepositModal()}>
              <View style={[styles.transactionIconContainer, styles.depositIcon]}>
                <Image 
                  source={require('@/assets/rechargeIcon-efb79f43.webp')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.transactionLabel}>Deposit</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.transactionButton}>
              <View style={[styles.transactionIconContainer, styles.withdrawIcon]}>
                <Image 
                  source={require('@/assets/widthdrawBlue-5fcf62bd.webp')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.transactionLabel}>Withdraw</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.transactionButton}>
              <View style={[styles.transactionIconContainer, styles.depositHistoryIcon]}>
                <Image 
                  source={require('@/assets/rechargeHistory-28b45ebe.webp')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.transactionLabel}>Deposit history</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.transactionButton}>
              <View style={[styles.transactionIconContainer, styles.withdrawalHistoryIcon]}>
                <Image 
                  source={require('@/assets/withdrawHistory-033a34f8.webp')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.transactionLabel}>Withdrawal history</ThemedText>
            </TouchableOpacity>
          </View>
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
              <ThemedText style={styles.gameBalanceLabel}>Lottery</ThemedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gameBalanceCard,{opacity: 0}]}></TouchableOpacity>
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
    paddingBottom: 14,
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
  placeholder: {
    width: 32,
  },
  refreshButton: {
    padding: 4,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#011341',
  },
  walletIconContainer: {
    marginVertical: 14,
  },
  mainBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8, 
    
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom:4,
    fontWeight: 'bold',
  },
  balanceDetails: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around', 
    fontWeight: 'bold',
  },
  balanceItem: {
    alignItems: 'center',
    fontWeight: 'bold',
  },
  balanceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
   
  },
  balanceText: {
    fontSize: 16,
    color: '#fff',
  },
  walletTypeSection: {
    backgroundColor: '#011341',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    marginTop: 20,
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
    width: 120,
    height: 120,
    borderRadius: 140,
    backgroundColor: '#011341',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 10,
    borderColor: '#001C54',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 0,
  },
  walletTypeLabel: {
    fontSize: 14,
    color: '#fff', 
    fontFamily:'Inter',
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
    qrSection: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  qrButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  qrButtonContent: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButtonText: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '800',
    color: '#05012B',
  },
  transactionGrid: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 20,
  },
  transactionButton: {
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    alignItems: 'center',
    width: '25%',
  },
  transactionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 4,
  },
  depositIcon: {
    // backgroundColor: '#D97706',
  },
  withdrawIcon: {
    // backgroundColor: '#3B82F6',
  },
  depositHistoryIcon: {
    // backgroundColor: '#EC4899',
  },
  withdrawalHistoryIcon: {
    // backgroundColor: '#10B981',
  },
  transactionLabel: {
    color: '#92A8E3',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center', 
    lineHeight: 14,
  },
  gameBalances: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  gameBalanceCard: {
    flex: 1,
    backgroundColor: '#011341', 
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
