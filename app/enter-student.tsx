// app/enter-student.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useStudent } from "../context/StudentContext";

export default function EnterStudentScreen() {
  const { studentId, loading, setStudentId } = useStudent();
  const [value, setValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && studentId) {
      // already set — go back to home
      router.replace("/");
    }
  }, [loading, studentId]);

  const onSave = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      Alert.alert("Validation", "Please enter your student number.");
      return;
    }
    // simple validation: letters/numbers allowed, length >= 3
    if (trimmed.length < 3) {
      Alert.alert("Validation", "Student number appears too short.");
      return;
    }
    await setStudentId(trimmed);
    router.replace("/"); // go home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your student number</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="e.g. 12345678 or S12345"
        style={styles.input}
        keyboardType="default"
        autoCapitalize="characters"
      />
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
      <Text style={styles.note}>This is stored locally on this device. If you switch devices, you'll need to re-enter it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fffbea" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, backgroundColor: "#fff" },
  button: { backgroundColor: "#ff8c00", padding: 12, borderRadius: 8, marginTop: 12 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  note: { color: "#666", marginTop: 12, fontSize: 12 },
});
