import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";

const ACTIVITY_CATEGORIES_BACKGROUND = "#05012B";

export default function ActivityCategoriesLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: ACTIVITY_CATEGORIES_BACKGROUND }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={ACTIVITY_CATEGORIES_BACKGROUND}
        translucent={true}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: ACTIVITY_CATEGORIES_BACKGROUND,
            flex: 1,
          },
        }}
      />
    </View>
  );
}
