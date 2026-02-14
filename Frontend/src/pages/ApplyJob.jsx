import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NavSearchBar from '../components/Header/NavSearchBar';
import Sidebar from '../components/SideBar';
import { axiosInstance } from "../utils/axiosInstance";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();

  // Layout & UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth < 768;
  
  // Popup State
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const isInternship = loc.pathname.includes('/internship/apply');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    currentCompany: '',
    noticePeriod: 'Immediate',
    coverLetter: '',
    resume: null,
  });

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const triggerPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type: '', message: '' });
      if (type === 'success') navigate("/users/dashboard");
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (file.type !== "application/pdf") {
        triggerPopup('error', "Only PDF resume is allowed");
        e.target.value = "";
        setFormData((prev) => ({ ...prev, resume: null }));
        return;
      }

      if (file.size > maxSize) {
        triggerPopup('error', "PDF size exceeds 2MB!");
        e.target.value = "";
        setFormData((prev) => ({ ...prev, resume: null }));
        return;
      }

      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      triggerPopup('error', "Please upload your resume.");
      return;
    }

    setLoading(true);
    const endpoint = isInternship ? 'users/applyInternship' : 'users/applyJob';
    const idKey = isInternship ? "internshipId" : "jobId";

    try {
      const form = new FormData();
      form.append(idKey, id);
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) form.append(key, formData[key]);
      });

      // Using axiosInstance for Bearer Token Interceptor
      const res = await axiosInstance.put(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        triggerPopup('success', "Updated successfully!");
      } else {
        triggerPopup('error', res.data.message || "Failed to submit");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Network error. Try again.";
      triggerPopup('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row font-sans relative">
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
          >
            <div className="bg-white shadow-xl rounded-lg px-6 py-3 border border-gray-100 flex items-center gap-3 pointer-events-auto">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                <i className={`fas ${popup.type === 'success' ? 'fa-check' : 'fa-times'} text-white text-xs`}></i>
              </div>
              <span className="text-gray-700 font-medium">{popup.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavSearchBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showHamburger={true} />
      
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

      <div className="flex-1 pt-24 lg:pl-64 px-4 md:px-8 pb-10">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 pb-2">
              Apply for {isInternship ? 'Internship' : 'Job'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input name="fullName" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input name="email" required type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Phone <span className="text-red-500">*</span></label>
                  <input name="phone" required placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Experience <span className="text-red-500">*</span></label>
                  <select name="experience" required value={formData.experience} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-[#5F9D08] bg-white outline-none">
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Current Company</label>
                  <input name="currentCompany" placeholder="Current Company" value={formData.currentCompany} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Notice Period</label>
                  <select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-[#5F9D08] bg-white outline-none">
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">15 Days</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-1 text-gray-700">Resume/CV (PDF Only) <span className="text-red-500">*</span></label>
                <div className="group relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#5F9D08] transition-colors bg-gray-50 text-center">
                  <input type="file" accept="application/pdf" onChange={handleFileChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 group-hover:text-[#5F9D08] transition-colors"></i>
                  <p className="text-sm text-gray-600">
                    {formData.resume ? <span className="text-[#5F9D08] font-semibold">Selected: {formData.resume.name}</span> : "Upload PDF Resume"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-1 text-gray-700">Cover Letter (Optional)</label>
                <textarea name="coverLetter" rows="4" placeholder="Cover Letter" value={formData.coverLetter} onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-[#5F9D08] resize-none outline-none" />
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded bg-gray-100 hover:bg-gray-200 font-medium text-gray-700">Cancel</button>
                <button type="submit" disabled={loading} className={`px-8 py-2 rounded text-white font-bold transition-all shadow-md ${loading ? "bg-gray-400" : "bg-[#5F9D08] hover:opacity-90 active:scale-95"}`}>
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplyJob;