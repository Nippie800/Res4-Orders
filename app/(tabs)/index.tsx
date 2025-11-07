/* RES4 INDEX
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
*/

//SHOOTERS INDEX
import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState("");

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Poppins_400Regular,
  });

  const handleStart = async () => {
    if (!tableNumber.trim()) {
      Alert.alert("Error", "Please enter your table number");
      return;
    }

   await AsyncStorage.setItem('tableNumber', String(tableNumber));

    router.push("../menu");
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image
        source={require("assets/images/shooters-logo.png")} // You can replace this with your Shooters logo
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Shooters Orders</Text>
      <Text style={styles.subtitle}>
        Order your favorite food & drinks from your table
      </Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your table number"
        placeholderTextColor="#888"
        value={tableNumber}
        onChangeText={setTableNumber}
      />

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start Ordering</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Please confirm your table number with staff before ordering.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 160,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 42,
    color: "#FF005C",
    textShadowColor: "rgba(255, 0, 92, 0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#FF005C",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#111",
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  button: {
    backgroundColor: "#FF005C",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#FF005C",
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    fontWeight: "bold",
  },
  note: {
    fontFamily: "Poppins_400Regular",
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});

