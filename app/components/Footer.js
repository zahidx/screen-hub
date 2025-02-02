"use client";

import { useState, useEffect } from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi"; // Add this line
import { HiChevronUp } from "react-icons/hi";
import { motion } from "framer-motion";


export default function Footer() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with email: ${email}`);
    setIsModalOpen(false); // Close modal after submission
  };

  return (
    <div>




{/* Social Icons */}
    <footer className="  bg-gradient-to-t from-[#3d0e5a] to-[#0E1628] text-white py-16 relative px-4 md:px-16 overflow-hidden">
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-yellow-500 p-5 rounded-full shadow-xl hover:bg-yellow-600 transition-all transform hover:scale-110 glow-button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <HiChevronUp className="text-3xl text-gray-900" />
        </motion.button>
      )}

      {/* Footer Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto text-center px-6 space-y-12"
      >

      
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center space-y-12 md:space-y-0 md:space-x-16">

          {/* Left Section - Logo + Description */}
          <div className="text-center md:text-center space-y-4 pt-2">
            <h1 className="text-5xl font-bold text-yellow-400 mb-2 tracking-wide glowing-text">
              ScreenHub
            </h1>
            <p className="text-lg text-gray-300 max-w-xs mx-auto md:mx-0">
              Your go-to platform for entertainment, providing the best content at your fingertips.
            </p>

            {/* Footer Bottom */}
            <div className="relative border-t border-gray-700 text-center hidden md:block">
  <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} ScreenHub. All rights reserved.</p>
</div>

          </div>

          {/* Middle Section - Social Media & Newsletter */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-semibold text-yellow-400 glowing-text">Stay Connected</h2>
            <div className="flex justify-center space-x-8">
              {[ 
                { icon: <FaTwitter />, href: "https://twitter.com/ScreenHub" },
                { icon: <FaFacebook />, href: "https://facebook.com/ScreenHub" },
                { icon: <FaInstagram />, href: "https://instagram.com/ScreenHub" },
                { icon: <FaGithub />, href: "https://github.com/ScreenHub" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl text-gray-300 hover:text-yellow-500 transition duration-300 glow-icon"
                  whileHover={{ scale: 1.3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-500 text-gray-900 px-10 py-3 rounded-lg shadow-xl font-semibold hover:bg-yellow-600 transition mt-6 glow-button"
            >
              Subscribe to Our Newsletter
            </button>
          </div>

{/* Right Section - Quick Links */}
<div className="text-center md:text-left space-y-6">
  {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((link, index) => (
    <p key={index} className="text-lg text-gray-300 flex items-center ">
      <FiChevronRight className="text-yellow-500 font-extrabold" /> {/* First arrow icon */}
      <FiChevronRight className="text-yellow-500 -ml-3 font-extrabold" /> {/* Second arrow icon */}
      <a href={`/${link.toLowerCase().replace(" ", "")}`} className="hover:text-yellow-500 transition glowing-text">
        {link}
      </a>
    </p>
  ))}
  <div className="relative border-t border-gray-700 text-center block md:hidden">
  <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} ScreenHub. All rights reserved.</p>
</div>

</div>

        </div>




      </motion.div>

      {/* Custom Newsletter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-96 mx-auto transform scale-110">
            <h2 className="text-3xl font-semibold text-yellow-400 mb-6">Subscribe to Our Newsletter</h2>
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className="bg-gray-700 text-white px-6 py-3 w-full rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 px-8 py-3 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 px-12 py-3 rounded-lg text-gray-900"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
    {/* Footer Section Headline */}
<div className=" bg-footer text-center py-12 bg-gradient-to-r from-[#0E1628] to-[#380643]">
  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E5970F] to-[#E69A10]">
    "The Future Belongs to Those Who Believe in the Beauty of Their Dreams."
  </h2>
  <p className="mt-4 text-sm text-gray-400">
    Dare to dream, strive to achieve.
  </p>
</div>
    </div>
  );
}
