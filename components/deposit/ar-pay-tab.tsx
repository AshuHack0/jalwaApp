import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

const ACTIVATE_ERROR = "AR Wallet activation is currently unavailable. Please try again later.";

export function ArPayTab() {
  const handleActivate = () => Alert.alert("Error", ACTIVATE_ERROR);

  return (
    <>
      <View style={styles.section}>
        <TouchableOpacity style={styles.arRulesRow}>
          <Ionicons name="swap-horizontal" size={20} color="#7AFEC3" />
          <ThemedText style={styles.arRulesText}>AR Pay transaction rules</ThemedText>
          <ThemedText style={styles.arRulesCheck}>Check </ThemedText>
          <Ionicons name="chevron-forward" size={14} color="#7AFEC3" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.arNotActivatedRow}>
          <ThemedText style={styles.arNotActivatedIcon}>▲</ThemedText>
          <ThemedText style={styles.arNotActivatedText}>Your AR wallet has not been activated yet</ThemedText>
          <TouchableOpacity style={styles.arActivateBtn} onPress={handleActivate}>
            <ThemedText style={styles.arActivateBtnText}>activate AR wallet</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.arInfoCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet" size={20} color="#7AFEC3" />
            <ThemedText style={styles.sectionTitle}>AR Wallet</ThemedText>
          </View>
          <ThemedText style={styles.arInfoText}>
            AR Wallet is a third-party payment service platform that facilitates fast payments on the platform using ARB (digital currency)
          </ThemedText>
          <ThemedText style={styles.arInfoText}>Safe, stable and fast</ThemedText>
          <TouchableOpacity style={styles.arHowToRow}>
            <ThemedText style={styles.arHowToText}>How to activate AR wallet </ThemedText>
            <Ionicons name="chevron-forward" size={14} color="#fff" />
          </TouchableOpacity>

          <ThemedText style={styles.arFeaturesTitle}>AR wallet features</ThemedText>
          <ThemedText style={styles.arInfoText}>
            You only need Jalwa to withdraw the balance to AR Wallet
          </ThemedText>
          <ThemedText style={styles.arInfoText}>
            When you want to play games, you can quickly recharge to the Jalwa platform through AR Pay, with the recharge process taking only 5 seconds to complete
          </ThemedText>
          <ThemedText style={styles.arInfoText}>
            When you need to withdraw money to your bank card, you can quickly sell ARB through UPI in your AR wallet to get rupees, and you can also get additional rewards!
          </ThemedText>
          <ThemedText style={styles.arInfoText}>
            This method reduces your bank transaction issues while you are playing, so you don't need to worry about bank limits. You just need to sell to UPI when you need to use the funds.
          </ThemedText>

          <TouchableOpacity style={styles.arActivateBtnFull} onPress={handleActivate}>
            <ThemedText style={styles.arActivateBtnText}>activate AR wallet</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </>
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
  arRulesRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1B4B",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  arRulesText: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
  },
  arRulesCheck: {
    fontSize: 14,
    color: "#7AFEC3",
  },
  arNotActivatedRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1B4B",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  arNotActivatedIcon: {
    fontSize: 22,
    color: "#F5A623",
    fontWeight: "bold",
  },
  arNotActivatedText: {
    flex: 1,
    fontSize: 13,
    color: "#fff",
  },
  arActivateBtn: {
    backgroundColor: "#7AFEC3",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  arActivateBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#05012B",
  },
  arInfoCard: {
    backgroundColor: "#0D1B4B",
    borderRadius: 14,
    padding: 16,
  },
  arInfoText: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 22,
    marginBottom: 14,
  },
  arHowToRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  arHowToText: {
    fontSize: 14,
    color: "#fff",
  },
  arFeaturesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 14,
  },
  arActivateBtnFull: {
    backgroundColor: "#7AFEC3",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
});
