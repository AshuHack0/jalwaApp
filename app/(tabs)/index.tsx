import { useAuth } from "@/contexts/AuthContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const WINNER_ITEM_HEIGHT = 78;

function formatBalance(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, walletBalance, refreshWallet } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Lottery');
  const [showGameErrorModal, setShowGameErrorModal] = useState(false);
  const carouselRef = useRef<ScrollView>(null);
  const winnersScrollRef = useRef<ScrollView>(null);
  const winnersScrollY = useRef(0);
  const screenWidth = Dimensions.get('window').width;
  const carouselWidth = screenWidth - 32; // accounting for padding
  const sectionPadding = 16;
  const categoryGridGap = 12;
  const categoryContentWidth = screenWidth - sectionPadding * 2;
  const categoryCardWidth2 = (categoryContentWidth - categoryGridGap) / 2; // Lottery: 2 per row
  const categoryCardWidth3 = (categoryContentWidth - categoryGridGap * 2) / 3; // Others: 3 per row

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

  const activeBg = require('@/assets/icon_bg_select-cc5606e6.webp');
  const inactiveBg = require('@/assets/icon_bg-f97e2540.webp');

  const gameCategories = [
    {
      name: 'Lottery',
      image: require('@/assets/gamecategory_202503131718208r77.png'),
      icon: require('@/assets/icon_lottery-d44718d5.svg'), // section header icon - replace with your icon
      backgroundImage: activeBg,
      inactiveBackgroundImage: inactiveBg,
      games: [
        { name: "WIN GO", image: require("@/assets/lotterycategory_20250311104257c812.png") },
        { name: "MOTO RACING", image: require("@/assets/lotterycategory_20250311104327ptke.png") },
        { name: "K3", image: require("@/assets/lotterycategory_202503241646119i36.png") },
        { name: "5D", image: require("@/assets/lotterycategory_20250430143859y2i2.png") },
        { name: "TRX WINGO", image: require("@/assets/lotterycategory_2025031110434143p3.png") },
      ],
    },
    {
      name: 'Mini games',
      image: require('@/assets/gamecategory_20250313171619xdvp.png'),
      icon: require('@/assets/icon_mini-9bd4090f.svg'), // TODO: replace with your icon
      backgroundImage: activeBg,
      inactiveBackgroundImage: inactiveBg,
      games: [
        { name: "Game 1", image: require("@/assets/800_20250324182314304.png") }, // TODO: replace image
        { name: "Game 2", image: require("@/assets/810_20250324182331029.png") }, // TODO: replace image 
        { name: "Game 3", image: require("@/assets/804.png") }, // TODO: replace image 
        { name: "Game 4", image: require("@/assets/804.png") },  
        { name: "Game 5", image: require("@/assets/812.png") },
        { name: "Game 6", image: require("@/assets/813.png") }, 
        { name: "Game 7", image: require("@/assets/814.png") },
        { name: "Game 8", image: require("@/assets/903.png") },
        { name: "Game 9", image: require("@/assets/501.png") },
        { name: "Game 10", image: require("@/assets/502.png") },
        { name: "Game 12", image: require("@/assets/504.png") },
        { name: "Game 13", image: require("@/assets/505.png") },
        
      ],
    },
    {
      name: 'Hot Slots', 
      image: require('@/assets/gamecategory_20250313171546obyl.png'),
      icon: require('@/assets/icon_lottery-d44718d5.svg'), // TODO: replace with your icon
      backgroundImage: activeBg,
      inactiveBackgroundImage: inactiveBg,
      games: [
        { name: "Slot 1", image: require("@/assets/800_20250324182314304.png") }, // TODO: replace image
        { name: "Slot 2", image: require("@/assets/810_20250324182331029.png") }, // TODO: replace image 
        { name: "Slot 3", image: require("@/assets/804.png") }, // TODO: replace image 
        { name: "Slot 4", image: require("@/assets/7003.png") }, // TODO: replace image
        { name: "Slot 5", image: require("@/assets/49.png") }, // TODO: replace image 
        { name: "Slot 6", image: require("@/assets/289.png") }, // TODO: replace image
      ],
    },
    {
      name: 'Slots',
      image: require('@/assets/gamecategory_202503131718274ean.png'), 
      icon: require('@/assets/icon_lottery-d44718d5.svg'), // TODO: replace with your icon
      backgroundImage: activeBg,
      inactiveBackgroundImage: inactiveBg,
      games: [
        { name: "Slot 1", image: require("@/assets/212.png") }, // TODO: replace image
        { name: "Slot 2", image: require("@/assets/42.png") }, // TODO: replace image 
        { name: "Slot 3", image: require("@/assets/7005.png") }, // TODO: replace image\\
        { name: "Slot 4", image: require("@/assets/7006.png") }, // TODO: replace image\\
        { name: "Slot 5", image: require("@/assets/7007.png") }, // TODO: replace image\\
        { name: "Slot 6", image: require("@/assets/AT01.png") }, // TODO: replace image\\
        { name: "Slot 7", image: require("@/assets/7009.png") }, // TODO: replace image\\
        { name: "Slot 8", image: require("@/assets/7010.png") }, // TODO: replace image\\ 
        { name: "Slot 9", image: require("@/assets/20.png") }, // TODO: replace image\\
        { name: "Slot 10", image: require("@/assets/82.png") }, // TODO: replace image\\
      ],
    },
    {
      name: 'Fishing',
      image: require('@/assets/gamecategory_202503131716285jqk.png'),
      icon: require('@/assets/icon_fish-80dac6e1.svg'), // TODO: replace with your icon
      backgroundImage: activeBg,
      inactiveBackgroundImage: inactiveBg,
      games: [
        { name: "Fishing 16", image: require("@/assets/32.png") }, // TODO: replace image\\
        { name: "Fishing 1", image: require("@/assets/7001.png") }, // TODO: replace image
        { name: "Fishing 13", image: require("@/assets/464.png") }, // TODO: replace image
        { name: "Fishing 2", image: require("@/assets/7002.png") }, // TODO: replace image 
        { name: "Fishing 20", image: require("@/assets/1.png") }, // TODO: replace image
        { name: "Fishing 3", image: require("@/assets/7003.png") }, // TODO: replace image
        { name: "Fishing 4", image: require("@/assets/7004.png") }, // TODO: replace image\\
        { name: "Fishing 5", image: require("@/assets/7005.png") }, // TODO: replace image\\
        { name: "Fishing 6", image: require("@/assets/7006.png") }, // TODO: replace image\\
        { name: "Fishing 7", image: require("@/assets/7007.png") }, // TODO: replace image\\
        { name: "Fishing 8", image: require("@/assets/AT01.png") }, // TODO: replace image\\
        { name: "Fishing 9", image: require("@/assets/7009.png") }, // TODO: replace image\\
        { name: "Fishing 10", image: require("@/assets/7010.png") }, // TODO: replace image\\ 
        { name: "Fishing 11", image: require("@/assets/20.png") }, // TODO: replace image\\
        { name: "Fishing 15", image: require("@/assets/82.png") }, // TODO: replace image\\
       
      ],
    },
    {
      name: 'PVC',
      image: require('@/assets/gamecategory_202503131717268awj.png'),
      icon: require('@/assets/icon_chess-b71f3e88.svg'), // TODO: replace with your icon
      backgroundImage: activeBg,
      inactiveBackgroundImage: inactiveBg,
      games: [
        { name: "PVC 1", image: require("@/assets/vendorlogo_202503111054058v6w.png") }, // TODO: replace image
        { name: "PVC 2", image: require("@/assets/vendorlogo_20250311105339pi1y.png") }, // TODO: replace image
        { name: "PVC 3", image: require("@/assets/vendorlogo_20250830165501she8.png") }, // TO
      ],
    },
    {
      name: 'Casino',
      image: require('@/assets/gamecategory_202503131718032ig4.png'), 
 
    
      icon: require('@/assets/icon_video-da93a00c.svg'), // TODO: replace with your icon
      backgroundImage: activeBg,
      inactiveBackgroundImage: inactiveBg,
      games: [
        { name: "Casino 6", image: require("@/assets/vendorlogo_20250311105326ntuv.png") },
        { name: "Casino 4", image: require("@/assets/vendorlogo_202503111054418bsk.png") },
        { name: "Casino 3", image: require("@/assets/vendorlogo_20250311105152d49l.png") },
       
        { name: "Casino 2", image: require("@/assets/vendorlogo_20250607164818rmhc.png") },
     
       
        { name: "Casino 5", image: require("@/assets/vendorlogo_20250311105431knjh.png") },  
        { name: "Casino 1", image: require("@/assets/vendorlogo_202503111054516cx3.png") },
       
      ],
    },
    {
      name: 'Sports',
      image: require('@/assets/gamecategory_20250315182024qtyt.png'),
      icon: require('@/assets/icon_lottery-d44718d5.svg'), // TODO: replace with your icon
      backgroundImage: activeBg,
      inactiveBackgroundImage: inactiveBg,
      games: [
        { name: "Sport 1", image: require("@/assets/vendorlogo_20250311105256rbnp.png") }, // TODO: replace image
        { name: "Sport 2", image: require("@/assets/vendorlogo_2025031116174076n9.png") }, // TODO: replace image
      ],
    },
  ];

  const avatarPool = [
    require('@/assets/8-ea087ede.webp'),
    require('@/assets/1-a6662edb.webp'),
    require('@/assets/6-7c7f5203.webp'),
    require('@/assets/7003.png'),
    require('@/assets/7004.png'),
    require('@/assets/7005.png'),
    require('@/assets/7006.png'),
    require('@/assets/7007.png'),
    require('@/assets/7009.png'),
  ];

  const winnersRaw = [
    { id: 'Mem***LHV', amount: '₹48.02', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***ABC', amount: '₹125.50', vendor: require('@/assets/lotterycategory_20250311104327ptke.png') },
    { id: 'Mem***XYZ', amount: '₹89.30', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***DEF', amount: '₹256.80', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***GHI', amount: '₹192.45', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***JKL', amount: '₹192.45', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***MNO', amount: '₹192.45', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***PQR', amount: '₹192.45', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***STU', amount: '₹192.45', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***VWX', amount: '₹192.45', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
    { id: 'Mem***YZ', amount: '₹192.45', vendor: require('@/assets/vendorlogo_20250311105256rbnp.png') },
  ];

  const winners = useMemo(() => winnersRaw.map((w) => ({
    ...w,
    avatar: avatarPool[Math.floor(Math.random() * avatarPool.length)],
  })), []);

  // Winners list auto-scroll (new winner scrolls to top, old one moves down)
  useEffect(() => {
    const maxScroll = Math.max(0, winners.length * WINNER_ITEM_HEIGHT - WINNER_ITEM_HEIGHT * 4.5);
    winnersScrollY.current = maxScroll;
    winnersScrollRef.current?.scrollTo({ y: maxScroll, animated: false });

    const interval = setInterval(() => {
      const nextY = winnersScrollY.current - WINNER_ITEM_HEIGHT;
      if (nextY <= 0) {
        winnersScrollY.current = maxScroll;
        winnersScrollRef.current?.scrollTo({ y: maxScroll, animated: false });
      } else {
        winnersScrollY.current = nextY;
        winnersScrollRef.current?.scrollTo({ y: nextY, animated: true });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [winners.length]);

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
          {gameCategories.map((category, index) => {
            const isActive = selectedCategory === category.name;
            return (
              <TouchableOpacity
                key={index}
                style={styles.gameCard}
                onPress={() => setSelectedCategory(category.name)}
                activeOpacity={0.8} 
               
              >
                <View style={styles.gameCardBackgroundContainer}>
                  <Image
                    source={isActive ? category.backgroundImage : category.inactiveBackgroundImage}
                    style={styles.gameCardBackground}
                    contentFit="contain"
                  />
                  <View style={styles.gameIconContainer}>
                    <Image
                      source={category.image}
                      style={styles.gameIcon}
                      contentFit="contain"
                    />
                  </View>
                </View>
                <ThemedText style={[styles.gameName, isActive && styles.gameNameActive]} numberOfLines={1} ellipsizeMode="tail">{category.name}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>  

        {/* Dynamic Category Section */}
        <View style={styles.lotterySection}>
          {(() => {
            const category = gameCategories.find((c) => c.name === selectedCategory);
            return (
              <>
          <View style={styles.lotteryHeader}>
            {category?.icon && (
              <Image
                source={category.icon}
                style={styles.lotteryIcon}
                contentFit="contain"
              />
            )}
            <ThemedText style={styles.lotteryTitle}>{selectedCategory}</ThemedText>
          </View>

          {(() => {
            const games = category?.games ?? [];
            if (games.length === 0) {
              return (
                <View style={styles.categoryPlaceholder}>
                  <ThemedText style={styles.categoryPlaceholderText}>Coming soon</ThemedText>
                </View>
              );
            }
            const isLottery = selectedCategory === 'Lottery';
            const cardWidth = isLottery ? categoryCardWidth2 : categoryCardWidth3;
            const cardHeight = isLottery ? 100 : 140;
            return (
              <View style={[styles.lotteryGamesGrid, { gap: categoryGridGap }]}>
                {games.map((game) => (
                  <TouchableOpacity
                    key={game.name}
                    style={[styles.categoryGameCardBase, { width: cardWidth, height: cardHeight }]}
                    onPress={() => {
                      if (game.name === "WIN GO") {
                        router.push("/wingo");
                      } else {
                        setShowGameErrorModal(true);
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
            );
          })()}
              </>
            );
          })()}
        </View>

        {/* Winning Information Section */}
        <View style={styles.winningSection}>
          <View style={styles.lotteryHeader}>
            <Image 
              source={require('@/assets/icon_win-91513609.svg')} 
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
            <View style={styles.winnersScrollWrapper}>
              <ScrollView
                ref={winnersScrollRef}
                style={styles.winnersScrollView}
                contentContainerStyle={styles.winnersScrollContent}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={(e) => {
                  winnersScrollY.current = e.nativeEvent.contentOffset.y;
                }}
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
              </ScrollView>
              <LinearGradient
                colors={['#072766', 'transparent']}
                style={styles.winnersFadeTop}
                pointerEvents="none"
              />
            </View>
          </LinearGradient>
        </View>

        {/* Today Earning Chart / Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <View style={styles.lotteryHeader}>
            <Image 
              source={require('@/assets/icon_rank-432901c9.svg')} 
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

        {/* Game Error Modal */}
        <Modal
          visible={showGameErrorModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowGameErrorModal(false)}
        >
          <TouchableOpacity
            style={styles.gameErrorOverlay}
            activeOpacity={1}
            onPress={() => setShowGameErrorModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={styles.gameErrorPopup}
            >
              <View style={styles.gameErrorIconRow}>
                <View style={styles.gameErrorRedCircle}>
                  <Ionicons name="alert-circle" size={20} color="#fff" />
                </View>
                <View style={styles.gameErrorYellowTriangle}>
                  <Ionicons name="warning" size={32} color="#000" />
                </View>
              </View>
              <ThemedText style={styles.gameErrorTitle}>Game Error</ThemedText>
              <ThemedText style={styles.gameErrorMessage}>
                The Hack Only supports Lottery Games.
              </ThemedText>
              <TouchableOpacity
                style={styles.gameErrorButton}
                onPress={() => setShowGameErrorModal(false)}
              >
                <ThemedText style={styles.gameErrorButtonText}>OK</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
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
    gap: 7,
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
    padding: 1,
  },
  mainCarouselImage: {
    width: "100%",     // 👈 smaller than 100%
    height: "95%",
    padding: 10,
    alignSelf: "center",
    resizeMode: "contain",
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
    marginTop: 0,
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
  gameNameActive: {
    color: '#fff',
  },
  categoryPlaceholder: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  categoryPlaceholderText: {
    color: '#6F80A4',
    fontSize: 16,
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
  categoryGameCardBase: {
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryGameCardColumn: {
    flexDirection: 'column',
  },
  hotSlotsImageContainer: {
    width: '100%',
    height: 100,
  },
  lotteryGameImage: {
    width: "100%",
    height: "100%",
  },
  rtpBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#14B8A6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 3,
  },
  rtpLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rtpValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
    paddingHorizontal: 1,
  },
  winnersScrollWrapper: {
    position: 'relative',
    paddingTop: 20,
  },
  winnersScrollView: {
    maxHeight: WINNER_ITEM_HEIGHT * 4.5,
  },
  winnersScrollContent: {
    paddingTop: 8,
    paddingBottom: 2,
  },
  winnersFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    pointerEvents: 'none',
  },
  winnerItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    minHeight: WINNER_ITEM_HEIGHT,
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
  gameErrorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  gameErrorPopup: {
    backgroundColor: '#0f1635',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  gameErrorIconRow: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  gameErrorRedCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameErrorYellowTriangle: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameErrorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  gameErrorMessage: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  gameErrorButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  gameErrorButtonText: {
    color: '#05012B',
    fontSize: 16,
    fontWeight: '600',
  },
});
