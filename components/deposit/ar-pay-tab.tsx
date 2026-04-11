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
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Pressable } from "react-native";
import { useToast } from "@/contexts/ToastContext";
import Svg, { Path, Rect } from "react-native-svg";

const ACTIVATE_ERROR =
  "AR Wallet activation is currently unavailable. Please try again later.";

export function ArPayTab() {
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
  const { showToast } = useToast();
  const handleActivate = () => showToast({ type: "error", title: "Not Available", message: ACTIVATE_ERROR });

  return (
    <>
      <View style={styles.section}>
        <Pressable style={styles.arRulesRow}>
          <Svg width={20} height={27} viewBox="0 0 37 40" fill="none">
            <Rect
              opacity={0.4}
              width={36.6667}
              height={40}
              rx={8}
              fill="#7AFEC3"
            />
            <Path
              d="M5.83301 16.6667C5.83301 15.7462 6.5792 15 7.49967 15H15.833C16.7535 15 17.4997 15.7462 17.4997 16.6667C17.4997 17.5871 16.7535 18.3333 15.833 18.3333H7.49967C6.5792 18.3333 5.83301 17.5871 5.83301 16.6667Z"
              fill="#7AFEC3"
            />
            <Path
              d="M5.83301 9.16667C5.83301 8.24619 6.5792 7.5 7.49967 7.5H23.333C24.2535 7.5 24.9997 8.24619 24.9997 9.16667C24.9997 10.0871 24.2535 10.8333 23.333 10.8333H7.49967C6.5792 10.8333 5.83301 10.0871 5.83301 9.16667Z"
              fill="#7AFEC3"
            />
            <Path
              d="M27.9863 14.4082V17.7692H26.209V14.4082H27.9863ZM27.7699 33.0133V36.0781H25.9925V33.0133H27.7699ZM29.0231 29.2764C29.0231 28.8434 28.9434 28.475 28.7839 28.1712C28.6319 27.8674 28.3813 27.5978 28.0319 27.3623C27.6901 27.1268 27.2268 26.899 26.6419 26.6787C25.6545 26.2989 24.7848 25.8964 24.0329 25.471C23.2885 25.0381 22.7075 24.5026 22.2897 23.8646C21.872 23.219 21.6631 22.4025 21.6631 21.415C21.6631 20.4732 21.8872 19.6567 22.3353 18.9655C22.7834 18.2743 23.4025 17.7426 24.1924 17.3704C24.9899 16.9907 25.9166 16.8008 26.9723 16.8008C27.7775 16.8008 28.5066 16.9223 29.1598 17.1654C29.813 17.4008 30.3751 17.7502 30.846 18.2135C31.3169 18.6693 31.6777 19.2275 31.9284 19.8883C32.179 20.5492 32.3044 21.3049 32.3044 22.1556H29.0345C29.0345 21.6999 28.9851 21.2973 28.8864 20.9479C28.7877 20.5985 28.6433 20.3061 28.4535 20.0706C28.2712 19.8352 28.0509 19.6605 27.7926 19.5465C27.5344 19.425 27.2496 19.3643 26.9382 19.3643C26.4748 19.3643 26.0951 19.4554 25.7988 19.6377C25.5026 19.82 25.2861 20.0668 25.1494 20.3783C25.0203 20.6821 24.9557 21.0315 24.9557 21.4264C24.9557 21.8138 25.0241 22.1518 25.1608 22.4404C25.3051 22.7291 25.552 22.9949 25.9014 23.238C26.2508 23.4734 26.7293 23.7165 27.3369 23.9671C28.3243 24.3469 29.1902 24.7571 29.9346 25.1976C30.6789 25.6381 31.26 26.1774 31.6777 26.8154C32.0955 27.4535 32.3044 28.2662 32.3044 29.2536C32.3044 30.2334 32.0765 31.0689 31.6208 31.7601C31.165 32.4437 30.527 32.9678 29.7067 33.3324C28.8864 33.6893 27.937 33.8678 26.8584 33.8678C26.1596 33.8678 25.4646 33.7767 24.7734 33.5944C24.0822 33.4045 23.4556 33.1007 22.8936 32.6829C22.3315 32.2652 21.8834 31.7107 21.5492 31.0195C21.215 30.3207 21.0479 29.4625 21.0479 28.4447H24.3291C24.3291 28.9991 24.4013 29.4625 24.5456 29.8346C24.6899 30.1992 24.8798 30.4916 25.1152 30.7119C25.3583 30.9246 25.6317 31.0765 25.9355 31.1676C26.2394 31.2588 26.547 31.3044 26.8584 31.3044C27.3445 31.3044 27.7433 31.217 28.0547 31.0423C28.3737 30.8676 28.613 30.6284 28.7725 30.3245C28.9396 30.0131 29.0231 29.6637 29.0231 29.2764Z"
              fill="#7AFEC3"
            />
          </Svg>
          <ThemedText style={styles.arRulesText}>
            AR Pay transaction rules
          </ThemedText>
          <ThemedText style={styles.arRulesCheck}>Check </ThemedText>
          <Ionicons name="chevron-forward" size={14} color="white" />
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.arNotActivatedRow}>
          <Image
            source={{
              uri: "https://jalwaimg.jalwa-jalwa.com/Jalwa/payNameIcon/payNameIcon_202503171657306civ.png",
            }}
            style={{ width: 40, height: 40 }}
          />
          <ThemedText style={styles.arNotActivatedText}>
            Your AR wallet has not been activated yet
          </ThemedText>
          <Pressable onPress={handleActivate}>
            <LinearGradient
              colors={["#7AFEC3", "#02AFB6"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.arActivateBtn}
            >
              <ThemedText style={styles.arActivateBtnText}>
                activate AR wallet
              </ThemedText>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.arInfoCard}>
          <View style={styles.sectionHeader}>
            <Svg width={20} height={18} viewBox="0 0 46 41" fill="none">
              <Path
                d="M9.1449 6.3253C4.09234 6.3253 0 10.4176 0 15.4702C0 15.0129 0 9.98325 0 9.98325C0 4.95356 4.57245 0.5 9.60214 0.5H26.7717C30.7404 0.5 34.0635 2.66533 34.966 6.18459C29.2637 6.18459 12.8029 6.3253 9.1449 6.3253Z"
                fill="#7AFEC3"
              />
              <Path
                opacity={0.4}
                d="M35.3908 20.0382C34.2476 21.1585 33.6989 22.8503 34.1562 24.5649C34.7277 26.6911 36.8311 28.04 39.0258 28.04H42.981V31.355C42.981 36.4076 38.8887 40.4999 33.8361 40.4999H9.1449C4.09234 40.4999 0 36.4076 0 31.355V15.3514C0 10.2989 4.09234 6.20654 9.1449 6.20654C9.1449 6.20654 28.8064 6.20654 33.8361 6.20654C38.8658 6.20654 42.981 10.3217 42.981 15.3514V18.6665H38.6829C37.4026 18.6665 36.2367 19.1694 35.3908 20.0382Z"
                fill="#7AFEC3"
              />
              <Path
                d="M45.7244 21.0072V25.7169C45.7244 26.9971 44.6727 28.0488 43.3696 28.0488H38.9572C36.488 28.0488 34.2247 26.2427 34.0189 23.7736C33.8817 22.3333 34.4304 20.9844 35.3906 20.047C36.2365 19.1783 37.4025 18.6753 38.6828 18.6753H43.3696C44.6727 18.6753 45.7244 19.727 45.7244 21.0072Z"
                fill="#7AFEC3"
              />
              <Path
                d="M25.0116 30.5596H29.2638L21.4457 15.9277H16.7583L10.0596 30.5596H20.8946L22.2895 28.1478L20.5727 25.1688L19.2851 27.2674H15.5578L19.0795 19.8296L25.0116 30.5596Z"
                fill="#7AFEC3"
              />
            </Svg>
            <ThemedText style={styles.sectionTitle}>AR Wallet</ThemedText>
          </View>
          <ThemedText style={styles.arInfoText}>
            AR Wallet is a third-party payment service platform that facilitates
            fast payments on the platform using ARB (digital currency)
          </ThemedText>
          <ThemedText style={styles.arInfoText}>
            Safe, stable and fast
          </ThemedText>
          <Pressable style={styles.arHowToRow}>
            <ThemedText style={styles.arHowToText}>
              How to activate AR wallet{" "}
            </ThemedText>
            <Ionicons name="chevron-forward" size={14} color="#fff" />
          </Pressable>

          <ThemedText style={styles.arFeaturesTitle}>
            AR wallet features
          </ThemedText>
          <ThemedText style={styles.arInfoText}>
            You only need Jalwa to withdraw the balance to AR Wallet
          </ThemedText>
          <ThemedText style={styles.arInfoText}>
            When you want to play games, you can quickly recharge to the Jalwa
            platform through AR Pay, with the recharge process taking only 5
            seconds to complete
          </ThemedText>
          <ThemedText style={styles.arInfoText}>
            When you need to withdraw money to your bank card, you can quickly
            sell ARB through UPI in your AR wallet to get rupees, and you can
            also get additional rewards!
          </ThemedText>
          <ThemedText style={styles.arInfoText}>
            This method reduces your bank transaction issues while you are
            playing, so you don't need to worry about bank limits. You just need
            to sell to UPI when you need to use the funds.
          </ThemedText>

          <Pressable onPress={handleActivate}>
            <LinearGradient
              colors={["#00ECBE", "#00ECBE"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.arActivateBtnFull}
            >
              <ThemedText style={styles.arActivateBtnText}>
                activate AR wallet
              </ThemedText>
            </LinearGradient>
          </Pressable>
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
    fontSize: 15,
    fontFamily: "Inter_SemiBold",
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
    fontSize: 10,
    fontFamily: "Inter_Regular",
    color: "#fff",
  },
  arRulesCheck: {
    fontSize: 10,
    fontFamily: "Inter_Regular",
    color: "white",
    marginRight: -10,
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
    fontSize: 20,
    color: "#F5A623",
    fontWeight: "bold",
  },
  arNotActivatedText: {
    flex: 1,
    fontSize: 10.8,
    fontFamily: "Inter_Regular",
    color: "#fff",
    lineHeight: 16,
  },
  arActivateBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  arActivateBtnText: {
    fontSize: 10.8,
    fontFamily: "Inter_Regular",
    color: "#05012B",
  },
  arInfoCard: {
    backgroundColor: "#0D1B4B",
    borderRadius: 14,
    padding: 16,
  },
  arInfoText: {
    fontSize: 12.9,
    fontFamily: "Inter_Regular",
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
    fontSize: 12,
    fontFamily: "Inter_Regular",
    color: "#fff",
  },
  arFeaturesTitle: {
    fontSize: 15,
    fontFamily: "Inter_SemiBold",
    color: "#fff",
    marginBottom: 14,
  },
  arActivateBtnFull: {
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
});
