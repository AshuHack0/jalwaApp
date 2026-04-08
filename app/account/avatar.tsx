import { ThemedView } from "@/components/themed-view";
import {
  AVATAR_OPTIONS,
  DEFAULT_AVATAR_ID,
  getAvatarPickerSource,
  getSelectedAvatarId,
  storeSelectedAvatarId,
} from "@/services/avatar-storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_BG = "#05012B";
const ACCENT = "#12F0CD";
const HORIZONTAL_PADDING = 21;
const COLUMN_GAP = 11;
const ROW_GAP = 13;
const TILE_RATIO = 119 / 133;

export default function AvatarScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [selectedAvatarId, setSelectedAvatarId] =
    useState<string>(DEFAULT_AVATAR_ID);

  const tileWidth = useMemo(() => {
    return Math.floor((width - HORIZONTAL_PADDING * 2 - COLUMN_GAP * 2) / 3);
  }, [width]);

  const tileHeight = useMemo(() => {
    return Math.round(tileWidth * TILE_RATIO);
  }, [tileWidth]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        const storedAvatarId = await getSelectedAvatarId();

        if (isActive) {
          setSelectedAvatarId(storedAvatarId);
        }
      })();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleSelect = useCallback(async (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    await storeSelectedAvatarId(avatarId);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.75}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#EEF5FF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Change avatar</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(insets.bottom + 20, 24),
              paddingTop: 8,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {AVATAR_OPTIONS.map((avatar, index) => {
              const isSelected = selectedAvatarId === avatar.id;
              const showCustomSelection =
                isSelected && !avatar.pickerSelectedSource;
              const isLastColumn = index % 3 === 2;

              return (
                <TouchableOpacity
                  key={avatar.id}
                  accessibilityRole="button"
                  activeOpacity={0.92}
                  onPress={() => handleSelect(avatar.id)}
                  style={[
                    styles.tile,
                    {
                      height: tileHeight,
                      marginBottom: ROW_GAP,
                      marginRight: isLastColumn ? 0 : COLUMN_GAP,
                      width: tileWidth,
                    },
                    showCustomSelection && styles.tileSelected,
                  ]}
                >
                  <View style={styles.tileInner}>
                    <Image
                      source={getAvatarPickerSource(avatar.id, isSelected)}
                      style={styles.tileImage}
                      contentFit="cover"
                    />

                    {showCustomSelection ? (
                      <View style={styles.checkBadge}>
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color="#FFFFFF"
                        />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },
  header: {
    alignItems: "center",
    backgroundColor: SCREEN_BG,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  backButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    color: "#F4F7FF",
    fontSize: 18.5,
    fontWeight: "500",
    letterSpacing: 0.15,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile: {
    backgroundColor: "transparent",
    borderRadius: 14,
    overflow: "hidden",
  },
  tileSelected: {
    backgroundColor: ACCENT,
    padding: 3,
  },
  tileInner: {
    backgroundColor: "#1F2450",
    borderRadius: 12,
    flex: 1,
    overflow: "hidden",
  },
  tileImage: {
    height: "100%",
    width: "100%",
  },
  checkBadge: {
    alignItems: "center",
    backgroundColor: ACCENT,
    borderRadius: 14,
    bottom: 4,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 4,
    width: 28,
  },
});
