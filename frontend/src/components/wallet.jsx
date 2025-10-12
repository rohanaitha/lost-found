import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function WalletPage() {
  const location = useLocation();
  const { money } = location.state || { money: 0 };
  console.log(money);
  useEffect(() => {
    const container = document.querySelector(".coin-container");

    for (let i = 0; i < 40; i++) {
      const coin = document.createElement("div");
      coin.className = "absolute w-10 h-10 bg-cover opacity-90 animate-fall";
      coin.style.left = `${Math.random() * 100}%`;
      coin.style.animationDuration = `${2 + Math.random() * 3}s`;
      coin.style.animationDelay = `${Math.random() * 2}s`;
      coin.style.backgroundImage =
        "url('https://cdn-icons-png.flaticon.com/512/138/138292.png')";
      container.appendChild(coin);
    }
  }, []);

  return (
    <div className="relative h-screen flex flex-col justify-center items-center bg-black overflow-hidden">
      <div className="coin-container absolute inset-0"></div>

      <h1 className="text-5xl font-extrabold text-yellow-400 z-10 mb-6 animate-pulse">
        💫 L&F Wallet 💫
      </h1>

      <div className="text-6xl font-bold text-white z-10">
        <span className="text-yellow-400">✨ {money} Coins ✨</span>
      </div>

      {/* Custom Tailwind keyframes */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}
