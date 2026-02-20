import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wpBase,
  heightPercentageToDP as hpBase,
} from "react-native-responsive-screen";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Polygon, Rect, Line } from "react-native-svg";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Clipboard from "expo-clipboard";
import {
  WINGO_GAMES,
  WINGO_MULTIPLIERS,
  WINGO_NUMBER_COLOR_MAP,
  COLOR_MAP,
  WINGO_BALL_IMAGES,
  WINGO_ANNOUNCEMENT_MESSAGES,
  WINGO_TABS,
  WINGO_API_PATH_MAP,
  BET_SELECTION_MAP,
  BET_SELECTION_NUMBER_MAP,
} from "@/constants/Wingo";
import { BetModal } from "@/components/BetModal";
import { useAuth } from "@/contexts/AuthContext";
import { useDepositModal } from "@/contexts/DepositModalContext";
import {
  useWinGoCurrentRound,
  useWinGoHistory,
  useWinGoMyHistory,
  usePlaceWinGoBet,
} from "@/services/api/hooks";
import { type MyHistoryBet, type PlaceWinGoBetPayload } from "@/services/api";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";

const SCALE = 0.80;
const wp = (p: number) => wpBase(p * SCALE);
const hp = (p: number) => hpBase(p * SCALE);

const RS = {
  chartCircleSize: wp(4.8),
  chartGap: wp(1.1),
  chartPeriodWidth: wp(38.7),
  get chartNumSpacing() {
    return this.chartCircleSize + this.chartGap;
  },
};

// Module-level guard to prevent double playback (e.g. from React Strict Mode)
let lastCountdownSecondPlayed: number | null = null;

