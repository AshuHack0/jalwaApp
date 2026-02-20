import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { register as registerApi } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (!password) {
      setError("Please set a password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!inviteCode.trim()) {
      setError("Please enter the invitation code");
      return;
    }
    if (!agreePrivacy) {
      setError("Please agree to the Privacy Agreement");
      return;
    }
    setLoading(true);
    try {
      const res = await registerApi(phone.trim(), password, inviteCode.trim());
      if (res.success && res.token) {
        await authLogin(res.token);
        router.replace("/(tabs)");
      } else {
        setError(res.message ?? "Registration failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerLogoWrap}>
          <Image
            source="https://jalwaimg.jalwa-jalwa.com/Jalwa/other/h5setting_20250315140925tbe6.png"
            style={{ width: 128, height: 32 }}
            contentFit="cover"
          />
        </View>
        <View style={styles.headerRight}>
          <Image
            source="https://www.jalwagame.win/assets/png/en-4c6eba8e.webp"
            style={{ width: 25, height: 25 }}
            contentFit="cover"
          />
          <ThemedText style={styles.headerLang}>EN</ThemedText>
        </View>
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
          <View
            style={{
              height: 114,
              width: "100%",
              backgroundColor: "#021341",
              padding: 20,
            }}
          >
            <ThemedText
              style={{ fontSize: 18, color: "white", fontWeight: "900" }}
            >
              Register
            </ThemedText>
            <ThemedText
              style={{ fontSize: 12, color: "white", fontWeight: "500" }}
            >
              Please register by phone number or email
            </ThemedText>
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View style={{ alignItems: "center", gap: 8, marginBottom: 10}}>
              <Image 
                      source={require("@/assets/Screenshot 2026-02-20 030004.png")}
                      style={{width: 20, height: 26}} 
                    />
              <ThemedText style={styles.registerPhoneLabel}>
                Register your phone
              </ThemedText>
            </View>
            <View style={{ height: 2, backgroundColor: "#00ECBE", marginBottom: 24 }} />

            <View style={styles.form}>
              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Image 
                      source={require("@/assets/Screenshot 2026-02-20 030004.png")}
                      style={{width: 20, height: 26}} 
                    />
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
                  <Image 
                    source={require("@/assets/Screenshot 2026-02-20 030012.png")}
                    style={{width: 26, height: 26}} 
                  />
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
                  <Image 
                    source={require("@/assets/Screenshot 2026-02-20 030012.png")}
                    style={{width: 26, height: 26}} 
                  />
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
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="rgba(255,255,255,0.6)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Image 
                      source={require("@/assets/Adobe Express - file (5).png")}
                      style={{width: 23, height: 26}} 
                    />
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
                    <Ionicons name="checkmark" size={14} color="#05012B" />
                  )}
                </View>
                <ThemedText style={styles.checkLabel}>
                  I have read and agree{" "}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/auth/privacy")}
                >
                  <ThemedText style={styles.privacyLink}>
                    [Privacy Agreement]
                  </ThemedText>
                </TouchableOpacity>
              </TouchableOpacity>

              {error ? (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              ) : null}
              <TouchableOpacity
                style={styles.registerButtonWrap}
                activeOpacity={0.8}
                onPress={handleRegister}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#7AFEC3", "#02AFB6"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <ThemedText style={styles.gradientButtonText}>
                      Register
                    </ThemedText>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.replace("/auth/login")}
                activeOpacity={0.8}
              >
                <ThemedText style={styles.loginRowText}>
                  I have an account{" "}
                </ThemedText>
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
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 52,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogoWrap: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerLang: { fontSize: 17, color: "#00ECBE", fontWeight: "600" },
  registerPhoneLabel: { fontSize: 17, color: "#00ECBE", fontWeight: "600" },
  form: { marginBottom: 32 },
  field: { marginBottom: 20 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  label: { fontSize: 17, color: "white", fontWeight: "500" },
  input: {
    backgroundColor: "#011341",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "white",
  },
  phoneRow: { flexDirection: "row", gap: 10 },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#011341",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  countryCodeText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  phoneInput: {
    flex: 1,
    backgroundColor: "#011341",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "white",
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
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 6,
    flexWrap: "wrap",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#00ECBE",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#00ECBE",
    borderColor: "#00ECBE",
  },
  checkLabel: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  privacyLink: { fontSize: 14, color: "#E53935", fontWeight: "600" },
  errorText: {
    fontSize: 13,
    color: "#E53935",
    marginBottom: 12,
    textAlign: "center",
  },
  registerButtonWrap: {
    borderRadius: 9999,
    overflow: "hidden",
    marginBottom: 14,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  gradientButtonText: { color: "black", fontSize: 20, fontWeight: "900" },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#00ECBE",
    backgroundColor: "transparent",
  },
  loginRowText: { fontSize: 17, color: "white", fontWeight: "600" },
  loginLink: { fontSize: 17, color: "#00ECBE", fontWeight: "900" },
});
