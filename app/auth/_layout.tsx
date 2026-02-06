import { Stack } from "expo-router";

const AUTH_BACKGROUND = "#05012B";

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
