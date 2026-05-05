"use client";
import { useMemo } from "react";
import { CartTotals } from "./types";
import { motion, AnimatePresence } from "motion/react";
import CartItemCard from "@/app/components/CartItemCard";
import OrderSummary from "@/app/components/OrderSummary";
import { useCart } from "@/app/context/CartContext";
import { calculateTotalPrices } from "@/app/utils/features";

export default function App() {
  const { removeFromCart, updateQuantity, items: cartItems, total } = useCart();

  return (
    <div className="min-h-screen flex flex-col font-sans text-black">
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-10 pb-stack-xl">
        <header className="mb-stack-lg">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h1 text-on-surface"
          >
            Your Bag
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant text-base mt-2"
          >
            Check out your selection before finalizing your order.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <section className="lg:col-span-8 space-y-stack-md">
            <AnimatePresence mode="popLayout">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center border-2 border-dashed border-slate-100 rounded-xl"
                >
                  <p className="text-slate-400 font-medium">
                    Your bag is empty.
                  </p>
                  <button
                    // onClick={() => setItems(cartItems)}
                    className="mt-4 text-primary font-semibold hover:underline"
                  >
                    Reset Demo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <OrderSummary totals={total} />
        </div>
      </main>
    </div>
  );
}
