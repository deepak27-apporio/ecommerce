import { useForm } from "react-hook-form";

export interface CartTotal {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface Address {
  id: number;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Attachment {
  id: number;
  fileId: string;
  url: string;
  provider: string;
  mimeType: string;
  size: number;
  productId: number;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  attachments: Attachment[];
}

export interface CartState {
  items: Product[];
  total: CartTotal;
  count: number;
}

export type CartAction =
  | { type: "ADD"; payload: Product }
  | { type: "REMOVE"; payload: number }
  | { type: "UPDATE_QTY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: Product[] };

export interface CartContextType extends CartState {
  addToCart: (item: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export interface ShippingFormValues {
  fullName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}

