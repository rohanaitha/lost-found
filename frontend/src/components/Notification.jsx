import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";

function Notification() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const res = await axios.get("https://lost-found-rtox.onrender.com/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const notifications = res.data || [];
        console.log("📩 Notifications:", res);

        if (notifications.length === 0) {
          setLoading(false);
          return;
        }

        const postPromises = notifications.map(
          (n) =>
            axios
              .get(
                `https://lost-found-rtox.onrender.com/post/${n.category}/${n.postId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
              .then((res) => ({
                // ensure category is present for DynamicFields
                ...res.data,
                category: n.category || res.data.category,
                // include notification extras
                notificationMessage: n.message,
                notificationMatchedPosts: n.matchedPosts || [],
                notificationNewPost: n.newPost || null,
                createdAt: n.createdAt,
              }))
              .catch(() => null) // skip if post deleted
        );

        const results = await Promise.all(postPromises);
        // If a fetch returned null (post deleted), fall back to notification data
        const fetchedPosts = results.map((r, i) => {
          if (r) return r;
          const n = notifications[i];
          // use notificationNewPost or a minimal placeholder
          return {
            _id: n.postId || `notification-${i}`,
            itemName: n.newPost?.itemName || "Unknown item",
            description: n.newPost?.description || n.message || "",
            imageUrl: n.newPost?.imageUrl || null,
            category: n.category,
            // expose notification extras
            notificationMessage: n.message,
            notificationMatchedPosts: n.matchedPosts || [],
            notificationNewPost: n.newPost || null,
            createdAt: n.createdAt,
          };
        });

        setPosts(fetchedPosts.filter(Boolean));
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading)
    return <p className="text-gray-400 text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center">No notifications yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post._id} className="w-full">
              <div className="bg-yellow-100 text-black rounded-lg px-4 py-2 mb-3 text-center font-semibold shadow">
                🔔 {post.notificationMessage}
              </div>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
