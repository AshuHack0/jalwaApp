import { ThemedView } from '@/components/themed-view';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomHeader } from '@/components/ui/CustomHeader';

// ── Empty History Illustration ────────────────────────────────────────────────
function EmptyHistory() {
  return (
    <View style={styles.emptyWrapper}>
      {/* Scroll / ruins illustration built from primitives */}
      <View style={styles.illustration}>
        {/* Background hills */}
        <View style={[styles.hill, { width: 80, height: 40, bottom: 0, left: 10, borderRadius: 40 }]} />
        <View style={[styles.hill, { width: 60, height: 30, bottom: 0, right: 20, borderRadius: 30 }]} />

        {/* Stone tablet */}
        <View style={styles.tablet}>
          <View style={styles.tabletTop} />
          <View style={styles.tabletBody}>
            <View style={styles.tabletLine} />
            <View style={[styles.tabletLine, { width: '60%' }]} />
            <View style={styles.tabletLine} />
          </View>
        </View>

        {/* Trees */}
        <View style={[styles.tree, { left: 18, bottom: 8 }]}>
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 22, bottom: 10, transform: [{ scaleX: 0.8 }] }]}>
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>

        {/* Pencil / arrow */}
        <View style={styles.pencil} />
      </View>
      <Text style={styles.noDataText}>No data</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GiftScreen() {
  const [giftCode, setGiftCode] = useState('');
  const insets = useSafeAreaInsets();

  const handleReceive = () => {
    if (!giftCode.trim()) return;
    // TODO: call redeem API
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Gift" onBack={() => router.back()} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Banner ── */}
            <View style={styles.bannerWrapper}>
              <Image
                source={{ uri: '' /* TODO: add gift banner image URL */ }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              {/* Fallback illustration when image not loaded */}
              <View style={styles.bannerFallback}>
                <Text style={styles.bannerEmoji}>🎁</Text>
                <Text style={styles.bannerEmoji}>🎱</Text>
                <Text style={styles.bannerEmoji}>🎰</Text>
              </View>
            </View>

            {/* ── Gift Code Card ── */}
            <View style={styles.card}>
              <Text style={styles.hiText}>Hi</Text>
              <Text style={styles.subText}>We have a gift for you</Text>

              <Text style={styles.inputLabel}>Please enter the gift code below</Text>

              <TextInput
                style={styles.input}
                placeholder="Please enter gift code"
                placeholderTextColor="#2A3A6A"
                value={giftCode}
                onChangeText={setGiftCode}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.receiveBtn, !giftCode.trim() && styles.receiveBtnDisabled]}
                activeOpacity={0.85}
                onPress={handleReceive}
              >
                <Text style={styles.receiveBtnText}>Receive</Text>
              </TouchableOpacity>
            </View>

            {/* ── History Card ── */}
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyIconBox}>
                  <Text style={styles.historyIcon}>≡</Text>
                </View>
                <Text style={styles.historyTitle}>History</Text>
              </View>

              <EmptyHistory />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG      = '#060B2E';
const CARD_BG = '#0A1540';
const TEAL    = '#2BC4C4';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },


  // Scroll
  scroll: { flex: 1 },
  scrollContent: { gap: 12 },

  // Banner
  bannerWrapper: {
    width: '100%',
    height: 220,
    backgroundColor: '#C8922A',
    overflow: 'hidden',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  bannerFallback: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    zIndex: 1,
  },
  bannerEmoji: { fontSize: 52 },

  // Gift code card
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginHorizontal: 12,
    padding: 20,
    gap: 4,
  },
  hiText: {
    color: '#6A85B8',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 0,
  },
  subText: {
    color: '#6A85B8',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 14,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#060B2E',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
  },
  receiveBtn: {
    backgroundColor: TEAL,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  receiveBtnDisabled: {
    opacity: 0.6,
  },
  receiveBtnText: {
    color: '#05012B',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // History card
  historyCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginHorizontal: 12,
    padding: 20,
    minHeight: 280,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  historyIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#0D4A4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIcon: { color: TEAL, fontSize: 14, fontWeight: '700' },
  historyTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Empty state
  emptyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  illustration: {
    width: 160,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hill: {
    position: 'absolute',
    backgroundColor: '#1A2A50',
  },
  tablet: {
    width: 72,
    height: 88,
    alignItems: 'center',
    marginBottom: 8,
  },
  tabletTop: {
    width: 72,
    height: 18,
    backgroundColor: '#2A3A60',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tabletBody: {
    flex: 1,
    width: 72,
    backgroundColor: '#1E2E50',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 8,
    gap: 6,
    alignItems: 'center',
  },
  tabletLine: {
    width: '85%',
    height: 3,
    backgroundColor: '#2A3A60',
    borderRadius: 2,
  },
  tree: {
    position: 'absolute',
    alignItems: 'center',
  },
  treeTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1A2A50',
  },
  treeTrunk: {
    width: 5,
    height: 10,
    backgroundColor: '#1A2A50',
    borderRadius: 1,
  },
  pencil: {
    position: 'absolute',
    top: 10,
    right: 30,
    width: 3,
    height: 28,
    backgroundColor: '#2A3A60',
    borderRadius: 2,
    transform: [{ rotate: '-30deg' }],
  },
  noDataText: {
    color: '#4A6FA5',
    fontSize: 14,
  },
});