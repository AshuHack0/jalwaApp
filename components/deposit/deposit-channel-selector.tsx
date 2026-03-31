import { ThemedText } from "@/components/themed-text";
import type { UsdtNetwork } from "@/services/api/usdtDeposit";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="create-outline" size={20} color="#7AFEC3" />
        <ThemedText style={styles.sectionTitle}>
          {isUsdt ? "Select network" : "Select channel"}
        </ThemedText>
      </View>
      {isUsdt ? (
        <View style={styles.channelGrid}>
          {usdtChannels.map((net) => (
            <TouchableOpacity
              key={net.id}
              style={[styles.usdtChannelCard, selectedNetwork === net.id && styles.channelCardActive]}
              onPress={() => onSelectNetwork(net.id)}
            >
              <View style={styles.usdtChannelIcon}>
                <ThemedText style={styles.usdtIconText}>₮</ThemedText>
              </View>
              <View>
                <ThemedText style={[styles.channelLabel, selectedNetwork === net.id && styles.channelLabelActive]}>
                  {net.label}
                </ThemedText>
                <ThemedText style={[styles.channelBalance, selectedNetwork === net.id && styles.channelBalanceActive]}>
                  {net.balance}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.channelGrid}>
          {channels.map((ch) => (
            <TouchableOpacity
              key={ch.id}
              style={[styles.channelCard, selectedChannel === ch.id && styles.channelCardActive]}
              onPress={() => onSelectChannel(ch.id)}
            >
              <ThemedText style={[styles.channelLabel, selectedChannel === ch.id && styles.channelLabelActive]}>
                {ch.label}
              </ThemedText>
              <ThemedText style={[styles.channelBalance, selectedChannel === ch.id && styles.channelBalanceActive]}>
                {ch.balance}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  channelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  channelCard: {
    width: "47.5%",
    backgroundColor: "#0D1B4B",
    borderRadius: 12,
    padding: 14,
  },
  channelCardActive: { backgroundColor: "#7AFEC3" },
  channelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  channelLabelActive: { color: "#05012B" },
  channelBalance: {
    fontSize: 13,
    color: "#92A8E3",
  },
  channelBalanceActive: { color: "#05012B" },
  usdtChannelCard: {
    width: "100%",
    backgroundColor: "#7AFEC3",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
