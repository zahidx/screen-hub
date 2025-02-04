"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link for navigation

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setMovies(data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch popular movies');
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Diagonal striped loading animation */}
        <div className="loading-container w-full h-full absolute top-0 left-0">
          <div className="diagonal-stripes"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Popular Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`} passHref>
            <div className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br from-blue-500 to-purple-600">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-96 object-cover transition-all duration-300 group-hover:opacity-80"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-white">{movie.title}</h2>
                <p className="text-gray-300">{movie.release_date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        /* Diagonal Stripes Loading Animation */
        .loading-container {
          position: relative;
        }

        .diagonal-stripes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 25%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 75%, rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0.2) 100%);
          background-size: 50px 50px;
          animation: diagonal-stripes 1.5s infinite linear;
        }

        @keyframes diagonal-stripes {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }

        /* Movie Card Hover Effects */
        .movie-card:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, rgba(0, 0, 255, 0.8), rgba(255, 0, 255, 0.8));
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PopularMovies;
