"use client";

import { useState, useEffect } from "react";
import { FiX, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Modal = ({ showModal, setShowModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const closeModal = (e) => {
    if (e.target.id === "modal-overlay") setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity"
      onClick={closeModal}
    >
      <div
        className="bg-white dark:bg-gradient-to-r dark:from-[#0E1628] dark:to-[#380643] 
          rounded-2xl p-6 w-96 relative shadow-xl transition-all transform scale-105 animate-fadeIn"
      >
        <div className="absolute top-3 right-3 flex gap-3">
          <button onClick={() => setShowModal(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <FiX size={24} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Sign In
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Please log in to access your account.
        </p>

        <div className="relative mb-3">
          <FiMail className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 
            dark:bg-gray-800 dark:text-white dark:border-gray-600 transition-all duration-200"
          />
        </div>

        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 
            dark:bg-gray-800 dark:text-white dark:border-gray-600 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            Remember Me
          </label>
          <a href="#" className="text-yellow-500 hover:underline text-sm">
            Forgot password?
          </a>
        </div>

        <button className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-600 dark:text-gray-900 transition-all duration-200">
          Sign In
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
          <span className="px-2 text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        </div>

        <div className="flex flex-col space-y-2">
          <button className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition-all duration-200">
            <FcGoogle size={20} className="mr-2" /> Continue with Google
          </button>
          <button className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition-all duration-200">
            <FaFacebook size={20} className="text-blue-600 mr-2" /> Continue with Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-3">
          Don't have an account?{" "}
          <a href="/signup" className="text-yellow-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Modal;