import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { type BankAccount, getBankAccount } from "@/services/api/bankAccount";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

function maskAccountNumber(num: string): string {
  if (num.length <= 9) return num;
  return num.slice(0, 6) + "****" + num.slice(-3);
}

function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  return phone.slice(0, 2) + "****" + phone.slice(-2);
}

export default function BankAccountDetailScreen() {
  const router = useRouter();
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getBankAccount().then((acc) => {
        setBankAccount(acc);
        setLoading(false);
      });
    }, []),
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <ThemedText style={styles.screenTitle}>Bank account</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#7AFEC3" size="large" />
          </View>
        ) : (
          <View style={styles.content}>
            {/* Saved Bank Card */}
            {bankAccount && bankAccount.accountNumber ? (
              <View style={styles.card}>
                {/* Teal header bar */}
                <LinearGradient
                  colors={["#66F5C2", "#01B8BF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.cardHeader}
                />

                {/* Detail Rows */}
                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Bank name</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {bankAccount.bankName}
                    </ThemedText>
                  </View>
                </View>


                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>
                      Bank account number
                    </ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {maskAccountNumber(bankAccount.accountNumber)}
                    </ThemedText>
                  </View>
                </View>


                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Phone number</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {maskPhone(bankAccount.bankPhone)}
                    </ThemedText>
                  </View>
                </View>


                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>IFSC code</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {bankAccount.ifscCode}
                    </ThemedText>
                  </View>
                </View>

                {/* Selected indicator */}
                <View style={styles.selectedRow}>
                  <View style={styles.selectedDot}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                  <ThemedText style={styles.selectedText}>Selected</ThemedText>
                </View>
              </View>
            ) : null}

            {/* Add another bank account */}
            <Pressable
              style={styles.addBankBtn}
            // onPress={() => router.push("/add-bank")}
            >
              <View style={styles.addBankIconBox}>
                <Ionicons name="add" size={28} color="#92A8E3" />
              </View>
              <ThemedText style={styles.addBankText}>
                Add a bank account number
              </ThemedText>
            </Pressable>
          </View>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#031143",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardHeader: {
    height: 46,
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#011B51",
    borderRadius: 6
  },
  detailLabel: {
    fontSize: 13,
    color: "#92A8E3",
    width:"50%",
    fontWeight:"500"
  },
  detailValue: {
    fontSize: 13,
    color: "#92A8E3",
    fontWeight: "500",
    width:"50%",
    textAlign:"left"
  },
  divider: {
    height: 0.5,
    backgroundColor: "rgba(146,168,227,0.2)",
    marginHorizontal: 16,
  },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#7AFEC3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedText: {
    fontSize: 13,
    color: "#92A8E3",
    fontWeight: "600",
  },
  addBankBtn: {
    backgroundColor: "#0A1A45",
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "rgba(146,168,227,0.2)",
    // borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
  },
  addBankIconBox: {
    marginTop:5,
    width: 44,
    height: 44,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: "#92A8E3",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addBankText: {
    fontSize: 16,
    color: "#92A8E3",
    marginTop:10
  },
});
