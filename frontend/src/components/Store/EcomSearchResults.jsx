import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import EcomNavbar from "../EcomNavbar";
import ProductCard from "./ProductCard";

const ITEMS_PER_PAGE = 9;

export default function EcomSearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load products from localStorage (same as Store.jsx)
    const raw = localStorage.getItem("storeData");
    if (raw) {
      try {
        const { products: allProducts } = JSON.parse(raw);
        setProducts(allProducts);
      } catch (err) {
        console.error("Failed to parse store data", err);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!query) {
      setFilteredProducts([]);
      return;
    }

    // Filter products by title, description, or category (case-insensitive)
    const lowerQuery = query.toLowerCase();
    const results = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.category?.toLowerCase().includes(lowerQuery)
    );

    setFilteredProducts(results);
    setPage(1); // Reset to first page when search query changes
  }, [query, products]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <EcomNavbar />
        <div className="flex items-center justify-center h-96">
          <p>Loading store data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-gray-400">
              {filteredProducts.length === 0
                ? `No products found for "${query}"`
                : `Found ${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } for "${query}"`}
            </p>
          </div>

          {paginatedProducts.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Try searching for different keywords
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
