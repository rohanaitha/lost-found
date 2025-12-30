import React from "react";

import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart, total, updateQty } = useCart();
  return (
    <div className="bg-black/60 p-4 rounded-xl border border-white/10 text-white w-full">
      <h4 className="font-bold mb-2">Cart ({cart.length})</h4>
      <div className="space-y-2 max-h-64 overflow-auto">
        {cart.map((it, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-300">Qty: {it.qty ?? 1}</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={it.qty}
                onChange={(e) => updateQty(it.id, Number(e.target.value || 1))}
                className="w-16 p-1 rounded bg-black/70 text-white"
              />
              <div className="font-bold">
                ${((it.price ?? 0) * (it.qty ?? 1)).toFixed(2)}
              </div>
              <button
                onClick={() => removeFromCart(it.id)}
                className="text-sm text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="font-bold">Total: ${total.toFixed(2)}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearCart}
            className="px-3 py-1 rounded-full bg-red-600"
          >
            Clear
          </button>
          <button
            onClick={() => alert("Checkout simulation — not implemented")}
            className="px-3 py-1 rounded-full bg-green-500 text-black font-semibold"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
