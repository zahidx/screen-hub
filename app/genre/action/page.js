"use client";

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react'; // For the modal

const ActionMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchActionMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setMovies(data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch action movies');
        setLoading(false);
      }
    };

    fetchActionMovies();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold text-white">
        {/* Smooth fade-in skeleton loader */}
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-700 h-10 w-1/2 mx-auto rounded-full"></div>
          <div className="bg-gray-700 h-4 w-2/3 mx-auto rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-8">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="group relative bg-gray-700 rounded-lg shadow-lg animate-pulse">
                <div className="h-[400px] w-full bg-gray-500 rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="bg-gray-600 h-6 w-32 mb-2"></div>
                  <div className="bg-gray-600 h-4 w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-2xl font-bold text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-[#1A1A2E] to-[#3A3F53] min-h-screen py-12 px-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">Action Movies</h1>
        <input
          type="text"
          placeholder="Search action movies..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full sm:w-2/3 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
        />
      </div>

      {/* Two rows of 6 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
        {filteredMovies.slice(0, 12).map((movie) => (
          <div
            key={movie.id}
            className="group relative bg-gradient-to-br from-[#232746] to-[#414C63] rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => handleSelectMovie(movie)}
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="absolute top-0 left-0 right-0 bottom-0 object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:rotate-6 transition-all duration-500 ease-in-out"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-3xl font-bold">{movie.title}</h2>
                  <p className="text-sm mt-2">{movie.release_date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMovie && (
        <Dialog open={Boolean(selectedMovie)} onClose={closeModal} className="relative z-50">
          <div className="fixed inset-0 bg-black bg-opacity-60" />
          <Dialog.Panel className="max-w-lg mx-auto bg-gray-900 p-8 rounded-lg mt-32 transform transition-all duration-300">
            <Dialog.Title className="text-3xl font-bold text-white mb-4">{selectedMovie.title}</Dialog.Title>
            <div className="mb-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <p className="text-white mb-4">{selectedMovie.overview}</p>
            <p className="text-sm text-gray-400">Release Date: {selectedMovie.release_date}</p>
            <p className="text-sm text-gray-400">Genres: {selectedMovie.genre_ids.join(', ')}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              Close
            </button>
          </Dialog.Panel>
        </Dialog>
      )}
    </div>
  );
};

export default ActionMovies;
