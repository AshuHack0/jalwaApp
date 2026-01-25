import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function AccountScreen() {
  const router = useRouter();
  const [balance] = useState('₹0.00');
  const [notificationCount] = useState(2);

  const handleCopyUID = () => {
    // Handle copy UID functionality
    console.log('Copy UID');
  };

  const handleLogout = () => {
    // Handle logout functionality
    console.log('Logout');
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
            <Ionicons name="person-circle" size={64} color="#9BA1A6" />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.usernameRow}>
              <ThemedText style={styles.username}>MEMBERNNGH2JM8</ThemedText>
              <View style={styles.vipBadge}>
                <Ionicons name="shield" size={16} color="#fff" />
                <ThemedText style={styles.vipText}>VIP0</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.uidContainer} onPress={handleCopyUID}>
              <View style={styles.uidTag}>
                <ThemedText style={styles.uidLabel}>UID</ThemedText>
              </View>
              <ThemedText style={styles.uidValue}>9111383</ThemedText>
              <Ionicons name="copy-outline" size={16} color="#9BA1A6" />
            </TouchableOpacity>
            <ThemedText style={styles.lastLogin}>Last login: 2026-01-25 23:01:42</ThemedText>
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceHeader}>
            <ThemedText style={styles.balanceTitle}>Total balance</ThemedText>
            <TouchableOpacity>
              <Ionicons name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.balanceAmount}>{balance}</ThemedText>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, styles.walletIcon]}>
              <Ionicons name="wallet" size={24} color="#fff" />
            </View>
            <ThemedText style={styles.quickActionLabel}>Wallet</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, styles.depositIcon]}>
              <Ionicons name="bag" size={24} color="#fff" />
            </View>
            <ThemedText style={styles.quickActionLabel}>Deposit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, styles.withdrawIcon]}>
              <Ionicons name="remove-circle" size={24} color="#fff" />
            </View>
            <ThemedText style={styles.quickActionLabel}>Withdraw</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, styles.vipIcon]}>
              <Ionicons name="diamond" size={24} color="#fff" />
            </View>
            <ThemedText style={styles.quickActionLabel}>VIP</ThemedText>
          </TouchableOpacity>
        </View>

        {/* History Sections */}
        <View style={styles.historySection}>
          <TouchableOpacity style={[styles.historyCard, styles.gameHistoryCard]}>
            <View style={styles.historyIconContainer}>
              <Ionicons name="document-text" size={32} color="#3B82F6" />
            </View>
            <ThemedText style={styles.historyTitle}>Game History</ThemedText>
            <ThemedText style={styles.historySubtitle}>My game history</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.historyCard, styles.transactionCard]}>
            <View style={styles.historyIconContainer}>
              <Ionicons name="swap-horizontal" size={32} color="#10B981" />
            </View>
            <ThemedText style={styles.historyTitle}>Transaction</ThemedText>
            <ThemedText style={styles.historySubtitle}>My transaction history</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.historyCard, styles.depositHistoryCard]}>
            <View style={styles.historyIconContainer}>
              <Ionicons name="arrow-up-circle" size={32} color="#EF4444" />
            </View>
            <ThemedText style={styles.historyTitle}>Deposit</ThemedText>
            <ThemedText style={styles.historySubtitle}>My deposit history</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.historyCard, styles.withdrawHistoryCard]}>
            <View style={styles.historyIconContainer}>
              <Ionicons name="checkmark-circle" size={32} color="#D97706" />
            </View>
            <ThemedText style={styles.historyTitle}>Withdraw</ThemedText>
            <ThemedText style={styles.historySubtitle}>My withdraw history</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Account Settings List */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.notificationIcon]}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
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
                <Ionicons name="gift" size={20} color="#10B981" />
              </View>
              <ThemedText style={styles.settingLabel}>Gifts</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.statsIcon]}>
                <Ionicons name="bar-chart" size={20} color="#10B981" />
              </View>
              <ThemedText style={styles.settingLabel}>Game statistics</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, styles.languageIcon]}>
                <Ionicons name="globe" size={20} color="#10B981" />
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
                <Ionicons name="settings" size={24} color="#10B981" />
              </View>
              <ThemedText style={styles.serviceLabel}>Settings</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Ionicons name="document-text" size={24} color="#10B981" />
              </View>
              <ThemedText style={styles.serviceLabel}>Feedback</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Ionicons name="megaphone" size={24} color="#10B981" />
              </View>
              <ThemedText style={styles.serviceLabel}>Announcement</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Ionicons name="chatbubbles" size={24} color="#10B981" />
              </View>
              <ThemedText style={styles.serviceLabel}>Customer Service</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Ionicons name="book" size={24} color="#10B981" />
              </View>
              <ThemedText style={styles.serviceLabel}>Beginner's Guide</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIconContainer, styles.serviceIcon]}>
                <Ionicons name="cube" size={24} color="#10B981" />
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
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  profileInfo: {
    flex: 1,
    gap: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uidTag: {
    backgroundColor: '#F97316',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  uidLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  uidValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  lastLogin: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  balanceSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  balanceAmount: {
    fontSize: 28,
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
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIcon: {
    backgroundColor: '#EF4444',
  },
  depositIcon: {
    backgroundColor: '#F97316',
  },
  withdrawIcon: {
    backgroundColor: '#3B82F6',
  },
  vipIcon: {
    backgroundColor: '#10B981',
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#fff',
  },
  historySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  historyCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  gameHistoryCard: {
    backgroundColor: '#1a0a3d',
  },
  transactionCard: {
    backgroundColor: '#1a0a3d',
  },
  depositHistoryCard: {
    backgroundColor: '#1a0a3d',
  },
  withdrawHistoryCard: {
    backgroundColor: '#1a0a3d',
  },
  historyIconContainer: {
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  historySubtitle: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  settingsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  giftsIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statsIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  languageIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
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
    gap: 8,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  serviceLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
