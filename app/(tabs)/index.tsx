import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [walletBalance] = useState('₹0.00');

  const gameCategories = [
    { name: 'Lottery', image: require('@/assets/gamecategory_20250313171546obyl.png') },
    { name: 'Mini games', image: require('@/assets/gamecategory_20250313171619xdvp.png') },
    { name: 'Hot Slots', image: require('@/assets/gamecategory_202503131717268awj.png') },
    { name: 'Slots', image: require('@/assets/gamecategory_202503131718032ig4.png') },
    { name: 'Fishing', image: require('@/assets/gamecategory_202503131718208r77.png') },
    { name: 'PVC', image: require('@/assets/gamecategory_202503131718274ean.png') },
    { name: 'Casino', image: require('@/assets/gamecategory_20250313171546obyl.png') },
    { name: 'Sports', image: require('@/assets/gamecategory_20250313171619xdvp.png') },
  ];

  const lotteryGames = [
    { name: 'WIN GO', image: require('@/assets/lotterycategory_20250311104257c812.png') },
    { name: 'MOTO RACING', image: require('@/assets/lotterycategory_20250311104327ptke.png') },
    { name: 'K3', image: require('@/assets/lotterycategory_202503241646119i36.png') },
    { name: '5D', image: require('@/assets/lotterycategory_20250430143859y2i2.png') },
    { name: 'TRX WINGO', image: require('@/assets/lotterycategory_20250311104257c812.png') },
  ];

  const winners = [
    { id: 'Mem***LHV', amount: '₹48.02' },
    { id: 'Mem***ABC', amount: '₹125.50' },
    { id: 'Mem***XYZ', amount: '₹89.30' },
    { id: 'Mem***DEF', amount: '₹256.80' },
    { id: 'Mem***GHI', amount: '₹192.45' },
  ];

  const leaderboard = [
    { rank: 1, username: 'Mem***NLR', amount: '₹1,832,198,343.08', isTop3: true, medal: 'gold' },
    { rank: 2, username: 'SHI***IP', amount: '₹1,148,305,200.00', isTop3: true, medal: 'silver' },
    { rank: 3, username: 'Mem***HWT', amount: '₹74,132,198.00', isTop3: true, medal: 'bronze' },
    { rank: 4, username: 'Mem***00A', amount: '₹64,860,502.28', isTop3: false },
    { rank: 5, username: 'Mem***TTO', amount: '₹53,753,751.17', isTop3: false },
    { rank: 6, username: 'Mem***XMI', amount: '₹50,383,957.96', isTop3: false },
    { rank: 7, username: 'GH***TT', amount: '₹44,927,396.36', isTop3: false },
    { rank: 8, username: 'Mem***5XB', amount: '₹43,732,264.80', isTop3: false },
    { rank: 9, username: 'DA***S', amount: '₹32,751,600.00', isTop3: false, emojis: '⚡💀' },
    { rank: 10, username: 'Mem***P2K', amount: '₹26,403,945.96', isTop3: false },
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/logo-e926b199.png')} 
          style={styles.logoImage}
          contentFit="contain"
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="arrow-down" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="cloud-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.languageButton}>
              <Ionicons name="flag" size={14} color="#fff" />
              <ThemedText style={styles.languageText}>EN</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotional Banners */}
        <View style={styles.promoBanners}>
          <TouchableOpacity style={styles.promoBanner}>
            <Image 
              source={require('@/assets/home1-14aaac97.svg')} 
              style={styles.promoBannerImage}
              contentFit="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.promoBanner}>
            <Image 
              source={require('@/assets/home2-44a54115.svg')} 
              style={styles.promoBannerImage}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Main Promotional Carousel */}
        <View style={styles.carouselSection}>
          <TouchableOpacity style={styles.mainCarouselCard}>
            <Image 
              source={require('@/assets/Banner_202504141354389bes.jpg')} 
              style={styles.mainCarouselImage}
              contentFit="cover"
            />
            <View style={styles.carouselOverlay}>
              <View style={styles.carouselContent}>
                <ThemedText style={styles.carouselMainTitle}>Introducing Our Newest Game Addition</ThemedText>
                <View style={styles.newBadge}>
                  <ThemedText style={styles.newBadgeText}>NEW</ThemedText>
                </View>
                <ThemedText style={styles.carouselGameTitle}>Moto Racing Lottery</ThemedText>
                <ThemedText style={styles.carouselTagline}>Bet Your Lucky Racer & Win Big Now!</ThemedText>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.carouselIndicators}>
            <View style={[styles.indicator, styles.indicatorActive]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>

        {/* Warning/Notice Section */}
        <View style={styles.noticeSection}>
          <View style={styles.noticeCard}>
            <ThemedText style={styles.noticeTitle}>Notice: Beware of Fake Platforms!</ThemedText>
            <ThemedText style={styles.noticeText}>
              Recently, we have discovered third-party websites impersonating our platform to conduct scams or unauthorized promotions. Please stay vigilant and avoid accessing unverified websites to prevent potential financial loss.
            </ThemedText>
            <View style={styles.officialWebsite}>
              <ThemedText style={styles.officialLabel}>Our only official website is:</ThemedText>
              <ThemedText style={styles.officialUrl}>https://jalwa.games/</ThemedText>
            </View>
          </View>
        </View>

        {/* Announcement Bar */}
        <View style={styles.alertBanner}>
          <Ionicons name="megaphone-outline" size={20} color="#10B981" />
          <ThemedText style={styles.alertText}>
            हमारी कस्टमर सर्विस कभी भी सदस्यों को कोई लिंक नहीं भेजेगी – यदि आपको कोई लिंक किसी
          </ThemedText>
          <TouchableOpacity style={styles.detailButtonContainer}>
            <ThemedText style={styles.detailButton}>Detail</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Wallet Balance Section */}
        <View style={styles.walletSection}>
          <View style={styles.walletBalance}>
            <View style={styles.walletHeader}>
              <View style={styles.yellowDot} />
              <ThemedText style={styles.walletLabel}>Wallet balance</ThemedText>
            </View>
            <View style={styles.balanceRow}>
              <ThemedText style={styles.balanceAmount}>{walletBalance}</ThemedText>
              <TouchableOpacity>
                <Ionicons name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.walletButtons}>
            <TouchableOpacity style={[styles.walletButton, styles.withdrawButton]}>
              <Ionicons name="arrow-up" size={20} color="#fff" />
              <ThemedText style={styles.walletButtonText}>Withdraw</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.walletButton, styles.depositButton]}>
              <Ionicons name="arrow-down" size={20} color="#fff" />
              <ThemedText style={styles.walletButtonText}>Deposit</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Game Category Grid */}
        <View style={styles.gameGrid}>
          {gameCategories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.gameCard}>
              <View style={styles.gameIconContainer}>
                <Image 
                  source={category.image} 
                  style={styles.gameIcon}
                  contentFit="contain"
                />
              </View>
              <ThemedText style={styles.gameName}>{category.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lottery Section */}
        <View style={styles.lotterySection}>
          <View style={styles.lotteryHeader}>
            <Image 
              source={require('@/assets/icon_lottery-d44718d5.svg')} 
              style={styles.lotteryIcon}
              contentFit="contain"
            />
            <ThemedText style={styles.lotteryTitle}>Lottery</ThemedText>
          </View>
          <View style={styles.lotteryGamesGrid}>
            {lotteryGames.map((game, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.lotteryGameCard}
                onPress={() => {
                  if (game.name === 'WIN GO') {
                    router.push('/wingo');
                  }
                }}
              >
                <Image 
                  source={game.image} 
                  style={styles.lotteryGameImage}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Casino Section */}
        <View style={styles.casinoSection}>
          <View style={styles.casinoHeader}>
            <ThemedText style={styles.casinoIcon}>🎰</ThemedText>
            <ThemedText style={styles.casinoTitle}>Casino</ThemedText>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.casinoGamesScroll}
            contentContainerStyle={styles.casinoGamesContainer}
          >
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image 
                source={require('@/assets/7001.png')} 
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image 
                  source={require('@/assets/vendorlogo_20250311105152d49l.png')} 
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image 
                source={require('@/assets/7002.png')} 
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image 
                  source={require('@/assets/vendorlogo_20250311105256rbnp.png')} 
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image 
                source={require('@/assets/7003.png')} 
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image 
                  source={require('@/assets/vendorlogo_20250311105326ntuv.png')} 
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image 
                source={require('@/assets/7004.png')} 
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image 
                  source={require('@/assets/vendorlogo_20250311105339pi1y.png')} 
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image 
                source={require('@/assets/7005.png')} 
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image 
                  source={require('@/assets/vendorlogo_202503111054516cx3.png')} 
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Winning Information Section */}
        <View style={styles.winningSection}>
          <View style={styles.winningHeader}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <ThemedText style={styles.winningTitle}>Winning information</ThemedText>
          </View>
          <View style={styles.winnersList}>
            {winners.map((winner, index) => (
              <View key={index} style={styles.winnerItem}>
              <View style={styles.winnerLeft}>
                <View style={styles.winnerIcon}>
                  <Image 
                    source={require('@/assets/icon_win-91513609.svg')} 
                    style={styles.winnerIconImage}
                    contentFit="contain"
                  />
                </View>
                  <View style={styles.winnerAvatar}>
                    <Ionicons name="person" size={20} color="#9BA1A6" />
                  </View>
                  <ThemedText style={styles.winnerId}>{winner.id}</ThemedText>
                </View>
                <View style={styles.winnerRight}>
                  <ThemedText style={styles.winnerLabel}>Winning amount</ThemedText>
                  <ThemedText style={styles.winnerAmount}>{winner.amount}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Today Earning Chart / Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <ThemedText style={styles.leaderboardTitle}>Today Earning Chart</ThemedText>
          <View style={styles.topThree}>
            {/* Rank 2 */}
            <View style={[styles.topThreeCard, styles.silverCard]}>
              <View style={styles.topThreeAvatar}>
                <Ionicons name="person" size={32} color="#fff" />
                <Ionicons name="medal" size={20} color="#C0C0C0" style={styles.crownIcon} />
              </View>
              <ThemedText style={styles.topThreeRank}>2</ThemedText>
              <ThemedText style={styles.topThreeUsername}>{leaderboard[1].username}</ThemedText>
              <ThemedText style={styles.topThreeAmount}>{leaderboard[1].amount}</ThemedText>
            </View>

            {/* Rank 1 */}
            <View style={[styles.topThreeCard, styles.goldCard]}>
              <View style={styles.topThreeAvatar}>
                <Ionicons name="person" size={40} color="#fff" />
                <Ionicons name="medal" size={24} color="#FFD700" style={styles.crownIcon} />
              </View>
              <ThemedText style={styles.topThreeRank}>1</ThemedText>
              <ThemedText style={styles.topThreeUsername}>{leaderboard[0].username}</ThemedText>
              <ThemedText style={styles.topThreeAmount}>{leaderboard[0].amount}</ThemedText>
            </View>

            {/* Rank 3 */}
            <View style={[styles.topThreeCard, styles.bronzeCard]}>
              <View style={styles.topThreeAvatar}>
                <Ionicons name="person" size={32} color="#fff" />
                <Ionicons name="medal" size={20} color="#CD7F32" style={styles.crownIcon} />
              </View>
              <ThemedText style={styles.topThreeRank}>3</ThemedText>
              <ThemedText style={styles.topThreeUsername}>{leaderboard[2].username}</ThemedText>
              <ThemedText style={styles.topThreeAmount}>{leaderboard[2].amount}</ThemedText>
            </View>
          </View>

          {/* Rest of Leaderboard */}
          <View style={styles.leaderboardList}>
            {leaderboard.slice(3).map((entry, index) => (
              <View key={index} style={styles.leaderboardItem}>
                <ThemedText style={styles.leaderboardRank}>{entry.rank}</ThemedText>
                <View style={styles.leaderboardAvatar}>
                  <Ionicons name="person" size={24} color="#9BA1A6" />
                </View>
                <View style={styles.leaderboardUsernameContainer}>
                  <ThemedText style={styles.leaderboardUsername}>{entry.username}</ThemedText>
                  {entry.emojis && (
                    <ThemedText style={styles.leaderboardEmojis}>{entry.emojis}</ThemedText>
                  )}
                </View>
                <ThemedText style={styles.leaderboardAmount}>{entry.amount}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <ThemedText style={styles.infoLogo}>Jalwa<ThemedText style={{ color: '#10B981' }}>.</ThemedText>Game</ThemedText>
            <View style={styles.ageBadge}>
              <ThemedText style={styles.ageText}>+18</ThemedText>
            </View>
          </View>
          <View style={styles.bulletPoints}>
            <View style={styles.bulletItem}>
              <ThemedText style={styles.bulletIcon}>◆</ThemedText>
              <ThemedText style={styles.bulletText}>
                The platform advocates fairness, justice, and openness. We mainly operate fair lottery, blockchain games, live casinos, and slot machine games.
              </ThemedText>
            </View>
            <View style={styles.bulletItem}>
              <ThemedText style={styles.bulletIcon}>◆</ThemedText>
              <ThemedText style={styles.bulletText}>
                Jalwa works with more than 10,000 online live game dealers and slot games, all of which are verified fair games.
              </ThemedText>
            </View>
            <View style={styles.bulletItem}>
              <ThemedText style={styles.bulletIcon}>◆</ThemedText>
              <ThemedText style={styles.bulletText}>
                Jalwa supports fast deposit and withdrawal, and looks forward to your visit.
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.responsibleGambling}>
            <ThemedText style={styles.boldText}>Gambling can be addictive, please play rationally.</ThemedText> Jalwa only accepts customers above the age of 18.
          </ThemedText>
        </View>

        {/* Add to Desktop Button */}
        <View style={styles.addToDesktopSection}>
          <LinearGradient
            colors={['#3B82F6', '#10B981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addToDesktopButton}
          >
            <TouchableOpacity style={styles.addToDesktopContent}>
              <ThemedText style={styles.addToDesktopLogo}>Jalwa<ThemedText style={{ color: '#10B981' }}>.</ThemedText>Game</ThemedText>
              <ThemedText style={styles.addToDesktopText}>Add to Desktop</ThemedText>
            </TouchableOpacity>
          </LinearGradient>
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
    paddingTop: 120,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#05012B',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoImage: {
    width: 120,
    height: 32,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  languageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  promoBanners: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  promoBanner: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    height: 100,
  },
  promoBannerImage: {
    width: '100%',
    height: '100%',
  },
  carouselSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  mainCarouselCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
    marginBottom: 12,
  },
  mainCarouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  carouselContent: {
    gap: 12,
  },
  carouselMainTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  newBadge: {
    backgroundColor: '#EF4444',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  carouselGameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FBBF24',
  },
  carouselTagline: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  noticeSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  noticeCard: {
    backgroundColor: '#1a0a3d',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 12,
  },
  officialWebsite: {
    gap: 8,
  },
  officialLabel: {
    fontSize: 14,
    color: '#FBBF24',
  },
  officialUrl: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F97316',
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#14B8A6',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
  },
  alertText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
  },
  detailButtonContainer: {
    backgroundColor: '#14B8A6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  detailButton: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  walletSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  walletBalance: {
    flex: 1,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  yellowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
  },
  walletLabel: {
    color: '#9BA1A6',
    fontSize: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  walletButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  walletButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  withdrawButton: {
    backgroundColor: '#F97316',
  },
  depositButton: {
    backgroundColor: '#EF4444',
  },
  walletButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  gameCard: {
    width: '22%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIcon: {
    width: 48,
    height: 48,
  },
  gameName: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
  },
  lotterySection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  lotteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  lotteryIcon: {
    width: 24,
    height: 24,
  },
  lotteryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  lotteryGamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  lotteryGameCard: {
    width: '47%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  lotteryGameImage: {
    width: '100%',
    height: '100%',
  },
  casinoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  casinoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  casinoIcon: {
    fontSize: 20,
  },
  casinoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  casinoGamesScroll: {
    marginHorizontal: -16,
  },
  casinoGamesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  casinoGameCard: {
    width: 160,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  casinoGameImage: {
    width: '100%',
    height: '100%',
  },
  casinoGameLogo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 60,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    padding: 4,
  },
  vendorLogo: {
    width: '100%',
    height: '100%',
  },
  winningSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  winningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  winningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  winnersList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  winnerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  winnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  winnerIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerIconImage: {
    width: 32,
    height: 32,
  },
  winnerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerId: {
    fontSize: 14,
    color: '#fff',
  },
  winnerRight: {
    alignItems: 'flex-end',
  },
  winnerLabel: {
    fontSize: 12,
    color: '#9BA1A6',
    marginBottom: 4,
  },
  winnerAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14B8A6',
  },
  leaderboardSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  topThree: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 24,
  },
  topThreeCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    maxWidth: 120,
  },
  goldCard: {
    backgroundColor: '#FFD700',
    marginBottom: -20,
  },
  silverCard: {
    backgroundColor: '#C0C0C0',
  },
  bronzeCard: {
    backgroundColor: '#CD7F32',
  },
  topThreeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  crownIcon: {
    position: 'absolute',
    top: -12,
    zIndex: 10,
  },
  topThreeRank: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  topThreeUsername: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  topThreeAmount: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  leaderboardList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  leaderboardRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    width: 30,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardUsernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  leaderboardUsername: {
    fontSize: 14,
    color: '#fff',
  },
  leaderboardEmojis: {
    fontSize: 14,
  },
  leaderboardAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  ageBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  bulletPoints: {
    gap: 12,
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    gap: 12,
  },
  bulletIcon: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#9BA1A6',
    lineHeight: 20,
  },
  responsibleGambling: {
    fontSize: 14,
    color: '#9BA1A6',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  addToDesktopSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  addToDesktopButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addToDesktopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  addToDesktopLogo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  addToDesktopText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
