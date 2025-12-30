import React, { useState, useRef } from "react";
import axios from "axios";
import BACKEND_URL from "../config";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function Clothes() {
  const [step, setStep] = useState(1);

  const steps = ["Basic Info", "Clothing Details", "Upload & Submit"];
  const formRef = useRef(null);

  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [pattern, setPattern] = useState("");
  const [brand, setBrand] = useState("");
  const [reward, setReward] = useState("");

  const navigate = useNavigate();

  const goToStep = (i) => {
    setStep(i);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      const token = localStorage.getItem("jwt_token");

      if (image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "lostfound_preset");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dsgytnn2w/image/upload",
          { method: "POST", body: data }
        );
        const cloudData = await res.json();
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
        material,
        pattern,
        brand,
        reward: reportType === "lost" ? reward : "",
      };

      await axios.post(`${BACKEND_URL}/clothes`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Report submitted successfully!");
      navigate("/home");
    } catch (err) {
      alert("Failed to submit. Login again.");
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-['Inter']">
      {/* BG */}
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/43/d1/35/43d135d38689527d117c56015d80a458.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <button
        onClick={() => navigate("/home")}
        className="fixed top-20 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/40 transition text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="relative w-full max-w-3xl px-6 py-10">
        <h1 className="text-5xl font-extrabold text-white text-center mb-2 animate__animated animate__fadeInDown">
          Clothes
        </h1>
        <p className="text-gray-300 text-center mb-6 animate__animated animate__fadeInUp">
          Lost clothes? Let the community help you find them.
        </p>

        {/* Stepper */}
        <div className="relative flex items-center justify-between pb-10 max-w-3xl mx-auto">
          <div className="absolute top-[28px] left-[6%] right-[6%] h-[4px] bg-white/30 rounded-full"></div>

          <div
            className="absolute top-[28px] left-[6%] h-[4px] bg-rose-400 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 86}%` }}
          ></div>

          {steps.map((label, idx) => {
            const i = idx + 1;
            const active = i === step;
            const done = i < step;

            return (
              <button
                key={label}
                onClick={() => goToStep(i)}
                className="relative z-10 flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 ${
                    active
                      ? "bg-rose-500 scale-110 text-white shadow-lg"
                      : done
                      ? "bg-rose-400 text-white shadow"
                      : "bg-white/30 text-white border border-white/20 backdrop-blur-md"
                  }`}
                >
                  {i}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    active ? "text-white" : "text-gray-300"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <div
          ref={formRef}
          className="w-full bg-white/10 p-10 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 text-white animate__animated animate__fadeInUp"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-black"
                >
                  <option value="">Report Type</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>

                <input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Clothing item e.g. Jacket"
                  className="w-full p-3 rounded-lg bg-white/20 text-black"
                />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full p-3 rounded-lg bg-white/20 text-black"
                ></textarea>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 flex items-center gap-2"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4 animate__animated animate__fadeIn">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="p-3 rounded-lg bg-white/20 text-black col-span-2"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>

                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="p-3 rounded-lg bg-white/20 text-black col-span-2"
                >
                  <option value="">Size</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>XXL</option>
                </select>

                <input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Color"
                  className="p-3 rounded-lg bg-white/20 text-black col-span-2"
                />

                <input
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Material"
                  className="p-3 rounded-lg bg-white/20 text-black col-span-2"
                />

                <input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Pattern"
                  className="p-3 rounded-lg bg-white/20 text-black col-span-2"
                />

                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand"
                  className="p-3 rounded-lg bg-white/20 text-black col-span-2"
                />

                {reportType === "lost" && (
                  <input
                    type="number"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    placeholder="Reward (Optional)"
                    className="p-3 rounded-lg bg-white/20 text-black col-span-2"
                  />
                )}

                <div className="col-span-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="px-5 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="px-5 py-2 bg-rose-500 rounded-lg hover:bg-rose-600 flex items-center gap-2"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-black"
                />

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full p-3 rounded-lg bg-white/20 text-black"
                />

                <label className="border-2 border-dashed p-4 w-full flex flex-col items-center rounded-lg cursor-pointer bg-white/20">
                  <span>Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>

                {image && <p className="text-sm">{image.name}</p>}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="px-5 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-lg flex items-center gap-2"
                  >
                    Submit <Check size={16} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
