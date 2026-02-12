import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Privacy Agreement</ThemedText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>
          Privacy Agreement
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          This is a placeholder for your full Privacy Agreement. Replace this
          text with the actual terms that explain how user data is collected,
          used, stored, and protected on Jalwa.Game.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          By continuing to use this application, you confirm that you have read,
          understood, and agreed to the terms of this Privacy Agreement.
        </ThemedText>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: "#05012B",
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
    marginBottom: 12,
  },
});

