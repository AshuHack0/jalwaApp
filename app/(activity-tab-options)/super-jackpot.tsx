import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Added for navigation
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SuperJackpot = () => {
  const navigation = useNavigation<any>(); // Hook to handle redirection

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. DARK BLUE HEADER */}
      <View style={styles.headerNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerNavTitle}>Super Jackpot</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* 2. ORANGE GRADIENT BANNER SECTION */}
        <LinearGradient
          colors={["#f76a47", "#f9a066"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerContainer}
        >
          <View style={styles.bannerTextSection}>
            <Text style={styles.bannerTitle}>Super Jackpot</Text>

            <Text style={styles.bannerSubText}>
              When you get the Super Jackpot in {"\n"}
              <Text style={{ fontWeight: "bold" }}>【Slots】</Text> Can get 1
              additional bonus
            </Text>

            <Text style={styles.bannerExpiryText}>
              The reward is valid for 1 day, and you will not be able to claim
              it after it expires!
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://i.ibb.co" }}
              style={styles.giftBoxImage}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>

        {/* 3. BATCH BUTTON (Muted Blue) */}
        <TouchableOpacity style={styles.batchBtn} disabled>
          <View style={styles.batchIconCircle}>
            <MaterialCommunityIcons
              name="view-grid"
              size={14}
              color="#5a6a8a"
            />
          </View>
          <Text style={styles.batchBtnText}>Receive in batches</Text>
        </TouchableOpacity>

        {/* 4. NAV CARDS - Updated with Navigation Redirects */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() =>
              navigation.navigate(
                "(super-jackpot-page-options)/super-jackpot-rules",
              )
            } // Redirects to Rules
          >
            <MaterialCommunityIcons
              name="clipboard-text"
              size={22}
              color="#00ffd5"
            />
            <Text style={styles.navCardText}>Rule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() =>
              navigation.navigate("(super-jackpot-page-options)/winning-star")
            } // Redirects to Winning Star
          >
            <MaterialCommunityIcons name="crown" size={22} color="#00ffd5" />
            <Text style={styles.navCardText}>Winning star</Text>
          </TouchableOpacity>
        </View>

        {/* 5. EMPTY STATE CARD */}
        <View style={styles.mainEmptyCard}>
          <View style={styles.illustrationWrapper}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={110}
              color="#1c2b4d"
            />
            <View style={styles.shadowOval} />
          </View>
          <Text style={styles.emptyCardMessage}>
            You don&apos;t have a big jackpot yet, let&apos;s bet
          </Text>
        </View>

        {/* 6. GO BET BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.goBetWrapper}
          onPress={() => navigation.navigate("GameScreen")} // Optional: Add game redirect here
        >
          <LinearGradient
            colors={["#54f0c4", "#2db6ab"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.goBetBtn}
          >
            <Text style={styles.goBetLabel}>Go bet</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03081d",
  },
  headerNav: {
    backgroundColor: "#040b2b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 55,
  },
  headerNavTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  backBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerContainer: {
    height: 200,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  bannerTextSection: {
    flex: 1.2,
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 15,
  },
  bannerSubText: {
    color: "#FFF",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  bannerExpiryText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    lineHeight: 14,
  },
  imageContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  giftBoxImage: {
    width: "100%",
    height: "100%",
  },
  batchBtn: {
    flexDirection: "row",
    backgroundColor: "#161d3a",
    marginHorizontal: 16,
    marginTop: 15,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  batchIconCircle: {
    backgroundColor: "#2a375a",
    borderRadius: 10,
    padding: 4,
    marginRight: 8,
  },
  batchBtnText: {
    color: "#5a6a8a",
    fontSize: 14,
  },
  navRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 15,
    gap: 12,
  },
  navCard: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0d1a3d",
    height: 55,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navCardText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
  },
  mainEmptyCard: {
    backgroundColor: "#071333",
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 15,
    paddingVertical: 60,
    alignItems: "center",
  },
  illustrationWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  shadowOval: {
    width: 80,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    marginTop: -8,
  },
  emptyCardMessage: {
    color: "#7b88a8",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  goBetWrapper: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  goBetBtn: {
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  goBetLabel: {
    color: "#03081d",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SuperJackpot;
