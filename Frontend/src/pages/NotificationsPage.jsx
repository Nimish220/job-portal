import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiTrash2, FiCheckSquare,FiRefreshCw } from "react-icons/fi";

import NavSearchBar from "../components/Header/NavSearchBar";
import Sidebar from "../components/SideBar";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const isMobile = windowWidth < 768;

  //  Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/users/notifications');
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  //  Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/users/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  //  Delete single notification
  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/users/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  //  Bulk: Mark all as read
  const markAllAsRead = async () => {
  try {
    // Logic: Send ONE request instead of a map/Promise.all
    await axiosInstance.patch('/users/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  } catch {
    toast.error("Failed to mark all as read");
  }
};

  //  Bulk: Delete all
 const deleteAll = async () => {
  try {
    await axiosInstance.delete('/users/notifications/delete-all');
    setNotifications([]);
    toast.success("All notifications deleted");
  } catch {
    toast.error("Failed to delete all notifications");
  }
};
  // Resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row relative">
      <NavSearchBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showHamburger />

      {!isMobile && (
        <div className="hidden lg:block fixed top-20 left-0 z-30">
          <Sidebar isOpen={true} isMobile={false} />
        </div>
      )}

      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile />
        )}
      </AnimatePresence>

      <div
        className={`flex-1 pt-24 transition-all duration-300 px-4 md:px-8 ${
          !isMobile ? "lg:pl-64" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-10">
            {/* Header */}
              <div className="border-b pb-4 mb-4 border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Notifications</h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  {/* Updated Refresh Button with Icon */}
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

            {/* Content */}
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    className={`p-4 flex items-start justify-between transition-colors duration-200 ${
                      notification.isRead ? "bg-gray-50" : "bg-white"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-lg${
                          notification.isRead ? "bg-gray-300" : "bg-[#5F9D08] text-white"
                        }`}
                      >
                        {notification.type === "job_applied" && "📝"}
                        {notification.type === "job_posted" && "💼"}
                        {notification.type === "application_status" && "✅"}
                        {notification.type === "internship_posted" && "📢"}
                        {notification.type === "general" && "🔔"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm sm:text-base break-words leading-tight ${
                            notification.isRead ? "text-gray-500" : "text-gray-800 font-semibold"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">{notification.timeAgo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                          title="Mark as Read"
                        >
                          <FiCheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-full transition"
                        title="Delete"
                      >
                        <FiXCircle size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500 italic">
                🎉 No notifications yet. Stay tuned!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
