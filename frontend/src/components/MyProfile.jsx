import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
      {/* Profile Card */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/20 text-white mb-10">
        <div className="flex flex-col items-center">
          <img
            src={profile.avatar || "https://via.placeholder.com/150"}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-white/30 shadow-lg mb-4"
          />
          <h2 className="text-3xl font-bold">{profile.fullName}</h2>
          <p className="text-gray-300 text-sm">
            @{profile.username || "username"}
          </p>
          <p className="mt-3 text-center text-gray-200">{profile.bio}</p>
          <p className="mt-2 text-sm text-gray-400">
            Joined: {new Date(profile.createdAt).toDateString()}
          </p>
        </div>
      </div>

      {/* Posts Section */}
      {/* <div className="w-full max-w-3xl">
        <h3 className="text-xl font-semibold text-white mb-6">My Posts</h3>
        <div className="grid gap-6">
          {profile.posts && profile.posts.length > 0 ? (
            profile.posts.map((post, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20 text-white"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={profile.avatar || "https://via.placeholder.com/50"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-white/20"
                  />
                  <div>
                    <p className="font-semibold">{profile.fullName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
                <p className="mb-3">{post.caption}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full max-h-[400px] object-cover rounded-xl border border-white/20"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No posts yet...</p>
          )}
        </div>
      </div> */}
    </div>
  );
}

export default MyProfile;
