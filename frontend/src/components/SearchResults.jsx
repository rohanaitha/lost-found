import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_URL from "../config";
import { ArrowLeft } from "lucide-react";
import PostCard from "./PostCard";

function SearchResults() {
  const [filterPost, setFilterPost] = useState([]);
  const { title } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/searchResults/${title}`
        );
        setFilterPost(response.data);
        console.log("filter: ", response.data);
      } catch (e) {
        console.log("err: ", e);
        alert("failed in fetching posts");
      }
    };
    fetchResult();
  }, [title]);

  const videoUrl =
    "https://res.cloudinary.com/dsgytnn2w/video/upload/v1760092013/From_KlickPin_CF_Video_2_Cute_Aesthetic_Loading_Screen___Loading_Bar___Kartu_lucu_Kartu_Desain_presentasi_sbtnne.mp4";

  const gridBoxes = new Array(9).fill(videoUrl);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* 🎥 GRID VIDEO BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full grid grid-cols-3 grid-rows-3 gap-1 opacity-40">
        {gridBoxes.map((url, index) => (
          <video
            key={index}
            src={url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ))}
      </div>

      {/* 🔹 Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 🔙 Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      {/* 🔹 Content */}
      <div className="relative z-50 w-full flex flex-col items-center justify-center py-12 px-6">
        <div className="w-full max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Search Results
            </h2>
            <p className="text-sm text-gray-300">
              {filterPost.length} result{filterPost.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filterPost.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filterPost.map((post) => (
                <div key={post._id} className="w-full">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24">
              <p className="text-white text-2xl sm:text-3xl font-semibold font-serif text-center">
                No matching posts found 😔
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
