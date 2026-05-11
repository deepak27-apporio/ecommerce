// ActiveToggle.tsx
"use client";

import { useState } from "react";

interface ActiveToggleProps {
  productId: string | number;
  initialActive: boolean;
  onToggle?: (id: string | number, newStatus: boolean) => Promise<void>;
}

const ActiveToggle = ({ productId, initialActive, onToggle }: ActiveToggleProps) => {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = !active;
    try {
      if (onToggle) {
        await onToggle(productId, newStatus);
      }
      setActive(newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={active ? "Active" : "Inactive"}
      className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none
        ${active ? "bg-green-500" : "bg-gray-300"}
        ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300
          ${active ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
};

export default ActiveToggle;