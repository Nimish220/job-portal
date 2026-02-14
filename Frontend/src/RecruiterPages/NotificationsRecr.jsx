import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiTrash2, FiCheckSquare, FiRefreshCw, FiMenu } from "react-icons/fi";
import { FaBell,FaHome, FaUserAlt } from "react-icons/fa"; 
import AmazonLogo from '../assets/images/AmazonLogo.png';
import Sidebar from "../components/SideBar_Recr";
import { Link } from "react-router-dom";
import ProfileImage from '../assets/images/Profile_pics/1.jpg';
const NotificationsRecr = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userName, setUserName] = useState("");

  const isMobile = windowWidth < 768;

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

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('recruiters/notifications');
      const rawData = res.data.notifications || [];
      const sortedData = rawData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setNotifications(sortedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`recruiters/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch { toast.error("Failed to mark as read"); }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch('recruiters/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch { toast.error("Failed to mark all as read"); }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`recruiters/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch { toast.error("Failed to delete notification"); }
  };

  const deleteAll = async () => {
    try {
      await axiosInstance.delete('recruiters/notifications/delete-all');
      setNotifications([]);
      toast.success("All notifications deleted");
    } catch { toast.error("Failed to delete all"); }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { fetchNotifications(); }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      {/* 1. Navbar Logic - Optimized for both screens */}
      <div className="bg-[#5F9D08] text-white p-4 flex justify-between items-center w-full fixed top-0 z-50 h-16 shadow-md">
        
        {/* Left Section: Hamburger and Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-2xl flex items-center p-1 hover:opacity-80 lg:hidden"
          >
            <FiMenu />
          </button>
          <span className="font-bold text-xl tracking-tight">logo</span>
        </div>

        {/* Right Section: Exact Solid White Icons Match */}
        <div className="flex items-center gap-6 pr-2">
          {/* Bell Icon  */}
            <Link to="/recruiters/notifications">
              <FaBell className="text-2xl w-8 h-8  cursor-pointer hover:text-gray-300" />
            </Link>
            <Link to="/recruiters/jobs/active">
              <FaHome className="text-2xl w-8 h-8  cursor-pointer hover:text-gray-300" />
            </Link>

          {/* User Profile Icon */}
          <Link to="/recruiters/getProfile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="rounded-full bg-gray-300 w-8 h-8 overflow-hidden border border-white">
              <img src={ProfileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
              <span className="hidden sm:inline font-bold text-sm truncate max-w-[150px]">
              {userName || "Recruiter"}
              </span>
                    </Link>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* 2. Sidebar: Fixed on Desktop */}
        {!isMobile && (
          <div className="hidden lg:block fixed top-20 left-0 z-30 h-[calc(100vh-64px)] w-64">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile />
          )}
        </AnimatePresence>

        {/* 3. Content Area: Responsible for Sidebar offset */}
        <div
          className={`flex-1 pt-20 pb-10 transition-all duration-300 px-4 md:px-8 ${
            !isMobile ? "lg:pl-72" : ""
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-10 border border-gray-100">
              
              {/* Notifications Header */}
              <div className="border-b pb-4 mb-6 border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Notifications</h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <button 
                    onClick={fetchNotifications} 
                    className="flex items-center gap-1 text-xs sm:text-sm text-[#5F9D08] font-semibold hover:bg-green-50 px-2 py-1 rounded-md transition"
                  >
                    <motion.div
                      animate={loading ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: "linear" }}
                    >
                      <FiRefreshCw />
                    </motion.div>
                    Refresh
                  </button>

                  {notifications.length > 0 && (
                    <>
                      <button onClick={markAllAsRead} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        <FiCheckSquare /> Mark all read
                      </button>
                      <button onClick={deleteAll} className="flex items-center gap-1 text-sm text-red-600 hover:underline">
                        <FiTrash2 /> Delete all
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Notification Items */}
              {loading ? (
                <div className="p-12 text-center text-gray-400 font-medium">Loading your updates...</div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      className={`p-4 flex items-start justify-between transition-colors duration-200 rounded-lg mb-1 ${
                        notification.isRead ? "bg-white" : "bg-green-50/30"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-lg ${notification.isRead ? "bg-gray-200 text-gray-500" : "bg-[#5F9D08] text-white shadow-sm"}`}>
                          {notification.type === "job_posted" && "💼"}
                          {/*notification.type === "application_status" && "✅"*/}
                          {notification.type === "internship_posted" && "📢"}
                          {notification.type === "job_applied" && "📝"}
                          {notification.type === "new_application" && "👨‍💻"}
                          {notification.type === "job_status" && "📢"}
                          {!["job_applied", "job_posted", "application_status", "internship_posted", "new_application", "job_status"].includes(notification.type) && "🔔"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base break-words leading-tight ${
                            notification.isRead ? "text-gray-500" : "text-gray-800 font-semibold"
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">{notification.timeAgo}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                        {!notification.isRead && (
                          <button onClick={() => markAsRead(notification._id)} className="p-2 text-green-600 hover:bg-green-100 rounded-full transition">
                            <FiCheckCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => deleteNotification(notification._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition">
                          <FiXCircle size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 italic font-medium">📭 No notifications yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsRecr;