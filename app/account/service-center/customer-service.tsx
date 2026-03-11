import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function CustomerServiceScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Customer Service', headerStyle: { backgroundColor: '#05012B' }, headerTintColor: '#fff' }} />
      <View style={styles.content}>
        <ThemedText style={styles.title}>Customer Service</ThemedText>
        <ThemedText style={styles.subtitle}>This screen is under construction.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05012B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#92A8E3',
    textAlign: 'center',
  },
});
