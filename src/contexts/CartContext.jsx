import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("carts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("carts", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (userId, product, color, size, quantity) => {
    if (!product) return;

    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const userCartIndex = updatedCart.findIndex((c) => c.userId === userId);

      if (userCartIndex === -1) {
        const newUserCart = {
          userId,
          items: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              color,
              size,
              quantity,
              image: product.image,
            },
          ],
        };
        return [...updatedCart, newUserCart];
      }

      const userCart = { ...updatedCart[userCartIndex] };
      const existingIndex = userCart.items.findIndex(
        (item) => item.id === product.id && item.color === color && item.size === size
      );

      if (existingIndex !== -1) {
        userCart.items = [...userCart.items];
        userCart.items[existingIndex].quantity += quantity;
      } else {
        userCart.items = [
          ...userCart.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            color,
            size,
            quantity,
          },
        ];
      }

      updatedCart[userCartIndex] = userCart;
      return updatedCart;
    });
  };

  const removeFromCart = (userId, productId, color, size) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const userCartIndex = updatedCart.findIndex((c) => c.userId === userId);
      if (userCartIndex === -1) return prevCart;

      const userCart = { ...updatedCart[userCartIndex] };
      userCart.items = userCart.items.filter(
        (item) => !(item.id === productId && item.color === color && item.size === size)
      );

      if (userCart.items.length === 0) {
        updatedCart.splice(userCartIndex, 1);
      } else {
        updatedCart[userCartIndex] = userCart;
      }

      return updatedCart;
    });
  };

  const updateQuantity = (userId, productId, color, size, quantity) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const userCartIndex = updatedCart.findIndex((c) => c.userId === userId);
      if (userCartIndex === -1) return prevCart;

      const userCart = { ...updatedCart[userCartIndex] };
      userCart.items = userCart.items.map((item) =>
        item.id === productId && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      );

      updatedCart[userCartIndex] = userCart;
      return updatedCart;
    });
  };

  const clearCart = (userId) => {
    setCart((prevCart) => prevCart.filter((c) => c.userId !== userId));
  };

  const getUserCart = (userId) => {
    return cart.find((c) => c.userId === userId)?.items || [];
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getUserCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
