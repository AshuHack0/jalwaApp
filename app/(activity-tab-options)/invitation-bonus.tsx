import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const bonusData = [
  { id: 1, amount: "38.00", invitees: 1, recharge: "300.00" },
  { id: 2, amount: "158.00", invitees: 3, recharge: "300.00" },
  { id: 3, amount: "580.00", invitees: 10, recharge: "300.00" },
];

export default function InvitationBanner() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      {/* --- ADDED HEADER COMPONENT --- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Back functionality
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invitation bonus</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center the title */}
      </View>
      {/* ------------------------------ */}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <ImageBackground
          source={require("@/assets/activity-awards.avif")}
          style={styles.banner}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Invite friends and deposit</Text>
            <Text style={styles.bannerSub}>
              Both parties can receive rewards
            </Text>
            <Text style={styles.bannerSub}>
              Invite friends to register and recharge to receive rewards
            </Text>
            <Text style={styles.dateLabel}>activity date</Text>
            <Text style={styles.dateRange}>2025-03-18 - 2041-12-29</Text>
          </View>
        </ImageBackground>

        <View style={styles.navContainer}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/invitation-reward-rules")}
          >
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={styles.iconWrapper}
            >
              <Ionicons name="copy-outline" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.navText}>Invitation reward rules</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/invitation-record")}
          >
            <LinearGradient
              colors={["#43e97b", "#38f9d7"]}
              style={styles.iconWrapper}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={32}
                color="#fff"
              />
            </LinearGradient>
            <Text style={styles.navText}>Invitation record</Text>
          </TouchableOpacity>
        </View>

        {bonusData.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.greenTag}>
                <View style={styles.whiteCircle}>
                  <Text style={styles.tagId}>{item.id}</Text>
                </View>
                <Text style={styles.bonusText}>Bonus</Text>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </View>
              <Text style={styles.rewardAmount}>₹{item.amount}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Number of invitees</Text>
              <Text style={styles.infoValue}>{item.invitees}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Recharge per people</Text>
              <Text style={styles.infoValue}>₹{item.recharge}</Text>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text style={styles.progressNum}>0 / {item.invitees}</Text>
                <Text style={styles.progressLabel}>Number of invitees</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.progressItem}>
                <Text style={styles.progressNum}>0 / {item.invitees}</Text>
                <Text style={styles.progressLabel}>Deposit number</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.unfinishedBtn} disabled>
              <Text style={styles.btnText}>Unfinished</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  // --- HEADER STYLES ---
  header: {
    height: 100, // Adjusted for status bar padding
    backgroundColor: "#05012B",
    flexDirection: "row",
    alignItems: "flex-end", // Title aur icon ko bottom-align kiya
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    padding: 5,
  },
  // ---------------------
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 60 },
  banner: { height: 220, paddingHorizontal: 16, flexDirection: "row" },
  bannerLeft: { flex: 1, justifyContent: "center" },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bannerSub: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
    lineHeight: 16,
    width: "70%",
  },
  dateLabel: { color: "#fff", fontSize: 12, marginTop: 8, opacity: 0.8 },
  dateRange: { color: "#fff", fontSize: 15, fontWeight: "bold", marginTop: 2 },
  navContainer: {
    flexDirection: "row",
    backgroundColor: "#0a1a45",
    marginTop: -35,
    marginHorizontal: 16,
    paddingVertical: 20,
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
    color: "#9BA3C7",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#0a1b4d",
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
  },
  greenTag: {
    backgroundColor: "#2e7d32",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomRightRadius: 25,
  },
  whiteCircle: {
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  tagId: { color: "#2e7d32", fontSize: 12, fontWeight: "bold" },
  bonusText: { color: "#fff", marginLeft: 8, fontWeight: "bold" },
  rewardAmount: { color: "#fbc02d", fontWeight: "bold", fontSize: 16 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0d2566",
    marginHorizontal: 12,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  infoLabel: { color: "#9ba3c7", fontSize: 13 },
  infoValue: { color: "#fff", fontWeight: "bold" },
  cardDivider: {
    height: 1,
    backgroundColor: "#1c3c7a",
    marginVertical: 15,
    marginHorizontal: 15,
    borderStyle: "dashed",
    borderWidth: 1,
  },
  progressRow: { flexDirection: "row", paddingBottom: 15 },
  progressItem: { flex: 1, alignItems: "center" },
  progressNum: { color: "#ff4d4d", fontSize: 18, fontWeight: "bold" },
  progressLabel: { color: "#9ba3c7", fontSize: 11, marginTop: 4 },
  verticalDivider: { width: 1, backgroundColor: "#1c3c7a" },
  unfinishedBtn: {
    backgroundColor: "#3f4a7a",
    margin: 12,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  btnText: { color: "#9ba3c7", fontSize: 16, fontWeight: "bold" },
});
