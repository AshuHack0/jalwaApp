import EvilIcons from "@expo/vector-icons/EvilIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useDepositModal } from "@/contexts/DepositModalContext";
import { useState } from "react";
import { ActivityIndicator, Dimensions, Modal, ScrollView, Text, View, Pressable } from "react-native";
import { useFirstDepositBonus } from "@/services/api/hooks/useFirstDepositBonus";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NO_REMINDER_KEY = "@jalwa_no_deposit_reminder_until";

function formatBonus(amount: number): string {
  return `+ ₹${amount.toFixed(2)}`;
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function FirstDepositBonusModal({ visible, onClose }: Props) {
  const router = useRouter();
  const { openDepositModal } = useDepositModal();
  const [noReminderToday, setNoReminderToday] = useState(false);

  const { data: offers, isLoading } = useFirstDepositBonus({ enabled: visible });

  const sortedOffers = [...(offers ?? [])]
    .filter((o) => !o.isFinshed)
    .sort((a, b) => b.order - a.order);

  const handleClose = async () => {
    if (noReminderToday) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      await AsyncStorage.setItem(NO_REMINDER_KEY, tomorrow.toISOString());
    }
    onClose();
  };

  const handleActivity = () => {
    onClose();
    router.push("/(tabs)/activity");
  };

  const handleDeposit = async (rechargeAmount?: number) => {
    await handleClose();
    openDepositModal(rechargeAmount);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}

    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={handleClose}
      >
        <View style={{ alignItems: "center", width: "100%" }}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              overflow: "hidden",
              backgroundColor: "#021341",
              borderRadius: 10,
              width: "100%",
              maxWidth: Dimensions.get("window").width - 34,
              maxHeight: Dimensions.get("window").height * 0.85,
            }}
          >
            <View style={{ padding: 10, backgroundColor: "#001C54" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#e3efff",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Extra first deposit bonus
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#e3efff",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Each account can only receive rewards once
              </Text>
            </View>

            <ScrollView
              style={{
                maxHeight: Dimensions.get("window").height * 0.58,
                minHeight: 200,
                paddingHorizontal: 6,
                paddingVertical: 14,
              }}
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={true}
              bounces={true}
            >
              {isLoading ? (
                <View style={{ padding: 40, alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#14B8A6" />
                  <Text style={{ color: "#92a8e3", marginTop: 12 }}>Loading...</Text>
                </View>
              ) : (
                sortedOffers.map((offer) => (
                  <View
                    key={offer.id}
                    style={{
                      backgroundColor: "#001C54",
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 12,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          color: "#e3efff",
                        }}
                      >
                        First deposit
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "500",
                            color: "#dd9138",
                          }}
                        >
                          {offer.rechargeAmount}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          color: "#dd9138",
                        }}
                      >
                        {formatBonus(offer.rewardAmount)}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#92a8e3",
                        marginBottom: 10,
                        lineHeight: 18,
                      }}
                    >
                      Deposit {offer.rechargeAmount} for the first time and you
                      will receive {offer.rewardAmount} bonus
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "#05012B",
                          borderRadius: 100,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#e3efff" }}>
                          {offer.currentProgress ?? 0}/{offer.rechargeAmount}
                        </Text>
                      </View>
                      <Pressable
                        style={{
                          paddingVertical: 4,
                          paddingHorizontal: 20,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#dd9138",
                          backgroundColor: "transparent",
                        }}
                        onPress={() => handleDeposit(offer.rechargeAmount)}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: "#dd9138",
                          }}
                        >
                          Deposit
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: "#001C54",
              }}
            >
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
                onPress={() => setNoReminderToday(!noReminderToday)}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: noReminderToday ? "#14B8A6" : "#6F80A4",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {noReminderToday && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#14B8A6",
                      }}
                    />
                  )}
                </View>
                <Text style={{ fontSize: 14, color: "#92a8e3" }}>
                  No more reminders today
                </Text>
              </Pressable>

              <Pressable
                onPress={handleActivity}
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <LinearGradient
                  colors={["#7AFEC3", "#02AFB6"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    paddingVertical: 2,
                    paddingHorizontal: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "#05012B",
                    }}
                  >
                    Activity
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Pressable>

          <Pressable
            style={{ marginTop: 10, zIndex: 10 }}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <EvilIcons name="close-o" size={40} color="white" />
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
