import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavSearchBar from "../components/Header/NavSearchBar";
import Sidebar from "../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobRecommendations = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [savedJobs, setSavedJobs] = useState(() => {
    const stored = localStorage.getItem("savedJobs");
    return stored ? JSON.parse(stored) : [];
  });
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [activeTab, setActiveTab] = useState("jobs"); 

  const navigate = useNavigate();
  const isMobile = screenWidth < 768;

  // ✅ FIXED: Normalize Backend URL with /api prefix
  const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const API_BASE = base.endsWith("/api") ? base : `${base}/api`;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ FIXED: Fetch jobs using the /api prefix
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE}/jobs`);
        
        // If server returns 404, the response is usually HTML, which causes the SyntaxError
        if (!response.ok) throw new Error("Server responded with error");
        
        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
      }
    };
    fetchJobs();
  }, [API_BASE]);

  //  FIXED: Fetch internships using the /api prefix
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch(`${API_BASE}/internships`, {
          credentials: "include",
        });
        
        if (!response.ok) throw new Error("Failed to fetch internships");
        
        const data = await response.json();

        // Support both data shapes: { internships: [] } or just []
        const rawList = data.internships || data || [];
        const normalizedInternships = rawList.map(item => ({
          ...item,
          recruiter: item.recruiter || { companyName: item.companyName || "Unknown Company" }
        }));

        setInternships(normalizedInternships);
      } catch (error) {
        console.error("Error fetching internships:", error);
        toast.error("Failed to load internships");
      }
    };
    fetchInternships();
  }, [API_BASE]);

  // Save / Unsave job or internship
  const handleSaveJob = (item) => {
    const normalizedItem = { ...item, title: item.jobRole || item.internshipRole };
    const isSaved = savedJobs.some((saved) => saved._id === item._id);
    const updatedJobs = isSaved
      ? savedJobs.filter((saved) => saved._id !== item._id)
      : [...savedJobs, normalizedItem];

    setSavedJobs(updatedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    toast[isSaved ? "info" : "success"](isSaved ? "Removed from saved jobs" : "Saved successfully!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const renderCard = (item, index, isInternship = false) => {
    const isSaved = savedJobs.some((saved) => saved._id === item._id);
    const title = isInternship ? item.internshipRole : item.jobRole;
    const company = item.recruiter?.companyName || "Unknown Company";
    const experience = item.experience || item.internshipDuration || "N/A";
    const type = isInternship ? item.internshipType : item.jobType;
    const ctc = isInternship ? item.stipendAmount || "N/A" : item.ctc || "N/A";

    const buttonContainerClass = "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 justify-end";
    const buttonClass = "w-full sm:w-auto text-sm px-4 py-2 rounded-lg font-medium transition-all duration-300";

    return (
      <motion.div
        key={item._id}
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
          <div className="bg-green-50 p-1 rounded-full mr-3 w-8 h-8 hidden sm:flex items-center justify-center text-[#5F9D08] font-bold text-base md:text-xl flex-shrink-0">
          {company.charAt(0)}
        </div>
          <div>
            <h3 className="m-0 text-base lg:text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-xs lg:text-sm font-medium text-[#5F9D08]">{company}</p>
            <p className="text-gray-600 text-[10px] sm:text-xs mt-1 flex flex-wrap gap-x-2">
              <span className="inline-flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                {experience}
              </span>
              <span className="text-gray-400">|</span>
              <span className="inline-flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                {type}
              </span>
              <span className="text-gray-400">|</span>
              <span className="inline-flex items-center">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1"></span>
                {ctc} {isInternship ? "" : "LPA"}
              </span>
            </p>
          </div>
        </div>

        <div className="absolute top-2 right-2 text-gray-600 text-xs lg:text-sm">
          <label className="flex items-center cursor-pointer hover:text-[#5F9D08] transition-colors duration-200">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-[#5F9D08] rounded border-gray-300 focus:ring-[#5F9D08] mr-1"
              checked={isSaved}
              onChange={() => handleSaveJob(item)}
            />
            <span className="hidden sm:inline">Save</span>
          </label>
        </div>

        <div className={buttonContainerClass}>
          <button
            onClick={() =>
              navigate(
                isInternship
                  ? `/users/internship/apply/${item._id}`
                  : `/users/apply/${item._id}`
              )
            }
            className={`bg-gradient-to-r from-[#5F9D08] to-[#4A8B07] text-white ${buttonClass}`}
          >
            Apply Now
          </button>
          <button
            onClick={() =>
              navigate(
                isInternship ? `/users/internship/${item._id}` : `/users/job/${item._id}`
              )
            }
            className={`bg-white text-[#5F9D08] border-2 border-[#5F9D08] hover:bg-green-50 ${buttonClass}`}
          >
            Know More
          </button>
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
          <h1 className="text-2xl font-bold text-gray-800 border-l-4 border-[#5F9D08] pl-3">Job & Internship Recommendations</h1>
          <p className="text-gray-600 mt-2 pl-4">Based on your skills and experience.</p>
        </motion.div>

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
          {activeTab === "jobs" ? (
            jobs.length > 0 ? (
              jobs.map((job, idx) => renderCard(job, idx))
            ) : <p className="text-gray-500 mt-4 px-4">No jobs available at the moment.</p>
          ) : (
            internships.length > 0 ? (
              internships.map((internship, idx) => renderCard(internship, idx, true))
            ) : <p className="text-gray-500 mt-4 px-4">No internships available at the moment.</p>
          )}
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default JobRecommendations;