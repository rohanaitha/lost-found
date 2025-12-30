import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import EcomNavbar from "./EcomNavbar";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart, total } = useCart();

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </button>

          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <div className="text-gray-400 py-12 text-center">
              Your cart is empty.{" "}
              <button
                onClick={() => navigate("/store")}
                className="text-yellow-400 underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((it) => (
                <div
                  key={it.id}
                  className="bg-black/80 p-4 rounded-lg border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-white">{it.title}</div>
                    <div className="text-sm text-gray-300">
                      ${it.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) =>
                        updateQty(it.id, Number(e.target.value || 1))
                      }
                      className="w-20 p-1 rounded bg-black/70 text-white border border-white/10"
                    />
                    <div className="font-bold text-yellow-300">
                      ${(it.price * it.qty).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeFromCart(it.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between bg-black/80 p-4 rounded-lg border border-white/10">
                <div className="font-bold text-white">
                  Total: ${total.toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearCart}
                    className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => alert("Checkout not implemented")}
                    className="px-3 py-1 rounded-full bg-green-500 text-black font-semibold hover:scale-105 transition"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
