"use client";

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react'; // For the modal

const OngoingTVSeries = () => {
  const [tvSeries, setTvSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTvSeries, setSelectedTvSeries] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOngoingTVSeries = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setTvSeries(data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ongoing TV series');
        setLoading(false);
      }
    };

    fetchOngoingTVSeries();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectTvSeries = (tvSeries) => {
    setSelectedTvSeries(tvSeries);
  };

  const closeModal = () => {
    setSelectedTvSeries(null);
  };

  const filteredTvSeries = tvSeries.filter(tvSeries =>
    tvSeries.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-2xl font-bold text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-[#1A1A2E] to-[#3A3F53] min-h-screen py-12 px-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">Ongoing TV Series</h1>
        <input
          type="text"
          placeholder="Search ongoing TV series..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full sm:w-2/3 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
        />
      </div>

      {/* Two rows of 10 cards each */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-8">
        {filteredTvSeries.slice(0, 20).map((tv) => (
          <div
            key={tv.id}
            className="group relative bg-gradient-to-br from-[#232746] to-[#414C63] rounded-lg shadow-lg transition-all cursor-pointer"
            onClick={() => handleSelectTvSeries(tv)}
          >
            <div className="relative h-[450px] w-full">
              <img
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt={tv.name}
                className="absolute top-0 left-0 right-0 bottom-0 object-cover w-full h-full opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white transition-all duration-300 group-hover:translate-y-2">
                <h2 className="text-3xl font-bold">{tv.name}</h2>
                <p className="text-sm mt-2">{tv.first_air_date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTvSeries && (
        <Dialog open={Boolean(selectedTvSeries)} onClose={closeModal} className="relative z-50">
          <div className="fixed inset-0 bg-black bg-opacity-60" />
          <Dialog.Panel className="max-w-lg mx-auto bg-gray-900 p-8 rounded-lg mt-32 transform transition-all duration-300">
            <Dialog.Title className="text-3xl font-bold text-white mb-4">{selectedTvSeries.name}</Dialog.Title>
            <div className="mb-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedTvSeries.poster_path}`}
                alt={selectedTvSeries.name}
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <p className="text-white mb-4">{selectedTvSeries.overview}</p>
            <p className="text-sm text-gray-400">First Air Date: {selectedTvSeries.first_air_date}</p>
            <p className="text-sm text-gray-400">Genres: {selectedTvSeries.genre_ids.join(', ')}</p>
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

export default OngoingTVSeries;
