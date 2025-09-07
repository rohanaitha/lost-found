import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Categories from "./Categories";
import PostCard from "./PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("jwt_token");

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

      <div className="space-y-4 max-w-3xl mx-auto">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
