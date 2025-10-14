import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Smartphone,
  Key,
  Gem,
  Shirt,
  FileUser,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function Home() {
  // --- Carousel images ---
  const images = [
    "https://i.pinimg.com/736x/5c/45/76/5c45765bde3b0fd4028cd4546c07d58b.jpg",
    "https://i.pinimg.com/1200x/bc/35/bc/bc35bc4336362f1a27cc8d47fd163f3c.jpg",
    "https://i.pinimg.com/736x/38/0e/3b/380e3bd8630b17a028242ae5f3e40ae4.jpg",
    "https://i.pinimg.com/736x/1e/6a/e1/1e6ae1243365de3ea2bf8dbf596dd5ae.jpg",
    "https://i.pinimg.com/1200x/1e/19/59/1e1959e9008a1c8790ecc472a9e164a9.jpg",
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  // --- Categories ---
  const categories = [
    { name: "accesories", icon: <ShoppingBag size={30} /> },
    { name: "electronics", icon: <Smartphone size={30} /> },
    { name: "jewellery", icon: <Gem size={30} /> },
    { name: "Clothes", icon: <Shirt size={30} /> },
    { name: "docs", icon: <FileUser size={30} /> },
  ];

  const [selected, setSelected] = useState(null);

  function handleCategory(name) {
    setSelected(name);
  }

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] overflow-hidden  shadow-xl">
      {/* --- Carousel Images --- */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`slide-${i}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* --- Dark overlay for readability --- */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* --- Categories on top of carousel --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((cat, i) => (
            <Link key={i} to={`/${cat.name.toLowerCase()}`}>
              <button
                onClick={() => handleCategory(cat.name)}
                className={`w-20 sm:w-28 h-20 sm:h-28 flex flex-col items-center justify-center rounded-full 
                          shadow-xl transition-transform duration-200 hover:scale-110 
                          ${
                            selected === cat.name
                              ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                              : "bg-white/90 text-gray-800"
                          }`}
              >
                {cat.icon}
                <span className="mt-2 text-sm font-medium text-center">
                  {cat.name}
                </span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
