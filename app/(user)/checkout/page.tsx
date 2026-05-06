"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Lock,
  CreditCard,
  Wallet,
  Wifi,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useCart } from "@/app/context/CartContext";
import { getFullImageUrl } from "@/app/utils/features";
// import { createOrder } from "@/app/api/orderApi"; // ← apna actual API path yahan use karo
import { toast } from "react-hot-toast";
import { InputProps, ShippingFormValues } from "@/app/types/types";
import { create } from "domain";
import { createOrder, openRazorpay } from "@/app/api/order";

const Input = ({
  label,
  placeholder,
  type = "text",
  className = "",
  error,
  registration,
}: InputProps) => (
  <div className={`relative flex flex-col gap-1.5 ${className}`}>
    <label className="block text-sm font-medium text-on-surface-variant">
      {label}
    </label>
    <input
      {...registration}
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border bg-white focus:ring-1 outline-none transition-all duration-200 rounded-sm text-sm ${
        error
          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
          : "border-outline-variant focus:border-primary focus:ring-primary/20"
      }`}
    />
    {error && (
      <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>
    )}
  </div>
);

export default function CheckoutPage() {
  const [step, setStep] = useState("Information");
  const { items: cartItems, total } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  const onSubmit = async (values: ShippingFormValues) => {
    try {
      const payload = {
        address: {
          fullName: values.fullName,
          phone: values.phone,
          line1: values.address,
          line2: values.apartment ?? "",
          city: values.city,
          state: values.state,
          pincode: values.pinCode,
        },
        items: cartItems?.map((item) => ({
          productId: item.id,
          productName: item.name,
          attachments: item.attachments,
          productCategory: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
        addressId: 0,
        tax: total?.tax,
        shipping: total?.shipping,
      };

      const res = await createOrder(payload);

      openRazorpay(res);
      toast.success("Order placed successfully!");
      setStep("Shipping");
    } catch (err: any) {
      toast.error(err?.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/10 text-black">
      <main className="pt-10 pb-20 max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-semibold text-on-surface mb-2">
            Checkout
          </h1>
          <nav className="flex items-center gap-2 text-sm font-medium text-secondary">
            <Link
              href="/cart"
              className="hover:text-on-surface cursor-pointer transition-colors"
            >
              Cart
            </Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={step === "Information" ? "text-primary" : ""}>
              Information
            </span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={step === "Shipping" ? "text-primary" : ""}>
              Shipping
            </span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={step === "Payment" ? "text-primary" : ""}>
              Payment
            </span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* ── Left: Form ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-7 space-y-12"
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Shipping Address */}
              <section className="mb-12">
                <h2 className="text-2xl font-medium text-on-surface mb-6">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    className="md:col-span-1"
                    error={errors.fullName?.message}
                    registration={register("fullName", {
                      required: "Full name is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    className="md:col-span-1"
                    error={errors.phone?.message}
                    registration={register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit Indian mobile number",
                      },
                    })}
                  />
                  <Input
                    label="Address"
                    placeholder="House number and street name"
                    className="md:col-span-2"
                    error={errors.address?.message}
                    registration={register("address", {
                      required: "Address is required",
                    })}
                  />
                  <Input
                    label="Apartment, suite, etc. (optional)"
                    className="md:col-span-2"
                    error={errors.apartment?.message}
                    registration={register("apartment")}
                  />
                  <Input
                    label="City"
                    className="md:col-span-1"
                    error={errors.city?.message}
                    registration={register("city", {
                      required: "City is required",
                    })}
                  />
                  <Input
                    label="State"
                    className="md:col-span-1"
                    error={errors.state?.message}
                    registration={register("state", {
                      required: "State is required",
                    })}
                  />
                  <Input
                    label="Pin Code"
                    className="md:col-span-1"
                    error={errors.pinCode?.message}
                    registration={register("pinCode", {
                      required: "pin code is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Enter a valid 6-digit pin code",
                      },
                    })}
                  />
                </div>
              </section>

              {/* Payment Placeholder */}
              <section className="p-8 bg-slate-50 border border-outline-variant rounded-lg mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-primary" size={24} />
                  <h2 className="text-2xl font-medium text-on-surface">
                    Payment Method
                  </h2>
                </div>
                <p className="text-base text-on-surface-variant mb-6">
                  All transactions are secure and encrypted. Payment details are
                  entered in the next step.
                </p>
                <div className="flex gap-6 opacity-30 grayscale items-center">
                  <CreditCard size={32} />
                  <Wallet size={32} />
                  <Wifi size={32} />
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-100">
                <Link
                  className="flex items-center gap-2 text-secondary hover:text-on-surface transition-colors font-semibold text-sm group"
                  href="/cart"
                >
                  <ChevronLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Return to Cart
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white w-full md:w-auto px-10 py-4 font-bold text-sm rounded-sm shadow-lg shadow-black/10 hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    "Continue to Shipping"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* ── Right: Summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-5 h-full"
          >
            <OrderSummary />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

const OrderSummary = () => {
  const { items: cartItems, total } = useCart();
  console.log("Cart Items in Summary:", total);

  return (
    <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white p-8 border border-slate-100 shadow-sm rounded-xl">
      <h2 className="text-2xl font-medium text-on-surface mb-8">
        Order Summary
      </h2>

      <div className="space-y-6 mb-8">
        {cartItems?.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            <div className="relative w-20 h-24 bg-slate-50 flex-shrink-0 rounded-md overflow-hidden border border-slate-100">
              <img
                className="w-full h-full object-cover"
                src={getFullImageUrl(item.attachments?.[0]?.url)}
                alt={item.name}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-grow">
              <p className="text-xs text-secondary uppercase tracking-wider mb-1 font-medium">
                {item.category}
              </p>
              <h4 className="text-base font-semibold text-on-surface">
                {item.name}
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Quantity: {item.quantity}
              </p>
            </div>
            <p className="text-base font-semibold text-on-surface">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-100">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Subtotal</span>
          <span className="font-semibold">
            ₹{total?.subtotal?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Tax</span>
          <span className="font-semibold">
            ₹{total?.tax?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Shipping</span>
          <span className="text-secondary font-medium italic">
            {total?.shipping === 0
              ? "Free"
              : `₹${total?.shipping?.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="flex justify-between items-end pt-4 border-t border-slate-100">
          <span className="text-2xl font-medium text-on-surface">Total</span>
          <div className="text-right">
            <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1 leading-none">
              INR
            </p>
            <span className="text-2xl font-medium text-on-surface">
              ₹{total?.total?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
