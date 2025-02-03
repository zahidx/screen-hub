import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MdCategory, MdChevronLeft, MdChevronRight, MdMenu } from "react-icons/md";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Home() {
  const [genres, setGenres] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [disableAutoScroll, setDisableAutoScroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for toggling sidebar on mobile

  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    async function fetchGenres() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
          params: { api_key: API_KEY },
        });

        const filteredGenres = response.data.genres.slice(2);
        setGenres(filteredGenres);

        const animationGenre = filteredGenres.find((genre) => genre.name.toLowerCase() === 'animation');
        if (animationGenre) {
          setActiveGenre(animationGenre.id);
          handleGenreClick(animationGenre.id);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGenres();
  }, []);

  const handleGenreClick = async (genreId) => {
    setActiveGenre(genreId);
    try {
      const response = await axios.get(`${BASE_URL}/discover/tv`, {
        params: { api_key: API_KEY, with_genres: genreId },
      });

      const results = response.data.results;
      if (results.length > 0) {
        setFilteredShows(results);
      } else {
        setFilteredShows([]);
        setGenres((prevGenres) => prevGenres.filter((g) => g.id !== genreId));
      }
    } catch (error) {
      console.error("Error fetching filtered shows:", error);
    }
  };

  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 500;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const autoScroll = (ref, intervalTime, direction = "right") => {
    const interval = setInterval(() => {
      if (ref.current && !disableAutoScroll) {
        const scrollPosition = ref.current.scrollLeft;
        const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;

        if (direction === "right" && scrollPosition >= maxScroll) {
          direction = "left";
        }
        if (direction === "left" && scrollPosition <= 0) {
          direction = "right";
        }

        scroll(direction, ref);
      }
    }, intervalTime);

    return interval;
  };

  useEffect(() => {
    const row1Interval = autoScroll(row1Ref, 3000, "right");
    const row2Interval = autoScroll(row2Ref, 2500, "right");

    return () => {
      clearInterval(row1Interval);
      clearInterval(row2Interval);
    };
  }, [disableAutoScroll]);

  const handleSideButtonClick = () => {
    setDisableAutoScroll(true);
    setTimeout(() => {
      setDisableAutoScroll(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        aria-label="Toggle Sidebar"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden text-gray-600 p-3 rounded-full mb-4"
      >
        <MdMenu size={30} />
      </button>

      {/* Sidebar Navigation */}
      <aside
  className={`w-full lg:w-44 p-4 lg:border-r border-gray-300 overflow-hidden transition-transform duration-300 ease-in-out transform ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  } lg:translate-x-0 fixed lg:relative left-0 top-0 bottom-0 z-10`}
>
   
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <MdCategory className="mr-2 text-yellow-400" /> Genres
        </h2>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="text-center">Loading genres...</div>
          ) : (
            genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`px-4 py-2 rounded-lg font-bold shadow-md transition text-left w-full ${
                  activeGenre === genre.id
                    ? "bg-[#4d9e4d] text-gray-900"
                    : "bg-[#5c79a1] text-gray-900 hover:bg-[#6584b0]"
                }`}
              >
                {genre.name}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-6 overflow-x-hidden pt-40">
        {filteredShows.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              TV Shows in {genres.find((g) => g.id === activeGenre)?.name}
            </h3>

            {/* First Row - Slider */}
            <div className="relative mb-8">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-700"
                onClick={() => {
                  handleSideButtonClick();
                  scroll("left", row1Ref);
                }}
              >
                <MdChevronLeft size={30} />
              </button>

              <div
                ref={row1Ref}
                className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar whitespace-nowrap"

                style={{
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // Internet Explorer, Edge
                }}
              >
                {filteredShows.map((show) => (
                  <Link
                    key={show.id}
                    href={`/tv/${show.id}`}
                    className="group w-[200px] flex-shrink-0"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform hover:translate-y-[-20px]">
                      <img
                        src={`${IMAGE_BASE_URL}${show.poster_path}`}
                        alt={show.name}
                        className="w-full h-[300px] object-cover"
                      />
                      <div className="absolute bottom-0 bg-black bg-opacity-70 w-full text-center py-2 text-white font-semibold">
                        {show.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-700"
                onClick={() => {
                  handleSideButtonClick();
                  scroll("right", row1Ref);
                }}
              >
                <MdChevronRight size={30} />
              </button>
            </div>

            {/* Second Row - Slider */}
            <div className="relative">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-700"
                onClick={() => {
                  handleSideButtonClick();
                  scroll("left", row2Ref);
                }}
              >
                <MdChevronLeft size={30} />
              </button>

              <div
  ref={row2Ref}
  className="flex gap-4 overflow-x-auto scroll-smooth whitespace-nowrap"
  style={{
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // Internet Explorer, Edge
  }}
>
                {filteredShows.map((show) => (
                  <Link
                    key={show.id}
                    href={`/tv/${show.id}`}
                    className="group w-[200px] flex-shrink-0"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform hover:translate-y-[-20px]">
                      <img
                        src={`${IMAGE_BASE_URL}${show.poster_path}`}
                        alt={show.name}
                        className="w-full h-[300px] object-cover"
                      />
                      <div className="absolute bottom-0 bg-black bg-opacity-70 w-full text-center py-2 text-white font-semibold">
                        {show.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-700"
                onClick={() => {
                  handleSideButtonClick();
                  scroll("right", row2Ref);
                }}
              >
                <MdChevronRight size={30} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
