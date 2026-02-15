import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Pressable,
  Alert,
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
import {
  WINGO_GAMES,
  WINGO_MULTIPLIERS,
  WINGO_NUMBER_COLOR_MAP,
  COLOR_MAP,
  WINGO_BALL_IMAGES,
  WINGO_ANNOUNCEMENT_MESSAGES,
  WINGO_TABS,
  WINGO_API_PATH_MAP,
} from "@/constants/Wingo";
import { BetModal } from "@/components/BetModal";
import { useAuth } from "@/contexts/AuthContext";
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
  const { data: myHistoryData } = useWinGoMyHistory(
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

  // Update time remaining every second; refetch when round ends; show countdown modal when 5 sec remain
  useEffect(() => {
    const endsAt = currentRoundData?.currentRound?.endsAt ?? null;
    const offset = serverTimeOffsetRef.current;
    setTimeRemaining(formatTimeRemaining(endsAt, offset));
    const secs = getSecondsRemaining(endsAt, offset);
    setSecondsRemaining(secs);
    setShowCountdownModal(secs <= 5);

    const interval = setInterval(() => {
      const end = currentRoundData?.currentRound?.endsAt;
      const offset = serverTimeOffsetRef.current;
      const adjustedNow = Date.now() + offset;

      if (end && adjustedNow >= new Date(end).getTime()) {
        if (refetchedForRoundEndRef.current !== end) {
          refetchedForRoundEndRef.current = end;
          refetchCurrentRound();
          refetchHistory();
          refreshWallet();
        }
        setSecondsRemaining(0);
      } else {
        refetchedForRoundEndRef.current = null;
      }

      const formatted = formatTimeRemaining(end ?? null, offset);
      const remaining = getSecondsRemaining(end ?? null, offset);
      setTimeRemaining(formatted);
      setSecondsRemaining(remaining);
      // Show modal when 5 sec or less remain (including 0)
      setShowCountdownModal(remaining <= 5);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentRoundData?.currentRound?.endsAt, refetchCurrentRound, refetchHistory, refreshWallet]);

  // Set audio mode for countdown sounds
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  }, []);

  // Play countdown sounds when overlay is showing (5,4,3,2,1 -> di1; 0 -> di2)
  useEffect(() => {
    if (!showCountdownModal || secondsRemaining > 5) {
      lastCountdownSecondPlayed = null;
      return;
    }
    if (lastCountdownSecondPlayed === secondsRemaining) return;
    lastCountdownSecondPlayed = secondsRemaining;

    if (secondsRemaining === 0) {
      di2Player.seekTo(0);
      di2Player.play();
    } else if (secondsRemaining <= 5) {
      di1Player.seekTo(0);
      di1Player.play();
    }
  }, [showCountdownModal, secondsRemaining, di1Player, di2Player]);

  // Close bet modal when countdown starts
  useEffect(() => {
    if (showCountdownModal) {
      setShowBetModal(false);
    }
  }, [showCountdownModal]);

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

  // Derive UI data from API responses
  const recentResults =
    historyData?.historyRounds
      ?.map((r) => r.outcomeNumber)
      .filter((n): n is number => n != null && n >= 0 && n <= 9)
      .slice(0, 5) ?? [];
  const gameHistory =
    historyData?.historyRounds
      ?.filter((r) => r.outcomeNumber != null && r.outcomeNumber >= 0)
      ?.map((r) => ({
        period: r.period,
        number: r.outcomeNumber as number,
        size: r.outcomeBigSmall === "BIG" ? "Big" : "Small",
        color: "green",
      })) ?? [];
  const displayPeriod =
    currentRoundData?.currentRound?.period ??
    historyData?.historyRounds?.[0]?.period ??
    "-";
  const totalPagesGameHistory =
    historyData?.historyPagination?.totalPages ?? 1;
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ flex: 1, justifyContent: "center", height: "100%" }}
          >
            <Ionicons name="chevron-back" size={wp(6.4)} color="white" />
          </TouchableOpacity>
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
              <TouchableOpacity onPress={refreshWallet}>
                <Image
                  source={
                    "https://www.jalwagame.win/assets/png/refireshIcon-2bc1b49f.webp"
                  }
                  style={{ width: wp(6.4), height: wp(6.4) }}
                  contentFit="cover"
                />
              </TouchableOpacity>
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
              <TouchableOpacity
                style={{
                  width: wp(40),
                  height: "100%",
                  backgroundColor: "#EF4444",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText
                  style={{ fontSize: wp(4.8), fontWeight: "600", color: "#fff" }}
                >
                  Withdraw
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: wp(40),
                  height: "100%",
                  backgroundColor: "#10B981",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText
                  style={{ fontSize: wp(4.8), fontWeight: "600", color: "#fff" }}
                >
                  Deposit
                </ThemedText>
              </TouchableOpacity>
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
                <TouchableOpacity
                  key={mode.id}
                  style={{
                    flex: 1,
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                  onPress={() => {
                    setSelectedMode(mode.id);
                    setCurrentPage(1);
                  }}
                  activeOpacity={1}
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
                </TouchableOpacity>
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
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: wp(1.6),
                  height: hp(3.2),
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#05012B",
                  borderRadius: 50,
                }}
              >
                <Ionicons name="bar-chart-outline" size={wp(4.3)} color="#05012B" />
                <ThemedText style={{ fontSize: wp(3.7), color: "#05012B" }}>
                  How to play
                </ThemedText>
              </TouchableOpacity>
              <ThemedText
                style={{ fontSize: wp(4), fontWeight: "500", color: "#05012B" }}
              >
                {selectedGame?.name}
              </ThemedText>
              <View style={styles.recentResults}>
                {recentResults.map((result, index) => (
                  <Image
                    key={`recent-${index}-${result}`}
                    source={WINGO_BALL_IMAGES[result]}
                    style={{ width: wp(7.5), height: wp(7.5) }}
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
                <TouchableOpacity
                  style={styles.greenColorButton}
                  onPress={() => openBetModal("Green")}
                >
                  <ThemedText style={styles.colorButtonText}>Green</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.violetColorButton}
                  onPress={() => openBetModal("Violet")}
                >
                  <ThemedText style={styles.colorButtonText}>Violet</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.redColorButton}
                  onPress={() => openBetModal("Red")}
                >
                  <ThemedText style={styles.colorButtonText}>Red</ThemedText>
                </TouchableOpacity>
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
                <TouchableOpacity
                  style={[
                    styles.randomButtonContainer,
                    randomPickingInProgress && { opacity: 0.7 },
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
                </TouchableOpacity>
                {multipliers.map((mult) => (
                  <TouchableOpacity
                    key={mult}
                    style={[
                      styles.multiplierItemButton,
                      selectedMultiplier === mult &&
                        styles.multiplierItemButtonActive,
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
                  </TouchableOpacity>
                ))}
              </View>

              {/* Big/Small Toggle */}
              <View style={styles.sizeToggleSection}>
                <TouchableOpacity
                  style={[
                    styles.bigSizeButton,
                    selectedSize !== "Big" && { opacity: 0.7 },
                  ]}
                  onPress={() => {
                    setSelectedSize("Big");
                    openBetModal("Big");
                  }}
                >
                  <ThemedText style={styles.bigSizeButtonText}>Big</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.smallSizeButton,
                    selectedSize !== "Small" && { opacity: 0.7 },
                  ]}
                  onPress={() => {
                    setSelectedSize("Small");
                    openBetModal("Small");
                  }}
                >
                  <ThemedText style={styles.sizeButtonText}>Small</ThemedText>
                </TouchableOpacity>
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
                <TouchableOpacity
                  key={tab}
                  style={{
                    flex: 1,
                    height: "100%",
                    marginHorizontal: wp(1.1),
                    borderRadius: wp(2.1),
                    overflow: "hidden",
                  }}
                  onPress={() => setSelectedTab(tab)}
                  activeOpacity={0.8}
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
                </TouchableOpacity>
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

          {/* My history */}
          {selectedTab === "My history" &&
            (myHistoryBets.length > 0 ? (
              <View style={styles.historyTable}>
                <View style={styles.tableHeader}>
                  <ThemedText style={[styles.tableHeaderText, { flex: 2, textAlign: "left" }]}>
                    Period
                  </ThemedText>
                  <ThemedText style={[styles.tableHeaderText, { flex: 1, textAlign: "center" }]}>
                    Select
                  </ThemedText>
                  <ThemedText style={[styles.tableHeaderText, { flex: 0.8, textAlign: "center" }]}>
                    Point
                  </ThemedText>
                  <ThemedText style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>
                    Result
                  </ThemedText>
                </View>
                <View style={{ backgroundColor: "#021341" }}>
                  {myHistoryBets.map((bet) => {
                    const result = getBetResultLabel(bet);
                    return (
                      <View key={bet._id} style={styles.tableRow}>
                        <ThemedText style={{ flex: 2, fontSize: wp(3.2), color: "#fff" }}>
                          {bet.round?.period ?? "-"}
                        </ThemedText>
                        <ThemedText style={{ flex: 1, fontSize: wp(3.2), color: "#fff", textAlign: "center" }}>
                          {getBetSelectLabel(bet)}
                        </ThemedText>
                        <ThemedText style={{ flex: 0.8, fontSize: wp(3.2), color: "#fff", textAlign: "center" }}>
                          ₹{bet.amount}
                        </ThemedText>
                        <ThemedText style={{ flex: 1, fontSize: wp(3.2), color: result.color, textAlign: "right", fontWeight: "700" }}>
                          {result.text}
                        </ThemedText>
                      </View>
                    );
                  })}
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
              <TouchableOpacity
                style={{
                  padding: wp(2.1),
                  backgroundColor: currentPage === 1 ? "#001C54" : "#00ECBE",
                  borderRadius: wp(2.7),
                }}
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
              </TouchableOpacity>
              <ThemedText style={styles.paginationText}>
                {currentPage}/{totalPages || 1}
              </ThemedText>
              <TouchableOpacity
                style={{
                  padding: wp(2.1),
                  backgroundColor:
                    currentPage >= totalPages ? "#001C54" : "#00ECBE",
                  borderRadius: wp(2.7),
                }}
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
              </TouchableOpacity>
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
              } else {
                Alert.alert("Bet Failed", res.message ?? "Could not place bet.");
              }
            } catch {
              Alert.alert("Bet Failed", "Could not place bet.");
            }
          }}
        />
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
    backgroundColor: "blue",
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
});
