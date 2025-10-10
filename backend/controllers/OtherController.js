import Profile from "../model/Profile.js";

export const getOtherProfile = async (req, res) => {
  try {

    const profile = await Profile
      .findOne({ fullName: req.params.fullName })
      .select("-password");
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile", error: err });
  }
};
