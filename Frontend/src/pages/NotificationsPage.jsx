import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiTrash2, FiCheckSquare } from "react-icons/fi";

import NavSearchBar from "../components/Header/NavSearchBar";
import Sidebar from "../components/SideBar";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const isMobile = windowWidth < 768;

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backend_url}/api/users/notifications`, {
        withCredentials: true,
      });
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${backend_url}/api/users/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  // ✅ Delete single notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${backend_url}/api/users/notifications/${id}`, {
        withCredentials: true,
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  // ✅ Bulk: Mark all as read
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.isRead)
          .map((n) =>
            axios.patch(`${backend_url}/api/users/notifications/${n._id}/read`, {}, { withCredentials: true })
          )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  // ✅ Bulk: Delete all
  const deleteAll = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          axios.delete(`${backend_url}/api/users/notifications/${n._id}`, { withCredentials: true })
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
          <div className="bg-white rounded-lg shadow-md p-6 md:p-12">
            {/* Header */}
            <div className="border-b pb-4 mb-4 border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
              <div className="flex space-x-4">
                <button onClick={fetchNotifications} className="text-sm text-[#5F9D08] bg-green-200 rounded-full cursor-pointer hover:underline">
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
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          notification.isRead ? "bg-gray-300" : "bg-[#5F9D08] text-white"
                        }`}
                      >
                        {notification.type === "job_applied" && "📝"}
                        {notification.type === "job_posted" && "💼"}
                        {notification.type === "application_status" && "✅"}
                        {notification.type === "internship_posted" && "📢"}
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
              <div className="p-8 text-center text-gray-500">
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
