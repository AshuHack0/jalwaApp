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
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Modal,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_BASE_URL } from "@/services/api/config";
import { getToken } from "@/services/auth-storage";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { ThemedText } from "@/components/themed-text";
import { useDepositModal } from "@/contexts/DepositModalContext";
import { useAudioPlayer } from "expo-audio";

// ── Empty History Illustration ────────────────────────────────────────────────
function EmptyHistory() {
  return (
    <View style={styles.emptyWrapper}>
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

type RedeemHistoryItem = {
  code: string;
  amount: number;
  redeemedAt: string;
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GiftScreen() {
  const [_loaded] = useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  });
  const [_fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_700Bold,
  });
  const [_interLoaded] = useInter({
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
  const [loadingMyCode, setLoadingMyCode] = useState(true);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showGameErrorModal, setShowGameErrorModal] = useState(false);

  const [redeeming, setRedeeming] = useState(false);
  const [redeemHistory, setRedeemHistory] = useState<RedeemHistoryItem[]>([]);

  const insets = useSafeAreaInsets();
  const { user, refreshWallet } = useAuth();
  const { showToast } = useToast();
  const { openDepositModal } = useDepositModal();

  const minDeposit5kPlayer = useAudioPlayer(
    require("@/assets/MinimumDeposit5K.mp3"),
  );

  useEffect(() => {
    if (showGameErrorModal) {
      minDeposit5kPlayer.seekTo(0);
      minDeposit5kPlayer.play();
    }
  }, [showGameErrorModal]);

  // On mount: fetch user's already-generated code and redemption history
  useEffect(() => {
    fetchMyCode();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/gift-codes/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setRedeemHistory(
          json.data.map((item: { code: string; amount: number; createdAt: string }) => ({
            code: item.code,
            amount: item.amount,
            redeemedAt: item.createdAt,
          }))
        );
      }
    } catch {
      // silently ignore
    }
  };

  const fetchMyCode = async () => {
    setLoadingMyCode(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/gift-codes/my-code`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedCode(json.data.code);
        setGeneratedAmount(json.data.amount);
      }
    } catch {
      // silently ignore — user just won't see a pre-existing code
    } finally {
      setLoadingMyCode(false);
    }
  };

  const handleGenerateCode = async () => {

    if ((user?.totalDeposited as number) <= 0) {
      setShowGameErrorModal(true);
      return;
    }

    setGenerating(true);
    setGenerateError(null);
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

  const handleRedeem = async () => {
    if (!giftCode.trim()) return;
    setRedeeming(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/gift-codes/redeem`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: giftCode.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setGiftCode("");
        setRedeemHistory((prev) => [
          {
            code: giftCode.trim().toUpperCase(),
            amount: json.data.amount,
            redeemedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        await refreshWallet();
        showToast({ type: "success", title: "Gift redeemed successfully!" });
      } else {
        showToast({ type: "error", title: json.message ?? "Failed to redeem code" });
      }
    } catch {
      showToast({ type: "error", title: "Network error. Please try again." });
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>

        {/* ── Generate Gift Code Panel ── */}
        <View style={styles.generateCard}>
          <View style={styles.generateHeader}>
            <Text style={styles.generateTitle}>Gift Code</Text>
          </View>

          {loadingMyCode ? (
            <ActivityIndicator color="#FFFFFF" size="small" style={{ paddingVertical: 14 }} />
          ) : !generatedCode ? (
            <>
              <Pressable
                style={styles.generateBtnWrapper}
                onPress={handleGenerateCode}
                disabled={generating}
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
              </Pressable>

              {generateError ? (
                <Text style={styles.generateError}>{generateError}</Text>
              ) : null}
            </>
          ) : (
            <View style={styles.codeRevealBox}>
              <View style={styles.codeRow}>
                <Text style={styles.codeText}>{generatedCode}</Text>
                <Pressable style={styles.copyBtn} onPress={handleCopy}>
                  <Text style={styles.copyBtnText}>
                    {copied ? "Copied!" : "Copy"}
                  </Text>
                </Pressable>
              </View>
              {generatedAmount !== null && (
                <Text style={styles.codeAmountText}>
                  Worth: ₹{generatedAmount}
                </Text>
              )}
            </View>
          )}
        </View>

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
                onChangeText={(t) => {
                  setGiftCode(t);
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!redeeming}
              />

              <Pressable onPress={handleRedeem} disabled={redeeming || !giftCode.trim()}>
                <LinearGradient
                  colors={["#05b1b6", "#78fcc3"]}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.receiveBtn,
                    (redeeming || !giftCode.trim()) && { opacity: 0.5 },
                  ]}
                >
                  {redeeming ? (
                    <ActivityIndicator color="#05012B" size="small" />
                  ) : (
                    <Text style={styles.receiveBtnText}>Receive</Text>
                  )}
                </LinearGradient>
              </Pressable>
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

              {redeemHistory.length === 0 ? (
                <EmptyHistory />
              ) : (
                <View style={styles.historyList}>
                  {redeemHistory.map((item, idx) => (
                    <View key={idx} style={styles.historyItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.historyItemCode}>{item.code}</Text>
                        <Text style={styles.historyItemDate}>
                          {new Date(item.redeemedAt).toLocaleString()}
                        </Text>
                      </View>
                      <Text style={styles.historyItemAmount}>+₹{item.amount}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>

      <Modal
        visible={showGameErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGameErrorModal(false)}
      >
        <Pressable
          style={styles.gameErrorOverlay}
          onPress={() => setShowGameErrorModal(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.gameErrorPopup}
          >
            <ThemedText style={styles.gameErrorTitle}>Tips</ThemedText>
            <ThemedText style={styles.gameErrorMessage}>
              Minimum recharge ₹5000.00 to enter
            </ThemedText>
            <View style={styles.gameErrorSeparator} />
            <View style={styles.gameErrorButtonRow}>
              <Pressable
                style={styles.gameErrorButton}
                onPress={() => setShowGameErrorModal(false)}
              >
                <ThemedText style={styles.gameErrorButtonTextCancel}>
                  Cancel
                </ThemedText>
              </Pressable>
              <View style={styles.gameErrorButtonDivider} />
              <Pressable
                style={styles.gameErrorButton}
                onPress={() => {
                  setShowGameErrorModal(false);
                  openDepositModal();
                }}
              >
                <ThemedText style={styles.gameErrorButtonTextConfirm}>
                  Confirm
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const TEAL = "#2BC4C4";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, marginTop: 50 },

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
    marginBottom: 8,
  },
  receiveBtn: {
    borderRadius: 28,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
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

  historyList: { gap: 10 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#060B2E",
    borderRadius: 8,
    padding: 12,
  },
  historyItemCode: { color: "#fff", fontSize: 14, fontWeight: "600" },
  historyItemDate: { color: "#6A85B8", fontSize: 11, marginTop: 2 },
  historyItemAmount: { color: "#78fcc3", fontSize: 15, fontWeight: "700" },

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
  gameErrorOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  gameErrorPopup: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingTop: 18,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  },
  gameErrorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },
  gameErrorMessage: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 18,
    paddingHorizontal: 18,
  },
  gameErrorSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    alignSelf: "stretch",
  },
  gameErrorButtonRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    height: 50,
  },
  gameErrorButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gameErrorButtonDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
  gameErrorButtonTextCancel: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "500",
  },
  gameErrorButtonTextConfirm: {
    color: "#3B82F6",
    fontSize: 22,
    fontWeight: "500",
  },
});
