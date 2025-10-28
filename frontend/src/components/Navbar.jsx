import React from "react";
import { Bell, LogOut, User, Search, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
function Navbar() {
  const [Searchbar, setSearchbar] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const res = await axios.get("https://lost-found-rtox.onrender.com/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
        console.log("resnotify: ", res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  // Escape key and body scroll lock when mobile search is open
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setShowMobileSearch(false);
    }

    if (showMobileSearch) {
      document.addEventListener("keydown", onKey);
      // lock scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
    return () => {};
  }, [showMobileSearch]);

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

      {/* Search Bar - hidden on xs, replaced by icon */}
      <div className="flex-1 mx-4 relative max-w-lg hidden sm:block">
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

      {/* Mobile search icon */}
      <div className="sm:hidden mr-2">
        <button
          onClick={() => setShowMobileSearch((s) => !s)}
          className="p-2 bg-black/30 rounded-full"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {showMobileSearch && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileSearch(false)}
          />

          <div ref={mobileSearchRef} className="relative w-full px-6 mt-16">
            <div className="mx-auto max-w-xl transition-transform duration-200 ease-out transform">
              <input
                type="text"
                placeholder="Search lost or found items..."
                className="w-full pl-4 pr-4 py-3 rounded-full bg-black/80 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onChange={handleSearch}
                value={Searchbar}
                onKeyDown={handleKeyDown}
                autoFocus
                aria-label="Search lost or found items"
              />
            </div>
          </div>
        </div>
      )}

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4 text-white drop-shadow-md flex-wrap">
        {/* Notifications */}
        <button
          className="relative hover:scale-110 transition"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="w-6 h-6" />
          {(Array.isArray(notifications) ? notifications : []).filter(
            (n) => !n.read
          ).length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {
                (Array.isArray(notifications) ? notifications : []).filter(
                  (n) => !n.read
                ).length
              }
            </span>
          )}
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
