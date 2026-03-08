import { Ionicons } from "@expo/vector-icons";
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

/**
 * WinningStar Component
 * High-fidelity replica of the leaderboard/winner list.
 * Features:
 * - Card-based layout with dark navy backgrounds.
 * - Multi-colored typography for specific win metrics (Orange/Red).
 * - Clean, scannable list structure.
 */
const WinningStar = ({ navigation }: any) => {
  // Mock data representing the list in your image
  const winnersData = [
    {
      id: "1",
      phone: "919***068",
      gameName: "Crazy777",
      winRate: "36.67X",
      bonus: "₹135.00",
      time: "2026-03-08 15:12:00",
      avatar: "https://randomuser.me",
    },
    {
      id: "2",
      phone: "919***068",
      gameName: "Crazy777",
      winRate: "16.67X",
      bonus: "₹35.00",
      time: "2026-03-08 15:12:00",
      avatar: "https://randomuser.me",
    },
    {
      id: "3",
      phone: "917***188",
      gameName: "Fortune Gems 2",
      winRate: "18X",
      bonus: "₹35.00",
      time: "2026-03-08 15:12:00",
      avatar: "https://randomuser.me",
    },
    {
      id: "4",
      phone: "919***068",
      gameName: "Crazy777",
      winRate: "13.33X",
      bonus: "₹25.00",
      time: "2026-03-08 15:12:00",
      avatar: "https://randomuser.me",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Winning star</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 2. WINNERS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {winnersData.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* User Info Row */}
            <View style={styles.userRow}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <Text style={styles.phoneText}>{item.phone}</Text>
            </View>

            {/* Data Table Inside Card */}
            <View style={styles.tableBody}>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Game name</Text>
                <Text style={styles.valueWhite}>{item.gameName}</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.label}>Number of wins</Text>
                <Text style={styles.valueOrange}>{item.winRate}</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.label}>Bonus</Text>
                <Text style={styles.valueRed}>{item.bonus}</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.label}>Winning time</Text>
                <Text style={styles.valueMuted}>{item.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03081d", // Main dark background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 60,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  backBtn: {
    padding: 5,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  // Card Styling
  card: {
    backgroundColor: "#071333", // Slightly lighter navy card
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    // Subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1c2b4d",
    marginRight: 12,
  },
  phoneText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Table Styling within Card
  tableBody: {
    backgroundColor: "rgba(3, 8, 29, 0.4)", // Darker inlay for data
    borderRadius: 8,
    overflow: "hidden",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  label: {
    color: "#7b88a8", // Muted blue/grey for labels
    fontSize: 13,
    flex: 1,
  },
  // Value specific colors matching image
  valueWhite: {
    color: "#FFF",
    fontSize: 13,
    flex: 1,
    textAlign: "right",
  },
  valueOrange: {
    color: "#f3d17a", // Golden/Orange for win rate
    fontSize: 13,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  valueRed: {
    color: "#f36c53", // Coral/Red for Bonus
    fontSize: 13,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  valueMuted: {
    color: "#7b88a8",
    fontSize: 12,
    flex: 1.5,
    textAlign: "right",
  },
});

export default WinningStar;
