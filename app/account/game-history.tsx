import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilterDropdownProps = {
  value: string;
  options: string[];
  onSelect: (option: string) => void;
};

type GameTab = {
  id: string;
  label: string;
  icon: any;
};

const GAME_TABS: GameTab[] = [
  {
    id: "lottery",
    label: "Lottery",
    icon: require("@/assets/icon_lottery-d44718d5.svg"),
  },
  {
    id: "casino",
    label: "Casino",
    icon: require("@/assets/icon_video-da93a00c.svg"),
  },
  {
    id: "fishing",
    label: "Fishing",
    icon: require("@/assets/icon_fish-80dac6e1.svg"),
  },
  {
    id: "run",
    label: "Run",
    icon: require("@/assets/iconPhysics-0095b0ff.webp"),
  },
];

const GAME_OPTIONS = ["Win Go", "K3", "5D", "TRX Win Go"];
const DATE_OPTIONS = [
  "Choose a date",
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
];

function FilterDropdown({ value, options, onSelect }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(true)}
        style={styles.dropdown}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color="#90A6DB" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.modalCard}>
            {options.map((option, index) => {
              const active = option === value;

              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.85}
                  style={[
                    styles.modalOption,
                    active && styles.modalOptionActive,
                    index === options.length - 1 && styles.modalOptionLast,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      active && styles.modalOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export default function GameHistoryScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("lottery");
  const [selectedGame, setSelectedGame] = useState("Win Go");
  const [selectedDate, setSelectedDate] = useState("Choose a date");

  useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
    Roboto_400Regular,
    Roboto_500Medium,
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={30} color="#E5EEFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Bet history</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabRow}
          >
            {GAME_TABS.map((tab) => {
              const active = tab.id === activeTab;
              const content = (
                <>
                  <View
                    style={[
                      styles.tabIconWrap,
                      active && styles.tabIconWrapActive,
                    ]}
                  >
                    <Image source={tab.icon} style={styles.tabIcon} />
                  </View>
                  <Text
                    style={[styles.tabLabel, active && styles.tabLabelActive]}
                  >
                    {tab.label}
                  </Text>
                </>
              );

              return (
                <TouchableOpacity
                  key={tab.id}
                  activeOpacity={0.88}
                  onPress={() => setActiveTab(tab.id)}
                  style={styles.tabCard}
                >
                  {active ? (
                    <LinearGradient
                      colors={["#78F5C4", "#12BEC7"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.tabCardGradient}
                    >
                      {content}
                    </LinearGradient>
                  ) : (
                    <View style={styles.tabCardInactive}>{content}</View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.filtersRow}>
            <View style={styles.filterCell}>
              <FilterDropdown
                value={selectedGame}
                options={GAME_OPTIONS}
                onSelect={setSelectedGame}
              />
            </View>
            <View style={styles.filterCell}>
              <FilterDropdown
                value={selectedDate}
                options={DATE_OPTIONS}
                onSelect={setSelectedDate}
              />
            </View>
          </View>

          <View style={styles.emptyState}>
            <Image
              source={require("@/assets/EmptyState2.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>No data</Text>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const BG = "#05012B";
const PANEL = "#0A215C";
const INACTIVE_TAB = "#0A1B56";
const TEXT_WHITE = "#F3F7FF";
const TEXT_MUTED = "#8FA3D4";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: BG,
  },
  backButton: {
    width: 36,
    height: 36,
    marginLeft: -4,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: TEXT_WHITE,
    fontSize: 24,
    lineHeight: 29,
    fontFamily: "BahnschriftSemibold",
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  tabRow: {
    paddingLeft: 15,
    paddingRight: 15,
    gap: 8,
  },
  tabCard: {
    width: 107,
    height: 55,
    borderRadius: 7,
    overflow: "hidden",
  },
  tabCardGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabCardInactive: {
    flex: 1,
    backgroundColor: INACTIVE_TAB,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  tabIconWrapActive: {
    backgroundColor: "rgba(8, 2, 49, 0.12)",
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
  tabLabel: {
    color: TEXT_MUTED,
    fontSize: 12.8,
    lineHeight: 18,
    fontFamily: "Roboto_400Regular",
  },
  tabLabelActive: {
    color: "#05153E",
    fontFamily: "Roboto_400Regular",
  },
  filtersRow: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 13,
    marginTop: 16,
  },
  filterCell: {
    flex: 1,
  },
  dropdown: {
    height: 55,
    borderRadius: 7,
    backgroundColor: PANEL,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: TEXT_MUTED,
    fontSize: 15,
    lineHeight: 19,
    fontFamily: "Roboto_500Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 280,
    borderRadius: 12,
    backgroundColor: "#11245C",
    overflow: "hidden",
  },
  modalOption: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#253A76",
  },
  modalOptionActive: {
    backgroundColor: "#1A3471",
  },
  modalOptionLast: {
    borderBottomWidth: 0,
  },
  modalOptionText: {
    textAlign: "center",
    color: "#C5D6FB",
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
  },
  modalOptionTextActive: {
    color: "#FFFFFF",
    fontFamily: "Roboto_500Medium",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 96,
  },
  emptyImage: {
    width: 240,
    height: 165,
  },
  emptyText: {
    marginTop: 25,
    color: "#7F96CC",
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "Roboto_400Regular",
  },
});
