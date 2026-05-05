import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types/types';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
     <Link
      href={`/product/${product.id}`}
      className="group relative block rounded-lg overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 rounded-sm mb-6 transition-all duration-500 ease-out shadow-[0px_4px_20px_rgba(15,23,42,0.05)] group-hover:shadow-[0px_12px_30px_rgba(15,23,42,0.1)]">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.attachments[0]?.url}`}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {product.badge && (
            <span
              className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${
                product.badge === "New"
                  ? "bg-primary text-white"
                  : product.badge === "Limited"
                    ? "bg-slate-900 text-white"
                    : "bg-red-600 text-white"
              }`}
            >
              {product.badge}
            </span>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm"
          >
            <ShoppingCart className="w-5 h-5 text-slate-900" />
          </motion.button>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-outline uppercase tracking-wider font-medium">
            {product.category}
          </p>
          <h3 className="text-lg text-on-surface font-semibold tracking-tight leading-tight">
            {product.name}
          </h3>
          <p className="text-base text-on-surface-variant font-medium">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
