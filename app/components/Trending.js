"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { MdOutlineMovie, MdTv } from "react-icons/md";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Trending() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

    fetchTrending();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#0E1628] to-[#380643] text-white min-h-screen">

      {/* Trending Movies Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-8">
          <MdOutlineMovie className="inline-block mr-2" size={30} /> Trending Movies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {trendingMovies.slice(0, 10).map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-transform transform group-hover:scale-105 group-hover:shadow-2xl">
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[380px] object-cover rounded-xl transition-transform duration-300"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-center py-3 text-white font-semibold text-xl">
                  {movie.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending TV Shows Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-8">
          <MdTv className="inline-block mr-2" size={30} /> Trending TV Shows
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {trendingShows.slice(0, 10).map((show) => (
            <Link key={show.id} href={`/tv/${show.id}`} className="group">
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-transform transform group-hover:scale-105 group-hover:shadow-2xl">
                <img
                  src={`${IMAGE_BASE_URL}${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-[380px] object-cover rounded-xl transition-transform duration-300"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-center py-3 text-white font-semibold text-xl">
                  {show.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
    </div>
  );
}
