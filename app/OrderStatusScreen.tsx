// app/orderStatus.tsx
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
