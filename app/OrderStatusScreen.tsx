// app/orderStatus.tsx
/*
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';

type Order = {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  pickupTime: string;
  status: 'placed' | 'cooking' | 'ready' | 'collected';
  createdAt: any;
  eta?: string;
};

export default function OrderStatusScreen() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load studentId from storage
  useEffect(() => {
    const fetchStudentId = async () => {
      const id = await AsyncStorage.getItem('studentId');
      if (id) setStudentId(id);
    };
    fetchStudentId();
  }, []);

  // 🔹 Subscribe to student's most recent order
  useEffect(() => {
    if (!studentId) return;

    const q = query(
      collection(db, 'orders'),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const d = snap.docs[0];
        setOrder({ id: d.id, ...(d.data() as any) });
      } else {
        setOrder(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [studentId]);

  const renderBadge = (status: string, current: string) => {
    const active = status === current;
    const done = ['cooking', 'ready', 'collected'].includes(current) && status !== current;

    return (
      <View
        style={[
          styles.badge,
          active && styles.badgeActive,
          done && styles.badgeDone,
        ]}
      >
        <Text style={[styles.badgeText, active && styles.badgeTextActive]}>
          {status.toUpperCase()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff8c00" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.noOrder}>No active orders found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>
      <Text style={styles.pickup}>Pickup Time: {order.pickupTime}</Text>
      <Text style={styles.total}>Total: R{order.total}</Text>

      {order.eta && (
        <Text style={styles.eta}>Estimated Ready: {order.eta}</Text>
      )}

      <View style={styles.badges}>
        {renderBadge('placed', order.status)}
        {renderBadge('cooking', order.status)}
        {renderBadge('ready', order.status)}
        {renderBadge('collected', order.status)}
      </View>

      <Text style={styles.section}>Items:</Text>
      {order.items.map((item, idx) => (
        <Text key={idx} style={styles.item}>
          {item.qty} × {item.name} — R{item.price * item.qty}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fffbea' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  pickup: { fontSize: 18, marginBottom: 5 },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  eta: { fontSize: 16, color: '#ff8c00', marginBottom: 15 },
  badges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  badgeActive: { backgroundColor: '#ff8c00', borderColor: '#ff8c00' },
  badgeDone: { backgroundColor: '#28a745', borderColor: '#28a745' },
  badgeText: { fontWeight: 'bold', color: '#555' },
  badgeTextActive: { color: '#fff' },
  section: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  item: { fontSize: 16, marginVertical: 2 },
  noOrder: { fontSize: 18, color: '#888' },
});
*/
// app/orderStatus.tsx
// app/orderStatus.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

interface Order {
  status: string;
  tableNumber?: string;
  createdAt?: any;
  [key: string]: any;
}

export default function OrderStatusScreen() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadOrder = async () => {
    const id = await AsyncStorage.getItem("activeOrderId");

    if (!id) {
      setOrder(null);
      setLoading(false);
      return;
    }

    const orderRef = doc(db, "orders", id);
    const unsub = onSnapshot(orderRef, (snapshot) => {
      if (!snapshot.exists()) {
        // ❌ Order deleted or doesn't exist anymore
        AsyncStorage.removeItem("activeOrderId");
        setOrder(null);
        setLoading(false);
        return;
      }

      const data = snapshot.data() as Order;

      // ✅ If the order is already finished, clear and reset
      if (data.status === "served" || data.status === "collection") {
        AsyncStorage.removeItem("activeOrderId");
        setOrder(null);
        setLoading(false);
        return;
      }

      setOrder(data);
      setLoading(false);
    });

    return () => unsub();
  };

  loadOrder();
}, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFB300" />
        <Text>Loading order status...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.noOrderTitle}>No active order yet 🍽️</Text>
        <Text style={styles.noOrderText}>
          It looks like you haven’t placed an order yet.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/menu")}
        >
          <Text style={styles.backButtonText}>Go to Menu / Cart</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusMap: Record<string, string> = {
    placed: "placed",
    in_progress: "cooking",
    ready: "ready",
    served: "collection",
    pending: "placed",
    collection: "collection",
  };

  const mappedStatus = statusMap[order.status] || "placed";
  const steps = ["placed", "cooking", "ready", "collection"];
  const stepLabels = ["Order Placed", "Cooking", "Ready", "Collection"];
  const currentIndex = steps.indexOf(mappedStatus);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>
      {order.tableNumber && (
        <Text style={styles.tableText}>Table: {order.tableNumber}</Text>
      )}

      {steps.map((status, index) => (
        <View
          key={status}
          style={[
            styles.stepContainer,
            currentIndex >= index ? styles.activeStep : styles.inactiveStep,
          ]}
        >
          <Text
            style={[
              styles.stepText,
              currentIndex >= index ? styles.activeText : styles.inactiveText,
            ]}
          >
            {stepLabels[index]}
          </Text>
        </View>
      ))}

      <View style={styles.center}>
        <Text style={styles.footerText}>
          Current status:{" "}
          <Text style={styles.highlight}>{stepLabels[currentIndex]}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  tableText: { textAlign: "center", fontSize: 16, color: "#555", marginBottom: 15 },
  stepContainer: { padding: 15, borderRadius: 12, marginBottom: 10 },
  activeStep: { backgroundColor: "#FFB300" },
  inactiveStep: { backgroundColor: "#eee" },
  stepText: { fontSize: 16, textAlign: "center" },
  activeText: { color: "#fff", fontWeight: "bold" },
  inactiveText: { color: "#555" },
  highlight: { color: "#FFB300", fontWeight: "bold" },
  center: { alignItems: "center", justifyContent: "center" },
  footerText: { marginTop: 20, fontSize: 16 },
  fallbackContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 25 },
  noOrderTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#FFB300" },
  noOrderText: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 25 },
  backButton: { backgroundColor: "#FFB300", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10 },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
