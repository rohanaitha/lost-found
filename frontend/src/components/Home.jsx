import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Categories from "./Categories";
import PostCard from "./PostCard";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("jwt_token");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/reports?page=${page}&limit=6`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // response shape: { data, total, page, totalPages, perPage }
        setPosts(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [token, page]);

  return (
    <div>
      <Navbar />
      <Categories />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post._id} className="w-full">
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 text-black text-sm font-medium transition ${
              page === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-white/10 hover:scale-105"
            }`}
          >
            <ChevronLeft size={18} />
            Prev
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              // show only nearby page numbers + ellipsis
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
                    <MoreHorizontal size={18} />
                  </span>
                );
              } else {
                return null;
              }
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 text-black text-sm font-medium transition ${
              page === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-white/10 hover:scale-105"
            }`}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <button
        onClick={() => navigate("/lf-mart")}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-900 via-black to-gray-800 
             border border-gray-700 
             text-gray-200 p-4 rounded-full shadow-lg transition transform hover:scale-110 hover:rotate-12 
             focus:outline-none animate-bounce"
      >
        <ShoppingCart size={28} />
      </button>
    </div>
  );
}

export default Home;
