import { ThemedView } from '@/components/themed-view';
import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomHeader } from '@/components/ui/CustomHeader';

// ── Announcement Card ─────────────────────────────────────────────────────────
function AnnouncementCard({
  title,
  body,
  timestamp,
  showLock = false,
}: {
  title: string;
  body: string;
  timestamp: string;
  showLock?: boolean;
}) {
  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.megaphone}>📢</Text>
        {showLock && <Text style={styles.lock}>🔒</Text>}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Body */}
      <Text style={styles.cardBody}>{body}</Text>

      {/* Timestamp */}
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Official Security Notice',
    body: 'Our customer service will never send any links to members—if you receive a link from someone claiming to be JALWA.GAME customer service, please do not click it, as it may lead to hacking or data loss; always verify through our official website.',
    timestamp: '2025-04-12 18:53:12',
    showLock: true,
  },
  {
    id: '2',
    title: 'आधिकारिक सुरक्षा सूचना',
    body: 'हमारी कस्टमर सर्विस कभी भी सदस्यों को कोई लिंक नहीं भेजेगी — यदि आपको कोई लिंक किसी ऐसे व्यक्ति से प्राप्त होता है जो खुद को JALWA कस्टमर सर्विस बता रहा है, तो कृपया उस पर क्लिक न करें, क्योंकि यह हैकिंग या डेटा चोरी का कारण बन सकता है। कृपया हमेशा हमारी आधिकारिक वेबसाइट के माध्यम से ही सत्यापित करें।',
    timestamp: '2025-04-12 18:53:03',
    showLock: true,
  },
  {
    id: '3',
    title: 'WELCOMME TO JALWA',
    body: '🎉 🎉 🎉 Welcome to join the JALWA platform. We provide a brand new gaming experience and a comprehensive range of popular games. 🍎 🍎 🍎 You are welcome to register at JALWA and participate in the game. Thank you.',
    timestamp: '2025-03-24 14:46:29',
    showLock: false,
  },
];

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AnnouncementScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Announcement" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          {ANNOUNCEMENTS.map((item) => (
            <AnnouncementCard
              key={item.id}
              title={item.title}
              body={item.body}
              timestamp={item.timestamp}
              showLock={item.showLock}
            />
          ))}

          {/* No more */}
          <Text style={styles.noMore}>No more</Text>
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG = '#060B2E';
const CARD_BG = '#0A1540';
const DIVIDER = '#0F1D55';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },


  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 8, gap: 14 },

  // Card
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  megaphone: { fontSize: 22 },
  lock: { fontSize: 16 },
  cardTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginBottom: 12,
  },
  cardBody: {
    color: '#C8D4F0',
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 14,
  },
  timestamp: {
    color: '#4A6FA5',
    fontSize: 12.5,
  },

  // No more
  noMore: {
    color: '#4A6FA5',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});