import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

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

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      reportType,
      itemCategory,
      otherItem,
      description,
      date,
      location,
      image,
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-['Inter']">
      {/* Background Image (Luxury Gradient + Abstract) */}
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/d6/9b/71/d69b7159d263fa950be54c6f7b44e763.jpg')] bg-cover bg-center"></div>

      {/* Overlay for glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>

      {/* Form Container */}
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
                  rows="3"
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
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-lg bg-gray-500/80 text-white hover:bg-gray-600 flex items-center gap-2 transition"
              >
                <ArrowLeft size={16} /> Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 flex items-center gap-2 transition"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 transition"
              >
                Submit Report <Check size={16} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
