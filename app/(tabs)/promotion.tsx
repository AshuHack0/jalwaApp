import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function PromotionScreen() {
  const [invitationCode] = useState('681759111383');

  const handleCopyCode = () => {
    // Handle copy invitation code
    console.log('Copy code:', invitationCode);
  };

  const agencyFeatures = [
    { name: 'Copy invitation code', icon: 'mail', hasCode: true },
    { name: 'Subordinate data', icon: 'calendar' },
    { name: 'Commission detail', icon: 'cash' },
    { name: 'Invitation rules', icon: 'bookmark' },
    { name: 'Agent line customer service', icon: 'headset' },
    { name: 'Rebate ratio', icon: 'wallet' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Agency</ThemedText>
          <TouchableOpacity>
            <Ionicons name="stats-chart" size={24} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Commission Summary Area */}
        <View style={styles.commissionSection}>
          <LinearGradient
            colors={['#10B981', '#14B8A6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.commissionGradient}
          >
            <ThemedText style={styles.commissionAmount}>0</ThemedText>
            <View style={styles.commissionLabel}>
              <ThemedText style={styles.commissionLabelText}>Yesterday's total commission</ThemedText>
            </View>
            <ThemedText style={styles.upgradeText}>Upgrade the level to increase commission income</ThemedText>
          </LinearGradient>
        </View>

        {/* Subordinate Statistics */}
        <View style={styles.subordinateSection}>
          <View style={styles.subordinateCard}>
            <View style={styles.subordinateHeader}>
              <Ionicons name="people" size={20} color="#14B8A6" />
              <ThemedText style={styles.subordinateTitle}>Direct subordinates</ThemedText>
            </View>
            <View style={styles.statisticsList}>
              <View style={styles.statisticItem}>
                <ThemedText style={styles.statisticLabel}>number of register</ThemedText>
                <ThemedText style={styles.statisticValue}>0</ThemedText>
              </View>
              <View style={styles.statisticItem}>
                <ThemedText style={styles.statisticLabel}>Deposit number</ThemedText>
                <ThemedText style={[styles.statisticValue, styles.greenValue]}>0</ThemedText>
              </View>
              <View style={styles.statisticItem}>
                <ThemedText style={styles.statisticLabel}>Deposit amount</ThemedText>
                <ThemedText style={[styles.statisticValue, styles.orangeValue]}>0</ThemedText>
              </View>
              <View style={styles.statisticItem}>
                <ThemedText style={styles.statisticLabel}>Number of people making first deposit</ThemedText>
                <ThemedText style={styles.statisticValue}>0</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.subordinateCard}>
            <View style={styles.subordinateHeader}>
              <Ionicons name="people" size={20} color="#14B8A6" />
              <ThemedText style={styles.subordinateTitle}>Team subordinates</ThemedText>
            </View>
            <View style={styles.statisticsList}>
              <View style={styles.statisticItem}>
                <ThemedText style={styles.statisticLabel}>number of register</ThemedText>
                <ThemedText style={styles.statisticValue}>0</ThemedText>
              </View>
              <View style={styles.statisticItem}>
                <ThemedText style={styles.statisticLabel}>Deposit number</ThemedText>
                <ThemedText style={[styles.statisticValue, styles.greenValue]}>0</ThemedText>
              </View>
              <View style={styles.statisticItem}>
                <ThemedText style={styles.statisticLabel}>Deposit amount</ThemedText>
                <ThemedText style={[styles.statisticValue, styles.orangeValue]}>0</ThemedText>
              </View>
              <View style={styles.statisticItem}>
                <ThemedText style={styles.statisticLabel}>Number of people making first deposit</ThemedText>
                <ThemedText style={styles.statisticValue}>0</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Download QR Code Button */}
        <View style={styles.qrSection}>
          <LinearGradient
            colors={['#10B981', '#14B8A6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.qrButton}
          >
            <TouchableOpacity style={styles.qrButtonContent}>
              <ThemedText style={styles.qrButtonText}>Download QR Code</ThemedText>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Agency Features List */}
        <View style={styles.featuresSection}>
          {agencyFeatures.map((feature, index) => (
            <TouchableOpacity key={index} style={styles.featureItem}>
              <View style={styles.featureLeft}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={feature.icon} size={20} color="#10B981" />
                </View>
                <ThemedText style={styles.featureLabel}>{feature.name}</ThemedText>
                {feature.hasCode && (
                  <View style={styles.codeContainer}>
                    <ThemedText style={styles.codeText}>{invitationCode}</ThemedText>
                    <TouchableOpacity onPress={handleCopyCode}>
                      <Ionicons name="copy-outline" size={16} color="#9BA1A6" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Promotion Data Section */}
        <View style={styles.promotionDataSection}>
          <View style={styles.promotionDataHeader}>
            <View style={styles.promotionDataIconContainer}>
              <Ionicons name="grid" size={20} color="#10B981" />
            </View>
            <ThemedText style={styles.promotionDataTitle}>promotion data</ThemedText>
          </View>
          <View style={styles.promotionDataGrid}>
            <View style={styles.promotionDataItem}>
              <ThemedText style={styles.promotionDataValue}>0</ThemedText>
              <ThemedText style={styles.promotionDataLabel}>This Week</ThemedText>
            </View>
            <View style={styles.promotionDataItem}>
              <ThemedText style={styles.promotionDataValue}>0</ThemedText>
              <ThemedText style={styles.promotionDataLabel}>Total commission</ThemedText>
            </View>
            <View style={styles.promotionDataItem}>
              <ThemedText style={styles.promotionDataValue}>0</ThemedText>
              <ThemedText style={styles.promotionDataLabel}>direct subordinate</ThemedText>
            </View>
            <View style={styles.promotionDataItem}>
              <ThemedText style={styles.promotionDataValue}>0</ThemedText>
              <ThemedText style={styles.promotionDataLabel}>Total number of subordinates in the team</ThemedText>
            </View>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  commissionSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  commissionGradient: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  commissionAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  commissionLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  commissionLabelText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  upgradeText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  subordinateSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  subordinateCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#14B8A6',
  },
  subordinateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  subordinateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  statisticsList: {
    gap: 12,
  },
  statisticItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statisticLabel: {
    fontSize: 12,
    color: '#9BA1A6',
    flex: 1,
  },
  statisticValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  greenValue: {
    color: '#10B981',
  },
  orangeValue: {
    color: '#F97316',
  },
  qrSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  qrButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  qrButtonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  featuresSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  codeText: {
    fontSize: 14,
    color: '#9BA1A6',
    fontFamily: 'monospace',
  },
  promotionDataSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  promotionDataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  promotionDataIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promotionDataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  promotionDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  promotionDataItem: {
    width: '47%',
    alignItems: 'center',
    gap: 8,
  },
  promotionDataValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  promotionDataLabel: {
    fontSize: 12,
    color: '#9BA1A6',
    textAlign: 'center',
  },
});
