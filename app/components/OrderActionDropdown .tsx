"use client";

import { useState, useRef, useEffect, memo } from "react";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../api/admin/orderApi";

const ORDER_STEPS = [
  {
    label: "Confirmed",
    key: "CREATED",
    color: "text-gray-600",
    bg: "hover:bg-gray-50",
  },
  {
    label: "Processing",
    key: "PROCESSING",
    color: "text-amber-600",
    bg: "hover:bg-amber-50",
  },
  {
    label: "Shipped",
    key: "SHIPPED",
    color: "text-blue-600",
    bg: "hover:bg-blue-50",
  },
  {
    label: "Delivered",
    key: "DELIVERED",
    color: "text-green-600",
    bg: "hover:bg-green-50",
  },
];

interface Props {
  orderId: string;
  currentStatus: string;
}

const OrderActionDropdown = ({ orderId, currentStatus }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleStatusChange = async (key: string) => {
    if (key === status) {
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      await updateOrderStatus(orderId, key);
      setStatus(key);
      setOpen(false);
    } catch (err: any) {
      toast.error(
        err.message || "Failed to update order status. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const current = ORDER_STEPS.find((s) => s.key === status);

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="flex items-center gap-2 text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <span
            className={`w-2 h-2 rounded-full ${
              status === "CREATED"
                ? "bg-gray-500"
                : status === "PROCESSING"
                  ? "bg-amber-500"
                  : status === "SHIPPED"
                    ? "bg-blue-500"
                    : status === "DELIVERED"
                      ? "bg-green-500"
                      : "bg-gray-400"
            }`}
          />
        )}
        <span>{current?.label ?? "Manage"}</span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          <div className="py-1">
            {ORDER_STEPS.map((step, index) => {
              const isCurrent = step.key === status;
              const currentIndex = ORDER_STEPS.findIndex(
                (s) => s.key === status,
              );
              const isPast = index < currentIndex;

              return (
                <button
                  key={step.key}
                  onClick={() => handleStatusChange(step.key)}
                  disabled={isPast}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                    ${isPast ? "opacity-40 cursor-not-allowed" : step.bg + " cursor-pointer"}
                    ${isCurrent ? "font-medium bg-gray-50" : ""}
                  `}
                >
                  {/* Step indicator */}
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      step.key === "CREATED"
                        ? "bg-gray-400"
                        : step.key === "PROCESSING"
                          ? "bg-amber-400"
                          : step.key === "SHIPPED"
                            ? "bg-blue-400"
                            : "bg-green-400"
                    }`}
                  />

                  <span className={step.color}>{step.label}</span>

                  {/* Checkmark for current */}
                  {isCurrent && (
                    <svg
                      className="ml-auto w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider + View Detail */}
          <div className="border-t border-gray-100">
            <a
              href={`/admin/orders/${orderId}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7..."
                />
              </svg>
              View Detail
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(OrderActionDropdown);
