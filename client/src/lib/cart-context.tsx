import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

interface CartProduct {
  id: number;
  name: string;
  price: number;
  subscriptionPrice?: number;
  imageUrl?: string;
  unitSize?: string;
  slug: string;
}

interface CartItemData {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  isSubscription: boolean;
  product?: CartProduct;
}

interface CartData {
  items: CartItemData[];
  subtotal: number;
  itemCount: number;
}

interface CartContextType {
  items: CartItemData[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number, isSubscription?: boolean) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  isAdding: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery<CartData>({
    queryKey: ["/api/cart"],
  });

  const addMutation = useMutation({
    mutationFn: async ({ productId, quantity, isSubscription }: { productId: number; quantity: number; isSubscription: boolean }) => {
      const res = await apiRequest("POST", "/api/cart", { productId, quantity, isSubscription });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const res = await apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const res = await apiRequest("DELETE", `/api/cart/${itemId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const addToCart = useCallback((productId: number, quantity = 1, isSubscription = false) => {
    addMutation.mutate({ productId, quantity, isSubscription });
  }, [addMutation]);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    updateMutation.mutate({ itemId, quantity });
  }, [updateMutation]);

  const removeItem = useCallback((itemId: number) => {
    removeMutation.mutate(itemId);
  }, [removeMutation]);

  return (
    <CartContext.Provider value={{
      items: cart?.items || [],
      subtotal: cart?.subtotal || 0,
      itemCount: cart?.itemCount || 0,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      isAdding: addMutation.isPending,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
