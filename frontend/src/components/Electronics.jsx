import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Electronics() {
  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [size, setSize] = useState("");
  const [skins, setSkins] = useState("");
  const [charge, setCharge] = useState("");
  const [lock, setLock] = useState("");

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // ------------------- Submit -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        alert("Unauthorized! Please login first.");
        return;
      }

      let imageUrl = "";
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

      const payload = {
        reportType,
        itemName,
        description,
        date,
        location,
        brand,
        model,
        size,
        skins,
        charge,
        lock,
        image: imageUrl,
      };

      const res = await axios.post(
        "http://localhost:5000/electronics",
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
      resetForm();
      navigate("/home");
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("Failed to submit report. Make sure you are logged in.");
    }
  };

  // ------------------- Reset -------------------
  const resetForm = () => {
    setReportType("");
    setItemName("");
    setDescription("");
    setDate("");
    setLocation("");
    setImage(null);
    setBrand("");
    setModel("");
    setSize("");
    setSkins("");
    setCharge("");
    setLock("");
    setStep(1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('https://images.unsplash.com/photo-1504274066651-8d31a536b11a')] bg-cover bg-center">
      <div className="w-[400px] rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20">
        <h2 className="text-center text-3xl font-serif font-bold mb-6 text-gray-900">
          Electronics
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ------------------- Step 1 ------------------- */}
          {step === 1 && (
            <>
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

              <div>
                <label className="block text-sm mb-1 text-gray-800">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Pods, Phone, Laptop"
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-800">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details like color, brand, etc."
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </>
          )}

          {/* ------------------- Step 2 ------------------- */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-gray-800">
                  Date Lost/Found
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-800">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where it was lost/found"
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-800">
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-800">
                  Model
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Enter model name"
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </>
          )}

          {/* ------------------- Step 3 ------------------- */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-gray-800">Size</label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Enter item size"
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-800">
                  Skins
                </label>
                <input
                  type="text"
                  value={skins}
                  onChange={(e) => setSkins(e.target.value)}
                  placeholder="Enter skins if any"
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-800">
                  Charge
                </label>
                <input
                  type="text"
                  value={charge}
                  onChange={(e) => setCharge(e.target.value)}
                  placeholder="Charging details"
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-800">Lock</label>
                <input
                  type="text"
                  value={lock}
                  onChange={(e) => setLock(e.target.value)}
                  placeholder="Lock details"
                  className="w-full bg-transparent text-gray-900 p-2 
             border-b-2 border-gray-400 
             focus:border-[#1f3b73] focus:shadow-[0_2px_8px_#1f3b73] 
             outline-none placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </>
          )}

          {/* ------------------- Step 4 ------------------- */}
          {step === 4 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-gray-800">
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
                  <p className="mt-2 text-sm text-gray-700">
                    Selected: {image.name}
                  </p>
                )}
              </div>
            </>
          )}

          {/* ------------------- Navigation Buttons ------------------- */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
              >
                Previous
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                className="ml-auto px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700"
              >
                Submit Report
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
