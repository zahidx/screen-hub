"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MovieInfo from "./MovieInfo";  // Importing MovieInfo component
import Trailer from "./Trailer";      // Importing Trailer component
import Cast from "./Cast";            // Importing Cast component
import Recommendations from "./Recommendations";  // Importing Recommendations component
import { AiOutlineArrowLeft } from "react-icons/ai";

const MovieDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState(null);  // To store content type (movie or tv)

  // Optimized API fetching with error handling
  const fetchContentDetails = async (id, type) => {
    setLoading(true);  // Reset loading state before fetching
    setError(null);    // Reset error state

    try {
      let contentRes, castRes, trailerRes, recommendationsRes;

      // Check if the content is a movie or tv
      if (type === "movie") {
        contentRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
        castRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
        trailerRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
        recommendationsRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
      } else if (type === "tv") {
        contentRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
        castRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
        trailerRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
        recommendationsRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
      }

      // Check for successful response
      if (!contentRes.ok || !castRes.ok || !trailerRes.ok || !recommendationsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const contentData = await contentRes.json();
      const castData = await castRes.json();
      const trailerData = await trailerRes.json();
      const recommendationsData = await recommendationsRes.json();

      // Set content type (movie or tv) and data
      setContentType(type);
      setContent(contentData);
      setCast(castData.cast.slice(0, 8)); // Top 8 cast members
      setTrailer(trailerData.results.find(video => video.type === "Trailer" && video.site === "YouTube"));
      setRecommendations(recommendationsData.results.slice(0, 6)); // Top 6 recommendations

    } catch (err) {
      setError(err.message);  // Handle any errors during fetch
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Fetch content type dynamically by checking both movie and tv endpoints
  const fetchContentType = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
      const tvRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);

      if (movieRes.ok) {
        fetchContentDetails(id, "movie");
      } else if (tvRes.ok) {
        fetchContentDetails(id, "tv");
      } else {
        setError("Content not found!");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch content type");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContentType(id);  // Fetch content type and details when ID changes
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
    <div className="container mx-auto px-4 py-2">
      {/* Back Button with improved accessibility */}
      <motion.button
        onClick={() => router.back()}
        className="mb-2 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        aria-label="Go back to the previous page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AiOutlineArrowLeft className="w-5 h-4" />
      </motion.button>

      {/* Dynamic Info based on type */}
      {contentType === "movie" && content && (
        <>
          <MovieInfo movie={content} />
          {trailer && <Trailer trailer={trailer} />}
        </>
      )}

      {contentType === "tv" && content && (
        <>
          <MovieInfo tv={content} />
          {trailer && <Trailer trailer={trailer} />}
        </>
      )}

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
