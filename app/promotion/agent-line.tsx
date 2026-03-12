import { ThemedView } from '@/components/themed-view';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { router, Stack } from 'expo-router';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



// ── Telegram Icon (built from primitives) ─────────────────────────────────────
function TelegramIcon() {
  return (
    <View style={styles.telegramIconWrapper}>
      <View style={styles.telegramCircle}>
        <Text style={styles.telegramArrow}>➤</Text>
      </View>
    </View>
  );
}

// ── Banner ────────────────────────────────────────────────────────────────────
function Banner() {
  return (
    <View style={styles.banner}>
      {/* Teal gradient background */}
      <View style={styles.bannerGradientLeft} />
      <View style={styles.bannerGradientRight} />

      {/* Decorative floating elements */}
      <View style={styles.chatBubble}>
        <Text style={styles.chatBubbleLines}>≡</Text>
      </View>
      <View style={styles.smileyBubble}>
        <Text style={styles.smileyText}>☺</Text>
      </View>
      <Text style={styles.plusTopRight}>+</Text>
      <Text style={styles.plusBottomLeft}>+</Text>
      <Text style={styles.circleDot}>○</Text>

      {/* Agent image placeholder */}
      <Image
        source={{ uri: '' /* TODO: add agent image URL */ }}
        style={styles.agentImage}
        resizeMode="cover"
      />

      {/* Fallback agent silhouette */}
      <View style={styles.agentFallback}>
        <View style={styles.agentHead}>
          <Text style={styles.agentEmoji}>👩‍💼</Text>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AgentLineScreen() {
  const insets = useSafeAreaInsets();

  const handleTelegram = () => {
    Linking.openURL('https://t.me/'); // TODO: replace with actual Telegram link
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CustomHeader title="Agent line customer service" onBack={() => router.back()} />

        {/* Banner */}
        <Banner />

        {/* Telegram Row */}
        <TouchableOpacity style={styles.telegramRow} onPress={handleTelegram} activeOpacity={0.75}>
          <TelegramIcon />
          <Text style={styles.telegramLabel}>Telegram</Text>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BG      = '#060B2E';
const CARD_BG = '#0A1540';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Banner
  banner: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#00C9A7',
  },
  bannerGradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '55%',
    backgroundColor: '#00E5BF',
    borderBottomRightRadius: 200,
  },
  bannerGradientRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '60%',
    backgroundColor: '#00B894',
    borderTopLeftRadius: 200,
  },

  // Floating decorations
  chatBubble: {
    position: 'absolute',
    top: 42,
    left: 52,
    width: 44,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    borderBottomLeftRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  chatBubbleLines: { color: '#fff', fontSize: 18, fontWeight: '700' },

  smileyBubble: {
    position: 'absolute',
    top: 30,
    right: 52,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  smileyText: { fontSize: 26 },

  plusTopRight: {
    position: 'absolute',
    top: 92,
    right: 80,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 22,
    fontWeight: '300',
    zIndex: 3,
  },
  plusBottomLeft: {
    position: 'absolute',
    bottom: 50,
    left: 32,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 22,
    fontWeight: '300',
    zIndex: 3,
  },
  circleDot: {
    position: 'absolute',
    bottom: 44,
    right: 58,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    zIndex: 3,
  },

  // Agent image
  agentImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },
  agentFallback: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    zIndex: 2,
  },
  agentHead: { alignItems: 'center' },
  agentEmoji: { fontSize: 110, lineHeight: 200 },

  // Telegram row
  telegramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  telegramIconWrapper: { width: 38, height: 38 },
  telegramCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#229ED9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  telegramArrow: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 3,
  },
  telegramLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  chevron: { color: '#4A6FA5', fontSize: 16 },
});