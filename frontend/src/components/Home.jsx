import React, { useEffect, useState } from "react";
import BACKEND_URL from "../config";
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
          `${BACKEND_URL}/reports?page=${page}&limit=6`,
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
      {/* ✅ Footer */}
      
      <footer className="mt-20 bg-gradient-to-b from-[#fafafa] to-[#e9edf3] border-t border-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Logo & Title */}
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-wide font-serif">
            Lost & Found Portal
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Helping people return lost belongings with ❤️ and trust.
          </p>

          {/* Highlight */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <span className="text-yellow-600 text-xl">✨</span>
            <span className="text-gray-700 font-medium text-sm">
              Verified Public Safety Initiative
            </span>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-gray-300 mx-auto my-6 rounded"></div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <button className="text-gray-600 hover:text-gray-900 transition">
              About Us
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition">
              Privacy Policy
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition">
              Terms
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition">
              Help & Support
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition">
              Contact
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mt-8">
            <a className="hover:scale-125 transition">
              <svg
                width="22"
                height="22"
                fill="currentColor"
                className="text-gray-700 hover:text-black"
              >
                <path d="M10.9 1C5.09 1 1 4.93 1 10.5c0 4.21 2.81 7.79 6.71 9.06.49.09.67-.21.67-.47v-1.64c-2.73.57-3.3-1.29-3.3-1.29-.45-1.14-1.13-1.45-1.13-1.45-.93-.61.07-.6.07-.6 1.03.07 1.57 1.03 1.57 1.03.91 1.5 2.38 1.06 2.96.8.09-.64.36-1.06.65-1.31-2.18-.24-4.47-1.06-4.47-4.74 0-1.05.39-1.91 1.03-2.58-.1-.24-.45-1.22.1-2.54 0 0 .84-.26 2.75.98A9.48 9.48 0 0111 6.1c.85.01 1.71.12 2.51.36 1.9-1.23 2.74-.98 2.74-.98.56 1.32.21 2.3.11 2.54.64.67 1.02 1.53 1.02 2.58 0 3.69-2.3 4.49-4.49 4.73.37.32.7.94.7 1.9v2.82c0 .27.18.57.69.47A9.55 9.55 0 0021 10.5C21 4.93 16.91 1 10.9 1z" />
              </svg>
            </a>

            <a className="hover:scale-125 transition">
              <svg
                width="22"
                height="22"
                fill="currentColor"
                className="text-gray-700 hover:text-black"
              >
                <path d="M12 2C6.477 2 2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H8.078V12h2.36V9.797c0-2.332 1.393-3.62 3.523-3.62.688 0 1.78.12 2.243.173v2.447h-1.262c-1.24 0-1.63.771-1.63 1.56V12h2.773l-.443 2.888h-2.33v6.99C18.343 21.13 22 16.991 22 12c0-5.522-4.477-10-10-10z" />
              </svg>
            </a>

            <a className="hover:scale-125 transition">
              <svg
                width="22"
                height="22"
                fill="currentColor"
                className="text-gray-700 hover:text-black"
              >
                <path d="M21.6 6.3c-.8.4-1.6.6-2.5.8a4.37 4.37 0 001.9-2.4 8.4 8.4 0 01-2.7 1A4.2 4.2 0 0015 4a4.28 4.28 0 00-4.3 4.3c0 .3 0 .6.1.8-3.6-.2-6.7-1.9-8.8-4.6-.4.7-.5 1.4-.5 2.2a4.28 4.28 0 001.9 3.6c-.7 0-1.4-.3-2-.6v.1a4.28 4.28 0 003.4 4.2c-.3.1-.7.1-1.2.1-.2 0-.5 0-.7-.1a4.35 4.35 0 004 3 8.47 8.47 0 01-5.2 1.8c-.3 0-.6 0-.9-.1A11.9 11.9 0 008.1 20c7.6 0 11.8-6.3 11.8-11.8v-.5c.8-.6 1.6-1.3 2.2-2.1z" />
              </svg>
            </a>
          </div>

          {/* Footer Bottom */}
          <p className="text-gray-500 text-xs mt-8">
            © 2025 LostFoundHub • Built for public good 💛
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
