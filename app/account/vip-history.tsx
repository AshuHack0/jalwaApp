import { Roboto_700Bold, useFonts } from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VipHistoryScreen() {
  useFonts({ Roboto_700Bold });
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
          <Pressable onPress={() => router.back()} style={styles.headerBack}>
            <Ionicons name="chevron-back" size={26} color="#F3F8FF" />
          </Pressable>
          <Text style={styles.headerTitle}>History</Text>
          <View style={styles.headerBack} />
        </View>

        <View
          style={[styles.body, { paddingBottom: insets.bottom + 24 }]}
        >
          <Image
            source={require("@/assets/no_data.png")}
            style={styles.emptyImage}
            contentFit="contain"
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  header: {
    backgroundColor: "#05012B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  headerBack: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 19,
    lineHeight: 24,
    fontFamily: "Roboto_700Bold",
  },
  body: {
    flex: 1,
  
  
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: "100%",
    height: 240,
    maxWidth: 320,
  },
});
