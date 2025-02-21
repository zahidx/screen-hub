"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MovieInfo from "./MovieInfo";  // Importing MovieInfo component
import Trailer from "./Trailer";      // Importing Trailer component
import Cast from "./Cast";            // Importing Cast component
import Recommendations from "./Recommendations";  // Importing Recommendations component

const MovieDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optimized API fetching with error handling
  const fetchMovieDetails = async (id) => {
    setLoading(true);  // Reset loading state before fetching
    setError(null);    // Reset error state
    try {
      const [movieRes, castRes, trailerRes, recommendationsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`)
      ]);

      // Check for successful response
      if (!movieRes.ok || !castRes.ok || !trailerRes.ok || !recommendationsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const movieData = await movieRes.json();
      const castData = await castRes.json();
      const trailerData = await trailerRes.json();
      const recommendationsData = await recommendationsRes.json();

      // Extract and set the relevant data
      setMovie(movieData);
      setCast(castData.cast.slice(0, 8)); // Top 8 cast members
      setTrailer(trailerData.results.find(video => video.type === "Trailer" && video.site === "YouTube"));
      setRecommendations(recommendationsData.results.slice(0, 6)); // Top 6 recommendations

    } catch (err) {
      setError(err.message);  // Handle any errors during fetch
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);  // Fetch details on ID change
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold text-white">
        Loading... Please wait.
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-2xl font-bold text-red-500">
        Error: {error}. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button with improved accessibility */}
      <motion.button
        onClick={() => router.back()}
        className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        aria-label="Go back to the previous page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        ⬅ Back
      </motion.button>

      {/* Movie Info */}
      <MovieInfo movie={movie} />

      {/* Trailer */}
      {trailer && <Trailer trailer={trailer} />}

      {/* Cast */}
      {cast.length > 0 && <Cast cast={cast} />}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Recommendations recommendations={recommendations} router={router} />
      )}
    </div>
  );
};

export default MovieDetails;
