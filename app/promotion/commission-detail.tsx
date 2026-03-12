import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Dropdown ──────────────────────────────────────────────────────────────────
function Dropdown({
  value,
  options,
  onSelect,
}: {
  value: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Image
            source={require("@/assets/Screenshot202603-09p230133-removebg-preview.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setOpen(false)}
          activeOpacity={1}
        >
          <View style={styles.dropdownMenu}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.dropdownOption,
                  value === opt && styles.dropdownOptionActive,
                ]}
                onPress={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    value === opt && styles.dropdownOptionTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.emptyWrapper}>
      <View style={styles.illustration}>
        {/* Hills */}
        <View
          style={[styles.hill, { width: 90, height: 44, left: 8, bottom: 0 }]}
        />
        <View
          style={[styles.hill, { width: 65, height: 32, right: 16, bottom: 0 }]}
        />

        {/* Scroll / tablet */}
        <View style={styles.tablet}>
          <View style={styles.tabletRoll} />
          <View style={styles.tabletBody}>
            <View style={styles.tabletLine} />
            <View style={[styles.tabletLine, { width: "55%" }]} />
            <View style={styles.tabletLine} />
          </View>
          <View style={styles.tabletRoll} />
        </View>

        {/* Trees */}
        <View style={[styles.treeWrap, { left: 14, bottom: 6 }]}>
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>
        <View
          style={[
            styles.treeWrap,
            { right: 22, bottom: 8, transform: [{ scale: 0.8 }] },
          ]}
        >
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>

        {/* Quill */}
        <View style={styles.quill} />
        <View style={styles.quillHead} />
      </View>
      <Text style={styles.noDataText}>No data</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CommissionDetailsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState("2026-03-08");

  const DATE_OPTIONS = [
    "2026-03-08",
    "2026-03-07",
    "2026-03-06",
    "2026-03-05",
    "2026-03-04",
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CustomHeader title="Commission Details" onBack={() => router.back()} />

        {/* ── Date Dropdown ── */}
        <View style={styles.dropdownWrapper}>
          <Dropdown
            value={selectedDate}
            options={DATE_OPTIONS}
            onSelect={setSelectedDate}
          />
        </View>

        {/* ── Empty State ── */}
        <EmptyState />
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const CARD_BG = "#0A1540";
const DIVIDER = "#162055";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Dropdown wrapper
  dropdownWrapper: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD_BG,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownText: { color: "#6A85B8", fontSize: 16, flex: 1 },
  dropdownArrow: { color: "#6A85B8", fontSize: 18, marginLeft: 6 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "#0F1E55",
    borderRadius: 12,
    minWidth: 200,
    overflow: "hidden",
  },
  dropdownOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  dropdownOptionActive: { backgroundColor: "#162A70" },
  dropdownOptionText: { color: "#6A85B8", fontSize: 14 },
  dropdownOptionTextActive: { color: "#fff", fontWeight: "600" },

  // Empty state
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 60,
  },
  illustration: {
    width: 170,
    height: 120,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: 20,
    height: 27,
    resizeMode: "contain",
    opacity: 0.5,
    transform: [{ rotate: "-90deg" }],
  },
  hill: {
    position: "absolute",
    backgroundColor: "#1A2A50",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  tablet: { alignItems: "center", zIndex: 2, marginBottom: 8 },
  tabletRoll: {
    width: 70,
    height: 14,
    backgroundColor: "#2A3A62",
    borderRadius: 7,
  },
  tabletBody: {
    width: 70,
    backgroundColor: "#1E2E52",
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 6,
    alignItems: "center",
  },
  tabletLine: {
    width: "90%",
    height: 3,
    backgroundColor: "#2A3A62",
    borderRadius: 2,
  },
  treeWrap: { position: "absolute", alignItems: "center", zIndex: 1 },
  treeTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 24,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#1A2A50",
  },
  treeTrunk: { width: 5, height: 10, backgroundColor: "#1A2A50" },
  quill: {
    position: "absolute",
    top: 12,
    right: 34,
    width: 3,
    height: 30,
    backgroundColor: "#2A3A62",
    borderRadius: 2,
    transform: [{ rotate: "-35deg" }],
    zIndex: 3,
  },
  quillHead: {
    position: "absolute",
    top: 8,
    right: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#2A3A62",
    transform: [{ rotate: "-35deg" }],
    zIndex: 3,
  },
  noDataText: { color: "#4A6FA5", fontSize: 14 },
});
