// models/Profile.js
import mongoose from "mongoose";

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
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
