import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const registerPlayer = useAudioPlayer(require("@/assets/register.mp3"));
  const [activeTab, setActiveTab] = useState<"phone" | "email">("phone");

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
  }, []);

  useEffect(() => {
    registerPlayer.seekTo(0);
    registerPlayer.play();
  }, [registerPlayer]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setLoading(true);
    try {
      const res = await login(phone.trim(), password);
      if (res.success && res.token) {
        await authLogin(res.token);
        router.replace("/(tabs)");
      } else {
        setError(res.message ?? "Login failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)")
          }
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerLogoWrap}>
          <Image
            source={
              "https://jalwaimg.jalwa-jalwa.com/Jalwa/other/h5setting_20250315140925tbe6.png"
            }
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Login info section */}
          <View style={styles.infoSection}>
            <ThemedText style={styles.title}>Log in</ThemedText>
            <ThemedText style={styles.subtitle}>
              Please log in with your phone number or email
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              If you forget your password, please contact customer service
            </ThemedText>
          </View>

          <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
            {/* Tabs: phone number | Email Login */}
            <View
              style={{ flexDirection: "row", marginBottom: 24, height: 72 }}
            >
              <Pressable
                style={{
                  flex: 1,
                  height: "100%",
                  alignItems: "center",
                  paddingVertical: 12,
                  justifyContent: "center",
                  gap: 4,
                }}
                onPress={() => setActiveTab("phone")}
              >
                <Image
                  source={
                    activeTab === "phone"
                      ? require("@/assets/Screenshot 2026-02-20 030004.png")
                      : require("@/assets/Screenshot 2026-02-20 030820.png")
                  }
                  style={{ width: 20, height: 26 }}
                />
                <ThemedText
                  style={{
                    color: activeTab === "phone" ? "#00ECBE" : "#92A8E3",
                    fontSize: 17,
                    fontWeight: "600",
                  }}
                >
                  Phone number
                </ThemedText>
                <View
                  style={{
                    height: activeTab === "phone" ? 1.5 : 1.5,
                    width: "100%",
                    backgroundColor:
                      activeTab === "phone" ? "#00ECBE" : "#92A8E3",
                    marginTop: 1,
                  }}
                />
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  height: "100%",
                  alignItems: "center",
                  paddingVertical: 12,
                  justifyContent: "center",
                  gap: 4,
                }}
                onPress={() => setActiveTab("email")}
              >
                <View style={{ width: 29, height: 26 }}>
                  <Image
                    source={
                      activeTab === "email"
                        ? require("@/assets/Screenshot 2026-02-20 030103.png")
                        : require("@/assets/Screenshot 2026-02-20 030832.png")
                    }
                    style={{ width: 29, height: 20 }}
                  />
                </View>
                <ThemedText
                  style={{
                    color: activeTab === "email" ? "#00ECBE" : "#92A8E3",
                    fontSize: 17,
                    fontWeight: "600",
                  }}
                >
                  Email Login
                </ThemedText>
                <View
                  style={{
                    height: activeTab === "email" ? 1.5 : 1,
                    width: "100%",
                    backgroundColor:
                      activeTab === "email" ? "#00ECBE" : "#92A8E3",
                    marginTop: 1,
                  }}
                />
              </Pressable>
            </View>

            {/* Inputs */}
            <View style={styles.form}>
              {activeTab === "phone" ? (
                <View style={styles.field}>
                  <View style={styles.labelRow}>
                    <Image
                      source={require("@/assets/Screenshot 2026-02-20 030004.png")}
                      style={{ width: 20, height: 26 }}
                    />
                    <ThemedText
                      style={{
                        color: "white",
                        fontSize: 17,
                        fontWeight: "400",
                      }}
                    >
                      Phone number
                    </ThemedText>
                  </View>
                  <View style={styles.phoneRow}>
                    <TouchableOpacity style={styles.countryCode}>
                      <ThemedText style={styles.countryCodeText}>
                        +91
                      </ThemedText>
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
              ) : (
                <View style={styles.field}>
                  <View style={styles.labelRow}>
                    <Image
                      source={require("@/assets/Screenshot 2026-02-20 030103.png")}
                      style={{ width: 29, height: 20 }}
                    />
                    <ThemedText
                      style={{
                        color: "white",
                        fontSize: 17,
                        fontWeight: "400",
                      }}
                    >
                      Email Login
                    </ThemedText>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              )}

              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Image
                    source={require("@/assets/Screenshot 2026-02-20 030012.png")}
                    style={{ width: 26, height: 26 }}
                  />
                  <ThemedText
                    style={{ color: "white", fontSize: 17, fontWeight: "400" }}
                  >
                    Password
                  </ThemedText>
                </View>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder=".........."
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

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 24,
                  gap: 10,
                }}
                onPress={() => setRememberPassword(!rememberPassword)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberPassword && styles.checkboxChecked,
                  ]}
                >
                  {rememberPassword && (
                    <View
                      style={{
                        position: "relative",
                        width: 17,
                        height: 17,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={17}
                        color="#ffffff"
                        style={{ position: "absolute" }}
                      />
                      <Ionicons
                        name="checkmark"
                        size={17}
                        color="#ffffff"
                        style={{ position: "absolute", left: 0.5, top: 0.5 }}
                      />
                    </View>
                  )}
                </View>
                <ThemedText style={styles.checkLabel}>
                  Remember password
                </ThemedText>
              </TouchableOpacity>

              {error ? (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              ) : null}
              <TouchableOpacity
                style={[
                  { borderRadius: 9999, overflow: "hidden", marginBottom: 14 },
                  activeTab === "email" && { opacity: 0.5 },
                ]}
                activeOpacity={0.8}
                onPress={activeTab === "phone" ? handleLogin : undefined}
                disabled={activeTab === "email" || loading}
              >
                <LinearGradient
                  colors={["#05B1B7", "#76FBC3"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9999,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <ThemedText
                      style={{
                        color: "black",
                        fontSize: 20,
                        fontWeight: "700",
                        letterSpacing: 2,
                      }}
                    >
                      Log in
                    </ThemedText>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: "#00ECBE",
                  backgroundColor: "transparent",
                }}
                onPress={() => router.replace("/auth/register")}
                activeOpacity={0.8}
              >
                <ThemedText
                  style={{
                    color: "#00ECBE",
                    fontSize: 20,
                    fontWeight: "700",
                    letterSpacing: 2,
                  }}
                >
                  Register
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Footer links */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.footerLink}>
                <Image
                  source={require("@/assets/Screenshot 2026-02-20 030012.png")}
                  style={{ width: 38, height: 40 }}
                />
                <ThemedText
                  style={{ color: "white", fontSize: 13, fontWeight: "600" }}
                >
                  Forgot password
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink}>
                <Image
                  source={require("@/assets/Screenshot 2026-02-20 030138.png")}
                  style={{ width: 40, height: 40 }}
                />
                <ThemedText
                  style={{ color: "white", fontSize: 13, fontWeight: "600" }}
                >
                  Customer Service
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
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
  headerLogoWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerLang: {
    fontSize: 17,
    color: "#00ECBE",
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#011341",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "white",
    marginBottom: 8,
    fontFamily: "sans-serif",
  },
  subtitle: {
    fontSize: 13,
    color: "white",
    lineHeight: 14,
    marginBottom: 4,
    fontFamily: "sans-serif",
  },
  form: {
    marginBottom: 32,
  },
  field: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#011341",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "white",
  },
  phoneRow: {
    flexDirection: "row",
    gap: 10,
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#011341",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  countryCodeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#011341",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "white",
  },
  passwordRow: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00ECBE",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#00ECBE",
    borderColor: "#00ECBE",
  },
  checkLabel: {
    fontSize: 14,
    color: "#92A8E3",
  },
  errorText: {
    fontSize: 13,
    color: "#E53935",
    marginBottom: 12,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
  },
  footerLink: {
    alignItems: "center",
    gap: 8,
  },
});
