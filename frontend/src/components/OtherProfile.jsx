import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import PostCard from "./PostCard";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket"; // optional, if needed for pre-connection
import BACKEND_URL from "../config";

function OtherProfile() {
  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const { fullName } = useParams();
  const navigate = useNavigate();

  console.log(fullName);
  const currentUserId = localStorage.getItem("currentUserId");
  // BACKEND_URL is imported from centralized config
  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/profile/${fullName}`);
        setProfile(response.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      }
    };
    fetchProfile();
  }, [fullName]);

  // Fetch profile posts
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!profile?._id) return;
      try {
        const response = await axios.get(`${BACKEND_URL}/posts/${profile._id}`);
        setMyPosts(response.data);
      } catch (err) {
        console.log("myposts:", err);
        alert("post load failed");
      }
    };
    fetchMyPosts();
  }, [profile]);

  // Handle Message button click
  const handleMessage = async () => {
    try {
      // Call backend to create/get chat room
      const res = await axios.post(`${BACKEND_URL}/chat/room`, {
        userId1: currentUserId,
        userId2: profile.userId, // make sure this is User _id, not Profile _id
      });

      const roomId = res.data.roomId;

      // Navigate to chat page
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error("Error creating chat:", err);
      alert("Failed to start chat");
    }
  };

  if (!profile)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen text-white py-10 bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/9a/51/32/9a5132622ae5f668acb465d9035978f7.jpg')",
        }}
      >
        {/* Profile Section */}
        <div className="w-full max-w-3xl mx-auto text-white py-10">
          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-center mb-8">
            {profile.fullName}
          </h1>

          {/* Avatar + Username */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <img
                src={profile.avatar || "https://via.placeholder.com/150"}
                alt="avatar"
                className="w-20 sm:w-28 h-20 sm:h-28 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-gray-200 text-xl">{profile.fullName}...❣</p>

              {/* 💬 MESSAGE BUTTON */}
              <button
                onClick={handleMessage}
                className="mt-2 px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
              >
                Message
              </button>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4 ml-1">
            <p className="text-gray-200 text-lg">{profile.bio}</p>
          </div>

          {/* Joined date */}
          <div className="mt-2 ml-1">
            <p className="text-gray-200 text-m">
              Joined {new Date(profile.createdAt).toDateString()}
            </p>
          </div>
        </div>

        {/* POSTS */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myPosts.map((post) => (
              <div key={post._id} className="w-full">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default OtherProfile;
