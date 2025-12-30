import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchProductById } from "./api";
import { useCart } from "../../context/CartContext";
import EcomNavbar from "../EcomNavbar";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      const p = await fetchProductById(id);
      setProduct(p);
      setLoading(false);
    })();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading product...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-black/80 p-6 rounded-xl border border-white/10">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/800"}
                alt={product.title}
                className="w-full object-contain max-h-96"
              />
              <h1 className="text-2xl font-bold mt-4 text-white">
                {product.title}
              </h1>
              <p className="text-gray-300 mt-2">{product.description}</p>
            </div>

            <aside className="bg-black/80 p-6 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-yellow-400">
                ${product.salePrice ?? product.price}
              </div>
              {product.salePrice && (
                <div className="line-through text-gray-400">
                  ${product.price}
                </div>
              )}
              <div className="mt-4">
                <div className="text-sm text-gray-300">SKU: {product.sku}</div>
                <div className="text-sm text-gray-300">
                  Stock: {product.stock}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:scale-105 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => alert("Buy now flow not implemented")}
                  className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:scale-105 transition"
                >
                  Buy Now
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
