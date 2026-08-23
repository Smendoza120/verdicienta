import { Product } from "../../products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoredCartItem {
  id: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};