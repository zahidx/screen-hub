"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Recommendations = ({ recommendations }) => {
  const router = useRouter();

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-4">🎥 Recommended Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map(movie => (
          <motion.div 
            key={movie.id} 
            className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg transition hover:scale-105"
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push(`/movies/popular/${movie.id}`)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">{movie.title}</h3>
              <p className="text-gray-400">{movie.release_date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
