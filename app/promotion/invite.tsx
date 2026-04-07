import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { useToast } from "@/contexts/ToastContext";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const POSTER_IMAGES: ImageSourcePropType[] = [
  require("@/assets/promotionbg.webp"),
  require("@/assets/promotionbg.webp"),
  require("@/assets/promotionbg.webp"),
];

const INVITATION_LINK =
  "https://www.jalwagame.win/register?ref=681759111383";

export default function InviteScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const renderPoster: ListRenderItem<ImageSourcePropType> = ({ item }) => (
    <View style={styles.posterSlide}>
      <Image
        source={item}
        style={styles.posterImage}
        contentFit="contain"
        contentPosition="top"
      />
    </View>
  );

  const handleDownloadQr = () => {
    showToast({
      type: "success",
      title: "Download",
      message: "Connect gallery export when QR assets are ready.",
    });
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(INVITATION_LINK);
    showToast({
      type: "success",
      title: "Copied",
      message: "Invitation link copied.",
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CustomHeader paddingTop={50} title="Invite" onBack={() => router.back()} />

        <Text style={styles.hint}>
          Please swipe left - right to choose your favorite poster
        </Text>

        <FlatList
          data={POSTER_IMAGES}
          keyExtractor={(_, i) => `poster-${i}`}
          renderItem={renderPoster}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            Invite friends{"    "}Income{" "}
            <Text style={styles.statsHighlight}>10 billion</Text> Commission
          </Text>
        </View>

        <View style={styles.footer}>
          <LinearGradient
            colors={["#7AFEC3", "#02AFB6"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.primaryBtnWrap}
          >
            <TouchableOpacity
              style={styles.primaryBtnInner}
              onPress={handleDownloadQr}
              activeOpacity={0.85}
            >
              <ThemedText style={styles.primaryBtnText}>
                Download QR Code
              </ThemedText>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={handleCopyLink}
            activeOpacity={0.85}
          >
            <ThemedText style={styles.outlineBtnText}>
              Copy invitation link
            </ThemedText>
          </TouchableOpacity>
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
  hint: {
    color: "#92A8E3",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    lineHeight: 18, 
 
  },
  posterSlide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  posterImage: {
    width: SCREEN_WIDTH - 32,
    height: 360,
    borderRadius: 12,
    backgroundColor: "#021341",
  },
  statsRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  statsText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  statsHighlight: {
    color: "#EF4444",
    fontWeight: "700",
  },
  footer: {
    paddingHorizontal: 18,
    gap: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  primaryBtnWrap: {
    borderRadius: 28,
    overflow: "hidden",
  },
  primaryBtnInner: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#05012B",
  },
  outlineBtn: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#00ECBE",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00ECBE",
  },
});
