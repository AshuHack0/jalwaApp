import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const bonusData = [
  { id: 1, amount: "38.00", invitees: 1, recharge: "300.00" },
  { id: 2, amount: "158.00", invitees: 3, recharge: "300.00" },
  { id: 3, amount: "580.00", invitees: 10, recharge: "300.00" },
];

export default function InvitationBanner() {
  const router = useRouter(); // 2. Router instance

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.outerContainer}>


        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>

          <View style={styles.recordBtn}>
            <Text style={styles.headerText}>Invitation bonus</Text>
          </View>
        </View>


        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          <LinearGradient
            colors={["#f99937", "#ff6922", "#ff8039"]}
            locations={[0.0272, 0.4354, 0.9854]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.banner}
          >
            <Image source={{ uri: "https://www.jalwagame.win/assets/png/invitation_bg-611f71ab.webp" }} style={{ width: "100%", height: "100%", position: "absolute" }} />
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>Invite friends and deposit</Text>
              <Text style={styles.bannerSub}>
                Both parties can receive rewards
              </Text>
              <Text style={[styles.bannerSub, { marginTop: 10 }]}>
                Invite friends to register and recharge to receive rewards
              </Text>
              <Text style={styles.dateLabel}>activity date</Text>
              <Text style={styles.dateRange}>2025-03-18 - 2041-12-29</Text>
            </View>
          </LinearGradient>

          <View style={styles.navContainer}>
            {/* 3. Invitation Reward Rules Redirect */}
            <Pressable
              style={styles.navItem}
              onPress={() => router.push("/invitation-reward-rules")}
            >
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                style={styles.iconWrapper}
              >
                <Image source={{ uri: "https://www.jalwagame.win/assets/svg/inviterule-7c5f5524.svg" }} style={{ width: "100%", height: "100%" }} />
              </LinearGradient>
              <Text style={styles.navText}>Invitation reward rules</Text>
            </Pressable>

            {/* 4. Invitation Record Redirect */}
            <Pressable
              style={styles.navItem}
              onPress={() => router.push("/invitation-record")}
            >
              <LinearGradient
                colors={["#43e97b", "#38f9d7"]}
                style={styles.iconWrapper}
              >
                <Image source={{ uri: "https://www.jalwagame.win/assets/svg/icon-83990d9a.svg" }} style={{ width: "100%", height: "100%" }} />
              </LinearGradient>
              <Text style={styles.navText}>Invitation record j</Text>
            </Pressable>
          </View>

          {bonusData.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.greenTag}>
                  <Text style={styles.bonusText}>Bonus</Text>
                  <View style={styles.whiteCircle}>
                    <Text style={styles.tagId}>{item.id}</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white", borderRadius: 100, width: 28, height: 28, marginLeft: 30 }}>
                    <Feather name="x" size={24} color="#BABFDF" style={{ fontWeight: "bold" }} />
                  </View>
                </View>
                <View style={{ flex: 1, height: "100%", width: "100%", alignItems: "flex-end", paddingVertical: 16, borderBottomColor: "#022c68", borderBottomWidth: 1, paddingRight: 15, marginLeft: 10 }}>
                  <Text style={styles.rewardAmount}>₹{item.amount}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Number of invitees</Text>
                <View style={{ width: "40%", alignItems: "center", justifyContent: "center" }}>
                  <Text style={styles.infoValue}>{item.invitees}</Text>
                </View>
              </View>
              <View style={[styles.infoRow, { marginTop: 6 }]}>
                <Text style={styles.infoLabel}>Recharge per people</Text>
                <View style={{ width: "40%", alignItems: "center", justifyContent: "center" }}>
                  <Text style={[styles.infoValue, { color: "#D23838" }]}>₹{item.recharge}</Text>
                </View>
              </View>

              <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 }}>
                <View style={{ width: 30, aspectRatio: 1, backgroundColor: "#05012B", borderRadius: "100%", marginLeft: -15 }} />
                <View style={[styles.cardDivider, { flex: 1 }]} />
                <View style={{ width: 30, aspectRatio: 1, backgroundColor: "#05012B", borderRadius: "100%", marginRight: -15 }} />
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text style={[styles.progressNum, { color: "#DD9137" }]}>0 / {item.invitees}</Text>
                  <Text style={styles.progressLabel}>Number of invitees</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.progressItem}>
                  <Text style={[styles.progressNum, { color: "#d23838" }]}>0 / {item.invitees}</Text>
                  <Text style={styles.progressLabel}>Deposit number</Text>
                </View>
              </View>

              <Pressable style={styles.unfinishedBtn} disabled>
                <Text style={styles.btnText}>Unfinished</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

// Styles remains the same as your previous code
const styles = StyleSheet.create({
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
    marginRight: "26%",
  },

  headerText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 22,
    fontWeight: '500'
  },
  outerContainer: {
    flex: 1,
    backgroundColor: "#05012B",
    height: SCREEN_HEIGHT,
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 60 },
  banner: { height: 220, flexDirection: "row", position: "relative" },
  bannerLeft: { flex: 1, paddingHorizontal: 16 },
  bannerTitle: {
    marginTop: 10,
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bannerSub: {
    color: "#fff",
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.9,
    lineHeight: 15,
    width: "70%",
  },
  dateLabel: { color: "#fff", fontSize: 15, fontWeight: "600", marginTop: 8 },
  dateRange: { color: "#fff", fontSize: 21, fontWeight: "bold", marginTop: 2 },
  navContainer: {
    flexDirection: "row",
    backgroundColor: "#001c54",
    marginTop: -35,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 15,
    elevation: 5,
  },
  navItem: { alignItems: "center", flex: 1 },
  iconWrapper: {
    borderRadius: 15,
    marginBottom: 8,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    color: "#92a8e3",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#021341",
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greenTag: {
    backgroundColor: "#17b153",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomRightRadius: 20
  },
  whiteCircle: {
    backgroundColor: "#e3efff",
    height: 22,
    width: 22,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  tagId: { color: "#6fa084", fontSize: 11, fontWeight: "500" },
  bonusText: { color: "#e3efff", marginLeft: 8, fontWeight: "500", fontSize: 12 },
  rewardAmount: { color: "#dd9138", fontWeight: "bold", fontSize: 16 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#001C54",
    marginHorizontal: 12,
    marginTop: 16,
    padding: 10,
    borderRadius: 5,
  },
  infoLabel: { color: "#e3efff", fontSize: 15 },
  infoValue: { color: "#e3efff", fontWeight: "bold", fontSize: 16 },
  cardDivider: {
    height: 1,
    marginVertical: 15,
    marginHorizontal: 15,
    borderStyle: "dashed",
    borderTopColor: "#022C68",
    borderTopWidth: 1,
  },
  progressRow: { flexDirection: "row", paddingBottom: 15 },
  progressItem: { flex: 1, alignItems: "center" },
  progressNum: { color: "#ff4d4d", fontSize: 19, fontWeight: "bold" },
  progressLabel: { color: "#92a8e3", fontSize: 11, marginTop: 4 },
  verticalDivider: { width: 1, backgroundColor: "#1c3c7a" },
  unfinishedBtn: {
    backgroundColor: "#3D4863",
    margin: 12,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20
  },
  btnText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
