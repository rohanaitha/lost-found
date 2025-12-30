import React, { useState, useRef } from "react";
import axios from "axios";
import BACKEND_URL from "../config";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Jewellery() {
  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [reward, setReward] = useState("");

  const [step, setStep] = useState(1);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const steps = ["Basic Info", "Details", "More Info", "Upload & Submit"];

  const goToStep = (i) => {
    setStep(i);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) return alert("Please login first");

      let imageUrl = "";
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
        itemName,
        description,
        date,
        location,
        brand,
        color,
        material,
        uniqueId,
        reward: reportType === "lost" ? reward : null,
        image: imageUrl,
      };

      await axios.post(`${BACKEND_URL}/jewellery`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Report submitted successfully!");
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
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/63/d2/4d/63d24d40d82e8e0e7ff38b36f4044823.jpg')",
      }}
    >
      <button
        onClick={() => navigate("/home")}
        className="fixed top-20 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/40 transition text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* HEADER */}
      <div className="text-center py-10">
        <h1 className="text-5xl md:text-6xl font-extrabold font-serif text-white drop-shadow-xl tracking-wide animate__animated animate__fadeInDown">
          Jewellery
        </h1>
        <p className="mt-2 text-white/80 text-lg animate__animated animate__fadeInUp">
          Lost Something precious? Let's recover it.
        </p>
      </div>

      {/* STEPPER */}
      <div className="max-w-3xl mx-auto px-6 mt-6">
        <div className="relative flex items-center justify-between pb-10">
          <div className="absolute top-[28px] left-[6%] right-[6%] h-[4px] bg-white/30 rounded-full"></div>

          <div
            className="absolute top-[28px] left-[6%] h-[4px] bg-yellow-500 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 86}%` }}
          ></div>

          {steps.map((label, idx) => {
            const i = idx + 1;
            const active = i === step;
            const done = i < step;

            return (
              <button
                key={label}
                className="relative z-10 flex flex-col items-center cursor-pointer"
                onClick={() => goToStep(i)}
              >
                <div
                  className={`
                  w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg transition-all 
                  ${
                    active ? "bg-yellow-600 text-white scale-110 shadow-lg" : ""
                  }
                  ${done && !active ? "bg-yellow-500 text-white shadow" : ""}
                  ${
                    !done && !active
                      ? "bg-white/30 text-white backdrop-blur-xl border border-white/30"
                      : ""
                  }
                `}
                >
                  {i}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    active ? "text-white" : "text-white/70"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FORM */}
      <div className="flex justify-center py-12 px-6">
        <div
          ref={formRef}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/30 animate__animated animate__fadeInUp"
        >
          <h2 className="text-center text-3xl font-bold mb-8 text-white drop-shadow-lg">
            {step === 1 && "Basic Details"}
            {step === 2 && "Location & Description"}
            {step === 3 && "Jewellery Details"}
            {step === 4 && "Upload & Submit"}
          </h2>

          <form className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full rounded-lg p-3 bg-white/60 border border-gray-300"
                >
                  <option value="">Select Report Type</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>

                <input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Item Name (Ring, Chain, Bracelet)"
                  className="w-full rounded-lg p-3 bg-white/60 border border-gray-300"
                />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg p-3 bg-white/60 border border-gray-300"
                />

                <div className="flex justify-end">
                  <Button
                    label="Next"
                    icon="pi pi-arrow-right"
                    onClick={() => setStep(2)}
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4 animate__animated animate__fadeIn">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg p-3 bg-white/60 border col-span-2"
                />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="rounded-lg p-3 bg-white/60 border col-span-2"
                />

                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand (e.g. Tanishq)"
                  className="rounded-lg p-3 bg-white/60 border"
                />

                <input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Color (Gold, Silver)"
                  className="rounded-lg p-3 bg-white/60 border"
                />

                <div className="col-span-2 flex justify-between mt-2">
                  <Button
                    label="Back"
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    onClick={() => setStep(1)}
                  />
                  <Button
                    label="Next"
                    icon="pi pi-arrow-right"
                    onClick={() => setStep(3)}
                  />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-4 animate__animated animate__fadeIn">
                <input
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Material (Gold, Platinum)"
                  className="rounded-lg p-3 bg-white/60 border"
                />

                <input
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  placeholder="Engraving / Unique ID"
                  className="rounded-lg p-3 bg-white/60 border"
                />

                {reportType === "lost" && (
                  <input
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    placeholder="Reward (Optional)"
                    className="rounded-lg p-3 bg-white/60 border col-span-2"
                  />
                )}

                <div className="col-span-2 flex justify-between mt-2">
                  <Button
                    label="Back"
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    onClick={() => setStep(2)}
                  />
                  <Button
                    label="Next"
                    icon="pi pi-arrow-right"
                    onClick={() => setStep(4)}
                  />
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <label className="border-2 border-dashed p-4 w-full flex flex-col items-center rounded-lg cursor-pointer bg-white/60">
                  <span>Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
                {image && <p className="text-white">{image.name}</p>}

                <div className="flex justify-between">
                  <Button
                    label="Back"
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    onClick={() => setStep(3)}
                  />
                  <Button
                    label="Submit Report"
                    icon="pi pi-check"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
