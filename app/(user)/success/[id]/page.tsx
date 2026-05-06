"use client";
import { getOrderDetails } from "@/app/api/order";
import OrderSuccessSkeleton from "@/app/components/skeleton/OrderSuccessSkeleton";
import { useCart } from "@/app/context/CartContext";
import { useFetch } from "@/app/hooks/useFetch";
import { getFullImageUrl } from "@/app/utils/features";
import { Truck } from "lucide-react";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function page() {
  const { id } = useParams();
  const { clearCart } = useCart();
  const { data: orderDetails, isLoading } = useFetch(
    () => getOrderDetails(id as any),
    [id],
  );
  useEffect(() => {
    if(orderDetails)
    clearCart?.();
  }, [orderDetails, clearCart]);
  const order = orderDetails?.order;
  return (
    <div className="min-h-screen flex flex-col font-sans text-black mb-10">
      <h2 className="text-3xl font-semibold text-on-surface my-10 text-center">
        ORDER CONFIRMED!
      </h2>
      <main className="grow pb-stack-xl">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <OrderSuccessSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              <div className="lg:col-span-8 bg-white p-8 lg:p-10 rounded-xl border border-slate-100 shadow-sm">
                <h2 className="text-3xl font-semibold text-on-surface mb-10">
                  Order Summary
                </h2>
                <div className="space-y-10">
                  {order?.items.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-8 group"
                    >
                      <div className="w-24 h-32 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={getFullImageUrl(item.productImages)}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">
                          {item.productCategory}
                        </span>
                        <h3 className="text-2xl font-medium text-on-surface mt-1">
                          {item.productName}
                        </h3>
                        <p className="text-on-surface-variant text-sm mt-1">
                          • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-medium text-on-surface">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <aside className="lg:col-span-4 space-y-gutter">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-slate-50/50 p-8 rounded-xl border border-slate-200"
                >
                  <h3 className="text-xl font-semibold text-on-surface mb-8">
                    Payment Info
                  </h3>
                  <div className="space-y-5">
                    <div className="flex justify-between text-on-surface-variant font-normal">
                      <span className="text-sm">Subtotal</span>
                      <span className="text-sm font-medium tracking-tight">
                        ₹{order?.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span className="text-sm">Shipping</span>
                      <span className="text-primary font-semibold text-sm">
                        {order?.shipping === 0
                          ? "Free"
                          : `₹${order?.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span className="text-sm">Tax</span>
                      <span className="text-sm font-medium tracking-tight">
                        ₹{order?.tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-px bg-slate-200/60 my-2"></div>
                    <div className="flex justify-between text-on-surface font-bold text-xl tracking-tight">
                      <span>Total</span>
                      <span>₹{order?.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-on-surface mb-6">
                    Shipping Address
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed font-normal">
                    {order?.address.fullName}
                    <br />
                    {order?.address.phone}
                    <br />
                    {order?.address.line1}
                    <br />
                    {order?.address.city}, {order?.address.state}{" "}
                    {order?.address.postalCode}
                    <br />
                    {order?.address.country}
                  </p>
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-primary">
                      <Truck size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Standard Insured Shipping
                      </span>
                    </div>
                  </div>
                </motion.div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
