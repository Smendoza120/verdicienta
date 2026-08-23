"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartContextType, CartItem, StoredCartItem } from "../types/cart.types";
import { Product } from "../../products";
import { Alert, Snackbar } from "@mui/material";

const CART_STORAGE_KEY = "verdicienta_cart_v1";
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) return [];

      const parsed: (CartItem | StoredCartItem)[] = JSON.parse(savedCart);

      // Si eran objetos completos antiguos con imágenes pesadas, los migramos/limpiamos
      return parsed.map((item) => {
        if ("product" in item && item.product) {
          // Sanitizamos eliminando arreglos de imágenes pesadas si existen en el storage local
          return {
            ...item,
            product: {
              ...item.product,
              images: item.product.images?.slice(0, 1) || [], // Mantiene máximo 1 imagen de portada
            },
          };
        }
        return item as CartItem;
      });
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });

  // Guardar cambios en el localStorage
  useEffect(() => {
    try {
      const lightweightItems = items.map((item) => ({
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          category: item.product.category,
          stock: item.product.stock,
          images: item.product.images?.slice(0, 1) || [],
        },
      }));

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lightweightItems));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [items]);

  // Agregar producto o incrementar cantidad
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      // Búsqueda limpia utilizando product.id
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id,
      );

      if (existingIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += quantity;
        return updatedItems;
      }

      return [...prevItems, { product, quantity }];
    });

    setNotification({
      open: true,
      message: `¡${product.name} añadido al carrito!`,
    });
  };

  // Eliminar producto por _id
  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  // Actualizar cantidad exacta
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Vaciar carrito
  const clearCart = () => {
    setItems([]);
  };

  const handleCloseNotification = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Cálculos acumulados
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}

      <Snackbar
        open={notification.open}
        autoHideDuration={2500}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, fontWeight: 500 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
