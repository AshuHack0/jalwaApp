import { AuthProvider } from "@/contexts/AuthContext";
import { SplashScreen as AppSplash } from "@/components/SplashScreen";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds
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

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
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
        <View style={styles.container}>
        <ThemeProvider value={colorScheme === "dark" ? customDarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="wingo" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
        </ThemeProvider>
      </View>
      {!appReady && (
        <View style={[StyleSheet.absoluteFill, styles.splashOverlay]} pointerEvents="box-only">
          <AppSplash />
        </View>
      )}
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
