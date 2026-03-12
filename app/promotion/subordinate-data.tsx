import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
        {/* <Text style={styles.dropdownArrow}>⌄</Text> */}
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

// ── Stat Cell ─────────────────────────────────────────────────────────────────
function StatCell({
  value,
  label,
  borderRight = false,
  borderBottom = false,
}: {
  value: string;
  label: string;
  borderRight?: boolean;
  borderBottom?: boolean;
}) {
  return (
    <View
      style={[
        styles.statCell,
        borderRight && styles.statBorderRight,
        // borderBottom && styles.statBorderBottom,
      ]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Empty Illustration ────────────────────────────────────────────────────────
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

        {/* Stone tablet / scroll */}
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

        {/* Arrow / quill */}
        <View style={styles.quill} />
        <View style={styles.quillHead} />
      </View>
      <Text style={styles.noDataText}>No data</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SubordinateDataScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterDate, setFilterDate] = useState("2026-03-08");

  const TYPE_OPTIONS = ["All", "Direct", "Indirect"];
  const DATE_OPTIONS = [
    "2026-03-08",
    "2026-03-07",
    "2026-03-06",
    "2026-03-05",
    "2026-03-04",
  ];

  const stats = [
    {
      value: "0",
      label: "Deposit number",
      borderRight: true,
      borderBottom: true,
    },
    {
      value: "0",
      label: "Deposit amount",
      borderRight: false,
      borderBottom: true,
    },
    {
      value: "0",
      label: "Number of bettors",
      borderRight: true,
      borderBottom: true,
    },
    { value: "0", label: "Total bet", borderRight: false, borderBottom: true },
    {
      value: "0",
      label: "Number of people making first deposit",
      borderRight: true,
      borderBottom: false,
    },
    {
      value: "0",
      label: "First deposit amount",
      borderRight: false,
      borderBottom: false,
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CustomHeader title="Subordinate data" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Search Bar ── */}
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search subordinate UID"
              placeholderTextColor="#2A3A6A"
              value={searchText}
              onChangeText={setSearchText}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.searchBtn} activeOpacity={0.85}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>

          {/* ── Filter Row ── */}
          <View style={styles.filterRow}>
            <View style={{ flex: 1 }}>
              <Dropdown
                value={filterType}
                options={TYPE_OPTIONS}
                onSelect={setFilterType}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Dropdown
                value={filterDate}
                options={DATE_OPTIONS}
                onSelect={setFilterDate}
              />
            </View>
          </View>

          {/* ── Stats Card ── */}
          <View style={styles.statsCard}>
            <View style={styles.statsGrid}>
              {stats.map((s, i) => (
                <StatCell
                  key={i}
                  value={s.value}
                  label={s.label}
                  borderRight={s.borderRight}
                  borderBottom={s.borderBottom}
                />
              ))}
            </View>
          </View>

          {/* ── Empty State ── */}
          <EmptyState />
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
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 10,
  },

  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    paddingVertical: 10,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: { fontSize: 18 },

  // Filter row
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD_BG,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dropdownText: { color: "#fff", fontSize: 14, flex: 1 },
  dropdownArrow: { color: "#6A85B8", fontSize: 16, marginLeft: 6 },
  backIcon: {
    width: 20,
    height: 27,
    resizeMode: "contain",
    opacity: 0.7,
    transform: [{ rotate: "-90deg" }],
  },
  // Modal dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "#0F1E55",
    borderRadius: 12,
    minWidth: 180,
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

  // Stats card
  statsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    overflow: "hidden",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // padding: 10,
    // backgroundColor: "red",
  },
  statCell: {
    width: "50%",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    // backgroundColor: "yellow",
    marginVertical: 15,
  },
  statBorderRight: { borderRightWidth: 1, borderRightColor: DIVIDER },
  // statBorderBottom: { borderBottomWidth: 1, borderBottomColor: DIVIDER },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#6A85B8",
    fontSize: 11.5,
    textAlign: "center",
    lineHeight: 16,
  },

  // Empty state
  emptyWrapper: {
    alignItems: "center",
    paddingTop: 20,
    gap: 16,
  },
  illustration: {
    width: 170,
    height: 120,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  hill: {
    position: "absolute",
    backgroundColor: "#1A2A50",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  tablet: {
    alignItems: "center",
    gap: 0,
    zIndex: 2,
    marginBottom: 8,
  },
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
