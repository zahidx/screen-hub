"use client";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Function to fetch search suggestions dynamically from an API (Placeholder)
  const fetchSuggestions = async (query) => {
    if (query.length < 3) return;
    setLoadingSuggestions(true);

    try {
      const response = await fetch(`/api/search-suggestions?q=${query}`);
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }

    setLoadingSuggestions(false);
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}>

      {/* Parallax effect */}
      <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50"></div>

      {/* Hero Content */}
      <div className="relative text-center z-10 px-6 md:px-12 py-16 animate__animated animate__fadeIn animate__delay-1s">
        <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg hover:scale-110 transition-all duration-300 ease-in-out transform">
          ScreenHub: Discover Entertainment
        </h1>
        <p className="text-gray-300 mt-3 text-lg md:text-2xl max-w-lg mx-auto hover:text-white transition-all duration-300 ease-in-out">
          Find trending movies, TV shows, and more with ease.
        </p>

        {/* Search Bar */}
        <div className="relative mt-8 w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            className={`bg-gray-700 text-white px-4 py-3 rounded-full pl-12 w-full focus:outline-none shadow-lg transition-all transform ${isInputFocused ? "scale-105 border-yellow-500" : "scale-100"} focus:border-yellow-500 focus:ring-2`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <FiSearch className="absolute left-4 top-4 text-gray-400" size={20} />
        </div>

        {/* Search Suggestions */}
        {searchQuery && (
          <div className="absolute top-[120px] w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-4 mt-4 z-20">
            {loadingSuggestions ? (
              <div className="text-gray-400">Loading...</div>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.map((suggestion) => (
                  <li key={suggestion} className="text-gray-300 py-2 hover:text-white cursor-pointer">{suggestion}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No suggestions found</div>
            )}
          </div>
        )}

        {/* Explore Button */}
        <div className="mt-8">
  <a
    href="#explore"
    className="inline-block px-8 py-3 bg-yellow-500 text-gray-900 font-bold text-lg rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 ease-in-out"
  >
    Explore Now
  </a>
</div>

      </div>

      {/* Optional: Add a background carousel */}
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed opacity-50">
        <div className="flex h-full items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black to-black opacity-40"></div>
        </div>
      </div>
    </div>
  );
}
