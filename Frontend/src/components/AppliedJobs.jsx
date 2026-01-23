import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../store/userStore.js';
import Sidebar from '../components/SideBar';
import NavSearchBar from '../components/Header/NavSearchBar';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppliedJobs = () => {
  const { getAppliedJobs, appliedJobs, appliedInternships } = useUserStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (getAppliedJobs) getAppliedJobs();
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getAppliedJobs]);

  const isMobile = screenWidth < 768;

  // Data Normalization Helper
  // This extracts the company name from the recruiter object based on your schema
  const getDisplayData = (item) => {
    const title = activeTab === "jobs" ? item.jobRole : item.internshipRole;
    // Checks item.recruiter.companyName first, then fallbacks
    const company = item.recruiter?.companyName || item.companyName || "Unknown Company";
    return { title, company };
  };

  // Search Logic using normalized data
  const filteredData = (activeTab === "jobs" ? appliedJobs : appliedInternships).filter((item) => {
    const { title, company } = getDisplayData(item);
    return (
      title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const renderCard = (item, index, isInternship = false) => {
    const { title, company } = getDisplayData(item);
    
    // Status handling based on your applicantSchema enum
    const status = item.status || "Submitted";
    
    // Date handling using timestamps from your schema
    const dateText = item.createdAt || item.appliedAt 
      ? new Date(item.createdAt || item.appliedAt).toLocaleDateString() 
      : "Recently";

    const buttonContainerClass = "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 justify-end";
    const buttonClass = "w-full sm:w-auto text-sm px-4 py-2 rounded-lg font-medium transition-all duration-300";

    return (
      <motion.div
        key={item._id}
        // EXACT Matching classes for Box Size and Shadow
        className="relative bg-white p-3 lg:p-5 rounded-xl shadow-md mb-4 mx-2 md:mx-4 hover:shadow-lg transition-all duration-300 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ scale: 1.01 }}
      >
        <span className={`absolute top-2 left-2 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded ${isInternship ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
          {isInternship ? 'Internship' : 'Job'}
        </span>

        <div className="flex items-start mt-6 sm:mt-3">
          {/* Company Icon Gutter */}
          <div className="bg-green-50 p-1 rounded-full mr-3 w-8 h-8 hidden sm:flex items-center justify-center text-[#5F9D08] font-bold text-base md:text-xl flex-shrink-0">
          {company.charAt(0)}
        </div>

          <div>
            {/* Font sizes matched exactly */}
            <h3 className="m-0 text-base lg:text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-xs lg:text-sm font-medium text-[#5F9D08]">{company}</p>
            
            <p className="text-gray-600 text-[10px] sm:text-xs mt-1 flex flex-wrap gap-x-2">
              <span className="inline-flex items-center">
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${status === 'Rejected' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                Status: {status}
              </span>
              <span className="text-gray-400">|</span>
              <span className="inline-flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                Applied: {dateText}
              </span>
            </p>
          </div>
        </div>

        <div className={buttonContainerClass}>
          <Link
            to={`/users/${isInternship ? 'internship' : 'job'}/${item._id}`}
            className={`bg-white text-[#5F9D08] border-2 border-[#5F9D08] hover:bg-green-50 text-center ${buttonClass}`}
          >
            View Details
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
      <NavSearchBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showHamburger={true} />
      
      {!isMobile && (
        <div className="hidden lg:block fixed top-20 left-0 z-30">
          <Sidebar isOpen={true} isMobile={false} />
        </div>
      )}

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
        )}
      </AnimatePresence>

      <div className="flex-1 pt-24 lg:pl-64 px-4 md:px-8">
        <motion.div className="mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-gray-800 border-l-4 border-[#5F9D08] pl-3">Applied Job & Internships</h1>
          <p className="text-gray-600 mt-2 pl-4">Track your application progress here.</p>
        </motion.div>

        <div className="mb-6 px-2 sm:px-0">
          <input
            type="text"
            placeholder="Search by role or company..."
            className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5F9D08] focus:outline-none text-sm shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-4 mb-4 px-2 sm:px-0"> 
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex-1 sm:flex-none px-6 py-2 font-medium rounded-lg transition-all ${activeTab === "jobs" ? "bg-[#5F9D08] text-white" : "bg-white text-gray-800 border border-gray-300"}`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab("internships")}
            className={`flex-1 sm:flex-none px-6 py-2 font-medium rounded-lg transition-all ${activeTab === "internships" ? "bg-[#5F9D08] text-white" : "bg-white text-gray-800 border border-gray-300"}`}
          >
            Internships
          </button>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => renderCard(item, idx, activeTab === "internships"))
          ) : (
            <p className="text-gray-500 mt-4 px-4 italic">No matching applications found.</p>
          )}
        </motion.div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AppliedJobs;
