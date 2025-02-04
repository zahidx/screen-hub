"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { signUpWithEmail, signInWithGoogle } from "../components/firebase"; 
import { getAuth, updateProfile } from "firebase/auth"; 
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import Modal from "../components/Modal"; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "email") {
      if (value.includes("@")) {
        setEmailSuggestions([]);
      } else {
        setEmailSuggestions([
          `${value}@gmail.com`,
          `${value}@yahoo.com`,
          `${value}@outlook.com`,
        ]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData((prevData) => ({
      ...prevData,
      email: suggestion,
    }));
    setEmailSuggestions([]);
    setEmailFocused(false);
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const user = await signUpWithEmail(formData.email, formData.password);
      const auth = getAuth();
      await updateProfile(auth.currentUser, { displayName: formData.username });

      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
      });

      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1628]">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-[#1A1A2E] text-white rounded-2xl p-8 w-96 shadow-xl">
        <h2 className="text-2xl font-bold text-center text-[#E69A10] mb-4">Create an Account</h2>

        {/* Google Signup */}
        <button
          onClick={signInWithGoogle}
          className="w-full bg-white text-black font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300 shadow-md mb-4"
        >
          <FcGoogle size={24} />
          Sign up with Google
        </button>

        {/* Username */}
        <div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2 bg-[#22223B] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E69A10] transition-all"
          />
        </div>

        {/* Email with suggestions */}
        <div className="relative mb-3 flex items-center">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setTimeout(() => setEmailFocused(false), 150)}
            className="w-full pl-4 pr-4 py-2 bg-[#22223B] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E69A10] transition-all"
          />

          {emailFocused && emailSuggestions.length > 0 && (
            <div className="absolute left-full ml-2 bg-[#22223B] text-white border border-gray-600 rounded-lg shadow-lg w-40">
              {emailSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-[#E69A10] transition-all"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2 bg-[#22223B] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E69A10] transition-all"
          />
        </div>

        {/* Password */}
        <div className="relative mb-3">
          <input
            type={visibility.password ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-4 pr-10 py-2 bg-[#22223B] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E69A10] transition-all"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => setVisibility((prev) => ({ ...prev, password: !prev.password }))}
          >
            {visibility.password ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-3">
          <input
            type={visibility.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full pl-4 pr-10 py-2 bg-[#22223B] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E69A10] transition-all"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => setVisibility((prev) => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
          >
            {visibility.confirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-[#E69A10] text-[#1A1A2E] font-bold py-2 rounded-lg hover:bg-[#D4880F] transition-all duration-300 shadow-lg flex items-center justify-center"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            className="text-[#E69A10] cursor-pointer hover:underline"
            onClick={() => setShowLoginModal(true)}
          >
            Login
          </span>
        </p>

        {/* Login Modal */}
        {showLoginModal && <Modal showModal={showLoginModal} setShowModal={setShowLoginModal} />}
      </div>
    </div>
  );
};

export default SignUp;
