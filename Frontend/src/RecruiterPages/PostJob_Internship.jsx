import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Notifications/Navbar';
import { AnimatePresence } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '../components/SideBar_Recr';
import AmazonLogo from '../assets/images/AmazonLogo.png';
import { FaHome,FaBell } from 'react-icons/fa';
import ProfileImage from '../assets/images/Profile_pics/1.jpg';
import axios from 'axios';
function PostJob_Internship() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 80,
        damping: 12
      }
    }
  };

  const formFieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
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
  const [jobType, setJobType] = useState('Internship');
  const [internshipRole, setInternshipRole] = useState('');
  const [stipendAmount, setStipendAmount] = useState('');
  const [stipendType, setStipendType] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [internshipDuration, setInternshipDuration] = useState('');
  const [internshipType, setInternshipType] = useState('');
  const [location, setLocation] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const [userName, setUserName] = useState('');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth < 768;
  useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
  const handleFileUpload = (e) => {
    // File upload handling logic
    console.log('Files selected:', e.target.files);
    // You can add more logic here to handle the file upload
  };
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
    try {
      const internshipData = {
        jobType, // should be 'Internship'
        internshipRole,
        stipendType,
        stipendAmount,
        skillsRequired,
        internshipDuration,
        internshipType,
        location,
        eligibilityCriteria
      };

    const response = await fetch(backend_url + "/api/recruiters/postInternship", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(internshipData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Internship posted successfully!");
      resetForm();
    } else {
      console.error("Server error:", data.message);
      alert("Failed to post internship. Check the console for details.");
    }
  } catch (error) {
    console.error("Error submitting internship:", error);
    alert("Something went wrong while posting the internship.");
  }
};

