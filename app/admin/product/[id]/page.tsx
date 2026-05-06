"use client";

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaBoxes,
  FaImage,
  FaPen,
  FaPlus,
  FaRupeeSign,
  FaSync,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/app/api/admin/productApi";
import ConfirmModal from "@/app/components/ConfermationModal";
import { CATEGORIES } from "@/app/types/Constants";

type ProductAttachment = {
  id: number;
  fileId?: string;
  url: string;
  mimeType?: string;
  size?: number;
};
type Product = {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  attachments?: ProductAttachment[];
};
type FormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  replaceImages: boolean;
};
type ImageReplacement = { attachmentId: number; file: File; preview: string };

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;
const getImageUrl = (url: string, imageBase: string) => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:")
  )
    return url;
  return `${imageBase}${url}`;
};
const formatBytes = (bytes?: number) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ProductManagement = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addFileRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imageReplacements, setImageReplacements] = useState<
    ImageReplacement[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      replaceImages: false,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setFetchError("");
        const res = await getProductById(id);
        const loadedProduct: Product = res.data ?? res;
        const attachments = loadedProduct.attachments ?? [];
        setProduct(loadedProduct);
        setActiveImageId(attachments[0]?.id ?? null);
        reset({
          name: loadedProduct.name,
          description: loadedProduct.description ?? "",
          price: loadedProduct.price,
          stock: loadedProduct.stock,
          category: loadedProduct.category,
          replaceImages: false,
        });
      } catch {
        setFetchError("Could not load product. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, reset]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((p) => URL.revokeObjectURL(p));
      imageReplacements.forEach((r) => URL.revokeObjectURL(r.preview));
    };
  }, [imageReplacements, newImagePreviews]);

  const existingImages = useMemo(() => product?.attachments ?? [], [product]);
  const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  const activeImage =
    existingImages.find((a) => a.id === activeImageId) ??
    existingImages[0] ??
    null;
  const activeReplacement = activeImage
    ? imageReplacements.find((r) => r.attachmentId === activeImage.id)
    : null;
  const activeImageUrl = activeReplacement
    ? activeReplacement.preview
    : activeImage
      ? getImageUrl(activeImage.url, imageBase)
      : "";

  const handleAddImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setNewImages((c) => [...c, ...files]);
    setNewImagePreviews((c) => [
      ...c,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (addFileRef.current) addFileRef.current.value = "";
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((c) => c.filter((_, i) => i !== index));
    setNewImagePreviews((c) => c.filter((_, i) => i !== index));
  };

  const handleReplaceExistingImage = (
    attachmentId: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImageReplacements((c) => {
      const old = c.find((r) => r.attachmentId === attachmentId);
      if (old) URL.revokeObjectURL(old.preview);
      return [
        ...c.filter((r) => r.attachmentId !== attachmentId),
        { attachmentId, file, preview },
      ];
    });
    event.target.value = "";
  };

  const cancelReplacement = (attachmentId: number) => {
    setImageReplacements((c) => {
      const r = c.find((item) => item.attachmentId === attachmentId);
      if (r) URL.revokeObjectURL(r.preview);
      return c.filter((item) => item.attachmentId !== attachmentId);
    });
  };

  const clearPreviewState = () => {
    newImagePreviews.forEach((p) => URL.revokeObjectURL(p));
    imageReplacements.forEach((r) => URL.revokeObjectURL(r.preview));
    setNewImages([]);
    setNewImagePreviews([]);
    setImageReplacements([]);
  };

  const onSubmit = async (values: FormValues) => {
    if (!product) return;
    try {
      setSubmitting(true);
      setMessage(null);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", String(values.price));
      formData.append("stock", String(values.stock));
      formData.append("category", values.category);
      newImages.forEach((file) => formData.append("images", file));
      imageReplacements.forEach((r) =>
        formData.append(`replaceFile_${r.attachmentId}`, r.file),
      );
      const url = values.replaceImages
        ? `/admin/product/${id}?replace=true`
        : `/admin/product/${id}`;
      const data = await updateProduct(formData, url);
      if (!data?.success) throw new Error(data?.message ?? "Update failed");
      const updatedProduct: Product = data.data ?? data;
      const updatedImages = updatedProduct.attachments ?? [];
      setProduct(updatedProduct);
      setActiveImageId(updatedImages[0]?.id ?? null);
      reset({
        name: updatedProduct.name,
        description: updatedProduct.description ?? "",
        price: updatedProduct.price,
        stock: updatedProduct.stock,
        category: updatedProduct.category,
        replaceImages: false,
      });
      clearPreviewState();
      setMessage({ text: "Product updated successfully.", type: "success" });
    } catch (error) {
      setMessage({
        text: getErrorMessage(error, "Something went wrong."),
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    setDeleteModalOpen(false);
    try {
      setDeleting(true);
      const response = await deleteProduct(id);
      if (!response.success)
        throw new Error(response.message ?? "Delete failed");
      toast.success(response.message ?? "Product deleted.");
      router.push("/admin/product");
    } catch (error) {
      setMessage({
        text: getErrorMessage(error, "Delete failed."),
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  // ── Loading ──
  if (loading)
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F6F8FB" }}
      >
        <div className="flex flex-col gap-4 w-full max-w-5xl px-6">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[500px] bg-slate-200 rounded-2xl animate-pulse" />
            <div className="h-[500px] bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </main>
    );

  // ── Error ──
  if (fetchError || !product)
    return (
      <main
        className="min-h-screen flex items-center justify-center text-slate-800"
        style={{ background: "#F6F8FB" }}
      >
        <div className="text-center space-y-3">
          <p className="text-4xl">🚫</p>
          <h1 className="text-xl font-semibold">Product not found</h1>
          <p className="text-slate-400 text-sm">
            {fetchError || "This product could not be loaded."}
          </p>
          <Link
            href="/admin/product"
            className="inline-block mt-4 text-sm text-slate-400 hover:text-slate-700 underline underline-offset-4"
          >
            ← Back to products
          </Link>
        </div>
      </main>
    );

  return (
    <>
      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Product?"
        description={`"${product.name}" will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      <main
        className="min-h-screen text-slate-800 px-4 py-8 font-sans"
        style={{ background: "#F6F8FB" }}
      >
        {/* Top Bar */}
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
          <Link
            href="/admin/product"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-xs" />
            Products
          </Link>
          <button
            disabled={deleting}
            onClick={() => setDeleteModalOpen(true)}
            type="button"
            className="flex items-center gap-2 text-sm bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
          >
            {deleting ? (
              <FaSync className="animate-spin text-xs" />
            ) : (
              <FaTrash className="text-xs" />
            )}
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── LEFT: Gallery Card ── */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
            {/* Main Image */}
            <div className="relative aspect-square bg-slate-100">
              {activeImageUrl ? (
                <img
                  src={activeImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300">
                  <FaImage className="text-4xl" />
                  <span className="text-sm">No image</span>
                </div>
              )}
              {/* Stock pill */}
              <span
                className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full border ${product.stock > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-500"}`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Thumbnails */}
            {existingImages.length > 0 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-slate-50 border-b border-slate-100">
                {existingImages.map((attachment, index) => {
                  const replacement = imageReplacements.find(
                    (r) => r.attachmentId === attachment.id,
                  );
                  const src = replacement
                    ? replacement.preview
                    : getImageUrl(attachment.url, imageBase);
                  return (
                    <button
                      key={attachment.id}
                      onClick={() => setActiveImageId(attachment.id)}
                      type="button"
                      className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage?.id === attachment.id ? "border-slate-800 scale-95" : "border-slate-200 hover:border-slate-400"}`}
                    >
                      <img
                        src={src}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {replacement && (
                        <span className="absolute inset-0 bg-blue-500/40 flex items-center justify-center text-[9px] font-bold text-white">
                          NEW
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Product Info */}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">
                    ID #{product.id}
                  </p>
                  <h1 className="text-xl font-semibold leading-snug text-slate-800">
                    {product.name}
                  </h1>
                  <span className="inline-block mt-1 text-[11px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800 whitespace-nowrap">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                {product.description ||
                  "No description added for this product."}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mt-auto pt-3 border-t border-slate-100">
                {[
                  {
                    icon: <FaRupeeSign />,
                    label: "Price",
                    value: product.price.toLocaleString("en-IN"),
                  },
                  { icon: <FaBoxes />, label: "Stock", value: product.stock },
                  {
                    icon: <FaImage />,
                    label: "Images",
                    value: existingImages.length,
                  },
                ].map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center"
                  >
                    <div className="text-slate-400 text-xs mb-1 flex justify-center">
                      {icon}
                    </div>
                    <p className="text-[11px] text-slate-400 mb-0.5">{label}</p>
                    <p className="text-base font-semibold text-slate-700">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── RIGHT: Edit Card ── */}
          <section className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest">
                  Admin controls
                </p>
                <h2 className="text-base font-semibold mt-0.5 text-slate-800">
                  Edit Product
                </h2>
              </div>
              {isDirty && (
                <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full animate-pulse">
                  Unsaved changes
                </span>
              )}
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="flex flex-col gap-5 p-6 overflow-y-auto flex-1"
            >
              {/* Name + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                  />
                  {errors.name && (
                    <small className="text-red-500 text-xs">
                      {errors.name.message}
                    </small>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Category
                  </label>
                  <select
                    {...register("category", {
                      required: "Please select a category.",
                    })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <small className="text-red-500 text-xs">
                      {errors.category.message}
                    </small>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Description
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Price (₹)",
                    key: "price" as const,
                    rules: {
                      required: "Price is required",
                      min: { value: 0, message: "Must be 0 or more" },
                      valueAsNumber: true,
                    },
                  },
                  {
                    label: "Stock",
                    key: "stock" as const,
                    rules: {
                      required: "Stock is required",
                      min: { value: 0, message: "Must be 0 or more" },
                      valueAsNumber: true,
                    },
                  },
                ].map(({ label, key, rules }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                      {label}
                    </label>
                    <input
                      type="number"
                      min={0}
                      {...register(key, rules)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                    />
                    {errors[key] && (
                      <small className="text-red-500 text-xs">
                        {errors[key]?.message}
                      </small>
                    )}
                  </div>
                ))}
              </div>

              {/* Image Manager */}
              <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700">
                      Product Images
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Multiple images supported
                    </p>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 px-3 py-2 rounded-lg cursor-pointer transition-all border border-slate-200">
                    <FaPlus className="text-[10px]" /> Add
                    <input
                      accept="image/*"
                      className="sr-only"
                      multiple
                      onChange={handleAddImages}
                      ref={addFileRef}
                      type="file"
                    />
                  </label>
                </div>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {existingImages.map((attachment, index) => {
                      const replacement = imageReplacements.find(
                        (r) => r.attachmentId === attachment.id,
                      );
                      const src = replacement
                        ? replacement.preview
                        : getImageUrl(attachment.url, imageBase);
                      return (
                        <div
                          key={attachment.id}
                          className="relative bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                        >
                          <img
                            src={src}
                            alt={`saved ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <div className="px-2.5 py-2 flex items-center justify-between">
                            <div>
                              <p className="text-[11px] text-slate-600 font-medium">
                                {replacement
                                  ? "✦ Replacement"
                                  : `Image ${index + 1}`}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {formatBytes(attachment.size)}
                              </p>
                            </div>
                            {replacement ? (
                              <button
                                onClick={() => cancelReplacement(attachment.id)}
                                type="button"
                                className="text-red-400 hover:text-red-600 p-1 transition-colors"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            ) : (
                              <label className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors">
                                <FaPen className="text-xs" />
                                <input
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={(e) =>
                                    handleReplaceExistingImage(attachment.id, e)
                                  }
                                  type="file"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* New images */}
                {newImagePreviews.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {newImagePreviews.map((preview, index) => (
                      <div key={preview} className="relative flex-shrink-0">
                        <img
                          src={preview}
                          alt={`new ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-blue-300"
                        />
                        <button
                          onClick={() => removeNewImage(index)}
                          type="button"
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <FaTimes className="text-[9px] text-white" />
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-blue-500/80 text-white rounded-b-lg py-0.5">
                          NEW
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {!existingImages.length && !newImagePreviews.length && (
                  <div className="flex flex-col items-center justify-center py-6 text-slate-300 gap-2">
                    <FaImage className="text-2xl" />
                    <p className="text-xs">
                      No images yet. Add product images.
                    </p>
                  </div>
                )}

                {existingImages.length > 0 && newImages.length > 0 && (
                  <label className="flex items-center gap-2.5 text-xs text-slate-500 cursor-pointer hover:text-slate-700 transition-colors border-t border-slate-200 pt-3 mt-1">
                    <input
                      type="checkbox"
                      {...register("replaceImages")}
                      className="accent-slate-700 w-3.5 h-3.5"
                    />
                    Replace all saved images with newly selected images
                  </label>
                )}
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`text-sm px-4 py-3 rounded-xl border ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-500"}`}
                >
                  {message.text}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold text-sm py-3 rounded-xl hover:bg-slate-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {submitting ? (
                  <>
                    <FaSync className="animate-spin text-xs" /> Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
};

export default ProductManagement;
