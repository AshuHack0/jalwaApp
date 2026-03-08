import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function InvitationRecord() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Invitation record</Text>

        {/* Placeholder for symmetry */}
        <View style={{ width: 40 }} />
      </View>

      {/* EMPTY STATE CONTENT */}
      <View style={styles.content}>
        <Text style={styles.noMoreText}>No more</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B", // Dark blue background matching the image
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    // Agar notch area cover karna hai toh paddingTop adjust karein
    paddingTop: 20,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMoreText: {
    color: "#9ba3c7", // Muted grey/blue color from image
    fontSize: 16,
    opacity: 0.6,
  },
});
