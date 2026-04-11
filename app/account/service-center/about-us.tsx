import { ThemedView } from "@/components/themed-view";
import { router, Stack } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

import { CustomHeader } from "@/components/ui/CustomHeader";

// ── Menu Row ──────────────────────────────────────────────────────────────────
function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.menuRow}
      onPress={onPress}
    >
      <Image source={icon} style={styles.ImageIcon} resizeMode="cover" />
      <Text style={styles.menuLabel}>{label}</Text>
      <Image
        source={require("@/assets/Screenshot202603-09p230133-removebg-preview.png")}
        style={styles.ImageArrow}
        resizeMode="cover"
      />
    </Pressable>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AboutUsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="About us" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Banner Image ── */}
          <View style={styles.bannerWrapper}>
            <Image
              source={require("@/assets/aboutBg-2e4b25ca.webp")}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* ── Menu List ── */}
          <View style={styles.menuCard}>
            <MenuRow
              icon={require("@/assets/ConfidentialityAgreement.png")}
              label="Confidentiality Agreement"
            />
            {/* <View style={styles.divider} /> */}
            <MenuRow
              icon={require("@/assets/RiskDisclosureAgreement.png")}
              label="Risk Disclosure Agreement"
            />
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const DIVIDER = "#0F1D55";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },

  // Banner
  bannerWrapper: {
    width: "100%",
    height: 160,
    backgroundColor: "#0D1A4A",
    marginBottom: 0,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },

  // Menu
  menuCard: {
    marginHorizontal: 0,
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  ImageIcon: {
    width: 28,
    height: 28,
    resizeMode: "cover",
    marginRight: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#0D4A4A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconEmoji: { fontSize: 17 },
  menuLabel: { flex: 1, color: "#fff", fontSize: 15 },
  ImageArrow: {
    width: 20,
    height: 20,
    resizeMode: "cover",
    transform: [{ rotate: "180deg" }],
    opacity: 0.8,
  },
  chevron: { color: "#4A6FA5", fontSize: 16 },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginLeft: 50,
  },
});
