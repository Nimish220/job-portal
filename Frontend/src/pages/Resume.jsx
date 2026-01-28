import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/SideBar';
import NavSearchBar from '../components/Header/NavSearchBar';
import axios from 'axios';
import { 
  FiX, FiCheck, FiMoreVertical, FiEdit2, FiTrash2, 
  FiEye, FiUploadCloud, FiFileText, FiSquare, FiCheckSquare,
  FiAlertCircle, FiDownload, FiSearch, FiInbox
} from 'react-icons/fi';

const Resume = () => {
  const [pdfs, setPdfs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPdf, setNewPdf] = useState({ fileName: '', file: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  // Selection & UI State
  const [selectedIds, setSelectedIds] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, bulk: false });

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${base}/api/upload/resume`; 

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchResumes = async () => {
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      setPdfs(response.data.resumes || []);
    } catch (error) { 
        triggerNotification("Failed to load resumes", "error");
    }
  };

  useEffect(() => {
    fetchResumes();
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleView = (fileUrl) => {
    if (!fileUrl) return;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleUpload = async () => {
    if (!newPdf.file) return;
    if (newPdf.file.type !== "application/pdf") {
        triggerNotification("Only PDF resumes are supported", "error");
        return;
    }
    const formData = new FormData();
    formData.append("resume", newPdf.file);
    try {
      await axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });
      fetchResumes();
      setShowModal(false);
      setNewPdf({ fileName: '', file: null });
      triggerNotification("Resume uploaded successfully!");
    } catch (error) { triggerNotification("Upload failed", "error"); }
  };

    const processDelete = async () => {
    try {
      if (deleteConfirm.bulk) {
        // Deleting multiple files
        for (const id of selectedIds) {
          await axios.delete(`${API_URL}/${encodeURIComponent(id)}`, { withCredentials: true });
        }
        setSelectedIds([]);
      } else {
        // Deleting single file
        await axios.delete(`${API_URL}/${encodeURIComponent(deleteConfirm.id)}`, { withCredentials: true });
      }
      fetchResumes(); // Refresh the list
      setDeleteConfirm({ show: false, id: null, bulk: false });
      triggerNotification("Action completed successfully!");
    } catch (err) { 
      triggerNotification("Some items could not be deleted", "error"); 
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pdfs.length) setSelectedIds([]);
    else setSelectedIds(pdfs.map(p => p._id || p.id));
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-16 relative overflow-x-hidden font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ y: 50, opacity: 0, x: "-50%" }} 
            animate={{ y: 0, opacity: 1, x: "-50%" }} 
            exit={{ y: 20, opacity: 0, x: "-50%" }}
            className={`fixed bottom-10 left-1/2 z-[140] px-6 py-3 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 ${notification.type === 'success' ? 'bg-[#10B981]' : 'bg-red-500'}`}
          >
            {notification.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <NavSearchBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showHamburger={true} />
      
      <div className='flex flex-col lg:flex-row min-h-screen'>
        {screenWidth >= 1024 && <div className="fixed top-20 left-0 z-30 w-64"><Sidebar isOpen={true} isMobile={false} /></div>}
        
        <div className="flex-1 p-4 sm:p-10 lg:ml-64">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
             <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Resume Vault</h2>
                <p className="text-slate-500 font-medium mt-1">Manage and store your professional resumes.</p>
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto">
               {pdfs.length > 0 && (
                 <button 
                  onClick={toggleSelectAll}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                  title="Select All"
                 >
                   {selectedIds.length === pdfs.length ? <FiCheckSquare size={20} className="text-[#5F9D08]"/> : <FiSquare size={20}/>}
                 </button>
               )}
               <button 
                onClick={() => setShowModal(true)} 
                className="flex-1 md:flex-none bg-[#5F9D08] hover:bg-[#4d8006] text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200/50"
               >
                 <FiUploadCloud size={20} /> <span>Upload New</span>
               </button>
             </div>
          </div>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: 20, opacity: 0 }}
                className="mb-6 bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl"
              >
                <span className="font-bold ml-2">{selectedIds.length} Resumes Selected</span>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedIds([])} className="px-4 py-2 hover:bg-white/10 rounded-lg transition-all text-sm font-bold">Cancel</button>
                  <button 
                    onClick={() => setDeleteConfirm({show: true, bulk: true})}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all text-sm font-bold flex items-center gap-2"
                  >
                    <FiTrash2 size={16}/> Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          {pdfs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {pdfs.map((pdfItem, index) => {
                const id = pdfItem._id || pdfItem.id;
                const isSelected = selectedIds.includes(id);

                return (
                  <motion.div 
                    key={id || index}
                    layout
                    className={`relative bg-white rounded-[2rem] border-2 p-6 transition-all duration-300 group ${isSelected ? 'border-[#5F9D08] shadow-md' : 'border-transparent hover:border-slate-200 shadow-sm hover:shadow-md'}`}
                  >
                    {/* Selection Checkbox */}
                    <div 
                      onClick={() => toggleSelect(id)}
                      className={`absolute top-5 right-5 cursor-pointer p-1 rounded-md transition-all ${isSelected ? 'text-[#5F9D08] opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`}
                    >
                      {isSelected ? <FiCheckSquare size={22}/> : <FiSquare size={22}/>}
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className={`p-5 rounded-2xl mb-4 transition-colors ${isSelected ? 'bg-green-50 text-[#5F9D08]' : 'bg-slate-50 text-slate-400 group-hover:bg-red-50 group-hover:text-red-500'}`}>
                        <FiFileText size={40} />
                      </div>
                      <h4 className="font-bold text-slate-800 truncate w-full px-2 text-lg mb-1">{pdfItem.fileName}</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                        PDF Document
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8 pt-5 border-t border-slate-50">
                      <button 
                        onClick={() => handleView(pdfItem.fileUrl)} 
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm"
                      >
                        <FiEye size={16} /> View
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({show: true, id: id})}
                        className="w-12 bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl flex items-center justify-center transition-all"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 py-20 px-10 flex flex-col items-center text-center">
              <div className="bg-slate-50 p-8 rounded-full mb-6">
                <FiInbox size={60} className="text-slate-200" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No resumes found</h3>
              <p className="text-slate-500 max-w-sm mb-8">Your vault is currently empty. Upload your first professional resume to get started.</p>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-[#5F9D08] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-100"
              >
                Upload Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[150] p-4" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900">Upload Resume</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><FiX size={24}/></button>
              </div>
              
              <div className="relative group border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center hover:border-[#5F9D08] hover:bg-green-50/20 transition-all cursor-pointer">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={e => setNewPdf({ ...newPdf, file: e.target.files[0] })} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                />
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#5F9D08] group-hover:text-white transition-all">
                  <FiUploadCloud size={30} />
                </div>
                <p className="text-slate-700 font-bold mb-1">
                  {newPdf.file ? newPdf.file.name : "Choose PDF file"}
                </p>
                <p className="text-xs text-slate-400">PDF format only (Max 2MB)</p>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button 
                  onClick={handleUpload} 
                  disabled={!newPdf.file} 
                  className="flex-1 bg-[#5F9D08] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 disabled:opacity-30 disabled:shadow-none transition-all"
                >
                  Confirm Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[160] p-4">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center"
             >
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiAlertCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Are you sure?</h3>
                <p className="text-slate-500 font-medium mb-8">This action is permanent and cannot be undone.</p>
                <div className="flex gap-3">
                   <button onClick={() => setDeleteConfirm({show:false})} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">No, keep it</button>
                   <button onClick={processDelete} className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-100">Yes, delete</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resume;