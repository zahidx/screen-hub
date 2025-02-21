"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UpcomingMovies = () => {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setMovies(data.results);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch upcoming movies");
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Navigate to the details page for the selected movie
  const handleSelectMovie = (movie) => {
    router.push(`../components/${movie.id}`);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold text-white">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-700 h-10 w-1/2 mx-auto rounded"></div>
          <div className="bg-gray-700 h-4 w-2/3 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-2xl font-bold text-red-500">{error}</div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#0A0F1C] to-[#232D3A] min-h-screen py-12 px-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">Upcoming Movies</h1>
        <input
          type="text"
          placeholder="Search upcoming movies..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full sm:w-2/3 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-8">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="group relative bg-gradient-to-br from-[#1E1F2B] to-[#3A3F53] rounded-lg overflow-hidden shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => handleSelectMovie(movie)}
          >
            <div className="relative h-[500px] w-full">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="absolute top-0 left-0 right-0 bottom-0 object-cover w-full h-full opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-80 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-3xl font-bold">{movie.title}</h2>
                  <p className="text-sm mt-2">{movie.release_date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMovies;