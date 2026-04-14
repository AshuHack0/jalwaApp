import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function PaymentMethodScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Payment method</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Image
            source={require("@/assets/EmptyState.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <ThemedText style={styles.emptyText}>No payment method</ThemedText>
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <Pressable
            style={styles.gradient}
            onPress={() => {
              router.push("/upi-payment");
            }}
          >
            <ThemedText style={styles.addButtonText}>
              Add payment method
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  backButton: {
    padding: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
    marginRight: 40, // Balance the back button
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyImage: {
    width: 250,
    height: 180,
    marginBottom: 30,
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.35)",
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 0, // Button is full width in the screenshot
    paddingBottom: 0,
  },
  addButton: {
    width: "100%",
  },
  gradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#00ECBE"
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#05012B",
  },
});

