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

      <div
        className="min-h-screen text-white  py-10  bg-center "
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/9a/51/32/9a5132622ae5f668acb465d9035978f7.jpg')",
        }}
      >
        {/* Profile Section */}
        <div className="w-full max-w-3xl mx-auto text-white py-10">
          {/* Centered Heading (username big at top) */}
          <h1 className="text-6xl font-bold font-serif text-center mb-8">
            {profile.fullName}
          </h1>

          {/* Avatar + Small Username (aligned left) */}
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile.avatar || "https://via.placeholder.com/150"}
                alt="avatar"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
              />

              {/* Hidden file input */}
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              {/* Clickable icon */}
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-0 right-0 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
              >
                ✎
              </label>
            </div>

            {/* Small Username beside avatar */}
            <div className="flex flex-col justify-center">
              <p className="text-gray-200 text-xl">{profile.fullName}...❣</p>
            </div>
          </div>

          {/* Bio directly under avatar (aligned left) */}
          <div className="mt-4 ml-1">
            <p className="text-gray-200 text-lg">{profile.bio}</p>
          </div>

          {/* Joined date under bio (aligned left) */}
          <div className="mt-2 ml-1">
            <p className="text-gray-200 text-m">
              Joined {new Date(profile.createdAt).toDateString()}
            </p>
          </div>
        </div>

        {/* POSTS */}
        <div className="space-y-10 flex flex-col justify-center items-center max-w-3xl mx-auto py-10">
          {myPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}

export default MyProfile;
