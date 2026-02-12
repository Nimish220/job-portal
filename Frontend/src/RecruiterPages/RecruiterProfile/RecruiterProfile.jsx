import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CompanyProfileForm from "./CompanyProfileForm";
import AmazonLogo from "../../assets/images/AmazonLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/SideBar_Recr";
import Notifications from "../../assets/images/notifications00.png";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { FaHome, FaKey, FaUserEdit, FaSignOutAlt } from "react-icons/fa";

const RecruiterProfile = () => {
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const isMobile = screenWidth < 768;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch recruiter profile from backend
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('recruiters/getProfile');
      const recruiter = res.data.recruiter;

      setUserName(recruiter.name || "");
      setEmail(recruiter.email || "");
      setLinkedin(recruiter.linkedin || "");
      setDesignation(recruiter.designation || "");
      setPhone(recruiter.phone || "");
      setCompanyName(recruiter.companyName || "");
      setWebsite(recruiter.website || "");
      setAddress(recruiter.address || "");
      setIndustryType(recruiter.industry_type || "");
      setLogoUrl(recruiter.logo || "");

      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch Recruiter Details");
      console.error("Error fetching recruiter:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Loading Profile...
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
      {/* Navbar - Fixed at top */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
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

      <div className="flex flex-1 mt-16">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden p-4 fixed top-16 left-0 z-40">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-3xl text-[#5F9D08] cursor-pointer bg-white rounded-full p-1 shadow-md"
          >
            <FiMenu />
          </button>
        </div>

        {/* Desktop Sidebar (Fixed) */}
        {!isMobile && (
          <div className="hidden lg:block fixed top-20 left-0 z-30">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}

        {/* Mobile Sidebar (Drawer) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              isMobile={true}
            />
          )}
        </AnimatePresence>

        {/* Main Content Area - Responsive Centering */}
        <div className="flex-1 w-full mt-10 lg:ml-64 px-4 sm:px-8 pb-10 overflow-x-hidden">
          {/* items-center centers everything on mobile, lg:items-start aligns left on desktop */}
          <div className="flex flex-col items-center lg:items-start lg:flex-row gap-8 w-full max-w-6xl mx-auto">
            
            {/* Company Info Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-2/3 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
            >
              <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                <img
                  src={logoUrl || AmazonLogo}
                  alt="Company Logo"
                  className="w-16 h-16 mr-4 rounded-full border-2 border-green-100 object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 truncate">
                    {companyName || "Company Name"}
                  </h2>
                  <p className="text-sm text-[#5F9D08] font-bold tracking-wide uppercase">
                    {industryType || "Industry Type"}
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-4 text-gray-700">About Our Company</h3>
              <CompanyProfileForm onProfileUpdated={fetchProfile} />
            </motion.div>

            {/* Recruiter Identity Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full lg:w-1/3 bg-white rounded-2xl shadow-2xl overflow-hidden h-fit lg:sticky lg:top-24 border border-gray-100"
            >
              {/* Profile Header Background */}
              <div className="relative bg-gradient-to-r from-[#5F9D08] to-green-500 text-white py-10 px-6 text-center">
                <motion.img
                  src={logoUrl || AmazonLogo}
                  alt="Recruiter"
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                />
                <h3 className="text-2xl font-bold mt-4 tracking-tight">
                  {userName || "Recruiter Name"}
                </h3>
                <p className="text-sm font-medium opacity-90">
                  {designation || "Recruiter Role"}
                </p>
              </div>

              {/* Recruiter Details List */}
              <div className="p-6 space-y-4 text-gray-800">
                <InfoRow label="Email" value={email} />
                <InfoRow label="LinkedIn" value={linkedin} isLink />
                <InfoRow label="Phone" value={phone} />
                <InfoRow label="Company" value={companyName} />
                <InfoRow label="Website" value={website} isLink />
                <InfoRow label="Address" value={address} />
              </div>

              <div className="border-t border-gray-100 my-2"></div>

              {/* Sidebar-style Action Buttons */}
              <div className="flex flex-col gap-3 px-6 pb-8">
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

// Internal Row Component for Recruiter Card
const InfoRow = ({ label, value, isLink }) => (
  <div className="flex flex-col sm:flex-row sm:items-center">
    <span className="font-bold text-gray-400 text-[10px] uppercase tracking-widest w-full sm:w-24 shrink-0">
      {label}:
    </span>
    {isLink && value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold hover:underline truncate text-sm flex-1">
        {value}
      </a>
    ) : (
      <span className="truncate text-sm font-semibold text-gray-700 flex-1">
        {value || "Not Provided"}
      </span>
    )}
  </div>
);

// Sidebar-style Animated Button
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