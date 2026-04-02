import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getBankAccount, saveBankAccount } from "@/services/api/bankAccount";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BANK_LIST = [
  "Bank of Baroda",
  "Union Bank of India",
  "Central Bank of India",
  "Yes Bank",
  "HDFC Bank",
  "Karnataka Bank",
  "Standard Chartered Bank",
  "IDBI Bank",
  "Bank of India",
  "Punjab National Bank",
  "ICICI Bank",
  "Canara Bank",
  "Kotak Mahindra Bank",
  "State Bank of India",
  "Indian Bank",
  "Axis Bank",
  "FEDERAL BANK",
  "Syndicate Bank",
  "Citibank India",
  "Bandhan Bank",
  "Indusind Bank",
  "India Post Payments Bank",
  "Corporation Bank",
  "City Union Bank",
  "Karur Vysya Bank",
  "Tamilnad Mercantile Bank",
  "Allahabad Bank",
  "varachha co-operative bank",
  "Meghalaya Rural Bank",
  "AU Small Finance Bank",
  "Lakshmi Vilas Bank",
  "South Indian Bank",
  "Bassein catholic co-operative Bank",
  "State Bank of Hyderabad",
  "Gp parsik bank",
  "Kerala Gramin Bank",
  "RBL Bank",
  "Dhanlaxmi Bank",
  "TJSB Bank",
  "Purvanchal bank",
  "Sarva Haryana Gramin Bank",
  "Ahmedabad District Co-Operative Bank",
  "Fino Payments Bank",
  "Saraswat Cooperative Bank",
  "Telangana Grameena Bank",
  "andhra pragathi grameena bank",
  "rajasthan marudhara gramin bank",
  "Abhyudaya bank",
  "ujjivan small finance bank",
  "capital small finance bank",
  "Mizoram Rural Bank",
  "Andhra Pradesh Grameena Vikas Bank",
  "Karnataka Vikas Grameena Bank",
  "The Ahmedabad merchantile co-op bank Ltd",
  "Madhya Bihar Gramin Bank",
  "NSDL Payments Bank",
  "ESAF Small Finance Bank",
  "Himachal Pradesh state cooperative bank",
  "Maharashtra state cooperative bank",
  "ORIENTAL BANK OF COMMERCE",
  "nainital bank",
  "Jharkhand Rajya Gramin Bank",
  "jio payments bank",
  "MAHARASHTRA GRAMIN BANK",
  "Uttarakhand Gramin Bank",
  "Himachal Pradesh Gramin Bank",
  "Krishna District Co-Operative Central Bank Ltd.",
  "RAJKOT NAGARIK SAHAKARI BANK LTD",
  "North East small financial bank",
  "Catholic syrian bank",
  "Fincare small finance bank",
  "Baroda Uttar Pradesh Gramin Bank",
  "Dhanalakshmi bank",
  "Cosmos Co-operative Bank Ltd",
  "Saurashtra gramin bank",
  "Baroda Rajasthan kshetriya gramin bank",
  "Jana small finance bank",
  "Dena Gujarat Gramin Bank",
  "Chaitanya Godavari Grameena Bank",
  "SVC BANK",
  "Bharat cooperative bank",
  "The Surat District Co-Op. Bank Ltd.",
  "The Kalupur Commercial Co-operative Bank",
  "Prime co-operative Bank",
  "Tripura Gramin Bank",
  "Zila Sahakari Bank Ltd Bareilly",
  "ARYAVART Bank",
  "Development credit Bank",
  "Sarva UP Gramin Bank",
  "New India Co-Operative Bank",
  "NKGSB Co-operative Bank Ltd.",
  "Vijaya Bank",
  "United Bank of India",
  "State Bank of Bikaner And Jaipur",
  "Shri Janata Sahakari Bank LTD",
  "Rajgurunagar Sahakari Bank",
  "FEDERAL NEO BANK JUPITER",
  "CHHATTISGARH RAJYA GRAMIN BANK",
  "Apna Sahakari Bank",
  "GS Mahanagar Co-Op Bank Ltd",
  "Bangiya Gramin Vikash Bank",
  "Assam Gramin Vikash Bank",
  "Kangra Central Co-operative Bank Ltd",
  "Punjab Gramin Bank",
  "Assam gramin bikash bank",
  "Karnataka Gramin Bank",
  "SURYODAY SMALL FINANCE BANK LIMITED",
  "Utkarsh Small Finance Bank",
  "The Meghalaya Co-operative Apex Bank",
  "UTTAR BIHAR GRAMIN BANK",
  "STATE BANK OF TRAVANCORE",
  "SHIVALIK SMALL FIHANCE BANK",
  "DAKSHIN BIHIR GRAMIN BANK",
  "manipur rural bank",
  "State bank of patiala",
  "BARODA GUJARAT GRAMIN BANK",
  "The Gujarat State Co-operative Bank Limited",
  "vasai vikas sahakari",
  "paschim banga gramin bank",
  "VISHAPATNAM co-operative bank",
  "Samarth Sahakari Bank Ltd",
  "uttarbanga kshetriya gramin bank",
  "janata sahakari bank ltd",
  "the gayatri co-operative urban bank",
  "ABHYUDAYA CO-OP. BANK LTD.",
  "Post Office Savings Bank",
  "SBM Bank India",
  "Bank of maharashtra",
  "Jind central Co-OP Bank",
  "PRATHAMA Up Gramin Bank",
  "State Bank of Mysore",
  "BARODA U.P BANK",
  "PURVANCHAL GRAMIN BANK",
  "The Varachha Co-operative Bank Ltd.,Surat",
  "State Bank Of Mauritius Ltd",
  "Kallappanna Awade Janata Bank",
  "HIMACHAL PARDESH STATE COOPERATIVE BANK",
  "Pratham Bank",
  "Oisha Gramya bank",
  "KDCC BANK",
  "The Hasti Coop Bank",
  "District Co-Operative Central Bank Ltd",
  "AIRTEL PAYMENTS BANK LIMITED",
  "EQUITAS SMALL FINANCE BANK LIMITED",
  "IDFC FIRST BANK LTD",
  "JAMMU AND KASHMIR BANK LIMITED",
  "DOMBIVLI NAGARI SAHAKARI BANK LIMITED",
  "Indian Overseas Bank",
  "JK Grameen Bank",
  "Punjab and Sind Bank",
];

