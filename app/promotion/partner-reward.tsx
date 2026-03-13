import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Clipboard,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface LinkCopyBannerProps {
  link: string;
  onCopy?: () => void;
}
// ── Top Banner ────────────────────────────────────────────────────────────────
function RewardBanner() {
  return (
    <View style={styles.banner}>
      {/* Gradient background */}
      <View style={styles.bannerGradient} />

      {/* Trophy and coins image */}
      <View style={styles.trophyContainer}>
        <Text style={styles.trophyEmoji}>🏆</Text>
        <Text style={styles.coinsEmoji}>💰</Text>
      </View>

      {/* Text content */}
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerText}>Invite friends to get max</Text>
        <Text style={styles.bannerText}>rewards</Text>
        <View style={styles.amountBadge}>
          <Text style={styles.amountText}>₹358.00</Text>
        </View>
      </View>
    </View>
  );
}

// ── Stats Section ─────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Invitation count</Text>
        <Text style={[styles.statValue, styles.whiteValue]}>0</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Effective Invitation count</Text>
        <Text style={[styles.statValue, styles.greenValue]}>0</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Invitation total bonus</Text>
        <Text style={[styles.statValue, styles.redValue]}>₹0.00</Text>
      </View>

      <TouchableOpacity style={styles.recordLink}>
        <Text style={styles.recordLinkText}>Invitation record »</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Invitation Link Section ───────────────────────────────────────────────────
function InvitationLinkSection() {
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://jalwaclub3.com/#/register...";

  const handleCopy = () => {
    Clipboard.setString(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.linkSection}>
      <View style={styles.linkHeader}>
        <View style={styles.linkIconSquare} />
        <Text style={styles.linkTitle}>Invitation link</Text>
      </View>

      <LinkCopyBanner
        link="https://www.jalwagame.com/#/register?code=ABC123"
        onCopy={() => console.log("Link copied!")}
      />
    </View>
  );
}

