import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
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
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_BASE_URL } from "@/services/api/config";
import { getToken } from "@/services/auth-storage";
import { useAuth } from "@/contexts/AuthContext";

// ── Empty History Illustration ────────────────────────────────────────────────
function EmptyHistory() {
  return (
    <View style={styles.emptyWrapper}>
      {/* Scroll / ruins illustration built from primitives */}
      <View style={styles.illustration}>
        <Image
          source={require("@/assets/EmptyState2.png")}
          style={styles.emptyIcon}
        />
      </View>
      <Text style={styles.noDataText}>No data</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GiftScreen() {
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
  const [giftCode, setGiftCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedAmount, setGeneratedAmount] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const handleReceive = () => {
    if (!giftCode.trim()) return;
    // TODO: call redeem API
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    setGenerateError(null);
    setGeneratedCode(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/gift-codes/claim`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedCode(json.data.code);
        setGeneratedAmount(json.data.amount);
      } else {
        setGenerateError(json.message ?? "Failed to generate code");
      }
    } catch {
      setGenerateError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    await Clipboard.setStringAsync(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>

        {/* ── Generate Gift Code Panel ── */}
        {((user?.totalDeposited as number) ?? 0) >= 5000 && (
          <View style={styles.generateCard}>
            <View style={styles.generateHeader}>
              <Text style={styles.generateTitle}>Generate Gift Code</Text>
            </View>

            {!generatedCode ? (
              <>
                <TouchableOpacity
                  style={styles.generateBtnWrapper}
                  onPress={handleGenerateCode}
                  disabled={generating}
                  activeOpacity={0.8}
                >
                  <View style={styles.generateBtn}>
                    {generating ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.generateBtnText}>
                        Generate Gift Code
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {generateError ? (
                  <Text style={styles.generateError}>{generateError}</Text>
                ) : null}
              </>
            ) : (
              <View style={styles.codeRevealBox}>
                <View style={styles.codeRow}>
                  <Text style={styles.codeText}>{generatedCode}</Text>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={handleCopy}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.copyBtnText}>
                      {copied ? "Copied!" : "Copy"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {generatedAmount !== null && (
                  <Text style={styles.codeAmountText}>
                    Worth: ₹{generatedAmount}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setGeneratedCode(null);
                    setGenerateError(null);
                  }}
                  style={styles.regenerateLink}
                >
                  <Text style={styles.regenerateLinkText}>
                    Generate Another
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <CustomHeader title="Gift" onBack={() => router.back()} paddingTop={1} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 32 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {/* ── Banner ── */}
            <View style={styles.bannerWrapper}>
              <Image
                source={require("@/assets/giftbanner.jpg")}
                style={styles.bannerImage}
                resizeMode="contain"
              />
            </View>

            {/* ── Gift Code Card ── */}
            <View style={styles.card}>
              <Text style={styles.hiText}>Hi</Text>
              <Text style={styles.subText}>We have a gift for you</Text>

              <Text style={styles.inputLabel}>
                Please enter the gift code below
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Please enter gift code"
                placeholderTextColor="#2A3A6A"
                value={giftCode}
                onChangeText={setGiftCode}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <LinearGradient
                colors={["#05b1b6", "#78fcc3"]}
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[styles.receiveBtn]}
              >
                <Text style={styles.receiveBtnText}>Receive</Text>
              </LinearGradient>
            </View>

            {/* ── History Card ── */}
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Image
                  source={require("@/assets/Screenshot_2026-03-18_063052-removebg-preview.png")}
                  style={styles.HistoryIcon}
                />
                <Text style={styles.historyTitle}>History</Text>
              </View>

              <EmptyHistory />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const CARD_BG = "#0A1540";
const TEAL = "#2BC4C4";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { gap: 12 },

  // Banner
  bannerWrapper: {
    width: "100%",
    height: 165,
    backgroundColor: "#05012B",
    overflow: "hidden",
  },
  bannerImage: {
    // ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    zIndex: 2,
  },
  bannerFallback: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    zIndex: 1,
  },
  bannerEmoji: { fontSize: 52 },

  // Gift code card
  card: {
    backgroundColor: "#011341",
    borderRadius: 10,
    marginHorizontal: 12,
    padding: 20,
    gap: 4,
  },
  HistoryIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  emptyIcon: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  hiText: {
    color: "#6A85B8",
    fontSize: 14.9,
    marginBottom: 0,
  },
  subText: {
    color: "#6A85B8",
    fontSize: 14.9,
    marginBottom: 14,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14.9,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#060B2E",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  receiveBtn: {
    borderRadius: 28,
    paddingVertical: 10,
    alignItems: "center",
  },
  receiveBtnText: {
    color: "#05012B",
    fontSize: 16,
  },

  // History card
  historyCard: {
    backgroundColor: "#011341",
    borderRadius: 10,
    marginHorizontal: 12,
    padding: 20,
    minHeight: 280,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  historyIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#0D4A4A",
    alignItems: "center",
    justifyContent: "center",
  },
  historyIcon: { color: TEAL, fontSize: 14, fontWeight: "700" },
  historyTitle: { color: "#fff", fontSize: 16, fontWeight: "400" },

  // Empty state
  emptyWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 16,
  },
  illustration: {
    width: 160,
    height: 120,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  hill: {
    position: "absolute",
    backgroundColor: "#1A2A50",
  },
  tablet: {
    width: 72,
    height: 88,
    alignItems: "center",
    marginBottom: 8,
  },
  tabletTop: {
    width: 72,
    height: 18,
    backgroundColor: "#2A3A60",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tabletBody: {
    flex: 1,
    width: 72,
    backgroundColor: "#1E2E50",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 8,
    gap: 6,
    alignItems: "center",
  },
  tabletLine: {
    width: "85%",
    height: 3,
    backgroundColor: "#2A3A60",
    borderRadius: 2,
  },
  tree: {
    position: "absolute",
    alignItems: "center",
  },
  treeTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 22,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#1A2A50",
  },
  treeTrunk: {
    width: 5,
    height: 10,
    backgroundColor: "#1A2A50",
    borderRadius: 1,
  },
  pencil: {
    position: "absolute",
    top: 10,
    right: 30,
    width: 3,
    height: 28,
    backgroundColor: "#2A3A60",
    borderRadius: 2,
    transform: [{ rotate: "-30deg" }],
  },
  noDataText: {
    color: "#4A6FA5",
    fontSize: 14,
  },

  // Generate Gift Code panel
  generateCard: {
    backgroundColor: "#001E59",
    marginHorizontal: 0,
    padding: 12,
    marginTop: 50,
    gap: 10,
  },
  generateHeader: { gap: 4, marginBottom: 4 },
  generateTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  generateSub: {
    color: "#AABAFF",
    fontSize: 12,
  },
  generateBtnWrapper: { borderRadius: 6, overflow: "hidden" },
  generateBtn: {
    width: "100%",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00A3FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  generateBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  generateError: {
    color: "#FF6B6B",
    fontSize: 13,
    textAlign: "center",
  },

  // Revealed code
  codeRevealBox: {
    gap: 10,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#AABAFF",
    backgroundColor: "rgb(50, 120, 200)",
    padding: 14,
    alignItems: "center",
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  codeText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  copyBtn: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  copyBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  codeAmountText: {
    color: "white",
    fontSize: 13,
    textAlign: "center",
  },
  regenerateLink: { alignItems: "center", paddingTop: 4 },
  regenerateLinkText: {
    color: "#AABAFF",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
