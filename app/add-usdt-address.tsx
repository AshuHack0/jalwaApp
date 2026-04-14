import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const USDT_ICON = require("@/assets/payNameIcon_20250317165636a3yk.png");

export default function AddUsdtAddressScreen() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [alias, setAlias] = useState("");
  const [network, setNetwork] = useState("TRC");

  const isFormValid = address.trim() !== "" && alias.trim() !== "";

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Add USDT address</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Safety Alert */}
        <View style={styles.safetyAlert}>
          <Ionicons name="alert-circle-outline" size={20} color="#EE6B6C" />
          <ThemedText style={styles.safetyAlertText}>
            To ensure the safety of your funds, please link your wallet
          </ThemedText>
        </View>

        {/* Select main network */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={require("@/assets/usdtIcon1.png")} style={styles.usdtIcon} resizeMode="contain" />
            <ThemedText style={styles.sectionTitle}>Select main network</ThemedText>
          </View>
          <View style={styles.dropdown}>
            <ThemedText style={styles.dropdownText}>{network}</ThemedText>
            <Ionicons name="chevron-down" size={20} color="#61759B" />
          </View>
        </View>

        {/* USDT Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Image source={require("@/assets/usdtIcon2.png")} style={styles.usdtIcon} resizeMode="contain" />
            </View>
            <ThemedText style={styles.sectionTitle}>USDT Address</ThemedText>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Please enter the USDT address"
              placeholderTextColor="#6E80A4"
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        {/* Address Alias */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
                          <Image source={require("@/assets/usdtIcon3.png")} style={styles.usdtIcon} resizeMode="contain" />

            <ThemedText style={styles.sectionTitle}>Address Alias</ThemedText>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Please enter a remark of the withdrawal address"
              placeholderTextColor="#6E80A4"
              value={alias}
              onChangeText={setAlias}
            />
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
          disabled={!isFormValid}
          onPress={() => {
            // Logic to save address
            router.back();
          }}
        >
          <ThemedText style={styles.saveButtonText}>Save</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  safetyAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#021243",
    padding: 12,
    borderRadius: 50,
    marginBottom: 30,
  },
  safetyAlertText: {
    color: "#D23838",
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
    lineHeight: 15
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 12,
    fontWeight: "500",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#011341",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 8,
  },
  dropdownText: {
    color: "#6E80A4",
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: "#011341",
    borderRadius: 8,
  },
  input: {
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 230, 118, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  usdtIcon: {
    width: 30,
    height: 30,
  },
  saveButton: {
    backgroundColor: "#CACCDB",
    paddingVertical: 10,
    borderRadius: 35,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 100,
  },
  saveButtonDisabled: {
    backgroundColor: "#CACCDB",
  },
  saveButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
  },
  floatingButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
