import { ProtectTabs } from "@/components/ProtectedRoute";
import { CustomTabBar } from "@/components/custom-tab-bar";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <>
      <ProtectTabs />
      <Tabs
        initialRouteName="index"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
      <Tabs.Screen
        name="promotion"
        options={{
          title: 'Promotion',
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
        }}
      />
    </Tabs>
    </>
  );
}
