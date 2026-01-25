import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
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

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            {isHome && isFocused ? (
              <View style={styles.homeTabContainer}>
                <LinearGradient
                  colors={['#14B8A6', '#10B981']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.homeTabBackground}
                >
                  <View style={styles.homeTabContent}>
                    <Ionicons name={iconName} size={28} color="#fff" />
                    <Text style={[styles.tabLabel, styles.activeTabLabel]}>{label}</Text>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.regularTab}>
                <Ionicons 
                  name={iconName} 
                  size={28} 
                  color={isFocused ? activeColor : inactiveColor} 
                />
                <Text style={[styles.tabLabel, { color: isFocused ? activeColor : inactiveColor }]}>
                  {label}
                </Text>
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
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regularTab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  homeTabContainer: {
    position: 'absolute',
    top: -25,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTabBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  homeTabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});
