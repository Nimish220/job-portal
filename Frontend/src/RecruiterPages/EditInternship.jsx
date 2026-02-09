import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Added useParams and useNavigate
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '../components/SideBar_Recr';
import AmazonLogo from '../assets/images/AmazonLogo.png';
import { FaHome, FaBell } from 'react-icons/fa';
import ProfileImage from '../assets/images/Profile_pics/1.jpg';
import { axiosInstance } from "../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';

function EditInternship() {
    const { id } = useParams(); // Get Internship ID from URL
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    // Form states
    const [jobDescription, setJobDescription] = useState('');
    const [internshipRole, setInternshipRole] = useState('');
    const [stipendAmount, setStipendAmount] = useState('');
    const [stipendType, setStipendType] = useState('');
    const [skillsRequired, setSkillsRequired] = useState('');
    const [internshipDuration, setInternshipDuration] = useState('1');
    const [internshipType, setInternshipType] = useState('');
    const [location, setLocation] = useState('');
    const [eligibilityCriteria, setEligibilityCriteria] = useState('');
    const [internshipDescriptionDocument, setInternshipDescriptionDocument] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [file, setFile] = useState(null);
    
    const isMobile = screenWidth < 768;

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                toast.error("Invalid file type. Please upload a PDF.");
                e.target.value = ""; // Clear input
                setFile(null);
                return;
            }
            setFile(selectedFile);
        }
    };


    // 1. Fetch Existing Data on Load
    useEffect(() => {
        const fetchInternshipDetails = async () => {
            try {
                // Adjust this endpoint based on your backend route
                const res = await axiosInstance.get('recruiters/myInternships');
                const currentInternship = res.data.internships.find(i => i._id === id);
                
                if (currentInternship) {
                    setInternshipRole(currentInternship.internshipRole || "");
                    setJobDescription(currentInternship.jobDescription || "");
                    setStipendType(currentInternship.stipendType || "");
                    const cleanStipend = String(currentInternship.stipendAmount || "").replace(/[^0-9]/g, ""); // FIX: Strip "K" or other chars so type="number" doesn't crash
                    setStipendAmount(cleanStipend);
                    setSkillsRequired(currentInternship.skillsRequired || "");
                    setInternshipDuration(currentInternship.internshipDuration || "");
                    setInternshipType(currentInternship.internshipType || "");
                    setLocation(currentInternship.location || "");
                    setEligibilityCriteria(currentInternship.eligibilityCriteria || "");

                    // FIX: Map the DB field to your state variable
                    setInternshipDescriptionDocument(currentInternship.internshipDescriptionDocument || "");
                }
                else {
                    // 404 Case: ID exists in URL but not in DB
                    toast.error("Internship not found");
                    navigate("/recruiters/jobs/active");
                }
            } catch (error) {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    // 401/403 Case: Token expired or invalid
                    toast.error("Session expired. Please login again.");
                    navigate("/recruiters/login"); 
                } else {
                    toast.error("Network error. Please try again.");
                }
            }
        };
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('recruiters/getProfile');
                setUserName(res.data.recruiter.companyName);
            } catch (error) { console.error(error); }
        };

        fetchInternshipDetails();
        fetchProfile();
    }, [id, backend_url]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDurationChange = (e) => {
            const val = e.target.value;

            // 1. Allow empty string so user can backspace to type a new number
            if (val === "") {
                setInternshipDuration("");
                return;
            }

            const num = Number(val);

            // 2. ONLY update state if the number is between 1 and 12
            if (num >= 1 && num <= 12) {
                setInternshipDuration(val);
            } 
            // 3. AUTO-CORRECT: If they type 13 or 99, snap it back to 12
            else if (num > 12) {
                setInternshipDuration("12");
                toast.warn("Duration cannot exceed 12 months", { position: "top-center" });
            }
            // 4. PREVENT NEGATIVES: If they type -5, snap it to 1
            else if (num < 1) {
                setInternshipDuration("1");
            }
    };

    // 2. Updated Handle Submit (PUT request)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!internshipRole || !jobDescription || !stipendType || !internshipType) {
            console.log("Missing fields:", { internshipRole, jobDescription, stipendType, internshipType });
            return alert("Please fill in the required fields");
        }
        const loadingToast = toast.loading("Updating internship...");

        const formData = new FormData();
        formData.append("internshipRole", internshipRole);
        formData.append("jobDescription", jobDescription);
        formData.append("stipendType", stipendType);
        formData.append("stipendAmount", stipendAmount);
        formData.append("skillsRequired", skillsRequired);
        formData.append("internshipDuration", internshipDuration);
        formData.append("internshipType", internshipType);
        formData.append("location", location);
        formData.append("eligibilityCriteria", eligibilityCriteria);
        if (file) formData.append("file", file);

        try {
            // Updated to PUT and specific ID route
           const response = await axiosInstance.put(`recruiters/updateInternship/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.status === 401 || response.status === 403) {
                toast.error("Session expired. Please login.");
                navigate("/recruiters/login");
                return;
            }
            if (response.ok) {
                toast.update(loadingToast, { render: "Internship updated successfully!", type: "success", isLoading: false, autoClose: 3000 });
                setTimeout(() => navigate("/recruiters/jobs/active"), 2000);
            } else {
                toast.update(loadingToast, { render: "Update failed", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (error) {
            toast.update(loadingToast, { render: "Something went wrong", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    // Animation Variants
    const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };
    const formFieldVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };
    const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };

        const handleStipendChange = (type) => {
    setStipendType(type);
    if (type === "Unpaid") {
        setStipendAmount("0");
    } else if (stipendAmount === "0") {
        setStipendAmount(""); // Clear the 0 if switching back to paid
    }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#5F9D08] text-white p-4 flex justify-between items-center w-full shadow-md">
                <Link to="/recruiters/jobs/active"><img src={AmazonLogo} alt="Logo" className="w-8 h-8" /></Link>
                <div className="flex items-center space-x-4">
                    <Link to="/recruiters/notifications"><FaBell className="text-2xl cursor-pointer hover:text-gray-300" /></Link>
                    <Link to="/recruiters/jobs/active"><FaHome className="text-2xl cursor-pointer hover:text-gray-300" /></Link>
                    <Link to="/recruiters/getProfile" className="flex items-center gap-2">
                        <div className="rounded-full bg-gray-300 w-8 h-8 overflow-hidden">
                            <img src={ProfileImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm">{userName || 'Loading...'}</span>
                    </Link>
                </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row w-full">
                <div className="lg:hidden p-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-3xl text-[#5F9D08]"><FiMenu /></button>
                </div>
                {!isMobile && <div className="hidden lg:block fixed top-20 left-0 z-30"><Sidebar isOpen={true} isMobile={false} /></div>}
                
                <AnimatePresence>
                    {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />}
                </AnimatePresence>

                <div className="flex-1 flex justify-center lg:mt-8 lg:ml-64 p-4">
                    <motion.div className="w-full max-w-3xl bg-white p-6 rounded shadow-md" initial="hidden" animate="visible" variants={fadeIn}>
                        <h2 className="text-2xl font-semibold mb-6 text-center text-[#5F9D08]">Edit Internship Posting</h2>

                        <motion.form className="space-y-5" onSubmit={handleSubmit} variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Internship Role</label>
                                <input type="text" value={internshipRole} onChange={(e) => setInternshipRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5F9D08] outline-none" required />
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Stipend</label>
                                <div className="flex flex-wrap gap-4 mb-3">
                                    {["Fixed", "Performance Based", "Unpaid"].map((type) => (
                                    <label key={type} className="flex items-center cursor-pointer">
                                        <input
                                        type="radio"
                                        name="stipendType"
                                        value={type}
                                        checked={stipendType === type}
                                        onChange={() => handleStipendChange(type)} // Use helper for stability
                                        className="mr-2 accent-[#5F9D08]"
                                        />
                                        <span className="text-gray-700">{type}</span>
                                    </label>
                                    ))}
                                </div>

                                {/* Controlled and Conditional Input */}
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={stipendAmount}
                                    disabled={stipendType === "Unpaid"}
                                    placeholder={stipendType === "Unpaid" ? "No stipend for unpaid" : "Amount"}
                                    // FIX 1: Stop Mouse Wheel from changing numbers
                                    onWheel={(e) => e.target.blur()}
                                    onChange={(e) => {
                                    const val = e.target.value;
                                    // Strict numeric control to prevent state "jumps"
                                    if (val === "" || (Number(val) >= 0 && !val.startsWith('-'))) {
                                        setStipendAmount(val);
                                    }
                                    }}
                                    className={`w-full p-2 mt-2 border rounded outline-none transition-all ${
                                    stipendType === "Unpaid"
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                        : "border-gray-300 focus:ring-2 focus:ring-[#5F9D08]"
                                    }`}
                                    required={stipendType !== "Unpaid"}
                                />
                                </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Skills Required</label>
                                <input type="text" value={skillsRequired} onChange={(e) => setSkillsRequired(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Internship Type</label>
                                <div className="flex gap-4">
                                    {["Full-Time", "Part-Time"].map((type) => (
                                        <label key={type} className="flex items-center">
                                            <input type="radio" name="internshipType" value={type} checked={internshipType === type} onChange={() => setInternshipType(type)} className="mr-2" /> {type}
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Internship Duration (Months)</label>
                                
                                <div className="flex items-center border border-gray-300 rounded p-2 focus-within:ring-2 focus-within:ring-[#5F9D08] bg-white">
                                    <input
                                        type="number"      // Enables Spin Buttons (▴ and ▾)
                                        min="1"            // ▾ arrow stops at 1
                                        max="12"           // ▴ arrow stops at 12
                                        step="1"           // Arrows move in whole numbers
                                        value={internshipDuration}
                                        onChange={handleDurationChange} // Uses our Step 2 logic
                                        placeholder="1-12"
                                        className="outline-none w-full bg-transparent text-gray-800"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Location</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                            </motion.div>

                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Eligibility Criteria</label>
                                <textarea value={eligibilityCriteria} onChange={(e) => setEligibilityCriteria(e.target.value)} className="w-full p-2 border border-gray-300 rounded h-24" />
                            </motion.div>
                                <motion.div variants={formFieldVariants}>
                                    <label className="block text-gray-700 font-bold">Internship Description Document (PDF)</label>
                                    {/* Inside EditInternship.jsx JSX block */}
                                    {!file && internshipDescriptionDocument && ( // Ensure this matches your state name
                                        <div className="mb-2 p-2 bg-blue-50 rounded border border-blue-200 flex items-center justify-between">
                                            <span className="text-xs text-blue-700 font-medium">Current PDF attached</span>
                                            <a href={internshipDescriptionDocument} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">View</a>
                                        </div>
                                    )}
                                    <input 
                                        ref={fileInputRef} 
                                        type="file" 
                                        onChange={handleFileUpload} 
                                        className="w-full p-2 border border-gray-300 rounded bg-white mt-1 text-sm" 
                                        accept="application/pdf"
                                    />
                                    {file && (
                                        <div className="flex justify-between mt-1 text-xs text-blue-600 font-medium">
                                            <span>Selected: {file.name}</span>
                                            <button type="button" onClick={handleRemoveFile} className="text-red-500 underline">Remove</button>
                                        </div>
                                    )}
                            </motion.div>
                            <motion.div variants={formFieldVariants}>
                                <label className="block text-gray-700 font-bold">Internship Description</label>
                                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded h-32" required />
                            </motion.div>

                            <motion.div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6" variants={formFieldVariants}>
                                <button 
                                    type="submit" 
                                    className="w-full sm:w-1/2 md:w-auto md:min-w-[200px] py-3 px-10 bg-[#5F9D08] text-white rounded-lg font-bold shadow-md hover:bg-[#4f8d07] active:scale-95 transition-all cursor-pointer text-center"
                                >
                                    Update Internship
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => navigate("/recruiters/jobs/active")} 
                                    className="w-full sm:w-1/2 md:w-auto md:min-w-[200px] py-3 px-10 bg-white border-2 border-gray-200 text-gray-600 rounded-lg font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all cursor-pointer text-center"
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </div>
            </div>
            <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        </div>
    );
}

export default EditInternship;