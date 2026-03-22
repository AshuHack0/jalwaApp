import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { AppTheme } from "@/constants/appTheme";

const APP_BACKGROUND = AppTheme.background;
const SPLASH_IMAGE = require("@/assets/start-15844f4f.webp");

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={SPLASH_IMAGE}
        style={styles.image}
        contentFit="contain"
      /> 
       <View style={styles.textContainer}>
        <Text style={styles.text}>Withdraw fast ,safe and stable
        </Text> 

        <Text style={styles.brandText}>71club</Text>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: APP_BACKGROUND,
    alignItems: "center",
  
  },
  image: { 
    marginTop: 100,
    width: "100%",
    height: "50%", 
 
    resizeMode: "contain",
  },
  textContainer: {
    position: "absolute",
    bottom: 120,
    alignItems: "center",
    gap: 16,
  },
  text: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center", 
    fontWeight: "bold",
  },
  brandText: {
    marginTop: 20,
    color: AppTheme.accent,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
