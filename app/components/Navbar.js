"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiUser, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { MdOutlineMovie, MdTv, MdCategory } from "react-icons/md";
import { useTheme } from "next-themes";
import Modal from "./Modal"; // Import Modal component

const MenuItem = ({ href, children }) => (
  <a href={href} className="block px-4 py-2 hover:bg-gray-700">
    {children}
  </a>
);

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating authentication
  const { theme, setTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [dropdownOpen, setDropdownOpen] = useState({ movies: false, tv: false, genres: false }); // State to track dropdown visibility
  const dropdownRefs = useRef({}); // To track dropdown menu elements

  const toggleMobileMenu = () => setMobileMenu(prevState => !prevState);

  const toggleDropdown = (menu) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const handleClickOutside = (e) => {
    // Close all dropdowns if click is outside of any dropdown
    if (
      dropdownRefs.current.movies && !dropdownRefs.current.movies.contains(e.target) &&
      dropdownRefs.current.tv && !dropdownRefs.current.tv.contains(e.target) &&
      dropdownRefs.current.genres && !dropdownRefs.current.genres.contains(e.target)
    ) {
      setDropdownOpen({ movies: false, tv: false, genres: false });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-xl font-bold text-yellow-500 flex items-center bg-yellow-500 md:bg-transparent md:text-yellow-500 text-black py-1 px-1 rounded-sm md:py-0 md:px-0">
          <span className="hidden md:block">📺</span>
          <span className="hidden md:block">ScreenHub</span>
          <span className="block md:hidden">sHub</span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 z-30">
          <li className="relative" ref={el => (dropdownRefs.current.movies = el)}>
            <button className="flex items-center space-x-2" onClick={() => toggleDropdown('movies')}>
              <MdOutlineMovie size={20} />
              <span>Movies</span>
            </button>
            {dropdownOpen.movies && (
              <div className="absolute left-0 top-10 bg-gray-800 p-2 rounded-md">
                <MenuItem href="/movies/popular">Popular</MenuItem>
                <MenuItem href="/movies/upcoming">Upcoming</MenuItem>
              </div>
            )}
          </li>

          <li className="relative" ref={el => (dropdownRefs.current.tv = el)}>
            <button className="flex items-center space-x-2" onClick={() => toggleDropdown('tv')}>
              <MdTv size={20} />
              <span>TV Shows</span>
            </button>
            {dropdownOpen.tv && (
              <div className="absolute left-0 top-10 bg-gray-800 p-2 rounded-md">
                <MenuItem href="/tv/popular">Popular</MenuItem>
                <MenuItem href="/tv/ongoing">Ongoing</MenuItem>
              </div>
            )}
          </li>

          <li className="relative" ref={el => (dropdownRefs.current.genres = el)}>
            <button className="flex items-center space-x-2" onClick={() => toggleDropdown('genres')}>
              <MdCategory size={20} />
              <span>Genres</span>
            </button>
            {dropdownOpen.genres && (
              <div className="absolute left-0 top-10 bg-gray-800 p-2 rounded-md">
                <MenuItem href="/genre/action">Action</MenuItem>
                <MenuItem href="/genre/comedy">Comedy</MenuItem>
              </div>
            )}
          </li>

          <li>
            <a href="/watchlist" className="hover:text-yellow-400">Watchlist</a>
          </li>
        </ul>

        {/* Search Bar (for mobile and desktop) */}
        <div className="relative hidden md:block">
          <input type="text" placeholder="Search movies, TV shows..." className="bg-gray-700 text-white px-4 py-2 rounded-full pl-10 w-64 focus:outline-none" />
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>

        {/* Right Side: User, Theme Toggle, Language Selector, and Sign In */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="p-2 bg-gray-800 rounded-full" 
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Language Selector */}
          <select className="bg-gray-800 text-white px-2 py-1 rounded-md">
            <option>EN</option>
            <option>ES</option>
            <option>FR</option>
          </select>

          {/* Sign In button */}
          {!isLoggedIn && (
            <button 
              onClick={() => setShowModal(true)} 
              className="bg-yellow-500 px-4 py-2 rounded-md text-gray-900 font-bold hidden md:block"
              aria-label="Sign in"
            >
              Sign In
            </button>
          )}

          {/* Authentication Handling */}
          {isLoggedIn && (
            <button 
              onClick={() => setIsLoggedIn(false)} 
              className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md"
              aria-label="Log out"
            >
              <FiUser size={20} />
              <span>Profile</span>
              <FiLogOut size={18} className="text-red-500" />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Search Icon */}
          <FiSearch className="text-gray-400" size={20} />
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-gray-800 py-4">
          <MenuItem href="/">Home</MenuItem>
          <MenuItem href="/movies">Movies</MenuItem>
          <MenuItem href="/tv">TV Shows</MenuItem>
          <MenuItem href="/watchlist">Watchlist</MenuItem>
          {!isLoggedIn && (
            <MenuItem href="/login" className="bg-yellow-500 text-gray-900 text-center font-bold">Sign In</MenuItem>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </nav>
  );
}
