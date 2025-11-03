import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" | "error"

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/register`, {
        Username: username,
        Password: password,
        Email: email,
        Pass: pass,
      });

      if (response.status === 200) {
        setAlertMsg("✅ Registration successful! Please login now.");
        setAlertType("success");

        setTimeout(() => {
          setAlertMsg("");
          navigate("/login");
        }, 2500);

        setUsername("");
        setEmail("");
        setPassword("");
        setPass("");
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Registration failed!";
      setAlertMsg("❌ " + msg);
      setAlertType("error");

      setTimeout(() => setAlertMsg(""), 3000);
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

      {/* Alert Box */}
      {alertMsg && (
        <div
          className={`absolute top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-center font-semibold w-64 transition-all duration-500 ${
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
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            hover:from-pink-500 hover:to-yellow-400 text-white font-semibold py-3 rounded-lg shadow-lg
            transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            🚀 Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-200 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
