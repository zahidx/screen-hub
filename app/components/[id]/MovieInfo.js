"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// Container variant to stagger children animations
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// Slide variant for text and details
const slideVariant = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const MovieInfo = ({ movie }) => {
  // Calculate the rating percentage for the progress bar (0-100%)
  const ratingPercentage = (movie.vote_average / 10) * 100;

  // Setup for premium 4D tilt effect
  const posterRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Map mouse offsets to rotation angles for a premium tilt effect
  const rotateX = useTransform(y, [-50, 50], [15, -15]);
  const rotateY = useTransform(x, [-50, 50], [-15, 15]);

  // Compute rotation based on mouse movement relative to poster center
  const handleMouseMove = (e) => {
    if (posterRef.current) {
      const rect = posterRef.current.getBoundingClientRect();
      const posX = e.clientX - rect.left;
      const posY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = posX - centerX;
      const deltaY = posY - centerY;
      x.set(deltaX);
      y.set(deltaY);
    }
  };

  // Reset rotations when mouse leaves the poster
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="relative max-w-screen-xl mx-auto p-12 md:p-2 overflow-hidden rounded-3xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E1628] to-[#380643] opacity-20 filter blur-3xl -rotate-3 scale-110"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center space-y-12 md:space-y-0">
        {/* Movie Poster with Premium Smooth 4D Tilt Effect */}
        <motion.div
          ref={posterRef}
          className="w-full md:w-1/3 rounded-xl overflow-hidden shadow-2xl"
          style={{ perspective: 1000 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              scale: 1.05,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 25 }}
          />
        </motion.div>

        {/* Movie Details */}
        <div className="w-full md:w-2/3 md:ml-12 space-y-6 text-white">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#E5970F] to-[#FF4C0E] drop-shadow-2xl"
            variants={slideVariant}
          >
            {movie.title}
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 flex items-center space-x-2"
            variants={slideVariant}
          >
            <span role="img" aria-label="calendar">
              🗓
            </span>
            <span>
              <strong>Release Date:</strong> {movie.release_date}
            </span>
          </motion.p>

          <motion.p
            className="text-lg text-yellow-400 flex items-center space-x-2"
            variants={slideVariant}
          >
            <span role="img" aria-label="star">
              ⭐
            </span>
            <span>
              <strong>Rating:</strong> {movie.vote_average.toFixed(1)} / 10
            </span>
          </motion.p>

          {/* Animated Rating Progress Bar */}
          <motion.div variants={slideVariant}>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-yellow-400 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${ratingPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          <motion.p
            className="text-lg text-gray-300 flex items-center space-x-2"
            variants={slideVariant}
          >
            <span role="img" aria-label="genres">
              🎭
            </span>
            <span>
              <strong>Genres:</strong> {movie.genres.map((g) => g.name).join(", ")}
            </span>
          </motion.p>

          <motion.p
            className="text-gray-200 text-lg leading-relaxed opacity-90"
            variants={slideVariant}
          >
            {movie.overview}
          </motion.p>

          {/* Action Buttons with Enhanced Hover Effects */}
          <div className="mt-8 flex justify-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden bg-[#FF4C0E] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-transform"
            >
              Watch Trailer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden bg-transparent border-2 border-[#E5970F] text-[#E5970F] px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-transform"
            >
              Add to Watchlist
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieInfo;
