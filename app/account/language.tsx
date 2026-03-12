import { ThemedView } from '@/components/themed-view';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomHeader } from '@/components/ui/CustomHeader';

// ── Language Data ─────────────────────────────────────────────────────────────
const LANGUAGES = [
  { id: 'en',    label: 'English', flag: '🇺🇸' },
  { id: 'hi',    label: 'हिंदी',    flag: '🇮🇳' },
  { id: 'ta',    label: 'தமிழ்',   flag: '🇮🇳' },
  { id: 'te',    label: 'తెలుగు',  flag: '🇮🇳' },
];

// ── Language Row ──────────────────────────────────────────────────────────────
function LanguageRow({
  flag,
  label,
  selected,
  isFirst,
  showDivider,
  onPress,
}: {
  flag: string;
  label: string;
  selected: boolean;
  isFirst: boolean;
  showDivider: boolean;
  onPress: () => void;
}) {
  return (
    <>
      <TouchableOpacity
        style={[styles.row, selected && styles.rowSelected]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <Text style={styles.flag}>{flag}</Text>
        <Text style={styles.rowLabel}>{label}</Text>

        {/* Checkmark or empty circle */}
        {selected ? (
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function LanguageScreen() {
  const [selected, setSelected] = useState('en');
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CustomHeader title="Language" onBack={() => router.back()} />

        <View style={styles.listWrapper}>
          {LANGUAGES.map((lang, index) => (
            <LanguageRow
              key={lang.id}
              flag={lang.flag}
              label={lang.label}
              selected={selected === lang.id}
              isFirst={index === 0}
              showDivider={index < LANGUAGES.length - 1}
              onPress={() => setSelected(lang.id)}
            />
          ))}
        </View>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG      = '#060B2E';
const CARD_BG = '#0C1647';
const TEAL    = '#2BC4C4';
const DIVIDER = '#0F1D55';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },


  // List
  listWrapper: {
    marginHorizontal: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  rowSelected: {
    backgroundColor: '#0F1E55',
  },
  flag: {
    fontSize: 28,
  },
  rowLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  // Selected checkmark circle
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },

  // Unselected empty circle
  emptyCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#2A3A6A',
    backgroundColor: 'transparent',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginLeft: 58,
  },
});