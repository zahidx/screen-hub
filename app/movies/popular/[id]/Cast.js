"use client";

import { motion } from "framer-motion";

const Cast = ({ cast }) => {
  return (
    <div className="mt-16 px-8">
      <h2 className="text-5xl font-semibold text-white mb-12 tracking-wide text-center">🎭 Top Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {cast.map(actor => (
          <motion.div
            key={actor.id}
            className="text-center bg-gray-800 p-8 rounded-xl shadow-xl hover:scale-105 transition-all ease-in-out duration-500 hover:shadow-2xl transform-gpu relative"
            whileHover={{
              scale: 1.1,
              rotateY: 10,
              translateX: -15,
              translateY: -15,
              translateZ: 30,
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              // Advanced glowing effect on the card with a blue glow
              filter: 'brightness(1.5) drop-shadow(0 0 10px rgba(0, 0, 255, 0.7)) drop-shadow(0 0 20px rgba(0, 0, 255, 0.6)) drop-shadow(0 0 30px rgba(0, 0, 255, 0.8))',
            }}
            aria-label={`Cast member: ${actor.name}`}
          >
            <div className="relative">
              <motion.img
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                className="w-36 h-36 object-cover rounded-full mx-auto shadow-xl transition-all duration-300 ease-in-out hover:scale-110"
                loading="lazy"
                style={{ objectFit: 'cover', borderRadius: '50%' }}
                whileHover={{ scale: 1.15, rotate: 15 }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
            </div>
            <motion.p
              className="text-white mt-4 text-lg font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {actor.name}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Cast;
