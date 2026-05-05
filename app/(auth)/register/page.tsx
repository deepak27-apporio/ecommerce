"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userRegister } from "@/app/api/authApi";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password");
  const gender = watch("gender");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res: any = await userRegister(data);
      console.log("Register Response:", res);
      if (res.success) {
        toast.success(res.message || "Account created successfully!");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-500"][strength];

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-1">
            Create an account
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            Get started — it&apos;s free
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm text-zinc-300">Full name</label>
              <input
                className={`w-full bg-zinc-800 border ${errors.name ? "border-red-500" : "border-zinc-700"
                  } text-white rounded-lg px-3.5 py-2.5 text-sm`}
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-zinc-300">Email</label>
              <input
                className={`w-full bg-zinc-800 border ${errors.email ? "border-red-500" : "border-zinc-700"
                  } text-white rounded-lg px-3.5 py-2.5 text-sm`}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm text-zinc-300">Gender</label>
              <div className="flex gap-2 mt-1">
                {["male", "female", "other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setValue("gender", g)}
                    className={`flex-1 py-2 rounded-lg border ${gender === g
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-xs text-red-400">
                  {errors.gender.message}
                </p>
              )}
              <input
                type="hidden"
                {...register("gender", { required: "Select gender" })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-zinc-300">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full bg-zinc-800 border ${errors.password ? "border-red-500" : "border-zinc-700"
                  } text-white rounded-lg px-3.5 py-2.5 text-sm`}
                {...register("password", {
                  required: "Password required",
                  minLength: {
                    value: 8,
                    message: "Min 8 characters",
                  },
                })}
              />

              {/* Strength */}
              {password && (
                <p className="text-xs mt-1 text-zinc-400">
                  Strength:{" "}
                  <span className="font-medium">{strengthLabel}</span>
                </p>
              )}

              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-zinc-300">
                Confirm Password
              </label>
              <input
                type="password"
                className={`w-full bg-zinc-800 border ${errors.confirmPassword
                    ? "border-red-500"
                    : "border-zinc-700"
                  } text-white rounded-lg px-3.5 py-2.5 text-sm`}
                {...register("confirmPassword", {
                  required: "Confirm password required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}