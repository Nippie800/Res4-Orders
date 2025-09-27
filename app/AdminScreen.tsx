// src/screens/AdminScreen.tsx
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STATUS_FLOW = ["placed", "cooking", "ready", "collected"];

const STATUS_COLORS: Record<string, string> = {
  placed: "#E74C3C",   // red
  cooking: "#E67E22",  // orange
  ready: "#2ECC71",    // green
  collected: "#7F8C8D", // grey
};

const FILTER_OPTIONS = ["All", ...STATUS_FLOW];

const AdminScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  const advanceStatus = async (order: any) => {
    const currentIndex = STATUS_FLOW.indexOf(order.status);
    if (currentIndex < STATUS_FLOW.length - 1) {
      const newStatus = STATUS_FLOW[currentIndex + 1];
      await updateDoc(doc(db, "orders", order.id), {
        status: newStatus,
      });
    }
  };

  const renderStatusBadge = (status: string) => (
    <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] }]}>
      <Text style={styles.badgeText}>{status.toUpperCase()}</Text>
    </View>
  );

  // filter logic
  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitchen Admin Panel</Text>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterButton,
              filter === option && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(option)}
          >
            <Text
              style={[
                styles.filterText,
                filter === option && styles.activeFilterText,
              ]}
            >
              {option.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderText}>
              Order #{item.id.substring(0, 6)} | Student: {item.studentId}
            </Text>
            <Text>Pickup: {item.pickupTime}</Text>
            <Text>Total: R{item.total}</Text>

            {/* Status Badge */}
            {renderStatusBadge(item.status)}

            {/* Advance Button */}
            <TouchableOpacity
              style={[
                styles.button,
                item.status === "collected" && styles.disabledButton,
              ]}
              onPress={() => advanceStatus(item)}
              disabled={item.status === "collected"}
            >
              <Text style={styles.buttonText}>
                {item.status === "collected" ? "Completed" : "Advance Status"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },

  // Filter bar styles
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
  filterButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  activeFilterButton: { backgroundColor: "#3498DB" },
  filterText: { fontWeight: "bold", color: "#555" },
  activeFilterText: { color: "#fff" },

  orderCard: {
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderText: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  button: {
    marginTop: 10,
    backgroundColor: "#3498DB",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#aaa" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  badge: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
});

