import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { router, Stack } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

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
        fontWeight="600"
        fill="white"
        textAnchor="middle"
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

// ── Rebate Table ──────────────────────────────────────────────────────────────
const REBATE_ROWS = [
  { crowns: 1, teamNumber: "0", teamBetting: "0", teamDeposit: "0" },
  { crowns: 1, teamNumber: "10", teamBetting: "500K", teamDeposit: "100K" },
  { crowns: 2, teamNumber: "15", teamBetting: "1,000K", teamDeposit: "200K" },
  { crowns: 2, teamNumber: "30", teamBetting: "2.50M", teamDeposit: "500K" },
  { crowns: 3, teamNumber: "45", teamBetting: "3.50M", teamDeposit: "700K" },
  { crowns: 3, teamNumber: "50", teamBetting: "5M", teamDeposit: "1,000K" },
  { crowns: 4, teamNumber: "60", teamBetting: "10M", teamDeposit: "2M" },
  { crowns: 4, teamNumber: "100", teamBetting: "100M", teamDeposit: "20M" },
  { crowns: 5, teamNumber: "500", teamBetting: "500M", teamDeposit: "100M" },
  { crowns: 5, teamNumber: "1000", teamBetting: "1,000M", teamDeposit: "200M" },
  { crowns: 6, teamNumber: "5000", teamBetting: "1,500M", teamDeposit: "300M" },
];

function CrownIcon({ count }: { count: number }) {
  return (
    <View style={styles.crownRow}>
      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
        <Text key={i} style={styles.crownEmoji}>
          👑
        </Text>
      ))}
    </View>
  );
}

function RebateTable() {
  return (
    <View style={styles.tableWrapper}>
      {/* Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>
          Rebate level
        </Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Team Number</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Team Betting</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Team Deposit</Text>
      </View>
      {/* Rows */}
      {REBATE_ROWS.map((row, i) => (
        <View
          key={i}
          style={[
            styles.tableRow,
            i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
          ]}
        >
          <View style={{ flex: 1.2, alignItems: "center" }}>
            {/* <CrownIcon count={row.crowns} /> */}
            <LevelBadge level={row.crowns} />
          </View>
          <Text style={[styles.tableCellText, { flex: 1 }]}>
            {row.teamNumber}
          </Text>
          <Text style={[styles.tableCellText, { flex: 1 }]}>
            {row.teamBetting}
          </Text>
          <Text style={[styles.tableCellText, { flex: 1 }]}>
            {row.teamDeposit}
          </Text>
        </View>
      ))}
    </View>
  );
}

// function LevelBadge({ level }: { level: number }) {
//   return (
//     <Svg width={80} height={30} viewBox="0 0 180 70">
//       {/* Crown Emoji */}
//       <SvgText x="45" y="55" fontSize="52" textAnchor="middle">
//         👑
//       </SvgText>

//       {/* Level Badge */}
//       <Rect x="95" y="25" width="70" height="32" rx="8" fill="url(#gold)" />

//       {/* Level Text */}
//       <SvgText
//         x="130"
//         y="47"
//         fontSize="20"
//         fill="white"
//         fontWeight="600"
//         textAnchor="middle"
//       >
//         L{level}
//       </SvgText>
//     </Svg>
//   );
// }

