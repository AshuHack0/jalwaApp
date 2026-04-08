import { ThemedText } from "@/components/themed-text";
import { getPromotionalBannerById } from "@/constants/promotionalBanners";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  Dimensions,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ActivityDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();

  const banner = useMemo(() => {
    const n = Number(idParam);
    if (!Number.isFinite(n)) return undefined;
    return getPromotionalBannerById(n);
  }, [idParam]);

  const detailImageLayout = useMemo(() => {
    if (!banner) {
      return { width: Dimensions.get("window").width, height: 320 };
    }
    const resolved = RNImage.resolveAssetSource(banner.detailImage);
    const winW = Dimensions.get("window").width;
    if (!resolved?.width || resolved.width <= 0) {
      return { width: winW, height: 320 };
    }
    return {
      width: winW,
      height: (resolved.height / resolved.width) * winW,
    };
  }, [banner]);

  useEffect(() => {
    if (idParam === undefined || idParam === "") {
      router.back();
      return;
    }
    const n = Number(idParam);
    if (!Number.isFinite(n) || !getPromotionalBannerById(n)) {
      router.back();
    }
  }, [idParam, router]);

  if (!banner) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Activity details</ThemedText>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={styles.bannerBlock}>
            <Image
              source={banner.bannerImage}
              style={styles.bannerImage}
              contentFit="contain"
              contentPosition="top"
            />
            <ThemedText style={styles.titleBelow}>{banner.title}</ThemedText>
            <Image
              source={banner.detailImage}
              style={[styles.detailImage, detailImageLayout]}
              contentFit="contain"
              contentPosition="top"
            />
          </View>
        </ScrollView>
      </View>
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
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  headerRight: {
    width: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  bannerBlock: {
    width: "100%",
  },
  bannerImage: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  titleBelow: {
    marginTop: -40,
    paddingTop: 4,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    textAlign: "center",
  },
  detailImage: {
    marginTop: 12,
    alignSelf: "center",
  },
});
