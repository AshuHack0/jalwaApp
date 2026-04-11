import { ThemedView } from "@/components/themed-view";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View,  } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DropdownProps = {
  value: string;
  options: string[];
  onSelect: (option: string) => void;
};

type TransactionItem = {
  title: string;
  detail: string;
  time: string;
  balance: string;
  amountColor: string;
};

const FILTER_OPTIONS = [
  "All",
  "Deposit",
  "Withdraw",
  "Game moved in",
  "Game moved out",
];

const DATE_OPTIONS = [
  "Choose a date",
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
];

const transactions: TransactionItem[] = [
  {
    title: "Game moved out",
    detail: "Game moved out",
    time: "2026-04-01 04:16:14",
    balance: "195,208.23",
    amountColor: "#17B15E",
  },
  {
    title: "Game moved in",
    detail: "Game moved in",
    time: "2026-03-31 20:30:02",
    balance: "194,970.00",
    amountColor: "#D23838",
  },
  {
    title: "Deposit",
    detail: "Deposit",
    time: "2026-03-30 20:23:41",
    balance: "970.00",
    amountColor: "#17B15E",
  },
  {
    title: "Deposit",
    detail: "Deposit",
    time: "2026-03-30 03:02:27",
    balance: "97,000.00",
    amountColor: "#17B15E",
  },
  {
    title: "Deposit",
    detail: "Deposit",
    time: "2026-03-31 00:03:23",
    balance: "97,000.00",
    amountColor: "#17B15E",
  },
  {
    title: "Game moved in",
    detail: "Game moved in",
    time: "2026-03-30 18:15:55",
    balance: "238.23",
    amountColor: "#D23838",
  },
];

function Dropdown({ value, options, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        style={styles.dropdown}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color="#89A4DF" />
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.dropdownMenu}>
            {options.map((option, index) => {
              const isSelected = option === value;

              return (
                <Pressable
                  key={option}
                  style={[
                    styles.dropdownOption,
                    isSelected && styles.dropdownOptionActive,
                    index === options.length - 1 && styles.dropdownOptionLast,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      isSelected && styles.dropdownOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function TransactionCard({ item }: { item: TransactionItem }) {
  return (
    <View
      style={{
        backgroundColor: "#011341",
        marginBottom: 17,
        borderRadius: 7,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: "#001C54",
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.rowBox}>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Detail</Text>
            <Text style={styles.rowValue}>{item.detail}</Text>
          </View>
        </View>

        <View style={styles.rowBox}>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Time</Text>
            <Text style={styles.rowValue}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.rowBox}>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Balance</Text>
            <Text style={[styles.balanceValue, { color: item.amountColor }]}>
              {item.balance}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooterBox} />
      </View>
    </View>
  );
}

export default function TransactionHistoryScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState("All");
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
        <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={29} color="#DCE7FF" />
          </Pressable>

          <Text style={styles.headerTitle}>Transaction history</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 18 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filterRow}>
            <View style={styles.filterCell}>
              <Dropdown
                value={selectedFilter}
                options={FILTER_OPTIONS}
                onSelect={setSelectedFilter}
              />
            </View>

            <View style={styles.filterCell}>
              <Dropdown
                value={selectedDate}
                options={DATE_OPTIONS}
                onSelect={setSelectedDate}
              />
            </View>
          </View>

          {transactions.map((item, index) => (
            <TransactionCard
              key={`${item.title}-${item.time}-${index}`}
              item={item}
            />
          ))}

          <Text style={styles.footerText}>No more</Text>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const BG = "#05012B";
const CARD_BG = "#0B2B69";
const INNER_BG = "#080231";
const INNER_EMPTY = "#0B245C";
const MODAL_BG = "#11245B";
const TEXT_MUTED = "#9AB4E9";
const TEXT_WHITE = "#F3F7FF";

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
    paddingBottom: 10,
    backgroundColor: BG,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -4,
  },
  headerTitle: {
    color: TEXT_WHITE,
    fontSize: 23,
    lineHeight: 28,
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
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  filterRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 18,
  },
  filterCell: {
    flex: 1,
  },
  dropdown: {
    height: 52,
    borderRadius: 7,
    backgroundColor: "#0A215C",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: TEXT_MUTED,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "Roboto_500Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dropdownMenu: {
    width: "100%",
    maxWidth: 280,
    borderRadius: 12,
    backgroundColor: MODAL_BG,
    overflow: "hidden",
  },
  dropdownOption: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#253873",
  },
  dropdownOptionActive: {
    backgroundColor: "#193571",
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    color: "#C8D8FA",
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
  },
  dropdownOptionTextActive: {
    color: "#FFFFFF",
    fontFamily: "Roboto_500Medium",
  },
  card: {
    backgroundColor: "#011341",
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  cardTitle: {
    color: "#F7FBFF",
    fontSize: 19,
    lineHeight: 22,
    fontFamily: "BahnschriftSemibold",
    fontStyle: "italic",
  },
  rowBox: {
    backgroundColor: INNER_BG,
    borderRadius: 4,
    marginBottom: 9,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 13,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    color: TEXT_MUTED,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "Roboto_500Medium",
  },
  rowValue: {
    color: "#AFC4F4",
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "Roboto_500Medium",
  },
  balanceValue: {
    fontSize: 17,
    lineHeight: 21,
    fontFamily: "BahnschriftSemibold",
  },
  cardFooterBox: {
    marginTop: 13,
    height: 78,
    borderRadius: 5,
    // backgroundColor: INNER_EMPTY,
    borderWidth: 0.4,
    borderColor: "#173D86",
  },
  footerText: {
    color: "#F4F7FF",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Roboto_400Regular",
    marginTop: 3,
  },
});
