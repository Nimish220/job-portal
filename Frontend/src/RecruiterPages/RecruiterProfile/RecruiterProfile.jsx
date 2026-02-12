import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AmazonLogo from "../../assets/images/AmazonLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/SideBar_Recr";
import Notifications from "../../assets/images/notifications00.png";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { FaHome, FaKey, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import  CompanyProfileForm from "./CompanyProfileForm";
const RecruiterProfile = () => {
  const [recruiterPhoto, setRecruiterPhoto] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const isMobile = screenWidth < 768;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('recruiters/getProfile');
      const recruiter = res.data.recruiter;

      setUserName(recruiter.recruiterName || "");
      setEmail(recruiter.email || "");
      setLinkedin(recruiter.linkedin || "");
      setDesignation(recruiter.jobTitle || "Recruiter");
      setPhone(recruiter.phone || "");
      setCompanyName(recruiter.companyName || "");
      setRecruiterPhoto(recruiter.profilePhoto || "");
      setLogoUrl(recruiter.logo || "");

      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch Recruiter Details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F9D08] mb-4"></div>
          <p className="text-[#5F9D08] font-semibold animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 min-h-screen flex flex-col"
    >
      {/* Navbar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#5F9D08] text-white p-4 flex justify-between items-center w-full shadow-md z-50 fixed top-0"
      >
        <div className="flex items-center space-x-4">
          <Link to="/recruiters/jobs/active">
            <img src={AmazonLogo} alt="Logo" className="w-8 h-8" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/recruiters/notifications">
            <img src={Notifications} alt="Notifications" className="w-8 h-8" />
          </Link>
          <Link to="/recruiters/jobs/active">
            <FaHome className="text-2xl w-8 h-8 cursor-pointer hover:text-gray-200" />
          </Link>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row flex-1 mt-16">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden w-full bg-white border-b border-gray-200 p-4 sticky top-16 z-40 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-3xl text-[#5F9D08] cursor-pointer"
          >
            <FiMenu />
          </button>
        </div>

        {/* Sidebar Logic */}
        {!isMobile && (
          <div className="hidden lg:block fixed top-20 left-0 z-30">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              isMobile={true}
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 w-full lg:ml-64 px-4 sm:px-8 py-6 md:py-10 overflow-x-hidden">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 w-full max-w-6xl mx-auto">

            
            {/* Company Banner Section - Cleaned up */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-2/3 bg-white rounded-2xl shadow-xl p-9 md:p-11 border border-gray-100 h-full flex flex-col"
            >
              <div className="flex items-center border-b border-gray-100 pb-4">
                <img
                  src={logoUrl || AmazonLogo}
                  alt="Company Logo"
                  className="w-16 h-16 mr-4 rounded-full border-2 border-green-100 object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 truncate">
                    {companyName || "Company Name"}
                  </h2>
                </div>
              </div>
              <CompanyProfileForm />
            </motion.div>

            {/* Recruiter Identity Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className=" flex flex-col w-full lg:w-1/3 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 h-full"
            >
              {/* Profile Header */}
              <div className="relative bg-gradient-to-r from-[#5F9D08] to-green-500 text-white py-10 px-6 text-center">
                <motion.img
                  src={recruiterPhoto || AmazonLogo}
                  alt="Recruiter"
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                />
                <h3 className="text-2xl font-bold mt-4 tracking-tight">
                  {userName || "Recruiter Name"}
                </h3>
                <p className="text-sm font-medium opacity-90">
                  {designation || "Recruiter Role"}
                </p>
              </div>

              {/* Recruiter Details List - Raw Detail Version */}
              <div className="p-6 space-y-4 text-gray-800">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                  <span className="text-sm font-semibold truncate">{email}</span>
                </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LinkedIn</span>
                    {linkedin
                      ? <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate">{linkedin}</a>
                      : <span className="text-sm font-semibold text-gray-500">Not Provided</span>}
                  </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                  <span className="text-sm font-semibold">{phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</span>
                  <span className="text-sm font-semibold">{companyName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 px-6 pb-8 mt-auto">
                <AnimatedButton to="/recruiters/change-password" label="Change Password" />
                <AnimatedButton to="/recruiters/updateRecruiter" label="Update Recruiter" />
                <AnimatedButton to="/recruiters/logout" label="Sign Out" danger />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedButton = ({ to, label, danger }) => {
  const icons = {
    "Change Password": <FaKey />,
    "Update Recruiter": <FaUserEdit />,
    "Sign Out": <FaSignOutAlt />,
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        className={`flex items-center justify-center gap-3 w-full py-3 rounded-xl font-bold text-sm transition-all ${
          danger
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-[#5F9D08] hover:bg-green-700 text-white shadow-md hover:shadow-lg"
        }`}
      >
        {icons[label]} {label}
      </Link>
    </motion.div>
  );
};

export default RecruiterProfile;