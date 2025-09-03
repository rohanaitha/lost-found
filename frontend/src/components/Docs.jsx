import { useState } from "react";
import axios from "axios";

export default function Docs() {
  // Default states
  const [reportType, setReportType] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  // Extra fields
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [nameOnDoc, setNameOnDoc] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [condition, setCondition] = useState("");
  const [reward, setReward] = useState("");

  // Stepper
  const [step, setStep] = useState(1);

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
        // extra fields
        docType,
        docNumber,
        issuingAuthority,
        nameOnDoc,
        identifier,
        condition,
        reward: reportType === "lost" ? reward : "",
      };

      const res = await axios.post("http://localhost:5000/docs", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Report Submitted:", res.data);
      alert("Report submitted successfully!");

      // Reset
      setReportType("");
      setItemName("");
      setDescription("");
      setDate("");
      setLocation("");
      setImage(null);
      setDocType("");
      setDocNumber("");
      setIssuingAuthority("");
      setNameOnDoc("");
      setIdentifier("");
      setCondition("");
      setReward("");
      setStep(1);
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("Failed to submit report. Make sure you are logged in.");
    }
  };

  // Stepper content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {/* Report Type */}
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

            {/* Document Type */}
            <div>
              <label className="block text-sm mb-1 text-white">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full rounded-lg bg-transparent text-white p-2 outline-none"
              >
                <option className="text-gray-900" value="">
                  Select...
                </option>
                <option className="text-gray-900" value="aadhar">
                  Aadhar
                </option>
                <option className="text-gray-900" value="voter">
                  Voter ID
                </option>
                <option className="text-gray-900" value="dl">
                  Driving License
                </option>
                <option className="text-gray-900" value="passport">
                  Passport
                </option>
                <option className="text-gray-900" value="pan">
                  PAN Card
                </option>
                <option className="text-gray-900" value="student">
                  Student ID
                </option>
                <option className="text-gray-900" value="work">
                  Work ID
                </option>
                <option className="text-gray-900" value="other">
                  Other
                </option>
              </select>
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Name on Document */}
            <div>
              <label className="block text-sm mb-1 text-white">
                Name on Document
              </label>
              <input
                type="text"
                value={nameOnDoc}
                onChange={(e) => setNameOnDoc(e.target.value)}
                placeholder="e.g. Rohan Raj"
                className="w-full outline-none rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white"
              />
            </div>

            {/* Document Number */}
            <div>
              <label className="block text-sm mb-1 text-white">
                Document Number (partial)
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. ****1234"
                className="w-full outline-none rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white"
              />
            </div>

            {/* Issuing Authority */}
            <div>
              <label className="block text-sm mb-1 text-white">
                Issuing Authority
              </label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                placeholder="e.g. Govt of India, University"
                className="w-full outline-none rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white"
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* Identifier */}
            <div>
              <label className="block text-sm mb-1 text-white">
                Additional Identifier
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. DOB, Roll No"
                className="w-full outline-none rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm mb-1 text-white">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-lg bg-transparent text-white p-2 outline-none"
              >
                <option className="text-gray-900" value="">
                  Select...
                </option>
                <option className="text-gray-900" value="intact">
                  Intact
                </option>
                <option className="text-gray-900" value="damaged">
                  Damaged
                </option>
                <option className="text-gray-900" value="torn">
                  Torn
                </option>
              </select>
            </div>

            {/* Reward only if Lost */}
            {reportType === "lost" && (
              <div>
                <label className="block text-sm mb-1 text-white">Reward</label>
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="Reward amount (optional)"
                  className="w-full outline-none rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white"
                />
              </div>
            )}
          </>
        );
      case 4:
        return (
          <>
            {/* Item Name */}
            <div>
              <label className="block text-sm mb-1 text-white">Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Aadhar, Voter ID"
                className="w-full outline-none rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-1 text-white">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter details like color, etc."
                className="w-full rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white outline-none resize-none h-20"
              />
            </div>

            {/* Date */}
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

            {/* Location */}
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

            {/* Upload */}
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('https://i.pinimg.com/1200x/0a/08/c5/0a08c5c3fb7ec15475c94815c23b7865.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="w-[420px] rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/20 text-gray-900 relative">
        <h2 className="text-center text-3xl font-serif font-bold mb-6 text-white">
          Docs Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {renderStep()}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.6)] hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.8)] transition"
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
