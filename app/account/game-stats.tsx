import { ThemedView } from "@/components/themed-view";
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_600SemiBold,
  Inter_600SemiBold_Italic,
  Inter_700Bold_Italic,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomHeader } from "@/components/ui/CustomHeader";

// ── Tab Filter ────────────────────────────────────────────────────────────────
const TABS = ["Today", "Yesterday", "This week", "This month"] as const;
type Tab = (typeof TABS)[number];

function TabBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            activeOpacity={0.8}
            style={styles.tabItem}
          >
            {isActive ? (
              <LinearGradient
                colors={["#05b1b6", "#78fcc3"]}
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabItemGradient}
              >
                <Text style={[styles.tabText, styles.tabTextActive]}>
                  {tab}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.tabItemInactive}>
                <Text style={styles.tabText}>{tab}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
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
  icon: ImageSourcePropType;
  name: string;
  totalBet: string;
  numberOfBets: number;
  winningAmount: string;
};

function GameSection({
  icon,
  name,
  totalBet,
  numberOfBets,
  winningAmount,
}: GameData) {
  return (
    <View style={styles.gameSection}>
      {/* Category header */}
      <View style={styles.gameHeader}>
        <Image source={icon} style={styles.gameIcon} resizeMode="contain" />
        <Text style={styles.gameName}>{name}</Text>
      </View>

      {/* Rows */}
      <View style={styles.gameRowContainer}>
        <Image
          source={require("@/assets/gameStatsSteps-d5fb8354.webp")}
          style={{ width: 28, height: 75 }}
          resizeMode="contain"
        />
        <View style={styles.gameRowContent}>
          <GameRow label="Total bet" value={`₹${totalBet}`} valueColor="#fff" />
          <GameRow
            label="Number of bets"
            value={String(numberOfBets)}
            valueColor="#fff"
          />
          <GameRow
            label="Winning amount"
            value={`₹${winningAmount}`}
            valueColor="#00eca3"
            isLast
          />
        </View>
      </View>
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
      <Text style={styles.gameRowLabel}>{label}</Text>
      <Text style={[styles.gameRowValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const GAME_DATA: GameData[] = [
  {
    icon: require("@/assets/iconLottery-e1521a51.webp"),
    name: "lottery",
    totalBet: "0.00",
    numberOfBets: 0,
    winningAmount: "0.00",
  },
  {
    icon: require("@/assets/iconRealPerson-31a7139d.webp"),
    name: "video",
    totalBet: "0.00",
    numberOfBets: 0,
    winningAmount: "0.00",
  },
  {
    icon: require("@/assets/iconSlots-fc9b3a8c.webp"),
    name: "Slot",
    totalBet: "0.00",
    numberOfBets: 0,
    winningAmount: "0.00",
  },
  {
    icon: require("@/assets/iconFishing-c0078712.webp"),
    name: "Fish",
    totalBet: "0.00",
    numberOfBets: 0,
    winningAmount: "0.00",
  },
  {
    icon: require("@/assets/iconPhysics-0095b0ff.webp"),
    name: "sport",
    totalBet: "0.00",
    numberOfBets: 0,
    winningAmount: "0.00",
  },
  {
    icon: require("@/assets/iconChess-c1aaee6c.webp"),
    name: "ChessCard",
    totalBet: "0.00",
    numberOfBets: 0,
    winningAmount: "0.00",
  },
];

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GameStatsScreen() {
  const [loaded] = useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  });
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_700Bold,
  });
  const [interLoaded] = useInter({
    Inter_Regular: Inter_400Regular,
    Inter_SemiBold: Inter_600SemiBold,
    Inter_SemiBold_Italic: Inter_600SemiBold_Italic,
    Inter_Bold_Italic: Inter_700Bold_Italic,
    Inter_Regular_Italic: Inter_400Regular_Italic,
  });
  const [activeTab, setActiveTab] = useState<Tab>("Today");
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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
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
const BG = "#060B2E";
const CARD_BG = "#0A1540";
const TEAL = "#2BC4C4";
const DIVIDER = "#0F1D55";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Tab bar
  tabBarWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: BG,
  },
  tabBar: {
    flexDirection: "row",
    // backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 4,
    gap: 6,
  },
  tabItem: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  tabItemGradient: {
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
  },
  tabItemInactive: {
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#011341",
    borderRadius: 20,
  },
  tabText: {
    color: "#6A85B8",
    fontSize: 14,
    fontWeight: "400",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 4 },

  // Total bet card
  totalCard: {
    backgroundColor: "#011341",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 28,
    marginBottom: 18,
  },
  totalAmount: {
    color: "#dd9138",
    fontSize: 22.4,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  totalLabel: {
    color: "#6A85B8",
    fontSize: 16,
    marginTop: 6,
  },

  // Game list
  gameList: {
    backgroundColor: "#011341",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 4,
  },

  // Game section
  gameSection: {
    paddingTop: 12,
    marginTop: 4,
  },
  gameHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  gameRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  gameIcon: { width: 32, height: 32 },
  gameName: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
  },
  gameRowContent: {
    flex: 1,
    // backgroundColor: "red",
    marginTop: 4,
  },
  // Game row
  gameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
    minHeight: 28,
  },
  dotCol: {
    width: 24,
    alignItems: "center",
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
    color: "#92a8e3",
    fontFamily: "Roboto_400Regular",
    fontSize: 14.9,
    paddingTop: 2,
    paddingBottom: 8,
  },
  gameRowValue: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14.9,
    paddingTop: 2,
    paddingBottom: 8,
  },
});
