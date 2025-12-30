import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  function onCardClick() {
    navigate(`/store/product/${encodeURIComponent(product.id)}`);
  }

  return (
    <div
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onCardClick()}
      className="cursor-pointer bg-black/80 p-4 rounded-xl border border-white/10 shadow-sm flex flex-col hover:shadow-lg transition"
    >
      <div className="h-40 flex items-center justify-center mb-3">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.title}
          className="max-h-36 object-contain"
        />
      </div>

      <h3 className="text-white font-semibold text-lg">{product.title}</h3>
      <p className="text-gray-300 text-sm line-clamp-2">
        {product.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div>
          <div className="text-yellow-300 font-bold">
            ${product.salePrice ?? product.price}
          </div>
          {product.salePrice && (
            <div className="text-xs text-gray-400 line-through">
              ${product.price}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold hover:scale-105 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
