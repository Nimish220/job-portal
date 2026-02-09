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
import { axiosInstance } from "../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
          const res = await axiosInstance.get('recruiters/getProfile');
          setUserName(res.data.recruiter.companyName);
        } catch (error) {
          console.error("Error fetching profile:", error);
          if(error.response?.status === 403) {
                toast.error("Session expired. Please login again.");
            }
        }
      }; 
    fetchProfile();
  }, [backend_url]);

  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
          if (selectedFile.type !== "application/pdf") {
              toast.error("Invalid file type. Please upload a PDF.",{position: "top-center",});
              e.target.value = ""; // Clear input
              setFile(null);
              return;
          }
          setFile(selectedFile);
      }
  };
  const fileInputRef = React.useRef(null);
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // This physically clears the browser text
    }
};
 const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("jobRole", jobRole);
    formData.append("jobDescription", jobDescription);
    formData.append("experience", String(experience)|| "0");
    formData.append("ctc", String(ctc));
    formData.append("skillsRequired", skillsRequired);
    formData.append("location", location);
    formData.append("eligibilityCriteria", eligibilityCriteria);
    formData.append("qualifications", qualifications);
    formData.append("requiredDocuments", requiredDocuments);
    formData.append("jobType", selectedJobType);

    if (file) {
        formData.append("file", file); 
    }

    if (!jobRole || !jobDescription || !ctc || !selectedJobType) {
        return toast.error("Please fill in the required fields (Job Role, CTC, and Description)", {
            position: "top-center"
        });
    }
    // Safety Check: CTC should be a positive number for a Job
    if (!ctc || Number(ctc) <= 0) {
        return toast.error("Job CTC must be greater than 0. If this is unpaid, please post as an Internship.", {
            position: "top-center"
        });
    }
    // 1. Sabse pehle Loading Toast dikhayein
    const loadingToast = toast.loading("Uploading documents and posting job...");

    try {
        // 2. AB API call karein (Sirf EK baar)
        const result = await postJob(formData);
        
        if (result.success) {
            // 3. Success hone par update karein
            toast.update(loadingToast, { 
                render: "Job posted successfully!", 
                type: "success", 
                isLoading: false,
                autoClose: 3000 
            });
            resetForm();
            handleRemoveFile();
        } else {
            // 4. Backend error handling
            toast.update(loadingToast, { 
                render: result.message || "Failed to post job", 
                type: "error", 
                isLoading: false,
                autoClose: 3000 
            });
        }
    } catch (error) {
        // 5. Network error handling
        toast.update(loadingToast, { 
            render: "Something went wrong!", 
            type: "error", 
            isLoading: false,
            autoClose: 3000 
        });
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
                  min="0"
                  step="1"
                  value={experience}
                  onWheel={(e) => e.target.blur()} // Stop scroll jumps
                  onChange={(e) => {
                    const val = e.target.value;
                    // Stop negative numbers and resets
                    if (val === "" || (Number(val) >= 0 && !val.startsWith('-'))) {
                        setExperience(val);
                    }
                  }}
                  placeholder="e.g: 2"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">CTC (in LPA)</label>
                <motion.input
                  type="number"
                  min="0.1"
                  step="0.01" // 1. CRITICAL: Allows decimals like 7.5 or 8.2 without rounding/glitching
                  value={ctc}
                  // Stop Mouse Wheel from changing numbers
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => {
                      const val = e.target.value;
                      // 2. Control logic: Only update if it's a positive number or an empty string
                      if (val === "" || (Number(val) >= 0 && !val.startsWith('-'))) {
                          setCtc(val);
                      }
                  }}
                  placeholder="e.g: 10"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5F9D08] outline-none"
                  required
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
                  required
                />
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Eligibility Criteria</label>
                <motion.textarea
                  value={eligibilityCriteria}
                  onChange={(e) => setEligibilityCriteria(e.target.value)}
                  placeholder="e.g., Minimum CGPA 7.5"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
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
                  required
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
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5F9D08] outline-none"
                  required
                />
              </motion.div>
              
              <motion.div variants={formFieldVariants}>
                <label className="block text-gray-700 font-bold">Job Description Document (PDF)</label>
                <input
                  ref={fileInputRef} // Replace 'key' with 'ref'
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full p-2 border border-gray-300 rounded bg-white mt-1"
                  accept="application/pdf"
                />
                {/* NEW: Remove file button */}
                {file && (
                  <div className="flex items-center justify-between mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <span className="text-xs text-gray-600 truncate mr-2">Selected: {file.name}</span>
                    <button 
                      type="button" 
                      onClick={handleRemoveFile} 
                      className="text-xs text-red-500 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div> )}
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
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default PostJob_Job;
