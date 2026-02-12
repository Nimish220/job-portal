import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SideBar_Recr";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBell } from "react-icons/fa";
import { FiMenu, FiArrowLeft } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import AmazonLogo from "../../assets/images/AmazonLogo.png";
import ProfileImage from "../../assets/images/Profile_pics/1.jpg";

const UpdateCompanyProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    address: "",
    industryType: "",
    description: "",
  });

  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [panFile, setPanFile] = useState(null);
  const [existingPanFile, setExistingPanFile] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [userName, setUserName] = useState("");
  const isMobile = screenWidth < 1024;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await axiosInstance.get("recruiters/getProfile");
        const recruiter = res.data.recruiter;
        setExistingPanFile(recruiter.companyPanCardOrGstFile || "");
        setFormData({
          companyName: recruiter.companyName || "",
          website: recruiter.website || "",
          address: recruiter.address || "",
          industryType: recruiter.industryType || "",
          description: recruiter.description || "",
        });
        setUserName(recruiter.companyName || "");
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load company data");
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (logo) data.append("logo", logo);
      if (panFile) data.append("companyPanCardOrGstFile", panFile);

      const res = await axiosInstance.post("recruiters/update", data);
      if (res.data.success) {
        toast.success("Company updated successfully!");
        navigate("/recruiters/getProfile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F9D08] mb-4"></div>
          <p className="text-[#5F9D08] font-semibold animate-pulse">Loading Company Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#5F9D08] text-white p-4 flex justify-between items-center w-full shadow-md z-50 fixed top-0"
      >
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-2xl text-white cursor-pointer">
            <FiMenu />
          </button>
          <img src={AmazonLogo} alt="Logo" className="w-8 h-8" />
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/recruiters/notifications"><FaBell className="text-2xl w-8 h-8 hover:text-gray-300" /></Link>
          <Link to="/recruiters/jobs/active"><FaHome className="text-2xl w-8 h-8 hover:text-gray-300" /></Link>
          <Link to="/recruiters/getProfile" className="flex items-center gap-2 pl-4">
            <div className="rounded-full bg-gray-300 w-8 h-8 overflow-hidden shrink-0">
              <img src={ProfileImage} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="hidden sm:inline text-sm font-semibold truncate max-w-[150px]">{userName || "Loading..."}</span>
          </Link>
        </div>
      </motion.div>

      <div className="flex flex-1 mt-20">
        {!isMobile && (
          <div className="hidden lg:block fixed left-0 w-64 z-30 h-full">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}
        <AnimatePresence>
          {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />}
        </AnimatePresence>

        <div className="flex-1 flex justify-center items-center lg:ml-64 p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 shadow-2xl p-6 md:p-12 rounded-2xl w-full max-w-4xl transition duration-300 flex flex-col"
          >
            <div className="relative flex flex-row items-center justify-center mb-8 pb-4 border-b border-gray-100">
              <button onClick={() => navigate(-1)} className="absolute left-0 flex items-center gap-1 text-[#5F9D08] font-bold text-xs sm:text-sm hover:text-green-700 transition-all group">
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h2 className="text-base sm:text-2xl font-black text-[#5F9D08] text-center uppercase tracking-tighter">
                Update <span className="text-gray-800"> Company</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
              <Input label="Industry Type" name="industryType" value={formData.industryType} onChange={handleChange} />
              <Input label="Website" name="website" value={formData.website} onChange={handleChange} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PAN / GST Section */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">PAN / GST Document</label>
                  <div className="flex items-center w-full border border-gray-300 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#5F9D08]">
                    <input type="file" id="panFileInput" accept="application/pdf" onChange={(e) => setPanFile(e.target.files[0])} className="hidden" />
                    <label htmlFor="panFileInput" className="bg-green-50 text-[#5F9D08] px-4 py-3 font-bold text-xs uppercase cursor-pointer hover:bg-green-100 border-r border-gray-300 transition-colors shrink-0">Choose File</label>
                    <div className="px-4 text-sm truncate flex-1 flex items-center justify-between">
                      {panFile ? (
                        <>
                          <span className="text-gray-900 font-semibold truncate mr-2">{panFile.name}</span>
                          <button type="button" onClick={() => setPanFile(null)} className="text-red-500 font-bold text-lg">×</button>
                        </>
                      ) : existingPanFile ? (
                        <a href={existingPanFile} target="_blank" rel="noopener noreferrer" className="text-[#5F9D08] font-bold hover:underline">View Current Document</a>
                      ) : (
                        <span className="text-gray-400">No file chosen</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company Logo Section */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Company Logo</label>
                  <div className="flex items-center w-full border border-gray-300 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#5F9D08]">
                    <input type="file" id="logoInput" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="hidden" />
                    <label htmlFor="logoInput" className="bg-green-50 text-[#5F9D08] px-4 py-3 font-bold text-xs uppercase cursor-pointer hover:bg-green-100 border-r border-gray-300 transition-colors shrink-0">Choose Logo</label>
                    <div className="px-4 text-sm truncate flex-1 flex items-center justify-between">
                      {logo ? (
                        <>
                          <span className="text-gray-900 font-semibold truncate mr-2">{logo.name}</span>
                          <button type="button" onClick={() => setLogo(null)} className="text-red-500 font-bold text-lg">×</button>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">Upload new logo</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full md:w-1/2 mx-auto block bg-[#5F9D08] hover:bg-[#4a7a05] text-white py-3.5 rounded-xl font-black uppercase tracking-widest transition duration-200 shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#5F9D08] outline-none" />
  </div>
);

export default UpdateCompanyProfile;