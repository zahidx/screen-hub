"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { MdOutlineMovie, MdTv, MdCategory } from "react-icons/md";
import Link from "next/link";
import Footer from "./components/Footer";
import Genres from "./components/Genres";
import Trending from "./components/Trending";

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

      
      <Trending />
      <Genres />
      <Footer />
      

    </div>
  );
}