"use client";

import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaTachometerAlt,
  FaBoxOpen,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { logout } from "../api/authApi";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, setState } = useAuth();
  const { items: cartItems } = useCart();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoutHandler = async () => {
    try {
      const res: any = await logout();
      if (res.success) {
        localStorage.removeItem("user");
        setState((pre) => ({ ...pre, user: null }));
        toast.success(res.message || "Logged out successfully!");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Logout failed. Please try again.");
    } finally {
      setIsOpen(false);
    }
    // TODO: call your logout API
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-white font-bold text-lg tracking-widest hover:text-indigo-400 transition"
        >
          ML
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Link
            href="/search"
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <FaSearch size={14} />
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition relative"
          >
            <FaShoppingBag size={14} />
            {cartItems.length > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user?.id ? (
            <div className="relative ml-1" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition ${
                  isOpen
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <FaUser size={14} />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 top-11 w-44 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                  {user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                    >
                      <FaTachometerAlt size={12} className="text-indigo-400" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                  >
                    <FaBoxOpen size={12} className="text-indigo-400" />
                    My Orders
                  </Link>
                  <div className="border-t border-zinc-800" />
                  <button
                    onClick={logoutHandler}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                  >
                    <FaSignOutAlt size={12} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-1 flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
            >
              <FaSignInAlt size={12} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
