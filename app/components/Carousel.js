"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineMovie } from "react-icons/md";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieCarousel() {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  // Fetch Upcoming Movies for the 1st row
  useEffect(() => {
    async function fetchUpcomingMovies() {
      try {
        const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
          params: { api_key: API_KEY, language: "en-US", page: 1 },
        });
        setUpcomingMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      }
    }
    fetchUpcomingMovies();
  }, []);
  

  // Fetch Top Rated Movies for the 2nd row
  useEffect(() => {
    async function fetchTopRated() {
      try {
        const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
          params: { api_key: API_KEY, language: "en-US", page: 1 },
        });
        setTopRatedMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching top-rated movies:", error);
      }
      
    }
    fetchTopRated();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3, // Show 4 movies in a row
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    cssEase: "cubic-bezier(0.25, 1, 0.5, 1)",
    arrows: true,
    centerMode: true,
    centerPadding: "50px",
    prevArrow: (
      <button
        type="button"
        className="slick-prev custom-arrow"
        aria-label="Previous"
        style={{
          left: "10px",
          zIndex: "1",
          backgroundColor: "#380643",
          color: "white",
          borderRadius: "50%",
          padding: "10px",
          border: "none",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <span className="text-3xl">‹</span>
      </button>
    ),
    nextArrow: (
      <button
        type="button"
        className="slick-next custom-arrow"
        aria-label="Next"
        style={{
          right: "20px",
          zIndex: "1",
          backgroundColor: "#380643",
          color: "white",
          borderRadius: "50%",
          padding: "15px",
          border: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        <span className="text-4xl">›</span>
      </button>
    ),
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
    <div id="explore" className=" pl-20 pr-20 bg-gradient-to-b from-[#0E1628] to-[#380643] text-white min-h-screen">
      {/* First Row with Upcoming Movies */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-8">
          <MdOutlineMovie className="inline-block mr-2" size={30} /> Upcoming Movies
        </h2>
        <Slider {...sliderSettings}>
          {upcomingMovies.slice(0, 20).map((movie, index) => (
            <Link
              key={`${movie.id}-${movie.title}-${index}`}
              href={`/movie/${movie.id}`}
              className="relative group px-2 transform transition-all duration-500 ease-in-out"
            >
              <div className="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg">
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

      {/* Second Row with Top Rated Movies Grid Layout */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-8">
          <MdOutlineMovie className="inline-block mr-2" size={30} /> Top Rated Movies
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {topRatedMovies.slice(0, 12).map((movie, index) => (
            <Link
              key={`${movie.id}-${movie.title}-${index}`}
              href={`/movie/${movie.id}`}
              className="relative group transform transition-all duration-500 ease-in-out"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl">
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[250px] object-cover rounded-lg transition-all duration-500 ease-in-out"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-70 w-full text-center py-2 text-white font-semibold text-lg">
                  {movie.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
