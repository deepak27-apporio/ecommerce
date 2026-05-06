"use client";
import { motion, AnimatePresence } from "motion/react";
import CartItemCard from "@/app/components/CartItemCard";
import OrderSummary from "@/app/components/OrderSummary";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const { removeFromCart, updateQuantity, items: cartItems, total } = useCart();

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen flex flex-col font-sans text-black">
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-10 pb-20">

        {/* ✅ Empty State — full centered, no order summary */}
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-5"
            >
              {/* Floating Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.847-7.158a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </motion.div>

                {/* Wiggle badge */}
                <motion.div
                  animate={{ rotate: [0, -12, 12, -8, 0] }}
                  transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute -top-1 -right-1 w-9 h-9 bg-yellow-300 rounded-full flex items-center justify-center text-base shadow-sm border border-yellow-200"
                >
                  😢
                </motion.div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-2"
              >
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Your cart is empty
                </h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Looks like you haven't added anything yet. Explore our collection and find something you love!
                </p>
              </motion.div>

              {/* Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push("/search")}
                className="flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-slate-800 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Continue Shopping
              </motion.button>

              {/* Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xs text-slate-300 flex items-center gap-1.5"
              >
                🚚 Free shipping on orders over ₹500
              </motion.p>
            </motion.div>

          ) : (
            /* ✅ Cart has items — show grid with order summary */
            <motion.div
              key="filled"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <section className="lg:col-span-8 space-y-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </AnimatePresence>
              </section>

              <OrderSummary totals={total} />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}