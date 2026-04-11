import { CustomHeader } from "@/components/ui/CustomHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 68;
const CARD_HEIGHT = 510;
const CARD_GAP = 12;
const SIDE_PADDING = 20;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const SITE_BASE = "https://www.jalwagame.win";

// 3 identical posters — same image, same dynamic QR per card
const POSTERS = ["p1", "p2", "p3"] as const;
type PosterDef = (typeof POSTERS)[number];

// ── Single Poster Card ────────────────────────────────────────────────────────
function PosterCard({ qrUri }: { poster: PosterDef; qrUri: string }) {
  return (
    <View style={styles.card}>
      {/* Full poster background image */}
      <Image
        source={require("@/assets/invite.jpeg")}
        style={styles.posterBg}
        contentFit="fill"
      />
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function InviteScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const inviteCode =
    (user?.code as string) ||
    (user?.id as string) ||
    (user?.phone as string) ||
    "";

  const inviteLink = `${SITE_BASE}/#/promotion/PromotionShare?code=${inviteCode}`;

  const qrUri = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    inviteLink,
  )}&bgcolor=ffffff&color=000000&margin=4&qzone=1`;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    setActiveIndex(Math.max(0, Math.min(idx, POSTERS.length - 1)));
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(inviteLink);
    showToast({
      type: "success",
      title: "Copied",
      message: "Invitation link copied to clipboard.",
    });
  };

  const handleDownloadQr = () => {
    showToast({
      type: "success",
      title: "QR Code",
      message: "Long press the QR code on the poster to save it.",
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        <CustomHeader title="Invite" onBack={() => router.back()} />

        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Swipe hint ── */}
          <Text style={styles.swipeHint}>
            Please swipe left - right to choose your favorite poster
          </Text>

          {/* ── Poster carousel ── */}
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            snapToAlignment="start"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.carouselContent}
          >
            {POSTERS.map((id) => (
              <PosterCard key={id} poster={id} qrUri={qrUri} />
            ))}
          </ScrollView>

          {/* ── Pagination dots ── */}
          <View style={styles.dotsRow}>
            {POSTERS.map((id, i) => (
              <View
                key={id}
                style={[styles.dot, i === activeIndex && styles.dotActive]}
              />
            ))}
          </View>

          {/* ── Bottom info ── */}
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Invite friends</Text>
            <Text style={styles.infoText}>
              Income <Text style={styles.infoHighlight}>10 billion</Text>{" "}
              Commission
            </Text>
          </View>

          {/* ── Download QR Code button ── */}
          <Pressable
            style={styles.downloadBtnWrap}
            onPress={handleDownloadQr}
          >
            <LinearGradient
              colors={["#7AFEC3", "#02AFB6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.downloadBtn}
            >
              <Text style={styles.downloadBtnText}>Download QR Code</Text>
            </LinearGradient>
          </Pressable>

          {/* ── Copy invitation link button ── */}
          <Pressable
            style={styles.copyBtn}
            onPress={handleCopyLink}
          >
            <Text style={styles.copyBtnText}>Copy invitation link</Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#05012B";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },

  // swipe hint
  swipeHint: {
    color: "#7AADFF",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 20,
  },

  // carousel
  carouselContent: {
    paddingLeft: SIDE_PADDING,
    paddingRight: SIDE_PADDING - CARD_GAP,
    gap: CARD_GAP,
  },

  // card
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: "hidden",
  },

  // poster background image fills the card completely
  posterBg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },

  // QR overlay sits on top of the static QR in the image
  qrOverlay: {
    position: "absolute",
    bottom: 34,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  // unused legacy decoration — kept to avoid style key gaps
  decorCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -60,
    right: -60,
  },
  decorCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: 40,
    left: -50,
  },
  decorCircle3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.04)",
    top: 100,
    right: 10,
  },

  // tags
  tagsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  tag: {
    borderWidth: 1.5,
    borderColor: "#F5A623",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    transform: [{ skewX: "-8deg" }],
  },
  tag2: {
    borderColor: "#FF6B35",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    fontStyle: "italic",
  },

  // card title
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  // features
  featuresRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  featureBox: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.55)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  featureLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },

  // commission
  commissionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  commissionRate: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },

  // gift box area
  giftContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  giftImage: {
    width: CARD_WIDTH * 0.52,
    height: CARD_WIDTH * 0.52,
  },

  // bill decoration
  bill: {
    position: "absolute",
    width: 36,
    height: 18,
    borderRadius: 3,
    backgroundColor: "#7EE8A2",
    borderWidth: 1,
    borderColor: "#4AC96D",
    opacity: 0.85,
  },

  // QR code
  qrWrapper: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 4,
  },
  qrImage: {
    width: 100,
    height: 100,
  },

  // dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dotActive: {
    width: 22,
    backgroundColor: "#00ECBE",
  },

  // info row
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 20,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  infoHighlight: {
    color: "#F97316",
    fontWeight: "700",
  },

  // buttons
  downloadBtnWrap: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 30,
    overflow: "hidden",
  },
  downloadBtn: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  downloadBtnText: {
    color: "#05012B",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  copyBtn: {
    marginHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#00ECBE",
    alignItems: "center",
    justifyContent: "center",
  },
  copyBtnText: {
    color: "#00ECBE",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
