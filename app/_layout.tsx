import { FirstDepositBonusModal } from "@/components/FirstDepositBonusModal";
import { SplashScreen as AppSplash } from "@/components/SplashScreen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DepositModalProvider } from "@/contexts/DepositModalContext";
import { ToastProvider } from "@/contexts/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

const NO_REMINDER_KEY = "@jalwa_no_deposit_reminder_until";

function BonusModalController({ appReady }: { appReady: boolean }) {
  const { isAuthenticated } = useAuth();
  const [showBonusModal, setShowBonusModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !appReady) return;
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
  }, [isAuthenticated, appReady]);

  return (
    <FirstDepositBonusModal
      visible={showBonusModal}
      onClose={() => setShowBonusModal(false)}
    />
  );
}

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
  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    if (appReady) {
      setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
    }
  }, [appReady]);

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

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DepositModalProvider>
        <ToastProvider>
        <View style={styles.container}>
        <ThemeProvider value={colorScheme === "dark" ? customDarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: Platform.OS === "android" ? "ios_from_right" : "simple_push",
            animationDuration: 300,
            animationMatchesGesture: true,
            contentStyle: { backgroundColor: "#05012B" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="wingo" />
          <Stack.Screen name="withdraw" />
          <Stack.Screen name="deposit-history" />
          <Stack.Screen name="withdrawal-history" />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
        <StatusBar style="light" />
        </ThemeProvider>
      </View>
      <BonusModalController appReady={appReady} />
      {!appReady && (
        <View style={[StyleSheet.absoluteFill, styles.splashOverlay]} pointerEvents="box-only">
          <AppSplash />
        </View>
      )}
        </ToastProvider>
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