function LevelBadge({ level }: { level: number }) {
  return (
    <Svg width={80} height={30} viewBox="0 0 120 60">
      {/* Level Badge */}
      <Rect x="50" y="20" width="60" height="28" rx="8" fill="#F5A623" />

      {/* Crown */}
      <SvgText x="30" y="48" fontSize="40" textAnchor="middle">
        👑
      </SvgText>

      {/* Level Text */}
      <SvgText
        x="80"
        y="39"
        fontSize="18"
        fill="white"
        fontWeight="600"
        textAnchor="middle"
      >
        L{level}
      </SvgText>
    </Svg>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function RulesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Rules" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero Title ── */}
          <View style={styles.heroBlock}>
            <Text style={styles.heroTitle}>【Promotion partner】program</Text>
            <Text style={styles.heroSubtitle}>
              This activity is valid for a long time
            </Text>
          </View>

          {/* ── Rule 01 ── */}
          <RuleCard number="01">
            <Text style={styles.ruleText}>
              There are 6 subordinate levels in inviting friends, if A invites
              B, then B is a level 1 subordinate of A. If B invites C, then C is
              a level 1 subordinate of B and also a level 2 subordinate of A. If
              C invites D, then D is a level 1 subordinate of C, at the same
              time a level 2 subordinate of B and also a level 3 subordinate of
              A.
            </Text>
          </RuleCard>

          {/* ── Rule 02 ── */}
          <RuleCard number="02">
            <Text style={styles.ruleText}>
              When inviting friends to register, you must send the invitation
              link provided or enter the invitation code manually so that your
              friends become your level 1 subordinates.
            </Text>
          </RuleCard>

          {/* ── Rule 03 ── */}
          <RuleCard number="03">
            <Text style={styles.ruleText}>
              The invitee registers via the inviter's invitation code and
              completes the deposit, shortly after that the commission will be
              received immediately
            </Text>
          </RuleCard>

          {/* ── Rule 04 ── */}
          <RuleCard number="04">
            <Text style={styles.ruleText}>
              The calculation of yesterday's commission starts every morning at
              01:00. After the commission calculation is completed, the
              commission is rewarded to the wallet and can be viewed through the
              commission collection record.
            </Text>
          </RuleCard>

          {/* ── Rule 05 ── */}
          <RuleCard number="05">
            <Text style={styles.ruleText}>
              Commission rates vary depending on your agency level on that day
              {"\n"}
              Number of Teams: How many downline deposits you have to date.
              {"\n"}
              Team Deposits: The total number of deposits made by your downline
              in one day.{"\n"}
              Team Deposit: Your downline deposits within one day.
            </Text>
          </RuleCard>

          {/* ── Rebate Table (between 05 and 06) ── */}
          <RebateTable />

          {/* ── Rule 06 ── */}
          <RuleCard number="06">
            <Text style={styles.ruleText}>
              The commission percentage depends on the membership level. The
              higher the membership level, the higher the bonus percentage.
              Different game types also have different payout percentages.{"\n"}
              The commission rate is specifically explained as follows
            </Text>
            <TouchableOpacity activeOpacity={0.7} style={{ marginTop: 6 }}>
              <Text style={styles.linkText}>View rebate ratio &gt;&gt;</Text>
            </TouchableOpacity>
          </RuleCard>

          {/* ── Rule 07 ── */}
          <RuleCard number="07">
            <Text style={styles.ruleText}>
              TOP20 commission rankings will be randomly awarded with a separate
              bonus
            </Text>
          </RuleCard>

          {/* ── Rule 08 ── */}
          <RuleCard number="08">
            <Text style={styles.ruleText}>
              The final interpretation of this activity belongs to Jalwa
            </Text>
          </RuleCard>
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const CARD_BG = "#0A1540";
const TEAL = "#2BC4C4";
const DIVIDER = "#162055";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 8, gap: 10 },

  // Hero
  heroBlock: { alignItems: "center", paddingVertical: 10 },
  heroTitle: {
    color: "#049680",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    color: "#C8D4F0",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },

  // Rule card
  ruleCard: {
    backgroundColor: "#011341",
    borderRadius: 12,
    overflow: "hidden",
  },

  // Section banner (trapezoid style)
  bannerOuter: {
    flexDirection: "row",
    height: 36,
    backgroundColor: CARD_BG,
  },
  bannerSideLeft: {
    width: 60,
    backgroundColor: "#1E4DB7",
    borderTopRightRadius: 20,
  },
  bannerCenter: {
    flex: 1,
    backgroundColor: "#1E4DB7",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerSideRight: {
    width: 60,
    backgroundColor: "#1E4DB7",
    borderTopLeftRadius: 20,
  },
  bannerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },

  // =================================

  ruleBody: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  ruleText: {
    color: "#C8D4F0",
    fontSize: 13.5,
    lineHeight: 22,
  },
  linkText: {
    color: TEAL,
    fontSize: 13.5,
    fontWeight: "600",
  },

  // Rebate table
  tableWrapper: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#2C5ECA",
    paddingVertical: 12,
  },
  tableHeaderText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  tableRowEven: { backgroundColor: CARD_BG },
  tableRowOdd: { backgroundColor: "#0C1848" },
  tableCellText: {
    color: "#C8D4F0",
    fontSize: 12,
    textAlign: "center",
  },

  // Crown
  crownRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 1,
  },
  crownEmoji: { fontSize: 13 },
});
