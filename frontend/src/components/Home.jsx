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
      <div className="max-w-3xl mx-auto mt-6 space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow-md p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {post.profileId?.fullName || "Unknown User"}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-800">{post.itemName}</p>
            <p className="text-gray-600">{post.description}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.itemName}
                className="rounded-lg w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
