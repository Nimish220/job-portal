import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import Sidebar from "../components/SideBar_Recr";
import AmazonLogo from "../assets/images/AmazonLogo.png";
import Notifications from "../assets/images/notifications00.png";

const UpdateRecruiter = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    companyName: "",
  });
  const [file, setFile] = useState(null);
  
  // ✅ 1. Add state for UI errors
  const [uiError, setUiError] = useState(""); 
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth < 768;
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const res = await axios.get(
          `${backend_url}/api/recruiters/getProfile`,
          { withCredentials: true }
        );
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
  }, [backend_url]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // ✅ Clear error when user types
    setUiError(""); 
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.companyName) {
      const msg = "Please fill all required fields";
      setUiError(msg); // ✅ Show on screen
      return toast.error(msg);
    }

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("companyName", formData.companyName);
      if (file) data.append("companyPanCardOrGstFile", file);

      const res = await axios.post(
        `${backend_url}/api/recruiters/update`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success("Recruiter updated successfully!");
        navigate("/recruiters/getProfile");
      }
    } catch (error) {
      // ✅ Capture backend error message
      const errMsg = error.response?.data?.message || "Update failed";
      setUiError(errMsg); // ✅ Show on screen
      toast.error(errMsg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 min-h-screen flex flex-col"
    >
      <div className="bg-[#5F9D08] text-white p-4 flex justify-between items-center w-full shadow-md">
        <div className="flex items-center space-x-4">
          <Link to="/recruiters/jobs/active">
            <img src={AmazonLogo} alt="Amazon Logo" className="w-8 h-8" />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/recruiters/notifications">
            <img src={Notifications} alt="Notifications" className="w-8 h-8" />
          </Link>
          <Link to="/recruiters/jobs/active">
            <FaHome className="text-2xl cursor-pointer hover:text-gray-300" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="lg:hidden p-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-3xl text-[#5F9D08]">
            <FiMenu />
          </button>
        </div>

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

        <div className="flex-1 p-6 lg:ml-64">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-[#5F9D08]">
              Update Recruiter Profile
            </h2>

            {/* ✅ 2. Render the Error Box on screen */}
            {uiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-6 text-center text-sm font-medium">
                {uiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Recruiter Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                  <InputField label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Company Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Company Name" type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
                  <div>
                    <label className="block font-medium mb-1 text-sm text-gray-700">Company PAN/GST Document</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5F9D08] focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </section>

              <div className="text-center">
                <button
                  type="submit"
                  className="w-full md:w-1/2 py-3 text-white font-semibold rounded-md shadow-md transition-transform active:scale-95"
                  style={{ backgroundColor: "#5F9D08" }}
                >
                  Update Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </motion.div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block font-medium mb-1 text-sm text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5F9D08] focus:outline-none text-sm"
    />
  </div>
);

export default UpdateRecruiter;