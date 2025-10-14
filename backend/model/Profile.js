// models/Profile.js
import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "match"
  category: { type: String },
  postId: { type: mongoose.Schema.Types.ObjectId }, // the matched post
  // optional: include the new post that caused the match and the array of matched posts
  newPost: { type: mongoose.Schema.Types.Mixed },
  matchedPosts: { type: [mongoose.Schema.Types.Mixed], default: [] },
  matchedCount: { type: Number, default: 0 },
  message: { type: String }, // optional text
  read: { type: Boolean, default: false }, // unread by default
  createdAt: { type: Date, default: Date.now }, // timestamp
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // links Profile to User
    required: true,
  },
  fullName: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "default-avatar.png", // placeholder image
  },
  coins: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notifications: [notificationSchema],
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
