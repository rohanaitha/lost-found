import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import BACKEND_URL from "../config";

export default function Docs() {
  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [otherDoc, setOtherDoc] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [otherAuthority, setOtherAuthority] = useState("");
  const [nameOnDoc, setNameOnDoc] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [reward, setReward] = useState("");

  const [step, setStep] = useState(1);
  const steps = ["Type", "Doc Details", "Identifiers", "Location & Upload"];

  const formRef = useRef(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  const goToStep = (i) => {
    setStep(i);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token)
        return toast.current.show({
          severity: "warn",
          summary: "Login Required",
        });

      let imageUrl = "";
      if (image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "lostfound_preset");

        const upload = await fetch(
          "https://api.cloudinary.com/v1_1/dsgytnn2w/image/upload",
          { method: "POST", body: data }
        );
        const result = await upload.json();
        imageUrl = result.secure_url;
      }

      const payload = {
        reportType,
        itemName,
        description,
        date,
        location,
        docType,
        otherDoc: docType === "other" ? otherDoc : "",
        docNumber,
        issuingAuthority,
        otherAuthority: issuingAuthority === "Others" ? otherAuthority : "",
        nameOnDoc,
        identifier,
        reward: reportType === "lost" ? reward : "",
        image: imageUrl,
      };

      await axios.post(`${BACKEND_URL}/docs`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Report Submitted!",
      });

      setTimeout(() => navigate("/home"), 1500);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to submit",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/8e/42/7a/8e427a32ce5749db2de8e454adc493ec.jpg')",
      }}
    >
      <Toast ref={toast} />

      <button
        onClick={() => navigate("/home")}
        className="fixed top-20 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/40 transition text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Header */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-serif font-extrabold text-white drop-shadow-xl animate__animated animate__fadeInDown">
          Document Report
        </h1>
        <p className="text-white/90 text-lg animate__animated animate__fadeInUp">
          Help us return someone's identity 📄
        </p>
      </div>

      {/* Stepper */}
      <div className="max-w-3xl mx-auto px-6 mt-6">
        <div className="relative flex items-center justify-between pb-10">
          <div className="absolute top-[28px] left-[6%] right-[6%] h-[4px] bg-white/30 rounded-full"></div>
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
                onClick={() => goToStep(i)}
                className="flex flex-col items-center"
              >
                <div
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg transition-all
                    ${active ? "bg-blue-600 text-white scale-110" : ""}
                    ${done && !active ? "bg-blue-500 text-white" : ""}
                    ${
                      !done && !active
                        ? "bg-white/30 text-white border backdrop-blur-xl"
                        : ""
                    }
                  `}
                >
                  {i}
                </div>
                <span className="mt-2 text-sm text-white font-medium">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form card */}
      <div className="flex justify-center py-10 px-6">
        <div
          ref={formRef}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/30 animate__animated animate__fadeInUp"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/70"
                >
                  <option value="">Select Report Type</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>

                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/70"
                >
                  <option value="">Select Document Type</option>
                  <option value="aadhar">Aadhar</option>
                  <option value="voter">Voter ID</option>
                  <option value="dl">Driving License</option>
                  <option value="passport">Passport</option>
                  <option value="pan">PAN Card</option>
                  <option value="student">Student ID</option>
                  <option value="work">Work ID</option>
                  <option value="other">Other</option>
                </select>

                {docType === "other" && (
                  <textarea
                    className="w-full p-3 bg-white/60 rounded-lg"
                    placeholder="Enter document type"
                    value={otherDoc}
                    onChange={(e) => setOtherDoc(e.target.value)}
                  />
                )}

                <Button
                  label="Next"
                  icon="pi pi-arrow-right"
                  onClick={() => setStep(2)}
                  className="float-right"
                />
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <input
                  className="w-full p-3 bg-white/60 rounded-lg"
                  placeholder="Name on Document"
                  value={nameOnDoc}
                  onChange={(e) => setNameOnDoc(e.target.value)}
                />

                <input
                  className="w-full p-3 bg-white/60 rounded-lg"
                  placeholder="Document number (partial)"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                />

                <select
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/70"
                >
                  <option value="">Issuing Authority</option>
                  <option value="UIDAI">UIDAI</option>
                  <option value="Income Tax Department">Income Tax Dept</option>
                  <option value="Election Commission of India">
                    Election Commission
                  </option>
                  <option value="RTO">RTO</option>
                  <option value="Passport Seva Kendra">Passport Office</option>
                  <option value="College/University">College</option>
                  <option value="Employer">Employer</option>
                  <option value="Others">Others</option>
                </select>

                {issuingAuthority === "Others" && (
                  <input
                    className="w-full p-3 bg-white/60 rounded-lg"
                    placeholder="Authority Name"
                    value={otherAuthority}
                    onChange={(e) => setOtherAuthority(e.target.value)}
                  />
                )}

                <div className="flex justify-between">
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

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <input
                  className="w-full p-3 bg-white/60 rounded-lg"
                  placeholder="Additional Identifier (DOB, Roll No)"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />

                {reportType === "lost" && (
                  <input
                    className="w-full p-3 bg-white/60 rounded-lg"
                    placeholder="Reward (optional)"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                  />
                )}

                <div className="flex justify-between">
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

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <input
                  className="w-full p-3 bg-white/60 rounded-lg"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />

                <textarea
                  className="w-full p-3 bg-white/60 rounded-lg"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <input
                  type="date"
                  className="w-full p-3 rounded-lg bg-white/60"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <input
                  className="w-full p-3 bg-white/60 rounded-lg"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full p-3 bg-white/60 rounded-lg"
                />

                <div className="flex justify-between">
                  <Button
                    label="Back"
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    onClick={() => setStep(3)}
                  />
                  <Button label="Submit" icon="pi pi-check" type="submit" />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
