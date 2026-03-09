import { AuthProvider } from "@/contexts/AuthContext";
import { DepositModalProvider } from "@/contexts/DepositModalContext";
import { FirstDepositBonusModal } from "@/components/FirstDepositBonusModal";
import { SplashScreen as AppSplash } from "@/components/SplashScreen";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

const NO_REMINDER_KEY = "@jalwa_no_deposit_reminder_until";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      retry: 1,
    },
  },
});

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#05012B',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const registerPlayer = useAudioPlayer(require("@/assets/register.mp3"));

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    if (appReady) {
      setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
      registerPlayer.seekTo(0);
      registerPlayer.play();
    }
  }, [appReady, registerPlayer]);

  useEffect(() => {
    // Hide native splash soon so our custom splash overlay is visible
    const hideNative = setTimeout(() => SplashScreen.hideAsync(), 100);
    // Then hide our custom splash and show app after minimum display time
    const ready = setTimeout(() => setAppReady(true), 2500);
    return () => {
      clearTimeout(hideNative);
      clearTimeout(ready);
    };
  }, []);

  useEffect(() => {
    if (!appReady) return;
    AsyncStorage.getItem(NO_REMINDER_KEY).then((stored) => {
      if (!stored) {
        setShowBonusModal(true);
        return;
      }
      const until = new Date(stored);
      if (until <= new Date()) {
        setShowBonusModal(true);
        AsyncStorage.removeItem(NO_REMINDER_KEY);
      }
    });
  }, [appReady]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DepositModalProvider>
        <View style={styles.container}>
        <ThemeProvider value={colorScheme === "dark" ? customDarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="wingo" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
        <FirstDepositBonusModal
          visible={showBonusModal}
          onClose={() => setShowBonusModal(false)}
        />
        </ThemeProvider>
      </View>
      {!appReady && (
        <View style={[StyleSheet.absoluteFill, styles.splashOverlay]} pointerEvents="box-only">
          <AppSplash />
        </View>
      )}
        </DepositModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05012B',
  },
  splashOverlay: {
    zIndex: 9999,
    elevation: 9999,
  },
});
