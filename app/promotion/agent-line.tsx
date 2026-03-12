import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Telegram Icon (built from primitives) ─────────────────────────────────────
function TelegramIcon() {
  return (
    <View style={styles.telegramIconWrapper}>
      <Image
        source={require("../../assets/telegramlogo.webp")}
        style={styles.telegramImage}
        resizeMode="contain"
      />
    </View>
  );
}

// ── Banner ────────────────────────────────────────────────────────────────────
function Banner() {
  return (
    <LinearGradient
      colors={["#76FBC3", "#06B1B6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <Image
        source={require("../../assets/rebateratiobanner.webp")}
        style={styles.agentImage}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AgentLineScreen() {
  const insets = useSafeAreaInsets();

  const handleTelegram = () => {
    Linking.openURL("https://t.me/SHiV4i"); // TODO: replace with actual Telegram link
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CustomHeader
          title="Agent line customer service"
          onBack={() => router.back()}
        />

        {/* Banner */}
        <Banner />

        {/* Telegram Row */}
        <View style={{ padding: 10, borderRadius: 10 }}>
          <TouchableOpacity
            style={styles.telegramRow}
            onPress={handleTelegram}
            activeOpacity={0.75}
          >
            <TelegramIcon />
            <Text style={styles.telegramLabel}>Telegram</Text>
            <View>
              <Image
                source={require("../../assets/Screenshot202603-09p230133-removebg-preview.png")}
                style={styles.arrowImage}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const CARD_BG = "#0A1540";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Banner
  banner: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    position: "relative",
  },

  // Floating decorations
  chatBubble: {
    position: "absolute",
    top: 42,
    left: 52,
    width: 44,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 10,
    borderBottomLeftRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  chatBubbleLines: { color: "#fff", fontSize: 18, fontWeight: "700" },

  smileyBubble: {
    position: "absolute",
    top: 30,
    right: 52,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  smileyText: { fontSize: 26 },

  plusTopRight: {
    position: "absolute",
    top: 92,
    right: 80,
    color: "rgba(255,255,255,0.6)",
    fontSize: 22,
    fontWeight: "300",
    zIndex: 3,
  },
  plusBottomLeft: {
    position: "absolute",
    bottom: 50,
    left: 32,
    color: "rgba(255,255,255,0.6)",
    fontSize: 22,
    fontWeight: "300",
    zIndex: 3,
  },
  circleDot: {
    position: "absolute",
    bottom: 44,
    right: 58,
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    zIndex: 3,
  },

  // Agent image
  agentImage: {
    width: "100%",
    height: "100%",
    zIndex: 4,
  },
  agentFallback: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: -50 }],
    alignItems: "center",
    zIndex: 2,
  },
  agentHead: { alignItems: "center" },
  agentEmoji: { fontSize: 110, lineHeight: 200 },

  // Telegram row
  telegramRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#011341",
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
    borderRadius: 5,
  },
  telegramIconWrapper: { width: 38, height: 38 },
  telegramCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#229ED9",
    alignItems: "center",
    justifyContent: "center",
  },
  telegramArrow: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 3,
  },
  telegramLabel: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    // fontWeight: '500',
  },
  telegramImage: {
    width: "100%",
    height: "100%",
  },
  arrowImage: {
    width: 30,
    height: 30,
    opacity: 0.5,
    transform: [{ rotate: "180deg" }],
  },
  chevron: { color: "#4A6FA5", fontSize: 16 },
});
