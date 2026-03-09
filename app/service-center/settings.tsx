import { ThemedView } from '@/components/themed-view';
import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Custom Header ────────────────────────────────────────────────────────────
function CustomHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <Text style={styles.backIcon}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {/* Spacer to keep title centered */}
      <View style={styles.backBtn} />
    </View>
  );
}

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
  return <Text style={styles.chevron}>{'>'}</Text>;
}

// ── Setting Row ──────────────────────────────────────────────────────────────
function SettingRow({
  emoji,
  label,
  value,
  onPress,
}: {
  emoji: string;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <IconBox emoji={emoji} />
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingRight}>
        <Text style={styles.settingValue}>{value}</Text>
        <Chevron />
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
        {/* ── Profile Card ── */}
        <View style={styles.card}>
          {/* Avatar row */}
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🧑‍🦱</Text>
            </View>
            <TouchableOpacity style={styles.changeAvatarBtn} activeOpacity={0.7}>
              <Text style={styles.changeAvatarText}>Change avatar</Text>
              <Chevron />
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          {/* Nickname */}
          <TouchableOpacity style={styles.profileRow} activeOpacity={0.7}>
            <Text style={styles.profileLabel}>Nickname</Text>
            <View style={styles.profileRight}>
              <Text style={styles.profileValue}>MiRACLE</Text>
              <Chevron />
            </View>
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* UID */}
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>UID</Text>
            <View style={styles.profileRight}>
              <Text style={styles.profileValue}>3659199</Text>
              <TouchableOpacity style={styles.copyBtn} activeOpacity={0.7}>
                <Text style={styles.copyIcon}>⧉</Text>
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
        <View style={styles.card}>
          <SettingRow emoji="🔒" label="Login password" value="Edit" />
          <View style={styles.rowDivider} />
          <SettingRow emoji="✉️" label="Bind mailbox" value="to bind" />
          <View style={styles.rowDivider} />
          <SettingRow emoji="ℹ️" label="Updated version" value="1.0.9" />
        </View>
      </ScrollView>
    </ThemedView>
  </>);
}

// ── Styles ───────────────────────────────────────────────────────────────────
const BG = '#060B2E';
const CARD_BG = '#0A1540';
const TEAL = '#2BC4C4';
const TEAL_DIM = '#4A9EBF';
const DIVIDER = '#0F1D55';
const ICON_BG = '#0D4A4A';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    backgroundColor: BG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56 + 44, // 44 = default status bar; useSafeAreaInsets handles it properly
    paddingHorizontal: 12,
    borderBottomWidth: 0,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 48 },

  // Card
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  cardDivider: {
    height: 1,
    backgroundColor: DIVIDER,
  },

  // Avatar
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1E2E70',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 38 },
  changeAvatarBtn: { flexDirection: 'row', alignItems: 'center' },
  changeAvatarText: { color: TEAL_DIM, fontSize: 15 },

  // Profile rows
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  profileLabel: { color: TEAL_DIM, fontSize: 15 },
  profileRight: { flexDirection: 'row', alignItems: 'center' },
  profileValue: { color: '#fff', fontSize: 15, marginRight: 2 },
  copyBtn: { paddingLeft: 8 },
  copyIcon: { color: TEAL_DIM, fontSize: 16 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: -12,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: TEAL,
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Setting rows
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconEmoji: { fontSize: 17 },
  settingLabel: { flex: 1, color: '#fff', fontSize: 15 },
  settingRight: { flexDirection: 'row', alignItems: 'center' },
  settingValue: { color: TEAL_DIM, fontSize: 14 },
  rowDivider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginLeft: 52,
  },

  // Chevron
  chevron: { color: '#4A6FA5', fontSize: 16, marginLeft: 4 },
});