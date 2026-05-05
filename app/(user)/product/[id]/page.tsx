"use client";

import { getProductById } from "@/app/api/admin/productApi";
import {
  ProductError,
  ProductNotFound,
  ProductPageSkeleton,
} from "@/app/components/skeleton/SinleProduct";
import { useCart } from "@/app/context/CartContext";
import { useFetch } from "@/app/hooks/useFetch";
import { Attachment } from "@/app/types/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const ProductPage = () => {
  const { id } = useParams();
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useFetch(() => getProductById(id).then((res) => res.data), [id]);

  const Router = useRouter();

  const { addToCart } = useCart();

  if (isLoading) return <ProductPageSkeleton />;
  if (error) return <ProductError message={error} onRetry={refetch} />;
  if (!product) return <ProductNotFound />;

  const inStock = product.stock > 0;

  const addCardProduct = () => {
    addToCart(product);
    Router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <ol className="flex items-center gap-2 text-xs text-neutral-400 font-medium tracking-wide">
          <li>
            <Link href="/" className="hover:text-neutral-700 transition-colors">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li className="capitalize">{product.category}</li>
          <li>/</li>
          <li className="text-neutral-700 truncate max-w-[160px]">
            {product.name}
          </li>
        </ol>
      </nav>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <ProductGallery attachments={product.attachments} name={product.name} />

        <aside className="flex flex-col gap-5 lg:sticky lg:top-8">
          <span className="inline-block w-fit uppercase text-[10px] tracking-widest font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-500">
            {product.category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 leading-tight tracking-tight">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-neutral-500 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          <hr className="border-neutral-100" />

          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-neutral-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                inStock ? "bg-emerald-500" : "bg-red-400"
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                inStock ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {inStock ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {product.attachments.length > 1 && (
            <p className="text-xs text-neutral-400">
              {product.attachments.length} photos available — scroll thumbnails
              to browse
            </p>
          )}

          <hr className="border-neutral-100" />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              disabled={!inStock}
              onClick={addCardProduct}
              className="flex-1 bg-neutral-900 hover:bg-neutral-700 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-colors"
            >
              {inStock ? "Add to Cart" : "Unavailable"}
            </button>
            <button
              onClick={() => Router.back()}
              className="flex-1 text-center border border-neutral-200 hover:border-neutral-400 text-neutral-700 font-semibold py-3.5 px-6 rounded-xl text-sm transition-colors"
            >
              ← Back to Shop
            </button>
          </div>

          <p className="text-[10px] text-neutral-300 tracking-wide uppercase mt-1">
            Product ID: {product.id}
          </p>
        </aside>
      </section>
    </main>
  );
};

export default ProductPage;

function ProductGallery({
  attachments,
  name,
}: {
  attachments: Attachment[];
  name: string;
}) {
  const imgBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  const [activeIdx, setActiveIdx] = useState(0);

  if (!attachments.length) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
        No Images
      </div>
    );
  }

  const active = attachments[activeIdx];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100">
        <img
          key={active.id}
          src={`${imgBase}${active.url}`}
          alt={`${name} — image ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Image counter badge */}
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
          {activeIdx + 1} / {attachments.length}
        </span>
      </div>

      {/* Thumbnails — only show when more than 1 image */}
      {attachments.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {attachments.map((att, i) => (
            <button
              key={att.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === activeIdx
                  ? "border-neutral-900 scale-105 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={`${imgBase}${att.url}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
