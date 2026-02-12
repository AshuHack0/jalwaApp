import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TEAL = "#00D4FF";
const TEAL_GREEN = "#00E5A8";

export default function RegisterScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerLogo}>Jalwa.Game</ThemedText>
        <View style={styles.headerRight}/>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoSection}>
            <ThemedText style={styles.title}>Register</ThemedText>
            <ThemedText style={styles.subtitle}>
              Please register by phone number or email
            </ThemedText>
          </View>

          <View style={styles.registerPhoneHeader}>
            <Ionicons name="call-outline" size={20} color={TEAL_GREEN} />
            <ThemedText style={styles.registerPhoneLabel}>
              Register your phone
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="call-outline" size={18} color={TEAL_GREEN} />
                <ThemedText style={styles.label}>Phone number</ThemedText>
              </View>
              <View style={styles.phoneRow}>
                <TouchableOpacity style={styles.countryCode}>
                  <ThemedText style={styles.countryCodeText}>+91</ThemedText>
                  <Ionicons name="chevron-down" size={16} color="#fff" />
                </TouchableOpacity>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Please enter the phone number"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="lock-closed-outline" size={18} color={TEAL_GREEN} />
                <ThemedText style={styles.label}>Set password</ThemedText>
              </View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Set password"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="rgba(255,255,255,0.6)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="lock-closed-outline" size={18} color={TEAL_GREEN} />
                <ThemedText style={styles.label}>Confirm password</ThemedText>
              </View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Confirm password"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="rgba(255,255,255,0.6)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="mail-outline" size={18} color={TEAL_GREEN} />
                <ThemedText style={styles.label}>Invite code</ThemedText>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Please enter the invitation code"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={inviteCode}
                onChangeText={setInviteCode}
              />
            </View>

            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setAgreePrivacy(!agreePrivacy)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  agreePrivacy && styles.checkboxChecked,
                ]}
              >
                {agreePrivacy && (
                  <Ionicons name="checkmark" size={14} color={TEAL_GREEN} />
                )}
              </View>
              <ThemedText style={styles.checkLabel}>I have read and agree </ThemedText>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/auth/privacy")}
              >
                <ThemedText style={styles.privacyLink}>[Privacy Agreement]</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButtonWrap} activeOpacity={0.8}>
              <LinearGradient
                colors={[TEAL, TEAL_GREEN]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <ThemedText style={styles.gradientButtonText}>Register</ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <ThemedText style={styles.loginRowText}>I have an account </ThemedText>
              <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                <ThemedText style={styles.loginLink}>Login</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05012B" },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: "#05012B",
  },
  headerIcon: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerLogo: { fontSize: 18, fontWeight: "700", color: "#fff" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerLang: { fontSize: 14, color: "#fff", fontWeight: "600" },
  infoSection: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 20 },
  registerPhoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  registerPhoneLabel: { fontSize: 16, color: TEAL_GREEN, fontWeight: "600" },
  form: { marginBottom: 32 },
  field: { marginBottom: 20 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  label: { fontSize: 14, color: "#fff", fontWeight: "500" },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  phoneRow: { flexDirection: "row", gap: 10 },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  countryCodeText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  phoneInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 48 },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  checkRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 6, flexWrap: "wrap" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: TEAL_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {},
  checkLabel: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  privacyLink: { fontSize: 14, color: "#E53935", fontWeight: "600" },
  registerButtonWrap: { borderRadius: 9999, overflow: "hidden", marginBottom: 20 },
  gradientButton: { paddingVertical: 16, alignItems: "center", justifyContent: "center", borderRadius: 9999 },
  gradientButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  loginRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  loginRowText: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  loginLink: { fontSize: 14, color: TEAL_GREEN, fontWeight: "600" },
});
