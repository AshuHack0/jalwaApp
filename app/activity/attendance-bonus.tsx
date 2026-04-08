import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_600SemiBold,
  Inter_600SemiBold_Italic,
  Inter_700Bold_Italic,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { router, Stack } from "expo-router";
import { useMemo } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACT_BANNER = require("@/assets/act.png");

export default function AttendanceBonusScreen() {
  useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  });
  useFonts({
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_700Bold,
  });
  useInter({
    Inter_Regular: Inter_400Regular,
    Inter_SemiBold: Inter_600SemiBold,
    Inter_SemiBold_Italic: Inter_600SemiBold_Italic,
    Inter_Bold_Italic: Inter_700Bold_Italic,
    Inter_Regular_Italic: Inter_400Regular_Italic,
  });

  const insets = useSafeAreaInsets();

  const bannerSize = useMemo(() => {
    const resolved = Image.resolveAssetSource(ACT_BANNER);
    const winW = Dimensions.get("window").width;
    if (!resolved?.width || resolved.width <= 0) {
      return { width: winW, height: 240 };
    }
    return {
      width: winW,
      height: (resolved.height / resolved.width) * winW,
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader
          title="Attendance bonus"
          onBack={() => router.back()}
          paddingTop={1}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 32 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.bannerWrapper}>
              <Image
                source={ACT_BANNER}
                style={[styles.bannerImage, bannerSize]}
                resizeMode="contain"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </>
  );
}

const BG = "#060B2E";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG , paddingTop:40},

  scroll: { flex: 1 },
  scrollContent: { gap: 12 },

  bannerWrapper: {
    width: "100%",
    backgroundColor: "#05012B",
    alignItems: "center",
  },
  bannerImage: {
    zIndex: 2,
  },
});
