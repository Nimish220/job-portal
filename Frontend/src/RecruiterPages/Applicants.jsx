import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import { axiosInstance } from '../utils/axiosInstance';
import Notifications from '../assets/images/notifications00.png';
import ProfileImage from '../assets/images/Profile_pics/1.jpg';
import Sidebar from '../components/SideBar_Recr';
import { toast } from 'react-toastify';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, ease: "easeOut", duration: 0.3 }
  }
};

function Applicants() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();
  const location = useLocation(); 
  const [userName, setUserName] = useState('Guest');
  
  const isMobile = screenWidth < 768;
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Handle resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProfile = async () => {
    try {
     const res = await axiosInstance.get('recruiters/getProfile');
      setUserName(res.data.recruiter?.companyName || 'Guest');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const isInternship = location.pathname.includes('internshipApplicants');
      
      //  FIXED: Removed "/candidate/${applicantId}" from the end. 
      // This page is for the LIST of applicants, so we only need the jobId.
      const apiPath = isInternship 
        ? `applications/internship/${jobId}` 
        : `applications/job/${jobId}`;

      const res = await axiosInstance.get(apiPath);
      
      // Ensure we set an array
     const dataArray = res.data.candidates || res.data || [];
     setApplicants(dataArray); 
     setLoading(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error("Error fetching applicants:", errorMsg); 
      setError(errorMsg);
      toast.error(errorMsg); 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId, location.pathname]);

  if (loading) return <div className="p-8 text-center text-lg font-semibold">Loading applicants...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <motion.div className="bg-[#5F9D08] sticky top-0 left-0 z-50 text-white p-4 flex justify-between items-center w-full shadow-md">
        <div className="flex items-center space-x-2">
           <span className="font-bold text-xl">Portal Logo</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/recruiters/notifications">
            <img src={Notifications} alt="Notifications" className="w-8 h-8 cursor-pointer" />
          </Link>
          <Link to="/recruiters/getProfile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="rounded-full bg-gray-300 w-8 h-8 overflow-hidden border border-white">
              <img src={ProfileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="hidden sm:inline text-sm font-medium">{userName}</span>
          </Link>
        </div>
      </motion.div>

      <div className="flex flex-1">
        {/* Mobile Toggle */}
        <div className="lg:hidden p-4 absolute">
          <button onClick={() => setIsSidebarOpen(true)} className="text-3xl text-[#5F9D08]">
            <FiMenu />
          </button>
        </div>

        {/* Sidebar */}
        {!isMobile && (
          <div className="hidden lg:block fixed top-20 left-0 h-full w-60 z-30">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 mt-4 lg:ml-60">
          <motion.div
            className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {location.pathname.includes('internshipApplicants') ? 'Internship Applicants' : 'Job Applicants'}
            </motion.h2>

            <div className="space-y-4">
              {applicants.length === 0 ? (
                <div className="py-10 text-center">
                   <p className="text-gray-500 italic">No applicants found for this posting.</p>
                </div>
              ) : (
                applicants.map((applicant, index) => (
                  <motion.div
                    key={applicant._id || index}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -2 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 hover:shadow-md transition-all border-l-4 border-l-[#5F9D08]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
                        <img
                          src={applicant.profilePhoto || '/default-avatar.png'}
                          alt={applicant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{applicant.name}</h3>
                        <p className="text-sm text-gray-600 font-medium">{applicant.degree || 'Degree not specified'}</p>
                        <p className="text-xs text-gray-400">{applicant.university || 'University unknown'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/*  LINK FIX: Now correctly chooses path based on context */}
                      <Link to={location.pathname.includes('internship') 
                          ? `/recruiters/internshipApplicants/${jobId}/${applicant._id}` 
                          : `/recruiters/applicantsProfile/${jobId}/${applicant._id}`}>
                        <motion.button
                          className="bg-[#5F9D08] hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                          whileTap={{ scale: 0.95 }}
                        >
                          View Profile
                        </motion.button>
                      </Link>
                     <motion.button
  className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
  whileTap={{ scale: 0.95 }}
  onClick={async () => {
  let resumeUrl = applicant.resume?.[applicant.resume?.length - 1]?.fileUrl;

  if (!resumeUrl) {
    // Show a small loading message so the recruiter knows it's working
    const loadingToast = toast.loading("Fetching latest resume...");
    try {
      const isInternship = location.pathname.includes('internship');
      const apiType = isInternship ? 'internships' : 'jobs';
      const res = await axiosInstance.get(`recruiters/${apiType}/${jobId}/candidate/${applicant._id}`);
      
      const freshResume = res.data.resume?.[res.data.resume?.length - 1];
      resumeUrl = freshResume?.fileUrl;
      
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Fetch failed:", err);
    }
  }

  if (resumeUrl) {
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  } else {
    toast.error("Resume not found.");
  }
}}
>
  Resume
</motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Applicants;