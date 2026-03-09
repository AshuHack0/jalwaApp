import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * SuperJackpotRules - 100% UI Match
 * - Exact Red/Peach Gradient Banner
 * - Structured Dark Blue Table with Striped Headers
 * - Fixed Bottom Cyan Gradient Button
 */
const SuperJackpotRules = ({ navigation }: any) => {
  // डेटा बिल्कुल इमेज के अनुसार
  const rulesData = [
    { rate: "10X-20X", bet: "₹30-₹999999", bonus: "₹35.00" },
    { rate: "20X-30X", bet: "₹30-₹999999", bonus: "₹55.00" },
    { rate: "30X-40X", bet: "₹30-₹999999", bonus: "₹135.00" },
    { rate: "40X-60X", bet: "₹30-₹999999", bonus: "₹195.00" },
    { rate: "60X-999999X", bet: "₹30-₹999999", bonus: "₹355.00" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. TOP HEADER - Dark Midnight Blue */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backIcon}
        >
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rule</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* 2. MAIN BANNER - Red/Peach Gradient with Waves logic */}
        <LinearGradient colors={["#f36c53", "#fb8b72"]} style={styles.banner}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Super Jackpot</Text>
              <Text style={styles.bannerDesc}>
                When you win the Super Jackpot in the game, you can get
                additional platform bonuses, and the bonuses will be distributed
                to you according to the multiple of the winning prize
              </Text>
            </View>
            <View style={styles.giftBoxIcon}>
              <FontAwesome5
                name="gift"
                size={70}
                color="rgba(255,255,255,0.4)"
              />
            </View>
          </View>

          {/* 3. WARNING OVERLAY - Glassmorphism effect */}
          <View style={styles.warningBox}>
            <Ionicons
              name="warning"
              size={16}
              color="#FFF"
              style={{ marginTop: 2 }}
            />
            <Text style={styles.warningText}>
              Warning: Please claim all bonuses before the event ends, after the
              event ends, you will lose the chance to get the bonus
            </Text>
          </View>
        </LinearGradient>

        {/* 4. BONUS TABLE SECTION */}
        <View style={styles.bonusSection}>
          <View style={styles.sectionHeadingRow}>
            <MaterialCommunityIcons name="database" size={20} color="#00e5ff" />
            <Text style={styles.sectionHeadingText}>Bonus</Text>
          </View>

          {/* TABLE CONTAINER */}
          <View style={styles.tableWrapper}>
            {/* Header Column */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                Winning rate
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>
                Bet amount
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Bonus</Text>
            </View>

            {/* Data Rows */}
            {rulesData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cellText, { flex: 1, color: "#f3d17a" }]}>
                  {item.rate}
                </Text>
                <Text style={[styles.cellText, { flex: 1.5 }]}>{item.bet}</Text>
                <Text
                  style={[
                    styles.cellText,
                    { flex: 1, color: "#f36c53", fontWeight: "bold" },
                  ]}
                >
                  {item.bonus}
                </Text>
              </View>
            ))}
          </View>

          {/* 5. FOOTER DISCLAIMER */}
          <View style={styles.disclaimerRow}>
            <MaterialCommunityIcons name="play" size={18} color="#00e5ff" />
            <Text style={styles.disclaimerText}>
              All event interpretation rights belong to the platform. If you
              have any questions, please contact customer service now
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 6. CONTACT CUSTOMER SERVICE - Bottom Fixed Button */}
      <View style={styles.footerAction}>
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={["#5df5dc", "#3ab6a1"]} // Vivid Cyan/Greenish Gradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.contactBtn}
          >
            <MaterialCommunityIcons
              name="face-agent"
              size={24}
              color="#040b2b"
            />
            <Text style={styles.contactBtnText}>Contact customer service</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03081d", // Deep dark navy
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 55,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  backIcon: { padding: 5 },

  // Banner Styles
  banner: {
    padding: 20,
    minHeight: 220,
  },
  bannerRow: { flexDirection: "row", marginBottom: 20 },
  bannerTextContainer: { flex: 1 },
  bannerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  bannerDesc: {
    color: "#FFF",
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.9,
  },
  giftBoxIcon: { justifyContent: "center", marginLeft: 10 },
  warningBox: {
    backgroundColor: "rgba(255,255,255,0.15)", // Glass effect
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    gap: 10,
  },
  warningText: {
    color: "#FFF",
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },

  // Bonus Section
  bonusSection: { padding: 16 },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  sectionHeadingText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },

  tableWrapper: {
    backgroundColor: "#0d1a3d",
    borderRadius: 10,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1b2d5d", // Specific table header color
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    color: "#00e5ff", // Blue-cyan text for headers
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  cellText: {
    color: "#FFF",
    fontSize: 13,
    textAlign: "center",
  },

  // Footer Disclaimer
  disclaimerRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
    paddingHorizontal: 5,
  },
  disclaimerText: {
    color: "#7b88a8",
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },

  // Fixed Bottom Button
  footerAction: {
    padding: 16,
    backgroundColor: "#03081d",
  },
  contactBtn: {
    height: 54,
    borderRadius: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  contactBtnText: {
    color: "#03081d",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SuperJackpotRules;
