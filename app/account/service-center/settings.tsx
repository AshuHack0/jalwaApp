import { ThemedView } from "@/components/themed-view";
import { router, Stack } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomHeader } from "@/components/ui/CustomHeader";

// ── Icons ────────────────────────────────────────────────────────────────────
function IconBox({ emoji }: { emoji: string }) {
  return (
    <View style={styles.iconBox}>
      <Text style={styles.iconEmoji}>{emoji}</Text>
    </View>
  );
}

// ── Chevron ──────────────────────────────────────────────────────────────────
function Chevron() {
  return <Text style={styles.chevron}>{">"}</Text>;
}

// ── Setting Row ──────────────────────────────────────────────────────────────
function SettingRow({
  imgg,
  label,
  value,
  onPress,
}: {
  imgg: any;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Image
          source={imgg}
          style={[
            {
              width: 20,
              height: 20,
              resizeMode: "contain",
            },
          ]}
        />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingRight}>
        <Text style={styles.settingValue}>{value}</Text>
        <Image
          source={require("@/assets/Screenshot202603-09p230133-removebg-preview.png")}
          style={[
            {
              width: 18,
              height: 18,
              transform: [{ rotate: "180deg" }],
              resizeMode: "contain",
              opacity: 0.7,
              marginRight: 5,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* <StatusBar barStyle="light-content" backgroundColor="#060B2E" /> */}

        <CustomHeader title="Settings Center" onBack={() => router.back()} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "#011341",
              flex: 1,
              height: 200,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          ></View>

          <View
            style={{
              padding: 16,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            {/* ── Profile Card ── */}
            <View style={styles.card}>
              {/* Avatar row */}
              <View style={styles.avatarRow}>
                <View style={styles.avatarCircle}>
                  <Image
                    source={require("@/assets/1-a6662edb.webp")}
                    style={[
                      {
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.changeAvatarBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.changeAvatarText}>Change avatar</Text>
                  <Image
                    source={require("@/assets/Screenshot202603-09p230133-removebg-preview.png")}
                    style={[
                      {
                        width: 20,
                        height: 20,
                        transform: [{ rotate: "180deg" }],
                        resizeMode: "contain",
                        opacity: 0.6,
                        marginRight: 5,
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.cardDivider} />

              {/* Nickname */}
              <TouchableOpacity style={styles.profileRow} activeOpacity={0.7}>
                <Text style={styles.profileLabel}>Nickname</Text>
                <View style={styles.profileRight}>
                  <Text style={styles.profileValue}>MiRACLE</Text>
                  <Image
                    source={require("@/assets/Screenshot202603-09p230133-removebg-preview.png")}
                    style={[
                      {
                        width: 20,
                        height: 20,
                        transform: [{ rotate: "180deg" }],
                        resizeMode: "contain",
                        opacity: 0.6,
                        marginRight: 5,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.cardDivider} />

              {/* UID */}
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>UID</Text>
                <View style={styles.profileRight}>
                  <Text style={styles.profileValue}>3659199</Text>
                  <TouchableOpacity style={styles.copyBtn} activeOpacity={0.7}>
                    <Image
                      source={require("@/assets/copypast.png")}
                      style={[
                        {
                          width: 24,
                          height: 24,
                          resizeMode: "contain",
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ── Security Section Header ── */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Security information</Text>
            </View>

            {/* ── Security Card ── */}
            <View>
              <SettingRow
                imgg={require("@/assets/Screenshot 2026-02-20 030012.png")}
                label="Login password"
                value="Edit"
              />
              {/* <View style={styles.rowDivider} /> */}
              <SettingRow
                imgg={require("@/assets/Screenshot 2026-02-20 030103.png")}
                label="Bind mailbox"
                value="to bind"
              />
              {/* <View style={styles.rowDivider} /> */}
              <SettingRow
                imgg={require("@/assets/iicon.png")}
                label="Updated version"
                value="1.0.9"
              />
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const BG = "#060B2E";
const CARD_BG = "#0A1540";
const TEAL = "#2BC4C4";
const TEAL_DIM = "#4A9EBF";
const DIVIDER = "#0F1D55";
const ICON_BG = "#0D4A4A";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    position: "relative",
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: "#05012B",
    zIndex: 2,
    width: "100%",
  },
  scrollContent: { padding: 0, paddingBottom: 48 },

  // Card
  card: {
    backgroundColor: "#001C54",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  cardDivider: {
    height: 1,
    backgroundColor: DIVIDER,
  },

  // Avatar
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1E2E70",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarEmoji: { fontSize: 38 },
  changeAvatarBtn: { flexDirection: "row", alignItems: "center" },
  changeAvatarText: { color: TEAL_DIM, fontSize: 15 },

  // Profile rows
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  profileLabel: { color: TEAL_DIM, fontSize: 15 },
  profileRight: { flexDirection: "row", alignItems: "center" },
  profileValue: { color: "#fff", fontSize: 15, marginRight: 2 },
  copyBtn: { paddingLeft: 8 },
  copyIcon: { color: TEAL_DIM, fontSize: 16 },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: -12,
  },
  sectionAccent: {
    width: 3,
    height: 20,
    backgroundColor: TEAL,
    // borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // Setting rows
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#011341",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    height: 38,
    width: 38,
    borderRadius: 10,
    backgroundColor: "#013E5A",
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: ICON_BG,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconEmoji: { fontSize: 17 },
  settingLabel: { flex: 1, color: "#fff", fontSize: 15 },
  settingRight: { flexDirection: "row", alignItems: "center" },
  settingValue: { color: TEAL_DIM, fontSize: 14 },
  rowDivider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginLeft: 52,
  },

  // Chevron
  chevron: { color: "#4A6FA5", fontSize: 16, marginLeft: 4 },
});