// ── Invitation Rules Section ──────────────────────────────────────────────────
function InvitationRulesSection() {
  const bonusData = [
    {
      deposit: "1st\ndeposit",
      conditions: [
        { range: "₹200 ≤ Amount<₹500\nand Turnover ≥ ₹1,000", bonus: "₹28" },
        { range: "₹500 ≤ Amount<₹1,000\nand Turnover ≥ ₹2,500", bonus: "₹58" },
        {
          range: "₹1,000 ≤ Amount<₹2,500\nand Turnover ≥ ₹5,000",
          bonus: "₹108",
        },
        {
          range: "₹2,500 ≤ Amount<₹5,000\nand Turnover ≥ ₹12,500",
          bonus: "₹158",
        },
        { range: "Amount ≥ ₹5,000\nand Turnover ≥ ₹25,000", bonus: "₹358" },
      ],
    },
    {
      deposit: "2nd\ndeposit",
      conditions: [
        { range: "₹300 ≤ Amount<₹1,000\nand Turnover ≥ ₹2,000", bonus: "₹28" },
        {
          range: "₹1,000 ≤ Amount<₹2,500\nand Turnover ≥ ₹10,000",
          bonus: "₹58",
        },
        {
          range: "₹2,500 ≤ Amount<₹5,000\nand Turnover ≥ ₹25,000",
          bonus: "₹108",
        },
        {
          range: "₹5,000 ≤ Amount<₹10,000\nand Turnover ≥ ₹50,000",
          bonus: "₹158",
        },
        { range: "Amount ≥ ₹10,000\nand Turnover ≥ ₹75,000", bonus: "₹358" },
      ],
    },
    {
      deposit: "3rd\ndeposit",
      conditions: [
        {
          range: "₹1,000 ≤ Amount<₹2,500\nand Turnover ≥ ₹15,000",
          bonus: "₹28",
        },
        {
          range: "₹2,500 ≤ Amount<₹5,000\nand Turnover ≥ ₹37,500",
          bonus: "₹58",
        },
        {
          range: "₹5,000 ≤ Amount<₹10,000\nand Turnover ≥ ₹75,000",
          bonus: "₹108",
        },
        {
          range: "₹10,000 ≤ Amount<₹20,000\nand Turnover ≥ ₹125,000",
          bonus: "₹158",
        },
        { range: "Amount ≥ ₹20,000\nand Turnover ≥ ₹225,000", bonus: "₹358" },
      ],
    },
  ];

  return (
    <View style={styles.rulesSection}>
      <View style={styles.rulesHeader}>
        {/* <View style={styles.rulesIconSquare} /> */}
        <Image
          source={require("@/assets/invitationrules.png")}
          style={[
            {
              width: 30,
              height: 30,
              resizeMode: "contain",
              marginRight: 5,
            },
          ]}
        />
        <Text style={styles.rulesTitle}>Invitation rules</Text>
      </View>

      <Text style={styles.rulesSubtitle}>
        If you invites player A, with in{" "}
        <Text style={styles.highlightRed}>6 Day</Text>
      </Text>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={styles.tableHeaderCell}>
          <Text style={styles.tableHeaderText}></Text>
        </View>
        <View style={styles.tableHeaderCell}>
          <Text style={styles.tableHeaderText}>When Player A</Text>
        </View>
        <View style={styles.tableHeaderCell}>
          <Text style={styles.tableHeaderText}>You get bonus</Text>
        </View>
      </View>

      {/* Table Rows */}
      {bonusData.map((section, idx) => (
        <View key={idx}>
          {section.conditions.map((condition, condIdx) => (
            <View key={`${idx}-${condIdx}`} style={styles.tableRow}>
              {condIdx === 0 && (
                <View
                  style={[
                    styles.depositCell,
                    { height: section.conditions.length * 56 },
                  ]}
                >
                  <Text style={styles.depositText}>{section.deposit}</Text>
                </View>
              )}
              <View
                style={[
                  styles.conditionCell,
                  condIdx === 0 ? { marginLeft: 0 } : { marginLeft: 55 },
                ]}
              >
                <Text style={styles.conditionText}>{condition.range}</Text>
              </View>
              <View style={styles.bonusCell}>
                <Text style={styles.bonusText}>{condition.bonus}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      {/* Bottom Notes */}
      <Text style={styles.noteWarning}>
        *Each deposit can only get one bonus.
      </Text>

      <View style={styles.notesContainer}>
        <View style={styles.noteRow}>
          <Text style={styles.noteBullet}>◆</Text>
          <Text style={styles.noteText}>
            eg:{"\n"}
            Player A 1st deposit <Text style={styles.noteOrange}>
              ₹199.00
            </Text>{" "}
            and turnover{"\n"}
            <Text style={styles.noteOrange}>₹1,000.00</Text>, you can't get
            bonus
          </Text>
        </View>

        <View style={styles.noteRow}>
          <Text style={styles.noteBullet}>◆</Text>
          <Text style={styles.noteText}>
            the reward has no limitation, the more you invited{"\n"}
            the more rewards you will get it
          </Text>
        </View>

        <View style={styles.noteRow}>
          <Text style={styles.noteBullet}>◆</Text>
          <Text style={styles.noteText}>
            If the conditions are met the rewards will be{"\n"}
            automatically credited to player's balance
          </Text>
        </View>
      </View>
    </View>
  );
}
function LinkCopyBanner({ link, onCopy }: LinkCopyBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(link);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.containerLinkCopyBanner}>
        {/* Left section with text */}
        <View style={styles.textContainer}>
          <Text style={styles.linkText} numberOfLines={1}>
            {link}
          </Text>
        </View>

        {/* Right section with copy button */}
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleCopy}
          activeOpacity={0.8}
        >
          {/* Angled teal background */}
          <View style={styles.angledBg} />

          {/* Copy icon */}
          <View style={styles.iconWrapper}>
            <Image
              source={require("@/assets/copylink.png")}
              style={{
                width: 30,
                height: 30,
                resizeMode: "contain",
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PartnerRewardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CustomHeader title="Partner rewards" onBack={() => router.back()} />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <RewardBanner />
          <StatsSection />

          <InvitationLinkSection />
          <InvitationRulesSection />

          {/* Bottom padding */}
          <View style={{ height: 20 }} />
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const CARD_BG = "#05012B";
const TEAL = "#00D9C5";
const ORANGE = "#F5A623";
const NAVY = "#0A1540";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollView: {
    flex: 1,
  },
  wrapper: {
    width: "100%",
  },
  containerLinkCopyBanner: {
    flexDirection: "row",
    height: 44,
    backgroundColor: NAVY,
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 12,
    justifyContent: "center",
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "400",
  },
  buttonWrapper: {
    width: 90,
    height: 44,
    position: "relative",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  angledBg: {
    position: "absolute",
    right: -8,
    width: 110,
    height: 44,
    backgroundColor: "#00ECBE",
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    transform: [{ skewX: "-20deg" }],
  },
  iconWrapper: {
    width: 60,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  copyIcon: {
    fontSize: 24,
  },
  // Banner
  banner: {
    width: "100%",
    height: 160,
    overflow: "hidden",
    position: "relative",
    marginBottom: 2,
  },
  bannerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ORANGE,
    opacity: 0.9,
  },
  trophyContainer: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -40 }],
    alignItems: "center",
  },
  trophyEmoji: {
    fontSize: 80,
    lineHeight: 90,
  },
  coinsEmoji: {
    fontSize: 40,
    marginTop: -15,
  },
  bannerTextContainer: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -35 }],
    alignItems: "flex-end",
  },
  bannerText: {
    color: "#4A2C0F",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  amountBadge: {
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  amountText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Stats Section
  statsContainer: {
    backgroundColor: CARD_BG,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 2,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#011341",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  statLabel: {
    color: "#8DA8D8",
    fontSize: 14,
  },
  statValue: {
    fontSize: 16,
    // fontWeight: "600",
  },
  whiteValue: {
    color: "#fff",
  },
  greenValue: {
    color: "#00D97E",
  },
  redValue: {
    color: "#FF4757",
  },
  recordLink: {
    alignSelf: "center",
    paddingVertical: 12,
  },
  recordLinkText: {
    color: "#ffffff",
    fontSize: 14,
  },

  // Invitation Link Section
  linkSection: {
    backgroundColor: CARD_BG,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 2,
  },
  linkHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  linkIconSquare: {
    width: 2,
    height: 16,
    backgroundColor: "#00ECBE",
    marginRight: 8,
    // borderRadius: 2,
  },
  linkTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#011341",
    borderRadius: 38,
    padding: 12,
    paddingVertical: 3,
    gap: 12,
  },
  // linkText: {
  //   flex: 1,
  //   color: "#fff",
  //   fontSize: 13,
  // },
  copyButton: {
    backgroundColor: TEAL,
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  // Invitation Rules Section
  rulesSection: {
    backgroundColor: CARD_BG,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rulesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rulesIconSquare: {
    width: 16,
    height: 16,
    backgroundColor: TEAL,
    marginRight: 8,
    borderRadius: 2,
  },
  rulesTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rulesSubtitle: {
    color: "#8DA8D8",
    fontSize: 13,
    marginBottom: 12,
  },
  highlightRed: {
    color: "#FF4757",
    fontWeight: "600",
  },

  // Table - PIXEL PERFECT ADJUSTMENTS
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden",
    // marginBottom: 4,
  },
  tableHeaderCell: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tableHeaderText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tableRow: {
    flexDirection: "row",
    // marginBottom: 4,
    height: 52,
  },
  depositCell: {
    width: 55,
    backgroundColor: "#152149",
    borderWidth: 0.5,
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    // marginRight: 4,
  },
  depositText: {
    color: "#fff",
    fontSize: 13,
    // fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
  conditionCell: {
    flex: 1,
    backgroundColor: "#152149",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginLeft: 59,
    // marginRight: 4,
    borderWidth: 0.5,
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#2563EB",
    justifyContent: "center",
  },
  conditionText: {
    color: "#aac0ecff",
    fontSize: 14,
    lineHeight: 15,
  },
  bonusCell: {
    width: 65,
    backgroundColor: "#152149",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#2563EB",
  },
  bonusText: {
    color: "#FF4757",
    fontSize: 14,
    // fontWeight: "700",
  },

  // Notes
  noteWarning: {
    color: "#FF4757",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 12,
  },
  notesContainer: {
    gap: 12,
  },
  noteRow: {
    flexDirection: "row",
    gap: 8,
  },
  noteBullet: {
    color: TEAL,
    fontSize: 10,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    color: "#8DA8D8",
    fontSize: 12,
    lineHeight: 18,
  },
  noteOrange: {
    color: "red",
    opacity: 0.5,
    // fontWeight: "600",
  },
});
