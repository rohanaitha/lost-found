import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [otherDoc, setOtherDoc] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [nameOnDoc, setNameOnDoc] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [reward, setReward] = useState("");
  const [otherAuthority, setOtherAuthority] = useState("");

  const [step, setStep] = useState(1);
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
        // send enum values; put free-text into otherDoc/otherAuthority
        docType: docType,
        otherDoc: docType === "other" ? otherDoc : "",
        docNumber,
        issuingAuthority: issuingAuthority,
        otherAuthority: issuingAuthority === "Others" ? otherAuthority : "",
        nameOnDoc,
        identifier,
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

      // reset
      setReportType("");
      setItemName("");
      setDescription("");
      setDate("");
      setLocation("");
      setImage(null);
      setDocType("");
      setOtherDoc("");
      setDocNumber("");
      setIssuingAuthority("");
      setNameOnDoc("");
      setIdentifier("");

      setReward("");
      setStep(1);

      navigate("/home");
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("Failed to submit report. Make sure you are logged in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('https://i.pinimg.com/1200x/8e/42/7a/8e427a32ce5749db2de8e454adc493ec.jpg')] bg-cover bg-center">
      <div className="w-[400px] rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20 text-gray-900 relative">
        <h2 className="text-center text-3xl font-serif font-bold mb-6 text-white">
          Docs Report
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
                  className="w-full rounded-lg bg-transparent text-white p-2 outline-none"
                >
                  <option value="">Select...</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full rounded-lg bg-transparent text-white p-2 outline-none"
                >
                  <option value="">Select...</option>
                  <option value="aadhar">Aadhar</option>
                  <option value="voter">Voter ID</option>
                  <option value="dl">Driving License</option>
                  <option value="passport">Passport</option>
                  <option value="pan">PAN Card</option>
                  <option value="student">Student ID</option>
                  <option value="work">Work ID</option>
                  <option value="other">Other</option>
                </select>
                {/* 👇 Extra field when "Other" selected */}
                {docType === "other" && (
                  <textarea
                    value={otherDoc}
                    onChange={(e) => setOtherDoc(e.target.value)}
                    placeholder="Please specify your document type"
                    className="mt-2 w-full rounded-lg bg-transparent text-white p-2 placeholder-white outline-none resize-none h-16"
                  />
                )}
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-white">
                  Name on Document
                </label>
                <input
                  type="text"
                  value={nameOnDoc}
                  onChange={(e) => setNameOnDoc(e.target.value)}
                  placeholder="e.g. Rohan Raj"
                  className="w-full rounded-lg bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Document Number (partial)
                </label>
                <input
                  type="number"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. ****1234"
                  className="w-full rounded-lg bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

              {/* Issuing Authority */}
              <div>
                <label className="block text-sm mb-1 text-white">
                  Issuing Authority
                </label>
                <select
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full rounded-lg bg-transparent text-white p-2 outline-none border-b border-white/40 focus:border-b-2 focus:border-yellow-500"
                >
                  <option className="text-gray-900" value="">
                    Select...
                  </option>
                  <option className="text-gray-900" value="UIDAI">
                    UIDAI (Aadhaar)
                  </option>
                  <option
                    className="text-gray-900"
                    value="Income Tax Department"
                  >
                    Income Tax Department (PAN)
                  </option>
                  <option
                    className="text-gray-900"
                    value="Election Commission of India"
                  >
                    Election Commission of India (Voter ID)
                  </option>
                  <option className="text-gray-900" value="RTO">
                    RTO (Driving License)
                  </option>
                  <option
                    className="text-gray-900"
                    value="Passport Seva Kendra"
                  >
                    Passport Seva Kendra
                  </option>
                  <option className="text-gray-900" value="College/University">
                    College/University
                  </option>
                  <option className="text-gray-900" value="Employer">
                    Employer / Company
                  </option>
                  <option className="text-gray-900" value="Others">
                    Others
                  </option>
                </select>
              </div>

              {/* Show textarea if "Others" is selected */}
              {issuingAuthority === "Others" && (
                <div className="mt-2">
                  <textarea
                    value={otherAuthority}
                    onChange={(e) => setOtherAuthority(e.target.value)}
                    placeholder="Enter issuing authority name"
                    className="w-full rounded-lg border-b border-white/40 focus:border-b-2 focus:border-yellow-500 bg-transparent text-white p-2 placeholder-white outline-none resize-none h-16"
                  />
                </div>
              )}
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-white">
                  Additional Identifier
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. DOB, Roll No"
                  className="w-full rounded-lg bg-transparent text-white p-2 placeholder-white outline-none"
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
                    placeholder="Reward amount (optional)"
                    className="w-full rounded-lg bg-transparent text-white p-2 placeholder-white outline-none"
                  />
                </div>
              )}
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <div>
                <label className="block text-sm mb-1 text-white">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Aadhar, Voter ID"
                  className="w-full rounded-lg bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details like color, etc."
                  className="w-full rounded-lg bg-transparent text-white p-2 placeholder-white outline-none resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">
                  Date Lost/Found
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg bg-transparent text-white p-2 outline-none"
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
                  className="w-full rounded-lg bg-transparent text-white p-2 placeholder-white outline-none"
                />
              </div>

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
          )}

          {/* Navigation */}
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
                className="ml-auto px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                className="ml-auto px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold shadow-[0_0_15px_rgba(251,191,36,0.6)] hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.8)]"
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
