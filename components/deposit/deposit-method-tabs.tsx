import { ThemedText } from "@/components/themed-text";
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
import { Dimensions, StyleSheet, View, Pressable } from "react-native";
const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 32 - 24) / 4; // 32 for padding (16*2), 24 for gap (8*3)

type Method = {
  id: string;
  label: string;
  icon: string;
  image?: string;
  enabled: boolean;
  bonus?: string;
};

type Props = {
  methods: Method[];
  selectedMethod: string;
  onSelect: (id: string) => void;
};

export function DepositMethodTabs({
  methods,
  selectedMethod,
  onSelect,
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
    <View style={styles.methodsSection}>
      <View style={styles.methodsGrid}>
        {methods.map((method) => (
          <Pressable
            key={method.id}
            style={styles.methodButton}
            onPress={() => method.enabled && onSelect(method.id)}
          >
            {selectedMethod === method.id ? (
              <LinearGradient
                colors={["#7AFEC3", "#02AFB6"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.methodButtonInner}
              >
                <Image
                  source={{ uri: method?.image }}
                  style={styles.methodImage}
                />
                <ThemedText style={[styles.methodLabel, styles.methodLabelActive]}>
                  {method.label}
                </ThemedText>
                {method.bonus && (
                  <View style={styles.bonusBadge}>
                    <Image
                      source={{
                        uri: "https://www.jalwagame.win/assets/png/gift-55dc786a.webp",
                      }}
                      style={{ height: 42, width: 37 }}
                    />
                    <ThemedText
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 10,
                        color: "white",
                        fontSize: 9,
                        fontWeight: 500,
                      }}
                    >
                      {method.bonus}
                    </ThemedText>
                  </View>
                )}
              </LinearGradient>
            ) : (
              <View style={styles.methodButtonInner}>
                <Image
                  source={{ uri: method?.image }}
                  style={styles.methodImage}
                />
                <ThemedText style={styles.methodLabel}>
                  {method.label}
                </ThemedText>
                {method.bonus && (
                  <View style={styles.bonusBadge}>
                    <Image
                      source={{
                        uri: "https://www.jalwagame.win/assets/png/gift-55dc786a.webp",
                      }}
                      style={{ height: 42, width: 37 }}
                    />
                    <ThemedText
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 10,
                        color: "white",
                        fontSize: 9,
                        fontWeight: 500,
                      }}
                    >
                      {method.bonus}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  methodsSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  methodButton: {
    width: ITEM_WIDTH,
    height: 96,
    backgroundColor: "#011341",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  methodButtonInner: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  methodImage: {
    height: 37,
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: 4,
  },
  methodIconContainer: {
    marginBottom: 6,
    alignItems: "center",
  },
  methodIconText: {
    fontSize: 10,
    color: "#7AFEC3",
    fontWeight: "700",
    textAlign: "center",
  },
  methodIconTextActive: { color: "#05012B" },
  methodLabel: {
    fontSize: 10.8,
    fontFamily: "Inter_Regular",
    color: "#92a8b0",
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 4,
    flexShrink: 1,
    lineHeight: 16,
  },
  methodLabelActive: {
    color: "#05012B",
    fontSize: 10.8,
    fontFamily: "Inter_Regular",
  },
  bonusBadge: {
    position: "absolute",
    top: 2,
    right: 2,
  },
});
