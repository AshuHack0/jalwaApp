import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const rewardData = [
  { invite: "1People", deposit: "300.00", bonus: "38.00" },
  { invite: "3People", deposit: "300.00", bonus: "158.00" },
  { invite: "10People", deposit: "500.00", bonus: "580.00" },
  { invite: "30People", deposit: "800.00", bonus: "1,800.00" },
  { invite: "50People", deposit: "1,200.00", bonus: "2,800.00" },
  { invite: "75People", deposit: "1,200.00", bonus: "4,500.00" },
  { invite: "100People", deposit: "1,200.00", bonus: "5,800.00" },
  { invite: "200People", deposit: "1,200.00", bonus: "11,800.00" },
  { invite: "500People", deposit: "1,200.00", bonus: "29,000.00" },
  { invite: "1000People", deposit: "1,200.00", bonus: "58,000.00" },
  { invite: "2000People", deposit: "1,200.00", bonus: "118,000.00" },
  { invite: "5000People", deposit: "1,200.00", bonus: "300,000.00" },
];

const rulesContent = [
  "Only when the number of invited accounts is reached and each account can meet the recharge amount can you receive the bonus.",
  "The invitation account meets the requirements, but the recharge amount of the account does not meet the requirements, and the bonus cannot be claimed.",
  "Please claim the event bonus within the event period. All bonuses will be cleared after the event expires.",
  "Please complete the task within the event period. After the event expires, the invitation record will be cleared.",
];

export default function InvitationRewardRules() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invitation reward rules</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TOP DESCRIPTION */}
        <View style={styles.descSection}>
          <Text style={styles.description}>
            Invite friends and recharge to get additional platform rewards!
          </Text>
          <Text style={styles.subDescription}>
            After being claimed, the rewards will be directly distributed to the
            wallet balance within 10 minutes.
          </Text>
        </View>

        {/* TABLE SECTION */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { textAlign: "left" }]}>
              Invite account
            </Text>
            <Text style={styles.headerCell}>Deposit amount</Text>
            <Text style={[styles.headerCell, { textAlign: "right" }]}>
              Bonus
            </Text>
          </View>

          {rewardData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? "#0a1b4d" : "#08163d" },
              ]}
            >
              <Text style={[styles.cell, { textAlign: "left" }]}>
                {item.invite}
              </Text>
              <Text style={styles.cell}>₹{item.deposit}</Text>
              <Text
                style={[styles.cell, { textAlign: "right", color: "#82b1ff" }]}
              >
                ₹{item.bonus}
              </Text>
            </View>
          ))}
        </View>

        {/* RULES SECTION (NEW) */}
        <View style={styles.rulesContainer}>
          <View style={styles.rulesHeaderWrapper}>
            <View style={styles.rulesHeader}>
              <Text style={styles.rulesHeaderText}>Rules</Text>
            </View>
          </View>

          <View style={styles.rulesBody}>
            {rulesContent.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <View style={styles.diamondBullet} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  descSection: {
    marginBottom: 20,
  },
  description: {
    color: "#9ba3c7",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  subDescription: {
    color: "#9ba3c7",
    fontSize: 13,
    lineHeight: 18,
  },
  table: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2A52BE",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  headerCell: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1c3c7a",
  },
  cell: {
    flex: 1,
    color: "#9ba3c7",
    fontSize: 13,
    textAlign: "center",
  },
  // RULES STYLES
  rulesContainer: {
    backgroundColor: "#0a1b4d",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1c3c7a",
    overflow: "hidden",
  },
  rulesHeaderWrapper: {
    alignItems: "center",
  },
  rulesHeader: {
    backgroundColor: "#2A52BE",
    paddingHorizontal: 50,
    paddingVertical: 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  rulesHeaderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rulesBody: {
    padding: 16,
    paddingTop: 20,
  },
  ruleRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  diamondBullet: {
    width: 6,
    height: 6,
    backgroundColor: "#00e5ff",
    transform: [{ rotate: "45deg" }],
    marginTop: 6,
    marginRight: 10,
  },
  ruleText: {
    flex: 1,
    color: "#9ba3c7",
    fontSize: 13,
    lineHeight: 18,
  },
});
