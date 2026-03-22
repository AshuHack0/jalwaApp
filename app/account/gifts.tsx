import { ThemedView } from "@/components/themed-view";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomHeader } from "@/components/ui/CustomHeader";
import { LinearGradient } from "expo-linear-gradient";

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
  const [giftCode, setGiftCode] = useState("");
  const insets = useSafeAreaInsets();

  const handleReceive = () => {
    if (!giftCode.trim()) return;
    // TODO: call redeem API
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Gift" onBack={() => router.back()} />

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
const BG = "#1a1d26";
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
    backgroundColor: "#0f1117",
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
    backgroundColor: "#1e293b",
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
    fontSize: 15,
    marginBottom: 0,
  },
  subText: {
    color: "#6A85B8",
    fontSize: 15,
    marginBottom: 14,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#1a1d26",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 14,
    marginBottom: 16,
  },
  receiveBtn: {
    borderRadius: 28,
    paddingVertical: 12,
    alignItems: "center",
  },
  receiveBtnText: {
    color: "#0f1117",
    fontSize: 17,
  },

  // History card
  historyCard: {
    backgroundColor: "#1e293b",
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
});
