// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Stack } from 'expo-router';
// import { StyleSheet, View } from 'react-native';

// export default function BeginnersGuideScreen() {
//   return (
//     <ThemedView style={styles.container}>
//       <Stack.Screen options={{ title: 'Beginner\'s Guide', headerStyle: { backgroundColor: '#05012B' }, headerTintColor: '#fff' }} />
//       <View style={styles.content}>
//         <ThemedText style={styles.title}>Beginner's Guide</ThemedText>
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
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
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

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ── Step Badge ────────────────────────────────────────────────────────────────
function StepBadge({ number }: { number: number }) {
  return (
    <View style={styles.stepBadge}>
      <Text style={styles.stepNumber}>{number}</Text>
    </View>
  );
}

// ── Guide Step Row ────────────────────────────────────────────────────────────
function StepRow({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.stepRow}>
      <StepBadge number={number} />
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{description}</Text>
      </View>
    </View>
  );
}

// ── Info Row (icon + label + value) ──────────────────────────────────────────
function InfoRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconBox}>
        <Text style={styles.iconEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// ── Tip Card ──────────────────────────────────────────────────────────────────
function TipCard({ emoji, tip }: { emoji: string; tip: string }) {
  return (
    <View style={styles.tipCard}>
      <Text style={styles.tipEmoji}>{emoji}</Text>
      <Text style={styles.tipText}>{tip}</Text>
    </View>
  );
}

// ── FAQ Row ───────────────────────────────────────────────────────────────────
function FaqRow({ question, answer }: { question: string; answer: string }) {
  return (
    <View style={styles.faqRow}>
      <View style={styles.faqDot} />
      <View style={styles.faqContent}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Text style={styles.faqAnswer}>{answer}</Text>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function BeginnersGuideScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <CustomHeader title="Beginner's Guide" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero Banner ── */}
          <View style={styles.heroBanner}>
            {/* Replace the View below with an <Image> when you have the URL */}
            <View style={styles.heroImagePlaceholder}>
              <Text style={styles.heroImageText}>[ Banner Image ]</Text>
            </View>
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Welcome to the Game!</Text>
              <Text style={styles.heroSubtitle}>
                Everything you need to know to get started and win big.
              </Text>
            </View>
          </View>

          {/* ── Quick Stats ── */}
          <View style={[styles.card, styles.statsCard]}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3 min</Text>
              <Text style={styles.statLabel}>Read time</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Easy steps</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Beginner safe</Text>
            </View>
          </View>

          {/* ── How to Play ── */}
          <SectionHeader title="How to Play" />
          <View style={styles.card}>
            <StepRow
              number={1}
              title="Create your account"
              description="Register with your email or phone number, set a strong password, and verify your identity to unlock full access."
            />
            <View style={styles.rowDivider} />
            <StepRow
              number={2}
              title="Top up your balance"
              description="Deposit funds using your preferred payment method. Minimum deposit amounts and available channels are listed in the Wallet section."
            />
            <View style={styles.rowDivider} />
            <StepRow
              number={3}
              title="Choose a game"
              description="Browse the lobby and select any lottery or game that interests you. Each game shows the prize pool, odds, and draw schedule."
            />
            <View style={styles.rowDivider} />
            <StepRow
              number={4}
              title="Place your bet"
              description="Pick your numbers or options, set your stake amount, and confirm your ticket before the draw closes."
            />
            <View style={styles.rowDivider} />
            <StepRow
              number={5}
              title="Collect your winnings"
              description="Winnings are credited to your balance automatically after each draw. Withdraw to your bank or e-wallet at any time."
            />
          </View>

          {/* ── Game Rules ── */}
          <SectionHeader title="Game Rules" />
          <View style={styles.card}>
            <InfoRow emoji="🎯" label="Minimum bet" value="¥1.00" />
            <View style={styles.rowDivider} />
            <InfoRow emoji="🏆" label="Maximum payout" value="×1000" />
            <View style={styles.rowDivider} />
            <InfoRow emoji="⏰" label="Draw interval" value="Every 3 min" />
            <View style={styles.rowDivider} />
            <InfoRow emoji="🔄" label="Result method" value="Official RNG" />
            <View style={styles.rowDivider} />
            <InfoRow emoji="💰" label="Withdrawal time" value="Within 24 hrs" />
          </View>

          {/* ── Game Types Image Placeholder ── */}
          <SectionHeader title="Game Types" />
          <View style={styles.card}>
            {/* Replace this View with an <Image> when you have the URL */}
            <View style={styles.gameTypesImagePlaceholder}>
              <Text style={styles.heroImageText}>[ Game Types Diagram ]</Text>
            </View>
            <Text style={styles.gameTypesCaption}>
              We offer a variety of lottery formats including Fast 3, Big Small, Color Ball, and
              more. Each game has unique mechanics — tap any game in the lobby to read its
              individual rules before playing.
            </Text>
          </View>

          {/* ── Odds & Payouts ── */}
          <SectionHeader title="Odds & Payouts" />
          <View style={styles.card}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableCellLeft, styles.tableHeaderText]}>
                Bet Type
              </Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Odds</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Payout</Text>
            </View>
            <View style={styles.rowDivider} />
            {[
              { type: 'Big / Small', odds: '50%', payout: '×1.98' },
              { type: 'Odd / Even', odds: '50%', payout: '×1.98' },
              { type: 'Single Number', odds: '10%', payout: '×9.8' },
              { type: 'Two Numbers', odds: '1%', payout: '×98' },
              { type: 'Jackpot', odds: '0.1%', payout: '×980' },
            ].map((row, i, arr) => (
              <View key={row.type}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft, styles.tableCellText]}>
                    {row.type}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellText]}>{row.odds}</Text>
                  <Text style={[styles.tableCell, styles.tableCellText, styles.payoutText]}>
                    {row.payout}
                  </Text>
                </View>
                {i < arr.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>

          {/* ── Pro Tips ── */}
          <SectionHeader title="Pro Tips for Beginners" />
          <View style={styles.tipsGrid}>
            <TipCard
              emoji="🧠"
              tip="Start with Big/Small bets. They have the best odds and are the easiest to understand."
            />
            <TipCard
              emoji="💡"
              tip="Set a daily budget and stick to it. Responsible play keeps the game enjoyable."
            />
            <TipCard
              emoji="📊"
              tip="Check the draw history to spot trends, but remember — every draw is independent."
            />
            <TipCard
              emoji="🎁"
              tip="Claim daily bonuses and sign-in rewards to boost your balance for free."
            />
          </View>

          {/* ── Wallet Guide ── */}
          <SectionHeader title="Wallet & Transactions" />
          <View style={styles.card}>
            <View style={styles.walletRow}>
              <View style={[styles.walletTag, { backgroundColor: '#0D4A4A' }]}>
                <Text style={styles.walletTagEmoji}>💳</Text>
                <Text style={[styles.walletTagText, { color: TEAL }]}>Deposit</Text>
              </View>
              <Text style={styles.walletDesc}>
                Instant top-up via bank transfer, e-wallet, and crypto. Minimum ¥10 per deposit.
              </Text>
            </View>
            <View style={styles.rowDivider} />
            <View style={styles.walletRow}>
              <View style={[styles.walletTag, { backgroundColor: '#2A1A4A' }]}>
                <Text style={styles.walletTagEmoji}>🏦</Text>
                <Text style={[styles.walletTagText, { color: '#A47BF5' }]}>Withdraw</Text>
              </View>
              <Text style={styles.walletDesc}>
                Withdraw anytime. Processing takes up to 24 hours. Minimum ¥50 per withdrawal.
              </Text>
            </View>
            <View style={styles.rowDivider} />
            <View style={styles.walletRow}>
              <View style={[styles.walletTag, { backgroundColor: '#2A2A10' }]}>
                <Text style={styles.walletTagEmoji}>🎀</Text>
                <Text style={[styles.walletTagText, { color: '#E5C040' }]}>Bonuses</Text>
              </View>
              <Text style={styles.walletDesc}>
                Bonus funds are credited separately. Wagering requirements apply before withdrawal.
              </Text>
            </View>
          </View>

          {/* ── FAQ ── */}
          <SectionHeader title="Frequently Asked Questions" />
          <View style={styles.card}>
            <FaqRow
              question="Is my personal information safe?"
              answer="Yes. We use bank-level SSL encryption for all data. Your personal details are never shared with third parties."
            />
            <View style={styles.rowDivider} />
            <FaqRow
              question="What do I do if my deposit doesn't arrive?"
              answer="Contact our 24/7 live support with your transaction reference number. Most issues are resolved within 30 minutes."
            />
            <View style={styles.rowDivider} />
            <FaqRow
              question="Can I play on multiple devices?"
              answer="Absolutely. Your account syncs across all devices. Log in from any phone, tablet, or browser."
            />
            <View style={styles.rowDivider} />
            <FaqRow
              question="How are draws verified as fair?"
              answer="All draws use a certified Random Number Generator (RNG) that is audited monthly by an independent third party."
            />
          </View>

          {/* ── Support CTA ── */}
          <View style={styles.supportCard}>
            <Text style={styles.supportEmoji}>🎧</Text>
            <Text style={styles.supportTitle}>Still have questions?</Text>
            <Text style={styles.supportSubtitle}>
              Our support team is available 24 / 7 to help you.
            </Text>
            <TouchableOpacity style={styles.supportBtn} activeOpacity={0.8}>
              <Text style={styles.supportBtnText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Design Tokens ─────────────────────────────────────────────────────────────
const BG = '#060B2E';
const CARD_BG = '#0A1540';
const TEAL = '#2BC4C4';
const TEAL_DIM = '#4A9EBF';
const DIVIDER = '#0F1D55';
const ICON_BG = '#0D4A4A';

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // ── Header ──
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

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 48 },

  // ── Card ──
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 28,
  },

  // ── Section Header ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: -12,
  },
  sectionAccent: { width: 4, height: 20, backgroundColor: TEAL, borderRadius: 2, marginRight: 10 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // ── Row Divider ──
  rowDivider: { height: 1, backgroundColor: DIVIDER, marginLeft: 52 },

  // ── Hero Banner ──
  heroBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    height: 160,
  },
  heroImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D1E55',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DIVIDER,
    borderStyle: 'dashed',
  },
  heroImageText: { color: '#4A6FA5', fontSize: 13 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,11,46,0.55)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  heroSubtitle: { color: TEAL_DIM, fontSize: 13, lineHeight: 18 },

  // ── Quick Stats ──
  statsCard: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingVertical: 18,
    marginBottom: 28,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: TEAL, fontSize: 20, fontWeight: '700' },
  statLabel: { color: TEAL_DIM, fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: DIVIDER },

  // ── Step Row ──
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    gap: 14,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumber: { color: BG, fontSize: 14, fontWeight: '700' },
  stepContent: { flex: 1 },
  stepTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  stepDesc: { color: TEAL_DIM, fontSize: 13, lineHeight: 19 },

  // ── Info Row ──
  infoRow: {
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
  infoLabel: { flex: 1, color: '#fff', fontSize: 15 },
  infoValue: { color: TEAL_DIM, fontSize: 14 },

  // ── Game Types Image ──
  gameTypesImagePlaceholder: {
    height: 120,
    backgroundColor: '#0D1E55',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    borderWidth: 1,
    borderColor: DIVIDER,
    borderStyle: 'dashed',
  },
  gameTypesCaption: {
    color: TEAL_DIM,
    fontSize: 13,
    lineHeight: 19,
    paddingBottom: 16,
  },

  // ── Odds Table ──
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 13,
  },
  tableCell: { flex: 1, textAlign: 'center' },
  tableCellLeft: { textAlign: 'left' },
  tableHeaderText: { color: TEAL, fontSize: 13, fontWeight: '600' },
  tableCellText: { color: '#fff', fontSize: 14 },
  payoutText: { color: TEAL, fontWeight: '600' },

  // ── Tips Grid ──
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  tipCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: DIVIDER,
  },
  tipEmoji: { fontSize: 24, marginBottom: 8 },
  tipText: { color: TEAL_DIM, fontSize: 13, lineHeight: 18 },

  // ── Wallet ──
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  walletTag: {
    width: 72,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  walletTagEmoji: { fontSize: 16 },
  walletTagText: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  walletDesc: { flex: 1, color: TEAL_DIM, fontSize: 13, lineHeight: 18 },

  // ── FAQ ──
  faqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    gap: 12,
  },
  faqDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TEAL,
    marginTop: 5,
    flexShrink: 0,
  },
  faqContent: { flex: 1 },
  faqQuestion: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  faqAnswer: { color: TEAL_DIM, fontSize: 13, lineHeight: 18 },

  // ── Support CTA ──
  supportCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: TEAL,
  },
  supportEmoji: { fontSize: 36, marginBottom: 10 },
  supportTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 6 },
  supportSubtitle: { color: TEAL_DIM, fontSize: 13, marginBottom: 20, textAlign: 'center' },
  supportBtn: {
    backgroundColor: TEAL,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 36,
  },
  supportBtnText: { color: BG, fontSize: 15, fontWeight: '700' },
});