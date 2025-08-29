export default function Docs(){
    return (
      <div className="flex items-center justify-center min-h-screen bg-[url('https://i.pinimg.com/1200x/fd/23/c2/fd23c2a1e4205d9b8349d15e7d4ecaef.jpg')] bg-cover bg-center">
        <div className="w-[380px] rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-l border border-white/20 text-gray-900">
          <h2 className="text-center text-3xl font-serif font-bold mb-6 text-white">
            Docs
          </h2>

          <form className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-white">
                Report Type
              </label>
              <select className="w-full rounded-lg bg-transparent text-white p-2 outline-none">
                <option value="">Select...</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">
                Item Name
              </label>
              <input
                type="text"
                placeholder="e.g. aadhar, voterID, license"
                className="w-full rounded-lg bg-transparent text-gray-900 p-2 placeholder-white "
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">
                Description
              </label>
              <textarea
                placeholder="Enter details like color, brand, etc."
                className="w-full rounded-lg bg-transparent text-gray-900 p-2 placeholder-white outline-none resize-none h-20"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-800">
                Date Lost/Found
              </label>
              <input
                type="date"
                className="w-full rounded-lg bg-transparent text-gray-900 p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-800">
                Location
              </label>
              <input
                type="text"
                placeholder="Where it was lost/found"
                className="w-full rounded-lg bg-transparent text-gray-900 p-2 placeholder-gray-500 outline-none"
              />
            </div>

            {/* Fancy File Upload */}
            <div>
              <label className="block text-sm mb-1 text-gray-800">
                Upload Item Image
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white/60 hover:bg-white/80 transition">
                <span className="text-gray-700 text-sm">Click to upload</span>
                <span className="text-gray-500 text-xs">
                  PNG, JPG (max 5MB)
                </span>
                <input type="file" className="hidden " />
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 hover:bg-gray-700 transition font-semibold py-2 text-white"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    );
}