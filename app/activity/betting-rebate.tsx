import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Image } from "expo-image";


export default function BettingRebate() {
  const router = useRouter();
  // State to handle active tab switching
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: "grid-view" },
    { id: "lottery", name: "Lottery", icon: "reorder" },
    { id: "casino", name: "Casino", icon: "tv" },
    { id: "rummy", name: "Rummy", icon: "style" },
    { id: "slots", name: "Slots", icon: "casino" },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Rebate</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* HORIZONTAL CATEGORIES - Scrollable */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {categories.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={styles.navBox}
                    onPress={() => setActiveTab(item.id)}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={["rgb(122, 254, 195)", " rgb(2, 175, 182)"]}
                        style={styles.activeGradient}
                      >
                        <MaterialIcons
                          name={item.icon as any}
                          size={24}
                          color="#021341"
                        />
                        <Text style={styles.activeText}>{item.name}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.inactiveBox}>
                        <MaterialIcons
                          name={item.icon as any}
                          size={24}
                          color="#9ba3c7"
                        />
                        <Text style={styles.inactiveText}>{item.name}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* MAIN REBATE CARD */}
          <View style={styles.rebateCard}>
            <Text style={styles.cardTitle}>{activeTab}-Total betting rebate</Text>

            <View style={styles.realTimeBadge}>
              <Image source={require("../../assets/icon-rebateRealTime.svg")} style={{ width: 20, height: 20 }} />
              <Text style={styles.badgeText}>Real-time count</Text>
            </View>

            <View style={styles.amountRow}>
              <Image source={require("../../assets/icon-rebate.svg")} style={{ width: 30, height: 30 }} />
              <Text style={styles.mainAmount}>56.00</Text>
            </View>

            <View style={styles.vipNote}>
              <Text style={styles.vipText}>
                Upgrade VIP level to increase rebate rate
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{activeTab == "all" ? "Today rebate" : "Rebate rate"}</Text>
                <Text style={[styles.statValue, { color: activeTab == "all" ? "#DD9137" : "#D23838" }]}>{activeTab == "all" ? "0" : "0.15%"}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total rebate</Text>
                <Text style={[styles.statValue, { color: "#DD9137" }]}>0</Text>
              </View>
            </View>

            <Text style={styles.timeNote}>
              Automatic code washing at 01:00:00 every morning
            </Text>

            <Pressable style={styles.rebateBtn}>
              <Text style={styles.rebateBtnText}>One-Click Rebate</Text>
            </Pressable>
          </View>

          {/* REBATE HISTORY */}
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <View style={styles.historyLine} />
              <Text style={styles.historyTitle}>Rebate history</Text>
            </View>

            {/* <View style={styles.historyCard}>
              <View style={styles.historyCardHeader}>
                <Text style={styles.historyGame}>Lottery</Text>
                <Text style={styles.completedText}>Completed</Text>
              </View>
              <Text style={styles.historyTime}>2026-01-22 01:00:14</Text>

              <View style={styles.historyDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.dotLine}>
                    <View style={styles.dot} />
                  </View>
                  <Text style={styles.detailLabel}>Betting rebate</Text>
                  <Text style={styles.detailValue}>1000</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.dotLine}>
                    <View style={styles.dot} />
                  </View>
                  <Text style={styles.detailLabel}>Rebate rate</Text>
                  <Text style={[styles.detailValue, { color: "#ff4d4d" }]}>
                    0.15%
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.dotLine}>
                    <View style={styles.dot} />
                  </View>
                  <Text style={styles.detailLabel}>Rebate amount</Text>
                  <Text style={[styles.detailValue, { color: "#ffcc00" }]}>
                    1.5
                  </Text>
                </View>
              </View>
            </View> */}

            <Pressable style={styles.allHistoryBtn}>
              <Text style={styles.allHistoryText}>All history</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05012B" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  categoryContainer: {
    marginVertical: 10,
  },
  categoryScrollContent: {
    paddingHorizontal: 12,
    gap: 10, // Items ke beech barabar gap
  },
  navBox: {
    width: 110, // Image style match fixed width
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
  },
  activeGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeText: { color: "#021341", fontSize: 12, marginTop: 4, fontWeight: "bold" },
  inactiveBox: {
    flex: 1,
    backgroundColor: "#021341",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveText: { color: "#9ba3c7", fontSize: 12, marginTop: 4 },

  rebateCard: {
    backgroundColor: "#021341",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 20,
  },
  cardTitle: { color: "#e3efff", fontSize: 18, fontWeight: "bold", textTransform: "capitalize" },
  realTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#00ECBE",
  },
  badgeText: { color: "#00ECBE", fontSize: 14, marginLeft: 4 },
  amountRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  mainAmount: {
    color: "#e3efff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  vipNote: {
    backgroundColor: "#001C54",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  vipText: { color: "#92a8e3", fontSize: 14 },
  statsRow: { flexDirection: "row", marginTop: 15, gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: "#001C54",
    padding: 10,
    borderRadius: 5,
  },
  statLabel: { color: "#92a8e3", fontSize: 14 },
  statValue: { color: "#fff", fontSize: 21, fontWeight: "bold", marginTop: 4 },
  timeNote: {
    color: "#92a8e3",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 15,
  },
  rebateBtn: {
    backgroundColor: "#3D4863", // Image match grey/blue
    padding: 14,
    borderRadius: 30,
    marginTop: 15,
    alignItems: "center",
  },
  rebateBtnText: { color: "#e3efff", fontSize: 16, fontWeight: "bold" },

  historySection: { paddingHorizontal: 12, marginTop: 10 },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  historyLine: {
    width: 4,
    height: 18,
    backgroundColor: "#00ECBE",
    borderRadius: 2,
    marginRight: 10,
  },
  historyTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  historyCard: {
    backgroundColor: "#0a1a45",
    padding: 16,
    borderRadius: 12,
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyGame: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  completedText: { color: "#22c55e", fontWeight: "bold" },
  historyTime: { color: "#9ba3c7", fontSize: 12, marginTop: 4 },
  historyDetails: { marginTop: 15 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dotLine: { width: 20, alignItems: "center" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0a1a45",
    borderWidth: 2,
    borderColor: "#00e5ff",
  },
  detailLabel: { flex: 1, color: "#9ba3c7", fontSize: 14, marginLeft: 10 },
  detailValue: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  allHistoryBtn: {
    borderWidth: 1,
    borderColor: "#00ECBE",
    padding: 12,
    borderRadius: 30,
    marginTop: 2,
    alignItems: "center",
    marginBottom: 20,
  },
  allHistoryText: { color: "#00ECBE", fontWeight: "bold" },
});
