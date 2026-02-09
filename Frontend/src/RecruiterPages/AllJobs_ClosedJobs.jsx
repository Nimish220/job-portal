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
    <div className="h-screen flex bg-gray-100 flex-col">
      {/* Top Navigation Bar */}
      <motion.div className="bg-[#5F9D08] text-white p-4 flex flex-wrap justify-between items-center w-full">
        <div></div>
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <Link to="/recruiters/notifications">
            <img src={Notifications} alt="Notifications Icon" className="w-8 h-8 sm:w-10 sm:h-10" />
          </Link>
          <Link to="/recruiters/getProfile" className="flex flex-row items-center gap-2">
            <div className="rounded-full bg-gray-300 w-6 h-6 sm:w-8 sm:h-8">
              <img src={ProfileImage} alt="" className="w-full h-full rounded-full" />
            </div>
            <span className="text-sm sm:text-base">{userName || 'Loading...'}</span>
          </Link>
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="lg:hidden p-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-3xl text-[#5F9D08] cursor-pointer">
            <FiMenu />
          </button>
        </div>
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

        {/* Main Content */}
        <motion.div className="flex-1 p-4 bg-gray-100 lg:ml-64 justify-center">
          {/*  Tabs */}
          <div className="flex space-x-6 border-b border-gray-300 mb-6">
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

