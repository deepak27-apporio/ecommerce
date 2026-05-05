"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import {
  CartAction,
  CartContextType,
  CartState,
  Product,
} from "../types/types";
import { calculateTotalPrices } from "../utils/features";
import { DecryptData, EncryptData } from "../utils/EncryptDecrypt";

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let items: Product[];

  switch (action.type) {
    case "HYDRATE":
      items = action.payload;
      break;

    case "ADD":
      const existing = state.items.find((i) => i.id === action.payload.id);
      items = existing
        ? state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity < i.stock ? i.quantity + (action.payload.quantity || 1) : i.quantity }
              : i,
          )
        : [...state.items, { ...action.payload, quantity: 1 }];
      break;

    case "REMOVE":
      items = state.items.filter((i) => i.id != action.payload);
      break;

    case "UPDATE_QTY":
      console.log(action.payload);
      items = state.items.map((i) =>
        i.id === action.payload.id
          ? { ...i, quantity: i.quantity + action.payload.quantity }
          : i,
      );
      break;

    case "CLEAR":
      items = [];
      break;

    default:
      return state;
  }

  // const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total: any = calculateTotalPrices(items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, total, count };
};

const initialState: CartState = { items: [], total: 0, count: 0 };

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const saved = DecryptData("cart");
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {}
  }, []);

  useEffect(() => {
    EncryptData("cart", state.items);
  }, [state.items]);

  const addToCart = useCallback(
    (item: Product) => dispatch({ type: "ADD", payload: item }),
    [],
  );

  const removeFromCart = useCallback(
    (id: number) => dispatch({ type: "REMOVE", payload: id }),
    [],
  );

  const updateQuantity = useCallback(
    (id: number, quantity: number) =>
      dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
    [],
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
