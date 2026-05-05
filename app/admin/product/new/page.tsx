"use client";

import { createProduct } from "@/app/api/admin/productApi";
import { CATEGORIES } from "@/app/types/Constants";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaTimes, FaCloudUploadAlt } from "react-icons/fa";

interface ImagePreview {
  file: File;
  preview: string;
}

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}



const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-xs text-red-500 mt-1">{message}</p> : null;

const NewProduct = () => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [imageError, setImageError] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: { name: "", price: undefined, stock: 1, category: "" },
  });

  const changeImageHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = 6 - images.length;
    const allowed = files.slice(0, remaining);

    allowed.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, { file, preview: reader.result as string }]);
          setImageError("");
        }
      };
    });

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      setImageError("Please upload at least one image.");
      return;
    }

    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      formData.append("category", data.category);
      formData.append("description", data.description);
      images.forEach((img) => formData.append("images", img.file));

      const res = await createProduct(formData);
      if(!res?.success) throw new Error("API error");

      setMessage({ type: "success", text: `"${data.name}" created successfully!` });
      reset();
      setImages([]);
      setImageError("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-gray-50 border text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new product</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. iPhone 15 Pro"
              {...register("name", {
                required: "Product name is required.",
                minLength: { value: 3, message: "Name must be at least 3 characters." },
                maxLength: { value: 100, message: "Name must be under 100 characters." },
              })}
              className={inputClass(!!errors.name)}
            />
            <FieldError message={errors.name?.message} />
          </div>
          {/* description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Description
            </label>
            <textarea
              placeholder="Enter product description"
              {...register("description", {
                required: "Product description is required.",
                minLength: { value: 10, message: "Description must be at least 10 characters." },
                maxLength: { value: 200, message: "Description must be under 200 characters." },
              })}
              className={inputClass(!!errors.description)}
            />
            <FieldError message={errors.description?.message} />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register("price", {
                  required: "Price is required.",
                  min: { value: 1, message: "Price must be at least ₹1." },
                  max: { value: 10000000, message: "Price is too high." },
                  valueAsNumber: true,
                })}
                className={inputClass(!!errors.price)}
              />
              <FieldError message={errors.price?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock
              </label>
              <input
                type="number"
                placeholder="1"
                {...register("stock", {
                  required: "Stock is required.",
                  min: { value: 0, message: "Stock cannot be negative." },
                  max: { value: 100000, message: "Stock value is too high." },
                  valueAsNumber: true,
                })}
                className={inputClass(!!errors.stock)}
              />
              <FieldError message={errors.stock?.message} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              {...register("category", {
                required: "Please select a category.",
              })}
              className={`appearance-none cursor-pointer ${inputClass(!!errors.category)}`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </div>

          {/* Image Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Photos</label>
              <span className="text-xs text-gray-400">{images.length}/6 images</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Previews */}
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                >
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transition"
                    >
                      <FaTimes size={12} className="text-white" />
                    </button>
                  </div>
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">{index + 1}</span>
                  </div>
                </div>
              ))}

              {/* Upload box */}
              {images.length < 6 && (
                <label
                  className={`aspect-square rounded-xl border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    imageError
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50"
                  }`}
                >
                  <FaCloudUploadAlt
                    size={20}
                    className={imageError ? "text-red-400" : "text-gray-400"}
                  />
                  <span className={`text-xs ${imageError ? "text-red-400" : "text-gray-400"}`}>
                    Add Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={changeImageHandler}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
            <p className="text-xs text-gray-400 mt-2">
              Upload up to 6 images. Hover over an image to remove it.
            </p>
          </div>

          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "bg-red-50 border-red-200 text-red-500"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl px-4 py-3 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <FaPlus size={12} />
                Create Product
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default NewProduct;