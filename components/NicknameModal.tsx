import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

interface NicknameModalProps {
  visible: boolean;
  onClose: () => void;
  nickname: string;
  onNicknameChange: (text: string) => void;
  onConfirm: () => void;
}

export function NicknameModal({
  visible,
  onClose,
  nickname,
  onNicknameChange,
  onConfirm,
}: NicknameModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Image source={require("@/assets/changeNickname.png")} style={{ width: "100%" }} resizeMode="contain" />
          </View>


          <View style={{ backgroundColor: "#021341", padding:10, borderRadius:10 }}>
            {/* Body */}
            <View style={styles.body}>
              <View style={styles.labelRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person" size={20} color="#2BC4C4" />
                </View>
                <Text style={styles.label}>Nickname</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={nickname}
                  onChangeText={onNicknameChange}
                  placeholder="Enter nickname"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            {/* Confirm Button */}
            <Pressable onPress={onConfirm} style={styles.confirmBtnWrapper}>
              
              <LinearGradient
                colors={["rgb(122, 254, 195)", "rgb(2, 175, 182)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.confirmBtn}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </LinearGradient>
            </Pressable>
          </View>

        </View>

        {/* Close Button */}
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close-circle-outline" size={40} color="white" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#001D57",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#0F1D55",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 15,
    fontFamily: "serif", // Using serif to match the stylized font in the image
  },
  body: {
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(43, 196, 196, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(43, 196, 196, 0.4)",
  },
  label: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#080E2E",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: "center",
  },
  input: {
    color: "white",
    fontSize: 16,
  },
  confirmBtnWrapper: {
    marginTop: 10,
  },
  confirmBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop:"26%"
  },
  confirmBtnText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeBtn: {
    marginTop: 20,
  },
});
