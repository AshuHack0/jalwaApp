import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const activeColor = '#14B8A6'; // Light blue-green
  const inactiveColor = '#9BA1A6'; // Grey

  const icons = {
    promotion: 'heart-outline',
    activity: 'gift-outline',
    index: 'game-controller-outline',
    wallet: 'wallet-outline',
    account: 'happy-outline',
  };

  const activeIcons = {
    promotion: 'heart',
    activity: 'gift',
    index: 'game-controller',
    wallet: 'wallet',
    account: 'happy',
  };

  // Add your custom icons here - use require('@/assets/...') for each tab
  // When provided, custom icons will be used instead of Ionicons
  const customIcons: Partial<Record<string, number>> = {
    promotion: require('@/assets/t6_promotion-a029ef45.webp'), // require('@/assets/tab_promotion.png'),
    activity: require('@/assets/t6_activity-5e528f8c.webp'),  // require('@/assets/tab_activity.png'),
    index: require('@/assets/t6_home-0a6ae2d5.webp'),     // require('@/assets/tab_home.png'),
    wallet: require('@/assets/t6_wallet-3ae41933.webp'),    // require('@/assets/tab_wallet.png'),
    account: require('@/assets/t6_main-bad84e0d.webp'),   // require('@/assets/tab_account.png'),
  };

  const customIconsActive: Partial<Record<string, number>> = {
    promotion: require('@/assets/t6_promotion_a-923d9ced.webp'), // require('@/assets/tab_promotion_active.png'),
    activity: require('@/assets/t6_activity_a-9c24c442.webp'),  // require('@/assets/tab_activity_active.png'),
    index: undefined,     // require('@/assets/tab_home_active.png'),
    wallet: require('@/assets/t6_wallet_a-60eb81d6.webp'),    // require('@/assets/tab_wallet_active.png'),
    account: require('@/assets/t6_main_a-a7e8e1b6.webp'),   // require('@/assets/tab_account_active.png'),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (options.tabBarLabel ?? options.title ?? route.name) as string;
        const isFocused = state.index === index;
        const isHome = route.name === 'index';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = isFocused 
          ? (activeIcons[route.name as keyof typeof activeIcons] || 'circle')
          : (icons[route.name as keyof typeof icons] || 'circle-outline');

        const customIcon = isFocused 
          ? (customIconsActive[route.name] ?? customIcons[route.name])
          : customIcons[route.name];

        const isHomeWithCustomIcon = isHome && customIcon;
        const isRegularTabActive = !isHome && isFocused && customIcon;
        const IconComponent = customIcon ? (
          <Image
            source={customIcon}
            style={
              isHomeWithCustomIcon 
                ? styles.tabHomeIconFull 
                : isRegularTabActive 
                ? styles.tabCustomIconActive 
                : styles.tabCustomIcon
            }
            contentFit="contain"
          />
        ) : (
          <Ionicons 
            name={iconName as any} 
            size={28} 
            color={isHome && isFocused ? '#fff' : (isFocused ? activeColor : inactiveColor)} 
          />
        );

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={(options as any).tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            {isHome && isFocused ? (
              <View style={styles.homeTabContainer}>
                <View style={styles.homeTabContent}>
                  {IconComponent}
                  {isHomeWithCustomIcon ? (
                    <Text style={[styles.tabLabel, styles.activeTabLabel, styles.homeLabelOnImage]}>{label}</Text>
                  ) : (
                    <Text style={[styles.tabLabel, styles.activeTabLabel]}>{label}</Text>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.regularTab}>
                {IconComponent}
                {isHomeWithCustomIcon ? (
                  <Text style={[styles.tabLabel, styles.homeLabelOnImage, { color: isFocused ? activeColor : inactiveColor }]}>{label}</Text>
                ) : (
                  <Text style={[styles.tabLabel, { color: isFocused ? activeColor : inactiveColor }]}>{label}</Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#05012B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
    paddingTop: 10,
    position: 'relative',
    overflow: 'visible',
    marginBottom: 0,
  },
  tabItem: {
  paddingBottom: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regularTab: {
    height: 70,
    width: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 15,
    gap: 4,
  },
  homeTabContainer: {
    position: 'absolute',
    top: -26,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTabBackground: {
    width: 70,
    height: 70,
     
  },
  homeTabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  homeLabelOnImage: {
    marginTop: -20,
    fontSize: 11,
    fontWeight: '600',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  tabCustomIcon: {
    width: 20,
    height: 20,
  },
  tabCustomIconActive: {
    position: 'absolute',
    top: 10,
    width: 50,
    height: 50,
  },
  tabHomeIconFull: {
    width: 70,
    height: 70,
  },
});
