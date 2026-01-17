import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/SideBar_Recr";
import axios from "axios";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiCheckCircle, FiXCircle, FiTrash2, FiCheckSquare, FiRefreshCw} from "react-icons/fi";
import { FaHome } from "react-icons/fa";

import ProfileImage from "../assets/images/Profile_pics/1.jpg";

export default function NotificationsRecr() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [userName, setUserName] = useState("");

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const isMobile = screenWidth < 768;

  //  Fetch recruiter profile (for top nav)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/recruiters/getProfile`, {
          withCredentials: true,
        });
        setUserName(res.data.recruiter.companyName);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [backend_url]);

  //  Fetch recruiter notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backend_url}/api/recruiters/notifications`, {
        withCredentials: true,
      });
      setNotifications(res.data.notifications || []);
    } catch (error) {
      toast.error("Failed to load notifications");
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(`${backend_url}/api/recruiters/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  //  Delete single notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${backend_url}/api/recruiters/notifications/${id}`, {
        withCredentials: true,
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  //  Bulk: Mark all as read
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.isRead)
          .map((n) =>
            axios.patch(`${backend_url}/api/recruiters/notifications/${n._id}/read`, {}, { withCredentials: true })
          )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  //  Bulk: Delete all
  const deleteAll = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          axios.delete(`${backend_url}/api/recruiters/notifications/${n._id}`, { withCredentials: true })
        )
      );
      setNotifications([]);
      toast.success("All notifications deleted");
    } catch {
      toast.error("Failed to delete all");
    }
  };

  // Resize listener
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#5F9D08] text-white p-4 flex justify-between items-center w-full"
      >
        <div className="flex items-center space-x-4">
          <Link to="/recruiters/jobs/active">
            <FaHome className="text-2xl w-8 h-8 cursor-pointer hover:text-gray-300" />
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/recruiters/getProfile" className="flex flex-row items-center gap-2">
            <div className="rounded-full bg-gray-300 w-8 h-8">
              <img src={ProfileImage} alt="Profile" className="w-full h-full rounded-full" />
            </div>
            <span className="text-sm sm:text-base">{userName || "Loading..."}</span>
          </Link>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row relative">
        {/* Mobile Hamburger */}
        <div className="lg:hidden p-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-3xl text-[#5F9D08] cursor-pointer">
            <FiMenu />
          </button>
        </div>

        {/* Sidebar for large screens */}
        {!isMobile && (
          <div className="hidden lg:block fixed top-20 left-0 z-30">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}

        {/* Sidebar for mobile (animated) */}
        <AnimatePresence>
          {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />}
        </AnimatePresence>

        {/* Notifications Content */}
        <main className={`flex-1 px-4 md:px-6 mt-2 ${!isMobile ? "lg:pl-64" : ""}`}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-12">
              {/* Header */}
                <div className="border-b pb-4 mb-4 border-gray-200 flex justify-between items-center">
                  <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
                  <div className="flex space-x-4">
                    {/*  Animated Refresh Button */}
                    <button 
                      onClick={fetchNotifications} 
                      className="flex items-center gap-1 text-sm text-[#5F9D08] hover:underline cursor-pointer"
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
                        <button
                          onClick={markAllAsRead}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <FiCheckSquare /> Mark all read
                        </button>
                        <button
                          onClick={deleteAll}
                          className="flex items-center gap-1 text-sm text-red-600 hover:underline"
                        >
                          <FiTrash2 /> Delete all
                        </button>
                      </>
                    )}
                  </div>
                </div>

              {/* Notifications List */}
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading notifications...</div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      className={`p-4 flex items-start justify-between ${
                        notification.isRead ? "bg-gray-50" : "bg-white"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            notification.isRead ? "bg-gray-300" : "bg-[#5F9D08] text-white"
                          }`}
                        >
                          {notification.type === "new_application" && "👨‍💻"}
                          {notification.type === "job_status" && "📢"}
                          {notification.type === "general" && "🔔"}
                        </div>
                        <div>
                          <p
                            className={`text-sm sm:text-base ${
                              notification.isRead ? "text-gray-500" : "text-gray-800 font-medium"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">{notification.timeAgo}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-green-600 hover:text-green-800"
                            title="Mark as Read"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FiXCircle size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">📭 No notifications yet.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
