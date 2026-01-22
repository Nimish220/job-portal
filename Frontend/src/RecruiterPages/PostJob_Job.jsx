import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Notifications/Navbar";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/SideBar_Recr";
import { motion, AnimatePresence } from "framer-motion";
import useRecruiterStore from "../store/recruiterStore";
import { FaHome,FaBell } from "react-icons/fa";
import AmazonLogo from '../assets/images/AmazonLogo.png';
import ProfileImage from '../assets/images/Profile_pics/1.jpg';
import axios from "axios";
function PostJob_Job() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const formFieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Form state
  const [jobType, setJobType] = useState("Job");
  const [selectedJobType, setSelectedJobType] = useState("Full-Time");
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [ctc, setCtc] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eligibilityCriteria, setEligibilityCriteria] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [requiredDocuments, setRequiredDocuments] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
   const [userName, setUserName] = useState('');

  const { postJob } = useRecruiterStore();
const isMobile = screenWidth < 768;
useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
const backend_url = import.meta.env.VITE_BACKEND_URL
useEffect(()=>{
  const fetchProfile = async () => {
      try {
        const res = await axios.get(backend_url+'/api/recruiters/getProfile', {
          withCredentials: true
        });
        setUserName(res.data.recruiter.companyName);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = {
      jobType: selectedJobType,
      //jobRole,
      experience,
      jobRole: jobRole,           // Map state 'jobRole' to backend key 'title'
      jobDescription: jobDescription, // Map to 'description' if that's what your model uses
      ctc:String(ctc),
      skillsRequired,
      //jobDescription,
      location,
      eligibilityCriteria,
      qualifications,
      requiredDocuments
    };

    const result = await postJob(jobData);
    if (result.success) {
      resetForm();
      alert("Job posted successfully!");
    }
  };

  const resetForm = () => {
    setJobRole("");
    setExperience("");
    setCtc("");
    setSkillsRequired("");
    setJobDescription("");
    setLocation("");
    setEligibilityCriteria("");
    setQualifications("");
    setRequiredDocuments("");
    setSelectedJobType("Full-Time");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#5F9D08] text-white p-4 flex flex-wrap justify-between items-center w-full shadow-md"
            >
              {/* Left: Home button */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Link to="/recruiters/jobs/active">
                            <img src={AmazonLogo} alt="Amazon Logo" className="w-8 h-8" />
                          </Link>
              </div>
      
              {/* Right: Search + Notifications + Profile */}
              <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                {/* <input
                  type="text"
                  placeholder="Search"
                  className="w-full sm:w-64 p-2 rounded bg-white text-gray-700"
                />
                <img src={Search} alt="Search Icon" className="w-8 h-8" /> */}
                {/* <Link to="/recruiters/notifications">
                  <img src={NotificationsIcon} alt="Notifications" className="w-8 h-8" />
                </Link> */}
                <Link to="/recruiters/notifications">
                                                      <FaBell className="text-2xl w-8 h-8  cursor-pointer hover:text-gray-300" />
                                                    </Link>
                <Link to="/recruiters/jobs/active">
                                      <FaHome className="text-2xl w-8 h-8  cursor-pointer hover:text-gray-300" />
                                    </Link>
                <Link to="/recruiters/getProfile" className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-300 w-6 h-6 sm:w-8 sm:h-8">
                    <img src={ProfileImage} alt="" className="w-full h-full rounded-full" />
                  </div>
                  <span className="text-sm sm:text-base">{userName || 'Loading...'}</span>
                </Link>
              </div>
            </motion.div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row w-full">
        {/* Mobile Hamburger */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-3xl text-[#5F9D08] cursor-pointer"
          >
            <FiMenu />
          </button>
        </div>

        {/* Desktop Sidebar */}
        {!isMobile && (
        <div className="hidden lg:block fixed top-20 left-0 z-30">
          <Sidebar isOpen={true} isMobile={false} />
        </div>
      )}

      {/* Sidebar for mobile (animated) */}
      <AnimatePresence>
        { isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isMobile={true}
          />
        )}
      </AnimatePresence>

        {/* Main Content */}
        <div className={`flex-1 flex justify-center  lg:mt-8 lg:ml-64 p-4`} >
          <motion.div
            className="w-full max-w-3xl bg-white p-4 sm:p-6 rounded shadow-md"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* Page Heading */}
            <motion.h2
              className="text-xl sm:text-2xl font-semibold mb-6 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            >
              Post {jobType}
            </motion.h2>

            {/* Tabs */}
            <motion.div
              className="flex border-b-2 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className={`flex-1 ${jobType === 'Job' ? 'bg-[#5F9D08]' : 'hover:bg-gray-100'} rounded-t-md transition-colors duration-300`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => setJobType('Job')}
                  className={`w-full py-3 text-center font-semibold ${jobType === 'Job' ? 'text-white' : 'text-gray-600'}`}
                >
                  Job
                </button>
              </motion.div>
              <motion.div
                className={`flex-1 ${jobType === 'Internship' ? 'bg-[#5F9D08]' : 'hover:bg-gray-100'} rounded-t-md transition-colors duration-300`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/recruiters/postInternship"
                  className={`block w-full py-3 text-center font-semibold ${jobType === 'Internship' ? 'text-white' : 'text-gray-600'}`}
                >
                  Internship
                </Link>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.form
              className="space-y-5"
              onSubmit={handleSubmit}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Job Role</label>
                <motion.input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Experience (Years)</label>
                <motion.input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 2"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">CTC (in LPA)</label>
                <motion.input
                  type="number"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Skills Required</label>
                <motion.input
                  type="text"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  placeholder="e.g., JavaScript, Node.js"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Qualifications</label>
                <motion.input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g., B.Tech"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Eligibility Criteria</label>
                <motion.textarea
                  value={eligibilityCriteria}
                  onChange={(e) => setEligibilityCriteria(e.target.value)}
                  placeholder="e.g., Minimum CGPA 7.5"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Required Documents</label>
                <motion.input
                  type="text"
                  value={requiredDocuments}
                  onChange={(e) => setRequiredDocuments(e.target.value)}
                  placeholder="e.g., Resume, Cover Letter"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Job Type</label>
                <motion.div className="flex gap-4 mt-2">
                  {["Full-Time", "Part-Time"].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="jobType"
                        value={type}
                        checked={selectedJobType === type}
                        onChange={() => setSelectedJobType(type)}
                        className="accent-[#5F9D08]"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Location</label>
                <motion.input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Remote, Bangalore"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Job Description</label>
                <motion.textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Brief job description"
                  className="w-full p-2 border border-gray-300 rounded h-28 resize-none"
                  required
                />
              </motion.div>

              <motion.div
                className="flex justify-center pt-4"
                variants={formFieldVariants}
              >
                <motion.button
                  type="submit"
                  className="w-full sm:w-auto py-2 px-6 bg-[#5F9D08] text-white rounded-lg hover:bg-[#4f8d07]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Post Job
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PostJob_Job;
