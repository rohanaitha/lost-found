import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Categories from "./Categories";

function Home() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("response:",res);
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

      {/* Feed Section */}

      <div className="space-y-4 max-w-3xl mx-auto">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 space-y-3 hover:shadow-2xl transition duration-300"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <img
                src={post.profileId?.avatar || "Unknown User"}
                alt={post.profileId?.fullName || "Unknown User"}
                className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-black">
                  {post.profileId?.fullName || "Unknown User"}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Post Image */}
            {post.imageUrl && (
              <div className="w-full max-h-[400px] overflow-hidden rounded-2xl">
                <img
                  src={post.imageUrl}
                  alt={post.itemName}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            {/* Post Content */}
            <div className="space-y-2">
              <p className="text-black font-medium">{post.itemName}</p>
              <p className="text-gray-900 text-sm">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
