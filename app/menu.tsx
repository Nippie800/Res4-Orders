import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";


interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
}

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const { addToCart, cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const q = query(collection(db, "menu"), where("available", "==", true));
    const querySnapshot = await getDocs(q);
    const items: MenuItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as MenuItem;
      items.push({ ...data, id: doc.id });
    });
    setMenuItems(items);
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (item: MenuItem) => {
    addToCart({ id: item.id, name: item.name, price: item.price, qty: 1 });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search menu..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name} - R{item.price}</Text>
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item)}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Floating Cart Button */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push('../cart')}
      >
        <Text style={styles.cartText}>🛒 {cart.length}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fffbea" },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  item: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  desc: { fontSize: 14, color: "#555", marginBottom: 10 },
  button: {
    backgroundColor: "#ff8c00",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  cartButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 5,
  },
  cartText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
