import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function DepositHistoryScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("Choose a date");

  const paymentMethods = [
    { id: "All", label: "All", icon: "grid" },
    { id: "ArUpi Pay", label: "ArUpi Pay", icon: "logo-venmo" },
    { id: "Innate UPI-QR", label: "Innate UPI-QR", icon: "qr-code" },
    { id: "Other", label: "Other", icon: "ellipsis-horizontal" },
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.screenTitle}>Deposit history</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.filterTab,
                selectedFilter === method.id && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(method.id)}
            >
              <Ionicons 
                name={method.icon as any} 
                size={18} 
                color={selectedFilter === method.id ? "#fff" : "#92A8E3"} 
              />
              <ThemedText style={[
                styles.filterTabText,
                selectedFilter === method.id && styles.filterTabTextActive
              ]}>
                {method.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status and Date Filters */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterDropdown}>
            <ThemedText style={styles.filterDropdownText}>{selectedStatus}</ThemedText>
            <Ionicons name="chevron-down" size={18} color="#92A8E3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterDropdown}>
            <ThemedText style={styles.filterDropdownText}>{selectedDate}</ThemedText>
            <Ionicons name="chevron-down" size={18} color="#92A8E3" />
          </TouchableOpacity>
        </View>

        {/* No Data Display */}
        <View style={styles.noDataContainer}>
          <View style={styles.noDataIllustration}>
            {/* Scroll illustration */}
            <View style={styles.scrollShape} />
            {/* Paper airplane */}
            <View style={styles.airplane} />
            {/* Trees */}
            <View style={[styles.tree, { left: 40, bottom: 20 }]} />
            <View style={[styles.tree, { right: 40, bottom: 20 }]} />
          </View>
          <ThemedText style={styles.noDataText}>No data</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05012B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 90,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#05012B',
  },
  backButton: {
    padding: 4,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 32,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#011341',
  },
  filterTabActive: {
    backgroundColor: '#7AFEC3',
  },
  filterTabText: {
    fontSize: 14,
    color: '#92A8E3',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  filterDropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#011341',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterDropdownText: {
    fontSize: 14,
    color: '#fff',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noDataIllustration: {
    width: 200,
    height: 200,
    position: 'relative',
    marginBottom: 24,
  },
  scrollShape: {
    position: 'absolute',
    top: 20,
    left: 30,
    width: 120,
    height: 140,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2a2a3e',
    transform: [{ rotate: '-5deg' }],
  },
  airplane: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2a2a3e',
    transform: [{ rotate: '45deg' }],
  },
  tree: {
    position: 'absolute',
    width: 20,
    height: 30,
    backgroundColor: '#1a1a2e',
    borderRadius: 4,
  },
  noDataText: {
    fontSize: 18,
    color: '#7AFEC3',
    fontWeight: '500',
  },
});
