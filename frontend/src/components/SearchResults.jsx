import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";

function SearchResults() {
  const [filterPost, setFilterPost] = useState([]);
  const { title } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `https://lost-found-rtox.onrender.com/searchResults/${title}`
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

      {/* 🔙 Crazy Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          className="group flex items-center gap-2 bg-black/40 border border-white/30 text-white px-4 py-2 rounded-full 
          backdrop-blur-md hover:bg-white/20 hover:scale-110 transition-all duration-300 
          shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-pulse"
          onClick={() => navigate("/home")} // you'll replace this
        >
          <ArrowLeftCircle
            size={28}
            className="group-hover:rotate-[-15deg] transition-transform duration-300 text-yellow-300"
          />
          <span className="text-lg font-semibold font-serif tracking-wide group-hover:text-yellow-300">
            Back
          </span>
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
