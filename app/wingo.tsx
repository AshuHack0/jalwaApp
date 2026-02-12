import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect, useCallback } from "react";
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
  WINGO_ANNOUNCEMENT_ITEM_HEIGHT,
  WINGO_TABS,
  WINGO_API_PATH_MAP,
  CHART_CIRCLE_SIZE,
  CHART_CIRCLE_GAP,
  CHART_PERIOD_WIDTH,
  CHART_NUM_SPACING,
} from "@/constants/Wingo";
import { fetchWinGoGameData, type WinGoGameData, type WinGoRound } from "@/services/api";
import { Audio } from "expo-av";

function formatTimeRemaining(endsAt: string | Date | null): string {
  if (!endsAt) return "00 : 00";
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, end - now);
  const totalSec = Math.floor(diffMs / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
}

function getSecondsRemaining(endsAt: string | Date | null): number {
  if (!endsAt) return 0;
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((end - now) / 1000));
}

export default function WinGoScreen() {
  const router = useRouter();
  const [walletBalance] = useState("₹0.00");
  const [selectedMode, setSelectedMode] = useState(
    WINGO_GAMES[0]?.gameCode ?? "",
  );
  const [selectedMultiplier, setSelectedMultiplier] = useState("X1");
  const [selectedSize, setSelectedSize] = useState("Big");
  const [selectedTab, setSelectedTab] = useState("Game history");
  const [pageGameHistory, setPageGameHistory] = useState(1);
  const [pageMyHistory, setPageMyHistory] = useState(1);
  const [gameMyHistory] = useState<WinGoRound[]>([]);

  const [gameData, setGameData] = useState<WinGoGameData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("00 : 00");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [showCountdownModal, setShowCountdownModal] = useState(false);

  const gameModes = WINGO_GAMES.map((game) => ({
    id: game.gameCode,
    label: game.name,
  }));

  const multipliers = WINGO_MULTIPLIERS.map((value) => `X${value}`);
  const numbers = WINGO_NUMBER_COLOR_MAP.map((item) => item.number);

  const [chartRowLayouts, setChartRowLayouts] = useState<
    Record<number, { y: number; height: number }>
  >({});
  const announcementFlatListRef = useRef<FlatList>(null);
  const announcementIndexRef = useRef(0);
  const infiniteAnnouncementData = [
    ...WINGO_ANNOUNCEMENT_MESSAGES,
    WINGO_ANNOUNCEMENT_MESSAGES[0],
  ];

  const selectedGame =
    WINGO_GAMES.find((game) => game.gameCode === selectedMode) ??
    WINGO_GAMES[0];
  const apiPath = WINGO_API_PATH_MAP[selectedGame.durationSeconds];
  const refetchedForRoundEndRef = useRef<string | null>(null);
  const countdownSoundRef = useRef<{
    di1: Audio.Sound | null;
    di2: Audio.Sound | null;
  }>({ di1: null, di2: null });
  const lastPlayedSecondRef = useRef<number | null>(null);

  const fetchGameData = useCallback(async () => {
    if (!apiPath) return;
    const data = await fetchWinGoGameData(apiPath, pageGameHistory, 10);
    if (data) setGameData(data);
  }, [apiPath, pageGameHistory]);

  // Reset ref when game mode changes
  useEffect(() => {
    refetchedForRoundEndRef.current = null;
  }, [apiPath]);

  // Fetch WinGo game data (GET API)
  useEffect(() => {
    if (!apiPath) return;
    fetchGameData();
  }, [apiPath, pageGameHistory, fetchGameData]);

  // Update time remaining every second; refetch when round ends; show countdown modal when 5 sec remain
  useEffect(() => {
    const endsAt = gameData?.currentRound?.endsAt ?? null;
    setTimeRemaining(formatTimeRemaining(endsAt));
    const secs = getSecondsRemaining(endsAt);
    setSecondsRemaining(secs);
    setShowCountdownModal(secs <= 5);

    const interval = setInterval(() => {
      const end = gameData?.currentRound?.endsAt;
      const now = Date.now();

      if (end && now >= new Date(end).getTime()) {
        if (refetchedForRoundEndRef.current !== end) {
          refetchedForRoundEndRef.current = end;
          fetchGameData();
        }
        setSecondsRemaining(0);
      } else {
        refetchedForRoundEndRef.current = null;
      }

      const formatted = formatTimeRemaining(end ?? null);
      const remaining = getSecondsRemaining(end ?? null);
      setTimeRemaining(formatted);
      setSecondsRemaining(remaining);
      // Show modal when 5 sec or less remain (including 0)
      setShowCountdownModal(remaining <= 5);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameData?.currentRound?.endsAt, fetchGameData]);

  // Load countdown sounds on mount
  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      const { sound: di1 } = await Audio.Sound.createAsync(
        require("@/assets/Wingo/sound/di1-0f3d86cb.mp3"),
      );
      const { sound: di2 } = await Audio.Sound.createAsync(
        require("@/assets/Wingo/sound/di2-ad9aa8fb.mp3"),
      );
      countdownSoundRef.current = { di1, di2 };
    })();
    return () => {
      countdownSoundRef.current.di1?.unloadAsync();
      countdownSoundRef.current.di2?.unloadAsync();
    };
  }, []);

  // Play countdown sounds when overlay is showing (5,4,3,2,1 -> di1; 0 -> di2)
  useEffect(() => {
    if (!showCountdownModal || secondsRemaining > 5) {
      lastPlayedSecondRef.current = null;
      return;
    }
    if (lastPlayedSecondRef.current === secondsRemaining) return;
    lastPlayedSecondRef.current = secondsRemaining;

    const { di1, di2 } = countdownSoundRef.current;
    if (secondsRemaining === 0) {
      di2?.replayAsync();
    } else if (secondsRemaining <= 5 && di1) {
      di1.replayAsync();
    }
  }, [showCountdownModal, secondsRemaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = announcementIndexRef.current;
      const nextIndex = (current + 1) % infiniteAnnouncementData.length;

      announcementIndexRef.current = nextIndex;

      if (nextIndex === 0) {
        announcementFlatListRef.current?.scrollToOffset({
          offset: 0,
          animated: false,
        });
      } else {
        announcementFlatListRef.current?.scrollToOffset({
          offset: nextIndex * WINGO_ANNOUNCEMENT_ITEM_HEIGHT,
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

  // Derive UI data from API response
  const recentResults =
    gameData?.historyRounds
      ?.map((r) => r.outcomeNumber)
      .filter((n): n is number => n != null && n >= 0 && n <= 9)
      .slice(0, 5) ?? [];
  const gameHistory =
    gameData?.historyRounds
      ?.filter((r) => r.outcomeNumber != null && r.outcomeNumber >= 0)
      ?.map((r) => ({
        period: r.period,
        number: r.outcomeNumber as number,
        size: r.outcomeBigSmall === "BIG" ? "Big" : "Small",
        color: "green",
      })) ?? [];
  const displayPeriod =
    gameData?.currentRound?.period ??
    gameData?.historyRounds?.[0]?.period ??
    "-";
  const totalPagesGameHistory =
    gameData?.historyPagination?.totalPages ?? 1;
  const totalPagesMyHistory = 1; // TODO: from API when My history has data

  // Reset chart row layouts only when pagination changes (new rows will update via onLayout when game mode changes)
  useEffect(() => {
    if (selectedTab === "Chart") setChartRowLayouts({});
  }, [pageGameHistory, selectedTab]);

  const hasDataForCurrentTab =
    (selectedTab === "Game history" && (gameHistory?.length ?? 0) > 0) ||
    (selectedTab === "Chart" && (gameHistory?.length ?? 0) > 0) ||
    (selectedTab === "My history" && (gameMyHistory?.length ?? 0) > 0);

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ThemedView style={styles.innerContainer}>
        {/* Header */}
        <View
          style={{
            height: 52.74,
            width: "100%",
            paddingHorizontal: 16,
            paddingVertical: 8,
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
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={
              "https://jalwaimg.jalwa-jalwa.com/Jalwa/other/h5setting_20250315140925tbe6.png"
            }
            style={{ width: 128, height: "100%" }}
            contentFit="cover"
          />

          <View
            style={{
              flex: 1,
              height: "100%",
              flexDirection: "row",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            <Image
              source={"https://www.jalwagame.win/assets/png/kefu-b361c42f.webp"}
              style={{ width: 30, height: 30 }}
              contentFit="cover"
            />

            <Image
              source={
                "https://www.jalwagame.win/assets/png/voice-62dbf38c.webp"
              }
              style={{ width: 30, height: 30 }}
              contentFit="cover"
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Wallet Section */}
          <View
            style={{
              backgroundColor: "#001C54",
              borderRadius: 16,
              marginTop: 16,
              marginBottom: 16,
              overflow: "hidden",
              position: "relative",
              padding: 20,
              paddingHorizontal: 30,
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
                borderRadius: 16,
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
                marginBottom: 10,
                gap: 38,
                paddingLeft: 62,
              }}
            >
              <ThemedText
                style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}
              >
                {walletBalance}
              </ThemedText>
              <TouchableOpacity>
                <Image
                  source={
                    "https://www.jalwagame.win/assets/png/refireshIcon-2bc1b49f.webp"
                  }
                  style={{ width: 24, height: 24 }}
                  contentFit="cover"
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <Ionicons name="wallet-outline" size={16} color="white" />
              <ThemedText
                style={{ fontSize: 16, color: "white", fontWeight: "600" }}
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
                height: 40,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 149,
                  height: "100%",
                  backgroundColor: "#EF4444",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText
                  style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}
                >
                  Withdraw
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 149,
                  height: "100%",
                  backgroundColor: "#10B981",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText
                  style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}
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
              height: 42.42,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 11,
              marginBottom: 16,
              overflow: "hidden",
              borderColor: "#224ba2",
              borderWidth: 1,
              paddingHorizontal: 10,
            }}
          >
            <Ionicons
              name="volume-medium-sharp"
              size={24}
              color="rgb(122, 254, 195)"
            />

            <FlatList
              ref={announcementFlatListRef}
              data={infiniteAnnouncementData}
              keyExtractor={(_, i) => `announcement-${i}`}
              horizontal={false}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              pagingEnabled={false}
              snapToInterval={WINGO_ANNOUNCEMENT_ITEM_HEIGHT}
              snapToAlignment="start"
              decelerationRate="fast"
              scrollEventThrottle={16}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(
                  e.nativeEvent.contentOffset.y /
                    WINGO_ANNOUNCEMENT_ITEM_HEIGHT,
                );
                if (idx >= WINGO_ANNOUNCEMENT_MESSAGES.length) {
                  announcementIndexRef.current = 0;
                  setTimeout(() => {
                    announcementFlatListRef.current?.scrollToOffset({
                      offset: 0,
                      animated: false,
                    });
                  }, 0);
                } else {
                  announcementIndexRef.current = idx;
                }
              }}
              style={{ width: 270, height: WINGO_ANNOUNCEMENT_ITEM_HEIGHT }}
              getItemLayout={(_, index) => ({
                length: WINGO_ANNOUNCEMENT_ITEM_HEIGHT,
                offset: WINGO_ANNOUNCEMENT_ITEM_HEIGHT * index,
                index,
              })}
              renderItem={({ item }) => (
                <View
                  style={{
                    height: WINGO_ANNOUNCEMENT_ITEM_HEIGHT,
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                  }}
                >
                  <ThemedText
                    numberOfLines={2}
                    style={{
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: "400",
                      lineHeight: 16,
                    }}
                  >
                    {item}
                  </ThemedText>
                </View>
              )}
            />

            <LinearGradient
              colors={["rgb(122, 254, 195)", "rgb(2, 175, 182)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                borderRadius: 100,
                width: 86,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText
                style={{ color: "#05012B", fontSize: 16, fontWeight: "400" }}
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
              height: 103,
              width: "100%",
              backgroundColor: "#001c54",
              borderRadius: 13,
              marginBottom: 16,
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
                    style={{ width: 50, height: 50 }}
                  />
                  <ThemedText
                    style={{
                      width: 70,
                      fontSize: 15,
                      fontWeight: "400",
                      color: isActive ? "black" : "#92A8E3",
                      lineHeight: 17,
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
                        borderRadius: 13,
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
              borderRadius: 13,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
              padding: 16,
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
            <View style={{ height: "100%", width: "46%", gap: 4 }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 6,
                  height: 26,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#05012B",
                  borderRadius: 50,
                }}
              >
                <Ionicons name="bar-chart-outline" size={16} color="#05012B" />
                <ThemedText style={{ fontSize: 14, color: "#05012B" }}>
                  How to play
                </ThemedText>
              </TouchableOpacity>
              <ThemedText
                style={{ fontSize: 15, fontWeight: "500", color: "#05012B" }}
              >
                {selectedGame?.name}
              </ThemedText>
              <FlatList
                data={recentResults}
                keyExtractor={(item, index) => `recent-${index}-${item}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentResults}
                renderItem={({ item: result }) => (
                  <Image
                    source={WINGO_BALL_IMAGES[result]}
                    style={{ width: 28, height: 28 }}
                    contentFit="cover"
                  />
                )}
              />
            </View>

            <View
              style={{
                height: "100%",
                width: "46%",
                alignItems: "flex-end",
                gap: 4,
              }}
            >
              <ThemedText
                style={{ fontSize: 13, color: "#05012B", fontWeight: "800" }}
              >
                Time remaining
              </ThemedText>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                {timeRemaining
                  .replace(/\s/g, "")
                  .split("")
                  .map((char, index, arr) => {
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    const segmentWidth = char === ":" ? 12 : 28;
                    const segmentHeight = 36;
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
                              fontSize: 20,
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
                style={{ fontSize: 16, fontWeight: "800", color: "#05012B" }}
              >
                {displayPeriod}
              </ThemedText>
            </View>
          </View>

          <View style={styles.bettingSectionWrapper}>
            <View style={styles.colorBettingContainer}>
              {/* Color Betting Options */}
              <View style={styles.colorButtonsRow}>
                <TouchableOpacity style={styles.greenColorButton}>
                  <ThemedText style={styles.colorButtonText}>Green</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.violetColorButton}>
                  <ThemedText style={styles.colorButtonText}>Violet</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.redColorButton}>
                  <ThemedText style={styles.colorButtonText}>Red</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Number Betting Grid */}
              <FlatList
                data={numbers}
                keyExtractor={(item) => item.toString()}
                columnWrapperStyle={styles.numberGridRow}
                contentContainerStyle={styles.numberGridContent}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.numberBall}>
                    <Image
                      source={WINGO_BALL_IMAGES[item]}
                      style={styles.numberBallImage}
                    />
                  </TouchableOpacity>
                )}
                numColumns={5}
              />

              {/* Multiplier Buttons */}
              <FlatList
                data={multipliers}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.multiplierSection}
                ListHeaderComponent={() => (
                  <TouchableOpacity style={styles.randomButtonContainer}>
                    <ThemedText style={styles.randomButtonText}>
                      Random
                    </ThemedText>
                  </TouchableOpacity>
                )}
                renderItem={({ item: mult }) => (
                  <TouchableOpacity
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
                )}
              />

              {/* Big/Small Toggle */}
              <View style={styles.sizeToggleSection}>
                <TouchableOpacity
                  style={[
                    styles.bigSizeButton,
                    selectedSize !== "Big" && { opacity: 0.7 },
                  ]}
                  onPress={() => setSelectedSize("Big")}
                >
                  <ThemedText style={styles.bigSizeButtonText}>Big</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.smallSizeButton,
                    selectedSize !== "Small" && { opacity: 0.7 },
                  ]}
                  onPress={() => setSelectedSize("Small")}
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
            style={{ flexDirection: "row", height: 48, marginVertical: 16 }}
          >
            {WINGO_TABS.map((tab) => {
              const isSelected = selectedTab === tab;
              const tabContent = (
                <ThemedText
                  style={{
                    fontSize: 16,
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
                    marginHorizontal: 4,
                    borderRadius: 8,
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
                        borderRadius: 8,
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
                <FlatList
                  data={gameHistory}
                  keyExtractor={(item, index) =>
                    `history-${item.period}-${index}`
                  }
                  contentContainerStyle={{ backgroundColor: "#021341" }}
                  renderItem={({ item }) => (
                    <View style={styles.tableRow}>
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
                  )}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#021341",
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/Wingo/Empty.png")}
                  style={{ width: 200, height: 200 }}
                />
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "600", color: "black" }}
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
                      const centerOffset = CHART_CIRCLE_SIZE / 2;
                      const centerX1 =
                        CHART_PERIOD_WIDTH + centerOffset + curr.number * CHART_NUM_SPACING;
                      const centerX2 =
                        CHART_PERIOD_WIDTH + centerOffset + next.number * CHART_NUM_SPACING;
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
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/Wingo/Empty.png")}
                  style={{ width: 200, height: 200 }}
                />
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "600", color: "black" }}
                >
                  No data
                </ThemedText>
              </View>
            ))}

          {/* My history */}
          {selectedTab === "My history" &&
            (gameMyHistory?.length > 0 ? (
              <View>
                <Text>My history</Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#021341",
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/Wingo/Empty.png")}
                  style={{ width: 200, height: 200 }}
                />
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "600", color: "black" }}
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
                gap: 40,
                paddingVertical: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 8,
                  backgroundColor: currentPage === 1 ? "#001C54" : "#00ECBE",
                  borderRadius: 10,
                }}
                onPress={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={currentPage === 1 ? "#9BA1A6" : "black"}
                />
              </TouchableOpacity>
              <ThemedText style={styles.paginationText}>
                {currentPage}/{totalPages || 1}
              </ThemedText>
              <TouchableOpacity
                style={{
                  padding: 8,
                  backgroundColor:
                    currentPage >= totalPages ? "#001C54" : "#00ECBE",
                  borderRadius: 10,
                }}
                onPress={() =>
                  currentPage < totalPages &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={currentPage >= totalPages ? "#9BA1A6" : "black"}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
    gap: 8,
  },
  colorButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    height: 45,
  },
  greenColorButton: {
    backgroundColor: "#17B15E",
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 0,
  },
  violetColorButton: {
    backgroundColor: "#9B48DB",
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  redColorButton: {
    backgroundColor: "#DB3838",
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 12,
  },
  colorBettingContainer: {
    backgroundColor: "#011341",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  colorButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  numberBall: {
    width: 70,
    height: 70,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  numberBallImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  numberGridRow: {
    justifyContent: "space-between",
  },
  numberGridContent: {
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#05012B",
  },
  multiplierSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  randomButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D23838",
  },
  randomButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#D23838",
  },
  multiplierItemButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#05012B",
    height: 35,
    width: 42,
    borderRadius: 8,
  },
  multiplierItemButtonActive: {
    backgroundColor: "#17B15E",
  },
  multiplierItemText: {
    fontSize: 15,
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
    height: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "blue",
    marginHorizontal: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  sizeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  chartContainer: {
    backgroundColor: "#021341",
    borderRadius: 10,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  chartPeriod: {
    fontSize: 13.76,
    color: "#fff",
    fontWeight: "600",
    width: CHART_PERIOD_WIDTH,
  },
  chartNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: CHART_CIRCLE_GAP,
  },
  chartNumberCircle: {
    width: CHART_CIRCLE_SIZE,
    height: CHART_CIRCLE_SIZE,
    borderRadius: CHART_CIRCLE_SIZE / 2,
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
    width: 19,
    height: 19,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10
  },
  chartBSBadgeBig: {
    backgroundColor: "#EAB308",
  },
  chartBSBadgeSmall: {
    backgroundColor: "#3B82F6",
  },
  chartBSBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  historyTable: {
    overflow: "hidden",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2C5ECA",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  tableHeaderText: {
    color: "#fff",
    fontSize: 13,
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  periodCell: {
    flex: 2,
    fontSize: 12,
    color: "#fff",
  },
  numberCell: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 18,
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
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },
  colorDotsContainer: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paginationText: {
    fontSize: 16,
    color: "#fff",
  },
  bettingSectionWrapper: {
    position: "relative",
  },
  countdownSectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownDigitsRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownDigitCard: {
    width: 120,
    height: 160,
    backgroundColor: "#0A1F44",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1E3A5F",
  },
  countdownDigitText: {
    fontSize: 96,
    fontWeight: "800",
    color: "#7afec3",
  },
});
