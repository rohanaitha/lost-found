import Model from "../model/Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Profile from "../model/Profile.js";

export const adduser = async (req, res) => {
  const { Username, Password, Email, Pass } = req.body;
  console.log(Username);
  try {
    // if re-typed pass dont match
    if (Password !== Pass) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }
    // IF USER ALREADY EXISTS
    const existingUser = await Model.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = new Model({
      Username,
      Password: hashedPassword,
      Email,
    });
    await newUser.save();

    //creating a profile to link
    const profile = new Profile({
      userId: newUser._id,
      fullName: Username, // default as username
      bio: "Hey there! I’m new here.",
    });
    await profile.save();

    //  generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.Email },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    console.log(token);

    res.status(200).json({
      msg: "User registered & logged in successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.Username,
        email: newUser.Email,
      },
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "failed to add user",
    });
  }
};

export const loginUser = async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const user = await Model.findOne({ Username });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.Email },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(200).json({
      msg: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.Username,
        email: user.Email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
};


export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    console.log(req.user)
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile", error: err });
  }
};