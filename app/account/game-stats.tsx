import { ThemedView } from '@/components/themed-view';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomHeader } from '@/components/ui/CustomHeader';

// ── Tab Filter ────────────────────────────────────────────────────────────────
const TABS = ['Today', 'Yesterday', 'This week', 'This month'] as const;
type Tab = (typeof TABS)[number];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onChange(tab)}
          activeOpacity={0.8}
          style={[styles.tabItem, active === tab && styles.tabItemActive]}
        >
          <Text style={[styles.tabText, active === tab && styles.tabTextActive]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Total Bet Card ────────────────────────────────────────────────────────────
function TotalBetCard({ amount }: { amount: string }) {
  return (
    <View style={styles.totalCard}>
      <Text style={styles.totalAmount}>₹{amount}</Text>
      <Text style={styles.totalLabel}>Total bet</Text>
    </View>
  );
}

// ── Game Section ──────────────────────────────────────────────────────────────
type GameData = {
  icon: string;
  name: string;
  totalBet: string;
  numberOfBets: number;
  winningAmount: string;
};

function GameSection({ icon, name, totalBet, numberOfBets, winningAmount }: GameData) {
  return (
    <View style={styles.gameSection}>
      {/* Category header */}
      <View style={styles.gameHeader}>
        <Text style={styles.gameIcon}>{icon}</Text>
        <Text style={styles.gameName}>{name}</Text>
      </View>

      {/* Rows */}
      <GameRow label="Total bet" value={`₹${totalBet}`} valueColor="#fff" />
      <GameRow label="Number of bets" value={String(numberOfBets)} valueColor="#fff" />
      <GameRow label="Winning amount" value={`₹${winningAmount}`} valueColor="#2BC4C4" isLast />
    </View>
  );
}

function GameRow({
  label,
  value,
  valueColor,
  isLast = false,
}: {
  label: string;
  value: string;
  valueColor: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.gameRow, isLast && { marginBottom: 0 }]}>
      <View style={styles.dotCol}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.dotLine} />}
      </View>
      <Text style={styles.gameRowLabel}>{label}</Text>
      <Text style={[styles.gameRowValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const GAME_DATA: GameData[] = [
  { icon: '🎱', name: 'lottery',   totalBet: '0.00', numberOfBets: 0, winningAmount: '0.00' },
  { icon: '📺', name: 'video',     totalBet: '0.00', numberOfBets: 0, winningAmount: '0.00' },
  { icon: '🎰', name: 'Slot',      totalBet: '0.00', numberOfBets: 0, winningAmount: '0.00' },
  { icon: '🐟', name: 'Fish',      totalBet: '0.00', numberOfBets: 0, winningAmount: '0.00' },
  { icon: '⚽', name: 'sport',     totalBet: '0.00', numberOfBets: 0, winningAmount: '0.00' },
  { icon: '♠️', name: 'ChessCard', totalBet: '0.00', numberOfBets: 0, winningAmount: '0.00' },
];

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GameStatsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Today');
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Game statistics" onBack={() => router.back()} />

        {/* Tab bar sits below header, outside scroll */}
        <View style={styles.tabBarWrapper}>
          <TabBar active={activeTab} onChange={setActiveTab} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Bet Summary */}
          <TotalBetCard amount="0.00" />

          {/* Game Sections */}
          <View style={styles.gameList}>
            {GAME_DATA.map((game) => (
              <GameSection key={game.name} {...game} />
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG       = '#060B2E';
const CARD_BG  = '#0A1540';
const TEAL     = '#2BC4C4';
const DIVIDER  = '#0F1D55';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },


  // Tab bar
  tabBarWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: BG,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 4,
    gap: 2,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: TEAL,
  },
  tabText: {
    color: '#6A85B8',
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 4 },

  // Total bet card
  totalCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 18,
  },
  totalAmount: {
    color: '#F5A623',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  totalLabel: {
    color: '#6A85B8',
    fontSize: 14,
    marginTop: 6,
  },

  // Game list
  gameList: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 4,
  },

  // Game section
  gameSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    marginTop: 4,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  gameIcon: { fontSize: 22 },
  gameName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // Game row
  gameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
    minHeight: 28,
  },
  dotCol: {
    width: 24,
    alignItems: 'center',
    paddingTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TEAL,
  },
  dotLine: {
    width: 2,
    flex: 1,
    backgroundColor: TEAL,
    opacity: 0.3,
    marginTop: 2,
    minHeight: 20,
  },
  gameRowLabel: {
    flex: 1,
    color: '#6A85B8',
    fontSize: 13.5,
    paddingTop: 2,
    paddingBottom: 8,
  },
  gameRowValue: {
    fontSize: 13.5,
    fontWeight: '500',
    paddingTop: 2,
    paddingBottom: 8,
  },
});