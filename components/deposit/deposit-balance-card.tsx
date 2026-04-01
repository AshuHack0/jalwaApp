import { ThemedText } from "@/components/themed-text";
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_600SemiBold,
  Inter_600SemiBold_Italic,
  Inter_700Bold_Italic,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View } from "react-native";
function formatBalance(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type Props = {
  walletBalance: number;
  onRefresh: () => void;
};

export function DepositBalanceCard({ walletBalance, onRefresh }: Props) {
  const [loaded] = useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  });
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_700Bold,
  });
  const [interLoaded] = useInter({
    Inter_Regular: Inter_400Regular,
    Inter_Regular_Italic: Inter_400Regular_Italic,
    Inter_SemiBold: Inter_600SemiBold,
    Inter_SemiBold_Italic: Inter_600SemiBold_Italic,
    Inter_Bold_Italic: Inter_700Bold_Italic,
  });
  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={styles.balanceCardContent}>
        <Image
          style={{ position: "absolute", height: "100%", width: "100%" }}
          source={{
            uri: "https://www.jalwagame.win/assets/png/TotalAssetsBg-ad5afbbb.webp",
          }}
        />
        <View style={{ padding: 14 }}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceHeaderLeft}>
              <Image
                source={{
                  uri: "https://www.jalwagame.win/assets/png/balance-b2c8faab.webp",
                }}
                style={{ width: 16, aspectRatio: 1 }}
              />
              <ThemedText style={styles.balanceLabel}>Balance</ThemedText>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 10,
            }}
          >
            <ThemedText style={styles.balanceAmount}>
              {formatBalance(walletBalance)}
            </ThemedText>
            <TouchableOpacity style={{ marginBottom: 20 }} onPress={onRefresh}>
              <Image
                source={{
                  uri: "https://www.jalwagame.win/assets/png/refresh-8e0efe26.webp",
                }}
                style={{ width: 23, height: 15 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCardContent: {
    height: 138,
    width: "100%",
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    zIndex: 100,
  },
  balanceHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  walletEmoji: { fontSize: 18 },
  balanceLabel: {
    fontSize: 13.8,
    color: "black",
    fontFamily: "Inter_Regular_Italic",
  },
  balanceAmount: {
    fontSize: 25.6,
    fontFamily: "Inter_Bold_Italic",
    color: "black",
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardNumber: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 4,
  },
});
