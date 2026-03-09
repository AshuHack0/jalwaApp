import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ActivityAward() {
  const weeklyTasks = [
    { target: "10000", reward: "25.00" },
    { target: "20000", reward: "50.00" },
    { target: "30000", reward: "75.00" },
    { target: "40000", reward: "100.00" },
    { target: "50000", reward: "150.00" },
  ];

  const dailyTasks = [
    { deposit: "3000", bet: "9000", reward: "120.00" },
    { deposit: "5000", bet: "15000", reward: "200.00" },
    { deposit: "7000", bet: "21000", reward: "300.00" },
    { deposit: "9000", bet: "27000", reward: "400.00" },
    { deposit: "12000", bet: "36000", reward: "500.00" },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="#fff" />

        <View style={styles.recordBtn}>
          <Ionicons name="time-outline" size={24} color="#fff" />
          <Text style={styles.headerText}>Collection record</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <ImageBackground
          source={require("@/assets/activity-awards.avif")}
          style={styles.banner}
        >
          <View style={{ width: "70%" }}>
            <Text style={styles.bannerTitle}>Activity Award</Text>

            <Text style={styles.bannerSub}>
              Complete weekly/daily tasks to receive rich rewards
            </Text>

            <Text style={styles.bannerNote}>
              Weekly rewards cannot be accumulated to the next week, and daily
              rewards cannot be accumulated to the next day.
            </Text>
          </View>
        </ImageBackground>

        {/* WEEKLY TASKS */}
        {weeklyTasks.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.weeklyTag}>
                <Text style={styles.tagText}>weekly tasks</Text>
              </View>

              <Text style={styles.unfinished}>Unfinished</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.titleRow}>
              <Ionicons name="game-controller" size={18} color="#00e5ff" />

              <Text style={styles.taskTitle}>
                Weekly Slots Betting Task
                <Text style={styles.red}> 0/{item.target}</Text>
              </Text>
            </View>

            <View style={styles.descBox}>
              <Text style={styles.desc}>
                Member must place bets on &quot;SLOTS&quot; game and reach the
                minimum requirement betting amount in a week to complete this
                task and receive the reward.
              </Text>
            </View>

            <View style={styles.rewardRow}>
              <Text style={styles.label}>Award amount</Text>

              <View style={styles.rewardBox}>
                <Ionicons name="wallet" size={16} color="#FFD54F" />
                <Text style={styles.reward}>₹{item.reward}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>to complete</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* DAILY TASKS */}
        {dailyTasks.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.dailyTag}>
                <Text style={styles.tagText}>Daily mission</Text>
              </View>

              <Text style={styles.unfinished}>Unfinished</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.titleRow}>
              <Ionicons name="briefcase" size={18} color="#ff8c42" />
              <Text style={styles.taskTitle}>
                Slot Daily Recharge & Bet Task
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Deposit</Text>
              <Text style={styles.red}>0/{item.deposit}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Bet</Text>
              <Text style={styles.red}>0/{item.bet}</Text>
            </View>

            <View style={styles.descBox}>
              <Text style={styles.desc}>
                Members must place bets on the &quot;SLOTS&quot; game & complete
                the deposit, also meet both the minimum betting and deposit
                requirements within a day to complete the task and receive the
                reward.
              </Text>
            </View>

            <View style={styles.rewardRow}>
              <Text style={styles.label}>Award amount</Text>

              <View style={styles.rewardBox}>
                <Ionicons name="wallet" size={16} color="#FFD54F" />
                <Text style={styles.reward}>₹{item.reward}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>to complete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerText: {
    color: "#fff",
    marginLeft: 5,
  },

  banner: {
    marginBottom: 20,
    height: 150,
    padding: 16,
    backgroundColor: "#ff7a00",
  },

  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  bannerSub: {
    fontSize: 13,
    color: "#fff",
    marginTop: 4,
  },

  bannerNote: {
    fontSize: 11,
    color: "#fff",
    marginTop: 6,
    lineHeight: 15,
  },

  card: {
    backgroundColor: "#081a45",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 14,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  weeklyTag: {
    backgroundColor: "#e53935",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: -14,
  },

  dailyTag: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: -14,
  },

  tagText: {
    color: "#fff",
    fontWeight: "bold",
  },

  unfinished: {
    color: "#9ba3c7",
  },

  divider: {
    height: 1,
    backgroundColor: "#1c3c7a",
    marginVertical: 10,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  taskTitle: {
    color: "#fff",
    fontSize: 14,
    flexShrink: 1,
  },

  red: {
    color: "#ff4d4d",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  rowLabel: {
    color: "#9ba3c7",
  },

  descBox: {
    backgroundColor: "#0B2C63",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },

  desc: {
    color: "#9fb5ff",
    fontSize: 12,
    lineHeight: 18,
  },

  rewardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#9ba3c7",
  },

  rewardBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  reward: {
    color: "#facc15",
    fontWeight: "bold",
    fontSize: 16,
  },

  btn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: "#00ffd0",
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#00ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
});
