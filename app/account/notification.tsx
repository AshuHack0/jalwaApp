import { ThemedView } from "@/components/themed-view";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomHeader } from "@/components/ui/CustomHeader";

// ── Notification Card ─────────────────────────────────────────────────────────
function NotificationCard({
  id,
  title,
  timestamp,
  message,
  onDelete,
}: {
  id: string;
  title: string;
  timestamp: string;
  message: string;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.card}>
      {/* Top row: icon + title + delete */}
      <View style={styles.cardTop}>
        <View style={styles.mailIconBox}>
          <Image
            source={require("@/assets/Screenshot_2026-03-18_055925-removebg-preview.png")}
            style={styles.mailIcon}
          />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <TouchableOpacity
          onPress={() => onDelete(id)}
          activeOpacity={0.7}
          style={styles.deleteBtn}
        >
          <Image
            source={require("@/assets/trash.png")}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Timestamp */}
      <Text style={styles.cardTimestamp}>{timestamp}</Text>

      {/* Message */}
      <Text style={styles.cardMessage}>{message}</Text>
    </View>
  );
}

// ── Initial Data ──────────────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    timestamp: "2026-03-09 19:47:13",
    message: "Your account is logged in 2026-03-09 19:47:13",
  },
  {
    id: "2",
    timestamp: "2026-03-08 17:32:40",
    message: "Your account is logged in 2026-03-08 17:32:40",
  },
  {
    id: "3",
    timestamp: "2026-03-08 15:04:41",
    message: "Your account is logged in 2026-03-08 15:04:41",
  },
  {
    id: "4",
    timestamp: "2026-03-08 14:28:15",
    message: "Your account is logged in 2026-03-08 14:28:15",
  },
  {
    id: "5",
    timestamp: "2026-03-07 19:45:08",
    message: "Your account is logged in 2026-03-07 19:45:08",
  },
  {
    id: "6",
    timestamp: "2026-03-07 19:45:08",
    message: "Your account is logged in 2026-03-07 19:45:08",
  },
  {
    id: "7",
    timestamp: "2026-03-07 18:54:14",
    message: "Your account is logged in 2026-03-07 18:54:14",
  },
  {
    id: "8",
    timestamp: "2026-03-06 11:20:00",
    message: "Your account is logged in 2026-03-06 11:20:00",
  },
];

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Notification" onBack={() => router.back()} />

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 32 },
            ]}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <NotificationCard
                id={item.id}
                title="LOGIN NOTIFICATION"
                timestamp={item.timestamp}
                message={item.message}
                onDelete={handleDelete}
              />
            )}
          />
        )}
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#1a1d26";
const CARD_BG = "#0A1540";
const TEAL = "#2BC4C4";
const DIVIDER = "#0F1D55";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // List
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  separator: { height: 10 },

  // Card
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 3,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  mailIconBox: {
    width: 26,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  mailIcon: {
    height: 25,
    width: 30,
    resizeMode: "contain",
  },
  cardTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  deleteBtn: {
    padding: 4,
    paddingBottom: 0,
  },
  deleteIcon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  cardTimestamp: {
    color: "#65779e",
    fontSize: 14,
    // marginLeft: 34,
    marginBottom: 15,
  },
  cardDivider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginBottom: 10,
  },
  cardMessage: {
    color: "#94a3b8",
    fontSize: 13.5,
    lineHeight: 20,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: "#4A6FA5", fontSize: 16 },
});
