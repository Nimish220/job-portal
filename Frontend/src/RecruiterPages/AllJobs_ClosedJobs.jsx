import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/SideBar_Recr';
import Notifications from '../assets/images/notifications00.png';
import JobCard from './components/JobCard';
import { toast, ToastContainer } from 'react-toastify';
// import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from '../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import ProfileImage from '../assets/images/Profile_pics/1.jpg';
import { FaBell, FaHome } from 'react-icons/fa';
function AllJobs_ClosedJobs() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  // const [jobs, setJobs] = useState([]);
  // const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState("jobs"); //  new tab state
  const isMobile = screenWidth < 768;

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //  Fetch closed jobs
  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get('recruiters/myJobs');
      const recruiterAllJobs = response.data.jobs.filter((job) => job.status === 'closed');
      setJobs(recruiterAllJobs);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch jobs");
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  //  Fetch closed internships
  const fetchInternships = async () => {
    try {
      const response = await axiosInstance.get('recruiters/myInternships');
      const recruiterAllInternships = response.data.internships.filter((i) => i.status === 'closed');
      setInternships(recruiterAllInternships);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch internships");
      console.error("Error fetching internships:", error);
      setLoading(false);
    }
  };

  //  Fetch recruiter profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('recruiters/getProfile');
        const recruiter = res.data.recruiter;
        setUserName(recruiter.companyName);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch recruiter details");
        console.error("Error fetching recruiter:", error);
        setLoading(false);
      }
    };

    fetchJobs();
    fetchInternships();
    fetchProfile();
  }, []);

  //  Job Actions
  const handleOpenJob = async (jobId) => {
    try {
      const res = await axiosInstance.post(`recruiters/openJob/${jobId}`);
      if (res.data.success) {
        fetchJobs();
        toast.success("Job opened successfully");
      }
    } catch (error) {
      toast.error('Failed to open job');
      console.error('Error opening job:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axiosInstance.delete(`recruiters/deleteJob/${jobId}`);
      fetchJobs();
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error("Failed to delete job");
      console.error("Error deleting job:", error);
    }
  };

  //  Internship Actions
  const handleOpenInternship = async (internshipId) => {
    try {
      const res = await axiosInstance.post(`recruiters/openInternship/${internshipId}`);
      if (res.data.success) {
        fetchInternships();
        toast.success("Internship opened successfully");
      }
    } catch (error) {
      toast.error("Failed to open internship");
      console.error("Error opening internship:", error);
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    try {
      await axiosInstance.delete(`recruiters/deleteInternship/${internshipId}`);
      fetchInternships();
      toast.success("Internship deleted successfully");
    } catch (error) {
      toast.error("Failed to delete internship");
      console.error("Error deleting internship:", error);
    }
  };

  //  Normalize function for JobCard
  const normalize = (item, type) => ({
    jobTitle: item.jobRole || item.internshipRole,
    applicantCount: item.candidates?.length || item.applicants?.length || 0,
    location: item.location,
    salaryRange: type === "job" ? item.ctc : `${item.stipendType || ""} ${item.stipendAmount || ""}`,
    description: item.jobDescription || item.internshipDescription || "Not provided",
    skills: item.skillsRequired,
    qualifications: item.eligibilityCriteria || "Not provided",
    status: item.status,
    opened: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    actionButtonText: type === "job" ? "Open Job" : "Open Internship",
    secondaryButtonText: type === "job" ? "Delete Job" : "Delete Internship",
    actionButtonLink: () => (type === "job" ? handleOpenJob(item._id) : handleOpenInternship(item._id)),
    onSecondaryButtonClick: () => (type === "job" ? handleDeleteJob(item._id) : handleDeleteInternship(item._id)),
    statusText: item.status === 'open' ? "Active" : "Inactive",
  });

  return (
    <div className="min-h-screen flex bg-gray-100 flex-col pt-16">
      {/* Top Navigation Bar */}
      <motion.div className="bg-[#5F9D08] fixed top-0 left-0 z-50 text-white p-4 flex justify-between items-center w-full shadow-md">
              
              {/* Left Section: Hamburger and Logo Word */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                  className="text-2xl flex items-center p-1 hover:opacity-80 lg:hidden"
                >
                  <FiMenu />
                </button>
                <span className="font-bold text-xl tracking-tight">logo</span>
              </div>
      
              {/* Right Section: Bell, Home, and Profile Image with Name */}
              <div className="flex items-center gap-6">
                <Link to="/recruiters/notifications">
                  <FaBell className="text-2xl cursor-pointer hover:text-gray-300" />
                </Link>
                <Link to="/recruiters/jobs/active">
                  <FaHome className="text-2xl cursor-pointer hover:text-gray-300" />
                </Link>
                <Link to="/recruiters/getProfile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="rounded-full bg-gray-300 w-8 h-8 overflow-hidden border border-white">
                    <img src={ProfileImage} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="hidden sm:inline font-bold text-sm truncate max-w-[150px]">
                    {userName || "Recruiter"}
                  </span>
                </Link>
              </div>
            </motion.div>

      <div className="flex flex-1 flex-col sm:flex-row">
        {!isMobile && (
          <div className="hidden lg:block fixed top-20 left-0 z-30 h-[calc(100vh-64px)] w-64 bg-transparent">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div className="flex-1 p-4 bg-gray-100 lg:ml-64 justify-center relative z-10">
          {/*  Tabs */}
          <div className="flex space-x-6 border-b border-gray-300 mb-6 sticky top-16 bg-gray-100 z-20 pt-2">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`pb-2 cursor-pointer ${activeTab === "jobs" ? "border-b-4 border-[#5F9D08] font-semibold" : "text-gray-500"}`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab("internships")}
              className={`pb-2 cursor-pointer ${activeTab === "internships" ? "border-b-4 border-[#5F9D08] font-semibold" : "text-gray-500"}`}
            >
              Internships
            </button>
          </div>

          {/*  Jobs Tab */}
          {activeTab === "jobs" && (
            <>
              <h2 className="text-lg sm:text-2xl font-semibold mb-2">All Jobs</h2>
              <h3 className="text-base sm:text-xl font-semibold text-[#5F9D08] mb-4">Closed Jobs</h3>
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : jobs.length === 0 ? (
                <p>No closed jobs found.</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => {
                    const normalized = normalize(job, "job");
                    return <JobCard key={job._id} {...normalized} activejob={false} />;
                  })}
                </div>
              )}
            </>
          )}

          {/*  Internships Tab */}
          {activeTab === "internships" && (
            <>
              <h2 className="text-lg sm:text-2xl font-semibold mb-2">All Internships</h2>
              <h3 className="text-base sm:text-xl font-semibold text-[#5F9D08] mb-4">Closed Internships</h3>
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : internships.length === 0 ? (
                <p>No closed internships found.</p>
              ) : (
                <div className="space-y-4">
                  {internships.map((internship) => {
                    const normalized = normalize(internship, "internship");
                    return <JobCard key={internship._id} {...normalized} activejob={false} />;
                  })}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}

export default AllJobs_ClosedJobs;

