import { useAuth } from "@/contexts/AuthContext";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import {
  EBGaramond_400Regular,
  EBGaramond_700Bold,
  useFonts as useSerifFonts,
} from "@expo-google-fonts/eb-garamond";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts as useExpoFonts } from "expo-font";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type BadgeTone = "gold" | "teal";

type VipBadge = {
  tone: BadgeTone;
  value: string;
};

type BenefitItem = {
  icon: string;
  title: string;
  subtitle: string;
  badges: VipBadge[];
};

type HistoryItem = {
  title: string;
  detail: string;
  timestamp: string;
  accent: string;
  badges?: VipBadge[];
  value?: string;
  suffix?: string;
};

const BENEFIT_ITEMS: BenefitItem[] = [
  {
    icon: "gift",
    title: "Level up rewards",
    subtitle: "Each account can only receive 1 time",
    badges: [
      { tone: "gold", value: "60" },
      { tone: "teal", value: "0" },
    ],
  },
  {
    icon: "brightness-percent",
    title: "Monthly reward",
    subtitle: "Each account can only receive 1 time per month",
    badges: [
      { tone: "gold", value: "3" },
      { tone: "teal", value: "0" },
    ],
  },
  {
    icon: "cash-fast",
    title: "Rebate rate",
    subtitle: "Increase income of rebate",
    badges: [{ tone: "teal", value: "0.04%" }],
  },
];

const HISTORY_ITEMS: HistoryItem[] = [
  {
    title: "Successfully received",
    detail: "Successfully received [Monthly bonus]",
    timestamp: "2026-04-04 12:46:22",
    accent: "#2EE3A4",
    badges: [
      { tone: "gold", value: "6,900" },
      { tone: "teal", value: "0" },
    ],
  },
  {
    title: "Level maintenance",
    detail: "Level maintenance status not complete\n[0.00%Complete]",
    timestamp: "2026-04-01 00:19:20",
    accent: "#FF8A77",
    value: "-40000000",
    suffix: "EXP",
  },
  {
    title: "Level maintenance",
    detail: "Level maintenance status not complete\n[0.00%Complete]",
    timestamp: "2026-03-01 00:20:12",
    accent: "#FF8A77",
    value: "-10000000",
    suffix: "EXP",
  },
  {
    title: "VIP level downgrade",
    detail:
      "Relegation failed, experience points deducted and downgraded\n[VIP6]",
    timestamp: "2026-03-01 00:20:12",
    accent: "#F2AA54",
  },
];

const RULES = [
  "VIP level rewards are settled at 2:00 am on the 1st of every month.",
  "Each account can only receive level up rewards 1 time.",
  "Monthly rewards can only be received 1 time per month.",
  "Rebate rate increases the income of rebate as the VIP level grows.",
  "Failure to complete level maintenance may deduct experience points and downgrade the VIP level.",
];

