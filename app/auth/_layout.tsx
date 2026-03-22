import { Stack } from "expo-router";

const AUTH_BACKGROUND = "#0f1117";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: AUTH_BACKGROUND },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="privacy" />
    </Stack>
  );
}
