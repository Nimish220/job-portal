import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../components/Header/UserNavbar';
import amazonLogo from '../assets/images/amazon-logo.svg';
import pdfIcon from '../assets/images/pdf00.png';
import { motion, AnimatePresence } from 'framer-motion';
import JobApplicationForm from '../components/JobApplicationForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavSearchBar from '../components/Header/NavSearchBar';
import Sidebar from '../components/SideBar';
import useUserStore from '../store/userStore';

const JobPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const loc = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [activeSection, setActiveSection] = useState('description');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ---------------------- ZUSTAND FIX: SELECT ITEMS SAFELY ----------------------
    const getAppliedJobs = useUserStore((state) => state.getAppliedJobs);
    const appliedJobs = useUserStore((state) => state.appliedJobs);
    const applyjob = useUserStore((state) => state.applyJob);
    // -------------------------------------------------------------------------------
    
    // Fallback logic to ensure the URL is always valid
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const backend_url = `${base}/api`;

    const isInternship = loc.pathname.includes('/internship/');
    const [isApplied, setIsApplied] = useState(false);

    // === 1. Fetch Applied Jobs List & Check Status (SAFE USAGE) ===
    useEffect(() => {
        if (appliedJobs.length === 0) {
            getAppliedJobs();
        }
        
        if (id && appliedJobs.length > 0) {
            const alreadyApplied = appliedJobs.some(post => post._id === id);
            setIsApplied(alreadyApplied);
        }
        
    }, [id, appliedJobs, getAppliedJobs]);


    // === 2. API FETCHING LOGIC (UPDATED WITH /API PREFIX) ===
    useEffect(() => {
        const fetchPostDetails = async () => {
            setIsLoading(true);
            setError(null);

            let apiUrl = '';
            const postType = isInternship ? 'Internship' : 'Job';

            // FIXED: Standardized to use the /api prefix to match backend mounting
            if (isInternship) {
                apiUrl = `${backend_url}/users/internship/${id}`;
            } else {
                apiUrl = `${backend_url}/jobs/${id}`;
            }

            try {
                const response = await fetch(apiUrl, { credentials: 'include' });

                if (!response.ok) {
                    throw new Error(`${postType} not found`);
                }
                const data = await response.json();
                setJob(data);
            } catch (err) {
                console.error(`Error fetching ${postType} details:`, err);
                setError("Post not found");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPostDetails();
    }, [id, isInternship, backend_url]);

    // ============================
    // Callbacks and Handlers
    // ============================
    const handleSectionChange = useCallback((section) => {
        setActiveSection(section);
    }, []);

    const handleApplyNow = useCallback(() => {
        navigate(isInternship ? `/users/internship/apply/${id}` : `/users/apply/${id}`);
    }, [id, isInternship, navigate]);


    const handleSubmitApplication = async (formData) => {
        await applyjob(loc.pathname.split('/').pop()); 
        console.log('Application submitted:', { postId: job?._id, ...formData });

        toast.success('Application submitted successfully!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        setIsApplied(true); 
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5F9D08] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading {isInternship ? 'internship' : 'job'} details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !job) {
        const postType = isInternship ? 'Internship' : 'Job';
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="text-center max-w-md w-full p-8 bg-white rounded-xl shadow-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{postType} Not Found</h2>
                    <p className="text-gray-600 mb-6">The post you're looking for might have been removed or is no longer available.</p>
                    <button
                        onClick={() => navigate('/users/dashboard')}
                        className="mt-6 px-6 py-2 bg-[#5F9D08] text-white rounded-lg hover:bg-[#4A8B07] transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const workflowSteps = [
        "Application",
        "Resume Shortlisting",
        "Written Test",
        "HR Interview",
        "Offer"
    ];

    const mainTitle = isInternship ? job.internshipRole : job.jobRole;
    const typeText = isInternship ? job.internshipType : job.jobType;
    const salaryText = isInternship 
        ? `${job.stipendAmount} ${job.stipendType}` 
        : `${job.ctc} LPA`;
    const experienceText = isInternship ? job.internshipDuration : job.experience;


    return (
        <div className="flex min-h-screen pt-10 bg-gray-50">
            <NavSearchBar
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                showHamburger={true}
            />
            <div className="hidden lg:block mt-20 fixed top-0 left-0 min-h-screen">
                <Sidebar isOpen={true} isMobile={false} />
            </div>

            <AnimatePresence>
                {isSidebarOpen && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        isMobile
                    />
                )}
            </AnimatePresence>

            <motion.div
                className="flex flex-col w-full p-6 bg-transparent lg:ml-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="border-t border-gray-300 mb-4"></div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 mb-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                    <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-white rounded-lg shadow-sm">
                        <img src={amazonLogo} alt={`${job.recruiter?.companyName || 'Company'} Logo`} className="w-16 h-16 object-contain" />
                    </div>

                    <div className="flex-grow flex flex-col gap-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{mainTitle}</h2>
                        <p className="text-[#5F9D08] font-medium text-base sm:text-lg">{job.recruiter?.companyName || job.recruiter?.email}</p>

                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            <span className="inline-flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                            </span>

                            <span className="inline-flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01" />
                                </svg>
                                {typeText}
                            </span>

                            <span className="inline-flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {salaryText}
                            </span>
                        </div>
                    </div>

                    <motion.button
                        onClick={isApplied ? () => navigate('/users/dashboard') : handleApplyNow} 
                        disabled={isApplied}
                        className={`w-full md:w-auto mt-4 md:mt-0 px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors hover:shadow-lg ${
                            isApplied
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#5F9D08] to-[#4A8B07] hover:from-[#4A8B07] hover:to-[#3A7A00]'
                        }`}
                        whileHover={!isApplied ? { scale: 1.05 } : {}}
                        whileTap={!isApplied ? { scale: 0.95 } : {}}
                    >
                        {isApplied ? 'Applied ✓' : 'Apply Now'}
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex justify-between mb-2 bg-white rounded-lg shadow-sm p-2"
                >
                    <span
                        onClick={() => handleSectionChange('description')}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === 'description' ? 'bg-[#5F9D08] text-white font-medium' : 'hover:bg-green-50 hover:text-[#5F9D08]'}`}
                    >
                        {isInternship ? 'Internship Details' : 'Job Description'}
                    </span>
                    <span
                        onClick={() => handleSectionChange('workflow')}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === 'workflow' ? 'bg-[#5F9D08] text-white font-medium' : 'hover:bg-green-50 hover:text-[#5F9D08]'}`}
                    >
                        Hiring Workflow
                    </span>
                    <span
                        onClick={() => handleSectionChange('eligibility')}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === 'eligibility' ? 'bg-[#5F9D08] text-white font-medium' : 'hover:bg-green-50 hover:text-[#5F9D08]'}`}
                    >
                        Eligibility Criteria
                    </span>
                </motion.div>
                <div className="mb-4"></div>

                {activeSection === 'description' && (
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="font-bold text-xl text-gray-800 border-l-4 border-[#5F9D08] pl-3">{isInternship ? 'Internship Overview' : 'Job Overview'}</h3>
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <div className="flex flex-wrap md:flex-nowrap mb-2">
                                <div className="w-full md:w-1/3 font-medium text-gray-700 mb-1 md:mb-0">{isInternship ? 'Internship Role:' : 'Job Role:'}</div>
                                <div className="w-full md:w-2/3 text-gray-800">{mainTitle}</div>
                            </div>
                            <div className="flex flex-wrap md:flex-nowrap mb-2">
                                <div className="w-full md:w-1/3 font-medium text-gray-700 mb-1 md:mb-0">Skills Required:</div>
                                <div className="w-full md:w-2/3 text-gray-800">
                                    {job.skillsRequired.split(',').map((skill, index) => (
                                        <span key={index} className="inline-block bg-green-100 text-[#589207] px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-wrap md:flex-nowrap">
                                <div className="w-full md:w-1/3 font-medium text-gray-700 mb-1 md:mb-0">{isInternship ? 'Stipend/Duration:' : 'Job Profile CTC:'}</div>
                                <div className="w-full md:w-2/3 text-gray-800 font-medium">
                                    {isInternship ? experienceText : salaryText}
                                </div>
                            </div>
                        </div>

                        <h3 className="mt-6 font-bold text-xl text-gray-800 border-l-4 border-[#5F9D08] pl-3">{isInternship ? 'Internship Description' : 'Job Description'}</h3>
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg text-gray-700 leading-relaxed">
                            {job.jobDescription?.split('\n').map((line, index) => (
                                <p key={index} className="mb-2">{line}</p>
                            ))}
                        </div>

                        <div className="mt-6">
                            <h3 className="font-bold text-xl text-gray-800 border-l-4 border-[#5F9D08] pl-3">Attached Documents</h3>
                            <div className="mt-4 flex items-center">
                                <a
                                    href={job.link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-300"
                                >
                                    <img src={pdfIcon} alt="PDF Icon" className="w-10 h-10" />
                                    <span className="ml-3 text-gray-700 hover:text-[#5F9D08]">{isInternship ? 'Internship' : 'Job'} Description Document</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeSection === 'workflow' && (
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="font-bold text-xl text-gray-800 border-l-4 border-[#5F9D08] pl-3">Hiring Workflow</h3>
                        <div className="mt-6 px-4">
                            <div className="relative">
                                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 z-0"></div>

                                {workflowSteps.map((step, index) => (
                                    <div key={index} className="relative z-10 flex items-center mb-8">
                                        <div className="flex-1 flex justify-end pr-4 md:pr-12">
                                            <div className="text-right">
                                                <h4 className="font-medium text-gray-800">{step}</h4>
                                                <p className="text-sm text-gray-500">Step {index + 1}</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md z-10 ${job.status > index ? 'bg-[#5F9D08] text-white' : 'bg-white border-2 border-gray-300 text-gray-500'}`}
                                        >
                                            {job.status > index ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span>{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 pl-4 md:pl-12">
                                            <div className={`text-sm ${job.status > index ? 'text-[#5F9D08]' : 'text-gray-500'}`}>
                                                {job.status > index ? 'Completed' : job.status === index ? 'In Progress' : 'Pending'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeSection === 'eligibility' && (
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="font-bold text-xl text-gray-800 border-l-4 border-[#5F9D08] pl-3">Eligibility Criteria</h3>
                        <div className="mt-4 bg-gray-50 p-5 rounded-lg">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-[#5F9D08] rounded-full p-1 mr-3 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Education</h4>
                                        <p className="text-gray-600 text-sm mt-1">{job.qualifications}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-[#5F9D08] rounded-full p-1 mr-3 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Experience / Duration</h4>
                                        <p className="text-gray-600 text-sm mt-1">{experienceText}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-[#5F9D08] rounded-full p-1 mr-3 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Skills</h4>
                                        <p className="text-gray-600 text-sm mt-1">Proficiency in required technical skills as mentioned in the description</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-[#5F9D08] rounded-full p-1 mr-3 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Other Requirements</h4>
                                        <p className="text-gray-600 text-sm mt-1">{job.eligibilityCriteria}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <ToastContainer />
            </motion.div>
        </div>
    );
};

export default JobPage;