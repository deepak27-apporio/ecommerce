"use client";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-[#F6F8FB]">

      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-6">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs uppercase tracking-[0.18em] text-slate-400 font-medium"
        >
          Error
        </motion.p>

        {/* 404 Number */}
        <div className="flex items-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[120px] font-black leading-none tracking-tighter text-slate-800"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            4
          </motion.span>

          {/* Spinning zero */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, -18, 14, -6, 0] }}
            transition={{
              opacity: { delay: 0.25, duration: 0.4 },
              scale: { delay: 0.25, duration: 0.4 },
              rotate: {
                delay: 1,
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 2,
              },
            }}
            className="text-[120px] font-black leading-none tracking-tighter"
            style={{
              fontFamily: "'Syne', sans-serif",
              color: "transparent",
              WebkitTextStroke: "4px #1e293b",
            }}
          >
            0
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[120px] font-black leading-none tracking-tighter text-slate-800"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            4
          </motion.span>
        </div>

        {/* Orbiting icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative w-20 h-20"
        >
          {[0, 0.8, 1.6].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-slate-300"
              style={{ top: 0, left: "50%", x: "-50%" }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
              transformTemplate={({ rotate }) =>
                `translateX(-50%) rotate(${rotate}) translateY(-36px)`
              }
            />
          ))}
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3l18 18"
              />
            </svg>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h1
            className="text-3xl font-bold text-slate-800"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Page not found
          </h1>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            The route you entered doesn't exist. It may have been moved,
            deleted, or you may have typed the URL incorrectly.
          </p>
        </motion.div>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-slate-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to home
        </motion.button>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-xs text-slate-300"
        >
          Lost? Don't worry — let's get you back.
        </motion.p>
      </div>
    </main>
  );
}