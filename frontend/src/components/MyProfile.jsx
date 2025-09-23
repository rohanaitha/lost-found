import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import PostCard from "./PostCard";
function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

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
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axios.get("http://localhost:5000/myPosts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyPosts(response.data);
      } catch (err) {
        console.log("myposts:", err);
        alert("post load failed");
      }
    };
    fetchMyPosts();
  }, []);
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lostfound_preset"); // Cloudinary preset

    try {
      // Upload to Cloudinary
      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dsgytnn2w/image/upload",
        { method: "POST", body: formData }
      );
      const data = await cloudRes.json();

      // Update backend with new avatar URL
      const token = localStorage.getItem("jwt_token");
      const res = await axios.put(
        "http://localhost:5000/update-avatar",
        { avatar: data.secure_url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(res.data); // update profile state
    } catch (err) {
      console.error(err);
      alert("Failed to upload avatar");
    }
  };

  if (!profile)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10">
        {/* Profile Header */}
        <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10">
          <div className="flex items-center gap-6">
            {/* Avatar with upload */}
            <div className="relative">
              <img
                src={profile.avatar || "https://via.placeholder.com/150"}
                alt="avatar"
                className="w-28 h-28 rounded-full border-4 border-pink-500 shadow-lg"
              />

              {/* Hidden file input */}
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              {/* Clickable icon that triggers input */}
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-0 right-0 w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
              >
                ✎
              </label>
            </div>

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
        </div>
      </div>

      {/*POSTS*/}
      <div className="space-y-10 flex flex-col justify-center items-center max-w-3xl mx-auto">
        {myPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </>
  );
}

export default MyProfile;
