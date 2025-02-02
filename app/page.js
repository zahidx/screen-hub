"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { MdOutlineMovie, MdTv, MdCategory } from "react-icons/md";
import Link from "next/link";
import Footer from "./components/Footer";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShows, setFilteredShows] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const [movieResponse, tvResponse] = await Promise.all([
          axios.get(`${BASE_URL}/trending/movie/week`, { params: { api_key: API_KEY } }),
          axios.get(`${BASE_URL}/trending/tv/week`, { params: { api_key: API_KEY } }),
        ]);
        setTrendingMovies(movieResponse.data.results);
        setTrendingShows(tvResponse.data.results);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
    }

    async function fetchGenres() {
      try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
          params: { api_key: API_KEY },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    }

    fetchTrending();
    fetchGenres();
  }, []);

  const handleGenreClick = async (genreId) => {
    setActiveGenre(genreId);
    try {
      const response = await axios.get(`${BASE_URL}/discover/tv`, {
        params: { api_key: API_KEY, with_genres: genreId },
      });
      setFilteredShows(response.data.results);
    } catch (error) {
      console.error("Error fetching filtered shows:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative text-center">
          <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg">ScreenHub: Discover Entertainment</h1>
          <p className="text-gray-300 mt-3 text-lg">Find trending movies, TV shows, and more.</p>
          <div className="relative mt-6 w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              className="bg-gray-700 text-white px-4 py-3 rounded-full pl-12 w-full focus:outline-none shadow-lg transition-transform focus:scale-105"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-4 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Trending Movies */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center">
          <MdOutlineMovie className="mr-2 text-yellow-400" /> Trending Movies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trendingMovies.slice(0, 10).map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-70 w-full text-center py-2 text-white font-semibold">
                  {movie.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Genre */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center">
          <MdCategory className="mr-2 text-yellow-400" /> Browse by Genre
        </h2>
        <div className="flex flex-wrap gap-4">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`px-6 py-3 rounded-lg font-bold shadow-md transition ${
                activeGenre === genre.id
                  ? "bg-yellow-600 text-gray-900"
                  : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Display Filtered TV Shows */}
        {filteredShows.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">TV Shows in {genres.find(g => g.id === activeGenre)?.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredShows.map((show) => (
                <Link key={show.id} href={`/tv/${show.id}`} className="group">
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
                    <img
                      src={`${IMAGE_BASE_URL}${show.poster_path}`}
                      alt={show.name}
                      className="w-full h-[300px] object-cover"
                    />
                    <div className="absolute bottom-0 bg-black bg-opacity-70 w-full text-center py-2 text-white font-semibold">
                      {show.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}