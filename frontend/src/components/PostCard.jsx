import { useState } from "react";
import DynamicFields from "./DynamicFields";

export default function PostCard({ post }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-[420px] [perspective:1000px] cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={post.profileId?.avatar || "Unknown User"}
              alt={post.profileId?.fullName || "Unknown User"}
              className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-black">
                {post.profileId?.fullName || "Unknown User"}
              </span>
              <span className="text-gray-400 text-xs">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {post.imageUrl && (
            <div className="w-full max-h-[250px] overflow-hidden rounded-2xl">
              <img
                src={post.imageUrl}
                alt={post.itemName}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          <div className="space-y-2">
            <p className="text-black font-medium">{post.itemName}</p>
            <p className="text-gray-900 text-sm">{post.description}</p>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-white rounded-2xl shadow-lg p-4 space-y-3 text-black">
          <p className="font-semibold text-lg">{post.itemName}</p>
          <DynamicFields post={post} />
        </div>
      </div>
    </div>
  );
}
