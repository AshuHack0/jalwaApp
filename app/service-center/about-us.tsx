// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Stack } from 'expo-router';
// import { StyleSheet, View } from 'react-native';

// export default function AboutUsScreen() {
//   return (
//     <ThemedView style={styles.container}>
//       <Stack.Screen options={{ title: 'About Us', headerStyle: { backgroundColor: '#05012B' }, headerTintColor: '#fff' }} />
//       <View style={styles.content}>
//         <ThemedText style={styles.title}>About Us</ThemedText>
//         <ThemedText style={styles.subtitle}>This screen is under construction.</ThemedText>
//       </View>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#05012B',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#92A8E3',
//     textAlign: 'center',
//   },
// });

import { ThemedView } from '@/components/themed-view';
import { router, Stack } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Custom Header ─────────────────────────────────────────────────────────────
function CustomHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <Text style={styles.backIcon}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.backBtn} />
    </View>
  );
}

// ── Menu Row ──────────────────────────────────────────────────────────────────
function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <Text style={styles.iconEmoji}>{icon}</Text>
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.chevron}>{'>'}</Text>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AboutUsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="About us" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Banner Image ── */}
          <View style={styles.bannerWrapper}>
            <Image
              source={{ uri: '' /* TODO: add banner image URL here */ }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* ── Menu List ── */}
          <View style={styles.menuCard}>
            <MenuRow icon="📋" label="Confidentiality Agreement" />
            <View style={styles.divider} />
            <MenuRow icon="🔖" label="Risk Disclosure Agreement" />
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = '#060B2E';
const DIVIDER = '#0F1D55';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    backgroundColor: BG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56 + 44,
    paddingHorizontal: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#fff', fontSize: 20, fontWeight: '400', lineHeight: 24 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '600', letterSpacing: 0.3 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },

  // Banner
  bannerWrapper: {
    width: '100%',
    height: 200,
    backgroundColor: '#0D1A4A',
    marginBottom: 0,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

  // Menu
  menuCard: {
    marginHorizontal: 0,
    backgroundColor: '#080F38',
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0D4A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconEmoji: { fontSize: 17 },
  menuLabel: { flex: 1, color: '#fff', fontSize: 15 },
  chevron: { color: '#4A6FA5', fontSize: 16 },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginLeft: 50,
  },
});