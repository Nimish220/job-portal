import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaGraduationCap,
  FaUniversity,
  FaEnvelope,
  FaLocationArrow,
  FaGithub,
  FaFilePdf,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/SideBar_Recr";
import Notifications from "../assets/images/notifications00.png";
import DefaultProfile from "../assets/images/Profile_pics/1.jpg";
import ProfileImage from '../assets/images/Profile_pics/1.jpg';

const ApplicantsProfile = () => {
  const { jobId, applicantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [userName, setUserName] = useState('Guest');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roundDetails, setRoundDetails] = useState("");

  const isMobile = screenWidth < 768;
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Helper to determine if we are looking at an Internship or Job context for STATUS updates
  const getStatusUpdateUrl = () => {
    const isInternship = location.pathname.includes('internshipApplicants');
    const type = isInternship ? 'internship' : 'job';
    return `${backend_url}/api/applications/${type}/${jobId}/candidate/${applicantId}/status`;
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backend_url}/api/recruiters/getProfile`, { withCredentials: true });
      setUserName(res.data.recruiter?.companyName || 'Guest');
    } catch (error) {
      console.error('Error fetching recruiter profile:', error);
    }
  };

  // ✅ SINGLE DYNAMIC USEEFFECT FOR FETCHING APPLICANT DATA
  useEffect(() => {
    fetchProfile();
    const fetchApplicantData = async () => {
      try {
        setLoading(true);
        // 1. Check context from URL
        const isInternship = location.pathname.includes('internshipApplicants');
        const apiType = isInternship ? 'internships' : 'jobs';
        
        // 2. Fetch using dynamic path
        const res = await axios.get(
          `${backend_url}/api/recruiters/${apiType}/${jobId}/candidate/${applicantId}`,
          { withCredentials: true }
        );
        setProfile(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching applicant:", err);
        setError(err.response?.data?.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    if (applicantId && jobId) fetchApplicantData();
  }, [applicantId, jobId, location.pathname]);

  // ApplicantsProfile.jsx -> handleNotify function update
const handleNotify = async () => {
    try {
      // 1. Update the Application Status (Existing logic)
      await axios.put(
        getStatusUpdateUrl(),
        {
          status: "Accepted",
          message: roundDetails || "You have been shortlisted for the next round.",
        },
        { withCredentials: true }
      );

      // 2. Create the Notification for the Seeker
      // ensure you are sending 'applicantId' and 'jobId' exactly as the controller expects
      await axios.post(`${backend_url}/api/recruiters/notify-candidate`, {
        applicantId: applicantId, // from useParams
        jobId: jobId,             // from useParams
        message: roundDetails || `Congratulations! You have been shortlisted for the next round by ${userName}.`
      }, { withCredentials: true });

      setProfile((prev) => ({ ...prev, status: "Accepted" }));
      toast.success("Applicant notified and status updated!");
    } catch (err) {
      console.error("Error notifying applicant:", err);
      toast.error(err.response?.data?.message || "Failed to notify applicant");
    }
};

  const handleReject = async () => {
    try {
      await axios.put(
        getStatusUpdateUrl(),
        {
          status: "Rejected",
          message: "We regret to inform you that your application was not selected.",
        },
        { withCredentials: true }
      );
      setProfile((prev) => ({ ...prev, status: "Rejected" }));
      toast.success("Applicant rejected successfully!");
    } catch (err) {
      console.error("Error rejecting applicant:", err);
      toast.error(err.response?.data?.message || "Failed to reject applicant");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading applicant details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!profile) return <div className="p-8 text-center">No profile data found.</div>;

  const {
    profilePhoto,
    name = "N/A",
    degree = "N/A",
    university = "N/A",
    email = "N/A",
    city = "N/A",
    github = "",
    about = "N/A",
    skills = [],
    experience = "N/A",
    resume = [],
    status = "Pending",
  } = profile;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-100 min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div className="bg-[#5F9D08] sticky top-0 left-0 text-white p-4 flex justify-between items-center w-full shadow-md z-50">
        <div className="font-bold text-xl">Portal Logo</div>
        <div className="flex items-center space-x-4">
          <Link to="/recruiters/notifications">
            <img src={Notifications} alt="Notifications" className="w-8 h-8 sm:w-10 sm:h-10" />
          </Link>
          <Link to="/recruiters/getProfile" className="flex items-center gap-2">
            <div className="rounded-full bg-gray-300 w-8 h-8 overflow-hidden border">
              <img src={ProfileImage} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="hidden sm:inline text-sm">{userName}</span>
          </Link>
        </div>
      </motion.div>

      <div className="flex flex-1">
        <div className="lg:hidden p-4 absolute z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="text-3xl text-[#5F9D08]">
            <FiMenu />
          </button>
        </div>

        {!isMobile && (
          <div className="hidden lg:block fixed top-16 left-0 h-full w-60 z-30">
            <Sidebar isOpen={true} isMobile={false} />
          </div>
        )}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
          )}
        </AnimatePresence>

        <div className="flex-1 p-4 mt-6 lg:ml-64">
          <div className="flex flex-col lg:flex-row gap-6">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full lg:w-2/3 bg-white rounded-md shadow-md p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={profilePhoto || DefaultProfile} alt="Profile" className="w-20 h-20 rounded-full border" />
                <div>
                  <h2 className="text-xl font-bold">{name}</h2>
                  <p className={`px-3 py-1 rounded-md text-sm inline-block mt-1 ${
                    status === "Accepted" ? "bg-green-200 text-green-700" : 
                    status === "Rejected" ? "bg-red-200 text-red-700" : "bg-yellow-200 text-yellow-700"
                  }`}>
                    {status}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700 mb-4">{about}</p>
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.length > 0 ? skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-200 rounded-md text-sm">{skill}</span>
                )) : <span className="text-gray-400 italic">No skills listed</span>}
              </div>
              <h3 className="text-lg font-semibold mb-2">Experience</h3>
              <p className="text-gray-700 mb-4">{experience}</p>
              <h3 className="text-lg font-semibold mb-2">Resume</h3>
              <ul>
                {resume.length > 0 ? resume.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FaFilePdf className="text-red-600" />
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{doc.fileName}</a>
                  </li>
                )) : <p className="text-gray-400">No resume uploaded.</p>}
              </ul>
            </motion.div>

            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full lg:w-1/3 bg-white rounded-md shadow-md p-6 h-fit">
              <div className="space-y-3 mb-6 text-sm text-gray-800">
                <InfoRow icon={<FaGraduationCap />} value={degree} />
                <InfoRow icon={<FaUniversity />} value={university} />
                <InfoRow icon={<FaEnvelope />} value={email} />
                <InfoRow icon={<FaLocationArrow />} value={city} />
                {github && <InfoRow icon={<FaGithub />} value={<a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{github}</a>} />}
              </div>
              <textarea
                placeholder="Enter next round details"
                value={roundDetails}
                onChange={(e) => setRoundDetails(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
                rows="3"
              />
              <button onClick={handleNotify} className="w-full mb-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Notify</button>
              <button onClick={handleReject} className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Reject</button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InfoRow = ({ icon, value }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span>{value}</span>
  </div>
);

export default ApplicantsProfile;