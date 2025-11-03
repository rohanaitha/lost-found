import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState(""); // success | error

  const navigate = useNavigate();

  const showAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);

    setTimeout(() => setAlertMsg(""), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        Username: username,
        Password: password,
      });

      if (response.status === 200) {
        localStorage.setItem("jwt_token", response.data.token);
        showAlert("✅ Login Successful!", "success");
        localStorage.setItem("currentUserId", response.data.user.id);
        console.log("response check:", response);

        setTimeout(() => {
          navigate("/home");
        }, 1800);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Login failed!";
      showAlert("❌ " + errorMsg, "error");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url("https://cdn.pixabay.com/photo/2016/08/19/15/11/lost-1605501_1280.jpg")`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* ✅ Toast Alert */}
      {alertMsg && (
        <div
          className={`absolute top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-center font-semibold w-64 transition-all duration-500 animate__animated animate__fadeInDown
          ${
            alertType === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {alertMsg}
        </div>
      )}

      {/* Form Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-4xl font-extrabold font-serif text-center text-white mb-8 tracking-wide">
          Lost & Found
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-yellow-400 text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            🔑 Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-200 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
