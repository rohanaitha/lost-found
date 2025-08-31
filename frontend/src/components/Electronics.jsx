import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function Electronics() {
  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let imageUrl = "";
    const token = localStorage.getItem("jwt_token"); // get auth token

    // 1️⃣ Upload image to Cloudinary if a file is selected
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "lostfound_preset"); // your unsigned preset

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dsgytnn2w/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await cloudRes.json();
      imageUrl = cloudData.secure_url; // store this URL in DB
    }

    // 2️⃣ Prepare the payload for backend
    const payload = {
      reportType,
      itemName,
      description,
      date,
      location,
      image: imageUrl,
    };

    // 3️⃣ Send report to backend with Authorization header
    const res = await axios.post(
      "http://localhost:5000/electronics",
      payload, // body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Report Submitted:", res.data);
    alert("Report submitted successfully!");

    // 4️⃣ Clear form fields
    setReportType("");
    setItemName("");
    setDescription("");
    setDate("");
    setLocation("");
    setImage(null);
    navigate("/home");
  } catch (err) {
    console.error("❌ Error submitting report:", err);
    alert("Failed to submit report. Make sure you are logged in.");
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('https://images.unsplash.com/photo-1504274066651-8d31a536b11a')] bg-cover bg-center">
      <div className="w-[380px] rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20 text-gray-900">
        <h2 className="text-center text-3xl font-serif font-bold mb-6 text-gray-900">
          Electronics
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Report Type */}
          <div>
            <label className="block text-sm mb-1 text-gray-800">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-lg bg-transparent text-gray-900 p-2 outline-none"
            >
              <option value="">Select...</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-800">
              Item Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. pods, Phone, laptop"
              className="w-full rounded-lg bg-transparent text-gray-900 p-2 placeholder-gray-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 text-gray-800">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter details like color, brand, etc."
              className="w-full rounded-lg bg-transparent text-gray-900 p-2 placeholder-gray-500 outline-none resize-none h-20"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm mb-1 text-gray-800">
              Date Lost/Found
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg bg-transparent text-gray-900 p-2 outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm mb-1 text-gray-800">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where it was lost/found"
              className="w-full rounded-lg bg-transparent text-gray-900 p-2 placeholder-gray-500 outline-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm mb-1 text-gray-800">
              Upload Item Image
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/60 hover:bg-white/80 transition">
              <span className="text-gray-700 text-sm">Click to upload</span>
              <span className="text-gray-500 text-xs">PNG, JPG (max 5MB)</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            {image && (
              <p className="mt-2 text-sm text-gray-700">
                Selected: {image.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gray-900 hover:bg-gray-700 transition font-semibold py-2 text-white"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
