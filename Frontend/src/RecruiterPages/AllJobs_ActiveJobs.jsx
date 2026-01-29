//  AllJobs_ActiveJobs.jsx – Fixed Active/Closed Filtering for Jobs & Internships
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar_Recr';
import ProfileImage from '../assets/images/Profile_pics/1.jpg';
import Notifications from '../assets/images/notifications00.png';
import JobCard from './components/JobCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import { FiEdit, FiX } from 'react-icons/fi';
function JobPage() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [internshipsLoading, setInternshipsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const [internshipsError, setInternshipsError] = useState(null);
  const [userName, setUserName] = useState('Guest');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState("jobs");
  const isMobile = screenWidth < 768;
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Utility to check if status is active
  const isActiveStatus = (status) => {
    return status === 'open' || status === 'active' || status === 1;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //  Fetch Jobs
  const fetchJobs = async () => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const response = await axios.get(`${backend_url}/api/recruiters/myJobs`, { withCredentials: true });
      const recruiterAllJobs = response.data.jobs.filter(job => isActiveStatus(job.status));
      setJobs(recruiterAllJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobsError('Failed to fetch jobs');
      toast.error('Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  //  Fetch Internships
 
  const fetchInternships = async () => {
  setInternshipsLoading(true);
  setInternshipsError(null);
  try {
    const response = await axios.get(`${backend_url}/api/recruiters/myInternships`, {
      withCredentials: true,
    });

    const recruiterAllInternships = response.data.internships;
    const afterfilterInternships = recruiterAllInternships.filter((i) => isActiveStatus(i.status));  // Use your isActiveStatus utility for consistency,
    //console.log(afterfilterInternships);
    setInternships(afterfilterInternships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    setInternshipsError('Failed to fetch internships');
    toast.error('Failed to fetch internships');
  } finally {
    setInternshipsLoading(false);
  }
};


  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backend_url}/api/recruiters/getProfile`, { withCredentials: true });
      setUserName(res.data.recruiter?.companyName || 'Guest');
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch recruiter details');
      setUserName('Guest');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchInternships();
    fetchProfile();
  }, []);

  // Close job/internship actions
  const handleCloseJob = async (jobId) => {
    try {
      await axios.post(`${backend_url}/api/recruiters/closeJob/${jobId}`, {}, { withCredentials: true });
      fetchJobs(); //  refetch instead of just filtering
      toast.success('Job closed successfully');
    } catch (error) {
      console.error('Error closing job:', error);
      toast.error('Failed to close job');
    }
  };

  const handleCloseInternship = async (internshipId) => {
    try {
      await axios.post(`${backend_url}/api/recruiters/closeInternship/${internshipId}`, {}, { withCredentials: true });
      fetchInternships(); //  refetch instead of just filtering
      toast.success('Internship closed successfully');
    } catch (error) {
      console.error('Error closing internship:', error);
      toast.error('Failed to close internship');
    }
  };

  const handleViewApplicants = (jobId) => navigate(`/recruiters/applicants/${jobId}`);
  const handleViewInternshipApplicants = (internshipId) => navigate(`/recruiters/internshipApplicants/${internshipId}`);

  //  Normalize for JobCard
  const normalize = (item, type) => ({
    jobTitle: item.jobRole || item.internshipRole || "Not specified",
    applicantCount: item.candidates?.length || item.applicants?.length || 0,
    location: item.location || "Remote / Not specified",
    salaryRange: type === "job" 
      ? item.ctc || "Not specified" 
      : `${item.stipendType || "Unpaid"} ${item.stipendAmount || "0"}`,
    jobDescription: item.jobDescription || item.internshipDescription || "Not provided",
    responsibilities: item.responsibilities || "Not provided",
    qualifications: item.eligibilityCriteria || "Not provided",
    workflow: item.hiringWorkflow || "Not specified",
    skills: item.skillsRequired || "Not specified",
    status: item.status || "active",
    opened: item.createdAt || new Date(),
    actionButtonText: "View Applicants",
    secondaryButtonText: type === "job" ? "Close Job" : "Close Internship",
    actionButtonLink: () => type === "job" ? handleViewApplicants(item._id) : handleViewInternshipApplicants(item._id),
    onSecondaryButtonClick: () => type === "job" ? handleCloseJob(item._id) : handleCloseInternship(item._id),
    statusText: isActiveStatus(item.status) ? "Active" : "Inactive",
    onEdit: () => navigate(`/recruiters/edit-${type}/${item._id}`),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="h-screen flex bg-gray-100 flex-col">
      {/* Top Navigation Bar */}
      <motion.div className="bg-[#5F9D08] sticky top-0 left-0 text-white p-4 flex flex-wrap justify-between items-center w-full">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0 w-full sm:w-auto">logo</div>
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <Link to="/recruiters/notifications">
            <img src={Notifications} alt="Notifications Icon" className="w-8 h-8 sm:w-10 sm:h-10" />
          </Link>
          <Link to="/recruiters/getProfile" className="flex flex-row items-center gap-2">
            <div className="rounded-full bg-gray-300 w-6 h-6 sm:w-8 sm:h-8">
              <img src={ProfileImage} alt="" className="w-full h-full rounded-full" />
            </div>
            <span className="text-sm sm:text-base">{userName}</span>
          </Link>
        </div>
      </motion.div>

      <motion.div className="flex flex-1 flex-col sm:flex-row">
        {/* Sidebar Toggle */}
        <div className="lg:hidden p-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-3xl text-[#5F9D08] cursor-pointer">
            <FiMenu />
          </button>
        </div>

        {/* Sidebar */}
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
          {/* Tabs */}
          <div className="flex space-x-6 border-b border-gray-300 mb-6">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`pb-2 cursor-pointer ${activeTab === "jobs" ? "border-b-4  border-[#5F9D08] font-semibold" : "text-gray-500"}`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab("internships")}
              className={`pb-2 cursor-pointer ${activeTab === "internships" ? "border-b-4  border-[#5F9D08] font-semibold" : "text-gray-500"}`}
            >
              Internships
            </button>
          </div>

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <>
              <h2 className="text-lg sm:text-2xl font-semibold mb-2">All Jobs</h2>
              <h3 className="text-base sm:text-xl font-semibold text-[#5F9D08] mb-4">Active Jobs</h3>
              {jobsLoading ? (
                <div className="text-center"><p>Loading...</p></div>
              ) : jobsError ? (
                <p className="text-red-500">{jobsError}</p>
              ) : jobs.length === 0 ? (
                <p>No active jobs found.</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map(job => <JobCard key={job._id} {...normalize(job, "job")} activejob={true} />)}
                </div>
              )}
            </>
          )}

          {/* Internships Tab */}
          {activeTab === "internships" && (
            <>
              <h2 className="text-lg sm:text-2xl font-semibold mb-2">All Internships</h2>
              <h3 className="text-base sm:text-xl font-semibold text-[#5F9D08] mb-4">Active Internships</h3>
              {internshipsLoading ? (
                <div className="text-center"><p>Loading...</p></div>
              ) : internshipsError ? (
                <p className="text-red-500">{internshipsError}</p>
              ) : internships.length === 0 ? (
                <p>No active internships found.</p>
              ) : (
                <div className="space-y-4">
                  {internships.map(i => <JobCard key={i._id} {...normalize(i, "internship")} activejob={true} />)}
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
      <ToastContainer position="top-center" theme="colored" />
    </motion.div>
  );
}

export default JobPage;
