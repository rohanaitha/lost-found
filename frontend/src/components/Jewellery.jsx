import { useState } from "react";
import axios from "axios";

export default function Jewellery() {
  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  // 🔹 New fields
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [reward, setReward] = useState("");

  // 🔹 Step state
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      const token = localStorage.getItem("jwt_token");

      // 1️⃣ Upload image
      if (image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "lostfound_preset");

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/dsgytnn2w/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const cloudData = await cloudRes.json();
        imageUrl = cloudData.secure_url;
      }

      // 2️⃣ Payload
      const payload = {
        reportType,
        itemName,
        description,
        date,
        location,
        image: imageUrl,
        brand,
        color,
        material,
        uniqueId,
        reward: reportType === "lost" ? reward : null,
      };

      // 3️⃣ API Call
      const res = await axios.post(
        "https://lost-found-rtox.onrender.com/jewellery",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Report Submitted:", res.data);
      alert("Report submitted successfully!");

      // 4️⃣ Reset
      setReportType("");
      setItemName("");
      setDescription("");
      setDate("");
      setLocation("");
      setImage(null);
      setBrand("");
      setColor("");
      setMaterial("");
      setUniqueId("");
      setReward("");
      setStep(1);
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("Failed to submit report. Make sure you are logged in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('https://i.pinimg.com/736x/63/d2/4d/63d24d40d82e8e0e7ff38b36f4044823.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/0"></div>
      <div className="w-[380px] rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20 text-gray-900">
        <h2 className="text-center text-3xl font-serif font-bold mb-6 text-white">
          Jewellery
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-white">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full rounded-lg bg-transparent text-white border-1 border-white/40 p-2 focus:outline-none focus:ring-1 focus:ring-white"
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
                <label className="block text-sm mb-1 text-white">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. chain, bracelet, rings"
                  className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 placeholder-white outline-none"
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
                  className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 placeholder-white outline-none resize-none h-20"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-lg bg-gray-700 hover:bg-white transition font-semibold py-2 text-emerald-400"
              >
                Next →
              </button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-white">
                  Date Lost/Found
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where it was lost/found"
                  className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

              {/* New fields */}
              <div>
                <label className="block text-sm mb-1 text-white">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Tanishq"
                  className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Gold, Silver"
                  className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Platinum, Gold"
                  className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Unique ID / Engraving
                </label>
                <input
                  type="text"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  placeholder="e.g. Serial number, engraving"
                  className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

              {reportType === "lost" && (
                <div>
                  <label className="block text-sm mb-1 text-white">
                    Reward
                  </label>
                  <input
                    type="number"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    placeholder="Optional reward amount"
                    className="w-full rounded-lg border-b border-white/40 focus:border-emerald-400 bg-transparent text-white p-2 placeholder-white outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 rounded-lg bg-gray-500 hover:bg-gray-600 transition font-semibold py-2 text-white"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/2 rounded-lg bg-gray-700 hover:bg-white transition font-semibold py-2 text-emerald-400"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              {/* File Upload */}
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
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
                {image && (
                  <p className="mt-2 text-sm text-white">
                    Selected: {image.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/2 rounded-lg bg-gray-500 hover:bg-gray-600 transition font-semibold py-2 text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-lg bg-gray-700 hover:bg-white transition font-semibold py-2 text-emerald-400"
                >
                  Submit Report
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
