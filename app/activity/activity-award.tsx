import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

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
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>

          <View style={styles.recordBtn}>
            <Image source={require("../../assets/icon-watchCollection.svg")} style={{ width: 22, height: 22 }} />
            <Text style={styles.headerText}>Collection record</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 50 }}>
          {/* BANNER */}
          <ImageBackground
            source={{ uri: "https://www.jalwagame.win/assets/png/award_bg-8e278a3d.webp" }}
            style={styles.banner}
          >
            <View style={{ width: "60%" }}>
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

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 40 }}>
                <View style={{ height: "100%", backgroundColor: "#d23838", justifyContent: "center", alignItems: "center", paddingHorizontal: 10, borderBottomRightRadius: 20 }}>
                  <Text style={styles.tagText}>weekly tasks</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10, borderBottomColor: "#022c68", borderBottomWidth: 2, height: "100%", justifyContent: "center", alignItems: "flex-end", marginLeft: 20 }}>
                  <Text style={styles.unfinished}>Unfinished</Text>
                </View>
              </View>

              <View style={{ padding: 10 }}>

                <View style={styles.titleRow}>
                  <Image source={require("../../assets/icon-weeklyType4.svg")} style={{ width: 30, height: 18 }} />
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text style={styles.taskTitle}>
                      Weekly Slots Betting Task
                    </Text>
                    <Text style={styles.red}> 0/{item.target}</Text>
                  </View>
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
                    <Image source={require("../../assets/icon-activityWallet.svg")} style={{ width: 18, height: 18 }} />
                    <Text style={styles.reward}>₹{item.reward}</Text>
                  </View>
                </View>

                <View style={{ height: 1, width: "100%", backgroundColor: "#022c68", marginTop: 10 }} />

                <Pressable style={styles.btn}>
                  <Text style={styles.btnText}>to complete</Text>
                </Pressable>

              </View>

            </View>
          ))}

          {/* DAILY TASKS */}
          {dailyTasks.map((item, index) => (
            <View key={index} style={styles.card}>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 40 }}>
                <View style={{ height: "100%", backgroundColor: "#18B15E", justifyContent: "center", alignItems: "center", paddingHorizontal: 10, borderBottomRightRadius: 20 }}>
                  <Text style={styles.tagText}>Daily missions</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10, borderBottomColor: "#022c68", borderBottomWidth: 2, height: "100%", justifyContent: "center", alignItems: "flex-end", marginLeft: 20 }}>
                  <Text style={styles.unfinished}>Unfinished</Text>
                </View>
              </View>

              <View style={{ padding: 10 }}>

                <View style={styles.titleRow}>
                  <Image source={require("../../assets/icon-weeklyType1.svg")} style={{ width: 30, height: 30 }} />
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text style={styles.taskTitle}>
                      Slot Daily Recharge & Bet Task
                    </Text>
                  </View>
                </View>

                <View>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: "#91A8E2", fontSize: 16, fontWeight: "500" }}>Deposit</Text>
                    <Text style={styles.red}> 0/{item.deposit}</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: "#91A8E2", fontSize: 16, fontWeight: "500" }}>Bet</Text>
                    <Text style={styles.red}> 0/{item.bet}</Text>
                  </View>
                </View>

                <View style={styles.descBox}>
                  <Text style={styles.desc}>
                    Members must place bets on the &quot;SLOTS&quot; game & complete the deposit, also meet both the minimum betting and deposit requirements within a day to complete the task and receive the reward.
                  </Text>
                </View>

                <View style={styles.rewardRow}>
                  <Text style={styles.label}>Award amount</Text>

                  <View style={styles.rewardBox}>
                    <Image source={require("../../assets/icon-activityWallet.svg")} style={{ width: 18, height: 18 }} />
                    <Text style={styles.reward}>₹{item.reward}</Text>
                  </View>
                </View>

                <View style={{ height: 1, width: "100%", backgroundColor: "#022c68", marginTop: 10 }} />

                <Pressable style={styles.btn}>
                  <Text style={styles.btnText}>to complete</Text>
                </Pressable>

              </View>

            </View>
          ))}
        </ScrollView>
      </View>
    </>
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
    fontSize: 12,
    fontWeight: '400'
  },

  banner: {
    marginBottom: 20,
    height: 150,
    padding: 16,
    backgroundColor: "#ff7a00",
  },

  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  bannerSub: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
    fontWeight: "600"
  },

  bannerNote: {
    fontSize: 12,
    color: "#fff",
    lineHeight: 15,
    fontWeight: "600"
  },

  card: {
    backgroundColor: "#021341",
    marginHorizontal: 10,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden"
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  weeklyTag: {
    backgroundColor: "#d23838",
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
    color: "#e3efff",
    fontWeight: "800",
    fontSize: 18
  },

  unfinished: {
    color: "#92a8e3",
    fontWeight: "500",
    fontSize: 18
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
    marginBottom: 8
  },

  taskTitle: {
    color: "#92a8e3",
    fontSize: 12,
    flexShrink: 1,
  },

  red: {
    color: "#d23838",
    fontSize: 18
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
    backgroundColor: "#001C54",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },

  desc: {
    color: "#92a8e3",
    fontSize: 14,
    lineHeight: 18,
  },

  rewardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#92a8e3",
    fontSize: 12,
    fontWeight: "500"
  },

  rewardBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  reward: {
    color: "#dd9138",
    fontWeight: "600",
    fontSize: 18,
  },

  btn: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#00ECBE",
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#00ECBE",
    fontSize: 14,
    fontWeight: "800",
  },
});
