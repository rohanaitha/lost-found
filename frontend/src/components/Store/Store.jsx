import React, { useEffect, useState } from "react";
import EcomNavbar from "../EcomNavbar";
import { fetchProducts } from "./api";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { useCart } from "../../context/CartContext";

const STORE_KEY = "storeData";

export default function Store() {
  const [data, setData] = useState({ categories: [], products: [] });
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (err) {
        console.error("failed parse store data", err);
      }
    }

    (async () => {
      try {
        const products = await fetchProducts(80);
        const payload = { categories: [], products };
        localStorage.setItem(STORE_KEY, JSON.stringify(payload));
        setData(payload);
      } catch (err) {
        console.warn(
          "Could not fetch store from backend, falling back to local data",
          err?.message || err
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // useCart provides addToCart/removeFromCart/clearCart

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Generating store...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">L&F Premium Store</h1>
            <div className="text-sm text-gray-300">
              Products: {data.products.length}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
