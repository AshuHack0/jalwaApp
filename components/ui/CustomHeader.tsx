import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Custom Header ─────────────────────────────────────────────────────────────
export function CustomHeader({
  title,
  onBack,
  paddingTop,
}: {
  title: string;
  onBack: () => void;
  paddingTop?: number;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: paddingTop ? paddingTop : insets.top, height: paddingTop ? 50 : 50 + 44 }]}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        activeOpacity={0.7}
      >
        <Image
          source={require("@/assets/Screenshot202603-09p230133-removebg-preview.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.backBtn} />
    </View>
  );
}
// ── Styles ────────────────────────────────────────────────────────────────────
const BG = "#060B2E";

const styles = StyleSheet.create({
  // Header
  header: {
    fontFamily: "GillSans-Bold",
    backgroundColor: BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { width: 27, height: 32, resizeMode: "contain" },
  headerTitle: {
    color: "#e3efff",
    fontSize: 19.2,
    letterSpacing: 0.2,
  },
});
