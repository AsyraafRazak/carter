import { createContext, useContext, useMemo, useState } from 'react';
import { cartApi } from '../api/resources';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalPoints: 0 });
  const [loading, setLoading] = useState(false);

  async function loadCart() {
    setLoading(true);
    try {
      const data = await cartApi.get();
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(voucher, quantity = 1) {
    await cartApi.add({ voucher, quantity });
    return loadCart();
  }

  async function updateQuantity(id, quantity) {
    await cartApi.update(id, quantity);
    return loadCart();
  }

  async function removeItem(id) {
    await cartApi.remove(id);
    return loadCart();
  }

  const value = useMemo(() => ({
    cart,
    loading,
    loadCart,
    addToCart,
    updateQuantity,
    removeItem
  }), [cart, loading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
