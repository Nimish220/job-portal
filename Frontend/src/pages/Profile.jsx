import UserNavbar from '../components/Header/UserNavbar';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiEdit, FiMail, FiMapPin, FiGithub, FiBriefcase,
  FiUser, FiLock, FiLogOut
} from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';
import NavSearchBar from '../components/Header/NavSearchBar';
import axios from 'axios';

const Profile = () => {
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
    experience: ''
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editedSkills, setEditedSkills] = useState([]);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAbout, setEditedAbout] = useState('');
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [editedExperience, setEditedExperience] = useState('');

  const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  //  FIXED: Corrected API path and Data Mapping
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backend_url}/users/profile`, {
          withCredentials: true 
        });

        const data = res.data;
        if (data.success && data.user) {
          const user = data.user;
          setProfileData({
            name: user.name || '',
            degree: user.degree || '',
            university: user.university || '',
            email: user.email || '',
            city: user.city || '', //  Matches your console log
            github: user.github || '',
            about: user.about || '',
            skills: user.skills || [],
            profilePhoto: user.profilePhoto || null,
            experience: user.experience || '', //  Matches your console log
          });

          setEditedAbout(user.about || '');
          setEditedExperience(user.experience || '');
          setEditedSkills(user.skills || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [backend_url]);

  const handlePhotoUpload = (e) => {
    setProfilePhoto(URL.createObjectURL(e.target.files[0]));
  };

  const handleSkillsEdit = () => {
    setIsEditingSkills(true);
    setEditedSkills(profileData.skills);
  };

  const handleSkillsSave = async () => {
    try {
      const res = await axios.put(`${backend_url}/users/edit-profile`,
        { skills: editedSkills },
        { withCredentials: true }
      );
      if (res.data.success) {
        setProfileData(prev => ({ ...prev, skills: editedSkills }));
        setIsEditingSkills(false);
      }
    } catch (err) {
      console.error("handleSkillsSave Error:", err);
    }
  };

  const handleExperienceSave = async () => {
    try {
      const res = await axios.put(`${backend_url}/users/edit-profile`,
        { experience: editedExperience },
        { withCredentials: true }
      );
      if (res.data.success) {
        setProfileData(prev => ({ ...prev, experience: editedExperience }));
        setIsEditingExperience(false);
      }
    } catch (err) {
      console.error("Failed to save experience:", err);
    }
  };

  const handleAboutSave = async () => {
    try {
      const res = await axios.put(`${backend_url}/users/edit-profile`,
        { about: editedAbout },
        { withCredentials: true }
      );
      if (res.data.success) {
        setProfileData(prev => ({ ...prev, about: editedAbout }));
        setIsEditingAbout(false);
      }
    } catch (err) {
      console.error("Failed to save about:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-50 font-sans">
      <NavSearchBar
        toggleSidebar={() => {}}
        showHamburger={true}
      />

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
                  <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-2xl text-[#5F9D08] font-bold">
                        {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">{profileData.name}</h2>
                <p className="text-[#5F9D08] font-medium text-sm">{profileData.degree}</p>
                <p className="text-gray-500 text-sm mt-1">{profileData.university}</p>

                <div className="mt-6 bg-gray-100 p-4 rounded-xl text-left space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FiMail /> <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FiMapPin /> <span className="text-sm">{profileData.city}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FiGithub /> <span className="text-sm truncate">{profileData.github}</span>
                  </div>
                </div>

                <nav className="mt-6 space-y-2">
                  <Link to='/users/edit-profile' className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100 rounded-lg">
                    <FiUser className="mr-2 text-[#5F9D08]" /> Edit Profile
                  </Link>
                </nav>
              </div>
            </div>
          </motion.div>

          {/* Main Section */}
          <div className="flex-1">
            <Section title="About Me" icon={FiEdit} isEditing={isEditingAbout} onEdit={() => setIsEditingAbout(true)} onSave={handleAboutSave}>
              {isEditingAbout ? (
                <textarea className="w-full p-2 border rounded text-gray-700" rows={4} value={editedAbout} onChange={(e) => setEditedAbout(e.target.value)} />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profileData.about || "No info provided."}</p>
              )}
            </Section>

            <Section title="Skills" icon={FiEdit} isEditing={isEditingSkills} onEdit={handleSkillsEdit} onSave={handleSkillsSave}>
              <div className="flex flex-wrap gap-3">
                {isEditingSkills ? (
                  editedSkills.map((skill, index) => (
                    <input key={index} value={skill} onChange={(e) => {
                      const updated = [...editedSkills];
                      updated[index] = e.target.value;
                      setEditedSkills(updated);
                    }} className="border px-2 py-1 rounded-full text-sm w-24" />
                  ))
                ) : (
                  profileData.skills.map((skill, i) => (
                    <span key={i} className="bg-green-100 text-[#5F9D08] px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </Section>

            <Section title="Experience" icon={FiEdit} isEditing={isEditingExperience} onEdit={() => setIsEditingExperience(true)} onSave={handleExperienceSave}>
              {isEditingExperience ? (
                <textarea className="w-full p-2 border rounded text-gray-700" rows={4} value={editedExperience} onChange={(e) => setEditedExperience(e.target.value)} />
              ) : (
                <p className="text-gray-700">{profileData.experience || "No experience added yet."}</p>
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
        <button onClick={onSave} className="text-white bg-[#5F9D08] px-3 py-1 rounded-full text-sm">Save</button>
      ) : (
        <button onClick={onEdit} className="text-[#5F9D08] p-2 hover:bg-green-100 rounded-full"><Icon /></button>
      )}
    </div>
    <div className="bg-gray-50 p-4 rounded-xl">{children}</div>
  </div>
);

export default Profile;