import { ThemedView } from "@/components/themed-view";
import {
  getMyTransactions,
  txAmountColor,
  txTitle,
  type TransactionRecord,
} from "@/services/api/transaction";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DropdownProps = {
  value: string;
  options: string[];
  onSelect: (option: string) => void;
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

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function Dropdown({ value, options, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.dropdown} onPress={() => setOpen(true)}>
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

function TransactionCard({ item }: { item: TransactionRecord }) {
  const title = txTitle(item.type);
  const color = txAmountColor(item.type);

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
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.rowBox}>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Detail</Text>
            <Text style={styles.rowValue}>{item.detail || title}</Text>
          </View>
        </View>

        <View style={styles.rowBox}>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Time</Text>
            <Text style={styles.rowValue}>{formatTime(item.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.rowBox}>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Balance</Text>
            <Text style={[styles.balanceValue, { color }]}>
              ₹{formatAmount(item.amount)}
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
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
    Roboto_400Regular,
    Roboto_500Medium,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMyTransactions(1, selectedFilter, selectedDate).then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setTransactions(res.data.transactions);
        setHasMore(res.data.page < res.data.pages);
      } else {
        setTransactions([]);
        setHasMore(false);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedFilter, selectedDate]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
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

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#89A4DF"
              style={{ marginTop: 48 }}
            />
          ) : transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions found</Text>
          ) : (
            transactions.map((item, index) => (
              <TransactionCard
                key={`${item._id}-${index}`}
                item={item}
              />
            ))
          )}

          {!loading && !hasMore && transactions.length > 0 && (
            <Text style={styles.footerText}>No more</Text>
          )}
        </ScrollView>
      </ThemedView>
    </>
  );
}

const BG = "#05012B";
const INNER_BG = "#080231";
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
    backgroundColor: "#021341",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#91A8E2",
    fontSize: 16,
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
    color: "#e3efff",
    fontSize: 16,
    fontFamily: "BahnschriftSemibold",
    fontWeight: "bold",
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
    width: "100%",
  },
  rowLabel: {
    color: TEXT_MUTED,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
  },
  rowValue: {
    color: "#AFC4F4",
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
  },
  balanceValue: {
    fontSize: 17,
    lineHeight: 21,
    fontFamily: "BahnschriftSemibold",
    fontWeight: "600",
  },
  cardFooterBox: {
    marginTop: 13,
    height: 78,
    borderRadius: 5,
  },
  footerText: {
    color: "#F4F7FF",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Roboto_400Regular",
    marginTop: 3,
  },
  emptyText: {
    color: TEXT_MUTED,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    marginTop: 64,
  },
});
