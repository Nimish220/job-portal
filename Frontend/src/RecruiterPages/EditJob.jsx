import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/SideBar_Recr";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBell } from "react-icons/fa";
import AmazonLogo from '../assets/images/AmazonLogo.png';
import ProfileImage from '../assets/images/Profile_pics/1.jpg';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const fileInputRef = useRef(null);

    const [userName, setUserName] = useState(""); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const isMobile = screenWidth < 768;

    const [file, setFile] = useState(null);
    const [jobDescriptionDocument, setJobDescriptionDocument] = useState("");

    // --- FORM STATES ---
    const [jobRole, setJobRole] = useState("");
    const [experience, setExperience] = useState("");
    const [ctc, setCtc] = useState("");
    const [skillsRequired, setSkillsRequired] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eligibilityCriteria, setEligibilityCriteria] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [requiredDocuments, setRequiredDocuments] = useState("");
    const [selectedJobType, setSelectedJobType] = useState("Full-Time");
    

    // --- ANIMATION VARIANTS ---
    const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };
    const formFieldVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };
    const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };

    // --- HELPER FUNCTIONS ---
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobRes = await axios.get(`${backend_url}/api/recruiters/jobs/${id}`, { withCredentials: true });
                const data = jobRes.data;
                setJobRole(data.jobRole || "");
                setExperience(data.experience || "");
                setCtc(data.ctc || "");
                setSkillsRequired(data.skillsRequired || "");
                setJobDescription(data.jobDescription || "");
                setLocation(data.location || "");
                setEligibilityCriteria(data.eligibilityCriteria || "");
                setQualifications(data.qualifications || "");
                setRequiredDocuments(data.requiredDocuments || "");
                setSelectedJobType(data.jobType || "Full-Time");
                setJobDescriptionDocument(data.jobDescriptionDocument || "");
                const profileRes = await axios.get(`${backend_url}/api/recruiters/getProfile`, { withCredentials: true });
                setUserName(profileRes.data.recruiter.companyName);
            } catch (error) {
                toast.error("Failed to load details");
            }
        };
        fetchData();
    }, [id, backend_url]);

    // --- SUBMIT LOGIC ---
    const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating details and document...");

    // Create the container for binary data
    const formData = new FormData();
    
    // Append all text fields
    formData.append("jobRole", jobRole);
    formData.append("experience", experience);
    formData.append("ctc", ctc);
    formData.append("skillsRequired", skillsRequired);
    formData.append("jobDescription", jobDescription);
    formData.append("location", location);
    formData.append("eligibilityCriteria", eligibilityCriteria);
    formData.append("qualifications", qualifications);
    formData.append("requiredDocuments", requiredDocuments);
    formData.append("jobType", selectedJobType);

    // Append the file only if a new one was selected
    if (file) {
        formData.append("file", file); 
    }

    try {
        await axios.put(`${backend_url}/api/recruiters/updateJob/${id}`, formData, { 
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" } // REQUIRED for files
        });
        toast.update(loadingToast, { render: "Updated successfully!", type: "success", isLoading: false, autoClose: 3000 });
        setTimeout(() => navigate("/recruiters/jobs/active"), 1500);
    } catch (error) {
        toast.update(loadingToast, { render: "Update failed", type: "error", isLoading: false, autoClose: 3000 });
    }
};

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#5F9D08] text-white p-4 flex justify-between items-center w-full shadow-md">
                <Link to="/recruiters/jobs/active"><img src={AmazonLogo} alt="Logo" className="w-8 h-8" /></Link>
                <div className="flex items-center gap-4">
                    <Link to="/recruiters/notifications"><FaBell className="text-2xl cursor-pointer" /></Link>
                    <Link to="/recruiters/jobs/active"><FaHome className="text-2xl cursor-pointer" /></Link>
                    <div className="flex items-center gap-2">
                        <div className="rounded-full bg-gray-300 w-8 h-8 overflow-hidden"><img src={ProfileImage} alt="" className="w-full h-full" /></div>
                        <span className="text-sm">{userName || 'Loading...'}</span>
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row w-full">
                <div className="lg:hidden p-4"><button onClick={() => setIsSidebarOpen(true)} className="text-3xl text-[#5F9D08] cursor-pointer"><FiMenu /></button></div>
                {!isMobile && <div className="hidden lg:block fixed top-20 left-0 z-30"><Sidebar isOpen={true} isMobile={false} /></div>}
                <AnimatePresence>{isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />}</AnimatePresence>

                <div className="flex-1 flex justify-center lg:mt-8 lg:ml-64 p-4">
                    <motion.div className="w-full max-w-3xl bg-white p-6 rounded shadow-md" initial="hidden" animate="visible" variants={fadeIn}>
                        <h2 className="text-2xl font-bold mb-8 text-center text-[#5F9D08]">Edit Job Posting</h2>

                        <motion.form className="space-y-5" onSubmit={handleSubmit} variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Job Role</label>
                                <input type="text" value={jobRole} onChange={(e) => setJobRole(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" required />
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div variants={formFieldVariants}>
                                    <label className="block text-gray-700 font-bold">Experience (Years)</label>
                                    <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                                </motion.div>
                                <motion.div variants={formFieldVariants}>
                                    <label className="block text-gray-700 font-bold">CTC (in LPA)</label>
                                    <input type="number" value={ctc} onChange={(e) => setCtc(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                                </motion.div>
                            </div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Skills Required</label>
                                <input type="text" value={skillsRequired} onChange={(e) => setSkillsRequired(e.target.value)} placeholder="e.g., JavaScript, Node.js" className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Qualifications</label>
                                <input type="text" value={qualifications} onChange={(e) => setQualifications(e.target.value)} placeholder="e.g., B.Tech" className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Eligibility Criteria</label>
                                <textarea value={eligibilityCriteria} onChange={(e) => setEligibilityCriteria(e.target.value)} placeholder="e.g., Minimum CGPA 7.5" className="w-full p-2 border rounded h-20 focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Job Description Document (PDF/Image)</label>
                                    {!file && jobDescriptionDocument && (
                                        <div className="mb-2 p-2 bg-blue-50 rounded border border-blue-200 flex items-center justify-between">
                                            <span className="text-xs text-blue-700 font-medium">Current Document attached</span>
                                            <a href={jobDescriptionDocument} target="_blank" className="text-xs text-blue-600 underline">View</a>
                                        </div>
                                    )}
                                <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="w-full p-2 border border-gray-300 rounded bg-white mt-1" accept=".pdf,.docx,image/*" />
                                {file && (
                                    <div className="flex justify-between mt-1 text-xs text-blue-600 font-medium">
                                        <span>Selected: {file.name}</span>
                                        <button type="button" onClick={handleRemoveFile} className="text-red-500 underline">Remove</button>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Required Documents</label>
                                <input type="text" value={requiredDocuments} onChange={(e) => setRequiredDocuments(e.target.value)} placeholder="e.g., Resume, Cover Letter" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Job Type</label>
                                <div className="flex gap-4">
                                    {["Full-Time", "Part-Time"].map((type) => (
                                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                            <input type="radio" name="jobType" checked={selectedJobType === type} onChange={() => setSelectedJobType(type)} className="accent-[#5F9D08]" />
                                            <span className="text-gray-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Location</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Remote, Bangalore" className="w-full p-2 border rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" />
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Job Description</label>
                                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Brief job description" className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-[#5F9D08] outline-none resize-none" required />
                            </motion.div>

                                                        <motion.div 
                                className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6" 
                                variants={formFieldVariants}
                            >
                                {/* Update Button */}
                                <button 
                                    type="submit" 
                                    className="w-full sm:w-1/2 md:w-auto md:min-w-[200px] py-3 px-10 bg-[#5F9D08] text-white rounded-lg font-bold shadow-md hover:bg-[#4f8d07] active:scale-95 transition-all cursor-pointer text-center"
                                >
                                    Update Job Posting
                                </button>

                                {/* Cancel Button */}
                                <button 
                                    type="button" 
                                    onClick={() => navigate("/recruiters/jobs/active")} 
                                    className="w-full sm:w-1/2 md:w-auto md:min-w-[200px] py-3 px-10 bg-white border-2 border-gray-200 text-gray-600 rounded-lg font-bold shadow-sm hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all cursor-pointer text-center"
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default EditJob;