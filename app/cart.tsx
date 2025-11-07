// app/cart.tsx
/*
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../context/CartContext';

type Slot = {
  id: string;
  time: string;
  label: string;
  capacity: number;
  booked: number;
  active: boolean;
};

export default function CartScreen() {
  const { cart, getTotal, clearCart, removeFromCart, updateQty } = useCart();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  // 🔹 Load studentId from AsyncStorage (saved in LoginScreen)
  useEffect(() => {
    const fetchStudentId = async () => {
      const id = await AsyncStorage.getItem('studentId');
      if (id) {
        setStudentId(id);
      }
    };
    fetchStudentId();
  }, []);

  // 🔹 Fetch recurring pickup slots
  useEffect(() => {
    const qSlots = query(collection(db, 'pickupSlots'), orderBy('time'));

    const unsub = onSnapshot(qSlots, (snap) => {
      const arr: Slot[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        arr.push({
          id: d.id,
          time: data.time,
          label: data.label,
          capacity: data.capacity,
          booked: data.booked ?? 0,
          active: data.active !== false,
        });
      });
      setSlots(arr);
      setLoadingSlots(false);

      // auto-select the first available slot if none selected
      if (!selectedSlotId) {
        const firstAvailable = arr.find(
          (s) => s.active && (s.booked ?? 0) < (s.capacity ?? 0)
        );
        if (firstAvailable) setSelectedSlotId(firstAvailable.id);
      }
    });

    return () => unsub();
  }, [selectedSlotId]);

  // 🔹 Place Order with studentId
  const placeOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty', 'Please add items before placing an order.');
      return;
    }
    if (!selectedSlotId) {
      Alert.alert('Select pickup time', 'Please choose a pickup slot.');
      return;
    }
    if (!studentId) {
      Alert.alert(
        'Missing Student ID',
        'Please restart the app and enter your student number.'
      );
      return;
    }

    const slot = slots.find((s) => s.id === selectedSlotId);
    if (!slot) {
      Alert.alert('Slot error', 'Selected slot no longer exists.');
      return;
    }

    const slotRef = doc(db, 'pickupSlots', slot.id);
    const orderRef = doc(collection(db, 'orders')); // new order doc

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(slotRef);
        if (!snap.exists()) throw new Error('Slot missing');
        const s = snap.data() as Slot;

        const isActive = s.active !== false;
        const cap = s.capacity ?? 0;
        const booked = s.booked ?? 0;
        if (!isActive || booked >= cap) {
          throw new Error('This slot is full or disabled.');
        }

        // ✅ increment booked count
        tx.update(slotRef, { booked: booked + 1 });

        // ✅ create order with studentId
        tx.set(orderRef, {
          items: cart,
          total: getTotal(),
          pickupTime: s.label,
          pickupSlotId: slot.id,
          studentId: studentId, // 🔑 attached here
          status: 'placed',
          createdAt: serverTimestamp(),
        });
      });

      clearCart();
      Alert.alert('Success', 'Order placed successfully!');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err?.message ?? 'Failed to place order.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View>
                <Text style={styles.itemText}>
                  {item.name} - R{item.price * item.qty}
                </Text>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQty(item.id, item.qty - 1)}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNumber}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQty(item.id, item.qty + 1)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Text style={styles.total}>Total: R{getTotal()}</Text>

      /* Pickup Slots *
      <View style={styles.pickup}>
        <Text style={styles.pickupLabel}>
          Pickup Time {loadingSlots ? '(loading...)' : ''}
        </Text>
        {(!loadingSlots && slots.length === 0) && (
          <Text style={{ color: '#a00', marginBottom: 8 }}>
            No pickup slots available.
          </Text>
        )}
        <View style={styles.pickupButtons}>
          {slots.map((slot) => {
            const isFull = (slot.booked ?? 0) >= (slot.capacity ?? 0);
            const disabled = !slot.active || isFull;
            const selected = selectedSlotId === slot.id;

            return (
              <TouchableOpacity
                key={slot.id}
                activeOpacity={disabled ? 1 : 0.7}
                style={[
                  styles.pickupOption,
                  selected && styles.pickupSelected,
                  disabled && styles.pickupDisabled,
                ]}
                onPress={() => {
                  if (!disabled) setSelectedSlotId(slot.id);
                }}
              >
                <Text
                  style={[
                    styles.pickupText,
                    disabled && styles.pickupTextDisabled,
                    selected && !disabled && styles.pickupTextSelected,
                  ]}
                >
                  {slot.label}
                  {isFull ? ' (Full)' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.orderButton} onPress={placeOrder}>
        <Text style={styles.orderText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fffbea' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  empty: { fontSize: 16, color: '#888', marginVertical: 20, textAlign: 'center' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: { fontSize: 16, marginBottom: 8 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: {
    backgroundColor: '#ff8c00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  qtyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  qtyNumber: { marginHorizontal: 10, fontSize: 16 },
  removeButton: { backgroundColor: '#ff4d4d', padding: 6, borderRadius: 5 },
  removeText: { color: '#fff', fontWeight: 'bold' },
  total: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  pickup: { marginTop: 20 },
  pickupLabel: { fontSize: 16, marginBottom: 10 },
  pickupButtons: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  pickupOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ff8c00',
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  pickupSelected: { backgroundColor: '#ff8c00', borderColor: '#ff8c00' },
  pickupDisabled: { backgroundColor: '#eee', borderColor: '#ccc' },
  pickupText: { color: '#333', fontWeight: 'bold' },
  pickupTextDisabled: { color: '#888', fontWeight: 'normal' },
  pickupTextSelected: { color: '#fff' },
  orderButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  orderText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
*/

