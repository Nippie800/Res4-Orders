import React, { createContext, useContext, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  updateQty: (id: string, qty: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p =>
          p.id === item.id ? { ...p, qty: p.qty + item.qty } : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // New: updateQty for increment/decrement
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev =>
        prev.map(item => (item.id === id ? { ...item, qty } : item))
      );
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotal, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
