// src/components/SideBar.jsx
import React, { useRef, useEffect } from 'react';
import { NavLink,Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import useUserStore from '../store/userStore.js';

const SideBar = ({ isOpen, onClose, isMobile }) => {
  const sidebarRef = useRef(null);
  const { appliedJobs, appliedInternships } = useUserStore();

  // Detect clicks outside the sidebar (on mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile, onClose]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 hover:bg-[#4e8606] ${
      isActive ? 'bg-[#4e8606]' : ''
    }`;

  return (
    <motion.div
      ref={sidebarRef}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#5F9D08] text-white w-54 min-h-[calc(100vh-5rem)] fixed lg:static top-20 left-0 p-4 z-50 rounded-r-lg shadow-lg flex flex-col`}
    >
      {/* Close/Hamburger button only on mobile */}
      {isMobile && (
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-white text-2xl cursor-pointer">
            <FiX />
          </button>
        </div>
      )}

      <ul className="space-y-1">
        <li>
          <NavLink
            to="/users/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2 px-1 rounded-xl hover:bg-[#4e8606] 
              ${isActive ? 'bg-[#4e8606]' : ''}`
            }
          >
            <i className="fas fa-chart-line text-white text-xl"></i>
            <span className="text-sm sm:text-base">DashBoard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users/saved-jobs"
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2 px-1 rounded-xl hover:bg-[#4e8606] 
              ${isActive ? 'bg-[#4e8606]' : ''}`
            }
          >
            <i className="fa-regular fa-font-awesome text-white text-xl"></i>
            <span className="text-sm sm:text-base">Saved Jobs/Internships</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users/job-recommendations"
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2 px-1 rounded-xl hover:bg-[#4e8606] 
              ${isActive ? 'bg-[#4e8606]' : ''}`
            }
          >
            <i className="fa-solid fa-briefcase text-white text-xl"></i>
            <span className="text-sm sm:text-base">Job/Internships Recommendations</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users/resume"
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2 px-1 rounded-xl hover:bg-[#4e8606] 
              ${isActive ? 'bg-[#4e8606]' : ''}`
            }
          >
            <i className="fas fa-file-alt text-white  text-xl"></i>
            <span className="text-sm sm:text-base">Resume</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/users/applied" className={({ isActive }) => `flex items-center space-x-2 py-2 px-1 rounded-xl hover:bg-[#4e8606] ${isActive ? 'bg-[#4e8606]' : ''}`}>
            <i className="fa-solid fa-check-double text-xl w-6 text-center"></i>
            <span className="text-sm sm:text-base font-medium">Applied Job & Internship</span>
          </NavLink>
        </li>
      </ul>
    </motion.div>
  );
};

export default SideBar;
