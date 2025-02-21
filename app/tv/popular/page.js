"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PopularTVSeries = () => {
  const [tvSeries, setTvSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPopularTVSeries = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setTvSeries(data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch popular TV series');
        setLoading(false);
      }
    };

    fetchPopularTVSeries();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectTvSeries = (tvSeries) => {
    router.push(`../components/tv/${tvSeries.id}`);
  };

  const filteredTvSeries = tvSeries.filter(tv =>
    tv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold text-white">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-700 h-10 w-1/2 mx-auto rounded"></div>
          <div className="bg-gray-700 h-4 w-2/3 mx-auto rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="group relative bg-gray-700 rounded-lg shadow-lg animate-pulse">
                <div className="h-[450px] w-full bg-gray-500 rounded-lg"></div>
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
        <h1 className="text-5xl font-extrabold text-white mb-4">Popular TV Series</h1>
        <input
          type="text"
          placeholder="Search TV series..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full sm:w-2/3 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTvSeries.map((tv) => (
          <div
            key={tv.id}
            className="group relative bg-gradient-to-br from-[#232746] to-[#414C63] rounded-lg overflow-hidden shadow-lg transition-all transform hover:shadow-xl cursor-pointer"
            onClick={() => handleSelectTvSeries(tv)}
          >
            <div className="relative h-[450px] w-full">
              <img
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt={tv.name}
                className="absolute top-0 left-0 right-0 bottom-0 object-cover w-full h-full opacity-75 transition-all duration-300 group-hover:opacity-90 group-hover:brightness-75"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-80 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-3xl font-bold">{tv.name}</h2>
                  <p className="text-sm mt-2">{tv.first_air_date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularTVSeries;