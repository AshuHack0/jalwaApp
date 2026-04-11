import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import {
  DEFAULT_AVATAR_ID,
  getAvatarImageSource,
  getSelectedAvatarId,
} from "@/services/avatar-storage";
import {
  EBGaramond_400Regular,
  EBGaramond_700Bold,
  useFonts as useSerifFonts,
} from "@expo-google-fonts/eb-garamond";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";

type BadgeTone = "gold" | "teal";

type VipBadge = {
  tone: BadgeTone;
  value: string;
};

type BenefitItem = {
  icon: string;
  url: string;
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_WIDTH = SCREEN_WIDTH - 16; // Account for pagePadding (8px on each side)
const ITEM_WIDTH = CAROUSEL_WIDTH * 0.86;
const ITEM_GAP = 12;

const vipcards = [
  {
    image: require("@/assets/VipCards/vip1.png"),
    title: "VIP1",
    subtitle: "VIP1",
  },
  {
    image: require("@/assets/VipCards/vip2.png"),
    title: "VIP2",
    subtitle: "VIP2",
  },
  {
    image: require("@/assets/VipCards/vip3.png"),
    title: "VIP3",
    subtitle: "VIP3",
  },
  {
    image: require("@/assets/VipCards/vip4.png"),
    title: "VIP4",
    subtitle: "VIP4",
  },
  {
    image: require("@/assets/VipCards/vip5.png"),
    title: "VIP5",
    subtitle: "VIP5",
  },
  {
    image: require("@/assets/VipCards/vip6.png"),
    title: "VIP6",
    subtitle: "VIP6",
  },
  {
    image: require("@/assets/VipCards/vip7.png"),
    title: "VIP7",
    subtitle: "VIP7",
  },
  {
    image: require("@/assets/VipCards/vip8.png"),
    title: "VIP8",
    subtitle: "VIP8",
  },
  {
    image: require("@/assets/VipCards/vip9.png"),
    title: "VIP9",
    subtitle: "VIP9",
  },
  {
    image: require("@/assets/VipCards/vip10.png"),
    title: "VIP10",
    subtitle: "VIP10",
  },
];

const BENEFIT_ITEMS: BenefitItem[] = [
  {
    icon: "gift",
    url: "https://www.jalwagame.win/assets/png/1-c9eacf75.webp",
    title: "Level up rewards",
    subtitle: "Each account can only receive 1 time",
    badges: [
      { tone: "gold", value: "60" },
      { tone: "teal", value: "0" },
    ],
  },
  {
    icon: "brightness-percent",
    url: "https://www.jalwagame.win/assets/png/2-70676554.webp",
    title: "Monthly reward",
    subtitle: "Each account can only receive 1 time per month",
    badges: [
      { tone: "gold", value: "3" },
      { tone: "teal", value: "0" },
    ],
  },
  {
    icon: "cash-fast",
    url: "https://www.jalwagame.win/assets/png/5-2c5b0016.webp",
    title: "Rebate rate",
    subtitle: "Increase income of rebate",
    badges: [{ tone: "teal", value: "0.04%" }],
  },
];

const HISTORY_ITEMS: HistoryItem[] = [
  {
    title: "Experience Bonus",
    detail: "Betting EXP",
    timestamp: "2026-04-11 15:42:37",
    accent: "#4F87D1",
    value: "0",
    suffix: "2 EXP",
  },
  {
    title: "Experience Bonus",
    detail: "Betting EXP",
    timestamp: "2026-04-10 19:42:37",
    accent: "#4F87D1",
    value: "0",
    suffix: "1 EXP",
  },
  {
    title: "Experience Bonus",
    detail: "Betting EXP",
    timestamp: "2026-04-10 19:37:39",
    accent: "#4F87D1",
    value: "0",
    suffix: "2 EXP",
  },
  {
    title: "Experience Bonus",
    detail: "Betting EXP",
    timestamp: "2026-04-10 15:57:36",
    accent: "#4F87D1",
    value: "0",
    suffix: "5 EXP",
  },
  {
    title: "Experience Bonus",
    detail: "Betting EXP",
    timestamp: "2026-04-10 15:52:38",
    accent: "#4F87D1",
    value: "0",
    suffix: "6 EXP",
  },
  {
    title: "Experience Bonus",
    detail: "Betting EXP",
    timestamp: "2026-04-10 12:22:37",
    accent: "#4F87D1",
    value: "0",
    suffix: "1 EXP",
  },
  {
    title: "Successfully received",
    detail: "Successfully received [Monthly bonus]",
    timestamp: "2026-04-04 12:46:22",
    accent: "#17B15E",
    badges: [
      { tone: "gold", value: "6,900" },
      { tone: "teal", value: "0" },
    ],
  },
  {
    title: "Level maintenance",
    detail: "Level maintenance status not complete\n[0.00%Complete]",
    timestamp: "2026-04-01 00:19:20",
    accent: "#D23838",
    value: "-40000000",
    suffix: "EXP",
  },
  {
    title: "Level maintenance",
    detail: "Level maintenance status not complete\n[0.00%Complete]",
    timestamp: "2026-03-01 00:20:12",
    accent: "#D23838",
    value: "-10000000",
    suffix: "EXP",
  },
  {
    title: "VIP level downgrade",
    detail:
      "Relegation failed, experience points deducted and downgraded\n[VIP6]",
    timestamp: "2026-03-01 00:20:12",
    accent: "#DD9138",
  },
];

const RULES: { title: string; body: string }[] = [
  {
    title: "Upgrade standard",
    body: "The VIP member's experience points (valid bet amount) that meet the requirements of the corresponding rank will be promoted to the corresponding VIP level, the member's VIP data statistics period starts from 00:00:00 days VIP system launched.VIP level calculation is refreshed every 10 minutes! The corresponding experience level is calculated according to valid odds 1:1 !",
  },
  {
    title: "Upgrade order",
    body: "The VIP level that meets the corresponding requirements can be promoted by one level every day, but the VIP level cannot be promoted by leapfrogging.",
  },
  {
    title: "Level Maintenance",
    body: 'VIP members need to complete the experience requirements of the corresponding level within 30 days after the "VIP level prompt". If the promotion is completed during this period, the maintenance requirement will be calculated according to the current level.',
  },
  {
    title: "Downgrade standard",
    body: "If a VIP member fails to complete the corresponding level maintenance requirements within 30 days after the VIP downgrade prompt, it will automatically deduct the experience points corresponding to the level. The experience point record display will be updated to downgraded, and the corresponding discounts will be adjusted to the downgraded level accordingly.",
  },
  {
    title: "Upgrade Bonus",
    body: "The upgrade bonus can be claimed on the VIP page after the member reaches the VIP membership level, and each VIP member can only get the upgrade reward of each level once.",
  },
  {
    title: "Monthly reward",
    body: "VIP members can earn the highest level of VIP rewards once a month.Can only be received once a month. Prizes cannot be accumulated. And any unclaimed rewards will be refreshed on the next settlement day. When receiving the highest level of monthly rewards this month Monthly Rewards earned in this month will be deducted e.g. when VIP1 earns 500 and upgrades to VIP2 to receive monthly rewards 500 will be deducted.",
  },
  {
    title: "Real time rebate",
    body: "The higher the VIP level, the higher the return rate, all the games are calculated in real time and can be self-rewarded!",
  },
  {
    title: "Safe",
    body: "VIP members who have reached the corresponding level will get corresponding rebate interest based on the member's VIP credit level.",
  },
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
      {isGold && (
        <Image
          source={{
            uri: "https://www.jalwagame.win/assets/png/gold-b5be1e1b.webp",
          }}
          style={{ height: 14, aspectRatio: 1 }}
          contentFit="contain"
        />
      )}
      {tone === "teal" && value != "0.04%" && (
        <Image
          source={require("@/assets/blankDiamond.png")}
          style={{ height: 14, aspectRatio: 1 }}
          contentFit="contain"
        />
      )}
      {tone === "teal" && value == "0.04%" && (
        <Image
          source={require("@/assets/stack.png")}
          style={{ height: 14, aspectRatio: 1 }}
          contentFit="contain"
        />
      )}
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

function BenefitRow({ icon, title, subtitle, badges, url }: BenefitItem) {
  return (
    <View style={styles.benefitRow}>
      <Image
        source={{ uri: url }}
        style={{ height: 53, aspectRatio: 1 }}
        contentFit="contain"
      />
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

function BenefitPromoCard({
  title,
  subtitle,
  actionLabel,
  primary,
  received,
  onPress,
  coinValue,
  diamondValue,
  children,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  primary?: boolean;
  received?: boolean;
  onPress?: () => void;
  coinValue?: string;
  diamondValue?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.promoCard}>
      <View
        style={{
          backgroundColor: "#001C54",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <View>
          {children}
          {(coinValue !== undefined || diamondValue !== undefined) && (
            <View style={styles.benefitValueStrip}>
              <View style={styles.benefitValueItem}>
                <Image
                  source={require("@/assets/wallet2.webp")}
                  style={styles.benefitValueIcon}
                  contentFit="contain"
                />
                <Text style={styles.benefitValueText}>{coinValue ?? "0"}</Text>
              </View>
              <View style={styles.benefitValueItem}>
                <Image
                  source={require("@/assets/diamond.webp")}
                  style={styles.benefitValueIcon}
                  contentFit="contain"
                />
                <Text style={styles.benefitValueText}>
                  {diamondValue ?? "0"}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={{ paddingHorizontal: 6, backgroundColor: "#001C54" }}>
          <Text style={styles.promoTitle}>{title}</Text>
          <Text style={styles.promoSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.promoContent}>
        <Pressable onPress={onPress}>
          {received ? (
            <View style={styles.receivedAction}>
              <Text style={styles.receivedActionText}>{actionLabel}</Text>
            </View>
          ) : primary ? (
            <ExpoLinearGradient
              colors={["#7CF5C8", "#2AC6D8"]}
              start={{ x: 0, y: 0.2 }}
              end={{ x: 1, y: 0.9 }}
              style={styles.primaryAction}
            >
              <Text style={styles.primaryActionText}>{actionLabel}</Text>
            </ExpoLinearGradient>
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
// ── Section Number Banner ─────────────────────────────────────────────────────
function SectionHeader({ number }: { number: string }) {
  return (
    <Svg width="290" height="50" viewBox="0 0 295 50">
      <Defs>
        <LinearGradient id="bannerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#011341" stopOpacity="1" />
          <Stop offset="100%" stopColor="#011341" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Banner Shape */}
      <Path
        d="
        M0 0
        Q20 0 35 20
        Q45 35 65 35
        L230 35
        Q250 35 260 20
        Q275 0 295 0
        L295 40
        Q295 50 285 3000
        L10 50
        Q0 50 0 3000
        Z
        "
        fill="url(#bannerGradient)"
      />

      <SvgText
        x="147.5"
        y="28"
        fontSize="13"
        fill="white"
        textAnchor="middle"
        fontFamily="SerifBold"
      >
        {number}
      </SvgText>
    </Svg>
  );
}

// ── Rule Card ─────────────────────────────────────────────────────────────────
function RuleCard({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.ruleCard}>
      <View style={{ width: "100%", alignItems: "center" }}>
        <View style={{ backgroundColor: "#2C5ECA", padding: 0 }}>
          <SectionHeader number={number} />
        </View>
      </View>
      <View style={styles.ruleBody}>{children}</View>
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
            <BadgePill
              key={`${item.title}-${badge.tone}-${badge.value}`}
              {...badge}
            />
          ))}
        </View>
      ) : item.value ? (
        <View style={styles.historyValueWrap}>
          {item.value !== "0" && (
            <Text style={styles.historyValue}>{item.value}</Text>
          )}
          {item.suffix ? (
            <Text style={styles.historySuffix}>{item.suffix}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function VipScreen() {
  // useExpoFonts({
  //   BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
  //   BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
  //   BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  // });
  useSerifFonts({
    SerifRegular: EBGaramond_400Regular,
    SerifBold: EBGaramond_700Bold,
  });

  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"history" | "rules">("history");
  const [selectedAvatarId, setSelectedAvatarId] = useState(DEFAULT_AVATAR_ID);
  const [selectedIndex, setSelectedIndex] = useState(5);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        const avatarId = await getSelectedAvatarId();

        if (isActive) {
          setSelectedAvatarId(avatarId);
        }
      })();

      return () => {
        isActive = false;
      };
    }, []),
  );

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

        <View style={styles.scrollArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 28 },
            ]}
          >
            <View style={styles.heroPanel}>
              <View style={styles.profileRow}>
                <View style={styles.avatarShell}>
                  <Image
                    source={getAvatarImageSource(selectedAvatarId)}
                    style={{ width: 74, height: 74, borderRadius: 100 }}
                    contentFit="cover"
                  />
                  <View
                    style={{
                      flex: 1,
                      gap: 2,
                    }}
                  >
                    <View style={styles.usernameRow}>
                      <Image
                        source={require("@/assets/pro.webp")}
                        style={{ width: 40, height: 40 }}
                        contentFit="contain"
                      />
                      <ThemedText style={styles.username}>
                        MEMBERNNGH2JM8
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.statGrid}>
                <View style={styles.statCard}>
                  <Text style={[styles.statValue, styles.statValueTeal]}>
                    207865479 EXP
                  </Text>
                  <Text style={styles.statLabel}>My experience</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    <Text style={styles.statValueLarge}>20</Text>
                    <Text style={styles.statValueSmall}> Days</Text>
                  </Text>
                  <Text style={styles.statLabel}>Payout time</Text>
                </View>
              </View>
            </View>

            <View style={styles.pagePadding}>
              <View style={styles.noteBanner}>
                <Text style={styles.noteText}>
                  VIP level rewards are settled at 2:00 am on the 1st of every
                  month
                </Text>
              </View>

              <FlatList
                data={vipcards}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_GAP}
                decelerationRate="fast"
                snapToAlignment="start"
                initialScrollIndex={5}
                scrollEventThrottle={16}
                onScroll={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  const index = Math.round(x / (ITEM_WIDTH + ITEM_GAP));
                  if (
                    index !== selectedIndex &&
                    index >= 0 &&
                    index < vipcards.length
                  ) {
                    setSelectedIndex(index);
                  }
                }}
                getItemLayout={(data, index) => ({
                  length: ITEM_WIDTH + ITEM_GAP,
                  offset: (ITEM_WIDTH + ITEM_GAP) * index,
                  index,
                })}
                contentContainerStyle={{
                  paddingHorizontal: (CAROUSEL_WIDTH - ITEM_WIDTH) / 2,
                  gap: ITEM_GAP,
                  paddingVertical: 10,
                }}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: ITEM_WIDTH,
                      height: 188,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={item.image}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>
                )}
              />

              <View style={styles.panel}>
                <View style={styles.sectionHeader}>
                  <Image
                    source={require("@/assets/dimandIcon.png")}
                    style={{ width: 21, height: 21 }}
                    contentFit="contain"
                  />
                  <Text style={styles.sectionTitle}>
                    {vipcards[selectedIndex]?.title || "VIP"} Benefits level
                  </Text>
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
              </View>

              <View style={styles.panel}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="crown"
                    size={18}
                    color="#30F2D4"
                  />
                  <Text style={styles.sectionTitle}>My benefits</Text>
                </View>

                <View style={styles.benefitsGrid}>
                  <BenefitPromoCard
                    title="Level up rewards"
                    subtitle="Each account can only receive 1 time"
                    actionLabel="Received"
                    received
                    coinValue="16,900"
                    diamondValue="0"
                  >
                    <ExpoLinearGradient
                      colors={["#78FDC2", "#78FDC2", "#24C7D8"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.promoArtShell}
                    >
                      <Image
                        source={require("@/assets/mybenifit1.webp")}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                    </ExpoLinearGradient>
                  </BenefitPromoCard>

                  <BenefitPromoCard
                    title="Monthly reward"
                    subtitle="Each account can only receive 1 time per month"
                    actionLabel="Received"
                    received
                    coinValue="6,900"
                    diamondValue="0"
                  >
                    <ExpoLinearGradient
                      colors={["#78FDC2", "#78FDC2", "#24C7D8"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.promoArtShell}
                    >
                      <Image
                        source={require("@/assets/mybenifit2.webp")}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                    </ExpoLinearGradient>
                  </BenefitPromoCard>
                  <BenefitPromoCard
                    title="Rebate rate"
                    subtitle="Increase income of rebate"
                    actionLabel="Check the details"
                    onPress={() =>
                      router.push("/activity/betting-rebate" as any)
                    }
                    coinValue="0.15%"
                    diamondValue="0"
                  >
                    <ExpoLinearGradient
                      colors={["#78FDC2", "#78FDC2", "#24C7D8"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.promoArtShell}
                    >
                      <Image
                        source={require("@/assets/mybenifit3.webp")}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                    </ExpoLinearGradient>
                  </BenefitPromoCard>
                </View>
              </View>

              <View
                style={[
                  styles.panel,
                  {
                    backgroundColor: "transparent",
                    borderRadius: 18,
                    overflow: "hidden",
                  },
                ]}
              >
                <View style={styles.tabRow}>
                  <Pressable
                    onPress={() => setActiveTab("history")}
                    style={styles.tabButton}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "history" && styles.tabTextActive,
                      ]}
                    >
                      History
                    </Text>
                    {activeTab === "history" && (
                      <View style={styles.tabIndicator} />
                    )}
                  </Pressable>

                  <Pressable
                    onPress={() => setActiveTab("rules")}
                    style={styles.tabButton}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "rules" && styles.tabTextActive,
                      ]}
                    >
                      Rules
                    </Text>
                    {activeTab === "rules" && (
                      <View style={styles.tabIndicator} />
                    )}
                  </Pressable>
                </View>
                <View style={{}}>
                  {activeTab === "history" ? (
                    <View key="history" style={styles.historyList}>
                      {HISTORY_ITEMS.map((item, index) => (
                        <View
                          key={`${item.title}-${index}`}
                          style={styles.historyItemWrap}
                        >
                          <HistoryRow item={item} />
                          {index !== HISTORY_ITEMS.length - 1 ? (
                            <View style={styles.divider} />
                          ) : null}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View key="rules" style={styles.rulesList}>
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <Text
                          style={{
                            color: "#02ECBE",
                            fontFamily: "SerifBold",
                            fontSize: 20,
                          }}
                        >
                          VIP privileges
                        </Text>
                        <Text
                          style={{
                            color: "#A4B0E1",
                            fontFamily: "SerifRegular",
                            fontSize: 15,
                          }}
                        >
                          VIP rule description
                        </Text>
                      </View>
                      {RULES.map((rule, index) => (
                        <>
                          <RuleCard number={rule.title} key={index + 1}>
                            <Text style={styles.ruleText}>{rule.body}</Text>
                          </RuleCard>
                        </>
                      ))}
                    </View>
                  )}
                  {activeTab === "history" && (
                    <Pressable>
                      <ExpoLinearGradient
                        colors={["#7CF5C8", "#7CF5C8", "#39D3BC"]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.viewAllButton}
                      >
                        <Text style={styles.viewAllButtonText}>View All</Text>
                      </ExpoLinearGradient>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
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
    color: "white",
    fontSize: 19,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroPanel: {
    backgroundColor: "#021341",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 50,
    marginBottom: 30,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  usernameRow: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: -10,
  },
  username: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "SerifBold",
    marginTop: -6,
  },
  vipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  vipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
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
    fontFamily: "SerifRegular",
    letterSpacing: 0.4,
  },
  profileName: {
    color: "#F4F8FF",
    fontSize: 18,
    fontFamily: "SerifBold",
    letterSpacing: 0.3,
  },
  statGrid: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    bottom: -25,
    paddingHorizontal: 14,
    gap: 20,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#001C54",
    borderRadius: 6,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {},
  statValueTeal: {
    color: "#00ecbe",
    fontSize: 14,
    fontFamily: "SerifBold",
  },
  statValueLarge: {
    color: "#e3efff",
    fontSize: 19,
    // fontWeight: "700",
    fontFamily: "SerifBold",
  },
  statValueSmall: {
    color: "#92a8e3",
    fontFamily: "SerifBold",
    fontSize: 12,
  },
  statLabel: {
    color: "#92a8e3",
    fontSize: 12,
    marginTop: 3,
    fontFamily: "SerifBold",
  },
  pagePadding: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  noteBanner: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
    borderWidth: 0.7,
    borderRadius: 5,
    borderColor: "#022C68",
  },
  noteText: {
    color: "#92a8e3",
    fontSize: 12,
    // marginBottom: -16,
    fontFamily: "SerifBold",
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
    borderRadius: 5,
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
  },
  vipTierLead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    fontSize: 25,
    fontFamily: "SerifBold",
  },
  vipAchievedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: 10,
  },
  vipAchievedText: {
    color: "white",
    fontSize: 11,
  },
  vipTierSubtag: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  vipTierSubtagText: {
    color: "white",
    fontSize: 11,
  },
  vipTierDescription: {
    marginTop: 40,
    color: "white",
    fontSize: 14,
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
    backgroundColor: "#021341",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#e3efff",
    fontSize: 18,
    fontFamily: "SerifBold",
  },
  benefitRowWrap: {
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
    gap: 2,
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 8,
  },
  benefitTitle: {
    color: "#e3efff",
    fontSize: 16,
    fontFamily: "SerifRegular",
  },
  benefitSubtitle: {
    color: "#92a8e3",
    fontSize: 12,
    fontFamily: "SerifRegular",
    lineHeight: 13,
    marginTop: 2,
    width: "90%",
  },
  benefitBadges: {
    alignItems: "flex-end",
    gap: 6,
  },
  badgePill: {
    minWidth: 60,
    height: 20,
    borderRadius: 4,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  badgePillGold: {
    borderWidth: 0.6,
    borderColor: "#DD9137",
  },
  badgePillTeal: {
    borderWidth: 0.6,
    borderColor: "#00ECBE",
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
    fontSize: 12,
    fontFamily: "SerifRegular",
  },
  badgePillTextGold: {
    color: "#DD9137",
  },
  badgePillTextTeal: {
    color: "#00ECBE",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  promoCard: {
    width: "48%",
    flexGrow: 0,
    // backgroundColor: "#081446",
    borderRadius: 10,
    overflow: "hidden",
  },
  promoArtShell: {
    height: 86,
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
    fontFamily: "SerifRegular",
  },
  cornerChipTextTeal: {
    color: "#3BF5D5",
    fontSize: 8.6,
    fontFamily: "SerifRegular",
  },
  promoContent: {
    paddingHorizontal: 6,
    paddingBottom: 8,
    paddingTop: 8,
  },
  promoTitle: {
    color: "#F5F8FF",
    fontSize: 13,
    fontFamily: "SerifRegular",
    marginTop: 2,
  },
  promoSubtitle: {
    color: "#92A0D5",
    fontSize: 13,
    fontFamily: "SerifRegular",
    lineHeight: 12,
    minHeight: 24,
    marginTop: 2,
    marginBottom: 8,
  },
  benefitValueStrip: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  benefitValueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  benefitValueIcon: {
    width: 14,
    height: 14,
  },
  benefitValueText: {
    color: "#281522",
    fontSize: 10,
    fontFamily: "SerifBold",
  },
  receivedAction: {
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E3068",
  },
  receivedActionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "SerifRegular",
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
    fontFamily: "SerifRegular",
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
    fontFamily: "SerifRegular",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#011341",
    overflow: "hidden",
    borderRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    paddingBottom: 0,
    gap: 6,
    backgroundColor: "#011341",
    // backgroundColor: "red",
  },
  tabButtonActive: {},
  tabIndicator: {
    height: 2,
    width: 70,
    borderRadius: 2,
    backgroundColor: "#23EBD1",
  },
  tabText: {
    color: "#7685C5",
    fontSize: 16,
    fontFamily: "SerifRegular",
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
    fontFamily: "SerifRegular",
    marginBottom: 2,
  },
  historyDetail: {
    color: "#92A8E3",
    fontSize: 10.8,
    fontFamily: "SerifRegular",
    lineHeight: 13.5,
  },
  historyTimestamp: {
    color: "#92A8E3",
    fontSize: 10.2,
    fontFamily: "SerifRegular",
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
    color: "#17B15E",
    fontSize: 12,
    fontFamily: "SerifRegular",
    lineHeight: 14,
    textAlign: "right",
  },
  historySuffix: {
    color: "#17B15E",
    fontSize: 11,
    fontFamily: "SerifBold",
    lineHeight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#0C225C",
    marginTop: 8,
  },

  ruleCard: {
    backgroundColor: "#011341",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  ruleBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    fontSize: 12.8,
    fontFamily: "SerifRegular",
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
    fontFamily: "SerifRegular",
  },
  ruleContent: {
    flex: 1,
    gap: 3,
  },
  ruleTitle: {
    color: "#2CF1D5",
    fontSize: 12.5,
    fontFamily: "SerifBold",
  },
  ruleText: {
    color: "#A4B0E1",
    fontSize: 11.2,
    lineHeight: 20,
    fontFamily: "SerifRegular",
  },
  viewAllButton: {
    height: 42,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  viewAllButtonText: {
    color: "#0A2256",
    width: 100,
    textAlign: "center",

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
