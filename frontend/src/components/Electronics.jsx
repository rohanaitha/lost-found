import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

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
        model,
        size,
        skins,
        charge,
        lock,
        image: imageUrl,
      };

      await axios.post("http://localhost:5000/electronics", payload, {
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
      setModel("");
      setSize("");
      setSkins("");
      setCharge("");
      setLock("");
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
          "url('https://images.unsplash.com/photo-1504274066651-8d31a536b11a')",
      }}
    >
      {/* HEADER */}
      <div className="text-center py-10">
        <h1 className="text-5xl md:text-6xl font-extrabold font-serif text-black drop-shadow-xl tracking-wide animate__animated animate__fadeInDown">
          Electronics
        </h1>
        <p className="mt-2 text-black/80 text-lg animate__animated animate__fadeInUp">
          Lost Something? Let's find it together.
        </p>
      </div>

      {/* STEPPER */}
      {/* STEPPER */}
      <div className="max-w-3xl mx-auto px-6 mt-6">
        <div className="relative flex items-center justify-between pb-10">
          {/* Line Behind Circles (only between dots) */}
          <div className="absolute top-[28px] left-[6%] right-[6%] h-[4px] bg-white/30 rounded-full"></div>

          {/* Active Filling Line */}
          <div
            className="absolute top-[28px] left-[6%] h-[4px] bg-blue-500 rounded-full transition-all duration-500"
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
              w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300
              ${active ? "bg-blue-600 text-white scale-110 shadow-lg" : ""}
              ${done && !active ? "bg-blue-500 text-white shadow" : ""}
              ${
                !done && !active
                  ? "bg-white/30 text-black backdrop-blur-xl border border-white/30"
                  : ""
              }
            `}
                >
                  {i}
                </div>

                <span
                  className={`mt-2 text-sm font-medium ${
                    active ? "text-black" : "text-black/70"
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
          className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/30 transition-all duration-500 animate__animated animate__fadeInUp"
        >
          <h2 className="text-center text-3xl font-bold mb-8 text-black drop-shadow-lg ">
            {step === 1 && "Basic Details"}
            {step === 2 && "Location & Brand Info"}
            {step === 3 && "Device Specifications"}
            {step === 4 && "Upload & Submit"}
          </h2>

          <form className="space-y-6 transition-all duration-500">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 animate__animated animate__fadeIn slow-animation">
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
                  placeholder="Item Name"
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
              <div className="grid grid-cols-2 gap-4 animate__animated animate__fadeIn slow-animation">
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
                  className="rounded-lg p-3 bg-white/60 border"
                />
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand"
                  className="rounded-lg p-3 bg-white/60 border"
                />
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Model"
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
              <div className="grid grid-cols-2 gap-4 animate__animated animate__fadeIn slow-animation">
                <input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Size"
                  className="rounded-lg p-3 bg-white/60 border"
                />
                <input
                  value={skins}
                  onChange={(e) => setSkins(e.target.value)}
                  placeholder="Skins"
                  className="rounded-lg p-3 bg-white/60 border"
                />
                <input
                  value={charge}
                  onChange={(e) => setCharge(e.target.value)}
                  placeholder="Charge"
                  className="rounded-lg p-3 bg-white/60 border"
                />
                <input
                  value={lock}
                  onChange={(e) => setLock(e.target.value)}
                  placeholder="Lock Info"
                  className="rounded-lg p-3 bg-white/60 border"
                />

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
              <div className="space-y-4 animate__animated animate__fadeIn slow-animation">
                <label className="border-2 border-dashed p-4 w-full flex flex-col items-center rounded-lg cursor-pointer bg-white/60">
                  <span>Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
                {image && (
                  <p className="mt-2 text-sm text-white">{image.name}</p>
                )}

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
