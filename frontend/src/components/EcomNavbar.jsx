import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import BACKEND_URL from "../config";

export default function EcomNavbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          const rawName = localStorage.getItem("currentUserName");
          if (rawName) setProfile({ fullName: rawName });
          return;
        }
        const res = await axios.get(`${BACKEND_URL}/myprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data || null);
      } catch (err) {
        // silent
      }
    }
    loadProfile();
  }, []);

  return (
    <header className="w-full bg-black text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <div
              className="text-2xl font-extrabold text-white cursor-pointer"
              onClick={() => navigate("/store")}
            >
              L&F Store
            </div>
            <div className="hidden sm:flex items-center bg-neutral-800 rounded-full px-3 py-1">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                placeholder="Search products"
                className="bg-transparent outline-none text-sm w-64 text-white placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim())
                    navigate(`/store/search/${e.target.value}`);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-md hover:bg-white/5"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            <div
              className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer"
              onClick={() => navigate("/myprofile")}
            >
              <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName || "avatar"}
                    className="w-9 h-9 object-cover"
                  />
                ) : (
                  <div className="text-gray-200">
                    {(profile?.fullName || "G")[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium text-white">
                  {profile?.fullName || "Guest"}
                </span>
                <span className="text-xs text-gray-400">Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
