"use client";
import { getAllOrders } from "@/app/api/order";
import OrderCard from "@/app/components/OrderCard";
import { useFetch } from "@/app/hooks/useFetch";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const { data, isLoading } = useFetch(() => getAllOrders(), []);
  const orders = data?.orders;
  const isEmpty = !isLoading && (!orders || orders.length === 0);

  return (
    <div className="min-h-screen bg-white text-black px-5">
      <main className="pt-10 pb-20 px-8 max-w-5xl mx-auto min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
        >
          {orders?.length > 0 && (
            <>
              <div>
                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                  Order History
                </h1>
                <p className="text-slate-500">
                  Review and manage your previous purchases.
                </p>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                {orders.length} order{orders.length > 1 ? "s" : ""}
              </span>
            </>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Loading Skeleton */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 p-6 space-y-3 animate-pulse"
                >
                  <div className="flex justify-between">
                    <div className="h-4 w-32 bg-slate-100 rounded-full" />
                    <div className="h-4 w-20 bg-slate-100 rounded-full" />
                  </div>
                  <div className="h-3 w-48 bg-slate-100 rounded-full" />
                  <div className="h-10 w-full bg-slate-50 rounded-xl" />
                </div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {isEmpty && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-5"
            >
              {/* Floating Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 14,
                  delay: 0.2,
                }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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
                      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2"
                    />
                  </svg>
                </motion.div>

                {/* Wiggle badge */}
                <motion.div
                  animate={{ rotate: [0, -12, 12, -8, 0] }}
                  transition={{
                    delay: 1,
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="absolute -top-1 -right-1 w-9 h-9 bg-yellow-300 rounded-full flex items-center justify-center text-base border border-yellow-200"
                >
                  📦
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
                  No orders yet
                </h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  You haven't placed any orders yet. Start shopping and your
                  orders will appear here.
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                  />
                </svg>
                Start Shopping
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
          )}

          {/* Orders List */}
          {!isLoading && orders?.length > 0 && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {orders.map((order: any, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <OrderCard {...order} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
