"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MovieDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        const [movieRes, castRes, trailerRes, recommendationsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`)
        ]);

        if (!movieRes.ok || !castRes.ok || !trailerRes.ok || !recommendationsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const movieData = await movieRes.json();
        const castData = await castRes.json();
        const trailerData = await trailerRes.json();
        const recommendationsData = await recommendationsRes.json();

        setMovie(movieData);
        setCast(castData.cast.slice(0, 8)); // Get top 8 cast members
        setTrailer(trailerData.results.find(video => video.type === "Trailer" && video.site === "YouTube"));
        setRecommendations(recommendationsData.results.slice(0, 6)); // Get top 6 recommendations

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center text-2xl font-bold text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-2xl font-bold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        ⬅ Back
      </button>

      {/* Movie Info */}
      <motion.div 
        className="flex flex-col md:flex-row items-center bg-gray-900 rounded-lg shadow-xl p-6"
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />
        <div className="mt-6 md:mt-0 md:ml-8 text-white">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-400 mt-2">🗓 Release Date: {movie.release_date}</p>
          <p className="text-yellow-400 mt-2">⭐ Rating: {movie.vote_average.toFixed(1)} / 10</p>
          <p className="text-gray-300 mt-2">🎭 Genres: {movie.genres.map(g => g.name).join(", ")}</p>
          <p className="text-gray-200 mt-4 leading-relaxed">{movie.overview}</p>
        </div>
      </motion.div>

      {/* Trailer */}
      {trailer && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-4">🎬 Trailer</h2>
          <div className="w-full md:w-2/3 h-64 md:h-96 mx-auto">
            <iframe
              className="w-full h-full rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Cast */}
      {cast.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-4">🎭 Top Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {cast.map(actor => (
              <motion.div 
                key={actor.id} 
                className="text-center bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition"
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto shadow-md"
                />
                <p className="text-white mt-2">{actor.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
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
      )}
    </div>
  );
};

export default MovieDetails;
