// app/settings.tsx (simple)
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useStudent } from "../context/StudentContext";

export default function Settings() {
  const { studentId, clearStudentId } = useStudent();
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text>Student number: {studentId}</Text>
      <TouchableOpacity onPress={async () => {
        await clearStudentId();
        router.replace("/enter-student");
      }}>
        <Text style={{ color: "red", marginTop: 12 }}>Clear / Change student number</Text>
      </TouchableOpacity>
    </View>
  );
}
