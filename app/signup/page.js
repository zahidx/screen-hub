"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const SignUpModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Close modal and navigate back
  const handleClose = () => {
    router.push("/"); // Navigate to the homepage or another page
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gradient-to-r dark:from-[#0E1628] dark:to-[#380643] rounded-lg p-8 w-96 shadow-xl transition-all duration-300">
        {/* Close Button beside Sign Up heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-center text-white">Sign Up</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <p className="text-center text-gray-400 mb-4">Create an account to get started.</p>

        {/* Name Input */}
        <div className="relative mb-4">
          <FiUser className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white border-gray-600 transition duration-200"
          />
        </div>

        {/* Email Input */}
        <div className="relative mb-4">
          <FiMail className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white border-gray-600 transition duration-200"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white border-gray-600 transition duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Sign Up Button */}
        <button className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-md hover:bg-yellow-600 transition duration-200">
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
          <span className="px-2 text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-4">
          <button className="w-full flex items-center justify-center py-3 border-2 rounded-md hover:bg-gray-700 bg-gray-800 text-white transition duration-200">
            <FcGoogle size={20} className="mr-2" /> Continue with Google
          </button>
          <button className="w-full flex items-center justify-center py-3 border-2 rounded-md hover:bg-blue-800 bg-blue-600 text-white transition duration-200">
            <FaFacebook size={20} className="mr-2" /> Continue with Facebook
          </button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/sign-in" className="text-yellow-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpModal;
