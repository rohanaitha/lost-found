import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LFMartIntro() {
  const navigate = useNavigate();

  // Auto redirect after animation
  useEffect(() => {
    const timer = setTimeout(() => navigate("/lf-mart/main"), 4500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden flex flex-col justify-center items-center text-center">
      {/* ✨ Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-10"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 🔥 Title Animation */}
      <motion.h1
        className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        initial={{ y: -300, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1.5, bounce: 0.3 }}
      >
        L&F MART
      </motion.h1>

      {/* 💥 Tagline Animation */}
      <motion.p
        className="mt-6 text-xl md:text-2xl text-gray-300 font-light italic tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.3, delay: 1.2, ease: "easeOut" }}
      >
        turning kindness into currency
      </motion.p>

      {/* ⚡ Glowing Pulse Effect */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
