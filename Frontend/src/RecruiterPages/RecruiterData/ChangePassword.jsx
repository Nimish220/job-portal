import React, { useState,useEffect } from 'react';
import Sidebar from "../../components/SideBar_Recr"; 
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBell } from "react-icons/fa";
import { FiMenu,FiArrowLeft } from "react-icons/fi";
import { useNavigate,Link } from 'react-router-dom';
import { axiosInstance } from '../../utils/axiosInstance'; 
import { Eye, EyeOff } from 'lucide-react'; 
import AmazonLogo from '../../assets/images/AmazonLogo.png';
import ProfileImage from '../../assets/images/Profile_pics/1.jpg';
const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [userName, setUserName] = useState('');
  const isMobile = screenWidth < 768;

    // 1. Handle Window Resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Fetch Profile Name
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('recruiters/getProfile');
        setUserName(res.data.recruiter.companyName);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const response = await axiosInstance.post('/recruiters/change-password', {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setSuccess('Password changed successfully.');
        setTimeout(() => navigate('/recruiter-dashboard'), 2000);
      } else {
        setError(response.data.message || 'Failed to change password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error.');
    }
  };

 return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#5F9D08] text-white p-4 flex justify-between items-center w-full shadow-md z-50 fixed top-0"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-2xl text-white cursor-pointer"
          >
            <FiMenu />
          </button>
          <Link to="/recruiters/jobs/active">
            <img src={AmazonLogo} alt="Logo" className="w-8 h-8" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/recruiters/notifications"><FaBell className="text-2xl w-8 h-8 cursor-pointer hover:text-gray-300" /></Link>
          <Link to="/recruiters/jobs/active"><FaHome className="text-2xl w-8 h-8 cursor-pointer hover:text-gray-300" /></Link>
          <Link to="/recruiters/getProfile" className="flex items-center gap-2 pl-4">
            <div className="rounded-full bg-gray-300 w-8 h-8 overflow-hidden shrink-0">
              <img src={ProfileImage} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="hidden sm:inline text-sm font-semibold truncate max-w-[150px]">
              {userName || 'Loading...'}
            </span>
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
          {isSidebarOpen && (
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 flex justify-center items-center lg:ml-64 p-4 sm:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 shadow-2xl p-6 md:p-12 rounded-2xl w-full max-w-3xl transition duration-300 h-fit"
          >
            {/* Header with Back Button inside the box */}
            <div className="relative flex flex-row items-center justify-center mb-8 pb-4 border-b border-gray-100">
              
              {/* Back Button - Absolute pins it to the left without breaking the line */}
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 z-10 flex items-center gap-1 text-[#5F9D08] font-bold text-xs sm:text-sm hover:text-green-700 transition-all group"
              >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>

              {/* Centered Title - pl-14 shifts text right on mobile only, sm:pl-0 resets for laptop */}
              <h2 className="pl-14 sm:pl-0 text-base sm:text-2xl font-black text-[#5F9D08] text-center uppercase tracking-tighter leading-tight">
                Update <span className="text-gray-800">Password</span>
              </h2>
            </div>
            {error && <p className="text-red-500 mb-4 text-center font-medium text-sm bg-red-50 py-2 rounded-lg">{error}</p>}
            {success && <p className="text-[#5F9D08] mb-4 text-center font-medium text-sm bg-green-50 py-2 rounded-lg">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vertical Stack: All fields will have exactly the same length */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-[#5F9D08] outline-none"
                    />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 text-gray-400" onClick={() => setShowCurrent(!showCurrent)}>
                      {showCurrent ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-[#5F9D08] outline-none"
                    />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 text-gray-400" onClick={() => setShowNew(!showNew)}>
                      {showNew ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-[#5F9D08] outline-none"
                    />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 text-gray-400" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-1/2 mx-auto block bg-[#5F9D08] hover:bg-[#4a7a05] text-white py-3.5 rounded-xl font-black uppercase tracking-widest transition duration-200 shadow-md active:scale-95"
                >
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
