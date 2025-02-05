import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiX,
  FiThumbsUp,
  FiFilm,
  FiCamera,
  FiVideo,
  FiSliders,
  FiPlayCircle,
  FiMusic,
  FiCameraOff,
  FiTv,
  FiHeadphones,
} from "react-icons/fi"; // Import additional icons

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const router = useRouter();

  const handleScrollToExplore = () => {
    const exploreSection = document.getElementById("explore");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchSearchResults = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoadingResults(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setLoadingResults(false);
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-[#0E1628] to-[#380643] text-white overflow-hidden">
      {/* Left Section */}
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center px-6 md:px-16 py-10 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-lg leading-tight">
          ScreenHub
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white mt-2">
          Discover Entertainment
        </h2>
        <p className="text-gray-300 mt-4 text-lg md:text-2xl">
          Find trending movies, TV shows, and more with ease.
        </p>

        {/* Search Bar */}
        <div className="relative mt-6 w-full max-w-lg">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            className="bg-white/10 text-white pl-12 pr-5 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-md backdrop-blur-md placeholder-gray-400 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchQuery && (
            <FiX
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              size={20}
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>

        {/* Explore Button */}
        <button
          onClick={handleScrollToExplore}
          className="mt-6 px-6 py-2 bg-yellow-500 text-gray-900 font-semibold text-base rounded-lg shadow-md hover:bg-yellow-400 transition-all transform hover:scale-105"
        >
          Explore Now
        </button>
      </div>

      {/* Right Section (Search Results) */}
      <div className="w-full md:w-1/3 h-auto md:h-screen overflow-y-auto bg-[#1F0F32] p-6 md:p-10 backdrop-blur-lg shadow-xl rounded-t-2xl md:rounded-none md:rounded-l-2xl">
        {searchQuery && (
          <>
            {/* Loading State */}
            {loadingResults && (
              <div className="flex justify-center items-center h-40">
                <div className="spinner"></div>
              </div>
            )}

            {/* Search Results */}
            {!loadingResults && (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-yellow-400">Search Results</h2>
                {searchResults.length > 0 ? (
                  <ul className="space-y-4">
                    {searchResults.map((result) => (
                      <li
                        key={result.id}
                        className="flex items-center space-x-4 p-3 bg-gray-800/70 rounded-lg cursor-pointer transition-all hover:bg-gray-700/80 hover:scale-105 shadow-lg"
                        onClick={() => router.push(`/details/${result.id}`)}
                      >
                        {result.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                            alt={result.title || result.name}
                            className="w-14 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-14 h-20 flex items-center justify-center bg-gray-700 text-gray-400 text-xs rounded-lg">
                            No Image
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-md text-white">{result.title || result.name}</h3>
                          <p className="text-gray-400 text-sm">{result.release_date || result.first_air_date}</p>
                          <p className="text-gray-500 text-xs">{result.media_type === "movie" ? "Movie" : "TV Show"}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  searchQuery.length >= 3 && <div className="text-gray-400 text-center">No results found</div>
                )}
              </>
            )}
          </>
        )}

        {/* Icons Displayed Before Search */}
        {!searchQuery && !loadingResults && (
          <div className="absolute inset-0 flex justify-center items-center space-x-4">
          <FiFilm size={40} className="animate-upDown icon1" />
          <FiCamera size={40} className="animate-upDown icon2" />
          <FiVideo size={40} className="animate-upDown icon3" />
          <FiThumbsUp size={40} className="animate-upDown icon4" />
          <FiCameraOff size={40} className="animate-upDown icon5" />
          <FiTv size={40} className="animate-upDown icon6" />
          <FiHeadphones size={40} className="animate-upDown icon7" />
        </div>
        


        
        )}
      </div>
    </div>
  );
}
