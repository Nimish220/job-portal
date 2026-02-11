import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaSave, FaCheckCircle } from 'react-icons/fa'; 
import { motion, AnimatePresence } from 'framer-motion';
import NavSearchBar from '../components/Header/NavSearchBar';
import Sidebar from '../components/SideBar';
import { FiArrowLeft, FiX } from 'react-icons/fi'; 
import useUserStore from '../store/userStore.js';
import { axiosInstance } from '../utils/axiosInstance';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    university: '',
    email: '',
    skills: '',
    experience: '',
    city: '',
    github: '',
    about: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        degree: user.degree || '',
        university: user.university || '',
        email: user.email || '',
        city: user.city || '',
        github: user.github || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '',
        experience: user.experience || '',
        about: user.about || ''
      });
    }
  }, [user]);

  const fileInputRef = useRef(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("profilePhoto", file);

    setPhotoLoading(true);
    try {
     const res = await axiosInstance.put('users/update-photo', formDataUpload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
      if (res.data.success) {
        if (setUser) setUser(res.data.user);
        setShowPopup(true); // Trigger Popup instead of alert
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //const apiUrl = `${base}/api/users/edit-profile`;

    try {
      // Logic to convert skills string back to array to avoid 500 error
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== "")
      };

      const res = await axiosInstance.put('users/edit-profile', payload);

      if (res.data.success) {
        if (setUser) setUser(res.data.user);
        setShowPopup(true); // Trigger Popup instead of alert
        setTimeout(() => navigate("/users/profile"), 2000); 
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <NavSearchBar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showHamburger={true}
      />

      {/* --- Toast Notification Popup --- */}
              <AnimatePresence>
                {showPopup && (
                  /* 1. Parent div to handle centering across the screen */
                  <div className="fixed top-10 left-0 right-0 z-[999] flex justify-center px-4 pointer-events-none">
                    <motion.div
                      /* 2. Change initial/exit from 'x' to 'y' for a top-down slide */
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      /* 3. Added pointer-events-auto so the toast buttons are still clickable */
                      className="pointer-events-auto flex items-center gap-3 bg-white border-l-8 border-[#5F9D08] px-8 py-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] min-w-[320px]"
                    >
                      <FaCheckCircle className="text-[#5F9D08] text-2xl flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-800 font-bold">Updated successfully!</p>
                      </div>
                      <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600 transition">
                        <FiX size={20} />
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

      <div className="hidden lg:block mt-20 fixed top-0 left-0 min-h-screen">
        <Sidebar isOpen={true} isMobile={false} />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-gray-200 rounded-2xl p-10 w-full lg:ml-64 mt-20"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-[#5F9D08] hover:text-[#4e7c07] mb-4 transition"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#5F9D08] flex justify-center items-center gap-2">
            <FaUserEdit /> Edit Your Profile
          </h2>
        </div>
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative group cursor-pointer"
            onClick={() => !photoLoading && fileInputRef.current.click()}
          >
            <img
              src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=5F9D08&color=fff`}
              alt="Profile"
              className={`w-28 h-28 rounded-full border-4 border-[#5F9D08] object-cover shadow-md transition ${photoLoading ? 'opacity-50' : 'group-hover:opacity-80'}`}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              {photoLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
              ) : (
                <FaUserEdit className="text-white text-xl" />
              )}
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
          <p className="text-xs text-gray-500 mt-2">Click photo to change</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { id: 'name', label: 'Name' },
            { id: 'degree', label: 'Degree' },
            { id: 'university', label: 'University' },
            { id: 'email', label: 'Email', disabled: true },
            { id: 'city', label: 'Location' },
            { id: 'skills', label: 'Skills' },
            { id: 'experience', label: 'Experience' },
            { id: 'github', label: 'GitHub' }
          ].map(field => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                type="text"
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                disabled={field.disabled || false}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none transition ${field.disabled
                  ? "bg-gray-100 cursor-not-allowed opacity-70"
                  : "focus:ring-2 focus:ring-[#5F9D08]"
                  }`}
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label htmlFor="about" className="block text-gray-700 font-medium mb-1">About</label>
            <textarea
              id="about"
              rows="4"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F9D08] transition"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#5F9D08] hover:bg-[#4e7c07] text-white py-3 rounded-full font-bold transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaSave /> {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;