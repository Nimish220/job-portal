import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavSearchBar from '../components/Header/NavSearchBar';
import Sidebar from '../components/SideBar';
import JobCards from '../components/JobCards';
import AppliedJobs from '../components/AppliedJobs';
import useUserStore from '../store/userStore.js';
import { AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const user = useUserStore(state => state.user);
  const appliedJobs = useUserStore(state => state.appliedJobs);
  const getAppliedJobs = useUserStore(state => state.getAppliedJobs);

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Fetch jobs from backend and normalize company field
  useEffect(() => {
  const fetchJobs = async () => {
    try {
      //  FIX: Added /api/v1/ prefix
      const res = await fetch(`${backend_url}/api/v1/jobs`);
      
      if (!res.ok) throw new Error("Server returned 404/500");
      
      const data = await res.json();
      
      // If backend returns data directly as an array:
      const jobList = Array.isArray(data) ? data : data.jobs;
      
      if (jobList) {
        const normalizedJobs = jobList.map(job => ({
          ...job,
          company: job.company || job.recruiter?.companyName || "Unknown Company"
        }));
        setJobs(normalizedJobs);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchJobs();
}, [backend_url]);

  // Fetch applied jobs for current user
  useEffect(() => {
    if (getAppliedJobs) getAppliedJobs();
  }, [getAppliedJobs]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F9D08] mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col md:flex-row">
      <NavSearchBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showHamburger={true} />

      {/* Sidebar */}
      <div className="hidden lg:block mt-20 fixed top-0 left-0 min-h-screen">
        <Sidebar isOpen={true} isMobile={false} />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile />
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col md:flex-row md:mt-20 lg:ml-64">
        <div className="flex-1 pl-4 mt-20 md:mt-5 md:w-3/4">
          <div className="bg-white rounded-xl shadow-sm p-5 mr-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-gray-600">Find your perfect job match from our listings.</p>
          </div>

          {/* Pass jobs and applied jobs */}
          <JobCards jobs={jobs} appliedJobs={appliedJobs.map(j => j._id || j.id)} />
        </div>

        <div className="md:w-1/4">
          <AppliedJobs />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
