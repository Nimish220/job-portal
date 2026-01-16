import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserNavbar from '../components/Header/UserNavbar';
import Sidebar from '../components/SideBar';
import { FiMenu } from 'react-icons/fi';
import NavSearchBar from '../components/Header/NavSearchBar';
import axios from 'axios';

const Resume = () => {
  const [pdfs, setPdfs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPdf, setNewPdf] = useState({ fileName: '', file: null });
  const [showDropdownIndex, setShowDropdownIndex] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // ✅ FIXED: Normalize Backend URL with /api prefix
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const API_BASE = `${base}/api/upload/resume`;

  // Helper to add download flag to Cloudinary URL for forced download
  const getDownloadUrl = (fileUrl) => {
    if (!fileUrl) return "";
    return fileUrl.replace("/upload/", "/upload/fl_attachment:");
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only PDF, DOC, or DOCX files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }

    setNewPdf({ ...newPdf, file });
  };

  // ✅ FIXED: Fetch resumes using standardized API_BASE
  const fetchResumes = async () => {
    try {
      const response = await axios.get(API_BASE, {
        withCredentials: true,
      });

      // Handle the data structure returned by your backend
      const rawResumes = response.data.resumes || [];
      const fetchedResumes = rawResumes.map(r => ({
        fileName: r.fileName,
        fileUrl: r.fileUrl,
        publicId: r.publicId,
      }));

      setPdfs(fetchedResumes);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // ✅ FIXED: Handle upload with standardized API_BASE
  const handleUpload = async () => {
    if (newPdf.file) {
      try {
        const formData = new FormData();
        formData.append("resume", newPdf.file);

        await axios.post(API_BASE, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true 
        });

        fetchResumes();
        setNewPdf({ fileName: '', file: null });
        toggleModal();
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload resume. Please try again.");
      }
    }
  };

  // ✅ FIXED: Handle delete with standardized API_BASE
  const handleDelete = async (index) => {
    const resumeToDelete = pdfs[index];
    const publicId = resumeToDelete.publicId;

    if (!publicId) {
      console.warn("No publicId found.");
      return;
    }

    try {
      await axios.delete(`${API_BASE}/${encodeURIComponent(publicId)}`, {
        withCredentials: true,
      });

      setPdfs(prev => prev.filter((_, i) => i !== index));
      setShowDropdownIndex(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete resume");
    }
  };

  const toggleDropdown = (index) => {
    setShowDropdownIndex(showDropdownIndex === index ? null : index);
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 768;

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <NavSearchBar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showHamburger={true}
      />
      <div className='flex flex-row min-h-screen'>
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

        <motion.div
          className="w-full mx-6 mt-6 p-4 lg:ml-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#5F9D08] pl-3">My Resume</h2>
              <p className="text-gray-600 mt-2 pl-4">Manage your resume documents for job applications</p>
            </motion.div>

            <motion.button
              onClick={toggleModal}
              className="flex items-center bg-gradient-to-r from-[#5F9D08] to-[#4A8B07] text-white px-5 py-2.5 rounded-lg mt-4 md:mt-0 font-medium shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Resume
            </motion.button>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {pdfs.length > 0 ? (
              pdfs.map((pdfItem, index) => (
                <motion.div
                  key={index}
                  className="relative p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center">
                    <div className="bg-green-50 p-3 rounded-lg mr-4 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5F9D08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-800 truncate">{pdfItem.fileName || "Resume File"}</p>
                      <p className="text-xs text-gray-500 mt-1">PDF Document</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <a
                      href={pdfItem.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5F9D08] text-sm font-medium hover:underline flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>

                    <button
                      onClick={() => toggleDropdown(index)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 5v.01M12 12v.01M12 19v.01" />
                      </svg>
                    </button>
                  </div>

                  <AnimatePresence>
                    {showDropdownIndex === index && (
                      <motion.div
                        className="absolute right-4 top-16 bg-white border rounded-lg shadow-lg z-10 py-1 w-32"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <a
                          href={getDownloadUrl(pdfItem.fileUrl)}
                          download={pdfItem.fileName}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleDelete(index)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600">No resumes uploaded yet.</p>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {showModal && (
              <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
                onClick={toggleModal}
              >
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Upload Resume</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#5F9D08]">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <p className="text-sm text-gray-600">
                        {newPdf.file ? newPdf.file.name : 'Select or drag and drop your file'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 2MB</p>
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={toggleModal} className="px-4 py-2 text-gray-700">Cancel</button>
                    <button
                      onClick={handleUpload}
                      disabled={!newPdf.file}
                      className="bg-[#5F9D08] text-white px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                      Upload
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Resume;