import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

const APP_BACKGROUND = "#05012B";
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

        {/*  place logo here  */}
          <Image source={require("@/assets/logo-e926b199.png")} style={styles.logo} contentFit="contain" />
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
  logo: {
    marginTop: 20,
    width: 200,
    height: 100,
  },
});
