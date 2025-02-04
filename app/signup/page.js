"use client";

import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { signUpWithEmail } from "../components/firebase";
import { Toaster, toast } from "react-hot-toast";
import Modal from "../components/Modal"; // Import the login modal

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

  useEffect(() => {
    toast.dismiss();
  }, [formData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSignUp = async () => {
    const { username, email, phone, password, confirmPassword } = formData;

    if (!username || !email || !phone || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await signUpWithEmail(email, password);
      toast.success("Signup successful!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1628]">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-[#1A1A2E] text-white rounded-2xl p-8 w-96 shadow-xl">
        <h2 className="text-2xl font-bold text-center text-[#E69A10] mb-4">
          Create an Account
        </h2>

        <button className="w-full bg-[#4285F4] text-white font-bold py-2 rounded-lg hover:bg-[#357AE8] transition-all duration-300 shadow-lg mb-4">
          Continue with Google
        </button>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <div className="h-px w-full bg-gray-600"></div>
          <span>or</span>
          <div className="h-px w-full bg-gray-600"></div>
        </div>

        {["username", "email", "phone"].map((field, index) => (
          <div key={index} className="relative mb-3">
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleInputChange}
              className="w-full pl-4 pr-4 py-2 bg-[#22223B] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E69A10] transition-all"
            />
          </div>
        ))}

        {["password", "confirmPassword"].map((field, index) => (
          <div key={index} className="relative mb-3">
            <input
              type={visibility[field] ? "text" : "password"}
              name={field}
              placeholder={field === "password" ? "Password" : "Confirm Password"}
              value={formData[field]}
              onChange={handleInputChange}
              className="w-full pl-4 pr-10 py-2 bg-[#22223B] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E69A10] transition-all"
            />
            <button
              type="button"
              onClick={() => toggleVisibility(field)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {visibility[field] ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        ))}

        <button
          onClick={handleSignUp}
          className="w-full bg-[#E69A10] text-[#1A1A2E] font-bold py-2 rounded-lg hover:bg-[#D4880F] transition-all duration-300 shadow-lg"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account? {" "}
          <button
            onClick={() => setShowLoginModal(true)}
            className="text-[#E69A10] hover:underline"
          >
            Login
          </button>
        </p>
      </div>

      {showLoginModal && <Modal showModal={showLoginModal} setShowModal={setShowLoginModal} />}
    </div>
  );
};

export default SignUp;
