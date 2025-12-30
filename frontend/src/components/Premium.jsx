import React from "react";
import { useNavigate } from "react-router-dom";

function Premium() {
  const navigate = useNavigate();

  const handleOpenVault = () => {
    // navigate to store route which will generate / load fake data
    navigate("/store");
  };

  const handleClearData = () => {
    localStorage.removeItem("storeData");
    alert("Premium Vault data cleared. Next open will regenerate store data.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold">Premium Vault</h1>
        <p className="text-gray-300">
          Open an embedded ecommerce storefront with generated sample data.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleOpenVault}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow-lg hover:scale-105 transition"
          >
            Open Premium Vault (Ecommerce Store)
          </button>

          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-full bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 transition"
          >
            Clear Generated Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Premium;
