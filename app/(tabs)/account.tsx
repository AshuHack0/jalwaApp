import { useAuth } from "@/contexts/AuthContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

function formatBalance(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export default function AccountScreen() {
  const router = useRouter();
  const { walletBalance, logout } = useAuth();
  const [notificationCount] = useState(2);

  const handleCopyUID = () => {
    // Handle copy UID functionality
    console.log('Copy UID');
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('@/assets/1-a6662edb.webp')} 
              style={{ width: 84, height: 84 }}
              contentFit="cover"
            />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.usernameRow}>
              <ThemedText style={styles.username}>MEMBERNNGH2JM8</ThemedText>
                 <Image source={require('@/assets/pro.webp')} style={{ width: 40, height: 40 }} contentFit="contain" />
            </View>
            <TouchableOpacity style={styles.uidContainer} onPress={handleCopyUID}>
              <ThemedText style={styles.uidLabel}>UID</ThemedText>
              <ThemedText style={styles.uidValue}>9111383</ThemedText>
              <Ionicons name="copy-outline" size={16} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.lastLogin}>Last login: 2026-01-25 23:01:42</ThemedText>
          </View>
        </View>

        <View style={styles.balanceSectionContainer}>
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <ThemedText style={styles.balanceTitle}>Total balance</ThemedText>
          <View style={styles.balanceHeader}>
            <ThemedText style={styles.balanceAmount}>{formatBalance(walletBalance)}</ThemedText>
          </View>
        </View>
 
 

        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, styles.walletIcon]}>
              <Image 
                source={require('@/assets/gfg4.png')} 
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </View>
            <ThemedText style={styles.quickActionLabel}>ARWallet</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, styles.depositIcon]}>
              <Image 
                source={require('@/assets/gfg3.png')} 
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </View>
            <ThemedText style={styles.quickActionLabel}>Deposit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, styles.withdrawIcon]}>
              <Image 
                source={require('@/assets/gfg2.png')} 
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </View>
            <ThemedText style={styles.quickActionLabel}>Withdraw</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, styles.vipIcon]}>
              <Image 
                source={require('@/assets/gfg1.png')} 
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </View>
            <ThemedText style={styles.quickActionLabel}>VIP</ThemedText>
          </TouchableOpacity>
          </View>
        </View>

        {/* History Sections */}
        <View style={styles.historySection}>
          <View style={styles.historyCardContainer}>
            <TouchableOpacity style={[styles.historyCard, styles.gameHistoryCard]}>
              <View style={styles.historyIconContainer}>
                <Image 
                  source={require('@/assets/ugi4.png')} 
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                />
              </View>
              <View style={styles.historyContent}>
                <ThemedText style={styles.historyTitle}>Game History</ThemedText>
                <ThemedText style={styles.historySubtitle}>My game history</ThemedText>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.historyCard, styles.transactionCard]}>
              <View style={styles.historyIconContainer}>
                <Image 
                  source={require('@/assets/ugi1.png')} 
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                />
              </View>
              <View style={styles.historyContent}>
                <ThemedText style={styles.historyTitle}>Transaction</ThemedText>
                <ThemedText style={styles.historySubtitle}>My transaction history</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.historyCardContainer}>   
            <TouchableOpacity style={[styles.historyCard, styles.depositHistoryCard]}>
              <View style={styles.historyIconContainer}>
                <Image 
                  source={require('@/assets/ugi3.png')} 
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                />
              </View>
              <View style={styles.historyContent}>
                <ThemedText style={styles.historyTitle}>Deposit</ThemedText>
                <ThemedText style={styles.historySubtitle}>My deposit history</ThemedText>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.historyCard, styles.withdrawHistoryCard]}>
              <View style={styles.historyIconContainer}>
                <Image 
                  source={require('@/assets/ugi2.png')} 
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                />
              </View>
              <View style={styles.historyContent}>
                <ThemedText style={styles.historyTitle}>Withdraw</ThemedText>
                <ThemedText style={styles.historySubtitle}>My withdraw history</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings List */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.notificationIcon]}>
                <Image 
                  source={require('@/assets/eerrr1.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.settingLabel}>Notification</ThemedText>
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>{notificationCount}</ThemedText>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.giftsIcon]}>
                <Image 
                  source={require('@/assets/eerrr2.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.settingLabel}>Gifts</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.statsIcon]}>
                <Image 
                  source={require('@/assets/eerrr3.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.settingLabel}>Game statistics</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.languageIcon]}>
                <Image 
                  source={require('@/assets/eerrr4.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.settingLabel}>Language</ThemedText>
            </View>
            <View style={styles.settingRight}>
              <ThemedText style={styles.languageValue}>English</ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Service Center Section */}
        <View style={styles.serviceSection}>
          <ThemedText style={styles.sectionTitle}>Service center</ThemedText>
          <View style={styles.serviceGrid}>
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image 
                  source={require('@/assets/eerrr5.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>Settings</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image 
                  source={require('@/assets/eerrr6.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>Feedback</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image 
                  source={require('@/assets/eerrr7.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>Announcement</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image 
                  source={require('@/assets/eerrr8.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>Customer Service</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image 
                  source={require('@/assets/eerrr9.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>Beginner's Guide</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Image 
                  source={require('@/assets/eerrr10.png')} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.serviceLabel}>About us</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="power" size={20} color="#10B981" />
          <ThemedText style={styles.logoutText}>Log out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05012B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 24,
    gap: 16,
  },
  profileImageContainer: {
    width: 84, 
    height: 84,
    borderRadius: 82,
    overflow: 'hidden',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  vipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  uidContainer: {
    width: '60%', 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DD9138',
    borderRadius: 18,
    padding: 8,
    paddingVertical: 2,
  },
  uidTag: {
    backgroundColor: '#F97316',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  uidLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  uidValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  lastLogin: {
    fontSize: 13,
    color: '#fff',
  },
  balanceSectionContainer: {
    backgroundColor: '#001C54',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  balanceSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 19,
    color: '#92A8E3',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIcon: {
  },
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
    fontSize: 16,
    color: '#fff',
  },
  historySection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  historyCardContainer: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  historyCard: {
    width: '47%',
    backgroundColor: '#011341',
    borderRadius: 9,
    padding: 10,
    gap: 12,
    flex: 1,
    flexDirection: 'row',
  },
  gameHistoryCard: {
    backgroundColor: '#011341',
  },
  transactionCard: {
    backgroundColor: '#011341',
  },
  depositHistoryCard: {
    backgroundColor: '#011341',
  },
  withdrawHistoryCard: {
    backgroundColor: '#011341',
  },
  historyIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  historyContent: {
    flex: 1,
    flexDirection: 'column',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  historySubtitle: {
    fontSize: 12,
    lineHeight: 14,
    color: '#92A8E3',
    flexShrink: 1,
  },
  settingsSection: {
    backgroundColor: '#011341',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageValue: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  serviceSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#011341',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
    gap: 0,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    // backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  serviceLabel: {
    fontSize: 12,
    color: '#92A8E3',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 8,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#10B981',
  },
});
