import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/SideBar';
import NavSearchBar from '../components/Header/NavSearchBar';
import { axiosInstance } from '../utils/axiosInstance';
import { 
  FiX, FiCheck, FiMoreVertical, FiEdit2, FiTrash2, 
  FiEye, FiUploadCloud, FiFileText, FiSquare, FiCheckSquare,
  FiAlertCircle, FiInbox, FiDownload
} from 'react-icons/fi';

const Resume = () => {
  const [pdfs, setPdfs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPdf, setNewPdf] = useState({ fileName: '', file: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, bulk: false });
  const [renameModal, setRenameModal] = useState({ show: false, id: null, oldName: '' });
  const [newName, setNewName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  //const API_URL = `${base}/api/upload/resume`; 

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchResumes = async () => {
    try {
      const response = await axiosInstance.get('upload/resume');
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

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      triggerNotification("Download failed", "error");
    }
  };
  const handleUpload = async () => {
    if (!newPdf.file) return;

    const maxSize = 2 * 1024 * 1024; 
    
    // Check size first
    if (newPdf.file.size > maxSize) {
      setShowModal(false); // Close modal to remove blur effect
      triggerNotification("File is too large! Max limit is 2MB", "error");
      return;
    }

    // Check type
    if (newPdf.file.type !== "application/pdf") {
        setShowModal(false); // Close modal to remove blur effect
        triggerNotification("Only PDF resumes are supported", "error");
        return;
    }

    const formData = new FormData();
    formData.append("resume", newPdf.file);
    
    try {
      setIsUploading(true);
      await Promise.all([
      axiosInstance.post('upload/resume', formData, { 
        headers: { "Content-Type": "multipart/form-data" }
      }),
      new Promise(resolve => setTimeout(resolve, 400)) 
    ]);
      fetchResumes();
      setShowModal(false);
      setNewPdf({ fileName: '', file: null });
      triggerNotification("Resume uploaded successfully!");
    } catch (error) { 
      setShowModal(false); // Close modal to remove blur effect
      const errMsg = error.response?.data?.error || "Upload failed";
      triggerNotification(errMsg, "error"); 
      } finally {
      setIsUploading(false); // STOP LOADING
    }
  };

  const processDelete = async () => {
  try {
    setIsUploading(true);
    
    // Forces the loader to stay for at least 600ms even if the API is instant
    const [responses] = await Promise.all([
      deleteConfirm.bulk 
        ? Promise.all(selectedIds.map(id => axiosInstance.delete(`upload/resume/${encodeURIComponent(id)}`)))
        : axiosInstance.delete(`upload/resume/${encodeURIComponent(deleteConfirm.id)}`),
      new Promise(resolve => setTimeout(resolve, 400)) // UX delay
    ]);

    if (deleteConfirm.bulk) setSelectedIds([]);
    
    await fetchResumes(); 
    setDeleteConfirm({ show: false, id: null, bulk: false });
    triggerNotification("Item(s) deleted successfully!", "success");
  } catch (err) { 
    triggerNotification("Could not delete item(s)", "error"); 
  } finally {
    setIsUploading(false);
  }
};

const handleRename = async () => {
  if (!newName.trim()) return;
  try {
    setIsUploading(true);
    await Promise.all([
      axiosInstance.put(`upload/resume/${renameModal.id}`, { newFileName: newName }, { withCredentials: true }),
      new Promise(resolve => setTimeout(resolve, 400)) 
    ]);
    fetchResumes();
    setRenameModal({ show: false, id: null, oldName: '' });
    setNewName('');
    triggerNotification("File renamed successfully!");
  } catch (error) {
    triggerNotification("Rename failed", "error");
  }
  finally {
    setIsUploading(false); //  Stop loading spinner
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
    <div className="bg-[#F8FAFC] min-h-screen pt-16 relative font-sans">
      
      {/* Notifications - Increased z-index to stay above everything */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ y: -100, opacity: 0, x: "-50%" }} 
            animate={{ y: 20, opacity: 1, x: "-50%" }} 
            exit={{ y: -100, opacity: 0, x: "-50%" }}
            className={`fixed top-20 left-1/2 z-[300] px-6 py-4 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 min-w-[300px] border-b-4 ${notification.type === 'success' ? 'bg-emerald-500 border-emerald-700' : 'bg-rose-500 border-rose-700'}`}
          >
            {notification.type === 'success' ? <FiCheck size={24}/> : <FiAlertCircle size={24}/>}
            <span className="text-sm uppercase tracking-wide">{notification.message}</span>
          </motion.div>
        )}

      </AnimatePresence>
        <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[150] lg:hidden"> 
            {/* Added fixed inset-0 and z-index to ensure it covers the screen */}
            <Sidebar 
              isOpen={isSidebarOpen} 
              isMobile={true} 
              closeSidebar={() => setIsSidebarOpen(false)} 
            />
          </div>
        )}
      </AnimatePresence>
      <NavSearchBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showHamburger={true} />
      
      <div className='flex flex-col lg:flex-row min-h-screen'>
        {screenWidth >= 1024 && <div className="fixed top-20 left-0 z-30 w-64 border-r border-slate-100"><Sidebar isOpen={true} isMobile={false} /></div>}
        
        <div className="flex-1 p-4 sm:p-10 lg:ml-64">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Resume</h2>
                <p className="text-slate-400 font-medium mt-1">Standard 2MB PDF storage for your job hunt.</p>
             </div>
             <div className="flex items-center gap-4 w-full md:w-auto">
               {pdfs.length > 0 && (
                 <button 
                  onClick={toggleSelectAll}
                  className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:border-[#5F9D08] hover:text-[#5F9D08] transition-all shadow-sm"
                 >
                   {selectedIds.length === pdfs.length ? <FiCheckSquare size={24} className="text-[#5F9D08]"/> : <FiSquare size={24}/>}
                 </button>
               )}
               <button 
                onClick={() => setShowModal(true)} 
                className="flex-1 md:flex-none bg-[#5F9D08] hover:bg-[#4d8006] text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-green-100 active:scale-95"
               >
                 <FiUploadCloud size={22} /> <span className="uppercase tracking-widest text-xs">Upload New</span>
               </button>
             </div>
          </div>

          {/* Bulk Selection Bar */}
                  <AnimatePresence>
                    {selectedIds.length > 0 && (
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        exit={{ y: 20, opacity: 0 }}
                        /* 1. Changed pr-6 to pr-4 for better mobile spacing
                          2. Added flex-wrap for very small screens
                        */
                        className="mb-8 bg-[#5F9D08] text-white py-3 pl-4 pr-4 rounded-[2rem] flex flex-row items-center justify-between gap-2 shadow-2xl border border-white/20 flex-wrap sm:flex-nowrap"
                      >
                        {/* Left Section: Count */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-7 h-7 bg-white text-[#5F9D08] rounded-full flex items-center justify-center text-[11px] font-black shadow-sm">
                            {selectedIds.length}
                          </div>
                          <span className="font-black tracking-tight uppercase text-[10px] whitespace-nowrap">Selected</span>
                        </div>

                        {/* Right Section: Buttons */}
                        <div className="flex gap-2 items-center ml-auto">
                          <button 
                            onClick={() => setSelectedIds([])} 
                            disabled={isUploading}
                            className="px-2 py-2 hover:bg-white/20 rounded-xl transition-all text-[11px] font-black uppercase disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm({show: true, bulk: true})}
                            disabled={isUploading}
                            /* Using 'xs:inline' to hide text on tiny screens and only show the icon
                              to prevent the button from popping out of the green bar.
                            */
                            className="bg-rose-600 hover:bg-rose-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all text-[11px] font-black flex items-center gap-2 uppercase tracking-widest disabled:opacity-70 shadow-lg shrink-0"
                          >
                            <FiTrash2 className="text-[14px]"/> 
                            <span className="hidden xs:inline">Delete All</span>
                            <span className="inline xs:hidden text-[10px]">Delete</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
          {/* Main Grid */}
          {pdfs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {pdfs.map((pdfItem, index) => {
                const id = pdfItem._id || pdfItem.id;
                const isSelected = selectedIds.includes(id);

                return (
                  <motion.div 
                    key={id || index} layout
                    className={`relative bg-white rounded-[2.5rem] border-2 p-8 transition-all duration-300 group ${isSelected ? 'border-[#5F9D08] bg-green-50/10 shadow-lg' : 'border-transparent hover:border-slate-200 shadow-sm hover:shadow-xl'}`}
                  >
                    <div 
                      onClick={() => toggleSelect(id)}
                      className={`absolute top-6 right-6 cursor-pointer p-1 transition-all ${isSelected ? 'text-[#5F9D08]' : 'text-slate-200 group-hover:text-slate-400'}`}
                    >
                      {isSelected ? <FiCheckSquare size={26}/> : <FiSquare size={26}/>}
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className={`p-6 rounded-3xl mb-6 transition-colors ${isSelected ? 'bg-[#5F9D08] text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500'}`}>
                        <FiFileText size={48} />
                      </div>
                      <h4 className="font-black text-slate-800 truncate w-full px-2 text-lg mb-1 uppercase tracking-tight">{pdfItem.fileName}</h4>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">PDF Document</p>
                    </div>
            
                    <div className="mt-8 space-y-3 px-2">
                      {/* PRIMARY: View Asset (Uniform Solid Green) */}
                      <motion.button 
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleView(pdfItem.fileUrl)} 
                        /* Removed hover:bg and gloss translation for 1 solid color */
                        className="w-full relative overflow-hidden bg-[#5F9D08] text-white py-4 rounded-[1.2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-green-100 transition-all active:scale-95"
                      >
                        <FiEye size={18} /> 
                        <span>View Resume</span>
                      </motion.button>
                      
                      {/* SECONDARY: Uniform Multi-color Toolbar */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* Download (Emerald) */}
                        <button 
                          onClick={() => handleDownload(pdfItem.fileUrl, pdfItem.fileName)} 
                          className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border border-emerald-100 bg-emerald-50 text-[#5F9D08] transition-all active:scale-90"
                        >
                          <FiDownload size={18} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Download</span>
                        </button>

                        {/* Rename (Amber) */}
                        <button 
                          onClick={() => {
                            setRenameModal({ show: true, id: id, oldName: pdfItem.fileName });
                            setNewName(pdfItem.fileName);
                          }}
                          className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border border-amber-100 bg-amber-50 text-amber-600 transition-all active:scale-90"
                        >
                          <FiEdit2 size={16} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Edit</span>
                        </button>

                        {/* Delete (Rose) */}
                        <button 
                          onClick={() => setDeleteConfirm({show: true, id: id})}
                          className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 transition-all active:scale-90"
                        >
                          <FiTrash2 size={18} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[3.5rem] border-4 border-dashed border-slate-100 py-32 flex flex-col items-center text-center">
              <FiInbox size={80} className="text-slate-100 mb-6" />
              <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">No resumes found</h3>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal - Removed Blurry Backdrop */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-[250] p-4" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white p-10 rounded-[3rem] max-w-md w-full shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Upload Resume</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><FiX size={28}/></button>
              </div>
              
              <div className="relative group border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center hover:border-[#5F9D08] hover:bg-green-50/20 transition-all cursor-pointer">
                <input 
                  type="file" accept="application/pdf" 
                  onChange={e => setNewPdf({ ...newPdf, file: e.target.files[0] })} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                />
                <FiUploadCloud size={40} className="mx-auto mb-4 text-slate-200 group-hover:text-[#5F9D08] transition-colors" />
                <p className="text-slate-700 font-black text-sm uppercase tracking-tight truncate max-w-full">
                  {newPdf.file ? newPdf.file.name : "Choose PDF file"}
                </p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Max 2MB</p>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
                <button 
                onClick={handleUpload} 
                disabled={!newPdf.file || isUploading} 
                className="flex-[2] bg-[#5F9D08] text-white py-4 rounded-2xl font-black shadow-xl shadow-green-100 disabled:opacity-50 disabled:shadow-none transition-all uppercase text-xs tracking-widest active:scale-95 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
                    Uploading...
                  </>
                ) : (
                  "Confirm Upload"
                )}
              </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal - Removed Blurry Backdrop */}
            <AnimatePresence>
              {deleteConfirm.show && (
                <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-[260] p-4">
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                      className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center"
                  >
                      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiAlertCircle size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                        {deleteConfirm.bulk ? "Delete All Selected?" : "Delete File?"}
                      </h3>
                      <p className="text-slate-400 font-medium text-sm mb-10 leading-relaxed px-4">
                        This action is permanent and cannot be undone.
                      </p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setDeleteConfirm({show:false})} 
                          disabled={isUploading}
                          className="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        
                        <button 
                          onClick={processDelete} 
                          disabled={isUploading} 
                          className="flex-1 bg-rose-500 text-white rounded-2xl font-black shadow-xl shadow-rose-100 uppercase text-xs tracking-widest flex items-center justify-center gap-2 min-h-[52px]"
                        >
                          {isUploading ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>
                              <FiTrash2 size={16} />
                              <span>Delete {deleteConfirm.bulk ? "All" : ""}</span>
                            </>
                          )}
                        </button>
                      </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {renameModal.show && (
          <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-[270] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[3rem] max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6">Rename File</h3>
              <div className="mb-8">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">New Filename</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-[#5F9D08] outline-none font-bold transition-all"
                  placeholder="Enter new name..."
                  autoFocus
                />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setRenameModal({show:false})} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest">Cancel</button>
                <button onClick={handleRename} disabled={isUploading} className="flex-[2] bg-amber-500 text-white py-4 rounded-2xl font-black shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all">
                  {isUploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resume;