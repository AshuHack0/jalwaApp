import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Types ─────────────────────────────────────────────────────────────────────
type RebateLevel = { level: number; rates: string[] };
type TabKey = "Lottery" | "Casino" | "Sports" | "Rummy" | "Slots";

// ── Data ──────────────────────────────────────────────────────────────────────
const LEVEL_LABELS = [
  "1 level lower level commission rebate",
  "2 level lower level commission rebate",
  "3 level lower level commission rebate",
  "4 level lower level commission rebate",
  "5 level lower level commission rebate",
  "6 level lower level commission rebate",
];

const LOTTERY_LEVELS: RebateLevel[] = [
  {
    level: 0,
    rates: ["0.6%", "0.18%", "0.054%", "0.0162%", "0.00486%", "0.001458%"],
  },
  {
    level: 1,
    rates: [
      "0.7%",
      "0.245%",
      "0.08575%",
      "0.030012%",
      "0.0105004%",
      "0.003677%",
    ],
  },
  {
    level: 2,
    rates: [
      "0.75%",
      "0.28125%",
      "0.105469%",
      "0.039551%",
      "0.014832%",
      "0.005562%",
    ],
  },
  {
    level: 3,
    rates: ["0.8%", "0.32%", "0.128%", "0.0512%", "0.02048%", "0.008192%"],
  },
  {
    level: 4,
    rates: [
      "0.85%",
      "0.36125%",
      "0.153531%",
      "0.065251%",
      "0.027732%",
      "0.011786%",
    ],
  },
  {
    level: 5,
    rates: [
      "0.9%",
      "0.405%",
      "0.18225%",
      "0.082013%",
      "0.036906%",
      "0.016608%",
    ],
  },
  { level: 6, rates: ["1%", "0.5%", "0.25%", "0.125%", "0.0625%", "0.03125%"] },
  {
    level: 7,
    rates: [
      "1.1%",
      "0.605%",
      "0.33275%",
      "0.183013%",
      "0.100657%",
      "0.055361%",
    ],
  },
  {
    level: 8,
    rates: ["1.2%", "0.72%", "0.432%", "0.2592%", "0.15552%", "0.093312%"],
  },
  {
    level: 9,
    rates: [
      "1.3%",
      "0.845%",
      "0.54925%",
      "0.357013%",
      "0.232058%",
      "0.150838%",
    ],
  },
  {
    level: 10,
    rates: ["1.4%", "0.98%", "0.686%", "0.4802%", "0.33614%", "0.235298%"],
  },
];

// Casino / Sports / Rummy use same structure but slightly different rates
const CASINO_LEVELS: RebateLevel[] = LOTTERY_LEVELS.map((l) => ({
  level: l.level,
  rates: l.rates.map((r) => {
    const n = parseFloat(r);
    return (n * 0.9).toPrecision(4).replace(/\.?0+$/, "") + "%";
  }),
}));

const SPORTS_LEVELS: RebateLevel[] = LOTTERY_LEVELS.map((l) => ({
  level: l.level,
  rates: l.rates.map((r) => {
    const n = parseFloat(r);
    return (n * 1.1).toPrecision(4).replace(/\.?0+$/, "") + "%";
  }),
}));

const RUMMY_LEVELS: RebateLevel[] = LOTTERY_LEVELS.map((l) => ({
  level: l.level,
  rates: l.rates.map((r) => {
    const n = parseFloat(r);
    return (n * 0.8).toPrecision(4).replace(/\.?0+$/, "") + "%";
  }),
}));

const TAB_DATA: Record<TabKey, RebateLevel[]> = {
  Lottery: LOTTERY_LEVELS,
  Casino: CASINO_LEVELS,
  Sports: SPORTS_LEVELS,
  Rummy: RUMMY_LEVELS,
  Slots: LOTTERY_LEVELS,
};

const TABS: { key: TabKey; icon: string }[] = [
  { key: "Lottery", icon: "🎱" },
  { key: "Casino", icon: "🎰" },
  { key: "Sports", icon: "⚽" },
  { key: "Rummy", icon: "🃏" },
  { key: "Slots", icon: "🎰" },
];

// ── Rebate Level Card ─────────────────────────────────────────────────────────
function RebateLevelCard({ level, rates }: RebateLevel) {
  return (
    <View style={styles.levelCard}>
      {/* Card header */}
      <View style={styles.levelHeader}>
        <Text style={styles.levelHeaderText}>
          Rebate level <Text style={styles.levelNumber}>L{level}</Text>
        </Text>
      </View>

      {/* Rows with connecting line */}
      <View style={styles.ratesContainer}>
        {/* Vertical connecting line */}
        <View style={styles.connectingLine} />

        {LEVEL_LABELS.map((label, idx) => (
          <View key={idx} style={styles.rateRow}>
            <View style={styles.dotWrap}>
              <View style={styles.dot} />
            </View>
            <Text style={styles.rateLabel}>{label}</Text>
            <Text style={styles.rateValue}>{rates[idx]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function RebateRatioScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("Lottery");
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Rebate ratio" onBack={() => router.back()} />

        {/* ── Tab Bar ── */}
        <View style={styles.tabBarWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBarContent}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabItem, isActive && styles.tabItemActive]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text
                    style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  >
                    {tab.key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Level Cards ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {TAB_DATA[activeTab].map((levelData) => (
            <RebateLevelCard key={levelData.level} {...levelData} />
          ))}
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const CARD_BG = "#0A1540";
const TEAL = "#2BC4C4";
const DIVIDER = "#0F1D55";
const LINE_RED = "#FF3B5C";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Tab bar
  tabBarWrapper: {
    backgroundColor: BG,
    marginBottom: 4,
  },
  tabBarContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  tabItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 72,
    gap: 2,
    backgroundColor: "#011341",
  },
  tabItemActive: {
    backgroundColor: TEAL,
    borderRadius: 10,
  },
  tabIcon: { fontSize: 18 },
  tabLabel: {
    color: "#6A85B8",
    fontSize: 12,
  },
  tabLabelActive: {
    color: "#fff",
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 12,
  },

  // Level card
  levelCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    overflow: "hidden",
  },
  levelHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  levelHeaderText: {
    color: "#fff",
    fontSize: 14,
  },
  levelNumber: {
    color: TEAL,
    fontSize: 20,
    fontWeight: "800",
    fontStyle: "italic",
  },

  // Rates container with connecting line
  ratesContainer: {
    position: "relative",
  },
  connectingLine: {
    position: "absolute",
    left: 21.5, // 16px padding + 9px to center of dot (18px dotWrap / 2)
    top: 13.5, // Half of first row height to center on first dot
    bottom: 13.5, // Half of last row height to center on last dot
    width: 1,
    backgroundColor: "#1BC0B9",
    zIndex: 0,
  },

  // Rate row
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
    zIndex: 1,
  },
  dotWrap: {
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 55,
    marginRight: 8,
    zIndex: 2,
    backgroundColor: "white",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TEAL,
    zIndex: 3,
  },
  rateLabel: {
    flex: 1,
    color: "#6A85B8",
    fontSize: 13,
  },
  rateValue: {
    color: "#fff",
    fontSize: 13,
    minWidth: 72,
    textAlign: "right",
  },
});
