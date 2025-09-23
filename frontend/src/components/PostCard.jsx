import { useState } from "react";
import DynamicFields from "./DynamicFields";

export default function PostCard({ post }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-[28vw] h-[70vh] [perspective:1000px] cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-3 flex-shrink-0">
            <img
              src={post.profileId?.avatar || "https://via.placeholder.com/50"}
              alt={post.profileId?.fullName || "Unknown User"}
              className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover"
            />
            <div>
              <span className="font-semibold text-black">
                {post.profileId?.fullName || "Unknown User"}
              </span>
              <p className="text-gray-500 text-xs">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Image (Full, No Trim like Insta) */}
          {post.imageUrl && (
            <div className="flex-1 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.itemName}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Description with scroll */}
          <div className="p-3 h-24 overflow-y-auto flex-shrink-0">
            <h2 className="text-lg font-semibold text-black">
              {post.itemName}
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {post.description}
            </p>
          </div>
        </div>

        {/* Back Side */}
        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] 
  bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-gray-900/90 
  rounded-2xl shadow-xl p-6 text-white flex flex-col items-center justify-center 
  bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center bg-no-repeat"
        >
          <p className="font-bold text-3xl mb-4 text-center drop-shadow-lg">
            {post.itemName}
          </p>

          <div
            className="flex-1 overflow-y-auto w-full max-w-md 
    bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-2 shadow-lg"
          >
            <DynamicFields post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}
