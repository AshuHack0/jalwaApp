import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ActivityScreen() {
  const [todayBonus] = useState('₹0.00');
  const [totalBonus] = useState('₹0.00');

  const activityCategories = [
    { name: 'Activity Award', image: require('@/assets/activityReward-66772619.webp') },
    { name: 'Invitation bonus', image: require('@/assets/invitationBonus-aa7acbd3.webp') },
    { name: 'Betting rebate', image: require('@/assets/BettingRebate-17d35455.webp') },
    { name: 'Super Jackpot', image: require('@/assets/superJackpot-ecb648b4.webp') },
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
        stickyHeaderIndices={[0]}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Image 
            source={require('@/assets/h5setting_20250315140925tbe6.png')} 
            style={styles.logoImage}
            resizeMode="contain"
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
          <TouchableOpacity style={styles.bonusDetailsButton}>
            <ThemedText style={styles.bonusDetailsText}>Bonus details</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Activity Categories Grid */}
        <View style={styles.categoriesGrid}>
          {activityCategories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <View style={[styles.categoryIconContainer]}>
                <Image 
                  source={category.image} 
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </View>
              <ThemedText style={styles.categoryLabel}>{category.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Activity Cards */}
        <View style={styles.mainCards}>
          <TouchableOpacity style={[styles.mainCard, styles.giftsCard]}>
            <View style={styles.cardContent}>
              <ImageBackground 
                source={require('@/assets/signInBanner-ff4a210f.webp')} 
                style={styles.giftsCardImage}
                imageStyle={styles.giftsCardImage}
              >
              </ImageBackground>
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
              <ImageBackground 
                source={require('@/assets/giftRedeem-bb2f7a92.webp')} 
                style={styles.giftsCardImage}
                imageStyle={styles.giftsCardImage}
              >
              </ImageBackground>
              <View style={styles.cardTextContainer}>
                <ThemedText style={styles.cardTitle}>Attendance bonus</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  The more consecutive days you sign in, the higher the reward will be.
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
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
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 5,
  },
  header: {
    backgroundColor: '#05012B',
    alignItems: 'center',
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
    flexDirection: 'row',
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
    backgroundColor: '#005b74',
    marginHorizontal: 16,
  },
  bonusLabel: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 8,
  },
  bonusAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bonusDetailsButton: {
    width: '50%',
    backgroundColor: '#001C54',
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#005b74',
    alignSelf: 'center',
  },
  bonusDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00ECBE',
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
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 52,
    height: 52,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#92a8e3',
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
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 120,
  },
  giftsCardImage: {
    width: '100%',
    height: 120,
  },
  giftsCard: {
    backgroundColor: '#EF4444',
  },
  attendanceCard: {
    backgroundColor: '#3B82F6',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTextContainer: {
    height: 100,
    gap: 8,
    backgroundColor: '#011341',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#fff',
    opacity: 0.9,
  },
  bannersSection: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 4,
  },
  bannerCard: {
    position: 'relative',
    backgroundColor: '#011341',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 2,
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
    backgroundColor: '#0D31A9',
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  bannerLogo: {
    width: 100,
    height: 20,
  },
  bannerImagePlaceholder: {
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  bannerImageStyle: {
    resizeMode: 'cover',
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
  noMoreContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noMoreText: {
    fontSize: 14,
    color: '#9BA1A6',
  },
});
