import { Roboto_700Bold, useFonts } from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOP_BG_URI =
  "https://www.jalwagame.win/assets/png/bg-9bfd9862.png";

export default function HomeBannerOneScreen() {
  useFonts({ Roboto_700Bold });
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <View
          style={[styles.header, { paddingTop: insets.top + 4 }]}
        >
          <Pressable onPress={() => router.back()} style={styles.headerBack}>
            <Ionicons name="chevron-back" size={26} color="#F3F8FF" />
          </Pressable>
          <Text style={styles.headerTitle}>Wheel Spin</Text>
          <View style={styles.headerBack} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Image
              source={{ uri: TOP_BG_URI }}
              style={styles.heroImage}
              contentFit="cover"
            />
          </View>

          <Image
            source={require("@/assets/wheel-spin-panel.png")}
            style={styles.wheelPanelImage}
            contentFit="contain"
          />

          <Image
            source={require("@/assets/wheel-spin-history-section.png")}
            style={styles.historySectionImage}
            contentFit="contain"
          />

          
        </ScrollView>
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
  hero: {
    width: "100%",
    height: 220,
    overflow: "hidden",
    backgroundColor: "#05012B",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  wheelPanelImage: {
    width: "100%",
    aspectRatio: 648 / 942,
    backgroundColor: "#05012B",
  },
  historySectionImage: {
    width: "100%",
    aspectRatio: 653 / 631, 
    marginTop: 20,
    backgroundColor: "#05012B",
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
});
