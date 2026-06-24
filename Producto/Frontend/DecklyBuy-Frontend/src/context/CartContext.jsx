import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Creamos el contexto
export const CartContext = createContext();

// 2. Creamos el Proveedor (Componente)
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem('decklybuy_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error leyendo localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('decklybuy_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (post) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === post.id);
      if (exists) {
        alert("Esta publicación ya está en tu carrito.");
        return prevCart;
      }
      return [...prevCart, { ...post, cantidad: 1 }];
    });
  };

  const removeFromCart = (postId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== postId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
  };

  const getCartCount = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. El Hook personalizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
};