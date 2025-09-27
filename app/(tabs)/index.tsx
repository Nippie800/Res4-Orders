import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');

  const handleStart = async () => {
    if (!studentId.trim()) {
      Alert.alert('Error', 'Please enter your student number');
      return;
    }

    // Save to AsyncStorage for later use
    await AsyncStorage.setItem('studentId', studentId.trim());

    // Navigate to menu
    router.push('../menu');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍛 Res4 Orders</Text>
      <Text style={styles.subtitle}>Order your favorite meals easily</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your student number"
        value={studentId}
        onChangeText={setStudentId}
      />

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start Ordering</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fffbea', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#ff8c00', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 18, 
    color: '#444', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  button: { 
    backgroundColor: '#ff8c00', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 10 
  },
  buttonText: { 
    fontSize: 18, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});

