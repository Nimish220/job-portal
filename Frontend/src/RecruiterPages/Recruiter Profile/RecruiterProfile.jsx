import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CompanyProfileForm from "./CompanyProfileForm";
import AmazonLogo from "../../assets/images/AmazonLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/SideBar_Recr";
import Notifications from "../../assets/images/notifications00.png";
import { toast } from "react-toastify";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { FaKey, FaUserEdit, FaSignOutAlt } from "react-icons/fa";

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
  const backend_url = import.meta.env.VITE_BACKEND_URL

  const isMobile = screenWidth < 768;

  // Handle resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch recruiter profile
  const fetchProfile = async () => {
  try {
    const res = await axios.get(
      `${backend_url}/api/recruiters/getProfile`,
      { withCredentials: true }
    );

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
    setLogoUrl(recruiter.logo_url || "");

    setLoading(false);
  } catch (error) {
    toast.error("Failed to fetch Recruiter Details");
    console.error("Error fetching recruiter:", error);
    setLoading(false);
  }
};

// ✅ Call fetchProfile once when component mounts
useEffect(() => {
  fetchProfile();
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
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
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#5F9D08] text-white p-4 flex flex-wrap justify-between items-center w-full shadow-md"
      >
        {/* Left Section - Home Button */}
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <Link to="/recruiters/jobs/active">
            <img src={AmazonLogo} alt="Amazon Logo" className="w-8 h-8" />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <Link to="/recruiters/notifications">
            <img
              src={Notifications}
              alt="Notifications Icon"
              className="w-8 h-8"
            />
          </Link>
          <Link to="/recruiters/jobs/active">
            <FaHome className="text-2xl w-8 h-8 cursor-pointer hover:text-gray-300" />
          </Link>
        </div>
      </motion.div>

      <div className="flex flex-1">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-3xl text-[#5F9D08] cursor-pointer"
          >
            <FiMenu />
          </button>
        </div>

        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <div className="hidden lg:block fixed top-20 left-0 z-30">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}

        {/* Sidebar (Mobile) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              isMobile={true}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-4 mt-6 lg:ml-64">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Company Info */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-2/3 bg-white rounded-md shadow-md p-6"
            >
              <div className="flex items-center mb-6">
                <img
                  src={logoUrl || AmazonLogo}
                  alt="Company Logo"
                  className="w-12 h-12 mr-4 rounded-full border"
                />
                <div>
                  <h2 className="text-xl font-bold">
                    {companyName || "Company Name"}
                  </h2>
                  {/* {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm hover:underline"
                    >
                      {website}
                    </a>
                  )} */}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <CompanyProfileForm onProfileUpdated={fetchProfile} />
            </motion.div>

            
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden"
>
  {/* Profile Header */}
  <div className="relative bg-gradient-to-r from-[#5F9D08] to-green-500 text-white py-8 px-6 text-center">
    <motion.img
      src={logoUrl || AmazonLogo}
      alt="Recruiter Avatar"
      className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-md object-cover"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
    />
    <h3 className="text-2xl font-semibold mt-3">{userName || "Recruiter Name"}</h3>
    <p className="text-sm opacity-90">{designation || "Recruiter Role"}</p>
  </div>

  {/* Profile Info */}
  <div className="p-6 space-y-3 text-gray-800 text-sm">
    {email && <InfoRow label="Email" value={email} />}
    {linkedin && <InfoRow label="LinkedIn" value={linkedin} isLink />}
    {phone && <InfoRow label="Phone" value={phone} />}
    {companyName && <InfoRow label="Company" value={companyName} />}
    {website && <InfoRow label="Website" value={website} isLink />}
    {address && <InfoRow label="Address" value={address} />}
    {industryType && <InfoRow label="Industry" value={industryType} />}
  </div>

  {/* Divider */}
  <div className="border-t border-gray-200 my-4"></div>

  {/* Action Buttons */}
  <div className="flex flex-col gap-3 px-6 pb-6">
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

const InfoRow = ({ label, value, isLink }) => (
  <div className="flex">
    <span className="font-medium w-32">{label}:</span>
    {isLink ? (
      <a href={value} className="text-blue-500 hover:underline truncate">
        {value}
      </a>
    ) : (
      <span className="truncate">{value}</span>
    )}
  </div>
);



const AnimatedButton = ({ to, label, danger }) => {
  const icons = {
    "Change Password": <FaKey />,
    "Update Recruiter": <FaUserEdit />,
    "Sign Out": <FaSignOutAlt />,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Link
        to={to}
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
          danger
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-[#5F9D08] hover:bg-green-600 text-white"
        }`}
      >
        {icons[label]} {label}
      </Link>
    </motion.div>
  );
};


export default RecruiterProfile;
