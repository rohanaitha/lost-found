import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Accessories() {
  const [step, setStep] = useState(1);

  // Form states
  const [reportType, setReportType] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [otherItem, setOtherItem] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

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
          { method: "POST", body: data }
        );

        const cloudData = await cloudRes.json();
        imageUrl = cloudData.secure_url;
        console.log("Cloudinary Response:", imageUrl);
      }

      const payload = {
        reportType,
        itemCategory: itemCategory === "other" ? otherItem : itemCategory,
        description,
        date,
        location,
        image: imageUrl,
      };

      const res = await axios.post(
        "http://localhost:5000/accesories",
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

      // Reset form
      setReportType("");
      setItemCategory("");
      setOtherItem("");
      setDescription("");
      setDate("");
      setLocation("");
      setImage(null);
      setStep(1);
      navigate("/home");
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("Failed to submit report. Make sure you are logged in.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-['Inter']">
      {/* Background & Overlay */}
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/d6/9b/71/d69b7159d263fa950be54c6f7b44e763.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>

      {/* Form */}
      <div className="relative w-[420px] rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20 text-white">
        <h2 className="text-center text-3xl font-bold mb-6 tracking-wide drop-shadow-lg">
          Accessories
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-gray-200">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full rounded-lg bg-white/20 text-white p-2 outline-none"
                >
                  <option className="bg-gray-800" value="">
                    Select...
                  </option>
                  <option className="bg-gray-800" value="lost">
                    Lost
                  </option>
                  <option className="bg-gray-800" value="found">
                    Found
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-200">
                  Choose Accessory Category
                </label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full rounded-lg bg-white/20 text-white p-2 outline-none"
                >
                  <option className="bg-gray-800" value="">
                    Select...
                  </option>
                  <option className="bg-gray-800" value="wallet">
                    Wallet
                  </option>
                  <option className="bg-gray-800" value="watch">
                    Watch
                  </option>
                  <option className="bg-gray-800" value="sunglasses">
                    Sunglasses
                  </option>
                  <option className="bg-gray-800" value="belt">
                    Belt
                  </option>
                  <option className="bg-gray-800" value="bag">
                    Bag
                  </option>
                  <option className="bg-gray-800" value="cap">
                    Cap
                  </option>
                  <option className="bg-gray-800" value="other">
                    Other
                  </option>
                </select>

                {itemCategory === "other" && (
                  <input
                    type="text"
                    value={otherItem}
                    onChange={(e) => setOtherItem(e.target.value)}
                    placeholder="Mention your item"
                    className="w-full rounded-lg bg-white/20 text-white p-2 placeholder-gray-400 outline-none mt-2"
                  />
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-gray-200">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the accessory..."
                  className="w-full rounded-lg bg-white/20 text-white p-2 placeholder-gray-400 outline-none resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-200">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg bg-white/20 text-white p-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-200">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="w-full rounded-lg bg-white/20 text-white p-2 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600"
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-gray-200">
                  Upload Image
                </label>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/20 hover:bg-white/30 transition">
                  <span className="text-gray-200 text-sm">Click to upload</span>
                  <span className="text-gray-300 text-xs">
                    PNG, JPG (max 5MB)
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
                {image && (
                  <p className="mt-2 text-sm text-gray-200">
                    Selected: {image.name}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600"
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600"
                >
                  Submit Report <Check size={16} />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
