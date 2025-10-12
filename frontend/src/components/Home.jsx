import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Categories from "./Categories";
import PostCard from "./PostCard";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("jwt_token");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [token]);

  return (
    <div>
      <Navbar />
      <Categories />

      <div className="space-y-10 flex flex-col justify-center items-center max-w-3xl mx-auto">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <button
        onClick={() => navigate("/lf-mart")}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-900 via-black to-gray-800 
             border border-gray-700 
             text-gray-200 
                    p-4 rounded-full shadow-lg transition transform hover:scale-110 hover:rotate-12 
                   focus:outline-none animate-bounce"
      >
        <ShoppingCart size={28} />
      </button>
    </div>
  );
}

export default Home;
