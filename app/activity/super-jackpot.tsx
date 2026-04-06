import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Added for navigation
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React from "react";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Rect, Stop } from "react-native-svg";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SuperJackpot = () => {
  const navigation = useNavigation<any>();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>

        {/* 1. DARK BLUE HEADER */}
        <View style={styles.headerNav}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerNavTitle}>Super Jackpot</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {/* 2. ORANGE GRADIENT BANNER SECTION */}
          <ImageBackground
            source={{ uri: "https://www.jalwagame.win/assets/png/superJackpot-989b63c6.webp" }}
            style={{ height: 200, width: "100%", flexDirection: "row", padding: 20 }}
          >
            <View style={styles.bannerTextSection}>
              <Text style={styles.bannerTitle}>Super Jackpot</Text>

              <Text style={styles.bannerSubText}>
                When you get the Super Jackpot in
                <Text style={{ fontWeight: "bold" }}>【Slots】</Text> Can get 1
                additional bonus
              </Text>

              <Text style={styles.bannerExpiryText}>
                The reward is valid for 1 day, and you will not be able to claim
                it after it expires!
              </Text>
            </View>
          </ImageBackground>

          {/* 3. BATCH BUTTON (Muted Blue) */}
          <TouchableOpacity style={styles.batchBtn} disabled>
            <View style={styles.batchIconCircle}>
              <Image source={require("../../assets/icon-super_no.svg")} style={{ width: 30, height: 30 }} />
            </View>
            <Text style={styles.batchBtnText}>Receive in batches</Text>
          </TouchableOpacity>

          {/* 4. NAV CARDS - Updated with Navigation Redirects */}
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navCard}
              onPress={() => navigation.navigate("super-jackpot-rules")}
            >
              <Image source={require("../../assets/icon-rule.svg")} style={{ width: 30, height: 30 }} />
              <Text style={styles.navCardText}>Rule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => navigation.navigate("winning-star")}
            >
              <Image source={require("../../assets/icon-winningStar.svg")} style={{ width: 30, height: 30 }} />
              <Text style={styles.navCardText}>Winning star</Text>
            </TouchableOpacity>
          </View>

          {/* 5. EMPTY STATE CARD */}
          <View style={styles.mainEmptyCard}>
            <View style={styles.illustrationWrapper}>
              <View style={styles.emptyState}>
                <Svg viewBox="0 0 389 227" width={280} height={140} fill="none">
                  <Defs>
                    <SvgLinearGradient
                      id="paint0_linear_6306_124794"
                      x1="185.676"
                      y1="129.156"
                      x2="185.676"
                      y2="227"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#484852" />
                      <Stop offset="0.615" stopColor="#777783" stopOpacity="0.1" />
                      <Stop offset="1" stopColor="#DEDEE6" stopOpacity="0" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint1_linear_6306_124794"
                      x1="110.557"
                      y1="19.5694"
                      x2="110.557"
                      y2="79.5818"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#353240" />
                      <Stop offset="1" stopColor="#24212F" stopOpacity="0" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint2_linear_6306_124794"
                      x1="303.907"
                      y1="65.2301"
                      x2="303.907"
                      y2="109.586"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#353240" />
                      <Stop offset="1" stopColor="#24212F" stopOpacity="0" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint3_linear_6306_124794"
                      x1="212.361"
                      y1="177.425"
                      x2="211.673"
                      y2="-1.70206e-05"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#100F15" />
                      <Stop offset="0.232" stopColor="#27252F" />
                      <Stop offset="0.925" stopColor="#514E5A" />
                      <Stop offset="1" stopColor="#33323C" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint4_linear_6306_124794"
                      x1="188.942"
                      y1="9.13086"
                      x2="188.942"
                      y2="155.486"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#676570" />
                      <Stop offset="1" stopColor="#403F4B" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint5_linear_6306_124794"
                      x1="177.68"
                      y1="144.809"
                      x2="177.68"
                      y2="177.424"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#504F5C" />
                      <Stop offset="1" stopColor="#2E2C3B" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint6_linear_6306_124794"
                      x1="275.816"
                      y1="28.1825"
                      x2="275.816"
                      y2="3.62035"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#31303A" />
                      <Stop offset="1" stopColor="#2B2930" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint7_linear_6306_124794"
                      x1="51.3203"
                      y1="144"
                      x2="51.3203"
                      y2="164"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#33303E" />
                      <Stop offset="1" stopColor="#3D3B46" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint8_linear_6306_124794"
                      x1="52.0976"
                      y1="99.1497"
                      x2="52.0976"
                      y2="149.74"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#302C3F" />
                      <Stop offset="1" stopColor="#494854" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint9_linear_6306_124794"
                      x1="344.097"
                      y1="165.449"
                      x2="344.097"
                      y2="181.337"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#23202A" />
                      <Stop offset="1" stopColor="#42404B" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint10_linear_6306_124794"
                      x1="344.795"
                      y1="140.896"
                      x2="344.795"
                      y2="172.673"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#302C3F" />
                      <Stop offset="1" stopColor="#494854" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint11_linear_6306_124794"
                      x1="296.068"
                      y1="131.764"
                      x2="296.068"
                      y2="170.902"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#494855" />
                      <Stop offset="1" stopColor="#312F3B" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint12_linear_6306_124794"
                      x1="84.0489"
                      y1="52.2659"
                      x2="113.914"
                      y2="80.8551"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#605D6A" />
                      <Stop offset="1" stopColor="#7D7B8B" />
                    </SvgLinearGradient>
                    <SvgLinearGradient
                      id="paint13_linear_6306_124794"
                      x1="83.5475"
                      y1="51.2645"
                      x2="106.537"
                      y2="69.6654"
                      gradientUnits="userSpaceOnUse"
                    >
                      <Stop stopColor="#7C7A84" />
                      <Stop offset="1" stopColor="#ABAAB3" />
                    </SvgLinearGradient>
                  </Defs>
                  <Path
                    opacity={0.3}
                    d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z"
                    fill="url(#paint0_linear_6306_124794)"
                  />
                  <Path
                    d="M24.2361 48.4838C39.3083 46.0376 45.4084 44.1986 60.1233 29.9067C74.8398 15.6163 89.7608 36.4663 111.891 28.0943C134.02 19.7238 136.044 9.58829 169.892 40.6345C185.494 53.8291 197.904 48.6052 205.553 53.8291C210.65 57.3103 215.564 65.8955 220.296 79.5818H24.2361C8.62556 74.1061 0.820312 69.5603 0.820312 65.9399C0.820312 60.5116 9.1638 50.9284 24.2361 48.4838Z"
                    fill="url(#paint1_linear_6306_124794)"
                  />
                  <Path
                    d="M237.112 86.6013C248.773 84.7933 253.495 83.4326 264.881 72.8706C276.268 62.3072 287.815 77.7185 304.939 71.5305C322.063 65.3441 323.628 57.8532 349.821 80.7998C361.895 90.5518 371.497 86.6901 377.415 90.5518C381.36 93.1253 385.162 99.4702 388.823 109.586H237.112C225.031 105.54 218.992 102.178 218.992 99.5043C218.992 95.4915 225.448 88.4078 237.112 86.6013Z"
                    fill="url(#paint2_linear_6306_124794)"
                  />
                  <Path
                    d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z"
                    fill="url(#paint3_linear_6306_124794)"
                  />
                  <Path
                    opacity={0.712}
                    d="M240.78 9.13086H137.104C136.363 9.13086 135.629 9.27668 134.944 9.55999C134.26 9.84329 133.637 10.2585 133.113 10.782C132.589 11.3055 132.174 11.9269 131.89 12.6108C131.607 13.2948 131.461 14.0277 131.461 14.7679V162.656C131.461 163.396 131.607 164.129 131.89 164.813C132.174 165.496 132.59 166.118 133.114 166.641C133.638 167.164 134.26 167.579 134.945 167.863C135.629 168.146 136.363 168.292 137.104 168.292H240.78C241.522 168.292 242.255 168.146 242.94 167.863C243.625 167.579 244.247 167.164 244.771 166.641C245.295 166.118 245.711 165.496 245.994 164.813C246.278 164.129 246.424 163.396 246.424 162.656V14.7679C246.424 14.0277 246.278 13.2948 245.995 12.6108C245.711 11.9269 245.296 11.3055 244.771 10.782C244.247 10.2585 243.625 9.84329 242.94 9.55999C242.256 9.27668 241.522 9.13086 240.78 9.13086Z"
                    fill="url(#paint4_linear_6306_124794)"
                  />
                  <Path
                    d="M225.836 144.809V160.94C225.836 170.043 233.226 177.424 242.343 177.424H114.529C104.401 177.424 96.1875 169.223 96.1875 159.108V144.809H225.836ZM259.174 161.117C259.174 170.123 251.863 177.424 242.843 177.424H242.667C251.783 177.424 259.174 170.043 259.174 160.94L259.173 161.028L259.174 161.117Z"
                    fill="url(#paint5_linear_6306_124794)"
                  />
                  <Path
                    d="M275.816 0C284.834 0 292.145 7.29993 292.145 16.3071L292.144 30.0052H259.484V16.3086C259.484 7.30141 266.796 0 275.816 0Z"
                    fill="url(#paint6_linear_6306_124794)"
                  />
                  <Rect
                    x={48.8203}
                    y={144}
                    width={5}
                    height={20}
                    rx={2.5}
                    fill="url(#paint7_linear_6306_124794)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M46.1844 105.961C41.438 115.8 25.098 145.98 47.9933 149.359C70.8901 152.738 69.8685 132.651 65.8517 125.462C61.8364 118.273 57.3036 114.249 57.3036 105.961C57.3036 97.6734 50.9292 96.1201 46.1829 105.961H46.1844Z"
                    fill="url(#paint8_linear_6306_124794)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M343.974 165.449H344.221C344.921 165.449 345.491 166.016 345.491 166.717V180.068C345.491 180.405 345.357 180.727 345.119 180.965C344.881 181.203 344.558 181.337 344.221 181.337H343.974C343.637 181.337 343.314 181.204 343.075 180.966C342.837 180.728 342.703 180.405 342.703 180.068V166.717C342.703 166.016 343.272 165.449 343.974 165.449Z"
                    fill="url(#paint9_linear_6306_124794)"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M340.932 145.174C337.834 151.355 327.164 170.311 342.114 172.434C357.066 174.556 356.399 161.939 353.778 157.424C351.155 152.908 348.195 150.38 348.195 145.174C348.195 139.968 344.031 138.994 340.932 145.174Z"
                    fill="url(#paint10_linear_6306_124794)"
                  />
                  <Path
                    d="M269.941 131.764H322.196C323.639 131.764 324.809 132.933 324.809 134.373V168.292C324.809 169.734 323.639 170.901 322.196 170.901H269.941C269.248 170.901 268.583 170.626 268.093 170.137C267.603 169.648 267.328 168.984 267.328 168.292V134.373C267.328 132.933 268.498 131.764 269.941 131.764Z"
                    fill="url(#paint11_linear_6306_124794)"
                  />
                  <Path
                    opacity={0.398}
                    d="M284.309 32.6133C282.541 53.9608 273.212 64.0459 263.885 69.6786C249.04 78.6443 231.874 74.1814 227.627 69.6786C220.715 62.3476 233.578 51.1844 246.322 59.5164C259.065 67.8484 223.925 97.2125 187.223 92.0122C162.755 88.5459 140.684 82.0766 121.008 72.6045"
                    stroke="#908E9B"
                    strokeWidth={0.881}
                    strokeLinecap="round"
                    strokeDasharray="2.64 2.64"
                  />
                  <Path
                    d="M83.2109 50.6191L124.558 71.2914L116.173 82.6011L83.2109 50.6191Z"
                    fill="#565461"
                  />
                  <Path
                    d="M83.2109 50.6191L116.168 82.5997L118.765 69.3487L83.2109 50.6191Z"
                    fill="url(#paint12_linear_6306_124794)"
                  />
                  <Path
                    d="M83.2109 50.6191L103.479 66.3814L118.759 69.3443L83.2109 50.6191Z"
                    fill="url(#paint13_linear_6306_124794)"
                  />
                  <Path
                    d="M88.8516 53.4336L136.814 71.5901L124.564 71.291L88.8516 53.4336Z"
                    fill="#6D6B7A"
                  />
                </Svg>
              </View>
            </View>
            <Text style={styles.emptyCardMessage}>
              You don&apos;t have a big jackpot yet, let&apos;s bet
            </Text>
          </View>

          {/* 6. GO BET BUTTON */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.goBetWrapper}
            onPress={() => navigation.navigate("GameScreen")} // Optional: Add game redirect here
          >
            <LinearGradient
              colors={["#54f0c4", "#2db6ab"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.goBetBtn}
            >
              <Text style={styles.goBetLabel}>Go bet</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03081d",
  },
  headerNav: {
    backgroundColor: "#040b2b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 55,
    marginTop: 50,
  },
  headerNavTitle: {
    color: "#e3efff",
    fontSize: 24,
    fontWeight: "bold",
  },
  backBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerContainer: {
    height: 200,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  bannerTextSection: {
    width: "70%"
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 15,
  },
  bannerSubText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginBottom: 10,
  },
  bannerExpiryText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 14,
  },
  imageContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  giftBoxImage: {
    width: "100%",
    height: "100%",
  },
   emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyImage: {
    width: 160,
    height: 120,
  },
  emptyText: {
    fontSize: 11.8,
    color: "#92A8E3",
    fontFamily: "Inter_Regular",
    marginTop: 8,
  },
  batchBtn: {
    flexDirection: "row",
    backgroundColor: "#3D4863",
    marginHorizontal: 16,
    marginTop: 15,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  batchIconCircle: {
    borderRadius: 100,
    marginRight: 8,
  },
  batchBtnText: {
    color: "#6f80a4",
    fontSize: 12,
    fontWeight: "600",
  },
  navRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 15,
    gap: 12,
  },
  navCard: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0d1a3d",
    height: 55,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navCardText: {
    color: "#e3efff",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 5,
  },
  mainEmptyCard: {
    backgroundColor: "#071333",
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  illustrationWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  shadowOval: {
    width: 80,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    marginTop: -8,
  },
  emptyCardMessage: {
    color: "#92a8e3",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  goBetWrapper: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  goBetBtn: {
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  goBetLabel: {
    color: "#03081d",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default SuperJackpot;
