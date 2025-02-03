"use client";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Genres from "./components/Genres";
import Trending from "./components/Trending";
import Carousel from "./components/Carousel";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <Hero />
      <Carousel />
      <Trending />
      <Genres />
      <Footer />
    </div>
  );
}
