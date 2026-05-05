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

type ImageReplacement = {
  attachmentId: number;
  file: File;
  preview: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const getImageUrl = (url: string, imageBase: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
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
  const [imageReplacements, setImageReplacements] = useState<ImageReplacement[]>([]);

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
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      imageReplacements.forEach((replacement) => URL.revokeObjectURL(replacement.preview));
    };
  }, [imageReplacements, newImagePreviews]);

  const existingImages = useMemo(() => product?.attachments ?? [], [product]);
  const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  const activeImage =
    existingImages.find((attachment) => attachment.id === activeImageId) ??
    existingImages[0] ??
    null;
  const activeReplacement = activeImage
    ? imageReplacements.find((replacement) => replacement.attachmentId === activeImage.id)
    : null;
  const activeImageUrl = activeReplacement
    ? activeReplacement.preview
    : activeImage
      ? getImageUrl(activeImage.url, imageBase)
      : "";
  const stockStatus = product?.stock ? "In Stock" : "Out of Stock";

  const handleAddImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setNewImages((current) => [...current, ...files]);
    setNewImagePreviews((current) => [
      ...current,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    if (addFileRef.current) addFileRef.current.value = "";
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setNewImagePreviews((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const handleReplaceExistingImage = (
    attachmentId: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImageReplacements((current) => {
      const oldReplacement = current.find(
        (replacement) => replacement.attachmentId === attachmentId,
      );
      if (oldReplacement) URL.revokeObjectURL(oldReplacement.preview);

      return [
        ...current.filter((replacement) => replacement.attachmentId !== attachmentId),
        { attachmentId, file, preview },
      ];
    });
    event.target.value = "";
  };

  const cancelReplacement = (attachmentId: number) => {
    setImageReplacements((current) => {
      const replacement = current.find((item) => item.attachmentId === attachmentId);
      if (replacement) URL.revokeObjectURL(replacement.preview);
      return current.filter((item) => item.attachmentId !== attachmentId);
    });
  };

  const clearPreviewState = () => {
    newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    imageReplacements.forEach((replacement) => URL.revokeObjectURL(replacement.preview));
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
      imageReplacements.forEach((replacement) => {
        formData.append(`replaceFile_${replacement.attachmentId}`, replacement.file);
      });

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
      if (!response.success) throw new Error(response.message ?? "Delete failed");
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

  if (loading) {
    return (
      <main className="admin-product-detail-page">
        <div className="admin-product-shell">
          <section className="admin-product-gallery-card skeleton-card" />
          <section className="admin-product-edit-card skeleton-card" />
        </div>
      </main>
    );
  }

  if (fetchError || !product) {
    return (
      <main className="admin-product-detail-page">
        <section className="product-error-state">
          <h1>Product not found</h1>
          <p>{fetchError || "This product could not be loaded."}</p>
          <Link href="/admin/product">Back to products</Link>
        </section>
      </main>
    );
  }

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

      <main className="admin-product-detail-page">
        <div className="admin-product-topbar">
          <Link href="/admin/product">
            <FaArrowLeft />
            Products
          </Link>
          <button
            disabled={deleting}
            onClick={() => setDeleteModalOpen(true)}
            type="button"
          >
            {deleting ? <FaSync className="spin-icon" /> : <FaTrash />}
            {deleting ? "Deleting" : "Delete"}
          </button>
        </div>

        <div className="admin-product-shell">
          <section className="admin-product-gallery-card">
            <div className="gallery-main-image">
              {activeImageUrl ? (
                <img src={activeImageUrl} alt={product.name} />
              ) : (
                <div className="gallery-empty">
                  <FaImage />
                  <span>No product image</span>
                </div>
              )}
              <span className={product.stock > 0 ? "detail-stock-pill" : "detail-stock-pill danger"}>
                {stockStatus}
              </span>
            </div>

            <div className="gallery-thumbnails">
              {existingImages.map((attachment, index) => {
                const replacement = imageReplacements.find(
                  (item) => item.attachmentId === attachment.id,
                );
                const src = replacement
                  ? replacement.preview
                  : getImageUrl(attachment.url, imageBase);

                return (
                  <button
                    className={activeImage?.id === attachment.id ? "active" : ""}
                    key={attachment.id}
                    onClick={() => setActiveImageId(attachment.id)}
                    type="button"
                  >
                    <img src={src} alt={`${product.name} image ${index + 1}`} />
                    {replacement && <span>New</span>}
                  </button>
                );
              })}
            </div>

            <div className="product-detail-copy">
              <p>Product ID: {product.id}</p>
              <h1>{product.name}</h1>
              <span>{product.category}</span>
              <strong>Rs {product.price.toLocaleString("en-IN")}</strong>
              <p>{product.description || "No description added for this product."}</p>
            </div>

            <div className="product-detail-stats">
              <article>
                <FaRupeeSign />
                <span>Price</span>
                <strong>{product.price.toLocaleString("en-IN")}</strong>
              </article>
              <article>
                <FaBoxes />
                <span>Stock</span>
                <strong>{product.stock}</strong>
              </article>
              <article>
                <FaImage />
                <span>Images</span>
                <strong>{existingImages.length}</strong>
              </article>
            </div>
          </section>

          <section className="admin-product-edit-card">
            <div className="edit-card-header">
              <div>
                <p>Admin controls</p>
                <h2>Product Details</h2>
              </div>
              {isDirty && <span>Unsaved changes</span>}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <div className="admin-form-grid two">
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                  />
                  {errors.name && <small>{errors.name.message}</small>}
                </label>

                <label>
                  <span>Category</span>
                  <select
                    {...register("category", {
                      required: "Please select a category.",
                    })}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <small>{errors.category.message}</small>}
                </label>
              </div>

              <label>
                <span>Description</span>
                <textarea rows={4} {...register("description")} />
              </label>

              <div className="admin-form-grid two">
                <label>
                  <span>Price</span>
                  <input
                    min={0}
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 0, message: "Price must be 0 or more" },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.price && <small>{errors.price.message}</small>}
                </label>

                <label>
                  <span>Stock</span>
                  <input
                    min={0}
                    type="number"
                    {...register("stock", {
                      required: "Stock is required",
                      min: { value: 0, message: "Stock must be 0 or more" },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.stock && <small>{errors.stock.message}</small>}
                </label>
              </div>

              <div className="image-manager">
                <div className="image-manager-header">
                  <div>
                    <p>Multiple images supported</p>
                    <h3>Product Images</h3>
                  </div>
                  <label>
                    <FaPlus />
                    Add images
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

                {existingImages.length > 0 && (
                  <div className="managed-image-grid">
                    {existingImages.map((attachment, index) => {
                      const replacement = imageReplacements.find(
                        (item) => item.attachmentId === attachment.id,
                      );
                      const src = replacement
                        ? replacement.preview
                        : getImageUrl(attachment.url, imageBase);

                      return (
                        <article key={attachment.id}>
                          <img src={src} alt={`${product.name} saved image ${index + 1}`} />
                          <div>
                            <span>{replacement ? "Replacement ready" : `Saved ${index + 1}`}</span>
                            <small>{formatBytes(attachment.size)}</small>
                          </div>
                          {replacement ? (
                            <button
                              onClick={() => cancelReplacement(attachment.id)}
                              type="button"
                            >
                              <FaTimes />
                            </button>
                          ) : (
                            <label>
                              <FaPen />
                              <input
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) =>
                                  handleReplaceExistingImage(attachment.id, event)
                                }
                                type="file"
                              />
                            </label>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}

                {newImagePreviews.length > 0 && (
                  <div className="new-image-strip">
                    {newImagePreviews.map((preview, index) => (
                      <article key={preview}>
                        <img src={preview} alt={`New upload ${index + 1}`} />
                        <button onClick={() => removeNewImage(index)} type="button">
                          <FaTimes />
                        </button>
                      </article>
                    ))}
                  </div>
                )}

                {!existingImages.length && !newImagePreviews.length && (
                  <div className="empty-image-manager">
                    <FaImage />
                    <p>No images yet. Add one or more product images.</p>
                  </div>
                )}

                {existingImages.length > 0 && newImages.length > 0 && (
                  <label className="replace-all-row">
                    <input type="checkbox" {...register("replaceImages")} />
                    <span>Replace all saved images with the newly selected images</span>
                  </label>
                )}
              </div>

              {message && (
                <p className={message.type === "success" ? "form-message" : "form-message error"}>
                  {message.text}
                </p>
              )}

              <button className="admin-product-submit" disabled={submitting} type="submit">
                {submitting ? (
                  <>
                    <FaSync className="spin-icon" />
                    Updating
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