export default function AddBankScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedBank, setSelectedBank] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  useEffect(() => {
    getBankAccount().then((account) => {
      if (!account) return;
      if (account.bankName) setSelectedBank(account.bankName);
      if (account.accountHolder) setRecipientName(account.accountHolder);
      if (account.accountNumber) setBankAccountNumber(account.accountNumber);
      if (account.bankPhone) setPhoneNumber(account.bankPhone);
      if (account.bankEmail) setEmail(account.bankEmail);
      if (account.ifscCode) setIfscCode(account.ifscCode);
    });
  }, []);

  const filteredBanks = BANK_LIST.filter((bank) =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleSelectBank = (bank: string) => {
    setSelectedBank(bank);
    setShowBankModal(false);
    setBankSearch("");
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await saveBankAccount({
      bankName: selectedBank,
      accountHolder: recipientName,
      accountNumber: bankAccountNumber,
      ifscCode,
      bankPhone: phoneNumber,
      bankEmail: email,
    });
    setSubmitting(false);

    if (res.success) {
      showToast({ type: "success", title: "Saved", message: "Bank account saved successfully." });
      router.back();
    } else {
      showToast({ type: "error", title: "Error", message: res.message || "Failed to save bank account." });
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.screenTitle}>
            Add a bank account number
          </ThemedText>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Safety Notice */}
          <View style={styles.noticeContainer}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#7AFEC3"
            />
            <ThemedText style={styles.noticeText}>
              To ensure the safety of your funds, please bind your bank account
            </ThemedText>
          </View>

          {/* Choose a bank */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Ionicons name="business" size={20} color="#7AFEC3" />
              <ThemedText style={styles.fieldLabel}>Choose a bank</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.selectBankButton}
              onPress={() => setShowBankModal(true)}
            >
              <ThemedText
                style={[
                  styles.selectBankText,
                  !selectedBank && styles.selectBankPlaceholder,
                ]}
              >
                {selectedBank || "Please select a bank"}
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={selectedBank ? "#05012B" : "#fff"}
              />
            </TouchableOpacity>
          </View>

          {/* Full recipient's name */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Ionicons name="person" size={20} color="#7AFEC3" />
              <ThemedText style={styles.fieldLabel}>
                Full recipient's name
              </ThemedText>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Please enter the recipient's name"
                placeholderTextColor="#92A8E3"
                value={recipientName}
                onChangeText={setRecipientName}
              />
            </View>
          </View>

          {/* Bank account number */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Ionicons name="card" size={20} color="#7AFEC3" />
              <ThemedText style={styles.fieldLabel}>
                Bank account number
              </ThemedText>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Please enter your bank account number"
                placeholderTextColor="#92A8E3"
                value={bankAccountNumber}
                onChangeText={setBankAccountNumber}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Phone number */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Ionicons name="call" size={20} color="#7AFEC3" />
              <ThemedText style={styles.fieldLabel}>Phone number</ThemedText>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Please enter your phone number"
                placeholderTextColor="#92A8E3"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Mail */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Ionicons name="mail" size={20} color="#7AFEC3" />
              <ThemedText style={styles.fieldLabel}>Mail</ThemedText>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="please input your email"
                placeholderTextColor="#92A8E3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* IFSC code */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Ionicons name="key" size={20} color="#7AFEC3" />
              <ThemedText style={styles.fieldLabel}>IFSC code</ThemedText>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Please enter IFSC code"
                placeholderTextColor="#92A8E3"
                value={ifscCode}
                onChangeText={setIfscCode}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedBank ||
                !recipientName ||
                !bankAccountNumber ||
                !phoneNumber ||
                !ifscCode ||
                submitting) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              !selectedBank ||
              !recipientName ||
              !bankAccountNumber ||
              !phoneNumber ||
              !ifscCode ||
              submitting
            }
          >
            {submitting ? (
              <ActivityIndicator color="#05012B" />
            ) : (
              <ThemedText
                style={[
                  styles.submitButtonText,
                  (!selectedBank ||
                    !recipientName ||
                    !bankAccountNumber ||
                    !phoneNumber ||
                    !ifscCode) &&
                    styles.submitButtonTextDisabled,
                ]}
              >
                Save
              </ThemedText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>

      {/* Bank Selection Modal */}
      <Modal
        visible={showBankModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBankModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Choose a bank</ThemedText>
              <TouchableOpacity
                onPress={() => {
                  setShowBankModal(false);
                  setBankSearch("");
                }}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#92A8E3" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search bank..."
                placeholderTextColor="#92A8E3"
                value={bankSearch}
                onChangeText={setBankSearch}
                autoCapitalize="none"
              />
              {bankSearch.length > 0 && (
                <TouchableOpacity onPress={() => setBankSearch("")}>
                  <Ionicons name="close-circle" size={18} color="#92A8E3" />
                </TouchableOpacity>
              )}
            </View>

            {/* Bank List */}
            <FlatList
              data={filteredBanks}
              keyExtractor={(item, index) => `${item}-${index}`}
              showsVerticalScrollIndicator={false}
              style={styles.bankList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.bankItem,
                    selectedBank === item && styles.bankItemSelected,
                  ]}
                  onPress={() => handleSelectBank(item)}
                >
                  <View style={styles.bankItemContent}>
                    <View style={styles.bankIconContainer}>
                      <Ionicons name="business" size={18} color="#7AFEC3" />
                    </View>
                    <ThemedText
                      style={[
                        styles.bankItemText,
                        selectedBank === item && styles.bankItemTextSelected,
                      ]}
                    >
                      {item}
                    </ThemedText>
                  </View>
                  {selectedBank === item && (
                    <Ionicons name="checkmark-circle" size={20} color="#7AFEC3" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <ThemedText style={styles.emptyListText}>
                    No banks found
                  </ThemedText>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05012B",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 110,
    paddingHorizontal: 16,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#05012B",
  },
  backButton: {
    padding: 4,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  noticeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(122, 254, 195, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(122, 254, 195, 0.2)",
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: "#7AFEC3",
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  selectBankButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#7AFEC3",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectBankText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#05012B",
  },
  selectBankPlaceholder: {
    color: "#05012B",
    opacity: 0.7,
  },
  inputContainer: {
    backgroundColor: "#011341",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(146, 168, 227, 0.2)",
  },
  textInput: {
    fontSize: 15,
    color: "#fff",
    paddingVertical: 12,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#7AFEC3",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#011341",
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#05012B",
  },
  submitButtonTextDisabled: {
    color: "#92A8E3",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#05012B",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(122, 254, 195, 0.15)",
    borderBottomWidth: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(146, 168, 227, 0.15)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  modalCloseButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#011341",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(146, 168, 227, 0.2)",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#fff",
    paddingVertical: 12,
  },
  bankList: {
    paddingHorizontal: 20,
  },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(146, 168, 227, 0.1)",
  },
  bankItemSelected: {
    backgroundColor: "rgba(122, 254, 195, 0.08)",
    borderRadius: 10,
  },
  bankItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  bankIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(122, 254, 195, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  bankItemText: {
    fontSize: 15,
    color: "#fff",
    flex: 1,
  },
  bankItemTextSelected: {
    color: "#7AFEC3",
    fontWeight: "600",
  },
  emptyList: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 15,
    color: "#92A8E3",
  },
});
