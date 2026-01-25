import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image } from 'expo-image';

export default function WinGoScreen() {
  const router = useRouter();
  const [walletBalance] = useState('₹0.00');
  const [selectedMode, setSelectedMode] = useState('30sec');
  const [timeRemaining, setTimeRemaining] = useState('00 : 22');
  const [selectedMultiplier, setSelectedMultiplier] = useState('X1');
  const [selectedSize, setSelectedSize] = useState('Big');
  const [selectedTab, setSelectedTab] = useState('Game history');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 50;

  const gameModes = [
    { id: '30sec', label: 'WinGo 30sec', icon: 'time-outline' },
    { id: '1min', label: 'WinGo 1 Min', icon: 'time-outline' },
    { id: '3min', label: 'WinGo 3 Min', icon: 'time-outline' },
    { id: '5min', label: 'WinGo 5 Min', icon: 'time-outline' },
  ];

  const multipliers = ['Random', 'X1', 'X5', 'X10', 'X20', 'X50', 'X100'];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const recentResults = ['1', '1', '8', '9', '8'];

  const gameHistory = [
    { period: '20260125100052218', number: 1, size: 'Small', color: 'green' },
    { period: '20260125100052217', number: 8, size: 'Big', color: 'red' },
    { period: '20260125100052216', number: 9, size: 'Big', color: 'green' },
    { period: '20260125100052215', number: 4, size: 'Small', color: 'red' },
    { period: '20260125100052214', number: 2, size: 'Small', color: 'red' },
    { period: '20260125100052213', number: 7, size: 'Big', color: 'green' },
    { period: '20260125100052212', number: 3, size: 'Small', color: 'green' },
    { period: '20260125100052211', number: 6, size: 'Big', color: 'red' },
    { period: '20260125100052210', number: 5, size: 'Big', color: 'green' },
    { period: '20260125100052209', number: 0, size: 'Small', color: 'violet' },
  ];

  const getNumberColor = (num: number) => {
    if ([0, 1, 3, 4, 5, 7, 9].includes(num)) return 'green';
    if ([2, 6, 8].includes(num)) return 'red';
    return 'violet';
  };

  const getResultColor = (num: number) => {
    if ([1, 3, 9].includes(num)) return '#10B981';
    if ([2, 4, 6, 8].includes(num)) return '#EF4444';
    return '#8B5CF6';
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Jalwa.Game</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="headset-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="time-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Section */}
        <View style={styles.walletCard}>
          <View style={styles.walletBalanceRow}>
            <ThemedText style={styles.walletAmount}>{walletBalance}</ThemedText>
            <TouchableOpacity>
              <Ionicons name="refresh" size={20} color="#9BA1A6" />
            </TouchableOpacity>
          </View>
          <View style={styles.walletLabelRow}>
            <Ionicons name="wallet-outline" size={16} color="#10B981" />
            <ThemedText style={styles.walletLabel}>Wallet balance</ThemedText>
          </View>
          <View style={styles.walletButtons}>
            <TouchableOpacity style={styles.withdrawButton}>
              <ThemedText style={styles.walletButtonText}>Withdraw</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.depositButton}>
              <ThemedText style={styles.walletButtonText}>Deposit</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Announcement Banner */}
        <View style={styles.alertBanner}>
          <Ionicons name="megaphone-outline" size={20} color="#3B82F6" />
          <ThemedText style={styles.alertText}>
            Our customer service will never send any links to members—if you receive a li
          </ThemedText>
          <TouchableOpacity style={styles.detailButtonContainer}>
            <ThemedText style={styles.detailButton}>Detail</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Game Mode Selection */}
        <View style={styles.gameModeSection}>
          {gameModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.gameModeButton,
                selectedMode === mode.id && styles.gameModeButtonActive
              ]}
              onPress={() => setSelectedMode(mode.id)}
            >
              <Ionicons 
                name={mode.icon} 
                size={20} 
                color={selectedMode === mode.id ? '#10B981' : '#9BA1A6'} 
              />
              <ThemedText style={[
                styles.gameModeText,
                selectedMode === mode.id && styles.gameModeTextActive
              ]}>
                {mode.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Game Round */}
        <View style={styles.gameRoundCard}>
          <View style={styles.gameRoundLeft}>
            <TouchableOpacity style={styles.howToPlayButton}>
              <Ionicons name="bar-chart-outline" size={16} color="#fff" />
              <ThemedText style={styles.howToPlayText}>How to play</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.gameModeLabel}>WinGo 30sec</ThemedText>
            <View style={styles.recentResults}>
              {recentResults.map((result, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.resultBall,
                    { backgroundColor: result === '1' || result === '9' ? '#10B981' : '#EF4444' }
                  ]}
                >
                  <ThemedText style={styles.resultBallText}>{result}</ThemedText>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.gameRoundRight}>
            <ThemedText style={styles.timeRemainingLabel}>Time remaining</ThemedText>
            <View style={styles.timerContainer}>
              <ThemedText style={styles.timerText}>{timeRemaining}</ThemedText>
            </View>
            <ThemedText style={styles.periodId}>20260125100052219</ThemedText>
          </View>
        </View>

        {/* Color Betting Options */}
        <View style={styles.colorBettingSection}>
          <TouchableOpacity style={[styles.colorButton, styles.greenButton]}>
            <ThemedText style={styles.colorButtonText}>Green</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.colorButton, styles.violetButton]}>
            <ThemedText style={styles.colorButtonText}>Violet</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.colorButton, styles.redButton]}>
            <ThemedText style={styles.colorButtonText}>Red</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Number Betting Grid */}
        <View style={styles.numberGrid}>
          {numbers.map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.numberBall,
                { backgroundColor: getNumberColor(num) === 'green' ? '#10B981' : getNumberColor(num) === 'red' ? '#EF4444' : '#8B5CF6' }
              ]}
            >
              <ThemedText style={styles.numberBallText}>{num}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Multiplier Buttons */}
        <View style={styles.multiplierSection}>
          {multipliers.map((mult) => (
            <TouchableOpacity
              key={mult}
              style={[
                styles.multiplierButton,
                mult === 'Random' && styles.randomButton,
                mult === selectedMultiplier && mult !== 'Random' && styles.multiplierButtonActive
              ]}
              onPress={() => mult !== 'Random' && setSelectedMultiplier(mult)}
            >
              <ThemedText style={[
                styles.multiplierText,
                mult === 'Random' && styles.randomText,
                mult === selectedMultiplier && mult !== 'Random' && styles.multiplierTextActive
              ]}>
                {mult}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Big/Small Toggle */}
        <View style={styles.sizeToggleSection}>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              styles.bigButton,
              selectedSize === 'Big' && styles.sizeButtonActive
            ]}
            onPress={() => setSelectedSize('Big')}
          >
            <ThemedText style={styles.sizeButtonText}>Big</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              styles.smallButton,
              selectedSize === 'Small' && styles.sizeButtonActive
            ]}
            onPress={() => setSelectedSize('Small')}
          >
            <ThemedText style={styles.sizeButtonText}>Small</ThemedText>
          </TouchableOpacity>
        </View>

        {/* History/Chart Tabs */}
        <View style={styles.tabsSection}>
          {['Game history', 'Chart', 'My history'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <ThemedText style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive
              ]}>
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Game History Table */}
        {selectedTab === 'Game history' && (
          <View style={styles.historyTable}>
            <View style={styles.tableHeader}>
              <ThemedText style={styles.tableHeaderText}>Period</ThemedText>
              <ThemedText style={styles.tableHeaderText}>Number</ThemedText>
              <ThemedText style={styles.tableHeaderText}>Big Small</ThemedText>
              <ThemedText style={styles.tableHeaderText}>Color</ThemedText>
            </View>
            {gameHistory.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <ThemedText style={styles.tableCell}>{item.period}</ThemedText>
                <ThemedText style={[styles.tableCell, { color: getResultColor(item.number) }]}>
                  {item.number}
                </ThemedText>
                <ThemedText style={styles.tableCell}>{item.size}</ThemedText>
                <View style={[
                  styles.colorDot,
                  { backgroundColor: item.color === 'green' ? '#10B981' : item.color === 'red' ? '#EF4444' : '#8B5CF6' }
                ]} />
              </View>
            ))}
          </View>
        )}

        {/* Pagination */}
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? '#9BA1A6' : '#fff'} />
          </TouchableOpacity>
          <ThemedText style={styles.paginationText}>{currentPage}/{totalPages}</ThemedText>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
            onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? '#9BA1A6' : '#10B981'} />
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#05012B',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  walletCard: {
    backgroundColor: '#1a0a3d',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  walletBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  walletLabel: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  walletButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  walletButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
  },
  alertText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
  },
  detailButtonContainer: {
    backgroundColor: '#14B8A6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  detailButton: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  gameModeSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  gameModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gameModeButtonActive: {
    backgroundColor: '#10B981',
  },
  gameModeText: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  gameModeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  gameRoundCard: {
    backgroundColor: '#1a0a3d',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameRoundLeft: {
    flex: 1,
    gap: 12,
  },
  howToPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  howToPlayText: {
    fontSize: 12,
    color: '#fff',
  },
  gameModeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  recentResults: {
    flexDirection: 'row',
    gap: 8,
  },
  resultBall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBallText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameRoundRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  timeRemainingLabel: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  timerContainer: {
    backgroundColor: '#14B8A6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  periodId: {
    fontSize: 10,
    color: '#9BA1A6',
  },
  colorBettingSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  colorButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#10B981',
  },
  violetButton: {
    backgroundColor: '#8B5CF6',
  },
  redButton: {
    backgroundColor: '#EF4444',
  },
  colorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
    justifyContent: 'center',
  },
  numberBall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  numberBallText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  multiplierSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  multiplierButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    minWidth: 50,
    alignItems: 'center',
  },
  multiplierButtonActive: {
    backgroundColor: '#10B981',
  },
  randomButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: 'transparent',
  },
  multiplierText: {
    fontSize: 14,
    color: '#fff',
  },
  multiplierTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  randomText: {
    color: '#EF4444',
  },
  sizeToggleSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    padding: 4,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  bigButton: {
    backgroundColor: '#F97316',
  },
  smallButton: {
    backgroundColor: '#3B82F6',
  },
  sizeButtonActive: {
    backgroundColor: '#10B981',
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tabsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#14B8A6',
  },
  tabText: {
    fontSize: 14,
    color: '#fff',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  historyTable: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    gap: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    gap: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#9BA1A6',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  paginationButton: {
    padding: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 16,
    color: '#fff',
  },
});
