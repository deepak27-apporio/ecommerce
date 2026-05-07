"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Lock, CreditCard, Wallet, Wifi, Loader2, Plus, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useCart } from "@/app/context/CartContext";
import { toast } from "react-hot-toast";
import { Address, InputProps, ShippingFormValues } from "@/app/types/types";
import { createOrder, openRazorpay } from "@/app/api/order";
import { useAuth } from "@/app/context/AuthContext";
import { getFullImageUrl } from "@/app/utils/features";

const Input = ({ label, placeholder, type = "text", className = "", error, registration }: InputProps) => (
  <div className={`relative flex flex-col gap-1.5 ${className}`}>
    <label className="block text-sm font-medium text-on-surface-variant">{label}</label>
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
    {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
  </div>
);

const AddressCard = ({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}) => (
  <div
    onClick={onSelect}
    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
      selected
        ? "border-black border-2 bg-white"
        : "border-outline-variant hover:border-gray-400 hover:bg-gray-50"
    }`}
  >
    <div className={`mt-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
      selected ? "border-black" : "border-gray-300"
    }`}>
      {selected && <div className="w-2 h-2 rounded-full bg-black" />}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-on-surface">{address.fullName}</span>
      </div>
      <p className="text-xs text-secondary leading-relaxed">
        {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
        {address.city}, {address.state} – {address.postalCode}
      </p>
      <p className="text-xs text-secondary mt-1">+91 {address.phone}</p>
    </div>

    {selected && (
      <MapPin size={14} className="text-black mt-0.5 flex-shrink-0" />
    )}
  </div>
);

export default function CheckoutPage() {
  const [step, setStep] = useState("Information");
  const { user } = useAuth();
  const { items: cartItems, total } = useCart();

  const savedAddresses: Address[] = user?.addresses ?? [];
  const defaultSelection = savedAddresses.length > 0 ? `saved-${savedAddresses[0].id}` : "new";
  const [selectedAddress, setSelectedAddress] = useState<string>(defaultSelection);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    defaultValues: {
      fullName: "", phone: "", address: "",
      apartment: "", city: "", state: "", pinCode: "",
    },
  });

  const isNewAddress = selectedAddress === "new";

  const onSubmit = async (values: ShippingFormValues) => {
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        attachments: item.attachments,
        productCategory: item.category,
        quantity: item.quantity,
        price: item.price,
      }));

      const payload = isNewAddress
        ? {
            address: {
              fullName: values.fullName,
              phone: values.phone,
              line1: values.address,
              line2: values.apartment ?? "",
              city: values.city,
              state: values.state,
              pincode: values.pinCode,
            },
            addressId: 0,
            items: orderItems,
            tax: total.tax,
            shipping: total.shipping,
          }
        : {
            addressId: parseInt(selectedAddress.replace("saved-", "")),
            address: null,
            items: orderItems,
            tax: total.tax,
            shipping: total.shipping,
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-semibold text-on-surface mb-2">Checkout</h1>
          <nav className="flex items-center gap-2 text-sm font-medium text-secondary">
            <Link href="/cart" className="hover:text-on-surface cursor-pointer transition-colors">Cart</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={step === "Information" ? "text-primary" : ""}>Information</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={step === "Shipping" ? "text-primary" : ""}>Shipping</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={step === "Payment" ? "text-primary" : ""}>Payment</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-7 space-y-12"
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <section className="mb-12">
                <h2 className="text-2xl font-medium text-on-surface mb-6">Shipping Address</h2>

                {/* ── Saved Addresses ── */}
                {savedAddresses.length > 0 && (
                  <div className="flex flex-col gap-3 mb-5">
                    {savedAddresses.map((addr) => (
                      <AddressCard
                        key={addr.id}
                        address={addr}
                        selected={selectedAddress === `saved-${addr.id}`}
                        onSelect={() => setSelectedAddress(`saved-${addr.id}`)}
                      />
                    ))}

                    {/* Add new address option */}
                    <div
                      onClick={() => setSelectedAddress("new")}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                        isNewAddress
                          ? "border-black border-2"
                          : "border-dashed border-outline-variant hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isNewAddress ? "border-black" : "border-gray-300"
                      }`}>
                        {isNewAddress
                          ? <div className="w-2 h-2 rounded-full bg-black" />
                          : <Plus size={10} className="text-gray-400" />
                        }
                      </div>
                      <span className="text-sm text-secondary">Add a new address</span>
                    </div>
                  </div>
                )}

                {isNewAddress && (
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${savedAddresses.length > 0 ? "mt-4 p-4 border border-outline-variant rounded-lg" : ""}`}>
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
                        pattern: { value: /^[6-9]\d{9}$/, message: "Valid 10-digit Indian number" },
                      })}
                    />
                    <Input
                      label="Address"
                      placeholder="House number and street name"
                      className="md:col-span-2"
                      error={errors.address?.message}
                      registration={register("address", { required: "Address is required" })}
                    />
                    <Input
                      label="Apartment, suite, etc. (optional)"
                      className="md:col-span-2"
                      registration={register("apartment")}
                    />
                    <Input
                      label="City"
                      className="md:col-span-1"
                      error={errors.city?.message}
                      registration={register("city", { required: "City is required" })}
                    />
                    <Input
                      label="State"
                      className="md:col-span-1"
                      error={errors.state?.message}
                      registration={register("state", { required: "State is required" })}
                    />
                    <Input
                      label="Pin Code"
                      className="md:col-span-1"
                      error={errors.pinCode?.message}
                      registration={register("pinCode", {
                        required: "Pin code is required",
                        pattern: { value: /^\d{6}$/, message: "Valid 6-digit pin code" },
                      })}
                    />
                  </div>
                )}
              </section>

              <section className="p-8 bg-slate-50 border border-outline-variant rounded-lg mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-primary" size={24} />
                  <h2 className="text-2xl font-medium text-on-surface">Payment Method</h2>
                </div>
                <p className="text-base text-on-surface-variant mb-6">
                  All transactions are secure and encrypted.
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
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Return to Cart
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white w-full md:w-auto px-10 py-4 font-bold text-sm rounded-sm shadow-lg shadow-black/10 hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Placing Order…</>
                  ) : (
                    "Continue to Shipping"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right: Summary */}
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
            ₹{total.subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Tax</span>
          <span className="font-semibold">
            ₹{total.tax.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Shipping</span>
          <span className="text-secondary font-medium italic">
            {total.shipping === 0
              ? "Free"
              : `₹${total.shipping.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="flex justify-between items-end pt-4 border-t border-slate-100">
          <span className="text-2xl font-medium text-on-surface">Total</span>
          <div className="text-right">
            <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1 leading-none">
              INR
            </p>
            <span className="text-2xl font-medium text-on-surface">
              ₹{total.total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
