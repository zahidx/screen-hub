"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router

const PopularMovies = () => {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setMovies(data.results);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch popular movies");
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Navigate to the details page for the selected movie
  const handleSelectMovie = (movie) => {
    router.push(`/movies/popular/${movie.id}`); // Corrected path
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
    <div className="container mx-auto p-8">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4 text-shadow-md">
          Popular Movies
        </h1>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full sm:w-1/2 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-110 hover:shadow-2xl hover:rotate-2 cursor-pointer"
            onClick={() => handleSelectMovie(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-96 object-cover transition-all duration-500 ease-in-out group-hover:opacity-80 group-hover:scale-105"
              loading="lazy"
            />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent opacity-90 group-hover:opacity-100 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white truncate">
                {movie.title}
              </h2>
              <p className="text-sm text-gray-400 mt-2">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularMovies;
