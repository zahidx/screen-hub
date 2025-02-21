"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

const Trailer = ({ trailer }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1200); // Simulated delay for better UX
  }, []);

  return (
    <motion.div
      className="mt-12 px-4 md:px-0 text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-4xl font-bold text-white mb-6 flex items-center justify-center gap-2">
        🎬 <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">Movie Trailer</span>
      </h2>

      <motion.div
        className="relative w-full md:w-3/4 lg:w-2/3 h-64 md:h-96 mx-auto rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 0px 30px rgba(255, 50, 255, 0.8)",
          filter: "brightness(1.1)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-[#2e026d] to-[#6b21a8]"
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.button
              className="bg-white p-6 rounded-full shadow-lg text-purple-600 text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
              whileHover={{ rotate: 360 }}
              onClick={() => setIsClicked(true)}
            >
              <FaPlay />
            </motion.button>
            <span className="text-white text-lg mt-3 animate-pulse">Loading...</span>
          </motion.div>
        )}

        {isLoaded && (
          <motion.iframe
            className="w-full h-full rounded-xl border-[3px] border-purple-500 shadow-xl"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&showinfo=0&modestbranding=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Movie Trailer"
            aria-label="Movie Trailer"
            initial={{ scale: 1.2, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.iframe>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Trailer;
