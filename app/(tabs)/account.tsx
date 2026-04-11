import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useDepositModal } from "@/contexts/DepositModalContext";
import {
  DEFAULT_AVATAR_ID,
  getAvatarImageSource,
  getSelectedAvatarId,
} from "@/services/avatar-storage";
import { getToken } from "@/services/auth-storage";
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_600SemiBold,
  Inter_700Bold_Italic,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Linking, ScrollView, StyleSheet, View, Pressable } from "react-native";
function formatBalance(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export default function AccountScreen() {
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
    Inter_Bold_Italic: Inter_700Bold_Italic,
    Inter_Regular_Italic: Inter_400Regular_Italic,
  });
  const router = useRouter();
  const { walletBalance, logout } = useAuth();
  useDepositModal();
  const [notificationCount] = useState(2);
  const [selectedAvatarId, setSelectedAvatarId] =
    useState(DEFAULT_AVATAR_ID);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        const avatarId = await getSelectedAvatarId();

        if (isActive) {
          setSelectedAvatarId(avatarId);
        }
      })();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleCopyUID = () => {
    // Handle copy UID functionality
    console.log("Copy UID");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  const handleOpenCustomerSupport = useCallback(async () => {
    const token = await getToken();
    let url = "https://support.indgames.online/";
    if (token) {
      url += `?token=${encodeURIComponent(token)}`;
    }
    await Linking.openURL(url);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Pressable
            style={styles.profileImageContainer}
            onPress={() => router.push("/account/avatar")}
          >
            <Image
              source={getAvatarImageSource(selectedAvatarId)}
              style={{ width: 84, height: 84 }}
              contentFit="cover"
            />
          </Pressable>
          <View style={styles.profileInfo}>

            <View style={styles.usernameRow}>
              <ThemedText style={styles.username}>MEMBERNNGH2JM8</ThemedText>
              <Image
                source={require("@/assets/pro.webp")}
                style={{ width: 40, height: 40 }}
                contentFit="contain"
              />
            </View>

            <Pressable
              style={styles.uidContainer}
              onPress={handleCopyUID}
            >
              <ThemedText style={styles.uidLabel}>UID</ThemedText>
              <View style={{ width: 1, height: "60%", backgroundColor: "white" }} />
              <ThemedText style={styles.uidValue}>9111383</ThemedText>
              <Ionicons name="copy-outline" size={12} color="#fff" style={{ transform: [{ rotate: '90deg' }] }} />
            </Pressable>
            <ThemedText style={styles.lastLogin}>
              Last login: 2026-01-25 23:01:42
            </ThemedText>
          </View>
        </View>

        <View style={styles.balanceSectionContainer}>
          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <ThemedText style={styles.balanceTitle}>Total balance</ThemedText>
            <View style={styles.balanceHeader}>
              <ThemedText style={styles.balanceAmount}>
                {formatBalance(walletBalance)}
              </ThemedText>
              <Image
                source={require("@/assets/43.png")}
                style={{ width: 25, height: 25 }}
                contentFit="contain"
              />
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.quickActions}>
            <Pressable style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, styles.walletIcon]}>
                <Image
                  source={require("@/assets/gfg4.png")}
                  style={{ width: "80%", height: "80%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.quickActionLabel}>ARWallet</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => router.push("/deposit")}
              style={styles.quickActionButton}
            >
              <View style={[styles.quickActionIcon, styles.depositIcon]}>
                <Image
                  source={require("@/assets/gfg3.png")}
                  style={{ width: "80%", height: "80%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.quickActionLabel}>Deposit</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => router.push("/withdraw")}
              style={styles.quickActionButton}
            >
              <View style={[styles.quickActionIcon, styles.withdrawIcon]}>
                <Image
                  source={require("@/assets/gfg2.png")}
                  style={{ width: "80%", height: "80%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.quickActionLabel}>Withdraw</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => router.push("/account/vip")}
              style={styles.quickActionButton}
            >
              <View style={[styles.quickActionIcon, styles.vipIcon]}>
                <Image
                  source={require("@/assets/gfg1.png")}
                  style={{ width: "80%", height: "80%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.quickActionLabel}>VIP</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* History Sections */}
        <View style={styles.historySection}>
          <View style={styles.historyCardContainer}>
            <Pressable
              onPress={() => router.push("/account/game-history")}
              style={[styles.historyCard, styles.gameHistoryCard]}
            >
              <View style={styles.historyIconContainer}>
                <Image
                  source={require("@/assets/ugi4.png")}
                  style={{ width: 35, height: 35 }}
                  contentFit="contain"
                />
              </View>
              <View style={styles.historyContent}>
                <ThemedText style={styles.historyTitle}>
                  Game History
                </ThemedText>
                <ThemedText style={styles.historySubtitle}>
                  My game history
                </ThemedText>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/account/transaction-history")}
              style={[styles.historyCard, styles.transactionCard]}
            >
              <View style={styles.historyIconContainer}>
                <Image
                  source={require("@/assets/ugi1.png")}
                  style={{ width: 35, height: 35 }}
                  contentFit="contain"
                />
              </View>
              <View style={styles.historyContent}>
                <ThemedText style={styles.historyTitle}>Transaction</ThemedText>
                <ThemedText style={styles.historySubtitle}>
                  My transaction history
                </ThemedText>
              </View>
            </Pressable>
          </View>
          <View style={styles.historyCardContainer}>
            <Pressable
              onPress={() => router.push("/deposit-history")}
              style={[styles.historyCard, styles.depositHistoryCard]}
            >
              <View style={styles.historyIconContainer}>
                <Image
                  source={require("@/assets/ugi3.png")}
                  style={{ width: 35, height: 35 }}
                  contentFit="contain"
                />
              </View>
              <View style={styles.historyContent}>
                <ThemedText style={styles.historyTitle}>Deposit</ThemedText>
                <ThemedText style={styles.historySubtitle}>
                  My deposit history
                </ThemedText>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/withdrawal-history")}
              style={[styles.historyCard, styles.withdrawHistoryCard]}
            >
              <View style={styles.historyIconContainer}>
                <Image
                  source={require("@/assets/ugi2.png")}
                  style={{ width: 35, height: 35 }}
                  contentFit="contain"
                />
              </View>
              <View style={styles.historyContent}>
                <ThemedText style={styles.historyTitle}>Withdraw</ThemedText>
                <ThemedText style={styles.historySubtitle}>
                  My withdraw history
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Account Settings List */}
        <View style={styles.settingsSection}>
          <Pressable
            style={styles.settingItem}
            onPress={() => router.push("/account/notification" as any)}
          >
            <View style={styles.settingLeft}>
              <View
                style={[styles.settingIconContainer, styles.notificationIcon]}
              >
                <Image
                  source={require("@/assets/ss.png")}
                  style={{ width: "80%", height: "80%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.settingLabel}>Notification</ThemedText>
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    {notificationCount}
                  </ThemedText>
                </View>
              )}
            </View>
            <Image
              source={require("@/assets/as.png")}
              style={{ width: 35, height: 35 }}
              contentFit="contain"
            />
          </Pressable>

          <Pressable
            style={styles.settingItem}
            onPress={() => router.push("/account/gifts" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.giftsIcon]}>
                <Image
                  source={require("@/assets/eerrr2.png")}
                  style={{ width: "90%", height: "90%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.settingLabel}>Gifts</ThemedText>
            </View>
            <Image
              source={require("@/assets/as.png")}
              style={{ width: 35, height: 35 }}
              contentFit="contain"
            />
          </Pressable>

          <Pressable
            style={styles.settingItem}
            onPress={() => router.push("/account/game-stats" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.statsIcon]}>
                <Image
                  source={require("@/assets/eerrr3.png")}
                  style={{ width: "90%", height: "90%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.settingLabel}>
                Game statistics
              </ThemedText>
            </View>
            <Image
              source={require("@/assets/as.png")}
              style={{ width: 35, height: 35 }}
              contentFit="contain"
            />
          </Pressable>

          <Pressable
            style={styles.settingItem}
            onPress={() => router.push("/account/language" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.languageIcon]}>
                <Image
                  source={require("@/assets/eerrr4.png")}
                  style={{ width: "90%", height: "90%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.settingLabel}>Language</ThemedText>
            </View>
            <View style={styles.settingRight}>
              <ThemedText style={styles.languageValue}>English</ThemedText>
              <Image
                source={require("@/assets/as.png")}
                style={{ width: 35, height: 35 }}
                contentFit="contain"
              />
            </View>
          </Pressable>
        </View>

        {/* Service Center Section */}
        <View style={styles.serviceSection}>
          <ThemedText style={styles.sectionTitle}>Service center</ThemedText>
          <View style={styles.serviceGrid}>
            <Pressable
              style={styles.serviceItem}
              onPress={() =>
                router.push("/account/service-center/settings" as any)
              }
            >
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image
                  source={require("@/assets/eerrr5.png")}
                  style={{ width: "90%", height: "90%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>Settings</ThemedText>
            </Pressable>

            <Pressable
              style={styles.serviceItem}
              onPress={() =>
                router.push("/account/service-center/feedback" as any)
              }
            >
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image
                  source={require("@/assets/eerrr6.png")}
                  style={{ width: "90%", height: "90%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>Feedback</ThemedText>
            </Pressable>

            <Pressable
              style={styles.serviceItem}
              onPress={() =>
                router.push("/account/service-center/announcement" as any)
              }
            >
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image
                  source={require("@/assets/eerrr7.png")}
                  style={{ width: "90%", height: "90%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>Announcement</ThemedText>
            </Pressable>

            <Pressable
              style={styles.serviceItem}
              onPress={handleOpenCustomerSupport}
            >
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image
                  source={require("@/assets/eerrr10.png")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>
                Customer Service
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.serviceItem}
              onPress={() =>
                router.push("/account/service-center/beginners-guide" as any)
              }
            >
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image
                  source={require("@/assets/eerrr9.png")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>
                Beginner&apos;s Guide
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.serviceItem}
              onPress={() =>
                router.push("/account/service-center/about-us" as any)
              }
            >
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image
                  source={require("@/assets/eerrr8.png")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>About us</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Log Out Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="power" size={25} color="#00ECBE" />
          <ThemedText style={styles.logoutText}>Log out</ThemedText>
        </Pressable>
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
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 24,
    gap: 16,
  },
  profileImageContainer: {
    width: 84,
    height: 84,
    borderRadius: 82,
    overflow: "hidden",
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    fontWeight: "600"
  },
  vipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  vipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  uidContainer: {
    width: "40%",
    // maxWidth: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DD9138",
    borderRadius: 18,
    padding: 6,
    paddingVertical: 0,
    marginTop: -5
  },
  uidTag: {
    backgroundColor: "#F97316",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  uidLabel: {
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    fontWeight: "700"
  },
  uidValue: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Roboto_400Regular",
    letterSpacing: -0.5,
    fontWeight: "800"
  },
  lastLogin: {
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    fontWeight: "bold"
  },
  balanceSectionContainer: {
    backgroundColor: "#001C54",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  balanceSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  balanceHeader: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 0,
    alignItems: "center",
  },
  balanceTitle: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: "#92A8E3",
  },
  balanceAmount: {
    fontSize: 19,
    fontFamily: "Roboto_700Bold",
    color: "#fff",
    fontWeight: "bold",
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 14,
    paddingTop: 14,
    gap: 12,
    borderTopWidth: 0.4,
    borderColor: "rgba(92, 166, 255, 0.15)",
    marginHorizontal: 10,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    gap: 0,
  },
  quickActionIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  walletIcon: {},
  depositIcon: {
    // backgroundColor: '#F97316',
  },
  withdrawIcon: {
    // backgroundColor: '#3B82F6',
  },
  vipIcon: {
    // backgroundColor: '#10B981',
  },
  quickActionLabel: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
  },
  historySection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  historyCardContainer: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  historyCard: {
    width: "47%",
    backgroundColor: "#011341",
    borderRadius: 9,
    padding: 10,
    gap: 10,
    flex: 1,
    flexDirection: "row",
  },
  gameHistoryCard: {
    backgroundColor: "#011341",
  },
  transactionCard: {
    backgroundColor: "#011341",
  },
  depositHistoryCard: {
    backgroundColor: "#011341",
  },
  withdrawHistoryCard: {
    backgroundColor: "#011341",
  },
  historyIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  historyContent: {
    flex: 1,
    flexDirection: "column",
    gap: 0,
  },
  historyTitle: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    lineHeight: 15,
    marginBottom: 1,
    includeFontPadding: false,
  },
  historySubtitle: {
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    lineHeight: 13,
    color: "#92A8E3",
    flexShrink: 1,
    marginTop: 0,
    includeFontPadding: false,
  },
  settingsSection: {
    backgroundColor: "#011341",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  settingIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    // backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  giftsIcon: {
    // backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statsIcon: {
    // backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  languageIcon: {
    // backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    flex: 1,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  languageValue: {
    fontSize: 13,
    color: "#fff",
  },
  badge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 25,
    height: 20,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
  },
  serviceSection: {
    paddingHorizontal: 10,
    marginBottom: 24,
    backgroundColor: "#011341",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    marginBottom: 16,
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  serviceItem: {
    width: "30%",
    alignItems: "center",
    gap: 0,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIcon: {
    // backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  serviceLabel: {
    fontSize: 12,
    color: "#92A8E3",
    textAlign: "center",
    lineHeight: 16,
    fontFamily: "Roboto_400Regular",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 8,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#00ECBE",
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#00ECBE",
  },
});