//SHOOTERS CART
// app/cart.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { collection, doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const { cart, getTotal, clearCart, updateQty } = useCart();
  const [tableNumber, setTableNumber] = useState<string>('');
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const router = useRouter();

  // ✅ Check if an active order still exists in Firestore
  useEffect(() => {
    const verifyActiveOrder = async () => {
      const savedTable = await AsyncStorage.getItem('tableNumber');
      if (savedTable) setTableNumber(savedTable);

      const savedOrderId = await AsyncStorage.getItem('activeOrderId');
      if (!savedOrderId) {
        setHasActiveOrder(false);
        return;
      }

      const orderRef = doc(db, 'orders', savedOrderId);
      const unsub = onSnapshot(orderRef, (snap) => {
        if (!snap.exists()) {
          setHasActiveOrder(false);
          AsyncStorage.removeItem('activeOrderId');
          return;
        }

        const current = snap.data();
        const status = current.status?.toLowerCase();

        // ✅ Hide button if order is done or collected
        if (status === 'served' || status === 'collection') {
          AsyncStorage.removeItem('activeOrderId');
          setHasActiveOrder(false);
        } else {
          setHasActiveOrder(true);
        }
      });

      return () => unsub();
    };

    verifyActiveOrder();
  }, []);

  // 🧾 Place Order
  const placeOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty', 'Please add items before placing an order.');
      return;
    }

    if (!tableNumber.trim()) {
      Alert.alert('Missing Table Number', 'Please enter your table number.');
      return;
    }

    try {
      await AsyncStorage.removeItem('activeOrderId');
      const lastOrderTime = await AsyncStorage.getItem('lastOrderTime');
      const now = Date.now();
      const cooldown = 5 * 60 * 1000; // 5 minutes

      if (lastOrderTime) {
        const diff = now - parseInt(lastOrderTime);
        if (diff < cooldown) {
          const remaining = Math.ceil((cooldown - diff) / 60000);
          Alert.alert(
            'Please Wait',
            `You can only place one order every 5 minutes.\nTry again in ${remaining} min(s).`
          );
          return;
        }
      }

      // Clear any old order reference
    
      await AsyncStorage.setItem('tableNumber', tableNumber);

      // Create new order
      const orderRef = doc(collection(db, 'orders'));
      await runTransaction(db, async (tx) => {
        tx.set(orderRef, {
          tableNumber,
          items: cart,
          total: getTotal(),
          status: 'placed',
          createdAt: serverTimestamp(),
        });
      });

      await AsyncStorage.setItem('lastOrderTime', now.toString());
      await AsyncStorage.setItem('activeOrderId', orderRef.id);
      clearCart();

      router.push('/OrderStatusScreen');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err?.message ?? 'Failed to place order.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemSub}>
                  R{item.price} x {item.qty} = R{item.price * item.qty}
                </Text>
              </View>
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQty(item.id, item.qty - 1)}
                >
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQty(item.id, item.qty + 1)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {cart.length > 0 && (
        <>
          <View style={styles.divider} />
          <Text style={styles.total}>Total: R{getTotal()}</Text>
          <TouchableOpacity style={styles.orderButton} onPress={placeOrder}>
            <Text style={styles.orderText}>Confirm Order</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 🍔 Floating gold button only if there's an active order */}
      {hasActiveOrder && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push('/OrderStatusScreen')}
        >
          <Text style={styles.floatingText}>🍔</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fffaf3' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#222' },
  empty: { fontSize: 16, color: '#888', marginVertical: 30, textAlign: 'center' },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#e5e5e5' },
  itemText: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemSub: { fontSize: 14, color: '#666', marginTop: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  qtyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  qtyNumber: { marginHorizontal: 10, fontSize: 16 },
  divider: { height: 1, backgroundColor: '#ddd', marginTop: 10, marginBottom: 10 },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginVertical: 10, color: '#111' },
  orderButton: { backgroundColor: '#00ffc3', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  orderText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  floatingButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#FFD700',
    padding: 18,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingText: { fontSize: 22 },
});
