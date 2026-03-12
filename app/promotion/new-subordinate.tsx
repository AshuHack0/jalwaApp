import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Tab types ─────────────────────────────────────────────────────────────────
type Tab = "Today" | "Yesterday" | "This month";
const TABS: Tab[] = ["Today", "Yesterday", "This month"];

// ── Empty Illustration ────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.emptyWrapper}>
      <View style={styles.illustration}>
        {/* Background hills */}
        <View
          style={[styles.hill, { width: 110, height: 52, left: 4, bottom: 0 }]}
        />
        <View
          style={[styles.hill, { width: 75, height: 38, right: 8, bottom: 0 }]}
        />

        {/* Scroll / stone tablet */}
        <View style={styles.tablet}>
          <View style={styles.tabletRoll} />
          <View style={styles.tabletBody}>
            <View style={styles.tabletLine} />
            <View style={[styles.tabletLine, { width: "50%" }]} />
            <View style={styles.tabletLine} />
          </View>
          <View style={styles.tabletRoll} />
        </View>

        {/* Left tree */}
        <View style={[styles.treeWrap, { left: 20, bottom: 6 }]}>
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>

        {/* Right tree (smaller) */}
        <View
          style={[
            styles.treeWrap,
            { right: 28, bottom: 8, transform: [{ scale: 0.75 }] },
          ]}
        >
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>

        {/* Small block (bottom right) */}
        <View style={styles.smallBlock} />

        {/* Quill / arrow */}
        <View style={styles.quill} />
        <View style={styles.quillHead} />

        {/* Dotted path */}
        <View style={styles.dottedPath} />
      </View>

      <Text style={styles.noDataText}>No data</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function NewSubordinatesScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CustomHeader title="New subordinates" onBack={() => router.back()} />

        {/* ── Tab Bar ── */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabItem,
                activeTab === tab && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Content ── */}
        <EmptyState />
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

  // Tab bar
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemActive: {
    backgroundColor: TEAL,
  },
  tabText: {
    color: "#6A85B8",
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  // Empty state
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 80,
  },

  // Illustration container
  illustration: {
    width: 200,
    height: 140,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  // Hills
  hill: {
    position: "absolute",
    backgroundColor: "#1A2A50",
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
  },

  // Scroll tablet
  tablet: {
    alignItems: "center",
    zIndex: 2,
    marginBottom: 10,
  },
  tabletRoll: {
    width: 82,
    height: 16,
    backgroundColor: "#2A3A62",
    borderRadius: 8,
  },
  tabletBody: {
    width: 82,
    backgroundColor: "#1E2E52",
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 7,
    alignItems: "center",
  },
  tabletLine: {
    width: "90%",
    height: 3,
    backgroundColor: "#2A3A62",
    borderRadius: 2,
  },

  // Trees
  treeWrap: {
    position: "absolute",
    alignItems: "center",
    zIndex: 1,
  },
  treeTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 26,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#1A2A50",
  },
  treeTrunk: {
    width: 6,
    height: 12,
    backgroundColor: "#1A2A50",
    borderRadius: 1,
  },

  // Small block accent
  smallBlock: {
    position: "absolute",
    bottom: 12,
    right: 44,
    width: 22,
    height: 16,
    backgroundColor: "#1E2E52",
    borderRadius: 3,
    zIndex: 2,
  },

  // Quill / arrow pointing down-left
  quill: {
    position: "absolute",
    top: 16,
    left: 72,
    width: 3,
    height: 32,
    backgroundColor: "#2A3A62",
    borderRadius: 2,
    transform: [{ rotate: "-40deg" }],
    zIndex: 4,
  },
  quillHead: {
    position: "absolute",
    top: 10,
    left: 68,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 11,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#2A3A62",
    transform: [{ rotate: "-40deg" }],
    zIndex: 4,
  },

  // Dotted path line
  dottedPath: {
    position: "absolute",
    top: 38,
    left: 70,
    width: 60,
    height: 2,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#2A3A62",
    zIndex: 3,
  },

  noDataText: {
    color: "#4A6FA5",
    fontSize: 14,
  },
});
