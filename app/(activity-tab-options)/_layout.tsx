import { Stack } from "expo-router";
import { Platform, StatusBar, View } from "react-native";

const ACTIVITY_CATEGORIES_BACKGROUND = "#05012B";

export default function ActivityCategoriesLayout() {
  return (
    <>
    <Stack.Screen options={{headerShown:false}}/>
    <View style={{ flex: 1, backgroundColor: ACTIVITY_CATEGORIES_BACKGROUND }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={ACTIVITY_CATEGORIES_BACKGROUND}
        translucent={true}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "android" ? "ios_from_right" : "simple_push",
          animationDuration: 300,
          animationMatchesGesture: true,
          contentStyle: {
            backgroundColor: ACTIVITY_CATEGORIES_BACKGROUND,
            flex: 1,
          },
        }}
      />
    </View>
      </>
  );
}
