import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Clothes() {
  // Default states
  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  // Extra fields
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [pattern, setPattern] = useState("");
  const [brand, setBrand] = useState("");
  const [reward, setReward] = useState("");

  // Step control
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      const token = localStorage.getItem("jwt_token");

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
        image: imageUrl,
        gender,
        size,
        color,
        pattern,
        brand,
        reward: reportType === "lost" ? reward : "",
      };
      const res = await axios.post("http://localhost:5000/clothes", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("report sumitted:", res.data);
      alert("report submitted!!");

      setReportType("");
      setItemName("");
      setDescription("");
      setDate("");
      setLocation("");
      setImage(null);
      setGender("");
      setSize("");
      setColor("");
      setPattern("");
      setBrand("");
      setReward("");
      setStep(1);
      navigate("/home");
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("Failed to submit report. Make sure you are logged in.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/43/d1/35/43d135d38689527d117c56015d80a458.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 "></div>

      {/* Form container */}
      <div className="relative w-full max-w-2xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8 text-white">
        <h2 className="text-3xl font-semibold mb-6 text-center tracking-wide drop-shadow-lg">
          Clothes
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block mb-1 text-sm">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm">Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900 focus:outline-none placeholder-gray-600"
                  placeholder="e.g. T-shirt, Jacket"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900 focus:outline-none placeholder-gray-600"
                  placeholder="Brief details"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-rose-500 rounded-lg hover:bg-rose-600 shadow-md"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block mb-1 text-sm">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900"
                >
                  <option value="">Select</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900 placeholder-gray-600"
                  placeholder="e.g. Black"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900 placeholder-gray-600"
                  placeholder="e.g. Cotton"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Pattern</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900 placeholder-gray-600"
                  placeholder="e.g. Striped"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900 placeholder-gray-600"
                  placeholder="e.g. Nike"
                />
              </div>

              {reportType === "lost" && (
                <div>
                  <label className="block mb-1 text-sm">Reward</label>
                  <input
                    type="number"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/30 text-gray-900 placeholder-gray-600"
                    placeholder="Enter reward amount"
                  />
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 shadow-md"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-rose-500 rounded-lg hover:bg-rose-600 shadow-md"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block mb-1 text-sm">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/30 text-gray-900 placeholder-gray-600"
                  placeholder="Where was it lost/found?"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Upload Item Image</label>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/40 rounded-lg cursor-pointer bg-white/40 hover:bg-white/60 transition">
                  <span className="text-gray-800 text-sm">Click to upload</span>
                  <span className="text-gray-600 text-xs">
                    PNG, JPG (max 5MB)
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
                {image && (
                  <p className="mt-2 text-sm text-gray-100">
                    Selected: {image.name}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 shadow-md"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 shadow-md"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
