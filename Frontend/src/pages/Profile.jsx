import UserNavbar from '../components/Header/UserNavbar';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiEdit, FiMail, FiMapPin, FiGithub, FiBriefcase,
  FiUser, FiLock, FiLogOut,FiX
} from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaGlobe,FaCheckCircle } from 'react-icons/fa';
import { AnimatePresence,motion } from 'framer-motion';
import NavSearchBar from '../components/Header/NavSearchBar';
import { axiosInstance } from '../utils/axiosInstance';
import useUserStore from '../store/userStore.js';

const Profile = () => {
  const { setUser,user } = useUserStore(); 
  const [profileData, setProfileData] = useState({
    name: '',
    degree: '',
    university: '',
    email: '',
    city: '',
    github: '',
    about: '',
    skills: [],
    profilePhoto: null,
    experience: '',
    currentStatus: 'Pending' 
  });

  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editedSkills, setEditedSkills] = useState([]);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAbout, setEditedAbout] = useState('');
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [editedExperience, setEditedExperience] = useState('');

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const backend_url = `${base}/api`; 

  useEffect(() => {
  if (showPopup) {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [showPopup]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Profile Data
        const profileRes = await axiosInstance.get('/users/profile');

        if (profileRes.data.success && profileRes.data.user) {
          const user = profileRes.data.user;
          
          // 2. Fetch Application Status safely
          // NOTE: If this still gives 404, check your applicationRoutes.js for the correct "GET" path
          let latestStatus = "Pending";
          try {
            // Updated to common route naming convention; check your backend!
            const appRes = await axiosInstance.get('/applications/my-applications');
            if (appRes.data.success && appRes.data.applications?.length > 0) {
              latestStatus = appRes.data.applications[0].status;
            }
          } catch (appErr) {
            console.warn("Application status route not found or unreachable.");
          }

          const updatedData = {
            ...user,
            name: user.name || '',
            degree: user.degree || '',
            university: user.university || '',
            email: user.email || '',
            city: user.city || '', 
            github: user.github || '',
            about: user.about || '',
            skills: user.skills || [],
            profilePhoto: user.profilePhoto || null,
            experience: user.experience || '',
            currentStatus: latestStatus 
          };

          setProfileData(updatedData);
          if (setUser) setUser(user);

          setEditedAbout(user.about || '');
          setEditedExperience(user.experience || '');
          setEditedSkills(user.skills || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [backend_url, setUser]);

 const updateProfileField = async (payload, setEditMode) => {
    try {
      const res = await axiosInstance.put('/users/edit-profile', payload);
      
      if (res.data.success) {
        setProfileData(prev => ({ ...prev, ...payload }));
        if (setUser && res.data.user) setUser({ ...res.data.user });
        setEditMode(false);
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Update Error:", err);
    }
};
  const handleSkillsSave = () => updateProfileField({ skills: editedSkills }, setIsEditingSkills);
  const handleExperienceSave = () => updateProfileField({ experience: editedExperience }, setIsEditingExperience);
  const handleAboutSave = () => updateProfileField({ about: editedAbout }, setIsEditingAbout);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5F9D08]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-50 font-sans">
                {/* --- CENTERED TOAST POPUP --- */}
          <AnimatePresence>
            {showPopup && (
              <div className="fixed top-10 left-0 right-0 z-[999] flex justify-center px-4 pointer-events-none">
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  className="pointer-events-auto flex items-center gap-3 bg-white border-l-8 border-[#5F9D08] px-8 py-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] min-w-[320px]"
                >
                  {/* Success Icon */}
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-[#5F9D08] text-2xl flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-bold text-lg">Updated successfully!</p>
                  </div>
                  {/* Close Button */}
                  <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600 transition">
                    <FiX size={20} />
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
      <NavSearchBar toggleSidebar={() => {}} showHamburger={true} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}
          <motion.div
            className="w-full lg:w-1/3 xl:w-1/4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-lg">
              <div className="bg-gradient-to-r from-[#5F9D08] to-[#4A8B07] h-32 rounded-t-3xl relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 overflow-hidden flex items-center justify-center">
                    {/* Check user from store first, then fallback to local state */}
                    {(user?.profilePhoto || profileData.profilePhoto) ? (
                      <img 
                        src={`${user?.profilePhoto || profileData.profilePhoto}?t=${new Date().getTime()}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.style.display = 'none'; }} 
                      />
                    ) : (
                      <div className="text-2xl text-[#5F9D08] font-bold">
                        {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">{profileData.name}</h2>
                
                {/*  Shortlist Status Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                  profileData.currentStatus === 'Accepted' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {profileData.currentStatus === 'Accepted' ? 'Shortlisted' : 'Application Pending'}
                </div>

                <p className="text-[#5F9D08] font-medium text-sm">{profileData.degree || "No Degree Listed"}</p>
                <p className="text-gray-500 text-sm mt-1">{profileData.university || "No University Listed"}</p>

                <div className="mt-6 bg-gray-100 p-4 rounded-xl text-left space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FiMail className="mt-1 flex-shrink-0" /> <span className="text-sm break-all">{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FiMapPin className="mt-1 flex-shrink-0" /> <span className="text-sm">{profileData.city || "Add Location"}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FiGithub className="mt-1 flex-shrink-0" /> <span className="text-sm break-all">{profileData.github || "Add GitHub"}</span>
                  </div>
                </div>

                <nav className="mt-6 space-y-2">
                  <Link to='/users/edit-profile' className="flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-[#5F9D08] hover:bg-[#4e7c07] rounded-xl transition shadow-md hover:shadow-lg mt-4">
                      <FiUser className="mr-2" /> Edit Profile
                  </Link>
                </nav>
              </div>
            </div>
          </motion.div>

          {/* Main Section */}
          <div className="flex-1">
            <Section title="About Me" icon={FiEdit} isEditing={isEditingAbout} onEdit={() => setIsEditingAbout(true)} onSave={handleAboutSave}>
              {isEditingAbout ? (
                <textarea className="w-full p-2 border rounded text-gray-700 focus:ring-2 focus:ring-[#5F9D08] outline-none" rows={4} value={editedAbout} onChange={(e) => setEditedAbout(e.target.value)} />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profileData.about || "No info provided."}</p>
              )}
            </Section>

            <Section title="Skills" icon={FiEdit} isEditing={isEditingSkills} onEdit={() => setIsEditingSkills(true)} onSave={handleSkillsSave}>
              <div className="flex flex-wrap gap-3">
                {isEditingSkills ? (
                  <div className="w-full flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter skills separated by commas"
                      className="border p-2 rounded w-full"
                      value={Array.isArray(editedSkills) ? editedSkills.join(', ') : ''} 
                      onChange={(e) => setEditedSkills(e.target.value.split(',').map(s => s.trim()))}
                    />
                    <p className="text-xs text-gray-500">Example: React, Node, CSS</p>
                  </div>
                ) : (
                  profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, i) => (
                      <span key={i} className="bg-green-100 text-[#5F9D08] px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))
                  ) : <span className="text-gray-400">No skills added.</span>
                )}
              </div>
            </Section>

            <Section title="Experience" icon={FiEdit} isEditing={isEditingExperience} onEdit={() => setIsEditingExperience(true)} onSave={handleExperienceSave}>
              {isEditingExperience ? (
                <textarea className="w-full p-2 border rounded text-gray-700 focus:ring-2 focus:ring-[#5F9D08] outline-none" rows={4} value={editedExperience} onChange={(e) => setEditedExperience(e.target.value)} />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">{profileData.experience || "No experience added yet."}</p>
              )}
            </Section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Section = ({ title, icon: Icon, children, isEditing, onEdit, onSave }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-[#5F9D08] pl-4">{title}</h2>
      {isEditing ? (
        <button onClick={onSave} className="text-white bg-[#5F9D08] px-4 py-1 rounded-full text-sm font-bold hover:bg-[#4e7c07] transition">Save</button>
      ) : (
        <button onClick={onEdit} className="text-[#5F9D08] p-2 hover:bg-green-100 rounded-full transition"><Icon /></button>
      )}
    </div>
    <div className="bg-gray-50 p-4 rounded-xl">{children}</div>
  </div>
);

export default Profile;