function formatTimeRemaining(endsAt: string | Date | null, serverTimeOffsetMs = 0): string {
  if (!endsAt) return "00 : 00";
  const end = new Date(endsAt).getTime();
  const now = Date.now() + serverTimeOffsetMs;
  const diffMs = Math.max(0, end - now);
  const totalSec = Math.floor(diffMs / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
}

function getSecondsRemaining(endsAt: string | Date | null, serverTimeOffsetMs = 0): number {
  if (!endsAt) return 0;
  const end = new Date(endsAt).getTime();
  const now = Date.now() + serverTimeOffsetMs;
  return Math.max(0, Math.floor((end - now) / 1000));
}

function buildBetPayload(
  betSelection: string,
  amount: number,
  period: string
): PlaceWinGoBetPayload | null {
  const sel = betSelection.trim();
  if (sel === "Big") {
    return { betType: "BIG_SMALL", choice: "BIG", amount, period };
  }
  if (sel === "Small") {
    return { betType: "BIG_SMALL", choice: "SMALL", amount, period };
  }
  if (["Green", "Red", "Violet"].includes(sel)) {
    return { betType: "COLOR", choice: sel.toUpperCase(), amount, period };
  }
  const num = parseInt(sel, 10);
  if (Number.isInteger(num) && num >= 0 && num <= 9) {
    return { betType: "NUMBER", choice: num, amount, period };
  }
  return null;
}

function AnimatedNumberBall({
  number,
  onPress,
  containerStyle,
  imageStyle,
  isHighlighted,
}: {
  number: number;
  onPress: () => void;
  containerStyle: object;
  imageStyle: object;
  isHighlighted: boolean;
}) {
  const pressScale = useSharedValue(1);
  const highlightScale = useSharedValue(1);

  useEffect(() => {
    if (isHighlighted) {
      highlightScale.value = withSequence(
        withTiming(1.2, { duration: 80 }),
        withSpring(1.1, { damping: 12, stiffness: 200 })
      );
    } else {
      highlightScale.value = withTiming(1);
    }
  }, [isHighlighted, highlightScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value * highlightScale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressScale.value = withSpring(0.85, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
    >
      <Animated.View style={[containerStyle, animatedStyle]}>
        <Image
          source={WINGO_BALL_IMAGES[number]}
          style={imageStyle}
        />
      </Animated.View>
    </Pressable>
  );
}

export default function WinGoScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, walletBalance, refreshWallet } = useAuth();
  const { openDepositModal } = useDepositModal();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);
  const [selectedMode, setSelectedMode] = useState(
    WINGO_GAMES[0]?.gameCode ?? "",
  );
  const [selectedMultiplier, setSelectedMultiplier] = useState("X1");
  const [selectedSize, setSelectedSize] = useState("Big");
  const [selectedTab, setSelectedTab] = useState("Game history");
  const [pageGameHistory, setPageGameHistory] = useState(1);
  const [pageMyHistory, setPageMyHistory] = useState(1);

  const selectedGame =
    WINGO_GAMES.find((game) => game.gameCode === selectedMode) ??
    WINGO_GAMES[0];
  const apiPath = WINGO_API_PATH_MAP[selectedGame.durationSeconds];

  const placeBetMutation = usePlaceWinGoBet();
  const { data: currentRoundRaw, refetch: refetchCurrentRound } = useWinGoCurrentRound(apiPath);
  const currentRoundData = currentRoundRaw ?? null;
  const { data: historyDataRaw, refetch: refetchHistory } = useWinGoHistory(
    apiPath,
    pageGameHistory,
    10,
    { enabled: selectedTab === "Game history" || selectedTab === "Chart" }
  );
  const historyData = historyDataRaw ?? null;
  const { data: myHistoryData, refetch: refetchMyHistory } = useWinGoMyHistory(
    apiPath,
    pageMyHistory,
    10,
    { enabled: selectedTab === "My history" }
  );
  const [timeRemaining, setTimeRemaining] = useState("00 : 00");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  // Offset = serverTime - clientTime (positive means client clock is behind)
  const serverTimeOffsetRef = useRef(0);

  // Bet modal state
  const [showBetModal, setShowBetModal] = useState(false);
  const [betSelection, setBetSelection] = useState<string>("");
  const [randomPickingInProgress, setRandomPickingInProgress] = useState(false);
  const [highlightedBallForPicking, setHighlightedBallForPicking] = useState<number | null>(null);
  const [selectedBalanceAmount, setSelectedBalanceAmount] = useState(1);
  const [betQuantity, setBetQuantity] = useState(1);
  const [selectedModalMultiplier, setSelectedModalMultiplier] = useState("X1");
  const [betModalAgreed, setBetModalAgreed] = useState(true);
  const [expandedBetId, setExpandedBetId] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [winLossPopupVisible, setWinLossPopupVisible] = useState(false);
  const [settledBet, setSettledBet] = useState<MyHistoryBet | null>(null);
  const lastShownPopupPeriodRef = useRef<string | null>(null);
  const [hasInitializedHistory, setHasInitializedHistory] = useState(false);

  const getMultiplierValue = (mult: string) =>
    parseInt(mult.replace("X", ""), 10);

  const openBetModal = (selection: string) => {
    console.log("selection", selection);
    setBetSelection(selection);
    setShowBetModal(true);
    setSelectedBalanceAmount(1);
    setSelectedModalMultiplier(selectedMultiplier);
    setBetQuantity(getMultiplierValue(selectedMultiplier));
    setBetModalAgreed(true);
  };

  // Final price = Balance * Quantity (multiplier sets the quantity)
  const totalBetAmount = selectedBalanceAmount * betQuantity;

  const gameModes = WINGO_GAMES.map((game) => ({
    id: game.gameCode,
    label: game.name,
  }));

  const multipliers = WINGO_MULTIPLIERS.map((value) => `X${value}`);
  const numbers = WINGO_NUMBER_COLOR_MAP.map((item) => item.number);

  const [chartRowLayouts, setChartRowLayouts] = useState<
    Record<number, { y: number; height: number }>
  >({});
  const announcementScrollRef = useRef<ScrollView>(null);
  const announcementIndexRef = useRef(0);
  const infiniteAnnouncementData = [
    ...WINGO_ANNOUNCEMENT_MESSAGES,
    WINGO_ANNOUNCEMENT_MESSAGES[0],
  ];

  const refetchedForRoundEndRef = useRef<string | null>(null);
  const lastHistoryDataRef = useRef<typeof historyData>(null);
  const di1Player = useAudioPlayer(require("@/assets/Wingo/sound/di1-0f3d86cb.mp3"));
  const di2Player = useAudioPlayer(require("@/assets/Wingo/sound/di2-ad9aa8fb.mp3"));

  // Compute server time offset when current-round data arrives
  useEffect(() => {
    if (!currentRoundData?.serverTime) return;
    const serverMs = new Date(currentRoundData.serverTime).getTime();
    const clientMidpoint = Date.now();
    serverTimeOffsetRef.current = serverMs - clientMidpoint;
  }, [currentRoundData?.serverTime]);

  // Reset ref when game mode changes
  useEffect(() => {
    refetchedForRoundEndRef.current = null;
  }, [apiPath]);

  // Keep last valid history when switching games (don't flash empty)
  useEffect(() => {
    if (historyData) lastHistoryDataRef.current = historyData;
  }, [historyData]);

  const displayHistoryData = historyData ?? lastHistoryDataRef.current;

  // Update time remaining every second; refetch when round ends; show countdown modal when 6 sec remain
  // Don't reset timer to 0 when switching games (keep previous values until new round data loads)
  useEffect(() => {
    const endsAt = currentRoundData?.currentRound?.endsAt ?? null;
    const offset = serverTimeOffsetRef.current;

    if (endsAt) {
      setTimeRemaining(formatTimeRemaining(endsAt, offset));
      const secs = getSecondsRemaining(endsAt, offset);
      setSecondsRemaining(secs);
      setShowCountdownModal(secs <= 6);
    }

    const interval = setInterval(() => {
      const end = currentRoundData?.currentRound?.endsAt;
      const offset = serverTimeOffsetRef.current;
      const adjustedNow = Date.now() + offset;

      if (end && adjustedNow >= new Date(end).getTime()) {
        if (refetchedForRoundEndRef.current !== end) {
          refetchedForRoundEndRef.current = end;
          refetchCurrentRound();
          refetchHistory();
          refetchMyHistory();
          refreshWallet();
        }
        setSecondsRemaining(0);
      } else {
        refetchedForRoundEndRef.current = null;
      }

      if (end) {
        const formatted = formatTimeRemaining(end, offset);
        const remaining = getSecondsRemaining(end, offset);
        setTimeRemaining(formatted);
        setSecondsRemaining(remaining);
        setShowCountdownModal(remaining <= 6);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentRoundData?.currentRound?.endsAt, refetchCurrentRound, refetchHistory, refetchMyHistory, refreshWallet]);

  // Set audio mode for countdown sounds
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  }, []);

  // Play countdown sounds when overlay is showing (6,5,4,3,2,1 -> di1; 0 -> di2)
  useEffect(() => {
    if (!showCountdownModal || secondsRemaining > 6) {
      lastCountdownSecondPlayed = null;
      return;
    }
    if (lastCountdownSecondPlayed === secondsRemaining) return;
    lastCountdownSecondPlayed = secondsRemaining;

    if (secondsRemaining === 0) {
      di2Player.seekTo(0);
      di2Player.play();
    } else if (secondsRemaining <= 6) {
      di1Player.seekTo(0);
      di1Player.play();
    }
  }, [showCountdownModal, secondsRemaining, di1Player, di2Player]);

  // Close bet modal when countdown starts
  useEffect(() => {
    if (showCountdownModal) {
      setShowBetModal(false);
      setSelectedBalanceAmount(0);
      setSelectedMultiplier("X1");
      setSelectedModalMultiplier("X1");
      setBetQuantity(1);
    }
  }, [showCountdownModal]);

  // Handle Win/Loss Popup detection
  useEffect(() => {
    if (!myHistoryData?.bets?.length) {
      if (!hasInitializedHistory && myHistoryData) {
        setHasInitializedHistory(true);
      }
      return;
    }

    // Look at the most recent bet in history
    const latestBet = myHistoryData.bets[0];

    // Check if the bet is settled (isWin is true or false, not undefined/null)
    const isSettled = latestBet.isWin === true || latestBet.isWin === false;
    const period = latestBet.round?.period;

    if (!hasInitializedHistory) {
      // First load: just record the latest period and mark as initialized
      if (period) {
        lastShownPopupPeriodRef.current = period;
      }
      setHasInitializedHistory(true);
      return;
    }

    if (isSettled && period && period !== lastShownPopupPeriodRef.current) {
      lastShownPopupPeriodRef.current = period;
      setSettledBet(latestBet);
      setWinLossPopupVisible(true);

      const timer = setTimeout(() => {
        setWinLossPopupVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [myHistoryData, hasInitializedHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = announcementIndexRef.current;
      const nextIndex = (current + 1) % infiniteAnnouncementData.length;

      announcementIndexRef.current = nextIndex;

      if (nextIndex === 0) {
        announcementScrollRef.current?.scrollTo({
          y: 0,
          animated: false,
        });
      } else {
        announcementScrollRef.current?.scrollTo({
          y: nextIndex * hp(5.2),
          animated: true,
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [infiniteAnnouncementData.length]);

  const getColorMapping = (num: number) => {
    return WINGO_NUMBER_COLOR_MAP.find((item) => item.number === num);
  };

  const getNumberColor = (num: number) => {
    const mapping = getColorMapping(num);
    if (!mapping) return "green";

    if (
      mapping.color === COLOR_MAP.GREEN ||
      mapping.color === COLOR_MAP.GREEN_VIOLET
    ) {
      return "green";
    }

    if (
      mapping.color === COLOR_MAP.RED ||
      mapping.color === COLOR_MAP.RED_VIOLET
    ) {
      return "red";
    }

    return "violet";
  };

  const getResultColor = (num: number) => {
    const baseColor = getNumberColor(num);

    if (baseColor === "green") return "#10B981";
    if (baseColor === "red") return "#EF4444";
    return "#8B5CF6";
  };

  const getColorDots = (num: number): string[] => {
    const mapping = getColorMapping(num);
    if (!mapping) return ["#10B981"];
    if (mapping.color === COLOR_MAP.RED_VIOLET) return ["#EF4444", "#8B5CF6"];
    if (mapping.color === COLOR_MAP.GREEN_VIOLET) return ["#10B981", "#8B5CF6"];
    if (mapping.color === COLOR_MAP.RED) return ["#EF4444"];
    return ["#10B981"];
  };

  const isGradientNumber = (num: number) => {
    const mapping = getColorMapping(num);
    return (
      mapping?.color === COLOR_MAP.RED_VIOLET ||
      mapping?.color === COLOR_MAP.GREEN_VIOLET
    );
  };

  // Helper: readable label for a bet's selection
  const getBetSelectLabel = (bet: MyHistoryBet): string => {
    if (bet.betType === "NUMBER" && bet.choiceNumber != null) return String(bet.choiceNumber);
    if (bet.betType === "COLOR" && bet.choiceColor) return bet.choiceColor.charAt(0) + bet.choiceColor.slice(1).toLowerCase();
    if (bet.betType === "BIG_SMALL" && bet.choiceBigSmall) return bet.choiceBigSmall === "BIG" ? "Big" : "Small";
    return "-";
  };

  const getBetResultLabel = (bet: MyHistoryBet): { text: string; color: string } => {
    if (bet.round?.status !== "settled" && bet.round?.status !== "closed") {
      return { text: "Pending", color: "#EAB308" };
    }
    if (bet.isWin === true) return { text: `+₹${bet.payoutAmount.toFixed(2)}`, color: "#10B981" };
    if (bet.isWin === false) return { text: `-₹${bet.amount.toFixed(2)}`, color: "#EF4444" };
    return { text: "Pending", color: "#EAB308" };
  };

  // Derive UI data from API responses (use displayHistoryData so we don't flash empty when switching games)
  const recentResults =
    displayHistoryData?.historyRounds
      ?.map((r) => r.outcomeNumber)
      .filter((n): n is number => n != null && n >= 0 && n <= 9)
      .slice(0, 6) ?? [];
  const gameHistory =
    displayHistoryData?.historyRounds
      ?.filter((r) => r.outcomeNumber != null && r.outcomeNumber >= 0)
      ?.map((r) => ({
        period: r.period,
        number: r.outcomeNumber as number,
        size: r.outcomeBigSmall === "BIG" ? "Big" : "Small",
        color: "green",
      })) ?? [];
  const displayPeriod =
    currentRoundData?.currentRound?.period ??
    displayHistoryData?.historyRounds?.[0]?.period ??
    "-";
  const totalPagesGameHistory =
    displayHistoryData?.historyPagination?.totalPages ?? 1;
  const totalPagesMyHistory = myHistoryData?.pagination?.totalPages ?? 1;
  const myHistoryBets = myHistoryData?.bets ?? [];

  // Reset chart row layouts only when pagination changes (new rows will update via onLayout when game mode changes)
  useEffect(() => {
    if (selectedTab === "Chart") setChartRowLayouts({});
  }, [pageGameHistory, selectedTab]);

  const hasDataForCurrentTab =
    (selectedTab === "Game history" && (gameHistory?.length ?? 0) > 0) ||
    (selectedTab === "Chart" && (gameHistory?.length ?? 0) > 0) ||
    (selectedTab === "My history" && myHistoryBets.length > 0);

  const currentPage =
    selectedTab === "Game history"
      ? pageGameHistory
      : selectedTab === "Chart"
        ? pageGameHistory
        : pageMyHistory;
  const totalPages =
    selectedTab === "Game history"
      ? totalPagesGameHistory
      : selectedTab === "Chart"
        ? totalPagesGameHistory
        : totalPagesMyHistory;
  const setCurrentPage =
    selectedTab === "Game history"
      ? setPageGameHistory
      : selectedTab === "Chart"
        ? setPageGameHistory
        : setPageMyHistory;

  const countdownDigits = String(secondsRemaining).padStart(2, "0").split("");

  if (!isLoading && !isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ThemedView style={styles.innerContainer}>
        {/* Header */}
        <View
          style={{
            height: hp(6.5),
            width: "100%",
            paddingHorizontal: wp(4),
            paddingVertical: hp(1),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#05012B",
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              { flex: 1, justifyContent: "center", height: "100%" },
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Ionicons name="chevron-back" size={wp(6.4)} color="white" />
          </Pressable>
          <Image
            source={
              "https://jalwaimg.jalwa-jalwa.com/Jalwa/other/h5setting_20250315140925tbe6.png"
            }
            style={{ width: wp(34), height: "100%" }}
            contentFit="cover"
          />

          <View
            style={{
              flex: 1,
              height: "100%",
              flexDirection: "row",
              gap: wp(2.7),
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={"https://www.jalwagame.win/assets/png/kefu-b361c42f.webp"}
              style={{ width: wp(8), height: wp(8) }}
              contentFit="cover"
            />

            <Image
              source={
                "https://www.jalwagame.win/assets/png/voice-62dbf38c.webp"
              }
              style={{ width: wp(8), height: wp(8) }}
              contentFit="cover"
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: hp(2.5), paddingHorizontal: wp(4) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Wallet Section */}
          <View
            style={{
              backgroundColor: "#001C54",
              borderRadius: wp(4.3),
              marginTop: hp(2),
              marginBottom: hp(2),
              overflow: "hidden",
              position: "relative",
              padding: hp(2.5),
              paddingHorizontal: wp(8),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={
                "https://www.jalwagame.win/assets/png/walletbg-dcbd4124.webp"
              }
              style={{
                width: "100%",
                height: "100%",
                borderRadius: wp(4.3),
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              contentFit="cover"
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: hp(1.2),
                gap: wp(10),
                paddingLeft: wp(16.5),
              }}
            >
              <ThemedText
                style={{ fontSize: wp(6.4), fontWeight: "700", color: "#fff" }}
              >
                ₹{walletBalance.toFixed(2)}
              </ThemedText>
              <Pressable
                onPress={refreshWallet}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Image
                  source={
                    "https://www.jalwagame.win/assets/png/refireshIcon-2bc1b49f.webp"
                  }
                  style={{ width: wp(6.4), height: wp(6.4) }}
                  contentFit="cover"
                />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: wp(2.1),
                marginBottom: hp(2.5),
              }}
            >
              <Ionicons name="wallet-outline" size={wp(4.3)} color="white" />
              <ThemedText
                style={{ fontSize: wp(4.3), color: "white", fontWeight: "600" }}
              >
                Wallet balance
              </ThemedText>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                height: hp(5),
              }}
            >
              <Pressable
                style={({ pressed }) => [
                  {
                    width: wp(40),
                    height: "100%",
                    backgroundColor: "#EF4444",
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <ThemedText
                  style={{ fontSize: wp(4.8), fontWeight: "600", color: "#fff" }}
                >
                  Withdraw
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => openDepositModal()}
                style={({ pressed }) => [
                  {
                    width: wp(40),
                    height: "100%",
                    backgroundColor: "#10B981",
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <ThemedText
                  style={{ fontSize: wp(4.8), fontWeight: "600", color: "#fff" }}
                >
                  Deposit
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Announcement Banner */}
          <LinearGradient
            colors={["#001C54", "#000C33"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              height: hp(5.2),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: wp(2.9),
              marginBottom: hp(2),
              overflow: "hidden",
              borderColor: "#224ba2",
              borderWidth: 1,
              paddingHorizontal: wp(2.7),
            }}
          >
            <Ionicons
              name="volume-medium-sharp"
              size={wp(6.4)}
              color="rgb(122, 254, 195)"
            />

            <ScrollView
              ref={announcementScrollRef}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(e) => {
                const itemHeight = hp(5.2);
                const idx = Math.round(
                  e.nativeEvent.contentOffset.y / itemHeight,
                );
                if (idx >= WINGO_ANNOUNCEMENT_MESSAGES.length) {
                  announcementIndexRef.current = 0;
                  setTimeout(() => {
                    announcementScrollRef.current?.scrollTo({
                      y: 0,
                      animated: false,
                    });
                  }, 0);
                } else {
                  announcementIndexRef.current = idx;
                }
              }}
              style={{ width: wp(72), height: hp(5.2) }}
              showsVerticalScrollIndicator={false}
              snapToInterval={hp(5.2)}
              snapToAlignment="start"
              decelerationRate="fast"
            >
              {infiniteAnnouncementData.map((item, i) => (
                <View
                  key={`announcement-${i}`}
                  style={{
                    height: hp(5.2),
                    justifyContent: "center",
                    paddingHorizontal: wp(2.7),
                    paddingVertical: hp(0.25),
                  }}
                >
                  <ThemedText
                    numberOfLines={2}
                    style={{
                      color: "#fff",
                      fontSize: wp(3.7),
                      fontWeight: "400",
                      lineHeight: wp(4.3),
                    }}
                  >
                    {item}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>

            <LinearGradient
              colors={["rgb(122, 254, 195)", "rgb(2, 175, 182)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                borderRadius: 100,
                width: wp(23),
                height: hp(3.4),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText
                style={{ color: "#05012B", fontSize: wp(4.3), fontWeight: "400" }}
              >
                Detail
              </ThemedText>
            </LinearGradient>
          </LinearGradient>

          {/* Game Mode Selection */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: hp(12.7),
              width: "100%",
              backgroundColor: "#001c54",
              borderRadius: wp(3.5),
              marginBottom: hp(2),
            }}
          >
            {gameModes.map((mode) => {
              const isActive = selectedMode === mode.id;
              const content = (
                <>
                  <Image
                    source={
                      isActive
                        ? "https://www.jalwagame.win/assets/png/time_a-14078cf4.webp"
                        : "https://www.jalwagame.win/assets/png/time-5d4e96a3.webp"
                    }
                    style={{ width: wp(13.3), height: wp(13.3) }}
                  />
                  <ThemedText
                    style={{
                      width: wp(18.7),
                      fontSize: wp(4),
                      fontWeight: "400",
                      color: isActive ? "black" : "#92A8E3",
                      lineHeight: wp(4.5),
                      textAlign: "center",
                    }}
                  >
                    {mode.label}
                  </ThemedText>
                </>
              );
              return (
                <Pressable
                  key={mode.id}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    },
                    { opacity: 1 }
                  ]}
                  onPress={() => {
                    setSelectedMode(mode.id);
                    setCurrentPage(1);
                  }}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={["#7afec3", "#02afb6"]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{
                        flex: 1,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: wp(3.5),
                      }}
                    >
                      {content}
                    </LinearGradient>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {content}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Current Game Round */}
          <View
            style={{
              borderRadius: wp(3.5),
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: hp(2),
              position: "relative",
              overflow: "hidden",
              padding: wp(4.3),
            }}
          >
            <Image
              source={
                "https://www.jalwagame.win/assets/png/wingoissue-16c90504.webp"
              }
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              contentFit="cover"
            />
            <View style={{ height: "100%", width: "46%", gap: wp(1.1) }}>
              <Pressable
                style={({ pressed }) => [
                  {
                    flexDirection: "row",
                    gap: wp(1.6),
                    height: hp(3.2),
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#05012B",
                    borderRadius: 50,
                  },
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Ionicons name="bar-chart-outline" size={wp(4.3)} color="#05012B" />
                <ThemedText style={{ fontSize: wp(3.7), color: "#05012B" }}>
                  How to play
                </ThemedText>
              </Pressable>
              <ThemedText
                style={{ fontSize: wp(4), fontWeight: "500", color: "#05012B" }}
              >
                {selectedGame?.name}
              </ThemedText>
              <View style={styles.recentResults}>
                {recentResults.slice(0, 5).map((result, index) => (
                  <Image
                    key={`recent-${index}-${result}`}
                    source={WINGO_BALL_IMAGES[result]}
                    style={{ width: wp(8.4), height: wp(8.4) }}
                    contentFit="cover"
                  />
                ))}
              </View>
            </View>

            <View
              style={{
                height: "100%",
                width: "46%",
                alignItems: "flex-end",
                gap: wp(1.1),
              }}
            >
              <ThemedText
                style={{ fontSize: wp(3.5), color: "#05012B", fontWeight: "800" }}
              >
                Time remaining
              </ThemedText>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: wp(0.5) }}
              >
                {timeRemaining
                  .replace(/\s/g, "")
                  .split("")
                  .map((char, index, arr) => {
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    const segmentWidth = char === ":" ? wp(3.2) : wp(7.5);
                    const segmentHeight = hp(4.4);
                    const maskElement = (
                      <View
                        style={{
                          width: segmentWidth,
                          height: segmentHeight,
                          backgroundColor: "transparent",
                        }}
                      >
                        <Svg
                          width={segmentWidth}
                          height={segmentHeight}
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          {isFirst ? (
                            <Polygon
                              fill="white"
                              points="0 30, 30 0, 100 0, 100 100, 0 100"
                            />
                          ) : isLast ? (
                            <Polygon
                              fill="white"
                              points="0 0,100 0,100 70,70 100,0 100"
                            />
                          ) : (
                            <Rect
                              x={0}
                              y={0}
                              width={100}
                              height={100}
                              fill="white"
                            />
                          )}
                        </Svg>
                      </View>
                    );
                    return (
                      <MaskedView
                        key={index}
                        style={{ width: segmentWidth, height: segmentHeight }}
                        maskElement={maskElement}
                      >
                        <View
                          style={{
                            width: segmentWidth,
                            height: segmentHeight,
                            backgroundColor: "#1e293b",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ThemedText
                            style={{
                              fontSize: wp(5.3),
                              fontWeight: "bold",
                              color: "#fff",
                            }}
                          >
                            {char}
                          </ThemedText>
                        </View>
                      </MaskedView>
                    );
                  })}
              </View>

              <ThemedText
                style={{ fontSize: wp(4.3), fontWeight: "800", color: "#05012B" }}
              >
                {displayPeriod}
              </ThemedText>
            </View>
          </View>

          <View style={styles.bettingSectionWrapper}>
            <View style={styles.colorBettingContainer}>
              {/* Color Betting Options */}
              <View style={styles.colorButtonsRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.greenColorButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={() => openBetModal("Green")}
                >
                  <ThemedText style={styles.colorButtonText}>Green</ThemedText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.violetColorButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={() => openBetModal("Violet")}
                >
                  <ThemedText style={styles.colorButtonText}>Violet</ThemedText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.redColorButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={() => openBetModal("Red")}
                >
                  <ThemedText style={styles.colorButtonText}>Red</ThemedText>
                </Pressable>
              </View>

              {/* Number Betting Grid */}
              <View style={styles.numberGridContent}>
                <View style={[styles.numberGridRow, { flexDirection: "row" }]}>
                  {numbers.slice(0, 5).map((item) => (
                    <AnimatedNumberBall
                      key={item}
                      number={item}
                      onPress={() => !randomPickingInProgress && openBetModal(item.toString())}
                      containerStyle={styles.numberBall}
                      imageStyle={styles.numberBallImage}
                      isHighlighted={highlightedBallForPicking === item}
                    />
                  ))}
                </View>
                <View style={[styles.numberGridRow, { flexDirection: "row" }]}>
                  {numbers.slice(5, 10).map((item) => (
                    <AnimatedNumberBall
                      key={item}
                      number={item}
                      onPress={() => !randomPickingInProgress && openBetModal(item.toString())}
                      containerStyle={styles.numberBall}
                      imageStyle={styles.numberBallImage}
                      isHighlighted={highlightedBallForPicking === item}
                    />
                  ))}
                </View>
              </View>

              {/* Multiplier Buttons */}
              <View style={styles.multiplierSection}>
                <Pressable
                  style={({ pressed }) => [
                    styles.randomButtonContainer,
                    (randomPickingInProgress || pressed) && { opacity: 0.7 },
                  ]}
                  disabled={randomPickingInProgress}
                  onPress={() => {
                    if (randomPickingInProgress) return;
                    setRandomPickingInProgress(true);
                    const finalBall = numbers[Math.floor(Math.random() * numbers.length)];
                    const delays = [120, 130, 145, 165, 190, 220, 260, 310, 370];
                    let step = 0;
                    const runCycle = () => {
                      if (step < 9) {
                        setHighlightedBallForPicking(numbers[Math.floor(Math.random() * numbers.length)]);
                        step += 1;
                        setTimeout(runCycle, delays[step - 1]);
                      } else {
                        setHighlightedBallForPicking(finalBall);
                        setTimeout(() => {
                          setRandomPickingInProgress(false);
                          setHighlightedBallForPicking(null);
                          openBetModal(finalBall.toString());
                        }, 400);
                      }
                    };
                    runCycle();
                  }}
                >
                  <ThemedText style={styles.randomButtonText}>
                    Random
                  </ThemedText>
                </Pressable>
                {multipliers.map((mult) => (
                  <Pressable
                    key={mult}
                    style={({ pressed }) => [
                      styles.multiplierItemButton,
                      selectedMultiplier === mult &&
                      styles.multiplierItemButtonActive,
                      { opacity: pressed ? 0.7 : 1 }
                    ]}
                    onPress={() => setSelectedMultiplier(mult)}
                  >
                    <ThemedText
                      style={[
                        styles.multiplierItemText,
                        selectedMultiplier === mult &&
                        styles.multiplierItemTextActive,
                      ]}
                    >
                      {mult}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>

              {/* Big/Small Toggle */}
              <View style={styles.sizeToggleSection}>
                <Pressable
                  style={({ pressed }) => [
                    styles.bigSizeButton,
                  ]}
                  onPress={() => {
                    setSelectedSize("Big");
                    openBetModal("Big");
                  }}
                >
                  <ThemedText style={styles.bigSizeButtonText}>Big</ThemedText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.smallSizeButton,
                  ]}
                  onPress={() => {
                    setSelectedSize("Small");
                    openBetModal("Small");
                  }}
                >
                  <ThemedText style={styles.sizeButtonText}>Small</ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Countdown overlay - covers only the betting section */}
            {showCountdownModal && (
              <View style={styles.countdownSectionOverlay}>
                <View style={styles.countdownDigitsRow}>
                  {countdownDigits.map((digit, index) => (
                    <View key={index} style={styles.countdownDigitCard}>
                      <Text style={styles.countdownDigitText}>{digit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* History/Chart Tabs */}
          <View
            style={{ flexDirection: "row", height: hp(5.9), marginVertical: hp(2) }}
          >
            {WINGO_TABS.map((tab) => {
              const isSelected = selectedTab === tab;
              const tabContent = (
                <ThemedText
                  style={{
                    fontSize: wp(4.3),
                    color: isSelected ? "#05012B" : "#929292",
                    fontWeight: "600",
                  }}
                >
                  {tab}
                </ThemedText>
              );
              return (
                <Pressable
                  key={tab}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      height: "100%",
                      marginHorizontal: wp(1.1),
                      borderRadius: wp(2.1),
                      overflow: "hidden",
                    },
                    { opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={() => setSelectedTab(tab)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={["#14B8A6", "#10B981"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                      }}
                    >
                      {tabContent}
                    </LinearGradient>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: wp(2.1),
                        backgroundColor: "#011341",
                      }}
                    >
                      {tabContent}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Game History Table */}
          {selectedTab === "Game history" &&
            (gameHistory?.length > 0 ? (
              <View style={styles.historyTable}>
                <View style={styles.tableHeader}>
                  <ThemedText
                    style={[styles.tableHeaderText, styles.periodHeader]}
                  >
                    Period
                  </ThemedText>
                  <ThemedText
                    style={[styles.tableHeaderText, styles.numberHeader]}
                  >
                    Number
                  </ThemedText>
                  <ThemedText
                    style={[styles.tableHeaderText, styles.bigSmallHeader]}
                  >
                    Big Small
                  </ThemedText>
                  <ThemedText
                    style={[styles.tableHeaderText, styles.colorHeader]}
                  >
                    Color
                  </ThemedText>
                </View>
                <View style={{ backgroundColor: "#021341" }}>
                  {gameHistory.map((item, index) => (
                    <View
                      key={`history-${item.period}-${index}`}
                      style={styles.tableRow}
                    >
                      <ThemedText style={styles.periodCell}>
                        {item.period}
                      </ThemedText>
                      <View style={styles.numberCell}>
                        {isGradientNumber(item.number) ? (
                          <MaskedView
                            style={styles.gradientNumberMask}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: "transparent",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={[
                                    styles.numberText,
                                    { color: "black" },
                                  ]}
                                >
                                  {item.number}
                                </Text>
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={
                                item.number === 0
                                  ? ["#8B5CF6", "#EF4444"]
                                  : ["#10B981", "#8B5CF6"]
                              }
                              start={{ x: 0, y: 1 }}
                              end={{ x: 0, y: 0 }}
                              style={styles.gradientNumberGradient}
                            >
                              <Text style={[styles.numberText, { opacity: 0 }]}>
                                {item.number}
                              </Text>
                            </LinearGradient>
                          </MaskedView>
                        ) : (
                          <ThemedText
                            style={[
                              styles.numberText,
                              { color: getResultColor(item.number) },
                            ]}
                          >
                            {item.number}
                          </ThemedText>
                        )}
                      </View>
                      <ThemedText style={styles.bigSmallCell}>
                        {item.size}
                      </ThemedText>
                      <View style={styles.colorDotsContainer}>
                        {getColorDots(item.number).map((color, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.colorDot,
                              { backgroundColor: color },
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#021341",
                  padding: hp(2.5),
                  marginBottom: hp(2.5),
                }}
              >
                <Image
                  source={require("@/assets/Wingo/Empty.png")}
                  style={{ width: wp(53), height: wp(53) }}
                />
                <ThemedText
                  style={{ fontSize: wp(4.3), fontWeight: "600", color: "black" }}
                >
                  No data
                </ThemedText>
              </View>
            ))}

          {/* Chart */}
          {selectedTab === "Chart" &&
            (gameHistory?.length > 0 ? (
              <View style={styles.chartContainer}>
                {/* SVG overlay for connecting lines - rendered behind content via position */}
                <View style={styles.chartContentWrapper}>
                  <Svg
                    style={[
                      StyleSheet.absoluteFill,
                      styles.chartSvgOverlay,
                    ]}
                    pointerEvents="none"
                  >
                    {gameHistory.slice(0, -1).map((_, idx) => {
                      const curr = gameHistory[idx];
                      const next = gameHistory[idx + 1];
                      if (
                        curr == null ||
                        next == null ||
                        curr.number == null ||
                        next.number == null
                      )
                        return null;
                      const layout1 = chartRowLayouts[idx];
                      const layout2 = chartRowLayouts[idx + 1];
                      if (!layout1 || !layout2) return null;
                      const centerOffset = RS.chartCircleSize / 2;
                      const centerX1 =
                        RS.chartPeriodWidth + centerOffset + curr.number * RS.chartNumSpacing;
                      const centerX2 =
                        RS.chartPeriodWidth + centerOffset + next.number * RS.chartNumSpacing;
                      const centerY1 = layout1.y + layout1.height / 2;
                      const centerY2 = layout2.y + layout2.height / 2;
                      return (
                        <Line
                          key={`line-${idx}`}
                          x1={centerX1}
                          y1={centerY1}
                          x2={centerX2}
                          y2={centerY2}
                          stroke="#EF4444"
                          strokeWidth={1.5}
                        />
                      );
                    })}
                  </Svg>
                  <View style={styles.chartRowsWrapper}>
                    {gameHistory.map((item, index) => (
                      <View
                        key={`chart-row-${item.period}-${index}`}
                        style={styles.chartRow}
                        onLayout={(e) => {
                          const { y, height } = e.nativeEvent.layout;
                          setChartRowLayouts((prev) => {
                            if (prev[index]?.y === y && prev[index]?.height === height)
                              return prev;
                            return { ...prev, [index]: { y, height } };
                          });
                        }}
                      >
                        <ThemedText style={styles.chartPeriod}>
                          {item.period}
                        </ThemedText>
                        <View style={styles.chartNumbersRow}>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                            const isHighlighted = item.number === n;
                            if (!isHighlighted) {
                              return (
                                <View
                                  key={n}
                                  style={styles.chartNumberCircle}
                                >
                                  <Text style={[styles.chartNumberText, { color: "#fff" }]}>
                                    {n}
                                  </Text>
                                </View>
                              );
                            }
                            if (isGradientNumber(n)) {
                              const dots = getColorDots(n);
                              return (
                                <LinearGradient
                                  key={n}
                                  colors={[dots[0], dots[1]] as [string, string]}
                                  start={{ x: 0, y: 1 }}
                                  end={{ x: 0, y: 0 }}
                                  style={[
                                    styles.chartNumberCircle,
                                    styles.chartNumberCircleHighlighted,
                                  ]}
                                >
                                  <Text style={[styles.chartNumberText, { color: "#fff" }]}>
                                    {n}
                                  </Text>
                                </LinearGradient>
                              );
                            }
                            return (
                              <View
                                key={n}
                                style={[
                                  styles.chartNumberCircle,
                                  styles.chartNumberCircleHighlighted,
                                  { backgroundColor: getResultColor(n) },
                                ]}
                              >
                                <Text style={[styles.chartNumberText, { color: "#fff" }]}>
                                  {n}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                        <View
                          style={[
                            styles.chartBSBadge,
                            item.size === "Big"
                              ? styles.chartBSBadgeBig
                              : styles.chartBSBadgeSmall,
                          ]}
                        >
                          <Text style={styles.chartBSBadgeText}>
                            {item.size === "Big" ? "B" : "S"}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#021341",
                  padding: hp(2.5),
                  marginBottom: hp(2.5),
                }}
              >
                <Image
                  source={require("@/assets/Wingo/Empty.png")}
                  style={{ width: wp(53), height: wp(53) }}
                />
                <ThemedText
                  style={{ fontSize: wp(4.3), fontWeight: "600", color: "black" }}
                >
                  No data
                </ThemedText>
              </View>
            ))}

          {selectedTab === "My history" &&
            (myHistoryBets.length > 0 ? (
              <View style={{ backgroundColor: "#021341" }}>
                {myHistoryBets.map((bet) => {
                  const result = getBetResultLabel(bet);
                  const selection = getBetSelectLabel(bet);
                  const outcomeNumber = bet.round?.outcomeNumber;
                  const isPending = outcomeNumber == null || (bet.round?.status !== "settled" && bet.round?.status !== "closed");

                  const formatDateTime = (dateStr: string) => {
                    const d = new Date(dateStr);
                    const pad = (n: number) => n.toString().padStart(2, "0");
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
                  };

                  console.log(bet);

                  const getOutcomeColor = (num: number) => {
                    if (isGradientNumber(num)) return null;
                    return getResultColor(num);
                  };

                  const isExpanded = bet._id === expandedBetId;
                  const taxAmount = bet.amount * 0.02;
                  const afterTax = bet.amount - taxAmount;
                  const orderNumber = `WG${new Date(bet.createdAt).toISOString().replace(/[-:T.Z]/g, "")}${bet._id.slice(-6)}`.toUpperCase();

                  const copyToClipboard = async () => {
                    await Clipboard.setStringAsync(orderNumber);
                    Alert.alert("Success", "Order number copied to clipboard");
                  };

                  return (
                    <Pressable
                      key={bet._id}
                      onPress={() => setExpandedBetId(isExpanded ? null : bet._id)}
                      style={({ pressed }) => [
                        styles.myHistoryCardContainer,
                        { opacity: pressed ? 0.9 : 1 }
                      ]}
                    >
                      <View style={styles.myHistoryCard}>
                        <View style={styles.myHistoryLeft}>
                          {(() => {
                            let colors: string[] = ["red"];
                            if (bet.choiceColor) {
                              colors = [BET_SELECTION_MAP[bet.choiceColor.toLowerCase() as keyof typeof BET_SELECTION_MAP] || "red"];
                            } else if (bet.choiceNumber !== null && bet.choiceNumber !== undefined) {
                              colors = BET_SELECTION_NUMBER_MAP[bet.choiceNumber.toString() as keyof typeof BET_SELECTION_NUMBER_MAP] || ["red"];
                            } else if (bet.choiceBigSmall) {
                              colors = [BET_SELECTION_MAP[bet.choiceBigSmall.toLowerCase() as keyof typeof BET_SELECTION_MAP] || "red"];
                            }

                            if (colors.length > 1) {
                              return (
                                <View style={{ height: wp(13), width: wp(14), borderRadius: wp(2.5), overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                                  <Svg height="100%" width="100%" viewBox="0 0 100 100" style={{ position: "absolute" }}>
                                    <Rect x="0" y="0" width="100" height="100" fill={colors[0]} />
                                    <Polygon points="0,100 100,100 100,0" fill={colors[1]} />
                                  </Svg>
                                  <Text style={[styles.myHistoryNumberText, bet.betType === "BIG_SMALL" && { fontSize: wp(4) }]}>
                                    {bet.betType === "BIG_SMALL"
                                      ? (bet.round?.outcomeBigSmall
                                        ? (bet.round.outcomeBigSmall.charAt(0).toUpperCase() + bet.round.outcomeBigSmall.slice(1).toLowerCase())
                                        : "?")
                                      : outcomeNumber}
                                  </Text>
                                </View>
                              );
                            }
                            return (
                              <View style={{ height: wp(13), width: wp(14), borderRadius: wp(2), justifyContent: "center", alignItems: "center", backgroundColor: colors[0] }}>
                                <Text style={[styles.myHistoryNumberText, bet.betType === "BIG_SMALL" && { fontSize: wp(4) }]}>
                                  {bet.betType === "BIG_SMALL"
                                    ? (bet.round?.outcomeBigSmall
                                      ? (bet.round.outcomeBigSmall.charAt(0).toUpperCase() + bet.round.outcomeBigSmall.slice(1).toLowerCase())
                                      : "?")
                                    : outcomeNumber}
                                </Text>
                              </View>
                            );
                          })()}
                        </View>

                        <View style={styles.myHistoryMiddle}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: wp(1) }}>
                            <ThemedText style={{ fontSize: wp(5), fontWeight: "600", color: "#E3EFFF" }}>
                              {bet.round?.period ?? "-"}
                            </ThemedText>
                            <Ionicons name={isExpanded ? "caret-up" : "caret-down"} size={wp(3)} color="#3a3a3aff" />
                          </View>
                          <ThemedText style={{ fontSize: wp(4), fontWeight: "600", color: "#929292" }}>
                            {formatDateTime(bet.createdAt)}
                          </ThemedText>
                        </View>

                        {bet.isWin != null && <View style={styles.myHistoryRight}>
                          <View style={[
                            { height: wp(8.5), width: wp(24), borderRadius: wp(2), justifyContent: "center", alignItems: "center", borderWidth: wp(0.2) },
                            { borderColor: result.color }
                          ]}>
                            <Text style={[
                              { fontSize: wp(4), fontWeight: "400" },
                              { color: result.color }
                            ]}>
                              {bet.isWin == null ? "Unpaid" : bet.isWin ? "Succeed" : "Failed"}
                            </Text>
                          </View>
                          <ThemedText style={[
                            { fontSize: wp(4), fontWeight: "400" },
                            { color: result.color }
                          ]}>
                            {result.text.startsWith("+") || result.text.startsWith("-") ? result.text : `₹${bet.amount.toFixed(2)}`}
                          </ThemedText>
                        </View>}
                      </View>

                      {isExpanded && (
                        <View style={styles.myHistoryDetails}>
                          <ThemedText style={styles.detailsTitle}>Details</ThemedText>

                          <View style={styles.detailsContent}>
                            {/* Order number */}
                            <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start", backgroundColor: "#001C54", borderRadius: 4, padding: 2 }}>
                              <ThemedText style={{ fontSize: wp(5), fontWeight: "400", color: "#E3EFFF" }}>Order number</ThemedText>
                              <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                                <ThemedText style={{ fontSize: wp(5), fontWeight: "400", color: "#92A8E3" }} numberOfLines={1}>{orderNumber}</ThemedText>
                                <Pressable
                                  onPress={copyToClipboard}
                                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                                >
                                  <Ionicons name="copy-outline" size={wp(4)} color="#3b3b3bff" />
                                </Pressable>
                              </View>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Period</ThemedText>
                              <ThemedText style={styles.detailsValue}>{bet.round?.period}</ThemedText>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Purchase amount</ThemedText>
                              <ThemedText style={styles.detailsValue}>₹{bet.amount.toFixed(2)}</ThemedText>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Quantity</ThemedText>
                              <ThemedText style={styles.detailsValue}>1</ThemedText>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Amount after tax</ThemedText>
                              <ThemedText style={[styles.detailsValue, { color: "#EF4444" }]}>₹{afterTax.toFixed(2)}</ThemedText>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Tax</ThemedText>
                              <ThemedText style={styles.detailsValue}>₹{taxAmount.toFixed(2)}</ThemedText>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Result</ThemedText>
                              <View style={{ flexDirection: "row", gap: wp(2) }}>
                                {
                                  bet?.isWin != null ? (
                                    <>
                                      <ThemedText style={[styles.detailsValue, { color: "#92a8e3" }]}>{outcomeNumber ?? "?"}</ThemedText>
                                      <View style={{ flexDirection: "row", gap: wp(1) }}>
                                        {bet.round?.outcomeColor?.split("_").map((c, i) => {
                                          const colorKey = c.toLowerCase() as keyof typeof BET_SELECTION_MAP;
                                          const displayColor = BET_SELECTION_MAP[colorKey] ?? "#fff";
                                          return (
                                            <ThemedText key={i} style={[styles.detailsValue, { color: displayColor }]}>
                                              {c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()}
                                            </ThemedText>
                                          );
                                        })}
                                      </View>
                                      {(() => {
                                        const sizeKey = bet.round?.outcomeBigSmall?.toLowerCase() as keyof typeof BET_SELECTION_MAP;
                                        const sizeColor = BET_SELECTION_MAP[sizeKey] ?? "#fff";
                                        const sizeName = bet.round?.outcomeBigSmall ? (bet.round.outcomeBigSmall.charAt(0).toUpperCase() + bet.round.outcomeBigSmall.slice(1).toLowerCase()) : "";
                                        return (
                                          <ThemedText style={[styles.detailsValue, { color: sizeColor }]}>
                                            {sizeName}
                                          </ThemedText>
                                        );
                                      })()}
                                    </>
                                  ) : (
                                    <ThemedText style={[styles.detailsValue]}>{"--"}</ThemedText>
                                  )}
                              </View>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Select</ThemedText>
                              <ThemedText style={styles.detailsValue}>{selection}</ThemedText>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Status</ThemedText>
                              <ThemedText style={[styles.detailsValue, { color: result.color }]}>
                                {result.text === "Pending" ? "Pending" : (bet.isWin ? "Succeed" : "Failed")}
                              </ThemedText>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Win/lose</ThemedText>
                              <ThemedText style={[styles.detailsValue, { color: result.color }]}>
                                {result.text}
                              </ThemedText>
                            </View>

                            <View style={styles.detailsRow}>
                              <ThemedText style={styles.detailsLabel}>Order time</ThemedText>
                              <ThemedText style={styles.detailsValue}>{formatDateTime(bet.createdAt)}</ThemedText>
                            </View>
                          </View>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#021341",
                  padding: hp(2.5),
                  marginBottom: hp(2.5),
                }}
              >
                <Image
                  source={require("@/assets/Wingo/Empty.png")}
                  style={{ width: wp(53), height: wp(53) }}
                />
                <ThemedText
                  style={{ fontSize: wp(4.3), fontWeight: "600", color: "black" }}
                >
                  No data
                </ThemedText>
              </View>
            ))}

          {/* Pagination - only when current tab has data */}
          {hasDataForCurrentTab && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#021341",
                gap: wp(10.7),
                paddingVertical: hp(2.5),
              }}
            >
              <Pressable
                style={({ pressed }) => [
                  {
                    padding: wp(2.1),
                    backgroundColor: currentPage === 1 ? "#001C54" : "#00ECBE",
                    borderRadius: wp(2.7),
                  },
                  { opacity: pressed && currentPage !== 1 ? 0.7 : 1 }
                ]}
                onPress={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={wp(5.3)}
                  color={currentPage === 1 ? "#9BA1A6" : "black"}
                />
              </Pressable>
              <ThemedText style={styles.paginationText}>
                {currentPage}/{totalPages || 1}
              </ThemedText>
              <Pressable
                style={({ pressed }) => [
                  {
                    padding: wp(2.1),
                    backgroundColor:
                      currentPage >= totalPages ? "#001C54" : "#00ECBE",
                    borderRadius: wp(2.7),
                  },
                  { opacity: pressed && currentPage < totalPages ? 0.7 : 1 }
                ]}
                onPress={() =>
                  currentPage < totalPages &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
              >
                <Ionicons
                  name="chevron-forward"
                  size={wp(5.3)}
                  color={currentPage >= totalPages ? "#9BA1A6" : "black"}
                />
              </Pressable>
            </View>
          )}
        </ScrollView>

        <BetModal
          visible={showBetModal}
          gameName={selectedGame?.name ?? "WinGo"}
          betSelection={betSelection}
          selectedBalanceAmount={selectedBalanceAmount}
          betQuantity={betQuantity}
          selectedMultiplier={selectedModalMultiplier}
          agreed={betModalAgreed}
          totalBetAmount={totalBetAmount}
          onClose={() => setShowBetModal(false)}
          onBalanceAmountChange={setSelectedBalanceAmount}
          onQuantityChange={setBetQuantity}
          onMultiplierChange={(mult) => {
            setSelectedModalMultiplier(mult);
            setSelectedMultiplier(mult);
          }}
          onAgreedChange={setBetModalAgreed}
          confirmLoading={placeBetMutation.isPending}
          onConfirm={async () => {
            const period = currentRoundData?.currentRound?.period;
            if (!period) {
              Alert.alert("Error", "No active round. Please wait for the next round.");
              return;
            }
            const payload = buildBetPayload(betSelection, totalBetAmount, period);
            if (!payload) {
              Alert.alert("Error", "Invalid bet selection.");
              return;
            }
            try {
              const res = await placeBetMutation.mutateAsync(payload);
              if (res.success) {
                setShowBetModal(false);
                refreshWallet();
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
              } else {
                Alert.alert("Bet Failed", res.message ?? "Could not place bet.");
              }
            } catch {
              Alert.alert("Bet Failed", "Could not place bet.");
            }
          }}
        />
        {showSuccessMessage && (
          <View style={styles.successMessageOverlay} pointerEvents="none">
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessageText}>Bet Successful</Text>
            </View>
          </View>
        )}

        <Modal
          transparent
          animationType="fade"
          visible={winLossPopupVisible}
          // visible={true}
          onRequestClose={() => setWinLossPopupVisible(false)}
        >
          <View style={styles.winLossModalOverlay}>
            <View style={styles.winLossContentContainer}>
              <Image
                source={
                  settledBet?.isWin
                    ? require("@/assets/win.webp")
                    : require("@/assets/loose.webp")
                }
                style={styles.winLossBackgroundImage}
                contentFit="contain"
              />

              <View style={styles.winLossPopupContent}>
                <Text style={[styles.winLossTitle, { color: settledBet?.isWin ? "white" : "#7190B4" }]}>
                  {settledBet?.isWin ? "Congratulations" : "Sorry"}
                </Text>

                <View style={styles.winLossResultsRow}>
                  <Text style={[styles.lotteryResultsRowLabel, { color: settledBet?.isWin ? "white" : "#7190B4" }]}>Lottery results</Text>

                  {(() => {
                    const outcomeColors = getColorDots(settledBet?.round?.outcomeNumber ?? 0);

                    const ResultBox = ({ children, minWidth, alwaysShowBg = false, isCircle = false }: { children: React.ReactNode, minWidth?: number, alwaysShowBg?: boolean, isCircle?: boolean }) => {
                      const hasMultiColor = outcomeColors.length > 1;
                      const showBg = alwaysShowBg || !hasMultiColor;

                      const boxStyle = [
                        styles.winLossResultBox,
                        { overflow: "hidden" },
                        minWidth ? { minWidth } : {},
                        isCircle && { width: minWidth || wp(8.5), height: minWidth || wp(8.5), borderRadius: 999, paddingHorizontal: 0, paddingVertical: 0 }
                      ] as any;

                      if (showBg) {
                        return (
                          <View style={[boxStyle, !hasMultiColor && { backgroundColor: outcomeColors[0] }]}>
                            {hasMultiColor && (
                              <Svg height="100%" width="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
                                <Rect x="0" y="0" width="100" height="100" fill={outcomeColors[0]} />
                                <Polygon points="0,100 100,100 100,0" fill={outcomeColors[1]} />
                              </Svg>
                            )}
                            {children}
                          </View>
                        );
                      }
                      return (
                        <View style={boxStyle}>
                          {children}
                        </View>
                      );
                    };

                    return (
                      <>
                        {settledBet?.round?.outcomeColor && (
                          <ResultBox alwaysShowBg={true}>
                            <Text style={styles.winLossResultBoxText}>
                              {settledBet.round.outcomeColor.charAt(0).toUpperCase() + settledBet.round.outcomeColor.slice(1).toLowerCase()}
                            </Text>
                          </ResultBox>
                        )}

                        <ResultBox minWidth={wp(8)} isCircle={true}>
                          <Text style={styles.winLossResultBoxText}>
                            {settledBet?.round?.outcomeNumber}
                          </Text>
                        </ResultBox>

                        {settledBet?.round?.outcomeBigSmall && (
                          <ResultBox>
                            <Text style={styles.winLossResultBoxText}>
                              {settledBet.round.outcomeBigSmall.charAt(0).toUpperCase() + settledBet.round.outcomeBigSmall.slice(1).toLowerCase()}
                            </Text>
                          </ResultBox>
                        )}
                      </>
                    );
                  })()}
                </View>

                <View style={styles.winLossScrollContent}>
                  {settledBet?.isWin ? (
                    <>
                      <Text style={[styles.winLossBonusTitle, { fontSize: wp(4), marginBottom: 0, marginTop: wp(1) }]}>Bonus</Text>
                      <Text style={[styles.winLossBonusAmount, { fontSize: wp(8) }]}>₹{settledBet.payoutAmount.toFixed(2)}</Text>
                      <View style={styles.winLossPeriodInfo}>
                        <Text style={styles.winLossPeriodText}>Period: {selectedGame.name}</Text>
                        <Text style={styles.winLossPeriodText}>{settledBet.round?.period}</Text>
                      </View>
                    </>
                  ) : (
                    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                      <Text style={styles.winLossLoseTitle}>Lose</Text>
                      <View style={styles.winLossPeriodInfo}>
                        <Text style={styles.winLossPeriodText}>Period: {selectedGame.name}</Text>
                        <Text style={styles.winLossPeriodText}>{settledBet?.round?.period}</Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.winLossAutoClose}>
                  <Ionicons style={{ marginTop: -3 }} name="checkmark-circle-outline" size={wp(9)} color="#fff" />
                  <Text style={styles.winLossAutoCloseText}>3 seconds auto close</Text>
                </View>
              </View>

              <Pressable
                style={styles.winLossCloseButton}
                onPress={() => setWinLossPopupVisible(false)}
              >
                <Ionicons name="close-circle-outline" size={wp(15)} color="white" />
              </Pressable>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  recentResults: {
    flexDirection: "row",
    gap: wp(2.1),
  },
  colorButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: wp(3.2),
    height: hp(5.5),
  },
  greenColorButton: {
    backgroundColor: "#17B15E",
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: wp(3.2),
    borderTopRightRadius: wp(3.2),
    borderBottomRightRadius: 0,
  },
  violetColorButton: {
    backgroundColor: "#9B48DB",
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(3.2),
  },
  redColorButton: {
    backgroundColor: "#DB3838",
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: wp(3.2),
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: wp(3.2),
  },
  colorBettingContainer: {
    backgroundColor: "#011341",
    borderRadius: wp(3.2),
    padding: wp(3.2),
    gap: wp(3.2),
  },
  colorButtonText: {
    fontSize: wp(4.3),
    fontWeight: "600",
    color: "#fff",
  },
  numberBall: {
    width: wp(18.7),
    height: wp(18.7),
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  numberBallImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(8),
  },
  numberGridRow: {
    justifyContent: "space-between",
  },
  numberGridContent: {
    gap: wp(3.2),
    padding: wp(3.2),
    borderRadius: wp(3.2),
    backgroundColor: "#05012B",
  },
  multiplierSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: wp(2.1),
  },
  randomButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(4.3),
    width: wp(24),
    borderRadius: wp(2.1),
    borderWidth: 1,
    borderColor: "#D23838",
  },
  randomButtonText: {
    fontSize: wp(4.3),
    fontWeight: "400",
    color: "#D23838",
  },
  multiplierItemButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#05012B",
    height: hp(4.3),
    width: wp(11.2),
    borderRadius: wp(2.1),
  },
  multiplierItemButtonActive: {
    backgroundColor: "#17B15E",
  },
  multiplierItemText: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#92A8E3",
  },
  multiplierItemTextActive: {
    color: "#fff",
  },
  bigSizeButton: {
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DD9138",
  },
  bigSizeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  smallSizeButton: {
    height: "100%",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5088D3",
  },
  sizeToggleSection: {
    height: hp(5.5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    marginHorizontal: wp(3.2),
    borderRadius: wp(5.3),
    overflow: "hidden",
  },
  sizeButtonText: {
    fontSize: wp(4.8),
    color: "#fff",
  },
  chartContainer: {
    backgroundColor: "#021341",
    borderRadius: wp(2.7),
    marginBottom: hp(2),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3.2),
    overflow: "hidden",
  },
  chartContentWrapper: {
    position: "relative",
    overflow: "hidden",
  },
  chartSvgOverlay: {
    zIndex: -1,
  },
  chartRowsWrapper: {
    zIndex: 1,
    position: "relative",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: 0,
  },
  chartPeriod: {
    fontSize: wp(3.7),
    color: "#fff",
    fontWeight: "600",
    width: wp(38.7),
  },
  chartNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.1),
  },
  chartNumberCircle: {
    width: wp(4.8),
    height: wp(4.8),
    borderRadius: wp(2.4),
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  chartNumberCircleHighlighted: {
    overflow: "hidden",
  },
  chartNumberText: {
    fontSize: 12,
    fontWeight: "600",
  },
  chartBSBadge: {
    width: wp(5.1),
    height: wp(5.1),
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(2.7),
  },
  chartBSBadgeBig: {
    backgroundColor: "#EAB308",
  },
  chartBSBadgeSmall: {
    backgroundColor: "#3B82F6",
  },
  chartBSBadgeText: {
    fontSize: wp(3.7),
    fontWeight: "700",
    color: "#fff",
  },
  historyTable: {
    overflow: "hidden",
    borderTopEndRadius: wp(2.7),
    borderTopStartRadius: wp(2.7),
    marginBottom: hp(2),
  },
  myHistoryCardContainer: {
    // backgroundColor: "#021341",
    overflow: "hidden",
  },
  myHistoryCard: {
    flexDirection: "row",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    alignItems: "center",
  },
  myHistoryLeft: {
    marginRight: wp(3.5),
  },
  myHistoryNumberCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: "center",
    justifyContent: "center",
  },
  myHistoryNumberText: {
    color: "#fff",
    fontSize: wp(6),
    fontWeight: "bold",
  },
  myHistoryMiddle: {
    flex: 1,
    justifyContent: "center",
  },
  myHistoryPeriodText: {
    fontSize: wp(4),
    color: "#fff",
    fontWeight: "600",
  },
  myHistoryTimeText: {
    fontSize: wp(3.2),
    color: "#929292",
    marginTop: hp(0.5),
  },
  myHistoryRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: hp(1),
  },
  myHistoryDetails: {
    padding: wp(4),
    paddingTop: 0
  },
  detailsTitle: {
    fontSize: wp(4.5),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: hp(1),
  },
  detailsContent: {
    borderRadius: wp(2),
    gap: hp(1),
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#001C54",
    borderRadius: 4,
    padding: 1
  },
  detailsLabel: {
    fontSize: wp(5),
    color: "#E3EFFF",
  },
  detailsValue: {
    fontSize: wp(4.8),
    color: "#92a8e3",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.35),
    borderRadius: wp(1.5),
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: wp(3.2),
    fontWeight: "500",
  },
  myHistoryAmountText: {
    fontSize: wp(4),
    fontWeight: "700",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2C5ECA",
    paddingVertical: hp(1.7),
    paddingHorizontal: wp(3.2),
    alignItems: "center",
  },
  tableHeaderText: {
    color: "#fff",
    fontSize: wp(3.5),
    fontWeight: "600",
  },
  periodHeader: {
    flex: 2,
    textAlign: "left",
  },
  numberHeader: {
    flex: 0.6,
    textAlign: "center",
  },
  bigSmallHeader: {
    flex: 1,
    textAlign: "center",
  },
  colorHeader: {
    flex: 0.8,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3.2),
    alignItems: "center",
  },
  periodCell: {
    flex: 2,
    fontSize: wp(3.2),
    color: "#fff",
  },
  numberCell: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: wp(4.8),
    fontWeight: "bold",
  },
  gradientNumberMask: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#021341",
  },
  gradientNumberGradient: {
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  bigSmallCell: {
    flex: 1,
    fontSize: wp(3.2),
    color: "#fff",
    textAlign: "center",
  },
  colorDotsContainer: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(1.1),
  },
  colorDot: {
    width: wp(3.2),
    height: wp(3.2),
    borderRadius: wp(1.6),
  },
  paginationText: {
    fontSize: wp(4.3),
    color: "#fff",
  },
  bettingSectionWrapper: {
    position: "relative",
  },
  countdownSectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: wp(3.2),
    justifyContent: "center",
    alignItems: "center",
  },
  countdownDigitsRow: {
    flexDirection: "row",
    gap: wp(4.3),
    alignItems: "center",
    justifyContent: "center",
  },
  countdownDigitCard: {
    width: wp(32),
    height: hp(19.7),
    backgroundColor: "#0A1F44",
    borderRadius: wp(4.3),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1E3A5F",
  },
  countdownDigitText: {
    fontSize: wp(25),
    fontWeight: "800",
    color: "#7afec3",
  },
  successMessageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  successMessageContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(3.2),
  },
  successMessageText: {
    color: "#fff",
    fontSize: wp(4.8),
    fontWeight: "600",
  },
  winLossModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  winLossContentContainer: {
    width: "85%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  winLossBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  winLossPopupContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingTop: hp(68),
  },
  winLossTitle: {
    fontSize: wp(10),
    fontWeight: "800",

    marginBottom: hp(3),
  },
  winLossResultsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  lotteryResultsRowLabel: {
    color: "#7190B4",
    fontSize: wp(4.6),
    marginRight: wp(2),
  },
  winLossResultBox: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: wp(1.5),
    marginHorizontal: wp(1),
    alignItems: "center",
    justifyContent: "center",
  },
  winLossResultBoxText: {
    color: "white",
    fontSize: wp(4.5),
    fontWeight: "800",
  },
  winLossResultNumber: {
    fontSize: wp(5),
    fontWeight: "900",
    marginHorizontal: wp(1.5),
    color: "white"
  },
  winLossScrollContent: {
    width: wp(55),
    height: hp(16.5),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1.5),
  },
  winLossBonusTitle: {
    fontSize: wp(5.5),
    fontWeight: "700",
    color: "#FF4500",
    marginBottom: hp(0.4),
  },
  winLossBonusAmount: {
    fontSize: wp(9),
    fontWeight: "900",
    color: "#FF4500",
  },
  winLossLoseTitle: {
    fontSize: wp(10),
    fontWeight: "900",
    color: "#92A9E3",
  },
  winLossPeriodInfo: {
    marginTop: hp(1),
    alignItems: "center",
  },
  winLossPeriodText: {
    color: "#92A9E3",
    fontSize: wp(4.5),
    textAlign: "center",
  },
  winLossAutoClose: {
    flexDirection: "row",
    marginTop: hp(6),
    width: "90%",
    paddingHorizontal: wp(6)
  },
  winLossAutoCloseText: {
    color: "#fff",
    fontSize: wp(5),
    marginLeft: wp(2),
  },
  winLossCloseButton: {
    marginBottom: hp(40),
  },
});
