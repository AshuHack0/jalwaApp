import { ThemedText } from "@/components/themed-text";
import type { UsdtNetwork } from "@/services/api/usdtDeposit";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Pressable } from "react-native";
type Channel = { id: string; label: string; balance: string };
type UsdtChannel = { id: UsdtNetwork; label: string; balance: string };

type Props = {
  isUsdt: boolean;
  channels: Channel[];
  selectedChannel: string;
  onSelectChannel: (id: string) => void;
  usdtChannels: UsdtChannel[];
  selectedNetwork: UsdtNetwork;
  onSelectNetwork: (id: UsdtNetwork) => void;
};

export function DepositChannelSelector({
  isUsdt,
  channels,
  selectedChannel,
  onSelectChannel,
  usdtChannels,
  selectedNetwork,
  onSelectNetwork,
}: Props) {
  const [loaded] = useFonts({
    BahnschriftRegular: require("@/assets/fonts/Bahnschrift-Regular.ttf"),
    BahnschriftBold: require("@/assets/fonts/Bahnschrift-Bold.ttf"),
    BahnschriftSemibold: require("@/assets/fonts/Bahnschrift-SemiBold.ttf"),
  });
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  const [interLoaded] = useInter({
    Inter_Regular: Inter_400Regular,
    Inter_SemiBold: Inter_600SemiBold,
  });
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Image
          source={require("@/assets/quickPayIcon.svg")}
          style={{ width: 24, height: 24 }}
        />
        <ThemedText style={styles.sectionTitle}>
          {isUsdt ? "Select network" : "Select channel"}
        </ThemedText>
      </View>
      {isUsdt ? (
        <View style={styles.channelGrid}>
          {usdtChannels.map((net) => {
            const isActive = selectedNetwork === net.id;
            return (
              <Pressable
                key={net.id}
                style={styles.usdtChannelCard}
                onPress={() => onSelectNetwork(net.id)}
              >
                {isActive && (
                  <LinearGradient
                    colors={["#7AFEC3", "#02AFB6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <Image
                  source={{
                    uri: "https://www.jalwagame.win/assets/png/usdt-40311708.webp",
                  }}
                  style={{ width: 42, height: 42 }}
                />
                <View>
                  <ThemedText
                    style={[
                      styles.channelLabel,
                      isActive && styles.channelLabelActive,
                    ]}
                  >
                    {net.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.channelBalance,
                      isActive && styles.channelBalanceActive,
                    ]}
                  >
                    {net.balance}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.channelGrid}>
          {channels.map((ch) => {
            const isActive = selectedChannel === ch.id;
            return (
              <Pressable
                key={ch.id}
                style={styles.channelCard}
                onPress={() => onSelectChannel(ch.id)}
              >
                {isActive && (
                  <LinearGradient
                    colors={["#7AFEC3", "#02AFB6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <ThemedText
                  style={[
                    styles.channelLabel,
                    isActive && styles.channelLabelActive,
                  ]}
                >
                  {ch.label}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.channelBalance,
                    isActive && styles.channelBalanceActive,
                  ]}
                >
                  {ch.balance}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#011341",
    borderRadius: 10,
    padding: 10,
    paddingVertical: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_Regular",
    color: "#E3EFFF",
  },
  channelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  channelCard: {
    width: "47.5%",
    backgroundColor: "#001c54",
    borderRadius: 12,
    padding: 14,
    overflow: "hidden",
  },
  channelLabel: {
    fontSize: 11.9,
    fontFamily: "Inter_Regular",
    color: "#92a8e3",
  },
  channelLabelActive: { color: "#05012B" },
  channelBalance: {
    fontSize: 11.9,
    fontFamily: "Inter_Regular",
    color: "#92A8E3",
  },
  channelBalanceActive: { color: "#05012B" },
  usdtChannelCard: {
    width: "100%",
    backgroundColor: "#0D1B4B",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
  },
  usdtChannelIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#26A17B",
    alignItems: "center",
    justifyContent: "center",
  },
  usdtIconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
