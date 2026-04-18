import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PROMOTIONAL_BANNERS } from "@/constants/promotionalBanners";
import {
  EBGaramond_400Regular,
  EBGaramond_700Bold,
  useFonts,
} from "@expo-google-fonts/eb-garamond";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, View, Pressable } from "react-native";

export default function ActivityScreen() {
  // Load the fonts
  let [fontsLoaded] = useFonts({
    SerifRegular: EBGaramond_400Regular,
    SerifBold: EBGaramond_700Bold,
  });

  const [todayBonus] = useState("₹0.00");
  const [totalBonus] = useState("₹0.00");
  const router = useRouter();

  const activityCategories: Array<{
    name: string;
    image: number;
    route: Href;
  }> = [
      {
        name: "Activity Award",
        image: require("@/assets/activityReward-66772619.webp"),
        route: "/activity/activity-award",
      },
      {
        name: "Invitation bonus",
        image: require("@/assets/invitationBonus-aa7acbd3.webp"),
        route: "/activity/invitation-bonus",
      },
      {
        name: "Betting rebate",
        image: require("@/assets/BettingRebate-17d35455.webp"),
        route: "/activity/betting-rebate",
      },
      {
        name: "Super Jackpot",
        image: require("@/assets/superJackpot-ecb648b4.webp"),
        route: "/activity/super-jackpot",
      },
    ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/h5setting_20250315140925tbe6.png")}
            style={styles.logoImage}
            contentFit="contain"
          />
        </View>

        {/* Bonus Information Section */}
        <View style={styles.bonusSection}>
          <View style={styles.bonusInfo}>
            <View style={styles.bonusItem}>
              <ThemedText style={styles.bonusLabel}>Today's bonus</ThemedText>
              <ThemedText style={styles.bonusAmount}>{todayBonus}</ThemedText>
            </View>
            <View style={styles.bonusDivider} />
            <View style={styles.bonusItem}>
              <ThemedText style={styles.bonusLabel}>Total bonus</ThemedText>
              <ThemedText style={styles.bonusAmount}>{totalBonus}</ThemedText>
            </View>
          </View>
          <Pressable style={styles.bonusDetailsButton}>
            <ThemedText
              style={[styles.bonusDetailsText]}
            >
              Bonus details
            </ThemedText>
          </Pressable>
        </View>

        {/* Activity Categories Grid */}
        <View style={styles.categoriesGrid}>
          {activityCategories.map((category, index) => (
            <Pressable
              key={index}
              style={styles.categoryCard}
              onPress={() => router.push(category.route)}
            >
              <View style={[styles.categoryIconContainer]}>
                <Image
                  source={category.image}
                  style={styles.categoryImage}
                  contentFit="contain"
                />
              </View>
              <ThemedText numberOfLines={2} style={styles.categoryLabel}>
                {category.name}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Main Activity Cards */}
        <View style={styles.mainCards}>
          <Pressable
            style={[styles.mainCard, styles.giftsCard]}
            onPress={() => router.push("/account/gifts" as Href)}
          >
            <View style={styles.cardContent}>
              <ImageBackground
                source={require("@/assets/signInBanner-ff4a210f.webp")}
                style={styles.giftsCardImage}
                imageStyle={styles.giftsCardImage}
              ></ImageBackground>
              <View style={styles.cardTextContainer}>
                <ThemedText style={styles.cardTitle}>Gifts</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  Enter the redemption code to receive gift rewards
                </ThemedText>
              </View>
            </View>
          </Pressable>

          <Pressable
            style={[styles.mainCard, styles.attendanceCard]}
            onPress={() => router.push("/activity/attendance-bonus" as Href)}
          >
            <View style={styles.cardContent}>
              <ImageBackground
                source={require("@/assets/giftRedeem-bb2f7a92.webp")}
                style={styles.giftsCardImage}
                imageStyle={styles.giftsCardImage}
              ></ImageBackground>
              <View style={styles.cardTextContainer}>
                <ThemedText style={styles.cardTitle}>
                  Attendance bonus
                </ThemedText>
                <ThemedText style={styles.cardDescription}>
                  The more consecutive days you sign in, the higher the reward
                  will be.
                </ThemedText>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Promotional Banners */}
        <View style={styles.bannersSection}>
          {PROMOTIONAL_BANNERS.map((banner) => (
            <Pressable
              key={banner.id}
              style={styles.bannerCard}
            // onPress={() =>
            //   router.push({
            //     pathname: "/activity/activity-details",
            //     params: { id: String(banner.id) },
            //   } as Href)
            // }
            >
              {banner.id !== 1 && <View style={styles.bannerHeader}>
                <Image
                  source={require("@/assets/h5setting_20250315141734j61m.png")}
                  style={styles.bannerLogo}
                  contentFit="contain"
                />
              </View>}
              <View style={styles.bannerImagePlaceholder}>
                <Image
                  source={banner.bannerImage}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  contentPosition="top"
                />
              </View>
              <View style={styles.bannerContent}>
                <ThemedText style={styles.bannerTitle}>
                  {banner.title}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>

        {/* No More Indicator */}
        <View style={styles.noMoreContainer}>
          <ThemedText style={styles.noMoreText}>No more</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  scrollView: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 5,
  },
  header: {
    backgroundColor: "#05012B",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    zIndex: 1000,
    elevation: 1000,
  },
  logoImage: {
    width: 150,
    height: 40,
  },
  bonusSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  bonusInfo: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bonusItem: {
    flex: 1,
    alignItems: "center",
  },
  bonusDivider: {
    width: 1,
    backgroundColor: "#005b74",
    marginHorizontal: 16,
  },
  bonusLabel: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 8,
  },
  bonusAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "sans-serif",
  },
  bonusDetailsButton: {
    paddingHorizontal: 24,
    backgroundColor: "#001C54",
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#005b74",
    alignSelf: "center",
  },
  bonusDetailsText: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 12,
    color: "#00ecbe",
    fontFamily: "sans-serif",
    // backgroundColor: "red",
    textAlign: "auto",
  },
  categoriesGrid: {
    flexDirection: "row",
    paddingHorizontal: 30,
    marginBottom: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryCard: {
    width: "20%",
    alignItems: "center",
    gap: 10,
  },
  categoryIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryImage: {
    width: 45,
    height: 45,
  },
  categoryLabel: {
    fontSize: 12,
    color: "#92a8e3",
    textAlign: "center",
    lineHeight: 14,
  },
  mainCards: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  mainCard: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    minHeight: 120,
  },
  giftsCardImage: {
    width: "100%",
    height: 100,
  },
  giftsCard: {
    backgroundColor: "#EF4444",
  },
  attendanceCard: {
    backgroundColor: "#3B82F6",
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardTextContainer: {
    height: 90,
    gap: 1,
    backgroundColor: "#011341",
    paddingVertical: 3,
    paddingHorizontal: 12,
    paddingTop: 8
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E3EFFF",
    lineHeight: 18,
    fontFamily: "sans-serif",
  },
  cardDescription: {
    fontSize: 11,
    lineHeight: 13,
    color: "#92A8E3",
    opacity: 0.9,
    marginTop: 12,
  },
  bannersSection: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 4,
  },
  bannerCard: {
    position: "relative",
    backgroundColor: "#011341",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 2,
  },
  bannerHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    elevation: 10,
    padding: 6,
    paddingLeft: 2,
    paddingVertical: 4,
    backgroundColor: "#0D31A9",
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 36,
    overflow: "hidden",
  },
  bannerLogo: {
    width: 100,
    height: 20,
  },
  bannerImagePlaceholder: {
    height: 140,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    position: "relative",
    // width to be full and stretch to the width of the container
    width: "100%",
  },
  bannerImageStyle: {
    width: "100%",
    height: "100%",
  },
  bannerContent: {
    padding: 12,
    paddingVertical: 10,
    gap: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e3efff",
  },
  noMoreContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  noMoreText: {
    fontSize: 14,
    color: "#9BA1A6",
  },
});
