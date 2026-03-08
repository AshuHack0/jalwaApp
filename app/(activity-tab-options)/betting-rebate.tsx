import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BettingRebate() {
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
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
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
                <TouchableOpacity
                  key={item.id}
                  style={styles.navBox}
                  onPress={() => setActiveTab(item.id)}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={["#4facfe", "#00f2fe"]}
                      style={styles.activeGradient}
                    >
                      <MaterialIcons
                        name={item.icon as any}
                        size={24}
                        color="#fff"
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
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* MAIN REBATE CARD */}
        <View style={styles.rebateCard}>
          <Text style={styles.cardTitle}>All-Total betting rebate</Text>

          <View style={styles.realTimeBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#00e5ff" />
            <Text style={styles.badgeText}>Real-time count</Text>
          </View>

          <View style={styles.amountRow}>
            <MaterialIcons
              name="account-balance-wallet"
              size={22}
              color="#00e5ff"
            />
            <Text style={styles.mainAmount}>56.00</Text>
          </View>

          <View style={styles.vipNote}>
            <Text style={styles.vipText}>
              Upgrade VIP level to increase rebate rate
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Today rebate</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total rebate</Text>
              <Text style={[styles.statValue, { color: "#ffcc00" }]}>1.5</Text>
            </View>
          </View>

          <Text style={styles.timeNote}>
            Automatic code washing at 01:00:00 every morning
          </Text>

          <TouchableOpacity style={styles.rebateBtn}>
            <Text style={styles.rebateBtnText}>One-Click Rebate</Text>
          </TouchableOpacity>
        </View>

        {/* REBATE HISTORY */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <View style={styles.historyLine} />
            <Text style={styles.historyTitle}>Rebate history</Text>
          </View>

          <View style={styles.historyCard}>
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
          </View>

          <TouchableOpacity style={styles.allHistoryBtn}>
            <Text style={styles.allHistoryText}>All history</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05012B" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: 10,
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
    width: 100, // Image style match fixed width
    height: 75,
    borderRadius: 12,
    overflow: "hidden",
  },
  activeGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeText: { color: "#fff", fontSize: 12, marginTop: 4, fontWeight: "bold" },
  inactiveBox: {
    flex: 1,
    backgroundColor: "#0a1a45",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveText: { color: "#9ba3c7", fontSize: 12, marginTop: 4 },

  rebateCard: {
    backgroundColor: "#0a1a45",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 20,
  },
  cardTitle: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  realTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d2c66",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#00e5ff",
  },
  badgeText: { color: "#00e5ff", fontSize: 12, marginLeft: 4 },
  amountRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  mainAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  vipNote: {
    backgroundColor: "#0d2c66",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  vipText: { color: "#9ba3c7", fontSize: 12 },
  statsRow: { flexDirection: "row", marginTop: 15, gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: "#0d2c66",
    padding: 10,
    borderRadius: 5,
  },
  statLabel: { color: "#9ba3c7", fontSize: 12 },
  statValue: { color: "#fff", fontSize: 16, fontWeight: "bold", marginTop: 4 },
  timeNote: {
    color: "#9ba3c7",
    fontSize: 11,
    marginTop: 15,
    textAlign: "center",
  },
  rebateBtn: {
    backgroundColor: "#313c5e", // Image match grey/blue
    padding: 14,
    borderRadius: 30,
    marginTop: 15,
    alignItems: "center",
  },
  rebateBtnText: { color: "#9ba3c7", fontSize: 16, fontWeight: "bold" },

  historySection: { paddingHorizontal: 12, marginTop: 10 },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  historyLine: {
    width: 4,
    height: 18,
    backgroundColor: "#00e5ff",
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
    borderColor: "#00e5ff",
    padding: 12,
    borderRadius: 30,
    marginTop: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  allHistoryText: { color: "#00e5ff", fontWeight: "bold" },
});
