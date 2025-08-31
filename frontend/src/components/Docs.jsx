import { useState } from "react";
import axios from "axios";
export default function Docs(){
  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

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
        "http://localhost:5000/docs",
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
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("Failed to submit report. Make sure you are logged in.");
    }
  };

    return (
      <div className="flex items-center justify-center min-h-screen bg-[url('https://i.pinimg.com/1200x/0a/08/c5/0a08c5c3fb7ec15475c94815c23b7865.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="w-[380px] rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/20 text-gray-900">
          <h2 className="text-center text-3xl font-serif font-bold mb-6 text-white">
            Docs
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-white">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded-lg bg-transparent text-white p-2 outline-none"
              >
                <option className="text-gray-900" value="">
                  Select...
                </option>
                <option className="text-gray-900" value="lost">
                  Lost
                </option>
                <option className="text-gray-900" value="found">
                  Found
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. aadhar, voterID, license"
                className="w-full outline-none rounded-lg  border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white "
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter details like color, brand, etc."
                className="w-full rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white outline-none resize-none h-20"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">
                Date Lost/Found
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="w-full border-b border-white/40 focus:border-b-2 focus:border-yellow-500 rounded-lg bg-transparent text-white p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text"
                placeholder="Where it was lost/found"
                className="w-full rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white outline-none"
              />
            </div>

            {/* Fancy File Upload */}
            <div>
              <label className="block text-sm mb-1 text-white">
                Upload Item Image
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/60 hover:bg-white/80 transition">
                <span className="text-gray-700 text-sm">Click to upload</span>
                <span className="text-gray-500 text-xs">
                  PNG, JPG (max 5MB)
                </span>
                <input
                  type="file"
                  className="hidden "
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              {image && (
                <p className="mt-2 text-sm text-white">
                  Selected: {image.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 
             bg-amber-500 text-black font-semibold rounded-lg 
             shadow-[0_0_15px_rgba(251,191,36,0.6)] 
             hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.8)] 
             focus:outline-none focus:ring-2 focus:ring-amber-400 
             transition-all duration-300"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    );
}