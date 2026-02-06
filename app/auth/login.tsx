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

export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
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

          {/* Tabs: phone number | Email Login */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("phone")}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={activeTab === "phone" ? TEAL : "#fff"}
              />
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === "phone" && styles.tabTextActive,
                ]}
              >
                phone number
              </ThemedText>
              {activeTab === "phone" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("email")}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={activeTab === "email" ? TEAL : "#fff"}
              />
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === "email" && styles.tabTextActive,
                ]}
              >
                Email Login
              </ThemedText>
              {activeTab === "email" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View style={styles.form}>
            {activeTab === "phone" ? (
              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Ionicons name="call-outline" size={18} color={TEAL} />
                  <ThemedText style={styles.label}>Phone number</ThemedText>
                </View>
                <View style={styles.phoneRow}>
                  <TouchableOpacity style={styles.countryCode}>
                    <ThemedText style={styles.countryCodeText}>+91</ThemedText>
                    <Ionicons name="chevron-down" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="9801403783"
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
                  <Ionicons name="mail-outline" size={18} color={TEAL} />
                  <ThemedText style={styles.label}>Email</ThemedText>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="lock-closed-outline" size={18} color={TEAL} />
                <ThemedText style={styles.label}>Password</ThemedText>
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
              style={styles.checkRow}
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
                  <Ionicons name="checkmark" size={14} color={TEAL} />
                )}
              </View>
              <ThemedText style={styles.checkLabel}>Remember password</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButtonWrap}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[TEAL, TEAL_GREEN]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                <ThemedText style={styles.loginButtonText}>Log in</ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.replace("/auth/register")}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.registerButtonText}>Register</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Footer links */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerLink}>
              <Ionicons name="lock-closed-outline" size={22} color={TEAL} />
              <ThemedText style={styles.footerLinkText}>Forgot password</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Ionicons name="headset-outline" size={22} color={TEAL} />
              <ThemedText style={styles.footerLinkText}>Customer Service</ThemedText>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: "#05012B",
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerLang: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
    marginBottom: 4,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },
  tabTextActive: {
    color: TEAL,
    fontWeight: "600",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 2,
    backgroundColor: TEAL,
    borderRadius: 1,
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
  label: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
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
  phoneRow: {
    flexDirection: "row",
    gap: 10,
  },
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
  countryCodeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
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
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "transparent",
  },
  checkLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  loginButtonWrap: {
    borderRadius: 9999,
    overflow: "hidden",
    marginBottom: 14,
  },
  loginButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  registerButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: TEAL,
    backgroundColor: "rgba(10, 20, 45, 0.9)",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  footerLink: {
    alignItems: "center",
    gap: 8,
  },
  footerLinkText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
});
