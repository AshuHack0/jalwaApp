import { ThemedText } from "@/components/themed-text";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export function DepositHistoryPreview() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Image source={require("@/assets/icon-historyHead.svg")} style={{ width: 24, height: 24 }} />
        <ThemedText style={styles.sectionTitle}>Deposit history</ThemedText>
      </View>
      <View style={styles.emptyState}>
        <Image
          source={require("../../assets/Wingo/Empty.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <ThemedText style={styles.emptyText}>No data</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#E3EFFF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyImage: {
    width: 160,
    height: 120,
  },
  emptyText: {
    fontSize: 14,
    color: "#92A8E3",
    marginTop: 8,
  },
});
