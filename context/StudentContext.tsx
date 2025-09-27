// app/context/StudentContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "res4_studentId";

type StudentContextType = {
  studentId: string | null;
  loading: boolean;
  setStudentId: (id: string) => Promise<void>;
  clearStudentId: () => Promise<void>;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentId, setStudentIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setStudentIdState(saved);
      } catch (e) {
        console.error("Failed to read studentId", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setStudentId = async (id: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, id);
      setStudentIdState(id);
    } catch (e) {
      console.error("Failed to save studentId", e);
    }
  };

  const clearStudentId = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setStudentIdState(null);
    } catch (e) {
      console.error("Failed to clear studentId", e);
    }
  };

  return (
    <StudentContext.Provider value={{ studentId, loading, setStudentId, clearStudentId }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
};
