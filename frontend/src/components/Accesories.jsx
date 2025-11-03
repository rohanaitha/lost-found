import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";

export default function Accessories() {
  const [step, setStep] = useState(1);

  const steps = ["Basic Info", "Details", "Upload & Submit"];
  const formRef = useRef(null);

  // Form states
  const [reportType, setReportType] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [otherItem, setOtherItem] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

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

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/dsgytnn2w/image/upload",
          { method: "POST", body: data }
        );

        const cloudData = await cloudRes.json();
        imageUrl = cloudData.secure_url;
      }

      const payload = {
        reportType,
        itemCategory,
        otherItem: itemCategory === "other" ? otherItem : "",
        description,
        date,
        location,
        image: imageUrl,
      };

      await axios.post(`${BACKEND_URL}/accesories`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Report submitted successfully!");
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
      console.error(err);
      alert("Failed to submit report. Make sure you are logged in.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-['Inter']">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/d6/9b/71/d69b7159d263fa950be54c6f7b44e763.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>

      {/* Container */}
      <div className="relative w-full max-w-3xl px-6 py-10">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-white text-center mb-2 animate__animated animate__fadeInDown">
          Accessories
        </h1>
        <p className="text-gray-300 text-center mb-6 animate__animated animate__fadeInUp">
          Lost Something? Let's find it together.
        </p>

        {/* Stepper */}
        <div className="relative flex items-center justify-between pb-10 max-w-3xl mx-auto">
          <div className="absolute top-[28px] left-[6%] right-[6%] h-[4px] bg-white/30 rounded-full"></div>

          {/* fill line */}
          <div
            className="absolute top-[28px] left-[6%] h-[4px] bg-teal-400 rounded-full transition-all duration-500"
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
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg
                    transition-all duration-300
                    ${
                      active ? "bg-teal-500 scale-110 text-white shadow-lg" : ""
                    }
                    ${done && !active ? "bg-teal-400 text-white shadow" : ""}
                    ${
                      !done && !active
                        ? "bg-white/30 text-white border border-white/20 backdrop-blur-md"
                        : ""
                    }
                  `}
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

        {/* Form */}
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
                  className="w-full rounded-lg p-3 bg-white/20 border border-white/30"
                >
                  <option value="">Select Report Type</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>

                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full rounded-lg p-3 bg-white/20 border border-white/30"
                >
                  <option value="">Accessory Type</option>
                  <option value="wallet">Wallet</option>
                  <option value="watch">Watch</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="belt">Belt</option>
                  <option value="bag">Bag</option>
                  <option value="cap">Cap</option>
                  <option value="other">Other</option>
                </select>

                {itemCategory === "other" && (
                  <input
                    value={otherItem}
                    onChange={(e) => setOtherItem(e.target.value)}
                    placeholder="Name the item"
                    className="w-full rounded-lg p-3 bg-white/20 border border-white/30"
                  />
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => goToStep(2)}
                    type="button"
                    className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 flex items-center gap-2"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4 animate__animated animate__fadeIn">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="col-span-2 rounded-lg p-3 bg-white/20 border border-white/30"
                ></textarea>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg p-3 bg-white/20 border border-white/30 col-span-2"
                />

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="rounded-lg p-3 bg-white/20 border border-white/30 col-span-2"
                />

                <div className="col-span-2 flex justify-between">
                  <button
                    onClick={() => goToStep(1)}
                    type="button"
                    className="px-5 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button
                    onClick={() => goToStep(3)}
                    type="button"
                    className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 flex items-center gap-2"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
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
                    onClick={() => goToStep(2)}
                    type="button"
                    className="px-5 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 flex items-center gap-2"
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
