import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaSave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import NavSearchBar from '../components/Header/NavSearchBar';
import Sidebar from '../components/SideBar';
import { FiArrowLeft } from 'react-icons/fi';
import useUserStore from '../store/userStore.js';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useUserStore(); //  Live data from database store

  //  State keys match your Console Log: 'city', 'experience', 'about'
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

  //  Step 1: Initialize form using keys exactly as they appear in the Backend Response
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        degree: user.degree || '',
        university: user.university || '',
        email: user.email || '',
        city: user.city || '',        // Matches console 'city'
        github: user.github || '',
        skills: user.skills || '',
        experience: user.experience || '', // Matches console 'experience'
        about: user.about || ''       // Matches console 'about'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  //  Step 2: Handle Save with correct mapping & versioned URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Fallback URL to prevent 'undefined' errors
    const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    try {
      //  Sending keys exactly as the backend expects (singular)
      const res = await fetch(`${base}/users/edit-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //  Required for auth session
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (data.success) {
          navigate("/users/profile"); // Redirect on success
        } else {
          alert("Error: " + data.message);
        }
      } else {
        console.error("Non-JSON response. Ensure backend routes use .");
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavSearchBar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showHamburger={true}
      />  

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
          <FiArrowLeft className="mr-2"/> Back
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#5F9D08] flex justify-center items-center gap-2">
            <FaUserEdit /> Edit Your Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { id: 'name', label: 'Name' },
            { id: 'degree', label: 'Degree' },
            { id: 'university', label: 'University' },
            { id: 'email', label: 'Email', disabled: true }, //  TASK 2: Security Lock
            { id: 'city', label: 'Location' },           // Map UI 'Location' to state 'city'
            { id: 'skills', label: 'Skills' },
            { id: 'experience', label: 'Experience' },   // Map UI to state 'experience'
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
                disabled={field.disabled || false} // ✅ TASK 2 Implementation
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none transition ${
                  field.disabled 
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
              className="w-full bg-[#5F9D08] hover:bg-[#4e7c07] text-white py-3 rounded-full font-bold transition-colors flex items-center justify-center gap-2"
            >
              <FaSave /> Update Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;