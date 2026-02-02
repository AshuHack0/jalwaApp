import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ActivityScreen() {
  const [todayBonus] = useState('₹0.00');
  const [totalBonus] = useState('₹0.00');

  const activityCategories = [
    { name: 'Activity Award', icon: 'medal' as const, color: '#F97316' },
    { name: 'Invitation bonus', icon: 'person-add' as const, color: '#3B82F6' },
    { name: 'Betting rebate', icon: 'wallet' as const, color: '#F97316' },
    { name: 'Super Jackpot', icon: 'trophy' as const, color: '#10B981' },
  ];

  const promotionalBanners = [
    {
      id: 1,
      title: '7-DAYS CUMULATIVE BETTING REWARDS',
      icon: 'airplane' as const,
      bannerImage: require('@/assets/Banner_202505051626178ysv.png'),
    },
    {
      id: 2,
      title: 'MINI GAMES DAILY MISSION REWARDS!',
      icon: 'baseball' as const,
      bannerImage: require('@/assets/Banner_20250505174559l35y.jpg'),
    },
    {
      id: 3,
      title: 'Benefits of Using AR WALLET',
      icon: 'wallet' as const,
      bannerImage: require('@/assets/Banner_20250509160039hucu.jpg'),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <ThemedText style={styles.logoText}>Jalwa.Game</ThemedText>
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
          <TouchableOpacity style={styles.bonusDetailsButton}>
            <ThemedText style={styles.bonusDetailsText}>Bonus details</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Activity Categories Grid */}
        <View style={styles.categoriesGrid}>
          {activityCategories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
                <Ionicons name={category.icon} size={32} color={category.color} />
              </View>
              <ThemedText style={styles.categoryLabel}>{category.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Activity Cards */}
        <View style={styles.mainCards}>
          <TouchableOpacity style={[styles.mainCard, styles.giftsCard]}>
            <View style={styles.cardContent}>
              <View style={styles.cardTextContainer}>
                <ThemedText style={styles.cardTitle}>Gifts</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  Enter the redemption code to receive gift rewards
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.mainCard, styles.attendanceCard]}>
            <View style={styles.cardContent}>
              <View style={styles.cardTextContainer}>
                <ThemedText style={styles.cardTitle}>Attendance bonus</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  The more consecutive days you sign in, the higher the reward will be.
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recharge Bonus Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>RECHARGE BONUS FOR NEW PLAYERS</ThemedText>
        </View>

        {/* Promotional Banners */}
        <View style={styles.bannersSection}>
          {promotionalBanners.map((banner) => (
            <TouchableOpacity key={banner.id} style={styles.bannerCard}>
              <View style={styles.bannerHeader}>
                <Image 
                  source={require('@/assets/h5setting_20250315141734j61m.png')} 
                  style={styles.bannerLogo}
                  resizeMode="contain"
                />
              </View>
              <ImageBackground 
                source={banner.bannerImage} 
                style={styles.bannerImagePlaceholder}
                imageStyle={styles.bannerImageStyle}
              >
              </ImageBackground>
              <View style={styles.bannerContent}>
                <ThemedText style={styles.bannerTitle}>{banner.title}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Advertisement Banner */}
        <View style={styles.adBanner}>
          <View style={styles.adHeader}>
            <ThemedText style={styles.adLogo}>Jalwa.Game</ThemedText>
          </View>
          <View style={styles.adContent}>
            <View style={styles.adTextContainer}>
              <ThemedText style={styles.adTitle}>Take Your Experience to the Next Level</ThemedText>
              <ThemedText style={styles.adDescription}>
                Install Now 1.1.1.1 for Faster, Safer, and Smoother browsing
              </ThemedText>
            </View>
            <View style={styles.adImagePlaceholder}>
              <Ionicons name="rocket" size={48} color="#3B82F6" />
            </View>
          </View>
          <View style={styles.adFooter}>
            <ThemedText style={styles.adFooterText}>
              INSTALL 1.1.1.1 FOR A FASTER EXPERIENCE
            </ThemedText>
          </View>
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
    backgroundColor: '#05012B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bonusSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  bonusInfo: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bonusItem: {
    flex: 1,
    alignItems: 'center',
  },
  bonusDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  bonusLabel: {
    fontSize: 12,
    color: '#9BA1A6',
    marginBottom: 8,
  },
  bonusAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bonusDetailsButton: {
    backgroundColor: '#14B8A6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bonusDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  categoriesGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  mainCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  mainCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 120,
  },
  giftsCard: {
    backgroundColor: '#EF4444',
  },
  attendanceCard: {
    backgroundColor: '#3B82F6',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  cardTextContainer: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  bannersSection: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  bannerCard: {
    position: 'relative',
    backgroundColor: '#011341',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    elevation: 10,
    padding: 6,
    paddingLeft: 2,
    paddingVertical: 4,
    // paddingBottom: 8,
    backgroundColor: '#0D31A9',
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  bannerLogo: {
    width: 100,
    height: 20,
    // backgroundColor: 'red',
  },
  bannerImagePlaceholder: {
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  bannerImageStyle: {
    resizeMode: 'cover',
  },
  bannerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FBBF24',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  badgePercent: {
    fontSize: 10,
    color: '#000',
  },
  dailyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FBBF24',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dailyBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  lockIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  bannerContent: {
    padding: 16,
    paddingVertical: 10,
    gap: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  adBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  adHeader: {
    padding: 12,
    paddingBottom: 8,
  },
  adLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  adContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  adTextContainer: {
    flex: 1,
    gap: 8,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  adDescription: {
    fontSize: 12,
    color: '#9BA1A6',
    lineHeight: 18,
  },
  adImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adFooter: {
    backgroundColor: '#1a0a3d',
    padding: 12,
    alignItems: 'center',
  },
  adFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  noMoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noMoreText: {
    fontSize: 14,
    color: '#9BA1A6',
  },
});
