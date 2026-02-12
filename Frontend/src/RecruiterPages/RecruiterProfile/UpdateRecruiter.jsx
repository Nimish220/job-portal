import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import Sidebar from "../../components/SideBar_Recr";
import AmazonLogo from "../../assets/images/AmazonLogo.png";
import Notifications from "../../assets/images/notifications00.png";

const UpdateRecruiter = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    companyName: "",
  });
  const [file, setFile] = useState(null);
  const [uiError, setUiError] = useState(""); 
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  // Set isMobile threshold based on your established 1024px break point
  const isMobile = screenWidth < 1024;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const res = await axiosInstance.get("recruiters/getProfile");
        const recruiter = res.data.recruiter;
        setFormData({
          email: recruiter.email || "",
          phone: recruiter.phone || "",
          companyName: recruiter.companyName || "",
        });
      } catch (error) {
        toast.error("Failed to load recruiter details");
      }
    };
    fetchRecruiter();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setUiError(""); 
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Strict PDF Check logic
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setUiError("Only PDF files are allowed.");
      setFile(null);
      e.target.value = ""; 
      return toast.error("Please select a PDF document.");
    }

    setFile(selectedFile);
    setUiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.companyName) {
      const msg = "Please fill all required fields";
      setUiError(msg);
      return toast.error(msg);
    }

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("companyName", formData.companyName);
      if (file) data.append("companyPanCardOrGstFile", file);

      const res = await axiosInstance.post("recruiters/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Recruiter updated successfully!");
        setTimeout(() => {
          navigate("/recruiters/getProfile");
        }, 2000); 
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Update failed";
      setUiError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-100 min-h-screen flex flex-col"
    >
      {/* Navbar - Fixed at top */}
      <div className="bg-[#5F9D08] text-white px-4 py-4 flex justify-between items-center shadow-md fixed top-0 w-full z-50">
        <Link to="/recruiters/jobs/active">
          <img src={AmazonLogo} alt="Logo" className="w-8 h-8" />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/recruiters/notifications">
            <img src={Notifications} alt="Notif" className="w-7 h-7" />
          </Link>
          <Link to="/recruiters/jobs/active">
            <FaHome className="text-xl hover:text-gray-200" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 pt-20">
        {/* Desktop Sidebar - Fixed Width 64 (256px) */}
        {!isMobile && (
          <div className="hidden lg:block fixed left-0 top-20 h-[calc(100%-5rem)] w-64 z-30">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}

        {/* Mobile Sidebar - Drawer style */}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar
              isOpen={true}
              isMobile={true}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Page Content - Margins handle the fixed sidebar on desktop */}
        <div className="flex-1 w-full lg:ml-64">
          {/* Hamburger Menu Row (Mobile Only) */}
          <div className="lg:hidden px-4 pt-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-3xl text-[#5F9D08] cursor-pointer"
            >
              <FiMenu />
            </button>
          </div>

          {/* Form Container - Centered under the hamburger menu on mobile */}
          <div className="px-4 sm:px-6 md:px-10 py-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-3xl border border-gray-100"
            >

              <h2 className="text-2xl font-bold mb-6 text-center text-[#5F9D08]">
                Update Recruiter Profile
              </h2>

              {uiError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-6 text-center text-sm font-medium">
                  {uiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Contact Phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Legal Company Name"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-semibold text-gray-500">
                      Company PAN/GST Document <span className="text-red-500">(PDF ONLY)</span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5F9D08] text-sm bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full md:w-1/2 mx-auto block py-3.5 bg-[#5F9D08] text-white font-bold rounded-xl shadow-md hover:bg-green-700 transition-all text-sm uppercase tracking-widest"
                  >
                    Confirm Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </motion.div>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <input
      {...props}
      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5F9D08] focus:outline-none text-sm font-semibold text-gray-800"
    />
  </div>
);

export default UpdateRecruiter;