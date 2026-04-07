import { Stack } from "expo-router";
import { Platform } from "react-native";

const AUTH_BACKGROUND = "#05012B";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "android" ? "ios_from_right" : "simple_push",
        animationDuration: 300,
        animationMatchesGesture: true,
        contentStyle: { backgroundColor: AUTH_BACKGROUND },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="privacy" />
    </Stack>
  );
}
