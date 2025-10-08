/*
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

      /* Floating Cart Button *
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

*/


//SHOOTERS MENU
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
  category?: string;
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

  // Group menu by category
  const groupedMenu = Object.values(
    menuItems
      .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
      .reduce((acc: Record<string, { title: string; data: MenuItem[] }>, item) => {
        const category = item.category || "Other";
        if (!acc[category]) acc[category] = { title: category, data: [] };
        acc[category].data.push(item);
        return acc;
      }, {})
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

      <SectionList
        sections={groupedMenu}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.category}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>R{item.price}</Text>
            </View>
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item)}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
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
  container: { flex: 1, padding: 20, backgroundColor: "#000" },
  search: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    color: "#fff",
    backgroundColor: "#111",
  },
  category: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00ffc3",
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#00ffc3",
    paddingBottom: 4,
  },
  item: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#00ffc3",
    fontWeight: "bold",
  },
  desc: {
    color: "#aaa",
    marginTop: 6,
    fontSize: 14,
  },
button: {
  backgroundColor: "#00ffc3",
  padding: 10,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 10,
  shadowColor: "#00ffc3",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 10,
},
buttonText: { color: "#000", fontWeight: "bold" },
  cartButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#00ffc3",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 5,
  },
  cartText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});
