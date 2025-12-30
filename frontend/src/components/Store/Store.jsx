import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EcomNavbar from "../EcomNavbar";
import { fetchProducts } from "./api";
import ProductCard from "./ProductCard";
import { useCart } from "../../context/CartContext";

const STORE_KEY = "storeData";
const ITEMS_PER_PAGE = 9;

export default function Store() {
  const navigate = useNavigate();
  const [data, setData] = useState({ categories: [], products: [] });
  const { cart } = useCart();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

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

  // Calculate pagination
  const totalPages = Math.ceil(data.products.length / ITEMS_PER_PAGE);
  const paginatedProducts = data.products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 text-sm font-medium transition ${
                  page === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white/10 hover:scale-105"
                }`}
              >
                <ChevronLeft size={18} />
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => {
                    if (
                      p === 1 ||
                      p === totalPages ||
                      (p >= page - 1 && p <= page + 1)
                    ) {
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition ${
                            p === page
                              ? "bg-yellow-400 text-black shadow-lg scale-105"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    } else if (p === page - 2 || p === page + 2) {
                      return (
                        <span key={p} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 text-sm font-medium transition ${
                  page === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white/10 hover:scale-105"
                }`}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
