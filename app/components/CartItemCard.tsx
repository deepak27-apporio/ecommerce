import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Product } from "../types/types";
import { getFullImageUrl } from "../utils/features";
import Link from "next/link";

interface CartItemProps {
  item: Product;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-surface-container-lowest rounded-lg p-6 ambient-shadow flex flex-col sm:flex-row gap-6 transition-transform hover:scale-[1.01] duration-300"
    >
      <Link href={`/product/${item.id}`} className="block">
        <div className="w-full sm:w-40 h-48 bg-slate-100 rounded-lg overflow-hidden shrink-0">
          <img
            src={getFullImageUrl(item.attachments[0]?.url)}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <span className="label-sm text-primary">{item.category}</span>
            <h3 className="h3 mt-1">{item.name}</h3>
            <p className="text-on-surface-variant text-sm mt-1">
              {item.variant}
            </p>
          </div>
          <span className="h3">₹{item.price.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center border border-slate-200 rounded-full px-4 py-2 space-x-4">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="hover:text-primary transition-colors"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold text-sm w-4 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="hover:text-primary transition-colors"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
