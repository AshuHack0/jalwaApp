import { ThemedView } from '@/components/themed-view';
import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomHeader } from '@/components/ui/CustomHeader';

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function FeedbackScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Feedback" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Text Input Area ── */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="encountered, we will immediately process your feedback!"
              placeholderTextColor="#2A3A6A"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* ── Reward Text ── */}
          <View style={styles.rewardTextBlock}>
            <Text style={styles.rewardLine}>Send helpful feedback</Text>
            <Text style={styles.rewardLine}>Chance to win Mystery Rewards</Text>
          </View>

          {/* ── Illustration ── */}
          <View style={styles.illustrationBox}>
            {/* Robot astronaut built from primitives */}
            <View style={styles.scene}>
              {/* Moon arc */}
              <View style={styles.moonArc} />

              {/* Body */}
              <View style={styles.robotBody}>
                {/* Helmet */}
                <View style={styles.helmet}>
                  <View style={styles.helmetVisor} />
                </View>
                {/* Torso */}
                <View style={styles.torso}>
                  <View style={styles.torsoScreen} />
                </View>
              </View>

              {/* Left arm */}
              <View style={styles.armLeft} />
              {/* Right arm holding pencil */}
              <View style={styles.armRight} />
              {/* Pencil */}
              <View style={styles.pencil}>
                <View style={styles.pencilTip} />
              </View>

              {/* Sparkles */}
              <Text style={styles.sparkle1}>✦</Text>
              <Text style={styles.sparkle2}>✦</Text>

              {/* Paper plane */}
              <View style={styles.paperPlane}>
                <View style={styles.planeWing} />
                <View style={styles.planeBody} />
              </View>

              {/* Yellow square */}
              <View style={styles.yellowSquare} />

              {/* Ground dots */}
              <View style={[styles.groundDot, { bottom: 18, left: 60 }]} />
              <View style={[styles.groundDot, { bottom: 10, left: 100, width: 14, height: 14 }]} />
              <View style={[styles.groundDot, { bottom: 20, right: 60 }]} />
            </View>
          </View>

          {/* ── Submit Button ── */}
          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const BG = '#060B2E';
const CARD_BG = '#0A1540';
const TEAL = '#2BC4C4';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },


  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Input
  inputWrapper: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginBottom: 28,
    overflow: 'hidden',
  },
  textInput: {
    height: 240,
    color: '#fff',
    fontSize: 14,
    padding: 16,
    lineHeight: 22,
  },

  // Reward text
  rewardTextBlock: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 4,
  },
  rewardLine: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Illustration
  illustrationBox: {
    alignItems: 'center',
    marginBottom: 36,
    height: 200,
  },
  scene: {
    width: 260,
    height: 200,
    position: 'relative',
  },

  // Moon
  moonArc: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    width: 160,
    height: 80,
    borderRadius: 80,
    backgroundColor: '#F5C842',
    opacity: 0.9,
  },

  // Robot
  robotBody: {
    position: 'absolute',
    bottom: 48,
    left: 70,
    alignItems: 'center',
  },
  helmet: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8EDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#C0CBD8',
  },
  helmetVisor: {
    width: 28,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4ECDC4',
    opacity: 0.7,
  },
  torso: {
    width: 44,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1A3A7A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderWidth: 2,
    borderColor: '#2A5AB0',
  },
  torsoScreen: {
    width: 24,
    height: 16,
    borderRadius: 4,
    backgroundColor: TEAL,
    opacity: 0.8,
  },

  // Arms
  armLeft: {
    position: 'absolute',
    bottom: 68,
    left: 52,
    width: 18,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8EDF5',
    transform: [{ rotate: '30deg' }],
  },
  armRight: {
    position: 'absolute',
    bottom: 68,
    left: 114,
    width: 22,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8EDF5',
    transform: [{ rotate: '-40deg' }],
  },
  pencil: {
    position: 'absolute',
    bottom: 52,
    left: 126,
    width: 8,
    height: 30,
    backgroundColor: '#F5C842',
    borderRadius: 2,
    transform: [{ rotate: '20deg' }],
  },
  pencilTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333',
    position: 'absolute',
    bottom: -8,
    left: 0,
  },

  // Sparkles
  sparkle1: {
    position: 'absolute',
    top: 30,
    left: 50,
    color: '#F5C842',
    fontSize: 20,
  },
  sparkle2: {
    position: 'absolute',
    top: 50,
    left: 30,
    color: '#F5C842',
    fontSize: 12,
  },

  // Paper plane
  paperPlane: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 24,
  },
  planeBody: {
    width: 36,
    height: 0,
    borderBottomWidth: 14,
    borderBottomColor: TEAL,
    borderLeftWidth: 0,
    borderRightWidth: 18,
    borderRightColor: 'transparent',
  },
  planeWing: {
    width: 20,
    height: 0,
    borderBottomWidth: 10,
    borderBottomColor: '#2A9D8F',
    borderLeftWidth: 0,
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    marginBottom: 2,
    alignSelf: 'flex-end',
  },

  // Yellow square accent
  yellowSquare: {
    position: 'absolute',
    top: 40,
    right: 10,
    width: 28,
    height: 28,
    backgroundColor: '#F5C842',
    borderRadius: 4,
  },

  // Ground dots
  groundDot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0F1D55',
  },

  // Submit button
  submitBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});