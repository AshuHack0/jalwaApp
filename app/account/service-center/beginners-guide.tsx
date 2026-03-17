import { ThemedView } from "@/components/themed-view";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { router, Stack } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const guide = [
  {
    id: 1,
    title: "How to Register",
    points: [
      "Fill in your phone number",
      "Set your own password (8 characters with big and small letters and numbers)",
      "Confirm the password",
      "Fill in your invite code",
      "Click 'I have read and agree' [Privacy Agreement]",
      "Click Register",
    ],
    img: require("@/assets/beginnersguide1.png"),
  },
  {
    id: 2,
    title: "How to Bet on the Wingo Game",
    points: [
      "Enter the Wingo game",
      "Select the duration of the game (1 minute, 3 minutes, 5 minutes, or 10 minutes) \n Green: result shows 1, 3, 7, 9 \n Red: result shows 2, 4, 6, 8 \n Violet: result shows 0 or 5 \n Small: result shows 0, 1, 2, 3, 4 \n Big: result shows 5, 6, 7, 8, 9",
      "Play according to the rules of the game; you are not allowed to place illegal bets",
    ],
    title3:
      "Ex: betting (big and small together), (red and green together), or (betting more than 7 numbers) at the same time",
    img: require("@/assets/beginnersguide2.png"),
  },
  {
    id: 3,
    title: "How to Deposit",
    points: [
      "Click the Wallet icon",
      "Click the Deposit button, and we have two methods to make a deposit (UPIPAY and USDT)",
      "Choose which method you want to use to make a deposit",
      "Select a channel",
      "Insert the deposit amount",
      "Click Deposit and make payment by scanning the available barcode",
    ],
    img: require("@/assets/beginnersguide3.png"),
  },
  {
    id: 4,
    title: "How to Withdraw",
    points: [
      "Click the Wallet icon",
      "Click the Withdraw button",
      "Enter the withdrawal amount",
      "Make sure your total bet is already 0",
      "Select your bank account or add your bank account",
      "Input the amount you want to withdraw",
      "Input your login password",
    ],
    img: require("@/assets/beginnersguide4.png"),
  },
  {
    id: 5,
    title: "Betting History",
    title2:
      "When the betting is complete, you can click My History to see your bet record. You can also check the chart trend to help you decide the next bet, and your game history will show the previous result",
    img: require("@/assets/beginnersguide5.png"),
  },
  {
    id: 6,
    title: "Transaction",
    title2:
      "You can check all the transactions or activities you do inside the account on transaction, which you can find on the Account icon",
    img: require("@/assets/beginnersguide6.png"),
  },
  {
    id: 7,
    title: "Promotion",
    points: [
      "If you have a downline or referral member, use your own link to register, and if they make a recharge, you can claim a rebate. The agent will get a \n minimum commission of 0.7% (level 1) and 0.75% (level 2) from each transaction that is done by the referral (added every day at 1:00 AM). Each game has a different percentage, which you can check on the Promotion menu to check.",
      "You can click the sharing invitation poster to see the barcode",
    ],
    img: require("@/assets/beginnersguide7.png"),
  },
  {
    id: 8,
    title: "Change Password",
    points: [
      "Follow the guide below to change your password.",
      "Login to the JALWA.GAME account",
      "Press Account icon",
      "Press the Settings button",
      "Press edit login password",
      "Fill in your login password",
      "Fill in a new login password",
      "Re-fill the new login password",
      "Press save changes",
    ],
    img: require("@/assets/beginnersguide8.png"),
  },
  {
    id: 9,
    title: "Binding bank account",
    points: [
      "Login to the JALWA.GAME account",
      "Press the Wallet icon",
      "Press the Withdraw button",
      "Press Add Bank",
      "Fill all the columns",
      "Press Save",
    ],
    img: require("@/assets/beginnersguide9.png"),
  },
  {
    id: 10,
    title: "Forgot Password",
    title2: "Go to the JALWA.GAME website",
    points: [
      "Press the Account icon",
      "Press Forgot password",
      "Fill in the phone number you registered",
      "Fill in a new password",
      "Refill the new password",
      "Press Send to receive the OTP",
      "Fill in the OTP",
      "Press I have read and agree [Privacy Agreement]",
      "Press Reset",
    ],
    img: require("@/assets/beginnersguide10.png"),
  },
  {
    id: 11,
    title: "App Download",
    title2:
      "To download the apps, you can go to the home page, then on the middle bottom, you will see the button to download the apps",

    img: require("@/assets/beginnersguide11.png"),
  },
  {
    id: 12,
    title: "About",
    title2:
      "Press about for more details regarding the privacy policy and risk disclosure agreement.",
    img: require("@/assets/beginnersguide12.png"),
  },
  {
    id: 13,
    title: "Gift",
    points: [
      "Login to the JALWA.GAME account",
      "Press the Account icon",
      "Press the Gift button",
      "Fill in the gift codes",
      "Press Receive",
    ],
    title3: "Notes: To get gift codes, you can ask your superior agent",
    img: require("@/assets/beginnersguide13.png"),
  },
];
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
          {guide.map((item, index) => (
            <View key={item.id} style={styles.stepRow}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <Text style={{ color: "#92A8E3" }}>
                  {item.id}. {item.title}
                </Text>
                {item.title2 && (
                  <Text style={{ color: "#92A8E3" }}>{item.title2}</Text>
                )}
                {item.points &&
                  item.points.map((point, indexx) => (
                    <Text
                      key={indexx}
                      style={{ marginTop: 0, color: "#92A8E3" }}
                    >
                      • {point}
                    </Text>
                  ))}
                {item.title3 && (
                  <Text style={{ color: "#92A8E3" }}>{item.title3}</Text>
                )}
                <Image
                  source={item.img}
                  style={{
                    width: "100%",
                    aspectRatio: 1.5,
                    resizeMode: "contain",
                    marginTop: 0,
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </ThemedView>
    </>
  );
}

// ── Design Tokens ─────────────────────────────────────────────────────────────
const BG = "#060B2E";
const CARD_BG = "#0A1540";
const TEAL = "#2BC4C4";
const TEAL_DIM = "#4A9EBF";
const DIVIDER = "#0F1D55";
const ICON_BG = "#0D4A4A";

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060B2E",
  },

  // Scroll
  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    // paddingBottom: 48,
  },

  // Step Row (used for images)
  stepRow: {
    marginBottom: 16,
    backgroundColor: "green",
  },
});
