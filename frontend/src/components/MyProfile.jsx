import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function MyProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        console.log("LocalStorage keys:", Object.keys(localStorage));
        console.log(token);
        console.log("Token in MyProfile:", localStorage.getItem("jwt_token"));
        const response = await axios.get("http://localhost:5000/myprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("resp:", response);
        setProfile(response.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  if (!profile)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10">
        {/* Profile Header */}
        <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <img
              src={profile.avatar || "https://via.placeholder.com/150"}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-pink-500 shadow-lg"
            />

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <button className="px-4 py-1 text-sm rounded-lg bg-pink-600 hover:bg-pink-700">
                  Follow
                </button>
              </div>
              <p className="text-gray-300">@{profile.username}</p>
              <p className="mt-2 text-gray-400 text-sm">
                Joined {new Date(profile.createdAt).toDateString()}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-gray-200">{profile.bio}</p>

          {/* Stats */}
          <div className="mt-4 flex gap-6 text-center">
            <div>
              <span className="font-bold text-lg">120</span>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>
            <div>
              <span className="font-bold text-lg">4.5K</span>
              <p className="text-gray-400 text-sm">Followers</p>
            </div>
            <div>
              <span className="font-bold text-lg">980</span>
              <p className="text-gray-400 text-sm">Following</p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="mt-10 grid grid-cols-3 gap-2 w-full max-w-3xl">
          {profile.posts?.length > 0 ? (
            profile.posts.map((post, index) => (
              <div key={index} className="relative group">
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-60 object-cover rounded-md"
                />
                {/* Hover overlay like Insta */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold text-lg transition">
                  ❤️ {post.likes} • 💬 {post.comments}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-400">No posts yet</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyProfile;
