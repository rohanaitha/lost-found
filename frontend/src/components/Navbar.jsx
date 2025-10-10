import React from "react";
import { Bell, LogOut, User, Search, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [Searchbar, setSearchbar] = useState("");

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("jwt_token");

    navigate("/login");
  }
  const handleSearch = (event) => {
    setSearchbar(event.target.value);
    console.log("search: ", Searchbar);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/searchResults/${Searchbar}`);
    }
  };
  return (
    <nav
      className="w-full bg-cover bg-center backdrop-blur-sm  shadow-lg px-6 py-3 flex items-center justify-between border-b border-white/20"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/e3/1c/d4/e31cd4303d836c1731394d6d75aca22c.jpg')",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 text-2xl font-extrabold text-white tracking-wide cursor-pointer 
      hover:scale-110 hover:text-yellow-300 transition duration-300 drop-shadow-md"
        onClick={() => navigate("/home")}
      >
        L&F
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-6 relative max-w-lg">
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-100 drop-shadow-md" />
        <input
          type="text"
          placeholder="Search lost or found items..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-black/30 border border-white/30 
        text-white placeholder-gray-300 focus:outline-none focus:ring-2 
        focus:ring-yellow-400 shadow-inner backdrop-blur-md"
          onChange={handleSearch}
          value={Searchbar}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-6 text-white drop-shadow-md">
        {/* Notifications */}
        <button className="relative hover:scale-110 transition">
          <Bell className="w-6 h-6" />
          <span
            className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold px-1.5 py-0.5 
          rounded-full shadow-md"
          >
            3
          </span>
        </button>

        {/* My Profile */}
        <button
          className="hover:text-yellow-300 hover:scale-105 transition flex items-center gap-1"
          onClick={() => navigate("/myprofile")}
        >
          <User className="w-6 h-6" />
          <span className="hidden sm:inline font-medium">My Profile</span>
        </button>

        {/* Home */}
        <button
          className="hover:text-green-200 hover:scale-105 transition flex items-center gap-1"
          onClick={() => navigate("/home")}
        >
          <Home className="w-6 h-6" />
          <span className="hidden sm:inline font-medium">Home</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="hover:text-red-400 hover:scale-105 transition flex items-center gap-1"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden sm:inline font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
