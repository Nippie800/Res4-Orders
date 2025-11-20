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
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ShootersLogo from "../assets/images/shooters-logo.png";
import { useCart } from "../context/CartContext";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
  category?: string;
  imageUrl?: string;
}

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const scrollY = useRef(new Animated.Value(0)).current;

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

  const groupedMenu = Object.values(
    menuItems
      .filter((item) => {
        const searchValue = search.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(searchValue);
        const categoryMatch = (item.category || "")
          .toLowerCase()
          .includes(searchValue);
        return nameMatch || categoryMatch;
      })
      .reduce(
        (
          acc: Record<string, { title: string; data: MenuItem[] }>,
          item: MenuItem
        ) => {
          const category = item.category || "Other";
          if (!acc[category]) acc[category] = { title: category, data: [] };
          acc[category].data.push(item);
          return acc;
        },
        {}
      )
  );

  const handleAddToCart = (item: MenuItem) => {
    addToCart({ id: item.id, name: item.name, price: item.price, qty: 1 });
  };

  const categoryStyles: Record<string, any> = {
    Starters: { backgroundColor: "#ffa726", emoji: "🥗" },
    "Slice Society": { backgroundColor: "#ef5350", emoji: "🍕" },
    "The Shake Up": { backgroundColor: "#ab47bc", emoji: "🥤" },
    "Main Showdown": { backgroundColor: "#29b6f6", emoji: "🍔" },
    "Wing It": { backgroundColor: "#66bb6a", emoji: "🍗" },
    Other: { backgroundColor: "#9e9e9e", emoji: "🍽️" },
  };

  return (
    <View style={styles.container}>
      {/* 🔝 Fixed Header (Logo + Search) */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={ShootersLogo}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.heroTitle}>SHOOTERS BAR & GRILL</Text>
            <Text style={styles.heroSubtitle}>Where Flavor Meets Fire 🔥</Text>
          </View>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search menu or category..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 🍽️ Menu Section */}
      <Animated.SectionList
        sections={groupedMenu}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderSectionHeader={({ section: { title } }) => {
          const { backgroundColor, emoji } =
            categoryStyles[title] || categoryStyles.Other;

          const fadeAnim = scrollY.interpolate({
            inputRange: [0, 250],
            outputRange: [1, 0.7],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[styles.banner, { backgroundColor, opacity: fadeAnim }]}
            >
              <Text style={styles.bannerText}>
                {emoji} {title}
              </Text>
            </Animated.View>
          );
        }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.foodImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={{ color: "#888" }}>No image available</Text>
              </View>
            )}

            <View style={styles.itemInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>R{item.price}</Text>
            </View>

            {item.description && (
              <Text style={styles.desc}>{item.description}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingTop: 150, paddingBottom: 120 }}
      />

      {/* 🛒 Floating Cart */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push("../cart")}
      >
        <Text style={styles.cartText}>🛒 {cart.length}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  // 🔝 Header
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    zIndex: 10,
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#222",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  heroLogo: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 10,
  },
  heroTitle: {
    color: "#00ffc3",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  heroSubtitle: {
    color: "#aaa",
    fontSize: 12,
    fontStyle: "italic",
  },
  search: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#111",
  },

  // 🍽️ Categories
  banner: {
    borderRadius: 12,
    padding: 14,
    marginTop: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  bannerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // 🍔 Menu Items
  itemCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 15,
    marginBottom: 18,
    marginHorizontal: 20,
    shadowColor: "#00ffc3",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  foodImage: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    marginBottom: 10,
  },
  placeholderImage: {
    width: "100%",
    height: 190,
    backgroundColor: "#222",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  price: { fontSize: 16, color: "#00ffc3", fontWeight: "bold" },
  desc: { color: "#bbb", marginTop: 6, fontSize: 14, lineHeight: 20 },

  // 🛒 Buttons
  button: {
    backgroundColor: "#00ffc3",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#00ffc3",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },

  cartButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#00ffc3",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 6,
  },
  cartText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});