const resetForm = () => {
  setInternshipRole("");
  setStipendAmount("");
  setStipendType("");
  setSkillsRequired("");
  setInternshipDuration("");
  setInternshipType("");
  setLocation("");
  setEligibilityCriteria([]);
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

      {/* Page Layout */}
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

        {/* Sidebar for desktop */}
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
        <div className="flex-1 flex justify-center lg:mt-8 lg:ml-64 p-4">
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

            {/* Job Type Tabs */}
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
                <Link
                  to="/recruiters/postJob"
                  onClick={() => setJobType('Job')}
                  className={`block w-full py-3 text-center font-semibold ${jobType === 'Job' ? 'text-white' : 'text-gray-600'}`}
                >
                  Job
                </Link>
              </motion.div>
              <motion.div
                className={`flex-1 ${jobType === 'Internship' ? 'bg-[#5F9D08]' : 'hover:bg-gray-100'} rounded-t-md transition-colors duration-300`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => setJobType('Internship')}
                  className={`w-full py-3 text-center font-semibold ${jobType === 'Internship' ? 'text-white' : 'text-gray-600'}`}
                >
                  Internship
                </button>
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
              {/* Form Fields (reuse your existing motion.divs) */}
              {/* Example for Internship Role */}
              
              <motion.div variants={formFieldVariants}>
            <label className="block text-gray-700 font-bold">Internship Role</label>
            <motion.input
              type="text"
              value={internshipRole}
              onChange={(e) => setInternshipRole(e.target.value)}
              placeholder="e.g., Software Developer"
              className="w-full p-2 border border-gray-300 rounded"
              required
              whileFocus={{ borderColor: '#5F9D08', boxShadow: '0 0 0 2px rgba(95, 157, 8, 0.2)' }}
            />
          </motion.div>

          {/* Stipend */}
          <motion.div variants={formFieldVariants}>
            <label className="block text-gray-700 font-bold">Stipend</label>
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                }
              }}
            >
              <motion.label 
                className="flex items-center"
                variants={{ hidden: { opacity: 0, x: -5 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="stipendType"
                  value="Fixed"
                  onChange={() => setStipendType('Fixed')}
                  className="mr-2"
                />{' '}
                Fixed
              </motion.label>
              <motion.label 
                className="flex items-center"
                variants={{ hidden: { opacity: 0, x: -5 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="stipendType"
                  value="Performance Based"
                  onChange={() => setStipendType('Performance Based')}
                  className="mr-2"
                />{' '}
                Performance Based
              </motion.label>
              <motion.label 
                className="flex items-center"
                variants={{ hidden: { opacity: 0, x: -5 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="stipendType"
                  value="Unpaid"
                  onChange={() => setStipendType('Unpaid')}
                  className="mr-2"
                />{' '}
                Unpaid
              </motion.label>
            </motion.div>
            <motion.div 
              className="mt-2"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              <motion.input
                type="number"
                value={stipendAmount}
                onChange={(e) => setStipendAmount(e.target.value)}
                placeholder="Enter Amount"
                className="w-full p-2 border border-gray-300 rounded"
                required
                whileFocus={{ borderColor: '#5F9D08', boxShadow: '0 0 0 2px rgba(95, 157, 8, 0.2)' }}
              />
            </motion.div>
          </motion.div>

          {/* Skills Required */}
          <motion.div variants={formFieldVariants}>
            <label className="block text-gray-700 font-bold">Skills Required</label>
            <motion.input
              type="text"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              placeholder="e.g., Java, SQL, DSA"
              className="w-full p-2 border border-gray-300 rounded"
              whileFocus={{ borderColor: '#5F9D08', boxShadow: '0 0 0 2px rgba(95, 157, 8, 0.2)' }}
            />
          </motion.div>

          {/* Internship Type */}
          <motion.div variants={formFieldVariants}>
            <label className="block text-gray-700 font-bold">Internship Type</label>
            <motion.div 
              className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                }
              }}
            >
              <motion.label 
                className="flex items-center"
                variants={{ hidden: { opacity: 0, x: -5 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="internshipType"
                  value="Full-Time"
                  onChange={() => setInternshipType('Full-Time')}
                  className="mr-2"
                />{' '}
                Full-Time
              </motion.label>
              <motion.label 
                className="flex items-center"
                variants={{ hidden: { opacity: 0, x: -5 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="internshipType"
                  value="Part-Time"
                  onChange={() => setInternshipType('Part-Time')}
                  className="mr-2"
                />{' '}
                Part-Time
              </motion.label>
            </motion.div>
          </motion.div>

          {/* Internship Duration */}
          <motion.div className="flex items-center space-x-4" variants={formFieldVariants}>
            <motion.div className="flex-1">
              <label className="block text-gray-700 font-bold">Internship Duration</label>
              <motion.input
                type="text"
                value={internshipDuration}
                onChange={(e) => setInternshipDuration(e.target.value)}
                placeholder="e.g., 3"
                className="w-full p-2 border border-gray-300 rounded"
                required
                whileFocus={{ borderColor: '#5F9D08', boxShadow: '0 0 0 2px rgba(95, 157, 8, 0.2)' }}
              />
              <motion.span 
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                months
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Location */}
          <motion.div variants={formFieldVariants}>
            <label className="block text-gray-700 font-bold">Location</label>
            <motion.input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Remote, Pune"
              className="w-full p-2 border border-gray-300 rounded"
              whileFocus={{ borderColor: '#5F9D08', boxShadow: '0 0 0 2px rgba(95, 157, 8, 0.2)' }}
            />
          </motion.div>

          {/* Attach Document */}
          <motion.div variants={formFieldVariants}>
            <label className="block text-gray-700 font-bold">Attach Document</label>
            <motion.input
              type="file"
              onChange={handleFileUpload}
              className="w-full p-2 border border-gray-300 rounded"
              multiple
              whileHover={{ backgroundColor: '#f9fafb' }}
            />
          </motion.div>

          {/* Eligibility Criteria */}
          <motion.div variants={formFieldVariants}>
            <label className="block text-gray-700 font-bold">Eligibility Criteria</label>
            <motion.textarea
              value={eligibilityCriteria}
              onChange={(e) => setEligibilityCriteria(e.target.value)}
              placeholder="Enter eligibility criteria separated by commas"
              className="w-full p-2 border border-gray-300 rounded"
              whileFocus={{ borderColor: '#5F9D08', boxShadow: '0 0 0 2px rgba(95, 157, 8, 0.2)' }}
            />
          </motion.div>

              {/* ...other fields (stipend, skills, type, duration, etc.) — already good */}

              {/* Submit Button */}
              <motion.div
                className="flex justify-center pt-4"
                variants={formFieldVariants}
              >
                <motion.button
                  type="submit"
                  className="w-full sm:w-auto py-2 px-6 bg-[#5F9D08] text-white rounded-lg hover:bg-[#4f8d07]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  Post Internship
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PostJob_Internship;



