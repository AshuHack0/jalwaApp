import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useToast } from "@/contexts/ToastContext";

export default function UPIPaymentScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [upiName, setUpiName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [confirmUpiId, setConfirmUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No initial fetch, keeping it clean as per feedback
    setLoading(false);
  }, []);

  const handleSave = async () => {
    if (upiId !== confirmUpiId) {
      showToast({
        type: "warning",
        title: "Mismatch",
        message: "UPI IDs do not match.",
      });
      return;
    }

    setSubmitting(true);
    // Mock save behavior
    setTimeout(() => {
      setSubmitting(false);
      showToast({
        type: "success",
        title: "Saved",
        message: "UPI details saved successfully.",
      });
      router.back();
    }, 1000);
  };

  const isFormValid =
    upiName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    upiId.trim() !== "" &&
    confirmUpiId.trim() !== "" &&
    upiId === confirmUpiId;

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ECBE" />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Payment method</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* UPI Banner */}
        <View style={styles.upiBanner}>
          <View style={styles.upiBannerContent}>
            <Image
              source={require("@/assets/WithBeforeImgIcon2_20250802174209t2y7.png")}
              style={styles.upiLogo}
              resizeMode="contain"
            />
            <ThemedText style={styles.upiBannerText}>Information UPI</ThemedText>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>

          {/* UPI Name */}
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.label}>UPI Name</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="SATYAJIT SAHOO"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={upiName}
                onChangeText={setUpiName}
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.label}>phone number</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Please enter the phone number"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.hintContainer}>
              <Ionicons name="information-circle-outline" size={14} color="#00ECBE" />
              <ThemedText style={styles.hintText}>
                For the security of your account, please fill in your real mobile phone number
              </ThemedText>
            </View>
          </View>

          {/* UPI ID */}
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.label}>UPI ID</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Please enter your UPI ID"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Confirm UPI ID */}
          <View style={styles.fieldGroup}>
            <ThemedText style={styles.label}>Confirm UPI ID</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Please enter your UPI ID"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={confirmUpiId}
                onChangeText={setConfirmUpiId}
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          )}
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  upiBanner: {
    borderRadius: 8,
    marginVertical: 20,
    overflow: "hidden",
  },
  upiBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  upiLogo: {
    width: 60,
    height: 30,
    marginRight: 10,
  },
  upiBannerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#011341",
    borderRadius: 6,
  },
  input: {
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  hintContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: "#00ECBE",
    lineHeight: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#05012B",
  },
  saveButton: {
    backgroundColor: "#353F54",
    paddingVertical: 16,
    paddingBottom:40,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
