import { useAuth } from "@/contexts/AuthContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

function formatBalance(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, walletBalance, refreshWallet } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const carouselWidth = screenWidth - 32; // accounting for padding

  const carouselImages = [
    require('@/assets/Banner_20250319132416d7h9.jpg'),
    require('@/assets/Banner_202503191331431vwd.jpg'),
    require('@/assets/Banner_20250319134711g6c7.jpg'),
    require('@/assets/Banner_202504141354389bes.jpg'),
    require('@/assets/Banner_20250430183534nx9g.jpg'),
    require('@/assets/Banner_202505051626178ysv.png'),
    require('@/assets/Banner_20250505174559l35y.jpg'),
    require('@/assets/Banner_20250509160039hucu.jpg'),
    require('@/assets/Banner_20250728143957ji78.jpg'),
    require('@/assets/Banner_20250812180120amou.jpg'),
    require('@/assets/Banner_20250819005455jgmi.png'),
    require('@/assets/Banner_20250825134813th74.jpg'),
    require('@/assets/Banner_20250925125457tlhn.jpg'),
    require('@/assets/Banner_20251209170621lke3.jpg'),
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % carouselImages.length;
        carouselRef.current?.scrollTo({
          x: nextSlide * carouselWidth,
          animated: true,
        });
        return nextSlide;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length, carouselWidth]);

  const handleScroll = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(offsetX / carouselWidth);
    setCurrentSlide(slideIndex);
  }, [carouselWidth]);

  const gameCategories = [
    { name: 'Lottery', image: require('@/assets/gamecategory_202503131718208r77.png'), backgroundImage: require('@/assets/icon_bg_select-cc5606e6.webp') },
    { name: 'Mini games', image: require('@/assets/gamecategory_20250313171619xdvp.png'), backgroundImage: require('@/assets/icon_bg_select-cc5606e6.webp') },
    { name: 'Hot Slots', image: require('@/assets/gamecategory_202503131717268awj.png'), backgroundImage: require('@/assets/icon_bg_select-cc5606e6.webp') },
    { name: 'Slots', image: require('@/assets/gamecategory_202503131718032ig4.png'), backgroundImage: require('@/assets/icon_bg_select-cc5606e6.webp')  },
    { name: 'Fishing', image: require('@/assets/gamecategory_202503131718208r77.png'), backgroundImage: require('@/assets/icon_bg_select-cc5606e6.webp') },
    { name: 'PVC', image: require('@/assets/gamecategory_202503131718274ean.png'), backgroundImage: require('@/assets/icon_bg_select-cc5606e6.webp') },
    { name: 'Casino', image: require('@/assets/gamecategory_20250313171546obyl.png'), backgroundImage: require('@/assets/icon_bg_select-cc5606e6.webp') },
    { name: 'Sports', image: require('@/assets/gamecategory_20250313171619xdvp.png'), backgroundImage: require('@/assets/icon_bg_select-cc5606e6.webp') },
  ];

  const lotteryGames = [
    {
      name: "WIN GO",
      image: require("@/assets/lotterycategory_20250311104257c812.png"),
    },
    {
      name: "MOTO RACING",
      image: require("@/assets/lotterycategory_20250311104327ptke.png"),
    },
    {
      name: "K3",
      image: require("@/assets/lotterycategory_202503241646119i36.png"),
    },
    {
      name: "5D",
      image: require("@/assets/lotterycategory_20250430143859y2i2.png"),
    },
    {
      name: "TRX WINGO",
      image: require("@/assets/lotterycategory_20250311104257c812.png"),
    },
  ];

  const winners = [
    { id: 'Mem***LHV', amount: '₹48.02', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') ,avatar: require('@/assets/8-ea087ede.webp')},
    { id: 'Mem***ABC', amount: '₹125.50', vendor: require('@/assets/lotterycategory_20250311104327ptke.png') ,avatar: require('@/assets/8-ea087ede.webp')},
    { id: 'Mem***XYZ', amount: '₹89.30', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') ,avatar: require('@/assets/8-ea087ede.webp')},
    { id: 'Mem***DEF', amount: '₹256.80', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') ,avatar: require('@/assets/8-ea087ede.webp')},
    { id: 'Mem***GHI', amount: '₹192.45', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') ,avatar: require('@/assets/8-ea087ede.webp')},
  ];

  const leaderboard = [
    { rank: 1, username: 'Mem***NLR', amount: '1,832,198,343.08', isTop3: true, medal: 'gold' },
    { rank: 2, username: 'SHI***IP', amount: '1,148,305,200.00', isTop3: true, medal: 'silver' },
    { rank: 3, username: 'Mem***HWT', amount: '74,132,198.00', isTop3: true, medal: 'bronze' },
    { rank: 4, username: 'Mem***00A', amount: '64,860,502.28', isTop3: false },
    { rank: 5, username: 'Mem***TTO', amount: '53,753,751.17', isTop3: false },
    { rank: 6, username: 'Mem***XMI', amount: '50,383,957.96', isTop3: false },
    { rank: 7, username: 'GH***TT', amount: '44,927,396.36', isTop3: false },
    { rank: 8, username: 'Mem***5XB', amount: '43,732,264.80', isTop3: false },
    { rank: 9, username: 'DA***S', amount: '32,751,600.00', isTop3: false, emojis: '⚡💀' },
    { rank: 10, username: 'Mem***P2K', amount: '26,403,945.96', isTop3: false },
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo-e926b199.png")}
          style={styles.logoImage}
          contentFit="contain"
        />
        <View style={styles.headerIcons}>
          {/* <TouchableOpacity style={styles.iconButton}>
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
          </TouchableOpacity> */}

          {!isAuthenticated && (
            <>
              <TouchableOpacity
                style={styles.loginButton}
                activeOpacity={0.8}
                onPress={() => router.push("/auth/login")}
              >
                <ThemedText style={styles.loginButtonText}>Log in</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButtonWrap}
                activeOpacity={0.8}
                onPress={() => router.push("/auth/register")}
              >
                <LinearGradient
                  colors={["#00D4FF", "#00E5A8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.registerButton}
                >
                  <ThemedText style={styles.registerButtonText}>
                    Register
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
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
              source={require("@/assets/home1-14aaac97.png")}
              style={styles.promoBannerImage}
              contentFit="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.promoBanner}>
            <Image
              source={require("@/assets/home2-44a54115.png")}
              style={styles.promoBannerImage}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Main Promotional Carousel */}
        <View style={styles.carouselSection}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.carouselScrollView}
            contentContainerStyle={styles.carouselContent}
          >
            {carouselImages.map((image, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.mainCarouselCard, { width: carouselWidth }]}
              >
                <Image 
                  source={image} 
                  style={styles.mainCarouselImage}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.carouselIndicators}>
            {carouselImages.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicator, 
                  index === currentSlide && styles.indicatorActive
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Announcement Bar */}
        <LinearGradient
          colors={['#072766', '#000b2e']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.alertBanner}>
          <Ionicons name="megaphone-outline" size={20} color="#10B981" />
          <ThemedText style={styles.alertText}>
            हमारी कस्टमर सर्विस कभी भी सदस्यों को कोई लिंक नहीं भेजेगी – यदि
            आपको कोई लिंक किसी
          </ThemedText>
          <LinearGradient
          colors={['#75FBC3', '#0CB6B7']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.detailButtonContainer}>
            <ThemedText style={styles.detailButton}>Detail</ThemedText>
          </LinearGradient>
        </LinearGradient> 

        {/* Wallet Balance Section */}
        <View style={styles.walletSection}>
          <View style={[styles.walletBalance, { width: '40%' }]}>
            <View style={styles.walletHeader}>
              <Image 
                source={require('@/assets/coin.png')} 
                style={styles.coinImage}
                contentFit="contain"
              />
              <ThemedText style={styles.walletLabel}>Wallet balance</ThemedText>
            </View>
            <View style={styles.balanceRow}>
              <ThemedText style={styles.balanceAmount}>
                {formatBalance(walletBalance)}
              </ThemedText>
              <TouchableOpacity onPress={refreshWallet}>
                <Ionicons name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.walletButtons, { width: '60%' }]}>
            <TouchableOpacity style={styles.walletButton}>
              <Image 
                source={require('@/assets/91-withdraw_btn-c8a3085c.svg')} 
                style={styles.walletButtonBackground}
                contentFit="cover"
              />
              <View style={styles.walletButtonContent}>
                <Ionicons name="arrow-up" size={20} color="#fff" />
                <ThemedText style={styles.walletButtonText} numberOfLines={1}>Withdraw</ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletButton}>
              <Image 
                source={require('@/assets/91-recharge_btn-ff2482b8.svg')} 
                style={styles.walletButtonBackground}
                contentFit="cover"
              />
              <View style={styles.walletButtonContent}>
                <Ionicons name="arrow-down" size={20} color="#fff" />
                <ThemedText style={styles.walletButtonText} numberOfLines={1}>Deposit</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Game Category Grid */}
        <View style={styles.gameGrid}>
          {gameCategories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.gameCard}>
              <View style={styles.gameCardBackgroundContainer}>
                <Image 
                  source={category.backgroundImage} 
                  style={styles.gameCardBackground}
                  contentFit="cover"
                  />
                <View style={styles.gameIconContainer}>
                  <Image 
                    source={category.image} 
                    style={styles.gameIcon}
                    contentFit="contain"
                    />
                </View>
              </View>
              <ThemedText style={styles.gameName}>{category.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lottery Section */}
        <View style={styles.lotterySection}>
          <View style={styles.lotteryHeader}>
            <Image
              source={require("@/assets/icon_lottery-d44718d5.svg")}
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
                  if (game.name === "WIN GO") {
                    router.push("/wingo");
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
                source={require("@/assets/7001.png")}
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image
                  source={require("@/assets/vendorlogo_20250311105152d49l.png")}
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image
                source={require("@/assets/7002.png")}
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image
                  source={require("@/assets/vendorlogo_20250311105256rbnp.png")}
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image
                source={require("@/assets/7003.png")}
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image
                  source={require("@/assets/vendorlogo_20250311105326ntuv.png")}
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image
                source={require("@/assets/7004.png")}
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image
                  source={require("@/assets/vendorlogo_20250311105339pi1y.png")}
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.casinoGameCard}>
              <Image
                source={require("@/assets/7005.png")}
                style={styles.casinoGameImage}
                contentFit="cover"
              />
              <View style={styles.casinoGameLogo}>
                <Image
                  source={require("@/assets/vendorlogo_202503111054516cx3.png")}
                  style={styles.vendorLogo}
                  contentFit="contain"
                />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Winning Information Section */}
        <View style={styles.winningSection}>
          <View style={styles.lotteryHeader}>
            <Image 
              source={require('@/assets/icon_lottery-d44718d5.svg')} 
              style={styles.lotteryIcon}
              contentFit="contain"
            />
            <ThemedText style={styles.lotteryTitle}>Winning information</ThemedText>
          </View>
          <LinearGradient
            colors={['#072766', '#000b2e']}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.winnersList}
          >
            {winners.map((winner, index) => (
              <View key={index} style={styles.winnerItem}>
                <View style={styles.winnerLeft}>
                  <View style={styles.winnerIcon}>
                    <Image 
                      source={winner.vendor} 
                      style={styles.winnerIconImage}
                      contentFit="contain"
                    />
                  </View>
                </View>
                <View style={styles.winnerIdContainer}>
                  <View style={styles.winnerAmountContainer}>
                    <View style={styles.winnerAvatar}>
                      <Image 
                      source={winner.avatar} 
                      style={styles.winnerIconImage}
                      contentFit="contain"
                    />
                    </View>
                    <ThemedText style={styles.winnerId}>{winner.id}</ThemedText>
                  </View>
                  <View style={styles.winnerRight}>
                    <ThemedText style={styles.winnerLabel}>Winning amount</ThemedText>
                    <ThemedText style={styles.winnerAmount}>{winner.amount}</ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* Today Earning Chart / Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <View style={styles.lotteryHeader}>
            <Image 
              source={require('@/assets/icon_lottery-d44718d5.svg')} 
              style={styles.lotteryIcon}
              contentFit="contain"
            />
            <ThemedText style={styles.lotteryTitle}>Today Earning Chart</ThemedText>
          </View>
          <LinearGradient
            colors={['#212d61', '#000b2e']}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.winnersList}>
            {/* Top Three */}
            <View style={styles.topThree}>
              {/* Rank 2 */}
                <View style={[styles.topThreeCardContent, styles.silverCard]}>
                  <Image 
                    source={require('@/assets/gradient22.png')} 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    contentFit="cover"
                  />
                  <MaskedView
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                    }}
                    maskElement={
                      <LinearGradient
                        colors={['transparent', 'black']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1 }}
                      />
                    }
                  >
                    <BlurView
                      intensity={20}
                      tint="dark"
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </MaskedView>
                  <View style={[styles.topThreeAvatar]}>
                    <Image 
                      source={require('@/assets/1-a6662edb.webp')} 
                      style={[styles.topThreeAvatarImage, { backgroundColor: '#C0C0C0' }]}
                      contentFit="cover"
                    />
                    <Image 
                      source={require('@/assets/crown2-c8aced52.webp')} 
                      style={[styles.crownIcon, { width: 44, height: 44, top: -22, left: -12 }]}
                      contentFit="contain"
                    />
                  </View>
                  <ThemedText style={[styles.topThreeRank, { color: '#C7D6F6' }]}>2</ThemedText>
                  <ThemedText style={[styles.topThreeUsername, { color: '#C7D6F6' }]}>{leaderboard[1].username}</ThemedText>
                  <ThemedText style={[styles.topThreeAmount, { color: '#C7D6F6' }]}>{leaderboard[1].amount}</ThemedText>
                </View>

              {/* Rank 1 */}
                <View style={[styles.topThreeCardContent, styles.goldCard]}>
                  <Image 
                    source={require('@/assets/gradient11.png')} 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    contentFit="cover"
                  />
                      <MaskedView
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                    }}
                    maskElement={
                      <LinearGradient
                        colors={['transparent', 'black']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1 }}
                      />
                    }
                  >
                    <BlurView
                      intensity={20}
                      tint="dark"
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </MaskedView>
                  <View style={styles.topThreeAvatar}>
                    <Image 
                      source={require('@/assets/1-a6662edb.webp')} 
                      style={[styles.topThreeAvatarImage, { backgroundColor: 'rgba(0, 0, 0, 0.2)' }]}
                      contentFit="cover"
                    />
                    <Image 
                      source={require('@/assets/crown1-3912fd85.webp')} 
                      style={[styles.crownIcon, { width: 44, height: 44, top: -22, left: -12 }]}
                      contentFit="contain"
                    />
                  </View>
                  <ThemedText style={[styles.topThreeRank, { color: '#E0BB43', marginTop: 20 }]}>1</ThemedText>
                  <ThemedText style={[styles.topThreeUsername, { color: '#E0BB43' }]}>{leaderboard[0].username}</ThemedText>
                  <ThemedText style={[styles.topThreeAmount, { color: '#E0BB43' }]}>{leaderboard[0].amount}</ThemedText>
                </View>

              {/* Rank 3 */}
                <View style={[styles.topThreeCardContent, styles.bronzeCard]}>
                  <Image 
                    source={require('@/assets/gradient33.png')} 
                   style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    contentFit="cover"
                  />
                      <MaskedView
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                    }}
                    maskElement={
                      <LinearGradient
                        colors={['transparent', 'black']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1 }}
                      />
                    }
                  >
                    <BlurView
                      intensity={20}
                      tint="dark"
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </MaskedView>
                  <View style={styles.topThreeAvatar}>
                    <Image 
                      source={require('@/assets/1-a6662edb.webp')} 
                      style={[styles.topThreeAvatarImage, { backgroundColor: '#FF9051' }]}
                      contentFit="cover"
                    />
                    <Image 
                      source={require('@/assets/crown3-2ca02146.webp')} 
                      style={[styles.crownIcon, { width: 44, height: 44, top: -22, left: -12 }]}
                      contentFit="contain"
                    />
                  </View>
                  <ThemedText style={[styles.topThreeRank, { color: '#FE8423' }]}>3</ThemedText>
                  <ThemedText style={[styles.topThreeUsername, { color: '#FE8423' }]}>{leaderboard[2].username}</ThemedText>
                  <ThemedText style={[styles.topThreeAmount, { color: '#FE8423' }]}>{leaderboard[2].amount}</ThemedText>
                </View>
            </View>

            {/* Rest of Leaderboard */}
            <View style={styles.leaderboardList}>
              {leaderboard.slice(3).map((entry, index) => (
                <View key={index} style={styles.leaderboardItem}>
                  <ThemedText style={styles.leaderboardRank}>{entry.rank}</ThemedText>
                  <View style={styles.leaderboardAvatar}>
                    <Image 
                      source={require('@/assets/6-7c7f5203.webp')} 
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                      contentFit="cover"
                    />
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
          </LinearGradient>
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Image 
              source={require('@/assets/logo-e926b199.png')} 
              style={styles.infoLogo}
              contentFit="contain"
            />
            <View style={styles.ageBadge}>
              <ThemedText style={styles.ageText}>+18</ThemedText>
            </View>
          </View>
          <View style={styles.bulletPoints}>
            <View style={styles.bulletItem}>
              <ThemedText style={styles.bulletIcon}>◆</ThemedText>
              <ThemedText style={styles.bulletText}>
                The platform advocates fairness, justice, and openness. We
                mainly operate fair lottery, blockchain games, live casinos, and
                slot machine games.
              </ThemedText>
            </View>
            <View style={styles.bulletItem}>
              <ThemedText style={styles.bulletIcon}>◆</ThemedText>
              <ThemedText style={styles.bulletText}>
                Jalwa works with more than 10,000 online live game dealers and
                slot games, all of which are verified fair games.
              </ThemedText>
            </View>
            <View style={styles.bulletItem}>
              <ThemedText style={styles.bulletIcon}>◆</ThemedText>
              <ThemedText style={styles.bulletText}>
                Jalwa supports fast deposit and withdrawal, and looks forward to
                your visit.
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.responsibleGambling}>
            <ThemedText style={styles.boldText}>
              Gambling can be addictive, please play rationally.
            </ThemedText>{" "}
            Jalwa only accepts customers above the age of 18.
          </ThemedText>
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
    position: 'relative',
    flex: 1,
  },
  scrollContent: {
    paddingTop: 86,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 6,
    backgroundColor: "#05012B",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logoImage: {
    width: 120,
    height: 32,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconButton: {
    padding: 4,
  },
  loginButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(10, 20, 45, 0.9)",
    borderWidth: 1,
    borderColor: "#00D4FF",
  },
  loginButtonText: {
    color: "#00D4FF",
    fontSize: 14,
    fontWeight: "600",
  },
  registerButtonWrap: {
    borderRadius: 4,
    overflow: "hidden",
  },
  registerButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#0a0e27",
    fontSize: 14,
    fontWeight: "600",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  languageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  promoBanners: {
    // backgroundColor: 'red',
    flexDirection: "row",
    gap: 0,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  promoBanner: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    height: 60,
  },
  promoBannerImage: {
    width: "100%",
    height: "100%",
    opacity: 1,
    backgroundColor: "transparent",
    resizeMode: "contain",
  },
  carouselSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  carouselScrollView: {
    marginBottom: 12,
  },
  carouselContent: {
    alignItems: 'center',
  },
  mainCarouselCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
    position: 'relative',
    marginRight: 0,
  },
  mainCarouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    padding: 20,
  },
  carouselMainTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  newBadge: {
    backgroundColor: "#EF4444",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  carouselGameTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FBBF24",
  },
  carouselTagline: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  noticeSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  noticeCard: {
    backgroundColor: "#1a0a3d",
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EF4444",
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
    marginBottom: 12,
  },
  officialWebsite: {
    gap: 8,
  },
  officialLabel: {
    fontSize: 14,
    color: "#FBBF24",
  },
  officialUrl: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F97316",
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 12,
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  indicatorActive: {
    width: 24,
    backgroundColor: "#14B8A6",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    paddingVertical:1,
    marginHorizontal: 16,
    borderRadius: 15,
    borderWidth:1,
    borderColor:"#1F4293",
    marginBottom: 16,
    gap: 12,
  },
  alertText: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    lineHeight: 17,
  },
  detailButtonContainer: {
    backgroundColor: '#14B8A6',
    paddingVertical: 2,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  detailButton: {
    color: '#05012B',
    fontSize: 14,
    fontWeight: '400',
  },
  walletSection: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 2,
  },
  walletBalance: {
    // backgroundColor: 'blue',
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
},
  yellowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
  },
  coinImage: {
    width: 20,
    height: 20,
  },
  walletLabel: {
    color: '#92A8E3',
    fontSize: 13,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  walletButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  walletButton: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
    minHeight: 48,  
  },
  walletButtonBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  walletButtonContent: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 0,
    zIndex: 1,
  },
  withdrawButton: {
    backgroundColor: "#F97316",
  },
  depositButton: {
    backgroundColor: "#EF4444",
  },
  walletButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    flexShrink: 0,
  },
  gameGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  gameCard: {
    width: '22%',
    alignItems: 'center',
    borderRadius: 12,
    gap: 8,
    position: 'relative',
    marginBottom: 5,
  },
  gameCardBackgroundContainer: {
    padding: 12,
    position: 'relative',
    width: '100%',
    height: 75,
  },
  gameCardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gameIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    top: -15,
    bottom: 0,
    left: 0,
    right: 0,
    // Remove explicit height so it can center vertically/horizontally in parent (full container)
  },
  gameIcon: {
    width: 85,
    height: 85,
    zIndex: 2,
  },
  gameName: {
    marginTop: -10,
    color: '#6F80A4',
    fontSize: 14,
    textAlign: 'center',
  },
  lotterySection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  lotteryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  lotteryIcon: {
    width: 24,
    height: 24,
  },
  lotteryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  lotteryGamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  lotteryGameCard: {
    width: "47%",
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
  },
  lotteryGameImage: {
    width: "100%",
    height: "100%",
  },
  casinoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  casinoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  casinoIcon: {
    fontSize: 20,
  },
  casinoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
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
    overflow: "hidden",
    position: "relative",
  },
  casinoGameImage: {
    width: "100%",
    height: "100%",
  },
  casinoGameLogo: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 60,
    height: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 4,
    padding: 4,
  },
  vendorLogo: {
    width: "100%",
    height: "100%",
  },
  winningSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  winningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  winningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  winnersList: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#224BA2',
    paddingHorizontal: 12,
  },
  winnerItem: {
    // backgroundColor: 'green',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  winnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  winnerIdContainer: {
  },
  winnerAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  winnerIcon: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerIconImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16, 
  },
  winnerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  winnerId: {
    fontSize: 15,
    color: '#fff',
  },
  winnerRight: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  winnerLabel: {
    fontSize: 15,
    color: '#9BA1A6',
    marginBottom: 4,
  },
  winnerAmount: {
    fontSize: 15,
    color: '#00ecbe',
  },
  leaderboardSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: "center",
  },
  topThree: {
    width: '100%',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  topThreeCard: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    gap: 8,
    maxWidth: 120,
  },
  topThreeCardContent: {
    position: 'relative',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  goldCard: {
    width: '40%',
    height: 112,
    marginTop: 76,
  },
  silverCard: {
    width: '30%',
    height: 82,
    marginTop: 26,
  },
  bronzeCard: {
    width: '30%',
    marginTop: 26,
    height: 85,
  },
  topThreeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'absolute',
    top: -35,
    left: '50%',
    marginLeft: -32,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topThreeAvatarImage: {
    width: '95%',
    height: '95%',
    borderRadius: 32,
  },
  crownIcon: {
    position: 'absolute',
    top: -22,
    left: -12,
    zIndex: 10,
  },
  topThreeRank: {
    marginTop: 45,
    fontSize: 28,
    lineHeight: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  topThreeUsername: {
    fontSize: 11,
    lineHeight: 10,
    color: '#fff',
    fontWeight: '500',
  },
  topThreeAmount: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  leaderboardList: {
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: "hidden",
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#224BA2',
    gap: 12,
  },
  leaderboardRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92A8E3',
    width: 30,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  leaderboardUsernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  leaderboardUsername: {
    fontSize: 14,
    color: "#fff",
  },
  leaderboardEmojis: {
    fontSize: 14,
  },
  leaderboardAmount: {
    fontSize: 14,
    fontWeight: 'medium',
    color: '#00ecbe',
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    // backgroundColor: 'blue',
  },
  infoLogo: {
    width: 165,
    height: 30,
  },
  ageBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00ecbe',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 70,
  },
  ageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ecbe', 
  },
  bulletPoints: {
    gap: 12,
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: "row",
    gap: 12,
  },
  bulletIcon: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#9BA1A6",
    lineHeight: 20,
    fontFamily:'',
  },
  responsibleGambling: {
    fontSize: 14,
    color: "#9BA1A6",
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "bold",
    color: "#fff",
  },
  addToDesktopSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    zIndex: 100,
  },
  addToDesktopButton: {
    borderRadius: 38,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#224BA2',
    width: '55%',
    alignSelf: 'center',
  },
  addToDesktopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    gap: 12,
  },
  addToDesktopLogo: {
    width: 30,
    height: 30,
  },
  addToDesktopText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
