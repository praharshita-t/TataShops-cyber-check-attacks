import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI, authAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('local_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // Synchronize cart with backend if user is logged in
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      if (res.success && res.cart) {
        setItems(res.cart.items || []);
      }
    } catch (err) {
      console.warn('Could not sync cart with backend:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth state on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI
        .getMe()
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
            fetchCart();
          }
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        });
    }
  }, [fetchCart]);

  // Persist local cart when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('local_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);

      // If user had local items, push them to backend
      const localCart = JSON.parse(localStorage.getItem('local_cart') || '[]');
      if (localCart.length > 0) {
        for (const itm of localCart) {
          await cartAPI.addToCart(itm.id, itm.quantity).catch(() => {});
        }
        localStorage.removeItem('local_cart');
      }

      await fetchCart();
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      await fetchCart();
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setItems([]);
  };

  const addToCart = async (product, quantity = 1) => {
    if (user && localStorage.getItem('token')) {
      try {
        const res = await cartAPI.addToCart(product.id, quantity);
        if (res.success && res.cart) {
          setItems(res.cart.items || []);
        }
      } catch (err) {
        console.error('Add to cart API error:', err);
      }
    } else {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (user && localStorage.getItem('token')) {
      try {
        const res = await cartAPI.updateQuantity(productId, quantity);
        if (res.success && res.cart) {
          setItems(res.cart.items || []);
        }
      } catch (err) {
        console.error('Update quantity API error:', err);
      }
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
      );
    }
  };

  const increment = (id) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const decrement = (id) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const removeFromCart = async (productId) => {
    if (user && localStorage.getItem('token')) {
      try {
        const res = await cartAPI.removeFromCart(productId);
        if (res.success && res.cart) {
          setItems(res.cart.items || []);
        }
      } catch (err) {
        console.error('Remove from cart API error:', err);
      }
    } else {
      setItems((prev) => prev.filter((i) => i.id !== productId));
    }
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('local_cart');
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        user,
        loading,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        increment,
        decrement,
        clearCart,
        fetchCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
