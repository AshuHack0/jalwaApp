import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
const BG = "#060B2E";

export default function InvitationRecordScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView
        style={[styles.container, { paddingBottom: insets.bottom }]}
        darkColor={BG}
      >
        <CustomHeader title="Invitation record" onBack={() => router.back()} />

        <View style={styles.emptyWrap}>
          <View style={styles.illus}>
            <Image source={require("@/assets/jj.png")} style={{ width: 150, height: 150 }} />₹
          </View>
          <Text style={styles.noData}>No data</Text>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  emptyWrap: {
    flex: 1,
 
    alignItems: "center",
    paddingHorizontal: 32,
  },
  illus: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  plane: {
    position: "absolute",
    right: -8,
    top: 8,
  },
  noData: {
    color: "#8a9bc4",
    fontSize: 16,
    opacity: 0.85,
  },
});
