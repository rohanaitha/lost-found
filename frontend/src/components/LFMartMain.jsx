import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from "lucide-react";
function LFMartMain() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4 min-h-screen bg-black">
      <div className="absolute top-6 left-6 z-20">
        <button
          className="group flex items-center gap-2 
               bg-gradient-to-r from-gray-900 via-black to-gray-800
               border border-gray-700 
               text-gray-200 
               px-4 py-2 rounded-full 
               backdrop-blur-md 
               hover:scale-110 
               hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] 
               transition-all duration-300 
               shadow-[0_0_15px_rgba(255,255,255,0.4)] 
               animate-pulse"
          onClick={() => navigate("/home")}
        >
          <ArrowLeftCircle
            size={28}
            className="group-hover:rotate-[-15deg] transition-transform duration-300 text-gray-200"
          />
          <span className="text-lg font-semibold font-serif tracking-wide group-hover:text-gray-200">
            Back
          </span>
        </button>
      </div>

      {/* Kindness Zone */}
      <button
        onClick={() => navigate("/lf-mart/kindness")}
        className="bg-gradient-to-r from-gray-900 via-black to-gray-800
                   border border-gray-700 
                   text-gray-200 
                   p-6 md:px-12 rounded-3xl 
                   shadow-[0_0_25px_rgba(150,150,255,0.4)] 
                   hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] 
                   hover:scale-105 transition-all duration-300
                   focus:outline-none font-bold text-xl md:text-2xl"
      >
        🖤 Kindness Zone
      </button>

      {/* Premium Vault */}
      <button
        onClick={() => navigate("/lf-mart/premium")}
        className="bg-gradient-to-r from-gray-900 via-black to-gray-800
                   border border-gray-700 
                   text-gray-200 
                   p-6 md:px-12 rounded-3xl 
                   shadow-[0_0_25px_rgba(255,215,180,0.4)] 
                   hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] 
                   hover:scale-105 transition-all duration-300
                   focus:outline-none font-bold text-xl md:text-2xl"
      >
        💎 Premium Vault
      </button>
    </div>
  );
}

export default LFMartMain