function BadgePill({ tone, value }: VipBadge) {
  const isGold = tone === "gold";

  return (
    <View
      style={[
        styles.badgePill,
        isGold ? styles.badgePillGold : styles.badgePillTeal,
      ]}
    >
      <View
        style={[
          styles.badgeDot,
          isGold ? styles.badgeDotGold : styles.badgeDotTeal,
        ]}
      />
      <Text
        style={[
          styles.badgePillText,
          isGold ? styles.badgePillTextGold : styles.badgePillTextTeal,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function BenefitRow({ icon, title, subtitle, badges }: BenefitItem) {
  return (
    <View style={styles.benefitRow}>
      <LinearGradient
        colors={["#FFDA75", "#F5A621"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.benefitIconWrap}
      >
        <MaterialCommunityIcons name={icon as any} size={18} color="#FFF9E8" />
      </LinearGradient>

      <View style={styles.benefitTextWrap}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.benefitBadges}>
        {badges.map((badge) => (
          <BadgePill key={`${title}-${badge.tone}-${badge.value}`} {...badge} />
        ))}
      </View>
    </View>
  );
}

function RewardPromoArt() {
  return (
    <View style={styles.promoArtShell}>
      <LinearGradient
        colors={["#7BF7D7", "#35CAE0"]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={require("@/assets/giftRedeem-bb2f7a92.webp")}
        style={styles.rewardArtImage}
        contentFit="cover"
      />
      <Image
        source={require("@/assets/coin.png")}
        style={[styles.smallCoin, styles.smallCoinLeft]}
        contentFit="contain"
      />
      <Image
        source={require("@/assets/coin.png")}
        style={[styles.smallCoin, styles.smallCoinRight]}
        contentFit="contain"
      />
      <View style={[styles.cornerChip, styles.cornerChipGold]}>
        <Text style={styles.cornerChipTextGold}>60</Text>
      </View>
      <View
        style={[
          styles.cornerChip,
          styles.cornerChipTeal,
          styles.cornerChipRight,
        ]}
      >
        <Text style={styles.cornerChipTextTeal}>0</Text>
      </View>
    </View>
  );
}

function RebatePromoArt() {
  return (
    <View style={styles.promoArtShell}>
      <LinearGradient
        colors={["#82F6D6", "#25B1D8"]}
        start={{ x: 0.15, y: 0.05 }}
        end={{ x: 0.95, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.rebateTreasureWrap}>
        <LinearGradient
          colors={["#FFC94D", "#D08E16"]}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.rebateTreasureBase}
        >
          <MaterialCommunityIcons name="help-box" size={34} color="#FFF3B8" />
        </LinearGradient>
      </View>

      <Image
        source={require("@/assets/coin.png")}
        style={[styles.largeCoin, styles.largeCoinFront]}
        contentFit="contain"
      />
      <Image
        source={require("@/assets/coin.png")}
        style={[styles.largeCoin, styles.largeCoinBack]}
        contentFit="contain"
      />
      <Image
        source={require("@/assets/coin.png")}
        style={[styles.smallCoin, styles.smallCoinTop]}
        contentFit="contain"
      />

      <View style={[styles.bubbleBadge, styles.bubbleBadgeLeft]}>
        <MaterialCommunityIcons name="currency-usd" size={12} color="#FFCA50" />
      </View>
      <View style={[styles.bubbleBadge, styles.bubbleBadgeRight]}>
        <MaterialCommunityIcons name="help" size={12} color="#79F6D3" />
      </View>
      <View style={[styles.cornerChip, styles.cornerChipGold]}>
        <Text style={styles.cornerChipTextGold}>3</Text>
      </View>
      <View
        style={[
          styles.cornerChip,
          styles.cornerChipTeal,
          styles.cornerChipRight,
        ]}
      >
        <Text style={styles.cornerChipTextTeal}>0</Text>
      </View>
    </View>
  );
}

function BenefitPromoCard({
  title,
  subtitle,
  actionLabel,
  primary,
  onPress,
  children,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  primary?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.promoCard}>
      {children}

      <View style={styles.promoContent}>
        <Text style={styles.promoTitle}>{title}</Text>
        <Text style={styles.promoSubtitle}>{subtitle}</Text>

        <Pressable onPress={onPress}>
          {primary ? (
            <LinearGradient
              colors={["#7CF5C8", "#2AC6D8"]}
              start={{ x: 0, y: 0.2 }}
              end={{ x: 1, y: 0.9 }}
              style={styles.primaryAction}
            >
              <Text style={styles.primaryActionText}>{actionLabel}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>{actionLabel}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function HistoryRow({ item }: { item: HistoryItem }) {
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyBody}>
        <Text style={[styles.historyTitle, { color: item.accent }]}>
          {item.title}
        </Text>
        <Text style={styles.historyDetail}>{item.detail}</Text>
        <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
      </View>

      {item.badges ? (
        <View style={styles.historyBadgeStack}>
          {item.badges.map((badge) => (
            <BadgePill key={`${item.title}-${badge.tone}-${badge.value}`} {...badge} />
          ))}
        </View>
      ) : item.value ? (
        <View style={styles.historyValueWrap}>
          <Text style={styles.historyValue}>{item.value}</Text>
          {item.suffix ? (
            <Text style={styles.historySuffix}>{item.suffix}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function VipScreen() {
  useExpoFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  });
  useSerifFonts({
    SerifRegular: EBGaramond_400Regular,
    SerifBold: EBGaramond_700Bold,
  });

  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"history" | "rules">("history");

  const scrollY = useSharedValue(0);
  const viewportHeight = useSharedValue(1);
  const contentHeight = useSharedValue(1);
  const floatingCard = useSharedValue(0);
  const ctaPulse = useSharedValue(1);

  useEffect(() => {
    floatingCard.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1700, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    ctaPulse.value = withRepeat(
      withSequence(
        withTiming(1.02, {
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [ctaPulse, floatingCard]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const thumbHeight = useDerivedValue(() => {
    const visible = Math.max(viewportHeight.value, 1);
    const full = Math.max(contentHeight.value, visible);
    return Math.max((visible / full) * visible, 68);
  });

  const scrollbarThumbStyle = useAnimatedStyle(() => {
    const visible = Math.max(viewportHeight.value, 1);
    const full = Math.max(contentHeight.value, visible);
    const scrollable = Math.max(full - visible, 1);
    const trackTravel = Math.max(visible - thumbHeight.value, 0);
    const progress = Math.min(scrollY.value / scrollable, 1);

    return {
      height: thumbHeight.value,
      opacity: full > visible + 2 ? 1 : 0,
      transform: [{ translateY: progress * trackTravel }],
    };
  });

  const floatingCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingCard.value }],
  }));

  const medalStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${floatingCard.value * -1.25}deg` },
      { scale: 1 + Math.abs(floatingCard.value) * 0.01 },
    ],
  }));

  const ctaPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaPulse.value }],
  }));

  const displayName =
    typeof user?.nickname === "string" && user.nickname.trim()
      ? user.nickname.trim().toUpperCase()
      : "MIRACLE";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
          <Pressable onPress={() => router.back()} style={styles.headerBack}>
            <Ionicons name="chevron-back" size={26} color="#F3F8FF" />
          </Pressable>

          <Text style={styles.headerTitle}>VIP</Text>

          <View style={styles.headerBack} />
        </View>

        <View
          style={styles.scrollArea}
          onLayout={(event) => {
            viewportHeight.value = event.nativeEvent.layout.height;
          }}
        >
          <Animated.ScrollView
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={(_, height) => {
              contentHeight.value = height;
            }}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 28 },
            ]}
          >
            <Animated.View entering={FadeInUp.duration(280)} style={styles.heroPanel}>
              <View style={styles.profileRow}>
                <View style={styles.avatarShell}>
                  <Image
                    source={require("@/assets/1-a6662edb.webp")}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />

                  <View style={styles.avatarVipBubble}>
                    <LinearGradient
                      colors={["#FFF6B7", "#FDBB37"]}
                      start={{ x: 0.1, y: 0.1 }}
                      end={{ x: 0.9, y: 1 }}
                      style={styles.avatarVipBubbleInner}
                    >
                      <Ionicons name="star" size={10} color="#FFF" />
                    </LinearGradient>
                  </View>
                </View>

                <View style={styles.profileMeta}>
                  <View style={styles.vipRibbonRow}>
                    <View style={styles.vipRibbonCoinWrap}>
                      <LinearGradient
                        colors={["#FFF8B7", "#FDB628"]}
                        start={{ x: 0.2, y: 0.1 }}
                        end={{ x: 0.9, y: 0.9 }}
                        style={styles.vipRibbonCoin}
                      >
                        <Ionicons name="star" size={14} color="#FFF7E7" />
                      </LinearGradient>
                    </View>
                    <LinearGradient
                      colors={["#AFFCE2", "#47D0B6"]}
                      start={{ x: 0, y: 0.1 }}
                      end={{ x: 1, y: 0.9 }}
                      style={styles.vipRibbonTag}
                    >
                      <Text style={styles.vipRibbonText}>VIP6</Text>
                    </LinearGradient>
                  </View>

                  <Text style={styles.profileName}>{displayName}</Text>
                </View>
              </View>

              <View style={styles.statGrid}>
                <View style={styles.statCard}>
                  <Text style={[styles.statValue, styles.statValueTeal]}>
                    207865462 EXP
                  </Text>
                  <Text style={styles.statLabel}>My experience</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    <Text style={styles.statValueLarge}>23</Text>
                    <Text style={styles.statValueSmall}> Days</Text>
                  </Text>
                  <Text style={styles.statLabel}>Payout time</Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(40).duration(320)}
              style={styles.pagePadding}
            >
              <View style={styles.noteBanner}>
                <Text style={styles.noteText}>
                  VIP level rewards are settled at 2:00 am on the 1st of every month
                </Text>
              </View>

              <View style={styles.vipCarouselRow}>
                <Animated.View style={[styles.vipTierCard, floatingCardStyle]}>
                  <LinearGradient
                    colors={["#C5D2E8", "#9EB4D6", "#A8BDDE"]}
                    start={{ x: 0, y: 0.15 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />

                  <View style={styles.vipTierShapePrimary} />
                  <View style={styles.vipTierShapeSecondary} />

                  <View style={styles.vipTierHeader}>
                    <View style={styles.vipTierLead}>
                      <View style={styles.vipTierIcon}>
                        <Ionicons name="checkmark" size={17} color="#F5FAFF" />
                      </View>
                      <Text style={styles.vipTierLevel}>VIP1</Text>
                    </View>

                    <View style={styles.vipAchievedRow}>
                      <Ionicons name="checkmark-circle" size={20} color="#48D54D" />
                      <Text style={styles.vipAchievedText}>Achieved</Text>
                    </View>
                  </View>

                  <View style={styles.vipTierSubtag}>
                    <Text style={styles.vipTierSubtagText}>Dear VIP1 customer</Text>
                  </View>

                  <Text style={styles.vipTierDescription}>
                    Please receive VIP1 level up bonus
                  </Text>

                  <Animated.View style={[styles.vipMedalWrap, medalStyle]}>
                    <View style={styles.vipMedalGlow} />
                    <LinearGradient
                      colors={["#F5F8FD", "#CDD8EA", "#A4B5D3"]}
                      start={{ x: 0.1, y: 0.1 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.vipMedalInner}
                    >
                      <Ionicons name="compass-outline" size={48} color="#7588AE" />
                    </LinearGradient>
                  </Animated.View>
                </Animated.View>

                <View style={styles.carouselThumb} />
              </View>

              <Animated.View entering={FadeInDown.delay(90).duration(320)} style={styles.panel}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="diamond-stone"
                    size={18}
                    color="#30F2D4"
                  />
                  <Text style={styles.sectionTitle}>VIP1 Benefits level</Text>
                </View>

                {BENEFIT_ITEMS.map((item, index) => (
                  <View
                    key={item.title}
                    style={[
                      styles.benefitRowWrap,
                      index === BENEFIT_ITEMS.length - 1 && styles.noBorder,
                    ]}
                  >
                    <BenefitRow {...item} />
                  </View>
                ))}
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(140).duration(320)} style={styles.panel}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="crown" size={18} color="#30F2D4" />
                  <Text style={styles.sectionTitle}>My benefits</Text>
                </View>

                <View style={styles.benefitsGrid}>
                  <BenefitPromoCard
                    title="Level up rewards"
                    subtitle="Each account can only receive 1 time"
                    actionLabel="Receive"
                    primary
                  >
                    <RewardPromoArt />
                  </BenefitPromoCard>

                  <BenefitPromoCard
                    title="Rebate rate"
                    subtitle="Increase income of rebate"
                    actionLabel="Check the details"
                    onPress={() => router.push("/activity/betting-rebate" as any)}
                  >
                    <RebatePromoArt />
                  </BenefitPromoCard>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(190).duration(320)} style={styles.panel}>
                <View style={styles.tabRow}>
                  <Pressable
                    onPress={() => setActiveTab("history")}
                    style={[
                      styles.tabButton,
                      activeTab === "history" && styles.tabButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "history" && styles.tabTextActive,
                      ]}
                    >
                      History
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setActiveTab("rules")}
                    style={[
                      styles.tabButton,
                      activeTab === "rules" && styles.tabButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "rules" && styles.tabTextActive,
                      ]}
                    >
                      Rules
                    </Text>
                  </Pressable>
                </View>

                {activeTab === "history" ? (
                  <Animated.View
                    key="history"
                    entering={FadeInDown.duration(220)}
                    style={styles.historyList}
                  >
                    {HISTORY_ITEMS.map((item, index) => (
                      <View key={`${item.title}-${index}`} style={styles.historyItemWrap}>
                        <HistoryRow item={item} />
                        {index !== HISTORY_ITEMS.length - 1 ? (
                          <View style={styles.divider} />
                        ) : null}
                      </View>
                    ))}
                  </Animated.View>
                ) : (
                  <Animated.View
                    key="rules"
                    entering={FadeInDown.duration(220)}
                    style={styles.rulesList}
                  >
                    {RULES.map((rule, index) => (
                      <View key={rule} style={styles.ruleItem}>
                        <LinearGradient
                          colors={["#74F6CC", "#24C7D8"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.ruleNumber}
                        >
                          <Text style={styles.ruleNumberText}>{index + 1}</Text>
                        </LinearGradient>
                        <Text style={styles.ruleText}>{rule}</Text>
                      </View>
                    ))}
                  </Animated.View>
                )}

                <Animated.View style={ctaPulseStyle}>
                  <Pressable>
                    <LinearGradient
                      colors={["#7CF5C8", "#2AC6D8"]}
                      start={{ x: 0, y: 0.2 }}
                      end={{ x: 1, y: 0.9 }}
                      style={styles.viewAllButton}
                    >
                      <Text style={styles.viewAllButtonText}>View All</Text>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              </Animated.View>
            </Animated.View>
          </Animated.ScrollView>

          <Animated.View
            style={[styles.scrollbarThumbOverlay, scrollbarThumbStyle]}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  header: {
    backgroundColor: "#05012B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  headerBack: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#F1F5FF",
    fontSize: 26,
    fontFamily: "SerifBold",
    letterSpacing: 0.3,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroPanel: {
    backgroundColor: "#071C57",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarShell: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#102A6A",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarVipBubble: {
    position: "absolute",
    right: -2,
    top: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#083872",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarVipBubbleInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  profileMeta: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  vipRibbonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vipRibbonCoinWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#1A6C74",
    alignItems: "center",
    justifyContent: "center",
    marginRight: -6,
    zIndex: 2,
  },
  vipRibbonCoin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  vipRibbonTag: {
    minWidth: 76,
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: 3,
  },
  vipRibbonText: {
    color: "#F5FFF9",
    fontSize: 12,
    fontFamily: "BahnschriftBold",
    letterSpacing: 0.4,
  },
  profileName: {
    color: "#F4F8FF",
    fontSize: 18,
    fontFamily: "SerifBold",
    letterSpacing: 0.3,
  },
  statGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0A286B",
    borderRadius: 10,
    minHeight: 82,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  statValue: {
    color: "#FFFFFF",
    fontFamily: "SerifBold",
    fontSize: 18,
    textAlign: "center",
  },
  statValueTeal: {
    color: "#22E6CA",
    fontSize: 18,
  },
  statValueLarge: {
    color: "#FFFFFF",
    fontSize: 26,
    fontFamily: "SerifBold",
  },
  statValueSmall: {
    color: "#BFC9EB",
    fontSize: 18,
    fontFamily: "SerifRegular",
  },
  statLabel: {
    color: "#C4CDED",
    fontSize: 12,
    fontFamily: "SerifRegular",
    marginTop: 3,
  },
  pagePadding: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  noteBanner: {
    backgroundColor: "#060C3A",
    borderWidth: 1,
    borderColor: "#0A3C86",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  noteText: {
    color: "#DEE7FF",
    fontSize: 12.5,
    fontFamily: "SerifRegular",
    lineHeight: 16,
  },
  vipCarouselRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 6,
    marginBottom: 10,
  },
  vipTierCard: {
    flex: 1,
    minHeight: 175,
    borderRadius: 14,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 12,
    position: "relative",
  },
  vipTierShapePrimary: {
    position: "absolute",
    right: 66,
    top: -16,
    width: 160,
    height: 240,
    backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ rotate: "28deg" }],
  },
  vipTierShapeSecondary: {
    position: "absolute",
    right: 12,
    top: -28,
    width: 90,
    height: 220,
    backgroundColor: "rgba(255,255,255,0.06)",
    transform: [{ rotate: "28deg" }],
  },
  vipTierHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vipTierLead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  vipTierIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  vipTierLevel: {
    color: "#F7FBFF",
    fontSize: 30,
    fontFamily: "SerifBold",
    lineHeight: 33,
  },
  vipAchievedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 64,
  },
  vipAchievedText: {
    color: "#D9F39C",
    fontSize: 16,
    fontFamily: "SerifRegular",
  },
  vipTierSubtag: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  vipTierSubtagText: {
    color: "#F7FBFF",
    fontSize: 11.5,
    fontFamily: "SerifRegular",
  },
  vipTierDescription: {
    marginTop: 72,
    width: "74%",
    color: "#F7FBFF",
    fontSize: 18,
    fontFamily: "SerifBold",
    lineHeight: 24,
  },
  vipMedalWrap: {
    position: "absolute",
    right: 16,
    top: 18,
    width: 74,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  vipMedalGlow: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  vipMedalInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.82)",
  },
  carouselThumb: {
    width: 10,
    borderRadius: 8,
    backgroundColor: "#F3BF87",
    marginVertical: 2,
  },
  panel: {
    backgroundColor: "#081A55",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#F3F8FF",
    fontSize: 18,
    fontFamily: "SerifBold",
  },
  benefitRowWrap: {
    borderBottomWidth: 1,
    borderBottomColor: "#0D2A6B",
    paddingBottom: 10,
    marginBottom: 10,
  },
  noBorder: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  benefitIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTextWrap: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  benefitTitle: {
    color: "#F5F8FF",
    fontSize: 13,
    fontFamily: "BahnschriftBold",
  },
  benefitSubtitle: {
    color: "#93A1D6",
    fontSize: 10.8,
    fontFamily: "BahnschriftRegular",
    lineHeight: 13,
    marginTop: 2,
  },
  benefitBadges: {
    alignItems: "flex-end",
    gap: 6,
  },
  badgePill: {
    minWidth: 48,
    height: 20,
    borderRadius: 6,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  badgePillGold: {
    backgroundColor: "#0A245C",
    borderWidth: 1,
    borderColor: "#E7A43E",
  },
  badgePillTeal: {
    backgroundColor: "#071C54",
    borderWidth: 1,
    borderColor: "#00E6C6",
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeDotGold: {
    backgroundColor: "#F7C755",
  },
  badgeDotTeal: {
    backgroundColor: "#36F2D0",
  },
  badgePillText: {
    fontSize: 10.2,
    fontFamily: "BahnschriftBold",
  },
  badgePillTextGold: {
    color: "#F2BE57",
  },
  badgePillTextTeal: {
    color: "#3BF5D5",
  },
  benefitsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  promoCard: {
    flex: 1,
    backgroundColor: "#081446",
    borderRadius: 10,
    overflow: "hidden",
  },
  promoArtShell: {
    height: 86,
    margin: 2,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  rewardArtImage: {
    width: "100%",
    height: "100%",
  },
  smallCoin: {
    position: "absolute",
    width: 16,
    height: 16,
  },
  smallCoinLeft: {
    left: 6,
    bottom: 8,
  },
  smallCoinRight: {
    right: 6,
    bottom: 6,
  },
  smallCoinTop: {
    right: 28,
    top: 4,
  },
  largeCoin: {
    position: "absolute",
    width: 28,
    height: 28,
  },
  largeCoinFront: {
    left: 32,
    top: 16,
  },
  largeCoinBack: {
    left: 48,
    top: 2,
  },
  rebateTreasureWrap: {
    position: "absolute",
    left: 50,
    top: 20,
    zIndex: 2,
  },
  rebateTreasureBase: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleBadge: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleBadgeLeft: {
    left: 6,
    top: 8,
  },
  bubbleBadgeRight: {
    right: 6,
    top: 6,
  },
  cornerChip: {
    position: "absolute",
    left: 6,
    bottom: 6,
    minWidth: 22,
    height: 14,
    borderRadius: 7,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cornerChipRight: {
    left: undefined,
    right: 6,
  },
  cornerChipGold: {
    backgroundColor: "#0A245C",
    borderWidth: 1,
    borderColor: "#E7A43E",
  },
  cornerChipTeal: {
    backgroundColor: "#071C54",
    borderWidth: 1,
    borderColor: "#00E6C6",
  },
  cornerChipTextGold: {
    color: "#F2BE57",
    fontSize: 8.6,
    fontFamily: "BahnschriftBold",
  },
  cornerChipTextTeal: {
    color: "#3BF5D5",
    fontSize: 8.6,
    fontFamily: "BahnschriftBold",
  },
  promoContent: {
    paddingHorizontal: 6,
    paddingBottom: 8,
  },
  promoTitle: {
    color: "#F5F8FF",
    fontSize: 12,
    fontFamily: "BahnschriftBold",
    marginTop: 2,
  },
  promoSubtitle: {
    color: "#92A0D5",
    fontSize: 10.2,
    fontFamily: "BahnschriftRegular",
    lineHeight: 12,
    minHeight: 24,
    marginTop: 2,
    marginBottom: 8,
  },
  primaryAction: {
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionText: {
    color: "#06204E",
    fontSize: 12,
    fontFamily: "BahnschriftBold",
  },
  secondaryAction: {
    height: 30,
    borderRadius: 15,
    borderWidth: 1.3,
    borderColor: "#0FE7C7",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(4, 18, 59, 0.72)",
  },
  secondaryActionText: {
    color: "#16EBD0",
    fontSize: 11,
    fontFamily: "BahnschriftBold",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#071446",
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "#23EBD1",
  },
  tabText: {
    color: "#7685C5",
    fontSize: 16,
    fontFamily: "SerifBold",
  },
  tabTextActive: {
    color: "#2CF1D5",
  },
  historyList: {
    marginTop: 10,
  },
  historyItemWrap: {
    paddingVertical: 8,
  },
  historyItem: {
    flexDirection: "row",
    gap: 10,
  },
  historyBody: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontFamily: "SerifBold",
    marginBottom: 2,
  },
  historyDetail: {
    color: "#9AA7DB",
    fontSize: 10.8,
    fontFamily: "BahnschriftRegular",
    lineHeight: 13.5,
  },
  historyTimestamp: {
    color: "#7F8DC5",
    fontSize: 10.2,
    fontFamily: "BahnschriftRegular",
    marginTop: 4,
  },
  historyBadgeStack: {
    alignItems: "flex-end",
    gap: 6,
    paddingTop: 2,
  },
  historyValueWrap: {
    minWidth: 70,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingBottom: 2,
  },
  historyValue: {
    color: "#8C97D1",
    fontSize: 12,
    fontFamily: "BahnschriftRegular",
    lineHeight: 14,
    textAlign: "right",
  },
  historySuffix: {
    color: "#8C97D1",
    fontSize: 11,
    fontFamily: "SerifBold",
    lineHeight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#0C225C",
    marginTop: 8,
  },
  rulesList: {
    gap: 10,
    marginTop: 12,
    marginBottom: 4,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  ruleNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  ruleNumberText: {
    color: "#06204E",
    fontSize: 11,
    fontFamily: "BahnschriftBold",
  },
  ruleText: {
    flex: 1,
    color: "#A4B0E1",
    fontSize: 11.2,
    lineHeight: 15,
    fontFamily: "BahnschriftRegular",
  },
  viewAllButton: {
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  viewAllButtonText: {
    color: "#0A2256",
    fontSize: 13,
    fontFamily: "SerifBold",
  },
  scrollbarThumbOverlay: {
    position: "absolute",
    right: 5,
    top: 86,
    width: 8,
    borderRadius: 8,
    backgroundColor: "#F3BE86",
  },
});
