"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineMovie, MdTv } from "react-icons/md";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Trending() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);

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

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "cubic-bezier(0.25, 1, 0.5, 1)",
    pauseOnHover: true,
    arrows: true,
    centerMode: true,
    centerPadding: "50px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: false,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-b from-[#0E1628] to-[#380643] text-white min-h-screen">
      {/* Trending Movies Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-8">
          <MdOutlineMovie className="inline-block mr-2" size={30} /> Trending Movies
        </h2>
        {/* Row 1 */}
        <Slider {...sliderSettings}>
          {trendingMovies.slice(0, 5).map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="group px-2">
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-500 group-hover:rotate-2 group-hover:scale-110">
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[380px] object-cover rounded-xl transition-all duration-700 ease-in-out"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-center py-3 text-white font-semibold text-xl">
                  {movie.title}
                </div>
              </div>
            </Link>
          ))}
        </Slider>
        {/* Add margin to create a gap between the rows */}
        <div className="my-8"></div>

        {/* Row 2 */}
        <Slider {...sliderSettings}>
          {trendingMovies.slice(5, 10).map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="group px-2">
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-500 group-hover:rotate-2 group-hover:scale-110">
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[380px] object-cover rounded-xl transition-all duration-700 ease-in-out"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-center py-3 text-white font-semibold text-xl">
                  {movie.title}
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </section>

      {/* Trending TV Shows Section */}
      <section className=" pl-20 pr-20 container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-8">
          <MdTv className="inline-block mr-2" size={30} /> Trending TV Shows
        </h2>
        {/* Row 1 */}
        <Slider {...sliderSettings}>
          {trendingShows.slice(0, 5).map((show) => (
            <Link key={show.id} href={`/tv/${show.id}`} className="group px-2">
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-500 group-hover:-rotate-2 group-hover:scale-110">
                <img
                  src={`${IMAGE_BASE_URL}${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-[380px] object-cover rounded-xl transition-all duration-700 ease-in-out"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-center py-3 text-white font-semibold text-xl">
                  {show.name}
                </div>
              </div>
            </Link>
          ))}
        </Slider>
        {/* Add margin to create a gap between the rows */}
        <div className="my-8"></div>

        {/* Row 2 */}
        <Slider {...sliderSettings}>
          {trendingShows.slice(5, 10).map((show) => (
            <Link key={show.id} href={`/tv/${show.id}`} className="group px-2">
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-500 group-hover:-rotate-2 group-hover:scale-110">
                <img
                  src={`${IMAGE_BASE_URL}${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-[380px] object-cover rounded-xl transition-all duration-700 ease-in-out"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-center py-3 text-white font-semibold text-xl">
                  {show.name}
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </section>
    </div>
  );
}
