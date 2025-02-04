"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth } from "../components/firebase"; // Import Firebase auth and firestore modules
import { HiOutlinePencil } from "react-icons/hi"; // Pencil icon for editing
import { IoClose } from "react-icons/io5"; // Close icon for modal

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(""); // Which field is being edited ('name' or 'phone')
  const [newData, setNewData] = useState(""); // New data for the field
  const [error, setError] = useState(""); // Error message state
  const [success, setSuccess] = useState(""); // Success message state
  const [profilePic, setProfilePic] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [role, setRole] = useState("User"); // Assume default role is User
  const router = useRouter();
  const db = getFirestore(); // Initialize Firestore
  const storage = getStorage(); // Initialize Firebase Storage

  // Toggle Dark Mode with persistence in localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User authenticated:", user); // Log user for debugging

        // Fetch user data from Firebase Authentication
        const fetchedUserData = {
          name: user.displayName || "No Name", // Default to 'No Name' if displayName is not set
          email: user.email,
        };

        // Fetch additional user information (phone number) from Firestore
        const userRef = doc(db, "users", user.uid); // Assuming user data is stored in the 'users' collection with UID as document ID
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // If the user document exists in Firestore, get the phone number
          fetchedUserData.phoneNumber = userDoc.data().phone || "No Phone Number";
          fetchedUserData.role = userDoc.data().role || "User"; // Role management
        } else {
          // If no document exists, fallback to 'No Phone Number'
          fetchedUserData.phoneNumber = "No Phone Number";
          fetchedUserData.role = "User";
        }

        setUserData(fetchedUserData);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router, db]);

  const openEditModal = (field) => {
    setEditField(field);
    setNewData(userData[field]);
    setError(""); // Reset error when opening the modal
    setSuccess(""); // Reset success message when opening the modal
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditField("");
    setNewData("");
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    setNewData(e.target.value);
  };

  const handleSaveChanges = async () => {
    if (!newData.trim()) {
      setError("Field cannot be empty.");
      return;
    }

    try {
      if (editField === "name" && newData !== userData.name) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          displayName: newData,
        });
      } else if (editField === "phone" && newData !== userData.phoneNumber) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          phone: newData,
        });
      }

      // Update the state to reflect changes
      setUserData((prevData) => ({
        ...prevData,
        [editField]: newData,
      }));

      setSuccess("Changes saved successfully!");
      closeEditModal();
    } catch (error) {
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", null, (err) => {
        setError("Error uploading image: " + err.message);
      }, async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          profilePic: url,
        });
        setProfilePic(url);
        setSuccess("Profile picture updated!");
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#1A1A2E]" : "bg-[#F5F5F5]"} transition-all duration-300`}>
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">{userData.name}'s Dashboard</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 dark:bg-[#22223B]">
          <h2 className="text-2xl font-semibold text-[#E69A10] mb-4">User Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-lg font-medium text-gray-700 dark:text-white">
                <strong>Name:</strong> {userData.name}
              </p>
              <button
                onClick={() => openEditModal("name")}
                className="text-[#E69A10] hover:text-[#D4880F] transition-all"
                aria-label="Edit name"
              >
                <HiOutlinePencil size={20} />
              </button>
            </div>

            <div className="flex justify-between">
              <p className="text-lg font-medium text-gray-700 dark:text-white">
                <strong>Email:</strong> {userData.email}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-lg font-medium text-gray-700 dark:text-white">
                <strong>Phone Number:</strong> {userData.phoneNumber}
              </p>
              <button
                onClick={() => openEditModal("phone")}
                className="text-[#E69A10] hover:text-[#D4880F] transition-all"
                aria-label="Edit phone"
              >
                <HiOutlinePencil size={20} />
              </button>
            </div>

            {/* Profile Picture Upload */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-lg font-medium text-gray-700 dark:text-white">
                <strong>Profile Picture:</strong>
              </div>
              <input
                type="file"
                onChange={handleProfilePicUpload}
                className="text-[#E69A10] hover:text-[#D4880F] transition-all"
                accept="image/*"
              />
            </div>
            {profilePic && <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full mt-4" />}
          </div>
        </div>

        {/* Modal for Editing */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center transition-all duration-300">
            <div className="bg-white p-8 rounded-lg w-full max-w-md transform transition-all duration-300 opacity-100 scale-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-[#E69A10]">{`Edit ${editField}`}</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Error and Success Messages */}
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

              <input
                type="text"
                value={newData}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E69A10] mb-4 transition-all duration-300"
                placeholder={`Enter new ${editField}`}
              />
              <button
                onClick={handleSaveChanges}
                className="w-full p-3 bg-[#E69A10] text-white rounded-md hover:bg-[#D4880F] transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg dark:bg-[#22223B]">
          <h3 className="text-xl font-semibold text-[#E69A10] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-white">🔹 Logged in at: {new Date().toLocaleString()}</p>
            <p className="text-gray-600 dark:text-white">🔹 Last update: 3 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
